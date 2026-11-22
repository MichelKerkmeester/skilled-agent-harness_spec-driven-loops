// ───────────────────────────────────────────────────────────────────
// MODULE: BOT.md Definition
// ───────────────────────────────────────────────────────────────────
//
// A bot is one authored BOT.md: YAML frontmatter for the machine fields and
// a body for the standing instructions. The checker and the runner both
// import these predicates, so the field rules exist once. A defect comes
// back as a refusal with a named reason, never a throw, so a checker can
// report every bad file instead of stopping at the first.

import { readFileSync } from 'node:fs';

import { parse as parseYaml } from 'yaml';

import { ISOLATION_VALUES } from './repo-config.js';

import type { Isolation, RepoConfig, Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const TRIGGER_KINDS = ['cron', 'queue', 'git-hook', 'manual'] as const;

export type TriggerKind = (typeof TRIGGER_KINDS)[number];

export type Trigger =
  | { kind: 'cron'; expression: string }
  | { kind: 'queue'; name: string }
  | { kind: 'git-hook' }
  | { kind: 'manual' };

/** The deep-loop executor block. Keys past `kind` belong to the executor and pass through. */
export interface RuntimeBlock {
  kind: string;
  [key: string]: unknown;
}

/** Declared limits, in the deep-loop budget vocabulary. */
export interface Budget {
  maxIterations: number;
  maxDurationMinutes: number;
  timeoutSeconds: number;
}

/** Where a run's outcome is announced. */
export type Delivery =
  | { mode: 'local-only' }
  | { mode: 'targets'; targets: string[]; onFailure: string[] | null };

/** What the author declares the run may do; null means not declared. */
export interface Posture {
  isolation: Isolation | null;
  sandbox: string | null;
  secrets: string | null;
}

export interface BotDefinition {
  id: string;
  trigger: Trigger;
  runtime: RuntimeBlock;
  budget: Budget;
  enabled: boolean;
  delivery: Delivery;
  posture: Posture;
  /** Command whose non-zero exit or `[SILENT]` output skips the run. */
  precheck: string | null;
  /** Spec folder bound before dispatch. */
  specFolder: string | null;
  body: string;
}

/** The literal that sends nothing anywhere. */
export const LOCAL_ONLY = 'local-only';

/** The deep-loop runtime's own defaults: the research config, and the executor timeout. */
export const DEFAULT_BUDGET: Readonly<Budget> = Object.freeze({
  maxIterations: 10,
  maxDurationMinutes: 120,
  timeoutSeconds: 900,
});

export const DEFAULT_RUNTIME: Readonly<RuntimeBlock> = Object.freeze({ kind: 'native' });

const BOT_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const QUEUE_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

const FRONTMATTER_KEYS = new Set([
  'id',
  'trigger',
  'runtime',
  'budget',
  'enabled',
  'delivery',
  'isolation',
  'sandbox',
  'secrets',
  'precheck',
  'spec_folder',
]);

const TRIGGER_KEYS: Record<TriggerKind, readonly string[]> = {
  cron: ['kind', 'expression'],
  queue: ['kind', 'name'],
  'git-hook': ['kind'],
  manual: ['kind'],
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/;

type Refusal = { ok: false; reason: string; detail?: string };

// ───────────────────────────────────────────────────────────────────
// 2. FIELD PREDICATES
// ───────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function isTargetList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(nonEmptyString);
}

/** Whether a value names a trigger kind this hub knows. */
export function isTriggerKind(value: unknown): value is TriggerKind {
  return TRIGGER_KINDS.includes(value as TriggerKind);
}

/** Validate a trigger block against its kind's fields. */
export function parseTrigger(raw: unknown): Result<Trigger> {
  if (raw === undefined || raw === null) return { ok: false, reason: 'missing-trigger' };
  if (!isPlainObject(raw)) return { ok: false, reason: 'trigger-invalid', detail: 'expected an object' };
  if (!isTriggerKind(raw.kind)) {
    return { ok: false, reason: 'trigger-kind-invalid', detail: `expected one of ${TRIGGER_KINDS.join(', ')}` };
  }
  const allowed = TRIGGER_KEYS[raw.kind];
  const unknown = Object.keys(raw).find((key) => !allowed.includes(key));
  if (unknown !== undefined) return { ok: false, reason: 'unknown-key', detail: `trigger.${unknown}` };

  switch (raw.kind) {
    case 'cron':
      if (!nonEmptyString(raw.expression)) return { ok: false, reason: 'trigger-expression-missing' };
      return { ok: true, value: { kind: 'cron', expression: raw.expression.trim() } };
    case 'queue':
      if (typeof raw.name !== 'string' || !QUEUE_NAME_PATTERN.test(raw.name)) {
        return { ok: false, reason: 'trigger-name-invalid' };
      }
      return { ok: true, value: { kind: 'queue', name: raw.name } };
    case 'git-hook':
      return { ok: true, value: { kind: 'git-hook' } };
    case 'manual':
      return { ok: true, value: { kind: 'manual' } };
  }
}

function parseRuntime(raw: unknown): Result<RuntimeBlock> {
  if (raw === undefined) return { ok: true, value: { ...DEFAULT_RUNTIME } };
  if (!isPlainObject(raw) || !nonEmptyString(raw.kind)) {
    return { ok: false, reason: 'runtime-invalid', detail: 'expected an object with a kind' };
  }
  return { ok: true, value: { ...raw, kind: raw.kind } };
}

function parseBudget(raw: unknown): Result<Budget> {
  if (raw === undefined) return { ok: true, value: { ...DEFAULT_BUDGET } };
  if (!isPlainObject(raw)) return { ok: false, reason: 'budget-invalid', detail: 'expected an object' };
  const budget = { ...DEFAULT_BUDGET } as Record<string, number>;
  for (const [key, value] of Object.entries(raw)) {
    if (!(key in DEFAULT_BUDGET)) return { ok: false, reason: 'unknown-key', detail: `budget.${key}` };
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
      return { ok: false, reason: `budget.${key}-invalid`, detail: 'expected a positive integer' };
    }
    budget[key] = value;
  }
  return { ok: true, value: budget as unknown as Budget };
}

