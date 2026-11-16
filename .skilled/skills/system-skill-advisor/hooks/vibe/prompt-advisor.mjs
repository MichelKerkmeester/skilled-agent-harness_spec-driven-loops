// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Prompt Advisor Part
// ───────────────────────────────────────────────────────────────────
// The turn-start composer's advisor part. Vibe runs a fresh hook process for
// every turn, so the receipts that keep a brief from repeating have to survive
// the process: the shared handler's own file-backed store drops the constant
// directive block once it is proven delivered, and a per-session head receipt
// drops the routing head while the route has not changed. A child session, a
// subagent and a blank prompt get nothing. Every failure contributes no text,
// so a slow or broken advisor never blocks the turn.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isHookEnabled } from '../../../../hooks/shared/hook-flags.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A Vibe session runs in a throwaway folder, so the checkout is located from
// this file instead: vibe -> hooks -> system-skill-advisor -> skills -> .skilled -> root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');

const ADVISOR_MODULE_URL = new URL(
  '../../runtime/dist/hooks/claude/user-prompt-submit.js',
  import.meta.url,
).href;

// Mirrors the advisor renderer's directive label. A brief that drifts past it is
// never split, so it is always delivered whole.
const DIRECTIVE_SEPARATOR = '\nDirectives:';
const CHILD_SESSION_ENV = 'AI_SESSION_CHILD';
// The directive store's own base directory, so one switch isolates both receipts
// in a test or a scratch run.
const STATE_DIR_ENV = 'SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR';
const HEAD_RECEIPT_SUBDIR = 'vibe-turn-start';
const MAX_HEAD_RECEIPTS = 64;
// Vibe has no command loader and its prompt stubs name the dash form, so a head
// that names a command is the one place a model learns which document to read.
const COMMAND_DOCUMENT_LABEL = 'Command documents (read in full before taking one): ';
const COMMAND_TOKEN_PATTERN = /(?:^|[\s(])\/([a-z][a-z0-9-]*)(?::([a-z][a-z0-9-]*))?/g;

export const ERROR_POLICY = 'fail-open';
// The advisor keys its metrics and outcome records by runtime and drops a label it does not list.
export const ADVISOR_RUNTIME = 'vibe';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A dispatched child inherits AI_SESSION_CHILD=1, and a subagent Vibe spawned
// itself carries a parent session id. Either marks a session whose prompt is a
// fixed task, where a route suggestion is noise.
function isChildSession(payload, env) {
  if (String(env[CHILD_SESSION_ENV] ?? '').trim() === '1') return true;
  const parent = payload?.parent_session_id;
  return typeof parent === 'string' && parent.trim() !== '';
}

function headReceiptDir(env = process.env) {
  const configured = env[STATE_DIR_ENV]?.trim();
  const base = configured ? resolve(configured) : join(tmpdir(), 'speckit-advisor');
  return join(base, HEAD_RECEIPT_SUBDIR);
}

function headReceiptPath(sessionId, env = process.env) {
  const digest = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
  return join(headReceiptDir(env), `${digest}.head`);
}

function readHeadReceipt(sessionId, env = process.env) {
  try {
    return readFileSync(headReceiptPath(sessionId, env), 'utf8');
  } catch {
    return '';
  }
}

// The folder is bounded the way the directive store bounds its sessions, so a
// long-lived machine does not keep one file per session forever.
function evictOldestReceipts(directory) {
  const names = readdirSync(directory).filter((name) => name.endsWith('.head'));
  if (names.length < MAX_HEAD_RECEIPTS) return;
  const oldest = names
    .map((name) => ({ name, mtime: statSync(join(directory, name)).mtimeMs }))
    .sort((left, right) => left.mtime - right.mtime)
    .slice(0, names.length - MAX_HEAD_RECEIPTS + 1);
  for (const entry of oldest) unlinkSync(join(directory, entry.name));
}

function writeHeadReceipt(sessionId, head, env = process.env) {
  try {
    const directory = headReceiptDir(env);
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const target = headReceiptPath(sessionId, env);
    if (!existsSync(target)) evictOldestReceipts(directory);
    writeFileSync(target, head, { mode: 0o600 });
  } catch {
    // A receipt that cannot be written only costs a repeated head next turn.
  }
}

/**
 * Name the canonical document of each command the routing head mentions.
 *
 * Vibe has no command loader and its prompt stubs name the dash form, so the
 * head is where each offered command's document has to be named. The line is
 * added before the head receipt, so two equal heads stay equal and a repeated
 * brief is still dropped.
 *
 * @param {string} context - The advisor's additional context.
 * @param {string} [root] - The checkout the document paths resolve under.
 * @returns {string} The context with one document line, or unchanged.
 */
export function withCommandDocuments(context, root = REPO_ROOT) {
  try {
    // A context that opens with the directive label has no routing head for a
    // document line to sit under, and its block is the handler's to deliver.
    const label = DIRECTIVE_SEPARATOR.slice(1);
    if (context.startsWith(label)) return context;

    const separator = context.indexOf(DIRECTIVE_SEPARATOR);
    const head = separator > 0 ? context.slice(0, separator) : context;
    const rest = separator > 0 ? context.slice(separator) : '';

    const documents = [];
    for (const [, namespace, name] of head.matchAll(COMMAND_TOKEN_PATTERN)) {
      const command = name ? `/${namespace}:${name}` : `/${namespace}`;
      const relative = name
        ? `.skilled/commands/${namespace}/${name}.md`
        : `.skilled/commands/${namespace}.md`;
      if (documents.some((document) => document.relative === relative)) continue;
      if (!existsSync(join(root, relative))) continue;
      documents.push({ command, relative });
    }
    if (documents.length === 0) return context;

    const pairs = documents
      .map((document) => `${document.command} is ${document.relative}`)
      .join(', ');
    return `${head}\n${COMMAND_DOCUMENT_LABEL}${pairs}.${rest}`;
  } catch {
    return context;
  }
}

/**
 * Drop the routing head when this session already received it unchanged.
 *
 * A brief that still carries its directive block is delivered whole: the shared
 * handler owns that block's lifecycle, and its presence means the block has not
 * been proven delivered yet. A head-only brief is the handler's reduced repeat,
 * so the head receipt decides whether even that text adds anything.
 *
 * @param {string} context - The advisor's additional context.
 * @param {string} sessionId - The Vibe session id, the receipt key.
 * @param {{read?: Function, write?: Function, env?: Object}} [receipts] - Injectable for tests.
 * @returns {string} The text to deliver, or an empty string to deliver nothing.
 */
export function reduceRepeatedHead(context, sessionId, {
  read = readHeadReceipt,
  write = writeHeadReceipt,
  env = process.env,
} = {}) {
  if (typeof sessionId !== 'string' || !sessionId.trim()) return context;

  const separator = context.indexOf(DIRECTIVE_SEPARATOR);
  if (separator > 0) {
    write(sessionId, context.slice(0, separator), env);
    return context;
  }
  // An older build rendered the no-brief fallback as the directive block alone.
  // Its block is the handler's to dedupe, and there is no head to compare.
  const label = DIRECTIVE_SEPARATOR.slice(1);
  if (context.startsWith(label)) return context;

  if (read(sessionId, env) === context) return '';
  write(sessionId, context, env);
  return context;
}

async function runAdvisor(input) {
  const advisor = await import(ADVISOR_MODULE_URL);
  return advisor.handleClaudeUserPromptSubmit(input, {
    runtime: ADVISOR_RUNTIME,
    writeDiagnostic: () => {},
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the advisor part of one turn-start context.
 *
 * @param {Object} payload - The Vibe pre_agent payload.
 * @param {Object} [dependencies] - Injectable for deterministic tests.
 * @returns {Promise<string>} The advisor brief, or an empty string.
 */
export async function buildAdvisorPart(payload, {
  run = runAdvisor,
  env = process.env,
  isEnabled = isHookEnabled,
  // The receipt folder follows the injected environment, so a caller that
  // isolates the state directory isolates the receipts with it.
  read = (sessionId) => readHeadReceipt(sessionId, env),
  write = (sessionId, head) => writeHeadReceipt(sessionId, head, env),
} = {}) {
  try {
    if (!payload || payload.hook_event_name !== 'pre_agent') return '';
    if (isChildSession(payload, env)) return '';

    const prompt = typeof payload.prompt === 'string' ? payload.prompt : '';
    if (!prompt.trim()) return '';
    if (isEnabled('skill-advisor') === false) return '';

    const sessionId = typeof payload.session_id === 'string' ? payload.session_id : '';
    const transcriptPath = typeof payload.transcript_path === 'string' && payload.transcript_path
      ? payload.transcript_path
      : undefined;
    const output = await run({
      prompt,
      cwd: REPO_ROOT,
      session_id: sessionId,
      transcript_path: transcriptPath,
      hook_event_name: 'UserPromptSubmit',
    });

    const context = output?.hookSpecificOutput?.additionalContext;
    if (typeof context !== 'string' || !context.trim()) return '';
    return reduceRepeatedHead(withCommandDocuments(context), sessionId, { read, write, env });
  } catch {
    return '';
  }
}
