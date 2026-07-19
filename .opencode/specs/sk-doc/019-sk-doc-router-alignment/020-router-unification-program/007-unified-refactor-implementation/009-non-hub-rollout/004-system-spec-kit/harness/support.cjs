'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  DOMAIN_TAGS,
  canonicalize,
  hashArtifact,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  buildAuthoredSources,
  compareUtf16,
  evaluatePolicy,
  generatePolicyCard,
  projectLegacyObservation,
  projectTypedRouteGold,
  replayPolicyCard,
} = require('../../../001-compiler-n1-shadow/compiler/index.cjs');
const {
  parseRouter,
} = require('../../../../../../../../skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs');

const PHASE_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(startPath) {
  let candidate = path.resolve(startPath);
  for (;;) {
    const marker = path.join(candidate, '.opencode', 'skills', 'system-spec-kit', 'SKILL.md');
    if (fs.existsSync(marker)) return candidate;
    const parent = path.dirname(candidate);
    if (parent === candidate) throw new Error('repository root could not be resolved');
    candidate = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'system-spec-kit');
const BENCHMARK_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const CONTRACT_ROOT = path.resolve(PHASE_ROOT, '..', '..', '000-contract-schemas');
const BASE_ROOT = path.resolve(PHASE_ROOT, '..', '..', '001-compiler-n1-shadow');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceHash(sourceId, content) {
  return hashArtifact(DOMAIN_TAGS.CompiledPolicyV1, { content, sourceId });
}

function parseForbiddenAdmissions(skillMarkdown) {
  const block = /### ⛔ NEVER([\s\S]*?)\n### ⚠️ ESCALATE IF/.exec(skillMarkdown);
  if (!block) return [];
  return [...block[1].matchAll(/^\d+\.\s+\*\*([^*]+)\*\*/gm)]
    .map((match) => match[1].trim().toLowerCase())
    .filter(Boolean)
    .sort(compareUtf16);
}

function parserProjection(skillMarkdown, router, forbiddenAdmissions) {
  const nameMatch = /^name:\s*([^\n]+)$/m.exec(skillMarkdown);
  if (!nameMatch) throw new Error('system-spec-kit SKILL.md has no name');
  const lines = [nameMatch[0], 'INTENT_SIGNALS = {'];
  Object.keys(router.intentSignals).sort(compareUtf16).forEach((intent) => {
    lines.push(`  ${JSON.stringify(intent)}: ${canonicalize(router.intentSignals[intent])},`);
  });
  lines.push('}', 'RESOURCE_MAP = {');
  Object.keys(router.resourceMap).sort(compareUtf16).forEach((intent) => {
    lines.push(`  ${JSON.stringify(intent)}: ${canonicalize(router.resourceMap[intent])},`);
  });
  lines.push('}');
  if (router.defaultResource.length === 1) {
    lines.push(`DEFAULT_RESOURCE = ${JSON.stringify(router.defaultResource[0])}`);
  }
  lines.push('### Do NOT Use Code Mode For');
  forbiddenAdmissions.forEach((value) => lines.push(`- ${value}`));
  lines.push('### End');
  return lines.join('\n');
}

function loadAuthoredSources() {
  const skillMarkdown = fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md'), 'utf8');
  const leafManifest = readJson(path.join(SKILL_ROOT, 'leaf-manifest.json'));
  const leafAliases = readJson(path.join(SKILL_ROOT, 'leaf-aliases.json'));
  const router = parseRouter(skillMarkdown, SKILL_ROOT);
  if (!router.parseable) throw new Error('system-spec-kit authored router is not parseable');
  if (router.defaultResource.length !== 1) {
    throw new Error('system-spec-kit must declare exactly one default resource');
  }
  const negativeAdmissions = parseForbiddenAdmissions(skillMarkdown);
  const projection = parserProjection(skillMarkdown, router, negativeAdmissions);
  const sources = buildAuthoredSources({
    activationGeneration: 1,
    guardSource: "decision: 'allow'\ndecision: 'warn'\nFail open\ndecision: 'allow'",
    leafManifest,
    skillMarkdown: projection,
  });
  return JSON.parse(canonicalize({
    ...sources,
    defaultResource: router.defaultResource[0],
    negativeAdmissions,
    sourceHashes: [
      { sourceId: 'SKILL.md', hash: sourceHash('SKILL.md', skillMarkdown) },
      { sourceId: 'leaf-aliases.json', hash: sourceHash('leaf-aliases.json', leafAliases) },
      { sourceId: 'leaf-manifest.json', hash: sourceHash('leaf-manifest.json', leafManifest) },
    ],
  }));
}

function targetFor(policy) {
  const destination = policy.destinations[0];
  return {
    authorityRef: destination.authorityRef,
    destinationId: destination.id,
    mutatesWorkspace: destination.mutatesWorkspace,
    role: destination.role,
  };
}

function evaluateTargetPolicy(policy, authoredSources, request) {
  const evaluation = evaluatePolicy(policy, request);
  const defaultResource = authoredSources.defaultResource;
  if (evaluation.decision.action === 'route') {
    const resources = [...new Set([
      defaultResource,
      ...evaluation.diagnostics.selectedResources,
    ])].sort(compareUtf16);
    return {
      decision: evaluation.decision,
      diagnostics: { ...evaluation.diagnostics, selectedResources: resources },
    };
  }
  if (evaluation.decision.action !== 'defer' || evaluation.decision.defer.reason !== 'no-match') {
    return evaluation;
  }
  return {
    decision: {
      action: 'route',
      route: {
        authority: 'WithheldUntilVerify',
        basis: { kind: 'bounded-default' },
        evidence: [],
        selectionKind: 'single',
        targets: [targetFor(policy)],
      },
      schemaVersion: 'V1',
    },
    diagnostics: {
      effects: [],
      rankCalls: 0,
      selectedIntents: [],
      selectedResources: [defaultResource],
    },
  };
}

function projectTargetTypedGold(policy, scenarioId, evaluation) {
  if (evaluation.decision.action !== 'route'
      || evaluation.decision.route.basis.kind !== 'bounded-default') {
    return projectTypedRouteGold(policy, scenarioId, evaluation);
  }
  const projectionInput = {
    decision: evaluation.decision,
    diagnostics: { ...evaluation.diagnostics, selectedIntents: ['DEFAULT_RESOURCE'] },
  };
  const projection = projectTypedRouteGold(policy, scenarioId, projectionInput);
  projection.observedIntents = [];
  projection.projectionHash = require('../../../000-contract-schemas/lib/canonical.cjs')
    .computeProjectionHash('TypedRouteGoldV1', projection);
  return projection;
}

function generateTargetPolicyCard(policy, authoredSources) {
  const generated = generatePolicyCard(policy, authoredSources);
  const oldFrontmatter = generated.frontmatter;
  const frontmatter = {
    ...oldFrontmatter,
    admission: [
      'positive selector signal routes',
      'zero signal routes the authored bounded default resource',
      'negative admission rejects as forbidden',
    ],
    negativeReasons: ['forbidden'],
  };
  frontmatter.humanViewHash = require('../../../000-contract-schemas/lib/canonical.cjs')
    .computeProjectionHash('PolicyCardV1', frontmatter, 'humanViewHash');
  const tableMatch = /## Document-only routing table\n\n```json\n([^\n]+)\n```/m.exec(generated.markdown);
  if (!tableMatch) throw new Error('generated policy card has no routing table');
  const table = JSON.parse(tableMatch[1]);
  table.defaultResource = authoredSources.defaultResource;
  let markdown = generated.markdown
    .replace(canonicalize(oldFrontmatter), canonicalize(frontmatter))
    .replace(
      `Human view: \`${oldFrontmatter.humanViewHash}\``,
      `Human view: \`${frontmatter.humanViewHash}\``,
    )
    .replace(tableMatch[1], canonicalize(table))
    .replace(
      'Near-tied selector evidence asks exactly one clarification. Zero signal defers with '
        + '`no-match`; it never defaults to the only destination.',
      'Near-tied selector evidence asks exactly one clarification. Zero signal uses the authored '
        + 'bounded default resource; it does not invent an unconditional singleton route.',
    );
  return { frontmatter, markdown };
}

function replayTargetPolicyCard(markdown, taskText) {
  const result = replayPolicyCard(markdown, taskText);
  const tableMatch = /## Document-only routing table\n\n```json\n([^\n]+)\n```/m.exec(markdown);
  if (!tableMatch) throw new Error('policy card routing table is missing');
  const table = JSON.parse(tableMatch[1]);
  if (result.action === 'route') {
    result.resources = [...new Set([table.defaultResource, ...result.resources])].sort(compareUtf16);
    return result;
  }
  if (result.action === 'defer' && result.reason === 'no-match' && table.defaultResource) {
    return {
      action: 'route',
      basis: 'bounded-default',
      draftStatus: 'PREPARED_DRAFT',
      intent: null,
      resources: [table.defaultResource],
      terminal: 'DOCUMENT_ONLY_UNATTESTED',
    };
  }
  return result;
}

function canonicalJsonBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

function sha256Bytes(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function sha256File(filePath) {
  return sha256Bytes(fs.readFileSync(filePath));
}

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

function hashTree(directory) {
  const files = walkFiles(directory).sort(compareUtf16);
  const digest = crypto.createHash('sha256');
  files.forEach((filePath) => {
    digest.update(path.relative(directory, filePath).split(path.sep).join('/'));
    digest.update(Buffer.from([0]));
    digest.update(fs.readFileSync(filePath));
    digest.update(Buffer.from([0]));
  });
  return { fileCount: files.length, sha256: digest.digest('hex') };
}

module.exports = {
  BASE_ROOT,
  BENCHMARK_ROOT,
  CONTRACT_ROOT,
  PHASE_ROOT,
  REPO_ROOT,
  SKILL_ROOT,
  canonicalJsonBytes,
  evaluateTargetPolicy,
  generateTargetPolicyCard,
  hashTree,
  loadAuthoredSources,
  projectLegacyObservation,
  projectTargetTypedGold,
  readJson,
  replayTargetPolicyCard,
  sha256Bytes,
  sha256File,
  walkFiles,
};
