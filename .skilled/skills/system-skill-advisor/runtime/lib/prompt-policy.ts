// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Prompt Policy
// ───────────────────────────────────────────────────────────────

import { canonicalFold } from './shared/unicode-normalization.js';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PromptPolicyConfig {
  sets: {
    EXACT_SKIP_COMMANDS: string[];
    CASUAL_ACKNOWLEDGEMENTS: string[];
    WORK_INTENT_VERBS: string[];
    STOP_WORDS: string[];
    GOVERNANCE_MARKERS: string[];
  };
  thresholds: {
    MIN_VISIBLE_CHARS: number;
    MIN_MEANINGFUL_TOKENS: number;
    LENGTH_AND_TOKEN_VISIBLE_CHARS: number;
    LENGTH_AND_TOKEN_MEANINGFUL_FLOOR: number;
    LONG_NON_CASUAL_CHARS: number;
  };
}

const policyJsonPath = process.env.SPECKIT_ADVISOR_PROMPT_POLICY_PATH
  ?? join(__dirname, '..', 'data', 'prompt-policy.default.json');

function loadPolicyConfig(): PromptPolicyConfig {
  const raw = readFileSync(policyJsonPath, 'utf-8');
  return JSON.parse(raw) as PromptPolicyConfig;
}

const policyConfig = loadPolicyConfig();

const EXACT_SKIP_COMMANDS = new Set(policyConfig.sets.EXACT_SKIP_COMMANDS);
const CASUAL_ACKNOWLEDGEMENTS = new Set(policyConfig.sets.CASUAL_ACKNOWLEDGEMENTS);
const WORK_INTENT_VERBS = new Set(policyConfig.sets.WORK_INTENT_VERBS);
const STOP_WORDS = new Set(policyConfig.sets.STOP_WORDS);
const GOVERNANCE_MARKERS = policyConfig.sets.GOVERNANCE_MARKERS;

function resolveNumericThreshold(envName: string, defaultValue: number): number {
  const raw = process.env[envName];
  if (raw === undefined) return defaultValue;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) return defaultValue;
  return parsed;
}

const MIN_VISIBLE_CHARS = resolveNumericThreshold('SPECKIT_ADVISOR_PROMPT_POLICY_MIN_VISIBLE_CHARS', policyConfig.thresholds.MIN_VISIBLE_CHARS);
const MIN_MEANINGFUL_TOKENS = resolveNumericThreshold('SPECKIT_ADVISOR_PROMPT_POLICY_MEANINGFUL_TOKEN_FLOOR', policyConfig.thresholds.MIN_MEANINGFUL_TOKENS);
const LENGTH_AND_TOKEN_VISIBLE_CHARS = resolveNumericThreshold('SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_VISIBLE_CHARS', policyConfig.thresholds.LENGTH_AND_TOKEN_VISIBLE_CHARS);
const LENGTH_AND_TOKEN_MEANINGFUL_FLOOR = resolveNumericThreshold('SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_MEANINGFUL_FLOOR', policyConfig.thresholds.LENGTH_AND_TOKEN_MEANINGFUL_FLOOR);
const LONG_NON_CASUAL_CHARS = resolveNumericThreshold('SPECKIT_ADVISOR_PROMPT_POLICY_LONG_NON_CASUAL_CHARS', policyConfig.thresholds.LONG_NON_CASUAL_CHARS);

export interface AdvisorPromptPolicyResult {
  readonly fire: boolean;
  readonly reason: string;
  readonly canonicalPrompt: string;
  readonly meaningfulTokenCount: number;
  readonly visibleCharCount: number;
  readonly metalinguisticMentions: string[];
}

function normalizePrompt(prompt: string): string {
  return canonicalFold(prompt).replace(/\s+/g, ' ').trim();
}

function tokenize(prompt: string): string[] {
  return prompt
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9_-]*/g) ?? [];
}

function meaningfulTokens(tokens: string[]): string[] {
  return tokens.filter((token) => token.length > 0 && !STOP_WORDS.has(token));
}

function hasExplicitMarker(canonicalLower: string): boolean {
  return /\bsk-[a-z0-9][a-z0-9-]*\b/.test(canonicalLower)
    || /(?:^|\s)\/[a-z][a-z0-9:_-]*/.test(canonicalLower)
    || GOVERNANCE_MARKERS.some((marker) => canonicalLower.includes(marker));
}

function hasWorkIntentVerb(tokens: string[]): boolean {
  return tokens.some((token) => WORK_INTENT_VERBS.has(token));
}

/** Extract explicit `sk-*` mentions used for prompt-policy diagnostics. */
export function extractMetalinguisticSkillMentions(prompt: string): string[] {
  const canonicalLower = normalizePrompt(prompt).toLowerCase();
  return [...new Set(canonicalLower.match(/\bsk-[a-z0-9][a-z0-9-]*\b/g) ?? [])].sort();
}

/** Decide whether a user prompt should invoke the advisor producer. */
export function shouldFireAdvisor(prompt: string): AdvisorPromptPolicyResult {
  const canonicalPrompt = normalizePrompt(prompt);
  const canonicalLower = canonicalPrompt.toLowerCase();
  const tokens = tokenize(canonicalPrompt);
  const meaningful = meaningfulTokens(tokens);
  const visibleCharCount = canonicalPrompt.length;
  const metalinguisticMentions = extractMetalinguisticSkillMentions(canonicalPrompt);

  if (visibleCharCount === 0) {
    return {
      fire: false,
      reason: 'empty_prompt',
      canonicalPrompt,
      meaningfulTokenCount: 0,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (EXACT_SKIP_COMMANDS.has(canonicalLower)) {
    return {
      fire: false,
      reason: 'skip_command',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  const explicitMarker = hasExplicitMarker(canonicalLower);
  const workIntent = hasWorkIntentVerb(tokens);
  const casual = CASUAL_ACKNOWLEDGEMENTS.has(canonicalLower);

  if (!explicitMarker && !workIntent && visibleCharCount <= MIN_VISIBLE_CHARS && casual) {
    return {
      fire: false,
      reason: 'short_casual_acknowledgement',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (explicitMarker) {
    return {
      fire: true,
      reason: 'explicit_skill_or_governance_marker',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (workIntent && meaningful.length >= MIN_MEANINGFUL_TOKENS) {
    return {
      fire: true,
      reason: 'work_intent_with_meaningful_tokens',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (visibleCharCount >= LENGTH_AND_TOKEN_VISIBLE_CHARS && meaningful.length >= LENGTH_AND_TOKEN_MEANINGFUL_FLOOR) {
    return {
      fire: true,
      reason: 'length_and_token_threshold',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (visibleCharCount >= LONG_NON_CASUAL_CHARS && !casual) {
    return {
      fire: true,
      reason: 'long_non_casual_prompt',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  return {
    fire: false,
    reason: 'below_prompt_policy_threshold',
    canonicalPrompt,
    meaningfulTokenCount: meaningful.length,
    visibleCharCount,
    metalinguisticMentions,
  };
}
