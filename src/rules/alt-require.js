/**
 * @license
 * Copyright (c) 2014 Takeshi Kurosawa <taken.spc@gmail.com>
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const altRequireRule = {
    id: 'alt-require',
    description:
        'The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.',
    init: function(parser, reporter) {
        let self = this;
        parser.addListener('tagstart', function(event) {
            let tagName = event.tagName.toLowerCase(),
                mapAttrs = parser.getMapAttrs(event.attrs),
                col = event.col + tagName.length + 1,
                selector;
            if (tagName === 'img' && !('alt' in mapAttrs)) {
                reporter.warn(
                    'An alt attribute must be present on <img> elements.',
                    event.line,
                    col,
                    self,
                    event.raw
                );
            } else if (
                (tagName === 'area' && 'href' in mapAttrs) ||
                (tagName === 'input' && mapAttrs['type'] === 'image')
            ) {
                if (!('alt' in mapAttrs) || mapAttrs['alt'] === '') {
                    selector =
                        tagName === 'area' ? 'area[href]' : 'input[type=image]';
                    reporter.warn(
                        'The alt attribute of ' +
                            selector +
                            ' must have a value.',
                        event.line,
                        col,
                        self,
                        event.raw
                    );
                }
            }
        });
    }
};
