export const attrNoDuplicationRule = {
    id: 'attr-no-duplication',
    description: 'Elements cannot have duplicate attributes.',
    init: function(parser, reporter) {
        const self = this;
        parser.addListener('tagstart', function(event) {
            const attrs = event.attrs;
            let attr;
            let attrName;
            const col = event.col + event.tagName.length + 1;

            const mapAttrName = {};
            for (let i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                attrName = attr.name;
                if (mapAttrName[attrName] === true) {
                    reporter.error(
                        'Duplicate of attribute name [ ' +
                            attr.name +
                            ' ] was found.',
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
