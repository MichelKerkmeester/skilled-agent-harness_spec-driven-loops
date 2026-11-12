#!/usr/bin/env bash
# Measure the name overlap between the legacy lane harnesses and the CLI vitest project.
# Writes only inside this packet's scratch folder.

set -euo pipefail

SCRATCH_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(git -C "$SCRATCH_DIR" rev-parse --show-toplevel)
CLI_DIR="$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/cli"
SCRATCH="$SCRATCH_DIR"
COMMANDS="$SCRATCH/lane-commands.txt"
CLI_NAMES="$SCRATCH/cli-vitest-names.txt"
LANE_NAMES="$SCRATCH/legacy-lane-names.txt"
REPORT="$SCRATCH/legacy-lane-overlap.md"

die() {
  echo "measure-overlap: $*" >&2
  exit 1
}

lane_id_for() {
  # One ID per command file; the extension keeps the two test-phase-system lanes apart.
  local file
  file=${1##*/}
  printf '%s' "${file//./-}"
}

extract_names() {
  local lane=$1 log=$2
  case "$lane" in
    test-scripts-modules-js)          sed -n 's/^   ✅ //p' "$log" ;;
    test-extractors-loaders-js)       sed -n 's/^   \[PASS\] //p' "$log" ;;
    test-validation-system-cjs)       sed -n 's/^   \[PASS\] //p' "$log" ;;
    test-phase-validation-js)         sed -n 's/^PASS: //p' "$log" ;;
    test-phase-system-js)             sed -n 's/^PASS: //p' "$log" ;;
    test-validation-sh)               sed -n '/^  • \[/s/^  • //p' "$log" ;;
    test-validation-extended-sh)      sed -n '/^  - \[/s/^  - //p' "$log" ;;
    check-ac-closure-sh)              sed -n 's/^  ok    //p' "$log" | cut -c1-56 ;;
    check-ac-coverage-sh)             sed -n 's/^  ok    //p' "$log" | cut -c1-54 ;;
    check-graph-metadata-child-drift-sh)             sed -n 's/^  PASS: //p' "$log" ;;
    check-graph-metadata-shape-last-active-child-sh) sed -n 's/^  PASS: //p' "$log" ;;
    test-phase-system-sh)             sed -n 's/^  PASS: //p' "$log" ;;
    *) die "no extractor for lane $lane" ;;
  esac | sed 's/[[:space:]]*$//' | awk 'length($0) > 0'
}

collect() {
  [ -f "$COMMANDS" ] || die "missing $COMMANDS"
  [ -f "$CLI_NAMES" ] || die "missing $CLI_NAMES"
  mkdir -p "$SCRATCH/lane-logs"

  echo "collect: building the CLI package once"
  if ! ( cd "$CLI_DIR" && npm run build ) > "$SCRATCH/lane-logs/build.log" 2>&1; then
    die "build failed; see scratch/lane-logs/build.log"
  fi

  local tmp="$SCRATCH/legacy-lane-names.txt.tmp"
  : > "$tmp"
  local script command lane run log count

  while IFS=$'\t' read -r script command; do
    [ -n "$script" ] || continue
    lane=$(lane_id_for "${command##* }")
    run=$command
    case "$command" in
      "bash tests/test-validation.sh"|"bash tests/test-validation-extended.sh")
        run="$command --list"
        ;;
    esac
    log="$SCRATCH/lane-logs/$lane.log"
    echo "collect: $lane"
    if ! ( cd "$CLI_DIR" && $run ) > "$log" 2>&1; then
      die "$lane exited non-zero; see scratch/lane-logs/$lane.log"
    fi
    extract_names "$lane" "$log" | awk -v lane="$lane" '{ print lane "\t" $0 }' >> "$tmp"
    count=$(awk -F'\t' -v lane="$lane" '$1 == lane' "$tmp" | wc -l | tr -d ' ')
    echo "collect: $lane $count names"
  done < "$COMMANDS"

  local lanes
  lanes=$(awk -F'\t' '{ print $1 }' "$tmp" | sort -u | wc -l | tr -d ' ')
  [ "$lanes" -eq 12 ] || die "expected 12 lanes with names, found $lanes"
  mv "$tmp" "$LANE_NAMES"
  echo "collect: wrote $LANE_NAMES ($(wc -l < "$LANE_NAMES" | tr -d ' ') names across $lanes lanes)"
}

