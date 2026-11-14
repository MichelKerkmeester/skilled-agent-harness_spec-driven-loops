#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Documentation Drift Checker
// ───────────────────────────────────────────────────────────────────
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..');
const REGISTRY_PATH = path.join(SKILL_ROOT, 'mode-registry.json');
const HUB_README = path.join(SKILL_ROOT, 'README.md');
const COUNCIL_PLAYBOOK = path.join(SKILL_ROOT, 'deep-ai-council', 'manual-testing-playbook');
const REPORT_ROOT = path.join(SKILL_ROOT, 'benchmark', 'reports');
const REPORT_INDEX = path.join(REPORT_ROOT, 'README.md');
const LINK_DOCS = [
  HUB_README,
  path.join(SKILL_ROOT, 'deep-research', 'README.md'),
  path.join(SKILL_ROOT, 'deep-ai-council', 'README.md'),
  path.join(SKILL_ROOT, 'runtime', 'README.md'),
  path.join(SKILL_ROOT, 'runtime', 'scripts', 'README.md'),
  path.join(SKILL_ROOT, 'deep-review', 'SKILL.md'),
  REPORT_INDEX,
];
const FACTS_EXECUTOR_CONFIG = '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts';
const FACTS_SKILL_ROOT = '.skilled/skills/system-deep-loop';
const FACTS_COMMAND_ROOT = '.skilled/commands/deep';
const FACTS_SKILLS_ROOT = '.skilled/skills';
// Sample paths in JSON and command examples describe a reviewed project, not this repository.
const FACTS_EXAMPLE_PREFIXES = ['src/', 'path/to/', '__tests__/'];
const FACTS_ASSETS_ROOT = '.skilled/commands/deep/assets';
const FACTS_SKIP_SEGMENTS = new Set(['changelog', 'benchmark', 'behavior-benchmark', 'tests', 'node_modules']);
const FACTS_FIXED_DOCS = [
  '.skilled/commands/deep/research.md',
  '.skilled/commands/deep/review.md',
  '.skilled/commands/deep/assets/deep-research-presentation.txt',
  '.skilled/commands/deep/assets/deep-review-presentation.txt',
];
const FACTS_WALKED_DOC_ROOTS = ['deep-research', 'deep-review', 'runtime'];
const FACTS_HUB_DOCS = ['SKILL.md', 'README.md', 'ARCHITECTURE.md'];
const FACTS_BASENAME_ROOTS = [
  '.skilled/skills/system-deep-loop',
  '.skilled/commands',
  '.skilled/skills/system-spec-kit',
];
const FACTS_NUMBER_WORDS = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['ten', 10],
  ['eleven', 11],
  ['twelve', 12],
]);

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parseArgs(argv) {
  // A mistyped flag must fail rather than silently changing which checks run.
  const known = ['--links', '--reports', '--mismatch', '--report-mismatch', '--facts'];
  const rootPrefix = '--facts-root=';
  const unknown = argv.find(
    (token) => token.startsWith('-') && !known.includes(token) && !token.startsWith(rootPrefix),
  );
  if (unknown) {
    process.stderr.write(`check-documentation-drift.cjs: unknown option: ${unknown}\n`);
    process.exit(2);
  }
  return {
    linksOnly: argv.includes('--links'),
    reportsOnly: argv.includes('--reports'),
    mismatch: argv.includes('--mismatch'),
    reportMismatch: argv.includes('--report-mismatch'),
    facts: argv.includes('--facts'),
    // Tests point the facts rules at a fixture tree. A flag keeps the checker free of process-wide state.
    factsRoot: argv.find((token) => token.startsWith(rootPrefix))?.slice(rootPrefix.length) || null,
  };
}

function unique(values) {
  return [...new Set(values)];
}

