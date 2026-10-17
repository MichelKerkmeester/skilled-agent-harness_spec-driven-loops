// ───────────────────────────────────────────────────────────────────
// MODULE: Derive Command Bridges
// ───────────────────────────────────────────────────────────────────

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const { existsSync, readFileSync, readdirSync, writeFileSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const COMMAND_BRIDGES_DIR = __dirname;
const REPO_ROOT = resolve(COMMAND_BRIDGES_DIR, '../../../../../..');
const SKILLS_ROOT = join(REPO_ROOT, '.skilled', 'skills');
const ALLOW_LIST_PATH = join(COMMAND_BRIDGES_DIR, 'allow-list.json');
const DOCTOR_COMMANDS_DIR = join(REPO_ROOT, '.skilled', 'commands', 'doctor');
const DOCTOR_ROUTES_PATH = join(DOCTOR_COMMANDS_DIR, '_routes.yaml');
const COMPATIBILITY_PATH = join(COMMAND_BRIDGES_DIR, 'scoring-compatibility.json');
const OUTPUT_PATH = join(COMMAND_BRIDGES_DIR, 'command-bridges.generated.json');
const TS_PROJECTION_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'runtime',
  'lib',
  'scorer',
  'projection.ts',
);
const PY_ADVISOR_PATH = join(
  SKILLS_ROOT,
  'system-skill-advisor',
  'runtime',
  'scripts',
  'skill_advisor.py',
);
const TS_GENERATED_START = '// BEGIN GENERATED COMMAND BRIDGES';
const TS_GENERATED_END = '// END GENERATED COMMAND BRIDGES';
const PY_GENERATED_START = '# BEGIN GENERATED COMMAND BRIDGES';
const PY_GENERATED_END = '# END GENERATED COMMAND BRIDGES';
const DOCTOR_PREFIX = 'command-doctor-';
const DOCTOR_MCP_COMMAND = '/doctor:mcp';
const RENDER_PATH = join(SKILLS_ROOT, 'system-skill-advisor', 'runtime', 'lib', 'render.ts');
const RENDER_GENERATED_START = '// BEGIN GENERATED DOCTOR COMMANDS';
const RENDER_GENERATED_END = '// END GENERATED DOCTOR COMMANDS';

// Manifest-derived runnable strings, trigger phrases and precedence phrases per doctor bridge id.
// The inventory entries keep their five-key shape; the projection merge reads here.
const DOCTOR_DETAILS = new Map();

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

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

function doctorSkillAgent(name) {
  const routerPath = join(DOCTOR_COMMANDS_DIR, `${name}.md`);
  const tag = existsSync(routerPath)
    ? /<!--\s*skill_agent:\s*([a-z0-9-]+)\s*-->/.exec(readFileSync(routerPath, 'utf8'))
    : null;
  if (!tag) {
    throw new Error(
      `[command-bridges] ${sourcePath(routerPath)} has no skill_agent tag; `
        + 'a doctor bridge needs its owning skill',
    );
  }
  return tag[1];
}

function doctorCommandName(command, label) {
  const match = /^\/doctor:([a-z0-9-]+)$/.exec(command);
  if (!match) {
    throw new Error(`[command-bridges] ${label} has invalid doctor command ${command}`);
  }
  return match[1];
}

