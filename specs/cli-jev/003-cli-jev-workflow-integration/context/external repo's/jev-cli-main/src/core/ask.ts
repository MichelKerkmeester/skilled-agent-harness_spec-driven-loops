// Raw System One passthrough: any state, any questions, typed answers back.
// Question shorthands let you compose a request from flags without writing JSON.

import { choice, noul, score } from "@typesafe-ai/sdk";
import { z } from "zod";
import { formatZodError } from "../config.js";
import type { AskFn, Usage } from "../provider.js";

const entry = z.union([z.string(), z.record(z.string(), z.unknown()), z.array(z.unknown()), z.null()]);

const questionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("noul"),
    instructions: entry.optional(),
    criteria: z.object({ true: entry.optional(), false: entry.optional() }).nullable().optional(),
  }),
  z.object({
    type: z.literal("choice"),
    instructions: entry.optional(),
    criteria: z.record(z.string(), entry),
  }),
  z.object({
    type: z.literal("score"),
    instructions: entry.optional(),
    criteria: z.array(entry).min(2),
  }),
]);

export const questionsSchema = z
  .record(z.string().min(1), questionSchema)
  .refine((q) => Object.keys(q).length > 0, {
    message: "At least one question is required.",
  });

export type RawQuestions = z.infer<typeof questionsSchema>;

/** Validate a questions map loaded from JSON. */
export function parseQuestions(input: unknown): RawQuestions {
  const result = questionsSchema.safeParse(input);
  if (!result.success) throw new Error(`Invalid questions: ${formatZodError(result.error)}`);
  return result.data;
}

/**
 * Parse `id=instructions` shorthand. The `=` splits on the first occurrence.
 * A missing `=` uses the whole string as instructions and a generated id.
 */
export function splitShorthand(raw: string, fallbackId: string): { id: string; instructions: string } {
  const eq = raw.indexOf("=");
  if (eq === -1) return { id: fallbackId, instructions: raw.trim() };
  const id = raw.slice(0, eq).trim();
  const instructions = raw.slice(eq + 1).trim();
  if (!/^[A-Za-z0-9_.-]+$/.test(id)) {
    throw new Error(`Question id "${id}" must contain only letters, digits, underscore, dash, or dot.`);
  }
  return { id, instructions };
}

/**
 * Split `instructions|opt1,opt2` into instructions plus options. Options may be
 * `label` or `label:description`. Escape a literal pipe as `\|`.
 */
export function splitOptions(raw: string): {
  instructions: string;
  options: Array<{ label: string; description: string | null }>;
} {
  const parts = raw.split(/(?<!\\)\|/).map((s) => s.replace(/\\\|/g, "|"));
  const instructions = parts[0]!.trim();
  const optionText = parts.slice(1).join("|").trim();
  if (!optionText) throw new Error(`Missing options after "|" in "${raw}".`);
  const options = optionText
    .split(/(?<!\\),/)
    .map((s) => s.replace(/\\,/g, ",").trim())
    .filter(Boolean)
    .map((opt) => {
      const colon = opt.indexOf(":");
      if (colon === -1) return { label: opt, description: null };
      return { label: opt.slice(0, colon).trim(), description: opt.slice(colon + 1).trim() || null };
    });
  return { instructions, options };
}

export interface ShorthandFlags {
  noul?: string[];
  choice?: string[];
  score?: string[];
}

/** Build a questions map from repeated `--noul`, `--choice`, `--score` flags. */
export function questionsFromFlags(flags: ShorthandFlags): RawQuestions {
  const questions: Record<string, unknown> = {};
  let n = 0;
  const nextId = (prefix: string) => `${prefix}${++n}`;
  const add = (id: string, q: unknown) => {
    if (id in questions) throw new Error(`Question id "${id}" is used twice.`);
    questions[id] = q;
  };

  for (const raw of flags.noul ?? []) {
    const { id, instructions } = splitShorthand(raw, nextId("q"));
    add(id, noul(instructions));
  }
  for (const raw of flags.choice ?? []) {
    const { id, instructions: rest } = splitShorthand(raw, nextId("q"));
    const { instructions, options } = splitOptions(rest);
    if (options.length < 2) throw new Error(`Choice "${id}" needs at least two options.`);
    add(id, choice(instructions, Object.fromEntries(options.map((o) => [o.label, o.description]))));
  }
  for (const raw of flags.score ?? []) {
    const { id, instructions: rest } = splitShorthand(raw, nextId("q"));
    const { instructions, options } = splitOptions(rest);
    if (options.length < 2) throw new Error(`Score "${id}" needs at least two levels.`);
    const levels = options.map((o) => (o.description ? `${o.label}: ${o.description}` : o.label));
    add(id, score(instructions, levels as [string, string, ...string[]]));
  }
  return parseQuestions(questions);
}

export interface AskInput {
  state: unknown;
  questions: RawQuestions;
}

export interface AskOutput {
  command: "ask";
  model: string;
  provider: string;
  answers: Record<string, unknown>;
  usage: Usage;
}

export async function runAsk(ask: AskFn, input: AskInput): Promise<AskOutput> {
  const { answers, usage, provider, model } = await ask(input.state, input.questions);
  return { command: "ask", model, provider, answers, usage };
}
