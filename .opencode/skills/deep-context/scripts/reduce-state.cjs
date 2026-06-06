#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Context State Reducer                                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { resolveArtifactRoot } = require('../../system-spec-kit/shared/review-research-paths.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// WHY agreement-weighted (not source-count): by-model shared scope makes cross-
// executor AGREEMENT the confidence signal — a unit found by N distinct
// executors over the SAME shared focus is more trustworthy than one found once.
// The reducer is the host writer; seats stay read-only.

// Relevance gate: findings below this drop to a low-confidence bucket. Mirrors
// CONTEXT_RELEVANCE_GATE in coverage-graph-signals so registry + graph agree.
const DEFAULT_RELEVANCE_GATE = 0.55;
// A unit confirmed by this many distinct executors is agreement-eligible (high
// confidence). Mirrors CONTEXT_AGREEMENT_MIN in coverage-graph-signals.
const DEFAULT_AGREEMENT_MIN = 2;

// Finding kinds (seat_output_schema `kind` field) routed to registry buckets.
const KIND_TO_BUCKET = {
  reuse_candidate: 'reuseCandidates',
  integration_point: 'integrationPoints',
  convention: 'conventions',
  dependency: 'dependencies',
  gap: 'gaps',
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readUtf8(filePath));
}

function readJsonSafe(filePath, fallback) {
  try {
    return readJson(filePath);
  } catch {
    return fallback;
  }
}

function normalizeText(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// unit_id = sha256(path + ':' + symbol + ':' + kind). Matches the coverage-graph
// node id so the registry and the graph dedup the same unit.
function unitId(pathValue, symbolValue, kindValue) {
  const composite = `${normalizeText(pathValue)}:${normalizeText(symbolValue)}:${normalizeText(kindValue)}`;
  return crypto.createHash('sha256').update(composite).digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into an array of records. Corrupt lines are reported, not
 * silently dropped, so a partial run surfaces rather than hides truncation.
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line:number, raw:string, error:string}>}}
 */
