import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const tagPairRule: Rule = {
    id: 'tag-pair',
    description: 'Tag must be paired.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        const stack = [];
        const mapEmptyTags = parser.makeMap(
            'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr'
        ); //HTML 4.01 + HTML 5
        parser.addListener('tagstart', (event) => {
            const tagName: string = event.tagName.toLowerCase();
            if (mapEmptyTags[tagName] === undefined && !event.close) {
                stack.push({
                    tagName,
                    line: event.line,
                    raw: event.raw
                });
            }
        });
        parser.addListener('tagend', (event) => {
            const tagName: string = event.tagName.toLowerCase();
            let pos: number;
            //向上寻找匹配的开始标签
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].tagName === tagName) {
                    break;
                }
            }
            if (pos >= 0) {
                const arrTags = [];
                for (let i: number = stack.length - 1; i > pos; i--) {
                    arrTags.push(`</${stack[i].tagName}>`);
                }
                if (arrTags.length > 0) {
                    const lastEvent = stack[stack.length - 1];
                    reporter.error(
                        `Tag must be paired, missing: [ ${arrTags.join(
                            ''
                        )} ], start tag match failed [ ${lastEvent.raw} ] on line ${
                            lastEvent.line
                        }.`,
                        event.line,
                        event.col,
                        self,
                        event.raw
                    );
                }
                stack.length = pos;
            } else {
                reporter.error(
                    `Tag must be paired, no start tag: [ ${event.raw} ]`,
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        });
        parser.addListener('end', (event) => {
            const arrTags = [];
            for (let i = stack.length - 1; i >= 0; i--) {
                arrTags.push(`</${stack[i].tagName}>`);
            }
            if (arrTags.length > 0) {
                const lastEvent = stack[stack.length - 1];
                reporter.error(
                    `Tag must be paired, missing: [ ${arrTags.join(
                        ''
                    )} ], open tag match failed [ ${lastEvent.raw} ] on line ${lastEvent.line}.`,
                    event.line,
                    event.col,
                    self,
                    ''
                );
            }
        });
    }
};
