#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment — Scoping & Lane Resolution                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  --lane-config <file.json|-> (CLI), OR a parsed lane-config array ║
// ║         / interactive selections array (as a required module).          ║
// ║ Output: JSON lane tuples to stdout (CLI --json), or an array of         ║
// ║         { authority, artifactClass, scope } objects (as a module).      ║
// ║ Exit:   0=ok, 1=script error, 3=input validation error.                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Implements the SCOPE-state lane resolution and --lane-config parsing
// specified in ../references/scoping_protocol.md and
// ../references/lane_config_schema.md. Both the interactive path
// (resolveLanesFromSelections) and the non-interactive path
// (resolveLanesFromConfig / parseLaneConfigFile) funnel through the same
// validateLane()/validateScope() pair, so the two paths can never diverge in
// what a resolved lane looks like -- an interactively-answered lane and a
// config-file lane must be indistinguishable once resolved.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { validateNamespaceValue, classifyExitCode } = require('../../runtime/scripts/lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The four ARTIFACT-CLASS values. Declaration order matches the documented
// axis order; validation does not depend on it.
const ARTIFACT_CLASSES = Object.freeze(['docs', 'code', 'designs', 'git-history']);

// The three SCOPE shapes a lane may carry.
const SCOPE_TYPES = Object.freeze(['paths', 'globs', 'branchRange']);

// AUTHORITY -> allowed ARTIFACT-CLASS registry. A new authority registers by
// adding one entry here -- no other change to this module or the loop that
// calls it is required. Values are arrays so a future authority may cover
// more than one artifact-class; v1's four authorities each cover exactly one.
const AUTHORITY_ARTIFACT_CLASSES = Object.freeze({
  'sk-doc': Object.freeze(['docs']),
  'sk-git': Object.freeze(['git-history']),
  'sk-design': Object.freeze(['designs']),
  'sk-code': Object.freeze(['code']),
});

