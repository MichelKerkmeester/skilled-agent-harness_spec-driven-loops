// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Nudge
// ───────────────────────────────────────────────────────────────────
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const core = require('./relaunch-core.cjs');
const hookFlags = require('../../shared/hook-flags.cjs');

const SEED_PREFIX = '[session-relaunch]';
const SEED_COMMAND = SEED_PREFIX + ' claim and continue handoff ';
const SPEC_FOLDER_MARKER = ' | Spec folder: ';
const SPEC_FOLDER_SUFFIX = ' (carried from the handoff; Gate 3 answered in the sending session)';
const SPEC_FOLDER_SKIP_SUFFIX = ' (Gate 3 answered D, Skip, in the sending session)';
// Seeds printed by the first printers carry an unbalanced suffix; they still parse.
const SPEC_FOLDER_SKIP_SUFFIX_LEGACY = ' (Gate 3 answered D) Skip in the sending session)';
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
const DEFAULT_CLI_COMMAND = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const CONTINUITY_WRITER_COMMAND = 'node .skilled/skills/system-spec-kit/runtime/cli/'
  + 'dist/continuity/generate-context.js';
const NUDGE_STEP = 0.05;
const LAST_NUDGE_LEVEL = 1;
const DEFAULT_THRESHOLD = 0.8;
// The wrapper's own ceiling on completed hops, used when no cap is configured.
const DEFAULT_MAX_HOPS = 10;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const HANDOFF_SECTIONS = ['Goal', 'Done', 'Remaining work', 'In-flight state'];
const FINISH_INSTEAD_INSTRUCTION = ' If the remaining work fits in a few more steps, finish it instead'
  + ' and skip these steps.'
  + ' Otherwise do these steps now, before any other work,'
  + ' so a fresh session continues before auto-compaction has to:';

