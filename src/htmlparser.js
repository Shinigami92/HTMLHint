/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export class HTMLParser {
    constructor() {
        this._listeners = {};
        this._mapCdataTags = this.makeMap('script,style');
        this._arrBlocks = [];
        this.lastEvent = null;
    }

    makeMap(str) {
        var obj = {},
            items = str.split(',');
        for (var i = 0; i < items.length; i++) {
            obj[items[i]] = true;
        }
        return obj;
    }

    // parse html code
    parse(html) {
        var mapCdataTags = this._mapCdataTags;

        var regTag = /<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[^\s"'>/=\x00-\x0F\x7F\x80-\x9F]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g,
            regAttr = /\s*([^\s"'>/=\x00-\x0F\x7F\x80-\x9F]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g,
            regLine = /\r?\n/g;

        var match,
            matchIndex,
            lastIndex = 0,
            tagName,
            arrAttrs,
            tagCDATA,
            attrsCDATA,
            arrCDATA,
            lastCDATAIndex = 0,
            text;
        var lastLineIndex = 0,
            line = 1;
        var arrBlocks = this._arrBlocks;

        //存储区块
        var saveBlock = (type, raw, pos, data) => {
            var col = pos - lastLineIndex + 1;
            if (data === undefined) {
                data = {};
            }
            data.raw = raw;
            data.pos = pos;
            data.line = line;
            data.col = col;
            arrBlocks.push(data);
            this.fire(type, data);
            while (regLine.exec(raw)) {
                line++;
                lastLineIndex = pos + regLine.lastIndex;
            }
        };

        this.fire('start', {
            pos: 0,
            line: 1,
            col: 1
        });

        while ((match = regTag.exec(html))) {
            matchIndex = match.index;
            if (matchIndex > lastIndex) {
                //保存前面的文本或者CDATA
                text = html.substring(lastIndex, matchIndex);
                if (tagCDATA) {
                    arrCDATA.push(text);
                } else {
                    //文本
                    saveBlock('text', text, lastIndex);
                }
            }
            lastIndex = regTag.lastIndex;

            if ((tagName = match[1])) {
                if (tagCDATA && tagName === tagCDATA) {
                    //结束标签前输出CDATA
                    text = arrCDATA.join('');
                    saveBlock('cdata', text, lastCDATAIndex, {
                        tagName: tagCDATA,
                        attrs: attrsCDATA
                    });
                    tagCDATA = null;
                    attrsCDATA = null;
                    arrCDATA = null;
                }
                if (!tagCDATA) {
                    //标签结束
                    saveBlock('tagend', match[0], matchIndex, {
                        tagName: tagName
                    });
                    continue;
                }
            }

            if (tagCDATA) {
                arrCDATA.push(match[0]);
            } else {
                if ((tagName = match[4])) {
                    //标签开始
                    arrAttrs = [];
                    var attrs = match[5],
                        attrMatch,
                        attrMatchCount = 0;
                    while ((attrMatch = regAttr.exec(attrs))) {
                        var name = attrMatch[1],
                            quote = attrMatch[2]
                                ? attrMatch[2]
                                : attrMatch[4]
                                    ? attrMatch[4]
                                    : '',
                            value = attrMatch[3]
                                ? attrMatch[3]
                                : attrMatch[5]
                                    ? attrMatch[5]
                                    : attrMatch[6]
                                        ? attrMatch[6]
                                        : '';
                        arrAttrs.push({
                            name: name,
                            value: value,
                            quote: quote,
                            index: attrMatch.index,
                            raw: attrMatch[0]
                        });
                        attrMatchCount += attrMatch[0].length;
                    }
                    if (attrMatchCount === attrs.length) {
                        saveBlock('tagstart', match[0], matchIndex, {
                            tagName: tagName,
                            attrs: arrAttrs,
                            close: match[6]
                        });
                        if (mapCdataTags[tagName]) {
                            tagCDATA = tagName;
                            attrsCDATA = arrAttrs.concat();
                            arrCDATA = [];
                            lastCDATAIndex = lastIndex;
                        }
                    } else {
                        //如果出现漏匹配，则把当前内容匹配为text
                        saveBlock('text', match[0], matchIndex);
                    }
                } else if (match[2] || match[3]) {
                    //注释标签
                    saveBlock('comment', match[0], matchIndex, {
                        content: match[2] || match[3],
                        long: match[2] ? true : false
                    });
                }
            }
        }

        if (html.length > lastIndex) {
            //结尾文本
            text = html.substring(lastIndex, html.length);
            saveBlock('text', text, lastIndex);
        }

        this.fire('end', {
            pos: lastIndex,
            line: line,
            col: html.length - lastLineIndex + 1
        });
    }

    // add event
    addListener(types, listener) {
        var _listeners = this._listeners;
        var arrTypes = types.split(/[,\s]/),
            type;
        for (var i = 0, l = arrTypes.length; i < l; i++) {
            type = arrTypes[i];
            if (_listeners[type] === undefined) {
                _listeners[type] = [];
            }
            _listeners[type].push(listener);
        }
    }

    // fire event
    fire(type, data) {
        if (data === undefined) {
            data = {};
        }
        data.type = type;
        var listeners = [],
            listenersType = this._listeners[type],
            listenersAll = this._listeners['all'];
        if (listenersType !== undefined) {
            listeners = listeners.concat(listenersType);
        }
        if (listenersAll !== undefined) {
            listeners = listeners.concat(listenersAll);
        }
        var lastEvent = this.lastEvent;
        if (lastEvent !== null) {
            delete lastEvent['lastEvent'];
            data.lastEvent = lastEvent;
        }
        this.lastEvent = data;
        for (var i = 0, l = listeners.length; i < l; i++) {
            listeners[i].call(this, data);
        }
    }

    // remove event
    removeListener(type, listener) {
        var listenersType = this._listeners[type];
        if (listenersType !== undefined) {
            for (var i = 0, l = listenersType.length; i < l; i++) {
                if (listenersType[i] === listener) {
                    listenersType.splice(i, 1);
                    break;
                }
            }
        }
    }

    //fix pos if event.raw have \n
    fixPos(event, index) {
        var text = event.raw.substr(0, index);
        var arrLines = text.split(/\r?\n/),
            lineCount = arrLines.length - 1,
            line = event.line,
            col;
        if (lineCount > 0) {
            line += lineCount;
            col = arrLines[lineCount].length + 1;
        } else {
            col = event.col + index;
        }
        return {
            line: line,
            col: col
        };
    }

    // covert array type of attrs to map
    getMapAttrs(arrAttrs) {
        var mapAttrs = {},
            attr;
        for (var i = 0, l = arrAttrs.length; i < l; i++) {
            attr = arrAttrs[i];
            mapAttrs[attr.name] = attr.value;
        }
        return mapAttrs;
    }
}
