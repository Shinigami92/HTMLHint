import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const srcNotEmptyRule: Rule = {
    id: 'src-not-empty',
    description: 'The src attribute of an img(script,link) must have a value.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const tagName: string = event.tagName;
            const attrs = event.attrs;
            let attr;
            const col: number = event.col + tagName.length + 1;
            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (
                    ((/^(img|script|embed|bgsound|iframe)$/.test(tagName) === true &&
                        attr.name === 'src') ||
                        (tagName === 'link' && attr.name === 'href') ||
                        (tagName === 'object' && attr.name === 'data')) &&
                    attr.value === ''
                ) {
                    reporter.error(
                        `The attribute [ ${
                            attr.name
                        } ] of the tag [ ${tagName} ] must have a value.`,
                        event.line,
                        col + attr.index,
                        self,
                        attr.raw
                    );
                }
            }
        });
    }
};