run_analysis() {
  local mode=$1
  shift
  node - "$REPO_ROOT" "$SCRATCH" "$mode" "$@" <<'NODE'
import fs from 'node:fs';
import path from 'node:path';

const [root, scratch, mode, ...flags] = process.argv.slice(2);
const cliDir = path.join(root, '.opencode/skills/system-spec-kit/runtime/cli');
const cliNamesPath = path.join(scratch, 'cli-vitest-names.txt');
const laneNamesPath = path.join(scratch, 'legacy-lane-names.txt');
const reportPath = path.join(scratch, 'legacy-lane-overlap.md');

const STOP = new Set(['test', 'tests', 'with', 'that', 'this', 'from', 'into', 'when', 'then', 'does', 'not', 'for', 'and', 'the']);

function readLines(file) {
  return fs.readFileSync(file, 'utf8').split('\n').filter((line, i, all) => !(i === all.length - 1 && line === ''));
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function tokens(value) {
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 4 && !STOP.has(word)));
}

function escapeCell(value) {
  return value.replace(/\|/g, '\\|');
}

function titleOf(fullName) {
  const parts = fullName.split(' > ');
  return parts[parts.length - 1];
}

function laneFile(lane) {
  if (lane.endsWith('-cjs')) return 'tests/' + lane.slice(0, -4) + '.cjs';
  if (lane.endsWith('-js')) return 'tests/' + lane.slice(0, -3) + '.js';
  if (lane.endsWith('-sh')) return 'tests/' + lane.slice(0, -3) + '.sh';
  return 'tests/' + lane;
}

function resolveRef(file, name) {
  const full = path.join(cliDir, file);
  if (!fs.existsSync(full)) return `${file}:?`;
  const lines = fs.readFileSync(full, 'utf8').split('\n');
  const search = name.replace(/^\[[^\]]*\]\s*/, '');
  const tries = [search];
  const colon = search.lastIndexOf(': ');
  if (colon > 0) tries.push(search.slice(0, colon));
  const words = search.split(/\s+/).filter(Boolean);
  for (let count = words.length - 1; count >= 3; count -= 1) tries.push(words.slice(0, count).join(' '));
  const longest = [...words].sort((a, b) => b.length - a.length);
  for (const word of longest) {
    const clean = word.replace(/[^a-z0-9_.-]+$/i, '');
    if (clean.length >= 12) tries.push(clean);
  }
  for (const needle of tries) {
    const index = lines.findIndex((line) => line.includes(needle));
    if (index !== -1) return `${file}:${index + 1}`;
  }
  return `${file}:?`;
}

