#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sk-doc-command.cjs — command-surface peer authority adapter             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Implements discover(scope), standardSource(authority) and               ║
// ║ check(artifact, rules, options) for canonical OpenCode commands.         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * This adapter checks cross-artifact command integrity. Generic command
 * document validation remains outside this module and retains its own output
 * vocabulary and exit contract.
 *
 * Module usage:
 *   const adapter = require('./sk-doc-command.cjs');
 *   const discovered = adapter.discover({ type: 'paths', values: ['.opencode/commands'] });
 *   const rules = adapter.standardSource('sk-doc');
 *   const findings = adapter.check(discovered.artifacts[0], rules);
 *
 * CLI usage:
 *   node sk-doc-command.cjs discover [--glob] <scope-value...>
 *   node sk-doc-command.cjs check <artifact-path> [--root <repo-shaped-root>]
 *   node sk-doc-command.cjs standard-source
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..');
const REPO_ROOT = path.resolve(SKILLS_DIR, '..', '..');
const REFERENCE_CHECKS_CJS = path.join(
  REPO_ROOT,
  '.opencode',
  'commands',
  'scripts',
  'validate-command-references.cjs',
);
const SYNC_PROMPTS_CJS = path.join(
  SKILLS_DIR,
  'system-spec-kit',
  'scripts',
  'codex',
  'sync-prompts.cjs',
);
const COMMAND_CANON = path.join(SKILLS_DIR, 'sk-doc', 'create-command', 'SKILL.md');
const TOPOLOGY_TAXONOMY = path.join(
  REPO_ROOT,
  '.opencode',
  'specs',
  'system-deep-loop',
  '066-command-surface-benchmark',
  '000-command-benchmark-contract',
  'topology-taxonomy.md',
);
const ADAPTER_REFERENCE = path.resolve(
  __dirname,
  '..',
  '..',
  'references',
  'adapters',
  'sk_doc_command_adapter.md',
);
const KNOWN_DEVIATIONS_MD = path.resolve(
  __dirname,
  '..',
  '..',
  'references',
  'adapters',
  'sk_doc_command_known_deviations.md',
);

const referenceChecks = require(REFERENCE_CHECKS_CJS);

const FINDING_RULES = Object.freeze({
  'mirror-missing': ['CMD-S1-MIRROR-MISSING', 'P0', 'S1'],
  'mirror-drift': ['CMD-S1-MIRROR-DRIFT', 'P1', 'S1'],
  'orphan-mirror': ['CMD-S1-ORPHAN-MIRROR', 'P1', 'S1'],
});

