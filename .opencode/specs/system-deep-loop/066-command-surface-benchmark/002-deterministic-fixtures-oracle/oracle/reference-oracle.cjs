#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Independent Command Reference Oracle                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Classify fixture command trees and freeze expected findings.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// Keep the ground-truth classifier self-contained so production conformance
// code cannot share or import its implementation.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ORACLE_ID = 'command-surface-independent-reference-oracle';
const PHASE_ROOT = path.resolve(__dirname, '..');
const FIXTURE_MANIFEST_PATH = path.join(
  PHASE_ROOT,
  'fixtures',
  'mutation-manifest.json',
);
const EXPECTATIONS_ROOT = path.join(PHASE_ROOT, 'expectations');
const ORACLE_PATH = __filename;
const COMMAND_REFERENCE = /\.opencode\/commands\/[A-Za-z0-9._/-]+\.(?:md|ya?ml|txt)/g;
const PRESENTATION_MARKER = /\[presentation:([a-z0-9-]+)\]/g;
const EXPECTED_PUBLIC_DEFECTS = 8;
const EXPECTED_HELD_OUT = 4;

// ─────────────────────────────────────────────────────────────────────────────
// 3. FILE AND HASH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function findRepoRoot(startPath) {
  let current = path.resolve(startPath);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.opencode'))) return current;
    current = path.dirname(current);
  }
  throw new Error('Repository root could not be resolved.');
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function repoRelative(filePath) {
  return toPosix(path.relative(REPO_ROOT, filePath));
}

