import { HTMLParser, FixPosResult } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const specCharEscapeRule: Rule = {
    id: 'spec-char-escape',
    description: 'Special characters must be escaped.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('text', (event) => {
            const raw = event.raw;
            const reSpecChar: RegExp = /[<>]/g;
            let match: RegExpExecArray | null;
            while ((match = reSpecChar.exec(raw))) {
                const fixedPos: FixPosResult = parser.fixPos(event, match.index);
                reporter.error(
                    `Special characters must be escaped : [ ${match[0]} ].`,
                    fixedPos.line,
                    fixedPos.col,
                    self,
                    event.raw
                );
            }
        });
    }
};
