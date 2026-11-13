// ───────────────────────────────────────────────────────────────
// MODULE: Command offer from an advisor head
// ───────────────────────────────────────────────────────────────
//
// A run line records which command the advisor offered and the policy it named,
// so a start rate can be read as "did the reader follow the offer" rather than
// only "did a command run". The offer is recovered by replaying the Claude
// prompt hook after the turn, because the head is the only text that names both
// the command and the policy, and a replay keeps the recorded value independent
// of whatever the session reader happened to retain.
//
// A failed replay returns null fields plus an offerError, so a backfill over a
// checkout without the hook, or a hook that crashes, still produces a readable
// line instead of aborting the run.
//
// The offer alone cannot tell a reader who ignored it from a brief the session
// never received, so the same module also reports whether the brief landed. A
// runtime with no confirmed place to look reports `unknown` rather than a miss,
// because a missing record there measures the reader, not the delivery.
//
// A log written before those fields existed gets them from a backfill, which
// resolves every prompt before it writes, so a refused row leaves no partial log
// behind and each line still answers for its own checkout.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadSession as loadSharedSession } from '../../../../../hooks/shared/session-readers/index.mjs';

const HOOK_RELATIVE = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';
const ADVISOR_CLI_RELATIVE = '.skilled/bin/skill-advisor.cjs';
const OFFER_PATTERN = /\/[a-z][a-z-]*:[a-z][a-z-]*(?: [a-z][a-z-]*)?/;
const POLICY_PATTERN = /^ *(?:\((run|start|ask)\))/;
const BRIEF_PATTERN = /Advisor: [a-z]+[;. ]/;
const CLAUDE_ATTACHMENT_EVENT = 'UserPromptSubmit';
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const CODEX_CHECK = join(REPO_ROOT, '.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs');

function failedOffer(offerError) {
  return { offeredCommand: null, offeredPolicy: null, offerError };
}

/**
 * Read the command and the policy out of the first line of a head.
 *
 * The policy only counts when it directly follows the command, so a `(ask)`
 * that belongs to a later clause cannot attach itself to an earlier match.
 *
 * @param {string} head - One line of advisor output.
 * @returns {{ offeredCommand: string | null, offeredPolicy: string | null }}
 */
export function parseOffer(head) {
  const text = typeof head === 'string' ? head : '';
  const match = text.match(OFFER_PATTERN);
  if (!match) {
    return { offeredCommand: null, offeredPolicy: null };
  }
  const policy = text.slice(match.index + match[0].length).match(POLICY_PATTERN);
  return {
    offeredCommand: match[0],
    offeredPolicy: policy ? policy[1] : null,
  };
}

/**
 * Replay the Claude prompt hook for one prompt and parse the offer it prints.
 *
 * The hook is resolved from the checkout rather than from this module, so a
 * backfill records what that checkout's advisor would have offered at the time
 * of the run, not what the current working copy happens to say.
 *
 * @param {object} options
 * @param {string} options.checkoutDir - Root of the checkout whose hook runs.
 * @param {string} options.prompt - The prompt to replay.
 * @param {string} options.sessionId - Session id for the hook payload.
 * @param {number} [options.timeoutMs] - Hook timeout before the replay fails.
 * @returns {{ offeredCommand: string | null, offeredPolicy: string | null, offerError: string | null }}
 */
export function replayOffer({ checkoutDir, prompt, sessionId, timeoutMs = DEFAULT_TIMEOUT_MS }) {
  const hookPath = join(checkoutDir, HOOK_RELATIVE);
  if (!existsSync(hookPath)) {
    return failedOffer('hook_missing');
  }

  const payload = {
    prompt,
    cwd: checkoutDir,
    hook_event_name: 'UserPromptSubmit',
    session_id: sessionId,
  };

  let result;
  try {
    result = spawnSync('node', [hookPath], {
      cwd: checkoutDir,
      input: JSON.stringify(payload),
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: MAX_OUTPUT_BYTES,
    });
  } catch {
    return failedOffer('hook_failed');
  }

  if (result.error || result.status !== 0 || typeof result.stdout !== 'string') {
    return failedOffer('hook_failed');
  }

  let output;
  try {
    output = JSON.parse(result.stdout);
  } catch {
    return failedOffer('hook_failed');
  }

  const context = output?.hookSpecificOutput?.additionalContext;
  if (typeof context !== 'string') {
    return failedOffer('no_head');
  }

  const [firstLine = ''] = context.split(/\r?\n/);
  if (!firstLine.trim()) {
    return failedOffer('no_head');
  }

  return { ...parseOffer(firstLine), offerError: null };
}

function contentHasBrief(content) {
  if (typeof content === 'string') return BRIEF_PATTERN.test(content);
  if (!Array.isArray(content)) return false;
  return content.some((part) => {
    if (typeof part === 'string') return BRIEF_PATTERN.test(part);
    return typeof part?.text === 'string' && BRIEF_PATTERN.test(part.text);
  });
}

