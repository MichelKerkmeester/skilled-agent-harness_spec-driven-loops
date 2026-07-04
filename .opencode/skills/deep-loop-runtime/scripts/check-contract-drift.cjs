#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Contract Drift Checker                                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const compiler = require('./compile-command-contracts.cjs');

const {
  COMMANDS,
  GENERATED_HEADER_END,
  GENERATED_HEADER_START,
  WORKSPACE_ROOT,
  buildContract,
  computeCompiledBodyDigest,
  getCommandDefinition,
  normalizeCompiledBody,
  outputPathFor,
  parseDigestHeader,
  sha256,
  sha256File,
  stripGeneratedHeader,
} = compiler;

const EXIT_DRIFT = 2;

const DRIFT_CLASSES = Object.freeze({
  STALE_SOURCE_DIGEST: 'STALE_SOURCE_DIGEST',
  STALE_COMPILED_BODY: 'STALE_COMPILED_BODY',
  UNRESOLVED_MARKERS: 'UNRESOLVED_MARKERS',
  TOOL_ALLOWLIST_OVERFLOW: 'TOOL_ALLOWLIST_OVERFLOW',
  ENUMERATED_SOURCE_GAP: 'ENUMERATED_SOURCE_GAP',
});

const SHARED_AUTHORITY_SOURCES = [
  '.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md',
  '.opencode/skills/deep-loop-workflows/mode-registry.json',
  '.opencode/skills/deep-loop-workflows/SKILL.md',
  '.opencode/skills/deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs',
];

const DECLARED_MODE_AUTHORITY_EXTENSIONS = [
  '.md',
  '.yaml',
  '.yml',
  '.json',
];

const AUTHORITY_EXTENSIONS = [
  '.md',
  '.yaml',
  '.yml',
  '.json',
  '.txt',
  '.tmpl',
];

const REQUIRED_RENDER_BLOCKS = ['auto', 'confirm'];

