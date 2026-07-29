// ───────────────────────────────────────────────────────────────────
// MODULE: Command Bridges Shadow Drift Guard
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

interface CommandBridgeEntry {
  readonly id: string;
  readonly command: string;
  readonly skillId: string;
  readonly ownerMode: string;
  readonly source: string;
}

interface CommandBridgeDump {
  readonly count: number;
  readonly entries: readonly CommandBridgeEntry[];
}

interface AllowListEntry extends Omit<CommandBridgeEntry, 'source'> {
  readonly reason: string;
}

const KNOWN_PYTHON_SHADOW_DIFF_IDS = [
  'command-create-benchmark',
  'command-create-command',
  'command-create-diff',
  'command-create-flowchart',
  'command-create-skill-parent',
  'command-deep-ai-council',
  'command-deep-alignment',
  'command-deep-command-benchmark',
  'command-deep-model-benchmark',
  'command-deep-research',
  'command-deep-review',
  'command-deep-skill-benchmark',
  'command-interface-design',
  'command-interface-design-reference',
  'command-prompt-improve',
  'command-spec-kit-deep-research',
  'command-spec-kit-deep-review',
  'memory:save',
] as const;

const REPO_ROOT = findAdvisorWorkspaceRoot(import.meta.dirname);
const SKILLS_ROOT = join(REPO_ROOT, '.opencode', 'skills');
const COMMAND_BRIDGES_DIR = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'mcp-server',
  'scripts',
  'command-bridges',
);
const GENERATED_PATH = join(COMMAND_BRIDGES_DIR, 'command-bridges.generated.json');
const ALLOW_LIST_PATH = join(COMMAND_BRIDGES_DIR, 'allow-list.json');
const ADVISOR_SCRIPT = join(COMMAND_BRIDGES_DIR, '..', 'skill_advisor.py');

function bridgeId(command: string): string {
  return `command-${command.slice(1).replace(':', '-')}`;
}

function metadataProjection(): CommandBridgeEntry[] {
  const entries: CommandBridgeEntry[] = [];
  for (const skillId of readdirSync(SKILLS_ROOT).sort()) {
    const metadataPath = join(SKILLS_ROOT, skillId, 'command-metadata.json');
    if (!existsSync(metadataPath)) continue;
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as Array<{
      readonly command: string;
      readonly ownerMode: string;
    }>;
    const source = `.opencode/skills/${skillId}/command-metadata.json`;
    for (const entry of metadata) {
      entries.push({
        id: bridgeId(entry.command),
        command: entry.command,
        skillId,
        ownerMode: entry.ownerMode,
        source,
      });
    }
  }
  return entries;
}

function sorted(entries: readonly CommandBridgeEntry[]): CommandBridgeEntry[] {
  return [...entries].sort((left, right) => left.id.localeCompare(right.id));
}

describe('command-bridges drift guard', () => {
  it('generated projection exactly equals JSON-derived ids union the residual allow-list', () => {
    const generated = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as CommandBridgeDump;
    const allowList = JSON.parse(readFileSync(ALLOW_LIST_PATH, 'utf8')) as readonly AllowListEntry[];
    const expected = sorted([
      ...metadataProjection(),
      ...allowList.map(({ reason: _reason, ...entry }) => ({
        ...entry,
        source: 'scripts/command-bridges/allow-list.json',
      })),
    ]);
    const expectedIds = new Set(expected.map((entry) => entry.id));
    const generatedIds = new Set(generated.entries.map((entry) => entry.id));
    const missing = [...expectedIds].filter((id) => !generatedIds.has(id)).sort();
    const extra = [...generatedIds].filter((id) => !expectedIds.has(id)).sort();

    expect({ missing, extra }, `NAMING missing=${missing.join(',')} extra=${extra.join(',')}`).toEqual({
      missing: [],
      extra: [],
    });
    expect(sorted(generated.entries)).toEqual(expected);
  });

  it('live Python differences stay pinned to the explicit shadow expectation', () => {
    const generated = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as CommandBridgeDump;
    const stdout = execFileSync('python3', [ADVISOR_SCRIPT, '--dump-command-bridges'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const live = JSON.parse(stdout) as CommandBridgeDump;
    const generatedById = new Map(generated.entries.map((entry) => [entry.id, entry] as const));
    const liveById = new Map(live.entries.map((entry) => [entry.id, entry] as const));
    const allIds = new Set([...generatedById.keys(), ...liveById.keys()]);
    const actualDiff = [...allIds].filter((id) => {
      const generatedEntry = generatedById.get(id);
      const liveEntry = liveById.get(id);
      if (!generatedEntry || !liveEntry) return true;
      return ['command', 'skillId', 'ownerMode'].some(
        (field) => generatedEntry[field as keyof CommandBridgeEntry] !== liveEntry[field as keyof CommandBridgeEntry],
      );
    }).sort();

    expect(actualDiff).toEqual([...KNOWN_PYTHON_SHADOW_DIFF_IDS].sort());
  });
});
