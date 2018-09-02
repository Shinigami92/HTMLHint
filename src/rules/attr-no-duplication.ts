import { Attribute, HTMLParser, ObjectMap } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const attrNoDuplicationRule: Rule = {
    id: 'attr-no-duplication',
    description: 'Elements cannot have duplicate attributes.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const attrs: Attribute[] = event.attrs;
            let attr: Attribute;
            let attrName: string;
            const col: number = event.col + event.tagName.length + 1;

            const mapAttrName: ObjectMap<true | undefined> = {};
            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                attrName = attr.name;
                if (mapAttrName[attrName] === true) {
                    reporter.error(
                        `Duplicate of attribute name [ ${attr.name} ] was found.`,
                        event.line,
                        col + attr.index,
                        self,
                        attr.raw
                    );
                }
                mapAttrName[attrName] = true;
            }
        });
    }
};