// Neutral records keep their text in content blocks, and the block shape differs
// by runtime, so the serialized record is the one place the brief is found
// whichever block carries it.
function recordsHaveBrief(records) {
  return (Array.isArray(records) ? records : []).some((record) =>
    BRIEF_PATTERN.test(JSON.stringify(record ?? null)));
}

// Injected context sits beside the records rather than inside them, so a reader
// that reports it gives the brief a second place to be found.
function injectedHasBrief(injected) {
  return (Array.isArray(injected) ? injected : []).some(
    (entry) => typeof entry?.text === 'string' && BRIEF_PATTERN.test(entry.text),
  );
}

/**
 * Ask the project's Codex approval check whether its advisor hook can run.
 *
 * Codex skips an unapproved project hook without a warning, so a wired hook can
 * still deliver nothing. The check reports the approval recorded in the config
 * file it reads, and this wrapper turns that verdict into the answer the
 * delivery decision needs.
 *
 * @param {object} [options]
 * @param {string} [options.projectDir] - Project root whose hooks file is read.
 * @param {string} [options.configPath] - Codex config file, defaulting to the
 *   environment's Codex home.
 * @returns {'approved' | 'unapproved' | 'absent' | 'no-hooks' | 'unknown'}
 */
export function codexHookApproval({ projectDir, configPath } = {}) {
  if (typeof projectDir !== 'string' || projectDir === '') return 'unknown';

  const args = [CODEX_CHECK, '--root', projectDir, '--json'];
  if (configPath) args.push('--config', configPath);
  const result = spawnSync('node', args, { encoding: 'utf8', timeout: 10_000 });
  if (result.error || typeof result.stdout !== 'string') return 'unknown';

  let verdict;
  try {
    verdict = JSON.parse(result.stdout);
  } catch {
    return 'unknown';
  }

  switch (verdict?.code) {
    case 'codex-hooks-approved':
      return 'approved';
    case 'codex-hooks-unapproved':
      return 'unapproved';
    case 'codex-advisor-hook-absent':
      return 'absent';
    case 'no-codex-hooks':
      return 'no-hooks';
    default:
      return 'unknown';
  }
}

/**
 * Decide whether the advisor brief reached the session that ran the turn.
 *
 * A Claude transcript records the hook context as its own attachment line, so a
 * missing attachment is a real miss. Pi, Devin and DSH keep the brief in their
 * session store, either as a record or as injected context beside it, and Codex
 * answers from its approval plus whatever its store holds. OpenCode stays
 * `unknown`, because its plugin adds the brief in memory and the store keeps no
 * copy.
 *
 * @param {object} options
 * @param {string} options.runtime - The measured runtime.
 * @param {object|null} [options.locator] - The locator the run line recorded.
 * @param {Function} [options.loadSession] - Reader for a runtime whose brief
 *   lives in session records rather than a transcript file.
 * @param {string} [options.codexConfig] - Codex config file the approval is
 *   read from, defaulting to the environment's Codex home.
 * @returns {Promise<boolean | 'unknown'>}
 */
export async function briefDelivered({ runtime, locator, loadSession, codexConfig } = {}) {
  if (runtime === 'claude') {
    const transcriptPath = locator?.transcriptPath;
    if (typeof transcriptPath !== 'string' || transcriptPath.length === 0) {
      return 'unknown';
    }

    let raw;
    try {
      raw = readFileSync(transcriptPath, 'utf8');
    } catch {
      return 'unknown';
    }

    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      if (entry?.type !== 'attachment') continue;
      const attachment = entry.attachment;
      if (attachment?.type !== 'hook_additional_context') continue;
      if (attachment.hookEvent !== CLAUDE_ATTACHMENT_EVENT) continue;
      if (contentHasBrief(attachment.content)) return true;
    }
    return false;
  }

  if (runtime === 'pi' || runtime === 'devin' || runtime === 'dsh') {
    if (typeof loadSession !== 'function') return 'unknown';
    let loaded;
    try {
      loaded = await loadSession({ ...locator, runtime });
    } catch {
      return 'unknown';
    }
    if (!loaded?.ok) return 'unknown';
    return recordsHaveBrief(loaded.records) || injectedHasBrief(loaded.injected);
  }

  if (runtime === 'codex') {
    // An unapproved project hook never runs, so the brief cannot have arrived.
    // An approved one may store its context where no reader looks yet.
    if (codexHookApproval({ projectDir: locator?.projectDir, configPath: codexConfig }) === 'unapproved') {
      return false;
    }

    if (typeof loadSession !== 'function') return 'unknown';
    let loaded;
    try {
      loaded = await loadSession({ ...locator, runtime });
    } catch {
      return 'unknown';
    }
    if (!loaded?.ok) return 'unknown';
    return recordsHaveBrief(loaded.records) || injectedHasBrief(loaded.injected)
      ? true
      : 'unknown';
  }

  return 'unknown';
}

