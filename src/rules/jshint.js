/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const jshintRule = {
    id: 'jshint',
    description: 'Scan script with jshint.',
    init: function(parser, reporter, options) {
        let self = this;
        parser.addListener('cdata', function(event) {
            if (event.tagName.toLowerCase() === 'script') {
                let mapAttrs = parser.getMapAttrs(event.attrs),
                    type = mapAttrs.type;

                // Only scan internal javascript
                if (
                    mapAttrs.src !== undefined ||
                    (type && /^(text\/javascript)$/i.test(type) === false)
                ) {
                    return;
                }

                let jsVerify;

                if (typeof exports === 'object' && require) {
                    jsVerify = require('jshint').JSHINT;
                } else {
                    jsVerify = JSHINT;
                }

                if (options !== undefined) {
                    let styleLine = event.line - 1,
                        styleCol = event.col - 1;
                    let code = event.raw.replace(/\t/g, ' ');
                    try {
                        let status = jsVerify(code, options);
                        if (status === false) {
                            jsVerify.errors.forEach(function(error) {
                                let line = error.line;
                                reporter.warn(
                                    error.reason,
                                    styleLine + line,
                                    (line === 1 ? styleCol : 0) +
                                        error.character,
                                    self,
                                    error.evidence
                                );
                            });
                        }
                    } catch (e) {}
                }
            }
        });
    }
};
