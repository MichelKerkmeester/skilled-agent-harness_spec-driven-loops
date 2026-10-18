// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Nudge
// ───────────────────────────────────────────────────────────────────
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const core = require('./relaunch-core.cjs');

const SEED_PREFIX = '[session-relaunch]';
const SPEC_FOLDER_MARKER = ' | Spec folder: ';
const SPEC_FOLDER_SUFFIX = ' (carried from the handoff; Gate 3 answered in the sending session)';
const SPEC_FOLDER_SKIP_SUFFIX = ' (Gate 3 answered D) Skip in the sending session)';
const SPEC_FOLDER_GUIDANCE = '   spec_folder is a repo-relative '
  + 'packet path, "none" for Gate 3 D) Skip, or empty if unanswered.';
const DEFAULT_CLI_COMMAND = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
const CONTINUITY_WRITER_COMMAND = 'node .skilled/skills/system-spec-kit/runtime/cli/'
  + 'dist/continuity/generate-context.js';
const NUDGE_STEP = 0.05;
const LAST_NUDGE_LEVEL = 1;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const HANDOFF_SECTIONS = ['Goal', 'Done', 'Remaining work', 'In-flight state'];

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
  const opening = typeof ratio === 'number' && Number.isFinite(ratio)
    ? `[session-relaunch] Context is about ${Math.round(ratio * 100)}% full.`
      + ' Do these steps now, before any other work,'
      + ' so a fresh session continues before auto-compaction has to:'
    : '[session-relaunch] Write a handoff note before auto-compaction.';
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
  const completeCommand = `${command} complete ${shellQuote(pathValue)}`;
  const gateWasSkipped = specFolder === 'none';
  const continueStep = gateWasSkipped ? 4 : 3;
  let readInstruction = '2. Read the note.';
  if (typeof specFolder === 'string' && specFolder && !gateWasSkipped) {
    readInstruction = '2. Read the note. When its frontmatter spec_folder is set, run '
      + `\`/speckit:resume ${specFolder}\`; skip that step when spec_folder is empty.`;
  }

  const lines = [
    '[session-relaunch] This session was opened to continue a handoff note. Work it in order:',
    `1. Run \`${claimCommand}\`, where <handoff-path> is the path the seed prompt`
      + ' names; it prints the note body.',
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
  if (rawFolder.endsWith(SPEC_FOLDER_SKIP_SUFFIX)) {
    return rawFolder.slice(0, -SPEC_FOLDER_SKIP_SUFFIX.length) === 'none' ? 'none' : '';
  }
  if (!rawFolder.endsWith(SPEC_FOLDER_SUFFIX)) return '';
  const specFolder = rawFolder.slice(0, -SPEC_FOLDER_SUFFIX.length);
  if (!core.validSpecFolder(specFolder)) return '';
  return specFolder;
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

  fs.mkdirSync(core.stateDir(env), { recursive: true, mode: 0o700 });
  fs.writeFileSync(
    filePath,
    `${JSON.stringify({ level: numericLevel })}\n`,
    { mode: 0o600 },
  );
}

module.exports = {
  handoffText,
  seedText,
  isSeedPrompt,
  specFolderFromSeed,
  nextLevel,
  validSessionId,
  readState,
  writeState,
};
