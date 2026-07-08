// ───────────────────────────────────────────────────────────────────
// MODULE: Command-Bridge → Live-Command Resolution Guard (023 WU5)
// ───────────────────────────────────────────────────────────────────
//
// Every slash-command id cited by an advisor command bridge must resolve to a
// real command file under `.opencode/commands/`. A dead id (e.g. a retired
// `/deep:start-*-loop`) means a user typing the real command routes only by
// natural-language luck, and a bridge that points at nothing silently rots.
// This guard covers the two hand-authored bridge surfaces the 023 remediation
// named — `BASE_ALIAS_GROUPS` (aliases.ts) and the inline `COMMAND_BRIDGES`
// (projection.ts). The registry-emitted GENERATED_DEEP_ALIAS_GROUPS block is
// hash-guarded separately by routing-registry-drift-guard.

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';
import { BASE_ALIAS_GROUPS } from '../lib/scorer/aliases.js';
import { COMMAND_BRIDGES } from '../lib/scorer/projection.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const commandsRoot = resolve(repoRoot, '.opencode/commands');

// A slash id is `/<namespace>:<name>`; it maps to
// `.opencode/commands/<namespace>/<name>.md`.
const SLASH_ID = /^\/([a-z0-9-]+):([a-z0-9-]+)$/;
const DEAD_ID = /start-[a-z-]+-loop/;

function collectSlashIds(): { id: string; source: string }[] {
  const out: { id: string; source: string }[] = [];
  for (const [group, aliases] of Object.entries(BASE_ALIAS_GROUPS)) {
    for (const alias of aliases) {
      if (alias.startsWith('/')) out.push({ id: alias, source: `BASE_ALIAS_GROUPS[${group}]` });
    }
  }
  for (const bridge of COMMAND_BRIDGES) {
    for (const token of [...bridge.keywords, ...bridge.intentSignals]) {
      if (token.startsWith('/')) out.push({ id: token, source: `COMMAND_BRIDGES[${bridge.id}]` });
    }
  }
  return out;
}

function commandFileForSlashId(id: string): string | null {
  const match = SLASH_ID.exec(id);
  if (!match) return null;
  return join(commandsRoot, match[1], `${match[2]}.md`);
}

describe('command-bridge → live-command resolution guard', () => {
  const slashIds = collectSlashIds();

  it('cites at least the known bridge command ids', () => {
    expect(slashIds.length).toBeGreaterThan(0);
  });

  it('every bridge slash id is well-formed /<namespace>:<name>', () => {
    const malformed = slashIds.filter(({ id }) => !SLASH_ID.test(id));
    expect(malformed, `malformed bridge ids: ${JSON.stringify(malformed)}`).toEqual([]);
  });

  it('every bridge slash id resolves to a file under .opencode/commands/', () => {
    const unresolved = slashIds.filter(({ id }) => {
      const file = commandFileForSlashId(id);
      return file === null || !existsSync(file);
    });
    expect(
      unresolved,
      `bridge ids with no live command file: ${JSON.stringify(unresolved)}`,
    ).toEqual([]);
  });

  it('carries no retired /deep:start-*-loop dead ids', () => {
    const dead = slashIds.filter(({ id }) => DEAD_ID.test(id));
    expect(dead, `retired dead ids still bridged: ${JSON.stringify(dead)}`).toEqual([]);
  });
});
