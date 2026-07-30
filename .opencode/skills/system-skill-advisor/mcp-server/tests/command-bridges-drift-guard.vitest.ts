// ───────────────────────────────────────────────────────────────────
// MODULE: Command Bridges Shadow Drift Guard
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  COMMAND_BRIDGES,
  GENERATED_COMMAND_BRIDGES,
  HAND_AUTHORED_COMMAND_BRIDGES,
} from '../lib/scorer/projection.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

interface CommandBridgeEntry {
  readonly id: string;
  readonly command: string;
  readonly skillId: string;
  readonly ownerMode: string;
  readonly source: string;
  readonly runtime?: {
    readonly typescript: { readonly enabled: boolean };
    readonly python: { readonly enabled: boolean };
  };
}

interface CommandBridgeDump {
  readonly count: number;
  readonly entries: readonly CommandBridgeEntry[];
}

interface AllowListEntry extends Omit<CommandBridgeEntry, 'source'> {
  readonly reason: string;
}

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

function inventoryEntry(entry: CommandBridgeEntry): CommandBridgeEntry {
  const { runtime: _runtime, ...inventory } = entry;
  return inventory;
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
    const generatedInventory = generated.entries.map(inventoryEntry);
    const generatedIds = new Set(generatedInventory.map((entry) => entry.id));
    const missing = [...expectedIds].filter((id) => !generatedIds.has(id)).sort();
    const extra = [...generatedIds].filter((id) => !expectedIds.has(id)).sort();

    expect({ missing, extra }, `NAMING missing=${missing.join(',')} extra=${extra.join(',')}`).toEqual({
      missing: [],
      extra: [],
    });
    expect(sorted(generatedInventory)).toEqual(expected);
  });

  it('generates all inventory ids for both runtimes while scoring only the compatibility snapshots', () => {
    const generated = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as CommandBridgeDump;
    const inventoryIds = generated.entries.map((entry) => entry.id).sort();
    const typescriptInventoryIds = GENERATED_COMMAND_BRIDGES
      .map((entry) => entry.inventoryId ?? entry.id)
      .sort();
    const typescriptActive = GENERATED_COMMAND_BRIDGES.filter(
      (entry) => entry.routingEnabled !== false,
    ).map(({ inventoryId: _inventoryId, routingEnabled: _routingEnabled, ...entry }) => entry);
    const handAuthored = HAND_AUTHORED_COMMAND_BRIDGES.map(
      ({ inventoryId: _inventoryId, routingEnabled: _routingEnabled, ...entry }) => entry,
    );

    expect(typescriptInventoryIds).toEqual(inventoryIds);
    expect(typescriptActive).toEqual(handAuthored);
    expect(generated.entries.filter((entry) => entry.runtime?.typescript.enabled)).toHaveLength(6);
    expect(generated.entries.filter((entry) => entry.runtime?.python.enabled)).toHaveLength(16);
    expect([6, 30]).toContain(COMMAND_BRIDGES.length);
  });

  it('preserves the Python bridge records, order, and owner normalization byte-for-byte', () => {
    const probe = [
      'import json, runpy, sys',
      'module = runpy.run_path(sys.argv[1])',
      'metadata = {"inventory_id", "command", "skill_id", "owner_mode", "routing_enabled"}',
      'def cleaned(records):',
      '    return [[key, {k: v for k, v in value.items() if k not in metadata}]',
      '            for key, value in records.items() if value.get("routing_enabled", True)]',
      'print(json.dumps({',
      '    "hand": cleaned(module["HAND_AUTHORED_COMMAND_BRIDGES"]),',
      '    "generated": cleaned(module["GENERATED_COMMAND_BRIDGES"]),',
      '    "handOwners": module["HAND_AUTHORED_COMMAND_BRIDGE_OWNER_NORMALIZATION"],',
      '    "generatedOwners": module["GENERATED_COMMAND_BRIDGE_OWNER_NORMALIZATION"],',
      '}))',
    ].join('\n');
    const output = execFileSync('python3', ['-c', probe, ADVISOR_SCRIPT], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const runtime = JSON.parse(output) as {
      readonly hand: unknown;
      readonly generated: unknown;
      readonly handOwners: unknown;
      readonly generatedOwners: unknown;
    };

    expect(runtime.generated).toEqual(runtime.hand);
    expect(runtime.generatedOwners).toEqual(runtime.handOwners);
  });

  it('live Python bridges match the generated projection exactly', () => {
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

    // The live runtime consumes the generated projection, so any divergence —
    // a missing id, an extra id, or a field mismatch — is real drift.
    expect(actualDiff).toEqual([]);
  });
});
