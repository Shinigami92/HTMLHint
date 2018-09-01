import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const idClassAdDisabledRule: Rule = {
    id: 'id-class-ad-disabled',
    description:
        'The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const attrs = event.attrs;
            let attr;
            let attrName;
            const col: number = event.col + event.tagName.length + 1;

            for (let i: number = 0, l: number = attrs.length; i < l; i++) {
                attr = attrs[i];
                attrName = attr.name;
                if (/^(id|class)$/i.test(attrName)) {
                    if (/(^|[-_])ad([-_]|$)/i.test(attr.value)) {
                        reporter.warn(
                            `The value of attribute ${attrName} cannot use the ad keyword.`,
                            event.line,
                            col + attr.index,
                            self,
                            attr.raw
                        );
                    }
                }
            }
        });
    }
};
