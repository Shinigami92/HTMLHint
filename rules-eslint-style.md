# Rules

## alt-require

The alt attribute of an &lt;img&gt; element must be present and alt attribute of area[href] and input[type=image] must have a value.

```json
{ "alt-require": "off" }
{ "alt-require": "error" }
{ "alt-require": "warn" }
{ "alt-require": ["off"] }
{ "alt-require": ["error"] }
{ "alt-require": ["warn"] }
```

## attr-lowercase

All attribute names must be in lowercase.

```json
{ "attr-lowercase": "off" }
{ "attr-lowercase": "error" }
{ "attr-lowercase": "warn" }
{ "attr-lowercase": ["off"] }
{ "attr-lowercase": ["error", { "exceptions": ["viewBox"] }] }
{ "attr-lowercase": ["warn", { "exceptions": ["viewBox"] }] }
```

htmlhint:recommended

## attr-no-duplication

Elements cannot have duplicate attributes.

```json
{ "attr-no-duplication": "off" }
{ "attr-no-duplication": "error" }
{ "attr-no-duplication": "warn" }
{ "attr-no-duplication": ["off"] }
{ "attr-no-duplication": ["error"] }
{ "attr-no-duplication": ["warn"] }
```

htmlhint:recommended

## attr-unsafe-chars

Attribute values cannot contain unsafe chars.

```json
{ "attr-unsafe-chars": "off" }
{ "attr-unsafe-chars": "error" }
{ "attr-unsafe-chars": "warn" }
{ "attr-unsafe-chars": ["off"] }
{ "attr-unsafe-chars": ["error"] }
{ "attr-unsafe-chars": ["warn"] }
```

## attr-value-double-quotes

Attribute values must be in double quotes.

```json
{ "attr-value-double-quotes": "off" }
{ "attr-value-double-quotes": "error" }
{ "attr-value-double-quotes": "warn" }
{ "attr-value-double-quotes": ["off"] }
{ "attr-value-double-quotes": ["error"] }
{ "attr-value-double-quotes": ["warn"] }
```

htmlhint:recommended

-   option to use single or double quotes

## attr-value-not-empty

All attributes must have values.

```json
{ "attr-value-not-empty": "off" }
{ "attr-value-not-empty": "error" }
{ "attr-value-not-empty": "warn" }
{ "attr-value-not-empty": ["off"] }
{ "attr-value-not-empty": ["error"] }
{ "attr-value-not-empty": ["warn"] }
```

## csslint

Scan css with csslint.

```json
// check for .csslintrc
{ "csslint": "off" }
{ "csslint": "error" }
{ "csslint": "warn" }
{ "csslint": ["off"] }
// pass csslint config
{ "csslint": ["error", { "vendor-prefix": true }] }
{ "csslint": ["warn", { "vendor-prefix": true }] }
```

-   needs rewrite to support reading .csslintrc

## doctype-first

Doctype must be declared first.

```json
{ "doctype-first": "off" }
{ "doctype-first": "error" }
{ "doctype-first": "warn" }
{ "doctype-first": ["off"] }
{ "doctype-first": ["error"] }
{ "doctype-first": ["warn"] }
```

htmlhint:recommended

-   option to check only root index.html

## doctype-html5

Invalid doctype. Use: "&lt;!DOCTYPE html&gt;"

```json
{ "doctype-html5": "off" }
{ "doctype-html5": "error" }
{ "doctype-html5": "warn" }
{ "doctype-html5": ["off"] }
{ "doctype-html5": ["error"] }
{ "doctype-html5": ["warn"] }
```

-   needs to be more generic (html4, html5 xhtml)

## head-script-disabled

The &lt;script&gt; tag cannot be used in a &lt;head&gt; tag.

```json
{ "head-script-disabled": "off" }
{ "head-script-disabled": "error" }
{ "head-script-disabled": "warn" }
{ "head-script-disabled": ["off"] }
{ "head-script-disabled": ["error"] }
{ "head-script-disabled": ["warn"] }
```

## href-abs-or-rel

An href attribute must be either absolute or relative.

```json
{ "href-abs-or-rel": "off" }
{ "href-abs-or-rel": ["off"] }
{ "href-abs-or-rel": ["error", { "mode": "absolute" }] }
{ "href-abs-or-rel": ["warn", { "mode": "relative" }] }
```

-   needs rewrite

## id-class-ad-disabled

The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.

```json
{ "id-class-ad-disabled": "off" }
{ "id-class-ad-disabled": "error" }
{ "id-class-ad-disabled": "warn" }
{ "id-class-ad-disabled": ["off"] }
{ "id-class-ad-disabled": ["error"] }
{ "id-class-ad-disabled": ["warn"] }
```

## id-class-value

