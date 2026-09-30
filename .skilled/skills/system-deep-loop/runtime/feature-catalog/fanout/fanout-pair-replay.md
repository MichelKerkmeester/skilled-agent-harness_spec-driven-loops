---
title: "Fan-out pair replay"
description: "Replays the fan-out merge's own near-line and cross-body pair decisions with dedup on and off and scores a --jev or --deem backend against the operator's labels through the Keep Rule."
trigger_phrases:
  - "fan-out pair replay"
  - "score-fanout-pairs.cjs"
  - "fan-out pair census"
  - "near-line cross-body pairs"
  - "pair replay label gate"
version: 1.9.0.0
---

# Fan-out pair replay

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`score-fanout-pairs.cjs` reads the tracked fan-out lineage registries of every
deep-research and deep-review run that holds at least two lineages and prints the
census of candidate duplicate pairs the merge judged, together with the merge's own
decision on each pair with near-duplicate deduplication on and off. It requires
`fanout-merge.cjs` and calls the merge's own functions, and that merge is unchanged.

**The two pair classes** follow the merge's own body key: `near-line` pairs share a
body key and carry a title overlap in `[0.05, 0.30)`, `cross-body` pairs differ in
body and reach a title or text overlap of `0.5` or more. A pair is `undecidable` when
the merge drops either finding on its own before comparing (a review finding that is
not active, or a finding with no id or title), since a one-finding result then says
nothing about the pair. Behind `--jev` or `--deem` the script scores one backend's
same-or-different judgment against the operator's labels. The default run makes no
model call and writes no file.

### Why This Matters

The merge decides what happens to every candidate duplicate pair, so its own behavior
under both deduplication settings is the first thing the replay shows. The labels then
let an operator judge a backend against gold instead of trusting either side. No
verdict line is claimed here, because no run has printed one.

---

## 2. HOW IT WORKS

With no switch the script is a census only. It walks the tracked
`{research,review}/lineages/<label>/` registries into runs keyed `<loop>:<runDir>`,
keeps the runs with at least two lineages, classifies each candidate pair, and prints
`runs: research=<n> review=<n>`, `pairs: research=<n> review=<n>`,
`class near-line: research=<n> review=<n>`, `class cross-body: research=<n> review=<n>`,
one `merge decisions: <class> <loop> dedup-on same=<n> different=<n> dedup-off same=<n> different=<n>`
line per class and loop, `title rule: <loop>=<n> of <n> findings carry a title` and
`body fields: <loop>=<n> of <n> findings carry a body field` for each loop, and
`merge undecidable: <n>`. Each `merge decisions:` line counts what the merge's own
collapse does to those pairs under each deduplication setting.

`--write-pair-sheet <path>` writes one JSONL row per pair, at most the first 60 of
each class in ascending SHA-256 of the pair key, each row carrying both findings'
text, their lineages, the run path and an empty `label` for the operator to fill with
`same` or `different`. A path resolving inside the repository prints
`refusing to write the pair sheet inside the repository`, exits 2 and writes no file.
`--labels <file>` reads the filled sheet back, a bad row prints `labels row <n>: ...`
and exits 2, and a pair key the census no longer sees is dropped and counted in the
report. The label gate then prints one line: `stop: fewer than 40 labeled pairs`,
`stop: fewer than 10 labeled cross-body pairs`, `no headroom` when the merge's own
decisions are already right on more than nine pairs in ten, or
`planned calls: jev <n>, deem <n>`. A gate stop is a completed run at exit 0.

Behind `--jev` or `--deem`, one arm scores that backend on the labeled pairs, and a
model arm without its required `--out <dir>` prints
`<switch> needs --out <dir> so every call is recorded` and exits 2. With both switches
the Jev gate and arm run first, then the Deem gate and arm, each on its own gate and
regardless of the other's outcome, and a failing gate prints one skip line and never
runs the other backend in its place: `jev arm skipped: jev not on PATH`,
`jev arm skipped: version`, `jev arm skipped: no credential`, `deem arm skipped: <reason>`
such as `stub backend`, or `<backend> arm skipped: label gate` and
`<backend> arm skipped: no headroom` below the label gate. Each pair is asked
`Do these two findings describe the same problem?` three times as AB, BA and AB on Jev
and twice as AB and BA on Deem, every call recorded in `<out>/calls.jsonl` and the run
in `<out>/report.json`. The Keep Rule then decides in order: coverage `10*M >= 9*K`
else `stop (coverage)`, kill when the exact `P(X>=L)` is below 0.05, margin
`10*(A-B) >= M` else `stop (margin)`, the sign test `P(X>=W)` below 0.05 with `p = 1`
when `W+L = 0` else `stop (sign test)`, flips `10*F <= C` else `stop (flips)`, else
`keep`, and every verdict line it builds carries `reader=none named`. The usage line is
`usage: score-fanout-pairs.cjs [--out <dir>] [--labels <file>] [--write-pair-sheet <path>] [--jev] [--deem]`,
and the script exits 0 on every completed run including a gate stop, 2 on a bad
invocation or unreadable input, and 1 on an unexpected throw.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/score-fanout-pairs.cjs` | `walkRuns`, `selectCandidates`, `classifyPair`, `mergeDecision`, `readBaseline`, `writePairSheet`, `parseLabels`, `gateState`, `runJevArm`, `runDeemArm`, `decideVerdict`, `main()` (guarded behind `require.main === module`); calls the merge's own functions from `fanout-merge.cjs`, which stays unchanged |

### Validation

| File | Role |
|---|---|
| `tests/unit/score-fanout-pairs.vitest.ts` | 42 tests: the walker (3), the selection (7), the merge oracle (6), parity (2), the sheet, labels and gate (7), the Jev gate and arm (5), the Deem gate and arm (5), and the keep rule and report (7), on temp fixture registries with stub `jev` and `cli-deem` binaries first on PATH |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Feature ID: F059
- Catalog source: `feature-catalog/fanout/fanout-pair-replay.md`
- Primary source files: `scripts/score-fanout-pairs.cjs`
Related references:
- [fanout-merge.md](../../feature-catalog/fanout/fanout-merge.md) - Fan-out cross-lineage merge
