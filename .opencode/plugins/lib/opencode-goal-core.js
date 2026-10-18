// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Goal Core
// ───────────────────────────────────────────────────────────────────

const GOAL_CORES = new WeakMap();

/**
 * Store helper references under their server so both calls use the same module state.
 *
 * @param {Function} server - The v1 server function.
 * @param {object} helpers - Goal helpers closed over by that plugin module.
 * @returns {void}
 */
export function registerGoalCore(server, helpers) {
  GOAL_CORES.set(server, Object.freeze({ ...helpers }));
}

/**
 * Retrieve helpers attached to one plugin module instance.
 *
 * @param {Function} server - The v1 server function.
 * @returns {object} Helpers for the matching plugin module.
 * @throws {Error} When no helpers are registered for the server.
 */
export function getGoalCore(server) {
  const helpers = GOAL_CORES.get(server);
  if (!helpers) {
    throw new Error('Goal core is not registered for this server');
  }
  return helpers;
}
