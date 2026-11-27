// ───────────────────────────────────────────────────────────────────
// MODULE: Posture Matrix
// ───────────────────────────────────────────────────────────────────
//
// A bot declares how it is isolated and which sandbox class it needs, and
// the runner refuses before dispatch any posture the chosen executor kind
// cannot honor. The matrix reads the deep-loop executor tables at run time
// instead of copying them, so a kind's capability can change in one place.
// A kind whose sandbox is only an approval or tool gate is admitted for a
// read-only posture alone; only a kind with an OS-level boundary may write.
// The native kind is never admitted, because its child inherits the full
// parent environment and the environment allowlist would not hold.

import {
  EXECUTOR_ADAPTER_CAPABILITIES,
  EXECUTOR_KINDS,
  EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY,
  parseExecutorConfig,
  resolveSandboxMode,
} from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { resolveIsolation } from './definition.js';
import { READABLE_LOG_FORMATS } from './dispatch.js';

import type { ExecutorConfig, ExecutorKind, SandboxMode } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import type { BotDefinition } from './definition.js';
import type { RepoConfig, Result } from './repo-config.js';
import type { HonoredPosture } from './run-record.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The posture the runner will honor, and the executor config it dispatches with. */
export interface PostureVerdict {
  posture: HonoredPosture;
  executor: ExecutorConfig;
}

const SANDBOX_VALUES: readonly SandboxMode[] = ['read-only', 'workspace-write', 'danger-full-access'];

/** Sandbox surfaces that enforce a read-only posture without an OS boundary: a tool or approval gate. */
const READ_ONLY_GATE_SURFACES = new Set(['permission-mode', 'tool-allowlist', 'permission-config']);

/** Runtime keys the runner forwards to the executor config; the rest stay with the definition. */
const FORWARDED_RUNTIME_KEYS = ['model', 'reasoningEffort', 'serviceTier'] as const;

// ───────────────────────────────────────────────────────────────────
// 2. MATRIX
// ───────────────────────────────────────────────────────────────────

function isExecutorKind(value: string): value is ExecutorKind {
  return (EXECUTOR_KINDS as readonly string[]).includes(value);
}

/**
 * Whether a kind can honor a sandbox class. A preventive kind honors every
 * class; a gate-only kind honors read-only; every other kind honors none.
 */
export function kindHonorsSandbox(kind: ExecutorKind, sandbox: SandboxMode): boolean {
  if (kind === 'native') return false;
  if (EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY[kind]) return true;
  const surface = EXECUTOR_ADAPTER_CAPABILITIES[kind].sandboxSurface;
  return sandbox === 'read-only' && READ_ONLY_GATE_SURFACES.has(surface);
}

/** Every kind that can honor a sandbox class, for the refusal message. */
export function kindsHonoring(sandbox: SandboxMode): ExecutorKind[] {
  return EXECUTOR_KINDS.filter((kind) => kindHonorsSandbox(kind, sandbox));
}

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ───────────────────────────────────────────────────────────────────

/**
 * Check a definition's declared posture against its executor kind.
 *
 * @param access The install record's full-access grant, false for a bot
 *   installed without it or not installed at all.
 * @returns The honored posture and executor config, or a refusal such as
 *   `isolation-undeclared`, `executor-kind-native` or `posture-unhonorable`.
 */
export function validatePosture(
  definition: Pick<BotDefinition, 'posture' | 'runtime' | 'budget'>,
  config: Pick<RepoConfig, 'defaultIsolation' | 'allowedExecutorKinds'>,
  access: { fullAccess: boolean } = { fullAccess: false },
): Result<PostureVerdict> {
  // Both isolation values are honored; the runner turns `worktree` into a
  // real tree after this check. Only an undeclared answer is refused here.
  const isolation = resolveIsolation(definition, config);
  if (!isolation.ok) return isolation;

  const kind = definition.runtime.kind;
  if (!isExecutorKind(kind)) return { ok: false, reason: 'executor-kind-unknown', detail: kind };
  if (kind === 'native') {
    return { ok: false, reason: 'executor-kind-native', detail: 'a native child inherits the full environment' };
  }
  if (config.allowedExecutorKinds !== null && !config.allowedExecutorKinds.includes(kind)) {
    return { ok: false, reason: 'executor-kind-not-allowed', detail: kind };
  }

  const declared = definition.posture.sandbox;
  if (declared !== null && !SANDBOX_VALUES.includes(declared as SandboxMode)) {
    return { ok: false, reason: 'sandbox-invalid', detail: `expected one of ${SANDBOX_VALUES.join(', ')}` };
  }
  const requested = resolveSandboxMode(declared as SandboxMode | null);
  // A definition cannot grant itself full access: only the operator's install-time flag can.
  const sandbox: SandboxMode = requested === 'danger-full-access' && !access.fullAccess ? 'workspace-write' : requested;
  if (!kindHonorsSandbox(kind, sandbox)) {
    const honoring = kindsHonoring(sandbox);
    return {
      ok: false,
      reason: 'posture-unhonorable',
      detail: `${kind} cannot honor sandbox ${sandbox}; kinds that can: ${honoring.length > 0 ? honoring.join(', ') : 'none'}`,
    };
  }

  // A child that asks a question and exits 0 must park, so a kind whose
  // output the runner cannot read for the decision marker never dispatches.
  const format = EXECUTOR_ADAPTER_CAPABILITIES[kind].logFormat;
  if (format === null || !READABLE_LOG_FORMATS.has(format)) {
    return { ok: false, reason: 'decision-marker-unreadable', detail: `${kind} prints ${format ?? 'no'} output the runner cannot read for a decision` };
  }

  const raw: Record<string, unknown> = { kind, sandboxMode: sandbox, timeoutSeconds: definition.budget.timeoutSeconds };
  for (const key of FORWARDED_RUNTIME_KEYS) {
    if (definition.runtime[key] !== undefined) raw[key] = definition.runtime[key];
  }
  let executor: ExecutorConfig;
  try {
    executor = parseExecutorConfig(raw);
  } catch (error: unknown) {
    return { ok: false, reason: 'executor-config-invalid', detail: error instanceof Error ? error.message : String(error) };
  }

  return {
    ok: true,
    value: {
      posture: { isolation: isolation.value, sandbox, executorKind: kind, model: executor.model },
      executor,
    },
  };
}
