/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const doctypeHtml5Rule = {
    id: 'doctype-html5',
    description: 'Invalid doctype. Use: "<!DOCTYPE html>"',
    init: function(parser, reporter) {
        let self = this;
        function onComment(event) {
            if (
                event.long === false &&
                event.content.toLowerCase() !== 'doctype html'
            ) {
                reporter.warn(
                    'Invalid doctype. Use: "<!DOCTYPE html>"',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        }
        function onTagStart() {
            parser.removeListener('comment', onComment);
            parser.removeListener('tagstart', onTagStart);
        }
        parser.addListener('all', onComment);
        parser.addListener('tagstart', onTagStart);
    }
};
