// ───────────────────────────────────────────────────────────────
// MODULE: Command-binding existence gate
// ───────────────────────────────────────────────────────────────
// Every command id a hub declares (mode-registry `command` fields, and any hub-level
// command-metadata.json) must resolve to a real command file under .opencode/commands/**,
// or be in an explicit allowlist with a reason. Today these bindings are honor-system in
// every direction — the checker never reads them — so a rename or a typo leaves a dead
// binding that passes every gate (e.g. /doc:quality binds create-quality-control but no
// .opencode/commands/doc/ exists). This test makes the binding real.
//
// SCOPE: declared registry + command-metadata bindings (gate-free). The advisor scorer's
// own dead command ids (/deep:start-*-loop, etc.) live in the operator-gated scorer track
// and are retired inside the 193-row re-baseline (see the WU11 sequencing PREP); extending
// this scan to the scorer lands with that cleanup, to avoid a large allowlist of gated ids.

import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function repoRoot(): string {
  let dir = process.cwd();
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    dir = dirname(dir);
  }
  throw new Error('repo root not found from ' + process.cwd());
}
const R = repoRoot();

// A declared command id resolves when .opencode/commands/<namespace>/<name>.md exists.
function commandResolves(id: string): boolean {
  const m = id.match(/^\/([a-z][a-z0-9-]*):([a-z0-9-]+)$/);
  if (!m) return false;
  return existsSync(join(R, '.opencode', 'commands', m[1], `${m[2]}.md`));
}

// Genuinely-dead bindings that are tracked, not resolvable today. Each MUST carry a reason.
const ALLOWLIST: Record<string, string> = {
  '/doc:quality':
    'create-quality-control binds /doc:quality but .opencode/commands/doc/ is unbuilt — ' +
    'authoring the doc:quality command set is a tracked follow-up (fix over ratchet, deferred).',
};

const HUBS = ['sk-code', 'sk-design', 'sk-doc', 'deep-loop-workflows'] as const;

function declaredCommandIds(): Array<{ id: string; source: string }> {
  const out: Array<{ id: string; source: string }> = [];
  for (const hub of HUBS) {
    const reg = JSON.parse(readFileSync(join(R, '.opencode', 'skills', hub, 'mode-registry.json'), 'utf8'));
    for (const mode of reg.modes ?? []) {
      if (typeof mode.command === 'string') out.push({ id: mode.command, source: `${hub} registry` });
    }
    // Optional hub-level command-metadata.json (advisor-facing per-command projection).
    const cmPath = join(R, '.opencode', 'skills', hub, 'command-metadata.json');
    if (existsSync(cmPath)) {
      const cm = JSON.parse(readFileSync(cmPath, 'utf8'));
      const entries = Array.isArray(cm) ? cm : Object.values(cm);
      for (const e of entries) {
        if (e && typeof e === 'object' && typeof (e as { command?: unknown }).command === 'string') {
          out.push({ id: (e as { command: string }).command, source: `${hub} command-metadata` });
        }
      }
    }
  }
  return out;
}

describe('command-binding existence', () => {
  it('every declared hub command binding resolves to a real command file or is allowlisted', () => {
    const unresolved: string[] = [];
    for (const { id, source } of declaredCommandIds()) {
      if (commandResolves(id)) continue;
      if (id in ALLOWLIST) continue;
      unresolved.push(`${id} (${source})`);
    }
    expect(unresolved, `dead command bindings with no allowlist entry:\n  ${unresolved.join('\n  ')}`).toEqual([]);
  });

  it('every allowlist entry is still actually dead (no stale quarantine) and carries a reason', () => {
    for (const [id, reason] of Object.entries(ALLOWLIST)) {
      expect(reason.length, `${id} allowlist entry needs a reason`).toBeGreaterThan(10);
      // If an allowlisted id starts resolving, remove it from the allowlist — this reds to force that.
      expect(commandResolves(id), `${id} now resolves — remove it from the allowlist`).toBe(false);
    }
  });

  it('sanity: the command namespaces the gate resolves against exist', () => {
    const namespaces = new Set(readdirSync(join(R, '.opencode', 'commands'), { withFileTypes: true })
      .filter((e) => e.isDirectory()).map((e) => e.name));
    for (const ns of ['create', 'deep', 'design']) expect(namespaces.has(ns)).toBe(true);
  });
});
