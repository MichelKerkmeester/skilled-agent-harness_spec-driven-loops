// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Runtime Capabilities Resolver (shared backend)                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Parameterized capability-matrix resolver shared by every graph-backed    ║
// ║ deep-loop mode. The per-skill scripts are thin shims that bind a label   ║
// ║ (used in the not-found error) and a default matrix path, then re-export  ║
// ║ the same four functions so their CLI and module surface stay identical.  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate stop policy before runtime records are trusted.
 *
 * @param {Object} matrix - Parsed runtime capability matrix
 * @param {string} resolvedPath - Absolute path used in diagnostics
 * @throws {Error} If the stop policy is absent or unsupported
 */
function validateStopPolicy(matrix, resolvedPath) {
  if (!matrix || typeof matrix !== 'object') {
    throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: expected object`);
  }
  if (matrix.stopPolicy === undefined) {
    throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: missing stopPolicy`);
  }
  if (matrix.stopPolicy !== 'fail-closed') {
    throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: stopPolicy must be "fail-closed"`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a capability resolver bound to one skill's label and default matrix path.
 *
 * The returned functions are behaviorally identical to the historical per-skill
 * resolver: `loadRuntimeCapabilities`, `listRuntimeCapabilityIds`, and
 * `resolveRuntimeCapability` accept an optional override path and otherwise use
 * the bound default. `runMain` reproduces the legacy CLI byte-for-byte.
 *
 * @param {Object} options
 * @param {string} options.label - Skill label used in the not-found error message
 *   (e.g. "deep-research"). Keeps error strings per-skill identical to pre-merge.
 * @param {string} options.defaultCapabilityPath - Default path to runtime_capabilities.json
 *   (the caller computes this from its own __dirname so the resolved path is unchanged).
 * @returns {{
 *   DEFAULT_CAPABILITY_PATH: string,
 *   loadRuntimeCapabilities: Function,
 *   listRuntimeCapabilityIds: Function,
 *   resolveRuntimeCapability: Function,
 *   runMain: Function
 * }}
 */
function createRuntimeCapabilities(options = {}) {
  const { label, defaultCapabilityPath: DEFAULT_CAPABILITY_PATH } = options;

  if (typeof label !== 'string' || !label) {
    throw new Error('createRuntimeCapabilities: a non-empty "label" is required');
  }
  if (typeof DEFAULT_CAPABILITY_PATH !== 'string' || !DEFAULT_CAPABILITY_PATH) {
    throw new Error('createRuntimeCapabilities: a non-empty "defaultCapabilityPath" is required');
  }

  /**
   * Load and validate the runtime capability matrix from disk.
   *
   * @param {string} [capabilityPath] - Path to runtime_capabilities.json
   * @returns {{ capabilityPath: string, matrix: Object }} Resolved path and parsed matrix
   * @throws {Error} If the matrix file is missing or malformed
   */
  function loadRuntimeCapabilities(capabilityPath = DEFAULT_CAPABILITY_PATH) {
    const resolvedPath = path.resolve(capabilityPath);
    const parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

    validateStopPolicy(parsed, resolvedPath);

    if (!Array.isArray(parsed.runtimes)) {
      throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: missing runtimes array`);
    }

    return {
      capabilityPath: resolvedPath,
      matrix: parsed,
    };
  }

  /**
   * List all known runtime IDs from the capability matrix.
   *
   * @param {string} [capabilityPath] - Path to runtime_capabilities.json
   * @returns {string[]} Array of runtime identifier strings
   */
  function listRuntimeCapabilityIds(capabilityPath = DEFAULT_CAPABILITY_PATH) {
    const { matrix } = loadRuntimeCapabilities(capabilityPath);
    return matrix.runtimes.map((runtime) => runtime.id);
  }

  /**
   * Resolve a single runtime's capability record by ID.
   *
   * @param {string} runtimeId - Runtime identifier to look up
   * @param {string} [capabilityPath] - Path to runtime_capabilities.json
   * @returns {{ capabilityPath: string, runtime: Object }} Resolved path and runtime record
   * @throws {Error} If the runtime ID is not found in the matrix
   */
  function resolveRuntimeCapability(runtimeId, capabilityPath = DEFAULT_CAPABILITY_PATH) {
    const { capabilityPath: resolvedPath, matrix } = loadRuntimeCapabilities(capabilityPath);
    const runtime = matrix.runtimes.find((entry) => entry.id === runtimeId);

    if (!runtime) {
      throw new Error(
        `Unknown ${label} runtime "${runtimeId}". Known runtimes: ${matrix.runtimes.map((entry) => entry.id).join(', ')}. Matrix: ${resolvedPath}`,
      );
    }

    return {
      capabilityPath: resolvedPath,
      runtime,
    };
  }

  /**
   * Reproduce the historical CLI: no argument lists all runtime IDs and exits 0;
   * a runtime ID prints its resolved record. Output bytes and exit codes match
   * the pre-merge per-skill scripts exactly.
   *
   * @param {string[]} [argv] - Full process argv (argv[2] is the optional runtime id)
   */
  function runMain(argv = process.argv) {
    const runtimeId = argv[2];

    if (!runtimeId) {
      process.stdout.write(
        `${JSON.stringify(
          {
            capabilityPath: path.resolve(DEFAULT_CAPABILITY_PATH),
            runtimeIds: listRuntimeCapabilityIds(),
          },
          null,
          2,
        )}\n`,
      );
      process.exit(0);
    }

    process.stdout.write(`${JSON.stringify(resolveRuntimeCapability(runtimeId), null, 2)}\n`);
  }

  return {
    DEFAULT_CAPABILITY_PATH,
    loadRuntimeCapabilities,
    listRuntimeCapabilityIds,
    resolveRuntimeCapability,
    runMain,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  createRuntimeCapabilities,
};
