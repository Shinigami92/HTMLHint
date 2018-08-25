/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const attrLowercaseRule = {
    id: 'attr-lowercase',
    description: 'All attribute names must be in lowercase.',
    init: function(parser, reporter, options) {
        let self = this;
        let exceptions = Array.isArray(options) ? options : [];
        parser.addListener('tagstart', function(event) {
            let attrs = event.attrs,
                attr,
                col = event.col + event.tagName.length + 1;
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                let attrName = attr.name;
                if (
                    exceptions.indexOf(attrName) === -1 &&
                    attrName !== attrName.toLowerCase()
                ) {
                    reporter.error(
                        'The attribute name of [ ' +
                            attrName +
                            ' ] must be in lowercase.',
                        event.line,
                        col + attr.index,
                        self,
                        attr.raw
                    );
                }
            }
        });
    }
};
