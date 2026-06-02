// The reporter is the direct fix for the saturation mis-read. It turns the raw
// per-cell sweep rows into a grouped aggregate plus a human synthesis, and it
// orders the synthesis so a trust verdict and a saturation status are stated
// BEFORE any leaderboard or "winner" wording. A reader can never see a ranked
// table without first seeing whether that ranking is trustworthy.
//
// Pipeline (no mode-specific branches):
//   group rows by reporting.groupBy
//     -> per-group n / correctness_mean / format_adherent_rate / words_median
//     -> correctness GATE (eligibility + ranking key; correctness never blended)
//     -> saturation auto-detect (every eligible group pinned at the top => the
//        correctness column carries no ranking signal; recommend an action)
//     -> trust verdict (enough repeated samples AND top-pair margin > noise floor
//        AND a paired bootstrap CI on the top-pair delta that excludes zero)
//     -> aggregate.json + synthesis.md
//
// The verdict deliberately measures its margin on the GATE's chosen ranking key
// and its noise floor on that same metric's scale, so a "winner" only stands when
// the deciding axis truly separates the top pair beyond run-to-run jitter.
//
// Dependency-free (Node stdlib only).

'use strict';

const fs = require('fs');
const path = require('path');

const stats = require('./sweep-stats.cjs');
const { applyGate } = require('./correctness-gate.cjs');

const SCHEMA_VERSION = 1;
const DEFAULT_GROUP_BY = 'framework';
const DEFAULT_MIN_SAMPLES_FOR_WINNER = 3;

function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

// Count the finite entries of an array, the real paired depth available to the
// bootstrap (a dispatch-failed sample is null and must not inflate the count).
function countFinite(xs) {
  if (!Array.isArray(xs)) return 0;
  let n = 0;
  for (const x of xs) if (isFiniteNumber(x)) n++;
  return n;
}

// Map a raw row to its value on a given ranking key, on that key's own scale so
// the margin and the noise floor are directly comparable:
//   correctness -> pass rate (0..1)
//   format      -> adherence as 0/1
//   efficiency  -> output word count (lower is better; the reducer handles sign)
function rowMetric(row, key) {
  if (key === 'correctness') {
    return isFiniteNumber(row.correctness_pass_rate) ? row.correctness_pass_rate : NaN;
  }
  if (key === 'format') {
    if (row.format_adherent === true) return 1;
    if (row.format_adherent === false) return 0;
    return NaN;
  }
  // efficiency
  return isFiniteNumber(row.output_words) ? row.output_words : NaN;
}

// The group-level aggregate value on a ranking key, matching how the gate ranks:
// correctness by mean, format by adherent rate, efficiency by median words.
function groupMetric(group, key) {
  if (key === 'correctness') return group.correctness_mean;
  if (key === 'format') return group.format_adherent_rate;
  return group.output_words_median;
}

// ---------------------------------------------------------------------------
// Grouping + per-group aggregation.
// ---------------------------------------------------------------------------

function groupRows(rows, groupBy) {
  const buckets = new Map();
  for (const row of rows) {
    // A null group key (e.g. grouping by framework on a no-framework run) is
    // bucketed under a stable literal rather than dropped.
    const key = row[groupBy] == null ? '(none)' : String(row[groupBy]);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(row);
  }
  return buckets;
}

// Min repeated-sample count across the cells in a row set. This is the depth of
// repeated measurement the trust gate cares about: a single sample per cell
// gives no spread, so the verdict cannot be a WINNER (insufficient_n).
function minSamplesPerCell(rows) {
  const perCell = new Map();
  for (const row of rows) {
    const id = row.cellId == null ? '(cell)' : String(row.cellId);
    perCell.set(id, (perCell.get(id) || 0) + 1);
  }
  if (perCell.size === 0) return 0;
  let min = Infinity;
  for (const c of perCell.values()) if (c < min) min = c;
  return min === Infinity ? 0 : min;
}

// Robust noise floor on a ranking-key metric: take MAD across the repeated
// samples WITHIN each cell (run-to-run jitter for an identical config), then the
// max across cells as the conservative floor. Single-sample cells contribute 0.
function noiseFloorForKey(rows, key) {
  const perCell = new Map();
  for (const row of rows) {
    const id = row.cellId == null ? '(cell)' : String(row.cellId);
    if (!perCell.has(id)) perCell.set(id, []);
    perCell.get(id).push(rowMetric(row, key));
  }
  let floor = 0;
  for (const series of perCell.values()) {
    const m = stats.mad(series);
    if (Number.isFinite(m) && m > floor) floor = m;
  }
  return floor;
}