The id and class attribute values must meet the specified rules.

```json
{ "id-class-value": "off" }
{ "id-class-value": ["off"] }
{ "id-class-value": ["error", { "mode": "underline" }] }
{ "id-class-value": ["warn", { "mode": "dash" }] }
{ "id-class-value": ["warn", { "mode": "hump" }] }
```

-   needs rewrite

## id-unique

The value of id attributes must be unique.

```json
{ "id-unique": "off" }
{ "id-unique": "error" }
{ "id-unique": "warn" }
{ "id-unique": ["off"] }
{ "id-unique": ["error"] }
{ "id-unique": ["warn"] }
```

htmlhint:recommended

## inline-script-disabled

Inline script cannot be used.

```json
{ "inline-script-disabled": "off" }
{ "inline-script-disabled": "error" }
{ "inline-script-disabled": "warn" }
{ "inline-script-disabled": ["off"] }
{ "inline-script-disabled": ["error"] }
{ "inline-script-disabled": ["warn"] }
```

## inline-style-disabled

Inline style cannot be used.

```json
{ "inline-style-disabled": "off" }
{ "inline-style-disabled": "error" }
{ "inline-style-disabled": "warn" }
{ "inline-style-disabled": ["off"] }
{ "inline-style-disabled": ["error"] }
{ "inline-style-disabled": ["warn"] }
```

## jshint

Scan script with jshint.

```json
// check for .jshintrc
{ "jshint": "off" }
{ "jshint": "error" }
{ "jshint": "warn" }
{ "jshint": ["off"] }
// pass jshint config
{ "jshint": ["error", { "curly": true }] }
{ "jshint": ["warn", { "curly": true }] }
```

-   needs rewrite to support reading .jshintrc

## space-tab-mixed-disabled

Do not mix tabs and spaces for indentation.

```json
{ "space-tab-mixed-disabled": "off" }
{ "space-tab-mixed-disabled": ["off"] }
{ "space-tab-mixed-disabled": ["error", { "mode": "tab" }] }
{ "space-tab-mixed-disabled": ["warn", { "mode": "space" }] }
{ "space-tab-mixed-disabled": ["warn", { "mode": "space4" }] }
```

-   needs rewrite
-   option to pass number for spaces

## spec-char-escape

Special characters must be escaped.

```json
{ "spec-char-escape": "off" }
{ "spec-char-escape": "error" }
{ "spec-char-escape": "warn" }
{ "spec-char-escape": ["off"] }
{ "spec-char-escape": ["error"] }
{ "spec-char-escape": ["warn"] }
```

htmlhint:recommended

## src-not-empty

The src attribute of an img(script,link) must have a value.

```json
{ "src-not-empty": "off" }
{ "src-not-empty": "error" }
{ "src-not-empty": "warn" }
{ "src-not-empty": ["off"] }
{ "src-not-empty": ["error"] }
{ "src-not-empty": ["warn"] }
```

htmlhint:recommended

## style-disabled

&lt;style&gt; tags cannot be used.

```json
{ "style-disabled": "off" }
{ "style-disabled": "error" }
{ "style-disabled": "warn" }
{ "style-disabled": ["off"] }
{ "style-disabled": ["error"] }
{ "style-disabled": ["warn"] }
```

## tag-pair

Tag must be paired.

```json
{ "tag-pair": "off" }
{ "tag-pair": "error" }
{ "tag-pair": "warn" }
{ "tag-pair": ["off"] }
{ "tag-pair": ["error"] }
{ "tag-pair": ["warn"] }
```

htmlhint:recommended

## tag-self-close

Empty tags must be self closed.

```json
{ "tag-self-close": "off" }
{ "tag-self-close": "error" }
{ "tag-self-close": "warn" }
{ "tag-self-close": ["off"] }
{ "tag-self-close": ["error"] }
{ "tag-self-close": ["warn"] }
```

## tagname-lowercase

All html element names must be in lowercase.

```json
{ "tagname-lowercase": "off" }
{ "tagname-lowercase": "error" }
{ "tagname-lowercase": "warn" }
{ "tagname-lowercase": ["off"] }
{ "tagname-lowercase": ["error"] }
{ "tagname-lowercase": ["warn"] }
```

htmlhint:recommended

## title-require

&lt;title&gt; must be present in &lt;head&gt; tag.

```json
{ "title-require": "off" }
{ "title-require": "error" }
{ "title-require": "warn" }
{ "title-require": ["off"] }
{ "title-require": ["error"] }
{ "title-require": ["warn"] }
```

htmlhint:recommended

# Type Definition

```ts
export type RuleSeverity = 'off' | 'error' | 'warn';
export type RuleConfig = RuleSeverity | [RuleSeverity, { [key: string]: any } | undefined];
```
