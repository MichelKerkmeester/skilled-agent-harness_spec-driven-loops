// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Semantic Vetoes
// ───────────────────────────────────────────────────────────────────

import { FidelityReasonCodes } from './types.js';

import type { FidelityReasonCode } from './types.js';

/** Content-free semantic mismatch evidence. */
export interface SemanticDifference {
  readonly reasonCode: Exclude<FidelityReasonCode, 'accepted'>;
  readonly expectedCount: number;
  readonly actualCount: number;
}

interface SemanticSignature {
  readonly facts: ReadonlyMap<string, number>;
  readonly polarity: ReadonlyMap<string, number>;
  readonly requirementStrength: ReadonlyMap<string, number>;
  readonly priority: ReadonlyMap<string, number>;
  readonly uncertainty: ReadonlyMap<string, number>;
  readonly caveats: ReadonlyMap<string, number>;
  readonly directives: ReadonlyMap<string, number>;
}

const COMMON_CAPITALIZED_WORDS = new Set([
  'a',
  'after',
  'an',
  'and',
  'as',
  'at',
  'before',
  'but',
  'do',
  'for',
  'from',
  'however',
  'if',
  'in',
  'it',
  'keep',
  'next',
  'no',
  'not',
  'on',
  'or',
  'run',
  'set',
  'that',
  'the',
  'then',
  'there',
  'this',
  'to',
  'use',
  'when',
  'with',
]);

/** Return the first deterministic semantic veto in fixed rule order. */
export function compareSemanticMeaning(
  sourceText: string,
  candidateText: string,
): SemanticDifference | null {
  const source = createSemanticSignature(sourceText);
  const candidate = createSemanticSignature(candidateText);

  const addedFacts = countMapDifference(candidate.facts, source.facts);
  if (addedFacts > 0) {
    return {
      reasonCode: FidelityReasonCodes.FACT_ADDED,
      expectedCount: totalCount(source.facts),
      actualCount: totalCount(candidate.facts),
    };
  }
  const omittedFacts = countMapDifference(source.facts, candidate.facts);
  if (omittedFacts > 0) {
    return {
      reasonCode: FidelityReasonCodes.FACT_OMITTED,
      expectedCount: totalCount(source.facts),
      actualCount: totalCount(candidate.facts),
    };
  }

  const checks = [
    [source.polarity, candidate.polarity, FidelityReasonCodes.POLARITY_CHANGED],
    [
      source.requirementStrength,
      candidate.requirementStrength,
      FidelityReasonCodes.REQUIREMENT_STRENGTH_CHANGED,
    ],
    [source.priority, candidate.priority, FidelityReasonCodes.PRIORITY_CHANGED],
    [source.uncertainty, candidate.uncertainty, FidelityReasonCodes.UNCERTAINTY_CHANGED],
    [source.caveats, candidate.caveats, FidelityReasonCodes.CAVEAT_CHANGED],
    [source.directives, candidate.directives, FidelityReasonCodes.NEXT_STEP_CHANGED],
  ] as const;
  for (const [expected, actual, reasonCode] of checks) {
    if (!mapsEqual(expected, actual)) {
      return {
        reasonCode,
        expectedCount: totalCount(expected),
        actualCount: totalCount(actual),
      };
    }
  }
  return null;
}

// Modal words mark claim sentences and function words carry no claim content. Both
// stay out of the comparison so a rewording passes when the claim itself survives.

const CLAIM_MARKER_PATTERN = /\b(?:must|never|always|only|should|cannot|required|unless|except|but|however|note that)\b/u;

const CLAIM_FUNCTION_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'of',
  'to',
  'in',
  'on',
  'at',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'it',
  'its',
  'that',
  'this',
  'with',
  'as',
  'for',
  'by',
  'from',
  'not',
  'no',
  'do',
  'does',
  'did',
  'has',
  'have',
  'had',
  'you',
  'your',
  'we',
  'our',
  'they',
  'their',
  'if',
  'then',
  'than',
  'so',
  'there',
  'here',
  'will',
  'would',
  'can',
  'could',
  'may',
  'might',
  'also',
  'when',
  'while',
  'what',
  'which',
  'who',
  'how',
  'why',
  'each',
  'into',
  'just',
  'too',
  'very',
  'both',
  'all',
  'any',
  'some',
]);

/** Return the claim-omission veto when a source claim misses from the candidate. */
export function compareClaimCoverage(
  sourceText: string,
  candidateText: string,
): SemanticDifference | null {
  const claimSentences = extractClaimSentences(sourceText);
  if (claimSentences.length === 0) {
    return null;
  }
  const candidateStems = new Set(
    lowercaseWords(candidateText).map((word) => stemWord(word)),
  );
  let survivingClaims = 0;
  for (const sentence of claimSentences) {
    if (claimSurvives(sentence, candidateStems)) {
      survivingClaims += 1;
    }
  }
  if (survivingClaims === claimSentences.length) {
    return null;
  }
  return {
    reasonCode: FidelityReasonCodes.CLAIM_OMITTED,
    expectedCount: claimSentences.length,
    actualCount: survivingClaims,
  };
}

