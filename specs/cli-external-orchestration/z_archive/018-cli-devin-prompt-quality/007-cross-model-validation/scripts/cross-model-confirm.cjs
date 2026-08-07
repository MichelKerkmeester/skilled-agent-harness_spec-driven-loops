#!/usr/bin/env node
/**
 * scripts/cross-model-confirm.cjs
 *
 * Cross-model validation harness. Dispatches the 5 council-seeded variants
 * from 113/003 × 7 fixtures from 113/002 × N models (default: 2). Scores
 * each dispatch via 113/003/score-variant.cjs (which auto-extracts files
 * via 113/005/extract-files-from-markdown.cjs when EVAL_LOOP_EXTRACT=true).
 *
 * Per ADR-002 in decision-record.md: dispatcher pivoted from cli-opencode
 * (1.15.1 InstanceRef bug) to cli-devin with --model deepseek-v4 and
 * --model kimi-k2.6 model presets.
 *
 * Usage:
 *   node cross-model-confirm.cjs [--models <list>] [--variants <list>] [--fixtures <list>] [--mock]
 *
 * Default models: deepseek-v4,kimi-k2.6
 * Default variants: all 5 council-seeded (v-001..v-005)
 * Default fixtures: all 7
 *
 * Outputs:
 *   state/dispatch/<model>/<variant>/output-<fixture>.md  (raw cli-devin stdout)
 *   state/cross-model-results.jsonl                        (per-dispatch row)
 *   analysis.md                                             (per-model x per-variant table + verdict)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const PACKET_ROOT = path.resolve(__dirname, '..');
const EVAL_PACKET = path.resolve(PACKET_ROOT, '..', '003-eval-loop');
const RIG_PACKET = path.resolve(PACKET_ROOT, '..', '002-eval-rig');

const renderVariant = require(path.join(EVAL_PACKET, 'scripts', 'render-variant.cjs'));
const { scoreVariantFixture } = require(path.join(EVAL_PACKET, 'scripts', 'score-variant.cjs'));

const DISPATCH_DIR = path.join(PACKET_ROOT, 'state', 'dispatch');
const RESULTS_JSONL = path.join(PACKET_ROOT, 'state', 'cross-model-results.jsonl');
const ANALYSIS_OUT = path.join(PACKET_ROOT, 'analysis.md');

const DEVIN_BIN = process.env.DEVIN_BIN || 'devin';
const OPENCODE_BIN = process.env.OPENCODE_BIN || 'opencode';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.DEVIN_TIMEOUT_MS || '1500000', 10);  // 25 min per dispatch

// Per ADR-003: dispatch surface routed by model.
// deepseek-v4-pro via cli-opencode + DeepSeek direct API (user-intent surface).
// kimi-k2.6 via cli-devin (opencode-go account insufficient balance).
const DISPATCH_ROUTE = {
  'deepseek-v4-pro': { surface: 'cli-opencode', model: 'deepseek/deepseek-v4-pro', variant: 'high' },
  'kimi-k2.6': { surface: 'cli-devin', model: 'kimi-k2.6' },
  // Fallbacks for direct cli-devin model names (used in smoke-tests)
  'deepseek-v4': { surface: 'cli-devin', model: 'deepseek-v4' },
};

// Reference scores from prior runs on SWE-1.6 (113/003 + 113/005/v2)
const SWE16_BASELINE = {
  'v-001-baseline-star': 0.5235,
  'v-002-build-dense-preplan': 0.4468,
  'v-003-anti-hallucination-strong': 0.5164,
  'v-004-rcaf-medium': 0.5664,
  'v-005-build-strict-bundle-gate': 0.5610,
};

function sha256Hex(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = {
    models: ['deepseek-v4-pro', 'kimi-k2.6'],
    variants: ['v-001-baseline-star', 'v-002-build-dense-preplan', 'v-003-anti-hallucination-strong', 'v-004-rcaf-medium', 'v-005-build-strict-bundle-gate'],
    fixtures: null,  // null = all
    mock: false,
    append: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--models') args.models = argv[++i].split(',');
    else if (a === '--variants') args.variants = argv[++i].split(',');
    else if (a === '--fixtures') args.fixtures = argv[++i].split(',');
    else if (a === '--mock') args.mock = true;
    else if (a === '--append') args.append = true;
  }
  return args;
}

function listFixtures(filter) {
  const fixturesDir = path.join(RIG_PACKET, 'fixtures');
  const all = fs.readdirSync(fixturesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith('fix-'))
    .map((e) => path.join(fixturesDir, e.name, 'task.json'))
    .filter((p) => fs.existsSync(p));
  if (filter && filter.length) {
    return all.filter((p) => filter.some((f) => p.includes(f)));
  }
  return all;
}

function loadVariant(variantId) {
  const file = path.join(EVAL_PACKET, 'variants', variantId + '.md');
  if (!fs.existsSync(file)) throw new Error('variant file not found: ' + file);
  return file;
}

function dispatchDevin(promptFile, model, cwd, opts = {}) {
  const timeout = opts.timeout_ms || DEFAULT_TIMEOUT_MS;
  if (opts.mock) {
    return {
      ok: true, stdout: `MOCK cli-devin ${model} dispatch — variant=${path.basename(promptFile, '.md')}`,
      stderr: '', attempts: 1, mock: true,
    };
  }
  const t0 = Date.now();
  const res = spawnSync(DEVIN_BIN, [
    '--print', '--model', model, '--permission-mode', 'auto', '--prompt-file', promptFile,
  ], { cwd, timeout, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return {
    ok: res.status === 0,
    exit_code: res.status,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    attempts: 1,
    elapsed_ms: Date.now() - t0,
  };
}

function parseOpencodeJsonStream(streamText) {
  // opencode --format json emits newline-delimited JSON events.
  // The final assistant message is built from all `text` event parts in order.
  const chunks = [];
  let lastError = null;
  for (const line of streamText.split('\n')) {
    const t = line.trim();
    if (!t || !t.startsWith('{')) continue;
    try {
      const ev = JSON.parse(t);
      if (ev.type === 'text' && ev.part && typeof ev.part.text === 'string') {
        chunks.push(ev.part.text);
      } else if (ev.type === 'error') {
        lastError = (ev.error && ev.error.data && ev.error.data.message) || JSON.stringify(ev.error);
      }
    } catch (_) { /* skip malformed line */ }
  }
  return { text: chunks.join(''), error: lastError };
}

