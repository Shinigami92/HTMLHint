import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const idUniqueRule: Rule = {
    id: 'id-unique',
    description: 'The value of id attributes must be unique.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        const mapIdCount = {};
        parser.addListener('tagstart', (event) => {
            const attrs = event.attrs;
            let attr;
            let id;
            const col: number = event.col + event.tagName.length + 1;
            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.name.toLowerCase() === 'id') {
                    id = attr.value;
                    if (id) {
                        if (mapIdCount[id] === undefined) {
                            mapIdCount[id] = 1;
                        } else {
                            mapIdCount[id]++;
                        }
                        if (mapIdCount[id] > 1) {
                            reporter.error(
                                `The id value [ ${id} ] must be unique.`,
                                event.line,
                                col + attr.index,
                                self,
                                attr.raw
                            );
                        }
                    }
                    break;
                }
            }
        });
    }
};
