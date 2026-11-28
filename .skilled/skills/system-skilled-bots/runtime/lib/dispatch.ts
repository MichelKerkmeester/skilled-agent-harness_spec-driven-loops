// ───────────────────────────────────────────────────────────────────
// MODULE: Headless Dispatch
// ───────────────────────────────────────────────────────────────────
//
// One bot run is one headless executor invocation. This module builds what
// the child sees and judges what it did: the prompt with the child-dispatch
// exemption, the bound spec folder and the decision-marker rule; the
// environment, which only ever passes through the deep-loop allowlist; the
// secret-literal check that runs before any prompt can reach a process
// table; and the reading of the child's output and failure rows afterwards.
// The command line and the audited spawn are the deep-loop runtime's own,
// so a bot run is confined and receipted exactly like a loop iteration.

import { chmodSync, copyFileSync, existsSync, lstatSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildExecutorDispatchEnv, runAuditedExecutorCommand } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-audit.js';
import {
  EXECUTOR_ADAPTER_CAPABILITIES,
  EXECUTOR_KINDS,
  resolveClaudePermissionMode,
} from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';

import type {
  ExecutorConfig,
  ExecutorKind,
  ExecutorLogFormat,
  SandboxMode,
} from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { createSecretMatcher } from './secret-matcher.js';
import { knownSecretValues } from './secrets.js';

import type { Result } from './repo-config.js';
import type { FailureClass } from './run-record.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The environment key that marks a process as running inside a bot run. */
export const RUN_MARKER_ENV = 'SKILLED_BOT_RUN_ID';

/** The line a child prints to park the run for a person. */
export const DECISION_MARKER = '[NEEDS-DECISION] ';

/** An optional choice line after the decision marker. */
export const OPTION_MARKER = '[OPTION] ';

/** The line a child prints to propose one fact for its memory, naming the fact's type first. */
export const REMEMBER_MARKER = '[REMEMBER] ';

/** The failure of a Vibe child that exited 0 while its export record says it did not finish. */
export const VIBE_RUN_UNFINISHED = 'vibe-run-unfinished';

/** The refusal of a read-only OpenCode run whose resolved agent leaves a write action open. */
export const READ_ONLY_UNCONFINED = 'read-only-unconfined';

/** Values shorter than this are too common to be a secret and would refuse ordinary text. */
export const MIN_SECRET_LENGTH = 8;

