// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Executor Config
// ───────────────────────────────────────────────────────────────────

import { z } from 'zod';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const EXECUTOR_KINDS = ['native', 'cli-codex', 'cli-claude-code', 'cli-opencode'] as const;
export type ExecutorKind = typeof EXECUTOR_KINDS[number];

// Ordered low→high. `ultra` is codex gpt-5.6-sol's top reasoning tier, above `max`.
export const REASONING_EFFORTS = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra'] as const;
export type ReasoningEffort = typeof REASONING_EFFORTS[number];

export const SERVICE_TIERS = ['priority', 'standard', 'fast'] as const;
export type ServiceTier = typeof SERVICE_TIERS[number];

export const WEB_SEARCH_POLICIES = ['inherit', 'disabled', 'cached', 'live'] as const;
export type WebSearchPolicy = typeof WEB_SEARCH_POLICIES[number];

/** Live-tool policies resolved for one executor invocation. */
export interface LiveToolsConfig {
  readonly webSearch: WebSearchPolicy;
}

/** Fan-out assignment models accepted by the schema. */
export const FANOUT_ASSIGNMENT_MODELS = ['flat_pool', 'wave'] as const;

/** Fan-out assignment model selected for a lineage or fan-out block. */
export type FanoutAssignmentModel = typeof FANOUT_ASSIGNMENT_MODELS[number];

const SANDBOX_MODES = ['read-only', 'workspace-write', 'danger-full-access'] as const;
export type SandboxMode = typeof SANDBOX_MODES[number];
export type ClaudePermissionMode = 'plan' | 'acceptEdits' | 'bypassPermissions';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const liveToolsSchema = z.object({
  webSearch: z.enum(WEB_SEARCH_POLICIES).default('inherit'),
}).default({ webSearch: 'inherit' });

export const executorConfigSchema = z.object({
  kind: z.enum(EXECUTOR_KINDS).default('native'),
  model: z.string().min(1).nullable().default(null),
  configDir: z.string().trim().min(1).nullable().default(null),
  reasoningEffort: z.enum(REASONING_EFFORTS).nullable().default(null),
  serviceTier: z.enum(SERVICE_TIERS).nullable().default(null),
  sandboxMode: z.enum(SANDBOX_MODES).nullable().default(null),
  // Hard ceiling of 1 hour per iteration: bounds a single executor invocation so a
  // runaway per-iteration call cannot by itself consume the whole autonomous lifetime budget.
  timeoutSeconds: z.number().int().positive().max(3600).default(900),
  // Optional fable-5 governor capsule for this executor's prompts. Universal and
  // kind-agnostic on purpose: intentionally absent from EXECUTOR_KIND_FLAG_SUPPORT
  // and the unsupported-field scan, so any executor kind may carry it. null = none.
  governor: z.string().min(1).nullable().default(null),
  liveTools: liveToolsSchema,
});

export type ExecutorConfig = z.infer<typeof executorConfigSchema>;

