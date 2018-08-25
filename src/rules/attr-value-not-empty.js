/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const attrValueNotEmpty = {
    id: 'attr-value-not-empty',
    description: 'All attributes must have values.',
    init: function(parser, reporter) {
        var self = this;
        parser.addListener('tagstart', function(event) {
            var attrs = event.attrs,
                attr,
                col = event.col + event.tagName.length + 1;
            for (var i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.quote === '' && attr.value === '') {
                    reporter.warn(
                        'The attribute [ ' +
                            attr.name +
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