function parseDelivery(raw: unknown): Result<Delivery> {
  if (raw === undefined) return { ok: true, value: { mode: 'targets', targets: [], onFailure: null } };
  if (raw === LOCAL_ONLY) return { ok: true, value: { mode: 'local-only' } };
  if (!isPlainObject(raw)) {
    return { ok: false, reason: 'delivery-invalid', detail: `expected ${LOCAL_ONLY} or an object` };
  }
  const unknown = Object.keys(raw).find((key) => key !== 'targets' && key !== 'onFailure');
  if (unknown !== undefined) return { ok: false, reason: 'unknown-key', detail: `delivery.${unknown}` };
  const targets = raw.targets ?? [];
  if (!isTargetList(targets)) return { ok: false, reason: 'delivery.targets-invalid' };
  const onFailure = raw.onFailure ?? null;
  if (onFailure !== null && !isTargetList(onFailure)) return { ok: false, reason: 'delivery.onFailure-invalid' };
  return { ok: true, value: { mode: 'targets', targets: [...targets], onFailure: onFailure === null ? null : [...onFailure] } };
}

function optionalString(raw: Record<string, unknown>, key: string): Result<string | null> {
  if (!(key in raw) || raw[key] === null) return { ok: true, value: null };
  if (!nonEmptyString(raw[key])) return { ok: false, reason: `${key}-invalid`, detail: 'expected a non-empty string' };
  return { ok: true, value: (raw[key] as string).trim() };
}

// ───────────────────────────────────────────────────────────────────
// 3. PARSE
// ───────────────────────────────────────────────────────────────────

