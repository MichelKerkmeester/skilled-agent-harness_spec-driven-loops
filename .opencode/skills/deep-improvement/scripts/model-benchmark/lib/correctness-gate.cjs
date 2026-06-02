// Correctness as a GATE, never a blended score. This is the direct fix for the
// saturation mis-read: a one-off bake-off ranked frameworks on a correctness
// column where every cell scored 100%, so the "winner" was really a
// format/length artifact dressed up as a correctness win.
//
// The rule: a group is ELIGIBLE iff its correctness_mean clears the gate
// threshold (default 1.0 for hidden deterministic oracles). Among the eligible:
//   - if correctness still SEPARATES them, correctness is the ranking key;
//   - if correctness is saturated (every eligible group tied at the top, so the
//     column carries zero ranking signal), correctness is DROPPED as the key and
//     survivors rank on format-adherence (desc) then efficiency / fewer output
//     words (asc). Correctness is never folded into a blended score either way.
//
// Dependency-free (Node stdlib only); pure function, no I/O.

'use strict';

const DEFAULT_THRESHOLD = 1.0;
// Correctness means within this band are treated as the same level, so floating
// rounding of clean rates (e.g. 5/5 vs 10/10) does not fake a separation.
const SEPARATION_EPSILON = 1e-9;

function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

// Numeric accessor that tolerates a missing/NaN field by returning a sentinel,
// so a partial group cannot crash the ranking comparator.
function num(v, fallback) {
  return isFiniteNumber(v) ? v : fallback;
}

// Are all eligible groups at the SAME correctness level? If so the correctness
// column cannot separate them and must not be the ranking key. Compared with a
// small epsilon so clean-fraction rounding does not fake a real gap.
function correctnessIsSaturated(eligible) {
  if (eligible.length <= 1) return true;
  const first = num(eligible[0].correctness_mean, NaN);
  if (!Number.isFinite(first)) return false;
  for (let i = 1; i < eligible.length; i++) {
    const c = num(eligible[i].correctness_mean, NaN);
    if (!Number.isFinite(c)) return false;
    if (Math.abs(c - first) > SEPARATION_EPSILON) return false;
  }
  return true;
}

// Comparator on the correctness key: higher correctness ranks first. Ties fall
// through to the format-then-efficiency comparator so a correctness tie is still
// broken deterministically rather than left in input order.
function byCorrectnessThenFormatThenEfficiency(a, b) {
  const ca = num(a.correctness_mean, -Infinity);
  const cb = num(b.correctness_mean, -Infinity);
  if (cb !== ca) return cb - ca; // desc
  return byFormatThenEfficiency(a, b);
}

// Comparator when correctness is OUT as a key: format-adherence desc (more
// adherent is better), then efficiency asc (fewer output words is better). A
// missing format rate sorts last; a missing word count sorts last.
function byFormatThenEfficiency(a, b) {
  const fa = num(a.format_adherent_rate, -Infinity);
  const fb = num(b.format_adherent_rate, -Infinity);
  if (fb !== fa) return fb - fa; // desc: higher adherence first
  const wa = num(a.output_words_median, Infinity);
  const wb = num(b.output_words_median, Infinity);
  if (wa !== wb) return wa - wb; // asc: fewer words first
  // Final stable tiebreak so identical groups order deterministically.
  return String(a.group).localeCompare(String(b.group));
}

// Decide which dimension actually produced the top-pair separation among the
// ranked survivors, so the reporter's trust verdict measures the margin on the
// real deciding axis. Format wins the label when the top two differ on
// adherence; otherwise efficiency (word count) is the deciding axis.
function decideRankingKey(rankedSurvivors) {
  if (rankedSurvivors.length < 2) return 'format';
  const top = rankedSurvivors[0];
  const second = rankedSurvivors[1];
  const fTop = num(top.format_adherent_rate, NaN);
  const fSecond = num(second.format_adherent_rate, NaN);
  if (Number.isFinite(fTop) && Number.isFinite(fSecond) && fTop !== fSecond) {
    return 'format';
  }
  return 'efficiency';
}

// Apply the correctness gate to a list of aggregated groups.
//
// groups: [{ group, rows, correctness_mean, format_adherent_rate,
//            output_words_median, ... }]
// gateCfg: { threshold? }  (default threshold 1.0)
//
// Returns:
//   {
//     threshold,
//     ranking_key: 'correctness' | 'format' | 'efficiency',
//     correctness_saturated: boolean,
//     eligible:  [...groups that cleared the gate, each + {eligible:true, rank}],
//     ineligible:[...groups below the gate, each + {eligible:false, rank:null}],
//     ranked:    [...eligible groups in rank order]
//   }
//
// Ranking semantics:
//   - correctness separates eligible -> ranking_key 'correctness', rank by
//     correctness desc (format/efficiency break exact ties).
//   - correctness saturated among eligible -> correctness DROPPED; rank by
//     format desc then efficiency (fewer words) asc; ranking_key reflects the
//     axis that actually split the top pair.
function applyGate(groups, gateCfg) {
  const cfg = gateCfg || {};
  const threshold = isFiniteNumber(cfg.threshold) ? cfg.threshold : DEFAULT_THRESHOLD;

  const list = Array.isArray(groups) ? groups.slice() : [];

  const eligible = [];
  const ineligible = [];
  for (const g of list) {
    const c = num(g.correctness_mean, NaN);
    // A group with no correctness signal cannot clear a gate; it is ineligible.
    if (Number.isFinite(c) && c >= threshold - SEPARATION_EPSILON) {
      eligible.push(Object.assign({}, g, { eligible: true }));
    } else {
      ineligible.push(Object.assign({}, g, { eligible: false, rank: null }));
    }
  }

  const saturated = eligible.length > 0 && correctnessIsSaturated(eligible);

  let ranked;
  let rankingKey;
  if (eligible.length === 0) {
    ranked = [];
    rankingKey = 'correctness';
  } else if (saturated) {
    // Saturated: correctness carries no ranking signal. Rank survivors on
    // format then efficiency, and never report correctness as the key.
    ranked = eligible.slice().sort(byFormatThenEfficiency);
    rankingKey = decideRankingKey(ranked);
  } else {
    // Correctness still separates the eligible groups: it is the primary key.
    ranked = eligible.slice().sort(byCorrectnessThenFormatThenEfficiency);
    rankingKey = 'correctness';
  }

  ranked.forEach((g, i) => {
    g.rank = i + 1;
  });

  return {
    threshold,
    ranking_key: rankingKey,
    correctness_saturated: saturated,
    eligible: ranked,
    ineligible,
    ranked,
  };
}

module.exports = {
  applyGate,
  DEFAULT_THRESHOLD,
};
