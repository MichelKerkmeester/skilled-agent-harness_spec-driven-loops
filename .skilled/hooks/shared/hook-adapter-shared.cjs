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
//
// The byte cap bounds what a runaway stream can retain. It sits far above any
// real hook payload, since the largest tool input and result across 40 recent
// Claude Code transcripts are about 68 KB and 234 KB, and the largest tracked
// file in this repository about 26 MB. A stream that crosses the cap resolves
// to an empty string, the same no-input result every caller already fails open
// on, rather than throwing.
const MAX_STDIN_BYTES = 64 * 1024 * 1024;

function readStdin({ timeoutMs = 3000, maxBytes = MAX_STDIN_BYTES } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytesRead = 0;
    let overCap = false;
    let settled = false;
    let timer = null;

    const onData = (chunk) => {
      if (overCap) return;
      bytesRead += chunk.length;
      if (bytesRead > maxBytes) {
        overCap = true;
        // Pausing inside a data handler leaves the stdin handle referenced, so
        // defer the release that lets a host keeping the pipe open exit.
        setImmediate(() => settle(''));
        return;
      }
      chunks.push(chunk);
    };
    const onEnd = () => settle(overCap ? '' : Buffer.concat(chunks).toString('utf8'));
    const onError = (error) => {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    };
    const settle = (text) => {
      if (settled) return;
      settled = true;
      release();
      resolve(text);
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