/** Token shapes refused even when the operator has not loaded the token. */
const SECRET_PREFIXES: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: 'ghp_', pattern: /ghp_[A-Za-z0-9]{20,}/ },
  { name: 'gho_', pattern: /gho_[A-Za-z0-9]{20,}/ },
  { name: 'ghs_', pattern: /ghs_[A-Za-z0-9]{20,}/ },
  { name: 'github_pat_', pattern: /github_pat_[A-Za-z0-9_]{20,}/ },
  { name: 'glpat-', pattern: /glpat-[A-Za-z0-9_-]{20,}/ },
  { name: 'sk-ant-', pattern: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { name: 'sk-proj-', pattern: /sk-proj-[A-Za-z0-9_-]{20,}/ },
  { name: 'sk-', pattern: /\bsk-[A-Za-z0-9]{32,}/ },
  { name: 'xox', pattern: /xox[abprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'AKIA', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'AIza', pattern: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: '-----BEGIN', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

/** Names a match by key or by prefix, never by value. */
export interface SecretMatch {
  kind: 'key' | 'prefix';
  name: string;
}

/** Known secret values by the key that holds them. */
export type KnownSecrets = ReadonlyMap<string, string>;

/** What the child signalled in its output. */
export type DecisionSignal =
  | { kind: 'none' }
  | { kind: 'empty' }
  | { kind: 'question'; question: string; options: string[] | null };

/** What a child proposed to remember: the first [REMEMBER] line's type word and the rest of the line. */
export type RememberSignal = { kind: 'none' } | { kind: 'remember'; type: string; fact: string };

/** What a command builder returns: the command, and the working folder and extra environment it needs. */
export interface BuiltCommand {
  command: string;
  args: string[];
  input?: string;
  /** The folder the child runs in, when the kind needs one other than the checkout. */
  cwd?: string;
  /** Keys the kind's builder sets for the child, merged after the environment allowlist. */
  env?: Record<string, string>;
}

/** Builds the command line for one kind; the default is the deep-loop lineage builder. */
export type CommandBuilder = (input: {
  executor: ExecutorConfig;
  prompt: string;
  env: Record<string, string | undefined>;
  cwd: string;
  /** A private folder for a kind that keeps its own home and prompt file there. */
  lineageDir: string | null;
}) => BuiltCommand;

/** How one dispatch ended, before the decision marker is weighed. */
export interface DispatchOutcome {
  /** True when the child ran and no failure row was written. */
  clean: boolean;
  /** The raw reason for a failed dispatch; null when clean. */
  reason: string | null;
  /** What the reason alone does not say, such as the export record's verdict; null when there is nothing more. */
  detail: string | null;
  class: FailureClass | null;
  /** Exit code of the audited runner: 3 when the recursion guard refused. */
  runnerExit: number;
  stdout: string;
  /** The child's captured stderr, empty when no child ran, held here so the runner can redact it before it is written anywhere. */
  stderr: string;
  elapsedMs: number;
  dispatched: boolean;
}

export interface DispatchInput {
  executor: ExecutorConfig;
  prompt: string;
  cwd: string;
  runId: string;
  /** The environment the runner itself runs in; the child gets only its allowlisted part. */
  parentEnv: NodeJS.ProcessEnv;
  /** The effective bound in seconds: the smaller of the invocation timeout and the run budget. */
  boundSeconds: number;
  /** Whether the bound came from the run budget rather than the invocation timeout. */
  boundIsBudget: boolean;
  stateLogPath: string;
  receiptDir: string;
  stdoutLogPath: string;
  /** Keys the caller sets on the child for this one run, each named to the executor's gate. */
  extraEnv?: Record<string, string>;
  buildCommand?: CommandBuilder;
  /** Replaces the process-ancestry and lockfile reads of the recursion guard. */
  guard?: { ancestryCmdlines?: string[]; statePaths?: string[] };
}

const requireCjs = createRequire(import.meta.url);

const cliGuards = requireCjs('../../../system-deep-loop/runtime/scripts/lib/cli-guards.cjs') as {
  readClaudeStreamFinalText: (text: string) => string | null;
};

/** The deep-loop fan-out runner: the lineage command builders and the Vibe completion check. */
interface FanoutModule {
  buildLineageCommand: (
    lineage: Record<string, unknown>,
    prompt: string,
    sandbox: SandboxMode,
    permission: string,
    options: { env: Record<string, string | undefined>; cwd: string; directoryRoot: string; lineageDir?: string },
  ) => BuiltCommand;
  validateVibeCompletion: (exitCode: number, lineageDir: string) => string | null;
  /** The error name the OpenCode builder throws when a read-only run would be left open. */
  OPENCODE_READ_ONLY_UNCONFINED: string;
}

function fanoutModule(): FanoutModule {
  return requireCjs('../../../system-deep-loop/runtime/scripts/fanout-run.cjs') as FanoutModule;
}

/** Output formats whose final answer this module knows how to read. */
export const READABLE_LOG_FORMATS: ReadonlySet<ExecutorLogFormat> = new Set(['text', 'claude-stream-json', 'dsh-json', 'opencode-json']);

/** Kinds whose builder keeps a home and a prompt file in a lineage folder of its own. */
const LINEAGE_FOLDER_KINDS: ReadonlySet<ExecutorKind> = new Set(['cli-mistral-vibe']);

/**
 * Whether a kind's child starts in its own lineage folder rather than the
 * checkout. Such a child finds the checkout only by its absolute path, so the
 * prompt has to name it.
 */
export function runsOutsideCheckout(kind: ExecutorKind): boolean {
  return LINEAGE_FOLDER_KINDS.has(kind);
}

// ───────────────────────────────────────────────────────────────────
// 2. SECRET LITERALS
// ───────────────────────────────────────────────────────────────────

/**
 * The keys every executor kind admits to its child. Their values are paths,
 * locales and user names, not secrets, so they are left out of the check.
 * Derived from the deep-loop allowlist at call time, never restated here.
 */
function commonlyAdmittedKeys(env: Record<string, string | undefined>): Set<string> {
  let common: Set<string> | null = null;
  for (const kind of EXECUTOR_KINDS) {
    if (kind === 'native') continue;
    const admitted = buildExecutorDispatchEnv({ kind } as ExecutorConfig, env, { mistralSignInKey: () => null });
    const keys = new Set(Object.keys(admitted).filter((key) => env[key] !== undefined));
    const previous: Set<string> | null = common;
    common = previous === null ? keys : new Set([...previous].filter((key: string) => keys.has(key)));
  }
  return common ?? new Set();
}

/**
 * The part of an environment every executor kind admits: what a precheck
 * command may see, so a precheck never gets more than a child would.
 */
export function commonEnv(env: NodeJS.ProcessEnv): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of commonlyAdmittedKeys(env)) {
    const value = env[key];
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function looksLikeSecretValue(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < MIN_SECRET_LENGTH) return false;
  if (/^(true|false|yes|no|on|off)$/i.test(trimmed)) return false;
  if (/^[0-9.]+$/.test(trimmed)) return false;
  // Absolute paths (PWD, OLDPWD, SHELL, sockets) are where a bot works, not secrets.
  // Counting them would refuse any body that names its own checkout.
  if (/^\/[^\s:]*$/.test(trimmed)) return false;
  return true;
}

function parseDotenv(text: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = (match[2] ?? '').trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    pairs.push([match[1] as string, value]);
  }
  return pairs;
}

/**
 * Collect the secret values a body must not hold: the operator's environment
 * values outside the keys every kind admits, plus the values in the
 * repository's top-level dotenv files.
 *
 * @param env - The environment the runner runs in.
 * @param checkoutRoot - The repository checkout; its `.env*` files are read.
 */
export function collectKnownSecrets(env: NodeJS.ProcessEnv, checkoutRoot: string | null): Map<string, string> {
  const known = new Map<string, string>();
  const admitted = commonlyAdmittedKeys(env);
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined || admitted.has(key) || key === RUN_MARKER_ENV) continue;
    if (looksLikeSecretValue(value)) known.set(key, value.trim());
  }
  if (checkoutRoot !== null) {
    let names: string[] = [];
    try {
      names = readdirSync(checkoutRoot).filter((name) => /^\.env(\..+)?$/.test(name));
    } catch {
      names = [];
    }
    for (const name of names) {
      let text: string;
      try {
        text = readFileSync(join(checkoutRoot, name), 'utf8');
      } catch {
        continue;
      }
      for (const [key, value] of parseDotenv(text)) {
        if (looksLikeSecretValue(value)) known.set(`${name}:${key}`, value.trim());
      }
    }
  }
  return known;
}

