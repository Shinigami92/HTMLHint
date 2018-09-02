import { altRequireRule } from './alt-require';
import { attrLowercaseRule } from './attr-lowercase';
import { attrNoDuplicationRule } from './attr-no-duplication';
import { attrUnsafeCharsRule } from './attr-unsafe-chars';
import { attrValueDoubleQuotes } from './attr-value-double-quotes';
import { attrValueNotEmpty } from './attr-value-not-empty';
import { csslintRule } from './csslint';
import { doctypeFirstRule } from './doctype-first';
import { doctypeHtml5Rule } from './doctype-html5';
import { headScriptDisabledRule } from './head-script-disabled';
import { hrefAbsOrRelRule } from './href-abs-or-rel';
import { Rule } from './html-rule';
import { idClassAdDisabledRule } from './id-class-ad-disabled';
import { idClassValueRule } from './id-class-value';
import { idUniqueRule } from './id-unique';
import { inlineScriptDisabledRule } from './inline-script-disabled';
import { inlineStyleDisabledRule } from './inline-style-disabled';
import { jshintRule } from './jshint';
import { spaceTabMixedDisabledRule } from './space-tab-mixed-disabled';
import { specCharEscapeRule } from './spec-char-escape';
import { srcNotEmptyRule } from './src-not-empty';
import { styleDisabledRule } from './style-disabled';
import { tagPairRule } from './tag-pair';
import { tagSelfCloseRule } from './tag-self-close';
import { tagnameLowercaseRule } from './tagname-lowercase';
import { titleRequireRule } from './title-require';

export const RULES: Rule[] = [
    altRequireRule,
    attrLowercaseRule,
    attrNoDuplicationRule,
    attrUnsafeCharsRule,
    attrValueDoubleQuotes,
    attrValueNotEmpty,
    csslintRule,
    doctypeFirstRule,
    doctypeHtml5Rule,
    headScriptDisabledRule,
    hrefAbsOrRelRule,
    idClassAdDisabledRule,
    idClassValueRule,
    idUniqueRule,
    inlineScriptDisabledRule,
    inlineStyleDisabledRule,
    jshintRule,
    spaceTabMixedDisabledRule,
    specCharEscapeRule,
    srcNotEmptyRule,
    styleDisabledRule,
    tagPairRule,
    tagSelfCloseRule,
    tagnameLowercaseRule,
    titleRequireRule
];

export {
    altRequireRule,
    attrLowercaseRule,
    attrNoDuplicationRule,
    attrUnsafeCharsRule,
    attrValueDoubleQuotes,
    attrValueNotEmpty,
    csslintRule,
    doctypeFirstRule,
    doctypeHtml5Rule,
    headScriptDisabledRule,
    hrefAbsOrRelRule,
    Rule,
    idClassAdDisabledRule,
    idClassValueRule,
    idUniqueRule,
    inlineScriptDisabledRule,
    inlineStyleDisabledRule,
    jshintRule,
    spaceTabMixedDisabledRule,
    specCharEscapeRule,
    srcNotEmptyRule,
    styleDisabledRule,
    tagPairRule,
    tagSelfCloseRule,
    tagnameLowercaseRule,
    titleRequireRule
};
