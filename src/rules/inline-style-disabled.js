/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const inlineStyleDisabledRule = {
    id: 'inline-style-disabled',
    description: 'Inline style cannot be used.',
    init: function(parser, reporter) {
        const self = this;
        parser.addListener('tagstart', function(event) {
            const attrs = event.attrs;
            let attr;
            const col = event.col + event.tagName.length + 1;
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.name.toLowerCase() === 'style') {
                    reporter.warn(
                        'Inline style [ ' + attr.raw + ' ] cannot be used.',
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
