// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ derive-command-bridges — Build the shadow command bridge projection      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const { existsSync, readFileSync, readdirSync, writeFileSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');

const COMMAND_BRIDGES_DIR = __dirname;
const REPO_ROOT = resolve(COMMAND_BRIDGES_DIR, '../../../../../..');
const SKILLS_ROOT = join(REPO_ROOT, '.opencode', 'skills');
const ALLOW_LIST_PATH = join(COMMAND_BRIDGES_DIR, 'allow-list.json');
const COMPATIBILITY_PATH = join(COMMAND_BRIDGES_DIR, 'scoring-compatibility.json');
const OUTPUT_PATH = join(COMMAND_BRIDGES_DIR, 'command-bridges.generated.json');
const TS_PROJECTION_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'mcp-server',
  'lib',
  'scorer',
  'projection.ts',
);
const PY_ADVISOR_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'mcp-server',
  'scripts',
  'skill_advisor.py',
);
const TS_GENERATED_START = '// BEGIN GENERATED COMMAND BRIDGES';
const TS_GENERATED_END = '// END GENERATED COMMAND BRIDGES';
const PY_GENERATED_START = '# BEGIN GENERATED COMMAND BRIDGES';
const PY_GENERATED_END = '# END GENERATED COMMAND BRIDGES';

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`[command-bridges] Failed to read JSON ${filePath}: ${error.message}`);
  }
}

function bridgeId(command) {
  if (!/^\/[a-z][a-z0-9-]*:[a-z0-9-]+$/.test(command)) {
    throw new Error(`[command-bridges] Invalid command id: ${command}`);
  }
  return `command-${command.slice(1).replace(':', '-')}`;
}

function sourcePath(filePath) {
  return relative(REPO_ROOT, filePath).split(sep).join('/');
}

function metadataEntries() {
  const entries = [];
  const skillIds = readdirSync(SKILLS_ROOT).sort();
  for (const skillId of skillIds) {
    const filePath = join(SKILLS_ROOT, skillId, 'command-metadata.json');
    if (!existsSync(filePath)) continue;

    const metadata = readJson(filePath);
    if (!Array.isArray(metadata)) {
      throw new Error(`[command-bridges] ${sourcePath(filePath)} must contain a JSON array`);
    }
    for (const [index, entry] of metadata.entries()) {
      if (!entry || typeof entry !== 'object') {
        throw new Error(`[command-bridges] ${sourcePath(filePath)}[${index}] must be an object`);
      }
      const { command, ownerMode } = entry;
      if (typeof command !== 'string' || typeof ownerMode !== 'string' || !ownerMode) {
        throw new Error(
          `[command-bridges] ${sourcePath(filePath)}[${index}] requires string command and ownerMode`,
        );
      }
      entries.push({
        id: bridgeId(command),
        command,
        skillId,
        ownerMode,
        source: sourcePath(filePath),
      });
    }
  }
  return entries;
}