/**
 * The one known-secret map every surface checks text against: the
 * environment and dotenv values plus every value the vault holds, each
 * vault row keyed `vault:<name>`. Every stored value joins, not only the
 * one a bot declares, because any bot child runs as the same OS user and
 * can read any stored value. A vault that cannot be read refuses, never
 * the environment-only map, because a check that drops the vault would
 * pass the very value it exists to stop.
 *
 * @param env - The environment the caller runs in. Its PATH finds the keychain program.
 * @param checkoutRoot - The repository checkout whose dotenv files are read.
 * @param stateRoot - The resolved user-level state root.
 * @param identity - The repository identity, or null when none resolved, which has no vault.
 * @returns The merged map, or secret-store-unreadable.
 */
export function collectAllKnownSecrets(env: NodeJS.ProcessEnv, checkoutRoot: string | null, stateRoot: string, identity: string | null): Result<Map<string, string>> {
  const known = collectKnownSecrets(env, checkoutRoot);
  if (identity === null) return { ok: true, value: known };
  const vault = knownSecretValues(stateRoot, identity, { env });
  if (!vault.ok) return vault;
  for (const [key, value] of vault.value) known.set(key, value);
  return { ok: true, value: known };
}

/**
 * The one secret-literal detector. The runner calls it on a definition body
 * and on a question and answer before a resumed run; the checker calls it on
 * every body. It names the key or prefix it matched, never the value.
 *
 * @param text - The text that would reach a prompt.
 * @param known - Values from collectAllKnownSecrets.
 * @returns The first match, or null when the text holds no secret literal.
 */
