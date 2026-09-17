// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPILED-ROUTE RUNTIME LAYOUT SELECTOR                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// Coherent layout selection for the promoted compiled-routing runtime closure.
//
// The runtime root carries either the current internal topology or its retained
// legacy predecessor. A partial layout must never mix generations — a current engine reading legacy
// activation state, or a legacy engine loading a current registry compiler,
// silently diverges from the promoted closure the sync tool verified. This
// module picks ONE coherent layout (all of its code paths present together)
// or fails closed, so every runtime consumer binds the same generation.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. LAYOUTS
// ─────────────────────────────────────────────────────────────────────────────

// Each layout is the complete internal path set the promoted closure serves
// under. `activation` already includes the `activation` leaf so callers can
// join it straight onto the runtime root. Order matters: resolveLayout tries
// `current` first, then `legacy`.
const LAYOUTS = Object.freeze([
  Object.freeze({
    id: 'current',
    activation: path.join('013-live-activation', 'activation'),
    compiler: path.join('009-parent-hub-rollout', '001-sk-code', 'lib', 'registry-compiler.cjs'),
    resolver: path.join('014-runtime-engine', 'lib', 'resolve.cjs'),
    engine: path.join('014-runtime-engine', 'lib', 'compiled-route.cjs'),
  }),
  Object.freeze({
    id: 'legacy',
    activation: path.join('010-live-activation', 'activation'),
    compiler: path.join('006-parent-hub-rollout', '001-sk-code', 'lib', 'registry-compiler.cjs'),
    resolver: path.join('011-runtime-engine', 'lib', 'resolve.cjs'),
    engine: path.join('011-runtime-engine', 'lib', 'compiled-route.cjs'),
  }),
]);

const CURRENT_LAYOUT = LAYOUTS[0];
const LEGACY_LAYOUT = LAYOUTS[LAYOUTS.length - 1];

// ─────────────────────────────────────────────────────────────────────────────
// 3. SELECTION
// ─────────────────────────────────────────────────────────────────────────────

// A layout is coherent only when every CODE path it binds exists together.
// Activation is state, not code: it is derived from the chosen layout and may
// be absent on disk without invalidating the verdict (a freshly built runtime
// has no manifests until mint runs, and the status probe degrades gracefully
// on a missing activation directory).
function isCoherent(runtimeRoot, layout) {
  const codePaths = [
    path.join(runtimeRoot, layout.resolver),
    path.join(runtimeRoot, layout.engine),
    path.join(runtimeRoot, layout.compiler),
  ];
  return codePaths.every((p) => fs.existsSync(p));
}

/**
 * Resolve the one coherent layout the runtime root currently serves.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @returns {Object|null} The selected layout, or null when no coherent layout
 *   is present — callers fail safe rather than mixing generations.
 */
function resolveLayout(runtimeRoot) {
  for (const layout of LAYOUTS) {
    if (isCoherent(runtimeRoot, layout)) return layout;
  }
  return null;
}

/**
 * Default to the legacy layout when none is coherent yet, so a runtime with no
 * promoted closure still resolves to a string path (and fails naturally on a
 * nonexistent root) instead of throwing at module load.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @returns {Object} A layout — the coherent verdict, or the legacy fallback.
 */
function resolveLayoutOrLegacy(runtimeRoot) {
  return resolveLayout(runtimeRoot) || LEGACY_LAYOUT;
}

/**
 * Resolve every generation-sensitive path from one layout verdict.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @param {Object} options - Selection behavior.
 * @param {boolean} options.allowLegacyFallback - Return legacy paths when no
 *   coherent layout exists yet.
 * @returns {Object|null} One coherent path binding, or null.
 */
function resolveRuntimePaths(runtimeRoot, { allowLegacyFallback = false } = {}) {
  const resolvedRoot = path.resolve(runtimeRoot);
  const selected = resolveLayout(resolvedRoot)
    || (allowLegacyFallback ? LEGACY_LAYOUT : null);
  if (!selected) return null;
  let rootIdentity = `${selected.id}:missing`;
  try {
    const stats = fs.statSync(resolvedRoot);
    rootIdentity = `${selected.id}:${stats.dev}:${stats.ino}`;
  } catch { /* Missing roots retain the fail-closed identity above. */ }
  return {
    id: selected.id,
    layout: selected,
    runtimeRoot: resolvedRoot,
    rootIdentity,
    activationRoot: path.join(resolvedRoot, selected.activation),
    compilerPath: path.join(resolvedRoot, selected.compiler),
    resolverPath: path.join(resolvedRoot, selected.resolver),
    enginePath: path.join(resolvedRoot, selected.engine),
  };
}

/**
 * Absolute activation root for the layout a runtime serves.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @returns {string} Absolute activation directory path (legacy fallback when
 *   no layout is coherent, so load-time callers never receive null).
 */
function activationRootFor(runtimeRoot) {
  return path.join(runtimeRoot, resolveLayoutOrLegacy(runtimeRoot).activation);
}

/**
 * Absolute resolver path for the coherent layout a runtime serves.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @returns {string|null} Absolute resolver path, or null if no coherent layout.
 */
function resolverPathFor(runtimeRoot) {
  const layout = resolveLayout(runtimeRoot);
  return layout ? path.join(runtimeRoot, layout.resolver) : null;
}

/**
 * Absolute engine module path for the coherent layout a runtime serves.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @returns {string|null} Absolute engine path, or null if no coherent layout.
 */
function enginePathFor(runtimeRoot) {
  const layout = resolveLayout(runtimeRoot);
  return layout ? path.join(runtimeRoot, layout.engine) : null;
}

/**
 * Absolute registry-compiler path for the coherent layout a runtime serves.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @returns {string|null} Absolute compiler path, or null if no coherent layout.
 */
function compilerPathFor(runtimeRoot) {
  const layout = resolveLayout(runtimeRoot);
  return layout ? path.join(runtimeRoot, layout.compiler) : null;
}

/**
 * Fixed sibling lock used to exclude activation-manifest writers while a
 * publication remains reversible.
 *
 * @param {string} runtimeRoot - Absolute promoted compiled-routing runtime root.
 * @returns {string} Absolute publication-lock path.
 */
function publicationLockPathFor(runtimeRoot) {
  const resolved = path.resolve(runtimeRoot);
  return path.join(path.dirname(resolved), `${path.basename(resolved)}.publication-lock.json`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  LAYOUTS,
  CURRENT_LAYOUT,
  LEGACY_LAYOUT,
  resolveLayout,
  resolveLayoutOrLegacy,
  resolveRuntimePaths,
  activationRootFor,
  resolverPathFor,
  enginePathFor,
  compilerPathFor,
  publicationLockPathFor,
};