function dispatchOpencode(promptFile, model, variant, cwd, opts = {}) {
  const timeout = opts.timeout_ms || DEFAULT_TIMEOUT_MS;
  if (opts.mock) {
    return {
      ok: true, stdout: `MOCK cli-opencode ${model} dispatch — variant=${path.basename(promptFile, '.md')}`,
      stderr: '', attempts: 1, mock: true,
    };
  }
  const promptText = fs.readFileSync(promptFile, 'utf8');
  const args = [
    'run',
    '--model', model,
    '--format', 'json',
    '--dir', cwd,
  ];
  if (variant) args.push('--variant', variant);
  args.push(promptText);

  const t0 = Date.now();
  const res = spawnSync(OPENCODE_BIN, args, {
    cwd, timeout, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    input: '',  // close stdin so opencode doesn't hang waiting on it
  });
  const { text, error } = parseOpencodeJsonStream(res.stdout || '');
  return {
    ok: res.status === 0 && !error && text.length > 0,
    exit_code: res.status,
    stdout: text,  // final assistant text only (so downstream score-variant.cjs reads cleanly)
    stderr: (res.stderr || '') + (error ? '\n[stream error] ' + error : ''),
    attempts: 1,
    elapsed_ms: Date.now() - t0,
  };
}

function dispatchByModel(promptFile, model, cwd, opts = {}) {
  const route = DISPATCH_ROUTE[model];
  if (!route) {
    return { ok: false, stdout: '', stderr: `no dispatch route for model: ${model}`, attempts: 0, elapsed_ms: 0 };
  }
  if (route.surface === 'cli-opencode') {
    return dispatchOpencode(promptFile, route.model, route.variant, cwd, opts);
  }
  return dispatchDevin(promptFile, route.model, cwd, opts);
}

