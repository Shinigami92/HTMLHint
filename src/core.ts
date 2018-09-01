import { grey, red, white } from 'colors/safe';
import colors from 'colors/safe';
import { HTMLParser } from './htmlparser';
import { Reporter, ReporterMessage } from './reporter';
import * as rules from './rules';
import { Rule, RuleConfigMap, RuleRegistry } from './rules/html-rule';

function repeatStr(n: number, str: string = ' '): string {
    return new Array(n + 1).join(str);
}

export interface FormatOption {
    colors: boolean;
    indent: number;
}

export class HTMLHint {
    public readonly version: string = '@VERSION';
    public readonly release: string = '@RELEASE';

    public rules: RuleRegistry = {};

    public defaultRuleset: RuleConfigMap = {
        'tagname-lowercase': true,
        'attr-lowercase': true,
        'attr-value-double-quotes': true,
        'doctype-first': true,
        'tag-pair': true,
        'spec-char-escape': true,
        'id-unique': true,
        'src-not-empty': true,
        'attr-no-duplication': true,
        'title-require': true
    };

    constructor() {
        Object.keys(rules).forEach((key: string) => this.addRule(rules[key]));
    }

    public addRule(rule: Rule): void {
        this.rules[rule.id] = rule;
    }

    public verify(html: string, ruleset?: RuleConfigMap): ReporterMessage[] {
        if (ruleset === undefined || Object.keys(ruleset).length === 0) {
            ruleset = this.defaultRuleset;
        }

        // parse inline ruleset
        html = html.replace(
            /^\s*<!--\s*htmlhint\s+([^\r\n]+?)\s*-->/i,
            (all: string, strRuleset: string) => {
                if (ruleset === undefined) {
                    ruleset = {};
                }
                strRuleset.replace(
                    /(?:^|,)\s*([^:,]+)\s*(?::\s*([^,\s]+))?/g,
                    (all: string, key: string, value?: 'true' | 'false' | boolean) => {
                        if (value === 'false') {
                            value = false;
                        } else if (value === 'true') {
                            value = true;
                        }
                        ruleset![key] = value === undefined ? true : value;
                    }
                );
                return '';
            }
        );

        const parser: HTMLParser = new HTMLParser();
        const reporter: Reporter = new Reporter(html, ruleset);

        const rules: RuleRegistry = this.rules;
        let rule: Rule;
        for (const id in ruleset) {
            if (ruleset.hasOwnProperty(id)) {
                rule = rules[id];
                if (ruleset[id] !== false) {
                    rule.init(parser, reporter, ruleset[id]);
                }
            }
        }

        parser.parse(html);

        return reporter.messages;
    }

    // format messages
    public format(
        arrMessages: ReporterMessage[],
        options: FormatOption = {
            colors: false,
            indent: 0
        }
    ): string[] {
        const arrLogs: string[] = [];
        if (!options.colors) {
            colors.disable();
        }
        const indent: number = options.indent;
        arrMessages.forEach((hint: ReporterMessage) => {
            const leftWindow: number = 40;
            const rightWindow: number = leftWindow + 20;
            let evidence: string = hint.evidence;
            const line: number = hint.line;
            const col: number = hint.col;
            const evidenceCount: number = evidence.length;
            let leftCol: number = col > leftWindow + 1 ? col - leftWindow : 1;
            let rightCol: number =
                evidence.length > col + rightWindow ? col + rightWindow : evidenceCount;
            if (col < leftWindow + 1) {
                rightCol += leftWindow - col + 1;
            }
            evidence = evidence.replace(/\t/g, ' ').substring(leftCol - 1, rightCol);
            // add ...
            if (leftCol > 1) {
                evidence = `...${evidence}`;
                leftCol -= 3;
            }
            if (rightCol < evidenceCount) {
                evidence += '...';
            }
            // show evidence
            arrLogs.push(`${white(`${repeatStr(indent)}L${line} |`)}${grey(evidence)}`);
            // show pointer & message
            let pointCol: number = col - leftCol;
            // add double byte character
            const match: RegExpMatchArray | null = evidence
                .substring(0, pointCol)
                .match(/[^\u0000-\u00ff]/g);
            if (match !== null) {
                pointCol += match.length;
            }
            arrLogs.push(
                `${white(
                    `${repeatStr(indent)}${repeatStr(String(line).length + 3 + pointCol)}`
                )}^ ${red(`${hint.message} (${hint.rule.id})`)}`
            );
        });
        return arrLogs;
    }
}