// AUTHORITY -> allowed ADAPTER MODULE registry. An authority resolves to its own
// adapter module (adapters/<authority>.cjs) by default; a lane MAY carry an
// optional `adapter` discriminator to select a peer adapter variant for the same
// authority. sk-design ships two adapter shapes over the same `designs` class --
// the static rubric adapter (sk-design) and the live-render adapter
// (sk-design-live-render) -- so without an adapter selector a designs lane could
// never reach sk-design-live-render.cjs. Discovery/check load
// adapters/<adapter-or-authority>.cjs; the loop still never branches on which
// authority produced a finding, it only loads the module the lane names.
const AUTHORITY_ADAPTERS = Object.freeze({
  'sk-doc': Object.freeze(['sk-doc']),
  'sk-git': Object.freeze(['sk-git']),
  'sk-design': Object.freeze(['sk-design', 'sk-design-live-render']),
  'sk-code': Object.freeze(['sk-code']),
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

/**
 * The currently registered authority names, in registration order.
 *
 * @returns {string[]}
 */
function registeredAuthorities() {
  return Object.keys(AUTHORITY_ARTIFACT_CLASSES);
}

/**
 * The adapter module names an authority may resolve to (the default is the
 * authority's own name).
 *
 * @param {string} authority
 * @returns {string[]}
 */
function registeredAdapters(authority) {
  return AUTHORITY_ADAPTERS[authority] ? [...AUTHORITY_ADAPTERS[authority]] : [];
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate and normalize a lane's `scope` field against the three shapes a
 * lane may carry: `paths`, `globs`, or `branchRange`. `paths`/`globs` values
 * are additionally validated against the repo root via the same
 * `validateNamespaceValue()` the shared runtime CLIs use for namespace-scoped
 * strings, rather than re-implementing path-traversal detection here -- an
 * unvalidated scope value could otherwise let a lane point outside the
 * workspace before any adapter ever sees it.
 *
 * @param {unknown} scope - The raw scope value to validate.
 * @param {string} label - Dotted label for error messages (e.g. "lanes[0].scope").
 * @returns {{type:'paths'|'globs', values:string[]}|{type:'branchRange', from:string, to:string}}
 * @throws {Error} With code INPUT_VALIDATION on any shape violation.
 */
function validateScope(scope, label) {
  if (!isPlainObject(scope)) {
    throw inputError(`${label} must be an object`);
  }
  if (!SCOPE_TYPES.includes(scope.type)) {
    throw inputError(`${label}.type must be one of ${SCOPE_TYPES.join(', ')}`);
  }
  if (scope.type === 'paths' || scope.type === 'globs') {
    if (!Array.isArray(scope.values) || scope.values.length === 0) {
      throw inputError(`${label}.values must be a non-empty array of strings for scope.type "${scope.type}"`);
    }
    const values = scope.values.map((value, i) => {
      if (!nonEmptyString(value)) {
        throw inputError(`${label}.values[${i}] must be a non-empty string`);
      }
      // Every path/glob must be validated against the repo root before any
      // adapter's discover() can see it, so a malformed scope cannot escape
      // the workspace.
      return validateNamespaceValue(value, `${label}.values[${i}]`, inputError);
    });
    return { type: scope.type, values };
  }
  // branchRange: refs, not filesystem paths, so no repo-root containment check.
  if (!nonEmptyString(scope.from) || !nonEmptyString(scope.to)) {
    throw inputError(`${label}.from and ${label}.to must both be non-empty strings for scope.type "branchRange"`);
  }
  return { type: 'branchRange', from: scope.from.trim(), to: scope.to.trim() };
}

/**
 * Validate one raw lane object and resolve it to the canonical internal lane
 * tuple. This is the single choke point both the interactive path and the
 * --lane-config path call, so a resolved lane is indistinguishable
 * regardless of which path produced it.
 *
 * @param {unknown} rawLane - The raw `{authority, artifactClass, scope}` candidate.
 * @param {string} label - Dotted label for error messages (e.g. "lanes[0]").
 * @returns {{authority:string, artifactClass:string, scope:object}}
 * @throws {Error} With code INPUT_VALIDATION on any contract violation.
 */
function validateLane(rawLane, label) {
  if (!isPlainObject(rawLane)) {
    throw inputError(`${label} must be an object`);
  }
  const { authority, artifactClass, scope } = rawLane;
  if (!nonEmptyString(authority)) {
    throw inputError(`${label}.authority is required`);
  }
  const allowedClasses = AUTHORITY_ARTIFACT_CLASSES[authority];
  if (!allowedClasses) {
    throw inputError(`${label}.authority "${authority}" is not a registered authority. Registered authorities: ${registeredAuthorities().join(', ')}`);
  }
  if (!nonEmptyString(artifactClass) || !ARTIFACT_CLASSES.includes(artifactClass)) {
    throw inputError(`${label}.artifactClass must be one of ${ARTIFACT_CLASSES.join(', ')}`);
  }
  if (!allowedClasses.includes(artifactClass)) {
    throw inputError(`${label}: authority "${authority}" does not support artifactClass "${artifactClass}". Supported: ${allowedClasses.join(', ')}`);
  }
  // Optional adapter discriminator: defaults to the authority's own module, and
  // when supplied must be one of that authority's registered adapter variants so
  // discovery/check can reach a peer adapter (e.g. sk-design-live-render) without
  // the loop ever branching on authority.
  const allowedAdapters = AUTHORITY_ADAPTERS[authority] || [authority];
  let adapter = authority;
  if (rawLane.adapter !== undefined && rawLane.adapter !== null) {
    if (!nonEmptyString(rawLane.adapter)) {
      throw inputError(`${label}.adapter must be a non-empty string when present`);
    }
    if (!allowedAdapters.includes(rawLane.adapter)) {
      throw inputError(`${label}: adapter "${rawLane.adapter}" is not a registered adapter for authority "${authority}". Allowed: ${allowedAdapters.join(', ')}`);
    }
    adapter = rawLane.adapter;
  }
  return {
    authority,
    artifactClass,
    adapter,
    scope: validateScope(scope, `${label}.scope`),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC — LANE RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve lanes from an already-JSON-parsed --lane-config document (a bare
 * array of lane objects -- see references/lane_config_schema.md for the
 * full shape). An empty array is valid and resolves to zero lanes -- not an
 * error, mirroring how an empty scope resolves to zero-coverage rather than
 * failing.
 *
 * @param {unknown} config - The parsed lane-config JSON value.
 * @returns {Array<{authority:string, artifactClass:string, scope:object}>}
 * @throws {Error} With code INPUT_VALIDATION if the root is not an array or
 *   any entry fails validateLane().
 */
function resolveLanesFromConfig(config) {
  if (!Array.isArray(config)) {
    throw inputError('lane-config file must contain a JSON array of lane objects (see references/lane_config_schema.md)');
  }
  return config.map((lane, index) => validateLane(lane, `lanes[${index}]`));
}

/**
 * Resolve lanes from the interactive path's structured answers -- one entry
 * per three-axis tree walk, each carrying a multi-selected authorities list
 * for that walk's artifact-class + scope. This is the pure function the
 * invoking command/agent calls once it has collected the operator's
 * conversational answers; it is not a terminal prompt loop -- this mode is
 * invoked exclusively through its own command workflow, so there is no
 * terminal session for a readline prompt to attach to.
 *
 * @param {unknown} selections - Array of `{artifactClass, authorities, scope}`.
 * @returns {Array<{authority:string, artifactClass:string, scope:object}>}
 * @throws {Error} With code INPUT_VALIDATION on any malformed selection.
 */
function resolveLanesFromSelections(selections) {
  if (!Array.isArray(selections)) {
    throw inputError('selections must be an array (see references/scoping_protocol.md)');
  }
  const lanes = [];
  selections.forEach((selection, selectionIndex) => {
    const selectionLabel = `selections[${selectionIndex}]`;
    if (!isPlainObject(selection)) {
      throw inputError(`${selectionLabel} must be an object`);
    }
    if (!Array.isArray(selection.authorities) || selection.authorities.length === 0) {
      throw inputError(`${selectionLabel}.authorities must be a non-empty array`);
    }
    selection.authorities.forEach((authority, authorityIndex) => {
      lanes.push(validateLane(
        { authority, artifactClass: selection.artifactClass, scope: selection.scope },
        `${selectionLabel}.authorities[${authorityIndex}]`,
      ));
    });
  });
  return lanes;
}

/**
 * Read and parse a --lane-config file (or "-" for stdin, mirroring
 * runtime/scripts/upsert.cjs's own stdin convention), then resolve it to
 * lane tuples.
 *
 * @param {string} filePath - Path to the lane-config JSON file, or "-".
 * @returns {Array<{authority:string, artifactClass:string, scope:object}>}
 * @throws {Error} With code INPUT_VALIDATION if the path is missing, unreadable,
 *   not valid JSON, or fails lane validation.
 */
function parseLaneConfigFile(filePath) {
  if (!nonEmptyString(filePath)) {
    throw inputError('--lane-config requires a file path (or "-" for stdin)');
  }
  let raw;
  if (filePath === '-') {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    const resolved = path.resolve(filePath);
    try {
      raw = fs.readFileSync(resolved, 'utf8');
    } catch (err) {
      throw inputError(`--lane-config file could not be read: ${resolved} (${err instanceof Error ? err.message : String(err)})`);
    }
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw inputError(`--lane-config content is not valid JSON (${err instanceof Error ? err.message : String(err)})`);
  }
  return resolveLanesFromConfig(parsed);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--lane-config') {
      args.laneConfig = argv[i + 1];
      i += 1;
    } else if (token === '--json') {
      args.json = true;
    } else if (token === '--help' || token === '-h') {
      args.help = true;
    } else {
      throw inputError(`Unexpected argument: ${token}`);
    }
  }
  return args;
}

function summarizeScope(scope) {
  return scope.type === 'branchRange' ? `${scope.from}..${scope.to}` : scope.values.join(', ');
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write('Usage: scoping.cjs --lane-config <file.json|-> [--json]\n');
    return 0;
  }
  if (!args.laneConfig) {
    // Config-file only, no inline-flag fallback: the interactive question is
    // the only other path, and it is owned by the invoking command/agent,
    // not this script.
    throw inputError('--lane-config <file.json> is required in the non-interactive path; the interactive scoping question (references/scoping_protocol.md) is the fallback when this flag is not supplied by the invoking command');
  }
  const lanes = parseLaneConfigFile(args.laneConfig);
  if (args.json) {
    process.stdout.write(`${JSON.stringify({ status: 'ok', lanes })}\n`);
  } else {
    process.stdout.write(`Resolved ${lanes.length} lane(s):\n`);
    for (const lane of lanes) {
      process.stdout.write(`  - ${lane.authority} / ${lane.artifactClass} / ${lane.scope.type} (${summarizeScope(lane.scope)})\n`);
    }
  }
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main());
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(classifyExitCode(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ARTIFACT_CLASSES,
  AUTHORITY_ARTIFACT_CLASSES,
  AUTHORITY_ADAPTERS,
  SCOPE_TYPES,
  registeredAuthorities,
  registeredAdapters,
  validateScope,
  validateLane,
  resolveLanesFromConfig,
  resolveLanesFromSelections,
  parseLaneConfigFile,
  main,
};
