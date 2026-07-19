#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sk-design-live-render.cjs — deep-alignment live-render authority adapter ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Implements the three-method adapter contract for sk-design's             ║
// ║ LIVE-RENDER dimension: discover(scope),                                  ║
// ║ standardSource(authority), check(artifact, rules, options). Peer of      ║
// ║ the static sk-design adapter and the sk-code adapter.                    ║
// ║                                                                          ║
// ║ STRUCTURAL DIFFERENCE FROM THE REFERENCE (sk-doc.cjs): this              ║
// ║ file wraps NO locally-executable renderer. sk-doc.cjs shells out to two  ║
// ║ real Python validators via child_process; this adapter has nothing to   ║
// ║ shell out to — the only capability that can render a live target        ║
// ║ (design-mcp-open-design's MCP tool surface) is callable only from an    ║
// ║ agent's own tool-use loop, never from a spawned subprocess, AND (per    ║
// ║ direct research) that tool surface has no tool that renders an          ║
// ║ arbitrary external URL/route in the first place — see                   ║
// ║ ../../references/adapters/sk-design-live-render-adapter.md Section 8.   ║
// ║ check() is therefore a pure function over caller-supplied render         ║
// ║ evidence, never a renderer itself. Direct mcp-chrome-devtools call       ║
// ║ paths are forbidden — none exists anywhere in this file.                 ║
// ║                                                                          ║
// ║ Full specification: ../../references/adapters/sk-design-live-render-adapter.md ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * sk-design-live-render.cjs — the sk-design LIVE-RENDER authority adapter.
 *
 * discover(scope) takes the real, live scope shape from
 * ../../references/discover-contract.md §3 / ../../references/lane-config-schema.md §5:
 * `{type:'paths'|'globs', values:[...]}` (a 'branchRange' scope resolves to an empty
 * result — a rendered UI state has no per-commit identity the way a tracked file does).
 * Each `values[i]` is classified as a full URL (`http://`/`https://`) or a repo-relative
 * `componentEntry` string — see the adapter spec Section 1 for why a bare leading-slash
 * dev-server route ("/dashboard") cannot reach this method under the current scoping
 * schema (scoping.cjs's validateScope() rejects it upstream as an absolute path escaping
 * the repo root).
 *
 * check(artifact, rules, options) NEVER renders anything itself. It requires
 * `options.renderResult` — render evidence the caller (the ITERATE-state driving agent,
 * which holds the real MCP connection and dispatched through design-mcp-open-design)
 * already obtained and supplies as a plain object. Without it, check() returns
 * a single honest `render-unavailable` finding, never a fabricated pass.
 *
 * Module usage:
 *   const adapter = require('./sk-design-live-render.cjs');
 *   const { artifacts, nodes } = adapter.discover({ type: 'paths', values: ['http://localhost:3000/dashboard'] });
 *   const rules = adapter.standardSource('sk-design');
 *   const findings = adapter.check(artifacts[0], rules, { renderResult: { dispatchedThrough: 'design-mcp-open-design', renderedAt: new Date().toISOString(), measurements: {...} } });
 *
 * CLI usage (manual dry-run, no engine wiring required):
 *   node sk-design-live-render.cjs discover [--glob] <target-value...>
 *   node sk-design-live-render.cjs check <target> [--render-result <file.json|->]
 *   node sk-design-live-render.cjs standard-source
 *
 * Examples:
 *   node sk-design-live-render.cjs discover http://localhost:3000/dashboard src/components/Button.tsx
 *   node sk-design-live-render.cjs check http://localhost:3000/dashboard --render-result -
 *   node sk-design-live-render.cjs check http://localhost:3000/dashboard   # -> render-unavailable finding
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors sk-doc.cjs's own SKILLS_DIR computation (4 levels up from a mode-packet's
// scripts/<subdir>/*.cjs file) — this file lives at the same depth.
const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..', '..'); // .opencode/skills
const REPO_ROOT = path.resolve(SKILLS_DIR, '..', '..'); // repo root

