#!/usr/bin/env node
// MiMo-V2.5-Pro prompt-framework bake-off harness.
//
// For each (framework x fixture) combo it dispatches the framework-wrapped
// coding task to the model via the OpenCode CLI, extracts the returned JS
// function, runs a hidden assertion suite in isolated child processes, and
// scores: assertion_pass_rate (primary), format_adherence (returned only code?),
// and output length (char + word proxy; lower is a tiebreak — MiMo is
// token-efficient). Raw responses are saved under runs/. Real dispatches only —
// failures record exit code + stderr, never fabricated scores.
//
// Usage:
//   node run-mimo-bench.cjs                 # all combos, pro model
//   node run-mimo-bench.cjs --model opencode/mimo-v2.5-free   # cheap smoke
//   node run-mimo-bench.cjs --frameworks rcaf,tidd-ec         # subset
//   node run-mimo-bench.cjs --fixtures chunk                  # subset
//   node run-mimo-bench.cjs --timeout 120                     # per-dispatch secs
//   node run-mimo-bench.cjs --repeat 2 --frameworks rcaf      # re-run top-2

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const { fixtures } = require('./fixtures.cjs');
const { frameworks } = require('./frameworks.cjs');
const { extractFunction, detectFormatAdherence } = require('./extract.cjs');
const { runSuite } = require('./runtests.cjs');

const ROOT = __dirname;
const RUNS_DIR = path.join(ROOT, 'runs');
const DEFAULT_MODEL = 'xiaomi-token-plan-ams/mimo-v2.5-pro';

function parseArgs(argv) {
  const a = { model: DEFAULT_MODEL, timeout: 120, repeat: 1, frameworks: null, fixtures: null, variant: null, out: 'results.json' };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--model') a.model = argv[++i];
    else if (k === '--timeout') a.timeout = parseInt(argv[++i], 10);
    else if (k === '--repeat') a.repeat = parseInt(argv[++i], 10);
    else if (k === '--frameworks') a.frameworks = argv[++i].split(',').map((s) => s.trim());
    else if (k === '--fixtures') a.fixtures = argv[++i].split(',').map((s) => s.trim());
    else if (k === '--variant') a.variant = argv[++i];
    else if (k === '--out') a.out = argv[++i];
  }
  return a;
}

// Pull the concatenated assistant text out of the CLI's JSONL event stream.
function extractAssistantText(stdout) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const parts = [];
  for (const line of lines) {
    let ev;
    try {
      ev = JSON.parse(line);
    } catch {
      continue;
    }
    if (ev && ev.type === 'text' && ev.part && typeof ev.part.text === 'string') {
      parts.push({ text: ev.part.text, start: (ev.part.time && ev.part.time.start) || 0 });
    }
  }
  parts.sort((x, y) => x.start - y.start);
  return parts.map((p) => p.text).join('');
}