function loadModel() {
  const cli = readLines(cliNamesPath).map((fullName, index) => ({
    fullName,
    line: index + 1,
    title: titleOf(fullName),
    file: fullName.split(' > ')[0],
    normTitle: normalize(titleOf(fullName)),
  }));
  const legacy = readLines(laneNamesPath).map((line) => {
    const tab = line.indexOf('\t');
    const lane = tab === -1 ? '' : line.slice(0, tab);
    const name = tab === -1 ? line : line.slice(tab + 1);
    return { lane, name, norm: normalize(name) };
  });

  const byNormName = new Map();
  for (const entry of legacy) {
    if (!byNormName.has(entry.norm)) byNormName.set(entry.norm, []);
    byNormName.get(entry.norm).push(entry);
  }

  const exactPairs = [];
  const exactKeys = new Set();
  for (const entry of cli) {
    const matches = byNormName.get(entry.normTitle) || [];
    for (const match of matches) {
      exactPairs.push({ legacy: match, cli: entry });
      exactKeys.add(match.name + '\u0000' + entry.fullName);
    }
  }

  const cliTokens = cli.map((entry) => ({ entry, set: tokens(entry.title) }));
  const candidates = [];
  for (const entry of legacy) {
    const set = tokens(entry.name);
    for (const { entry: cliEntry, set: cliSet } of cliTokens) {
      if (exactKeys.has(entry.name + '\u0000' + cliEntry.fullName)) continue;
      const shared = [...set].filter((word) => cliSet.has(word));
      if (shared.length >= 3) {
        candidates.push({ legacy: entry, cli: cliEntry, shared: shared.sort() });
      }
    }
  }
  candidates.forEach((pair, index) => {
    pair.id = 'P' + String(index + 1).padStart(3, '0');
    pair.legacyRef = resolveRef(laneFile(pair.legacy.lane), pair.legacy.name);
    pair.cliRef = resolveRef(pair.cli.file, pair.cli.title);
  });

  return { cli, legacy, exactPairs, candidates };
}

function renderReport(model) {
  const { cli, legacy, exactPairs, candidates } = model;
  const lanes = [...new Set(legacy.map((entry) => entry.lane))];
  const out = [];

  out.push('# Legacy lane overlap measurement');
  out.push('');
  out.push('Both name lists, the confirmed overlap count, the reviewed candidate pairs and one recommendation per lane.');
  out.push('');
  out.push('## 1. Counting basis');
  out.push('');
  out.push('The unit of comparison is the test name. A CLI line in `scratch/cli-vitest-names.txt` carries `file > suite > name`, so the name is the last ` > ` segment and the file and suite are kept only as provenance.');
  out.push('');
  out.push('- **Normalization.** Both sides are lowercased and every character outside `a-z0-9` is removed before two names are compared.');
  out.push('- **Exact match.** A legacy name and a CLI test name are an exact match when their normalized forms are equal. One row is counted per CLI test that matches.');
  out.push(`- **Candidate.** A legacy name is a candidate against a CLI name when the two share at least three content tokens of four or more characters. The tokens ${[...STOP].map((word) => '`' + word + '`').join(', ')} are ignored. Tokens are compared as sets, so a repeated word counts once.`);
  out.push('- **Confirmed match.** Every candidate pair is read in both source files and marked `same` or `different`. `same` means the two tests assert the same behaviour, not merely a similar title.');
  out.push('- **Overlap count.** Exact matches plus candidate pairs marked `same`. Nothing else is counted.');
  out.push('');
  out.push('## 2. CLI vitest project names');
  out.push('');
  out.push('```text');
  out.push(...cli.map((entry) => entry.fullName));
  out.push('```');
  out.push('');
  out.push(`Line count: ${cli.length}.`);
  out.push('');
  out.push('## 3. Legacy lane names');
  out.push('');
  out.push('```text');
  out.push(...legacy.map((entry) => `${entry.lane}\t${entry.name}`));
  out.push('```');
  out.push('');
  out.push(`Line count: ${legacy.length}.`);
  out.push('');
  out.push('## 4. Exact name matches');
  out.push('');
  if (exactPairs.length === 0) {
    out.push('None. The two lists share no normalized test name.');
  } else {
    out.push('| # | Legacy name | Lane | CLI test name | CLI reference |');
    out.push('|---|---|---|---|---|');
    exactPairs.forEach((pair, index) => {
      out.push(`| ${index + 1} | ${escapeCell(pair.legacy.name)} | ${pair.legacy.lane} | ${escapeCell(pair.cli.fullName)} | ${resolveRef(pair.cli.file, pair.cli.title)} |`);
    });
  }
  out.push('');
  out.push(`Overlap count: ${exactPairs.length}`);
  out.push('');
  out.push('## 5. Candidate pairs');
  out.push('');
  out.push(`${candidates.length} candidate pairs. Each pair id is stable for this report.`);
  out.push('');
  out.push('| Pair | Legacy name | Lane | CLI test name | Shared tokens |');
  out.push('|---|---|---|---|---|');
  for (const pair of candidates) {
    out.push(`| ${pair.id} | ${escapeCell(pair.legacy.name)} | ${pair.legacy.lane} | ${escapeCell(pair.cli.title)} | ${pair.shared.join(', ')} |`);
  }
  out.push('');
  out.push('## 6. Substantive review');
  out.push('');
  out.push('One row per candidate pair. Replace `unreviewed` with `same` or `different`, and replace a `file:?` reference with the line that was read. `same` means the two tests assert the same behaviour, not merely a similar title.');
  out.push('');
  out.push(`Unreviewed candidate pairs: ${candidates.length}`);
  out.push('');
  out.push('| Verdict | Pair | Legacy name | Legacy source | CLI test name | CLI source |');
  out.push('|---|---|---|---|---|---|');
  for (const pair of candidates) {
    out.push(`| unreviewed | ${pair.id} | ${escapeCell(pair.legacy.name)} | ${pair.legacyRef} | ${escapeCell(pair.cli.title)} | ${pair.cliRef} |`);
  }
  out.push('');
  out.push('## 7. Per-lane recommendation');
  out.push('');
  out.push('One line per lane. `narrow` is written only when every name in the lane has a confirmed CLI counterpart.');
  out.push('');
  for (const lane of lanes) {
    out.push(`Recommendation: pending ${lane} — replace with keep or narrow after the review.`);
  }
  out.push('');
  out.push('## 8. Method and limits');
  out.push('');
  out.push('- The lane list records a name against the lane that printed it; the twelve commands come from `test:legacy` and `test:validation` in the CLI package manifest.');
  out.push('- `test-validation.sh` and `test-validation-extended.sh` are collected in `--list` mode, because that is where each prints a stable `[category] name` entry. The other ten lanes are collected from their normal run output.');
  out.push('- The CLI list comes from `vitest list` and no CLI test runs to produce it. The lane list costs one run of each lane.');
  out.push('- The comparison is name-based. A `same` verdict means the two tests were read and assert the same behaviour; it is not a proof that the coverage is interchangeable under every input.');
  out.push('- Runtime skips are not distinguished: the CLI list holds every declared name, and a lane that skipped a test still contributes no name for it.');
  out.push('- The 161 s and 490 s figures are the pre-split baseline from run 43174399120. This report does not re-time either lane.');
  out.push('');

  return out.join('\n');
}