function allowListEntries() {
  const allowList = readJson(ALLOW_LIST_PATH);
  if (!Array.isArray(allowList)) {
    throw new Error('[command-bridges] allow-list.json must contain a JSON array');
  }
  return allowList.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[command-bridges] allow-list.json[${index}] must be an object`);
    }
    const { id, command, skillId, ownerMode, reason } = entry;
    if ([id, command, skillId, ownerMode, reason].some((value) => typeof value !== 'string' || !value)) {
      throw new Error(
        `[command-bridges] allow-list.json[${index}] requires id, command, skillId, ownerMode, and reason`,
      );
    }
    return {
      id,
      command,
      skillId,
      ownerMode,
      source: 'scripts/command-bridges/allow-list.json',
    };
  });
}

function assertUniqueIds(entries) {
  const seen = new Map();
  for (const entry of entries) {
    const previous = seen.get(entry.id);
    if (previous) {
      throw new Error(
        `[command-bridges] Duplicate bridge id ${entry.id}: ${previous.source} and ${entry.source}`,
      );
    }
    seen.set(entry.id, entry);
  }
}

function stringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string' || !entry)) {
    throw new Error(`[command-bridges] ${label} must be an array of non-empty strings`);
  }
  return value;
}

function compatibilityByInventoryId(entries, inventoryIds, platform) {
  if (!Array.isArray(entries)) {
    throw new Error(`[command-bridges] scoring-compatibility.json ${platform} must be an array`);
  }
  const byInventoryId = new Map();
  const orders = new Set();
  for (const [index, entry] of entries.entries()) {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`[command-bridges] ${platform}[${index}] must be an object`);
    }
    const { inventoryId, order, id, description } = entry;
    if (
      typeof inventoryId !== 'string'
      || !inventoryIds.has(inventoryId)
      || !Number.isInteger(order)
      || order < 0
      || typeof id !== 'string'
      || !id
      || typeof description !== 'string'
    ) {
      throw new Error(
        `[command-bridges] ${platform}[${index}] requires a known inventoryId, ` +
          'non-negative integer order, id, and description',
      );
    }
    if (byInventoryId.has(inventoryId)) {
      throw new Error(`[command-bridges] Duplicate ${platform} inventoryId ${inventoryId}`);
    }
    if (orders.has(order)) {
      throw new Error(`[command-bridges] Duplicate ${platform} order ${order}`);
    }
    if (platform === 'typescript') {
      if (typeof entry.name !== 'string' || !entry.name) {
        throw new Error(`[command-bridges] typescript[${index}] requires name`);
      }
      stringArray(entry.keywords, `typescript[${index}].keywords`);
      stringArray(entry.domains, `typescript[${index}].domains`);
      stringArray(entry.intentSignals, `typescript[${index}].intentSignals`);
    } else {
      stringArray(entry.slashMarkers, `python[${index}].slashMarkers`);
      if ('owningSkill' in entry && (typeof entry.owningSkill !== 'string' || !entry.owningSkill)) {
        throw new Error(`[command-bridges] python[${index}].owningSkill must be a non-empty string`);
      }
      if ('deprecated' in entry && typeof entry.deprecated !== 'boolean') {
        throw new Error(`[command-bridges] python[${index}].deprecated must be boolean`);
      }
    }
    byInventoryId.set(inventoryId, entry);
    orders.add(order);
  }
  return byInventoryId;
}

function runtimeCompatibility(entries) {
  const compatibility = readJson(COMPATIBILITY_PATH);
  if (!compatibility || typeof compatibility !== 'object' || compatibility.schemaVersion !== 1) {
    throw new Error('[command-bridges] scoring-compatibility.json requires schemaVersion 1');
  }
  const inventoryIds = new Set(entries.map((entry) => entry.id));
  const typescript = compatibilityByInventoryId(
    compatibility.typescript,
    inventoryIds,
    'typescript',
  );
  const python = compatibilityByInventoryId(compatibility.python, inventoryIds, 'python');
  const pythonOwnerNormalization = compatibility.pythonOwnerNormalization;
  if (
    !pythonOwnerNormalization
    || typeof pythonOwnerNormalization !== 'object'
    || Array.isArray(pythonOwnerNormalization)
    || Object.entries(pythonOwnerNormalization).some(
      ([key, value]) => !key || typeof value !== 'string' || !value,
    )
  ) {
    throw new Error(
      '[command-bridges] scoring-compatibility.json pythonOwnerNormalization must be a string map',
    );
  }
  const activePythonIds = new Set([...python.values()].map((entry) => entry.id));
  for (const runtimeId of Object.keys(pythonOwnerNormalization)) {
    if (!activePythonIds.has(runtimeId)) {
      throw new Error(
        `[command-bridges] pythonOwnerNormalization references inactive bridge ${runtimeId}`,
      );
    }
  }
  return { typescript, python, pythonOwnerNormalization };
}

function tsString(value) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function tsArray(values) {
  return `[${values.map((value) => tsString(value)).join(', ')}]`;
}

function runtimeOrdered(entries, platform) {
  return [...entries].sort((left, right) => {
    const leftRuntime = left.runtime[platform];
    const rightRuntime = right.runtime[platform];
    if (leftRuntime.enabled !== rightRuntime.enabled) {
      return leftRuntime.enabled ? -1 : 1;
    }
    if (leftRuntime.enabled && rightRuntime.enabled) {
      return leftRuntime.order - rightRuntime.order;
    }
    return left.id.localeCompare(right.id);
  });
}

function renderTypescriptBridge(entry) {
  const runtime = entry.runtime.typescript;
  const active = runtime.enabled;
  const id = active ? runtime.id : entry.id;
  const name = active ? runtime.name : entry.id;
  const description = active ? runtime.description : '';
  const keywords = active ? runtime.keywords : [];
  const domains = active ? runtime.domains : [];
  const intentSignals = active ? runtime.intentSignals : [];
  return [
    '  {',
    `    inventoryId: ${tsString(entry.id)},`,
    `    routingEnabled: ${active},`,
    `    id: ${tsString(id)},`,
    "    kind: 'command',",
    "    family: 'system',",
    "    category: 'command',",
    `    name: ${tsString(name)},`,
    `    description: ${tsString(description)},`,
    `    keywords: ${tsArray(keywords)},`,
    `    domains: ${tsArray(domains)},`,
    `    intentSignals: ${tsArray(intentSignals)},`,
    '    derivedTriggers: [],',
    '    derivedKeywords: [],',
    '    sourcePath: null,',
    "    lifecycleStatus: 'active',",
    '  },',
  ].join('\n');
}

function renderTypescriptProjection(entries) {
  const body = runtimeOrdered(entries, 'typescript').map(renderTypescriptBridge).join('\n');
  return `export const GENERATED_COMMAND_BRIDGES: readonly CommandBridgeProjection[] = [\n${body}\n];`;
}

function pythonString(value) {
  return JSON.stringify(value);
}

function pythonList(values) {
  return `[${values.map((value) => pythonString(value)).join(', ')}]`;
}

function renderPythonBridge(entry) {
  const runtime = entry.runtime.python;
  const active = runtime.enabled;
  const runtimeId = active ? runtime.id : entry.id;
  const description = active ? runtime.description : '';
  const slashMarkers = active ? runtime.slashMarkers : [entry.command];
  const lines = [
    `    ${pythonString(runtimeId)}: {`,
    `        "description": ${pythonString(description)},`,
    `        "slash_markers": ${pythonList(slashMarkers)},`,
  ];
  if (active && runtime.deprecated === true) {
    lines.push('        "deprecated": True,');
  }
  if (active && typeof runtime.owningSkill === 'string') {
    lines.push(`        "owning_skill": ${pythonString(runtime.owningSkill)},`);
  }
  lines.push(
    `        "inventory_id": ${pythonString(entry.id)},`,
    `        "command": ${pythonString(entry.command)},`,
    `        "skill_id": ${pythonString(entry.skillId)},`,
    `        "owner_mode": ${pythonString(entry.ownerMode)},`,
    `        "routing_enabled": ${active ? 'True' : 'False'},`,
    '    },',
  );
  return lines.join('\n');
}

function renderPythonProjection(entries, pythonOwnerNormalization) {
  const body = runtimeOrdered(entries, 'python').map(renderPythonBridge).join('\n');
  const normalization = Object.entries(pythonOwnerNormalization)
    .map(([id, owner]) => `    ${pythonString(id)}: ${pythonString(owner)},`)
    .join('\n');
  return [
    'GENERATED_COMMAND_BRIDGES = {',
    body,
    '}',
    '',
    'GENERATED_COMMAND_BRIDGE_OWNER_NORMALIZATION = {',
    normalization,
    '}',
  ].join('\n');
}

function replaceMarkedBlock(content, startMarker, endMarker, replacement, filePath) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start < 0 || end < 0 || end < start) {
    throw new Error(`[command-bridges] Missing generated markers in ${sourcePath(filePath)}`);
  }
  const bodyStart = start + startMarker.length;
  return `${content.slice(0, bodyStart)}\n${replacement}\n${content.slice(end)}`;
}

function generatedSources(entries, pythonOwnerNormalization) {
  const typescript = readFileSync(TS_PROJECTION_PATH, 'utf8');
  const python = readFileSync(PY_ADVISOR_PATH, 'utf8');
  return [
    {
      path: TS_PROJECTION_PATH,
      current: typescript,
      next: replaceMarkedBlock(
        typescript,
        TS_GENERATED_START,
        TS_GENERATED_END,
        renderTypescriptProjection(entries),
        TS_PROJECTION_PATH,
      ),
    },
    {
      path: PY_ADVISOR_PATH,
      current: python,
      next: replaceMarkedBlock(
        python,
        PY_GENERATED_START,
        PY_GENERATED_END,
        renderPythonProjection(entries, pythonOwnerNormalization),
        PY_ADVISOR_PATH,
      ),
    },
  ];
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const metadata = metadataEntries();
  const allowList = allowListEntries();
  const inventory = [...metadata, ...allowList].sort((left, right) => left.id.localeCompare(right.id));
  assertUniqueIds(inventory);
  const compatibility = runtimeCompatibility(inventory);
  const entries = inventory.map((entry) => ({
    ...entry,
    runtime: {
      typescript: compatibility.typescript.get(entry.id)
        ? { enabled: true, ...compatibility.typescript.get(entry.id) }
        : { enabled: false },
      python: compatibility.python.get(entry.id)
        ? { enabled: true, ...compatibility.python.get(entry.id) }
        : { enabled: false },
    },
  }));

  const projection = {
    schemaVersion: 2,
    generatedBy: 'scripts/command-bridges/derive-command-bridges.cjs',
    counts: {
      commandMetadata: metadata.length,
      allowList: allowList.length,
      generated: entries.length,
      typescriptActive: compatibility.typescript.size,
      pythonActive: compatibility.python.size,
    },
    entries,
  };
  const output = `${JSON.stringify(projection, null, 2)}\n`;
  const sources = generatedSources(entries, compatibility.pythonOwnerNormalization);
  const changed = [
    ...(readFileSync(OUTPUT_PATH, 'utf8') === output ? [] : [OUTPUT_PATH]),
    ...sources.filter(({ current, next }) => current !== next).map(({ path }) => path),
  ];

  if (!checkOnly) {
    writeFileSync(OUTPUT_PATH, output, 'utf8');
    for (const source of sources) {
      if (source.current !== source.next) {
        writeFileSync(source.path, source.next, 'utf8');
      }
    }
  }

  console.log(JSON.stringify({
    status: changed.length === 0 ? 'fresh' : checkOnly ? 'stale' : 'generated',
    counts: projection.counts,
    changed: changed.map(sourcePath),
  }, null, 2));
  if (checkOnly && changed.length > 0) process.exitCode = 1;
}

main();
