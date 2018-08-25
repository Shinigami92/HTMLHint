/**
 * @license
 * Copyright (c) 2014-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const hrefAbsOrRelRule = {
    id: 'href-abs-or-rel',
    description: 'An href attribute must be either absolute or relative.',
    init: function(parser, reporter, options) {
        var self = this;

        var hrefMode = options === 'abs' ? 'absolute' : 'relative';

        parser.addListener('tagstart', function(event) {
            var attrs = event.attrs;
            var attr;
            var col = event.col + event.tagName.length + 1;

            for (var i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.name === 'href') {
                    if (
                        (hrefMode === 'absolute' &&
                            /^\w+?:/.test(attr.value) === false) ||
                        (hrefMode === 'relative' &&
                            /^https?:\/\//.test(attr.value) === true)
                    ) {
                        reporter.warn(
                            'The value of the href attribute [ ' +
                                attr.value +
                                ' ] must be ' +
                                hrefMode +
                                '.',
                            event.line,
                            col + attr.index,
                            self,
                            attr.raw
                        );
                    }
                    break;
                }
            }
        });
    }
};
