#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const BASE_SHA = 'fe6ca3030917073f3b478bc044e10034dcc4394b';
const MAX_GIT_OBJECT_BYTES = 128 * 1024 * 1024;
const REPO = path.resolve(__dirname, '../../../../..');
const LEAF = __dirname;
const SKILL_ROOT = path.join(REPO, '.opencode/skills/system-deep-loop');
const SKILL = '.opencode/skills/system-deep-loop';
const ADDITIVE_SCENARIOS = [
  '.opencode/skills/system-deep-loop/deep-improvement/behavior-benchmark/scenarios/IMB-006-common-parent-lane-selection.md',
  '.opencode/skills/system-deep-loop/deep-improvement/behavior-benchmark/scenarios/IMB-007-model-benchmark-bare-command-halt.md',
  '.opencode/skills/system-deep-loop/deep-improvement/behavior-benchmark/scenarios/IMB-008-skill-benchmark-bare-command-halt.md',
];
const EVIDENCE_JSON = [
  'base-manifest.json',
  'taxonomy-census.json',
  'subsystem-census.json',
  'event-schema-census.json',
  'state-backend-census.json',
  'contract-defect-ledger.json',
  'behavior-baseline.json',
  'replay-rollback-manifest.json',
  'phase-004-handoff-manifest.json',
  'pre-existing-kebab-renames.json',
  'fixtures/event-streams.json',
  'fixtures/expected-projections.json',
  'fixtures/control-surfaces.json',
];

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function read(relativePath) {
  return fs.readFileSync(path.join(LEAF, relativePath), 'utf8');
}

function json(relativePath) {
  return JSON.parse(read(relativePath));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: REPO,
    encoding: 'utf8',
    maxBuffer: MAX_GIT_OBJECT_BYTES,
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function gitObject(relativePath) {
  return run('git', ['show', `${BASE_SHA}:${relativePath}`]);
}

function gitObjectBuffer(relativePath) {
  const result = spawnSync('git', ['show', `${BASE_SHA}:${relativePath}`], {
    cwd: REPO,
    maxBuffer: MAX_GIT_OBJECT_BYTES,
  });
  if (result.status !== 0) {
    throw new Error(`git show failed for ${relativePath}: ${result.stderr.toString('utf8')}`);
  }
  return result.stdout;
}

function parseScenario(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  assert(match, 'scenario JSON block missing');
  return JSON.parse(match[1]);
}

function semanticOracle(contract) {
  const oracle = {
    mode: contract.mode,
    entrySurface: contract.entry_surface,
    clarity: contract.clarity,
    invocation: contract.invocation,
    expectedInteraction: contract.expected_interaction,
    expectedPresentationMarkers: contract.expected_presentation_markers || [],
    expectedDelegation: contract.expected_delegation || {},
    artifactsRequired: contract.artifacts_required ?? null,
    postconditions: contract.postconditions || [],
    boundary: contract.boundary || null,
  };
  return { ...oracle, digest: sha(JSON.stringify(oracle)) };
}

function filesDigest(root) {
  const parts = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile()) parts.push(`${path.relative(REPO, absolute)}\0${sha(fs.readFileSync(absolute))}`);
    }
  }
  walk(root);
  return sha(parts.join('\n'));
}

function stripAnchor(reference) {
  return reference.split('#', 1)[0];
}

function assertEvidencePath(reference) {
  const relativePath = stripAnchor(reference);
  const local = path.join(LEAF, relativePath);
  if (fs.existsSync(local)) return;
  const repoPath = relativePath.startsWith('.opencode/') ? relativePath : `${SKILL}/${relativePath}`;
  const probe = spawnSync('git', ['cat-file', '-e', `${BASE_SHA}:${repoPath}`], { cwd: REPO });
  assert.equal(probe.status, 0, `missing BASE evidence path: ${reference}`);
}

function baseSourceFiles() {
  const roots = [
    `${SKILL}/runtime`,
    `${SKILL}/deep-research`,
    `${SKILL}/deep-review`,
    `${SKILL}/deep-alignment`,
    `${SKILL}/deep-ai-council`,
    `${SKILL}/deep-improvement`,
    `${SKILL}/shared`,
  ];
  return run('git', ['ls-tree', '-r', '--name-only', BASE_SHA, '--', ...roots])
    .split('\n')
    .filter((file) => /\.(?:cjs|mjs|js|ts)$/.test(file))
    .filter((file) => !/(?:\/tests?\/|\.test\.|\.vitest\.|\/fixtures\/|\/z_archive\/)/.test(file));
}

function baseBackendDiscoveryFiles() {
  const roots = [
    `${SKILL}/runtime`,
    `${SKILL}/deep-research`,
    `${SKILL}/deep-review`,
    `${SKILL}/deep-alignment`,
    `${SKILL}/deep-ai-council`,
    `${SKILL}/deep-improvement`,
    `${SKILL}/shared`,
  ];
  const files = run('git', ['ls-tree', '-r', '--name-only', BASE_SHA, '--', ...roots])
    .split('\n')
    .filter(Boolean)
    .filter((file) => !/(?:\/tests?\/|\.test\.|\.vitest\.|\/fixtures\/|\/z_archive\/)/.test(file))
    .filter((file) => /\.(?:cjs|mjs|js|ts|ya?ml)$/.test(file)
      || file.endsWith('/SKILL.md')
      || /\/references\/(?:state|structure|protocol|integration)\//.test(file)
      || file.endsWith('/references/state-machine-wiring.md')
      || file.endsWith('/runtime/references/state-format.md'));
  return [...new Set(files)].sort();
}

