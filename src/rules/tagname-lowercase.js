/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const tagnameLowercaseRule = {
    id: 'tagname-lowercase',
    description: 'All html element names must be in lowercase.',
    init: function(parser, reporter) {
        let self = this;
        parser.addListener('tagstart,tagend', function(event) {
            let tagName = event.tagName;
            if (tagName !== tagName.toLowerCase()) {
                reporter.error(
                    'The html element name of [ ' +
                        tagName +
                        ' ] must be in lowercase.',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        });
    }
};
