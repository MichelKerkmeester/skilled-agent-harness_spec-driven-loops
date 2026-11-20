// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Goal Core
// ───────────────────────────────────────────────────────────────────

const GOAL_CORES = new WeakMap();

/**
 * Store helper references under their plugin factory so both calls use the same module state.
 *
 * @param {Function} factory - The plugin's hook factory, exposed as the plugin's `factory` property.
 * @param {object} helpers - Goal helpers closed over by that plugin module.
 * @returns {void}
 */
export function registerGoalCore(factory, helpers) {
  GOAL_CORES.set(factory, Object.freeze({ ...helpers }));
}

/**
 * Retrieve helpers attached to one plugin module instance.
 *
 * @param {Function} factory - The plugin's hook factory, exposed as the plugin's `factory` property.
 * @returns {object} Helpers for the matching plugin module.
 * @throws {Error} When no helpers are registered for the factory.
 */
export function getGoalCore(factory) {
  const helpers = GOAL_CORES.get(factory);
  if (!helpers) {
    throw new Error('Goal core is not registered for this factory');
  }
  return helpers;
}