function aggregateGroup(name, rows) {
  const correctness = rows.map((r) => r.correctness_pass_rate);
  const words = rows.map((r) => r.output_words);
  // Adherence rate ignores rows where the field is null (a failed dispatch), so
  // a dispatch failure does not silently count as non-adherent.
  let adherentCount = 0;
  let adherentTotal = 0;
  for (const r of rows) {
    if (r.format_adherent === true) {
      adherentCount++;
      adherentTotal++;
    } else if (r.format_adherent === false) {
      adherentTotal++;
    }
  }
  return {
    group: name,
    n: rows.length,
    correctness_mean: stats.mean(correctness),
    format_adherent_rate: adherentTotal > 0 ? adherentCount / adherentTotal : NaN,
    output_words_median: stats.median(words),
    rows,
  };
}

// ---------------------------------------------------------------------------
// Saturation auto-detect.
// ---------------------------------------------------------------------------

// Flag a fixture as saturated when every cell touching it scored a perfect
// correctness rate with zero variance — the column then carries no ranking
// signal and harder cases (or demotion to smoke) are required.
function detectFixtureSaturation(rows) {
  const byFixture = new Map();
  for (const row of rows) {
    const fx = row.fixture == null ? '(fixture)' : String(row.fixture);
    if (!byFixture.has(fx)) byFixture.set(fx, []);
    byFixture.get(fx).push(row);
  }
  const fixtures = [];
  for (const [fx, fxRows] of byFixture) {
    const rates = fxRows
      .map((r) => r.correctness_pass_rate)
      .filter((v) => isFiniteNumber(v));
    const allPerfect = rates.length > 0 && rates.every((v) => v >= 1 - 1e-9);
    const zeroVariance = isFiniteNumber(stats.mad(rates)) && stats.mad(rates) === 0;
    const saturated = allPerfect && zeroVariance;
    fixtures.push({
      fixture: fx,
      cells: fxRows.length,
      correctness_mean: stats.mean(rates),
      saturated,
      // A saturated ranking fixture should either gain adversarial cases
      // (promote) or be demoted to a smoke/regression-only role.
      action: saturated ? 'promote-or-demote-to-smoke' : 'keep',
    });
  }
  return fixtures;
}

// ---------------------------------------------------------------------------
// Trust verdict, measured on the gate's chosen ranking key.
// ---------------------------------------------------------------------------

// Pair the top-two groups' per-cell-per-sample metrics on the ranking key by the
// shared (fixture, sample-index) condition, so a paired bootstrap cancels the
// fixture/sample-slot effect and measures only the group difference. Only
// conditions present in BOTH groups are kept, in a stable key order, so the two
// returned series are index-aligned for paired resampling.
function pairedSeriesForKey(topRows, secondRows, key) {
  const byCondA = new Map();
  const byCondB = new Map();
  const cond = (row) =>
    (row.fixture == null ? '(fixture)' : String(row.fixture)) +
    '::' +
    (row.sample == null ? '0' : String(row.sample));
  for (const row of topRows) byCondA.set(cond(row), rowMetric(row, key));
  for (const row of secondRows) byCondB.set(cond(row), rowMetric(row, key));

  // Stable, deterministic condition order so the seeded bootstrap is reproducible.
  const keys = [];
  for (const k of byCondA.keys()) if (byCondB.has(k)) keys.push(k);
  keys.sort();

  const samplesA = [];
  const samplesB = [];
  for (const k of keys) {
    samplesA.push(byCondA.get(k));
    samplesB.push(byCondB.get(k));
  }
  return { samplesA, samplesB };
}

// A stable per-report seed for the paired bootstrap: derived from the deciding
// pair + ranking key so the CI is reproducible across runs yet distinct per
// comparison. An explicit seed override (tests / calibration) takes precedence.
function verdictSeed(topGroup, secondGroup, rankingKey, override) {
  if (override !== undefined && override !== null) return override;
  return 'verdict::' + rankingKey + '::' + topGroup + '::' + secondGroup;
}

