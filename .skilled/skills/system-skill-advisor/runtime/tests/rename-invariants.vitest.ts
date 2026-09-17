// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Decommission Invariants
// ───────────────────────────────────────────────────────────────
// Guards the advisor's post-decommission identity: no runtime config may
// re-declare it as an MCP server, the launcher owns the repo policy defaults
// the removed env blocks used to carry, and the package directory is runtime/.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), 'utf8');
}

function mcpServerNames(relativePath: string, mcpKey: string): string[] {
  const parsed = JSON.parse(readRepoFile(relativePath)) as Record<string, Record<string, unknown> | undefined>;
  return Object.keys(parsed[mcpKey] ?? {});
}

describe('system_skill_advisor decommission invariants', () => {
  it('names the launcher binary and state command under the system identity', () => {
    const launcherSource = readRepoFile('.opencode/bin/system-skill-advisor-launcher.cjs');

    expect(launcherSource).toContain('.system-skill-advisor-launcher.json');
    expect(launcherSource).toContain("command: 'system-skill-advisor-launcher'");
    expect(launcherSource).not.toContain('.mk-skill-advisor-launcher.json');
    expect(launcherSource).not.toContain("command: 'mk-skill-advisor-launcher'");
  });

  it('declares no skill advisor MCP server in any runtime config', () => {
    const jsonRoots: ReadonlyArray<readonly [string, string]> = [
      ['opencode.json', 'mcp'],
      ['.claude/mcp.json', 'mcpServers'],
      ['.cursor/mcp.json', 'mcpServers'],
      ['.pi/mcp.json', 'mcpServers'],
    ];

    for (const [file, mcpKey] of jsonRoots) {
      const servers = mcpServerNames(file, mcpKey);
      expect(servers, file).not.toContain('system_skill_advisor');
      expect(servers, file).not.toContain('mk_skill_advisor');
    }

    const codexConfig = readRepoFile('.codex/config.toml');
    expect(codexConfig).not.toContain('[mcp_servers.system_skill_advisor]');
    expect(codexConfig).not.toContain('system-skill-advisor-launcher.cjs');
  });

  it('applies the repo env defaults when the environment is silent, and an explicit value still wins', () => {
    const launcherPath = resolve(repoRoot, '.opencode/bin/system-skill-advisor-launcher.cjs');

    const probe = (overrides: Record<string, string>): Record<string, string | null> => {
      const script = `require(${JSON.stringify(launcherPath)});`
        + ' console.log(JSON.stringify({'
        + ' doc: process.env.SPECKIT_ADVISOR_DOC_TRIGGERS ?? null,'
        + ' trust: process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT ?? null'
        + ' }))';
      const result = spawnSync(process.execPath, ['-e', script], {
        cwd: repoRoot,
        encoding: 'utf8',
        env: { PATH: process.env.PATH, HOME: process.env.HOME, ...overrides },
      });
      expect(result.status, result.stderr).toBe(0);
      return JSON.parse(result.stdout.trim()) as Record<string, string | null>;
    };

    expect(probe({})).toEqual({ doc: 'true', trust: 'trusted' });
    expect(probe({
      SPECKIT_ADVISOR_DOC_TRIGGERS: 'false',
      SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'untrusted',
    })).toEqual({ doc: 'false', trust: 'untrusted' });
  });

  it('keeps the advisor package directory named runtime/', () => {
    const advisorRoot = resolve(repoRoot, '.opencode/skills/system-skill-advisor');

    expect(existsSync(resolve(advisorRoot, 'runtime'))).toBe(true);
    expect(existsSync(resolve(advisorRoot, 'mcp-server'))).toBe(false);
  });
});
