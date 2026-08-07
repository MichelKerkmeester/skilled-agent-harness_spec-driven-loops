#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SKILL_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..');
const REGISTRY_PATH = path.join(SKILL_ROOT, 'mode-registry.json');
const HUB_README = path.join(SKILL_ROOT, 'README.md');
const ALIGNMENT_README = path.join(SKILL_ROOT, 'deep-alignment', 'README.md');
const COUNCIL_PLAYBOOK = path.join(SKILL_ROOT, 'deep-ai-council', 'manual-testing-playbook');
const ALIGNMENT_PLAYBOOK = path.join(SKILL_ROOT, 'deep-alignment', 'manual-testing-playbook');
const REPORT_ROOT = path.join(SKILL_ROOT, 'benchmark', 'reports');
const REPORT_INDEX = path.join(REPORT_ROOT, 'README.md');
const LINK_DOCS = [
  HUB_README,
  path.join(SKILL_ROOT, 'deep-research', 'README.md'),
  path.join(SKILL_ROOT, 'deep-ai-council', 'README.md'),
  ALIGNMENT_README,
  path.join(SKILL_ROOT, 'deep-improvement', 'README.md'),
  path.join(SKILL_ROOT, 'runtime', 'README.md'),
  path.join(SKILL_ROOT, 'runtime', 'scripts', 'README.md'),
  path.join(SKILL_ROOT, 'deep-review', 'SKILL.md'),
  path.join(SKILL_ROOT, 'deep-alignment', 'assets', 'conformance-benchmark', 'command-surface', 'conformance-benchmark.md'),
  REPORT_INDEX,
];

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parseArgs(argv) {
  return {
    linksOnly: argv.includes('--links'),
    reportsOnly: argv.includes('--reports'),
    mismatch: argv.includes('--mismatch'),
    reportMismatch: argv.includes('--report-mismatch'),
  };
}

function unique(values) {
  return [...new Set(values)];
}

function registryCounts(registry) {
  const packets = unique(registry.modes.map((mode) => mode.packet));
  const improvementLanes = registry.modes.filter((mode) => mode.packet === 'deep-improvement');
  const scoping = require(path.join(SKILL_ROOT, 'deep-alignment', 'scripts', 'scoping.cjs'));
  const adapters = unique(Object.values(scoping.AUTHORITY_ADAPTERS).flat());
  return {
    families: packets.length,
    lanes: improvementLanes.length,
    adapters: adapters.length,
    packets,
    adapterNames: adapters,
  };
}

function scenarioIndex(playbookRoot, prefix) {
  const indexPath = path.join(playbookRoot, 'manual-testing-playbook.md');
  const index = read(indexPath);
  const declared = Number(index.match(/provides (\d+) deterministic scenarios/u)?.[1] ?? 0);
  const files = [];
  function walk(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const child = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (entry.name.endsWith('.md') && child !== indexPath) files.push(child);
    }
  }
  walk(playbookRoot);
  const ids = unique(files.flatMap((filePath) => {
    const content = read(filePath);
    return [...content.matchAll(new RegExp(`\\b${prefix}-\\d+\\b`, 'gu'))].map((match) => match[0]);
  }));
  return { declared, files: ids.length, ids };
}

function reportFolders() {
  const folders = [];
  function walk(folder, depth) {
    if (depth > 2) return;
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const child = path.join(folder, entry.name);
      if (fs.existsSync(path.join(child, 'source.md'))) folders.push(path.relative(REPORT_ROOT, child));
      walk(child, depth + 1);
    }
  }
  walk(REPORT_ROOT, 0);
  return folders.sort();
}

function indexedReportFolders() {
  return unique([...read(REPORT_INDEX).matchAll(/\]\((\.\/[^)]+\/)\)/gu)]
    .map((match) => match[1].replace(/\/$/u, '').slice(2))).sort();
}

function localLinkFailures() {
  const failures = [];
  for (const filePath of LINK_DOCS) {
    const content = read(filePath);
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/gu)) {
      const target = match[1].replace(/^<|>$/gu, '').split('#', 1)[0];
      if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/iu.test(target)) continue;
      const resolved = path.resolve(path.dirname(filePath), decodeURIComponent(target));
      if (!fs.existsSync(resolved)) failures.push(`${path.relative(REPO_ROOT, filePath)} -> ${target}`);
    }
  }
  return failures;
}

function runChecks(args) {
  const errors = [];
  const registry = JSON.parse(read(REGISTRY_PATH));
  if (args.mismatch) registry.modes.push({ packet: '__deliberately_missing_packet__' });
  const counts = registryCounts(registry);
  for (const packet of counts.packets) {
    if (!fs.existsSync(path.join(SKILL_ROOT, packet))) errors.push(`registry packet missing: ${packet}`);
    if (!read(HUB_README).includes(`${packet}/`)) errors.push(`registry packet absent from hub index: ${packet}`);
  }
  if (counts.families !== 5) errors.push(`family count mismatch: ${counts.families}`);
  if (counts.lanes !== 3) errors.push(`lane count mismatch: ${counts.lanes}`);
  if (counts.adapters !== 6) errors.push(`adapter count mismatch: ${counts.adapters}`);
  if (!read(ALIGNMENT_README).includes('six registered adapter variants')) errors.push('alignment adapter count is not registry-derived');
  if (!args.linksOnly && !args.reportsOnly) {
    for (const [root, prefix] of [[COUNCIL_PLAYBOOK, 'DAC'], [ALIGNMENT_PLAYBOOK, 'DAL']]) {
      const scenarios = scenarioIndex(root, prefix);
      if (scenarios.declared !== scenarios.files) errors.push(`${prefix} scenario index mismatch: declared=${scenarios.declared} files=${scenarios.files}`);
    }
  }
  if (!args.linksOnly) {
    const folders = reportFolders();
    let indexed = indexedReportFolders();
    if (args.reportMismatch) indexed = indexed.slice(1);
    if (JSON.stringify(folders) !== JSON.stringify(indexed)) errors.push(`report index mismatch: folders=${JSON.stringify(folders)} index=${JSON.stringify(indexed)}`);
  }
  if (!args.reportsOnly) {
    const links = localLinkFailures();
    if (links.length) errors.push(...links);
  }
  return { counts, errors };
}

function main(argv = process.argv.slice(2)) {
  const result = runChecks(parseArgs(argv));
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result.errors.length === 0 ? 0 : 1;
}

if (require.main === module) process.exitCode = main();

module.exports = { indexedReportFolders, localLinkFailures, registryCounts, reportFolders, runChecks };
