/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const tagSelfCloseRule = {
    id: 'tag-self-close',
    description: 'Empty tags must be self closed.',
    init: function(parser, reporter) {
        const self = this;
        const mapEmptyTags = parser.makeMap(
            'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr'
        ); //HTML 4.01 + HTML 5
        parser.addListener('tagstart', function(event) {
            const tagName = event.tagName.toLowerCase();
            if (mapEmptyTags[tagName] !== undefined) {
                if (!event.close) {
                    reporter.warn(
                        'The empty tag : [ ' +
                            tagName +
                            ' ] must be self closed.',
                        event.line,
                        event.col,
                        self,
                        event.raw
                    );
                }
            }
        });
    }
};
