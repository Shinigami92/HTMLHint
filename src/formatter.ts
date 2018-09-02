import { red } from 'colors/safe';
import { EventEmitter } from 'events';
import { sync } from 'glob';
import { parse, ParsedPath, resolve } from 'path';
import { HTMLHint } from './core';

export interface FormatterOption {
    nocolor: any;
}

export type FormatterCallback = (
    formatter: Formatter,
    HTMLHint?: HTMLHint,
    options?: FormatterOption
) => void;

export interface FormatterRegistry {
    [formatterFileName: string]: FormatterCallback;
}

export class Formatter extends EventEmitter {
    private HTMLHint?: HTMLHint;
    private options?: FormatterOption;
    private arrSupportedFormatters: string[] = [];
    private mapFormatters: FormatterRegistry;

    constructor() {
        super();
        this.mapFormatters = this.loadFormatters();
        // load formatters
        for (const formatterName in this.mapFormatters) {
            if (formatterName !== 'default') {
                this.arrSupportedFormatters.push(formatterName);
            }
        }
    }

    public getSupported(): string[] {
        return this.arrSupportedFormatters;
    }

    public init(tmpHTMLHint: HTMLHint, tmpOptions: FormatterOption): void {
        this.HTMLHint = tmpHTMLHint;
        this.options = tmpOptions;
    }

    public setFormat(format: string): void {
        const idx: number = Object.keys(this.mapFormatters).indexOf(format);
        if (idx === -1) {
            console.log(
                red('No supported formatter, supported formatters: %s'),
                this.arrSupportedFormatters.join(', ')
            );
            process.exit(1);
        }
        const formatHandel: FormatterCallback = this.mapFormatters[format];
        formatHandel(this, this.HTMLHint, this.options);
    }

    // load all formatters
    private loadFormatters(): FormatterRegistry {
        const arrFiles: string[] = sync('./formatters/*.js', {
            cwd: __dirname,
            dot: false,
            nodir: true,
            strict: false,
            silent: true
        });
        const mapFormatters: FormatterRegistry = {};
        arrFiles.forEach((file: string) => {
            const fileInfo: ParsedPath = parse(file);
            const formatterPath: string = resolve(__dirname, file);
            mapFormatters[fileInfo.name] = require(formatterPath).default;
        });
        return mapFormatters;
    }
}

export default new Formatter();
