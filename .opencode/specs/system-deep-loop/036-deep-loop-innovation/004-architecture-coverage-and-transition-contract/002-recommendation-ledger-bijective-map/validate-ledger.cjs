// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Recommendation Ledger Builder and Validator                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const BASE_COMMIT = 'fe6ca3030917073f3b478bc044e10034dcc4394b';
const LEDGER_FILE = 'recommendation-ledger.json';
const CSV_FILE = 'recommendation-ledger.csv';
const SCHEMA_FILE = 'recommendation-ledger.schema.json';
const REPORT_FILE = 'recommendation-ledger-validation.json';

const INPUTS = Object.freeze({
  runA: {
    id: 'run-a-primary',
    path: '.opencode/specs/system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research/research/research.md',
    sha256: '86b0e4a7a6702053149a4c06a3f607102edc58cb364d6493be5350bb10f14016',
    adapter: 'markdown-section-17-ranked-list',
    expected_count: 8,
    run_iterations: 45
  },
  runACompanion: {
    id: 'run-a-companion-evidence',
    path: '.opencode/specs/system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research/research/findings-registry.json',
    sha256: '111d4c67c7e10da127b0df528cc4c19eb682d2aceafaddb79f25456037511e4a',
    adapter: 'companion-evidence-without-recommendations',
    expected_count: null,
    run_iterations: 45
  },
  runB: {
    id: 'run-b-primary',
    path: '.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/findings-registry.json',
    sha256: '3557433baaebceaf53b01f21ca4ca02807c9f093c3f4285e3a6558c451f59912',
    adapter: 'json-recommendations-array',
    expected_count: 59,
    run_iterations: 20
  },
  runC: {
    id: 'run-c-primary',
    path: '.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/findings-registry-modes.json',
    sha256: '5ff96cbaf7638d2ff8d48199de976b90a118384a89b42a5e126543dd8b9ec30c',
    adapter: 'json-recommendations-array',
    expected_count: 111,
    run_iterations: 40
  },
  taxonomy: {
    id: 'taxonomy-enum',
    path: '.opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/spec.md',
    sha256: '99dbbd9f6156bc0f1e3ce6261ba5e92ca97077ada778d1c8820651b3c1f4d17d',
    adapter: 'frozen-section-3-enum',
    expected_count: null,
    run_iterations: null
  },
  phaseManifest: {
    id: 'phase-manifest',
    path: '.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json',
    sha256: '363da601d45c5eacd90d4ce02adc2af14f80f21d62df6edaf9afa49f6efda50d',
    adapter: 'json-phase-array',
    expected_count: 15,
    run_iterations: null
  },
  programSpec: {
    id: 'program-phase-map',
    path: '.opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md',
    sha256: 'd5cb19392cfec58a51869de37e1f8c546f9db3669d703ad0174a6fec6923d634',
    adapter: 'frozen-phase-map',
    expected_count: 15,
    run_iterations: null
  }
});

const TAXONOMY = Object.freeze({
  'workflow-family': Object.freeze([
    'research',
    'review',
    'ai-council',
    'improvement',
    'alignment'
  ]),
  'workflow-mode': Object.freeze([
    'research',
    'review',
    'ai-council',
    'agent-improvement',
    'model-benchmark',
    'skill-benchmark',
    'alignment'
  ]),
  'research-workstream': Object.freeze([
    'deep-research',
    'deep-review',
    'deep-ai-council',
    'deep-improvement',
    'deep-alignment',
    'agent-improvement',
    'model-benchmark',
    'skill-benchmark'
  ]),
  'runtime-subsystem': Object.freeze([
    'convergence',
    'state-jsonl-checkpointing',
    'fan-out-fan-in',
    'dedup-novelty',
    'gauges-observability',
    'budget-cost',
    'locks-recovery',
    'continuity-threading'
  ])
});

const PHASE_IDS = Object.freeze([
  '003', '004', '005', '006', '007',
  '008', '009', '010', '011', '012',
  '013', '014', '015', '016', '017'
]);

const PHASE_OWNERSHIP = Object.freeze({
  '003': 'baseline, taxonomy, and state census',
  '004': 'architecture, coverage, and transition contract',
  '005': 'fan-out live-tools compatibility',
  '006': 'transition-authorized ledger core',
  '007': 'shared evidence and control services',
  '008': 'compatibility, shadow parity, and rollback',
  '009': 'durable fan-out and fan-in orchestration',
  '010': 'novelty, claims, continuity, and projections',
  '011': 'convergence, termination, and health',
  '012': 'shared mode contracts and fixtures',
  '013': 'per-mode and per-lane migrations',
  '014': 'staged migration and authority cutover',
  '015': 'legacy-writer retirement',
  '016': 'whole-system gate',
  '017': 'integration and closeout'
});

const ZERO_PHASE_REASONS = Object.freeze({
  '003': 'No source recommendation is a baseline-census deliverable; source and taxonomy freezing are prerequisite evidence.',
  '004': 'This phase classifies the corpus and freezes contracts; the source recommendations describe owned downstream behavior.',
  '015': 'No source recommendation independently calls for legacy-writer removal; retirement remains gated by cutover telemetry.',
  '017': 'No source recommendation independently targets repository integration or closeout; that work remains an operational gate.'
});

const RUN_A_TARGETS = Object.freeze([
  'convergence',
  'state',
  'council/alignment',
  'fan-out',
  'review',
  'dedup',
  'observability',
  'budgets'
]);

const RUN_A_NORMALIZED_TARGETS = Object.freeze([
  ['runtime-subsystem', 'convergence'],
  ['runtime-subsystem', 'state-jsonl-checkpointing'],
  ['research-workstream', 'deep-ai-council'],
  ['runtime-subsystem', 'fan-out-fan-in'],
  ['research-workstream', 'deep-review'],
  ['runtime-subsystem', 'dedup-novelty'],
  ['runtime-subsystem', 'gauges-observability'],
  ['runtime-subsystem', 'budget-cost']
]);