export function findSecretLiteral(text: string, known: KnownSecrets): SecretMatch | null {
  const values = [...known.values()].filter((value) => value.length >= MIN_SECRET_LENGTH);
  // One pass over the text decides whether any known value occurs, and only then is the map walked to name the first one, so many stored values cost one pass.
  if (values.length > 0 && createSecretMatcher(values).test(text)) {
    for (const [key, value] of known) {
      if (value.length >= MIN_SECRET_LENGTH && text.includes(value)) return { kind: 'key', name: key };
    }
  }
  for (const { name, pattern } of SECRET_PREFIXES) {
    if (pattern.test(text)) return { kind: 'prefix', name };
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 3. PROMPT & ENVIRONMENT
// ───────────────────────────────────────────────────────────────────

/** The line that joins a queued request's own text to the bot's standing instructions. */
export const REQUEST_PROMPT_HEADER = '--- Request prompt: added by the queued request that started this run ---';

/** The most characters a composed prompt may hold, wrappers and labels included. */
export const PROMPT_BUDGET_CHARS = 32_000;

/**
 * The prompt line that tells a child starting outside the checkout where it
 * is. Built in one place so a resumed run can swap the parked folder's line
 * for the one it runs in, by exact text and never by a pattern.
 */
export function checkoutLine(checkoutRoot: string): string {
  return `The repository checkout is ${checkoutRoot}. You start outside it, so read every repository file through that absolute path; a relative path resolves somewhere else.`;
}

/** The text every working-place line starts with, so a resumed run finds the parked line by exact text. */
export const WORKING_PLACE_PREFIX = 'Your working place is ';

/** The clause a working-place line carries when its directory is on a branch. */
export const WORKING_PLACE_BRANCH_CLAUSE = ' on branch ';

/** The text that ends the place half of a working-place line and starts its run-folder half. */
export const WORKING_PLACE_FOLDER_MARKER = ". This run's folder is ";

/** Where one run works: the directory the child starts in, the branch it is on and the run folder. */
export interface WorkingPlace {
  path: string;
  /** Null on a detached HEAD or when git did not answer. */
  branch: string | null;
  runFolder: string;
}

/**
 * The prompt line that names where a run works. Built in one place, from
 * values the runner resolved, so the prompt and the child's cwd cannot
 * disagree and a resumed run can match the parked line by exact text.
 */
export function workingPlaceLine(place: WorkingPlace): string {
  const branch = place.branch !== null ? `${WORKING_PLACE_BRANCH_CLAUSE}${place.branch}` : '';
  return `${WORKING_PLACE_PREFIX}${place.path}${branch}${WORKING_PLACE_FOLDER_MARKER}${place.runFolder}.`;
}

/** The line a run its schedule started gets right after the exemption line, so a body that reads like an order to schedule work is not obeyed as one. */
export const SCHEDULED_RUN_LINE = 'This run was started by its schedule. Do the work now. Do not create or change a schedule.';

/**
 * Apply the one cut the budget allows: the conversation block gives way from
 * its oldest message. A prompt already inside the bound, or one with no
 * conversation block, comes back unchanged.
 */
function fitConversation(prompt: string): string {
  const lines = prompt.split('\n');
  const header = lines.lastIndexOf(REQUEST_PROMPT_HEADER);
  if (header === -1) return prompt;
  const open = header + 1;
  if (!(lines[open] ?? '').startsWith('<conversation')) return prompt;
  const closeOf = (): number => lines.findIndex((line, index) => index > open && line === '</conversation>');
  if (closeOf() === -1) return prompt;
  while (lines.join('\n').length > PROMPT_BUDGET_CHARS) {
    const close = closeOf();
    const oldest = lines.findIndex(
      (line, index) => index > open && index < close && (line.startsWith('<human> ') || line.startsWith('<bot> ')),
    );
    if (oldest !== -1) {
      lines.splice(oldest, 1);
      continue;
    }
    // Nothing left to give: the block goes whole, with its header and the blank line above it.
    lines.splice(open, close - open + 1);
    lines.splice(header, 1);
    if (lines[header - 1] === '') lines.splice(header - 1, 1);
    break;
  }
  return lines.join('\n');
}

/**
 * The one budget check, run on a joined prompt right before dispatch. The conversation gives
 * way first, from its oldest message, and nothing else is ever cut, so a prompt still over the
 * bound is refused rather than half rendered. A resumed run's parked prompt is one string, so
 * its refusal names the block resume.
 */
export function checkPromptBudget(prompt: string, block = 'resume'): Result<string> {
  const fitted = fitConversation(prompt);
  if (fitted.length <= PROMPT_BUDGET_CHARS) return { ok: true, value: fitted };
  return {
    ok: false,
    reason: 'prompt-over-budget',
    detail: `${block} at ${fitted.length} of ${PROMPT_BUDGET_CHARS} characters`,
  };
}

/**
 * The prompt one bot run is dispatched with. The exemption and the decision
 * rule sit in the prompt as well as the environment, because a child that
 * stops to ask and exits 0 would otherwise read as a clean run.
 *
 * The blocks land in one order: the exemption, the spec folder, the working
 * place, the checkout, the memory, the skills, the decision marker, the body
 * and the request prompt. An absent block adds nothing, so a bot with no
 * memory file and no queued request gets the prompt it always did. The bound
 * is checked on the joined output, never on a block, so a refusal names the
 * block that crossed the line.
 */
export function buildBotPrompt(input: {
  body: string;
  specFolder: string | null;
  /** The checkout's absolute path, given only for a child that starts outside it. */
  checkoutRoot?: string | null;
  /** Where the run works. Every real dispatch passes it. A caller that passes none gets no line. */
  workingPlace?: WorkingPlace | null;
  /** True for a run whose request kind is scheduled. A resumed run keeps its parked prompt and never comes here. */
  scheduled?: boolean;
  /** The rendered memory blocks, the shared file's first. Absent or empty adds nothing. */
  memoryBlocks?: readonly string[];
  /** The rendered skill blocks, in the order the definition lists them. Absent or empty adds nothing. */
  skillBlocks?: readonly string[];
  /** A queued request's own text, joined under REQUEST_PROMPT_HEADER after the body. */
  requestPrompt?: string | null;
}): Result<string> {
  const blocks: Array<{ name: string; lines: string[] }> = [
    {
      name: 'exemption',
      lines: [
        'You are a non-interactive bot run: AI_SESSION_CHILD=1 is set, which AGENTS.md defines as the autonomous child-dispatch exemption. Nobody is at a prompt, so no answer can reach you.',
        ...(input.scheduled === true ? [SCHEDULED_RUN_LINE] : []),
      ],
    },
    {
      name: 'spec-folder',
      lines: [
        input.specFolder === null
          ? 'Bound spec folder: none. Write no spec documents.'
          : `Bound spec folder: ${input.specFolder}. Treat it as the answer to the spec folder question.`,
      ],
    },
    {
      name: 'working-place',
      lines:
        input.workingPlace !== undefined && input.workingPlace !== null ? [workingPlaceLine(input.workingPlace)] : [],
    },
    {
      name: 'checkout',
      lines: input.checkoutRoot !== undefined && input.checkoutRoot !== null ? [checkoutLine(input.checkoutRoot)] : [],
    },
    { name: 'memory', lines: [...(input.memoryBlocks ?? [])] },
    { name: 'skills', lines: [...(input.skillBlocks ?? [])] },
    {
      name: 'decision-marker',
      lines: [
        `If you reach a decision only a person can make, print one line that starts with ${DECISION_MARKER.trim()} followed by the question, then optionally one ${OPTION_MARKER.trim()} line per choice, and stop. Do not guess.`,
      ],
    },
    { name: 'body', lines: ['', input.body] },
    {
      name: 'request-prompt',
      lines:
        typeof input.requestPrompt === 'string' && input.requestPrompt.trim() !== ''
          ? ['', REQUEST_PROMPT_HEADER, input.requestPrompt]
          : [],
    },
  ];
  const present = blocks.filter((block) => block.lines.length > 0);
  const joined = present.flatMap((block) => block.lines).join('\n');
  const fitted = fitConversation(joined);
  if (fitted.length <= PROMPT_BUDGET_CHARS) return { ok: true, value: fitted };
  let name = present.at(-1)?.name ?? 'body';
  let prefix: string[] = [];
  for (const block of present) {
    prefix = [...prefix, ...block.lines];
    if (prefix.join('\n').length > PROMPT_BUDGET_CHARS) {
      name = block.name;
      break;
    }
  }
  return {
    ok: false,
    reason: 'prompt-over-budget',
    detail: `${name} at ${fitted.length} of ${PROMPT_BUDGET_CHARS} characters`,
  };
}

/**
 * The environment handed to the audited runner. The run marker and the
 * child-session flag are added here; the deep-loop allowlist then decides
 * which keys the child actually sees. The runner's own environment is never
 * changed, so no other dispatch inherits the marker.
 */
export function buildGuardEnv(parentEnv: NodeJS.ProcessEnv, runId: string): Record<string, string | undefined> {
  return { ...parentEnv, AI_SESSION_CHILD: '1', [RUN_MARKER_ENV]: runId };
}

// ───────────────────────────────────────────────────────────────────
// 4. DECISION MARKER
// ───────────────────────────────────────────────────────────────────

/**
 * Read the DeepSeek Harness `--json` stream: one JSON event per line, ending
 * on a `final` event whose `text` is the answer. A stream cut off before its
 * `final` event falls back to the `text` events it had printed so far.
 *
 * @returns The final answer, or null when the output holds no harness event.
 */
function readDshFinalText(output: string): string | null {
  let isStream = false;
  let finalText: string | null = null;
  const texts: string[] = [];
  for (const line of output.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    let event: { type?: unknown; text?: unknown };
    try {
      event = JSON.parse(trimmed) as { type?: unknown; text?: unknown };
    } catch {
      continue;
    }
    if (event === null || typeof event !== 'object' || typeof event.type !== 'string') continue;
    isStream = true;
    if (event.type === 'final' && typeof event.text === 'string') finalText = event.text;
    else if (event.type === 'text' && typeof event.text === 'string') texts.push(event.text);
  }
  if (!isStream) return null;
  return finalText ?? texts.join('\n');
}

/**
 * Read the OpenCode `--format json` stream: one JSON event per line, where a
 * `text` event carries one text part of an assistant message in `part.text`.
 * The final answer is the text parts of the last message that printed any,
 * joined in order.
 *
 * @returns The final answer, or null when the output holds no OpenCode event.
 */
function readOpencodeFinalText(output: string): string | null {
  let isStream = false;
  let lastMessage: string | null = null;
  let parts: string[] = [];
  for (const line of output.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    let event: { type?: unknown; part?: { type?: unknown; text?: unknown; messageID?: unknown } };
    try {
      event = JSON.parse(trimmed) as typeof event;
    } catch {
      continue;
    }
    if (event === null || typeof event !== 'object' || typeof event.type !== 'string') continue;
    if (event.part === null || typeof event.part !== 'object') continue;
    isStream = true;
    if (event.type !== 'text' || typeof event.part.text !== 'string') continue;
    const message = typeof event.part.messageID === 'string' ? event.part.messageID : null;
    if (message === null || message !== lastMessage) parts = [];
    lastMessage = message;
    parts.push(event.part.text);
  }
  if (!isStream) return null;
  return parts.join('\n');
}

/**
 * The text a child ended on, read per its kind's output format. A kind that
 * prints JSON events carries the marker inside a JSON string, never at the
 * start of a line, so the raw output would never show it. Output that is not
 * the expected stream is read as plain text.
 *
 * @returns The answer text, or null for a format this module cannot read.
 */
export function finalAnswerText(kind: ExecutorKind, output: string): string | null {
  const format = EXECUTOR_ADAPTER_CAPABILITIES[kind].logFormat;
  if (format === 'text') return output;
  if (format === 'claude-stream-json') return cliGuards.readClaudeStreamFinalText(output) ?? output;
  if (format === 'dsh-json') return readDshFinalText(output) ?? output;
  if (format === 'opencode-json') return readOpencodeFinalText(output) ?? output;
  return null;
}

/**
 * Read the decision marker from a child's final answer text. The first marker
 * wins, and the option lines that directly follow it belong to it.
 */
export function parseDecisionMarker(output: string): DecisionSignal {
  const lines = output.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(DECISION_MARKER) || line.trimEnd() === DECISION_MARKER.trim());
  if (start === -1) return { kind: 'none' };
  const question = (lines[start] as string).slice(DECISION_MARKER.trim().length).trim();
  if (question === '') return { kind: 'empty' };
  const options: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (!line.startsWith(OPTION_MARKER)) break;
    const option = line.slice(OPTION_MARKER.length).trim();
    if (option !== '') options.push(option);
  }
  return { kind: 'question', question, options: options.length > 0 ? options : null };
}

