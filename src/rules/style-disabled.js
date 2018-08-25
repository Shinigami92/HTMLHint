/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const styleDisabledRule = {
    id: 'style-disabled',
    description: '<style> tags cannot be used.',
    init: function(parser, reporter) {
        const self = this;
        parser.addListener('tagstart', function(event) {
            if (event.tagName.toLowerCase() === 'style') {
                reporter.warn(
                    'The <style> tag cannot be used.',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        });
    }
};
