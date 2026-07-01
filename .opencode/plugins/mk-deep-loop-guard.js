// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-deep-loop-guard OpenCode Plugin                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Detection-layer enforcement for Task-tool dispatches targeting  ║
// ║          deep-loop sub-agents -- flags/blocks a Deep Route header whose  ║
// ║          declared mode disagrees with mode-registry.json's entry for    ║
// ║          the actual subagent_type being dispatched.                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY_RELATIVE_PATH = '.opencode/skills/deep-loop-workflows/mode-registry.json';
const REJECT_MODE_ENV = 'MK_DEEP_LOOP_GUARD_REJECT';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function loadRegistryAgents(registryPath) {
  try {
    const raw = readFileSync(registryPath, 'utf8');
    const data = JSON.parse(raw);
    const map = new Map();
    for (const mode of data.modes || []) {
      if (mode.agent) map.set(mode.agent, mode);
    }
    return map;
  } catch (_) {
    return null;
  }
}

function declaredModeFromPrompt(promptText) {
  const match = /mode=([a-z0-9-]+)/i.exec(promptText || '');
  return match ? match[1] : null;
}

function mismatchDetail(subagentType, registryMode, declaredMode) {
  return [
    'mk-deep-loop-guard: Deep Route mode mismatch --',
    `dispatch targets subagent_type="${subagentType}"`,
    `(registry mode="${registryMode}")`,
    `but the prompt declares mode="${declaredMode}"`,
  ].join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-deep-loop-guard OpenCode plugin hooks.
 *
 * Hard limits (by design, not oversight):
 * - Cannot create hard runtime identity; that remains host/FIX-5 territory.
 * - Does not catch a schema-valid, route-matched artifact that internally
 *   does semantically wrong-mode work.
 * - Fails open on its own errors (missing/unreadable registry, unexpected
 *   arg shapes) so a bug here never blocks unrelated, correctly-routed work.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkDeepLoopGuardPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();
  const registryPath = join(projectDir, REGISTRY_RELATIVE_PATH);

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (!input || input.tool !== 'task') return;
        const args = output && output.args;
        if (!args || typeof args !== 'object') return;

        const subagentType = args.subagent_type || args.subagentType;
        if (!subagentType) return;

        const registry = loadRegistryAgents(registryPath);
        if (!registry) return;

        const entry = registry.get(subagentType);
        if (!entry) return;

        const declaredMode = declaredModeFromPrompt(args.prompt);
        if (!declaredMode || declaredMode === entry.workflowMode) return;

        const detail = mismatchDetail(subagentType, entry.workflowMode, declaredMode);

        if (process.env[REJECT_MODE_ENV] === '1') {
          throw new Error(detail);
        }
        console.error(`[mk-deep-loop-guard] WARN: ${detail}`);
      } catch (err) {
        if (err instanceof Error && err.message.startsWith('mk-deep-loop-guard:')) throw err;
        // Fail open on any unexpected internal error -- never block unrelated dispatches.
      }
    },
  };
}
