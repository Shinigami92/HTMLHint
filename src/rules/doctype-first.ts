import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const doctypeFirstRule: Rule = {
    id: 'doctype-first',
    description: 'Doctype must be declared first.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        const allEvent = (event) => {
            if (event.type === 'start' || (event.type === 'text' && /^\s*$/.test(event.raw))) {
                return;
            }
            if (
                (event.type !== 'comment' && event.long === false) ||
                /^DOCTYPE\s+/i.test(event.content) === false
            ) {
                reporter.error(
                    'Doctype must be declared first.',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
            parser.removeListener('all', allEvent);
        };
        parser.addListener('all', allEvent);
    }
};
