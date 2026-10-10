// ───────────────────────────────────────────────────────────────────
// MODULE: Shared CommonJS Hook Adapter Helpers
// ───────────────────────────────────────────────────────────────────
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every runtime hook adapter under .skilled/hooks/. CommonJS adapters
// require it. ESM adapters import readStdin and parseJsonFailOpen by
// name, which Node resolves from the plain object literal assigned to
// module.exports at the bottom of this file, so keep that assignment a
// literal of bare names. A second, independent ESM sibling lives at
// system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs for that
// skill's own spec-gate-enforce.mjs adapters, which are not part of the
// fully-portable set -- keeping this copy local means every adapter under
// hooks/ has zero dependency outside this tree.

'use strict';

// A host that never closes stdin would otherwise hold the hook until the host's
// own timeout kills it, so the read settles on whichever comes first: the end of
// the stream, or the deadline with whatever has arrived by then.
function readStdin({ timeoutMs = 3000 } = {}) {
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

function parseJsonFailOpen(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

module.exports = { readStdin, parseJsonFailOpen };
