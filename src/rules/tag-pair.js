/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const tagPairRule = {
    id: 'tag-pair',
    description: 'Tag must be paired.',
    init: function(parser, reporter) {
        const self = this;
        const stack = [];
        const mapEmptyTags = parser.makeMap(
            'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr'
        ); //HTML 4.01 + HTML 5
        parser.addListener('tagstart', function(event) {
            const tagName = event.tagName.toLowerCase();
            if (mapEmptyTags[tagName] === undefined && !event.close) {
                stack.push({
                    tagName: tagName,
                    line: event.line,
                    raw: event.raw
                });
            }
        });
        parser.addListener('tagend', function(event) {
            const tagName = event.tagName.toLowerCase();
            let pos;
            //向上寻找匹配的开始标签
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].tagName === tagName) {
                    break;
                }
            }
            if (pos >= 0) {
                const arrTags = [];
                for (let i = stack.length - 1; i > pos; i--) {
                    arrTags.push('</' + stack[i].tagName + '>');
                }
                if (arrTags.length > 0) {
                    const lastEvent = stack[stack.length - 1];
                    reporter.error(
                        'Tag must be paired, missing: [ ' +
                            arrTags.join('') +
                            ' ], start tag match failed [ ' +
                            lastEvent.raw +
                            ' ] on line ' +
                            lastEvent.line +
                            '.',
                        event.line,
                        event.col,
                        self,
                        event.raw
                    );
                }
                stack.length = pos;
            } else {
                reporter.error(
                    'Tag must be paired, no start tag: [ ' + event.raw + ' ]',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        });
        parser.addListener('end', function(event) {
            const arrTags = [];
            for (let i = stack.length - 1; i >= 0; i--) {
                arrTags.push('</' + stack[i].tagName + '>');
            }
            if (arrTags.length > 0) {
                const lastEvent = stack[stack.length - 1];
                reporter.error(
                    'Tag must be paired, missing: [ ' +
                        arrTags.join('') +
                        ' ], open tag match failed [ ' +
                        lastEvent.raw +
                        ' ] on line ' +
                        lastEvent.line +
                        '.',
                    event.line,
                    event.col,
                    self,
                    ''
                );
            }
        });
    }
};
