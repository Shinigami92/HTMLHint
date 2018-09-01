import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const tagSelfCloseRule: Rule = {
    id: 'tag-self-close',
    description: 'Empty tags must be self closed.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        const mapEmptyTags = parser.makeMap(
            'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,track,command,source,keygen,wbr'
        ); //HTML 4.01 + HTML 5
        parser.addListener('tagstart', (event) => {
            const tagName: string = event.tagName.toLowerCase();
            if (mapEmptyTags[tagName] !== undefined) {
                if (!event.close) {
                    reporter.warn(
                        `The empty tag : [ ${tagName} ] must be self closed.`,
                        event.line,
                        event.col,
                        self,
                        event.raw
                    );
                }
            }
        });
    }
};