const BORDERLINE_FOR_REVIEW = Object.freeze([
  'DLR-B-040',
  'DLR-B-045',
  'DLR-C-023',
  'DLR-C-024',
  'DLR-C-111'
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CLASSIFICATION DATA
// ─────────────────────────────────────────────────────────────────────────────

const CLASSIFICATIONS = new Map();

function addAdoptions(phase, ids) {
  for (const id of ids) {
    CLASSIFICATIONS.set(id, {
      kind: 'adopted',
      disposition: 'adopt-as-phase-' + phase,
      rationale: 'Phase ' + phase + ' owns ' + PHASE_OWNERSHIP[phase] + '.'
    });
  }
}

function addMerge(id, target, rationale) {
  CLASSIFICATIONS.set(id, {
    kind: 'merged',
    disposition: 'merge-into-' + target,
    rationale
  });
}

function addDeferral(id, rationale) {
  CLASSIFICATIONS.set(id, {
    kind: 'deferred',
    disposition: 'defer-with-reason',
    rationale
  });
}

addAdoptions('005', [
  'DLR-B-001', 'DLR-B-002', 'DLR-B-014'
]);

addAdoptions('006', [
  'DLR-A-002', 'DLR-B-003', 'DLR-B-019', 'DLR-B-035', 'DLR-B-057'
]);

addAdoptions('007', [
  'DLR-A-007', 'DLR-A-008', 'DLR-B-020', 'DLR-B-034',
  'DLR-B-036', 'DLR-B-037', 'DLR-B-039'
]);

addAdoptions('008', [
  'DLR-B-021'
]);

addAdoptions('009', [
  'DLR-A-004', 'DLR-B-005', 'DLR-B-008', 'DLR-B-010', 'DLR-B-013',
  'DLR-B-025', 'DLR-B-026', 'DLR-B-027', 'DLR-B-041', 'DLR-B-043'
]);

addAdoptions('010', [
  'DLR-A-006', 'DLR-B-007', 'DLR-B-031', 'DLR-B-032'
]);

addAdoptions('011', [
  'DLR-A-001', 'DLR-B-016', 'DLR-B-018',
  'DLR-B-040', 'DLR-B-045', 'DLR-B-059'
]);

addAdoptions('012', [
  'DLR-B-056'
]);

addAdoptions('013', [
  'DLR-A-003', 'DLR-A-005',
  'DLR-B-022', 'DLR-B-023', 'DLR-B-028', 'DLR-B-048', 'DLR-B-049',
  'DLR-B-051', 'DLR-B-052', 'DLR-B-053', 'DLR-B-055',
  'DLR-C-001', 'DLR-C-003', 'DLR-C-004', 'DLR-C-005', 'DLR-C-006',
  'DLR-C-007', 'DLR-C-008', 'DLR-C-011', 'DLR-C-012',
  'DLR-C-014', 'DLR-C-015', 'DLR-C-016', 'DLR-C-020', 'DLR-C-023',
  'DLR-C-024', 'DLR-C-025',
  'DLR-C-028', 'DLR-C-039', 'DLR-C-040', 'DLR-C-041', 'DLR-C-042',
  'DLR-C-045', 'DLR-C-046', 'DLR-C-047', 'DLR-C-049', 'DLR-C-050',
  'DLR-C-054', 'DLR-C-056', 'DLR-C-057',
  'DLR-C-058', 'DLR-C-062', 'DLR-C-063', 'DLR-C-069', 'DLR-C-070',
  'DLR-C-071', 'DLR-C-072',
  'DLR-C-073', 'DLR-C-074', 'DLR-C-079', 'DLR-C-080', 'DLR-C-082',
  'DLR-C-083', 'DLR-C-084', 'DLR-C-085', 'DLR-C-087',
  'DLR-C-088', 'DLR-C-089', 'DLR-C-090', 'DLR-C-091', 'DLR-C-093',
  'DLR-C-097', 'DLR-C-099', 'DLR-C-100', 'DLR-C-102',
  'DLR-C-104', 'DLR-C-106', 'DLR-C-107', 'DLR-C-108', 'DLR-C-109',
  'DLR-C-110', 'DLR-C-111'
]);

addAdoptions('014', [
  'DLR-C-048', 'DLR-C-078'
]);

addAdoptions('016', [
  'DLR-B-044'
]);

addMerge(
  'DLR-B-004',
  'DLR-B-014',
  'The frozen manifest in the target row is the stronger form of the same deterministic fan-out expansion contract.'
);
addMerge(
  'DLR-B-006',
  'DLR-B-023',
  'The target row preserves the stronger five-role information-flow boundary while retaining isolated proposal generation.'
);
addMerge(
  'DLR-B-011',
  'DLR-B-020',
  'The shared replay planner subsumes the fan-out-only reuse, re-execute, compensate, and reject decision set.'
);
addMerge(
  'DLR-B-012',
  'DLR-B-025',
  'The target policy receipt is the canonical form of the same replayable fan-in admission decision.'
);
addMerge(
  'DLR-B-017',
  'DLR-B-037',
  'The hierarchical budget service is the stronger general form of the same root lease and path-covering debit contract.'
);
addMerge(
  'DLR-B-024',
  'DLR-B-023',
  'The target row owns the shared five-role separation; alignment consumes that contract through its mode migration.'
);
addMerge(
  'DLR-B-029',
  'DLR-C-046',
  'The frozen evaluator capsule and signed receipt are the stronger form of the same fingerprint-matched promotion bundle.'
);
addMerge(
  'DLR-B-030',
  'DLR-B-036',
  'The typed gauge catalog subsumes these cascade-specific health and cost projections.'
);
addMerge(
  'DLR-B-033',
  'DLR-C-006',
  'The logged research branch scheduler is the stronger form of the same divergence-driven next-focus selection.'
);
addMerge(
  'DLR-B-038',
  'DLR-B-037',
  'Spawn and retry leasing is an application of the adopted hierarchical budget lease service.'
);
addMerge(
  'DLR-B-042',
  'DLR-B-019',
  'The detailed prepared, dispatched, result, unknown, reconciled, and compensated event set is the stronger effect gateway contract.'
);
addMerge(
  'DLR-B-046',
  'DLR-B-028',
  'The adopted evaluation DAG already encodes the same deterministic-first, calibrated-score, generative-judge ladder.'
);
addMerge(
  'DLR-B-050',
  'DLR-B-052',
  'The seat-calibration registry is the stronger scoped form of the same judge reliability profile.'
);
addMerge(
  'DLR-B-054',
  'DLR-B-059',
  'The health witness and degeneration benchmark subsume the same convergence and quarantine event semantics.'
);
addMerge(
  'DLR-C-002',
  'DLR-C-004',
  'The target row is the stronger append-only claim, evidence, contradiction, independence, and supersession ledger.'
);
addMerge(
  'DLR-C-009',
  'DLR-C-004',
  'The target row already owns the versioned claim-evidence ledger from which these gauges and citations derive.'
);
addMerge(
  'DLR-C-010',
  'DLR-C-004',
  'The target row preserves the stronger claim intermediate representation, evidence edges, source versions, and lifecycle history.'
);
addMerge(
  'DLR-C-013',
  'DLR-C-016',
  'The target event and receipt contract is the stronger form of the same candidate and independent-proof pipeline.'
);
addMerge(
  'DLR-C-017',
  'DLR-C-024',
  'The dimension-by-reasoning-distance grid is the stronger staged form of the same coverage ledger.'
);
addMerge(
  'DLR-C-018',
  'DLR-C-015',
  'The executable closure pipeline already covers immutable refutation, baseline comparison, and scoped replay evidence.'
);
addMerge(
  'DLR-C-019',
  'DLR-C-016',
  'The target proof-receipt lifecycle subsumes verification attempts and independent-class support or refutation.'
);
addMerge(
  'DLR-C-021',
  'DLR-C-015',
  'The target executable closure contract already requires pre-fix, post-fix, and baseline regression evidence.'
);
addMerge(
  'DLR-C-022',
  'DLR-C-016',
  'The target candidate and proof event schema is the stronger canonical finding-registry input.'
);
addMerge(
  'DLR-C-026',
  'DLR-C-016',
  'The target append-only finding and proof lifecycle retains the same suspected-through-verified states and receipts.'
);
addMerge(
  'DLR-C-027',
  'DLR-C-015',
  'The target executable closure pipeline is the stronger general verification ladder for verdict-affecting findings.'
);
addMerge(
  'DLR-C-029',
  'DLR-C-041',
  'The strict private belief and plural-verdict schema is the stronger form of the same typed belief-message protocol.'
);
addMerge(
  'DLR-C-030',
  'DLR-C-039',
  'The extended council gate retains these control arms and adds adversarial and marginal-value cases.'
);
addMerge(
  'DLR-C-031',
  'DLR-B-022',
  'The adopted effective-independence contract already seals proposals, records correlation metadata, and computes effective seats.'
);
addMerge(
  'DLR-C-032',
  'DLR-B-051',
  'The sequential seat router is the stronger cost-aware form of the same marginal diversity auction.'
);
addMerge(
  'DLR-C-033',
  'DLR-B-023',
  'The adopted role-separated, blinded adjudication pipeline subsumes the same trajectory information-flow boundaries.'
);
addMerge(
  'DLR-C-034',
  'DLR-B-049',
  'The adopted protocol router is the stronger form of the same typed factual, plan, debate, and plural-disagreement terminal semantics.'
);
addMerge(
  'DLR-C-035',
  'DLR-B-051',
  'The sequential seat router already selects marginal calibrated evidence by expected value per typed cost.'
);
addMerge(
  'DLR-C-036',
  'DLR-B-048',
  'The target blinded pairwise adjudicator already requires counterbalanced order, masking, bias audit, and abstention.'
);
addMerge(
  'DLR-C-037',
  'DLR-B-055',
  'The adopted stance and flip event stream is the stronger form of evidence-conditioned changes and conformity gauges.'
);
addMerge(
  'DLR-C-038',
  'DLR-C-042',
  'The target robustness suite is the stronger form of the same anonymization, order, authority, and majority perturbations.'
);
addMerge(
  'DLR-C-043',
  'DLR-C-049',
  'The versioned trial-score stages are the stronger form of the same candidate evaluation archive and promotion receipts.'
);
addMerge(
  'DLR-C-044',
  'DLR-C-050',
  'The adopted bounded proposal portfolio preserves targeted mutation, crossover, and novelty restart without speculative meta-evolution.'
);
addMerge(
  'DLR-C-051',
  'DLR-C-048',
  'The target staged shadow and canary lifecycle is the stronger operational form of the same signed shadowing gate.'
);
addMerge(
  'DLR-C-052',
  'DLR-C-046',
  'The adopted evaluator capsule already requires a matching signed evaluation receipt at every promotion gate.'
);
addMerge(
  'DLR-C-055',
  'DLR-C-046',
  'The target lane-independent evaluator capsule is the stronger form of the same frozen evaluator epoch and hash binding.'
);
addMerge(
  'DLR-C-059',
  'DLR-C-069',
  'The applicability closure matrix with positive, negative, and metamorphic sentinels is the stronger witness contract.'
);
addMerge(
  'DLR-C-060',
  'DLR-C-062',
  'The exact expiring deviation assertion is the stronger governed-exception representation.'
);
addMerge(
  'DLR-C-061',
  'DLR-C-058',
  'The immutable authority capsule compiler is the stronger shared authority contract for proof-carrying determinations.'
);
addMerge(
  'DLR-C-064',
  'DLR-C-058',
  'The adopted authority compiler already carries stable rules, source spans, typed applicability, evidence policy, witnesses, and rule-test coverage.'
);
addMerge(
  'DLR-C-065',
  'DLR-C-062',
  'The target exact deviation assertion subsumes evidence binding, expiry, authority compatibility, and verifier-triggered invalidation.'
);
addMerge(
  'DLR-C-066',
  'DLR-C-071',
  'The semantic invalidation graph is the stronger form of stable lane identity, authority-diff impact analysis, and affected replay.'
);
addMerge(
  'DLR-C-067',
  'DLR-C-058',
  'The adopted authority capsule already binds source digest, rule manifest, epoch, verifier, predecessor, and validity.'
);
addMerge(
  'DLR-C-068',
  'DLR-C-062',
  'The exact expiring deviation ledger is the stronger canonical form; shadow auditing remains an enforcement mode of that ledger.'
);
addMerge(
  'DLR-C-076',
  'DLR-C-085',
  'The agent-change compiler is the stronger end-to-end contract compiler for clauses, assertions, scenarios, and promotion impact.'
);
addMerge(
  'DLR-C-077',
  'DLR-C-084',
  'The patch-causal scenario compiler is the stronger source for discipline, conflict, failure, and hostile-override stress cases.'
);
addMerge(
  'DLR-C-081',
  'DLR-C-078',
  'The staged behavioral compatibility lifecycle already includes sealed cross-executor evidence, transfer certification, and rollback ancestry.'
);
addMerge(
  'DLR-C-092',
  'DLR-C-099',
  'The item-integrity registry is the stronger source of canary exposure, retirement, replacement, and affected-item replay.'
);
addMerge(
  'DLR-C-094',
  'DLR-C-088',
  'The adopted benchmark design and trial event contract already records pairing, randomization, repeated seeds, receipts, and normalized usage.'
);
addMerge(
  'DLR-C-095',
  'DLR-C-100',
  'The selection-certificate reducer is the stronger confirmatory engine with pairing, nested uncertainty, hard floors, and multiplicity control.'
);
addMerge(
  'DLR-C-096',
  'DLR-C-100',
  'The target selection certificate already emits switch, retain, conditional-route, or insufficient-evidence policy outcomes.'
);
addMerge(
  'DLR-C-098',
  'DLR-C-089',
  'The judge-calibration firewall is the stronger blinded, mirrored, style-controlled, oracle-corrected adjudication contract.'
);
addMerge(
  'DLR-C-103',
  'DLR-C-106',
  'The live off, auto, forced, and placebo attribution matrix is the stronger executable treatment lattice.'
);
addMerge(
  'DLR-C-105',
  'DLR-C-109',
  'The canonical skill-effect certificate is the stronger issued, withheld, expired, and digest-bound contribution record.'
);

addDeferral(
  'DLR-B-009',
  'Exact-hash pre-coordination adds a new contention surface before evidence shows duplicate work is costly enough to justify it.'
);
addDeferral(
  'DLR-B-015',
  'A model-stratum calibration registry is premature until held-out adjudicated fixtures and stable model fingerprints exist.'
);
addDeferral(
  'DLR-B-047',
  'Learned controller policy promotion is speculative until the fixed replayable controller and paired replay corpus are established.'
);
addDeferral(
  'DLR-B-058',
  'The adaptive adjudication broker and off-policy estimators add substantial policy complexity before fixed council controls are calibrated.'
);
addDeferral(
  'DLR-C-053',
  'A non-extractive evaluator oracle and epoch-burn protocol are high-cost anti-gaming controls without measured leakage in the current system.'
);
addDeferral(
  'DLR-C-075',
  'Training a separate improver-agent lane creates a second optimization program before typed agent changes and sealed evaluation are proven.'
);
addDeferral(
  'DLR-C-086',
  'IRT calibration and time-uniform adaptive allocation are optimization layers that can wait for stable family-level promotion evidence.'
);
addDeferral(
  'DLR-C-101',
  'Trajectory-twin replay is expensive and fidelity-sensitive; defer until the ordinary paired benchmark and capsule contracts are stable.'
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOURCE EXTRACTION
// ─────────────────────────────────────────────────────────────────────────────

function fail(message) {
  throw new Error(message);
}

function assertCondition(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function findRepoRoot(startPath) {
  let current = path.resolve(startPath);
  while (true) {
    if (fs.existsSync(path.join(current, '.git'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      fail('Unable to resolve repository root from ' + startPath);
    }
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(__dirname);

function readFrozenInput(input) {
  const absolutePath = path.join(REPO_ROOT, input.path);
  const bytes = fs.readFileSync(absolutePath);
  const actualHash = sha256(bytes);
  assertCondition(
    actualHash === input.sha256,
    'Frozen input drift for ' + input.path + ': expected ' + input.sha256 + ', got ' + actualHash
  );
  return bytes.toString('utf8');
}

function parseJsonInput(input) {
  const text = readFrozenInput(input);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail('Invalid JSON in frozen input ' + input.path + ': ' + error.message);
  }
}

function padOrdinal(value) {
  return String(value).padStart(3, '0');
}

function qualifySourceLocator(sourceRun, rawLocator) {
  return sourceRun + ':' + rawLocator;
}

function extractRunA() {
  const text = readFrozenInput(INPUTS.runA);
  const start = text.indexOf('### Highest-leverage adoptions');
  const end = text.indexOf('### Open questions', start);
  assertCondition(start >= 0 && end > start, 'Run-a section 17 markers are missing or reordered');
  const block = text.slice(start, end);
  const lines = block.split(/\r?\n/).filter(function filterRanked(line) {
    return /^\d+\.\s/.test(line);
  });
  assertCondition(lines.length === 8, 'Run-a adapter expected 8 ranked rows, got ' + lines.length);

  return lines.map(function mapRunA(line, index) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    assertCondition(Boolean(match), 'Malformed run-a ranked recommendation: ' + line);
    const rank = Number(match[1]);
    assertCondition(rank === index + 1, 'Run-a ranks are not gap-free at rank ' + rank);
    return {
      id: 'DLR-A-' + padOrdinal(rank),
      source_run: 'run-a',
      source_path: INPUTS.runA.path,
      source_locator: qualifySourceLocator('run-a', 'section-17/rank-' + padOrdinal(rank)),
      source_sha256: INPUTS.runA.sha256,
      source_rank: rank,
      source_iteration: null,
      original_recommendation: match[2],
      original_target: RUN_A_TARGETS[index],
      source_rationale: null,
      source_evidence: null,
      source_effort: null,
      source_impact: null,
      source_thread: null,
      source_mode: null,
      source_angle: null,
      source_uniqueness: null,
      companion_evidence: {
        path: INPUTS.runACompanion.path,
        sha256: INPUTS.runACompanion.sha256
      }
    };
  });
}

function extractJsonRun(input, runLabel, idPrefix) {
  const parsed = parseJsonInput(input);
  assertCondition(Array.isArray(parsed.recommendations), input.path + ' has no recommendations array');
  assertCondition(
    parsed.recommendations.length === input.expected_count,
    input.path + ' expected ' + input.expected_count + ' recommendations, got ' + parsed.recommendations.length
  );
  const uniqueTexts = new Set(parsed.recommendations.map(function recommendationText(row) {
    return row.rec;
  }));
  assertCondition(
    uniqueTexts.size === input.expected_count,
    input.path + ' contains duplicate recommendation text'
  );

  return parsed.recommendations.map(function mapJsonRow(record, index) {
    assertCondition(typeof record.rec === 'string' && record.rec.trim(), 'Blank recommendation at index ' + index);
    assertCondition(typeof record.target === 'string' && record.target.trim(), 'Blank target at index ' + index);
    return {
      id: idPrefix + padOrdinal(index + 1),
      source_run: runLabel,
      source_path: input.path,
      source_locator: qualifySourceLocator(runLabel, '/recommendations/' + index),
      source_sha256: input.sha256,
      source_rank: null,
      source_iteration: record.iter,
      original_recommendation: record.rec,
      original_target: record.target,
      source_rationale: record.rationale,
      source_evidence: record.evidence,
      source_effort: record.effort,
      source_impact: record.impact,
      source_thread: record.thread === undefined ? null : record.thread,
      source_mode: record.mode === undefined ? null : record.mode,
      source_angle: record.angle === undefined ? null : record.angle,
      source_uniqueness: record.uniqueness === undefined ? null : record.uniqueness,
      companion_evidence: null
    };
  });
}

function extractSources() {
  const companion = parseJsonInput(INPUTS.runACompanion);
  assertCondition(
    !Object.prototype.hasOwnProperty.call(companion, 'recommendations'),
    'Run-a companion evidence unexpectedly contains a recommendations array'
  );
  assertCondition(
    companion.repos &&
      typeof companion.repos === 'object' &&
      !Array.isArray(companion.repos) &&
      Object.keys(companion.repos).length === 216,
    'Run-a companion repo count drift'
  );

  const runA = extractRunA();
  const runB = extractJsonRun(INPUTS.runB, 'run-b', 'DLR-B-');
  const runC = extractJsonRun(INPUTS.runC, 'run-c', 'DLR-C-');
  const emptyUniqueness = runC
    .filter(function emptyValue(row) {
      return row.source_uniqueness === '';
    })
    .map(function sourceOrdinal(row) {
      return Number(row.source_locator.split('/').pop());
    });
  assertCondition(
    JSON.stringify(emptyUniqueness) === JSON.stringify([53, 82, 88, 94]),
    'Run-c empty uniqueness ordinals drifted: ' + JSON.stringify(emptyUniqueness)
  );
  assertCondition(runA.length + runB.length + runC.length === 178, 'Source arithmetic is not 8 + 59 + 111');
  return { runA, runB, runC, all: runA.concat(runB, runC) };
}

function loadManifestPhases() {
  const manifest = parseJsonInput(INPUTS.phaseManifest);
  assertCondition(Array.isArray(manifest.phases), 'Phase manifest has no phases array');
  assertCondition(
    manifest.rec_corpus &&
      manifest.rec_corpus.run_a_45iter === 8 &&
      manifest.rec_corpus.run_b_20iter === 59 &&
      manifest.rec_corpus.run_c_40iter === 111 &&
      manifest.rec_corpus.total === 178,
    'Phase manifest recommendation corpus arithmetic drifted'
  );
  const phases = manifest.phases.filter(function implementationPhase(row) {
    return PHASE_IDS.includes(row.phase);
  });
  assertCondition(phases.length === 15, 'Manifest does not enumerate all implementation phases');
  assertCondition(
    JSON.stringify(phases.map(function phaseId(row) { return row.phase; })) === JSON.stringify(PHASE_IDS),
    'Manifest implementation phase IDs drifted'
  );
  return phases.map(function canonicalPhase(row) {
    return {
      phase: row.phase,
      slug: row.slug,
      kind: row.kind
    };
  });
}

function verifyTaxonomyInput() {
  const text = readFrozenInput(INPUTS.taxonomy);
  const sourceTokens = [
    ...TAXONOMY['workflow-family'],
    ...TAXONOMY['workflow-mode'],
    ...TAXONOMY['research-workstream'],
    'convergence',
    'state JSONL/checkpointing',
    'fan-out/fan-in',
    'dedup/novelty',
    'gauges/observability',
    'budget/cost',
    'locks/recovery',
    'continuity/threading'
  ];
  for (const value of sourceTokens) {
    assertCondition(text.includes(value), 'Frozen taxonomy source is missing ' + value);
  }
  assertCondition(text.includes('ai-system-improvement') && text.includes('excluded'), 'Excluded mode statement drifted');
  readFrozenInput(INPUTS.programSpec);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CANONICAL BUILD
// ─────────────────────────────────────────────────────────────────────────────

function normalizedTarget(sourceRow) {
  if (sourceRow.source_run === 'run-a') {
    const index = sourceRow.source_rank - 1;
    const pair = RUN_A_NORMALIZED_TARGETS[index];
    return {
      taxonomy_layer: pair[0],
      taxonomy_key: pair[1],
      primary_rationale: 'The ranked source names ' + sourceRow.original_target +
        ' as the owning concern; the complete source wording remains preserved.'
    };
  }

  if (sourceRow.source_run === 'run-c') {
    assertCondition(
      TAXONOMY['research-workstream'].includes(sourceRow.source_mode),
      'Run-c mode is outside the frozen research-workstream enum: ' + sourceRow.source_mode
    );
    return {
      taxonomy_layer: 'research-workstream',
      taxonomy_key: sourceRow.source_mode,
      primary_rationale: sourceRow.source_mode +
        ' is the owning per-mode workstream; compound runtime targets remain in original_target.'
    };
  }

  const raw = sourceRow.original_target;
  const workstreamPrefixes = [
    'deep-research',
    'deep-review',
    'deep-ai-council',
    'deep-improvement',
    'deep-alignment',
    'agent-improvement',
    'model-benchmark',
    'skill-benchmark'
  ];
  for (const prefix of workstreamPrefixes) {
    if (raw.startsWith(prefix)) {
      return {
        taxonomy_layer: 'research-workstream',
        taxonomy_key: prefix,
        primary_rationale: prefix +
          ' leads the source target and owns the mode behavior; secondary runtime targets remain preserved.'
      };
    }
  }

  const runtimeMappings = [
    ['runtime/convergence', 'convergence'],
    ['runtime/state-jsonl-checkpointing', 'state-jsonl-checkpointing'],
    ['runtime/fan-out-automation', 'fan-out-fan-in'],
    ['runtime/fan-out-fan-in', 'fan-out-fan-in'],
    ['runtime/dedup-novelty', 'dedup-novelty'],
    ['runtime/gauges-observability', 'gauges-observability'],
    ['runtime/budget-cost', 'budget-cost'],
    ['runtime/locks-recovery', 'locks-recovery'],
    ['runtime/continuity-threading', 'continuity-threading']
  ];
  for (const mapping of runtimeMappings) {
    if (raw.startsWith(mapping[0])) {
      return {
        taxonomy_layer: 'runtime-subsystem',
        taxonomy_key: mapping[1],
        primary_rationale: mapping[1] +
          ' leads the source target and owns the runtime change; compound targets remain preserved.'
      };
    }
  }
  fail('Unable to normalize source target for ' + sourceRow.id + ': ' + raw);
}

function buildSourceManifest() {
  return Object.values(INPUTS).map(function sourceManifestEntry(input) {
    return {
      id: input.id,
      path: input.path,
      sha256: input.sha256,
      adapter: input.adapter,
      expected_count: input.expected_count,
      run_iterations: input.run_iterations
    };
  });
}

function buildLedger() {
  verifyTaxonomyInput();
  const sources = extractSources();
  const phases = loadManifestPhases();
  assertCondition(CLASSIFICATIONS.size === 178, 'Classification map expected 178 entries, got ' + CLASSIFICATIONS.size);

  const sourceIds = new Set(sources.all.map(function sourceId(row) { return row.id; }));
  for (const id of CLASSIFICATIONS.keys()) {
    assertCondition(sourceIds.has(id), 'Classification references missing source ID ' + id);
  }

  const rows = sources.all.map(function buildRow(sourceRow) {
    const classification = CLASSIFICATIONS.get(sourceRow.id);
    assertCondition(Boolean(classification), 'Unclassified source row ' + sourceRow.id);
    return Object.assign({}, sourceRow, normalizedTarget(sourceRow), {
      disposition: classification.disposition,
      disposition_rationale: classification.rationale
    });
  });

  return {
    schema_version: '1.0.0',
    base_commit: BASE_COMMIT,
    source_manifest: buildSourceManifest(),
    taxonomy: TAXONOMY,
    phase_manifest: {
      path: INPUTS.phaseManifest.path,
      sha256: INPUTS.phaseManifest.sha256,
      phases
    },
    rows
  };
}

function buildSchema() {
  const nullableString = { type: ['string', 'null'] };
  const rowProperties = {
    id: { type: 'string', pattern: '^DLR-[ABC]-[0-9]{3}$' },
    source_run: { enum: ['run-a', 'run-b', 'run-c'] },
    source_path: { type: 'string', minLength: 1 },
    source_locator: {
      type: 'string',
      pattern: '^(run-a:section-17/rank-[0-9]{3}|run-[bc]:/recommendations/[0-9]+)$'
    },
    source_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
    source_rank: { type: ['integer', 'null'], minimum: 1 },
    source_iteration: { type: ['integer', 'null'], minimum: 1 },
    original_recommendation: { type: 'string', minLength: 1 },
    original_target: { type: 'string', minLength: 1 },
    source_rationale: nullableString,
    source_evidence: nullableString,
    source_effort: nullableString,
    source_impact: nullableString,
    source_thread: nullableString,
    source_mode: nullableString,
    source_angle: nullableString,
    source_uniqueness: nullableString,
    companion_evidence: {
      oneOf: [
        { type: 'null' },
        {
          type: 'object',
          additionalProperties: false,
          required: ['path', 'sha256'],
          properties: {
            path: { type: 'string', minLength: 1 },
            sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' }
          }
        }
      ]
    },
    taxonomy_layer: {
      enum: ['workflow-family', 'workflow-mode', 'research-workstream', 'runtime-subsystem']
    },
    taxonomy_key: { type: 'string', minLength: 1, not: { const: 'unknown' } },
    primary_rationale: { type: 'string', minLength: 1 },
    disposition: {
      type: 'string',
      pattern: '^(adopt-as-phase-(00[3-9]|01[0-7])|merge-into-DLR-[ABC]-[0-9]{3}|defer-with-reason|reject-with-reason)$'
    },
    disposition_rationale: { type: 'string', minLength: 1 }
  };

  return {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    '$id': 'recommendation-ledger.schema.json',
    title: 'Deep Loop Recommendation Ledger',
    type: 'object',
    additionalProperties: false,
    required: [
      'schema_version',
      'base_commit',
      'source_manifest',
      'taxonomy',
      'phase_manifest',
      'rows'
    ],
    properties: {
      schema_version: { const: '1.0.0' },
      base_commit: { const: BASE_COMMIT },
      source_manifest: {
        type: 'array',
        minItems: 7,
        maxItems: 7,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'path', 'sha256', 'adapter', 'expected_count', 'run_iterations'],
          properties: {
            id: { type: 'string', minLength: 1 },
            path: { type: 'string', minLength: 1 },
            sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            adapter: { type: 'string', minLength: 1 },
            expected_count: { type: ['integer', 'null'], minimum: 1 },
            run_iterations: { type: ['integer', 'null'], minimum: 1 }
          }
        }
      },
      taxonomy: {
        type: 'object',
        additionalProperties: false,
        required: ['workflow-family', 'workflow-mode', 'research-workstream', 'runtime-subsystem'],
        properties: Object.fromEntries(
          Object.entries(TAXONOMY).map(function taxonomySchema(entry) {
            return [entry[0], {
              type: 'array',
              minItems: entry[1].length,
              maxItems: entry[1].length,
              uniqueItems: true,
              items: { enum: entry[1] }
            }];
          })
        )
      },
      phase_manifest: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'sha256', 'phases'],
        properties: {
          path: { const: INPUTS.phaseManifest.path },
          sha256: { const: INPUTS.phaseManifest.sha256 },
          phases: {
            type: 'array',
            minItems: 15,
            maxItems: 15,
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['phase', 'slug', 'kind'],
              properties: {
                phase: { enum: PHASE_IDS },
                slug: { type: 'string', minLength: 1 },
                kind: { enum: ['leaf', 'parent'] }
              }
            }
          }
        }
      },
      rows: {
        type: 'array',
        minItems: 178,
        maxItems: 178,
        items: {
          type: 'object',
          additionalProperties: false,
          required: Object.keys(rowProperties),
          properties: rowProperties
        }
      }
    }
  };
}

function stableJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function csvEscape(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }
  return stringValue;
}

const CSV_COLUMNS = Object.freeze([
  'id',
  'source_run',
  'source_path',
  'source_locator',
  'source_sha256',
  'source_rank',
  'source_iteration',
  'original_recommendation',
  'original_target',
  'source_rationale',
  'source_evidence',
  'source_effort',
  'source_impact',
  'source_thread',
  'source_mode',
  'source_angle',
  'source_uniqueness',
  'taxonomy_layer',
  'taxonomy_key',
  'primary_rationale',
  'disposition',
  'disposition_rationale'
]);

function buildCsv(rows) {
  const lines = [CSV_COLUMNS.join(',')];
  for (const row of rows) {
    lines.push(CSV_COLUMNS.map(function projectColumn(column) {
      return csvEscape(row[column]);
    }).join(','));
  }
  return lines.join('\n') + '\n';
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SEMANTIC VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function expectedIds() {
  const ids = [];
  for (let value = 1; value <= 8; value += 1) {
    ids.push('DLR-A-' + padOrdinal(value));
  }
  for (let value = 1; value <= 59; value += 1) {
    ids.push('DLR-B-' + padOrdinal(value));
  }
  for (let value = 1; value <= 111; value += 1) {
    ids.push('DLR-C-' + padOrdinal(value));
  }
  return ids;
}

function dispositionBucket(disposition) {
  if (disposition.startsWith('adopt-as-phase-')) {
    return 'adopted';
  }
  if (disposition.startsWith('merge-into-')) {
    return 'merged';
  }
  if (disposition === 'defer-with-reason') {
    return 'deferred';
  }
  if (disposition === 'reject-with-reason') {
    return 'rejected';
  }
  fail('Closed disposition vocabulary violation: ' + disposition);
}

function assertExactKeys(value, expected, context) {
  const actual = Object.keys(value).sort();
  const wanted = expected.slice().sort();
  assertCondition(
    JSON.stringify(actual) === JSON.stringify(wanted),
    context + ' keys differ: expected ' + JSON.stringify(wanted) + ', got ' + JSON.stringify(actual)
  );
}

function validateMergeGraph(rows) {
  const byId = new Map(rows.map(function rowEntry(row) { return [row.id, row]; }));
  const edges = new Map();
  for (const row of rows) {
    if (row.disposition.startsWith('merge-into-')) {
      const target = row.disposition.slice('merge-into-'.length);
      assertCondition(target !== row.id, 'Self merge for ' + row.id);
      assertCondition(byId.has(target), 'Missing merge target ' + target + ' for ' + row.id);
      edges.set(row.id, target);
    }
  }

  for (const start of edges.keys()) {
    const seen = new Set();
    let current = start;
    while (edges.has(current)) {
      assertCondition(!seen.has(current), 'Merge cycle detected from ' + start);
      seen.add(current);
      current = edges.get(current);
    }
  }
}

function validateLedgerObject(ledger, sourceRows) {
  assertExactKeys(
    ledger,
    ['schema_version', 'base_commit', 'source_manifest', 'taxonomy', 'phase_manifest', 'rows'],
    'Ledger'
  );
  assertCondition(ledger.schema_version === '1.0.0', 'Unexpected schema version');
  assertCondition(ledger.base_commit === BASE_COMMIT, 'Unexpected base commit');
  assertCondition(Array.isArray(ledger.rows) && ledger.rows.length === 178, 'Ledger row count is not 178');

  const rowKeys = [
    'id', 'source_run', 'source_path', 'source_locator', 'source_sha256',
    'source_rank', 'source_iteration', 'original_recommendation', 'original_target',
    'source_rationale', 'source_evidence', 'source_effort', 'source_impact',
    'source_thread', 'source_mode', 'source_angle', 'source_uniqueness',
    'companion_evidence', 'taxonomy_layer', 'taxonomy_key', 'primary_rationale',
    'disposition', 'disposition_rationale'
  ];
  const ids = ledger.rows.map(function rowId(row) { return row.id; });
  assertCondition(JSON.stringify(ids) === JSON.stringify(expectedIds()), 'Stable IDs are not unique, ordered, and gap-free');
  assertCondition(new Set(ids).size === 178, 'Duplicate stable IDs');

  const literalSourceLocators = ledger.rows.map(function locator(row) {
    return row.source_locator;
  });
  assertCondition(new Set(literalSourceLocators).size === 178, 'Duplicate literal source locators');
  const compositeSourceLocators = ledger.rows.map(function locator(row) {
    return row.source_run + ':' + row.source_locator;
  });
  assertCondition(new Set(compositeSourceLocators).size === 178, 'Duplicate composite source locators');
  const extractedLiteralSourceLocators = sourceRows.map(function locator(row) {
    return row.source_locator;
  });
  assertCondition(
    JSON.stringify(literalSourceLocators) === JSON.stringify(extractedLiteralSourceLocators),
    'Literal source-to-ledger locator bijection failed'
  );
  const extractedCompositeSourceLocators = sourceRows.map(function locator(row) {
    return row.source_run + ':' + row.source_locator;
  });
  assertCondition(
    JSON.stringify(compositeSourceLocators) === JSON.stringify(extractedCompositeSourceLocators),
    'Composite source-to-ledger locator bijection failed'
  );

  const dispositionPattern =
    /^(adopt-as-phase-(00[3-9]|01[0-7])|merge-into-DLR-[ABC]-[0-9]{3}|defer-with-reason|reject-with-reason)$/;
  for (const row of ledger.rows) {
    assertExactKeys(row, rowKeys, 'Row ' + row.id);
    assertCondition(
      row.source_locator.startsWith(row.source_run + ':'),
      'Source locator lacks run qualifier for ' + row.id
    );
    assertCondition(typeof row.original_recommendation === 'string' && row.original_recommendation.trim(), 'Blank recommendation');
    assertCondition(typeof row.original_target === 'string' && row.original_target.trim(), 'Blank original target');
    assertCondition(Object.prototype.hasOwnProperty.call(TAXONOMY, row.taxonomy_layer), 'Invalid taxonomy layer for ' + row.id);
    assertCondition(TAXONOMY[row.taxonomy_layer].includes(row.taxonomy_key), 'Invalid taxonomy key for ' + row.id);
    assertCondition(row.taxonomy_key !== 'unknown', 'Unknown taxonomy key for ' + row.id);
    assertCondition(dispositionPattern.test(row.disposition), 'Invalid disposition for ' + row.id);
    assertCondition(
      typeof row.disposition_rationale === 'string' && row.disposition_rationale.trim(),
      'Blank disposition rationale for ' + row.id
    );
    dispositionBucket(row.disposition);
    if (row.disposition.startsWith('adopt-as-phase-')) {
      const phase = row.disposition.slice('adopt-as-phase-'.length);
      assertCondition(PHASE_IDS.includes(phase), 'Invalid adoption phase for ' + row.id);
    }
  }
  validateMergeGraph(ledger.rows);

  const runCounts = ledger.rows.reduce(function countRun(accumulator, row) {
    accumulator[row.source_run] = (accumulator[row.source_run] || 0) + 1;
    return accumulator;
  }, {});
  assertCondition(
    runCounts['run-a'] === 8 && runCounts['run-b'] === 59 && runCounts['run-c'] === 111,
    'Ledger source counts are not 8, 59, and 111'
  );
  assertCondition(
    ledger.rows.filter(function emptyUniqueness(row) {
      return row.source_run === 'run-c' && row.source_uniqueness === '';
    }).length === 4,
    'Run-c empty optional uniqueness facts were not preserved'
  );
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function runNegativeFixtures(ledger, sourceRows) {
  const fixtures = [
    {
      name: 'missing-row',
      mutate: function missingRow(value) { value.rows.pop(); }
    },
    {
      name: 'extra-row',
      mutate: function extraRow(value) { value.rows.push(clone(value.rows[0])); }
    },
    {
      name: 'duplicate-id',
      mutate: function duplicateId(value) { value.rows[1].id = value.rows[0].id; }
    },
    {
      name: 'duplicate-locator',
      mutate: function duplicateLocator(value) {
        value.rows[1].source_run = value.rows[0].source_run;
        value.rows[1].source_locator = value.rows[0].source_locator;
      }
    },
    {
      name: 'invalid-target',
      mutate: function invalidTarget(value) { value.rows[0].taxonomy_key = 'unknown'; }
    },
    {
      name: 'parallel-disposition-field',
      mutate: function parallelDisposition(value) { value.rows[0].adopt_phase = '011'; }
    },
    {
      name: 'blank-reason',
      mutate: function blankReason(value) {
        const row = value.rows.find(function merged(candidate) {
          return candidate.disposition.startsWith('merge-into-');
        });
        row.disposition_rationale = ' ';
      }
    },
    {
      name: 'invalid-phase',
      mutate: function invalidPhase(value) { value.rows[0].disposition = 'adopt-as-phase-999'; }
    },
    {
      name: 'self-merge',
      mutate: function selfMerge(value) {
        value.rows[0].disposition = 'merge-into-' + value.rows[0].id;
      }
    },
    {
      name: 'missing-merge-target',
      mutate: function missingMergeTarget(value) {
        value.rows[0].disposition = 'merge-into-DLR-A-999';
      }
    },
    {
      name: 'merge-cycle',
      mutate: function mergeCycle(value) {
        value.rows[0].disposition = 'merge-into-' + value.rows[1].id;
        value.rows[1].disposition = 'merge-into-' + value.rows[0].id;
      }
    }
  ];

  return fixtures.map(function runFixture(fixture) {
    const mutated = clone(ledger);
    fixture.mutate(mutated);
    let rejected = false;
    let errorMessage = null;
    try {
      validateLedgerObject(mutated, sourceRows);
    } catch (error) {
      rejected = true;
      errorMessage = error.message;
    }
    assertCondition(rejected, 'Negative fixture unexpectedly passed: ' + fixture.name);
    return {
      name: fixture.name,
      verdict: 'rejected',
      error: errorMessage
    };
  });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (character !== '\r') {
      field += character;
    }
  }
  assertCondition(!quoted, 'CSV ended inside a quoted field');
  assertCondition(row.length === 0 && field === '', 'CSV lacks a terminal newline');
  return rows;
}

function validateCsv(csvText, ledger) {
  const parsed = parseCsv(csvText);
  assertCondition(parsed.length === 179, 'CSV expected header plus 178 rows');
  assertCondition(JSON.stringify(parsed[0]) === JSON.stringify(CSV_COLUMNS), 'CSV header drifted');
  const projected = parsed.slice(1);
  for (let index = 0; index < projected.length; index += 1) {
    const csvRow = Object.fromEntries(CSV_COLUMNS.map(function columnEntry(column, columnIndex) {
      return [column, projected[index][columnIndex]];
    }));
    const ledgerRow = ledger.rows[index];
    assertCondition(csvRow.id === ledgerRow.id, 'CSV ID mismatch at row ' + index);
    assertCondition(csvRow.disposition === ledgerRow.disposition, 'CSV disposition mismatch for ' + ledgerRow.id);
    assertCondition(csvRow.taxonomy_layer === ledgerRow.taxonomy_layer, 'CSV taxonomy layer mismatch for ' + ledgerRow.id);
    assertCondition(csvRow.taxonomy_key === ledgerRow.taxonomy_key, 'CSV taxonomy key mismatch for ' + ledgerRow.id);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REPORT AND STANDARD SCHEMA CHECK
// ─────────────────────────────────────────────────────────────────────────────

function summarizeDispositions(rows) {
  const summary = {
    adopted: { count: 0, row_ids: [], zero_reason: null },
    merged: { count: 0, row_ids: [], zero_reason: null },
    deferred: { count: 0, row_ids: [], zero_reason: null },
    rejected: {
      count: 0,
      row_ids: [],
      zero_reason: 'No source row is clearly contradicted by shipped behavior; the excluded ai-system-improvement mode produced no row.'
    }
  };
  for (const row of rows) {
    const bucket = dispositionBucket(row.disposition);
    summary[bucket].count += 1;
    summary[bucket].row_ids.push(row.id);
  }
  for (const bucket of Object.values(summary)) {
    if (bucket.count > 0) {
      bucket.zero_reason = null;
    }
  }
  return summary;
}

function summarizePhases(rows) {
  const summary = {};
  for (const phase of PHASE_IDS) {
    const prefix = 'adopt-as-phase-' + phase;
    const ids = rows.filter(function adoptedInPhase(row) {
      return row.disposition === prefix;
    }).map(function adoptedId(row) {
      return row.id;
    });
    summary[phase] = {
      count: ids.length,
      row_ids: ids,
      zero_reason: ids.length === 0 ? ZERO_PHASE_REASONS[phase] : null
    };
    assertCondition(ids.length > 0 || Boolean(summary[phase].zero_reason), 'Missing zero rationale for phase ' + phase);
  }
  return summary;
}

function buildReport(ledger, csvText, schemaText, negativeFixtures) {
  const ledgerText = stableJson(ledger);
  const sourceLocatorText = ledger.rows.map(function sourceLocator(row) {
    return row.source_locator;
  }).join('\n') + '\n';
  const compositeSourceLocatorText = ledger.rows.map(function sourceLocator(row) {
    return row.source_run + ':' + row.source_locator;
  }).join('\n') + '\n';
  const validatorBytes = fs.readFileSync(__filename);
  const dispositions = summarizeDispositions(ledger.rows);
  const phases = summarizePhases(ledger.rows);
  assertCondition(
    dispositions.adopted.count === 112 &&
      dispositions.merged.count === 58 &&
      dispositions.deferred.count === 8 &&
      dispositions.rejected.count === 0,
    'Disposition counts drifted'
  );

  return {
    schema_version: '1.0.0',
    base_commit: BASE_COMMIT,
    verdict: 'PASS',
    source_bijection: {
      expected: { 'run-a': 8, 'run-b': 59, 'run-c': 111, total: 178 },
      actual: { 'run-a': 8, 'run-b': 59, 'run-c': 111, total: ledger.rows.length },
      unique_source_locators: new Set(ledger.rows.map(function locator(row) {
        return row.source_locator;
      })).size,
      unique_composite_source_locators: new Set(ledger.rows.map(function locator(row) {
        return row.source_run + ':' + row.source_locator;
      })).size,
      source_locator_sha256: sha256(sourceLocatorText),
      composite_source_locator_sha256: sha256(compositeSourceLocatorText),
      run_c_empty_uniqueness_zero_based_ordinals: [53, 82, 88, 94]
    },
    stable_ids: {
      count: ledger.rows.length,
      unique: new Set(ledger.rows.map(function id(row) { return row.id; })).size,
      first: ledger.rows[0].id,
      last: ledger.rows[ledger.rows.length - 1].id
    },
    disposition_buckets: dispositions,
    adopted_per_phase: phases,
    borderline_for_review: BORDERLINE_FOR_REVIEW,
    csv_parity: {
      rows: ledger.rows.length,
      columns: CSV_COLUMNS,
      ledger_sha256: sha256(ledgerText),
      csv_sha256: sha256(csvText),
      verdict: 'PASS'
    },
    deterministic_rebuild: {
      builds: 2,
      verdict: 'PASS',
      build_1: {
        ledger_sha256: sha256(ledgerText),
        csv_sha256: sha256(csvText),
        schema_sha256: sha256(schemaText)
      },
      build_2: {
        ledger_sha256: sha256(ledgerText),
        csv_sha256: sha256(csvText),
        schema_sha256: sha256(schemaText)
      }
    },
    negative_fixtures: {
      count: negativeFixtures.length,
      verdict: 'PASS',
      cases: negativeFixtures
    },
    hashes: {
      sources: Object.fromEntries(Object.values(INPUTS).map(function sourceHash(input) {
        return [input.id, { path: input.path, sha256: input.sha256 }];
      })),
      artifacts: {
        [LEDGER_FILE]: sha256(ledgerText),
        [CSV_FILE]: sha256(csvText),
        [SCHEMA_FILE]: sha256(schemaText),
        'validate-ledger.cjs': sha256(validatorBytes)
      }
    }
  };
}

function runStandardSchemaValidation(schemaPath, ledgerPath) {
  const python = [
    'import json, sys',
    'import jsonschema',
    'schema_path, ledger_path = sys.argv[1], sys.argv[2]',
    'with open(schema_path, encoding="utf-8") as handle: schema = json.load(handle)',
    'with open(ledger_path, encoding="utf-8") as handle: ledger = json.load(handle)',
    'jsonschema.Draft202012Validator.check_schema(schema)',
    'jsonschema.Draft202012Validator(schema).validate(ledger)'
  ].join('\n');
  const result = childProcess.spawnSync(
    'python3',
    ['-c', python, schemaPath, ledgerPath],
    { encoding: 'utf8' }
  );
  assertCondition(
    result.status === 0,
    'Standard JSON Schema validation failed: ' + (result.stderr || result.stdout || 'python3 exited ' + result.status)
  );
}

function buildArtifacts() {
  const sources = extractSources();
  const ledger = buildLedger();
  validateLedgerObject(ledger, sources.all);
  const schema = buildSchema();
  const ledgerText = stableJson(ledger);
  const schemaText = stableJson(schema);
  const csvText = buildCsv(ledger.rows);
  validateCsv(csvText, ledger);
  const negativeFixtures = runNegativeFixtures(ledger, sources.all);
  const report = buildReport(ledger, csvText, schemaText, negativeFixtures);
  const reportText = stableJson(report);
  return { ledger, ledgerText, schemaText, csvText, report, reportText, sources };
}

function assertDeterministic(first, second) {
  for (const key of ['ledgerText', 'schemaText', 'csvText', 'reportText']) {
    assertCondition(first[key] === second[key], 'Non-deterministic rebuild for ' + key);
  }
}

function writeArtifacts(artifacts) {
  const outputs = {
    [LEDGER_FILE]: artifacts.ledgerText,
    [CSV_FILE]: artifacts.csvText,
    [SCHEMA_FILE]: artifacts.schemaText,
    [REPORT_FILE]: artifacts.reportText
  };
  for (const entry of Object.entries(outputs)) {
    const destination = path.join(__dirname, entry[0]);
    const temporary = destination + '.tmp';
    fs.writeFileSync(temporary, entry[1], 'utf8');
    fs.renameSync(temporary, destination);
  }
}

function verifyWrittenArtifacts(expected) {
  const files = {
    [LEDGER_FILE]: expected.ledgerText,
    [CSV_FILE]: expected.csvText,
    [SCHEMA_FILE]: expected.schemaText,
    [REPORT_FILE]: expected.reportText
  };
  for (const entry of Object.entries(files)) {
    const actual = fs.readFileSync(path.join(__dirname, entry[0]), 'utf8');
    assertCondition(actual === entry[1], 'Written artifact drift: ' + entry[0]);
  }
  const ledger = JSON.parse(files[LEDGER_FILE]);
  validateLedgerObject(ledger, expected.sources.all);
  validateCsv(files[CSV_FILE], ledger);
  runStandardSchemaValidation(
    path.join(__dirname, SCHEMA_FILE),
    path.join(__dirname, LEDGER_FILE)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. COMMAND ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const argument = process.argv[2] || '--verify';
  assertCondition(
    argument === '--write' || argument === '--verify',
    'Usage: node validate-ledger.cjs [--write|--verify]'
  );
  const first = buildArtifacts();
  const second = buildArtifacts();
  assertDeterministic(first, second);
  if (argument === '--write') {
    writeArtifacts(first);
  }
  verifyWrittenArtifacts(first);
  const counts = first.report.disposition_buckets;
  process.stdout.write(
    'PASS recommendation ledger: 178 rows; adopted=' + counts.adopted.count +
      ', merged=' + counts.merged.count +
      ', deferred=' + counts.deferred.count +
      ', rejected=' + counts.rejected.count + '\n'
  );
}

try {
  main();
} catch (error) {
  process.stderr.write('FAIL recommendation ledger: ' + error.message + '\n');
  process.exitCode = 1;
}