function buildVerdict(ranked, rankingKey, rows, minSamplesForWinner, opts) {
  const options = opts || {};
  const nSamples = minSamplesPerCell(rows);

  // Fewer than two survivors: nothing to compare, so there is no winner to
  // trust. trustVerdictCI still gates on n so the reason is consistent.
  if (ranked.length < 2) {
    const v = stats.trustVerdictCI({
      nSamples,
      margin: NaN,
      noiseFloor: 0,
      ci: null,
      minSamplesForWinner,
    });
    return {
      verdict: v.verdict,
      reason: v.reason,
      ranking_key: rankingKey,
      n_samples: nSamples,
      margin: null,
      noise_floor: null,
      ci: null,
      top_pair: ranked.length === 1 ? [ranked[0].group] : [],
    };
  }

  const top = ranked[0];
  const second = ranked[1];
  // Margin is the absolute top-pair gap on the ranking-key metric, so direction
  // (higher-is-better vs lower-is-better) does not matter to the trust test.
  const margin = Math.abs(groupMetric(top, rankingKey) - groupMetric(second, rankingKey));
  const noiseFloor = noiseFloorForKey(rows, rankingKey);

  // The CI rigor needs paired multi-sample observations. Group the original rows
  // back to the two deciding groups (the gate stripped the rows[] off the ranked
  // copies), then pair them on the shared (fixture, sample) condition.
  const buckets = groupRows(rows, options.groupBy || DEFAULT_GROUP_BY);
  const topRows = buckets.get(String(top.group)) || [];
  const secondRows = buckets.get(String(second.group)) || [];
  const { samplesA, samplesB } = pairedSeriesForKey(topRows, secondRows, rankingKey);

  // Single-sample fallback: with only one paired observation there is no spread
  // to bootstrap, so the CI cannot exclude zero. Defer to the n-gate, which on a
  // single sample yields INCONCLUSIVE('insufficient_n') — never a trusted win.
  const pairedDepth = Math.min(
    countFinite(samplesA),
    countFinite(samplesB),
  );
  let ci = null;
  if (pairedDepth >= 2) {
    ci = stats.bootstrapPairedDeltaCi(samplesA, samplesB, {
      iterations: isFiniteNumber(options.bootstrapIterations)
        ? options.bootstrapIterations
        : 2000,
      confidence: isFiniteNumber(options.confidence) ? options.confidence : 0.9,
      seed: verdictSeed(top.group, second.group, rankingKey, options.seed),
    });
  }

  const v = stats.trustVerdictCI({
    nSamples,
    margin,
    noiseFloor,
    ci,
    minSamplesForWinner,
  });
  return {
    verdict: v.verdict,
    reason: v.reason,
    ranking_key: rankingKey,
    n_samples: nSamples,
    margin: Number.isFinite(margin) ? margin : null,
    noise_floor: Number.isFinite(noiseFloor) ? noiseFloor : null,
    ci:
      ci && Number.isFinite(ci.lo) && Number.isFinite(ci.hi)
        ? { point: ci.point, lo: ci.lo, hi: ci.hi, confidence: isFiniteNumber(options.confidence) ? options.confidence : 0.9 }
        : null,
    top_pair: [top.group, second.group],
  };
}

// ---------------------------------------------------------------------------
// Synthesis markdown — verdict + saturation FIRST, leaderboard LAST.
// ---------------------------------------------------------------------------

function fmtNum(v, digits) {
  if (!isFiniteNumber(v)) return 'n/a';
  const d = typeof digits === 'number' ? digits : 3;
  return Number(v.toFixed(d)).toString();
}

