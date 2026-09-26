import { choice, noul } from "@typesafe-ai/sdk";
import {
  type ExistsVerdict,
  ensureUniqueIds,
  existsVerdict,
  MAX_CANDIDATE_CHARS,
  MAX_CANDIDATES,
  originalIds,
  rankCandidates,
  truncate,
} from "../lib.js";
import type { AskFn, Usage } from "../provider.js";

export interface CandidateInput {
  id?: string;
  text: string;
}

export interface FindInput {
  query: string;
  candidates: CandidateInput[];
  topK: number;
  /** exists probability at or above which the verdict is `answered`. */
  found: number;
  /** exists probability below which the verdict is `absent`. */
  absent: number;
}

export interface FindHit {
  id: string;
  probability: number;
  text: string;
}

export interface FindOutput {
  command: "find";
  model: string;
  provider: string;
  query: string;
  exists: number;
  exists_verdict: ExistsVerdict;
  top: FindHit[];
  usage: Usage;
}

export function buildFindRequest(input: Pick<FindInput, "query" | "candidates">) {
  if (input.query.trim().length === 0) throw new Error("Query must not be empty.");
  if (input.candidates.length === 0) throw new Error("At least one candidate is required.");
  if (input.candidates.length > MAX_CANDIDATES) {
    throw new Error(
      `Too many candidates (${input.candidates.length}); the limit is ${MAX_CANDIDATES} per call.`,
    );
  }
  const candidates = ensureUniqueIds(
    input.candidates.map((c) => ({ id: c.id ?? "", text: truncate(c.text, MAX_CANDIDATE_CHARS) })),
    "candidate",
  );
  const criteria: Record<string, null> = Object.fromEntries(candidates.map((c) => [c.id, null]));
  const questions: Record<string, unknown> = {
    best: choice(`Which candidate contains the best answer to: "${input.query}"?`, criteria),
    exists: noul(`Does any candidate address or answer: "${input.query}"?`, {
      true: "At least one candidate states or directly implies the answer",
      false: "No candidate addresses this",
    }),
  };
  const state = { query: input.query, candidates: candidates.map(({ id, text }) => ({ id, text })) };
  return { state, questions, candidates };
}

export async function runFind(ask: AskFn, input: FindInput): Promise<FindOutput> {
  if (input.absent > input.found) {
    throw new Error(`--absent (${input.absent}) must not exceed --found (${input.found}).`);
  }
  const { state, questions, candidates } = buildFindRequest(input);
  const { answers, usage, provider, model } = await ask(state, questions);

  const probabilities: Record<string, number> = answers.best?.probabilities ?? {};
  const ranked = rankCandidates(candidates, probabilities).slice(0, input.topK);
  const exists: number = typeof answers.exists?.noul === "number" ? answers.exists.noul : 0;
  // Report the caller's original ids, not the sanitized Choice keys.
  const original = originalIds(candidates);

  return {
    command: "find",
    model,
    provider,
    query: input.query,
    exists,
    exists_verdict: existsVerdict(exists, input.found, input.absent),
    top: ranked.map((c) => ({
      id: original.get(c.id) ?? c.id,
      probability: Number(c.probability.toFixed(4)),
      text: c.text,
    })),
    usage,
  };
}

export const FIND_FAIL_CONDITIONS = ["absent", "partial"] as const;
export type FindFailCondition = (typeof FIND_FAIL_CONDITIONS)[number];

export function findFailed(output: FindOutput, conditions: readonly FindFailCondition[]): boolean {
  return (conditions as readonly string[]).includes(output.exists_verdict);
}
