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

describe('mk_skill_advisor rename invariants', () => {
  it('keeps the MCP server registration identity mk-prefixed', () => {
    const serverSource = readRepoFile('.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts');

    expect(serverSource).toMatch(/new Server\(\s*\{\s*name:\s*'mk_skill_advisor'/s);
    expect(serverSource).not.toContain("name: 'system_skill_advisor'");
  });

  it('keeps the launcher binary and state command identity mk-prefixed', () => {
    const launcherSource = readRepoFile('.opencode/bin/mk-skill-advisor-launcher.cjs');

    expect(launcherSource).toContain(".mk-skill-advisor-launcher.json");
    expect(launcherSource).toContain("command: 'mk-skill-advisor-launcher'");
    expect(launcherSource).not.toContain(".skill-advisor-launcher.json");
    expect(launcherSource).not.toContain("command: 'skill-advisor-launcher'");
  });

  it('keeps all runtime configs aligned on mk_skill_advisor and the mk launcher path', () => {
    const opencodeConfig = JSON.parse(readRepoFile('opencode.json')) as {
      mcp?: Record<string, { command?: string[] }>;
    };
    const claudeConfig = JSON.parse(readRepoFile('.claude/mcp.json')) as {
      mcpServers?: Record<string, { args?: string[] }>;
    };
    const codexConfig = readRepoFile('.codex/config.toml');

    expect(Object.keys(opencodeConfig.mcp ?? {})).toContain('mk_skill_advisor');
    expect(opencodeConfig.mcp?.mk_skill_advisor.command).toContain('.opencode/bin/mk-skill-advisor-launcher.cjs');

    expect(Object.keys(claudeConfig.mcpServers ?? {})).toContain('mk_skill_advisor');
    expect(claudeConfig.mcpServers?.mk_skill_advisor.args).toContain('.opencode/bin/mk-skill-advisor-launcher.cjs');

    expect(codexConfig).toMatch(/\[mcp_servers\.mk_skill_advisor\]/);
    expect(codexConfig).toContain('args = [".opencode/bin/mk-skill-advisor-launcher.cjs"]');
  });

  it('keeps runtime config env blocks aligned on advisor database and hook controls', () => {
    const configs = [
      readRepoFile('opencode.json'),
      readRepoFile('.claude/mcp.json'),
      readRepoFile('.codex/config.toml'),
    ];

    for (const config of configs) {
      expect(config).toContain('MK_SKILL_ADVISOR_DB_DIR');
      expect(config).toContain('MK_SKILL_ADVISOR_HOOK_DISABLED');
    }
  });
});
