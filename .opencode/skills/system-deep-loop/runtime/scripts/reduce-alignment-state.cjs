// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Alignment State Reducer                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { resolveArtifactRoot } = require('../lib/deep-loop/artifact-root.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors reduce-state.cjs's SEVERITY_KEYS/SEVERITY_WEIGHTS pattern exactly
// (same keys, same weights) so the two reducers share one severity vocabulary
// even though they aggregate by different keys (lane here, review dimension
// there). There is no REQUIRED_DIMENSIONS analog: deep-review's four
// dimensions are a fixed constant, but deep-alignment's lanes are resolved
// per-run by scoping.cjs from operator input, so the required-lane list is
// read from the bound run's own config (see resolveRequiredLanes()) rather
// than hardcoded here.
const SEVERITY_KEYS = ['P0', 'P1', 'P2'];
const SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 };

// Mirrors the deep-review dashboard verdict table (renderDashboard() in the
// sibling reduce-state.cjs: P0>0 -> FAIL, P1>0 -> CONDITIONAL, else PASS),
// with one addition: NOT_APPLICABLE for a lane whose discover() returned zero
// artifacts (spec.md "Data Boundaries" edge case -- a lane with nothing to
// check must not be silently folded into an aggregate PASS).
const VERDICTS = Object.freeze(['PASS', 'CONDITIONAL', 'FAIL', 'NOT_APPLICABLE']);

// Rollup precedence when combining N per-lane verdicts into one overall
// verdict: a single FAIL lane must never be averaged away by converged
// lanes (plan.md's own named risk -- "per-lane convergence could mask a
// single stuck lane"). NOT_APPLICABLE never raises the overall verdict; an
// all-NOT_APPLICABLE run (zero coverage everywhere) still reports PASS
// trivially but ITERATE_STATE_LEVEL callers should treat that as a
// "nothing to converge" signal (spec.md Data Boundaries), not a real pass.
const VERDICT_SEVERITY_RANK = Object.freeze({ FAIL: 3, CONDITIONAL: 2, PASS: 1, NOT_APPLICABLE: 0 });

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

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') {
    try { return String(value).replace(/\s+/g, ' ').trim(); } catch { return ''; }
  }
  return value.replace(/\s+/g, ' ').trim();
}