const SK_DESIGN_DIR = path.join(SKILLS_DIR, 'sk-design');
const ACCESSIBILITY_PERFORMANCE_MD = path.join(SK_DESIGN_DIR, 'design-audit', 'references', 'accessibility-performance.md');
const ANTI_PATTERNS_PRODUCTION_MD = path.join(SK_DESIGN_DIR, 'design-audit', 'references', 'anti-patterns-production.md');
const AI_FINGERPRINT_TELLS_MD = path.join(SK_DESIGN_DIR, 'design-audit', 'references', 'ai-fingerprint-tells.md');

// Sibling to this adapter's own spec, matching sk-doc.cjs's KNOWN_DEVIATIONS_MD pattern.
// Does NOT exist yet — see the adapter spec Section 6 for why (no real live-render run has
// ever produced a finding to seed it with). loadKnownDeviations() degrades gracefully.
const KNOWN_DEVIATIONS_MD = path.resolve(__dirname, '..', '..', 'references', 'adapters', 'sk_design_live_render_known_deviations.md');

// The locked dispatch-boundary constraint, enforced as a literal value check on caller-
// supplied render evidence: a renderResult that does not self-report coming through this
// boundary is refused, not silently trusted.
const REQUIRED_DISPATCH_BOUNDARY = 'design-mcp-open-design';

// Cited verbatim from accessibility_performance.md:67-76 ("Concrete Thresholds") — not
// re-derived, not invented. clsMax/lcpMaxMs/inpMaxMs from that file's Core Web Vitals row
// (accessibility_performance.md:100).
const THRESHOLDS = Object.freeze({
  contrastBodyTextAA: 4.5,
  contrastBodyTextAAA: 7,
  contrastLargeTextAA: 3,
  contrastLargeTextAAA: 4.5,
  contrastUiComponentAA: 3,
  touchTargetMinPx: 44,
  touchTargetWcag22FloorPx: 24,
  lcpMaxMs: 2500,
  inpMaxMs: 200,
  clsMax: 0.1,
});

