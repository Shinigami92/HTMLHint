/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const csslintRule = {
    id: 'csslint',
    description: 'Scan css with csslint.',
    init: function(parser, reporter, options) {
        var self = this;
        parser.addListener('cdata', function(event) {
            if (event.tagName.toLowerCase() === 'style') {
                var cssVerify;

                if (typeof exports === 'object' && require) {
                    cssVerify = require('csslint').CSSLint.verify;
                } else {
                    cssVerify = CSSLint.verify;
                }

                if (options !== undefined) {
                    var styleLine = event.line - 1,
                        styleCol = event.col - 1;
                    try {
                        var messages = cssVerify(event.raw, options).messages;
                        messages.forEach(function(error) {
                            var line = error.line;
                            reporter[
                                error.type === 'warning' ? 'warn' : 'error'
                            ](
                                '[' + error.rule.id + '] ' + error.message,
                                styleLine + line,
                                (line === 1 ? styleCol : 0) + error.col,
                                self,
                                error.evidence
                            );
                        });
                    } catch (e) {}
                }
            }
        });
    }
};