/**
 * Read the first [REMEMBER] line from a child's final answer text. A later line is ignored, so
 * one run proposes at most one fact. The parse is grammar only: the caller checks the type
 * against the memory types and the fact against the memory bound, so this module stays free
 * of the memory module.
 */
export function parseRememberMarker(output: string): RememberSignal {
  const lines = output.split(/\r?\n/);
  const marker = REMEMBER_MARKER.trim();
  const line = lines.find((candidate) => candidate.startsWith(REMEMBER_MARKER) || candidate.trimEnd() === marker);
  if (line === undefined) return { kind: 'none' };
  // A line that only equals the marker after trimming its end carries no text past it.
  const rest = (line.startsWith(marker) ? line.slice(marker.length) : '').trim();
  const split = rest.search(/\s/);
  if (split === -1) return { kind: 'remember', type: rest, fact: '' };
  return { kind: 'remember', type: rest.slice(0, split), fact: rest.slice(split).trim() };
}

// ───────────────────────────────────────────────────────────────────
// 5. DISPATCH
// ───────────────────────────────────────────────────────────────────

/** The deep-loop lineage command builder, the same one a fan-out lineage uses. */
export const lineageCommandBuilder: CommandBuilder = ({ executor, prompt, env, cwd, lineageDir }) => {
  const fanout = fanoutModule();
  const sandbox = executor.sandboxMode ?? 'workspace-write';
  const built = fanout.buildLineageCommand(
    {
      kind: executor.kind,
      model: executor.model,
      sandboxMode: sandbox,
      reasoningEffort: executor.reasoningEffort,
      serviceTier: executor.serviceTier,
    },
    prompt,
    sandbox,
    resolveClaudePermissionMode(sandbox),
    { env, cwd, directoryRoot: cwd, ...(lineageDir !== null ? { lineageDir } : {}) },
  );
  return {
    command: built.command,
    args: built.args,
    ...(built.input !== undefined ? { input: built.input } : {}),
    ...(built.cwd !== undefined ? { cwd: built.cwd } : {}),
    ...(built.env !== undefined ? { env: built.env } : {}),
  };
};

