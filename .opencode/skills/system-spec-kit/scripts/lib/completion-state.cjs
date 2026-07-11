// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Spec-Kit Completion-State Core (runtime-neutral)              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Merge a spec folder's inferred level, checklist P0/P1/P2         ║
// ║          completion (with evidence gaps), and placeholder completeness   ║
// ║          percentage into one payload, so a caller stops hand-composing   ║
// ║          and hand-merging two separate Bash calls. Shells                ║
// ║          check-completion.sh and calculate-completeness.sh, catches the  ║
// ║          former's non-zero exit on an incomplete checklist (it still     ║
// ║          writes its JSON to stdout before that exit), and degrades any   ║
// ║          failing section to {status:'unavailable', error} instead of     ║
// ║          throwing. computeCompletionState() never throws, spawns no      ║
// ║          daemon/MCP, and writes no stdout/stderr itself -- both runtime  ║
// ║          adapters (the OpenCode tool, the Claude/Bash CLI shim) only map ║
// ║          transport in/out around this one function.                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { execFileSync } = require('node:child_process');
const { existsSync, readdirSync } = require('node:fs');
const { isAbsolute, join, resolve } = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CHECK_COMPLETION_SCRIPT = resolve(__dirname, '..', 'spec', 'check-completion.sh');
const CALCULATE_COMPLETENESS_SCRIPT = resolve(__dirname, '..', 'spec', 'calculate-completeness.sh');

// Bounded so a slow or hung script caps the tool call rather than hanging it;
// the merged payload is small JSON, so a generous but finite buffer is safe.
const EXEC_TIMEOUT_MS = 5000;
const EXEC_MAX_BUFFER_BYTES = 2 * 1024 * 1024;

// Kill-switch: both adapters (the OpenCode tool, the CLI shim) call through
// this one core, so checking the env here -- rather than per-adapter -- keeps
// the disabled behavior identical on both transports. Setting this to '1'
// makes the whole surface a full no-op: no filesystem probe, no script exec.
const DISABLED_ENV = 'MK_SPECKIT_COMPLETION_DISABLED';

// Canonical-doc presence infers the spec level: checklist.md raises Level 1 to
// 2, decision-record.md (or its dashed variant) raises it further to 3. This
// mirrors the repo's own Level 1/2/3 documentation-depth convention rather than
// re-deriving it from LOC or any other heuristic.
const CANONICAL_DOC_FILENAMES = Object.freeze({
  spec: 'spec.md',
  plan: 'plan.md',
  tasks: 'tasks.md',
  checklist: 'checklist.md',
  decisionRecord: 'decision-record.md',
  implementationSummary: 'implementation-summary.md',
});
const DECISION_RECORD_VARIANT_REGEX = /^decision-record-.+\.md$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- path resolution
// ─────────────────────────────────────────────────────────────────────────────

function resolveProjectDir(projectDir) {
  return typeof projectDir === 'string' && projectDir.trim() ? resolve(projectDir) : process.cwd();
}

