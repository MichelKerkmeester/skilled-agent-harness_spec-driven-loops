// Classification: one label from a set (Choice), one probability per label
// (Nouls, for multi-label), or a path through a label hierarchy (greedy
// level-by-level Choice). Patterns: classification_using_confidence,
// hierarchical_classification.

import { choice, noul } from "@typesafe-ai/sdk";
import { sanitizeId } from "../lib.js";
import type { AskFn, Usage } from "../provider.js";

export interface LabelDef {
  label: string;
  description: string | null;
}

/** Nested taxonomy: label -> children (or null for a leaf). */
export type Taxonomy = { [label: string]: Taxonomy | null };

export const OTHER_LABEL = "other";

/** Parse `a,b:description,c` into label definitions. Escape a literal comma as `\,`. */
export function parseLabelList(raw: string): LabelDef[] {
  return raw
    .split(/(?<!\\),/)
    .map((s) => s.replace(/\\,/g, ",").trim())
    .filter(Boolean)
    .map((opt) => {
      const colon = opt.indexOf(":");
      if (colon === -1) return { label: opt, description: null };
      return { label: opt.slice(0, colon).trim(), description: opt.slice(colon + 1).trim() || null };
    });
}

/** Accept a JSON array of strings, array of {label, description}, or {label: description} map. */
export function parseLabelJson(parsed: unknown): LabelDef[] {
  if (Array.isArray(parsed)) {
    return parsed.map((entry, i) => {
      if (typeof entry === "string") return { label: entry, description: null };
      if (entry && typeof entry === "object" && typeof (entry as LabelDef).label === "string") {
        const e = entry as { label: string; description?: unknown };
        return { label: e.label, description: typeof e.description === "string" ? e.description : null };
      }
      throw new Error(`labels[${i}] must be a string or an object with a "label" field.`);
    });
  }
  if (parsed && typeof parsed === "object") {
    return Object.entries(parsed as Record<string, unknown>).map(([label, description]) => ({
      label,
      description: typeof description === "string" ? description : null,
    }));
  }
  throw new Error("labels must be a JSON array or object.");
}

function validateLabels(labels: LabelDef[], min = 2): Map<string, LabelDef> {
  if (labels.length < min) throw new Error(`At least ${min} labels are required.`);
  const byKey = new Map<string, LabelDef>();
  for (const l of labels) {
    const key = sanitizeId(l.label);
    if (!key) throw new Error(`Label "${l.label}" has no usable characters.`);
    if (byKey.has(key)) throw new Error(`Labels "${byKey.get(key)!.label}" and "${l.label}" collide.`);
    byKey.set(key, l);
  }
  return byKey;
}

function criteriaFor(byKey: Map<string, LabelDef>, other: boolean): Record<string, string | null> {
  const criteria: Record<string, string | null> = Object.fromEntries(
    [...byKey.entries()].map(([k, l]) => [k, l.description]),
  );
  if (other) criteria[OTHER_LABEL] = "None of the other labels fits";
  return criteria;
}

// ── single ──────────────────────────────────────────────────────────────────

export interface ClassifyInput {
  text: unknown;
  labels: LabelDef[];
  instructions?: string;
  /** Add an `other` escape option. */
  other: boolean;
  /** Confidence at or above which the label is `auto`; below it, `review`. */
  minConfidence: number;
}

export interface ClassifyOutput {
  command: "classify";
  mode: "single";
  model: string;
  provider: string;
  label: string | null;
  confidence: number | null;
  action: "auto" | "review";
  probabilities: Record<string, number>;
  min_confidence: number;
  usage: Usage;
}

export function buildClassifyRequest(
  input: Pick<ClassifyInput, "text" | "labels" | "instructions" | "other">,
) {
  const byKey = validateLabels(input.labels);
  const questions = {
    label: choice(
      input.instructions ?? "Which label best describes the content?",
      criteriaFor(byKey, input.other),
    ),
  };
  return { state: input.text, questions, byKey };
}

