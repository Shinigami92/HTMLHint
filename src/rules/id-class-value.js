/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const idClassValueRule = {
    id: 'id-class-value',
    description:
        'The id and class attribute values must meet the specified rules.',
    init: function(parser, reporter, options) {
        let self = this;
        let arrRules = {
                underline: {
                    regId: /^[a-z\d]+(_[a-z\d]+)*$/,
                    message:
                        'The id and class attribute values must be in lowercase and split by an underscore.'
                },
                dash: {
                    regId: /^[a-z\d]+(-[a-z\d]+)*$/,
                    message:
                        'The id and class attribute values must be in lowercase and split by a dash.'
                },
                hump: {
                    regId: /^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/,
                    message:
                        'The id and class attribute values must meet the camelCase style.'
                }
            },
            rule;
        if (typeof options === 'string') {
            rule = arrRules[options];
        } else {
            rule = options;
        }
        if (rule && rule.regId) {
            let regId = rule.regId,
                message = rule.message;
            parser.addListener('tagstart', function(event) {
                let attrs = event.attrs,
                    attr,
                    col = event.col + event.tagName.length + 1;
                for (let i = 0, l1 = attrs.length; i < l1; i++) {
                    attr = attrs[i];
                    if (attr.name.toLowerCase() === 'id') {
                        if (regId.test(attr.value) === false) {
                            reporter.warn(
                                message,
                                event.line,
                                col + attr.index,
                                self,
                                attr.raw
                            );
                        }
                    }
                    if (attr.name.toLowerCase() === 'class') {
                        let arrClass = attr.value.split(/\s+/g),
                            classValue;
                        for (let j = 0, l2 = arrClass.length; j < l2; j++) {
                            classValue = arrClass[j];
                            if (
                                classValue &&
                                regId.test(classValue) === false
                            ) {
                                reporter.warn(
                                    message,
                                    event.line,
                                    col + attr.index,
                                    self,
                                    classValue
                                );
                            }
                        }
                    }
                }
            });
        }
    }
};