// One real dispatch. Returns { exit, stdout, stderr, ms }.
// variant selects the model reasoning effort (e.g. 'high'); omitted = model default.
function dispatch(model, prompt, workdir, timeoutSec, variant) {
  const t0 = Date.now();
  // gtimeout guards a hung CLI; </dev/null closes stdin; JSON event stream on stdout.
  const res = spawnSync(
    'gtimeout',
    [
      String(timeoutSec),
      'opencode',
      'run',
      '--model',
      model,
      ...(variant ? ['--variant', variant] : []),
      '--format',
      'json',
      '--dir',
      workdir,
      prompt,
    ],
    { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  return {
    exit: res.status === null ? (res.signal ? 'signal:' + res.signal : 'null') : res.status,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    ms: Date.now() - t0,
  };
}

function wordCount(s) {
  const m = (s || '').trim().match(/\S+/g);
  return m ? m.length : 0;
}

function nowIso() {
  return new Date().toISOString();
}

function main() {
  const args = parseArgs(process.argv);
  // Resolve the results file relative to this dir so each run can target a distinct file.
  const outPath = path.isAbsolute(args.out) ? args.out : path.join(ROOT, args.out);
  fs.mkdirSync(RUNS_DIR, { recursive: true });

  let fwSet = frameworks;
  if (args.frameworks) fwSet = frameworks.filter((f) => args.frameworks.includes(f.id));
  let fxSet = fixtures;
  if (args.fixtures) fxSet = fixtures.filter((f) => args.fixtures.includes(f.id));

  const combos = [];
  for (const fw of fwSet) for (const fx of fxSet) for (let rep = 1; rep <= args.repeat; rep++) combos.push({ fw, fx, rep });

  console.log('MiMo prompt-framework bake-off');
  console.log('  model     :', args.model);
  console.log('  variant   :', args.variant || '(default)');
  console.log('  frameworks:', fwSet.map((f) => f.id).join(', '));
  console.log('  fixtures  :', fxSet.map((f) => f.id).join(', '));
  console.log('  combos    :', combos.length, '(repeat=' + args.repeat + ', per-dispatch timeout=' + args.timeout + 's)');
  console.log('');

  const results = [];
  let succeeded = 0;
  let failed = 0;

  for (const { fw, fx, rep } of combos) {
    const prompt = fw.render(fx);
    const tag = fw.id + '__' + fx.id + (args.repeat > 1 ? '__r' + rep : '');
    const workdir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'mimo-bench-' + tag + '-'));

    process.stdout.write('[dispatch] ' + tag + ' ... ');
    const d = dispatch(args.model, prompt, workdir, args.timeout, args.variant);
    const assistantText = extractAssistantText(d.stdout);

    // Persist raw response + prompt for reproducibility/audit.
    const rawPath = path.join(RUNS_DIR, tag + '.json');
    fs.writeFileSync(
      rawPath,
      JSON.stringify(
        {
          tag,
          framework: fw.id,
          framework_name: fw.name,
          fixture: fx.id,
          repeat: rep,
          model: args.model,
          variant: args.variant,
          dispatched_at: nowIso(),
          exit: d.exit,
          ms: d.ms,
          prompt,
          assistant_text: assistantText,
          stderr: d.stderr.slice(0, 2000),
        },
        null,
        2
      )
    );

    const dispatchOk = d.exit === 0 && assistantText.trim().length > 0;
    let entry;
    if (!dispatchOk) {
      failed++;
      entry = {
        tag,
        framework: fw.id,
        framework_name: fw.name,
        fixture: fx.id,
        repeat: rep,
        dispatch_ok: false,
        exit: d.exit,
        stderr: d.stderr.slice(0, 500),
        assertion_pass_rate: null,
        format_adherent: null,
        output_chars: assistantText.length,
        output_words: wordCount(assistantText),
        ms: d.ms,
        raw: path.relative(ROOT, rawPath),
      };
      console.log('FAIL (exit ' + d.exit + ')');
    } else {
      succeeded++;
      const ex = extractFunction(assistantText, fx.fn_name);
      let suite = { pass_rate: 0, passed: 0, total: fx.tests.length, per_test: [] };
      if (ex.ok) suite = runSuite(ex.source, fx.fn_name, fx.tests);
      const fmt = detectFormatAdherence(assistantText, fx.fn_name);
      entry = {
        tag,
        framework: fw.id,
        framework_name: fw.name,
        fixture: fx.id,
        repeat: rep,
        dispatch_ok: true,
        exit: 0,
        extracted: ex.ok,
        extract_reason: ex.reason,
        assertion_pass_rate: suite.pass_rate,
        assertions_passed: suite.passed,
        assertions_total: suite.total,
        format_adherent: fmt.adherent,
        format_reason: fmt.reason,
        output_chars: assistantText.length,
        output_words: wordCount(assistantText),
        ms: d.ms,
        per_test: suite.per_test,
        raw: path.relative(ROOT, rawPath),
      };
      console.log(
        'ok  pass=' +
          (suite.pass_rate * 100).toFixed(0) +
          '%  fmt=' +
          (fmt.adherent ? 'Y' : 'N') +
          '  words=' +
          entry.output_words +
          '  ' +
          (d.ms / 1000).toFixed(1) +
          's'
      );
    }
    results.push(entry);
    // Write incrementally so a mid-run crash still leaves partial results.
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          generated_at: nowIso(),
          model: args.model,
          variant: args.variant,
          per_dispatch_timeout_sec: args.timeout,
          repeat: args.repeat,
          succeeded,
          failed,
          combos: combos.length,
          results,
        },
        null,
        2
      )
    );
  }

  console.log('');
  console.log('DONE. succeeded=' + succeeded + ' failed=' + failed + ' / ' + combos.length);
  console.log('results -> ' + path.relative(ROOT, outPath));

  // Console summary table by framework (mean over fixtures/repeats).
  const byFw = {};
  for (const r of results) {
    if (!byFw[r.framework]) byFw[r.framework] = { name: r.framework_name, pr: [], fmt: [], words: [], n: 0, ok: 0 };
    byFw[r.framework].n++;
    if (r.dispatch_ok) {
      byFw[r.framework].ok++;
      byFw[r.framework].pr.push(r.assertion_pass_rate);
      byFw[r.framework].fmt.push(r.format_adherent ? 1 : 0);
      byFw[r.framework].words.push(r.output_words);
    }
  }
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  console.log('\nframework        mean_pass  fmt_adher  avg_words  ok/n');
  const rows = Object.entries(byFw)
    .map(([id, v]) => ({ id, name: v.name, mp: mean(v.pr), mf: mean(v.fmt), mw: mean(v.words), ok: v.ok, n: v.n }))
    .sort((a, b) => b.mp - a.mp || a.mw - b.mw);
  for (const r of rows) {
    console.log(
      r.name.padEnd(16) +
        ' ' +
        (r.mp * 100).toFixed(1).padStart(7) +
        '%  ' +
        (r.mf * 100).toFixed(0).padStart(7) +
        '%  ' +
        r.mw.toFixed(0).padStart(8) +
        '  ' +
        r.ok +
        '/' +
        r.n
    );
  }
}

main();
