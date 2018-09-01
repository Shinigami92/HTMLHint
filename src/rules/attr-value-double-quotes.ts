import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const attrValueDoubleQuotes: Rule = {
    id: 'attr-value-double-quotes',
    description: 'Attribute values must be in double quotes.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const attrs = event.attrs;
            let attr;
            const col: number = event.col + event.tagName.length + 1;
            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (
                    (attr.value !== '' && attr.quote !== '"') ||
                    (attr.value === '' && attr.quote === "'")
                ) {
                    reporter.error(
                        `The value of attribute [ ${attr.name} ] must be in double quotes.`,
                        event.line,
                        col + attr.index,
                        self,
                        attr.raw
                    );
                }
            }
        });
    }
};
