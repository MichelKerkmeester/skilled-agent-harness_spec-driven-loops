// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Hook Stdin Reader
// ───────────────────────────────────────────────────────────────────
// The compiled runtime adapters read their stdin payload through this one
// function. It keeps the deadline semantics of lib/hook-adapter-shared.mjs,
// which the plain .mjs and .cjs adapters use. That file cannot serve the
// compiled adapters because it is not part of the TypeScript build, so it is
// absent from dist where they run.

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS & TYPES
// ───────────────────────────────────────────────────────────────────

/** Default stdin deadline, the same value lib/hook-adapter-shared.mjs uses. */
export const HOOK_STDIN_TIMEOUT_MS = 3000;

/**
 * Stdin deadline for entries whose host kills them after 3 seconds. The read
 * has to end early enough that the work after it still finishes inside the
 * host timeout. lib/hook-adapter-shared.mjs and claude/user-prompt-submit.ts
 * carry the same value.
 */
export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;

/** Options for one bounded stdin read. */
export interface ReadHookStdinOptions {
  readonly timeoutMs?: number;
  readonly maxBytes?: number;
}

// ───────────────────────────────────────────────────────────────────
// 2. READER
// ───────────────────────────────────────────────────────────────────

/**
 * Collect stdin until it ends or the deadline passes, then release it.
 * A host that never closes stdin would otherwise hold the hook until the
 * host's own timeout kills it, so the read settles on whichever comes first
 * and resolves with whatever text has arrived. When more than maxBytes
 * arrive, stdin is destroyed and the promise resolves with null, so a runaway
 * payload is never buffered whole. A stream error rejects.
 */
export function readHookStdin(options: ReadHookStdinOptions = {}): Promise<string | null> {
  const timeoutMs = options.timeoutMs ?? HOOK_STDIN_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? Number.POSITIVE_INFINITY;

  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let settled = false;

    const release = (): void => {
      clearTimeout(timer);
      stdin.removeListener('data', onData);
      stdin.removeListener('end', onEnd);
      stdin.removeListener('error', onError);
      stdin.pause();
    };

    function onEnd(): void {
      if (settled) return;
      settled = true;
      release();
      resolve(Buffer.concat(chunks, totalBytes).toString('utf8'));
    }

    function onError(error: Error): void {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    }

    function onData(chunk: Buffer | string): void {
      if (settled) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > maxBytes) {
        settled = true;
        release();
        stdin.destroy();
        resolve(null);
        return;
      }
      chunks.push(buffer);
    }

    // Listeners go on before the timer, so a stdin that cannot take listeners
    // rejects at once and leaves no timer behind. The handlers only run after
    // this function returns, so the timer is always set before release reads it.
    stdin.on('data', onData);
    stdin.on('end', onEnd);
    stdin.on('error', onError);
    const timer = setTimeout(onEnd, timeoutMs);
  });
}
