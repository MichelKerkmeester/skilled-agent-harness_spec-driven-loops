// ─────────────────────────────────────────────────────────────────────────────
// FABLE SUBAGENT GUARD (Claude PreToolUse, matcher: Task|Agent)
// ─────────────────────────────────────────────────────────────────────────────
// When the main session runs on a Fable model, subagents must not run on
// Fable too: only explicit Opus or Sonnet overrides are allowed. Two dispatch
// shapes would silently inherit the parent model and are therefore denied —
// subagent_type "fork" (which always ignores a model override) and any call
// that omits `model`.
//
// The hook payload does not carry the active main-loop model, so the guard
// reads it from the session transcript: the last assistant line's "model"
// field. When the transcript is missing or unreadable the guard fails open,
// matching every other guard in this repo — a broken guard must never block
// legitimate work.

import fs from 'node:fs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

const ALLOWED = /^(opus|sonnet)$|^claude-(opus|sonnet)\b/;
const TRANSCRIPT_TAIL_BYTES = 2 * 1024 * 1024;

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

// Last main-loop model wins: the transcript appends chronologically, so the final
// occurrence reflects the model currently driving the session.
//
// Sidechain lines must be excluded, and that is the whole difficulty. A subagent
// entry carries its own model, and dispatching one is the action this guard
// PERMITS, so a raw scan of the tail reads the permitted subagent's model as the
// parent's and concludes the parent is safe. The guard would then wave through the
// fork it exists to stop, defeated by its own allowed path. Parse per line and keep
// only entries the transcript marks as belonging to the main loop.
function activeMainModel(transcriptPath) {
  try {
    const stat = fs.statSync(transcriptPath);
    const start = Math.max(0, stat.size - TRANSCRIPT_TAIL_BYTES);
    const fd = fs.openSync(transcriptPath, 'r');
    const buf = Buffer.alloc(stat.size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    fs.closeSync(fd);

    const lines = buf.toString('utf8').split('\n');
    // A tail read can begin mid-line, and a half object is not evidence of anything.
    if (start > 0) lines.shift();

    let model = null;
    for (const line of lines) {
      if (!line.startsWith('{')) continue;
      let entry;
      try { entry = JSON.parse(line); } catch { continue; }
      if (entry?.isSidechain === true) continue;
      const candidate = entry?.message?.model ?? entry?.model;
      if (typeof candidate === 'string' && candidate.startsWith('claude-')) model = candidate;
    }
    return model;
  } catch {
    return null;
  }
}

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
}

function main() {
  if (!isHookEnabled('task-dispatch')) return; // kill-switch: full no-op
  let payload;
  try {
    payload = JSON.parse(readStdin());
  } catch {
    return; // malformed stdin: fail open
  }
  if (!payload || typeof payload !== 'object') return;

  const tool = payload.tool_name;
  if (tool !== 'Task' && tool !== 'Agent') return;

  const mainModel = activeMainModel(payload.transcript_path);
  if (!mainModel || !/fable/i.test(mainModel)) return;

  const input = payload.tool_input || {};
  if (input.subagent_type === 'fork') {
    deny(
      `Main session runs on ${mainModel}; fork subagents always inherit the parent model, so a fork would run on Fable. ` +
      'Dispatch a non-fork agent with model: "opus" or model: "sonnet" instead.',
    );
    return;
  }

  const requested = String(input.model || '').toLowerCase().trim();
  if (!requested) {
    deny(
      `Main session runs on ${mainModel}; a subagent without a model override inherits Fable. ` +
      'Pass model: "opus" or model: "sonnet" on the Agent call.',
    );
    return;
  }
  if (!ALLOWED.test(requested)) {
    deny(
      `Main session runs on ${mainModel}; subagent model "${requested}" is not permitted. ` +
      'Only "opus" or "sonnet" subagents may be dispatched while Fable drives the main loop.',
    );
  }
}

main();
