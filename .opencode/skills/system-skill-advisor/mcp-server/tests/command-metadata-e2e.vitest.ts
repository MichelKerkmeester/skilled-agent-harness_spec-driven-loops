// ───────────────────────────────────────────────────────────────────
// MODULE: Command Metadata Dense End-to-End Guard
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

interface CommandMetadataEntry {
  readonly command: string;
  readonly ownerMode: string;
}

interface GeneratedEntry extends CommandMetadataEntry {
  readonly id: string;
  readonly skillId: string;
  readonly source: string;
}

interface LeafAlias {
  readonly workflowMode: string;
  readonly leafResourceId: string;
  readonly diskPath: string;
}

const REPO_ROOT = findAdvisorWorkspaceRoot(import.meta.dirname);
const SKILLS_ROOT = join(REPO_ROOT, '.opencode', 'skills');
const GENERATED_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'mcp-server',
  'scripts',
  'command-bridges',
  'command-bridges.generated.json',
);

function commandPath(command: string): string {
  const match = command.match(/^\/([a-z][a-z0-9-]*):([a-z0-9-]+)$/);
  if (!match) throw new Error(`invalid command id ${command}`);
  return join(REPO_ROOT, '.opencode', 'commands', match[1], `${match[2]}.md`);
}

describe('command metadata dense e2e', () => {
  it('projects every command metadata entry to its declared hub and owner mode', () => {
    const projection = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as {
      readonly entries: readonly GeneratedEntry[];
    };
    const generatedByCommand = new Map(projection.entries.map((entry) => [entry.command, entry] as const));
    let metadataCount = 0;

    for (const skillId of readdirSync(SKILLS_ROOT).sort()) {
      const metadataPath = join(SKILLS_ROOT, skillId, 'command-metadata.json');
      if (!existsSync(metadataPath)) continue;
      const metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as readonly CommandMetadataEntry[];
      for (const declared of metadata) {
        metadataCount += 1;
        const generated = generatedByCommand.get(declared.command);
        expect(generated, `${declared.command} missing from generated projection`).toBeDefined();
        expect(generated?.skillId, `${declared.command} owning hub drift`).toBe(skillId);
        expect(generated?.ownerMode, `${declared.command} ownerMode drift`).toBe(declared.ownerMode);
        expect(existsSync(commandPath(declared.command)), `${declared.command} command file missing`).toBe(true);
      }
    }

    expect(metadataCount).toBe(22);
  });

  it('resolves every hub and standalone leaf alias diskPath', () => {
    let aliasCount = 0;
    for (const skillId of readdirSync(SKILLS_ROOT).sort()) {
      const aliasesPath = join(SKILLS_ROOT, skillId, 'leaf-aliases.json');
      if (!existsSync(aliasesPath)) continue;
      const aliases = JSON.parse(readFileSync(aliasesPath, 'utf8')) as readonly LeafAlias[];
      for (const alias of aliases) {
        aliasCount += 1;
        const diskPath = join(SKILLS_ROOT, skillId, alias.diskPath);
        expect(
          existsSync(diskPath),
          `${skillId}:${alias.workflowMode}:${alias.leafResourceId} -> ${alias.diskPath} missing`,
        ).toBe(true);
      }
    }

    expect(aliasCount, 'leaf alias inventory unexpectedly empty').toBeGreaterThan(0);
  });
});
