#!/usr/bin/env node

'use strict';

// This operator helper intentionally writes the packet-local ai-council artifact
// tree only. The TypeScript graph upsert helpers are exercised by vitest; loading
// them here would require a TS runtime in ordinary operator shells.

const fs = require('node:fs');
const path = require('node:path');

const {
  getScenarioData,
  listScenarioIds,
} = require('../mcp-server/tests/fixtures/council-value/data/scenarios.cjs');

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.scenario || !args.specFolder) {
    usageAndExit();
  }

  const data = getScenarioData(args.scenario);
  const specRoot = resolveSpecRoot(args.specFolder);
  seedArtifactTree(specRoot, data.artifactTree);

  console.log(`Seeded ${data.scenarioId} artifacts at ${path.relative(process.cwd(), path.join(specRoot, 'ai-council'))}`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--scenario') {
      parsed.scenario = argv[index + 1];
      index += 1;
    } else if (arg === '--spec-folder') {
      parsed.specFolder = argv[index + 1];
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      usageAndExit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function resolveSpecRoot(specFolder) {
  if (path.isAbsolute(specFolder)) {
    throw new Error('--spec-folder must be relative to .opencode/specs');
  }
  const specsRoot = path.resolve(process.cwd(), '.opencode/specs');
  const target = path.resolve(specsRoot, specFolder);
  if (!target.startsWith(`${specsRoot}${path.sep}`)) {
    throw new Error(`Refusing to write outside .opencode/specs: ${specFolder}`);
  }
  return target;
}

function seedArtifactTree(rootDir, files) {
  const root = path.resolve(rootDir);
  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.resolve(root, relativePath);
    if (!target.startsWith(`${root}${path.sep}`)) {
      throw new Error(`Refusing to seed artifact outside root: ${relativePath}`);
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
  }
}

function usageAndExit(exitCode = 1) {
  const scenarios = listScenarioIds().join(', ');
  console.error(
    `Usage: node .opencode/skills/system-spec-kit/scripts/seed-council-value-fixture.cjs --scenario DAC-027 --spec-folder sandbox/dac-027\n` +
    `Available scenarios: ${scenarios}`,
  );
  process.exit(exitCode);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