function parseJsonlDetailed(jsonlContent) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;

  for (const rawLine of String(jsonlContent || '').split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      corruptionWarnings.push({
        line: lineNumber,
        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { records, corruptionWarnings };
}

function parseJsonl(jsonlContent) {
  return parseJsonlDetailed(jsonlContent).records;
}

/**
 * Read every seat's raw findings for an iteration directory and tag each finding
 * with the producing seat label. A seat file is either an array of findings or
 * an object with a `findings` array (seat_output_schema).
 *
 * @param {string} iterDir - {seat_dir}/iter-NNN absolute path
 * @returns {{findings: Array<Object>, seatLabels: string[], failedSeats: string[]}}
 */
function loadSeatFindings(iterDir) {
  const findings = [];
  const seatLabels = [];
  const failedSeats = [];
  if (!fs.existsSync(iterDir)) {
    return { findings, seatLabels, failedSeats };
  }

  const seatFiles = fs.readdirSync(iterDir)
    .filter((name) => name.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const fileName of seatFiles) {
    const label = fileName.replace(/\.json$/, '');
    const parsed = readJsonSafe(path.join(iterDir, fileName), null);
    const seatFindings = Array.isArray(parsed)
      ? parsed
      : (parsed && Array.isArray(parsed.findings) ? parsed.findings : null);

    if (!Array.isArray(seatFindings)) {
      failedSeats.push(label);
      continue;
    }
    seatLabels.push(label);
    for (const raw of seatFindings) {
      if (raw && typeof raw === 'object') {
        findings.push({ ...raw, producedBy: label });
      }
    }
  }

  return { findings, seatLabels, failedSeats };
}

/**
 * Walk all iteration directories under {seat_dir} and collect every seat finding
 * with its iteration number and producing seat label.
 *
 * @param {string} seatDir - {artifact_dir}/seats absolute path
 * @returns {{findings: Array<Object>, seatsByIteration: Object, allSeatLabels: Set<string>}}
 */
function collectAllSeatFindings(seatDir) {
  const findings = [];
  const seatsByIteration = {};
  const allSeatLabels = new Set();
  if (!fs.existsSync(seatDir)) {
    return { findings, seatsByIteration, allSeatLabels };
  }

  const iterDirs = fs.readdirSync(seatDir)
    .filter((name) => /^iter-\d+$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const dirName of iterDirs) {
    const iteration = Number(dirName.match(/iter-(\d+)/)[1]);
    const { findings: iterFindings, seatLabels, failedSeats } = loadSeatFindings(path.join(seatDir, dirName));
    seatsByIteration[iteration] = { succeeded: seatLabels, failed: failedSeats };
    for (const label of seatLabels) {
      allSeatLabels.add(label);
    }
    for (const finding of iterFindings) {
      findings.push({ ...finding, iteration });
    }
  }

  return { findings, seatsByIteration, allSeatLabels };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dedup raw seat findings by unit_id, union per-executor attribution, and set
 * agreement = count of distinct executors that produced the unit.
 *
 * @param {Array<Object>} rawFindings - Per-seat findings tagged with producedBy + iteration
 * @returns {Array<Object>} Deduped units with producedBy[], agreement, relevance, kind, etc.
 */
function dedupByUnit(rawFindings) {
  const byUnit = new Map();

  for (const finding of rawFindings) {
    const kind = normalizeText(finding.kind) || 'reuse_candidate';
    const pathValue = normalizeText(finding.path);
    const symbol = normalizeText(finding.symbol);
    // Trust an explicit unit_id when present; otherwise derive it deterministically.
    const id = typeof finding.unit_id === 'string' && finding.unit_id.trim()
      ? finding.unit_id.trim()
      : unitId(pathValue, symbol, kind);
    const relevance = toNumber(finding.relevance, 0);
    const producer = normalizeText(finding.producedBy) || 'unknown';

    if (!byUnit.has(id)) {
      byUnit.set(id, {
        unit_id: id,
        path: pathValue,
        symbol,
        kind,
        signature: normalizeText(finding.signature),
        reuse: normalizeText(finding.reuse),
        evidence: normalizeText(finding.evidence),
        notes: normalizeText(finding.notes),
        producedBy: [],
        relevanceByProducer: {},
        signatureByProducer: {},
        reuseByProducer: {},
        firstIteration: isFiniteNumber(finding.iteration) ? finding.iteration : 0,
        maxRelevance: relevance,
      });
    }

    const unit = byUnit.get(id);
    if (!unit.producedBy.includes(producer)) {
      unit.producedBy.push(producer);
    }
    unit.relevanceByProducer[producer] = relevance;
    unit.signatureByProducer[producer] = normalizeText(finding.signature);
    unit.reuseByProducer[producer] = normalizeText(finding.reuse);
    unit.maxRelevance = Math.max(unit.maxRelevance, relevance);
    if (isFiniteNumber(finding.iteration)) {
      unit.firstIteration = Math.min(unit.firstIteration, finding.iteration);
    }
    // Prefer a non-empty signature/evidence/notes from any producer.
    if (!unit.signature && normalizeText(finding.signature)) unit.signature = normalizeText(finding.signature);
    if (!unit.evidence && normalizeText(finding.evidence)) unit.evidence = normalizeText(finding.evidence);
    if (!unit.notes && normalizeText(finding.notes)) unit.notes = normalizeText(finding.notes);
    if (!unit.reuse && normalizeText(finding.reuse)) unit.reuse = normalizeText(finding.reuse);
  }

  return Array.from(byUnit.values()).map((unit) => ({
    ...unit,
    agreement: unit.producedBy.length,
  }));
}

/**
 * Surface contradictions: two or more producers asserting incompatible contracts
 * (different signature or reuse verb) for the SAME unit_id. Never silently
 * resolved — the host reports both sides.
 *
 * @param {Array<Object>} units - Deduped units from dedupByUnit
 * @returns {Array<Object>} Contradiction records (unit_id, path, symbol, field, values)
 */
function detectContradictions(units) {
  const contradictions = [];

  for (const unit of units) {
    if (unit.producedBy.length < 2) {
      continue;
    }
    for (const field of ['signatureByProducer', 'reuseByProducer']) {
      const distinct = new Set(
        Object.values(unit[field]).map((v) => normalizeText(v)).filter(Boolean),
      );
      if (distinct.size > 1) {
        contradictions.push({
          unit_id: unit.unit_id,
          path: unit.path,
          symbol: unit.symbol,
          field: field.replace('ByProducer', ''),
          values: Object.fromEntries(
            Object.entries(unit[field]).filter(([, v]) => normalizeText(v)),
          ),
        });
      }
    }
  }

  return contradictions;
}

/**
 * Build the agreement-weighted findings registry from deduped units.
 *
 * @param {Array<Object>} units - Deduped units
 * @param {Object} options - { relevanceGate, agreementMin }
 * @returns {Object} Registry buckets + lowConfidence + contradictions + metrics
 */
function buildRegistry(units, options) {
  const relevanceGate = isFiniteNumber(options.relevanceGate) ? options.relevanceGate : DEFAULT_RELEVANCE_GATE;
  const agreementMin = isFiniteNumber(options.agreementMin) ? options.agreementMin : DEFAULT_AGREEMENT_MIN;

  const registry = {
    reuseCandidates: [],
    integrationPoints: [],
    conventions: [],
    dependencies: [],
    gaps: [],
    lowConfidence: [],
    contradictions: detectContradictions(units),
  };

  const toRecord = (unit) => ({
    unit_id: unit.unit_id,
    path: unit.path,
    symbol: unit.symbol,
    kind: unit.kind,
    signature: unit.signature,
    reuse: unit.reuse,
    evidence: unit.evidence,
    notes: unit.notes,
    producedBy: unit.producedBy.slice().sort(),
    agreement: unit.agreement,
    agreementEligible: unit.agreement >= agreementMin,
    relevance: Math.round(unit.maxRelevance * 1000) / 1000,
    firstIteration: unit.firstIteration,
  });

  let agreementEligibleCount = 0;
  let relevanceFloorPassCount = 0;

  for (const unit of units) {
    const record = toRecord(unit);

    // Relevance gate: below-gate units drop to the low-confidence bucket (kept,
    // not discarded, so the report's Gaps section can surface near-misses).
    if (unit.maxRelevance < relevanceGate) {
      registry.lowConfidence.push({ ...record, droppedBelowGate: relevanceGate });
      continue;
    }
    relevanceFloorPassCount += 1;
    if (record.agreementEligible) {
      agreementEligibleCount += 1;
    }

    const bucket = KIND_TO_BUCKET[unit.kind] || 'reuseCandidates';
    registry[bucket].push(record);
  }

  // Stable ordering: agreement desc, then relevance desc, then path.
  const sortRecords = (records) => records.sort((a, b) =>
    b.agreement - a.agreement
    || b.relevance - a.relevance
    || a.path.localeCompare(b.path)
    || a.symbol.localeCompare(b.symbol));
  for (const bucket of Object.keys(KIND_TO_BUCKET)) {
    sortRecords(registry[KIND_TO_BUCKET[bucket]]);
  }
  sortRecords(registry.lowConfidence);

  const gatedCount = relevanceFloorPassCount;
  const totalUnits = units.length;

  registry.metrics = {
    findings: totalUnits,
    gatedFindings: gatedCount,
    lowConfidenceFindings: registry.lowConfidence.length,
    agreementEligible: agreementEligibleCount,
    contradictions: registry.contradictions.length,
    // agreementRate over gated finding-kind units (matches the graph signal's intent).
    agreementRate: gatedCount > 0 ? Math.round((agreementEligibleCount / gatedCount) * 1000) / 1000 : 0,
    relevanceFloor: totalUnits > 0 ? Math.round((gatedCount / totalUnits) * 1000) / 1000 : 0,
    reuseCandidates: registry.reuseCandidates.length,
    integrationPoints: registry.integrationPoints.length,
    conventions: registry.conventions.length,
    dependencies: registry.dependencies.length,
    gaps: registry.gaps.length,
  };

  return registry;
}

function getLatestIterationRecord(iterationRecords) {
  return iterationRecords.length ? iterationRecords[iterationRecords.length - 1] : null;
}

function buildGraphConvergenceRollup(eventRecords) {
  const latest = eventRecords.filter((r) => r.event === 'graph_convergence').at(-1);
  const signals = latest && latest.signals && typeof latest.signals === 'object' ? latest.signals : {};
  const blockers = latest && Array.isArray(latest.blockers) ? latest.blockers : [];
  return {
    graphDecision: latest && typeof latest.decision === 'string' ? latest.decision : null,
    graphSignals: signals,
    graphBlockers: blockers,
  };
}

function buildLineageState(config, eventRecords) {
  const configLineage = config && config.lineage && typeof config.lineage === 'object' ? config.lineage : {};
  const latest = eventRecords
    .filter((r) => r.event === 'resumed' || r.event === 'restarted')
    .at(-1);
  return {
    sessionId: (latest && typeof latest.sessionId === 'string' && latest.sessionId)
      || (typeof configLineage.sessionId === 'string' ? configLineage.sessionId : null),
    lineageMode: (latest && typeof latest.lineageMode === 'string' && latest.lineageMode)
      || (typeof configLineage.lineageMode === 'string' ? configLineage.lineageMode : 'new'),
    generation: isFiniteNumber(latest && latest.generation)
      ? latest.generation
      : (isFiniteNumber(configLineage.generation) ? configLineage.generation : 1),
  };
}

function deriveStatus(config, iterationRecords, eventRecords) {
  const synthesisComplete = eventRecords.some((r) => r.event === 'synthesis_complete');
  if (synthesisComplete) {
    return 'COMPLETE';
  }
  const rawStatus = String((config && config.status) || 'initialized').toLowerCase();
  if (rawStatus === 'complete' || rawStatus === 'completed') {
    return 'COMPLETE';
  }
  if (rawStatus === 'running' || iterationRecords.length > 0) {
    return 'ITERATING';
  }
  return rawStatus.toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

function renderDashboard(config, registry, iterationRecords, lineage, graph, status) {
  const latest = getLatestIterationRecord(iterationRecords);
  const progressRows = iterationRecords.length
    ? iterationRecords.map((r) => {
        const focus = normalizeText(r.focus) || 'unknown';
        const newAgr = toNumber(r.newAgreementEligible, 0);
        const agr = isFiniteNumber(r.agreementRate) ? r.agreementRate.toFixed(2) : '0.00';
        const slice = isFiniteNumber(r.sliceCoverage) ? r.sliceCoverage.toFixed(2) : '0.00';
        return `| ${r.run} | ${focus} | ${toNumber(r.findingsCount, 0)} | ${newAgr} | ${slice} | ${agr} | ${normalizeText(r.status) || 'evidence'} |`;
      }).join('\n')
    : '| 0 | none yet | 0 | 0 | 0.00 | 0.00 | initialized |';

  const reuseRows = registry.reuseCandidates.length
    ? registry.reuseCandidates.slice(0, 15).map((u) =>
        `| ${u.symbol || u.path || u.unit_id.slice(0, 8)} | ${u.reuse || '-'} | ${u.agreement} | ${u.relevance.toFixed(2)} | ${u.evidence || '-'} |`).join('\n')
    : '| none yet | - | 0 | 0.00 | - |';

  const contradictionLines = registry.contradictions.length
    ? registry.contradictions.map((c) =>
        `- ${c.symbol || c.path} (${c.field}): ${Object.entries(c.values).map(([seat, v]) => `${seat}="${v}"`).join(' vs ')}`)
    : ['- None surfaced'];

  return [
    '---',
    'title: Deep Context Dashboard',
    'description: Auto-generated reducer view over the deep-context packet.',
    '---',
    '',
    '# Deep Context Dashboard',
    '',
    'Auto-generated from the JSONL state log, per-seat findings, and the merged registry. Never manually edited.',
    '',
    '## 1. STATUS',
    `- Scope: ${normalizeText(config && config.scope) || '[Unknown scope]'}`,
    `- Started: ${(config && config.createdAt) || '[Unknown start]'}`,
    `- Status: ${status}`,
    `- Iterations (parallel sweeps): ${iterationRecords.length} of ${(config && config.maxIterations) || 0}`,
    `- Session ID: ${lineage.sessionId || '[Unknown session]'}`,
    `- Lineage mode: ${lineage.lineageMode}`,
    `- Generation: ${lineage.generation}`,
    '',
    '## 2. PROGRESS',
    '',
    '| # | Focus | Findings | NewAgr | sliceCov | agrRate | Status |',
    '|---|-------|----------|--------|----------|---------|--------|',
    progressRows,
    '',
    '## 3. MERGED METRICS',
    `- findings (deduped units): ${registry.metrics.findings}`,
    `- gated findings (>= relevance gate): ${registry.metrics.gatedFindings}`,
    `- low-confidence (below gate): ${registry.metrics.lowConfidenceFindings}`,
    `- agreement-eligible (>= agreementMin): ${registry.metrics.agreementEligible}`,
    `- agreementRate: ${registry.metrics.agreementRate.toFixed(2)}`,
    `- relevanceFloor: ${registry.metrics.relevanceFloor.toFixed(2)}`,
    `- reuseCandidates: ${registry.metrics.reuseCandidates} | integrationPoints: ${registry.metrics.integrationPoints} | conventions: ${registry.metrics.conventions} | dependencies: ${registry.metrics.dependencies} | gaps: ${registry.metrics.gaps}`,
    '',
    '## 4. REUSE CATALOG (top, agreement-weighted)',
    '',
    '| Symbol/Path | Reuse | Agreement (k) | Relevance | Evidence |',
    '|-------------|-------|---------------|-----------|----------|',
    reuseRows,
    '',
    '## 5. CONTRADICTIONS (surfaced, never auto-resolved)',
    ...contradictionLines,
    '',
    '## 6. GRAPH CONVERGENCE',
    `- graphDecision: ${graph.graphDecision || '[Not recorded]'}`,
    `- sliceCoverage: ${isFiniteNumber(graph.graphSignals.sliceCoverage) ? graph.graphSignals.sliceCoverage.toFixed(2) : '[n/a]'}`,
    `- reuseCatalogCoverage: ${isFiniteNumber(graph.graphSignals.reuseCatalogCoverage) ? graph.graphSignals.reuseCatalogCoverage.toFixed(2) : '[n/a]'}`,
    `- agreementRate: ${isFiniteNumber(graph.graphSignals.agreementRate) ? graph.graphSignals.agreementRate.toFixed(2) : '[n/a]'}`,
    `- relevanceFloor: ${isFiniteNumber(graph.graphSignals.relevanceFloor) ? graph.graphSignals.relevanceFloor.toFixed(2) : '[n/a]'}`,
    `- dependencyCompleteness: ${isFiniteNumber(graph.graphSignals.dependencyCompleteness) ? graph.graphSignals.dependencyCompleteness.toFixed(2) : '[n/a]'}`,
    ...(graph.graphBlockers.length
      ? graph.graphBlockers.map((b) => `- Blocker: ${typeof b === 'object' && b ? (b.type || b.name || JSON.stringify(b)) : String(b)}`)
      : ['- Blockers: none recorded']),
    ...(latest && normalizeText(latest.status) === 'error' ? ['', '## 7. ACTIVE RISKS', '- Latest iteration reported error status.'] : []),
    '',
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. REDUCER ENTRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reduce the deep-context state log + per-seat findings into a synchronized
 * findings registry and dashboard. Idempotent: repeated calls produce identical
 * outputs for the same inputs.
 *
 * @param {string} specFolder - Path to the target spec folder (or standalone run dir)
 * @param {Object} [options] - { write=true }
 * @returns {Object} Paths + content for registry and dashboard, plus corruption info
 */
function reduceContextState(specFolder, options = {}) {
  const write = options.write !== false;
  const resolvedSpecFolder = path.resolve(specFolder);
  const { artifactDir: contextDir } = resolveArtifactRoot(resolvedSpecFolder, 'context');

  const configPath = path.join(contextDir, 'deep-context-config.json');
  const stateLogPath = path.join(contextDir, 'deep-context-state.jsonl');
  const registryPath = path.join(contextDir, 'findings-registry.json');
  const dashboardPath = path.join(contextDir, 'deep-context-dashboard.md');
  const seatDir = path.join(contextDir, 'seats');

  const config = readJsonSafe(configPath, {});
  const stateLogContent = fs.existsSync(stateLogPath) ? readUtf8(stateLogPath) : '';
  const { records: parsedRecords, corruptionWarnings } = parseJsonlDetailed(stateLogContent);
  const iterationRecords = parsedRecords
    .filter((r) => r && r.type === 'iteration')
    .sort((a, b) => toNumber(a.run, 0) - toNumber(b.run, 0));
  const eventRecords = parsedRecords.filter((r) => r && r.type === 'event');

  const relevanceGate = isFiniteNumber(config.relevanceGate) ? config.relevanceGate : DEFAULT_RELEVANCE_GATE;
  const agreementMin = isFiniteNumber(config.agreementMin) ? config.agreementMin : DEFAULT_AGREEMENT_MIN;

  const { findings: rawSeatFindings, seatsByIteration, allSeatLabels } = collectAllSeatFindings(seatDir);
  const units = dedupByUnit(rawSeatFindings);
  const registry = buildRegistry(units, { relevanceGate, agreementMin });

  const lineage = buildLineageState(config, eventRecords);
  const graph = buildGraphConvergenceRollup(eventRecords);
  const status = deriveStatus(config, iterationRecords, eventRecords);

  // Attach lineage + run context to the registry top-level for downstream consumers.
  registry.sessionId = lineage.sessionId || '';
  registry.lineageMode = lineage.lineageMode;
  registry.generation = lineage.generation;
  registry.status = status;
  registry.relevanceGate = relevanceGate;
  registry.agreementMin = agreementMin;
  registry.executorPool = Array.from(allSeatLabels).sort();
  registry.iterationsCompleted = iterationRecords.length;
  registry.seatsByIteration = seatsByIteration;
  registry.graphDecision = graph.graphDecision;
  registry.corruptionWarnings = corruptionWarnings;

  const dashboard = renderDashboard(config, registry, iterationRecords, lineage, graph, status);

  if (write) {
    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    writeUtf8(dashboardPath, dashboard.endsWith('\n') ? dashboard : `${dashboard}\n`);
  }

  return {
    configPath,
    stateLogPath,
    registryPath,
    dashboardPath,
    registry,
    dashboard,
    corruptionWarnings,
    hasCorruption: corruptionWarnings.length > 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const positional = args.filter((arg) => !arg.startsWith('--'));
  const specFolder = positional[0];

  if (!specFolder) {
    process.stderr.write(
      'Usage: node .opencode/skills/deep-context/scripts/reduce-state.cjs <spec-folder>\n',
    );
    process.exit(1);
  }

  try {
    const result = reduceContextState(specFolder, { write: true });
    process.stdout.write(
      `${JSON.stringify(
        {
          registryPath: result.registryPath,
          dashboardPath: result.dashboardPath,
          iterationsCompleted: result.registry.iterationsCompleted,
          findings: result.registry.metrics.findings,
          agreementEligible: result.registry.metrics.agreementEligible,
          contradictions: result.registry.metrics.contradictions,
          corruptionCount: result.corruptionWarnings.length,
        },
        null,
        2,
      )}\n`,
    );
  } catch (error) {
    process.stderr.write(`[deep-context] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(3);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  parseJsonl,
  parseJsonlDetailed,
  unitId,
  dedupByUnit,
  detectContradictions,
  buildRegistry,
  collectAllSeatFindings,
  reduceContextState,
};
