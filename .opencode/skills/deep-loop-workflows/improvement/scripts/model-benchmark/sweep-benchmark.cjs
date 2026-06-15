#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ sweep-benchmark — config-driven benchmark matrix expander and scorer     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Matrix expander for the config-driven model-benchmark framework. It turns ONE
// profile into a cartesian sweep of cells and scores each cell, with NO
// mode-specific branches: the runner always does expand matrix -> render prompt
// -> dispatch -> score row -> emit. `mode` only sets sensible defaults; the swept
// axis is pure config. This is what makes framework-bakeoff and model-vs-model
// the SAME code path differing only in which axis carries more than one value.
//
// Axes: models[] x variants[] x frameworks[] x fixtures x samples. Any axis that
// is absent collapses to a singleton, so the product expression is uniform.
//
// Dispatch goes through the universal dispatch-model.cjs (read-only by default).
// In --mock the dispatcher's canned output is used, OR opts.mockResponder(cell)
// injects per-cell output so a test can drive saturation/regression scenarios
// without any real CLI call. Dependency-free (Node stdlib only).

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');

const renderer = require('./lib/framework-renderer.cjs');
const { validateProfile } = require('./lib/profile-validator.cjs');
const { scoreCodeTask } = require('./lib/code-task-scorer.cjs');
const { report } = require('./lib/sweep-reporter.cjs');
const dispatcher = require('./dispatch-model.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPTS_ROOT = __dirname;
// Canonical framework definitions live in sk-prompt; benchmark consumes them.
// From scripts/model-benchmark/, sk-prompt is five levels up to the skills root.
const DEFAULT_REGISTRY_PATH = path.resolve(
  SCRIPTS_ROOT,
  '..', '..', '..',
  'sk-prompt', 'assets', 'framework-registry.json',
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Fixture loading. Profiles reference fixtures by their internal `id`, which is
// NOT guaranteed to match the filename (e.g. t3-bugfix-in-context.json carries
// id "t3-lower-bound"). So the loader scans the fixtureDir once, parses every
// JSON, and indexes by the parsed `id` — filename is only a fallback key.
// ---------------------------------------------------------------------------

function resolveFixtureDir(profile, opts) {
  const raw =
    (opts && opts.fixtureDir) ||
    profile.fixtureDir ||
    (profile.benchmark && profile.benchmark.fixtureDir);
  if (!raw) throw new Error('sweep: profile is missing fixtureDir');
  if (path.isAbsolute(raw)) return raw;
  const root = (opts && opts.repoRoot) || process.cwd();
  return path.resolve(root, raw);
}

/**
 * Scan a fixture directory and index every JSON fixture by parsed id and by filename stem.
 *
 * @param {string} fixtureDir - Absolute path to the directory of fixture JSON files.
 * @returns {{byId: Map, byFile: Map}} Maps keyed by fixture id and by filename stem.
 */
function loadFixtureIndex(fixtureDir) {
  let entries;
  try {
    entries = fs.readdirSync(fixtureDir);
  } catch (e) {
    throw new Error('sweep: cannot read fixtureDir ' + fixtureDir + ': ' + (e.message || e));
  }
  const byId = new Map();
  const byFile = new Map();
  for (const name of entries) {
    if (!name.endsWith('.json')) continue;
    const full = path.join(fixtureDir, name);
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (_) {
      continue; // a non-fixture JSON in the dir is skipped, not fatal.
    }
    const stem = name.replace(/\.json$/, '');
    byFile.set(stem, parsed);
    if (parsed && typeof parsed.id === 'string') byId.set(parsed.id, parsed);
  }
  return { byId, byFile };
}

/**
 * Resolve a profile's requested fixtures against the index by id then filename.
 *
 * @param {Object} profile - The benchmark profile selecting fixtures.
 * @param {{byId: Map, byFile: Map}} index - The fixture index from loadFixtureIndex.
 * @returns {Array<Object>} The resolved fixture objects in request order.
 */
function selectFixtures(profile, index) {
  const sel = profile.fixtureSelection || {};
  const requested =
    (Array.isArray(sel.include) && sel.include.length ? sel.include : null) ||
    (Array.isArray(profile.fixtures) ? profile.fixtures : []);
  if (!requested.length) {
    throw new Error('sweep: profile selects no fixtures (set fixtures[] or fixtureSelection.include[])');
  }
  const resolved = [];
  const missing = [];
  for (const key of requested) {
    const fx = index.byId.get(key) || index.byFile.get(key);
    if (fx) resolved.push(fx);
    else missing.push(key);
  }
  if (missing.length) {
    throw new Error('sweep: fixtures not found by id or filename: ' + missing.join(', '));
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// Matrix expansion. Each axis is normalized to a non-empty list; an absent axis
// becomes a singleton so the product is uniform. NO branch on profile.mode.
// ---------------------------------------------------------------------------

/**
 * Normalize the models axis to a non-empty list, collapsing an absent axis to one default cell.
 *
 * @param {Object} profile - The benchmark profile.
 * @returns {Array<Object>} The models list, or a single empty-object slot when none are defined.
 */
function axisModels(profile) {
  const ms = Array.isArray(profile.models) ? profile.models : [];
  // A profile with no models still runs one cell against the dispatcher default.
  return ms.length ? ms : [{}];
}

/**
 * Normalize the variants axis to a non-empty list, using a single null slot when absent.
 *
 * @param {Object} profile - The benchmark profile.
 * @returns {Array} The variants list, or [null] to defer to each model entry's own variant.
 */
function axisVariants(profile) {
  // Top-level variants[] is the explicit sweep axis (e.g. reasoning ablation).
  // When absent, a single null slot means "use the model entry's own variant".
  const vs = Array.isArray(profile.variants) ? profile.variants : [];
  return vs.length ? vs : [null];
}

/**
 * Normalize the frameworks axis to a non-empty list, using a single null slot when absent.
 *
 * @param {Object} profile - The benchmark profile.
 * @returns {Array} The frameworks list, or [null] to dispatch the bare fixture task.
 */
function axisFrameworks(profile) {
  const fws = Array.isArray(profile.frameworks) ? profile.frameworks : [];
  // No framework axis means the fixture task is dispatched without framework
  // wrapping; a single null slot keeps the product uniform.
  return fws.length ? fws : [null];
}

/**
 * Resolve the per-cell sample count, preferring an opts override over the profile setting.
 *
 * @param {Object} profile - The benchmark profile (sampling.samplesPerCell).
 * @param {Object} opts - Options; opts.samplesPerCell overrides when a positive integer.
 * @returns {number} The number of samples per cell (defaults to 1).
 */
function sampleCount(profile, opts) {
  if (opts && Number.isInteger(opts.samplesPerCell) && opts.samplesPerCell > 0) {
    return opts.samplesPerCell;
  }
  const s = profile.sampling && profile.sampling.samplesPerCell;
  return Number.isInteger(s) && s > 0 ? s : 1;
}

// Build the flat list of cells (one per model x variant x framework x fixture).
// Samples are expanded later so a cell keeps a stable identity across its runs.
/**
 * Expand the model x variant x framework x fixture axes into a flat list of cells.
 *
 * @param {Object} profile - The benchmark profile defining the sweep axes.
 * @param {Array<Object>} fixtures - The resolved fixtures to sweep across.
 * @returns {Array<Object>} The flat list of cell descriptors, one per axis combination.
 */
function expandCells(profile, fixtures) {
  const models = axisModels(profile);
  const variants = axisVariants(profile);
  const frameworks = axisFrameworks(profile);

  const cells = [];
  for (const model of models) {
    for (const variant of variants) {
      for (const framework of frameworks) {
        for (const fixture of fixtures) {
          // Effective variant: the explicit sweep axis wins; otherwise the
          // model entry's own variant; otherwise none.
          const effectiveVariant =
            variant != null ? variant : (model && model.variant != null ? model.variant : null);
          const executor = (model && model.executor) || null;
          const modelSlug =
            (model && (model.model_slug || model.model)) || null;
          // cli dispatch wants provider/model_slug joined as the model id when a
          // provider prefix is present (e.g. minimax-coding-plan/MiniMax-M2.7).
          const modelId =
            model && model.provider && modelSlug
              ? model.provider + '/' + modelSlug
              : modelSlug;
          cells.push({
            cellId: [
              executor || 'default',
              modelSlug || 'default',
              effectiveVariant || 'default',
              framework || 'none',
              fixture.id || 'fixture',
            ].join('::'),
            model: modelSlug,
            modelId,
            provider: (model && model.provider) || null,
            executor,
            variant: effectiveVariant,
            framework,
            fixture,
          });
        }
      }
    }
  }
  return cells;
}

// ---------------------------------------------------------------------------
// Per-cell dispatch + score.
// ---------------------------------------------------------------------------

// Build the prompt for a cell. With a framework, render it through the registry
// slot interpolator; without one, fall back to the fixture's bare task text.
/**
 * Build the dispatch prompt for a cell from its framework or bare fixture task.
 *
 * @param {Object} cell - The cell descriptor (framework, fixture).
 * @param {Object} registry - The loaded framework registry for slot interpolation.
 * @returns {string} The rendered prompt text to dispatch.
 */
function buildPrompt(cell, registry) {
  if (!cell.framework) {
    const task = cell.fixture && cell.fixture.task;
    if (typeof task !== 'string' || !task.trim()) {
      throw new Error('sweep: cell ' + cell.cellId + ' has no framework and no fixture.task to dispatch');
    }
    return task;
  }
  const def = renderer.getFramework(registry, cell.framework);
  if (!def) {
    throw new Error('sweep: framework "' + cell.framework + '" not found in registry');
  }
  return renderer.renderFramework(def, cell.fixture);
}

// Dispatch one rendered prompt. In mock mode with a responder, the responder's
// text is the assistant output (NO dispatcher call) so tests inject per-cell
// output deterministically. In mock mode without a responder, the dispatcher's
// canned mock output is used. Otherwise a real (read-only) dispatch runs.
function dispatchCell(cell, promptText, opts) {
  const t0 = Date.now();

  if (opts.mock && typeof opts.mockResponder === 'function') {
    const text = String(opts.mockResponder(cell) || '');
    return {
      assistantText: text,
      dispatch_ok: text.trim().length > 0,
      exit_code: 0,
      latency_ms: Date.now() - t0,
      attempts: 1,
      mock: true,
    };
  }

  // Materialize the prompt to a per-cell temp dir: every executor in
  // dispatch-model.cjs reads its prompt from a file path, and the dispatch runs
  // with that throwaway dir as its cwd so an agentic model's stray writes land
  // there (and are discarded), never polluting the repo. The dir is removed in
  // the finally so each cell is fully isolated and leaves nothing behind.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sweep-cell-'));
  const promptFile = path.join(dir, 'prompt.txt');
  fs.writeFileSync(promptFile, promptText, 'utf8');
  // Test-only injection seam: opts._dispatch stands in for the CLI dispatcher so
  // tests can capture cwd/prompt-file behavior without spawning a real executor.
  // Production callers never set it, so the universal dispatcher is used.
  const dispatchFn = typeof opts._dispatch === 'function' ? opts._dispatch : dispatcher.dispatch;

  try {
    const res = dispatchFn({
      prompt_file: promptFile,
      executor: cell.executor || undefined,
      model: cell.modelId || undefined,
      variant: cell.variant || undefined,
      timeout_ms: opts.timeout_ms,
      mock: !!opts.mock,
      mock_mode: opts.mock_mode,
      state_dir: opts.state_dir,
      cwd: dir,
    });

    // The dispatcher returns concatenated stdout. For a real cli-opencode run that
    // is a JSONL event stream; pull the assistant text out of it. Mock output and
    // plain-text executors return the assistant text directly on stdout.
    const stdout = res.stdout || '';
    const assistantText = res.mock ? stdout : extractAssistantText(stdout) || stdout;

    return {
      assistantText,
      dispatch_ok: !!res.ok && assistantText.trim().length > 0,
      exit_code: typeof res.exit_code === 'number' ? res.exit_code : -1,
      latency_ms: Date.now() - t0,
      attempts: res.attempts || 0,
      paused: res.paused || false,
      pause_reason: res.pause_reason || null,
      mock: !!res.mock,
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Pull the concatenated assistant text out of a cli-opencode JSONL event stream.
// Falls back to returning the raw string when it is not an event stream (so a
// plain-text executor's stdout passes through unchanged).
/**
 * Parse assistant text using the dispatcher's shared OpenCode stream parser.
 *
 * @param {string} stdout - The raw dispatch stdout, possibly a JSONL event stream.
 * @returns {?string} The ordered assistant text, or null when stdout is not an event stream.
 */
function parseAssistantTextFromStream(stdout) {
  const parsed = dispatcher.parseOpencodeStream(stdout);
  return parsed.usage_parser_status === 'error' ? null : parsed.output;
}

/**
 * Extract concatenated assistant text from a cli-opencode JSONL event stream.
 *
 * @param {string} stdout - The raw dispatch stdout, possibly a JSONL event stream.
 * @returns {?string} The ordered assistant text, or null when stdout is not an event stream.
 */
function extractAssistantText(stdout) {
  return parseAssistantTextFromStream(stdout);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// The sweep.
// ---------------------------------------------------------------------------

function resolveOutDir(profile, opts) {
  if (opts && opts.outDir) return opts.outDir;
  const od = profile.outputsDir;
  // A `{spec_folder}` placeholder is only resolvable by the caller; if it is
  // still present, fall back to a temp dir rather than writing a literal path.
  if (typeof od === 'string' && od && !od.includes('{')) return od;
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sweep-out-'));
}

// Run the full sweep for a profile. opts:
//   mock          : route every dispatch through mock output (no real CLI)
//   mockResponder : (cell) => string, per-cell mock assistant text
//   samplesPerCell: override the profile's sampling.samplesPerCell
//   registryPath  : override the framework registry location
//   fixtureDir    : override the fixture directory
//   repoRoot      : base for resolving a relative fixtureDir
//   outDir        : where results.json is written
//   writeResults  : set false to skip the results.json write (default true)
//   report        : set false to skip the aggregate.json + synthesis.md report
//                   (default true); the report writes alongside results.json
//                   only when an outDir is actually resolved
/**
 * Run the full benchmark sweep for a profile: expand cells, dispatch, score, and report.
 *
 * @param {Object} profile - The validated benchmark profile to sweep.
 * @param {Object} opts - Sweep options (mock, mockResponder, samplesPerCell, registryPath, outDir, report, etc.).
 * @returns {Object} The sweep result (profile, rows, meta, and aggregate/synthesis when reporting).
 */
function runSweep(profile, opts) {
  const options = opts || {};

  const verdict = validateProfile(profile);
  if (!verdict.valid) {
    throw new Error('sweep: invalid profile: ' + verdict.errors.join('; '));
  }

  const registryPath = options.registryPath || DEFAULT_REGISTRY_PATH;
  const registry = renderer.loadRegistry(registryPath);

  const fixtureDir = resolveFixtureDir(profile, options);
  const fixtureIndex = loadFixtureIndex(fixtureDir);
  const fixtures = selectFixtures(profile, fixtureIndex);

  const cells = expandCells(profile, fixtures);
  const samples = sampleCount(profile, options);

  const rows = [];
  for (const cell of cells) {
    const prompt = buildPrompt(cell, registry);
    for (let sample = 0; sample < samples; sample++) {
      const d = dispatchCell(cell, prompt, options);
      let scores;
      if (d.dispatch_ok) {
        scores = scoreCodeTask(d.assistantText, cell.fixture, {
          timeoutMs: options.scoreTimeoutMs,
        });
      } else {
        // A failed dispatch cannot be scored — record nulls, never fabricate.
        scores = {
          correctness_pass_rate: null,
          assertions_passed: null,
          assertions_total: (
            (Array.isArray(cell.fixture.tests) ? cell.fixture.tests.length : 0) +
            (Array.isArray(cell.fixture.hidden_tests) ? cell.fixture.hidden_tests.length : 0)
          ),
          format_adherent: null,
          format_reason: 'dispatch_failed',
          output_words: 0,
          output_chars: 0,
          per_test: [],
          extracted: false,
          extract_reason: 'dispatch_failed',
        };
      }

      rows.push({
        cellId: cell.cellId,
        mode: profile.mode || null,
        model: cell.model,
        executor: cell.executor,
        variant: cell.variant,
        framework: cell.framework,
        fixture: cell.fixture.id || null,
        sample,
        correctness_pass_rate: scores.correctness_pass_rate,
        assertions_passed: scores.assertions_passed,
        assertions_total: scores.assertions_total,
        format_adherent: scores.format_adherent,
        format_reason: scores.format_reason,
        output_words: scores.output_words,
        output_chars: scores.output_chars,
        extracted: scores.extracted,
        extract_reason: scores.extract_reason,
        per_test: scores.per_test,
        dispatch_ok: d.dispatch_ok,
        exit_code: d.exit_code,
        latency_ms: d.latency_ms,
        // Nullable usage fields: providers that do not expose token/cost report
        // null rather than a fabricated number, avoiding schema churn later.
        tokens_in: null,
        tokens_out: null,
        cost_usd: null,
      });
    }
  }

  const result = {
    profile: {
      id: profile.id || profile.profileId || null,
      mode: profile.mode || null,
      version: profile.version || null,
    },
    rows,
    meta: {
      axes: {
        models: axisModels(profile).length,
        variants: axisVariants(profile).length,
        frameworks: axisFrameworks(profile).length,
        fixtures: fixtures.length,
        samples,
      },
      cellCount: cells.length,
      sampleCount: rows.length,
      mock: !!options.mock,
      generated_at: new Date().toISOString(),
    },
  };

  const wantResults = options.writeResults !== false;
  const wantReport = options.report !== false;

  // Resolve a single output directory shared by results.json and the report, but
  // only materialize one when there is actually something to write — so a
  // results-and-report-disabled in-memory run never spills a temp dir.
  let outDir = null;
  if (wantResults || wantReport) {
    if (options.outDir) {
      outDir = options.outDir;
    } else if (wantResults) {
      // Legacy behavior: a results write with no explicit outDir falls back to
      // the profile's outputsDir or a temp dir, unchanged.
      outDir = resolveOutDir(profile, options);
    }
    // When only the report is wanted and no outDir is given, stay in memory:
    // the aggregate is still attached to the returned result below.
  }

  if (wantResults && outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'results.json');
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
    result.meta.resultsPath = outPath;
  }

  // The reporter is the saturation-mis-read fix: it always runs (unless opted
  // out) so the returned result carries the gated aggregate + trust verdict, and
  // writes aggregate.json + synthesis.md next to results.json when an outDir
  // exists. Grouping/gate config comes from the profile itself.
  if (wantReport) {
    const reported = report(result, {
      profile,
      outDir: outDir || undefined,
      minSamplesForWinner: options.minSamplesForWinner,
      write: !!outDir,
    });
    result.aggregate = reported.aggregate;
    result.synthesisMarkdown = reported.synthesisMarkdown;
    if (outDir) {
      result.meta.aggregatePath = path.join(outDir, 'aggregate.json');
      result.meta.synthesisPath = path.join(outDir, 'synthesis.md');
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// CLI entry.
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { mock: false, report: true };
  for (let i = 0; i < argv.length; i++) {
    const entry = argv[i];
    if (entry === '--mock') args.mock = true;
    else if (entry === '--report') args.report = true;
    else if (entry === '--no-report') args.report = false;
    else if (entry === '--profile') args.profile = argv[++i];
    else if (entry.startsWith('--profile=')) args.profile = entry.slice('--profile='.length);
    else if (entry === '--out-dir') args.outDir = argv[++i];
    else if (entry.startsWith('--out-dir=')) args.outDir = entry.slice('--out-dir='.length);
    else if (entry === '--mock-mode') args.mock_mode = argv[++i];
    else if (entry.startsWith('--mock-mode=')) args.mock_mode = entry.slice('--mock-mode='.length);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.profile) {
    process.stderr.write('usage: sweep-benchmark.cjs --profile <path> [--mock] [--mock-mode=<m>] [--out-dir <dir>] [--no-report]\n');
    process.exit(2);
  }
  let profile;
  try {
    profile = JSON.parse(fs.readFileSync(args.profile, 'utf8'));
  } catch (e) {
    process.stderr.write('sweep: cannot read profile ' + args.profile + ': ' + (e.message || e) + '\n');
    process.exit(2);
    return;
  }
  // A relative fixtureDir in the profile resolves against the repo root (git
  // toplevel), matching how the profiles author their paths.
  const repoRoot = gitRoot() || process.cwd();
  let result;
  try {
    result = runSweep(profile, {
      mock: args.mock,
      mock_mode: args.mock_mode,
      outDir: args.outDir,
      report: args.report,
      repoRoot,
    });
  } catch (e) {
    process.stderr.write('sweep failed: ' + (e.message || e) + '\n');
    process.exit(1);
    return;
  }
  process.stdout.write(
    JSON.stringify(
      {
        profile: result.profile,
        meta: result.meta,
        rowCount: result.rows.length,
        // Surface the trust verdict + saturation up front so a CLI reader sees
        // whether the run is trustworthy before reading any leaderboard file.
        verdict: result.aggregate ? result.aggregate.verdict : null,
        correctness_saturated: result.aggregate
          ? result.aggregate.correctness_saturated
          : null,
        ranking_key: result.aggregate ? result.aggregate.ranking_key : null,
      },
      null,
      2,
    ) + '\n',
  );
  process.exit(0);
}

function gitRoot() {
  try {
    return require('child_process')
      .execSync('git rev-parse --show-toplevel', { encoding: 'utf8' })
      .trim();
  } catch (_) {
    return null;
  }
}

if (require.main === module) main();

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  runSweep,
  expandCells,
  loadFixtureIndex,
  selectFixtures,
  buildPrompt,
  axisModels,
  axisVariants,
  axisFrameworks,
  sampleCount,
  extractAssistantText,
  parseAssistantTextFromStream,
};
