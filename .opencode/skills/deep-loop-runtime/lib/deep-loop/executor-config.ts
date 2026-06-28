// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Executor Config
// ───────────────────────────────────────────────────────────────────

import { z } from 'zod';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const EXECUTOR_KINDS = ['native', 'cli-codex', 'cli-claude-code', 'cli-opencode'] as const;
export type ExecutorKind = typeof EXECUTOR_KINDS[number];

export const REASONING_EFFORTS = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh'] as const;
export type ReasoningEffort = typeof REASONING_EFFORTS[number];

export const SERVICE_TIERS = ['priority', 'standard', 'fast'] as const;
export type ServiceTier = typeof SERVICE_TIERS[number];

const SANDBOX_MODES = ['read-only', 'workspace-write', 'danger-full-access'] as const;
export type SandboxMode = typeof SANDBOX_MODES[number];
export type ClaudePermissionMode = 'plan' | 'acceptEdits' | 'bypassPermissions';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const executorConfigSchema = z.object({
  kind: z.enum(EXECUTOR_KINDS).default('native'),
  model: z.string().min(1).nullable().default(null),
  configDir: z.string().trim().min(1).nullable().default(null),
  reasoningEffort: z.enum(REASONING_EFFORTS).nullable().default(null),
  serviceTier: z.enum(SERVICE_TIERS).nullable().default(null),
  sandboxMode: z.enum(SANDBOX_MODES).nullable().default(null),
  timeoutSeconds: z.number().int().positive().default(900),
  // Optional fable-5 governor capsule for this executor's prompts. Universal and
  // kind-agnostic on purpose: intentionally absent from EXECUTOR_KIND_FLAG_SUPPORT
  // and the unsupported-field scan, so any executor kind may carry it. null = none.
  governor: z.string().min(1).nullable().default(null),
});

export type ExecutorConfig = z.infer<typeof executorConfigSchema>;

export const EXECUTOR_KIND_FLAG_SUPPORT: Record<ExecutorKind, readonly (keyof ExecutorConfig)[]> = {
  native: [],
  'cli-codex': ['model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'timeoutSeconds'],
  'cli-claude-code': ['model', 'configDir', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds'],
  'cli-opencode': ['model', 'reasoningEffort', 'timeoutSeconds'],
};

// ───────────────────────────────────────────────────────────────────
// 3. DOMAIN ERRORS
// ───────────────────────────────────────────────────────────────────

type ExecutorConfigIssue = {
  path: PropertyKey[];
  message: string;
};

/** Error thrown when a reserved executor kind is selected before wiring exists. */
export class ExecutorNotWiredError extends Error {
  kind: Extract<ExecutorKind, 'cli-claude-code'>;

  constructor(kind: Extract<ExecutorKind, 'cli-claude-code'>) {
    super(`Executor kind '${kind}' is reserved in the schema but not yet wired. Awaiting future spec for ${kind} integration.`);
    this.name = 'ExecutorNotWiredError';
    this.kind = kind;
  }
}

/** Error thrown when executor configuration validation fails. */
export class ExecutorConfigError extends Error {
  issues: ExecutorConfigIssue[];

  constructor(input: { issues: ExecutorConfigIssue[] }) {
    super(input.issues.map((issue) => `${issue.path.map(String).join('.') || '<root>'}: ${issue.message}`).join('; '));
    this.name = 'ExecutorConfigError';
    this.issues = input.issues;
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function normalizeSandboxMode(mode: SandboxMode | null | undefined): SandboxMode {
  return mode ?? 'workspace-write';
}

function normalizeExecutorConfigInput(raw: unknown): unknown {
  if (!isRecord(raw) || !Object.prototype.hasOwnProperty.call(raw, 'type')) {
    return raw;
  }

  const legacyKind = raw.type;
  if (typeof legacyKind !== 'string') {
    return raw;
  }

  if (typeof raw.kind === 'string' && raw.kind !== legacyKind) {
    throw new ExecutorConfigError({
      issues: [{
        path: ['type'],
        message: `deprecated executor field 'type' conflicts with canonical kind '${raw.kind}'`,
      }],
    });
  }

  console.warn("[executor-config] Deprecated executor field 'type' was provided; use 'kind' instead.");
  const { type: _legacyType, ...rest } = raw;
  return {
    ...rest,
    kind: typeof raw.kind === 'string' ? raw.kind : legacyKind,
  };
}

function normalizeIssues(error: z.ZodError<ExecutorConfig>): ExecutorConfigIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path,
    message: issue.message,
  }));
}

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