function readFailureRows(stateLogPath: string): Array<{ reason: string }> {
  let text: string;
  try {
    text = readFileSync(stateLogPath, 'utf8');
  } catch {
    return [];
  }
  const rows: Array<{ reason: string }> = [];
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    try {
      const row = JSON.parse(line) as { event?: unknown; reason?: unknown };
      if (row.event === 'dispatch_failure' && typeof row.reason === 'string') rows.push({ reason: row.reason });
    } catch {
      // A torn line is not a failure row.
    }
  }
  return rows;
}

/**
 * Run one headless invocation through the audited deep-loop runner and
 * class what happened. Exactly one child is spawned; a failed invocation is
 * never dispatched again inside the same run.
 */
export function dispatchHeadless(input: DispatchInput): DispatchOutcome {
  const lineageDir = LINEAGE_FOLDER_KINDS.has(input.executor.kind as ExecutorKind)
    ? mkdtempSync(join(input.parentEnv.TMPDIR ?? tmpdir(), 'skilled-bot-lineage-'))
    : null;
  try {
    return dispatchInLineage(input, lineageDir);
  } finally {
    if (lineageDir !== null) {
      keepVibeExport(lineageDir, input.receiptDir);
      removeLineageFolder(lineageDir);
    }
  }
}

/**
 * Remove a lineage folder after the run has been judged. Vibe leaves plugin
 * package folders under its home with the write bit off, and a recursive
 * remove cannot empty those, so every folder is made owner-writable first.
 * The folder is private to the user, so a leftover is untidy rather than a
 * leak: a failure is a warning on stderr and never changes the run's outcome.
 */