export async function runClassify(ask: AskFn, input: ClassifyInput): Promise<ClassifyOutput> {
  const { state, questions, byKey } = buildClassifyRequest(input);
  const { answers, usage, provider, model } = await ask(state, questions);
  const a = answers.label;
  const key: string | undefined = a?.choice;
  const label = key === undefined ? null : key === OTHER_LABEL ? OTHER_LABEL : (byKey.get(key)?.label ?? key);
  const confidence: number | null = typeof a?.confidence === "number" ? a.confidence : null;
  const probabilities: Record<string, number> = {};
  for (const [k, p] of Object.entries((a?.probabilities ?? {}) as Record<string, number>)) {
    probabilities[k === OTHER_LABEL ? OTHER_LABEL : (byKey.get(k)?.label ?? k)] = p;
  }
  return {
    command: "classify",
    mode: "single",
    model,
    provider,
    label,
    confidence,
    action: confidence !== null && confidence >= input.minConfidence ? "auto" : "review",
    probabilities,
    min_confidence: input.minConfidence,
    usage,
  };
}

// ── multi ───────────────────────────────────────────────────────────────────

export interface ClassifyMultiInput {
  text: unknown;
  labels: LabelDef[];
  instructions?: string;
  /** Probability at or above which a label applies. */
  threshold: number;
}

export interface ClassifyMultiOutput {
  command: "classify";
  mode: "multi";
  model: string;
  provider: string;
  labels: Array<{ label: string; probability: number; applies: boolean }>;
  applied: string[];
  threshold: number;
  usage: Usage;
}

export function buildClassifyMultiRequest(
  input: Pick<ClassifyMultiInput, "text" | "labels" | "instructions">,
) {
  const byKey = validateLabels(input.labels, 1);
  const questions: Record<string, unknown> = {};
  for (const [key, l] of byKey) {
    const base = input.instructions ?? "Does this label apply to the content?";
    questions[key] = noul(`${base} Label: "${l.label}"${l.description ? ` (${l.description})` : ""}`, {
      true: `The label "${l.label}" applies`,
      false: `The label "${l.label}" does not apply`,
    });
  }
  return { state: input.text, questions, byKey };
}

export async function runClassifyMulti(ask: AskFn, input: ClassifyMultiInput): Promise<ClassifyMultiOutput> {
  const { state, questions, byKey } = buildClassifyMultiRequest(input);
  const { answers, usage, provider, model } = await ask(state, questions);
  const labels = [...byKey.entries()].map(([key, l]) => {
    const p: number = typeof answers[key]?.noul === "number" ? answers[key].noul : 0;
    return { label: l.label, probability: Number(p.toFixed(4)), applies: p >= input.threshold };
  });
  return {
    command: "classify",
    mode: "multi",
    model,
    provider,
    labels,
    applied: labels.filter((l) => l.applies).map((l) => l.label),
    threshold: input.threshold,
    usage,
  };
}

// ── taxonomy ────────────────────────────────────────────────────────────────

export interface ClassifyTaxonomyInput {
  text: unknown;
  taxonomy: Taxonomy;
  instructions?: string;
  other: boolean;
  minConfidence: number;
}

export interface TaxonomyStep {
  label: string;
  confidence: number | null;
  probabilities: Record<string, number>;
}

export interface ClassifyTaxonomyOutput {
  command: "classify";
  mode: "taxonomy";
  model: string;
  provider: string;
  path: string[];
  steps: TaxonomyStep[];
  /** Lowest confidence along the path. */
  confidence: number | null;
  action: "auto" | "review";
  stopped_at_other: boolean;
  min_confidence: number;
  usage: Usage;
}

