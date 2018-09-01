import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const inlineScriptDisabledRule: Rule = {
    id: 'inline-script-disabled',
    description: 'Inline script cannot be used.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const attrs = event.attrs;
            let attr;
            const col: number = event.col + event.tagName.length + 1;
            let attrName;
            const reEvent: RegExp = /^on(unload|message|submit|select|scroll|resize|mouseover|mouseout|mousemove|mouseleave|mouseenter|mousedown|load|keyup|keypress|keydown|focus|dblclick|click|change|blur|error)$/i;

            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                attrName = attr.name.toLowerCase();
                if (reEvent.test(attrName) === true) {
                    reporter.warn(
                        `Inline script [ ${attr.raw} ] cannot be used.`,
                        event.line,
                        col + attr.index,
                        self,
                        attr.raw
                    );
                } else if (attrName === 'src' || attrName === 'href') {
                    if (/^\s*javascript:/i.test(attr.value)) {
                        reporter.warn(
                            `Inline script [ ${attr.raw} ] cannot be used.`,
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
