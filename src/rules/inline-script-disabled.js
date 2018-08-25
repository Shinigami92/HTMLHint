/**
 * @license
 * Copyright (c) 2015-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export const inlineScriptDisabledRule = {
    id: 'inline-script-disabled',
    description: 'Inline script cannot be used.',
    init: function(parser, reporter) {
        let self = this;
        parser.addListener('tagstart', function(event) {
            let attrs = event.attrs;
            let attr;
            let col = event.col + event.tagName.length + 1;
            let attrName;
            let reEvent = /^on(unload|message|submit|select|scroll|resize|mouseover|mouseout|mousemove|mouseleave|mouseenter|mousedown|load|keyup|keypress|keydown|focus|dblclick|click|change|blur|error)$/i;

            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                attrName = attr.name.toLowerCase();
                if (reEvent.test(attrName) === true) {
                    reporter.warn(
                        'Inline script [ ' + attr.raw + ' ] cannot be used.',
                        event.line,
                        col + attr.index,
                        self,
                        attr.raw
                    );
                } else if (attrName === 'src' || attrName === 'href') {
                    if (/^\s*javascript:/i.test(attr.value)) {
                        reporter.warn(
                            'Inline script [ ' +
                                attr.raw +
                                ' ] cannot be used.',
                            event.line,
                            col + attr.index,
                            self,
                            attr.raw
                        );
                    }
                }
            }
        });
    }
};