function shellQuote(value) {
  const quote = String.fromCharCode(39);
  const escapedQuote = quote + '"' + quote + '"' + quote;
  return quote + String(value).replace(/'/g, escapedQuote) + quote;
}

function commandPrefix(cliPath) {
  if (typeof cliPath !== 'string' || !cliPath.trim()) return DEFAULT_CLI_COMMAND;
  if (/^node\s/.test(cliPath)) return cliPath;
  return `node ${shellQuote(cliPath)}`;
}

/** Build the command that closes a handoff note, shared by seed text and every reminder. */
function completeCommandFor(notePath, cliPath) {
  const pathValue = String(notePath ?? '<handoff-path>');
  return `${commandPrefix(cliPath)} complete ${shellQuote(pathValue)}`;
}

// A window override can push the measured ratio far past 1, so the literal percentage
// reads as a broken hook to the model receiving it; name the overflow instead.
function contextSentence(ratio) {
  if (typeof ratio !== 'number' || !Number.isFinite(ratio)) return null;
  return ratio > 1
    ? `${SEED_PREFIX} Context is past the configured window (over 100% full).`
    : `${SEED_PREFIX} Context is about ${Math.round(ratio * 100)}% full.`;
}

/** Build the context handoff instructions for a runtime nudge. */
function handoffText({
  notePath,
  sessionId,
  specFolder,
  runtime = 'claude',
  cliPath,
  cwd = process.cwd(),
  loopId = process.env.SKILLED_LOOP_ID || '',
  createdAt = new Date().toISOString(),
  ratio,
} = {}) {
  const pathValue = String(notePath ?? '<handoff-path>');
  const sessionValue = String(sessionId ?? '');
  const specValue = typeof specFolder === 'string'
    ? specFolder
    : '<repo-relative packet path, "none" for Gate 3 D) Skip, or empty if unanswered>';
  const command = commandPrefix(cliPath);
  const context = contextSentence(ratio);
  const opening = context === null
    ? `${SEED_PREFIX} Write a handoff note before auto-compaction.`
    : context + FINISH_INSTEAD_INSTRUCTION;
  const sectionList = HANDOFF_SECTIONS.map((name) => `## ${name}`).join(', ');
  const lines = [
    opening,
    `1. Write the handoff note at ${shellQuote(pathValue)} in exactly this shape:`,
    '   ---',
    '   status: open',
    `   session_id: ${sessionValue}`,
    `   loop_id: ${loopId}`,
    `   runtime: ${runtime}`,
    `   cwd: ${cwd}`,
    `   spec_folder: ${specValue}`,
    `   created_at: ${createdAt}`,
    '   ---',
    `   followed by ${sectionList}, each non-empty.`,
    '   Under ## Remaining work list only the task\'s own unfinished work. '
      + 'Never list these handoff steps (the note, the continuity save, prepare) '
      + 'there; this session does them now.',
    SPEC_FOLDER_GUIDANCE,
  ];

  let step = 2;
  const hasSpecFolder = typeof specFolder === 'string' && specFolder.length > 0;
  if (specFolder === undefined || (hasSpecFolder && specFolder !== 'none')) {
    const saveTarget = typeof specFolder === 'string' && specFolder
      ? specFolder
      : '<spec-folder>';
    const saveStep = runtime === 'claude'
      ? 'run `/speckit:save` first so its continuity is current.'
      : 'save its continuity first: pipe the save JSON to '
        + `\`${CONTINUITY_WRITER_COMMAND} --stdin --full-auto ${shellQuote(saveTarget)}\`.`;
    lines.push(`${step}. When a spec packet is bound to this session, ${saveStep}`);
    step += 1;
  }
  lines.push(
    `${step}. Then run: ${command} prepare --handoff ${shellQuote(pathValue)}`
      + ` --session ${shellQuote(sessionValue)} --runtime ${shellQuote(runtime)}`,
  );
  lines.push(
    `${step + 1}. Stop once it exits 0; the loop ends this session and relaunches `
      + 'with a claim seed.',
  );
  lines.push(
    'Exception: skip these steps only when the operator has told this session not to hand off;'
      + ' then keep working, and auto-compaction stays the fallback.',
  );
  return lines.join('\n');
}

/** Build the claim, resume, and completion instructions for a seed prompt. */
function seedText({ notePath, specFolder, sessionId, cliPath } = {}) {
  const pathValue = String(notePath ?? '<handoff-path>');
  const sessionValue = String(sessionId ?? '');
  const command = commandPrefix(cliPath);
  const claimCommand = `${command} claim ${shellQuote(pathValue)}`
    + ` --session ${shellQuote(sessionValue)}`;
  const completeCommand = completeCommandFor(pathValue, cliPath);
  const gateWasSkipped = specFolder === 'none';
  const continueStep = gateWasSkipped ? 4 : 3;
  let readInstruction = '2. Read the note.';
  if (typeof specFolder === 'string' && specFolder && !gateWasSkipped) {
    readInstruction = '2. Read the note. When its frontmatter spec_folder is set, run '
      + `\`/speckit:resume ${specFolder}\`; skip that step when spec_folder is empty.`;
  }

  const lines = [
    '[session-relaunch] This session was opened to continue a handoff note. Work it in order:',
    `1. Run \`${claimCommand}\`; it prints the note body.`,
    readInstruction,
  ];
  if (gateWasSkipped) {
    lines.push('3. Gate 3 is already answered Skip for this session, carried from the handoff.');
  }
  lines.push(
    `${continueStep}. Continue the work under "Remaining work". Do not run prepare for this note; `
      + 'its handoff is already done. If Remaining work names only handoff steps, '
      + 'treat it as empty.',
    `${continueStep + 1}. When the remaining work is done, run `
      + `\`${completeCommand}\` to close the note.`,
  );
  return lines.join('\n');
}

/** Check whether text starts with the relaunch seed marker. */
function isSeedPrompt(text) {
  return typeof text === 'string' && text.startsWith(SEED_PREFIX);
}

function specFolderFromSeed(prompt) {
  if (!isSeedPrompt(prompt)) return '';
  const markerIndex = prompt.indexOf(SPEC_FOLDER_MARKER);
  if (markerIndex < 0) return '';
  const rawFolder = prompt.slice(markerIndex + SPEC_FOLDER_MARKER.length);
  for (const suffix of [SPEC_FOLDER_SKIP_SUFFIX, SPEC_FOLDER_SKIP_SUFFIX_LEGACY]) {
    if (rawFolder.endsWith(suffix)) {
      return rawFolder.slice(0, -suffix.length) === 'none' ? 'none' : '';
    }
  }
  if (!rawFolder.endsWith(SPEC_FOLDER_SUFFIX)) return '';
  const specFolder = rawFolder.slice(0, -SPEC_FOLDER_SUFFIX.length);
  if (!core.validSpecFolder(specFolder)) return '';
  return specFolder;
}

// The runtime receives the seed path raw: its shell already consumed any
// quoting, so an unescape or trim here would corrupt a path that holds a
// real backslash or edge whitespace.
/** Extract the raw handoff note path from a claim seed, or null when malformed. */
function notePathFromSeed(prompt) {
  if (!isSeedPrompt(prompt) || !prompt.startsWith(SEED_COMMAND)) return null;
  let notePath = prompt.slice(SEED_COMMAND.length);
  const markerIndex = notePath.indexOf(SPEC_FOLDER_MARKER);
  if (markerIndex >= 0) notePath = notePath.slice(0, markerIndex);
  if (!notePath || notePath !== notePath.trim() || /[\r\n]/.test(notePath)) {
    return null;
  }
  return path.isAbsolute(notePath) ? notePath : null;
}

// Notes live in the repository that holds this concern, so every reader resolves the same root.
function resolveRepoRoot(env = process.env) {
  return path.resolve(
    env.SESSION_RELAUNCH_REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..'),
  );
}

function handoffDir(repoRoot) {
  return path.join(
    repoRoot,
    '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
  );
}

// A second nudge must name the note the session already has open. Handing it a
// fresh stamped path lets the first note be written and then abandoned as open
// while the seed claims the second one, so the work the first one describes is lost.
function openNotePathFor({ repoRoot, sessionId }) {
  if (!validSessionId(sessionId)) return null;
  const directory = handoffDir(repoRoot);
  let filenames;
  try {
    filenames = fs.readdirSync(directory);
  } catch {
    return null;
  }

  const suffix = `-${sessionId.slice(0, 8)}.md`;
  for (const filename of filenames) {
    if (!filename.endsWith(suffix)) continue;
    const notePath = path.join(directory, filename);
    let frontmatter;
    try {
      frontmatter = core.parseHandoff(fs.readFileSync(notePath, 'utf8')).frontmatter;
    } catch {
      continue;
    }
    if (frontmatter.status === 'open' && frontmatter.session_id === sessionId) {
      return notePath;
    }
  }
  return null;
}

/** Plan the handoff note path for a nudge under the resolved repo root. */
function plannedNotePath({
  // Accepted for callers that pass their session cwd; the root no longer comes from it.
  cwd,
  sessionId,
  env = process.env,
  now = new Date(),
} = {}) {
  const repoRoot = resolveRepoRoot(env);
  const openNotePath = openNotePathFor({ repoRoot, sessionId });
  if (openNotePath !== null) return openNotePath;

  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return path.join(handoffDir(repoRoot), `${stamp}-${sessionId.slice(0, 8)}.md`);
}

// The wrapper accepts the same switch values it accepts everywhere, and reads them
// from the same pair: the operator config file under the live environment. Reading
// the environment alone would bind a saved age limit to the wrapper and never to
// this check. Unset, empty, negative or non-numeric falls back to the default age,
// while zero stays meaningful.
function maxAgeMinutes(env) {
  const switches = {
    ...hookFlags.loadConfigFile(hookFlags.configPath()),
    ...(env ?? {}),
  };
  const rawValue = switches.SESSION_RELAUNCH_MAX_AGE_MIN;
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return undefined;
  }
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

// One switch value resolved the way the wrapper resolves it: unset, empty, negative
// or non-numeric falls back, and a hop count has to be a whole number.
function switchNumber(rawValue, fallback, { integer = false } = {}) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return fallback;
  }
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed < 0 || (integer && !Number.isInteger(parsed))) {
    return fallback;
  }
  return parsed;
}

