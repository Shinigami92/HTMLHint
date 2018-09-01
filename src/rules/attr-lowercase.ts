export const attrLowercaseRule = {
    id: 'attr-lowercase',
    description: 'All attribute names must be in lowercase.',
    init: function(parser, reporter, options) {
        const self = this;
        const exceptions = Array.isArray(options) ? options : [];
        parser.addListener('tagstart', function(event) {
            const attrs = event.attrs;
            let attr;
            const col = event.col + event.tagName.length + 1;
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                const attrName = attr.name;
                if (exceptions.indexOf(attrName) === -1 && attrName !== attrName.toLowerCase()) {
                    reporter.error(
                        'The attribute name of [ ' + attrName + ' ] must be in lowercase.',
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
