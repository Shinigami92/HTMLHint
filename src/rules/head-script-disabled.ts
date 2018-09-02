import { HTMLParser, ObjectMap } from '../htmlparser';
import { Reporter } from '../reporter';
import { Rule } from './html-rule';

export const headScriptDisabledRule: Rule = {
    id: 'head-script-disabled',
    description: 'The <script> tag cannot be used in a <head> tag.',
    init(parser: HTMLParser, reporter: Reporter): void {
        const self: Rule = this;
        const reScript: RegExp = /^(text\/javascript|application\/javascript)$/i;
        let isInHead: boolean = false;
        function onTagStart(event): void {
            const mapAttrs: ObjectMap<string> = parser.getMapAttrs(event.attrs);
            const type: string = mapAttrs.type;
            const tagName: string = event.tagName.toLowerCase();
            if (tagName === 'head') {
                isInHead = true;
            }
            if (
                isInHead === true &&
                tagName === 'script' &&
                (!type || reScript.test(type) === true)
            ) {
                reporter.warn(
                    'The <script> tag cannot be used in a <head> tag.',
                    event.line,
                    event.col,
                    self,
                    event.raw
                );
            }
        }
        function onTagEnd(event): void {
            if (event.tagName.toLowerCase() === 'head') {
                parser.removeListener('tagstart', onTagStart);
                parser.removeListener('tagend', onTagEnd);
            }
        }
        parser.addListener('tagstart', onTagStart);
        parser.addListener('tagend', onTagEnd);
    }
};