export function removeLineageFolder(lineageDir: string): void {
  try {
    makeFoldersOwnerWritable(lineageDir);
    rmSync(lineageDir, { recursive: true, force: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`bots: warning: could not remove lineage folder ${lineageDir}: ${message}\n`);
  }
}

function makeFoldersOwnerWritable(dir: string): void {
  const stat = lstatSync(dir, { throwIfNoEntry: false });
  // A symbolic link is never followed: its target is not the run's to change.
  if (stat === undefined || !stat.isDirectory()) return;
  if ((stat.mode & 0o700) !== 0o700) chmodSync(dir, stat.mode | 0o700);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) makeFoldersOwnerWritable(join(dir, entry.name));
  }
}

/**
 * A kind that keeps its home and prompt file in a lineage folder gets a
 * private temp folder, outside both the run folder (which must hold no
 * prompt) and the state root (whose path the child is never told). Only the
 * run's export record is kept, beside the receipts, as evidence of the tool
 * set the child really ran with.
 */
function keepVibeExport(lineageDir: string, receiptDir: string): void {
  const exported = join(lineageDir, 'vibe-output', 'export.json');
  if (!existsSync(exported)) return;
  try {
    copyFileSync(exported, join(receiptDir, 'vibe-export.json'));
  } catch {
    // The export is evidence only; a run is judged without it.
  }
}

