import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const phaseDirectory = path.dirname(fileURLToPath(import.meta.url));

function findRepositoryRoot(startDirectory) {
  let currentDirectory = path.resolve(startDirectory);
  while (currentDirectory !== path.dirname(currentDirectory)) {
    if (fs.existsSync(path.join(currentDirectory, '.opencode'))) {
      return currentDirectory;
    }
    currentDirectory = path.dirname(currentDirectory);
  }
  throw new Error(`Could not locate the repository root from ${startDirectory}`);
}

const repositoryRoot = findRepositoryRoot(phaseDirectory);
const commentHygieneGuard = path.join(
  repositoryRoot,
  '.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh',
);
const specValidator = path.join(
  repositoryRoot,
  '.opencode/skills/system-spec-kit/scripts/spec/validate.sh',
);
const renderSource = path.join(
  repositoryRoot,
  '.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts',
);
const sourcePhaseDirectory = path.join(
  repositoryRoot,
  '.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation',
);

function runCommand(command, args, environment = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    env: { ...process.env, ...environment },
  });
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function withTemporaryDirectory(callback) {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'guardrail-controls-'));
  try {
    return callback(temporaryDirectory);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function continuityFingerprint(content) {
  const normalized = content
    .replace(/\r\n/gu, '\n')
    .replace(/^(\s{6}fingerprint:\s*)(?:["'])?sha256:[a-f0-9]{64}(?:["']?)(\s*)$/gmu, `$1"sha256:${'0'.repeat(64)}"$2`)
    .replace(/[ \t]+$/gmu, '');
  return `sha256:${crypto.createHash('sha256').update(normalized, 'utf8').digest('hex')}`;
}

function copyContractDocuments(targetDirectory) {
  fs.mkdirSync(targetDirectory, { recursive: true });
  const fixtureSlug = path.basename(targetDirectory);
  const fixturePacket = `hooks/002-injection-bloat-reduction/999-${fixtureSlug}`;
  for (const documentName of [
    'spec.md',
    'plan.md',
    'tasks.md',
    'checklist.md',
    'implementation-summary.md',
  ]) {
    const sourcePath = path.join(sourcePhaseDirectory, documentName);
    const targetPath = path.join(targetDirectory, documentName);
    const source = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(
      targetPath,
      source
        .replaceAll('hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation', fixturePacket)
        .replaceAll('007-guardrail-controls-and-activation', fixtureSlug),
      'utf8',
    );
  }

  for (const documentName of ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'implementation-summary.md']) {
    const targetPath = path.join(targetDirectory, documentName);
    const normalized = fs
      .readFileSync(targetPath, 'utf8')
      .replaceAll('sha256:pending-generator-refresh', `sha256:${'0'.repeat(64)}`)
      .replace(/last_updated_at:\s*"[^"]*"/gu, `last_updated_at: "${new Date().toISOString()}"`)
      .replace(/recent_action:\s*"[^"]*"/gu, 'recent_action: "verified fixture"');
    fs.writeFileSync(targetPath, normalized, 'utf8');
  }

  for (const documentName of ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'implementation-summary.md']) {
    const targetPath = path.join(targetDirectory, documentName);
    const content = fs.readFileSync(targetPath, 'utf8');
    fs.writeFileSync(
      targetPath,
      content.replace(/^\s{6}fingerprint:\s*"sha256:[a-f0-9]{64}"$/gmu, `      fingerprint: "${continuityFingerprint(content)}"`),
      'utf8',
    );
  }
}

function writeCompletionMetadata(targetDirectory, status = 'complete', unsupportedEvidence = false) {
  const fixtureSlug = path.basename(targetDirectory);
  const specContent = fs.readFileSync(path.join(targetDirectory, 'spec.md'), 'utf8');
  const fixtureTimestamp = specContent.match(/last_updated_at:\s*"([^"]+)"/u)?.[1] ?? new Date().toISOString();
  const sourceDocHashes = {};
  for (const documentName of ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'implementation-summary.md']) {
    const documentPath = path.join(targetDirectory, documentName);
    const documentContent = fs.readFileSync(documentPath, 'utf8');
    sourceDocHashes[documentName] = crypto.createHash('sha256').update(documentContent, 'utf8').digest('hex');
  }
  const graphMetadata = {
    schema_version: 1,
    packet_id: 'temporary-unsupported-completion',
    spec_folder: fixtureSlug,
    parent_id: null,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: ['temporary unsupported completion'],
      key_topics: ['temporary', 'completion'],
      importance_tier: 'normal',
      status,
      key_files: ['spec.md', 'tasks.md', 'checklist.md'],
      entities: [],
      causal_summary: 'A fixture that claims completion while evidence remains open.',
      created_at: '2026-08-06T00:00:00Z',
      last_save_at: fixtureTimestamp,
      save_lineage: 'same_pass',
      last_accessed_at: null,
      source_docs: ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'implementation-summary.md'],
      source_doc_hashes: sourceDocHashes,
    },
  };
  const description = {
    level: '2',
    specFolder: fixtureSlug,
    description: 'A temporary completion-evidence fixture.',
    keywords: ['temporary', 'completion'],
    lastUpdated: fixtureTimestamp,
  };
  fs.writeFileSync(
    path.join(targetDirectory, 'graph-metadata.json'),
    `${JSON.stringify(graphMetadata, null, 2)}\n`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(targetDirectory, 'description.json'),
    `${JSON.stringify(description, null, 2)}\n`,
    'utf8',
  );

  if (unsupportedEvidence) {
    const summaryPath = path.join(targetDirectory, 'implementation-summary.md');
    const tasksPath = path.join(targetDirectory, 'tasks.md');
    fs.writeFileSync(
      summaryPath,
      fs.readFileSync(summaryPath, 'utf8').replace(/completion_pct:\s*\d+/u, 'completion_pct: 0'),
      'utf8',
    );
    fs.writeFileSync(
      tasksPath,
      fs.readFileSync(tasksPath, 'utf8').replace('- [x]', '- [ ]'),
      'utf8',
    );
  }
}

