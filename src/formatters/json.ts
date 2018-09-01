import { Formatter, FormatterCallback } from '../formatter';

export const jsonFormatter: FormatterCallback = (formatter: Formatter): void => {
    formatter.on('end', (event) => {
        console.log(JSON.stringify(event.arrAllMessages));
    });
};
export default jsonFormatter;
