// ───────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Executor Config
// ───────────────────────────────────────────────────────────────

import { z } from '../../../system-spec-kit/mcp_server/node_modules/zod/index.js';

export const EXECUTOR_KINDS = ['native', 'cli-codex', 'cli-gemini', 'cli-claude-code', 'cli-opencode', 'cli-devin'] as const;
export type ExecutorKind = typeof EXECUTOR_KINDS[number];

export const REASONING_EFFORTS = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh'] as const;
export type ReasoningEffort = typeof REASONING_EFFORTS[number];

export const SERVICE_TIERS = ['priority', 'standard', 'fast'] as const;
export type ServiceTier = typeof SERVICE_TIERS[number];

const SANDBOX_MODES = ['read-only', 'workspace-write', 'danger-full-access'] as const;
export type SandboxMode = typeof SANDBOX_MODES[number];
export type GeminiSandboxMode = 'docker' | 'none';
export type ClaudePermissionMode = 'plan' | 'acceptEdits' | 'bypassPermissions';

export const executorConfigSchema = z.object({
  kind: z.enum(EXECUTOR_KINDS).default('native'),
  model: z.string().min(1).nullable().default(null),
  reasoningEffort: z.enum(REASONING_EFFORTS).nullable().default(null),
  serviceTier: z.enum(SERVICE_TIERS).nullable().default(null),
  sandboxMode: z.enum(SANDBOX_MODES).nullable().default(null),
  timeoutSeconds: z.number().int().positive().default(900),
});

export type ExecutorConfig = z.infer<typeof executorConfigSchema>;

export const EXECUTOR_KIND_FLAG_SUPPORT: Record<ExecutorKind, readonly (keyof ExecutorConfig)[]> = {
  native: [],
  'cli-codex': ['model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'timeoutSeconds'],
  'cli-gemini': ['model', 'sandboxMode', 'timeoutSeconds'],
  'cli-claude-code': ['model', 'reasoningEffort', 'sandboxMode', 'timeoutSeconds'],
  // cli-opencode: opencode run --variant <high|medium|minimal> maps to reasoningEffort.
  // sandboxMode is NOT supported — opencode CLI has no read-only equivalent and the
  // YAML branches always pass --dangerously-skip-permissions. Including sandboxMode
  // here without a runtime branch would be a schema-runtime contract violation
  // (see packet 102 P1-028); reject it like we reject serviceTier for non-codex.
  'cli-opencode': ['model', 'reasoningEffort', 'timeoutSeconds'],
  // cli-devin: devin --model <swe-1.6|deepseek-v4|glm-5.1|kimi-k2.6> with
  // --permission-mode <auto|dangerous> resolved from sandboxMode. reasoningEffort is
  // NOT supported — Devin's per-model reasoning depth is fixed at the CLI surface.
  // serviceTier is also NOT supported. See cli-devin SKILL.md §2 for the dispatch
  // contract and packet 037/000 for the wiring decision.
  'cli-devin': ['model', 'sandboxMode', 'timeoutSeconds'],
};

export const GEMINI_SUPPORTED_MODELS = ['gemini-3.1-pro-preview'] as const;
export type GeminiSupportedModel = typeof GEMINI_SUPPORTED_MODELS[number];

export const DEVIN_SUPPORTED_MODELS = ['swe-1.6', 'deepseek-v4', 'glm-5.1', 'kimi-k2.6'] as const;
export type DevinSupportedModel = typeof DEVIN_SUPPORTED_MODELS[number];
export type DevinPermissionMode = 'auto' | 'dangerous';

function normalizeSandboxMode(mode: SandboxMode | null | undefined): SandboxMode {
  return mode ?? 'workspace-write';
}

export function resolveCodexSandboxMode(mode: SandboxMode | null | undefined): SandboxMode {
  return normalizeSandboxMode(mode);
}

export function resolveGeminiSandboxMode(mode: SandboxMode | null | undefined): GeminiSandboxMode {
  return normalizeSandboxMode(mode) === 'danger-full-access' ? 'none' : 'docker';
}

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

export function resolveDevinPermissionMode(mode: SandboxMode | null | undefined): DevinPermissionMode {
  return normalizeSandboxMode(mode) === 'danger-full-access' ? 'dangerous' : 'auto';
}

type ExecutorConfigIssue = {
  path: PropertyKey[];
  message: string;
};

export class ExecutorNotWiredError extends Error {
  kind: Extract<ExecutorKind, 'cli-gemini' | 'cli-claude-code'>;

  constructor(kind: Extract<ExecutorKind, 'cli-gemini' | 'cli-claude-code'>) {
    super(`Executor kind '${kind}' is reserved in the schema but not yet wired. Awaiting future spec for ${kind} integration.`);
    this.name = 'ExecutorNotWiredError';
    this.kind = kind;
  }
}

export class ExecutorConfigError extends Error {
  issues: ExecutorConfigIssue[];

  constructor(input: { issues: ExecutorConfigIssue[] }) {
    super(input.issues.map((issue) => `${issue.path.map(String).join('.') || '<root>'}: ${issue.message}`).join('; '));
    this.name = 'ExecutorConfigError';
    this.issues = input.issues;
  }
}

function normalizeIssues(error: z.ZodError<ExecutorConfig>): ExecutorConfigIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path,
    message: issue.message,
  }));
}

export function parseExecutorConfig(raw: unknown): ExecutorConfig {
  const parsed = executorConfigSchema.safeParse(raw);
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
  if (config.kind === 'cli-devin' && config.model === null) {
    throw new ExecutorConfigError({
      issues: [{ path: ['model'], message: 'model is required when kind is cli-devin' }],
    });
  }

  const supportedFlags = EXECUTOR_KIND_FLAG_SUPPORT[config.kind];
  const unsupportedFields: string[] = [];
  const allOptionalFields: (keyof ExecutorConfig)[] = [
    'model',
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

  if (
    config.kind === 'cli-gemini' &&
    config.model !== null &&
    !GEMINI_SUPPORTED_MODELS.some((model) => model === config.model)
  ) {
    throw new ExecutorConfigError({
      issues: [
        {
          path: ['model'],
          message: `model '${config.model}' is not a supported cli-gemini model. Supported: ${GEMINI_SUPPORTED_MODELS.join(', ')}.`,
        },
      ],
    });
  }

  if (
    config.kind === 'cli-devin' &&
    config.model !== null &&
    !DEVIN_SUPPORTED_MODELS.some((model) => model === config.model)
  ) {
    throw new ExecutorConfigError({
      issues: [
        {
          path: ['model'],
          message: `model '${config.model}' is not a supported cli-devin model. Supported: ${DEVIN_SUPPORTED_MODELS.join(', ')}.`,
        },
      ],
    });
  }

  return config;
}

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
