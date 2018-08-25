/**
 * @license
 * Copyright (c) 2014-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const idClassAdDisabledRule = {
    id: 'id-class-ad-disabled',
    description:
        'The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.',
    init: function(parser, reporter) {
        let self = this;
        parser.addListener('tagstart', function(event) {
            let attrs = event.attrs;
            let attr;
            let attrName;
            let col = event.col + event.tagName.length + 1;

            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                attrName = attr.name;
                if (/^(id|class)$/i.test(attrName)) {
                    if (/(^|[-_])ad([-_]|$)/i.test(attr.value)) {
                        reporter.warn(
                            'The value of attribute ' +
                                attrName +
                                ' cannot use the ad keyword.',
                            event.line,
                            col + attr.index,
                            self,
                            attr.raw
                        );
                    }
                }
            }
        });
    }
};