// A session that has spent every allowed hop cannot relaunch: the wrapper declines the
// record and the session carries on under auto-compaction. Prompting there would spend a
// turn on handoff steps whose prepare can only decline, so the adapters ask this first.
// The hop count is the one the loop exported, and the cap comes from the same
// config-file-then-environment pair the wrapper reads.
function hopLimitReached(env = process.env) {
  const switches = {
    ...hookFlags.loadConfigFile(hookFlags.configPath()),
    ...(env ?? {}),
  };
  const hops = switchNumber(env?.SKILLED_LOOP_HOPS, 0, { integer: true });
  const maxHops = switchNumber(
    switches.SESSION_RELAUNCH_MAX_HOPS,
    DEFAULT_MAX_HOPS,
    { integer: true },
  );
  return hops >= maxHops;
}

// An armed record only stands for a finished handoff while the wrapper would still
// accept it: past the age limit it is declined as stale and can never relaunch, so
// counting it as done leaves a session that still owes its note with no prompt to
// write one. Freshness stays shouldRelaunch's own verdict so both readers share one
// rule; its other declines still name a handoff that was prepared.
function armedRecordStillCurrent(record, env) {
  return core.shouldRelaunch(record, { maxAgeMin: maxAgeMinutes(env) }).reason !== 'stale';
}

