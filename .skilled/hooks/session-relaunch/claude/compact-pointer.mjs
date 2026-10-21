// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Compaction Pointer
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled, loadConfigFile, configPath } from '../../shared/hook-flags.mjs';
import { appendLog, isEntrypoint, parseHandoff, payloadEventName } from '../lib/relaunch-core.cjs';
import nudge from '../lib/nudge.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  process.exit(0);
}

// The envelope flushes before exit so a piped stdout cannot truncate it.
function emit(eventName, text) {
  const envelope = { hookSpecificOutput: { hookEventName: eventName, additionalContext: text } };
  process.stdout.write(JSON.stringify(envelope), done);
}

// Logging is best-effort: a state-dir failure must never break the hook.
function logEvent(event, fields) {
  try {
    appendLog(event, fields, process.env);
  } catch {}
}

function noteSpecFolder(notePath) {
  try {
    const folder = parseHandoff(fs.readFileSync(notePath, 'utf8')).frontmatter.spec_folder;
    return typeof folder === 'string' ? folder : '';
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// A compacted session keeps its id but loses the detail its handoff note holds, so the
// session is pointed back at that note. Compaction also frees the context the spent
// nudge level was measured against, so the level resets and the next fill nudges again.
async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN, process.env, loadConfigFile(configPath()));
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || typeof payload !== 'object') return done();
  if (payload.source !== 'compact') return done();

  const sessionId = payload.session_id;
  if (!nudge.validSessionId(sessionId)) return done();

  try {
    nudge.writeState(sessionId, 0);
  } catch (error) {
    logEvent('compact-pointer-error', { stage: 'state', message: error.message });
  }

  // A prepared hop already owns the note; claiming it here would leave the fresh
  // session nothing to claim.
  if (nudge.handoffPending({ sessionId })) return done();

  const notePath = nudge.openNotePathFor({ repoRoot: nudge.resolveRepoRoot(), sessionId });
  if (notePath === null) return done();

  logEvent('compact-pointer', { sessionId, note: notePath });
  return emit(payloadEventName(payload, { runtime: 'claude' }), nudge.seedText({
    notePath,
    specFolder: noteSpecFolder(notePath),
    sessionId,
    cliPath: nudge.CLI_COMMAND,
    afterCompaction: true,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);