/** Detect provider refusals that replace a non-refusal source. */
export function isUnexpectedRefusal(sourceText: string, candidateText: string): boolean {
  const refusal = /(?:^|\n)\s*(?:sorry\b|i\s+(?:cannot|can't|won't|am unable to)\b|as an ai\b|i must decline\b|i am not able to\b)/iu;
  return refusal.test(candidateText) && !refusal.test(sourceText);
}

/** Count non-whitespace codepoints for bounded truncation checks. */
export function countContentCodepoints(value: string): number {
  return [...value.replace(/\s/gu, '')].length;
}

function createSemanticSignature(value: string): SemanticSignature {
  return {
    facts: createFactMap(value),
    polarity: createCategoryMap(value, {
      negative: /\b(?:no|not|never|neither|nor|without|unchanged|disabled|failed|fails|cannot|can't|won't)\b/giu,
      prohibition: /\b(?:must\s+not|do\s+not|never|cannot|can't|prohibited|forbidden)\b/giu,
    }),
    requirementStrength: createCategoryMap(value, {
      strong: /\b(?:must|shall|required|requires|need\s+to|needs\s+to|has\s+to|have\s+to|cannot|never|prohibited|forbidden)\b/giu,
      medium: /\b(?:should|recommended|ought\s+to|expected\s+to)\b/giu,
      weak: /\b(?:may|might|can|could|optional|optionally)\b/giu,
    }),
    priority: createCategoryMap(value, {
      critical: /\b(?:critical|highest|urgent)\b/giu,
      high: /\bhigh(?:est)?(?:[ -]priority)?\b/giu,
      medium: /\bmedium(?:[ -]priority)?\b/giu,
      low: /\blow(?:est)?(?:[ -]priority)?\b/giu,
    }),
    uncertainty: createCategoryMap(value, {
      uncertainty: /\b(?:approximately|about|estimated|inferred|may|might|could|possibly|perhaps|uncertain|unknown|unverified|provisional)\b/giu,
    }),
    caveats: createCategoryMap(value, {
      caveat: /\b(?:although|but|except|however|only\s+if|provided\s+that|subject\s+to|unless|warning|limitation|yet)\b/giu,
    }),
    directives: createDirectiveMap(value),
  };
}

function createFactMap(value: string): ReadonlyMap<string, number> {
  const facts = new Map<string, number>();
  for (const match of value.matchAll(/\b\d+(?:[.,]\d+)*(?:\s?(?:%|ms|s|min|h|B|KB|MB|GB|KiB|MiB|GiB|px|rem|em|Hz|kHz|MHz|GHz))?\b/gu)) {
    increment(facts, `number:${match[0].toLowerCase()}`);
  }
  for (const match of value.matchAll(/\b\p{Lu}[\p{L}\p{N}-]{2,}\b/gu)) {
    const word = match[0];
    if (!COMMON_CAPITALIZED_WORDS.has(word.toLowerCase())) {
      increment(facts, `entity:${word}`);
    }
  }
  return facts;
}

function createDirectiveMap(value: string): ReadonlyMap<string, number> {
  const hasDirectiveContext = /\b(?:after|before|finally|first|next|then)\b|(?:^|\n)\s*(?:[-+*]|\d+[.)])\s+/iu.test(value);
  if (!hasDirectiveContext) {
    return new Map();
  }
  return createCategoryMap(value, {
    build: /\b(?:build|create|generate)\b/giu,
    continue: /\b(?:continue|proceed|resume)\b/giu,
    inspect: /\b(?:check|inspect|review|verify)\b/giu,
    preserve: /\b(?:keep|preserve|retain)\b/giu,
    remove: /\b(?:delete|remove)\b/giu,
    restart: /\b(?:restart|relaunch)\b/giu,
    run: /\b(?:execute|run)\b/giu,
    update: /\b(?:change|edit|update)\b/giu,
    use: /\b(?:apply|use)\b/giu,
  });
}