function parseReport(text) {
  const fenceAfter = (heading) => {
    const start = text.indexOf(heading);
    if (start === -1) return null;
    const rest = text.slice(start + heading.length);
    const match = rest.match(/```[a-z]*\n([\s\S]*?)\n```/);
    return match ? match[1].split('\n') : null;
  };
  const singleValue = (label) => {
    const matches = [...text.matchAll(new RegExp('^' + label + ': (\\d+)$', 'gm'))];
    return matches.length === 1 ? Number(matches[0][1]) : null;
  };
  const reviewRows = [];
  const rowPattern = /^\| (same|different|unreviewed) \| (P\d+) \|/gm;
  let match;
  while ((match = rowPattern.exec(text)) !== null) {
    reviewRows.push({ verdict: match[1], id: match[2] });
  }
  return {
    cli: fenceAfter('## 2. CLI vitest project names'),
    legacy: fenceAfter('## 3. Legacy lane names'),
    overlap: singleValue('Overlap count'),
    unreviewed: singleValue('Unreviewed candidate pairs'),
    reviewRows,
    recommendations: (text.match(/^Recommendation: /gm) || []).length,
  };
}

function sameList(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((line, index) => line === b[index]);
}

function check(model) {
  if (!fs.existsSync(reportPath)) {
    console.log('lists-mismatch');
    console.log('review-incomplete');
    console.log('overlap=mismatch');
    console.log('measure-overlap: report not found at ' + reportPath);
    process.exit(1);
  }
  const parsed = parseReport(fs.readFileSync(reportPath, 'utf8'));
  const problems = [];

  const listsOk = sameList(parsed.cli, model.cli.map((entry) => entry.fullName))
    && sameList(parsed.legacy, model.legacy.map((entry) => `${entry.lane}\t${entry.name}`));

  const candidateIds = new Set(model.candidates.map((pair) => pair.id));
  const seen = new Set();
  let duplicate = false;
  let unknown = false;
  for (const row of parsed.reviewRows) {
    if (seen.has(row.id)) duplicate = true;
    seen.add(row.id);
    if (!candidateIds.has(row.id)) unknown = true;
  }
  const marked = parsed.reviewRows.filter((row) => row.verdict === 'same' || row.verdict === 'different');
  const unreviewed = model.candidates.filter((pair) => !marked.some((row) => row.id === pair.id)).length;
  const sameCount = marked.filter((row) => row.verdict === 'same').length;
  const reviewOk = !duplicate && !unknown && unreviewed === 0 && parsed.reviewRows.length === model.candidates.length && parsed.unreviewed === 0;
  const expectedOverlap = model.exactPairs.length + sameCount;
  const overlapOk = parsed.overlap !== null && parsed.overlap === expectedOverlap;

  if (duplicate) problems.push('a pair id appears more than once');
  if (unknown) problems.push('a review row names a pair id that is not a candidate');
  if (unreviewed > 0) problems.push(`${unreviewed} candidate pairs are not marked`);
  if (parsed.unreviewed === null) problems.push('Unreviewed candidate pairs line is missing or not a single integer');
  else if (parsed.unreviewed !== unreviewed) problems.push(`Unreviewed candidate pairs says ${parsed.unreviewed}, recomputed ${unreviewed}`);
  if (parsed.overlap === null) problems.push('Overlap count line is missing or not a single integer');
  else if (!overlapOk) problems.push(`Overlap count says ${parsed.overlap}, recomputed ${expectedOverlap}`);
  if (!listsOk) problems.push('a fenced list does not match its source file');

  console.log(listsOk ? 'lists-match' : 'lists-mismatch');
  console.log(reviewOk ? 'review-complete' : 'review-incomplete');
  console.log(overlapOk ? 'overlap=ok' : 'overlap=mismatch');
  if (!listsOk || !reviewOk || !overlapOk) {
    for (const problem of problems) console.log('measure-overlap: ' + problem);
    process.exit(1);
  }
  console.log(`measure-overlap: ${model.candidates.length} candidate pairs, ${model.exactPairs.length} exact, ${sameCount} confirmed same, ${expectedOverlap} overlap, ${parsed.recommendations} recommendation lines`);
}

function requireInputs() {
  if (!fs.existsSync(cliNamesPath)) throw new Error('missing ' + cliNamesPath);
  if (!fs.existsSync(laneNamesPath)) throw new Error('missing ' + laneNamesPath);
}

if (mode === 'check') {
  requireInputs();
  check(loadModel());
} else if (mode === 'report') {
  requireInputs();
  const force = flags.includes('--force');
  if (fs.existsSync(reportPath) && !force) {
    console.error('measure-overlap: report exists; pass --force to overwrite');
    process.exit(1);
  }
  const model = loadModel();
  fs.writeFileSync(reportPath, renderReport(model) + '\n');
  console.log(`report: ${model.candidates.length} candidate pairs, ${model.exactPairs.length} exact matches, wrote ${reportPath}`);
} else {
  console.error('measure-overlap: unknown analysis mode ' + mode);
  process.exit(1);
}
NODE
}

case "${1:-}" in
  collect) collect ;;
  report)
    shift
    force=""
    for arg in "$@"; do
      [ "$arg" = "--force" ] && force="--force"
    done
    run_analysis report $force
    ;;
  check) run_analysis check ;;
  *)
    echo "usage: measure-overlap.sh <collect|report|check>" >&2
    exit 1
    ;;
esac