function dispatchInLineage(input: DispatchInput, lineageDir: string | null): DispatchOutcome {
  const guardEnv = buildGuardEnv(input.parentEnv, input.runId);
  const started = Date.now();
  let built: BuiltCommand;
  try {
    built = (input.buildCommand ?? lineageCommandBuilder)({
      executor: input.executor,
      prompt: input.prompt,
      env: guardEnv,
      cwd: input.cwd,
      lineageDir,
    });
  } catch (error: unknown) {
    const name = error instanceof Error ? error.name : '';
    // The builder resolved the agent a read-only OpenCode child would run and found a
    // write action it does not deny: the repository's config, not the bot, has to change.
    if (name === fanoutModule().OPENCODE_READ_ONLY_UNCONFINED) {
      return {
        clean: false,
        reason: READ_ONLY_UNCONFINED,
        detail: error instanceof Error ? error.message : null,
        class: 'environment',
        runnerExit: 0,
        stdout: '',
        stderr: '',
        elapsedMs: Date.now() - started,
        dispatched: false,
      };
    }
    return {
      clean: false,
      reason: name === 'ExecutorUnavailableError' ? 'executor-unavailable' : 'executor-command-invalid',
      detail: error instanceof Error ? error.message : null,
      class: name === 'ExecutorUnavailableError' ? 'environment' : 'author',
      runnerExit: 0,
      stdout: '',
      stderr: '',
      elapsedMs: Date.now() - started,
      dispatched: false,
    };
  }

  // The caller's keys travel with the kind's own, and the gate is told which ones the caller named.
  const dispatchEnv = { ...(built.env ?? {}), ...(input.extraEnv ?? {}) };
  const callerKeys = Object.keys(input.extraEnv ?? {});

  let stdout = '';
  let stderr = '';
  const runnerExit = runAuditedExecutorCommand({
    command: built.command,
    args: built.args,
    cwd: built.cwd ?? input.cwd,
    timeoutSeconds: input.boundSeconds,
    stateLogPath: input.stateLogPath,
    executor: { ...input.executor, kind: input.executor.kind as ExecutorKind },
    iteration: 1,
    ...(built.input !== undefined ? { input: built.input } : {}),
    // A kind's own keys, such as OpenCode's inline permission config, carry its
    // tool narrowing, so they must reach the child past the allowlist.
    ...(Object.keys(dispatchEnv).length > 0 ? { dispatchEnv } : {}),
    ...(callerKeys.length > 0 ? { dispatchEnvKeys: callerKeys } : {}),
    guardContext: { env: guardEnv, ...(input.guard ?? {}) },
    receiptDir: input.receiptDir,
    dispatchId: input.runId,
    sessionId: input.runId,
    echoStdout: false,
    stdoutLogPath: input.stdoutLogPath,
    onStdout: (text) => {
      stdout = text;
    },
    onStderr: (text) => {
      stderr = text;
    },
  });
  const elapsedMs = Date.now() - started;

  const failures = readFailureRows(input.stateLogPath);
  const last = failures.at(-1);
  if (runnerExit !== 0) {
    return { clean: false, reason: last?.reason ?? 'recursion-guard', detail: null, class: 'hub', runnerExit, stdout, stderr, elapsedMs, dispatched: false };
  }
  if (last === undefined) {
    // Vibe can exit 0 from a run its export record says did not finish, so a clean
    // exit is judged by the deep-loop fan-out's own reading of that record.
    if (input.executor.kind === 'cli-mistral-vibe' && lineageDir !== null) {
      const unfinished = fanoutModule().validateVibeCompletion(0, lineageDir);
      if (unfinished !== null) {
        return { clean: false, reason: VIBE_RUN_UNFINISHED, detail: unfinished, class: 'environment', runnerExit, stdout, stderr, elapsedMs, dispatched: true };
      }
    }
    return { clean: true, reason: null, detail: null, class: null, runnerExit, stdout, stderr, elapsedMs, dispatched: true };
  }
  if (last.reason === 'timeout') {
    return input.boundIsBudget
      ? { clean: false, reason: 'maxDurationReached', detail: null, class: 'budget', runnerExit, stdout, stderr, elapsedMs, dispatched: true }
      : { clean: false, reason: 'timeout', detail: null, class: 'environment', runnerExit, stdout, stderr, elapsedMs, dispatched: true };
  }
  return { clean: false, reason: last.reason, detail: null, class: 'environment', runnerExit, stdout, stderr, elapsedMs, dispatched: true };
}