async function runOne(variantFile, fixturePath, model, opts) {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const variantId = path.basename(variantFile, '.md');
  const variantText = fs.readFileSync(variantFile, 'utf8');
  const variantHash = sha256Hex(variantText + '\x00' + fixturePath + '\x00' + model).slice(0, 16);

  const rendered = renderVariant.renderVariant({ variant_template_path: variantFile, fixture });

  const modelDir = path.join(DISPATCH_DIR, model.replace(/[/.]/g, '_'), variantId);
  fs.mkdirSync(modelDir, { recursive: true });
  const promptFile = path.join(modelDir, `prompt-${fixture.id}.md`);
  fs.writeFileSync(promptFile, rendered.body);

  const dispatchResult = dispatchByModel(promptFile, model, EVAL_PACKET, opts);
  const outputFile = path.join(modelDir, `output-${fixture.id}.md`);
  fs.writeFileSync(outputFile, dispatchResult.stdout || '');

  if (!dispatchResult.ok) {
    return {
      model, variantId, fixtureId: fixture.id,
      ok: false,
      error: dispatchResult.stderr || ('exit=' + dispatchResult.exit_code),
      elapsed_ms: dispatchResult.elapsed_ms,
    };
  }

  try {
    const scored = await scoreVariantFixture({
      variantId,
      variantHash,
      fixturePath,
      swe16OutputText: dispatchResult.stdout,
      rubricVersion: 'v1.0.0',
      mode: opts.mock ? 'mock' : 'real',
      mockMode: opts.mock ? 'high-confidence' : undefined,
    });
    return {
      model, variantId, fixtureId: fixture.id,
      ok: true,
      weightedScore: scored.weightedScore,
      hard_gate_failed: scored.hard_gate_failed,
      elapsed_ms: dispatchResult.elapsed_ms,
      details: {
        d1: scored.deterministic.acceptance.score,
        d2: scored.deterministic.bundleGate.score,
        d3: scored.deterministic.cwdCheck.score,
        d4: scored.grader.score,
        d5: scored.deterministic.preplanning.score,
      },
    };
  } catch (err) {
    return {
      model, variantId, fixtureId: fixture.id,
      ok: false,
      error: 'score failed: ' + err.message,
      elapsed_ms: dispatchResult.elapsed_ms,
    };
  }
}

function statsOf(scores) {
  const n = scores.length;
  if (!n) return { mean: 0, std: 0, min: 0, max: 0, n: 0 };
  const mean = scores.reduce((a, b) => a + b, 0) / n;
  const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return {
    mean,
    std: Math.sqrt(variance),
    min: Math.min(...scores),
    max: Math.max(...scores),
    n,
  };
}

