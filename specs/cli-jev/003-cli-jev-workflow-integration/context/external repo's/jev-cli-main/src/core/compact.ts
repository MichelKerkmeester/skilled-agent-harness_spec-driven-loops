// Verbatim context compaction: ask Jev which old tool calls and results still
// matter, drop or truncate only those, never summarize. Wraps the vendored
// fast-jev-compaction library and feeds it jev-cli's provider.

import { limitConcurrency } from "../lib.js";
import type { AskFn, Usage } from "../provider.js";
import { compact, reductionRatio } from "../vendor/compaction/compact.js";
import type {
  CallDecision,
  CompactOptions,
  CompactResult,
  JevAsker,
  JevQuestions,
  JevState,
  Message,
} from "../vendor/compaction/types.js";

/** Matches `batch.concurrency`; the transport, not the transcript, is the constraint. */
export const DEFAULT_CONCURRENCY = 4;

export interface CompactInput extends CompactOptions {
  messages: readonly Message[];
  /** Below this reduction ratio the compaction is reported as not worth applying. */
  minReduction: number;
  /** Question batches in flight at once. Each carries the whole fitted state. */
  concurrency?: number;
}

export interface CompactOutput {
  command: "compact";
  model: string;
  provider: string;
  reduction: number;
  worth_it: boolean;
  min_reduction: number;
  stats: CompactResult["stats"];
  decisions: CallDecision[];
  messages: Message[];
  usage: Usage;
}

/** Adapt an `AskFn` to the library's `JevAsker`, accumulating usage across requests. */
export function askerFrom(ask: AskFn) {
  const usage: Usage = { input_tokens: 0, output_tokens: 0 };
  let model = "";
  let provider = "";
  const asker: JevAsker = {
    async ask(state: JevState, questions: JevQuestions) {
      const res = await ask(state, questions);
      usage.input_tokens += res.usage.input_tokens;
      usage.output_tokens += res.usage.output_tokens;
      model = res.model;
      provider = res.provider;
      return { answers: res.answers, model: res.model, usage: res.usage };
    },
  };
  return { asker, usage, meta: () => ({ model, provider }) };
}

export async function runCompact(ask: AskFn, input: CompactInput): Promise<CompactOutput> {
  const { messages, minReduction, concurrency = DEFAULT_CONCURRENCY, ...options } = input;
  if (messages.length === 0) throw new Error("Transcript has no messages.");
  // The library splits the questions into batches and awaits them together, and
  // every batch resends the whole fitted state, so an unbounded fan-out
  // multiplies the bytes in flight by the batch count.
  const { asker, usage, meta } = askerFrom(limitConcurrency(concurrency, ask));
  const result = await compact(messages, asker, options);
  const reduction = Number(reductionRatio(result).toFixed(4));
  const { model, provider } = meta();
  return {
    command: "compact",
    model,
    provider,
    reduction,
    worth_it: reduction >= minReduction,
    min_reduction: minReduction,
    stats: result.stats,
    decisions: result.decisions,
    messages: result.messages,
    usage,
  };
}

export const COMPACT_FAIL_CONDITIONS = ["low-reduction"] as const;
export type CompactFailCondition = (typeof COMPACT_FAIL_CONDITIONS)[number];

export function compactFailed(out: CompactOutput, conditions: readonly CompactFailCondition[]): boolean {
  return conditions.includes("low-reduction") && !out.worth_it;
}
