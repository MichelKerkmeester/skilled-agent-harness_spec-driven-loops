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

import { COMMAND_BRIDGES, GENERATED_COMMAND_BRIDGES } from '../lib/scorer/projection.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

interface CommandBridgeEntry {
  readonly id: string;
  readonly command: string;
  readonly skillId: string;
  readonly ownerMode: string;
  readonly description?: string;
  readonly ownedSignals?: readonly string[];
  readonly standalone?: boolean;
  readonly mutating?: string;
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

type Runtime = 'typescript' | 'python';

interface CompatibilityRow {
  readonly inventoryId: string;
  readonly order: number;
  readonly id: string;
  readonly description: string;
  readonly name?: string;
  readonly keywords?: readonly string[];
  readonly domains?: readonly string[];
  readonly intentSignals?: readonly string[];
  readonly slashMarkers?: readonly string[];
  readonly leadPhrases?: readonly string[];
  readonly readOnly?: boolean;
  readonly deprecated?: boolean;
  readonly owningSkill?: string;
}

interface CompatibilitySnapshot {
  readonly typescript: readonly CompatibilityRow[];
  readonly python: readonly CompatibilityRow[];
  readonly pythonOwnerNormalization: Readonly<Record<string, string>>;
}

// A standalone skill's command paired with the inventory row it enters under.
interface StandaloneCommand {
  readonly inventoryId: string;
  readonly inventorySkillId: string;
  readonly command: string;
  readonly description: string;
  readonly ownedSignals: readonly string[];
  readonly mutating: string;
  readonly recordSkillId: string;
}

interface TypescriptEvidence {
  readonly inventoryId: string;
  readonly ownerSkill: string;
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly domains: readonly string[];
  readonly intentSignals: readonly string[];
  readonly readOnly: boolean;
}

interface ProjectionRow {
  readonly id: string;
  readonly inventoryId?: string;
  readonly ownerSkill?: string;
  readonly name?: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly domains?: readonly string[];
  readonly intentSignals?: readonly string[];
  readonly readOnly?: boolean;
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
const COMPATIBILITY_PATH = join(COMMAND_BRIDGES_DIR, 'scoring-compatibility.json');
const ADVISOR_SCRIPT = join(COMMAND_BRIDGES_DIR, '..', 'skill_advisor.py');

function bridgeId(command: string): string {
  return `command-${command.slice(1).replace(':', '-')}`;
}

function metadataProjection(): CommandBridgeEntry[] {
  const entries: CommandBridgeEntry[] = [];
  for (const skillId of readdirSync(SKILLS_ROOT).sort()) {
    const metadataPath = join(SKILLS_ROOT, skillId, 'command-metadata.json');
    if (!existsSync(metadataPath)) continue;
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as ReadonlyArray<{
      readonly command: string;
      readonly ownerMode: string;
      readonly description?: string;
      readonly mutating?: string;
      readonly userIntent?: { readonly ownedSignals?: readonly string[] };
    }>;
    const source = `.skilled/skills/${skillId}/command-metadata.json`;
    // A skill with no mode registry has no hub to route its commands, so its
    // metadata is the whole declaration of what each command reaches.
    const standalone = !existsSync(join(SKILLS_ROOT, skillId, 'mode-registry.json'));
    for (const entry of metadata) {
      entries.push({
        id: bridgeId(entry.command),
        command: entry.command,
        skillId,
        ownerMode: entry.ownerMode,
        description: entry.description ?? '',
        ownedSignals: [...(entry.userIntent?.ownedSignals ?? [])],
        standalone,
        mutating: entry.mutating,
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
  // Both fields are derived for a consumer, never authored, so neither is part
  // of the inventory this guard compares against its sources.
  const { runtime: _runtime, embeddingText: _embeddingText, ...inventory } = entry;
  return inventory;
}

function allowListEntries(): readonly AllowListEntry[] {
  return JSON.parse(readFileSync(ALLOW_LIST_PATH, 'utf8')) as readonly AllowListEntry[];
}

// Every bridge the generated file holds: one per declaration, plus the residual
// allow-list rows and the doctor routes the same inventory is built from.
function inventoryProjection(): CommandBridgeEntry[] {
  const allowList = allowListEntries();
  // A command the allow-list already carries keeps that row's id, so its
  // metadata entry adds no second bridge for the same command.
  const allowListCommands = new Set(allowList.map((entry) => entry.command));
  return sorted([
    ...metadataProjection().filter((entry) => !allowListCommands.has(entry.command)),
    ...allowList.map(({ reason: _reason, ...entry }) => ({
      ...entry,
      source: 'scripts/command-bridges/allow-list.json',
    })),
    ...doctorProjection(),
  ]);
}

function compatibilitySnapshot(): CompatibilitySnapshot {
  return JSON.parse(readFileSync(COMPATIBILITY_PATH, 'utf8')) as CompatibilitySnapshot;
}

// A compatibility row is hand-curated: its order, runtime id and phrases are the
// curation itself, so the expectation reads them verbatim.
function handRows(platform: Runtime): CompatibilityRow[] {
  return compatibilitySnapshot()[platform]
    .filter((row) => !row.inventoryId.startsWith(DOCTOR_PREFIX))
    .sort((left, right) => left.order - right.order);
}

// A standalone skill's command is the one bridge its metadata declares, matched by
// command rather than by id because a command can enter the inventory under a row
// carrying its own historical id.
function standaloneCommands(): StandaloneCommand[] {
  const records = new Map(
    metadataProjection()
      .filter((entry) => entry.standalone === true)
      .map((entry) => [entry.command, entry] as const),
  );
  return inventoryProjection()
    .filter((entry) => records.has(entry.command))
    .map((entry) => {
      const record = records.get(entry.command) as CommandBridgeEntry;
      return {
        inventoryId: entry.id,
        inventorySkillId: entry.skillId,
        command: entry.command,
        description: record.description ?? '',
        ownedSignals: [...(record.ownedSignals ?? [])],
        mutating: record.mutating ?? '',
        recordSkillId: record.skillId,
      };
    });
}

// A hand row still wins where one exists, because a curated row can carry phrases
// the metadata cannot know. Only the commands without one are generated.
function generatedRows(platform: Runtime): StandaloneCommand[] {
  const hand = new Set(compatibilitySnapshot()[platform].map((row) => row.inventoryId));
  return standaloneCommands().filter((command) => !hand.has(command.inventoryId));
}

function activeInventoryIds(platform: Runtime): string[] {
  return [
    ...handRows(platform).map((row) => row.inventoryId),
    ...generatedRows(platform).map((command) => command.inventoryId),
  ].sort();
}

function commandNamespace(command: string): string {
  return command.slice(1, command.indexOf(':'));
}

// The active TypeScript half of the surface: a hand row passes its curated entry
// through unchanged, and a generated row takes its phrases, description and
// read-only class from the standalone skill's metadata.
function typescriptEvidence(): TypescriptEvidence[] {
  const inventorySkill = new Map(
    inventoryProjection().map((entry) => [entry.id, entry.skillId] as const),
  );
  return [
    ...handRows('typescript').map((row) => ({
      inventoryId: row.inventoryId,
      ownerSkill: inventorySkill.get(row.inventoryId) ?? '',
      id: row.id,
      name: row.name ?? '',
      description: row.description,
      keywords: [...(row.keywords ?? [])],
      domains: [...(row.domains ?? [])],
      intentSignals: [...(row.intentSignals ?? [])],
      readOnly: row.readOnly === true,
    })),
    ...generatedRows('typescript').map((command) => ({
      inventoryId: command.inventoryId,
      ownerSkill: command.inventorySkillId,
      id: command.inventoryId,
      name: command.inventoryId,
      description: command.description,
      keywords: [...command.ownedSignals],
      domains: [commandNamespace(command.command), 'command'],
      intentSignals: [...command.ownedSignals],
      readOnly: command.mutating === 'read-only',
    })),
  ];
}

function typescriptView(entry: ProjectionRow): TypescriptEvidence {
  return {
    inventoryId: entry.inventoryId ?? entry.id,
    ownerSkill: entry.ownerSkill ?? '',
    id: entry.id,
    name: entry.name ?? '',
    description: entry.description ?? '',
    keywords: [...(entry.keywords ?? [])],
    domains: [...(entry.domains ?? [])],
    intentSignals: [...(entry.intentSignals ?? [])],
    readOnly: entry.readOnly === true,
  };
}

function byInventoryId(
  left: { readonly inventoryId: string },
  right: { readonly inventoryId: string },
): number {
  return left.inventoryId.localeCompare(right.inventoryId);
}

// The live Python dict is rendered in runtime order, so the expectation keeps the
// hand rows in their compatibility order and appends the generated rows the way the
// generator numbers them: after the highest hand order, by inventory id.
function pythonEvidence(): Array<[string, Record<string, unknown>]> {
  const hand: Array<[string, Record<string, unknown>]> = handRows('python').map((row) => [
    row.id,
    {
      description: row.description,
      slash_markers: [...(row.slashMarkers ?? [])],
      ...(row.leadPhrases !== undefined && row.leadPhrases.length > 0
        ? { lead_phrases: [...row.leadPhrases] }
        : {}),
      ...(row.deprecated === true ? { deprecated: true } : {}),
      ...(typeof row.owningSkill === 'string' ? { owning_skill: row.owningSkill } : {}),
    },
  ]);
  const generated: Array<[string, Record<string, unknown>]> = generatedRows('python').map(
    (command) => [
      command.inventoryId,
      {
        description: command.description,
        slash_markers: [command.command, command.command.slice(1)],
        owning_skill: command.recordSkillId,
      },
    ],
  );
  return [...hand, ...generated];
}

describe('command-bridges drift guard', () => {
  it('generated projection exactly equals JSON-derived ids union the residual allow-list and the doctor routes', () => {
    const generated = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as CommandBridgeDump;
    const expected = inventoryProjection();
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

  it('generates all inventory ids for both runtimes and scores exactly the compatibility rows plus the standalone commands', () => {
    const generated = JSON.parse(readFileSync(GENERATED_PATH, 'utf8')) as CommandBridgeDump;
    const inventoryIds = generated.entries.map((entry) => entry.id).sort();
    const typescriptInventoryIds = GENERATED_COMMAND_BRIDGES
      .map((entry) => entry.inventoryId ?? entry.id)
      .sort();

    expect(typescriptInventoryIds).toEqual(inventoryIds);

    // Two rules turn a row on: a compatibility row names its runtime id, order and
    // phrases by hand, and a standalone skill's command carries the same kind of
    // declaration in its own metadata, so it needs no hand row to become reachable.
    // Both halves are read out of the source files, never out of the current output.
    expect(
      GENERATED_COMMAND_BRIDGES.filter(
        (entry) => entry.routingEnabled !== false && !entry.id.startsWith(DOCTOR_PREFIX),
      )
        .map(typescriptView)
        .sort(byInventoryId),
    ).toEqual(typescriptEvidence().sort(byInventoryId));

    const enabledIds = (platform: Runtime): string[] => generated.entries
      .filter(
        (entry) => !entry.id.startsWith(DOCTOR_PREFIX) && entry.runtime?.[platform].enabled === true,
      )
      .map((entry) => entry.id)
      .sort();

    expect(enabledIds('typescript')).toEqual(activeInventoryIds('typescript'));
    expect(enabledIds('python')).toEqual(activeInventoryIds('python'));

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
      '    "generated": cleaned(module["GENERATED_COMMAND_BRIDGES"]),',
      '    "generatedOwners": module["GENERATED_COMMAND_BRIDGE_OWNER_NORMALIZATION"],',
      '}))',
    ].join('\n');
    const output = execFileSync('python3', ['-c', probe, ADVISOR_SCRIPT], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const runtime = JSON.parse(output) as {
      readonly generated: unknown;
      readonly generatedOwners: unknown;
    };

    expect(runtime.generated).toEqual(pythonEvidence());

    const expectedOwners = compatibilitySnapshot().pythonOwnerNormalization;
    expect(runtime.generatedOwners).toEqual(expectedOwners);
    // Dict order is what the runtime walks, so it is part of the record too.
    expect(Object.keys(runtime.generatedOwners as Record<string, string>)).toEqual(
      Object.keys(expectedOwners),
    );
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