function doctorRouteEntries() {
  DOCTOR_DETAILS.clear();
  // Required lazily: an argument-rejecting run must exit before this module
  // ever needs a YAML parser.
  const YAML = require('yaml');
  let manifest;
  try {
    manifest = YAML.parse(readFileSync(DOCTOR_ROUTES_PATH, 'utf8'));
  } catch (error) {
    throw new Error(
      `[command-bridges] Failed to read ${sourcePath(DOCTOR_ROUTES_PATH)}: ${error.message}`,
    );
  }
  const routes = manifest && manifest.routes;
  if (!Array.isArray(routes)) {
    throw new Error('[command-bridges] _routes.yaml routes must be an array');
  }
  const names = routes.map((route, index) => (
    doctorCommandName(route.command, `_routes.yaml routes[${index}]`)
  ));
  const totals = new Map();
  for (const name of names) {
    totals.set(name, (totals.get(name) || 0) + 1);
  }

  const entries = [];
  routes.forEach((route, index) => {
    const label = `_routes.yaml routes[${index}]`;
    if (typeof route.target !== 'string' || !route.target) {
      throw new Error(`[command-bridges] ${label} requires a non-empty string target`);
    }
    // A command with several targets needs one bridge per target; a
    // single-target command takes the command's own id.
    const multiTarget = totals.get(names[index]) > 1;
    const id = multiTarget
      ? `command-doctor-${names[index]}-${route.target}`
      : `command-doctor-${names[index]}`;
    const skillId = doctorSkillAgent(names[index]);
    const phrases = stringArray(route.trigger_phrases, `${label}.trigger_phrases`);
    const leadPhrases = doctorLeadPhrases(route, label, phrases);
    DOCTOR_DETAILS.set(id, {
      runnable: multiTarget ? `${route.command} ${route.target}` : route.command,
      phrases,
      leadPhrases,
    });
    entries.push({
      id,
      command: route.command,
      skillId,
      ownerMode: skillId,
      source: sourcePath(DOCTOR_ROUTES_PATH),
    });
  });

  const standalone = manifest.standalone === undefined ? [] : manifest.standalone;
  if (!Array.isArray(standalone)) {
    throw new Error('[command-bridges] _routes.yaml standalone must be an array');
  }
  standalone.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const label = `_routes.yaml standalone[${index}]`;
    const phrases = Object.prototype.hasOwnProperty.call(item, 'trigger_phrases')
      ? stringArray(item.trigger_phrases, `${label}.trigger_phrases`)
      : [];
    const leadPhrases = doctorLeadPhrases(item, label, phrases);
    if (typeof item.command !== 'string') return;
    const name = doctorCommandName(item.command, label);
    const skillId = doctorSkillAgent(name);
    const runnable = typeof item.runnable === 'string' && item.runnable
      ? item.runnable
      : item.command;
    DOCTOR_DETAILS.set(`command-doctor-${name}`, { runnable, phrases, leadPhrases });
    entries.push({
      id: `command-doctor-${name}`,
      command: item.command,
      skillId,
      ownerMode: skillId,
      source: sourcePath(DOCTOR_ROUTES_PATH),
    });
  });

  const mcpSubroutes = manifest.mcp_subroutes === undefined ? [] : manifest.mcp_subroutes;
  if (!Array.isArray(mcpSubroutes)) {
    throw new Error('[command-bridges] _routes.yaml mcp_subroutes must be an array');
  }
  mcpSubroutes.forEach((item, index) => {
    const label = `_routes.yaml mcp_subroutes[${index}]`;
    if (!item || typeof item.sub_action !== 'string' || !item.sub_action) {
      throw new Error(`[command-bridges] ${label} requires a non-empty string sub_action`);
    }
    const commandName = doctorCommandName(DOCTOR_MCP_COMMAND, label);
    const skillId = doctorSkillAgent(commandName);
    const id = `${DOCTOR_PREFIX}${commandName}-${item.sub_action}`;
    const runnable = `${DOCTOR_MCP_COMMAND} ${item.sub_action}`;
    const phrases = stringArray(item.trigger_phrases, `${label}.trigger_phrases`);
    const leadPhrases = doctorLeadPhrases(item, label, phrases);
    DOCTOR_DETAILS.set(id, {
      runnable,
      phrases,
      leadPhrases,
    });
    entries.push({
      id,
      command: DOCTOR_MCP_COMMAND,
      skillId,
      ownerMode: skillId,
      source: sourcePath(DOCTOR_ROUTES_PATH),
    });
  });

  return entries;
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

