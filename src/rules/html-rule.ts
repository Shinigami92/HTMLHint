import { HTMLParser } from '../htmlparser';
import { Reporter } from '../reporter';

export interface Rule {
    id: string;
    description: string;
    init: (parser: HTMLParser, reporter: Reporter, options: RuleConfig) => void;
}

export interface RuleRegistry {
    [ruleId: string]: Rule;
}

export interface RuleConfigMap {
    [ruleId: string]: RuleConfig;
}

export type RuleConfig = boolean;
