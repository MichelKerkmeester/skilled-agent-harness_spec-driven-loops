// Value extraction without hallucination: regexes find candidate spans in
// code, Jev selects the intended one, code normalizes the verbatim value.
// Pattern: pre_parsed_value_extraction_cookbook, date_extraction_cookbook.

import { choice } from "@typesafe-ai/sdk";
import type { AskFn, Usage } from "../provider.js";

export interface FieldSpec {
  name: string;
  /** What the field means; drives the question. */
  description: string;
  pattern: RegExp;
  normalize?: (raw: string) => unknown;
}

const MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec";

export const BUILTIN_FIELDS: Record<string, Omit<FieldSpec, "name">> = {
  email: {
    description: "the email address",
    pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    normalize: (s) => s.toLowerCase(),
  },
  phone: {
    description: "the phone number",
    pattern: /\+?\d[\d\s().-]{7,}\d/g,
    normalize: (s) => (s.startsWith("+") ? "+" : "") + s.replace(/\D/g, ""),
  },
  url: {
    description: "the web address (URL)",
    pattern: /https?:\/\/[^\s)>"']+/g,
    normalize: (s) => s.replace(/[.,;:]+$/, ""),
  },
  amount: {
    description: "the monetary amount",
    pattern:
      /(?:[$€£]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s?(?:USD|EUR|GBP|CAD|AUD|dollars|euros|pounds))/g,
    normalize: (s) => {
      const currency = /[$]|USD|dollars/i.test(s)
        ? "USD"
        : /€|EUR|euros/i.test(s)
          ? "EUR"
          : /£|GBP|pounds/i.test(s)
            ? "GBP"
            : (s.match(/CAD|AUD/i)?.[0]?.toUpperCase() ?? null);
      const value = Number(s.replace(/[^\d.]/g, ""));
      return { value: Number.isFinite(value) ? value : null, currency };
    },
  },
  date: {
    description: "the date",
    pattern: new RegExp(
      `\\b(?:\\d{4}-\\d{2}-\\d{2}|\\d{1,2}[/.]\\d{1,2}[/.]\\d{2,4}|(?:${MONTHS})[a-z]*\\.? \\d{1,2}(?:st|nd|rd|th)?,? \\d{4}|\\d{1,2}(?:st|nd|rd|th)? (?:${MONTHS})[a-z]*\\.?,? \\d{4})\\b`,
      "gi",
    ),
    normalize: (s) => {
      const cleaned = s.replace(/(\d)(st|nd|rd|th)/i, "$1");
      const t = Date.parse(cleaned);
      if (Number.isNaN(t)) return null;
      const d = new Date(t);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    },
  },
  percent: {
    description: "the percentage",
    pattern: /\d+(?:\.\d+)?\s?%/g,
    normalize: (s) => Number(s.replace(/[^\d.]/g, "")),
  },
  number: {
    description: "the number",
    // A leading minus only counts when it is not glued to a word (INV-20931 is not negative).
    pattern: /(?<!\w)-?\d(?:[\d,]*\d)?(?:\.\d+)?/g,
    normalize: (s) => Number(s.replace(/,/g, "")),
  },
};

/**
 * Parse a `--want` entry. Forms:
 *   email                      builtin
 *   invoice=/INV-\d+/          custom regex, name only
 *   invoice=/INV-\d+/:the invoice number      custom regex with description
 *   sender=email:the sender's address         builtin under a custom name/description
 */
export function parseFieldSpec(raw: string): FieldSpec {
  const eq = raw.indexOf("=");
  if (eq === -1) {
    const builtin = BUILTIN_FIELDS[raw.trim()];
    if (!builtin)
      throw new Error(
        `Unknown field "${raw}". Builtins: ${Object.keys(BUILTIN_FIELDS).join(", ")}. Or use name=/regex/:description.`,
      );
    return { name: raw.trim(), ...builtin };
  }
  const name = raw.slice(0, eq).trim();
  if (!/^[A-Za-z0-9_.-]+$/.test(name))
    throw new Error(`Field name "${name}" must be letters, digits, _, -, or .`);
  const rest = raw.slice(eq + 1).trim();
  const regexMatch = rest.match(/^\/((?:\\.|[^/])+)\/([a-z]*)(?::(.*))?$/s);
  if (regexMatch) {
    const [, source, flags, description] = regexMatch;
    let pattern: RegExp;
    try {
      pattern = new RegExp(source!, flags!.includes("g") ? flags! : `${flags}g`);
    } catch (err) {
      throw new Error(`Field "${name}": invalid regex: ${(err as Error).message}`);
    }
    return { name, description: description?.trim() || `the ${name.replace(/[_.-]+/g, " ")}`, pattern };
  }
  const colon = rest.indexOf(":");
  const builtinName = (colon === -1 ? rest : rest.slice(0, colon)).trim();
  const builtin = BUILTIN_FIELDS[builtinName];
  if (!builtin) throw new Error(`Field "${name}": "${builtinName}" is not a builtin and not a /regex/.`);
  const description =
    colon === -1 ? builtin.description : rest.slice(colon + 1).trim() || builtin.description;
  return { name, ...builtin, description };
}

