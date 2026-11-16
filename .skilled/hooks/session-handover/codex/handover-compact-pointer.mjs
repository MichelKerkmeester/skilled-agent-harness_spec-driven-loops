// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Session Note Pointer
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { configPath, isHookEnabled, loadConfigFile } from '../../shared/hook-flags.mjs';
import { appendLog, isEntrypoint, parseHandoff } from '../lib/relaunch-core.cjs';
import nudge from '../lib/nudge.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-handover';
const EVENT = 'SessionStart';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  process.exit(0);
}

// The envelope flushes before exit so a piped stdout cannot truncate it.
function emit(text) {
  const envelope = { hookSpecificOutput: { hookEventName: EVENT, additionalContext: text } };
  process.stdout.write(JSON.stringify(envelope), done);
}

// Logging is best-effort: a state-dir failure must never break the hook.
function logEvent(event, fields) {
  try {
    appendLog(event, fields, process.env);
  } catch {}
}

// The pointer names the note's date so the session can check git for work done since.
function noteFields(notePath) {
  try {
    const { frontmatter } = parseHandoff(fs.readFileSync(notePath, 'utf8'));
    return {
      specFolder: typeof frontmatter.spec_folder === 'string' ? frontmatter.spec_folder : '',
      createdAt: typeof frontmatter.created_at === 'string' ? frontmatter.created_at : '',
    };
  } catch {
    return { specFolder: '', createdAt: '' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// Codex runs its start hooks again with the compact source after it compacts a root session,
// before the next model request, and adds their context for the model. A compacted session
// keeps its id but loses the detail its handoff note holds, so it is pointed back at that
// note. Compaction also frees the context the spent nudge level was measured against, so the
// level resets and the next fill nudges again.
async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN, process.env, loadConfigFile(configPath()), { runtime: 'codex' });
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

  // The operator withdrew the hand-over after this note was written, so the work since is not in
  // it; pointing the session at a claim would resume work that is already done.
  if (nudge.handoffWithdrawn({ sessionId, notePath })) {
    logEvent('compact-pointer-stale-note', { sessionId, note: notePath });
    return emit(nudge.staleNoteText({ notePath }));
  }

  logEvent('compact-pointer', { sessionId, note: notePath });
  const { specFolder, createdAt } = noteFields(notePath);
  return emit(nudge.seedText({
    notePath,
    specFolder,
    sessionId,
    cliPath: nudge.CLI_COMMAND,
    afterCompaction: true,
    createdAt,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);
