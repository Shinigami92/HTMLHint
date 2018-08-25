/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const srcNotEmptyRule = {
    id: 'src-not-empty',
    description: 'The src attribute of an img(script,link) must have a value.',
    init: function(parser, reporter) {
        const self = this;
        parser.addListener('tagstart', function(event) {
            const tagName = event.tagName;
            const attrs = event.attrs;
            let attr;
            const col = event.col + tagName.length + 1;
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (
                    ((/^(img|script|embed|bgsound|iframe)$/.test(tagName) ===
                        true &&
                        attr.name === 'src') ||
                        (tagName === 'link' && attr.name === 'href') ||
                        (tagName === 'object' && attr.name === 'data')) &&
                    attr.value === ''
                ) {
                    reporter.error(
                        'The attribute [ ' +
                            attr.name +
                            ' ] of the tag [ ' +
                            tagName +
                            ' ] must have a value.',
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