export function parseTaxonomy(parsed: unknown, path = "taxonomy"): Taxonomy {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${path} must be an object mapping labels to children or null.`);
  }
  const out: Taxonomy = {};
  for (const [label, children] of Object.entries(parsed as Record<string, unknown>)) {
    if (children === null) out[label] = null;
    else if (Array.isArray(children)) {
      // Leaf list shorthand: ["a", "b"] == {"a": null, "b": null}
      out[label] = Object.fromEntries(children.map((c) => [String(c), null]));
    } else out[label] = parseTaxonomy(children, `${path}.${label}`);
  }
  if (Object.keys(out).length === 0) throw new Error(`${path} has no labels.`);
  return out;
}

/** Greedy descent: one Choice per level, follow the winner until a leaf or `other`. */
export async function runClassifyTaxonomy(
  ask: AskFn,
  input: ClassifyTaxonomyInput,
): Promise<ClassifyTaxonomyOutput> {
  let level: Taxonomy | null = input.taxonomy;
  const path: string[] = [];
  const steps: TaxonomyStep[] = [];
  const usage: Usage = { input_tokens: 0, output_tokens: 0 };
  let model = "";
  let provider = "";
  let stoppedAtOther = false;

  while (level && Object.keys(level).length > 0) {
    const labels: LabelDef[] = Object.keys(level).map((label) => ({ label, description: null }));
    const single = labels.length === 1 && !input.other;
    if (single) {
      // Nothing to decide at this level.
      path.push(labels[0]!.label);
      steps.push({ label: labels[0]!.label, confidence: 1, probabilities: { [labels[0]!.label]: 1 } });
      level = level[labels[0]!.label] ?? null;
      continue;
    }
    const byKey = validateLabels(labels, 1);
    const where = path.length ? ` within "${path.join(" > ")}"` : "";
    const questions = {
      label: choice(
        `${input.instructions ?? "Which category best describes the content"}${where}?`,
        criteriaFor(byKey, input.other),
      ),
    };
    const res = await ask(input.text, questions);
    usage.input_tokens += res.usage.input_tokens;
    usage.output_tokens += res.usage.output_tokens;
    model = res.model;
    provider = res.provider;
    const a = res.answers.label;
    const key: string | undefined = a?.choice;
    const probabilities: Record<string, number> = {};
    for (const [k, p] of Object.entries((a?.probabilities ?? {}) as Record<string, number>)) {
      probabilities[k === OTHER_LABEL ? OTHER_LABEL : (byKey.get(k)?.label ?? k)] = p;
    }
    const confidence: number | null = typeof a?.confidence === "number" ? a.confidence : null;
    if (key === undefined) break;
    if (key === OTHER_LABEL) {
      stoppedAtOther = true;
      steps.push({ label: OTHER_LABEL, confidence, probabilities });
      break;
    }
    const label = byKey.get(key)?.label ?? key;
    path.push(label);
    steps.push({ label, confidence, probabilities });
    level = level[label] ?? null;
  }

  const confidences = steps.map((s) => s.confidence).filter((c): c is number => c !== null);
  const confidence = confidences.length ? Math.min(...confidences) : null;
  return {
    command: "classify",
    mode: "taxonomy",
    model,
    provider,
    path,
    steps,
    confidence,
    action: confidence !== null && confidence >= input.minConfidence && !stoppedAtOther ? "auto" : "review",
    stopped_at_other: stoppedAtOther,
    min_confidence: input.minConfidence,
    usage,
  };
}

export type AnyClassifyOutput = ClassifyOutput | ClassifyMultiOutput | ClassifyTaxonomyOutput;

export const CLASSIFY_FAIL_CONDITIONS = ["review", "other", "unlabeled"] as const;
export type ClassifyFailCondition = (typeof CLASSIFY_FAIL_CONDITIONS)[number];

export function classifyFailed(
  out: AnyClassifyOutput,
  conditions: readonly ClassifyFailCondition[],
): boolean {
  if (out.mode === "multi") return conditions.includes("unlabeled") && out.applied.length === 0;
  if (conditions.includes("review") && out.action === "review") return true;
  if (out.mode === "single") return conditions.includes("other") && out.label === OTHER_LABEL;
  return conditions.includes("other") && out.stopped_at_other;
}