// ───────────────────────────────────────────────────────────────
// Run-log backfill
// ───────────────────────────────────────────────────────────────

// A fresh daemon can outlast the first prompt's budget, so the backfill asks
// each checkout to start one before it replays. The status call writes nothing,
// and its failure is ignored because a replay that finds no daemon records its
// own error instead of losing the line.
function warmCheckout(checkoutDir) {
  const cliPath = join(checkoutDir, ADVISOR_CLI_RELATIVE);
  if (!existsSync(cliPath)) return;
  spawnSync(
    'node',
    [cliPath, 'advisor_status', '--workspace-root', checkoutDir, '--format', 'json', '--no-warm-only'],
    {
      cwd: checkoutDir,
      encoding: 'utf8',
      timeout: DEFAULT_TIMEOUT_MS,
      maxBuffer: MAX_OUTPUT_BYTES,
    },
  );
}

function refused(code, detail) {
  return { ok: false, code, detail };
}

/**
 * Add the offer, its policy and the brief to every line of a run log.
 *
 * The prompts are resolved before the first line is written, so a row the
 * corpus refuses leaves no output file behind. A line whose locator names no
 * checkout keeps null offer fields and its own error code, and the rest of the
 * log is still written.
 *
 * @param {object} options
 * @param {string} options.inPath - Run log to read.
 * @param {string} options.outPath - New run log to write.
 * @param {(rowId: string) => string} options.promptFor - Prompt lookup. It
 *   refuses an unknown or holdout row by throwing an error with a `code`.
 * @param {boolean} [options.briefOnly] - Write only the delivery answer and
 *   leave every offer field exactly as the input line holds it.
 * @param {Function} [options.replay] - Offer replay, injectable for tests.
 * @param {Function} [options.brief] - Brief delivery reader, injectable for tests.
 * @param {(checkoutDir: string) => unknown} [options.warm] - Daemon warm-up,
 *   injectable for tests.
 * @returns {Promise<{ ok: true, lines: number, outPath: string }
 *   | { ok: false, code: string, detail: string }>}
 */
export async function backfillRunLog({
  inPath,
  outPath,
  promptFor,
  briefOnly = false,
  replay = replayOffer,
  brief = briefDelivered,
  warm = warmCheckout,
}) {
  if (resolve(outPath) === resolve(inPath)) {
    return refused('same_path', `${outPath}: the backfill writes a new log`);
  }

  const rows = [];
  for (const raw of readFileSync(inPath, 'utf8').split('\n')) {
    if (raw.trim() === '') continue;
    rows.push(JSON.parse(raw));
  }

  const prompts = [];
  for (const row of rows) {
    try {
      prompts.push(promptFor(row.rowId));
    } catch (error) {
      return refused(error?.code ?? 'unknown_row', error?.message ?? String(error));
    }
  }

  const warmed = new Set();
  const output = [];
  for (let index = 0; index < rows.length; index += 1) {
    const line = rows[index];
    const rowId = line.rowId;
    const locator = line.locator !== null && typeof line.locator === 'object' && !Array.isArray(line.locator)
      ? line.locator
      : null;
    const projectDir = locator?.projectDir;
    const checkoutDir = typeof projectDir === 'string' && projectDir !== '' ? projectDir : null;

    let offer = null;
    if (!briefOnly) {
      offer = { offeredCommand: null, offeredPolicy: null, offerError: 'no_checkout' };
      if (checkoutDir !== null) {
        if (!warmed.has(checkoutDir)) {
          warmed.add(checkoutDir);
          try {
            await warm(checkoutDir);
          } catch {
            // A failed warm-up still lets the replay report its own miss.
          }
        }
        offer = await replay({
          checkoutDir,
          prompt: prompts[index],
          sessionId: `backfill-${rowId}`,
        });
      }
    }

    // Pi keeps its brief in a session store rather than a transcript, so the
    // shared reader travels with every call. A runtime that has no reader for
    // its store ignores it and answers `unknown`.
    const delivered = await brief({ runtime: line.runtime, locator, loadSession: loadSharedSession });

    // A recorded offer belongs to the head the turn saw, so recomputing
    // delivery must not replay it. A brief-only pass copies the line forward
    // untouched, so a present offer stays and an absent one stays absent.
    let nextLine;
    if (briefOnly) {
      nextLine = { ...line, briefDelivered: delivered, briefBackfilled: true };
    } else {
      nextLine = {
        ...line,
        offeredCommand: offer.offeredCommand ?? null,
        offeredPolicy: offer.offeredPolicy ?? null,
        offerError: offer.offerError ?? null,
        briefDelivered: delivered,
        offerBackfilled: true,
      };
    }
    output.push(nextLine);
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, output.map((line) => `${JSON.stringify(line)}\n`).join(''), 'utf8');
  return { ok: true, lines: output.length, outPath };
}
