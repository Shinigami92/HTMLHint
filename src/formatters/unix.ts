import { HTMLHint } from '../core';
import { Formatter, FormatterCallback, FormatterOption } from '../formatter';
import { ReporterMessage } from '../reporter';

export const unixFormatter: FormatterCallback = (
    formatter: Formatter,
    HTMLHint?: HTMLHint,
    options?: FormatterOption
): void => {
    const nocolor = options.nocolor;
    formatter.on('file', (event) => {
        event.messages.forEach((message: ReporterMessage) => {
            console.log(
                [
                    event.file,
                    message.line,
                    message.col,
                    ` ${message.message} [${message.type}/${message.rule.id}]`
                ].join(':')
            );
        });
    });
    formatter.on('end', (event) => {
        const allHintCount: number = event.allHintCount;
        if (allHintCount > 0) {
            console.log('');
            const message: string = '%d problems';
            console.log(nocolor ? message : message.red, event.allHintCount);
        }
    });
};
export default unixFormatter;
