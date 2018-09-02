Rules will use `defaultSeverity` if no severity is passed to the config

```json
{ "severity": "error" }
{ "severity": "warn" }
```

there is no `off`, this is equals to `false`

# Rules

## alt-require

The alt attribute of an &lt;img&gt; element must be present and alt attribute of area[href] and input[type=image] must have a value.

```json
{ "alt-require": false }
{ "alt-require": true }
{ "alt-require": [true] }
{ "alt-require": [true, {}] }
{ "alt-require": [true, { "severity": "warn" }] }
{ "alt-require": [false] }
```

## attr-lowercase

All attribute names must be in lowercase.

```json
{ "attr-lowercase": false }
{ "attr-lowercase": true }
{ "attr-lowercase": [true, { "exceptions": ["viewBox"] }] }
{ "attr-lowercase": [true, { "exceptions": ["viewBox"], "severity": "warn" }] }
```

htmlhint:recommended

## attr-no-duplication

Elements cannot have duplicate attributes.

```json
{ "attr-no-duplication": false }
{ "attr-no-duplication": true }
{ "attr-no-duplication": [true] }
{ "attr-no-duplication": [true, {}] }
{ "attr-no-duplication": [true, { "severity": "warn" }] }
{ "attr-no-duplication": [false] }
```

htmlhint:recommended

## attr-unsafe-chars

Attribute values cannot contain unsafe chars.

```json
{ "attr-unsafe-chars": false }
{ "attr-unsafe-chars": true }
{ "attr-unsafe-chars": [true] }
{ "attr-unsafe-chars": [true, {}] }
{ "attr-unsafe-chars": [true, { "severity": "warn" }] }
{ "attr-unsafe-chars": [false] }
```

## attr-value-double-quotes

Attribute values must be in double quotes.

```json
{ "attr-value-double-quotes": false }
{ "attr-value-double-quotes": true }
{ "attr-value-double-quotes": [true] }
{ "attr-value-double-quotes": [true, {}] }
{ "attr-value-double-quotes": [true, { "severity": "warn" }] }
{ "attr-value-double-quotes": [false] }
```

htmlhint:recommended

-   option to use single or double quotes

## attr-value-not-empty

All attributes must have values.

```json
{ "attr-value-not-empty": false }
{ "attr-value-not-empty": true }
{ "attr-value-not-empty": [true] }
{ "attr-value-not-empty": [true, {}] }
{ "attr-value-not-empty": [true, { "severity": "warn" }] }
{ "attr-value-not-empty": [false] }
```

## csslint

Scan css with csslint.

```json
{ "jshint": false }
{ "jshint": [false] }
// check for .csslintrc
{ "jshint": true }
{ "jshint": [true] }
// pass csslint config
{ "jshint": [true, { "config": { "vendor-prefix": true } }] }
{ "jshint": [true, { "config": { "vendor-prefix": true }, "severity": "error" }] }
{ "jshint": [true, { "config": { "vendor-prefix": true }, "severity": "warn" }] }
```

-   needs rewrite to support reading .csslintrc

## doctype-first

Doctype must be declared first.

```json
{ "doctype-first": false }
{ "doctype-first": true }
{ "doctype-first": [true] }
{ "doctype-first": [true, {}] }
{ "doctype-first": [true, { "severity": "warn" }] }
{ "doctype-first": [false] }
```

htmlhint:recommended

-   option to check only root index.html

## doctype-html5

Invalid doctype. Use: "&lt;!DOCTYPE html&gt;"

```json
{ "doctype-html5": false }
{ "doctype-html5": true }
{ "doctype-html5": [true] }
{ "doctype-html5": [true, {}] }
{ "doctype-html5": [true, { "severity": "warn" }] }
{ "doctype-html5": [false] }
```

-   needs to be more generic (html4, html5 xhtml)

## head-script-disabled

The &lt;script&gt; tag cannot be used in a &lt;head&gt; tag.

```json
{ "head-script-disabled": false }
{ "head-script-disabled": true }
{ "head-script-disabled": [true] }
{ "head-script-disabled": [true, {}] }
{ "head-script-disabled": [true, { "severity": "warn" }] }
{ "head-script-disabled": [false] }
```

## href-abs-or-rel

An href attribute must be either absolute or relative.

```json
{ "href-abs-or-rel": false }
{ "href-abs-or-rel": [false] }
{ "href-abs-or-rel": [true, { "mode": "absolute" }] }
{ "href-abs-or-rel": [true, { "mode": "absolute", "severity": "error" }] }
{ "href-abs-or-rel": [true, { "mode": "relative" }] }
```

-   needs rewrite

## id-class-ad-disabled

The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.

```json
{ "id-class-ad-disabled": false }
{ "id-class-ad-disabled": true }
{ "id-class-ad-disabled": [true] }
{ "id-class-ad-disabled": [true, {}] }
{ "id-class-ad-disabled": [true, { "severity": "warn" }] }
{ "id-class-ad-disabled": [false] }
```

