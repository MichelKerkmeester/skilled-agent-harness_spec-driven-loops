import { choice } from "@typesafe-ai/sdk";
import {
  ensureUniqueIds,
  originalIds,
  RELATION_TO_VERDICT,
  type Verdict,
  type VerifyAction,
  verifyAction,
} from "../lib.js";
import type { AskFn, Usage } from "../provider.js";

export interface EvidenceInput {
  id?: string;
  text: string;
}

export interface VerifyInput {
  claims: string[];
  evidence: EvidenceInput[];
  /** Verdicts at or above this confidence stand automatically. */
  autoAccept: number;
}

export interface VerifyResultItem {
  id: string;
  claim: string;
  verdict: Verdict;
  probabilities: Record<string, number> | null;
  confidence: number | null;
  action: VerifyAction;
  supporting_evidence: string | null;
}

export interface VerifyOutput {
  command: "verify";
  model: string;
  provider: string;
  auto_accept: number;
  summary: { verified: number; contradicted: number; unsupported: number; needs_review: number };
  results: VerifyResultItem[];
  usage: Usage;
}

/** Build the questions for a verify call. Exported for tests and the `ask --dry-run` path. */
export function buildVerifyRequest(input: Omit<VerifyInput, "autoAccept">) {
  if (input.claims.length === 0) throw new Error("At least one claim is required.");
  if (input.evidence.length === 0) throw new Error("At least one evidence item is required.");

  const evidence = ensureUniqueIds(input.evidence, "evidence");
  const claims = ensureUniqueIds(
    input.claims.map((text) => ({ text })),
    "claim",
  );

  const questions: Record<string, unknown> = {};
  for (const claim of claims) {
    questions[`relation_${claim.id}`] = choice(
      `How does the evidence relate to claim \`${claim.id}\` (${claim.text})?`,
      {
        supports: "The evidence states the claim or directly implies that it is true",
        contradicts: "The evidence states the opposite of the claim or implies that it is false",
        says_nothing: "The evidence does not address what the claim asserts, either way",
      },
    );
    if (evidence.length > 1) {
      const criteria: Record<string, string | null> = Object.fromEntries(evidence.map((e) => [e.id, null]));
      criteria.none = "No single evidence item contains the content the claim depends on";
      questions[`source_${claim.id}`] = choice(
        `Which evidence item does claim \`${claim.id}\` (${claim.text}) rest on?`,
        criteria,
      );
    }
  }

  const strip = <T extends { originalId: string }>(items: T[]) =>
    items.map(({ originalId: _, ...rest }) => rest);
  const state = {
    purpose: "Verify each claim in claims against the evidence in evidence.",
    claims: strip(claims),
    evidence: strip(evidence),
  };
  return { state, questions, claims, evidence };
}

export async function runVerify(ask: AskFn, input: VerifyInput): Promise<VerifyOutput> {
  const { state, questions, claims, evidence } = buildVerifyRequest(input);
  const { answers, usage, provider, model } = await ask(state, questions);
  const original = originalIds(evidence);

  const results: VerifyResultItem[] = claims.map((claim) => {
    const relation = answers[`relation_${claim.id}`];
    const source = answers[`source_${claim.id}`];
    const confidence: number | null = typeof relation?.confidence === "number" ? relation.confidence : null;
    const verdict = RELATION_TO_VERDICT[relation?.choice] ?? "unknown";
    return {
      id: claim.id,
      claim: claim.text,
      verdict,
      probabilities: relation?.probabilities ?? null,
      confidence,
      action: verifyAction(confidence, input.autoAccept),
      supporting_evidence:
        source?.choice && source.choice !== "none" ? (original.get(source.choice) ?? source.choice) : null,
    };
  });

  return {
    command: "verify",
    model,
    provider,
    auto_accept: input.autoAccept,
    summary: {
      verified: results.filter((r) => r.verdict === "verified").length,
      contradicted: results.filter((r) => r.verdict === "contradicted").length,
      unsupported: results.filter((r) => r.verdict === "unsupported").length,
      needs_review: results.filter((r) => r.action === "review").length,
    },
    results,
    usage,
  };
}

export const VERIFY_FAIL_CONDITIONS = ["contradicted", "unsupported", "review", "unknown"] as const;
export type VerifyFailCondition = (typeof VERIFY_FAIL_CONDITIONS)[number];

/** Does any result match a fail condition? */
export function verifyFailed(output: VerifyOutput, conditions: readonly VerifyFailCondition[]): boolean {
  return output.results.some(
    (r) =>
      (conditions.includes("contradicted") && r.verdict === "contradicted") ||
      (conditions.includes("unsupported") && r.verdict === "unsupported") ||
      (conditions.includes("unknown") && r.verdict === "unknown") ||
      (conditions.includes("review") && r.action === "review"),
  );
}