const PLACEHOLDER_PATTERN = /\[[A-Z][A-Z0-9_]*(?:[- ][A-Z0-9_]+)*\]/g;
const RELATIVE_PATH_PATTERN = /(?:^|["'`\s:=({])((?:\.opencode|specs)\/[^\s"'`)},]+(?:\.md\.tmpl|\.[A-Za-z0-9_-]+))/g;
const DECLARED_MODE_PATH_PATTERN = /(?:^|["'`\s:=({\[])((?:\.opencode\/|\.\.?\/|[A-Za-z0-9_-]+\/)[A-Za-z0-9_./-]+\.(?:md|ya?ml|json)(?:#[A-Za-z0-9_.-]+)?)/g;

function toPosixPath(inputPath) {
  return inputPath.split(path.sep).join('/');
}

function relPath(inputPath) {
  return toPosixPath(path.relative(WORKSPACE_ROOT, inputPath));
}

function absolutePath(sourcePath) {
  return path.resolve(WORKSPACE_ROOT, sourcePath);
}

function readText(sourcePath) {
  return fs.readFileSync(absolutePath(sourcePath), 'utf8');
}

function readContract(command, options = {}) {
  if (options.contractTextByCommand && Object.prototype.hasOwnProperty.call(options.contractTextByCommand, command)) {
    return options.contractTextByCommand[command];
  }
  return fs.readFileSync(outputPathFor(command), 'utf8');
}

function sourceExists(sourcePath) {
  return fs.existsSync(absolutePath(sourcePath));
}

function isChangelogOrReadme(sourcePath) {
  return /(^|\/)changelog\//i.test(sourcePath) || /(^|\/)README\.md$/i.test(sourcePath);
}

function isNonAuthoritySource(sourcePath) {
  if (isChangelogOrReadme(sourcePath)) return true;
  if (/(^|\/)node_modules\//.test(sourcePath)) return true;
  if (/(^|\/)tests\//.test(sourcePath)) return true;
  if (/(^|\/)behavior_benchmark\//.test(sourcePath)) return true;
  if (/(^|\/)feature_catalog\//.test(sourcePath)) return true;
  if (/(^|\/)manual_testing_playbook\//.test(sourcePath)) return true;
  if (/\/assets\/.*_(?:strategy|dashboard)\.md$/.test(sourcePath)) return true;
  return false;
}

function hasAuthorityExtension(sourcePath) {
  return AUTHORITY_EXTENSIONS.some((extension) => sourcePath.endsWith(extension));
}

function hasDeclaredModeAuthorityExtension(sourcePath) {
  return DECLARED_MODE_AUTHORITY_EXTENSIONS.some((extension) => sourcePath.endsWith(extension));
}

function isRuntimeScript(sourcePath) {
  return /\.(?:cjs|mjs|js|ts|tsx|py|sh)$/.test(sourcePath) && !sourcePath.endsWith('.md.tmpl');
}

function normalizeCandidatePath(candidate) {
  return candidate
    .replace(/^['"`]+|['"`,;:)]+$/g, '')
    .replace(/#.*$/, '')
    .trim();
}

function isAuthoritySource(sourcePath) {
  if (!sourcePath.startsWith('.opencode/')) return false;
  if (isNonAuthoritySource(sourcePath)) return false;
  if (isRuntimeScript(sourcePath)) return false;
  if (!hasAuthorityExtension(sourcePath)) return false;
  if (/\/SKILL\.md$/.test(sourcePath)) return true;
  if (/\.opencode\/commands\/deep\//.test(sourcePath)) return true;
  if (/\/references\/protocol\//.test(sourcePath)) return true;
  if (/\/references\/state\/state_format\.md$/.test(sourcePath)) return true;
  if (/\/references\/convergence\/convergence\.md$/.test(sourcePath)) return true;
  if (/\/assets\/[^/]+_config\.json$/.test(sourcePath)) return true;
  if (/\/assets\/[^/]+_mode_contract\.ya?ml$/.test(sourcePath)) return true;
  if (/\/assets\/context_report_template\.md$/.test(sourcePath)) return true;
  if (/\/assets\/prompt_pack_[^/]+\.md\.tmpl$/.test(sourcePath)) return true;
  if (/^\.opencode\/agents\/[^/]+\.md$/.test(sourcePath)) return true;
  if (/\/mode-registry\.json$/.test(sourcePath)) return true;
  return false;
}

function addAuthoritySource(sources, sourcePath, options = {}) {
  const normalized = normalizeCandidatePath(sourcePath);
  if (!normalized) return;
  if (options.force) {
    if (!normalized.startsWith('.opencode/') || isNonAuthoritySource(normalized)) return;
    sources.add(normalized);
    return;
  }
  if (!isAuthoritySource(normalized)) return;
  sources.add(normalized);
}

function extractPathCandidates(text) {
  const paths = [];
  for (const match of text.matchAll(RELATIVE_PATH_PATTERN)) {
    paths.push(normalizeCandidatePath(match[1]));
  }
  return paths;
}

function addPathCandidates(sources, text) {
  for (const candidate of extractPathCandidates(text)) {
    addAuthoritySource(sources, candidate);
  }
}

function isPathUnderRoot(sourcePath, rootPath) {
  return sourcePath === rootPath || sourcePath.startsWith(`${rootPath}/`);
}

function resolveDeclaredModePath(candidate, baseDir) {
  const normalized = normalizeCandidatePath(candidate);
  if (!normalized || /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized)) return null;
  if (normalized.startsWith('.opencode/')) return path.posix.normalize(normalized);
  if (normalized.startsWith('/')) return null;
  return path.posix.normalize(path.posix.join(baseDir, normalized));
}

function isDeclaredModeAuthoritySource(sourcePath, modeRoot) {
  if (!isPathUnderRoot(sourcePath, modeRoot)) return false;
  if (isNonAuthoritySource(sourcePath)) return false;
  if (isRuntimeScript(sourcePath)) return false;
  return hasDeclaredModeAuthorityExtension(sourcePath);
}

function addDeclaredModeAuthoritySources(sources, text, baseDir, modeRoot, expectedSources) {
  for (const match of text.matchAll(DECLARED_MODE_PATH_PATTERN)) {
    const sourcePath = resolveDeclaredModePath(match[1], baseDir);
    if (!sourcePath || !isDeclaredModeAuthoritySource(sourcePath, modeRoot)) continue;
    if (!expectedSources.has(sourcePath)) continue;
    if (sourceExists(sourcePath)) sources.add(sourcePath);
  }
}

function extractTopLevelBlock(text, blockName) {
  const lines = text.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.trim() === `${blockName}:`);
  if (startIndex === -1) return '';
  const block = [lines[startIndex]];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() && !line.startsWith(' ') && !line.startsWith('-') && !line.startsWith('#')) break;
    block.push(line);
  }
  return block.join('\n');
}

function addYamlAuthoritySources(sources, yamlText) {
  const skillReferenceBlock = extractTopLevelBlock(yamlText, 'skill_reference')
    .split(/\r?\n/)
    .filter((line) => !/^\s*prompt_framing:/.test(line))
    .join('\n');
  addPathCandidates(sources, skillReferenceBlock);

  for (const candidate of extractPathCandidates(yamlText)) {
    if (/^\.opencode\/agents\/[^/]+\.md$/.test(candidate)) {
      addAuthoritySource(sources, candidate);
      continue;
    }
    if (/\/assets\/prompt_pack_[^/]+\.md\.tmpl$/.test(candidate)) {
      addAuthoritySource(sources, candidate);
    }
  }
}

function addSpineAuthoritySources(sources, definition) {
  const spinePaths = [
    definition.commandPath,
    definition.presentationPath,
    definition.autoWorkflowPath,
    definition.confirmWorkflowPath,
    ...SHARED_AUTHORITY_SOURCES,
    definition.modeSkillPath,
    definition.agentPath,
  ];

  for (const sourcePath of spinePaths) {
    addAuthoritySource(sources, sourcePath, { force: true });
  }
}

function addDeclaredModeSources(sources, definition) {
  const modeRoot = path.posix.dirname(definition.modeSkillPath);
  const expectedSources = new Set(definition.sourcePaths || []);
  addDeclaredModeAuthoritySources(sources, readText(definition.modeSkillPath), modeRoot, modeRoot, expectedSources);
  addDeclaredModeAuthoritySources(
    sources,
    readText(definition.agentPath),
    path.posix.dirname(definition.agentPath),
    modeRoot,
    expectedSources,
  );
}

function deriveAuthoritySources(command) {
  const definition = getCommandDefinition(command);
  const sources = new Set();

  addSpineAuthoritySources(sources, definition);

  addPathCandidates(sources, readText(definition.commandPath));
  for (const candidate of extractPathCandidates(readText(definition.presentationPath))) {
    if (/\/auto_mode_contract\.md$/.test(candidate)) addAuthoritySource(sources, candidate);
  }
  addYamlAuthoritySources(sources, readText(definition.autoWorkflowPath));
  addYamlAuthoritySources(sources, readText(definition.confirmWorkflowPath));
  addDeclaredModeSources(sources, definition);

  return Array.from(sources).sort();
}

function extractSection(contractText, heading) {
  const startMarker = `## ${heading}`;
  const start = contractText.indexOf(startMarker);
  if (start === -1) return '';
  const next = contractText.indexOf('\n## ', start + startMarker.length);
  return contractText.slice(start, next === -1 ? contractText.length : next);
}

function parseYamlListBlock(section, listKey) {
  const items = [];
  const lines = section.split(/\r?\n/);
  let inList = false;
  for (const line of lines) {
    if (line.trim() === `${listKey}:`) {
      inList = true;
      continue;
    }
    if (!inList) continue;
    if (/^\S/.test(line) && line.trim().endsWith(':')) break;
    const itemMatch = line.match(/^\s*-\s*(.+?)\s*$/);
    if (!itemMatch) continue;
    items.push(parseScalar(itemMatch[1]));
  }
  return items;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    try {
      return JSON.parse(trimmed);
    } catch (_error) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function parseContractAllowedTools(contractText) {
  return parseYamlListBlock(extractSection(contractText, 'tools'), 'allowed');
}

function parseFrontmatter(commandMarkdown) {
  if (!commandMarkdown.startsWith('---\n')) return '';
  const end = commandMarkdown.indexOf('\n---', 4);
  if (end === -1) return '';
  return commandMarkdown.slice(4, end);
}

function expandAllowedTool(toolName) {
  const tools = new Set([toolName]);
  if (toolName.startsWith('mcp__')) {
    const parts = toolName.split('__');
    tools.add(parts[parts.length - 1]);
  }
  return tools;
}

function parseCommandAllowedTools(commandMarkdown) {
  const frontmatter = parseFrontmatter(commandMarkdown);
  const tools = new Set();
  const lines = frontmatter.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const inlineMatch = line.match(/^allowed-tools:\s*(.+)$/);
    if (inlineMatch) {
      for (const item of inlineMatch[1].split(',')) {
        for (const expanded of expandAllowedTool(parseScalar(item.trim()))) tools.add(expanded);
      }
      continue;
    }
    if (line.trim() !== 'allowed-tools:') continue;
    for (let innerIndex = index + 1; innerIndex < lines.length; innerIndex += 1) {
      const itemMatch = lines[innerIndex].match(/^\s*-\s*(.+?)\s*$/);
      if (!itemMatch) break;
      for (const expanded of expandAllowedTool(parseScalar(itemMatch[1]))) tools.add(expanded);
    }
  }
  return tools;
}

function findToolAllowlistOverflow(command, contractText) {
  const definition = getCommandDefinition(command);
  const commandTools = parseCommandAllowedTools(readText(definition.commandPath));
  const overflows = [];

  for (const tool of parseContractAllowedTools(contractText)) {
    if (!commandTools.has(tool)) overflows.push(tool);
  }

  return overflows;
}

function extractRenderBlock(contractText, blockName) {
  const startMarker = `<!-- START renderBlocks.${blockName} -->`;
  const endMarker = `<!-- END renderBlocks.${blockName} -->`;
  const start = contractText.indexOf(startMarker);
  const end = contractText.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1) return null;
  return contractText.slice(start + startMarker.length, end);
}

function renderBlockPayload(blockText) {
  return blockText
    .replace(/^\s*~~~[^\n]*\n/, '')
    .replace(/\n~~~\s*$/, '')
    .trim();
}

function findUnresolvedMarkers(contractText) {
  const issues = [];
  const markers = Array.from(new Set(contractText.match(PLACEHOLDER_PATTERN) || []));
  for (const marker of markers) {
    issues.push(`unresolved placeholder token ${marker}`);
  }

  for (const blockName of REQUIRED_RENDER_BLOCKS) {
    const block = extractRenderBlock(contractText, blockName);
    if (block === null) {
      issues.push(`missing renderBlocks.${blockName}`);
      continue;
    }
    if (!renderBlockPayload(block)) issues.push(`empty renderBlocks.${blockName}`);
  }

  return issues;
}

function driftFailure(command, driftClass, reason, details = {}) {
  return { command, class: driftClass, reason, ...details };
}

function checkSourceDigests(command, header) {
  const failures = [];
  for (const digest of header.sourceDigests || []) {
    if (!sourceExists(digest.path)) {
      failures.push(driftFailure(
        command,
        DRIFT_CLASSES.STALE_SOURCE_DIGEST,
        `listed source file is missing: ${digest.path}`,
      ));
      continue;
    }
    const liveSha256 = sha256File(digest.path);
    if (liveSha256 !== digest.sha256) {
      failures.push(driftFailure(
        command,
        DRIFT_CLASSES.STALE_SOURCE_DIGEST,
        `source digest mismatch for ${digest.path}`,
        { recordedSha256: digest.sha256, liveSha256 },
      ));
    }
  }
  return failures;
}

function checkCompiledBody(command, contractText, header, acceptCompiledDrift) {
  const freshContract = buildContract(command);
  const checkedInBody = normalizeCompiledBody(stripGeneratedHeader(contractText));
  const freshBody = normalizeCompiledBody(stripGeneratedHeader(freshContract));
  const checkedInDigest = computeCompiledBodyDigest(checkedInBody);
  const freshDigest = computeCompiledBodyDigest(freshBody);
  const bodyMatches = checkedInBody === freshBody;
  const headerDigestMatches = header.compiledBodyDigest === checkedInDigest;
  if (bodyMatches && headerDigestMatches) return { failures: [], warnings: [] };

  const drift = driftFailure(
    command,
    DRIFT_CLASSES.STALE_COMPILED_BODY,
    bodyMatches
      ? 'compiledBodyDigest metadata does not match checked-in body'
      : 'compiled body differs from freshly generated compiler output',
    { checkedInDigest, freshDigest },
  );

  if (acceptCompiledDrift) return { failures: [], warnings: [drift] };
  return { failures: [drift], warnings: [] };
}

function checkUnresolvedMarkers(command, contractText) {
  return findUnresolvedMarkers(contractText).map((reason) => driftFailure(
    command,
    DRIFT_CLASSES.UNRESOLVED_MARKERS,
    reason,
  ));
}

function checkToolAllowlist(command, contractText) {
  return findToolAllowlistOverflow(command, contractText).map((tool) => driftFailure(
    command,
    DRIFT_CLASSES.TOOL_ALLOWLIST_OVERFLOW,
    `contract allows ${tool}, but command frontmatter does not`,
    { tool },
  ));
}

function checkEnumeratedSourceGaps(command, header) {
  const recordedSources = new Set((header.sourceDigests || []).map((digest) => digest.path));
  const referencedSources = deriveAuthoritySources(command);
  return referencedSources
    .filter((sourcePath) => !recordedSources.has(sourcePath))
    .map((sourcePath) => driftFailure(
      command,
      DRIFT_CLASSES.ENUMERATED_SOURCE_GAP,
      `referenced authority source is missing from sourceDigests: ${sourcePath}`,
      { sourcePath },
    ));
}

function checkCommand(command, options = {}) {
  getCommandDefinition(command);
  const acceptCompiledDrift = Boolean(options.acceptCompiledDrift);
  const contractText = readContract(command, options);
  const header = parseDigestHeader(contractText);
  const compiledBodyResult = checkCompiledBody(command, contractText, header, acceptCompiledDrift);
  const failures = [
    ...checkSourceDigests(command, header),
    ...compiledBodyResult.failures,
    ...checkUnresolvedMarkers(command, contractText),
    ...checkToolAllowlist(command, contractText),
    ...checkEnumeratedSourceGaps(command, header),
  ];

  return {
    command,
    failures,
    warnings: compiledBodyResult.warnings,
  };
}

function commandsToCheck(args) {
  if (args.command) return [args.command];
  return Object.keys(COMMANDS);
}

function checkContracts(options = {}) {
  const commands = options.commands || commandsToCheck(options);
  const results = commands.map((command) => checkCommand(command, options));
  return {
    commands,
    results,
    failures: results.flatMap((result) => result.failures),
    warnings: results.flatMap((result) => result.warnings),
  };
}

function parseArgs(argv) {
  const args = { acceptCompiledDrift: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--command') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error('--command requires a value');
      getCommandDefinition(value);
      args.command = value;
      index += 1;
      continue;
    }
    if (token === '--accept-compiled-drift') {
      args.acceptCompiledDrift = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }
  return args;
}

function printHelp() {
  process.stdout.write('Usage: node check-contract-drift.cjs [--command deep/context|deep/review|deep/research] [--accept-compiled-drift]\n');
}

function formatDrift(prefix, drift) {
  const fields = [`command=${drift.command}`, `class=${drift.class}`, `reason=${drift.reason}`];
  if (drift.checkedInDigest) fields.push(`checkedInDigest=${drift.checkedInDigest}`);
  if (drift.freshDigest) fields.push(`freshDigest=${drift.freshDigest}`);
  if (drift.recordedSha256) fields.push(`recordedSha256=${drift.recordedSha256}`);
  if (drift.liveSha256) fields.push(`liveSha256=${drift.liveSha256}`);
  return `${prefix} ${fields.join(' ')}\n`;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return 0;
  }

  const result = checkContracts(args);
  for (const warning of result.warnings) {
    process.stdout.write(formatDrift('[CONTRACT DRIFT WARNING]', warning));
  }
  if (result.failures.length > 0) {
    for (const failure of result.failures) {
      process.stderr.write(formatDrift('[CONTRACT DRIFT]', failure));
    }
    return EXIT_DRIFT;
  }

  process.stdout.write(`[CONTRACT DRIFT] OK commands=${result.commands.length}\n`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    process.stderr.write(`[CONTRACT DRIFT] ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  DRIFT_CLASSES,
  EXIT_DRIFT,
  checkCommand,
  checkContracts,
  deriveAuthoritySources,
  findToolAllowlistOverflow,
  findUnresolvedMarkers,
  main,
  parseArgs,
  parseCommandAllowedTools,
  parseContractAllowedTools,
  sha256,
  relPath,
};