## id-class-value

The id and class attribute values must meet the specified rules.

```json
{ "id-class-value": false }
{ "id-class-value": [false] }
{ "id-class-value": [true, { "mode": "underline" }] }
{ "id-class-value": [true, { "mode": "dash" }] }
{ "id-class-value": [true, { "mode": "hump", "severity": "warn" }] }
```

-   needs rewrite

## id-unique

The value of id attributes must be unique.

```json
{ "id-unique": false }
{ "id-unique": true }
{ "id-unique": [true] }
{ "id-unique": [true, {}] }
{ "id-unique": [true, { "severity": "warn" }] }
{ "id-unique": [false] }
```

htmlhint:recommended

## inline-script-disabled

Inline script cannot be used.

```json
{ "inline-script-disabled": false }
{ "inline-script-disabled": true }
{ "inline-script-disabled": [true] }
{ "inline-script-disabled": [true, {}] }
{ "inline-script-disabled": [true, { "severity": "warn" }] }
{ "inline-script-disabled": [false] }
```

## inline-style-disabled

Inline style cannot be used.

```json
{ "inline-style-disabled": false }
{ "inline-style-disabled": true }
{ "inline-style-disabled": [true] }
{ "inline-style-disabled": [true, {}] }
{ "inline-style-disabled": [true, { "severity": "warn" }] }
{ "inline-style-disabled": [false] }
```

## jshint

Scan script with jshint.

```json
{ "jshint": false }
{ "jshint": [false] }
// check for .jshintrc
{ "jshint": true }
{ "jshint": [true] }
// pass jshint config
{ "jshint": [true, { "config": { "curly": true } }] }
{ "jshint": [true, { "config": { "curly": true }, "severity": "error" }] }
{ "jshint": [true, { "config": { "curly": true }, "severity": "warn" }] }
```

-   needs rewrite to support reading .jshintrc

## space-tab-mixed-disabled

Do not mix tabs and spaces for indentation.

```json
{ "space-tab-mixed-disabled": false }
{ "space-tab-mixed-disabled": [false] }
{ "space-tab-mixed-disabled": [true, { "mode": "tab" }] }
{ "space-tab-mixed-disabled": [true, { "mode": "space", "severity": "error" }] }
{ "space-tab-mixed-disabled": [true, { "mode": "space4", "severity": "warn" }] }
```

-   needs rewrite
-   option to pass number for spaces

## spec-char-escape

Special characters must be escaped.

```json
{ "spec-char-escape": false }
{ "spec-char-escape": true }
{ "spec-char-escape": [true] }
{ "spec-char-escape": [true, {}] }
{ "spec-char-escape": [true, { "severity": "warn" }] }
{ "spec-char-escape": [false] }
```

htmlhint:recommended

## src-not-empty

The src attribute of an img(script,link) must have a value.

```json
{ "src-not-empty": false }
{ "src-not-empty": true }
{ "src-not-empty": [true] }
{ "src-not-empty": [true, {}] }
{ "src-not-empty": [true, { "severity": "warn" }] }
{ "src-not-empty": [false] }
```

htmlhint:recommended

## style-disabled

&lt;style&gt; tags cannot be used.

```json
{ "style-disabled": false }
{ "style-disabled": true }
{ "style-disabled": [true] }
{ "style-disabled": [true, {}] }
{ "style-disabled": [true, { "severity": "warn" }] }
{ "style-disabled": [false] }
```

## tag-pair

Tag must be paired.

```json
{ "tag-pair": false }
{ "tag-pair": true }
{ "tag-pair": [true] }
{ "tag-pair": [true, {}] }
{ "tag-pair": [true, { "severity": "warn" }] }
{ "tag-pair": [false] }
```

htmlhint:recommended

## tag-self-close

Empty tags must be self closed.

```json
{ "tag-self-close": false }
{ "tag-self-close": true }
{ "tag-self-close": [true] }
{ "tag-self-close": [true, {}] }
{ "tag-self-close": [true, { "severity": "warn" }] }
{ "tag-self-close": [false] }
```

## tagname-lowercase

All html element names must be in lowercase.

```json
{ "tagname-lowercase": false }
{ "tagname-lowercase": true }
{ "tagname-lowercase": [true] }
{ "tagname-lowercase": [true, {}] }
{ "tagname-lowercase": [true, { "severity": "warn" }] }
{ "tagname-lowercase": [false] }
```

htmlhint:recommended

## title-require

&lt;title&gt; must be present in &lt;head&gt; tag.

```json
{ "title-require": false }
{ "title-require": true }
{ "title-require": [true] }
{ "title-require": [true, {}] }
{ "title-require": [true, { "severity": "warn" }] }
{ "title-require": [false] }
```

htmlhint:recommended

# Type Definition

```ts
export type RuleSeverity = 'error' | 'warn';
export interface RuleOption {
    [key: string]: any;
    severity?: RuleSeverity;
}
export type RuleConfig = boolean | [boolean, RuleOption | undefined];
```
