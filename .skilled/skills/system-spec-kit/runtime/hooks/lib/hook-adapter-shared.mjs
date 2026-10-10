// ───────────────────────────────────────────────────────────────────
// MODULE: Shared ESM Hook Adapter Helpers
// ───────────────────────────────────────────────────────────────────
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every plain .mjs and .cjs hook adapter in this skill. ESM adapters import
// readStdin by name and CommonJS adapters load it with a dynamic import. The
// compiled TypeScript adapters read through ../shared-stdin.ts instead, which
// keeps the same deadline, because this file is not part of the TypeScript
// build and so is absent from dist. Nothing here imports from .skilled/hooks:
// this skill's hooks stay self-contained, and the reader in
// .skilled/hooks/shared/hook-adapter-shared.cjs is an independent sibling.

// Stdin deadline for adapters whose host kills them after 3 seconds. The read
// has to end early enough that the work after it still finishes inside the
// host timeout. ../shared-stdin.ts carries the same value for the compiled
// adapters.
export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;

// A host that never closes stdin would otherwise hold the hook until the host's
// own timeout kills it, so the read settles on whichever comes first: the end of
// the stream, or the deadline with whatever has arrived by then.
export function readStdin({ timeoutMs = 3000 } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    let timer = null;

    const onData = (chunk) => chunks.push(chunk);
    const onEnd = () => {
      if (settled) return;
      settled = true;
      release();
      resolve(Buffer.concat(chunks).toString('utf8'));
    };
    const onError = (error) => {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    };
    const release = () => {
      clearTimeout(timer);
      process.stdin.removeListener('data', onData);
      process.stdin.removeListener('end', onEnd);
      process.stdin.removeListener('error', onError);
      process.stdin.pause();
    };

    timer = setTimeout(onEnd, timeoutMs);
    process.stdin.on('data', onData);
    process.stdin.on('end', onEnd);
    process.stdin.on('error', onError);
  });
}

export function parseJsonFailOpen(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
