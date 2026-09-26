// In-process fake provider for core tests. Answers come from a fixed map or a
// function of the questions, and every call is recorded.

import { vi } from "vitest";
import type { AskFn, AskResult } from "../../src/provider.js";

export const USAGE = { input_tokens: 10, output_tokens: 2 };

export interface FakeAsk {
  ask: AskFn;
  calls: Array<{ state: unknown; questions: Record<string, unknown> }>;
}

export function fakeAsk(
  // biome-ignore lint/suspicious/noExplicitAny: tests poke at question shapes freely
  answers: Record<string, unknown> | ((questions: Record<string, any>) => Record<string, unknown>),
): FakeAsk {
  const calls: FakeAsk["calls"] = [];
  const ask: AskFn = vi.fn(async (state, questions) => {
    calls.push({ state, questions });
    const result: AskResult = {
      answers: typeof answers === "function" ? answers(questions) : answers,
      usage: USAGE,
      provider: "typesafe",
      model: "jev-1.13.0",
    };
    return result;
  });
  return { ask, calls };
}

/** A choice answer that picks `key` with the given confidence. */
export const pick = (key: string, confidence = 0.9) => ({
  type: "choice",
  choice: key,
  confidence,
  probabilities: { [key]: confidence },
});

export const yes = (p: number) => ({ type: "noul", noul: p });
