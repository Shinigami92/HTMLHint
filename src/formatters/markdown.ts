import { HTMLHint } from '../core';
import { Formatter, FormatterCallback } from '../formatter';
import { ReporterMessage } from '../reporter';

export const markdownFormatter: FormatterCallback = (
    formatter: Formatter,
    HTMLHint?: HTMLHint
): void => {
    formatter.on('end', (event) => {
        console.log('# TOC');
        const arrToc: string[] = [];
        const arrContents: string[] = [];
        const arrAllMessages = event.arrAllMessages;
        arrAllMessages.forEach((fileInfo) => {
            const filePath: string = fileInfo.file;
            const arrMessages: ReporterMessage[] = fileInfo.messages;
            let errorCount: number = 0;
            let warningCount: number = 0;
            arrMessages.forEach((message: ReporterMessage) => {
                if (message.type === 'error') {
                    errorCount++;
                } else {
                    warningCount++;
                }
            });
            arrToc.push(`   - [${filePath}](#${filePath})`);
            arrContents.push(`<a name="${filePath}" />`);
            arrContents.push(`# ${filePath}`);
            arrContents.push('');
            arrContents.push(`Found ${errorCount} errors, ${warningCount} warnings`);
            const arrLogs: string[] = HTMLHint!.format(arrMessages);
            arrContents.push('');
            arrLogs.forEach((log: string) => {
                arrContents.push(`    ${log}`);
            });
            arrContents.push('');
        });
        console.log(`${arrToc.join('\r\n')}\r\n`);
        console.log(arrContents.join('\r\n'));
    });
};
export default markdownFormatter;