function buildAnalysis(rows, models, variants, fixtures) {
  const EMPTY = { mean: 0, std: 0, min: 0, max: 0, n: 0 };
  const matrix = {};
  for (const m of models) {
    matrix[m] = {};
    for (const v of variants) {
      const fixtureScores = rows
        .filter((r) => r.model === m && r.variantId === v && r.ok)
        .map((r) => r.weightedScore);
      matrix[m][v] = statsOf(fixtureScores);
    }
  }
  const cell = (m, v) => (matrix[m] && matrix[m][v]) ? matrix[m][v] : EMPTY;

  const lines = [
    '# Cross-Model Validation Analysis',
    '',
    `**Generated**: ${new Date().toISOString()}`,
    `**Models tested**: ${models.join(', ')}`,
    `**Variants tested**: ${variants.length}`,
    `**Fixtures per model x variant**: ${fixtures.length}`,
    `**Total dispatches**: ${models.length * variants.length * fixtures.length}`,
    '',
    '## Per-model x per-variant aggregate scores',
    '',
    '| Variant | SWE-1.6 baseline | ' + models.join(' | ') + ' |',
    '|---------|------------------|' + models.map(() => '------').join('|') + '|',
  ];
  for (const v of variants) {
    const baseline = SWE16_BASELINE[v] !== undefined ? SWE16_BASELINE[v].toFixed(4) : '—';
    const cells = models.map((m) => cell(m, v).n ? cell(m, v).mean.toFixed(4) + ' (n=' + cell(m, v).n + ')' : '—');
    lines.push(`| ${v} | ${baseline} | ${cells.join(' | ')} |`);
  }
  lines.push('');

  // Decision gates
  lines.push('## Decision gates — does each SWE-1.6 finding hold cross-model?');
  lines.push('');

  // Bundle-gate-aversion: v-004-rcaf-medium (standard bundle-gate) should beat v-005-build-strict-bundle-gate
  lines.push('### Gate 1: Bundle-gate-aversion (standard > strict)');
  lines.push('');
  lines.push('SWE-1.6 finding: v-004-rcaf-medium (0.5664) > v-005-build-strict-bundle-gate (0.5610). The standard-bundle-gate variant outscored the strict-bundle-gate variant.');
  lines.push('');
  lines.push('| Model | v-004 mean | v-005 mean | Δ (v-004 − v-005) | Hold? |');
  lines.push('|-------|-----------|-----------|---------------------|-------|');
  for (const m of models) {
    const v4 = cell(m, 'v-004-rcaf-medium');
    const v5 = cell(m, 'v-005-build-strict-bundle-gate');
    if (!v4.n || !v5.n) {
      lines.push(`| ${m} | — | — | — | INCONCLUSIVE (missing data) |`);
      continue;
    }
    const delta = v4.mean - v5.mean;
    const holds = delta > 0;
    lines.push(`| ${m} | ${v4.mean.toFixed(4)} | ${v5.mean.toFixed(4)} | ${delta >= 0 ? '+' : ''}${delta.toFixed(4)} | ${holds ? 'YES' : 'NO'} |`);
  }
  lines.push('');

  // Framework-dominates-anti-hallucination: v-004-rcaf-medium (no special anti-hallucination) should beat v-003-anti-hallucination-strong
  lines.push('### Gate 2: Framework-dominates-anti-hallucination (RCAF without > STAR with)');
  lines.push('');
  lines.push('SWE-1.6 finding: v-004-rcaf-medium (0.5664) > v-003-anti-hallucination-strong (0.5164). RCAF beats STAR + aggressive anti-hallucination wording by 0.05.');
  lines.push('');
  lines.push('| Model | v-004 mean | v-003 mean | Δ (v-004 − v-003) | Hold? |');
  lines.push('|-------|-----------|-----------|---------------------|-------|');
  for (const m of models) {
    const v4 = cell(m, 'v-004-rcaf-medium');
    const v3 = cell(m, 'v-003-anti-hallucination-strong');
    if (!v4.n || !v3.n) {
      lines.push(`| ${m} | — | — | — | INCONCLUSIVE (missing data) |`);
      continue;
    }
    const delta = v4.mean - v3.mean;
    const holds = delta > 0;
    lines.push(`| ${m} | ${v4.mean.toFixed(4)} | ${v3.mean.toFixed(4)} | ${delta >= 0 ? '+' : ''}${delta.toFixed(4)} | ${holds ? 'YES' : 'NO'} |`);
  }
  lines.push('');

  // Overall winner per model
  lines.push('## Best variant per model');
  lines.push('');
  lines.push('| Model | Best variant | Score |');
  lines.push('|-------|--------------|-------|');
  for (const m of models) {
    let best = null;
    let bestScore = -Infinity;
    for (const v of variants) {
      const c = cell(m, v);
      if (c.n && c.mean > bestScore) {
        bestScore = c.mean;
        best = v;
      }
    }
    lines.push(`| ${m} | ${best || '—'} | ${bestScore > -Infinity ? bestScore.toFixed(4) : '—'} |`);
  }
  lines.push('');

  // Verdict
  lines.push('## Verdict + cross-CLI propagation recommendation');
  lines.push('');
  const gate1Models = models.filter((m) => cell(m, 'v-004-rcaf-medium').n && cell(m, 'v-005-build-strict-bundle-gate').n);
  const gate1Holds = gate1Models.filter((m) => cell(m, 'v-004-rcaf-medium').mean > cell(m, 'v-005-build-strict-bundle-gate').mean);
  const gate2Models = models.filter((m) => cell(m, 'v-004-rcaf-medium').n && cell(m, 'v-003-anti-hallucination-strong').n);
  const gate2Holds = gate2Models.filter((m) => cell(m, 'v-004-rcaf-medium').mean > cell(m, 'v-003-anti-hallucination-strong').mean);

  lines.push(`**Gate 1 (bundle-gate-aversion)**: ${gate1Holds.length}/${gate1Models.length} models confirm (${gate1Holds.join(', ') || 'none'}). `);
  lines.push(`**Gate 2 (framework-dominates-anti-hallucination)**: ${gate2Holds.length}/${gate2Models.length} models confirm (${gate2Holds.join(', ') || 'none'}).`);
  lines.push('');
  if (gate1Holds.length === gate1Models.length && gate1Models.length > 0) {
    lines.push('**Gate 1 verdict**: Bundle-gate-aversion holds on all tested models → propagate "standard-over-strict" guidance cross-CLI.');
  } else if (gate1Holds.length === 0) {
    lines.push('**Gate 1 verdict**: Bundle-gate-aversion does NOT hold cross-model → keep SWE-1.6-specific in cli-devin only.');
  } else {
    lines.push('**Gate 1 verdict**: Bundle-gate-aversion holds on some but not all → keep SWE-1.6-specific; document the split.');
  }
  if (gate2Holds.length === gate2Models.length && gate2Models.length > 0) {
    lines.push('**Gate 2 verdict**: Framework-dominates-anti-hallucination holds on all tested models → propagate "RCAF framework primary lever, anti-hallucination wording secondary" guidance cross-CLI.');
  } else if (gate2Holds.length === 0) {
    lines.push('**Gate 2 verdict**: Framework-dominates-anti-hallucination does NOT hold cross-model → keep SWE-1.6-specific in cli-devin only.');
  } else {
    lines.push('**Gate 2 verdict**: Mixed result → keep SWE-1.6-specific; document the split.');
  }
  lines.push('');

  // Per-model surface caveat
  lines.push('## Surface caveats');
  lines.push('');
  lines.push('- `deepseek-v4-pro` is dispatched via cli-opencode 1.14.51 + DeepSeek direct API (`opencode run --model deepseek/deepseek-v4-pro --variant high`). This matches ADR-001 byte-for-byte after the cli-opencode 1.15.x downgrade.');
  lines.push('- `kimi-k2.6` is dispatched via cli-devin\'s `--model kimi-k2.6` preset (ADR-003 split-surface decision: opencode-go account ran out of credits mid-packet, so the originally-planned `opencode-go/kimi-k2.6` route was unreachable; cli-devin\'s preset is a working surface). The two routes differ on the gateway layer, not on the Kimi model itself.');
  lines.push('- Grader: claude-sonnet-4-5 (matches 113/003 baseline). Grader cache shared with prior runs via sha256(swe16_output_text) key, so re-dispatches of identical outputs incur no grader cost.');
  lines.push('- Per-fixture seed snapshot/restore is active via 113/003/score-variant.cjs `snapshotDir`+`restoreFromSnapshot` helpers when `EVAL_LOOP_EXTRACT=true`.');

  return lines.join('\n') + '\n';
}

