// MODULE: Deep-Loop Sleep

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const SLEEP_CHUNK_MS = 200;

type SleepSignalInput = AbortSignal | readonly AbortSignal[];

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

export function composeAbortSignals(signals: readonly AbortSignal[]): AbortSignal | undefined {
  if (signals.length === 0) {
    return undefined;
  }

  if (signals.length === 1) {
    return signals[0];
  }

  return AbortSignal.any(signals);
}

function normalizeSignal(signalOrSignals?: SleepSignalInput): AbortSignal | undefined {
  if (Array.isArray(signalOrSignals)) {
    return composeAbortSignals(signalOrSignals);
  }

  return signalOrSignals;
}

function sleepChunk(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = (): void => {
      signal?.removeEventListener('abort', onAbort);
    };

    const onAbort = (): void => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }

      cleanup();
      reject(signal?.reason);
    };

    timer = setTimeout(() => {
      timer = undefined;
      cleanup();
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ───────────────────────────────────────────────────────────────────

export async function abortableSleep(ms: number, signal?: AbortSignal): Promise<void>;
export async function abortableSleep(ms: number, signals: readonly AbortSignal[]): Promise<void>;
export async function abortableSleep(ms: number, signalOrSignals?: SleepSignalInput): Promise<void> {
  const signal = normalizeSignal(signalOrSignals);
  if (signal?.aborted) {
    throw signal.reason;
  }

  let remainingMs = Math.max(0, ms);
  while (remainingMs > 0) {
    const chunkMs = Math.min(remainingMs, SLEEP_CHUNK_MS);
    await sleepChunk(chunkMs, signal);
    remainingMs -= chunkMs;

    if (signal?.aborted) {
      throw signal.reason;
    }
  }
}
