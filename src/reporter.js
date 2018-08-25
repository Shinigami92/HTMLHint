/**
 * @license
 * Copyright (c) 2014-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

export class Reporter {
    constructor(html, ruleset) {
        this.html = html;
        this.lines = html.split(/\r?\n/);
        const match = html.match(/\r?\n/);
        this.brLen = match !== null ? match[0].length : 0;
        this.ruleset = ruleset;
        this.messages = [];
    }

    error(message, line, col, rule, raw) {
        this.report('error', message, line, col, rule, raw);
    }

    warn(message, line, col, rule, raw) {
        this.report('warning', message, line, col, rule, raw);
    }

    info(message, line, col, rule, raw) {
        this.report('info', message, line, col, rule, raw);
    }

    report(type, message, line, col, rule, raw) {
        var lines = this.lines;
        var brLen = this.brLen;
        var evidence, evidenceLen;
        for (var i = line - 1, lineCount = lines.length; i < lineCount; i++) {
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
            type: type,
            message: message,
            raw: raw,
            evidence: evidence,
            line: line,
            col: col,
            rule: {
                id: rule.id,
                description: rule.description,
                link: 'https://github.com/thedaviddias/HTMLHint/wiki/' + rule.id
            }
        });
    }
}