function extractGovernorDirective() {
  const source = fs.readFileSync(renderSource, 'utf8');
  const match = source.match(/export const GOVERNOR_DIRECTIVE\s*=\s*(['"`])([\s\S]*?)\1;/u);
  assert.ok(match, 'The canonical governor directive export must remain discoverable');
  return match[2]
    .replace(/\\n/gu, '\n')
    .replace(/\\r/gu, '\r')
    .replace(/\\t/gu, '\t')
    .replace(/\\'/gu, "'")
    .replace(/\\"/gu, '"')
    .replace(/\\`/gu, '`')
    .replace(/\\\\/gu, '\\');
}

const governorMarkers = [
  {
    name: 'lead-with-result',
    patterns: [
      /\b(?:lead|start|open)\b.{0,30}\b(?:result|outcome|answer)\b/iu,
      /\b(?:result|outcome|answer)[ -]?first\b/iu,
    ],
  },
  {
    name: 'batch-and-act',
    patterns: [
      /\b(?:batch|group|bundle)\b.{0,35}\btool\s+(?:calls|invocations|operations)\b/iu,
      /\bact(?:ion)?\b.{0,35}\b(?:rather than|without)\s+narrat/iu,
      /\b(?:rather than|without)\s+narrat.{0,20}\b(?:act|action)\b/iu,
      /\b(?:do not|don't)\s+narrat/iu,
    ],
  },
  {
    name: 'reversible-decisions',
    patterns: [
      /\breversib\w*\b.{0,55}\b(?:cheap|inexpensive|low[-\s]cost|easy)\b/iu,
      /\b(?:cheap|inexpensive|low[-\s]cost|easy)\b.{0,30}\breversib\w*\b/iu,
    ],
  },
  {
    name: 'actionable-qualification',
    patterns: [
      /\b(?:qualif\w*|caveat\w*|qualifier\w*)\b.{0,80}\b(?:only|unless)\b.{0,80}\b(?:chang\w*|reader|action)\b/iu,
    ],
  },
];

function scoreGovernorBehavior(text) {
  const matched = governorMarkers
    .filter((marker) => marker.patterns.some((pattern) => pattern.test(text)))
    .map((marker) => marker.name);
  return {
    score: matched.length,
    total: governorMarkers.length,
    matched,
    missing: governorMarkers.map((marker) => marker.name).filter((name) => !matched.includes(name)),
    passed: matched.length === governorMarkers.length,
  };
}

test('comment hygiene rejects a real forbidden comment and accepts a clean fixture', () => {
  withTemporaryDirectory((temporaryDirectory) => {
    const forbiddenFixture = path.join(temporaryDirectory, 'forbidden-comment.mjs');
    const forbiddenComment = ['// REQ-', '001'].join('');
    fs.writeFileSync(forbiddenFixture, `const value = 1;\n${forbiddenComment}\n`, 'utf8');

    const rejected = runCommand(commentHygieneGuard, [forbiddenFixture]);
    assert.equal(rejected.status, 1);
    assert.match(rejected.stdout, new RegExp(escapeRegExp(forbiddenFixture)));
    assert.match(rejected.stdout, /REQ-001/u);

    const cleanFixture = path.join(temporaryDirectory, 'clean-comment.mjs');
    fs.writeFileSync(
      cleanFixture,
      '// Keep the fixture small so the guard result stays attributable\nconst value = 1;\n',
      'utf8',
    );
    const accepted = runCommand(commentHygieneGuard, [cleanFixture]);
    assert.equal(accepted.status, 0);
    assert.equal(accepted.stdout, '');

    console.log(`REAL_COMMENT_GUARD command=${commentHygieneGuard} exit=${rejected.status} stdout=${JSON.stringify(rejected.stdout.trim())}`);
    console.log(`REAL_COMMENT_GUARD_CLEAN exit=${accepted.status} stdout=${JSON.stringify(accepted.stdout)}`);
  });
});

test('completion validation blocks an unsupported complete status and accepts a well-formed fixture', () => {
  withTemporaryDirectory((temporaryDirectory) => {
    const unsupportedFixture = path.join(temporaryDirectory, 'unsupported-completion');
    copyContractDocuments(unsupportedFixture);
    writeCompletionMetadata(unsupportedFixture, 'complete', true);

    const blocked = runCommand(
      'bash',
      [specValidator, unsupportedFixture, '--strict', '--verbose', '--no-recursive'],
      {
        SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE: 'true',
        SPECKIT_COMPLETION_FRESHNESS: 'false',
        SPECKIT_GENERATOR_HARDENING: 'false',
        SPECKIT_GENERATED_METADATA_DRIFT_GATE: 'false',
      },
    );
    const blockedOutput = `${blocked.stdout}\n${blocked.stderr}`;
    assert.equal(blocked.status, 2);
    assert.match(blockedOutput, /STATUS_COMPLETE_EVIDENCE_MISMATCH/u);
    assert.match(blockedOutput, /derived\.status is 'complete'/u);
    assert.match(blockedOutput, /tasks\.md has unchecked task items/u);

    const wellFormedFixture = path.join(temporaryDirectory, 'well-formed');
    copyContractDocuments(wellFormedFixture);
    writeCompletionMetadata(wellFormedFixture, 'complete');
    const accepted = runCommand(
      'bash',
      [specValidator, wellFormedFixture, '--strict', '--verbose', '--no-recursive'],
      {
        SPECKIT_COMPLETION_FRESHNESS: 'false',
        SPECKIT_GENERATOR_HARDENING: 'false',
        SPECKIT_GENERATED_METADATA_DRIFT_GATE: 'false',
      },
    );
    assert.ok(
      [0, 1].includes(accepted.status),
      `Expected a non-blocking validation result, got ${accepted.status}\n${accepted.stdout}\n${accepted.stderr}`,
    );

    const relevantLines = blockedOutput
      .split('\n')
      .filter((line) => /GENERATED_METADATA_INTEGRITY|STATUS_COMPLETE_EVIDENCE_MISMATCH|derived\.status/u.test(line))
      .join('\n');
    console.log(`REAL_VALIDATE_STRICT command=bash ${specValidator} <temp-fixture> --strict exit=${blocked.status}\n${relevantLines}`);
    console.log(`REAL_VALIDATE_STRICT_WELL_FORMED exit=${accepted.status}`);
  });
});

test('governor rubric scores the canonical directive and survives marker-preserving wording changes', () => {
  const canonicalDirective = extractGovernorDirective();
  const rewordedDirective = 'Start with the outcome; group tool invocations and take action without narrating every step; reversible choices are inexpensive, so decide and continue; add caveats only when they change what the reader should do.';
  const markerDroppedDirective = 'Use concise language and keep the working context useful.';

  const canonicalScore = scoreGovernorBehavior(canonicalDirective);
  const rewordedScore = scoreGovernorBehavior(rewordedDirective);
  const markerDroppedScore = scoreGovernorBehavior(markerDroppedDirective);

  assert.equal(canonicalScore.passed, true);
  assert.equal(rewordedScore.passed, true);
  assert.equal(rewordedScore.score, rewordedScore.total);
  assert.equal(markerDroppedScore.passed, false);
  assert.ok(markerDroppedScore.missing.length > 0);

  console.log(`GOVERNOR_CANONICAL score=${canonicalScore.score}/${canonicalScore.total} pass=${canonicalScore.passed}`);
  console.log(`GOVERNOR_REWORDED score=${rewordedScore.score}/${rewordedScore.total} pass=${rewordedScore.passed}`);
  console.log(`GOVERNOR_MARKERS_DROPPED score=${markerDroppedScore.score}/${markerDroppedScore.total} pass=${markerDroppedScore.passed} missing=${markerDroppedScore.missing.join(',')}`);
});