function ensureInside(basePath, candidatePath, label) {
  const resolved = path.resolve(candidatePath);
  const relative = path.relative(path.resolve(basePath), resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} escapes its allowed root: ${candidatePath}`);
  }
  return resolved;
}

function listFiles(rootPath) {
  if (!fs.existsSync(rootPath)) return [];
  const files = [];
  const stack = [rootPath];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.sort((left, right) => right.name.localeCompare(left.name));
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(absolute);
      if (entry.isFile()) files.push(absolute);
    }
  }
  return files.sort((left, right) => left.localeCompare(right));
}

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function hashFile(filePath) {
  return sha256(fs.readFileSync(filePath));
}

function hashTree(rootPath) {
  const hash = crypto.createHash('sha256');
  for (const filePath of listFiles(rootPath)) {
    hash.update(toPosix(path.relative(rootPath, filePath)));
    hash.update('\0');
    hash.update(fs.readFileSync(filePath));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function lineNumber(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function location(relativePath, line) {
  return `${toPosix(relativePath)}:${line}`;
}

function extractReferences(text) {
  const references = [];
  COMMAND_REFERENCE.lastIndex = 0;
  let match;
  while ((match = COMMAND_REFERENCE.exec(text)) !== null) {
    references.push({
      target: match[0],
      line: lineNumber(text, match.index),
    });
  }
  return references;
}

function extractAllowedTools(text) {
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) return new Set();
  const allowed = frontmatter[1].match(/^allowed-tools:\s*(.+)$/m);
  if (!allowed) return new Set();
  return new Set(
    allowed[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function extractRequiredTools(text) {
  const lines = text.split('\n');
  const required = [];
  const start = lines.findIndex((line) => /^required_tools:\s*$/.test(line));
  if (start === -1) return required;
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

function parseSubaction(text) {
  return text.match(/^subaction:\s*([a-z][a-z0-9-]*)\s*$/m)?.[1] || null;
}

function parseScalar(text, key) {
  return text.match(new RegExp(`^${key}:\\s*([^\\s#]+)`, 'm'))?.[1] || null;
}

function firstDifferentLine(actual, expected) {
  const actualLines = actual.split('\n');
  const expectedLines = expected.split('\n');
  const length = Math.max(actualLines.length, expectedLines.length);
  for (let index = 0; index < length; index += 1) {
    if (actualLines[index] !== expectedLines[index]) return index + 1;
  }
  return 1;
}

function expectedMirror(sourceRelative) {
  const commandRelative = sourceRelative.replace(/^\.opencode\/commands\//, '');
  const slug = commandRelative.replace(/\.md$/, '').replaceAll('/', '-');
  return (
    `<!-- Generated by sync-prompts.cjs from ${sourceRelative} — do not edit by hand. -->\n` +
    `# Codex entry: /${slug}\n\n` +
    `This is the Codex runtime entry point for the \`/${slug}\` command. ` +
    'The canonical, authoritative command definition lives in the OpenCode tree at:\n\n' +
    `\`${sourceRelative}\`\n\n` +
    "Read that file in full and follow it exactly as the command's instructions. " +
    "It is the single source of truth for this command's routing, assets, execution " +
    'targets, and presentation. Treat everything below the frontmatter there as ' +
    'your operating contract.\n\n' +
    'Arguments passed to this prompt are available as `$ARGUMENTS` and map to the ' +
    "canonical command's `$ARGUMENTS` / positional `$1`..`$N` inputs.\n\n" +
    'User request: $ARGUMENTS\n'
  );
}

function expectedMirrorRelative(sourceRelative) {
  const commandRelative = sourceRelative.replace(/^\.opencode\/commands\//, '');
  const slug = commandRelative.replace(/\.md$/, '').replaceAll('/', '-');
  return `.codex/prompts/${slug}.md`;
}

function makeFinding(code, severity, dimension, findingLocation) {
  return { code, severity, dimension, location: findingLocation };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. INDEPENDENT CLASSIFIER
// ─────────────────────────────────────────────────────────────────────────────

function classifyFixture(fixtureRoot) {
  const canonicalRoot = path.join(fixtureRoot, '.opencode', 'commands');
  const mirrorRoot = path.join(fixtureRoot, '.codex', 'prompts');
  const canonicalFiles = listFiles(canonicalRoot).filter((filePath) => filePath.endsWith('.md'));
  const mirrorFiles = listFiles(mirrorRoot).filter((filePath) => filePath.endsWith('.md'));
  const findings = [];
  const expectedMirrors = new Map();

  for (const sourcePath of canonicalFiles) {
    const sourceRelative = repoPathWithinFixture(fixtureRoot, sourcePath);
    const sourceText = fs.readFileSync(sourcePath, 'utf8');
    const mirrorRelative = expectedMirrorRelative(sourceRelative);
    const mirrorPath = path.join(fixtureRoot, mirrorRelative);
    expectedMirrors.set(mirrorRelative, sourceRelative);

    if (!fs.existsSync(mirrorPath)) {
      findings.push(
        makeFinding('CMD-S1-MIRROR-MISSING', 'P0', 'S1', `${mirrorRelative}:1`),
      );
    } else {
      const actualMirror = fs.readFileSync(mirrorPath, 'utf8');
      const wantedMirror = expectedMirror(sourceRelative);
      if (actualMirror !== wantedMirror) {
        findings.push(
          makeFinding(
            'CMD-S1-MIRROR-DRIFT',
            'P1',
            'S1',
            location(mirrorRelative, firstDifferentLine(actualMirror, wantedMirror)),
          ),
        );
      }
    }

    classifySourceTargets(fixtureRoot, sourceRelative, sourceText, findings);
    classifySourceRoutes(fixtureRoot, sourceRelative, sourceText, findings);
    classifyCapabilities(fixtureRoot, sourceText, findings);
    classifyPresentationOwnership(fixtureRoot, sourceRelative, sourceText, findings);
  }

  for (const mirrorPath of mirrorFiles) {
    const mirrorRelative = repoPathWithinFixture(fixtureRoot, mirrorPath);
    if (expectedMirrors.has(mirrorRelative)) continue;
    const mirrorText = fs.readFileSync(mirrorPath, 'utf8');
    const pointer = mirrorText.match(/`(\.opencode\/commands\/[^`]+\.md)`/);
    const pointerLine = pointer ? lineNumber(mirrorText, pointer.index) : 1;
    findings.push(
      makeFinding(
        'CMD-S1-ORPHAN-MIRROR',
        'P1',
        'S1',
        location(mirrorRelative, pointerLine),
      ),
    );
  }

  const uniqueFindings = new Map();
  for (const finding of findings) {
    const key = [finding.code, finding.severity, finding.dimension, finding.location].join('\0');
    uniqueFindings.set(key, finding);
  }
  return [...uniqueFindings.values()].sort(compareFindings);
}

function repoPathWithinFixture(fixtureRoot, filePath) {
  return toPosix(path.relative(fixtureRoot, filePath));
}

function classifySourceTargets(fixtureRoot, sourceRelative, sourceText, findings) {
  const references = extractReferences(sourceText);
  const seenTargets = new Set();
  for (const reference of references) {
    if (seenTargets.has(reference.target)) continue;
    seenTargets.add(reference.target);
    const targetPath = path.join(fixtureRoot, reference.target);
    if (fs.existsSync(targetPath)) continue;

    let code = 'CMD-S2-EXECUTION-TARGET-MISSING';
    let severity = 'P0';
    if (/\.ya?ml$/.test(reference.target)) {
      code = 'CMD-S2-WORKFLOW-TARGET-MISSING';
    } else if (/presentation[^/]*\.txt$/.test(reference.target)) {
      code = 'CMD-S2-PRESENTATION-TARGET-MISSING';
      severity = 'P1';
    }
    findings.push(
      makeFinding(code, severity, 'S2', location(sourceRelative, reference.line)),
    );
  }
}

function classifySourceRoutes(fixtureRoot, sourceRelative, sourceText, findings) {
  const routePattern =
    /^\s*-\s*`([a-z][a-z0-9-]*)`\s*->\s*`(\.opencode\/commands\/[^`]+\.ya?ml)`/gm;
  let route;
  while ((route = routePattern.exec(sourceText)) !== null) {
    const targetPath = path.join(fixtureRoot, route[2]);
    if (fs.existsSync(targetPath)) {
      const targetText = fs.readFileSync(targetPath, 'utf8');
      const declaredSubaction = parseSubaction(targetText);
      if (declaredSubaction && declaredSubaction !== route[1]) {
        findings.push(
          makeFinding(
            'CMD-S3-SUBACTION-TARGET-MISMATCH',
            'P1',
            'S3',
            location(sourceRelative, lineNumber(sourceText, route.index)),
          ),
        );
      }
    }
  }

  for (const reference of extractReferences(sourceText)) {
    const targetPath = path.join(fixtureRoot, reference.target);
    if (!fs.existsSync(targetPath) || !/\.ya?ml$/.test(reference.target)) continue;
    const targetText = fs.readFileSync(targetPath, 'utf8');
    const backEdge = extractReferences(targetText).find(
      (assetReference) => assetReference.target === sourceRelative,
    );
    if (backEdge) {
      findings.push(
        makeFinding(
          'CMD-S3-ROUTE-CYCLE',
          'P0',
          'S3',
          location(reference.target, backEdge.line),
        ),
      );
    }
  }
}

function classifyCapabilities(fixtureRoot, sourceText, findings) {
  const allowedTools = extractAllowedTools(sourceText);
  const workflowTargets = [
    ...new Set(
      extractReferences(sourceText)
        .map((reference) => reference.target)
        .filter((target) => /\.ya?ml$/.test(target)),
    ),
  ];

  for (const workflowRelative of workflowTargets) {
    const workflowPath = path.join(fixtureRoot, workflowRelative);
    if (!fs.existsSync(workflowPath)) continue;
    const workflowText = fs.readFileSync(workflowPath, 'utf8');
    for (const requirement of extractRequiredTools(workflowText)) {
      if (!allowedTools.has(requirement.tool)) {
        findings.push(
          makeFinding(
            'CMD-S4-CAPABILITY-UNDECLARED',
            'P1',
            'S4',
            location(workflowRelative, requirement.line),
          ),
        );
      }
    }

    const mutationClass = parseScalar(workflowText, 'mutation_class');
    const requiresConfirmation = parseScalar(workflowText, 'requires_confirmation');
    if (mutationClass === 'destructive' && requiresConfirmation === 'false') {
      const confirmationIndex = workflowText.indexOf('requires_confirmation: false');
      findings.push(
        makeFinding(
          'CMD-S4-DESTRUCTIVE-WITHOUT-CONFIRMATION',
          'P0',
          'S4',
          location(workflowRelative, lineNumber(workflowText, confirmationIndex)),
        ),
      );
    }
  }
}

function classifyPresentationOwnership(
  fixtureRoot,
  sourceRelative,
  sourceText,
  findings,
) {
  const sourceMarkers = extractPresentationMarkers(sourceText);
  if (sourceMarkers.length === 0) return;
  const targetMarkers = new Set();

  for (const reference of extractReferences(sourceText)) {
    const targetPath = path.join(fixtureRoot, reference.target);
    if (!fs.existsSync(targetPath)) continue;
    const targetText = fs.readFileSync(targetPath, 'utf8');
    for (const marker of extractPresentationMarkers(targetText)) {
      targetMarkers.add(marker.marker);
    }
  }

  for (const marker of sourceMarkers) {
    if (!targetMarkers.has(marker.marker)) continue;
    findings.push(
      makeFinding(
        'CMD-S5-PRESENTATION-OWNER-DUPLICATED',
        'P2',
        'S5',
        location(sourceRelative, marker.line),
      ),
    );
  }
}

function compareFindings(left, right) {
  return (
    left.code.localeCompare(right.code) ||
    left.location.localeCompare(right.location) ||
    left.severity.localeCompare(right.severity)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FREEZE AND VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

function fixtureInventory() {
  const mutationManifest = readJson(FIXTURE_MANIFEST_PATH);
  const publicDefects = mutationManifest.fixtures.filter(
    (fixture) => fixture.classification === 'public' && fixture.kind === 'defect',
  );
  const heldOut = mutationManifest.fixtures.filter(
    (fixture) => fixture.classification === 'held-out',
  );
  const controls = mutationManifest.fixtures.filter((fixture) => fixture.kind === 'control');

  if (publicDefects.length !== EXPECTED_PUBLIC_DEFECTS) {
    throw new Error(`Expected ${EXPECTED_PUBLIC_DEFECTS} public defects; found ${publicDefects.length}.`);
  }
  if (heldOut.length !== EXPECTED_HELD_OUT) {
    throw new Error(`Expected ${EXPECTED_HELD_OUT} held-out fixtures; found ${heldOut.length}.`);
  }
  if (controls.length !== 1 || controls[0].id !== mutationManifest.cleanBase.id) {
    throw new Error('Exactly one clean control must match cleanBase.id.');
  }

  return mutationManifest;
}

function collectOutcomes(mutationManifest) {
  const outcomes = [];
  for (const fixture of mutationManifest.fixtures) {
    const fixtureRoot = ensureInside(
      PHASE_ROOT,
      path.join(PHASE_ROOT, fixture.output),
      'Fixture output',
    );
    if (!fs.existsSync(fixtureRoot)) {
      throw new Error(`Fixture tree is missing: ${fixture.output}`);
    }
    const findings = classifyFixture(fixtureRoot);
    if (fixture.kind === 'control' && findings.length !== 0) {
      throw new Error(`Clean control produced ${findings.length} finding(s).`);
    }
    if (fixture.kind === 'defect' && findings.length === 0) {
      throw new Error(`Defect fixture produced no findings: ${fixture.id}`);
    }
    outcomes.push({
      ...fixture,
      fixtureRoot,
      hash: hashTree(fixtureRoot),
      findings,
    });
  }
  return outcomes;
}

function freezeExpectations(manifestPath) {
  const mutationManifest = fixtureInventory();
  const outcomes = collectOutcomes(mutationManifest);
  const oracleHash = hashFile(ORACLE_PATH);
  const corpusRoot = path.join(PHASE_ROOT, 'fixtures', 'corpus');
  const corpusHash = hashTree(corpusRoot);
  const verifiedAt = new Date().toISOString();

  for (const outcome of outcomes) {
    writeJson(path.join(EXPECTATIONS_ROOT, `${outcome.id}.json`), {
      schemaVersion: '1.0.0',
      fixtureId: outcome.id,
      classification: outcome.classification,
      fixtureHash: { algorithm: 'sha256', value: outcome.hash },
      oracleHash: { algorithm: 'sha256', value: oracleHash },
      findings: outcome.findings,
    });
  }

  const expectationIndex = {
    schemaVersion: '1.0.0',
    oracleId: ORACLE_ID,
    oracleHash: { algorithm: 'sha256', value: oracleHash },
    fixtureRootHash: { algorithm: 'sha256', value: corpusHash },
    fixtureCount: outcomes.length,
    publicDefectCount: EXPECTED_PUBLIC_DEFECTS,
    heldOutCount: EXPECTED_HELD_OUT,
    cleanControlId: mutationManifest.cleanBase.id,
    verifiedAt,
    fixtures: outcomes.map((outcome) => ({
      id: outcome.id,
      classification: outcome.classification,
      path: repoRelative(outcome.fixtureRoot),
      expectationPath: repoRelative(path.join(EXPECTATIONS_ROOT, `${outcome.id}.json`)),
      hash: { algorithm: 'sha256', value: outcome.hash },
      findings: outcome.findings,
    })),
  };
  writeJson(path.join(EXPECTATIONS_ROOT, 'index.json'), expectationIndex);

  const consumingManifest = {
    schemaVersion: '1.0.0',
    benchmarkId: 'command-surface',
    oracleProvenance: {
      oracleId: ORACLE_ID,
      implementationPath: repoRelative(ORACLE_PATH),
      versionOrCommit: `sha256:${oracleHash}`,
      verificationCommand:
        `node ${repoRelative(ORACLE_PATH)} --verify --manifest ${repoRelative(manifestPath)}`,
      verifiedAt,
      evidencePath: repoRelative(path.join(EXPECTATIONS_ROOT, 'index.json')),
    },
    productionAdapterImportProhibited: true,
    cleanControlFixtureId: mutationManifest.cleanBase.id,
    fixtureRoot: repoRelative(corpusRoot),
    fixtureRootHash: { algorithm: 'sha256', value: corpusHash },
    fixtures: outcomes.map((outcome) => ({
      id: outcome.id,
      classification: outcome.classification,
      path: repoRelative(outcome.fixtureRoot),
      hash: { algorithm: 'sha256', value: outcome.hash },
      mutations: outcome.mutations.map((mutation) => ({
        id: mutation.id,
        operation: mutation.operation,
        target: mutation.target,
        description: mutation.description,
      })),
      expectedFindings: outcome.findings.map((finding) => ({
        code: finding.code,
        severity: finding.severity,
        dimension: finding.dimension,
        locations: [finding.location],
      })),
    })),
  };
  writeJson(manifestPath, consumingManifest);

  console.log(
    `[reference-oracle] Froze ${outcomes.length} expectation sets; ` +
      `clean=0 public=${EXPECTED_PUBLIC_DEFECTS} held-out=${EXPECTED_HELD_OUT}.`,
  );
}

function verifyAdapterBoundary(consumingManifest) {
  const adapterPath = path.join(
    REPO_ROOT,
    '.opencode',
    'skills',
    'system-deep-loop',
    'deep-alignment',
    'scripts',
    'adapters',
    'sk-doc-command.cjs',
  );
  if (!fs.existsSync(adapterPath)) return;
  const adapterText = fs.readFileSync(adapterPath, 'utf8');
  const forbiddenTokens = [
    consumingManifest.oracleProvenance.implementationPath,
    path.basename(consumingManifest.oracleProvenance.implementationPath),
    consumingManifest.oracleProvenance.oracleId,
  ];
  const matched = forbiddenTokens.find((token) => adapterText.includes(token));
  if (matched) {
    throw new Error(`Production adapter crosses the oracle boundary via: ${matched}`);
  }
}

function verifyExpectations(manifestPath) {
  const mutationManifest = fixtureInventory();
  const outcomes = collectOutcomes(mutationManifest);
  const expectationIndex = readJson(path.join(EXPECTATIONS_ROOT, 'index.json'));
  const consumingManifest = readJson(manifestPath);
  const oracleHash = hashFile(ORACLE_PATH);
  const corpusHash = hashTree(path.join(PHASE_ROOT, 'fixtures', 'corpus'));

  if (consumingManifest.productionAdapterImportProhibited !== true) {
    throw new Error('Production-adapter import prohibition is not enabled.');
  }
  if (consumingManifest.benchmarkId !== 'command-surface') {
    throw new Error(`Unexpected benchmark ID: ${consumingManifest.benchmarkId}`);
  }
  if (expectationIndex.oracleHash.value !== oracleHash) {
    throw new Error('Frozen expectations were produced by a different oracle revision.');
  }
  if (consumingManifest.oracleProvenance.versionOrCommit !== `sha256:${oracleHash}`) {
    throw new Error('Consuming manifest oracle provenance does not match the executable.');
  }
  if (expectationIndex.fixtureRootHash.value !== corpusHash) {
    throw new Error('Frozen fixture-root hash does not match the materialized corpus.');
  }
  if (consumingManifest.fixtureRootHash.value !== corpusHash) {
    throw new Error('Consuming manifest fixture-root hash does not match the corpus.');
  }
  if (consumingManifest.fixtures.length !== outcomes.length) {
    throw new Error('Consuming manifest fixture count does not match the mutation manifest.');
  }

  const manifestById = new Map(
    consumingManifest.fixtures.map((fixture) => [fixture.id, fixture]),
  );
  for (const outcome of outcomes) {
    const expectedFile = readJson(path.join(EXPECTATIONS_ROOT, `${outcome.id}.json`));
    const manifestFixture = manifestById.get(outcome.id);
    if (!manifestFixture) throw new Error(`Manifest fixture missing: ${outcome.id}`);
    if (expectedFile.fixtureHash.value !== outcome.hash) {
      throw new Error(`Frozen fixture hash mismatch: ${outcome.id}`);
    }
    if (manifestFixture.hash.value !== outcome.hash) {
      throw new Error(`Manifest fixture hash mismatch: ${outcome.id}`);
    }
    if (JSON.stringify(expectedFile.findings) !== JSON.stringify(outcome.findings)) {
      throw new Error(`Frozen expectation mismatch: ${outcome.id}`);
    }
    const manifestFindings = manifestFixture.expectedFindings.map((finding) => ({
      code: finding.code,
      severity: finding.severity,
      dimension: finding.dimension,
      location: finding.locations[0],
    }));
    if (JSON.stringify(manifestFindings) !== JSON.stringify(outcome.findings)) {
      throw new Error(`Consuming manifest expectation mismatch: ${outcome.id}`);
    }
    console.log(
      `[reference-oracle] PASS ${outcome.id}: ${outcome.findings.length} finding(s).`,
    );
  }

  verifyAdapterBoundary(consumingManifest);
  console.log(
    `[reference-oracle] PASS all=${outcomes.length} clean=0 ` +
      `public=${EXPECTED_PUBLIC_DEFECTS} held-out=${EXPECTED_HELD_OUT}.`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI
// ─────────────────────────────────────────────────────────────────────────────

function optionValue(args, option) {
  const index = args.indexOf(option);
  if (index === -1) return null;
  if (!args[index + 1]) throw new Error(`${option} requires a value.`);
  return args[index + 1];
}

function main() {
  const args = process.argv.slice(2);
  const manifestArgument = optionValue(args, '--manifest');
  const manifestPath = manifestArgument
    ? ensureInside(REPO_ROOT, path.resolve(REPO_ROOT, manifestArgument), 'Manifest path')
    : null;

  if (args.includes('--classify')) {
    const fixtureArgument = optionValue(args, '--classify');
    const fixtureRoot = ensureInside(
      REPO_ROOT,
      path.resolve(REPO_ROOT, fixtureArgument),
      'Fixture path',
    );
    console.log(JSON.stringify(classifyFixture(fixtureRoot), null, 2));
    return;
  }

  if (!manifestPath) throw new Error('--manifest is required for freeze or verify.');
  if (args.includes('--freeze')) {
    freezeExpectations(manifestPath);
    return;
  }
  if (args.includes('--verify')) {
    verifyExpectations(manifestPath);
    return;
  }
  throw new Error('Choose --freeze, --verify, or --classify.');
}

if (require.main !== module) {
  throw new Error('The reference oracle is a CLI-only boundary and cannot be imported.');
}

try {
  main();
} catch (error) {
  console.error(`[reference-oracle] FAIL ${error.message}`);
  process.exitCode = 1;
}
