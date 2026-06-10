#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const serverRoot = resolve(here, '..');
const sourcePath = process.env.SPECKIT_TOOL_SCHEMAS_PATH || resolve(serverRoot, 'tool-schemas.ts');
const mapPath = process.env.SPECKIT_TOOL_OWNERSHIP_MAP_PATH || resolve(here, 'fixtures', 'tool-ownership-map.json');

const ownerByCategory = Object.freeze({
  Orchestration: 'memory-orchestration',
  Core: 'memory-core',
  Discovery: 'memory-discovery',
  Mutation: 'memory-mutation',
  Lifecycle: 'memory-lifecycle',
  Analysis: 'memory-analysis',
  Maintenance: 'memory-maintenance',
});

function failClosed(message) {
  console.error(`tool-ownership lint failed closed: ${message}`);
  process.exit(1);
}

function readRequired(path, label) {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    failClosed(`${label} unreadable: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseToolNames(source) {
  const listMatch = /export const TOOL_DEFINITIONS:\s*ToolDefinition\[\]\s*=\s*\[([\s\S]*?)\];/m.exec(source);
  if (!listMatch) {
    failClosed('TOOL_DEFINITIONS list not found');
  }
  const names = [];
  for (const match of listMatch[1].matchAll(/^\s{2}([A-Za-z_$][\w$]*)\s*,\s*$/gm)) {
    names.push(match[1]);
  }
  if (names.length === 0) {
    failClosed('TOOL_DEFINITIONS list is empty');
  }
  return names;
}

function readDefinitionObject(source, constName) {
  const pattern = new RegExp(`const\\s+${constName}\\s*:\\s*ToolDefinition\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`, 'm');
  const match = pattern.exec(source);
  if (!match) {
    failClosed(`tool definition object not found for ${constName}`);
  }
  return match[1];
}

function readStringField(objectSource, field, constName) {
  const match = new RegExp(`${field}\\s*:\\s*'((?:\\\\'|[^'])*)'`, 'm').exec(objectSource);
  if (!match) {
    failClosed(`${field} missing for ${constName}`);
  }
  return match[1].replace(/\\'/g, "'");
}

function deriveEntry(source, constName) {
  const objectSource = readDefinitionObject(source, constName);
  const name = readStringField(objectSource, 'name', constName);
  const description = readStringField(objectSource, 'description', constName);
  const contract = /^\[([^:\]]+):([^\]]+)\]/.exec(description);
  const level = contract?.[1] || 'unclassified';
  const category = contract?.[2] || 'unclassified';
  return {
    name,
    owner: ownerByCategory[category] || 'memory-unclassified',
    stability: /^\[deprecated\]/i.test(description) ? 'deprecated' : 'stable',
    level,
    category,
  };
}

function deriveMap(source) {
  return {
    schemaVersion: 1,
    generatedFrom: 'TOOL_DEFINITIONS',
    tools: parseToolNames(source)
      .map((constName) => deriveEntry(source, constName))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function normalizeMap(map) {
  if (!map || map.schemaVersion !== 1 || map.generatedFrom !== 'TOOL_DEFINITIONS' || !Array.isArray(map.tools)) {
    failClosed('committed map is malformed');
  }
  return {
    schemaVersion: 1,
    generatedFrom: 'TOOL_DEFINITIONS',
    tools: map.tools.slice().sort((a, b) => String(a.name).localeCompare(String(b.name))),
  };
}

function serialize(map) {
  return `${JSON.stringify(normalizeMap(map), null, 2)}\n`;
}

const source = readRequired(sourcePath, 'TOOL_DEFINITIONS source');
const committed = (() => {
  try {
    return JSON.parse(readRequired(mapPath, 'committed ownership map'));
  } catch (error) {
    failClosed(`committed ownership map malformed: ${error instanceof Error ? error.message : String(error)}`);
  }
})();

const expected = deriveMap(source);
const expectedText = serialize(expected);
const committedText = serialize(committed);

if (expectedText !== committedText) {
  const expectedNames = new Set(expected.tools.map((tool) => tool.name));
  const committedNames = new Set(committed.tools.map((tool) => tool.name));
  const missing = expected.tools.filter((tool) => !committedNames.has(tool.name)).map((tool) => tool.name);
  const extra = committed.tools.filter((tool) => !expectedNames.has(tool.name)).map((tool) => tool.name);
  const committedByName = new Map(committed.tools.map((tool) => [tool.name, tool]));
  const changed = [];
  for (const tool of expected.tools) {
    const actual = committedByName.get(tool.name);
    if (!actual) continue;
    for (const field of ['owner', 'stability', 'level', 'category']) {
      if (tool[field] !== actual[field]) {
        changed.push(`${tool.name}.${field}: expected ${tool[field]}, got ${actual[field]}`);
      }
    }
  }
  console.error('tool-ownership drift detected');
  if (missing.length > 0) console.error(`missing from committed map: ${missing.join(', ')}`);
  if (extra.length > 0) console.error(`extra in committed map: ${extra.join(', ')}`);
  if (changed.length > 0) console.error(`changed entries: ${changed.slice(0, 10).join('; ')}`);
  console.error(`regenerate ${mapPath} from TOOL_DEFINITIONS before committing`);
  process.exit(1);
}

console.log(`tool-ownership map clean (${expected.tools.length} tool(s))`);