/**
 * Parse BOT.md text into a definition with its defaults filled.
 *
 * @param text - The whole file.
 * @returns The definition, or a refusal such as `missing-id`, `missing-trigger` or `empty-body`.
 */
export function parseDefinition(text: string): Result<BotDefinition> {
  const match = FRONTMATTER.exec(text);
  if (!match) return { ok: false, reason: 'missing-frontmatter' };

  let raw: unknown;
  try {
    raw = parseYaml(match[1] ?? '');
  } catch {
    return { ok: false, reason: 'frontmatter-invalid', detail: 'not valid YAML' };
  }
  if (!isPlainObject(raw)) return { ok: false, reason: 'frontmatter-invalid', detail: 'expected a mapping' };

  const unknown = Object.keys(raw).find((key) => !FRONTMATTER_KEYS.has(key));
  if (unknown !== undefined) return { ok: false, reason: 'unknown-key', detail: unknown };

  if (raw.id === undefined || raw.id === null || raw.id === '') return { ok: false, reason: 'missing-id' };
  if (typeof raw.id !== 'string' || !BOT_ID_PATTERN.test(raw.id)) return { ok: false, reason: 'id-invalid' };

  const trigger = parseTrigger(raw.trigger);
  if (!trigger.ok) return trigger;

  const body = (match[2] ?? '').trim();
  if (body === '') return { ok: false, reason: 'empty-body' };

  const runtime = parseRuntime(raw.runtime);
  if (!runtime.ok) return runtime;
  const budget = parseBudget(raw.budget);
  if (!budget.ok) return budget;
  const delivery = parseDelivery(raw.delivery);
  if (!delivery.ok) return delivery;

  if (raw.enabled !== undefined && typeof raw.enabled !== 'boolean') {
    return { ok: false, reason: 'enabled-invalid', detail: 'expected true or false' };
  }
  if (raw.isolation !== undefined && !ISOLATION_VALUES.includes(raw.isolation as Isolation)) {
    return { ok: false, reason: 'isolation-invalid', detail: `expected one of ${ISOLATION_VALUES.join(', ')}` };
  }

  const strings: Record<string, string | null> = {};
  for (const key of ['sandbox', 'secrets', 'precheck', 'spec_folder']) {
    const value = optionalString(raw, key);
    if (!value.ok) return value;
    strings[key] = value.value;
  }

  return {
    ok: true,
    value: {
      id: raw.id,
      trigger: trigger.value,
      runtime: runtime.value,
      budget: budget.value,
      enabled: raw.enabled === undefined ? true : raw.enabled,
      delivery: delivery.value,
      posture: {
        isolation: (raw.isolation as Isolation | undefined) ?? null,
        sandbox: strings.sandbox ?? null,
        secrets: strings.secrets ?? null,
      },
      precheck: strings.precheck ?? null,
      specFolder: strings.spec_folder ?? null,
      body,
    },
  };
}

/**
 * Read and parse one BOT.md file.
 *
 * @returns The definition, or a refusal; an unreadable file is `definition-unreadable`.
 */
export function readDefinition(path: string): Result<BotDefinition> {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    return { ok: false, reason: 'definition-unreadable', detail: code ?? 'unknown error' } satisfies Refusal;
  }
  return parseDefinition(text);
}

// ───────────────────────────────────────────────────────────────────
// 4. ISOLATION
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve the isolation a run uses: the definition's field, then the
 * repository default, else a refusal. Nothing picks a posture by itself,
 * because an unattended run has nobody to ask.
 *
 * @returns `worktree` or `shared`, or the refusal `isolation-undeclared`.
 */
export function resolveIsolation(
  definition: Pick<BotDefinition, 'posture'>,
  config: Pick<RepoConfig, 'defaultIsolation'>,
): Result<Isolation> {
  const isolation = definition.posture.isolation ?? config.defaultIsolation;
  if (isolation === null) return { ok: false, reason: 'isolation-undeclared' };
  return { ok: true, value: isolation };
}
