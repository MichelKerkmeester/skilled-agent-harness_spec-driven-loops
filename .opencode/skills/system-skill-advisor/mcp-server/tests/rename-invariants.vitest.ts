// ───────────────────────────────────────────────────────────────
// MODULE: Rename Invariant Tests
// ───────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), 'utf8');
}

describe('system_skill_advisor rename invariants', () => {
  it('registers the MCP server under the system identity, not the old prefix', () => {
    const serverSource = readRepoFile('.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts');

    expect(serverSource).toMatch(/new Server\(\s*\{\s*name:\s*'system_skill_advisor'/s);
    expect(serverSource).not.toContain("name: 'mk_skill_advisor'");
  });

  it('names the launcher binary and state command under the system identity', () => {
    const launcherSource = readRepoFile('.opencode/bin/system-skill-advisor-launcher.cjs');

    expect(launcherSource).toContain(".system-skill-advisor-launcher.json");
    expect(launcherSource).toContain("command: 'system-skill-advisor-launcher'");
    expect(launcherSource).not.toContain(".mk-skill-advisor-launcher.json");
    expect(launcherSource).not.toContain("command: 'mk-skill-advisor-launcher'");
  });

  it('keeps all runtime configs aligned on system_skill_advisor and the system launcher path', () => {
    const opencodeConfig = JSON.parse(readRepoFile('opencode.json')) as {
      mcp?: Record<string, { command?: string[] }>;
    };
    const claudeConfig = JSON.parse(readRepoFile('.claude/mcp.json')) as {
      mcpServers?: Record<string, { args?: string[] }>;
    };
    expect(Object.keys(opencodeConfig.mcp ?? {})).toContain('system_skill_advisor');
    expect(opencodeConfig.mcp?.system_skill_advisor.command).toContain('.opencode/bin/system-skill-advisor-launcher.cjs');

    expect(Object.keys(claudeConfig.mcpServers ?? {})).toContain('system_skill_advisor');
    expect(claudeConfig.mcpServers?.system_skill_advisor.args).toContain('.opencode/bin/system-skill-advisor-launcher.cjs');
  });

  it('keeps runtime config env blocks aligned on advisor database and hook controls', () => {
    const configs = [
      readRepoFile('opencode.json'),
      readRepoFile('.claude/mcp.json'),
    ];

    for (const config of configs) {
      expect(config).toContain('SYSTEM_SKILL_ADVISOR_DB_DIR');
      expect(config).toContain('SYSTEM_SKILL_ADVISOR_HOOK_DISABLED');
    }
  });
});
