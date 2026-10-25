// ───────────────────────────────────────────────────────────────────
// MODULE: Command Bridges Shadow Drift Guard
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';

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
const SKILLS_ROOT = join(REPO_ROOT, '.skilled', 'skills');
const DOCTOR_DIR = join(REPO_ROOT, '.skilled', 'commands', 'doctor');
const DOCTOR_PREFIX = 'command-doctor-';
const DOCTOR_MCP_COMMAND = '/doctor:mcp';
const COMMAND_BRIDGES_DIR = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'runtime',
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
    const source = `.skilled/skills/${skillId}/command-metadata.json`;
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

function doctorProjection(): CommandBridgeEntry[] {
  const source = '.skilled/commands/doctor/_routes.yaml';
  const manifest = parseYaml(readFileSync(join(DOCTOR_DIR, '_routes.yaml'), 'utf8')) as {
    readonly routes: readonly { readonly command: string; readonly target: string }[];
    readonly standalone?: readonly { readonly command?: string }[];
    readonly mcp_subroutes?: readonly { readonly sub_action: string }[];
  };
  const doctorName = (command: string): string => {
    const match = /^\/doctor:([a-z0-9-]+)$/.exec(command);
    if (!match) throw new Error(`Unrecognized doctor command in ${source}: ${command}`);
    return match[1] as string;
  };
  const routeCounts = new Map<string, number>();
  for (const route of manifest.routes) {
    const commandName = doctorName(route.command);
    routeCounts.set(commandName, (routeCounts.get(commandName) ?? 0) + 1);
  }
  const skillAgent = (commandName: string): string => {
    const router = readFileSync(join(DOCTOR_DIR, `${commandName}.md`), 'utf8');
    const tag = /<!--\s*skill_agent:\s*([a-z0-9-]+)\s*-->/.exec(router);
    if (!tag) throw new Error(`No skill_agent tag in ${commandName}.md`);
    return tag[1] as string;
  };

  const entries = manifest.routes.map((route) => {
    const commandName = doctorName(route.command);
    const skillId = skillAgent(commandName);
    return {
      // A command with several targets needs one bridge per target; a
      // single-target command takes the command's own id.
      id: (routeCounts.get(commandName) ?? 0) > 1
        ? `${DOCTOR_PREFIX}${commandName}-${route.target}`
        : `${DOCTOR_PREFIX}${commandName}`,
      command: route.command,
      skillId,
      ownerMode: skillId,
      source,
    };
  });

  for (const item of manifest.standalone ?? []) {
    if (typeof item.command !== 'string') continue;
    const commandName = doctorName(item.command);
    const skillId = skillAgent(commandName);
    entries.push({
      id: `${DOCTOR_PREFIX}${commandName}`,
      command: item.command,
      skillId,
      ownerMode: skillId,
      source,
    });
  }

  const mcpCommandName = doctorName(DOCTOR_MCP_COMMAND);
  for (const item of manifest.mcp_subroutes ?? []) {
    const skillId = skillAgent(mcpCommandName);
    entries.push({
      id: `${DOCTOR_PREFIX}${mcpCommandName}-${item.sub_action}`,
      command: DOCTOR_MCP_COMMAND,
      skillId,
      ownerMode: skillId,
      source,
    });
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
  it('generated projection exactly equals JSON-derived ids union the residual allow-list and the doctor routes', () => {
    const generated = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as CommandBridgeDump;
    const allowList = JSON.parse(readFileSync(ALLOW_LIST_PATH, 'utf8')) as readonly AllowListEntry[];
    const expected = sorted([
      ...metadataProjection(),
      ...allowList.map(({ reason: _reason, ...entry }) => ({
        ...entry,
        source: 'scripts/command-bridges/allow-list.json',
      })),
      ...doctorProjection(),
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
    // The doctor bridges are generated from the doctor route manifest and have no
    // hand-authored counterpart, so the frozen hand-authored snapshot is compared
    // against the other bridges only.
    const typescriptActive = GENERATED_COMMAND_BRIDGES.filter(
      (entry) => entry.routingEnabled !== false && !entry.id.startsWith(DOCTOR_PREFIX),
    ).map(({ inventoryId: _inventoryId, routingEnabled: _routingEnabled, ...entry }) => entry);
    const handAuthored = HAND_AUTHORED_COMMAND_BRIDGES.map(
      ({ inventoryId: _inventoryId, routingEnabled: _routingEnabled, ...entry }) => entry,
    );

    expect(typescriptInventoryIds).toEqual(inventoryIds);
    expect(typescriptActive).toEqual(handAuthored);
    expect(
      generated.entries.filter(
        (entry) => !entry.id.startsWith(DOCTOR_PREFIX) && entry.runtime?.typescript.enabled,
      ),
    ).toHaveLength(5);
    expect(
      generated.entries.filter(
        (entry) => !entry.id.startsWith(DOCTOR_PREFIX) && entry.runtime?.python.enabled,
      ),
    ).toHaveLength(15);
    // Derived, not literal. This was a hardcoded total and went stale twice: once
    // when a hub deprecation removed commands, once when new ones were added. The
    // export may alias either the active subset or the whole inventory, so accept
    // either, but measure both from the generated file rather than a magic number.
    const typescriptActiveAll = GENERATED_COMMAND_BRIDGES.filter(
      (entry) => entry.routingEnabled !== false,
    ).length;
    expect([typescriptActiveAll, inventoryIds.length]).toContain(COMMAND_BRIDGES.length);
  });

  it('preserves the Python bridge records, order, and owner normalization byte-for-byte', () => {
    const probe = [
      'import json, runpy, sys',
      'module = runpy.run_path(sys.argv[1])',
      'metadata = {"inventory_id", "command", "skill_id", "owner_mode", "routing_enabled"}',
      'def cleaned(records):',
      '    return [[key, {k: v for k, v in value.items() if k not in metadata}]',
      '            for key, value in records.items() if value.get("routing_enabled", True)',
      '            and not key.startswith("command-doctor-")]',
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

  it('derives bridges from real skill folders only, never a local-* folder or a linked one', () => {
    const { metadataEntries } = createRequire(import.meta.url)(
      join(COMMAND_BRIDGES_DIR, 'derive-command-bridges.cjs'),
    ) as { metadataEntries: (skillsRoot: string) => Array<{ skillId: string }> };
    const root = mkdtempSync(join(tmpdir(), 'command-bridges-'));
    try {
      const skills = join(root, 'skills');
      const writeMetadata = (folder: string, command: string): void => {
        mkdirSync(join(skills, folder), { recursive: true });
        writeFileSync(
          join(skills, folder, 'command-metadata.json'),
          JSON.stringify([{ command, ownerMode: folder }]),
          'utf8',
        );
      };
      writeMetadata('alpha', '/alpha:run');
      writeMetadata('local-private', '/private:run');
      mkdirSync(join(root, 'elsewhere'), { recursive: true });
      writeFileSync(
        join(root, 'elsewhere', 'command-metadata.json'),
        JSON.stringify([{ command: '/linked:run', ownerMode: 'linked' }]),
        'utf8',
      );
      symlinkSync(join(root, 'elsewhere'), join(skills, 'linked'));

      expect(metadataEntries(skills).map((entry) => entry.skillId)).toEqual(['alpha']);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
