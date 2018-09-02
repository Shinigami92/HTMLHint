#!/usr/bin/env node

import { AsyncQueue, queue, series } from 'async';
import program from 'commander';
import { existsSync, readFileSync, statSync } from 'fs';
import { sync } from 'glob';
import glob from 'glob';
import parseGlob from 'parse-glob';
import { dirname, resolve, sep } from 'path';
import { get, Response } from 'request';
import stripJsonComments from 'strip-json-comments';
import { URL } from 'url';

import formatter, { Formatter } from './formatter';
import { HTMLHint } from './htmlhint';
import { ObjectMap } from './htmlparser';
import { ReporterMessage } from './reporter';
import { Rule, RuleConfigMap, RuleRegistry } from './rules/html-rule';

function map(val: string): ObjectMap<string | boolean> {
    const objMap: ObjectMap<string | boolean> = {};
    val.split(',').forEach((item: string) => {
        const arrItem: string[] = item.split(/\s*=\s*/);
        objMap[arrItem[0]] = arrItem[1] ? arrItem[1] : true;
    });
    return objMap;
}

program.on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    htmlhint');
    console.log('    htmlhint www');
    console.log('    htmlhint www/test.html');
    console.log('    htmlhint www/**/*.xhtml');
    console.log('    htmlhint www/**/*.{htm,html}');
    console.log('    htmlhint http://www.alibaba.com/');
    console.log('    cat test.html | htmlhint stdin');
    console.log('    htmlhint --list');
    console.log('    htmlhint --rules tag-pair,id-class-value=underline test.html');
    console.log('    htmlhint --config .htmlhintrc test.html');
    console.log('    htmlhint --ignore **/build/**,**/test/**');
    console.log('    htmlhint --rulesdir ./rules/');
    console.log('');
});

const arrSupportedFormatters: string[] = formatter.getSupported();

const pkgPath: string = resolve(__dirname, '../package.json');
const pkgJson: string = readFileSync(pkgPath, 'utf-8');
const pkg: { version: string } = JSON.parse(pkgJson);

program
    .version(pkg.version)
    .usage('<file|folder|pattern|stdin|url ...> [options]')
    .option('-l, --list', 'show all of the rules available')
    .option('-c, --config <file>', 'custom configuration file')
    .option('-r, --rules <ruleid, ruleid=value ...>', 'set all of the rules available', map)
    .option('-R, --rulesdir <file|folder>', 'load custom rules from file or folder')
    .option(
        `-f, --format <${arrSupportedFormatters.join('|')}>`,
        'output messages as custom format'
    )
    .option('-i, --ignore <pattern, pattern ...>', 'add pattern to exclude matches')
    .option('--nocolor', 'disable color')
    .option('--warn', 'Warn only, exit with 0')
    .parse(process.argv);

// program.list is {true | undefined}
if (program.list) {
    listRules();
    process.exit(0);
}

const arrTargets: string[] = program.args;
if (arrTargets.length === 0) {
    arrTargets.push('./');
}

// init formatter
// program.nocolor is {true | undefined}
formatter.init(HTMLHint, {
    nocolor: program.nocolor
});

// program.format is {string | undefined}
const format: string = program.format || 'default';
if (format) {
    formatter.setFormat(format);
}

// program.rulesdir is {string | undefined}
// program.rules is {string | undefined}
// program.ignore is {string | undefined}
hintTargets(arrTargets, {
    rulesdir: program.rulesdir,
    ruleset: program.rules,
    formatter,
    ignore: program.ignore
});

// list all rules
function listRules(): void {
    const rules: RuleRegistry = HTMLHint.rules;
    let rule: Rule;
    console.log('     All rules:');
    console.log(' ==================================================');
    for (const id in rules) {
        if (rules.hasOwnProperty(id)) {
            rule = rules[id];
            console.log('     %s : %s', rule.id.bold, rule.description);
        }
    }
}

interface HintTargetsOption {
    rulesdir?: string;
    ruleset?: string;
    formatter: Formatter;
    ignore?: string;
}