const PRESENTATION_MARKER = /\[presentation:([a-z0-9-]+)\]/g;
const SUBACTION_ROUTE = /^\s*-\s*`([a-z][a-z0-9-]*)`\s*->\s*`(\.opencode\/commands\/[^`]+\.ya?ml)`/gm;

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function isInside(basePath, candidatePath) {
  const relative = path.relative(path.resolve(basePath), path.resolve(candidatePath));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function lineNumber(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function makeFinding(code, severity, dimension, file, line) {
  const artifactPath = toPosix(file);
  const location = `${artifactPath}:${line}`;
  return {
    code,
    severity,
    dimension,
    location,
    type: code,
    artifactPath,
    message: `${code} at line ${line} (${location})`,
  };
}

function compareFindings(left, right) {
  return left.code.localeCompare(right.code)
    || left.location.localeCompare(right.location)
    || left.severity.localeCompare(right.severity);
}

function dedupeFindings(findings) {
  const unique = new Map();
  for (const finding of findings) {
    const key = [finding.code, finding.severity, finding.dimension, finding.location].join('\0');
    unique.set(key, finding);
  }
  return [...unique.values()].sort(compareFindings);
}

function globToRegExp(glob) {
  let pattern = '';
  for (let index = 0; index < glob.length; index += 1) {
    const character = glob[index];
    if (character === '*' && glob[index + 1] === '*') {
      pattern += '.*';
      index += 1;
      if (glob[index + 1] === '/') index += 1;
    } else if (character === '*') {
      pattern += '[^/]*';
    } else if (character === '?') {
      pattern += '[^/]';
    } else if (/[.+^${}()|[\]\\]/.test(character)) {
      pattern += `\\${character}`;
    } else {
      pattern += character;
    }
  }
  return new RegExp(`^${pattern}$`);
}

function selectInventoryPaths(inventory, scope) {
  if (scope.type === 'paths') {
    const values = Array.isArray(scope.values) ? scope.values : [];
    return inventory.filter((entry) => values.some((value) => {
      const normalized = toPosix(String(value)).replace(/\/$/, '');
      return entry.source === normalized || entry.source.startsWith(`${normalized}/`);
    }));
  }
  if (scope.type === 'globs') {
    const values = Array.isArray(scope.values) ? scope.values : [];
    const positive = values.filter((value) => !String(value).startsWith('!')).map(globToRegExp);
    const negative = values.filter((value) => String(value).startsWith('!'))
      .map((value) => globToRegExp(String(value).slice(1)));
    return inventory.filter((entry) => positive.some((matcher) => matcher.test(entry.source))
      && !negative.some((matcher) => matcher.test(entry.source)));
  }
  return [];
}

function runSyncInventoryCheck() {
  const result = spawnSync(process.execPath, [SYNC_PROMPTS_CJS, '--check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
    timeout: 60000,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  const countMatch = output.match(/PASS:\s+(\d+) prompts are in sync/);
  return {
    ok: !result.error && result.status === 0,
    exitCode: result.error ? null : result.status,
    count: countMatch ? Number(countMatch[1]) : null,
    output,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISCOVER(SCOPE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Discover canonical command sources using the shared reference-check inventory
 * and require the exact prompt-sync gate to agree with its live count.
 *
 * @param {{type:'paths'|'globs',values:string[]}|{type:'branchRange',from:string,to:string}} scope
 * @returns {{artifacts:Array<{path:string}>,nodes:Array<Object>}}
 */
function discover(scope) {
  if (!scope || typeof scope !== 'object' || typeof scope.type !== 'string') {
    throw new Error('discover(scope): scope must be an object with a supported type');
  }
  if (scope.type === 'branchRange') return { artifacts: [], nodes: [] };
  if (!['paths', 'globs'].includes(scope.type)) {
    throw new Error(`discover(scope): unknown scope.type "${scope.type}"`);
  }

  const inventory = referenceChecks.inspectCommandSurface(REPO_ROOT).inventory;
  const sync = runSyncInventoryCheck();
  if (!sync.ok) {
    throw new Error(`discover(scope): prompt-sync inventory check failed with exit ${sync.exitCode}`);
  }
  if (sync.count !== inventory.length) {
    throw new Error(
      `discover(scope): shared inventory count ${inventory.length} differs from prompt-sync count ${sync.count}`,
    );
  }

  const selected = selectInventoryPaths(inventory, scope);
  const artifacts = selected.map((entry) => ({ path: entry.source }));
  const nodes = selected.map((entry) => ({
    id: `file:${entry.source}`,
    kind: 'FILE',
    name: entry.source,
    metadata: {
      authority: 'sk-doc',
      artifactClass: 'docs',
      adapter: 'sk-doc-command',
      topology: entry.topology,
    },
  }));
  return { artifacts, nodes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. KNOWN-DEVIATION SUPPRESSION
// ─────────────────────────────────────────────────────────────────────────────

function loadKnownDeviations() {
  let text;
  try {
    text = fs.readFileSync(KNOWN_DEVIATIONS_MD, 'utf8');
  } catch (error) {
    return [];
  }
  const block = text.match(/```json\n([\s\S]*?)\n```/);
  if (!block) return [];
  try {
    const parsed = JSON.parse(block[1]);
    return Array.isArray(parsed.deviations) ? parsed.deviations : [];
  } catch (error) {
    return [];
  }
}

function suppressKnownDeviations(findings, deviations) {
  if (!Array.isArray(deviations) || deviations.length === 0) return findings;
  return findings.filter((finding) => !deviations.some((deviation) => {
    if (!Array.isArray(deviation.matchCodes) || !deviation.matchCodes.includes(finding.code)) {
      return false;
    }
    return !Array.isArray(deviation.matchLocations)
      || deviation.matchLocations.some((prefix) => finding.location.startsWith(prefix));
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. STANDARDSOURCE(AUTHORITY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return the command canon, shared checkers and adapter-owned rule sources.
 *
 * @param {string} authority - Must be sk-doc because the peer keeps the docs lane.
 * @returns {Object}
 */
function standardSource(authority) {
  if (authority !== 'sk-doc') {
    throw new Error(`sk-doc-command standardSource() called with unsupported authority "${authority}"`);
  }
  return {
    authority: 'sk-doc',
    adapter: 'sk-doc-command',
    validators: {
      referenceChecks: { tool: 'validate-command-references.cjs', path: REFERENCE_CHECKS_CJS },
      syncInventory: { tool: 'sync-prompts.cjs', path: SYNC_PROMPTS_CJS },
    },
    templates: {
      commandCanon: COMMAND_CANON,
    },
    rules: {
      topologyTaxonomy: TOPOLOGY_TAXONOMY,
      adapterReference: ADAPTER_REFERENCE,
      knownDeviationsDocument: KNOWN_DEVIATIONS_MD,
    },
    knownDeviations: loadKnownDeviations(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. COMMAND PARSERS
// ─────────────────────────────────────────────────────────────────────────────

function extractAllowedTools(text) {
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  const allowed = frontmatter && frontmatter[1].match(/^allowed-tools:\s*(.+)$/m);
  return new Set(allowed ? allowed[1].split(',').map((item) => item.trim()).filter(Boolean) : []);
}

function extractRequiredTools(text) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => /^required_tools:\s*$/.test(line));
  if (start === -1) return [];
  const required = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s+-\s+([A-Za-z][A-Za-z0-9_-]*)\s*$/);
    if (!match) break;
    required.push({ tool: match[1], line: index + 1 });
  }
  return required;
}

function extractPresentationMarkers(text) {
  const markers = [];
  PRESENTATION_MARKER.lastIndex = 0;
  let match;
  while ((match = PRESENTATION_MARKER.exec(text)) !== null) {
    markers.push({ marker: match[1], line: lineNumber(text, match.index) });
  }
  return markers;
}

function parseScalar(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*([^\\s#]+)`, 'm'));
  return match ? match[1] : null;
}

