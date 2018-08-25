/**
 * @license
 * Copyright (c) 2014-2016 Yanis Wang <yanis.wang@gmail.com>
 * Copyright (c) 2018 David Dias (Thanks to the initial contributor Yanis Wan)
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/thedaviddias/HTMLHint/blob/master/LICENSE.md
 */

import { HTMLParser } from './htmlparser';
import { Reporter } from './reporter';
import * as rules from './rules';

function repeatStr(n, str) {
    return new Array(n + 1).join(str || ' ');
}

export class HTMLHint {
    constructor() {
        this.version = '@VERSION';
        this.release = '@RELEASE';

        this.rules = {};
        Object.keys(rules).forEach((key) => this.addRule(rules[key]));

        this.defaultRuleset = {
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
    }

    addRule(rule) {
        this.rules[rule.id] = rule;
    }

    verify(html, ruleset) {
        if (ruleset === undefined || Object.keys(ruleset).length === 0) {
            ruleset = this.defaultRuleset;
        }

        // parse inline ruleset
        html = html.replace(
            /^\s*<!--\s*htmlhint\s+([^\r\n]+?)\s*-->/i,
            function(all, strRuleset) {
                if (ruleset === undefined) {
                    ruleset = {};
                }
                strRuleset.replace(
                    /(?:^|,)\s*([^:,]+)\s*(?::\s*([^,\s]+))?/g,
                    function(all, key, value) {
                        if (value === 'false') {
                            value = false;
                        } else if (value === 'true') {
                            value = true;
                        }
                        ruleset[key] = value === undefined ? true : value;
                    }
                );
                return '';
            }
        );

        var parser = new HTMLParser();
        var reporter = new Reporter(html, ruleset);

        var rules = this.rules,
            rule;
        for (var id in ruleset) {
            rule = rules[id];
            if (rule !== undefined && ruleset[id] !== false) {
                rule.init(parser, reporter, ruleset[id]);
            }
        }

        parser.parse(html);

        return reporter.messages;
    }

    // format messages
    format(arrMessages, options) {
        options = options || {};
        var arrLogs = [];
        var colors = {
            white: '',
            grey: '',
            red: '',
            reset: ''
        };
        if (options.colors) {
            colors.white = '\\033[37m';
            colors.grey = '\\033[90m';
            colors.red = '\\033[31m';
            colors.reset = '\\033[39m';
        }
        var indent = options.indent || 0;
        arrMessages.forEach(function(hint) {
            var leftWindow = 40;
            var rightWindow = leftWindow + 20;
            var evidence = hint.evidence;
            var line = hint.line;
            var col = hint.col;
            var evidenceCount = evidence.length;
            var leftCol = col > leftWindow + 1 ? col - leftWindow : 1;
            var rightCol =
                evidence.length > col + rightWindow
                    ? col + rightWindow
                    : evidenceCount;
            if (col < leftWindow + 1) {
                rightCol += leftWindow - col + 1;
            }
            evidence = evidence
                .replace(/\t/g, ' ')
                .substring(leftCol - 1, rightCol);
            // add ...
            if (leftCol > 1) {
                evidence = '...' + evidence;
                leftCol -= 3;
            }
            if (rightCol < evidenceCount) {
                evidence += '...';
            }
            // show evidence
            arrLogs.push(
                colors.white +
                    repeatStr(indent) +
                    'L' +
                    line +
                    ' |' +
                    colors.grey +
                    evidence +
                    colors.reset
            );
            // show pointer & message
            var pointCol = col - leftCol;
            // add double byte character
            var match = evidence
                .substring(0, pointCol)
                .match(/[^\u0000-\u00ff]/g);
            if (match !== null) {
                pointCol += match.length;
            }
            arrLogs.push(
                colors.white +
                    repeatStr(indent) +
                    repeatStr(String(line).length + 3 + pointCol) +
                    '^ ' +
                    colors.red +
                    hint.message +
                    ' (' +
                    hint.rule.id +
                    ')' +
                    colors.reset
            );
        });
        return arrLogs;
    }
}
