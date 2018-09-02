import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule, RuleConfig } from './html-rule';

export const csslintRule: Rule = {
    id: 'csslint',
    description: 'Scan css with csslint.',
    init(parser: HTMLParser, reporter: Reporter, options: RuleConfig): void {
        const self: Rule = this;
        parser.addListener('cdata', (event) => {
            if (event.tagName.toLowerCase() === 'style') {
                let cssVerify;

                if (typeof exports === 'object' && require) {
                    cssVerify = require('csslint').CSSLint.verify;
                } else {
                    cssVerify = CSSLint.verify;
                }

                if (options !== undefined) {
                    const styleLine: number = event.line - 1;
                    const styleCol: number = event.col - 1;
                    try {
                        const messages = cssVerify(event.raw, options).messages;
                        messages.forEach((error) => {
                            const line = error.line;
                            reporter[error.type === 'warning' ? 'warn' : 'error'](
                                `[${error.rule.id}] ${error.message}`,
                                styleLine + line,
                                (line === 1 ? styleCol : 0) + error.col,
                                self,
                                error.evidence
                            );
                        });
                    } catch (e) {
                        //
                    }
                }
            }
        });
    }
};