// A nudge exists to get the handoff note written and a relaunch prepared. Once this
// session's record is pending or armed that work is done, so another nudge would spend
// a fresh turn on instructions the session has already followed.
/** Report whether this session's relaunch record already has a live handoff. */
function handoffPending({ sessionId, env = process.env } = {}) {
  const loopId = env?.SKILLED_LOOP_ID;
  if (typeof loopId !== 'string' || !loopId.trim()) return false;
  try {
    const record = core.readRelaunchFile(loopId, env);
    // A record that cannot be read proves nothing about this session, so the
    // caller keeps nudging rather than assuming a handoff it never saw.
    if (record === null || record.sessionId !== sessionId) return false;
    if (record.status === 'pending') return true;
    if (record.status !== 'armed') return false;
    return armedRecordStillCurrent(record, env);
  } catch {
    return false;
  }
}

/** Return the env-then-config threshold, accepted when finite in (0, 1]. */
function relaunchThreshold(config = {}, env = process.env) {
  const value = env.SESSION_RELAUNCH_THRESHOLD
    ?? config.SESSION_RELAUNCH_THRESHOLD;
  const threshold = Number(value);
  return Number.isFinite(threshold) && threshold > 0 && threshold <= 1
    ? threshold
    : DEFAULT_THRESHOLD;
}

/** Return the next nudge level using the threshold and one five-point reminder. */
function nextLevel({ ratio, threshold, state } = {}) {
  const level = Number.isInteger(state) && state >= 0 ? state : 0;
  if (level > LAST_NUDGE_LEVEL) return { level, nudge: false };

  const boundary = Number((Number(threshold) + level * NUDGE_STEP).toFixed(6));
  if (Number(ratio) < boundary) return { level, nudge: false };
  return { level: level + 1, nudge: true };
}

/** Validate a session id before using it in a command or state-file name. */
function validSessionId(id) {
  return typeof id === 'string' && SESSION_ID_PATTERN.test(id);
}

function stateFilePath(sessionId, env) {
  if (!validSessionId(sessionId)) return null;
  return path.join(core.stateDir(env), `nudge-${sessionId}.json`);
}

/** Read the recorded nudge level, treating absent or corrupt state as level zero. */
function readState(sessionId, env = process.env) {
  const filePath = stateFilePath(sessionId, env);
  if (filePath === null) return 0;

  try {
    const level = Number(JSON.parse(fs.readFileSync(filePath, 'utf8'))?.level);
    return Number.isInteger(level) && level >= 0 ? level : 0;
  } catch {
    return 0;
  }
}

/** Persist the nudge level with private file and directory permissions. */
function writeState(sessionId, level, env = process.env) {
  const filePath = stateFilePath(sessionId, env);
  const numericLevel = Number(level);
  if (
    filePath === null
    || !Number.isInteger(numericLevel)
    || numericLevel < 0
  ) return;

  core.ensureStateDir(env);
  fs.writeFileSync(
    filePath,
    `${JSON.stringify({ level: numericLevel })}\n`,
    { mode: 0o600 },
  );
}

module.exports = {
  handoffText,
  seedText,
  completeCommandFor,
  isSeedPrompt,
  specFolderFromSeed,
  notePathFromSeed,
  resolveRepoRoot,
  plannedNotePath,
  handoffPending,
  hopLimitReached,
  relaunchThreshold,
  nextLevel,
  validSessionId,
  readState,
  writeState,
};
