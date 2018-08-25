/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const attrValueDoubleQuotes = {
    id: 'attr-value-double-quotes',
    description: 'Attribute values must be in double quotes.',
    init: function(parser, reporter) {
        const self = this;
        parser.addListener('tagstart', function(event) {
            const attrs = event.attrs;
            let attr;
            const col = event.col + event.tagName.length + 1;
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (
                    (attr.value !== '' && attr.quote !== '"') ||
                    (attr.value === '' && attr.quote === "'")
                ) {
                    reporter.error(
                        'The value of attribute [ ' +
                            attr.name +
                            ' ] must be in double quotes.',
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
