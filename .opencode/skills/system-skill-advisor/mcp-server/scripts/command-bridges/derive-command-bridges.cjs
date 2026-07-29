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
const OUTPUT_PATH = join(COMMAND_BRIDGES_DIR, 'command-bridges.generated.json');

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

function main() {
  const metadata = metadataEntries();
  const allowList = allowListEntries();
  const entries = [...metadata, ...allowList].sort((left, right) => left.id.localeCompare(right.id));
  assertUniqueIds(entries);

  const projection = {
    schemaVersion: 1,
    generatedBy: 'scripts/command-bridges/derive-command-bridges.cjs',
    counts: {
      commandMetadata: metadata.length,
      allowList: allowList.length,
      generated: entries.length,
    },
    entries,
  };
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(projection, null, 2)}\n`, 'utf8');
  console.log(
    `[command-bridges] generated ${entries.length} entries ` +
      `(${metadata.length} metadata + ${allowList.length} allow-list)`,
  );
}

main();
