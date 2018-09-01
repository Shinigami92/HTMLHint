import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const tagnameLowercaseRule: Rule = {
    id: 'tagname-lowercase',
    description: 'All html element names must be in lowercase.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart,tagend', (event) => {
            const tagName: string = event.tagName;
            if (tagName !== tagName.toLowerCase()) {
                reporter.error(
                    `The html element name of [ ${tagName} ] must be in lowercase.`,
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        });
    }
};