function hintTargets(arrTargets: string[], options: HintTargetsOption): void {
    let arrAllMessages: TargetMessage[] = [];
    let allFileCount: number = 0;
    let allHintFileCount: number = 0;
    let allHintCount: number = 0;
    const startTime: number = new Date().getTime();

    const formatter: Formatter = options.formatter;

    // load custom rules
    const rulesdir: string | undefined = options.rulesdir;
    if (rulesdir) {
        loadCustomRules(rulesdir);
    }

    // start hint
    formatter.emit('start');

    const arrTasks: Array<(next: () => void) => void> = [];
    arrTargets.forEach((target: string) => {
        arrTasks.push((next: () => void) => {
            hintAllFiles(target, options, (result: HintResult) => {
                allFileCount += result.targetFileCount;
                allHintFileCount += result.targetHintFileCount;
                allHintCount += result.targetHintCount;
                arrAllMessages = arrAllMessages.concat(result.arrTargetMessages);
                next();
            });
        });
    });
    series(arrTasks, () => {
        // end hint
        const spendTime: number = new Date().getTime() - startTime;
        formatter.emit('end', {
            arrAllMessages,
            allFileCount,
            allHintFileCount,
            allHintCount,
            time: spendTime
        });
        // program.warn is {true | undefined}
        process.exit(!program.warn && allHintCount > 0 ? 1 : 0);
    });
}

// load custom rles
function loadCustomRules(rulesdir: string): void {
    rulesdir = rulesdir.replace(/\\/g, '/');
    if (existsSync(rulesdir)) {
        if (statSync(rulesdir).isDirectory()) {
            rulesdir += /\/$/.test(rulesdir) ? '' : '/';
            rulesdir += '**/*.js';
            const arrFiles: string[] = sync(rulesdir, {
                dot: false,
                nodir: true,
                strict: false,
                silent: true
            });
            arrFiles.forEach(loadRule);
        } else {
            loadRule(rulesdir);
        }
    }
}

// load rule
// TODO: Will this method be needed in the future? Maybe for legacy support?
function loadRule(filepath: string): void {
    filepath = resolve(filepath);
    try {
        const module = require(filepath);
        module(HTMLHint);
    } catch (e) {
        //
    }
}

interface TargetMessage {
    file: string;
    messages: ReporterMessage[];
    time: number;
}

interface HintResult {
    targetFileCount: number;
    targetHintFileCount: number;
    targetHintCount: number;
    arrTargetMessages: TargetMessage[];
}

// hint all files
function hintAllFiles(
    target: string,
    options: HintTargetsOption,
    onFinised: (result: HintResult) => void
): void {
    const globInfo: GlobInfo = getGlobInfo(target);
    globInfo.ignore = options.ignore;

    const formatter: Formatter = options.formatter;

    // hint result
    let targetFileCount: number = 0;
    let targetHintFileCount: number = 0;
    let targetHintCount: number = 0;
    const arrTargetMessages: TargetMessage[] = [];

    // init ruleset
    let ruleset: RuleConfigMap | string | undefined = options.ruleset;
    if (ruleset === undefined) {
        // program.config is {string | undefined}
        ruleset = getConfig(program.config, globInfo.base, formatter);
    }

    // hint queue
    const hintQueue: AsyncQueue<string> = queue(
        (filepath: string, next: (...args: any[]) => void) => {
            const startTime: number = new Date().getTime();
            function hintNext(messages: ReporterMessage[]): void {
                const spendTime: number = new Date().getTime() - startTime;
                const hintCount: number = messages.length;
                if (hintCount > 0) {
                    formatter.emit('file', {
                        file: filepath,
                        messages,
                        time: spendTime
                    });
                    arrTargetMessages.push({
                        file: filepath,
                        messages,
                        time: spendTime
                    });
                    targetHintFileCount++;
                    targetHintCount += hintCount;
                }
                targetFileCount++;
                setImmediate(next);
            }
            // TODO: ruleset is not well checked if it is {string | RuleConfigMap | undefined}
            if (filepath === 'stdin') {
                hintStdin(ruleset, hintNext);
            } else if (/^https?:\/\//.test(filepath)) {
                hintUrl(filepath, ruleset, hintNext);
            } else {
                const messages: ReporterMessage[] = hintFile(filepath, ruleset);
                hintNext(messages);
            }
        },
        10
    );
    // start hint
    let isWalkDone: boolean = false;
    let isHintDone: boolean = true;
    function checkAllHinted(): void {
        if (isWalkDone && isHintDone) {
            onFinised({ targetFileCount, targetHintFileCount, targetHintCount, arrTargetMessages });
        }
    }
    hintQueue.drain = (): void => {
        isHintDone = true;
        checkAllHinted();
    };
    if (target === 'stdin') {
        isWalkDone = true;
        hintQueue.push(target);
    } else if (/^https?:\/\//.test(target)) {
        isWalkDone = true;
        hintQueue.push(target);
    } else {
        walkPath(
            globInfo,
            (filepath: string) => {
                isHintDone = false;
                hintQueue.push(filepath);
            },
            () => {
                isWalkDone = true;
                checkAllHinted();
            }
        );
    }
}

