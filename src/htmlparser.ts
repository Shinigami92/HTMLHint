export interface FixPosResult {
    line: number;
    col: number;
}

export class HTMLParser {
    private _listeners = {};
    private _mapCdataTags: {
        [key: string]: boolean;
    } = this.makeMap('script,style');
    private _arrBlocks = [];
    private lastEvent = null;

    // parse html code
    public parse(html: string): void {
        const mapCdataTags: {
            [key: string]: boolean;
        } = this._mapCdataTags;

        const regTag: RegExp = /<(?:\/([^\s>]+)\s*|!--([\s\S]*?)--|!([^>]*?)|([\w\-:]+)((?:\s+[^\s"'>/=\x00-\x0F\x7F\x80-\x9F]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]*))?)*?)\s*(\/?))>/g;
        const regAttr: RegExp = /\s*([^\s"'>/=\x00-\x0F\x7F\x80-\x9F]+)(?:\s*=\s*(?:(")([^"]*)"|(')([^']*)'|([^\s"'>]*)))?/g;
        const regLine: RegExp = /\r?\n/g;

        let match;
        let matchIndex;
        let lastIndex = 0;
        let tagName;
        let arrAttrs;
        let tagCDATA;
        let attrsCDATA;
        let arrCDATA;
        let lastCDATAIndex = 0;
        let text;
        let lastLineIndex: number = 0;
        let line: number = 1;
        const arrBlocks = this._arrBlocks;

        // Memory block
        const saveBlock = (type: string, raw, pos: number, data) => {
            const col: number = pos - lastLineIndex + 1;
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

        this.fire('start', { pos: 0, line: 1, col: 1 });

        while ((match = regTag.exec(html))) {
            matchIndex = match.index;
            if (matchIndex > lastIndex) {
                // Save the previous text or CDATA
                text = html.substring(lastIndex, matchIndex);
                if (tagCDATA) {
                    arrCDATA.push(text);
                } else {
                    // text
                    saveBlock('text', text, lastIndex);
                }
            }
            lastIndex = regTag.lastIndex;

            if ((tagName = match[1])) {
                if (tagCDATA && tagName === tagCDATA) {
                    // Output CDATA before closing the label
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
                    // End of label
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
                    // Label start
                    arrAttrs = [];
                    const attrs = match[5];
                    let attrMatch;
                    let attrMatchCount = 0;
                    while ((attrMatch = regAttr.exec(attrs))) {
                        const name = attrMatch[1];
                        const quote = attrMatch[2]
                            ? attrMatch[2]
                            : attrMatch[4]
                                ? attrMatch[4]
                                : '';
                        const value = attrMatch[3]
                            ? attrMatch[3]
                            : attrMatch[5]
                                ? attrMatch[5]
                                : attrMatch[6]
                                    ? attrMatch[6]
                                    : '';
                        arrAttrs.push({
                            name,
                            value,
                            quote,
                            index: attrMatch.index,
                            raw: attrMatch[0]
                        });
                        attrMatchCount += attrMatch[0].length;
                    }
                    if (attrMatchCount === attrs.length) {
                        saveBlock('tagstart', match[0], matchIndex, {
                            tagName,
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
                        // If a miss match occurs, the current content is matched to text
                        saveBlock('text', match[0], matchIndex);
                    }
                } else if (match[2] || match[3]) {
                    // Comment tag
                    saveBlock('comment', match[0], matchIndex, {
                        content: match[2] || match[3],
                        long: match[2] ? true : false
                    });
                }
            }
        }

        if (html.length > lastIndex) {
            // End text
            text = html.substring(lastIndex, html.length);
            saveBlock('text', text, lastIndex);
        }

        this.fire('end', {
            pos: lastIndex,
            line,
            col: html.length - lastLineIndex + 1
        });
    }

    // add event
    public addListener(types, listener): void {
        const _listeners = this._listeners;
        const arrTypes: string[] = types.split(/[,\s]/);
        let type: string;
        for (let i: number = 0, l: number = arrTypes.length; i < l; i++) {
            type = arrTypes[i];
            if (_listeners[type] === undefined) {
                _listeners[type] = [];
            }
            _listeners[type].push(listener);
        }
    }

    // remove event
    public removeListener(type, listener): void {
        const listenersType = this._listeners[type];
        if (listenersType !== undefined) {
            for (let i: number = 0, l: number = listenersType.length; i < l; i++) {
                if (listenersType[i] === listener) {
                    listenersType.splice(i, 1);
                    break;
                }
            }
        }
    }

    //fix pos if event.raw have \n
    public fixPos(event, index: number): FixPosResult {
        const text: string = event.raw.substr(0, index);
        const arrLines: string[] = text.split(/\r?\n/);
        const lineCount: number = arrLines.length - 1;
        let line: number = event.line;
        let col: number;
        if (lineCount > 0) {
            line += lineCount;
            col = arrLines[lineCount].length + 1;
        } else {
            col = event.col + index;
        }
        return { line, col };
    }

    // covert array type of attrs to map
    public getMapAttrs(arrAttrs) {
        const mapAttrs = {};
        let attr;
        for (let i: number = 0, l: number = arrAttrs.length; i < l; i++) {
            attr = arrAttrs[i];
            mapAttrs[attr.name] = attr.value;
        }
        return mapAttrs;
    }

    public makeMap(
        str: string
    ): {
        [key: string]: boolean | undefined;
    } {
        const obj: { [key: string]: boolean } = {};
        const items: string[] = str.split(',');
        for (let i: number = 0; i < items.length; i++) {
            obj[items[i]] = true;
        }
        return obj;
    }

    // fire event
    private fire(type: string, data): void {
        if (data === undefined) {
            data = {};
        }
        data.type = type;
        let listeners = [];
        const listenersType = this._listeners[type];
        const listenersAll = this._listeners['all'];
        if (listenersType !== undefined) {
            listeners = listeners.concat(listenersType);
        }
        if (listenersAll !== undefined) {
            listeners = listeners.concat(listenersAll);
        }
        const lastEvent = this.lastEvent;
        if (lastEvent !== null) {
            delete lastEvent['lastEvent'];
            data.lastEvent = lastEvent;
        }
        this.lastEvent = data;
        for (let i: number = 0, l: number = listeners.length; i < l; i++) {
            listeners[i].call(this, data);
        }
    }
}
