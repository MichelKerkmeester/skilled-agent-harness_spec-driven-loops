// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review Runtime Capabilities Resolver                                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Compatibility shim. The resolver now lives in the shared backend at      ║
// ║ deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs; this file      ║
// ║ binds the "deep-review" label and this skill's default matrix path,      ║
// ║ then re-exports the same surface so CLI output and module API are        ║
// ║ unchanged for existing callers.                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const { createRuntimeCapabilities } = require('../../../deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. BINDING
// ─────────────────────────────────────────────────────────────────────────────

/** @type {string} Default path to the machine-readable runtime capability matrix. */
const DEFAULT_CAPABILITY_PATH = path.join(__dirname, '..', 'assets', 'runtime_capabilities.json');

const capabilities = createRuntimeCapabilities({
  label: 'deep-review',
  defaultCapabilityPath: DEFAULT_CAPABILITY_PATH,
});

const {
  listRuntimeCapabilityIds,
  loadRuntimeCapabilities,
  resolveRuntimeCapability,
} = capabilities;

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  capabilities.runMain();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_CAPABILITY_PATH,
  listRuntimeCapabilityIds,
  loadRuntimeCapabilities,
  resolveRuntimeCapability,
};
