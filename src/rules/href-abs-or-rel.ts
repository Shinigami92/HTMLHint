import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule, RuleConfig } from './html-rule';

export const hrefAbsOrRelRule: Rule = {
    id: 'href-abs-or-rel',
    description: 'An href attribute must be either absolute or relative.',
    init(parser: HTMLParser, reporter: Reporter, options: RuleConfig): void {
        const self: Rule = this;

        const hrefMode: 'absolute' | 'relative' = options === 'abs' ? 'absolute' : 'relative';

        parser.addListener('tagstart', (event) => {
            const attrs = event.attrs;
            let attr;
            const col: number = event.col + event.tagName.length + 1;

            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.name === 'href') {
                    if (
                        (hrefMode === 'absolute' && /^\w+?:/.test(attr.value) === false) ||
                        (hrefMode === 'relative' && /^https?:\/\//.test(attr.value) === true)
                    ) {
                        reporter.warn(
                            `The value of the href attribute [ ${
                                attr.value
                            } ] must be ${hrefMode}.`,
                            event.line,
                            col + attr.index,
                            self,
                            attr.raw
                        );
                    }
                    break;
                }
            }
        });
    }
};