export const EXECUTOR_KIND_FLAG_SUPPORT: Record<ExecutorKind, readonly (keyof ExecutorConfig)[]> = {
  native: ['liveTools'],
  'cli-codex': ['model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'timeoutSeconds', 'liveTools'],
  'cli-claude-code': ['model', 'configDir', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds', 'liveTools'],
  'cli-opencode': ['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds', 'liveTools'],
};

/** Proven web-search policies for every shipped executor kind. */
export const EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX = {
  native: {
    inherit: true,
    disabled: false,
    cached: false,
    live: false,
  },
  'cli-codex': {
    inherit: true,
    disabled: true,
    cached: false,
    live: true,
  },
  'cli-claude-code': {
    inherit: true,
    disabled: false,
    cached: false,
    live: false,
  },
  'cli-opencode': {
    inherit: true,
    disabled: false,
    cached: false,
    live: true,
  },
} as const satisfies Record<ExecutorKind, Record<WebSearchPolicy, boolean>>;

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
 * Map a generic sandbox mode to the executor-agnostic CLI sandbox mode.
 *
 * @param mode - Generic sandbox mode or undefined.
 * @returns CLI-compatible sandbox mode.
 */
export function resolveSandboxMode(mode: SandboxMode | null | undefined): SandboxMode {
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
  const supportedFlags = EXECUTOR_KIND_FLAG_SUPPORT[config.kind];
  const unsupportedFields: string[] = [];
  const allOptionalFields: (keyof ExecutorConfig)[] = [
    'model',
    'configDir',
    'reasoningEffort',
    'serviceTier',
    'sandboxMode',
    'timeoutSeconds',
    'liveTools',
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
 * Reject an executor policy unless its adapter has a proven implementation.
 *
 * @param config - Validated executor configuration.
 * @param path - Error path prefix for nested fan-out entries.
 * @throws {@link ExecutorConfigError} If the requested policy is unsupported.
 */
export function assertExecutorWebSearchCapability(
  config: ExecutorConfig,
  path: PropertyKey[] = [],
): void {
  const policy = config.liveTools.webSearch;
  if (EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX[config.kind][policy]) {
    return;
  }

  throw new ExecutorConfigError({
    issues: [{
      path: [...path, 'liveTools', 'webSearch'],
      message: `web-search policy '${policy}' is not supported by executor kind '${config.kind}'`,
    }],
  });
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
const MAX_FANOUT_MODELS = 16;
const MAX_FANOUT_BRANCHES = 16;
const MAX_FANOUT_REPLICAS = 16;
const MAX_EXPANDED_LINEAGES = 256;

const lineageMetadataShape = {
  iterations: z.number().int().positive().nullable().default(null),
  promptFramework: z.string().min(1).nullable().default(null),
  assignment_model: z.enum(FANOUT_ASSIGNMENT_MODELS).default('flat_pool'),
  depends_on: z.array(z.string().trim().min(1)).default([]),
  touches: z.array(z.string().trim().min(1)).default([]),
};

/**
 * One fan-out lineage: a single executor config plus fan-out metadata.
 *
 * - `label`: directory-safe id for the lineage's isolated sub-packet.
 * - `count`: number of replicas of THIS config to run (e.g. 5x the same model).
 * - `iterations`: per-lineage max-iterations override; null = packet default.
 * - `promptFramework`: optional per-model prompt framing key (e.g. "costar",
 *   "tidd-ec") resolved against sk-prompt/prompt-models when a consumer renders the
 *   lineage prompt. null = consumer default. Loop-type-agnostic and optional, so
 *   research/review lineages that omit it are unaffected.
 * - `assignment_model`: defaults to the existing flat pool; `wave` is accepted
 *   only so the runtime guard can reject activation attempts explicitly.
 * - `depends_on` / `touches`: reserved dependency and path-domain metadata for
 *   a future guarded planner; flat-pool execution ignores them after logging.
 */
export const lineageExecutorSchema = executorConfigSchema.extend({
  label: z.string().min(1).regex(LINEAGE_LABEL_PATTERN, {
    message: "label must match /^[a-z0-9][a-z0-9-]*$/ (lowercase, digits, hyphens; dir-safe)",
  }),
  count: z.number().int().positive().max(MAX_FANOUT_REPLICAS).default(1),
  ...lineageMetadataShape,
});

export type LineageExecutor = z.infer<typeof lineageExecutorSchema>;

export const fanoutModelSchema = executorConfigSchema.extend({
  id: z.string().min(1).regex(LINEAGE_LABEL_PATTERN, {
    message: "id must match /^[a-z0-9][a-z0-9-]*$/ (lowercase, digits, hyphens; dir-safe)",
  }),
});

export const fanoutBranchSchema = z.object({
  id: z.string().min(1).regex(LINEAGE_LABEL_PATTERN, {
    message: "id must match /^[a-z0-9][a-z0-9-]*$/ (lowercase, digits, hyphens; dir-safe)",
  }),
  ...lineageMetadataShape,
});

const fanoutControlShape = {
  assignment_model: z.enum(FANOUT_ASSIGNMENT_MODELS).default('flat_pool'),
  concurrency: z.number().int().positive().max(8).default(2),
  maxRetries: z.number().int().nonnegative().max(5).default(5),
  // Stall detection defaults ON and is non-disableable while running autonomously: a
  // lineage that stops emitting progress is aborted and requeued within the ceiling and
  // fails loud, instead of hanging silently at 0% CPU until the hours-scale subprocess
  // timeout. Capped at 5 minutes; zero (the old opt-out) is now rejected, not accepted.
  lagCeilingMs: z.number().int().positive().max(300000).default(300000),
  progressHeartbeatSeconds: z.number().nonnegative().default(60),
};

export const legacyFanoutConfigSchema = z.object({
  executors: z.array(lineageExecutorSchema).min(1).max(MAX_FANOUT_BRANCHES),
  models: z.never().optional(),
  branches: z.never().optional(),
  replicas: z.never().optional(),
  ...fanoutControlShape,
});

export const fanoutManifestSchema = z.object({
  executors: z.never().optional(),
  models: z.array(fanoutModelSchema).min(1).max(MAX_FANOUT_MODELS),
  branches: z.array(fanoutBranchSchema).min(1).max(MAX_FANOUT_BRANCHES),
  replicas: z.number().int().positive().max(MAX_FANOUT_REPLICAS),
  ...fanoutControlShape,
});

/** Legacy executor lists and Cartesian manifests are intentionally exclusive. */
export const fanoutConfigSchema = z.union([
  legacyFanoutConfigSchema,
  fanoutManifestSchema,
]);

export type FanoutManifest = z.infer<typeof fanoutManifestSchema>;
type ParsedFanoutConfig = z.infer<typeof fanoutConfigSchema>;

/** Normalized fan-out config consumed by the existing scheduler. */
export interface FanoutConfig {
  readonly executors: LineageExecutor[];
  readonly assignment_model: FanoutAssignmentModel;
  readonly concurrency: number;
  readonly maxRetries: number;
  readonly lagCeilingMs: number;
  readonly progressHeartbeatSeconds: number;
}

function isFanoutManifest(config: ParsedFanoutConfig): config is FanoutManifest {
  return Array.isArray(config.models);
}

function assertUniqueManifestIds(
  values: readonly { id: string }[],
  field: 'models' | 'branches',
): void {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    if (seen.has(value.id)) {
      throw new ExecutorConfigError({
        issues: [{ path: [field, index, 'id'], message: `duplicate ${field.slice(0, -1)} id '${value.id}'` }],
      });
    }
    seen.add(value.id);
  });
}

/**
 * Compile a Cartesian manifest into the scheduler's existing lineage shape.
 *
 * @param manifest - Validated models-by-branches manifest.
 * @returns Deterministically ordered single-replica lineages.
 * @throws {@link ExecutorConfigError} If identifiers collide or exceed the legacy ceiling.
 */
export function compileFanoutManifest(manifest: FanoutManifest): LineageExecutor[] {
  assertUniqueManifestIds(manifest.models, 'models');
  assertUniqueManifestIds(manifest.branches, 'branches');

  const expandedCount = manifest.models.length * manifest.branches.length * manifest.replicas;
  if (expandedCount > MAX_EXPANDED_LINEAGES) {
    throw new ExecutorConfigError({
      issues: [{
        path: ['replicas'],
        message: `manifest expands to ${expandedCount} lineages; maximum is ${MAX_EXPANDED_LINEAGES}`,
      }],
    });
  }

  const lineages: LineageExecutor[] = [];
  const seenLabels = new Set<string>();
  for (const modelEntry of manifest.models) {
    const { id: modelId, ...executor } = modelEntry;
    for (const branchEntry of manifest.branches) {
      const { id: branchId, ...branch } = branchEntry;
      for (let replica = 1; replica <= manifest.replicas; replica += 1) {
        const label = `${branchId}-${modelId}-r${replica}`;
        if (seenLabels.has(label)) {
          throw new ExecutorConfigError({
            issues: [{
              path: ['branches'],
              message: `compiled lineage label '${label}' collides; choose unambiguous model and branch ids`,
            }],
          });
        }
        seenLabels.add(label);
        lineages.push({
          ...executor,
          ...branch,
          label,
          count: 1,
        });
      }
    }
  }
  return lineages;
}

/**
 * Parse and validate a raw fan-out configuration.
 *
 * Each entry's executor subset is routed through {@link parseExecutorConfig} so
 * ALL existing kind/model/flag rules apply per lineage with zero duplication.
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

  const parsedConfig = parsed.data;
  const hasManifest = isFanoutManifest(parsedConfig);

  if (hasManifest) {
    parsedConfig.models.forEach((entry, index) => {
      const { id: _id, ...executorSubset } = entry;
      try {
        parseExecutorConfig(executorSubset);
      } catch (err: unknown) {
        if (err instanceof ExecutorConfigError) {
          throw new ExecutorConfigError({
            issues: err.issues.map((issue) => ({ path: ['models', index, ...issue.path], message: issue.message })),
          });
        }
        throw err;
      }
    });
  }

  const executors = hasManifest
    ? compileFanoutManifest(parsedConfig)
    : parsedConfig.executors;
  const config: FanoutConfig = {
    executors,
    assignment_model: parsedConfig.assignment_model,
    concurrency: parsedConfig.concurrency,
    maxRetries: parsedConfig.maxRetries,
    lagCeilingMs: parsedConfig.lagCeilingMs,
    progressHeartbeatSeconds: parsedConfig.progressHeartbeatSeconds,
  };

  // Reuse the canonical single-executor validator per entry (kind/model/flags).
  if (!hasManifest) {
    config.executors.forEach((entry, index) => {
      const {
        label: _label,
        count: _count,
        iterations: _iterations,
        promptFramework: _promptFramework,
        assignment_model: _assignmentModel,
        depends_on: _dependsOn,
        touches: _touches,
        ...executorSubset
      } = entry;
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
  }

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
 * Validate every expanded lineage before the scheduler or a subprocess can run.
 *
 * @param lineages - Concrete scheduler inputs after replica expansion.
 * @throws {@link ExecutorConfigError} If any kind-policy combination is unsupported.
 */
export function preflightFanoutCapabilities(lineages: readonly LineageExecutor[]): void {
  lineages.forEach((lineage, index) => {
    assertExecutorWebSearchCapability(lineage, ['lineages', index]);
  });
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
