import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const styleDisabledRule: Rule = {
    id: 'style-disabled',
    description: '<style> tags cannot be used.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            if (event.tagName.toLowerCase() === 'style') {
                reporter.warn(
                    'The <style> tag cannot be used.',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        });
    }
};
