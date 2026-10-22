// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Nudge
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const core = require('./relaunch-core.cjs');
const hookFlags = require('../../shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SEED_PREFIX = '[session-relaunch]';
const SEED_COMMAND = SEED_PREFIX + ' claim and continue handoff ';
const SPEC_FOLDER_MARKER = core.SPEC_FOLDER_MARKER;
const SPEC_FOLDER_SUFFIX = core.SPEC_FOLDER_SUFFIX;
const SPEC_FOLDER_SKIP_SUFFIX = core.SPEC_FOLDER_SKIP_SUFFIX;
// Seeds printed by the first printers carry an unbalanced suffix; they still parse.
const SPEC_FOLDER_SKIP_SUFFIX_LEGACY = ' (Gate 3 answered D) Skip in the sending session)';
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
// Every adapter prints this command, so the model always runs the CLI from the repo root.
const CLI_COMMAND = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const CONTINUITY_WRITER_COMMAND = 'node .skilled/skills/system-spec-kit/runtime/cli/'
  + 'dist/continuity/generate-context.js';
const NUDGE_STEP = 0.05;
const LAST_NUDGE_LEVEL = 1;
const DEFAULT_THRESHOLD = 0.8;
// The wrapper's own ceiling on completed hops, used when no cap is configured.
const DEFAULT_MAX_HOPS = core.DEFAULT_MAX_HOPS;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
// Notes named before the full id went into the filename carry this many leading id
// characters; the reader still accepts them so a note written then keeps its work.
const LEGACY_SESSION_ID_PREFIX_LENGTH = 8;
const FINISH_INSTEAD_INSTRUCTION = ' If the remaining work fits in a few more steps, finish it instead'
  + ' and skip these steps.'
  + ' Otherwise do these steps now, before any other work,'
  + ' so a fresh session continues before auto-compaction has to:';
// Outside the wrapper nothing can relaunch the session, but a note still keeps what the
// compaction summary loses, so the session writes one, keeps it, and carries on.
const OUTSIDE_LOOP_INSTRUCTION = ' This session runs outside the skilled-loop wrapper, so it'
  + ' cannot relaunch; a handoff note keeps the exact decisions auto-compaction would summarize.'
  + ' If the remaining work fits in a few more steps, finish it instead and skip these steps.'
  + ' Otherwise do these steps now, before any other work:';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function shellQuote(value) {
  const quote = String.fromCharCode(39);
  const escapedQuote = quote + '"' + quote + '"' + quote;
  return quote + String(value).replace(/'/g, escapedQuote) + quote;
}

function commandPrefix(cliPath) {
  if (typeof cliPath !== 'string' || !cliPath.trim()) return CLI_COMMAND;
  if (/^node\s/.test(cliPath)) return cliPath;
  return `node ${shellQuote(cliPath)}`;
}

/** Build the command that closes a handoff note, shared by seed text and every reminder. */
function completeCommandFor(notePath, cliPath) {
  const pathValue = String(notePath ?? '<handoff-path>');
  return `${commandPrefix(cliPath)} complete ${shellQuote(pathValue)}`;
}

/** Build the command that claims a handoff note for a session. */
function claimCommandFor(notePath, sessionId, cliPath) {
  const pathValue = String(notePath ?? '<handoff-path>');
  return `${commandPrefix(cliPath)} claim ${shellQuote(pathValue)}`
    + ` --session ${shellQuote(String(sessionId ?? ''))}`;
}

// A window override can push the measured ratio far past 1, so the literal percentage
// reads as a broken hook to the model receiving it; name the overflow instead.
function contextSentence(ratio) {
  if (typeof ratio !== 'number' || !Number.isFinite(ratio)) return null;
  return ratio > 1
    ? `${SEED_PREFIX} Context is past the configured window (over 100% full).`
    : `${SEED_PREFIX} Context is about ${Math.round(ratio * 100)}% full.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reduce a spec-folder answer to one prepare accepts: empty when unanswered, `none` for a
 * Gate 3 skip, or a valid packet path. Anything else, including a value that would add
 * frontmatter lines, is unknown and returns undefined.
 */
function normalizeSpecFolder(value) {
  if (value === '' || value === 'none') return value;
  return core.validSpecFolder(value) ? value : undefined;
}

// No host puts a spec folder in its hook payload today, so the payload field stays a
// seam for one that does, and the session's bound packet comes from SYSTEM_SPEC_FOLDER.
// An empty variable says nothing about the answer, so it reads as unknown.
/** Resolve the spec folder a nudge writes into the note, payload first. */
function specFolderInput({ payload, env = process.env } = {}) {
  const fromPayload = normalizeSpecFolder(payload?.spec_folder);
  if (fromPayload !== undefined) return fromPayload;
  const fromEnvironment = env?.SYSTEM_SPEC_FOLDER;
  return fromEnvironment ? normalizeSpecFolder(fromEnvironment) : undefined;
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
  // An unknown folder prints empty: the guidance line tells the model what may go there,
  // and a placeholder copied verbatim is a value prepare rejects.
  const folder = normalizeSpecFolder(specFolder);
  const specValue = folder ?? '';
  const command = commandPrefix(cliPath);
  const context = contextSentence(ratio);
  const inLoop = Boolean(loopId);
  let opening = `${SEED_PREFIX} Write a handoff note before auto-compaction.`;
  if (context !== null) {
    opening = context + (inLoop ? FINISH_INSTEAD_INSTRUCTION : OUTSIDE_LOOP_INSTRUCTION);
  }
  // The sections asked for are the ones validateHandoff enforces, so prepare accepts the note.
  const sectionList = core.HANDOFF_SECTIONS.map((name) => `## ${name}`).join(', ');
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
  if (folder === undefined || (folder !== '' && folder !== 'none')) {
    const saveTarget = folder || '<spec-folder>';
    const saveStep = runtime === 'claude'
      ? 'run `/speckit:save` first so its continuity is current.'
      : 'save its continuity first: pipe the save JSON to '
        + `\`${CONTINUITY_WRITER_COMMAND} --stdin --full-auto ${shellQuote(saveTarget)}\`.`;
    lines.push(`${step}. When a spec packet is bound to this session, ${saveStep}`);
    step += 1;
  }
  const noteArguments = `--handoff ${shellQuote(pathValue)}`
    + ` --session ${shellQuote(sessionValue)} --runtime ${shellQuote(runtime)}`;
  if (inLoop) {
    lines.push(`${step}. Then run: ${command} prepare ${noteArguments}`);
    lines.push(
      `${step + 1}. Stop once it exits 0; the loop ends this session and relaunches `
        + 'with a claim seed.',
    );
  } else {
    lines.push(`${step}. Then run: ${command} keep ${noteArguments}`);
    lines.push(
      `${step + 1}. Keep working in this session once it exits 0. After auto-compaction, `
        + 'claim the note with the command keep prints before you continue.',
    );
  }
  lines.push(
    'Exception: skip these steps only when the operator has told this session not to hand off;'
      + ' then keep working, and auto-compaction stays the fallback.',
  );
  return lines.join('\n');
}

/** Build the claim, resume, and completion instructions for a seed prompt. */
function seedText({ notePath, specFolder, sessionId, cliPath, afterCompaction = false } = {}) {
  const pathValue = String(notePath ?? '<handoff-path>');
  const claimCommand = claimCommandFor(pathValue, sessionId, cliPath);
  const completeCommand = completeCommandFor(pathValue, cliPath);
  const gateWasSkipped = specFolder === 'none';
  const continueStep = gateWasSkipped ? 4 : 3;
  let readInstruction = '2. Read the note.';
  if (typeof specFolder === 'string' && specFolder && !gateWasSkipped) {
    readInstruction = '2. Read the note. When its frontmatter spec_folder is set, run '
      + `\`/speckit:resume ${specFolder}\`; skip that step when spec_folder is empty.`;
  }

  const lines = [
    afterCompaction
      ? '[session-relaunch] This session was compacted after it wrote a handoff note, which'
        + ' keeps the detail the summary dropped. Work it in order:'
      : '[session-relaunch] This session was opened to continue a handoff note. Work it in order:',
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

// A seed whose note path cannot be read would hand the model a claim command with a
// placeholder it cannot run, so every adapter adds nothing for it instead.
/** Build the claim instructions for a relaunch seed, or null when it is not a usable seed. */
function seedInstructions({ prompt, sessionId, cliPath = CLI_COMMAND } = {}) {
  const notePath = notePathFromSeed(prompt);
  if (notePath === null) return null;
  return seedText({
    notePath,
    specFolder: specFolderFromSeed(prompt),
    sessionId,
    cliPath,
  });
}

// Notes live in the repository that holds this concern, so every reader resolves the same root.
function resolveRepoRoot(env = process.env) {
  return path.resolve(
    env.SESSION_RELAUNCH_REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..'),
  );
}

/** Return the directory every reader keeps handoff notes in, under a repository root. */
function handoffDir(repoRoot) {
  return path.join(
    repoRoot,
    '.skilled', 'skills', '.state', 'session-relaunch', 'handoffs',
  );
}

// The nudge hands the model a path, so the directory must exist before the model
// writes there, and private because a note carries the session's working state.
// A failure here must not cost the nudge itself; the model's write then fails visibly.
// chmod follows a symlink, so a linked handoffs directory is left alone rather than
// opening up whatever it points at; the CLI refuses notes under it anyway.
function ensureHandoffDir(repoRoot) {
  const directory = handoffDir(repoRoot);
  try {
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    if (fs.lstatSync(directory).isDirectory()) fs.chmodSync(directory, 0o700);
  } catch {}
  return directory;
}

// A second nudge must name the note the session already has open. Handing it a
// fresh stamped path lets the first note be written and then abandoned as open
// while the seed claims the second one, so the work the first one describes is lost.
// The full id keeps concurrent sessions whose ids share a prefix from planning the same note.
function openNotePathFor({ repoRoot, sessionId }) {
  if (!validSessionId(sessionId)) return null;
  const directory = handoffDir(repoRoot);
  let filenames;
  try {
    filenames = fs.readdirSync(directory);
  } catch {
    return null;
  }

  // Note names start with a UTC stamp, so a reverse sort puts the newest note first.
  const suffix = `-${sessionId}.md`;
  const legacySuffix = `-${sessionId.slice(0, LEGACY_SESSION_ID_PREFIX_LENGTH)}.md`;
  for (const filename of filenames.sort().reverse()) {
    if (!filename.endsWith(suffix) && !filename.endsWith(legacySuffix)) continue;
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
  ensureHandoffDir(repoRoot);
  const openNotePath = openNotePathFor({ repoRoot, sessionId });
  if (openNotePath !== null) return openNotePath;

  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return path.join(
    handoffDir(repoRoot),
    `${stamp}-${sessionId}.md`,
  );
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
// write one. Freshness stays shouldRelaunch's own verdict so every reader shares one
// rule; its other declines still name a handoff that was prepared.
/** Report whether the wrapper, reading the record at `now`, would still find it fresh. */
function armedRecordStillCurrent(record, env, now = Date.now()) {
  return core.shouldRelaunch(record, { now, maxAgeMin: maxAgeMinutes(env) }).reason !== 'stale';
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
    // A record that cannot be read, or that the arm paths would not take as this
    // session's, proves nothing about this session, so the caller keeps nudging.
    // An armed one counts whether or not its killer still runs, while it is fresh.
    const { reason } = core.armableRecord(record, { loopId, sessionId, env });
    if (reason === 'pending') return true;
    if (reason !== 'killer-gone' && reason !== 'killer-live') return false;
    return armedRecordStillCurrent(record, env);
  } catch {
    return false;
  }
}

// Only the skilled-loop wrapper can end a session and relaunch it with a claim seed.
// Outside it, prepare can only print a manual claim command and exit 3, so a nudge
// there that asked for prepare would turn a working session into one that stops and
// waits for a hand-off nobody runs. Unset or empty reads as outside, the same test
// prepare applies.
/** Report whether this session runs under the skilled-loop wrapper. */
function insideLoop(env = process.env) {
  return Boolean(env?.SKILLED_LOOP_ID);
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

/**
 * Decide whether an adapter should nudge now, in the order every adapter applies:
 * the threshold, then inside the wrapper a handoff this session already prepared and
 * the hop cap, or outside it a note this session already has open, then the level.
 * Outside the wrapper the nudge asks for a note only, and its reason says so.
 * The state file is read only once the ratio reaches the threshold.
 *
 * @param {Object} options - Fill ratio and session state.
 * @param {number} options.ratio - Measured fill ratio.
 * @param {number} options.threshold - Resolved nudge threshold.
 * @param {string} options.sessionId - Session the nudge belongs to.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {number} [options.level] - Current level; read from the state file when omitted.
 * @param {boolean} [options.resume=false] - Re-deliver a spent level after a host restart.
 * @returns {{nudge: boolean, level: number, reason: string}} The decision and its level.
 */
function nudgeDecision({
  ratio,
  threshold,
  sessionId,
  env = process.env,
  level,
  resume = false,
} = {}) {
  const knownLevel = Number.isInteger(level) && level >= 0 ? level : undefined;
  const quiet = (reason) => ({ nudge: false, level: knownLevel ?? 0, reason });
  if (!(Number(ratio) >= Number(threshold))) return quiet('below-threshold');
  const inLoop = insideLoop(env);
  if (inLoop && handoffPending({ sessionId, env })) return quiet('handoff-pending');
  if (inLoop && hopLimitReached(env)) return quiet('hop-limit');
  // Outside the wrapper no record marks the work as done, so the session's own open
  // note does: once it is written, a re-nudge would only ask for it again.
  if (!inLoop && openNotePathFor({ repoRoot: resolveRepoRoot(env), sessionId }) !== null) {
    return quiet('note-open');
  }

  const current = knownLevel ?? readState(sessionId, env);
  if (resume && current >= 1) return { nudge: true, level: current, reason: 'resume' };
  const next = nextLevel({ ratio, threshold, state: current });
  return next.nudge
    ? { nudge: true, level: next.level, reason: inLoop ? 'threshold' : 'outside-loop' }
    : { nudge: false, level: next.level, reason: 'level-spent' };
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CLI_COMMAND,
  normalizeSpecFolder,
  specFolderInput,
  seedInstructions,
  nudgeDecision,
  handoffText,
  seedText,
  completeCommandFor,
  claimCommandFor,
  isSeedPrompt,
  specFolderFromSeed,
  notePathFromSeed,
  resolveRepoRoot,
  handoffDir,
  plannedNotePath,
  openNotePathFor,
  handoffPending,
  armedRecordStillCurrent,
  hopLimitReached,
  relaunchThreshold,
  nextLevel,
  validSessionId,
  readState,
  writeState,
};
