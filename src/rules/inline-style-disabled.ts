import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const inlineStyleDisabledRule: Rule = {
    id: 'inline-style-disabled',
    description: 'Inline style cannot be used.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const attrs = event.attrs;
            let attr;
            const col: number = event.col + event.tagName.length + 1;
            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.name.toLowerCase() === 'style') {
                    reporter.warn(
                        `Inline style [ ${attr.raw} ] cannot be used.`,
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
