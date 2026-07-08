#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ browser-executor.cjs — Mode B executor for browser-gated scenarios       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * browser-executor.cjs — Mode B executor for browser-gated scenarios (MR-*, CB-*).
 *
 * Those scenarios need a real browser (Motion CDN smoke, reduced-motion
 * emulation, Core Web Vitals, GPU compositing), so they run through `bdg`
 * (Chrome DevTools CLI), validated headless in the Phase 0 spike. Honesty is the
 * hard rule: only scenarios whose pass-criteria map to a capturable signal get a
 * PASS/FAIL; the rest report PARTIAL-NEEDS-ARTIFACT or SKIP-NO-BROWSER and NEVER
 * a fabricated PASS. bdg is a single-session daemon, so scenarios run serially.
 *
 * Verdict → dims mapping (so aggregate's "normalize over measured dims" holds):
 *   PASS → 1.0 · FAIL → 0 · PARTIAL → 0.5 (status: partial) · SKIP → null (non-penalizing)
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const BDG = process.env.BDG_BIN || 'bdg';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function bdg(args, { timeout = 30000 } = {}) {
  const res = spawnSync(BDG, args, { encoding: 'utf8', timeout, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 8 * 1024 * 1024 });
  return { status: res.status, stdout: (res.stdout || '').trim(), stderr: (res.stderr || '').trim() };
}

/**
 * Minimal Motion-CDN smoke page: imports the pinned Motion ESM bundle and
 * records export presence + a completed animate()/inView() on window.__skc.
 * @returns {string} HTML document source for the headless smoke page.
 */
function motionSandboxHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="t">x</div>
<script type="module">
window.__skc = { exportsOk: false, animateDone: false, error: null };
try {
  const m = await import('https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm');
  window.__skc.exportsOk = ['animate','inView','scroll'].every(k => typeof m[k] === 'function');
  try { m.animate('#t', { opacity: [0,1] }, { duration: 0.01 }); window.__skc.animateDone = true; } catch(e) { window.__skc.error = String(e); }
} catch (e) { window.__skc.error = String(e); }
window.__skcReady = true;
</script></body></html>`;
}

/**
 * Map a browser verdict to per-dimension scores for aggregation.
 * @param {string} verdict - One of PASS, FAIL, PARTIAL-*, or a SKIP-* verdict.
 * @returns {Object} Dimension map with d1intra/d2/d3 scored and d1inter/d4 unscored.
 */
function verdictToDims(verdict) {
  const v = verdict === 'PASS' ? 1 : verdict === 'FAIL' ? 0 : verdict.startsWith('PARTIAL') ? 0.5 : null;
  const dim = (extra) => ({ score: v, ...(v === null ? { status: 'skip-needs-browser' } : {}), ...(extra || {}) });
  return { d1intra: dim(), d2: dim(), d3: dim(), d1inter: { score: null, unscored: 'browser scenario' }, d4: { score: null, unscored: 'browser scenario' } };
}

function row(scenario, verdict, browser) {
  const dims = verdictToDims(verdict);
  const measured = [dims.d1intra.score, dims.d2.score, dims.d3.score].filter((s) => typeof s === 'number');
  const modeAScore = measured.length ? Math.round((measured.reduce((a, b) => a + b, 0) / measured.length) * 100) : undefined;
  return {
    scenarioId: scenario.scenarioId, classKind: 'browser', tier: 'browser-gated',
    modeAScore, firstFailingStage: verdict === 'PASS' ? null : 'browser',
    dims, browser,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// Motion API smoke — the one fully-automatable browser scenario: load a Motion
// sandbox headless and assert the API exports + a completed animation.
function runMotionSmoke(scenario, sandboxDir) {
  const page = path.join(sandboxDir, `skc-${scenario.scenarioId}.html`);
  fs.writeFileSync(page, motionSandboxHtml());
  const url = `file://${page}`;
  const evidence = [page];
  try {
    const start = bdg([url, '--headless'], { timeout: 45000 });
    if (start.status !== 0) return row(scenario, 'SKIP-NO-BROWSER', { verdict: 'SKIP-NO-BROWSER', reason: 'bdg failed to start', evidence, error: start.stderr.slice(0, 200) });
    // wait for the module to settle, then read the smoke result
    bdg(['dom', 'eval', 'new Promise(r=>{const t=setInterval(()=>{if(window.__skcReady){clearInterval(t);r(1)}},50);setTimeout(()=>r(1),4000)})'], { timeout: 8000 });
    const smoke = bdg(['dom', 'eval', 'JSON.stringify(window.__skc||{})']);
    const consoleErr = bdg(['console', '--list', '--level', 'error', '--json']);
    let s = {};
    try { s = JSON.parse(JSON.parse(smoke.stdout)); } catch { try { s = JSON.parse(smoke.stdout); } catch { s = {}; } }
    const errCount = (() => { try { const j = JSON.parse(consoleErr.stdout); return Array.isArray(j) ? j.length : (j.entries ? j.entries.length : 0); } catch { return 0; } })();
    const pass = s.exportsOk === true && s.animateDone === true && errCount === 0 && !s.error;
    return row(scenario, pass ? 'PASS' : 'FAIL', {
      verdict: pass ? 'PASS' : 'FAIL', signalsObserved: { ...s, consoleErrors: errCount }, evidence,
    });
  } finally {
    bdg(['stop'], { timeout: 8000 });
  }
}