function zeroSeverityMap() {
  return { P0: 0, P1: 0, P2: 0 };
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeSeverity(value) {
  return SEVERITY_KEYS.includes(value) ? value : null;
}

// Same shape as scripts/scoping.cjs's own summarizeScope() (deep-alignment/
// scripts/scoping.cjs) so a lane's human-readable scope summary is identical
// whether printed by the scoping CLI or by this reducer.
function summarizeScope(scope) {
  if (!scope || typeof scope !== 'object') return 'unknown-scope';
  if (scope.type === 'branchRange') return `${scope.from}..${scope.to}`;
  if (Array.isArray(scope.values)) return scope.values.join(', ');
  return 'unknown-scope';
}

// Canonical per-lane key: authority x artifactClass x scope, joined with a
// separator ("::") that cannot appear in an authority name or artifact-class
// value (both are closed enums in scoping.cjs), so the key is collision-free
// without needing a hash.
function laneKey(lane) {
  const authority = normalizeText(lane && lane.authority) || 'unknown-authority';
  const artifactClass = normalizeText(lane && lane.artifactClass) || 'unknown-class';
  const scopeText = summarizeScope(lane && lane.scope);
  return `${authority}::${artifactClass}::${scopeText}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into records, reporting malformed lines rather than
 * silently dropping them (fail-closed pathway) -- same contract as the
 * sibling reduce-state.cjs's parseJsonlDetailed(), reimplemented here (not
 * required from that file) so this reducer stays self-contained and does not
 * create a cross-mode dependency between the two sibling reducers.
 *
 * @param {string} jsonlContent
 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line:number, raw:string, error:string}>}}
 */
function parseJsonlDetailed(jsonlContent) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;

  for (const rawLine of jsonlContent.split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) continue;
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

function loadDeltaPayloads(deltaDir) {
  if (!fs.existsSync(deltaDir)) return [];
  return fs.readdirSync(deltaDir)
    .filter((fileName) => /^iter-\d+\.jsonl$/.test(fileName))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .flatMap((fileName) => parseJsonl(readUtf8(path.join(deltaDir, fileName))));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the run's required lanes from config.lanes (frozen at SCOPE-state,
 * mirroring how deep-review-config.json freezes reviewDimensions at INIT).
 * Each entry gains a laneId so downstream aggregation never re-derives it.
 *
 * @param {Object} config - Parsed deep-alignment-config.json
 * @returns {Array<{laneId:string, authority:string, artifactClass:string, scope:Object}>}
 */
function resolveRequiredLanes(config) {
  const rawLanes = Array.isArray(config && config.lanes) ? config.lanes : [];
  return rawLanes.map((lane) => ({
    laneId: laneKey(lane),
    authority: lane.authority,
    artifactClass: lane.artifactClass,
    scope: lane.scope,
  }));
}

/**
 * A finding's dedup key: content_hash when the adapter/loop supplied one,
 * else a fallback over the fields every adapter's finding shape carries in
 * common (severity + type + message) -- adapter shapes are heterogeneous
 * beyond that (sk-git's artifactRef vs sk-doc's artifactPath vs
 * sk-design-live-render's artifactTarget), so the fallback deliberately does
 * not reach for an adapter-specific field.
 * @param {Object} finding
 * @returns {string}
 */
function findingDedupKey(finding) {
  if (finding && typeof finding.contentHash === 'string' && finding.contentHash) {
    return `ch:${finding.contentHash}`;
  }
  const severity = normalizeText(finding && finding.severity);
  const type = normalizeText(finding && finding.type);
  const message = normalizeText(finding && finding.message).slice(0, 120);
  const artifact = normalizeText(
    (finding && (finding.artifactPath || finding.artifactTarget || finding.artifactRef || finding.artifactId)) || '',
  );
  return `fl:${severity}|${type}|${artifact}|${message}`;
}

/**
 * Aggregate one lane's iteration + delta records into its registry entry.
 * Findings are the RAW adapter check() output (severity/type/message plus
 * whatever adapter-specific fields that authority's finding carries) --
 * never reshaped into a false-uniform schema, since the three-method adapter
 * contract makes adapters authority-agnostic to the loop but does not make
 * their finding shapes byte-identical to each other (confirmed by reading
 * all 5 adapters' makeFinding() helpers: sk-git adds artifactRef/artifactKind,
 * sk-design-live-render replaces layer's deterministic/reasoning-agent
 * vocabulary with producedBy + a literal 'live-render' layer tag). Only
 * severity is read structurally here; every other field passes through.
 *
 * @param {{laneId:string, authority:string, artifactClass:string, scope:Object}} requiredLane
 * @param {Array<Object>} deltaRecords - Parsed deltas/iter-*.jsonl records (all lanes).
 * @param {Array<Object>} iterationRecords - Parsed main state-log {type:'iteration'} records (all lanes).
 * @returns {Object} Per-lane registry entry.
 */
function buildLaneEntry(requiredLane, deltaRecords, iterationRecords) {
  const { laneId } = requiredLane;

  const laneIterations = iterationRecords.filter(
    (record) => record && record.type === 'iteration' && record.laneId === laneId,
  );
  const laneDeltaFindings = deltaRecords
    .filter((record) => record && record.type === 'finding' && record.laneId === laneId)
    .map((record) => record.finding)
    .filter((finding) => finding && typeof finding === 'object');

  const artifactsChecked = laneIterations.reduce(
    (sum, record) => sum + (isFiniteNumber(record.artifactsChecked) ? record.artifactsChecked : 0),
    0,
  );

  // Dedup across iterations (a re-checked artifact that still fails re-emits
  // the same finding; only the first occurrence counts as "open").
  const byKey = new Map();
  for (const finding of laneDeltaFindings) {
    const severity = normalizeSeverity(finding.severity);
    if (!severity) continue; // a finding without a recognized P0/P1/P2 severity is not counted (fail-closed, not guessed)
    const key = findingDedupKey(finding);
    if (!byKey.has(key)) {
      byKey.set(key, { ...finding, severity });
    }
  }
  const openFindings = [...byKey.values()];

  const findingsBySeverity = zeroSeverityMap();
  let compositeScore = 0;
  for (const finding of openFindings) {
    findingsBySeverity[finding.severity] += 1;
    compositeScore += SEVERITY_WEIGHTS[finding.severity] || 0;
  }

  // Zero-artifact lane: discover() found nothing for this lane's scope.
  // NOT_APPLICABLE, never silently folded into an aggregate PASS (spec.md
  // Data Boundaries).
  const zeroArtifacts = laneIterations.length > 0 && artifactsChecked === 0 && openFindings.length === 0;
  let verdict;
  if (laneIterations.length === 0) {
    verdict = 'NOT_APPLICABLE'; // lane never ran an iteration yet (loop not started / mid-partition)
  } else if (zeroArtifacts) {
    verdict = 'NOT_APPLICABLE';
  } else if (findingsBySeverity.P0 > 0) {
    verdict = 'FAIL';
  } else if (findingsBySeverity.P1 > 0) {
    verdict = 'CONDITIONAL';
  } else {
    verdict = 'PASS';
  }

  return {
    laneId,
    authority: requiredLane.authority,
    artifactClass: requiredLane.artifactClass,
    scope: requiredLane.scope,
    iterationsRun: laneIterations.length,
    artifactsChecked,
    openFindings,
    findingsBySeverity,
    compositeScore: Math.round(compositeScore * 100) / 100,
    verdict,
  };
}

/**
 * Roll N per-lane entries into one overall verdict. The overall verdict is
 * the WORST per-lane verdict present (VERDICT_SEVERITY_RANK), never an
 * average -- a single FAIL lane fails the run regardless of how many other
 * lanes are clean (plan.md's own named risk, directly guarded against here).
 *
 * @param {Array<Object>} laneEntries
 * @returns {Object}
 */
function buildOverallRollup(laneEntries) {
  const findingsBySeverity = zeroSeverityMap();
  let compositeScore = 0;
  let worstRank = VERDICT_SEVERITY_RANK.NOT_APPLICABLE;
  let worstVerdict = 'NOT_APPLICABLE';
  const applicableLanes = laneEntries.filter((entry) => entry.verdict !== 'NOT_APPLICABLE');

  for (const entry of laneEntries) {
    for (const severity of SEVERITY_KEYS) {
      findingsBySeverity[severity] += entry.findingsBySeverity[severity] || 0;
    }
    compositeScore += entry.compositeScore;
    const rank = VERDICT_SEVERITY_RANK[entry.verdict] ?? 0;
    if (rank > worstRank) {
      worstRank = rank;
      worstVerdict = entry.verdict;
    }
  }

  // All lanes NOT_APPLICABLE (nothing discovered anywhere): report the
  // trivial PASS but flag it distinctly so a caller does not mistake "zero
  // coverage everywhere" for a real, evidenced pass (spec.md Data Boundaries
  // -- "the loop reports 'nothing to converge' and exits cleanly").
  const nothingToConverge = laneEntries.length === 0 || applicableLanes.length === 0;

  return {
    laneCount: laneEntries.length,
    applicableLaneCount: applicableLanes.length,
    findingsBySeverity,
    compositeScore: Math.round(compositeScore * 100) / 100,
    verdict: nothingToConverge ? 'PASS' : worstVerdict,
    nothingToConverge,
  };
}

/**
 * Render the single alignment-report.md, one section per lane plus an
 * overall summary -- the SKILL.md contract ("Emit one report per
 * lane, not one blended report across authorities") is honored by keeping
 * each lane's findings under its own heading rather than interleaving them.
 *
 * @param {Object} config
 * @param {Array<Object>} laneEntries
 * @param {Object} overall
 * @returns {string}
 */
function renderAlignmentReport(config, laneEntries, overall) {
  const lines = [
    '---',
    'title: Deep Alignment Report',
    'description: Auto-generated reducer view over the alignment packet. Never manually edited.',
    '---',
    '',
    '# Deep Alignment Report',
    '',
    `- Target: ${normalizeText(config.alignmentTarget) || '[Unknown target]'}`,
    `- Lanes: ${overall.laneCount} (${overall.applicableLaneCount} applicable)`,
    `- Overall verdict: ${overall.verdict}${overall.nothingToConverge ? ' (nothing to converge -- zero applicable lanes)' : ''}`,
    `- Findings: P0 ${overall.findingsBySeverity.P0} / P1 ${overall.findingsBySeverity.P1} / P2 ${overall.findingsBySeverity.P2}`,
    `- Composite score: ${overall.compositeScore}`,
    '',
  ];

  for (const entry of laneEntries) {
    lines.push(`## Lane: ${entry.authority} / ${entry.artifactClass} / ${summarizeScope(entry.scope)}`, '');
    lines.push(`- Verdict: ${entry.verdict}`);
    lines.push(`- Iterations run: ${entry.iterationsRun}`);
    lines.push(`- Artifacts checked: ${entry.artifactsChecked}`);
    lines.push(`- Findings: P0 ${entry.findingsBySeverity.P0} / P1 ${entry.findingsBySeverity.P1} / P2 ${entry.findingsBySeverity.P2}`);
    lines.push(`- Composite score: ${entry.compositeScore}`, '');

    if (entry.openFindings.length === 0) {
      lines.push('No open findings.', '');
      continue;
    }
    for (const severity of SEVERITY_KEYS) {
      const bucket = entry.openFindings.filter((finding) => finding.severity === severity);
      if (bucket.length === 0) continue;
      lines.push(`### ${severity}`, '');
      for (const finding of bucket) {
        const artifact = finding.artifactPath || finding.artifactTarget || finding.artifactRef || finding.artifactId || 'unknown-artifact';
        const layer = finding.layer || finding.producedBy || 'unlabeled';
        lines.push(`- **${finding.type || 'finding'}** (${layer}) — \`${artifact}\` — ${normalizeText(finding.message)}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Reduce the alignment/ JSONL state log + deltas into a synchronized
 * findings-registry.json and alignment-report.md, mirroring
 * reduceReviewState()'s contract shape (specFolder in, {registry, report,
 * paths} out) so a future loop-wiring pass can call this the same way it
 * calls the sibling reducer. Idempotent: repeated calls with unchanged input
 * produce identical output.
 *
 * @param {string} specFolder - Path to the bound spec folder.
 * @param {Object} [options]
 * @param {boolean} [options.write=true]
 * @returns {Object}
 */
function reduceAlignmentState(specFolder, options = {}) {
  const write = options.write !== false;
  const resolvedSpecFolder = path.resolve(specFolder);
  const { artifactDir: alignmentDir } = resolveArtifactRoot(resolvedSpecFolder, 'alignment');

  const configPath = path.join(alignmentDir, 'deep-alignment-config.json');
  const stateLogPath = path.join(alignmentDir, 'deep-alignment-state.jsonl');
  const registryPath = path.join(alignmentDir, 'deep-alignment-findings-registry.json');
  const reportPath = path.join(alignmentDir, 'alignment-report.md');
  const deltaDir = path.join(alignmentDir, 'deltas');

  const config = fs.existsSync(configPath) ? readJson(configPath) : { lanes: [] };
  const stateLogContent = fs.existsSync(stateLogPath) ? readUtf8(stateLogPath) : '';
  const { records: iterationRecords, corruptionWarnings } = parseJsonlDetailed(stateLogContent);
  const deltaRecords = loadDeltaPayloads(deltaDir);

  const requiredLanes = resolveRequiredLanes(config);
  const laneEntries = requiredLanes.map((lane) => buildLaneEntry(lane, deltaRecords, iterationRecords));
  const overall = buildOverallRollup(laneEntries);

  const registry = {
    alignmentTarget: config.alignmentTarget || null,
    lanes: laneEntries,
    overall,
    corruptionWarnings,
    hasCorruption: corruptionWarnings.length > 0,
  };
  const report = renderAlignmentReport(config, laneEntries, overall);

  if (write) {
    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    writeUtf8(reportPath, report.endsWith('\n') ? report : `${report}\n`);
  }

  return {
    configPath, stateLogPath, registryPath, reportPath,
    registry, report, corruptionWarnings, hasCorruption: corruptionWarnings.length > 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const positional = args.filter((arg) => !arg.startsWith('--'));
  const specFolder = positional[0];

  if (!specFolder) {
    process.stderr.write(
      'Usage: node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs <spec-folder>\n',
    );
    process.exit(1);
  }

  try {
    const result = reduceAlignmentState(specFolder, { write: true });
    process.stdout.write(
      `${JSON.stringify({
        registryPath: result.registryPath,
        reportPath: result.reportPath,
        overallVerdict: result.registry.overall.verdict,
        laneCount: result.registry.overall.laneCount,
        findingsBySeverity: result.registry.overall.findingsBySeverity,
        corruptionCount: result.corruptionWarnings.length,
      }, null, 2)}\n`,
    );
  } catch (error) {
    process.stderr.write(`[deep-alignment] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(3);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SEVERITY_KEYS,
  SEVERITY_WEIGHTS,
  VERDICTS,
  VERDICT_SEVERITY_RANK,
  laneKey,
  summarizeScope,
  findingDedupKey,
  resolveRequiredLanes,
  buildLaneEntry,
  buildOverallRollup,
  renderAlignmentReport,
  reduceAlignmentState,
  parseJsonl,
  parseJsonlDetailed,
};
