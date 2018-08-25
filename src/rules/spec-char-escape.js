/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const specCharEscapeRule = {
    id: 'spec-char-escape',
    description: 'Special characters must be escaped.',
    init: function(parser, reporter) {
        let self = this;
        parser.addListener('text', function(event) {
            let raw = event.raw,
                reSpecChar = /[<>]/g,
                match;
            while ((match = reSpecChar.exec(raw))) {
                let fixedPos = parser.fixPos(event, match.index);
                reporter.error(
                    'Special characters must be escaped : [ ' +
                        match[0] +
                        ' ].',
                    fixedPos.line,
                    fixedPos.col,
                    self,
                    event.raw
                );
            }
        });
    }
};
