import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const doctypeHtml5Rule: Rule = {
    id: 'doctype-html5',
    description: 'Invalid doctype. Use: "<!DOCTYPE html>"',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        function onComment(event): void {
            if (event.long === false && event.content.toLowerCase() !== 'doctype html') {
                reporter.warn(
                    'Invalid doctype. Use: "<!DOCTYPE html>"',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        }
        function onTagStart(): void {
            parser.removeListener('comment', onComment);
            parser.removeListener('tagstart', onTagStart);
        }
        parser.addListener('all', onComment);
        parser.addListener('tagstart', onTagStart);
    }
};