const URL_PATTERN = /^https?:\/\//i;
const GLOB_METACHAR_PATTERN = /[*?]/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. REPO-ROOT CONTAINMENT (mirrors sk-doc.cjs's isInsideRepoRoot exactly)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check that an absolute path stays inside the repo root. Used only for
 * `componentEntry`-classified targets (real filesystem-relative strings); a `url`
 * target has no repo-root concept and is never passed through this check.
 * @param {string} absPath
 * @returns {boolean}
 */
function isInsideRepoRoot(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TARGET CLASSIFIER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classify one scope value (or a bare check() artifact string) into a renderable
 * target. Returns null for anything unresolvable — an unresolvable value contributes
 * to zero-coverage, not an error (discover_contract.md §5's "empty/unreachable scope
 * resolves to zero-coverage" rule, applied per-value here).
 *
 * Only two target kinds are produced: `url` (a full http(s):// string) and
 * `componentEntry` (a repo-relative string, validated against the repo root). A third
 * "route" kind (bare leading-slash dev-server paths like "/dashboard") is deliberately
 * absent — scoping.cjs's validateScope() rejects that shape upstream, before discover()
 * or check() ever sees it (see the adapter spec Section 1's validated trace).
 *
 * @param {unknown} value
 * @returns {{target:string, targetType:'url'|'componentEntry'}|null}
 */
function classifyTarget(value) {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  if (URL_PATTERN.test(value)) return { target: value, targetType: 'url' };
  // No glob expansion in v1 (adapter spec Section 3): a value containing glob
  // metacharacters cannot identify one renderable target, so it is skipped rather
  // than silently expanded against an unfounded "which files count" policy.
  if (GLOB_METACHAR_PATTERN.test(value)) return null;
  const absPath = path.resolve(REPO_ROOT, value);
  if (!isInsideRepoRoot(absPath)) return null;
  return { target: value, targetType: 'componentEntry' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DISCOVER(SCOPE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * discover(scope) -> { artifacts, nodes }, for the sk-design authority's live-render
 * dimension. See the adapter spec Section 3 for the full behavior and the honest
 * "no directory/glob expansion in v1" scope-down.
 *
 * @param {{type:'paths'|'globs', values:string[]}|{type:'branchRange', from:string, to:string}} scope
 * @returns {{artifacts:Array<{target:string, targetType:string}>, nodes:Array<Object>}}
 */
function discover(scope) {
  if (!scope || typeof scope !== 'object' || typeof scope.type !== 'string') {
    throw new Error('discover(scope): scope must be an object with a "type" field (see discover_contract.md Section 3)');
  }

  let targets = [];
  if (scope.type === 'paths' || scope.type === 'globs') {
    const values = Array.isArray(scope.values) ? scope.values : [];
    const seen = new Set();
    for (const value of values) {
      const classified = classifyTarget(value);
      if (!classified) continue;
      if (seen.has(classified.target)) continue;
      seen.add(classified.target);
      targets.push(classified);
    }
  } else if (scope.type === 'branchRange') {
    // A rendered UI state has no meaningful per-commit identity the way a tracked file
    // does, and no wrapped tool here operates on anything but a live target string —
    // see sk_design_live_render_adapter.md Section 3 (mirrors sk-doc.cjs's own
    // branchRange-returns-empty precedent for the equivalent, differently-reasoned gap).
    targets = [];
  } else {
    throw new Error(`discover(scope): unknown scope.type "${scope.type}"`);
  }

  const artifacts = targets.map((t) => ({ target: t.target, targetType: t.targetType }));
  const nodes = targets.map((t) => ({
    id: `target:${t.target}`,
    kind: 'FILE', // the only NodeKind this program has (coverage-graph-db.ts:22,34) — see adapter spec Section 3.
    name: t.target,
    metadata: { authority: 'sk-design', artifactClass: 'designs', mode: 'live-render', targetType: t.targetType },
  }));
  return { artifacts, nodes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. KNOWN-DEVIATION SUPPRESSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load and parse the machine-readable deviation list from
 * sk_design_live_render_known_deviations.md's fenced ```json block, mirroring
 * sk-doc.cjs's loadKnownDeviations() exactly. That file does not exist yet (adapter
 * spec Section 6) — a missing/malformed file yields [], never a thrown error, so this
 * adapter degrades gracefully rather than requiring the list to exist to run at all.
 * @returns {Array<Object>}
 */
function loadKnownDeviations() {
  let raw;
  try {
    raw = fs.readFileSync(KNOWN_DEVIATIONS_MD, 'utf8');
  } catch (err) {
    return [];
  }
  const match = raw.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed.deviations) ? parsed.deviations : [];
  } catch (err) {
    return [];
  }
}

function matchesDeviation(finding, deviation) {
  if (!Array.isArray(deviation.matchTypes) || deviation.matchTypes.length === 0) return false;
  if (!deviation.matchTypes.includes(finding.type)) return false;
  if (deviation.matchTargetType && deviation.matchTargetType !== finding.artifactTargetType) return false;
  return true;
}

/**
 * Filter findings through the known-deviation list. A match suppresses only that
 * finding — never the whole artifact (mirrors sk-doc.cjs's Data Boundaries discipline).
 * @param {Array<Object>} findings
 * @param {Array<Object>} knownDeviations
 * @returns {Array<Object>}
 */
function suppressKnownDeviations(findings, knownDeviations) {
  if (!Array.isArray(knownDeviations) || knownDeviations.length === 0) return findings;
  return findings.filter((finding) => !knownDeviations.some((dev) => matchesDeviation(finding, dev)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. STANDARDSOURCE(AUTHORITY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * standardSource(authority) -> {rubric, thresholds, knownDeviations}, for sk-design's
 * live-render dimension. Distinct from (and does not re-implement) the static
 * sk-design adapter, which returns a different rubric from a different file — see the
 * adapter spec Section 1's "Peer Relationship" note on the resulting module-selection
 * gap that still must be closed.
 * @param {string} authority - Must be 'sk-design'.
 * @returns {Object}
 */
function standardSource(authority) {
  if (authority !== 'sk-design') {
    throw new Error(`sk-design-live-render adapter standardSource() called with unsupported authority "${authority}"`);
  }
  return {
    authority: 'sk-design',
    mode: 'live-render',
    rubric: {
      accessibilityPerformance: { path: ACCESSIBILITY_PERFORMANCE_MD },
      antiPatternsProduction: { path: ANTI_PATTERNS_PRODUCTION_MD },
      aiFingerprintTells: { path: AI_FINGERPRINT_TELLS_MD },
    },
    thresholds: THRESHOLDS,
    knownDeviations: loadKnownDeviations(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CHECK(ARTIFACT, RULES, OPTIONS)
// ─────────────────────────────────────────────────────────────────────────────

function makeFinding({ severity, type, producedBy, evidenceLabel, message, artifact, detail }) {
  return {
    severity,
    type,
    layer: 'live-render', // distinguishes this adapter's findings from the static adapter's findings
    producedBy, // 'deterministic' | 'reasoning-agent' | 'unavailable' — the honesty axis, kept distinct from `layer` (adapter spec Section 7)
    evidenceLabel: evidenceLabel || null, // 'confirmed' | 'inferred' | 'unavailable' — reuses evidence_capture.md's own vocabulary
    message,
    artifactTarget: artifact.target,
    artifactTargetType: artifact.targetType || null,
    authority: 'sk-design',
    mode: 'live-render',
    detail: detail === undefined ? null : detail,
  };
}

/**
 * Normalize a check() artifact argument into {target, targetType}. Accepts either a
 * bare target string or a discover()-shaped object, mirroring sk-doc.cjs's
 * normalizeArtifact() pattern.
 * @param {string|{target:string, targetType?:string}} artifact
 * @returns {{target:string, targetType:string}}
 */
function normalizeArtifact(artifact) {
  if (typeof artifact === 'string') {
    const classified = classifyTarget(artifact);
    if (!classified) {
      throw new Error(`check(): artifact "${artifact}" is not a resolvable live-render target (see discover()'s classifier)`);
    }
    return classified;
  }
  if (artifact && typeof artifact === 'object' && typeof artifact.target === 'string') {
    if (artifact.targetType) return artifact;
    const classified = classifyTarget(artifact.target);
    return classified || { target: artifact.target, targetType: null };
  }
  throw new Error('check(artifact, rules, options): artifact must be a target string or a discover()-shaped object with a "target" field');
}

/**
 * Deterministic sub-checks over whatever structured `measurements` fields are present
 * on the caller-supplied renderResult — never fabricated when a field is absent.
 * Severity split (P0 body-text / P1 large-text-or-UI-component for contrast; P1 below
 * the WCAG 2.2 floor / P2 below the 44px recommendation for touch targets) is this
 * adapter's own reasonable mapping onto design-audit/SKILL.md's severity table
 * (P0="severe WCAG failure", P1="WCAG AA violation"), since accessibility_performance.md
 * itself states thresholds but not findings-severity.
 * @param {{target:string, targetType:string}} artifact
 * @param {Object} renderResult
 * @param {string} evidenceLabel
 * @returns {Array<Object>}
 */
function checkThresholds(artifact, renderResult, evidenceLabel) {
  const findings = [];
  const measurements = renderResult.measurements || {};

  for (const c of measurements.contrastRatios || []) {
    if (typeof c.ratio !== 'number') continue;
    const isLargeOrUi = Boolean(c.isLargeText || c.isUiComponent);
    const floor = isLargeOrUi ? THRESHOLDS.contrastLargeTextAA : THRESHOLDS.contrastBodyTextAA;
    if (c.ratio < floor) {
      findings.push(makeFinding({
        severity: isLargeOrUi ? 'P1' : 'P0',
        type: 'contrast-below-threshold',
        producedBy: 'deterministic',
        evidenceLabel,
        message: `${c.element || 'element'}: measured contrast ${c.ratio}:1 is below the ${floor}:1 AA floor (accessibility_performance.md:73-75)`,
        artifact,
        detail: c,
      }));
    }
  }

  for (const t of measurements.touchTargets || []) {
    const w = t.widthPx;
    const h = t.heightPx;
    if (typeof w !== 'number' || typeof h !== 'number') continue;
    if (w < THRESHOLDS.touchTargetMinPx || h < THRESHOLDS.touchTargetMinPx) {
      const belowFloor = w < THRESHOLDS.touchTargetWcag22FloorPx || h < THRESHOLDS.touchTargetWcag22FloorPx;
      findings.push(makeFinding({
        severity: belowFloor ? 'P1' : 'P2',
        type: 'touch-target-below-threshold',
        producedBy: 'deterministic',
        evidenceLabel,
        message: `${t.element || 'element'}: measured ${w}x${h}px is below the ${THRESHOLDS.touchTargetMinPx}x${THRESHOLDS.touchTargetMinPx}px target (accessibility_performance.md:76)`,
        artifact,
        detail: t,
      }));
    }
  }

  const cwv = measurements.coreWebVitals || {};
  const vitalChecks = [
    ['lcpMs', THRESHOLDS.lcpMaxMs, 'LCP', 'ms'],
    ['inpMs', THRESHOLDS.inpMaxMs, 'INP', 'ms'],
    ['cls', THRESHOLDS.clsMax, 'CLS', ''],
  ];
  for (const [field, max, label, unit] of vitalChecks) {
    const value = cwv[field];
    if (typeof value === 'number' && value > max) {
      findings.push(makeFinding({
        severity: 'P1',
        type: 'core-web-vital-below-threshold',
        producedBy: 'deterministic',
        evidenceLabel,
        message: `${label} ${value}${unit} exceeds the ${max}${unit} floor (accessibility_performance.md:100)`,
        artifact,
        detail: { metric: label, value },
      }));
    }
  }

  return findings;
}

/**
 * Translate caller-supplied, already-verified judgment findings into the findings
 * array. Never invents one: an entry missing `evidence` or `rubricSection` is
 * dropped, mirroring sk-doc.cjs's checkRealityAlignment() requiring reprobeEvidence.
 * @param {{target:string, targetType:string}} artifact
 * @param {Object} renderResult
 * @param {string} evidenceLabel
 * @returns {Array<Object>}
 */
function checkJudgmentFindings(artifact, renderResult, evidenceLabel) {
  const findings = [];
  for (const jf of renderResult.judgmentFindings || []) {
    if (!jf || !jf.evidence || !jf.rubricSection) continue;
    findings.push(makeFinding({
      severity: jf.severity || 'P2',
      type: 'live-render-judgment',
      producedBy: 'reasoning-agent',
      evidenceLabel,
      message: jf.message || `Judgment finding against ${jf.rubricSection}`,
      artifact,
      detail: { rubricSection: jf.rubricSection, evidence: jf.evidence },
    }));
  }
  return findings;
}

/**
 * check(artifact, rules, options) -> findings, for sk-design's live-render dimension.
 *
 * This function NEVER renders anything itself (see this file's header comment and the
 * adapter spec Section 8). It requires `options.renderResult` — render evidence the
 * caller already obtained by dispatching through design-mcp-open-design.
 * Four short-circuit conditions (missing renderResult, wrong dispatch boundary,
 * dispatch rejected, auth-blocked target) each return a single honest finding instead
 * of crashing or fabricating a pass. Otherwise runs deterministic threshold checks over
 * `measurements` and passes through caller-verified `judgmentFindings`, then applies
 * known-deviation suppression.
 *
 * @param {string|{target:string, targetType?:string}} artifact
 * @param {Object} [rules] - standardSource('sk-design') output; knownDeviations reloaded if omitted.
 * @param {{renderResult?: Object}} [options]
 * @returns {Array<Object>} Findings after suppression.
 */
function check(artifact, rules, options) {
  const normalizedArtifact = normalizeArtifact(artifact);
  const knownDeviations = (rules && Array.isArray(rules.knownDeviations)) ? rules.knownDeviations : loadKnownDeviations();
  const renderResult = options && options.renderResult;

  if (!renderResult) {
    return suppressKnownDeviations([makeFinding({
      severity: 'P1',
      type: 'render-unavailable',
      producedBy: 'unavailable',
      evidenceLabel: 'unavailable',
      message: 'No renderResult supplied: this adapter cannot render standalone (adapter spec Section 8) — the ITERATE-state driving agent must dispatch through design-mcp-open-design and supply the render evidence via options.renderResult.',
      artifact: normalizedArtifact,
    })], knownDeviations);
  }

  if (renderResult.dispatchedThrough !== REQUIRED_DISPATCH_BOUNDARY) {
    return suppressKnownDeviations([makeFinding({
      severity: 'P0',
      type: 'dispatch-boundary-violation',
      producedBy: 'unavailable',
      evidenceLabel: 'unavailable',
      message: `renderResult.dispatchedThrough must equal "${REQUIRED_DISPATCH_BOUNDARY}" (ADR-009); got ${JSON.stringify(renderResult.dispatchedThrough || null)}`,
      artifact: normalizedArtifact,
    })], knownDeviations);
  }

  if (renderResult.dispatchRejected) {
    return suppressKnownDeviations([makeFinding({
      severity: 'P1',
      type: 'dispatch-rejected',
      producedBy: 'unavailable',
      evidenceLabel: 'unavailable',
      message: String(renderResult.dispatchRejected),
      artifact: normalizedArtifact,
    })], knownDeviations);
  }

  if (renderResult.authBlocked) {
    return suppressKnownDeviations([makeFinding({
      severity: 'P1',
      type: 'render-blocked-auth-required',
      producedBy: 'unavailable',
      evidenceLabel: 'unavailable',
      message: `Render blocked: target "${normalizedArtifact.target}" requires authentication.`,
      artifact: normalizedArtifact,
    })], knownDeviations);
  }

  // Freshness is a caller contract this function cannot mechanically prove (adapter spec
  // Section 5) — presence of a parseable renderedAt only raises the evidence label from
  // 'inferred' to 'confirmed', reusing evidence_capture.md's own vocabulary.
  const hasFreshTimestamp = typeof renderResult.renderedAt === 'string' && !Number.isNaN(Date.parse(renderResult.renderedAt));
  const evidenceLabel = hasFreshTimestamp ? 'confirmed' : 'inferred';

  const findings = checkThresholds(normalizedArtifact, renderResult, evidenceLabel)
    .concat(checkJudgmentFindings(normalizedArtifact, renderResult, evidenceLabel));
  return suppressKnownDeviations(findings, knownDeviations);
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function runCli(argv) {
  const [subcommand, ...rest] = argv;

  if (subcommand === 'discover') {
    const isGlob = rest[0] === '--glob';
    const values = isGlob ? rest.slice(1) : rest;
    if (values.length === 0) {
      process.stderr.write('Usage: sk-design-live-render.cjs discover [--glob] <target-value...>\n');
      process.exitCode = 1;
      return;
    }
    printJson(discover({ type: isGlob ? 'globs' : 'paths', values }));
    return;
  }

  if (subcommand === 'check') {
    const args = rest.slice();
    let renderResultSrc = null;
    const flagIdx = args.indexOf('--render-result');
    if (flagIdx !== -1) {
      renderResultSrc = args[flagIdx + 1];
      args.splice(flagIdx, 2);
    }
    const target = args[0];
    if (!target) {
      process.stderr.write('Usage: sk-design-live-render.cjs check <target> [--render-result <file.json|->]\n');
      process.exitCode = 1;
      return;
    }
    let renderResult;
    if (renderResultSrc) {
      let raw;
      try {
        raw = renderResultSrc === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(path.resolve(renderResultSrc), 'utf8');
      } catch (err) {
        process.stderr.write(`--render-result could not be read: ${err.message}\n`);
        process.exitCode = 1;
        return;
      }
      try {
        renderResult = JSON.parse(raw);
      } catch (err) {
        process.stderr.write(`--render-result content is not valid JSON: ${err.message}\n`);
        process.exitCode = 1;
        return;
      }
    }
    printJson(check(target, standardSource('sk-design'), { renderResult }));
    return;
  }

  if (subcommand === 'standard-source') {
    printJson(standardSource('sk-design'));
    return;
  }

  process.stderr.write('Usage: sk-design-live-render.cjs <discover|check|standard-source> [args...]\n');
  process.exitCode = 1;
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  discover,
  standardSource,
  check,
  classifyTarget,
  loadKnownDeviations,
};