async function main() {
  const args = parseArgs();
  const fixtures = listFixtures(args.fixtures);
  const variantFiles = args.variants.map(loadVariant);
  process.stderr.write(`Cross-model: models=${args.models.length} variants=${args.variants.length} fixtures=${fixtures.length} total=${args.models.length * args.variants.length * fixtures.length} mock=${args.mock}\n`);

  fs.mkdirSync(path.join(PACKET_ROOT, 'state'), { recursive: true });
  if (!args.append) {
    fs.writeFileSync(RESULTS_JSONL, '');
  } else {
    process.stderr.write(`Append mode: keeping existing rows in ${RESULTS_JSONL}\n`);
  }

  if (!process.env.EVAL_LOOP_EXTRACT) process.env.EVAL_LOOP_EXTRACT = 'true';

  // Seed rows from existing JSONL when in append mode (so buildAnalysis sees the full picture)
  const rows = args.append && fs.existsSync(RESULTS_JSONL)
    ? fs.readFileSync(RESULTS_JSONL, 'utf8').split('\n').filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean)
    : [];
  let dispatchCount = 0;
  const totalDispatches = args.models.length * variantFiles.length * fixtures.length;
  for (const model of args.models) {
    for (let vi = 0; vi < variantFiles.length; vi++) {
      const variantFile = variantFiles[vi];
      const variantId = args.variants[vi];
      for (const fixturePath of fixtures) {
        dispatchCount++;
        const result = await runOne(variantFile, fixturePath, model, { mock: args.mock });
        rows.push(result);
        fs.appendFileSync(RESULTS_JSONL, JSON.stringify(result) + '\n');
        process.stderr.write(`[${dispatchCount}/${totalDispatches}] ${model} | ${variantId} | ${result.fixtureId}: ${result.ok ? result.weightedScore.toFixed(4) : 'FAIL ' + result.error}\n`);
      }
    }
  }

  const analysis = buildAnalysis(rows, args.models, args.variants, fixtures);
  fs.writeFileSync(ANALYSIS_OUT, analysis);

  const okCount = rows.filter((r) => r.ok).length;
  process.stderr.write(`\nCross-model run complete: ${okCount}/${rows.length} ok\n`);
  process.stderr.write(`Results: ${RESULTS_JSONL}\n`);
  process.stderr.write(`Analysis: ${ANALYSIS_OUT}\n`);
}

if (require.main === module) main().catch((err) => { process.stderr.write(err.stack); process.exit(1); });

module.exports = { dispatchDevin, statsOf, buildAnalysis, SWE16_BASELINE };