export const MAX_FIELD_CANDIDATES = 50;

/** Unique matches for a field, in order of appearance, capped. */
export function findCandidates(text: string, spec: FieldSpec): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  spec.pattern.lastIndex = 0;
  for (const m of text.matchAll(spec.pattern)) {
    const v = m[0].trim();
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
      if (out.length >= MAX_FIELD_CANDIDATES) break;
    }
  }
  return out;
}

export interface ExtractInput {
  text: string;
  fields: FieldSpec[];
  /** Optional context, e.g. "an invoice from a supplier". */
  context?: string;
  minConfidence: number;
}

export interface ExtractedField {
  value: string | null;
  normalized: unknown;
  probability: number | null;
  confidence: number | null;
  action: "auto" | "review" | "none";
  candidates: number;
  reason?: string;
}

export interface ExtractOutput {
  command: "extract";
  model: string;
  provider: string;
  fields: Record<string, ExtractedField>;
  min_confidence: number;
  usage: Usage;
}

export const NONE_KEY = "none";

export function buildExtractRequest(input: Pick<ExtractInput, "text" | "fields" | "context">) {
  if (input.fields.length === 0) throw new Error("At least one field is required.");
  const names = new Set<string>();
  for (const f of input.fields) {
    if (names.has(f.name)) throw new Error(`Duplicate field "${f.name}".`);
    names.add(f.name);
  }
  const candidates: Record<string, string[]> = {};
  const questions: Record<string, unknown> = {};
  for (const f of input.fields) {
    const found = findCandidates(input.text, f);
    candidates[f.name] = found;
    if (found.length === 0) continue;
    const criteria: Record<string, string | null> = Object.fromEntries(found.map((v, i) => [`c${i}`, v]));
    criteria[NONE_KEY] = `None of the candidates is ${f.description}`;
    questions[f.name] = choice(
      `Which candidate in \`candidates.${f.name}\` is ${f.description}${input.context ? ` in this ${input.context}` : ""}? Candidate keys map to the exact text found in the document.`,
      criteria,
    );
  }
  const state = { document: input.text, context: input.context ?? null, candidates };
  return { state, questions, candidates };
}

export async function runExtract(ask: AskFn, input: ExtractInput): Promise<ExtractOutput> {
  const { state, questions, candidates } = buildExtractRequest(input);
  // biome-ignore lint/suspicious/noExplicitAny: answer payloads are the SDK's loosely typed union
  let answers: Record<string, any> = {};
  let usage: Usage = { input_tokens: 0, output_tokens: 0 };
  let model = "";
  let provider = "";
  if (Object.keys(questions).length > 0) {
    const res = await ask(state, questions);
    answers = res.answers;
    usage = res.usage;
    model = res.model;
    provider = res.provider;
  }
  const fields: Record<string, ExtractedField> = {};
  for (const f of input.fields) {
    const found = candidates[f.name] ?? [];
    if (found.length === 0) {
      fields[f.name] = {
        value: null,
        normalized: null,
        probability: null,
        confidence: null,
        action: "none",
        candidates: 0,
        reason: "no candidates matched the pattern",
      };
      continue;
    }
    const a = answers[f.name];
    const key: string | undefined = a?.choice;
    const confidence: number | null = typeof a?.confidence === "number" ? a.confidence : null;
    const probability: number | null =
      key && typeof a?.probabilities?.[key] === "number" ? a.probabilities[key] : null;
    if (!key || key === NONE_KEY) {
      fields[f.name] = {
        value: null,
        normalized: null,
        probability,
        confidence,
        action: "none",
        candidates: found.length,
        reason: key ? "model judged no candidate to be the field" : "no answer",
      };
      continue;
    }
    const idx = Number(key.slice(1));
    const value = found[idx] ?? null;
    let normalized: unknown = value;
    if (value !== null && f.normalize) {
      try {
        normalized = f.normalize(value);
      } catch {
        normalized = value;
      }
    }
    fields[f.name] = {
      value,
      normalized,
      probability,
      confidence,
      action: confidence !== null && confidence >= input.minConfidence ? "auto" : "review",
      candidates: found.length,
    };
  }
  return { command: "extract", model, provider, fields, min_confidence: input.minConfidence, usage };
}

export const EXTRACT_FAIL_CONDITIONS = ["review", "missing"] as const;
export type ExtractFailCondition = (typeof EXTRACT_FAIL_CONDITIONS)[number];

export function extractFailed(out: ExtractOutput, conditions: readonly ExtractFailCondition[]): boolean {
  return Object.values(out.fields).some(
    (f) =>
      (conditions.includes("review") && f.action === "review") ||
      (conditions.includes("missing") && f.action === "none"),
  );
}