function resolveSpecFolder(specFolder, projectDir) {
  if (typeof specFolder === 'string' && specFolder.trim()) {
    if (isAbsolute(specFolder)) return specFolder;
    const direct = resolve(projectDir, specFolder);
    // Accept the track-relative shorthand (<track>/<packet>) that the memory
    // tools use: when the path is not found under the project root, retry under
    // the canonical specs root before falling back to the direct (not-found) path.
    if (!existsSync(direct)) {
      const underSpecs = resolve(projectDir, '.opencode/specs', specFolder);
      if (existsSync(underSpecs)) return underSpecs;
    }
    return direct;
  }
  // No folder given: fall back to the project root itself rather than
  // erroring, so a bare call still returns a (likely mostly-unavailable)
  // payload instead of requiring a caller to pre-validate input.
  return projectDir;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS -- canonical-doc presence + level inference
// ─────────────────────────────────────────────────────────────────────────────

function hasDecisionRecordVariant(specFolder) {
  try {
    return readdirSync(specFolder).some((name) => DECISION_RECORD_VARIANT_REGEX.test(name));
  } catch (_) {
    return false;
  }
}

function detectFilesPresent(specFolder) {
  const present = {};
  for (const [key, filename] of Object.entries(CANONICAL_DOC_FILENAMES)) {
    present[key] = existsSync(join(specFolder, filename));
  }
  if (!present.decisionRecord) present.decisionRecord = hasDecisionRecordVariant(specFolder);
  return present;
}

function inferLevel(filesPresent) {
  let level = 1;
  if (filesPresent && filesPresent.checklist) level = 2;
  if (filesPresent && filesPresent.decisionRecord) level = 3;
  return level;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS -- bounded script exec + fail-open JSON parse
// ─────────────────────────────────────────────────────────────────────────────

function parseJsonSafely(text) {
  if (typeof text !== 'string' || !text.trim()) return { ok: false, error: 'empty script output' };
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (parseError) {
    return { ok: false, error: `invalid JSON from script: ${parseError.message}` };
  }
}

function describeExecError(err) {
  if (!err) return 'unknown script execution error';
  const parts = [];
  if (typeof err.status === 'number') parts.push(`exit ${err.status}`);
  if (err.signal) parts.push(`signal ${err.signal}`);
  const stderrText = typeof err.stderr === 'string' ? err.stderr.trim().split('\n')[0] : '';
  if (stderrText) parts.push(stderrText);
  else if (err.message) parts.push(err.message);
  return parts.length > 0 ? parts.join(': ') : String(err);
}

/**
 * Shell one completion-signal script and parse its `--json` stdout.
 *
 * `check-completion.sh` exits 1 when a checklist is incomplete, but it still
 * writes its JSON to stdout before that exit -- `execFileSync` throws on any
 * non-zero exit, so a success-path-only read would misreport every incomplete
 * packet as unavailable. Catching the throw and parsing `err.stdout` first is
 * what keeps an incomplete packet's real status visible.
 *
 * @param {string} scriptPath - absolute path to the shell script
 * @param {string[]} args - script arguments (folder path plus flags)
 * @param {{cwd: string}} execOptions - execFileSync cwd
 * @returns {{ok: true, data: object}|{ok: false, error: string}}
 */
function execScriptJson(scriptPath, args, execOptions) {
  try {
    const stdout = execFileSync('bash', [scriptPath, ...args], {
      cwd: execOptions.cwd,
      timeout: EXEC_TIMEOUT_MS,
      maxBuffer: EXEC_MAX_BUFFER_BYTES,
      encoding: 'utf8',
      // Explicit so a non-zero exit (check-completion.sh on an incomplete
      // checklist) reliably decorates the thrown error with .stdout/.stderr
      // instead of leaving their capture to an implicit default; stdin is
      // 'ignore' since neither script ever reads it.
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return parseJsonSafely(stdout);
  } catch (err) {
    if (err && typeof err.stdout === 'string' && err.stdout.trim()) {
      const parsedFromFailure = parseJsonSafely(err.stdout);
      if (parsedFromFailure.ok) return parsedFromFailure;
    }
    return { ok: false, error: describeExecError(err) };
  }
}

function buildChecklistSection(specFolder, execOptions, strict) {
  const args = [specFolder, '--json'];
  if (strict) args.push('--strict');
  const result = execScriptJson(CHECK_COMPLETION_SCRIPT, args, execOptions);
  if (!result.ok) return { status: 'unavailable', error: result.error };
  return result.data;
}

function buildPlaceholdersSection(specFolder, execOptions) {
  const result = execScriptJson(CALCULATE_COMPLETENESS_SCRIPT, [specFolder, '--json'], execOptions);
  if (!result.ok) return { status: 'unavailable', error: result.error };
  return result.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN ENTRYPOINT (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute one merged completion-state payload for a spec folder.
 *
 * Never throws: any resolution, exec, or parse failure degrades only the
 * affected section to `{status:'unavailable', error}` while the rest of the
 * payload still populates. Read-only -- it shells the two existing scripts
 * and touches no other state.
 *
 * @param {{specFolder?: string, projectDir?: string, strict?: boolean, env?: NodeJS.ProcessEnv}} [options]
 * @returns {{specFolder: string|null, level: number|null, filesPresent: object, checklist: object, placeholders: object, generatedAt: string, disabled?: boolean}}
 */
function computeCompletionState(options = {}) {
  // The `= {}` default only covers a call with no argument at all; an
  // explicit `null`/other falsy non-object bypasses it and every `options.*`
  // read below -- including the outer catch's own fallback -- would then
  // throw instead of degrading, breaking the never-throws contract.
  options = options || {};
  const generatedAt = new Date().toISOString();
  const environment = (options && options.env) || process.env;
  if (environment[DISABLED_ENV] === '1') {
    return {
      specFolder: typeof options.specFolder === 'string' ? options.specFolder : null,
      level: null,
      filesPresent: { status: 'disabled' },
      checklist: { status: 'disabled' },
      placeholders: { status: 'disabled' },
      generatedAt,
      disabled: true,
    };
  }

  try {
    const projectDir = resolveProjectDir(options.projectDir);
    const specFolder = resolveSpecFolder(options.specFolder, projectDir);
    const strict = options.strict === true;
    const execOptions = { cwd: projectDir };

    let filesPresent;
    try {
      filesPresent = detectFilesPresent(specFolder);
    } catch (err) {
      filesPresent = { status: 'unavailable', error: describeExecError(err) };
    }

    return {
      specFolder,
      level: inferLevel(filesPresent),
      filesPresent,
      checklist: buildChecklistSection(specFolder, execOptions, strict),
      placeholders: buildPlaceholdersSection(specFolder, execOptions),
      generatedAt,
    };
  } catch (err) {
    // Belt-and-suspenders: no upstream option shape or filesystem state may
    // ever cause this entrypoint to throw.
    const error = describeExecError(err);
    return {
      specFolder: typeof options.specFolder === 'string' ? options.specFolder : null,
      level: 1,
      filesPresent: { status: 'unavailable', error },
      checklist: { status: 'unavailable', error },
      placeholders: { status: 'unavailable', error },
      generatedAt,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // constants
  CHECK_COMPLETION_SCRIPT,
  CALCULATE_COMPLETENESS_SCRIPT,
  CANONICAL_DOC_FILENAMES,
  DISABLED_ENV,
  // helpers (exposed for the vitest spec)
  resolveProjectDir,
  resolveSpecFolder,
  detectFilesPresent,
  inferLevel,
  parseJsonSafely,
  describeExecError,
  execScriptJson,
  // runtime-neutral entrypoint
  computeCompletionState,
};