interface GlobInfo {
    base: string;
    pattern: string;
    ignore?: string;
}

// split target to base & glob
function getGlobInfo(target: string): GlobInfo {
    // fix windows sep
    target = target.replace(/\\/g, '/');
    const globInfo: parseGlob.Result = parseGlob(target);
    let base: string = resolve(globInfo.base);
    base += /\/$/.test(base) ? '' : '/';
    let pattern: string = globInfo.glob;
    // TODO: globPath can be -> const { basename } = globInfo.path;
    // There is no exported interface for parseGlob.Result.path
    const globPath = globInfo.path;
    const defaultGlob: '*.{htm,html}' = '*.{htm,html}';
    if (globInfo.is.glob === true) {
        // no basename
        if (globPath.basename === '') {
            pattern += defaultGlob;
        }
    } else {
        if (globPath.basename === '') {
            // no basename
            pattern += `**/${defaultGlob}`;
        } else if (existsSync(target) && statSync(target).isDirectory()) {
            // detect directory
            base += `${globPath.basename}/`;
            pattern = `**/${defaultGlob}`;
        }
    }
    return { base, pattern };
}

// search and load config
function getConfig(
    configPath: string | undefined,
    base: string,
    formatter: Formatter
): RuleConfigMap | undefined {
    if (configPath === undefined && existsSync(base)) {
        // find default config file in parent directory
        if (statSync(base).isDirectory() === false) {
            base = dirname(base);
        }
        while (base) {
            const tmpConfigFile: string = resolve(base + sep, '.htmlhintrc');
            if (existsSync(tmpConfigFile)) {
                configPath = tmpConfigFile;
                break;
            }
            base = base.substring(0, base.lastIndexOf(sep));
        }
    }

    // TODO: check configPath is not undefined
    if (existsSync(configPath)) {
        const config: string = readFileSync(configPath, 'utf-8');
        let ruleset: RuleConfigMap | undefined;
        try {
            ruleset = JSON.parse(stripJsonComments(config));
            formatter.emit('config', {
                ruleset,
                configPath
            });
        } catch (e) {
            //
        }
        return ruleset;
    }
}

// walk path
function walkPath(
    globInfo: GlobInfo,
    callback: (filepath: string) => void,
    onFinish: () => void
): void {
    let base: string = globInfo.base;
    const pattern: string = globInfo.pattern;
    const ignore: string | undefined = globInfo.ignore;
    const arrIgnores: string[] = ['**/node_modules/**'];
    if (ignore) {
        ignore.split(',').forEach((pattern: string) => {
            arrIgnores.push(pattern);
        });
    }
    const walk: void = glob(
        pattern,
        {
            cwd: base,
            dot: false,
            ignore: arrIgnores,
            nodir: true,
            strict: false,
            silent: true
        },
        () => {
            onFinish();
        }
    );
    // TODO: walk is of type void, something is wrong here
    // Maybe that worked with an old version of glob
    walk.on('match', (file) => {
        base = base.replace(/^.\//, '');
        callback(base + file);
    });
}

// hint file
function hintFile(
    filepath: string | number | Buffer | URL,
    ruleset?: RuleConfigMap
): ReporterMessage[] {
    let content: string = '';
    try {
        content = readFileSync(filepath, 'utf-8');
    } catch (e) {
        //
    }
    return HTMLHint.verify(content, ruleset);
}

// hint stdin
function hintStdin(ruleset: RuleConfigMap, callback: (messages: ReporterMessage[]) => void): void {
    process.stdin.setEncoding('utf8');
    const buffers = [];
    process.stdin.on('data', (text) => {
        buffers.push(text);
    });

    process.stdin.on('end', () => {
        const content: string = buffers.join('');
        const messages: ReporterMessage[] = HTMLHint.verify(content, ruleset);
        callback(messages);
    });
}

// hint url
function hintUrl(
    url: string,
    ruleset: RuleConfigMap,
    callback: (messages: ReporterMessage[]) => void
): void {
    get(url, (error: any, response: Response, body: any) => {
        if (!error && response.statusCode === 200) {
            const messages: ReporterMessage[] = HTMLHint.verify(body, ruleset);
            callback(messages);
        } else {
            callback([]);
        }
    });
}
