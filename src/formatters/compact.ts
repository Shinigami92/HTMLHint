import { HTMLHint } from '../core';
import { Formatter, FormatterCallback, FormatterOption } from '../formatter';

export const compactFormatter: FormatterCallback = (
    formatter: Formatter,
    HTMLHint?: HTMLHint,
    options?: FormatterOption
): void => {
    const nocolor = options.nocolor;
    formatter.on('file', (event) => {
        event.messages.forEach((message) => {
            console.log(
                '%s: line %d, col %d, %s - %s (%s)',
                event.file,
                message.line,
                message.col,
                message.type,
                message.message,
                message.rule.id
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
export default compactFormatter;
