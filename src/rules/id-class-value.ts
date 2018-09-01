import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule, RuleConfig } from './html-rule';

export const idClassValueRule: Rule = {
    id: 'id-class-value',
    description: 'The id and class attribute values must meet the specified rules.',
    init(parser: HTMLParser, reporter: Reporter, options: RuleConfig): void {
        const self: Rule = this;
        const arrRules = {
            underline: {
                regId: /^[a-z\d]+(_[a-z\d]+)*$/,
                message:
                    'The id and class attribute values must be in lowercase and split by an underscore.'
            },
            dash: {
                regId: /^[a-z\d]+(-[a-z\d]+)*$/,
                message:
                    'The id and class attribute values must be in lowercase and split by a dash.'
            },
            hump: {
                regId: /^[a-z][a-zA-Z\d]*([A-Z][a-zA-Z\d]*)*$/,
                message: 'The id and class attribute values must meet the camelCase style.'
            }
        };
        let rule;
        if (typeof options === 'string') {
            rule = arrRules[options];
        } else {
            rule = options;
        }
        if (rule && rule.regId) {
            const regId = rule.regId;
            const message = rule.message;
            parser.addListener('tagstart', (event) => {
                const attrs = event.attrs;
                let attr;
                const col: number = event.col + event.tagName.length + 1;
                for (let i: number = 0, l1: number = attrs.length; i < l1; i++) {
                    attr = attrs[i];
                    if (attr.name.toLowerCase() === 'id') {
                        if (regId.test(attr.value) === false) {
                            reporter.warn(message, event.line, col + attr.index, self, attr.raw);
                        }
                    }
                    if (attr.name.toLowerCase() === 'class') {
                        const arrClass = attr.value.split(/\s+/g);
                        let classValue;
                        for (let j: number = 0, l2: number = arrClass.length; j < l2; j++) {
                            classValue = arrClass[j];
                            if (classValue && regId.test(classValue) === false) {
                                reporter.warn(
                                    message,
                                    event.line,
                                    col + attr.index,
                                    self,
                                    classValue
                                );
                            }
                        }
                    }
                }
            });
        }
    }
};