/**
 * Map a generic sandbox mode to the Codex CLI sandbox mode.
 *
 * @param mode - Generic sandbox mode or undefined.
 * @returns Codex-compatible sandbox mode.
 */
export function resolveCodexSandboxMode(mode: SandboxMode | null | undefined): SandboxMode {
  return normalizeSandboxMode(mode);
}

/**
 * Map a generic sandbox mode to the Claude Code permission mode.
 *
 * @param mode - Generic sandbox mode or undefined.
 * @returns Claude-compatible permission mode.
 */
export function resolveClaudePermissionMode(mode: SandboxMode | null | undefined): ClaudePermissionMode {
  switch (normalizeSandboxMode(mode)) {
    case 'read-only':
      return 'plan';
    case 'danger-full-access':
      return 'bypassPermissions';
    default:
      return 'acceptEdits';
  }
}

/**
 * Parse and validate a raw executor configuration.
 *
 * Normalizes legacy `type` fields, validates against the Zod schema,
 * and enforces executor-kind-specific field support.
 *
 * @param raw - Raw input to parse (JSON-parsed object).
 * @returns Validated ExecutorConfig.
 * @throws {@link ExecutorConfigError} If validation fails.
 */
export function parseExecutorConfig(raw: unknown): ExecutorConfig {
  const parsed = executorConfigSchema.safeParse(normalizeExecutorConfigInput(raw));
  if (!parsed.success) {
    throw new ExecutorConfigError({
      issues: normalizeIssues(parsed.error),
    });
  }

  const config = parsed.data;
  if (config.kind === 'cli-codex' && config.model === null) {
    throw new ExecutorConfigError({
      issues: [{ path: ['model'], message: 'model is required when kind is cli-codex' }],
    });
  }
  const supportedFlags = EXECUTOR_KIND_FLAG_SUPPORT[config.kind];
  const unsupportedFields: string[] = [];
  const allOptionalFields: (keyof ExecutorConfig)[] = [
    'model',
    'configDir',
    'reasoningEffort',
    'serviceTier',
    'sandboxMode',
    'timeoutSeconds',
  ];

  for (const field of allOptionalFields) {
    if (!supportedFlags.includes(field) && config[field] !== null && !(field === 'timeoutSeconds' && config[field] === 900)) {
      unsupportedFields.push(field);
    }
  }

  if (unsupportedFields.length > 0) {
    throw new ExecutorConfigError({
      issues: unsupportedFields.map((field) => ({
        path: [field],
        message: `field '${field}' is not supported by executor kind '${config.kind}'. Supported fields for ${config.kind}: ${
          supportedFlags.length ? supportedFlags.join(', ') : 'none'
        }.`,
      })),
    });
  }

  return config;
}

/**
 * Resolve an executor configuration by merging CLI and file sources.
 *
 * @param sources - CLI and file partial configs (CLI takes precedence).
 * @returns Validated ExecutorConfig.
 */
export function resolveExecutorConfig(sources: {
  cli?: Partial<ExecutorConfig>;
  file?: Partial<ExecutorConfig>;
}): ExecutorConfig {
  const merged = {
    ...(sources.file ?? {}),
    ...(sources.cli ?? {}),
  };
  return parseExecutorConfig(merged);
}

// ───────────────────────────────────────────────────────────────────
// 6. FAN-OUT CONFIG
// ───────────────────────────────────────────────────────────────────
//
// Opt-in layer ABOVE the single-executor path. When a fan-out config is present,
// the loop runs N executor "lineages" concurrently (capped), each running the
// existing sequential loop in its own isolated sub-packet. The single-executor
// path (executorConfigSchema / parseExecutorConfig) is untouched and remains the
// default; callers use EITHER a single `executor` OR a `fanout` block, never both.

const LINEAGE_LABEL_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

/**
 * One fan-out lineage: a single executor config plus fan-out metadata.
 *
 * - `label`: directory-safe id for the lineage's isolated sub-packet.
 * - `count`: number of replicas of THIS config to run (e.g. 5x the same model).
 * - `iterations`: per-lineage max-iterations override; null = packet default.
 * - `promptFramework`: optional per-model prompt framing key (e.g. "costar",
 *   "tidd-ec") resolved against sk-prompt-models when a consumer renders the
 *   lineage prompt. null = consumer default. Loop-type-agnostic and optional, so
 *   research/review lineages that omit it are unaffected.
 */
