import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const attrValueNotEmpty: Rule = {
    id: 'attr-value-not-empty',
    description: 'All attributes must have values.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const attrs = event.attrs;
            let attr;
            const col: number = event.col + event.tagName.length + 1;
            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.quote === '' && attr.value === '') {
                    reporter.warn(
                        `The attribute [ ${attr.name} ] must have a value.`,
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
