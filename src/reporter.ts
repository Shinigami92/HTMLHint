import { Rule, RuleConfigMap } from './rules/html-rule';

export type ReportMessageType = 'error' | 'warning' | 'info';

export interface ReporterMessage {
    type: ReportMessageType;
    message: string;
    raw: any;
    evidence: string;
    line: number;
    col: number;
    rule: {
        id: string;
        description: string;
        link: string;
    };
}

export class Reporter {
    public html: string;
    public lines: string[];
    public brLen: number;
    public messages: ReporterMessage[] = [];
    public ruleset: RuleConfigMap;

    constructor(html: string, ruleset: RuleConfigMap) {
        this.html = html;
        this.lines = html.split(/\r?\n/);
        const match: RegExpMatchArray | null = html.match(/\r?\n/);
        this.brLen = match !== null ? match[0].length : 0;
        this.ruleset = ruleset;
    }

    public error(message: string, line: number, col: number, rule: Rule, raw: string): void {
        this.report('error', message, line, col, rule, raw);
    }

    public warn(message: string, line: number, col: number, rule: Rule, raw: string): void {
        this.report('warning', message, line, col, rule, raw);
    }

    public info(message: string, line: number, col: number, rule: Rule, raw: string): void {
        this.report('info', message, line, col, rule, raw);
    }

    public report(
        type: ReportMessageType,
        message: string,
        line: number,
        col: number,
        rule: Rule,
        raw: string
    ): void {
        const lines: string[] = this.lines;
        const brLen: number = this.brLen;
        let evidence: string = '';
        let evidenceLen: number;
        for (let i: number = line - 1, lineCount: number = lines.length; i < lineCount; i++) {
            evidence = lines[i];
            evidenceLen = evidence.length;
            if (col > evidenceLen && line < lineCount) {
                line++;
                col -= evidenceLen;
                if (col !== 1) {
                    col -= brLen;
                }
            } else {
                break;
            }
        }
        this.messages.push({
            type,
            message,
            raw,
            evidence,
            line,
            col,
            rule: {
                id: rule.id,
                description: rule.description,
                link: `https://github.com/thedaviddias/HTMLHint/wiki/${rule.id}`
            }
        });
    }
}
