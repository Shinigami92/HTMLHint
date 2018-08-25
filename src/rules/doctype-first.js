/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const doctypeFirstRule = {
    id: 'doctype-first',
    description: 'Doctype must be declared first.',
    init: function(parser, reporter) {
        const self = this;
        const allEvent = function(event) {
            if (
                event.type === 'start' ||
                (event.type === 'text' && /^\s*$/.test(event.raw))
            ) {
                return;
            }
            if (
                (event.type !== 'comment' && event.long === false) ||
                /^DOCTYPE\s+/i.test(event.content) === false
            ) {
                reporter.error(
                    'Doctype must be declared first.',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
            parser.removeListener('all', allEvent);
        };
        parser.addListener('all', allEvent);
    }
};
