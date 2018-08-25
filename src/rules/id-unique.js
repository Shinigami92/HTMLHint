/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const idUniqueRule = {
    id: 'id-unique',
    description: 'The value of id attributes must be unique.',
    init: function(parser, reporter) {
        const self = this;
        const mapIdCount = {};
        parser.addListener('tagstart', function(event) {
            const attrs = event.attrs;
            let attr;
            let id;
            const col = event.col + event.tagName.length + 1;
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.name.toLowerCase() === 'id') {
                    id = attr.value;
                    if (id) {
                        if (mapIdCount[id] === undefined) {
                            mapIdCount[id] = 1;
                        } else {
                            mapIdCount[id]++;
                        }
                        if (mapIdCount[id] > 1) {
                            reporter.error(
                                'The id value [ ' + id + ' ] must be unique.',
                                event.line,
                                col + attr.index,
                                self,
                                attr.raw
                            );
                        }
                    }
                    break;
                }
            }
        });
    }
};