function registryCounts(registry) {
  const packets = unique(registry.modes.map((mode) => mode.packet));
  return {
    families: packets.length,
    packets,
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

function factsRelative(root, absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join('/');
}

function isFactsSkipped(relativePath) {
  return relativePath.split('/').some((segment) => FACTS_SKIP_SEGMENTS.has(segment));
}

function walkFactsMarkdown(folder, files) {
  if (!fs.existsSync(folder)) return;
  const entries = fs.readdirSync(folder, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    if (FACTS_SKIP_SEGMENTS.has(entry.name)) continue;
    const child = path.join(folder, entry.name);
    if (entry.isDirectory()) walkFactsMarkdown(child, files);
    else if (entry.name.endsWith('.md')) files.push(child);
  }
}

function collectFactsFiles(root) {
  const files = [];
  const seen = new Set();
  function add(absolutePath) {
    if (!fs.existsSync(absolutePath)) return;
    const resolved = path.resolve(absolutePath);
    if (seen.has(resolved)) return;
    seen.add(resolved);
    files.push(resolved);
  }
  for (const relativePath of FACTS_FIXED_DOCS) {
    if (!isFactsSkipped(relativePath)) add(path.resolve(root, relativePath));
  }
  for (const folder of FACTS_WALKED_DOC_ROOTS) {
    const walked = [];
    walkFactsMarkdown(path.resolve(root, FACTS_SKILL_ROOT, folder), walked);
    for (const filePath of walked) add(filePath);
  }
  for (const name of FACTS_HUB_DOCS) add(path.resolve(root, FACTS_SKILL_ROOT, name));
  return files;
}

function walkFactsBaseNames(folder, names) {
  if (!fs.existsSync(folder)) return;
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const child = path.join(folder, entry.name);
    if (entry.isDirectory()) walkFactsBaseNames(child, names);
    else names.add(entry.name);
  }
}

function buildFactsBaseNameSet(root) {
  const names = new Set();
  for (const relativePath of FACTS_BASENAME_ROOTS) {
    walkFactsBaseNames(path.resolve(root, relativePath), names);
  }
  return names;
}

function executorKindCount(filePath) {
  let source;
  try {
    source = read(filePath);
  } catch {
    return null;
  }
  const declaration = /EXECUTOR_KINDS\s*=\s*\[([\s\S]*?)\]\s*as\s+const/u.exec(source);
  if (!declaration) return null;
  const entries = [...declaration[1].matchAll(/'([^']*)'|"([^"]*)"/gu)]
    .map((match) => match[1] ?? match[2]);
  return entries.length === 0 ? null : entries.length;
}

function factsExecutorCountErrors(lines, relativeFile, realCount) {
  const errors = [];
  const claim = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+executor\s+kinds\b/giu;
  lines.forEach((line, index) => {
    for (const match of line.matchAll(claim)) {
      const stated = /^\d+$/u.test(match[1])
        ? Number(match[1])
        : FACTS_NUMBER_WORDS.get(match[1].toLowerCase());
      if (stated !== undefined && stated !== realCount) {
        errors.push(`facts: ${relativeFile}:${index + 1}: states ${match[1]} executor kinds, EXECUTOR_KINDS lists ${realCount}`);
      }
    }
  });
  return errors;
}

function expandFactsBraceList(token) {
  const braceList = /\{([^{}]*,[^{}]*)\}/u.exec(token);
  if (!braceList) return [token];
  return braceList[1].split(',').map((member) =>
    token.slice(0, braceList.index) + member + token.slice(braceList.index + braceList[0].length));
}

function factsPacketRoot(relativeFile) {
  const segments = relativeFile.split('/');
  if (segments.length >= 4 && segments[0] === '.skilled' && segments[1] === 'commands' && segments[2] === 'deep') {
    return FACTS_COMMAND_ROOT;
  }
  if (
    segments.length > 4
    && segments[0] === '.skilled'
    && segments[1] === 'skills'
    && segments[2] === 'system-deep-loop'
  ) {
    return `${FACTS_SKILL_ROOT}/${segments[3]}`;
  }
  return null;
}

function factsTokenExists(token, bases, baseNames) {
  if (token.includes('/')) {
    return bases.some((base) => fs.existsSync(path.join(base, token)));
  }
  return baseNames.has(token);
}

function factsFileErrors(lines, filePath, root, baseNames) {
  const relativeFile = factsRelative(root, filePath);
  const packetRoot = factsPacketRoot(relativeFile);
  const bases = unique([
    root,
    path.dirname(filePath),
    packetRoot ? path.resolve(root, packetRoot) : null,
    path.resolve(root, FACTS_SKILL_ROOT),
    path.resolve(root, FACTS_ASSETS_ROOT),
    // Docs name another skill's file from the skills folder and a runtime library
    // from the lib folder, so both are legitimate starting points.
    path.resolve(root, FACTS_SKILLS_ROOT),
    path.resolve(root, FACTS_SKILL_ROOT, 'runtime', 'lib'),
  ].filter(Boolean));
  const errors = [];
  lines.forEach((line, index) => {
    for (const match of line.matchAll(/[A-Za-z0-9._/{},-]+\.(?:yaml|cjs|sh|ts)\b/gu)) {
      // A token that follows a glob star or a placeholder is the tail of a pattern,
      // not a file name.
      const before = match.index > 0 ? line[match.index - 1] : '';
      if (['*', '<', '>', '$', '[', '}'].includes(before)) continue;
      const candidates = expandFactsBraceList(match[0]).flatMap((member) => member.split(','));
      for (const candidate of candidates) {
        if (candidate === '' || candidate.includes('{')) continue;
        if (FACTS_EXAMPLE_PREFIXES.some((prefix) => candidate.startsWith(prefix))) continue;
        if (['*', '<', '>', '$', '['].some((character) => candidate.includes(character))) continue;
        if (candidate.startsWith('http')) continue;
        if (factsTokenExists(candidate, bases, baseNames)) continue;
        errors.push(`facts: ${relativeFile}:${index + 1}: names ${candidate}, which does not exist`);
      }
    }
  });
  return errors;
}

function findFactsHeadingSection(lines, pattern) {
  for (let index = 0; index < lines.length; index += 1) {
    const heading = /^(#{1,6})\s+(.*)$/u.exec(lines[index]);
    if (!heading || !pattern.test(heading[2])) continue;
    const level = heading[1].length;
    let end = lines.length;
    for (let next = index + 1; next < lines.length; next += 1) {
      const nextHeading = /^(#{1,6})\s+/u.exec(lines[next]);
      if (nextHeading && nextHeading[1].length <= level) {
        end = next;
        break;
      }
    }
    return { start: index, end };
  }
  return null;
}

function factsRoutingErrors(lines, relativeFile) {
  const routing = findFactsHeadingSection(lines, /MODE ROUTING/iu);
  if (!routing) return [];
  const routingFlags = new Set();
  for (let index = routing.start + 1; index < routing.end; index += 1) {
    if (!/^\s*\d+[.)]\s+/u.test(lines[index])) continue;
    for (const match of lines[index].matchAll(/--[A-Za-z0-9][A-Za-z0-9-]*/gu)) routingFlags.add(match[0]);
  }
  if (routingFlags.size === 0) return [];
  const table = findFactsHeadingSection(lines, /Workflow Flag Surface/iu);
  const tableFlags = new Set();
  if (table) {
    for (let index = table.start + 1; index < table.end; index += 1) {
      const line = lines[index].trim();
      if (!line.startsWith('|')) continue;
      const firstCell = line.split('|')[1] ?? '';
      for (const match of firstCell.matchAll(/--[A-Za-z0-9][A-Za-z0-9-]*/gu)) tableFlags.add(match[0]);
    }
  }
  const onlyInRouting = [...routingFlags].filter((flag) => !tableFlags.has(flag)).sort();
  const onlyInTable = [...tableFlags].filter((flag) => !routingFlags.has(flag)).sort();
  if (onlyInRouting.length === 0 && onlyInTable.length === 0) return [];
  return [
    `facts: ${relativeFile}:${routing.start + 1}: routing step flags differ from the Workflow Flag Surface table: `
      + `only in routing ${JSON.stringify(onlyInRouting)}, only in table ${JSON.stringify(onlyInTable)}`,
  ];
}

function runFacts(root = REPO_ROOT) {
  const executorConfigPath = path.resolve(root, FACTS_EXECUTOR_CONFIG);
  const kindCount = executorKindCount(executorConfigPath);
  if (kindCount === null) {
    return {
      fatal: `check-documentation-drift.cjs: cannot parse EXECUTOR_KINDS in ${factsRelative(root, executorConfigPath)}`,
      errors: [],
    };
  }
  const baseNames = buildFactsBaseNameSet(root);
  const errors = [];
  for (const filePath of collectFactsFiles(root)) {
    const relativeFile = factsRelative(root, filePath);
    const lines = read(filePath).split(/\r?\n/u);
    errors.push(...factsExecutorCountErrors(lines, relativeFile, kindCount));
    errors.push(...factsFileErrors(lines, filePath, root, baseNames));
    const basename = path.basename(filePath);
    if (basename === 'research.md' || basename === 'review.md') {
      errors.push(...factsRoutingErrors(lines, relativeFile));
    }
  }
  return { errors };
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
  if (counts.families !== 3) errors.push(`family count mismatch: ${counts.families}`);
  if (!args.linksOnly && !args.reportsOnly) {
    for (const [root, prefix] of [[COUNCIL_PLAYBOOK, 'DAC']]) {
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
  const args = parseArgs(argv);
  const facts = runFacts(args.factsRoot ? path.resolve(args.factsRoot) : REPO_ROOT);
  if (facts.fatal) {
    process.stderr.write(`${facts.fatal}\n`);
    return 2;
  }
  if (args.facts) {
    const factsResult = { errors: facts.errors };
    process.stdout.write(`${JSON.stringify(factsResult, null, 2)}\n`);
    return factsResult.errors.length === 0 ? 0 : 1;
  }
  const result = runChecks(args);
  result.errors.push(...facts.errors);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result.errors.length === 0 ? 0 : 1;
}

if (require.main === module) process.exitCode = main();

module.exports = {
  indexedReportFolders,
  localLinkFailures,
  registryCounts,
  reportFolders,
  runChecks,
  runFacts,
};
