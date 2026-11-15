// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Goal Injection Adapter
// ───────────────────────────────────────────────────────────────────
// Vibe exposes no prompt-command surface in this repository, so the bound
// packet is named through VIBE_SPEC_FOLDER and the goal is injection-only.
// A session started from a manual handover claim has no VIBE_SPEC_FOLDER of
// its own, so the packet the wrapper exported from the claimed note stands in.
// The session_start hook asks this adapter for the packet's chat slice and
// appends it to its additional_context. Every path fails open: an unset
// variable, a missing packet or any core error yields an empty string.

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function loadCore() {
  return require('../lib/goal-core.cjs');
}

/**
 * Render the bound packet's chat slice for a Vibe session start.
 *
 * @param {Object} [options] - Environment, workspace and goal core.
 * @param {NodeJS.ProcessEnv} [options.env] - Environment holding VIBE_SPEC_FOLDER, or the
 *   SESSION_HANDOVER_GOAL_PACKET a handover claim exported when that is unset.
 * @param {string} [options.workspace] - Checkout the packet path resolves against.
 * @param {Object} [options.core] - Goal core, replaced in tests.
 * @returns {string} The slice, or '' when no packet is bound or it cannot be read.
 */
export function renderVibeGoalSlice({ env = process.env, workspace = process.cwd(), core } = {}) {
  try {
    const named = (value) => (typeof value === 'string' && value.trim() ? value : '');
    const packetPath = named(env?.VIBE_SPEC_FOLDER) || named(env?.SESSION_HANDOVER_GOAL_PACKET);
    if (!packetPath) return '';

    const goalCore = core ?? loadCore();
    const packet = goalCore.describePacketGoal(packetPath, { workspace });
    return typeof packet?.chatSlice === 'string' && packet.chatSlice ? packet.chatSlice : '';
  } catch {
    return '';
  }
}