function doctorLeadPhrases(item, label, triggerPhrases) {
  const leadPhrases = Object.prototype.hasOwnProperty.call(item, 'lead_phrases')
    ? stringArray(item.lead_phrases, `${label}.lead_phrases`)
    : [];
  for (const phrase of leadPhrases) {
    if (!triggerPhrases.includes(phrase)) {
      throw new Error(
        `[command-bridges] ${label}.lead_phrases entry ${JSON.stringify(phrase)} must also appear in trigger_phrases`,
      );
    }
  }
  return leadPhrases;
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
    const isDoctor = inventoryId.startsWith(DOCTOR_PREFIX);
    if (isDoctor && id !== inventoryId) {
      throw new Error(
        `[command-bridges] ${platform}[${index}] doctor bridge id must equal its inventoryId`,
      );
    }
    if (platform === 'typescript') {
      if (!isDoctor) {
        if (typeof entry.name !== 'string' || !entry.name) {
          throw new Error(`[command-bridges] typescript[${index}] requires name`);
        }
        stringArray(entry.keywords, `typescript[${index}].keywords`);
        stringArray(entry.domains, `typescript[${index}].domains`);
        stringArray(entry.intentSignals, `typescript[${index}].intentSignals`);
      }
    } else {
      if (!isDoctor) {
        stringArray(entry.slashMarkers, `python[${index}].slashMarkers`);
      }
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

function doctorRuntime(entryId, platform, compat) {
  const { runnable, phrases, leadPhrases } = DOCTOR_DETAILS.get(entryId);
  if (platform === 'typescript') {
    return {
      ...compat,
      name: runnable,
      keywords: [...phrases],
      intentSignals: [runnable],
      ...(leadPhrases.length > 0 ? { leadPhrases: [...leadPhrases] } : {}),
      domains: ['doctor', 'command'],
    };
  }
  return {
    ...compat,
    slashMarkers: [runnable],
    ...(leadPhrases.length > 0 ? { leadPhrases: [...leadPhrases] } : {}),
  };
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
  const lines = [
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
  ];
  if (active && runtime.leadPhrases?.length) {
    lines.push(`    leadPhrases: ${tsArray(runtime.leadPhrases)},`);
  }
  lines.push(
    '    derivedTriggers: [],',
    '    derivedKeywords: [],',
    '    sourcePath: null,',
    "    lifecycleStatus: 'active',",
    '  },',
  );
  return lines.join('\n');
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
  if (active && runtime.leadPhrases?.length) {
    lines.push(`        "lead_phrases": ${pythonList(runtime.leadPhrases)},`);
  }
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

function renderDoctorCommandStrings(entries) {
  const lines = entries
    .filter((entry) => entry.id.startsWith(DOCTOR_PREFIX))
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((entry) => {
      const { runnable } = DOCTOR_DETAILS.get(entry.id);
      return `  ${tsString(entry.id)}: ${tsString(runnable)},`;
    });
  return [
    'const DOCTOR_COMMAND_STRINGS: Readonly<Record<string, string>> = Object.freeze({',
    ...lines,
    '});',
  ].join('\n');
}

function generatedSources(entries, pythonOwnerNormalization) {
  const typescript = readFileSync(TS_PROJECTION_PATH, 'utf8');
  const python = readFileSync(PY_ADVISOR_PATH, 'utf8');
  const render = readFileSync(RENDER_PATH, 'utf8');
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
    {
      path: RENDER_PATH,
      current: render,
      next: replaceMarkedBlock(
        render,
        RENDER_GENERATED_START,
        RENDER_GENERATED_END,
        renderDoctorCommandStrings(entries),
        RENDER_PATH,
      ),
    },
  ];
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function main() {
  // CLI-only rejection: requiring this module (for example from tests) must
  // not exit on arguments belonging to the host process.
  if (require.main === module) {
    const unknownArg = process.argv.slice(2).find((token) => token !== '--check');
    if (unknownArg !== undefined) {
      console.error(`derive-command-bridges.cjs: unknown option: ${unknownArg}`);
      console.error('usage: derive-command-bridges.cjs [--check]');
      process.exit(2);
    }
  }
  const checkOnly = process.argv.includes('--check');
  const metadata = metadataEntries();
  const allowList = allowListEntries();
  const doctor = doctorRouteEntries();
  const inventory = [...metadata, ...allowList, ...doctor].sort((left, right) => left.id.localeCompare(right.id));
  assertUniqueIds(inventory);
  const compatibility = runtimeCompatibility(inventory);
  const entries = inventory.map((entry) => {
    const isDoctor = entry.id.startsWith(DOCTOR_PREFIX);
    const typescript = compatibility.typescript.get(entry.id);
    const python = compatibility.python.get(entry.id);
    const runtime = { typescript: { enabled: false }, python: { enabled: false } };
    if (typescript) {
      runtime.typescript = {
        enabled: true,
        ...(isDoctor ? doctorRuntime(entry.id, 'typescript', typescript) : typescript),
      };
    }
    if (python) {
      runtime.python = {
        enabled: true,
        ...(isDoctor ? doctorRuntime(entry.id, 'python', python) : python),
      };
    }
    return { ...entry, runtime };
  });

  const projection = {
    schemaVersion: 2,
    generatedBy: 'scripts/command-bridges/derive-command-bridges.cjs',
    counts: {
      commandMetadata: metadata.length,
      allowList: allowList.length,
      doctorRoutes: doctor.length,
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