function parseSubaction(text) {
  return parseScalar(text, 'subaction');
}

function readCommand(rootDir, source) {
  return fs.readFileSync(path.join(rootDir, source), 'utf8');
}

function workflowTargets(sourceText) {
  return [...new Set(referenceChecks.extractCommandTargets(sourceText)
    .map((reference) => reference.target)
    .filter((target) => /\.ya?ml$/.test(target)))];
}

// A command reference inside a workflow or route manifest is an executable
// dispatch edge only when it sits in a structural value position — a mapping
// value, a sequence item, or a subaction route arrow. References inside YAML
// comments or prose sentences are never edges, so documentation that merely
// names a command can no longer fabricate a route cycle.
const EXECUTABLE_EDGE =
  /(?::\s*|^\s*-\s*|->\s*)(["'`]?)(\.opencode\/commands\/[A-Za-z0-9._/-]+\.(?:md|ya?ml|txt))\1/;

function stripInlineYamlComment(line) {
  // Drop a trailing inline comment (whitespace then '#' to end of line). Command
  // paths contain no '#', so this can never truncate a real dispatch target.
  return line.replace(/\s+#.*$/, '');
}

function edgeKind(line, target) {
  if (/^\s*-\s*`[^`]+`\s*->/.test(line)) return 'subaction';
  if (/\.ya?ml$/.test(target)) return 'workflow';
  return 'direct';
}

function executableCommandEdges(text) {
  const edges = [];
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    if (/^\s*#/.test(raw)) continue;
    const line = stripInlineYamlComment(raw);
    const match = line.match(EXECUTABLE_EDGE);
    if (!match) continue;
    edges.push({ target: match[2], line: index + 1, kind: edgeKind(line, match[2]) });
  }
  return edges;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. DIMENSION CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function checkMirrorAndReachability(surface, selectedSources) {
  const findings = [];
  for (const violation of surface.violations) {
    if (!selectedSources.has(violation.source)) continue;
    const mirrorRule = FINDING_RULES[violation.kind];
    if (mirrorRule) {
      findings.push(makeFinding(mirrorRule[0], mirrorRule[1], mirrorRule[2], violation.file, violation.line));
      continue;
    }
    if (violation.kind !== 'command-target') continue;
    let code = 'CMD-S2-EXECUTION-TARGET-MISSING';
    let severity = 'P0';
    if (/\.ya?ml$/.test(violation.ref)) code = 'CMD-S2-WORKFLOW-TARGET-MISSING';
    if (/presentation[^/]*\.txt$/.test(violation.ref)) {
      code = 'CMD-S2-PRESENTATION-TARGET-MISSING';
      severity = 'P1';
    }
    findings.push(makeFinding(code, severity, 'S2', violation.file, violation.line));
  }
  return findings;
}

function checkRouteGraph(rootDir, source, sourceText, topology) {
  const findings = [];
  if (topology === 'UNCLASSIFIED') {
    findings.push(makeFinding('CMD-S3-TOPOLOGY-UNCLASSIFIED', 'P0', 'S3', source, 1));
  }

  SUBACTION_ROUTE.lastIndex = 0;
  let route;
  while ((route = SUBACTION_ROUTE.exec(sourceText)) !== null) {
    const targetPath = path.join(rootDir, route[2]);
    if (!fs.existsSync(targetPath)) continue;
    const declared = parseSubaction(fs.readFileSync(targetPath, 'utf8'));
    if (declared && declared !== route[1]) {
      findings.push(makeFinding(
        'CMD-S3-SUBACTION-TARGET-MISMATCH',
        'P1',
        'S3',
        source,
        lineNumber(sourceText, route.index),
      ));
    }
  }

  for (const target of workflowTargets(sourceText)) {
    const targetPath = path.join(rootDir, target);
    if (!fs.existsSync(targetPath)) continue;
    const targetText = fs.readFileSync(targetPath, 'utf8');
    const backEdge = executableCommandEdges(targetText)
      .find((edge) => edge.target === source);
    if (backEdge) {
      findings.push(makeFinding('CMD-S3-ROUTE-CYCLE', 'P0', 'S3', target, backEdge.line));
    }
  }
  return findings;
}

function checkCapabilitiesAndSafety(rootDir, sourceText) {
  const allowedTools = extractAllowedTools(sourceText);
  const findings = [];
  for (const target of workflowTargets(sourceText)) {
    const targetPath = path.join(rootDir, target);
    if (!fs.existsSync(targetPath)) continue;
    const targetText = fs.readFileSync(targetPath, 'utf8');
    for (const requirement of extractRequiredTools(targetText)) {
      if (!allowedTools.has(requirement.tool)) {
        findings.push(makeFinding(
          'CMD-S4-CAPABILITY-UNDECLARED',
          'P1',
          'S4',
          target,
          requirement.line,
        ));
      }
    }
    if (parseScalar(targetText, 'mutation_class') === 'destructive'
      && parseScalar(targetText, 'requires_confirmation') === 'false') {
      const offset = targetText.indexOf('requires_confirmation: false');
      findings.push(makeFinding(
        'CMD-S4-DESTRUCTIVE-WITHOUT-CONFIRMATION',
        'P0',
        'S4',
        target,
        lineNumber(targetText, offset),
      ));
    }
  }
  return findings;
}

function checkPresentationOwnership(rootDir, source, sourceText) {
  const sourceMarkers = extractPresentationMarkers(sourceText);
  const targetMarkers = new Set();
  const findings = [];

  for (const reference of referenceChecks.extractCommandTargets(sourceText)) {
    const targetPath = path.join(rootDir, reference.target);
    if (!fs.existsSync(targetPath)) continue;
    const targetText = fs.readFileSync(targetPath, 'utf8');
    for (const marker of extractPresentationMarkers(targetText)) targetMarkers.add(marker.marker);

    if (/\.txt$/.test(reference.target)) {
      const exactAsset = targetText.trim();
      const offset = exactAsset.length > 0 ? sourceText.indexOf(exactAsset) : -1;
      if (offset !== -1) {
        findings.push(makeFinding(
          'CMD-S5-PRESENTATION-ASSET-LEAKED',
          'P2',
          'S5',
          source,
          lineNumber(sourceText, offset),
        ));
      }
    }
  }

  for (const marker of sourceMarkers) {
    if (targetMarkers.has(marker.marker)) {
      findings.push(makeFinding(
        'CMD-S5-PRESENTATION-OWNER-DUPLICATED',
        'P2',
        'S5',
        source,
        marker.line,
      ));
    }
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CHECK(ARTIFACT, RULES, OPTIONS)
// ─────────────────────────────────────────────────────────────────────────────

function normalizeCheckCall(rulesOrOptions, maybeOptions) {
  if (maybeOptions !== undefined) {
    return { rules: rulesOrOptions || standardSource('sk-doc'), options: maybeOptions || {} };
  }
  if (rulesOrOptions && (rulesOrOptions.rootDir || rulesOrOptions.fullCorpus !== undefined)) {
    return { rules: standardSource('sk-doc'), options: rulesOrOptions };
  }
  return { rules: rulesOrOptions || standardSource('sk-doc'), options: {} };
}

function normalizeArtifactPath(artifact, rootDir) {
  const rawPath = typeof artifact === 'string' ? artifact : artifact && artifact.path;
  if (typeof rawPath !== 'string') {
    throw new Error('check(artifact, rules, options): artifact must carry a path');
  }
  const absolute = path.isAbsolute(rawPath) ? rawPath : path.resolve(rootDir, rawPath);
  if (!isInside(rootDir, absolute)) {
    throw new Error(`check(): artifact path "${rawPath}" resolves outside the command root`);
  }
  return { absolute, relative: toPosix(path.relative(rootDir, absolute)) || '.' };
}

/**
 * Check one command source or a complete repository-shaped command corpus.
 * Passing options as the second argument is supported for fixture and direct
 * callers, while the engine-compatible rules plus options form remains intact.
 *
 * @param {string|{path:string}} artifact - Command source or corpus root.
 * @param {Object} [rulesOrOptions] - Standard sources or direct options.
 * @param {Object} [maybeOptions] - Options when rules are supplied separately.
 * @returns {Array<{code:string,severity:string,dimension:string,location:string}>}
 */
function check(artifact, rulesOrOptions, maybeOptions) {
  const { rules, options } = normalizeCheckCall(rulesOrOptions, maybeOptions);
  const rootDir = path.resolve(options.rootDir || REPO_ROOT);
  if (!isInside(REPO_ROOT, rootDir)) {
    throw new Error(`check(): rootDir "${rootDir}" resolves outside the repository`);
  }
  const normalized = normalizeArtifactPath(artifact, rootDir);
  const surface = referenceChecks.inspectCommandSurface(rootDir);
  const isDirectory = fs.existsSync(normalized.absolute) && fs.statSync(normalized.absolute).isDirectory();
  const fullCorpus = options.fullCorpus === true || isDirectory;
  const selectedEntries = fullCorpus
    ? surface.inventory
    : surface.inventory.filter((entry) => entry.source === normalized.relative);
  if (!fullCorpus && selectedEntries.length === 0) {
    throw new Error(`check(): artifact "${normalized.relative}" is not in the canonical command inventory`);
  }
  const selectedSources = new Set(selectedEntries.map((entry) => entry.source));
  const findings = checkMirrorAndReachability(surface, selectedSources);

  for (const entry of selectedEntries) {
    const sourceText = readCommand(rootDir, entry.source);
    findings.push(...checkRouteGraph(rootDir, entry.source, sourceText, entry.topology));
    findings.push(...checkCapabilitiesAndSafety(rootDir, sourceText));
    findings.push(...checkPresentationOwnership(rootDir, entry.source, sourceText));
  }

  const deviations = Array.isArray(rules.knownDeviations)
    ? rules.knownDeviations
    : loadKnownDeviations();
  return suppressKnownDeviations(dedupeFindings(findings), deviations);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function optionValue(args, option) {
  const index = args.indexOf(option);
  return index === -1 ? null : args[index + 1];
}

function runCli(argv) {
  const [subcommand, ...rest] = argv;
  if (subcommand === 'discover') {
    const isGlob = rest[0] === '--glob';
    const values = isGlob ? rest.slice(1) : rest;
    if (values.length === 0) throw new Error('discover requires at least one scope value');
    printJson(discover({ type: isGlob ? 'globs' : 'paths', values }));
    return;
  }
  if (subcommand === 'check') {
    const target = rest[0];
    if (!target) throw new Error('check requires an artifact path');
    const rootDir = optionValue(rest, '--root') || REPO_ROOT;
    printJson(check(target, { rootDir }));
    return;
  }
  if (subcommand === 'standard-source') {
    printJson(standardSource('sk-doc'));
    return;
  }
  throw new Error('Usage: sk-doc-command.cjs <discover|check|standard-source> [args...]');
}

if (require.main === module) {
  try {
    runCli(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`[sk-doc-command] ${error.message}\n`);
    process.exitCode = 1;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  discover,
  standardSource,
  check,
  loadKnownDeviations,
  runSyncInventoryCheck,
  executableCommandEdges,
};
