// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Shutdown Hooks
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

export type ShutdownHook = () => void | Promise<void>;

interface ShutdownHookRecord {
  readonly id: number;
  readonly hook: ShutdownHook;
  readonly timeoutMs: number;
}

export interface ShutdownHookResult {
  readonly id: number;
  readonly ok: boolean;
  readonly error?: string;
  readonly timedOut?: boolean;
}

interface RegisterShutdownHookOptions {
  readonly timeoutMs?: number;
}

// ───────────────────────────────────────────────────────────────
// 2. STATE
// ───────────────────────────────────────────────────────────────

const DEFAULT_HOOK_TIMEOUT_MS = 1_000;
const hooks = new Map<number, ShutdownHookRecord>();
let nextHookId = 1;
let installed = false;
let running = false;

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function registerShutdownHook(
  hook: ShutdownHook,
  options: RegisterShutdownHookOptions = {},
): () => void {
  installProcessHooks();
  const id = nextHookId++;
  hooks.set(id, {
    id,
    hook,
    timeoutMs: normalizeTimeout(options.timeoutMs),
  });

  return () => {
    hooks.delete(id);
  };
}

export async function runShutdownHooks(): Promise<ShutdownHookResult[]> {
  if (running) return [];
  running = true;
  const results: ShutdownHookResult[] = [];

  try {
    for (const record of hooks.values()) {
      results.push(await runOneHook(record));
    }
  } finally {
    hooks.clear();
    running = false;
  }

  return results;
}

export function getShutdownHookCount(): number {
  return hooks.size;
}

export function clearShutdownHooksForTests(): void {
  hooks.clear();
  running = false;
}

async function runOneHook(record: ShutdownHookRecord): Promise<ShutdownHookResult> {
  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      Promise.resolve().then(() => record.hook()),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(Object.assign(new Error(`Shutdown hook timed out after ${record.timeoutMs}ms`), { timedOut: true }));
        }, record.timeoutMs);
        timer.unref?.();
      }),
    ]);
    return { id: record.id, ok: true };
  } catch (error: unknown) {
    return {
      id: record.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      timedOut: Boolean(error && typeof error === 'object' && 'timedOut' in error),
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function normalizeTimeout(timeoutMs: number | undefined): number {
  if (timeoutMs === undefined) return DEFAULT_HOOK_TIMEOUT_MS;
  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : DEFAULT_HOOK_TIMEOUT_MS;
}

function installProcessHooks(): void {
  if (installed) return;
  installed = true;

  process.once('SIGTERM', () => {
    void runShutdownHooks();
  });
  process.once('SIGINT', () => {
    void runShutdownHooks();
  });
  process.once('beforeExit', () => {
    void runShutdownHooks();
  });
}
