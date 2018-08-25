/**
 * @license
 * Copyright (c) 2014-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const attrNoDuplicationRule = {
    id: 'attr-no-duplication',
    description: 'Elements cannot have duplicate attributes.',
    init: function(parser, reporter) {
        let self = this;
        parser.addListener('tagstart', function(event) {
            let attrs = event.attrs;
            let attr;
            let attrName;
            let col = event.col + event.tagName.length + 1;

            let mapAttrName = {};
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                attrName = attr.name;
                if (mapAttrName[attrName] === true) {
                    reporter.error(
                        'Duplicate of attribute name [ ' +
                            attr.name +
                            ' ] was found.',
                        event.line,
                        col + attr.index,
                        self,
                        attr.raw
                    );
                }
                mapAttrName[attrName] = true;
            }
        });
    }
};
