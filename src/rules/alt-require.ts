import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const altRequireRule: Rule = {
    id: 'alt-require',
    description:
        'The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        parser.addListener('tagstart', (event) => {
            const tagName: string = event.tagName.toLowerCase();
            const mapAttrs = parser.getMapAttrs(event.attrs);
            const col: number = event.col + tagName.length + 1;
            if (tagName === 'img' && !('alt' in mapAttrs)) {
                reporter.warn(
                    'An alt attribute must be present on <img> elements.',
                    event.line,
                    col,
                    self,
                    event.raw
                );
            } else if (
                (tagName === 'area' && 'href' in mapAttrs) ||
                (tagName === 'input' && mapAttrs['type'] === 'image')
            ) {
                if (!('alt' in mapAttrs) || mapAttrs['alt'] === '') {
                    const selector: string =
                        tagName === 'area' ? 'area[href]' : 'input[type=image]';
                    reporter.warn(
                        `The alt attribute of ${selector} must have a value.`,
                        event.line,
                        col,
                        self,
                        event.raw
                    );
                }
            }
        });
    }
};