function createCategoryMap(
  value: string,
  patterns: Readonly<Record<string, RegExp>>,
): ReadonlyMap<string, number> {
  const result = new Map<string, number>();
  for (const [category, pattern] of Object.entries(patterns)) {
    const count = [...value.matchAll(pattern)].length;
    if (count > 0) {
      result.set(category, count);
    }
  }
  return result;
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function mapsEqual(
  left: ReadonlyMap<string, number>,
  right: ReadonlyMap<string, number>,
): boolean {
  return left.size === right.size
    && [...left].every(([key, value]) => right.get(key) === value);
}

function countMapDifference(
  left: ReadonlyMap<string, number>,
  right: ReadonlyMap<string, number>,
): number {
  let difference = 0;
  for (const [key, count] of left) {
    difference += Math.max(0, count - (right.get(key) ?? 0));
  }
  return difference;
}

function totalCount(map: ReadonlyMap<string, number>): number {
  return [...map.values()].reduce((total, count) => total + count, 0);
}

// A causal connective orders two clauses. A rewrite that keeps both clauses and swaps
// which one is the cause keeps every content word, so the claim check passes it and the
// direction has to be compared on its own. Only the connectives whose order is fixed are
// read, and a pair counts as inverted only when the candidate states the same two clauses
// the other way round.

const EFFECT_THEN_CAUSE_PATTERN = /^(.+?)\s+(?:because|since|due to|as a result of)\s+(.+)$/iu;

const CAUSE_THEN_EFFECT_PATTERN = /^(.+?)\s+(?:therefore|hence|which is why|leads to|led to|causes|caused|results in|resulted in)\s+(.+)$/iu;

interface CausalPair {
  readonly cause: ReadonlySet<string>;
  readonly effect: ReadonlySet<string>;
}

/**
 * Compare the direction of every causal claim the source states.
 *
 * A rewrite that keeps both clauses and swaps which one is the cause keeps every
 * content word, so the claim check passes it. Direction has to be compared on its own.
 *
 * @param sourceText - The author's original text
 * @param candidateText - The rewritten candidate
 * @returns A CAUSE_INVERTED difference when the candidate states a source pair the other
 * way round, or null when every pair survives or the candidate dropped it entirely,
 * which {@link compareClaimCoverage} owns.
 */
export function compareCausalDirection(
  sourceText: string,
  candidateText: string,
): SemanticDifference | null {
  const sourcePairs = extractCausalPairs(sourceText);
  if (sourcePairs.length === 0) {
    return null;
  }
  const candidatePairs = extractCausalPairs(candidateText);
  let inverted = 0;
  for (const pair of sourcePairs) {
    const preserved = candidatePairs.some(
      (candidate) => stemsCovered(pair.cause, candidate.cause)
        && stemsCovered(pair.effect, candidate.effect),
    );
    if (preserved) {
      continue;
    }
    const swapped = candidatePairs.some(
      (candidate) => stemsCovered(pair.cause, candidate.effect)
        && stemsCovered(pair.effect, candidate.cause),
    );
    if (swapped) {
      inverted += 1;
    }
  }
  if (inverted === 0) {
    return null;
  }
  return {
    reasonCode: FidelityReasonCodes.CAUSE_INVERTED,
    expectedCount: sourcePairs.length,
    actualCount: sourcePairs.length - inverted,
  };
}

function extractCausalPairs(text: string): CausalPair[] {
  const sentences = text.match(/[^.!?]+[.!?]*/gu) ?? [];
  const pairs: CausalPair[] = [];
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    const effectFirst = EFFECT_THEN_CAUSE_PATTERN.exec(trimmed);
    if (effectFirst !== null) {
      pairs.push({ effect: contentStems(effectFirst[1] ?? ''), cause: contentStems(effectFirst[2] ?? '') });
      continue;
    }
    const causeFirst = CAUSE_THEN_EFFECT_PATTERN.exec(trimmed);
    if (causeFirst !== null) {
      pairs.push({ cause: contentStems(causeFirst[1] ?? ''), effect: contentStems(causeFirst[2] ?? '') });
    }
  }
  return pairs.filter((pair) => pair.cause.size > 0 && pair.effect.size > 0);
}

function contentStems(clause: string): Set<string> {
  const stems = new Set<string>();
  for (const word of lowercaseWords(clause)) {
    if (word.length < 2 || CLAIM_FUNCTION_WORDS.has(word)) {
      continue;
    }
    stems.add(stemWord(word));
  }
  return stems;
}

function stemsCovered(expected: ReadonlySet<string>, actual: ReadonlySet<string>): boolean {
  for (const stem of expected) {
    if (!actual.has(stem) && !actual.has(`${stem}e`)) {
      return false;
    }
  }
  return true;
}

function extractClaimSentences(sourceText: string): string[] {
  const sentences = sourceText.match(/[^.!?]+[.!?]*/gu) ?? [];
  return sentences.filter((sentence) => CLAIM_MARKER_PATTERN.test(sentence));
}

function claimSurvives(sentence: string, candidateStems: ReadonlySet<string>): boolean {
  return lowercaseWords(sentence).every((word) => {
    if (word.length < 2 || CLAIM_FUNCTION_WORDS.has(word)) {
      return true;
    }
    const stem = stemWord(word);
    return candidateStems.has(stem) || candidateStems.has(`${stem}e`);
  });
}

function lowercaseWords(value: string): string[] {
  return value.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
}

function stemWord(word: string): string {
  let stem = word;
  if (stem.length > 4 && stem.endsWith('ies')) {
    return `${stem.slice(0, -3)}y`;
  }
  if (stem.length > 4 && stem.endsWith('ing')) {
    stem = stem.slice(0, -3);
  } else if (stem.length > 4 && stem.endsWith('ed')) {
    stem = stem.slice(0, -2);
  } else if (
    stem.length > 3
    && stem.endsWith('s')
    && !stem.endsWith('ss')
    && !stem.endsWith('us')
    && !stem.endsWith('is')
  ) {
    stem = stem.slice(0, -1);
  }
  if (stem.length > 3 && stem.endsWith('e') && !stem.endsWith('ee')) {
    stem = stem.slice(0, -1);
  }
  return stem;
}
