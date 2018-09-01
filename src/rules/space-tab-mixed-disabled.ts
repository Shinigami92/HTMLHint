import { FixPosResult, HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule, RuleConfig } from './html-rule';

export const spaceTabMixedDisabledRule: Rule = {
    id: 'space-tab-mixed-disabled',
    description: 'Do not mix tabs and spaces for indentation.',
    init(parser: HTMLParser, reporter: Reporter, options: RuleConfig): void {
        const self: Rule = this;
        let indentMode: string = 'nomix';
        let spaceLengthRequire = null;
        if (typeof options === 'string') {
            const match = options.match(/^([a-z]+)(\d+)?/);
            indentMode = match[1];
            spaceLengthRequire = match[2] && parseInt(match[2], 10);
        }
        parser.addListener('text', (event) => {
            const raw = event.raw;
            const reMixed: RegExp = /(^|\r?\n)([ \t]+)/g;
            let match: RegExpExecArray | null;
            while ((match = reMixed.exec(raw))) {
                const fixedPos: FixPosResult = parser.fixPos(event, match.index + match[1].length);
                if (fixedPos.col !== 1) {
                    continue;
                }
                const whiteSpace: string = match[2];
                if (indentMode === 'space') {
                    if (spaceLengthRequire) {
                        if (
                            /^ +$/.test(whiteSpace) === false ||
                            whiteSpace.length % spaceLengthRequire !== 0
                        ) {
                            reporter.warn(
                                `Please use space for indentation and keep ${spaceLengthRequire} length.`,
                                fixedPos.line,
                                1,
                                self,
                                event.raw
                            );
                        }
                    } else {
                        if (/^ +$/.test(whiteSpace) === false) {
                            reporter.warn(
                                'Please use space for indentation.',
                                fixedPos.line,
                                1,
                                self,
                                event.raw
                            );
                        }
                    }
                } else if (indentMode === 'tab' && /^\t+$/.test(whiteSpace) === false) {
                    reporter.warn(
                        'Please use tab for indentation.',
                        fixedPos.line,
                        1,
                        self,
                        event.raw
                    );
                } else if (/ +\t|\t+ /.test(whiteSpace) === true) {
                    reporter.warn(
                        'Do not mix tabs and spaces for indentation.',
                        fixedPos.line,
                        1,
                        self,
                        event.raw
                    );
                }
            }
        });
    }
};
