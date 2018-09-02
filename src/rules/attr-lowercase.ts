import { Attribute, HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule, RuleConfig } from './html-rule';

export const attrLowercaseRule: Rule = {
    id: 'attr-lowercase',
    description: 'All attribute names must be in lowercase.',
    init(parser: HTMLParser, reporter: Reporter, options: RuleConfig): void {
        const self: Rule = this;
        const exceptions = Array.isArray(options) ? options : [];
        parser.addListener('tagstart', (event) => {
            const attrs: Attribute[] = event.attrs;
            let attr: Attribute;
            const col: number = event.col + event.tagName.length + 1;
            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                const attrName: string = attr.name;
                if (exceptions.indexOf(attrName) === -1 && attrName !== attrName.toLowerCase()) {
                    reporter.error(
                        `The attribute name of [ ${attrName} ] must be in lowercase.`,
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
