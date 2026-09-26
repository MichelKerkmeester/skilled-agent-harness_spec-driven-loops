// Entity matching: do two records describe the same thing? One Score per pair
// whose three levels are the three things you can do with a pair: unlink it,
// hand it to a person, or merge it. No threshold to tune; the winning level is
// the decision. Pattern: entity_alignment cookbook.

import { score } from "@typesafe-ai/sdk";
import { chunk, sanitizeId } from "../lib.js";
import type { AskFn, Usage } from "../provider.js";

export interface MatchItem {
  id?: string;
  text: string;
}

export interface MatchPair {
  left: MatchItem;
  right: MatchItem;
}

export type MatchDecision = "different" | "unclear" | "same";

export const MATCH_LEVELS: Record<MatchDecision, string> = {
  different:
    "Different things: the records disagree on an identifying attribute or clearly describe distinct entities",
  unclear:
    "Cannot tell: the records are compatible but neither confirms nor rules out that they are the same",
  same: "Same thing: the records describe one entity, allowing for formatting, abbreviations, or partial information",
};

const LEVEL_ORDER: MatchDecision[] = ["different", "unclear", "same"];

/** Cap on pairs per call so the question count stays well inside the request budget. */
export const MAX_PAIRS = 200;
/** Pairs per API request; more pairs are sent in sequential chunks. */
export const PAIRS_PER_REQUEST = 50;

export interface MatchInput {
  pairs: MatchPair[];
  /** What kind of thing the records are, e.g. "products in a beer catalogue". */
  kind?: string;
}

export interface MatchResult {
  left: string;
  right: string;
  left_text: string;
  right_text: string;
  decision: MatchDecision;
  score: number | null;
  confidence: number | null;
  probabilities: Record<MatchDecision, number>;
}

export interface MatchOutput {
  command: "match";
  model: string;
  provider: string;
  results: MatchResult[];
  summary: Record<MatchDecision, number>;
  usage: Usage;
}

/** All pairs within one list (i < j). */
export function allPairs(items: MatchItem[]): MatchPair[] {
  const pairs: MatchPair[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) pairs.push({ left: items[i]!, right: items[j]! });
  }
  return pairs;
}

/** Cross product of two lists. */
export function crossPairs(left: MatchItem[], right: MatchItem[]): MatchPair[] {
  const pairs: MatchPair[] = [];
  for (const l of left) for (const r of right) pairs.push({ left: l, right: r });
  return pairs;
}

function labelOf(item: MatchItem, fallback: string): string {
  return item.id ?? fallback;
}

export function buildMatchRequest(pairs: MatchPair[], kind: string | undefined, offset = 0) {
  const what = kind ? `these ${kind}` : "these records";
  const questions: Record<string, unknown> = {};
  const state: Record<string, unknown> = {};
  pairs.forEach((pair, i) => {
    const key = `pair${offset + i}`;
    state[key] = {
      left: { id: labelOf(pair.left, `left${offset + i}`), text: pair.left.text },
      right: { id: labelOf(pair.right, `right${offset + i}`), text: pair.right.text },
    };
    questions[key] = score(`Do \`${key}.left\` and \`${key}.right\` describe the same one of ${what}?`, [
      MATCH_LEVELS.different,
      MATCH_LEVELS.unclear,
      MATCH_LEVELS.same,
    ]);
  });
  return { state: { kind: kind ?? null, pairs: state }, questions };
}

export async function runMatch(ask: AskFn, input: MatchInput): Promise<MatchOutput> {
  if (input.pairs.length === 0) throw new Error("At least one pair is required.");
  if (input.pairs.length > MAX_PAIRS) {
    throw new Error(
      `Too many pairs (${input.pairs.length}); the limit is ${MAX_PAIRS} per call. Pre-block candidates first.`,
    );
  }
  const usage: Usage = { input_tokens: 0, output_tokens: 0 };
  let model = "";
  let provider = "";
  const results: MatchResult[] = [];
  let offset = 0;
  for (const group of chunk(input.pairs, PAIRS_PER_REQUEST)) {
    const { state, questions } = buildMatchRequest(group, input.kind, offset);
    const res = await ask(state, questions);
    usage.input_tokens += res.usage.input_tokens;
    usage.output_tokens += res.usage.output_tokens;
    model = res.model;
    provider = res.provider;
    group.forEach((pair, i) => {
      const a = res.answers[`pair${offset + i}`];
      const raw: Record<string, number> = a?.probabilities ?? {};
      const probabilities = Object.fromEntries(
        LEVEL_ORDER.map((level, idx) => [level, Number((raw[String(idx)] ?? 0).toFixed(4))]),
      ) as Record<MatchDecision, number>;
      const decision = a
        ? LEVEL_ORDER.reduce(
            (best, level) => (probabilities[level] > probabilities[best] ? level : best),
            "different",
          )
        : "unclear";
      results.push({
        left: labelOf(pair.left, `left${offset + i}`),
        right: labelOf(pair.right, `right${offset + i}`),
        left_text: pair.left.text,
        right_text: pair.right.text,
        decision,
        score: typeof a?.score === "number" ? Number(a.score.toFixed(4)) : null,
        confidence: typeof a?.confidence === "number" ? a.confidence : null,
        probabilities,
      });
    });
    offset += group.length;
  }
  return {
    command: "match",
    model,
    provider,
    results,
    summary: {
      different: results.filter((r) => r.decision === "different").length,
      unclear: results.filter((r) => r.decision === "unclear").length,
      same: results.filter((r) => r.decision === "same").length,
    },
    usage,
  };
}

export const MATCH_FAIL_CONDITIONS = ["same", "unclear", "different"] as const;
export type MatchFailCondition = (typeof MATCH_FAIL_CONDITIONS)[number];

export function matchFailed(out: MatchOutput, conditions: readonly MatchFailCondition[]): boolean {
  return out.results.some((r) => (conditions as readonly string[]).includes(r.decision));
}

/** Stable key for a match item, used for dedupe grouping. */
export function itemKey(item: MatchItem, fallback: string): string {
  return sanitizeId(item.id ?? "") || fallback;
}