function eventIdsForSource(file, source) {
  const ids = new Set();
  const add = (...values) => values.forEach((value) => ids.add(value));

  if (/deep-research-state\.jsonl/.test(source)) add('research-state');
  if (/inbox\.jsonl|INBOX_FILE_NAME/.test(source)) add('research-inbox');
  if (file.includes('/deep-research/') && /(?:deltas.{0,80}iter-|iter-\\d\+\\\.jsonl)/s.test(source)) add('research-deltas');
  if (/deep-review-state\.jsonl/.test(source)) add('review-state');
  if ((file.endsWith('/runtime/scripts/reduce-state.cjs') || file.endsWith('/runtime/scripts/verify-iteration.cjs')) && /deltas.{0,100}iter-/s.test(source)) add('review-deltas');
  if (/deep-alignment-state\.jsonl/.test(source)) add('alignment-state');
  if ((file.includes('reduce-alignment-state') || file.endsWith('/runtime/scripts/verify-iteration.cjs')) && /deltas.{0,100}iter-/s.test(source)) add('alignment-deltas');
  if (/ai-council-state\.jsonl|appendJsonlEvent|appendStateLine/.test(source)) add('council-state');
  if (/session-state\.jsonl/.test(source) || file.includes('round-state-jsonl')) add('council-session-state');
  if (/round-state\.jsonl/.test(source) || file.includes('round-state-jsonl')) add('council-round-state');
  if (/agent-improvement-state\.jsonl/.test(source) || (file.includes('/deep-improvement/') && /state(?:Log|File)Path/.test(source))) add('improvement-state');
  if (/improvement-journal\.jsonl|journalPath/.test(source) && file.includes('/deep-improvement/')) add('improvement-journal');
  if (/orchestration-status\.log|appendFanoutStatusLedger|appendStatusLedger|readRetryCountsFromLedger/.test(source)) add('fanout-status-ledger');
  if (/observability-events\.jsonl|appendObservabilityEvent|normalizeObservabilityEvent/.test(source)) add('observability-events');
  if (/\.transcript\.jsonl|transcriptFilePath|transcriptPath/.test(source) && file.includes('behavior-bench-run')) add('behavior-transcript');
  if (/index\.jsonl|indexPath\(kind/.test(source) && file.includes('/scorer/lib/cache')) add('model-grader-cache');
  if (/compiled\/manifest\.jsonl|MANIFEST_PATH/.test(source) && file.includes('render-command-contract')) add('compiled-command-manifest');
  if (/dispatch_failure/.test(source)) add('dispatch-failure');
  if (/dispatch_receipt_write_failed/.test(source)) add('dispatch-receipt-write-failed');
  if (/verification_degraded/.test(source)) add('verification-degraded');
  if ((file.endsWith('/runtime/lib/deep-loop/divergent-pivot.ts') || /divergent-(?:research|review)-pivot/.test(file)) && /state\.jsonl|readEventStore|appendJsonlIfChangedAtomic/.test(source)) add('divergent-pivot-state');
  if (/progress_record|validateProgressRecordPair/.test(source)) add('progress-record');

  if (file.includes('append-state-record') || file.includes('jsonl-repair')) {
    add('research-state', 'research-deltas', 'review-state', 'review-deltas', 'alignment-state', 'alignment-deltas', 'improvement-state');
  }
  if (file.includes('executor-audit') || file.includes('post-dispatch-validate')) {
    add('research-state', 'review-state', 'alignment-state', 'improvement-state');
  }
  return [...ids].sort();
}

function discoverEventSources() {
  const rows = [];
  for (const file of baseSourceFiles()) {
    const source = gitObject(file);
    const eventIds = eventIdsForSource(file, source);
    if (!eventIds.length) continue;
    const roles = [];
    if (/appendFileSync|createWriteStream|appendJsonlRecordSafe|appendJsonlIfChangedAtomic|appendRoundStateRecord\(|writeStateJsonl\(|appendStateLine\(|appendJsonlEvent\(|appendJsonl\(|appendFanoutStatusLedger\(|appendStatusLedger\(|appendObservabilityEvent\(|writeBufferAtomic\(|mergeJsonlUnderLock\(/.test(source)) roles.push('producer');
    const readsPersistedEvent = /parseJsonl|readJsonl|readEventStore|readRoundStateRecords|readJournal|readIndex|readRetryCountsFromLedger|repairJsonl|validateProgressRecordPair|validateReviewRecordFields|readUtf8\((?:state|journal|ledger|index)|readFileSync\([^)]*(?:state|journal|ledger|index|jsonl|transcript)/i.test(source)
      || file.includes('behavior-bench-run');
    if (readsPersistedEvent && !file.includes('render-command-contract')) roles.push('consumer');
    if (!roles.length) continue;
    rows.push({ source: file, roles });
  }
  return rows.sort((left, right) => left.source.localeCompare(right.source));
}

function discoverPersistenceSources() {
  const rows = [];
  for (const file of baseSourceFiles()) {
    const source = gitObject(file);
    const operation = /appendFile|writeFile|createWriteStream|renameSync|new Database|\.prepare\(|mkdirSync|rmSync|unlinkSync/.test(source);
    const marker = /\.jsonl|\.json|\.sqlite|\.lock|\.md|\.log|state|registry|dashboard|artifact|cache|manifest|transcript|checkpoint|candidate|benchmark/i.test(source);
    if (!operation || !marker) continue;
    rows.push({ source: file });
  }
  return rows.sort((left, right) => left.source.localeCompare(right.source));
}

function discoverEventSurfaceIds() {
  const found = new Set();
  for (const file of baseSourceFiles()) {
    const source = gitObject(file);
    eventIdsForSource(file, source).forEach((id) => found.add(id));
  }
  return [...found].sort();
}

function discoverBackendIds() {
  const sourceByFile = new Map(baseBackendDiscoveryFiles().map((file) => [file, gitObject(file)]));
  const any = (predicate) => [...sourceByFile].some(([file, source]) => predicate(file, source));
  const found = new Set();
  const mark = (id, predicate) => { if (any(predicate)) found.add(id); };
  const modeFile = (mode, pattern) => (file, source) => file.includes(`/${mode}/`) && pattern.test(source);

  mark('research-config', modeFile('deep-research', /deep-research-config\.json/));
  mark('research-state', modeFile('deep-research', /deep-research-state\.jsonl/));
  mark('research-deltas', modeFile('deep-research', /iter-\\d\+\\\.jsonl|deltas/));
  mark('research-projections', modeFile('deep-research', /deep-research-findings-registry\.json|deep-research-dashboard\.md|resource-map\.md/));
  mark('research-strategy-inbox', modeFile('deep-research', /deep-research-strategy\.md|inbox\.jsonl/));
  mark('research-controls', (file, source) => /deep-research/.test(file) && /\.deep-research\.lock|\.deep-research-pause/.test(source));
  mark('research-workdirs', modeFile('deep-research', /dispatch-receipts|iterations|lineages/));
  mark('review-config', modeFile('deep-review', /deep-review-config\.json/));
  mark('review-state', (file, source) => /deep-review|runtime/.test(file) && /deep-review-state\.jsonl/.test(source));
  mark('review-deltas', (file, source) => /deep-review|runtime/.test(file) && /deltas.{0,100}iter-|iter-\\d\+\\\.jsonl/s.test(source));
  mark('review-projections', (file, source) => /deep-review|runtime/.test(file) && /deep-review-findings-registry\.json|deep-review-dashboard\.md|review-report\.md/.test(source));
  mark('review-strategy', modeFile('deep-review', /deep-review-strategy\.md/));
  mark('review-controls', (file, source) => /deep-review/.test(file) && /\.deep-review\.lock|\.deep-review-pause/.test(source));
  mark('review-workdirs', modeFile('deep-review', /dispatch-receipts|iterations|lineages/));
  mark('alignment-config-corpus', (file, source) => /deep-alignment|runtime/.test(file) && /deep-alignment-config\.json|deep-alignment-corpus\.json/.test(source));
  mark('alignment-state-deltas', (file, source) => /deep-alignment|runtime/.test(file) && /deep-alignment-state\.jsonl|deltas.{0,100}iter-/s.test(source));
  mark('alignment-projections', (file, source) => /deep-alignment|runtime/.test(file) && /deep-alignment-findings-registry\.json|alignment-report\.md/.test(source));
  mark('alignment-control', (file, source) => /deep-alignment|runtime/.test(file) && /\.deep-alignment\.lock/.test(source));
  mark('alignment-workdirs', modeFile('deep-alignment', /dispatch-receipts|iterations|prompts/));
  mark('council-config-state', (file, source) => /deep-ai-council/.test(file) && /ai-council-config\.json|ai-council-state\.jsonl|session-state\.jsonl/.test(source));
  mark('council-round-ledgers', (file, source) => /council|deep-ai-council/.test(file) && /round-state\.jsonl/.test(source));
  mark('council-controls', (file, source) => /council|deep-ai-council/.test(file) && /\.deep-ai-council\.lock|\.lock/.test(source));
  mark('council-artifacts', modeFile('deep-ai-council', /deliberations|critiques|failed|seats/));
  mark('council-graph', (file, source) => /council-graph/.test(file) && /council-graph\.sqlite|new Database/.test(source));
  mark('improvement-config-manifests', modeFile('deep-improvement', /agent-improvement-config\.json|model-benchmark-config\.json|target-manifest\.jsonc|optimizer-manifest\.json/));
  mark('improvement-ledgers', modeFile('deep-improvement', /agent-improvement-state\.jsonl|improvement-journal\.jsonl|stateLogPath|journalPath/));
  mark('improvement-derived-state', modeFile('deep-improvement', /agent-improvement-registry\.json|candidate-lineage\.json|mutation-coverage\.json|experiment-registry\.json/));
  mark('improvement-artifacts', modeFile('deep-improvement', /candidates|benchmark-runs|benchmark-outputs|archive|logs/));
  mark('improvement-controls', modeFile('deep-improvement', /\.deep-improvement\.lock|\.benchmark-pause/));
  mark('model-benchmark-hub-output', modeFile('deep-improvement', /prompt-models|runLabel|run_label/));
  mark('skill-benchmark-output', modeFile('deep-improvement', /skill-benchmark-report\.(?:json|md)/));
  mark('model-grader-cache', modeFile('deep-improvement', /index\.jsonl|\.out\.md/));
  mark('coverage-graph', (file, source) => /coverage-graph|upsert\.cjs/.test(file) && /deep-loop-graph\.sqlite|new Database/.test(source));
  mark('database-controls', (file, source) => /runtime/.test(file) && /writer\.lock|loop-lock|acquireLock/.test(source));
  mark('runtime-observability', (file, source) => /runtime/.test(file) && /observability-events\.jsonl|appendObservabilityEvent/.test(source));
  mark('fanout-ledger', (file, source) => /fanout/.test(file) && /orchestration-status\.log|appendStatusLedger/.test(source));
  mark('fanout-checkpoints', (file, source) => /fanout/.test(file) && /orchestration-summary\.json|orchestration-wait-checkpoint\.json/.test(source));
  mark('fanout-lineages', (file, source) => /fanout/.test(file) && /lineages|lineageDir/.test(source));
  mark('behavior-benchmark-output', (file, source) => /behavior-bench-run/.test(file) && /result\.json|transcript\.jsonl|scorecard\.md|transcriptPath/.test(source));
  mark('divergent-pivot-transactions', (file, source) => /runtime\/lib\/deep-loop\/divergent-pivot\.ts/.test(file) && /divergent.{0,80}pivots|state\.jsonl|config\.json/s.test(source));
  mark('loop-guard-session-state', (file, source) => /dispatch-guard\.cjs/.test(file) && /\.loop-guard-state|loopStatePath|writeLoopStateAtomic/.test(source));
  mark('loop-guard-warning-logs', (file, source) => /dispatch-guard\.cjs/.test(file) && /guard-warnings\.log|appendWarningLog/.test(source));
  mark('loop-guard-archive', (file, source) => /dispatch-guard\.cjs/.test(file) && /\.archive|pruneLoopGuardArchive/.test(source));
  mark('loop-guard-sweep-lock', (file, source) => /dispatch-guard\.cjs/.test(file) && /\.sweep\.lock|acquireSweepLock/.test(source));
  mark('compiled-command-contracts', (file, source) => /compile-command-contracts\.cjs/.test(file) && /assets\/compiled|outputPathFor/.test(source));
  mark('compiled-command-manifest', (file, source) => /render-command-contract/.test(file) && /compiled\/manifest\.jsonl|MANIFEST_PATH/.test(source));
  return [...found].sort();
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item));
}

function roleKeys(rows, role) {
  return rows.filter((row) => row.roles.includes(role)).map((row) => row.source).sort();
}

function validateDiscovery(events, backends) {
  const discoveredEvents = discoverEventSources();
  const declaredEvents = events.discovery.sourceCoverage;
  const discoveredBackends = discoverPersistenceSources();
  const declaredBackends = backends.discovery.sourceCoverage;
  const discoveredEventIds = discoverEventSurfaceIds();
  const discoveredBackendIds = discoverBackendIds();
  const discoveredProducers = roleKeys(discoveredEvents, 'producer');
  const declaredProducers = roleKeys(declaredEvents, 'producer');
  const discoveredConsumers = roleKeys(discoveredEvents, 'consumer');
  const declaredConsumers = roleKeys(declaredEvents, 'consumer');
  const discoveredBackendSources = discoveredBackends.map((row) => row.source);
  const declaredBackendSources = declaredBackends.map((row) => row.source);
  const declaredEventIds = events.rows.map((row) => row.id).sort();
  const declaredBackendIds = backends.rows.map((row) => row.id).sort();

  const report = {
    discoveredProducerSources: discoveredProducers.length,
    discoveredConsumerSources: discoveredConsumers.length,
    discoveredPersistenceSources: discoveredBackendSources.length,
    producerOrphans: difference(discoveredProducers, declaredProducers).length,
    consumerOrphans: difference(discoveredConsumers, declaredConsumers).length,
    backendOrphans: difference(discoveredBackendSources, declaredBackendSources).length,
    censusOnlyProducers: difference(declaredProducers, discoveredProducers).length,
    censusOnlyConsumers: difference(declaredConsumers, discoveredConsumers).length,
    censusOnlyBackends: difference(declaredBackendSources, discoveredBackendSources).length,
    undiscoveredEventRows: difference(declaredEventIds, discoveredEventIds).length,
    undiscoveredBackendRows: difference(declaredBackendIds, discoveredBackendIds).length,
    censusOnlyEventRows: difference(discoveredEventIds, declaredEventIds).length,
    censusOnlyBackendRows: difference(discoveredBackendIds, declaredBackendIds).length,
  };

  assert.deepEqual(discoveredEvents, declaredEvents, 'event source discovery differs from census');
  assert.deepEqual(discoveredBackends, declaredBackends, 'persistence source discovery differs from census');
  assert.deepEqual(discoveredEventIds, declaredEventIds, 'runtime event surface discovery differs from census');
  assert.deepEqual(discoveredBackendIds, declaredBackendIds, 'runtime persistence backend discovery differs from census');
  for (const [name, count] of Object.entries(report)) {
    if (name.startsWith('discovered')) continue;
    assert.equal(count, 0, `${name} must be zero`);
  }
  return report;
}

function resolveJsonAnchor(value, anchor) {
  if (!anchor) return value;
  return anchor.split('.').reduce((current, key) => current && current[key], value);
}

function validateLedgerReference(reference, scenarioIds) {
  for (const part of reference.split(',').map((item) => item.trim()).filter(Boolean)) {
    if (/^[A-Z]{3}-\d{3}$/.test(part)) {
      assert(scenarioIds.has(part), `missing scenario reference ${part}`);
      continue;
    }
    const [file, anchor] = part.split('#');
    const absolute = path.join(LEAF, file);
    assert(fs.existsSync(absolute), `missing fixture reference ${part}`);
    if (anchor && file.endsWith('.json')) {
      const value = JSON.parse(fs.readFileSync(absolute, 'utf8'));
      assert.notEqual(resolveJsonAnchor(value, anchor), undefined, `missing JSON anchor ${part}`);
    }
  }
}

function validateCensuses(scenarioIds) {
  const taxonomy = json('taxonomy-census.json');
  assert.deepEqual(taxonomy.counts, { workflowFamilies: 5, registeredWorkflowModes: 7, researchWorkstreams: 8, subsystemLenses: 8 });
  assert.equal(taxonomy.workflowFamilies.length, 5);
  assert.equal(taxonomy.registeredWorkflowModes.length, 7);
  assert.equal(taxonomy.researchWorkstreams.length, 8);
  assert.equal(taxonomy.subsystemLenses.length, 8);
  assert.equal(taxonomy.workflowFamilies.find((row) => row.id === 'improvement').mapping, 'many-to-one');
  assert(taxonomy.excluded.some((row) => row.name === 'ai-system-improvement'));
  const registry = JSON.parse(gitObject(`${SKILL}/mode-registry.json`));
  assert.deepEqual(registry.modes.map((row) => row.workflowMode), taxonomy.registeredWorkflowModes);

  const subsystems = json('subsystem-census.json');
  assert.equal(subsystems.subsystemCount, 8);
  assert.equal(subsystems.subsystems.length, 8);
  assert.equal(new Set(subsystems.subsystems.map((row) => row.id)).size, 8);
  for (const row of subsystems.subsystems) {
    assertEvidencePath(row.owner);
    row.entryPoints.forEach(assertEvidencePath);
    row.tests.forEach(assertEvidencePath);
    row.evidence.forEach(assertEvidencePath);
    assert(row.callers.length > 0 && row.state.length > 0 && row.invariants.length > 0);
    assert(row.defectCandidate && row.disposition);
  }
  assert(Object.values(subsystems.closure).every((value) => value === 0));

  const events = json('event-schema-census.json');
  assert.equal(events.rows.length, 22);
  assert.equal(new Set(events.rows.map((row) => row.id)).size, 22);
  for (const row of events.rows) {
    assert(row.writers.length > 0, `${row.id} producer missing`);
    assert(['producer-consumer', 'producer-only', 'consumer-only'].includes(row.classification), `${row.id} classification invalid`);
    if (row.classification === 'producer-consumer') assert(row.readers.length > 0 || row.validators.length > 0, `${row.id} consumer missing`);
    if (row.classification === 'producer-only') {
      assert.equal(row.readers.length + row.validators.length, 0, `${row.id} falsely claims a BASE consumer`);
      assert.equal(typeof row.producerOnlyJustification, 'string', `${row.id} producer-only justification missing`);
      assert(row.producerOnlyJustification.trim().length > 0, `${row.id} producer-only justification empty`);
    }
    assert(row.requiredFields.length > 0 && row.repair && row.ordering && row.idempotency && row.historicalRead && row.fixture);
    assertEvidencePath(row.writerSource);
    row.evidence.forEach(assertEvidencePath);
    assert.equal(sha(gitObjectBuffer(row.writerSource)), row.writerSourceSha256, `${row.id} writer source digest mismatch`);
    assert.equal(sha(JSON.stringify({ schemaVersion: row.schemaVersion, discriminator: row.discriminator, requiredFields: row.requiredFields })), row.schemaSha256, `${row.id} schema digest mismatch`);
  }

  const backends = json('state-backend-census.json');
  assert.equal(backends.rows.length, 46);
  const validMutability = new Set(['immutable', 'append-only', 'atomic-replace', 'transactional', 'ephemeral-control', 'write-once', 'retention-managed', 'mixed']);
  for (const row of backends.rows) {
    assert(row.owner && row.lifecycle && row.recovery && row.archivalReader && row.authority && row.fixture);
    assert(validMutability.has(row.mutability), `${row.id} mutability invalid`);
    assertEvidencePath(row.evidence);
  }
  const compiled = backends.rows.find((row) => row.id === 'compiled-command-manifest');
  assert.equal(compiled.owner, 'runtime command renderer');
  assert.equal(compiled.evidence, `${SKILL}/runtime/scripts/render-command-contract.cjs`);

  const ledger = json('contract-defect-ledger.json');
  const recomputedLedgerCounts = ledger.rows.reduce((counts, row) => {
    if (row.classification === 'protected_contract') counts.protected_contract += 1;
    if (row.classification === 'known_defect') counts.known_defect += 1;
    return counts;
  }, { protected_contract: 0, known_defect: 0 });
  assert.deepEqual({
    protected_contract: ledger.closure.protected_contract,
    known_defect: ledger.closure.known_defect,
  }, recomputedLedgerCounts, 'stored contract/defect closure differs from recomputed row classifications');
  assert.equal(ledger.rows.length, recomputedLedgerCounts.protected_contract + recomputedLedgerCounts.known_defect);
  assert.equal(ledger.closure.unknown, 0);
  for (const row of ledger.rows) {
    assert(['protected_contract', 'known_defect'].includes(row.classification));
    assert(row.owner && row.evidence.length > 0 && row.scenarioOrFixture && row.laterDisposition);
    row.evidence.forEach(assertEvidencePath);
    validateLedgerReference(row.scenarioOrFixture, scenarioIds);
  }

  const discovery = validateDiscovery(events, backends);
  return { taxonomy, subsystems, events, backends, ledger, discovery };
}

function validateBehavior() {
  const baseline = json('behavior-baseline.json');
  assert.equal(baseline.counts.packages, 5);
  assert.equal(baseline.counts.existing, 53);
  assert.equal(baseline.counts.added, 3);
  assert.equal(baseline.counts.total, 56);
  assert.equal(baseline.counts.workstreamsWithIndependentBaseAssertion, 8);
  assert.equal(baseline.counts.additiveExecutionsCaptured, 3);
  assert.equal(baseline.existingScenarios.length, 53);
  assert.equal(baseline.addedScenarios.length, 3);
  assert.equal(baseline.workstreamAssertions.length, 8);
  const allRows = [...baseline.existingScenarios, ...baseline.addedScenarios];
  const allIds = allRows.map((row) => row.id);
  assert.equal(new Set(allIds).size, 56);

  for (const row of baseline.existingScenarios) {
    const source = gitObject(row.path);
    const liveSource = fs.readFileSync(path.join(REPO, row.path), 'utf8');
    const contract = parseScenario(source);
    assert.equal(sha(source), row.semanticDigest, `${row.id} semantic drift`);
    assert.equal(sha(liveSource), row.semanticDigest, `${row.id} working-tree semantic drift`);
    assert.equal(sha(JSON.stringify(contract)), row.contractDigest, `${row.id} contract drift`);
    assert.deepEqual(semanticOracle(contract), row.semanticOracle, `${row.id} semantic oracle drift`);
    if (row.baseResult.kind === 'result-artifact') {
      const resultSource = gitObjectBuffer(row.baseResult.path);
      const result = JSON.parse(resultSource.toString('utf8'));
      assert.equal(sha(resultSource), row.baseResult.sha256, `${row.id} BASE result digest mismatch`);
      assert.equal(result.classification, row.baseResult.classification, `${row.id} BASE result classification mismatch`);
      assert.equal(result.terminal.exitCode, row.baseResult.scenarioExitCode, `${row.id} BASE result exit mismatch`);
    } else {
      const line = gitObject(row.baseResult.path).split('\n').find((candidate) => candidate.startsWith(`| ${row.id} |`));
      assert.equal(line, row.baseResult.row, `${row.id} BASE result row mismatch`);
      assert.equal(sha(line), row.baseResult.rowSha256, `${row.id} BASE result row digest mismatch`);
    }
  }
  const corpusDigest = sha(JSON.stringify(baseline.existingScenarios.map((row) => [row.id, row.semanticDigest, row.contractDigest, row.semanticOracle.digest, row.baseResult])));
  assert.equal(corpusDigest, baseline.existingCorpusDigest);

  for (const row of baseline.addedScenarios) {
    const source = fs.readFileSync(path.join(REPO, row.path), 'utf8');
    const contract = parseScenario(source);
    assert(source.includes(BASE_SHA), `${row.id} BASE anchor missing`);
    assert.equal(sha(source), row.semanticDigest, `${row.id} additive semantic drift`);
    assert.equal(sha(JSON.stringify(contract)), row.contractDigest, `${row.id} additive contract drift`);
    assert.deepEqual(semanticOracle(contract), row.semanticOracle, `${row.id} additive oracle drift`);
    assert(fs.existsSync(path.join(REPO, contract.fixture)), `${row.id} fixture does not resolve`);
    const probe = spawnSync('git', ['cat-file', '-e', `${BASE_SHA}:${row.path}`], { cwd: REPO });
    assert.notEqual(probe.status, 0, `${row.id} is not additive`);
    const execution = row.behaviorExecution;
    const resultSource = fs.readFileSync(path.join(LEAF, execution.resultPath));
    const transcriptSource = fs.readFileSync(path.join(LEAF, execution.transcriptPath));
    const result = JSON.parse(resultSource.toString('utf8'));
    assert.equal(execution.harnessExitCode, 0, `${row.id} harness did not complete`);
    assert.equal(sha(resultSource), execution.resultSha256, `${row.id} result digest mismatch`);
    assert.equal(sha(transcriptSource), execution.transcriptSha256, `${row.id} transcript digest mismatch`);
    assert.equal(result.terminal.exitCode, execution.scenarioExitCode, `${row.id} scenario exit mismatch`);
    assert.equal(result.classification, execution.classification, `${row.id} classification mismatch`);
    assert.equal(result.capture.command, execution.command, `${row.id} capture command mismatch`);
    assert(!result.transcriptPath.startsWith('/'), `${row.id} result contains an absolute transcript path`);
  }
  assert.deepEqual([...ADDITIVE_SCENARIOS].sort(), baseline.addedScenarios.map((row) => row.path).sort());
  assert.equal(new Set(baseline.workstreamAssertions.map((row) => row.workstream)).size, 8);
  assert(Object.values(baseline.closure).every((value) => value === 0));
  return { baseline, scenarioIds: new Set(allIds) };
}

function jsonl(rows) {
  return `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`;
}

function validateFixtureSchemas(events, fixture) {
  assert.deepEqual(Object.keys(fixture.streams).sort(), events.rows.map((row) => row.id).sort());
  for (const row of events.rows) {
    const stream = fixture.streams[row.id];
    assert(stream, `fixture missing ${row.id}`);
    assert.deepEqual(stream.schema, { schemaVersion: row.schemaVersion, discriminator: row.discriminator, requiredFields: row.requiredFields });
    assert.equal(stream.schemaSha256, row.schemaSha256, `${row.id} fixture schema digest mismatch`);
    assert.equal(stream.writerSource, row.writerSource, `${row.id} fixture writer source mismatch`);
    assert.equal(stream.writerSourceSha256, row.writerSourceSha256, `${row.id} fixture writer digest mismatch`);
    assert(stream.rows.length > 0, `${row.id} fixture has no rows`);
    for (const record of stream.rows) {
      for (const field of row.requiredFields) {
        assert(Object.prototype.hasOwnProperty.call(record, field), `${row.id} fixture row missing ${field}`);
      }
    }
    const sourceCorpus = events.discovery.sourceCoverage
      .map((source) => ({ ...source, content: gitObject(source.source) }))
      .filter((source) => eventIdsForSource(source.source, source.content).includes(row.id))
      .map((source) => source.content)
      .join('\n');
    for (const field of row.requiredFields) {
      assert(sourceCorpus.includes(field), `${row.id} required field ${field} absent from discovered BASE sources`);
    }
  }
}

function replayFixturesStatic(events) {
  const fixture = json('fixtures/event-streams.json');
  const expected = json('fixtures/expected-projections.json');
  validateFixtureSchemas(events, fixture);

  const research = require(path.join(SKILL_ROOT, 'deep-research/scripts/reduce-state.cjs'));
  const review = require(path.join(SKILL_ROOT, 'runtime/scripts/reduce-state.cjs'));
  const alignment = require(path.join(SKILL_ROOT, 'runtime/scripts/reduce-alignment-state.cjs'));
  const council = require(path.join(SKILL_ROOT, 'deep-ai-council/scripts/lib/persist-artifacts.cjs'));
  const improvement = require(path.join(SKILL_ROOT, 'deep-improvement/scripts/shared/reduce-state.cjs'));
  const journal = require(path.join(SKILL_ROOT, 'deep-improvement/scripts/shared/improvement-journal.cjs'));
  const fanout = require(path.join(SKILL_ROOT, 'runtime/scripts/fanout-pool.cjs'));
  const observability = require(path.join(SKILL_ROOT, 'runtime/lib/deep-loop/observability-events.cjs'));
  const progress = require(path.join(SKILL_ROOT, 'shared/progress/progress-record.cjs'));
  const renderer = require(path.join(SKILL_ROOT, 'runtime/scripts/render-command-contract.cjs'));
  const rows = Object.fromEntries(Object.entries(fixture.streams).map(([id, stream]) => [id, stream.rows]));

  const researchState = research.parseJsonlDetailed(jsonl(rows['research-state']));
  assert.deepEqual({ oracle: expected.projections['research-state'].oracle, recordCount: researchState.records.length, corruptionCount: researchState.corruptionWarnings.length, runs: researchState.records.map((record) => record.run) }, expected.projections['research-state']);
  const researchDeltas = research.parseJsonlDetailed(jsonl(rows['research-deltas']));
  assert.deepEqual({ oracle: expected.projections['research-deltas'].oracle, recordCount: researchDeltas.records.length, corruptionCount: researchDeltas.corruptionWarnings.length, types: researchDeltas.records.map((record) => record.type) }, expected.projections['research-deltas']);
  assert.deepEqual({ oracle: expected.projections['research-inbox'].oracle, questionCount: rows['research-inbox'].filter((record) => typeof record.text === 'string' && record.text.trim()).length, texts: rows['research-inbox'].map((record) => record.text) }, expected.projections['research-inbox']);

  const reviewState = review.parseJsonlDetailed(jsonl(rows['review-state']));
  assert.deepEqual({ oracle: expected.projections['review-state'].oracle, recordCount: reviewState.records.length, corruptionCount: reviewState.corruptionWarnings.length, validationWarnings: review.validateReviewRecordFields(reviewState.records).length, runs: reviewState.records.map((record) => record.run) }, expected.projections['review-state']);
  const reviewFinding = review.deltaRecordToFinding(rows['review-deltas'][0]);
  assert.deepEqual({ oracle: expected.projections['review-deltas'].oracle, findingId: reviewFinding.findingId, severity: reviewFinding.severity, file: reviewFinding.file, line: reviewFinding.line }, expected.projections['review-deltas']);

  const alignmentState = alignment.parseJsonlDetailed(jsonl(rows['alignment-state']));
  const requiredLane = { laneId: 'sk-code::code::fixture', authority: 'sk-code', artifactClass: 'code', scope: { type: 'values', values: ['fixture'] } };
  const lane = alignment.buildLaneEntry(requiredLane, rows['alignment-deltas'], alignmentState.records);
  assert.deepEqual({ oracle: expected.projections['alignment-state'].oracle, recordCount: alignmentState.records.length, artifactsChecked: lane.artifactsChecked, iterationCount: lane.iterationsRun }, expected.projections['alignment-state']);
  assert.deepEqual({ oracle: expected.projections['alignment-deltas'].oracle, findingCount: lane.openFindings.length, findingSeverity: lane.findingsBySeverity }, expected.projections['alignment-deltas']);

  const councilRows = council.parseStateLog(jsonl(rows['council-state']));
  assert.deepEqual({ oracle: expected.projections['council-state'].oracle, recordCount: councilRows.length, events: councilRows.map((record) => record.event) }, expected.projections['council-state']);
  assert.deepEqual({ oracle: expected.projections['council-session-state'].oracle, recordCount: rows['council-session-state'].length, types: rows['council-session-state'].map((record) => record.type) }, expected.projections['council-session-state']);
  assert.deepEqual({ oracle: expected.projections['council-round-state'].oracle, recordCount: rows['council-round-state'].length, roundIds: rows['council-round-state'].map((record) => record.round_id) }, expected.projections['council-round-state']);

  const improvementRegistry = improvement.buildRegistry(rows['improvement-state']);
  assert.deepEqual({ oracle: expected.projections['improvement-state'].oracle, totalRecords: improvementRegistry.globalMetrics.totalRecords, acceptedCount: improvementRegistry.globalMetrics.acceptedCount, modes: improvementRegistry.modes }, expected.projections['improvement-state']);
  const journalResults = rows['improvement-journal'].map(journal.validateEvent);
  assert.deepEqual({ oracle: expected.projections['improvement-journal'].oracle, validEvents: journalResults.filter((result) => result.valid).length, invalidEvents: journalResults.filter((result) => !result.valid).length }, expected.projections['improvement-journal']);
  assert.deepEqual({ oracle: expected.projections['fanout-status-ledger'].oracle, recordCount: rows['fanout-status-ledger'].length, orphanCount: fanout.detectOrphanedLineages(rows['fanout-status-ledger']).length, labels: [...new Set(rows['fanout-status-ledger'].map((record) => record.label))] }, expected.projections['fanout-status-ledger']);

  const observed = rows['observability-events'][0];
  const normalized = observability.normalizeObservabilityEvent(observed.payload, { eventId: observed.event_id, producer: observed.producer, stream: observed.stream, subject: observed.subject, event: observed.event, status: observed.status, observedAtIso: observed.observed_at_iso });
  assert.deepEqual(normalized, observed);
  assert.deepEqual({ oracle: expected.projections['observability-events'].oracle, recordCount: 1, eventIds: [normalized.event_id] }, expected.projections['observability-events']);
  assert.deepEqual({ oracle: expected.projections['behavior-transcript'].oracle, recordCount: rows['behavior-transcript'].length, sources: rows['behavior-transcript'].map((record) => record.src) }, expected.projections['behavior-transcript']);
  assert.deepEqual({ oracle: expected.projections['model-grader-cache'].oracle, recordCount: rows['model-grader-cache'].length, keys: rows['model-grader-cache'].map((record) => record.key) }, expected.projections['model-grader-cache']);

  const definition = renderer.getCommandDefinition('deep/review');
  const argsText = 'fixture target :auto';
  const compiledPath = path.join(REPO, definition.compiledContractPath);
  const legacyPath = path.join(REPO, definition.legacyBodyPath);
  assert.equal(sha(fs.readFileSync(compiledPath)), sha(gitObjectBuffer(definition.compiledContractPath)));
  assert.equal(sha(fs.readFileSync(legacyPath)), sha(gitObjectBuffer(definition.legacyBodyPath)));
  const output = Buffer.concat([renderer.buildInvocationPrefix(argsText), fs.readFileSync(compiledPath), fs.readFileSync(legacyPath)]);
  const manifestRow = renderer.buildManifestRow(definition, 'fix', argsText, output);
  assert.deepEqual({ oracle: expected.projections['compiled-command-manifest'].oracle, recordCount: 1, rows: [manifestRow] }, expected.projections['compiled-command-manifest']);

  const dispatchWriter = gitObject(`${SKILL}/runtime/lib/deep-loop/executor-audit.ts`);
  const dispatchReader = gitObject(`${SKILL}/runtime/lib/deep-loop/post-dispatch-validate.ts`);
  assert(dispatchWriter.includes("event: 'dispatch_failure'") && dispatchReader.includes(".event === 'dispatch_failure'"));
  assert.deepEqual({ oracle: expected.projections['dispatch-failure'].oracle, recordCount: rows['dispatch-failure'].length, reasons: rows['dispatch-failure'].map((record) => record.reason) }, expected.projections['dispatch-failure']);
  assert(dispatchWriter.includes("event: 'dispatch_receipt_write_failed'") && dispatchReader.includes("reason: 'dispatch_receipt_missing'"));
  assert.deepEqual({ oracle: expected.projections['dispatch-receipt-write-failed'].oracle, recordCount: rows['dispatch-receipt-write-failed'].length, phases: rows['dispatch-receipt-write-failed'].map((record) => record.phase), reasons: rows['dispatch-receipt-write-failed'].map((record) => record.reason) }, expected.projections['dispatch-receipt-write-failed']);
  assert(dispatchReader.includes("event: 'verification_degraded'") && dispatchReader.includes('appendJsonlRecord('));
  assert.deepEqual({ oracle: expected.projections['verification-degraded'].oracle, recordCount: rows['verification-degraded'].length, statuses: rows['verification-degraded'].map((record) => record.status), reasons: rows['verification-degraded'].map((record) => record.reason) }, expected.projections['verification-degraded']);
  const pivotWriter = gitObject(`${SKILL}/runtime/lib/deep-loop/divergent-pivot.ts`);
  const researchPivotReader = gitObject(`${SKILL}/deep-research/scripts/divergent-research-pivot.ts`);
  const reviewPivotReader = gitObject(`${SKILL}/deep-review/scripts/divergent-review-pivot.ts`);
  assert(pivotWriter.includes('appendJsonlIfChangedAtomic(statePath, candidate') && researchPivotReader.includes("'council', 'state.jsonl'") && reviewPivotReader.includes("'council', 'state.jsonl'"));
  assert.deepEqual({ oracle: expected.projections['divergent-pivot-state'].oracle, recordCount: rows['divergent-pivot-state'].length, events: rows['divergent-pivot-state'].map((record) => record.event), pivotIds: rows['divergent-pivot-state'].map((record) => record.pivotId) }, expected.projections['divergent-pivot-state']);
  const pair = progress.validateProgressRecordPair(rows['progress-record'][0], rows['progress-record'][1]);
  assert.deepEqual({ oracle: expected.projections['progress-record'].oracle, recordCount: rows['progress-record'].length, pairValid: pair.valid }, expected.projections['progress-record']);

  const repairRows = rows[fixture.repairCase.stream];
  const repaired = [];
  let discarded = 0;
  for (const line of `${jsonl(repairRows)}${fixture.repairCase.corruptTail}`.split('\n')) {
    if (!line) continue;
    try { repaired.push(JSON.parse(line)); } catch { discarded += 1; }
  }
  assert.deepEqual({ validRowsBefore: repairRows.length, validRowsAfter: repaired.length, discardedTailRows: discarded }, expected.repair);
  const crashRows = rows[fixture.crashBoundaryCase.stream];
  const durable = crashRows.slice(0, fixture.crashBoundaryCase.durablePrefixRows);
  const resumed = [...durable, ...crashRows.slice(fixture.crashBoundaryCase.resumeFromRow)];
  assert.deepEqual({ durableRows: durable.length, resumedRows: resumed.length, lastEvent: resumed.at(-1).event, labels: [...new Set(resumed.map((record) => record.label))] }, expected.crashBoundary);
  const mixedRows = [...fixture.mixedReaderCase.legacyRows, ...rows[fixture.mixedReaderCase.modernStream]];
  const mixedRegistry = improvement.buildRegistry(mixedRows);
  assert.deepEqual({ legacyRows: fixture.mixedReaderCase.legacyRows.length, modernRows: rows[fixture.mixedReaderCase.modernStream].length, totalRecords: mixedRegistry.globalMetrics.totalRecords, acceptedCount: mixedRegistry.globalMetrics.acceptedCount }, expected.mixedReader);

  return { fixtureStreams: Object.keys(rows).length, projectionMismatches: 0, repairedRows: repaired.length, discardedTailRows: discarded, crashBoundaryRows: resumed.length, mixedReaderRows: mixedRows.length };
}

function sqliteDump(database) {
  return run('sqlite3', [database, '.dump']);
}

function exerciseDatabase(tempRoot, fixtureName, prefix) {
  const sql = read(`fixtures/${fixtureName}`);
  const database = path.join(tempRoot, `${prefix}.sqlite`);
  const snapshot = path.join(tempRoot, `${prefix}.snapshot.sqlite`);
  const recreated = path.join(tempRoot, `${prefix}.recreated.sqlite`);
  run('sqlite3', [database], { input: sql });
  assert.equal(run('sqlite3', [database, 'PRAGMA integrity_check;']).trim(), 'ok');
  const originalDump = sqliteDump(database);
  fs.copyFileSync(database, snapshot);
  const snapshotDigest = sha(fs.readFileSync(snapshot));
  run('sqlite3', [database, 'DELETE FROM schema_version;']);
  fs.copyFileSync(snapshot, database);
  assert.equal(sha(fs.readFileSync(database)), snapshotDigest);
  run('sqlite3', [recreated], { input: sql });
  assert.equal(sqliteDump(recreated), originalDump);
  return { integrity: 'ok', snapshotRestored: true, recreated: true };
}

function exerciseControls(tempRoot) {
  const fixture = json('fixtures/control-surfaces.json');
  const lock = path.join(tempRoot, '.fixture.lock');
  const pause = path.join(tempRoot, '.fixture-pause');
  const output = path.join(tempRoot, fixture.directory.name);
  fs.writeFileSync(lock, `${JSON.stringify(fixture.lock)}\n`, 'utf8');
  fs.writeFileSync(pause, `${JSON.stringify(fixture.pause)}\n`, 'utf8');
  fs.mkdirSync(output);
  for (const name of fixture.directory.files) fs.writeFileSync(path.join(output, name), '{}\n', 'utf8');
  const snapshot = {
    lock: fs.readFileSync(lock),
    pause: fs.readFileSync(pause),
    outputs: fixture.directory.files.map((name) => [name, fs.readFileSync(path.join(output, name))]),
  };
  fs.rmSync(lock);
  fs.rmSync(pause);
  fs.rmSync(output, { recursive: true });
  fs.writeFileSync(lock, snapshot.lock);
  fs.writeFileSync(pause, snapshot.pause);
  fs.mkdirSync(output);
  for (const [name, content] of snapshot.outputs) fs.writeFileSync(path.join(output, name), content);
  assert(fs.existsSync(lock) && fs.existsSync(pause));
  assert.equal(fs.readdirSync(output).length, fixture.directory.files.length);
  const guardRoot = path.join(tempRoot, fixture.loopGuard.stateDir);
  const guardArchive = path.join(guardRoot, fixture.loopGuard.archiveDir);
  const guardSweepLock = path.join(guardRoot, fixture.loopGuard.sweepLockDir);
  fs.mkdirSync(guardArchive, { recursive: true });
  fs.mkdirSync(guardSweepLock);
  fs.writeFileSync(path.join(guardRoot, fixture.loopGuard.sessionFile), `${JSON.stringify(fixture.loopGuard.sessionState)}\n`, 'utf8');
  fs.writeFileSync(path.join(guardRoot, fixture.loopGuard.warningLog), '2026-01-01T00:00:00.000Z [mk-deep-loop-guard] WARN: fixture\n', 'utf8');
  fs.copyFileSync(path.join(guardRoot, fixture.loopGuard.sessionFile), path.join(guardArchive, fixture.loopGuard.sessionFile));
  assert.equal(JSON.parse(fs.readFileSync(path.join(guardRoot, fixture.loopGuard.sessionFile), 'utf8')).sessionId, fixture.loopGuard.sessionState.sessionId);
  assert(fs.statSync(guardSweepLock).isDirectory());
  return { recreated: 3, loopGuardSurfacesMaterialized: 4 };
}

function replayFixturesExecute(tempRoot) {
  const fixture = json('fixtures/event-streams.json');
  const roundState = require(path.join(SKILL_ROOT, 'runtime/lib/council/round-state-jsonl.cjs'));
  for (const [id, stream] of Object.entries(fixture.streams)) {
    fs.writeFileSync(path.join(tempRoot, `${id}.jsonl`), jsonl(stream.rows), 'utf8');
  }
  const sessionRows = roundState.readRoundStateRecords(path.join(tempRoot, 'council-session-state.jsonl'));
  const roundRows = roundState.readRoundStateRecords(path.join(tempRoot, 'council-round-state.jsonl'));
  assert.equal(sessionRows.length, fixture.streams['council-session-state'].rows.length);
  assert.equal(roundRows.length, fixture.streams['council-round-state'].rows.length);
  return { materializedStreams: Object.keys(fixture.streams).length, shippedRoundStateReaderRows: sessionRows.length + roundRows.length };
}

function validateArtifacts() {
  const absoluteUserRoot = `/${'Us' + 'ers'}/`;
  for (const relativePath of EVIDENCE_JSON) {
    const content = read(relativePath);
    const value = JSON.parse(content);
    assert.equal(value.baseSha, BASE_SHA, `${relativePath} BASE mismatch`);
    assert(!content.includes(absoluteUserRoot), `${relativePath} contains an absolute user path`);
    assert(!/BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY/.test(content), `${relativePath} contains a credential marker`);
  }
  const replay = json('replay-rollback-manifest.json');
  for (const fixture of replay.fixtures) {
    assert.equal(sha(fs.readFileSync(path.join(LEAF, fixture.path))), fixture.sha256, `${fixture.path} digest mismatch`);
  }
}

function validateManifestDigests() {
  const manifest = json('base-manifest.json');
  for (const [relativePath, digest] of Object.entries(manifest.artifactDigests)) {
    assert.equal(sha(fs.readFileSync(path.join(REPO, relativePath))), digest, `${relativePath} BASE manifest digest mismatch`);
  }
  const sourcePaths = {
    modeRegistrySha256: `${SKILL}/mode-registry.json`,
    hubRouterSha256: `${SKILL}/hub-router.json`,
    runtimeStateFormatSha256: `${SKILL}/runtime/references/state-format.md`,
    coverageGraphSqliteSha256: `${SKILL}/runtime/database/deep-loop-graph.sqlite`,
    councilGraphSqliteSha256: `${SKILL}/runtime/database/council-graph.sqlite`,
  };
  for (const [key, relativePath] of Object.entries(sourcePaths)) {
    assert.equal(sha(gitObjectBuffer(relativePath)), manifest.sourceDigests[key], `${key} mismatch`);
  }
  assert.equal(run('git', ['rev-parse', `${BASE_SHA}^{tree}`]).trim(), manifest.base.rootTreeOid);
  assert.equal(run('git', ['rev-parse', `${BASE_SHA}:${SKILL}`]).trim(), manifest.base.skillTreeOid);
  assert.equal(run('git', ['rev-parse', `${BASE_SHA}:.opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census`]).trim(), manifest.base.leafTreeOid);
  for (const row of manifest.preExistingBaseline.routerUnificationCommits) run('git', ['merge-base', '--is-ancestor', row.commit, BASE_SHA]);
  run('git', ['merge-base', '--is-ancestor', manifest.preExistingBaseline.kebabRenames.commit, BASE_SHA]);

  const gitlinks = run('git', ['ls-tree', '-r', BASE_SHA]).split('\n').filter((line) => line.startsWith('160000 ')).map((line) => line.split('\t')[1]);
  assert.deepEqual(manifest.submodules, { state: 'EMPTY', count: 0, gitlinks: [], discoveryCommand: `git ls-tree -r ${BASE_SHA} (mode 160000)` });
  assert.deepEqual(gitlinks, manifest.submodules.gitlinks);

  const renameManifest = json('pre-existing-kebab-renames.json');
  const renameOutput = run('git', ['diff-tree', '-r', '-M', '--diff-filter=R', '--name-status', `${renameManifest.commit}^`, renameManifest.commit, '--', ...renameManifest.scope]).trim();
  const renames = renameOutput.split('\n').filter(Boolean).map((line) => {
    const [score, from, to] = line.split('\t');
    return { similarity: Number(score.slice(1)), from, to };
  });
  assert.deepEqual(renames, renameManifest.renames);
  assert.equal(renameManifest.renameCount, renames.length);

  const handoff = json('phase-004-handoff-manifest.json');
  assert.equal(handoff.artifactCount, handoff.artifacts.length);
  for (const artifact of handoff.artifacts) {
    assert.equal(sha(fs.readFileSync(path.join(REPO, artifact.path))), artifact.sha256, `${artifact.path} handoff digest mismatch`);
  }
  assert.equal(handoff.closure.unresolvedTaxonomyRows, 0);
  assert.equal(handoff.closure.unresolvedSchemaRows, 0);
  assert.equal(handoff.closure.unresolvedStateRows, 0);
  const eventRows = json('event-schema-census.json').rows;
  const producerOnlyRows = eventRows.filter((row) => row.classification === 'producer-only');
  const unjustifiedProducerOnlyRows = producerOnlyRows.filter((row) => typeof row.producerOnlyJustification !== 'string' || row.producerOnlyJustification.trim() === '');
  assert.equal(handoff.closure.eventProducerOnly, producerOnlyRows.length);
  assert.equal(handoff.closure.eventUnjustifiedProducerOnly, unjustifiedProducerOnlyRows.length);
  assert.equal(handoff.closure.eventUnjustifiedProducerOnly, 0);
  assert.equal(handoff.closure.eventConsumerOnly, 0);
  assert.equal(handoff.closure.eventUnclassified, 0);
  const backendsWithoutMutability = json('state-backend-census.json').rows.filter((row) => typeof row.mutability !== 'string' || row.mutability.trim() === '').length;
  assert.equal(handoff.closure.backendsWithoutMutability, backendsWithoutMutability);
  assert.equal(backendsWithoutMutability, 0);
}

function main() {
  const mode = process.argv[2] || '--static';
  assert(['--static', '--execute', '--discovery'].includes(mode), `unsupported mode ${mode}`);
  if (mode === '--discovery') {
    process.stdout.write(`${JSON.stringify({
      eventSources: discoverEventSources(),
      eventSurfaceIds: discoverEventSurfaceIds(),
      persistenceSources: discoverPersistenceSources(),
      backendIds: discoverBackendIds(),
    }, null, 2)}\n`);
    return;
  }
  validateArtifacts();
  validateManifestDigests();
  const behavior = validateBehavior();
  const { taxonomy, subsystems, events, backends, ledger, discovery } = validateCensuses(behavior.scenarioIds);
  const replay = replayFixturesStatic(events);
  const report = {
    baseSha: BASE_SHA,
    mode,
    counts: {
      workflowFamilies: taxonomy.counts.workflowFamilies,
      registeredWorkflowModes: taxonomy.counts.registeredWorkflowModes,
      researchWorkstreams: taxonomy.counts.researchWorkstreams,
      subsystems: subsystems.subsystemCount,
      eventSurfaces: events.rows.length,
      stateBackends: backends.rows.length,
      producerOnlySurfaces: events.rows.filter((row) => row.classification === 'producer-only').length,
      unjustifiedProducerOnlySurfaces: events.rows.filter((row) => row.classification === 'producer-only' && (!row.producerOnlyJustification || row.producerOnlyJustification.trim() === '')).length,
      backendsWithValidMutability: backends.rows.filter((row) => row.mutability).length,
      ledgerUnknown: ledger.closure.unknown,
      existingScenarios: behavior.baseline.counts.existing,
      additiveScenarios: behavior.baseline.counts.added,
    },
    discovery,
    replay,
    staticWrites: 0,
  };

  if (mode === '--execute') {
    const scopeBefore = sha(`${filesDigest(SKILL_ROOT)}:${filesDigest(LEAF)}`);
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'deep-loop-evidence-'));
    try {
      report.execute = {
        materializedReplay: replayFixturesExecute(tempRoot),
        rollback: {
          coverage: exerciseDatabase(tempRoot, 'coverage-graph.sql', 'coverage'),
          council: exerciseDatabase(tempRoot, 'council-graph.sql', 'council'),
          controls: exerciseControls(tempRoot),
        },
      };
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
    const scopeAfter = sha(`${filesDigest(SKILL_ROOT)}:${filesDigest(LEAF)}`);
    assert.equal(scopeAfter, scopeBefore, 'tracked evidence scope changed during executing checks');
    report.trackedScopeMutations = 0;
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
