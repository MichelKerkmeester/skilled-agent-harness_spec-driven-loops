// ───────────────────────────────────────────────────────────────
// MODULE: Memory Runtime Guard
// ───────────────────────────────────────────────────────────────

type InitTasks = () => Promise<void>;

let initialized = false;
let initPromise: Promise<void> | null = null;
let initTasks: InitTasks | null = null;

export function registerInitTasks(fn: InitTasks): void {
  initTasks = fn;
}

export function isMemoryRuntimeInitialized(): boolean {
  return initialized;
}

export async function ensureMemoryRuntimeInitialized(reason: string): Promise<void> {
  if (initialized) {
    return;
  }

  if (initPromise) {
    await initPromise;
    return;
  }

  const startTime = Date.now();
  console.error(`[memory-runtime] init start reason=${reason}`);

  initPromise = (async () => {
    await initTasks?.();
    initialized = true;
    console.error(`[memory-runtime] init complete duration_ms=${Date.now() - startTime}`);
  })();

  try {
    await initPromise;
  } catch (error: unknown) {
    initPromise = null;
    throw error;
  }
}