function renderSynthesis(aggregate, profileMeta) {
  const lines = [];
  lines.push('# Benchmark synthesis');
  lines.push('');

  // 1. Trust verdict FIRST — before any leaderboard or winner language.
  const v = aggregate.verdict;
  lines.push('## Trust verdict');
  lines.push('');
  lines.push(
    'Verdict: **' +
      v.verdict +
      '** (' +
      v.reason +
      ') on ranking key `' +
      v.ranking_key +
      '`.',
  );
  lines.push(
    '- samples per cell (min): ' +
      v.n_samples +
      ' | top-pair margin: ' +
      fmtNum(v.margin) +
      ' | noise floor: ' +
      fmtNum(v.noise_floor),
  );
  if (v.ci) {
    const pct = Math.round((v.ci.confidence || 0.9) * 100);
    lines.push(
      '- paired ' +
        pct +
        '% CI on the top-pair delta: [' +
        fmtNum(v.ci.lo) +
        ', ' +
        fmtNum(v.ci.hi) +
        '] (point ' +
        fmtNum(v.ci.point) +
        ') — ' +
        (v.ci.lo <= 0 && 0 <= v.ci.hi
          ? 'overlaps zero, so no trusted separation'
          : 'excludes zero'),
    );
  }
  if (v.top_pair && v.top_pair.length) {
    lines.push('- top pair: ' + v.top_pair.join(' vs '));
  }
  lines.push(
    '- correctness gate: threshold ' +
      fmtNum(aggregate.gate_threshold) +
      ' | correctness saturated: ' +
      aggregate.correctness_saturated +
      (aggregate.correctness_saturated
        ? ' (correctness is NOT the ranking key — survivors ranked on `' +
          aggregate.ranking_key +
          '`)'
        : ''),
  );
  lines.push('');

  // 2. Saturation status table SECOND.
  lines.push('## Saturation status');
  lines.push('');
  lines.push(
    'Run status: **' +
      aggregate.saturation.status +
      '**' +
      (aggregate.saturation.action ? ' | action: ' + aggregate.saturation.action : '') +
      '.',
  );
  if (aggregate.saturation.detail) {
    lines.push('- ' + aggregate.saturation.detail);
  }
  lines.push('');
  lines.push('| fixture | cells | correctness mean | saturated | action |');
  lines.push('| --- | ---: | ---: | --- | --- |');
  for (const fx of aggregate.saturation.fixtures) {
    lines.push(
      '| ' +
        fx.fixture +
        ' | ' +
        fx.cells +
        ' | ' +
        fmtNum(fx.correctness_mean) +
        ' | ' +
        fx.saturated +
        ' | ' +
        fx.action +
        ' |',
    );
  }
  lines.push('');

  // 3. Leaderboard LAST. The word "leaderboard" appears only after the verdict.
  lines.push('## Leaderboard (groupBy: ' + aggregate.groupBy + ')');
  lines.push('');
  lines.push('| rank | ' + aggregate.groupBy + ' | n | correctness | format adherence | words (median) | eligible |');
  lines.push('| ---: | --- | ---: | ---: | ---: | ---: | --- |');
  for (const g of aggregate.groups) {
    lines.push(
      '| ' +
        (g.rank == null ? '-' : g.rank) +
        ' | ' +
        g.group +
        ' | ' +
        g.n +
        ' | ' +
        fmtNum(g.correctness_mean) +
        ' | ' +
        fmtNum(g.format_adherent_rate) +
        ' | ' +
        fmtNum(g.output_words_median, 1) +
        ' | ' +
        g.eligible +
        ' |',
    );
  }
  lines.push('');

  // 4. Reproducibility footer.
  lines.push('## Reproducibility');
  lines.push('');
  lines.push(
    '- profile: `' +
      (profileMeta.id || 'unknown') +
      '` | mode: `' +
      (profileMeta.mode || 'none') +
      '` | groupBy: `' +
      aggregate.groupBy +
      '` | samples/cell (min): ' +
      v.n_samples,
  );
  lines.push('- schema_version: ' + aggregate.schema_version);
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Public entry.
// ---------------------------------------------------------------------------

// report(sweepResult, opts) -> { aggregate, synthesisMarkdown }
//
// sweepResult: the object returned by runSweep ({ profile, rows, meta }).
// opts:
//   profile               : the full profile (for reporting.groupBy + gate cfg)
//   outDir                : write aggregate.json + synthesis.md here (when set)
//   groupBy               : override reporting.groupBy
//   minSamplesForWinner   : override the trust gate's n threshold (default 3)
//   write                 : set false to skip disk writes (default: writes iff
//                           outDir is provided)
function report(sweepResult, opts) {
  const options = opts || {};
  if (!sweepResult || !Array.isArray(sweepResult.rows)) {
    throw new Error('report: sweepResult must carry a rows[] array');
  }
  const profile = options.profile || {};
  const reporting = profile.reporting || {};
  const groupBy = options.groupBy || reporting.groupBy || DEFAULT_GROUP_BY;

  const gateCfg =
    (profile.scoring && profile.scoring.correctnessGate) || { threshold: 1.0 };
  const minSamplesForWinner = isFiniteNumber(options.minSamplesForWinner)
    ? options.minSamplesForWinner
    : DEFAULT_MIN_SAMPLES_FOR_WINNER;

  const rows = sweepResult.rows;

  // Per-group aggregation.
  const buckets = groupRows(rows, groupBy);
  const groupAggs = [];
  for (const [name, gRows] of buckets) {
    groupAggs.push(aggregateGroup(name, gRows));
  }

  // Correctness GATE: eligibility + ranking key (correctness never blended).
  const gate = applyGate(groupAggs, gateCfg);

  // Index rank/eligibility back onto the full group list (eligible + ineligible)
  // so the leaderboard can show every group, ranked survivors first.
  const rankByGroup = new Map();
  for (const g of gate.ranked) rankByGroup.set(g.group, g.rank);
  const eligibleSet = new Set(gate.ranked.map((g) => g.group));

  // Saturation auto-detect across fixtures + a run-level rollup.
  const fixtures = detectFixtureSaturation(rows);
  const runSaturated = gate.correctness_saturated;
  const saturation = {
    status: runSaturated ? 'saturated' : 'separable',
    action: runSaturated ? 'promote-or-demote-to-smoke' : null,
    detail: runSaturated
      ? 'every eligible ' +
        groupBy +
        ' is pinned at the correctness gate; correctness cannot rank — ranked on ' +
        gate.ranking_key +
        ' instead.'
      : 'correctness still separates the eligible groups.',
    fixtures,
  };

  // Trust verdict on the gate's ranking key. The CI rigor needs to re-group the
  // raw rows back to the deciding pair, so the groupBy travels with it; bootstrap
  // knobs (iterations / confidence / seed) stay overridable for tests.
  const verdict = buildVerdict(gate.ranked, gate.ranking_key, rows, minSamplesForWinner, {
    groupBy,
    bootstrapIterations: options.bootstrapIterations,
    confidence: options.confidence,
    seed: options.bootstrapSeed,
  });

  // Build the leaderboard group list: ranked survivors first (in rank order),
  // then ineligible groups, each carrying its rank + eligibility.
  const orderedGroups = [];
  for (const g of gate.ranked) {
    orderedGroups.push({
      group: g.group,
      n: g.n,
      correctness_mean: g.correctness_mean,
      format_adherent_rate: g.format_adherent_rate,
      output_words_median: g.output_words_median,
      eligible: true,
      rank: rankByGroup.get(g.group),
    });
  }
  for (const g of groupAggs) {
    if (eligibleSet.has(g.group)) continue;
    orderedGroups.push({
      group: g.group,
      n: g.n,
      correctness_mean: g.correctness_mean,
      format_adherent_rate: g.format_adherent_rate,
      output_words_median: g.output_words_median,
      eligible: false,
      rank: null,
    });
  }

  const aggregate = {
    schema_version: SCHEMA_VERSION,
    groupBy,
    gate_threshold: gate.threshold,
    ranking_key: gate.ranking_key,
    correctness_saturated: gate.correctness_saturated,
    groups: orderedGroups,
    saturation,
    verdict,
    profile: {
      id: (sweepResult.profile && sweepResult.profile.id) || profile.id || profile.profileId || null,
      mode: (sweepResult.profile && sweepResult.profile.mode) || profile.mode || null,
      version: (sweepResult.profile && sweepResult.profile.version) || profile.version || null,
    },
  };

  const profileMeta = aggregate.profile;
  const synthesisMarkdown = renderSynthesis(aggregate, profileMeta);

  const shouldWrite =
    options.write === true || (options.write !== false && !!options.outDir);
  if (shouldWrite) {
    const outDir = options.outDir;
    if (!outDir) {
      throw new Error('report: write requested but no outDir provided');
    }
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, 'aggregate.json'),
      JSON.stringify(aggregate, null, 2),
    );
    fs.writeFileSync(path.join(outDir, 'synthesis.md'), synthesisMarkdown);
  }

  return { aggregate, synthesisMarkdown };
}

module.exports = {
  report,
  // Exported for unit reuse.
  groupRows,
  aggregateGroup,
  detectFixtureSaturation,
  minSamplesPerCell,
  noiseFloorForKey,
  buildVerdict,
  SCHEMA_VERSION,
};
