// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Graph Health Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const compilerPath = resolve(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py',
);
const advisorPath = resolve(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py',
);

describe('advisor graph health', () => {
  it('validates graph metadata without orphan skills', () => {
    const result = spawnSync('python3', [compilerPath, '--validate-only'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).not.toContain('ZERO-EDGE WARNINGS');
    expect(result.stdout).toContain('VALIDATION PASSED');
  });

  it('keeps health ok when skill-advisor is the only graph-only node', () => {
    const result = spawnSync('python3', [advisorPath, '--health'], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      },
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    const jsonStart = result.stdout.indexOf('{');
    expect(jsonStart).toBeGreaterThanOrEqual(0);
    const payload = JSON.parse(result.stdout.slice(jsonStart)) as {
      status: string;
      inventory_parity: {
        in_sync: boolean;
        missing_in_discovery: string[];
        missing_in_graph: string[];
        graph_only?: string[];
        graphless_inline?: string[];
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.inventory_parity.in_sync).toBe(true);
    expect(payload.inventory_parity.missing_in_discovery).toEqual([]);
    expect(payload.inventory_parity.missing_in_graph).toEqual([]);
    expect(payload.inventory_parity.graph_only).toEqual([]);
    expect(payload.inventory_parity.graphless_inline).toEqual(['create:agent', 'create:manual-testing-playbook', 'memory:save']);
  });
});
