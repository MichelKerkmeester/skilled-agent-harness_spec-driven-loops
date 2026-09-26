// Reranking: one independent relevance judgment (Noul) per candidate, all in
// one request. Unlike `find` (a Choice that always crowns a winner), scores here
// do not compete, so several candidates can be relevant or none can.
// Pattern: rerank_typesafe cookbook.

import { noul } from "@typesafe-ai/sdk";
import { ensureUniqueIds, MAX_CANDIDATE_CHARS, MAX_CANDIDATES, originalIds, truncate } from "../lib.js";
import type { AskFn, Usage } from "../provider.js";

export interface RerankCandidate {
  id?: string;
  text: string;
}

export interface RerankInput {
  query: string;
  candidates: RerankCandidate[];
  topK: number;
  /** Relevance at or above which a candidate is kept. */
  min: number;
  /** Optional description of what counts as relevant, e.g. "a passage that states the legal rule". */
  criteria?: string;
}

export interface RerankHit {
  id: string;
  relevance: number;
  kept: boolean;
  text: string;
}

export interface RerankOutput {
  command: "rerank";
  model: string;
  provider: string;
  query: string;
  ranked: RerankHit[];
  kept: string[];
  min: number;
  usage: Usage;
}

export function buildRerankRequest(input: Pick<RerankInput, "query" | "candidates" | "criteria">) {
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
  const what = input.criteria ?? "information that answers or directly addresses the query";
  const questions: Record<string, unknown> = {};
  for (const c of candidates) {
    questions[c.id] = noul(`Does candidate \`candidates.${c.id}\` contain ${what}?`, {
      true: "The candidate states or directly implies what the query asks for",
      false: "The candidate is off-topic or only superficially related",
    });
  }
  const state = {
    query: input.query,
    candidates: Object.fromEntries(candidates.map((c) => [c.id, c.text])),
  };
  return { state, questions, candidates };
}

export async function runRerank(ask: AskFn, input: RerankInput): Promise<RerankOutput> {
  const { state, questions, candidates } = buildRerankRequest(input);
  const { answers, usage, provider, model } = await ask(state, questions);
  const original = originalIds(candidates);
  const scored = candidates
    .map((c, index) => ({
      id: original.get(c.id) ?? c.id,
      relevance: Number((typeof answers[c.id]?.noul === "number" ? answers[c.id].noul : 0).toFixed(4)),
      text: c.text,
      index,
    }))
    .sort((a, b) => b.relevance - a.relevance || a.index - b.index);
  const ranked: RerankHit[] = scored
    .slice(0, input.topK)
    .map(({ index: _, ...hit }) => ({ ...hit, kept: hit.relevance >= input.min }));
  return {
    command: "rerank",
    model,
    provider,
    query: input.query,
    ranked,
    kept: ranked.filter((h) => h.kept).map((h) => h.id),
    min: input.min,
    usage,
  };
}

export const RERANK_FAIL_CONDITIONS = ["empty"] as const;
export type RerankFailCondition = (typeof RERANK_FAIL_CONDITIONS)[number];

export function rerankFailed(out: RerankOutput, conditions: readonly RerankFailCondition[]): boolean {
  return conditions.includes("empty") && out.kept.length === 0;
}