export const lineageExecutorSchema = executorConfigSchema.extend({
  label: z.string().min(1).regex(LINEAGE_LABEL_PATTERN, {
    message: "label must match /^[a-z0-9][a-z0-9-]*$/ (lowercase, digits, hyphens; dir-safe)",
  }),
  count: z.number().int().positive().default(1),
  iterations: z.number().int().positive().nullable().default(null),
  promptFramework: z.string().min(1).nullable().default(null),
});

export type LineageExecutor = z.infer<typeof lineageExecutorSchema>;

export const fanoutConfigSchema = z.object({
  executors: z.array(lineageExecutorSchema).min(1),
  concurrency: z.number().int().positive().default(2),
  maxRetries: z.number().int().nonnegative().default(5),
  lagCeilingMs: z.number().int().nonnegative().default(0),
  progressHeartbeatSeconds: z.number().nonnegative().default(0),
});

export type FanoutConfig = z.infer<typeof fanoutConfigSchema>;

/**
 * Parse and validate a raw fan-out configuration.
 *
 * Each entry's executor subset is routed through {@link parseExecutorConfig} so
 * ALL existing kind/model/flag rules (cli-codex needs model, per-kind flag
 * support) apply per lineage with zero duplication.
 * Labels must be unique and base-label (count>1) expansion must not collide.
 *
 * @param raw - Raw input to parse (JSON-parsed object).
 * @returns Validated FanoutConfig.
 * @throws {@link ExecutorConfigError} If validation fails.
 */
export function parseFanoutConfig(raw: unknown): FanoutConfig {
  const parsed = fanoutConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ExecutorConfigError({ issues: parsed.error.issues.map((issue) => ({ path: issue.path, message: issue.message })) });
  }

  const config = parsed.data;

  // Reuse the canonical single-executor validator per entry (kind/model/flags).
  config.executors.forEach((entry, index) => {
    const { label: _label, count: _count, iterations: _iterations, promptFramework: _promptFramework, ...executorSubset } = entry;
    try {
      parseExecutorConfig(executorSubset);
    } catch (err: unknown) {
      if (err instanceof ExecutorConfigError) {
        throw new ExecutorConfigError({
          issues: err.issues.map((issue) => ({ path: ['executors', index, ...issue.path], message: issue.message })),
        });
      }
      throw err;
    }
  });

  // Labels must be unique among the declared lineages.
  const seenLabels = new Set<string>();
  config.executors.forEach((entry, index) => {
    if (seenLabels.has(entry.label)) {
      throw new ExecutorConfigError({
        issues: [{ path: ['executors', index, 'label'], message: `duplicate lineage label '${entry.label}'` }],
      });
    }
    seenLabels.add(entry.label);
  });

  // Expanded labels (count>1 → label-1, label-2, …) must not collide either.
  const expandedLabels = new Set<string>();
  for (const lineage of expandLineages(config)) {
    if (expandedLabels.has(lineage.label)) {
      throw new ExecutorConfigError({
        issues: [{ path: ['executors'], message: `expanded lineage label '${lineage.label}' collides; rename base labels` }],
      });
    }
    expandedLabels.add(lineage.label);
  }

  return config;
}

/**
 * Expand a fan-out config into concrete per-replica lineages.
 *
 * A `count` of 1 keeps the base label; `count > 1` yields `${label}-1` …
 * `${label}-N`. Each expanded lineage carries `count: 1` so downstream
 * consumers see one runnable unit per element.
 *
 * @param config - Validated FanoutConfig.
 * @returns Flat list of single-replica lineages (one runnable unit each).
 */
export function expandLineages(config: FanoutConfig): LineageExecutor[] {
  const lineages: LineageExecutor[] = [];
  for (const entry of config.executors) {
    if (entry.count === 1) {
      lineages.push({ ...entry, count: 1 });
      continue;
    }
    for (let replica = 1; replica <= entry.count; replica += 1) {
      lineages.push({ ...entry, label: `${entry.label}-${replica}`, count: 1 });
    }
  }
  return lineages;
}