/**
 * Executor entrypoint (called by executor-dispatch.cjs browser branch).
 * Honest per-scenario verdicts; never a fabricated PASS.
 * @param {Object} [params] - Executor parameters.
 * @param {{ scenarioId: string }} params.scenario - Scenario descriptor with scenarioId.
 * @param {string} [params.sandboxDir] - Sandbox directory; a temp dir is created when omitted.
 * @returns {Object} Scenario result row with verdict, dims, and browser evidence.
 */
function executeBrowserScenario({ scenario, sandboxDir } = {}) {
  const dir = sandboxDir || fs.mkdtempSync(path.join(os.tmpdir(), 'skc-browser-'));
  const id = scenario.scenarioId || '';
  // Fully automatable: Motion API smoke.
  if (id === 'MR-001') return runMotionSmoke(scenario, dir);

  // The rest map to honest non-PASS verdicts pending the per-scenario harness:
  //  - video-baseline diff: a harness can capture but not auto-judge.
  //  - Safari/Firefox legs: bdg is Chrome-only -> escalate, never downgrade.
  //  - CDN / reduced-motion / layout checks: partially capturable (rg/CWV/layout
  //    counters) but the final judgement is assisted; report PARTIAL with
  //    evidence, not a fabricated PASS.
  const partial = {
    'MR-002': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'CDN @latest scan is CLI-checkable; export probe needs a per-URL harness' },
    'MR-003': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'reduced-motion media-query is checkable; motion-neutralization needs positional comparison' },
    'MR-004': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'video baseline diff is capture-only, not auto-judgeable' },
    'CB-001': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'Chrome leg automatable; Safari/Firefox out of bdg scope', escalation: 'cross-browser:safari,firefox' },
    'CB-002': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'LCP/CLS derivable via PerformanceObserver; INP needs a scripted interaction' },
    'CB-003': { verdict: 'PARTIAL-NEEDS-ARTIFACT', reason: 'layout/recalc counters via Performance.getMetrics; compositor judgement assisted' },
  }[id] || { verdict: 'SKIP-NO-BROWSER', reason: 'no browser-harness recipe for this scenario yet' };
  return row(scenario, partial.verdict, { ...partial, evidence: [] });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { executeBrowserScenario, verdictToDims, motionSandboxHtml };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  const out = executeBrowserScenario({ scenario: { scenarioId: args.scenario || 'MR-001' } });
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
  process.exit(0);
}
