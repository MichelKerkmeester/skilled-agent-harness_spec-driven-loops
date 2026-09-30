---
title: "Debug next check"
description: "Scores, with zero model calls by default, how often each constant next-check answer is right on operator-labeled debug rows and whether that leaves headroom, then judges the labeled rows behind `--jev` or `--deem` and reports one keep, kill or stop decision per backend."
trigger_phrases:
  - "debug next check"
  - "score-debug-next-check.mjs"
  - "debug next_check choice"
  - "next-check label census"
version: 4.6.0.0
---

# Debug next check (score-debug-next-check.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Scores, with zero model calls by default, how often each constant next-check answer is right on operator-labeled debug rows and whether that leaves headroom, then judges the labeled rows behind `--jev` or `--deem` and reports one keep, kill or stop decision per backend.

The census answers two questions before anyone wires a backend pick into the debug next-check choice: does any tracked file outside the spec tree already name `next_check`, and would a backend beat the best constant answer on labeled rows. It reads only the repository's own git state and the operator fixture, makes no model call without its switch and its own gate, and writes nothing outside `--out`.

---

## 2. HOW IT WORKS

### Seam Search And Mined Corpus

Every run first lists tracked files outside `specs/` that name `next_check`, leaving out the generated trigger-phrase fixture folder and every path whose name holds `debug-next-check` (the census's own script, test and docs carry the search key), and prints one `seam: <path>` line per hit or `seam: none`. It then counts tracked `debug-delegation.md` files outside any `templates/` folder and numbered `### Hypothesis` headings under `specs/`, printing `mined: debug_delegation=<n> hypothesis_files=<n>` and `mined rows: <n>`. The repository is resolved from the script's own path, so the working directory changes nothing.

### Fixture, Constants And Gates

`--fixture <file>` reads an operator JSON Lines file outside the repository, one row per line with exactly the fields `id`, `symptom`, `claim`, `evidence`, `label` and `jev_ok`, where `label` is one of `read_code`, `run_test`, `reproduce` or `instrument`. A path inside the repository, a bad row or an unknown switch exits 2 with a stderr line before any census line. With a fixture the run prints `fixture: rows=<n> sha256=<hex>`, the label counts, one `constant <label>: <right>/<n>` line per label and `baseline: <label> <right>/<n>` for the constant that is right most often. It prints `no headroom` when that baseline is right on more than nine tenths of the rows, and `stop: fewer than 30 labeled rows` below 30 rows, and neither case calls a backend.

### Judgment Arms

Each arm runs only past the label gate and the headroom check, behind its own switch and its own gate, and with both switches the Jev gate and arm run first, then the Deem gate and arm, each regardless of the other's outcome. A failed gate prints its skip line and never runs the other backend in its place. Jev reads only rows marked `jev_ok: true`: a withheld row leaves three `unmeasured_withheld` records in `calls.jsonl` and is never sent, and with no row accepted the run prints `jev arm skipped: payload not accepted`. The Jev gate checks `jev` on `PATH`, the pinned `jev 0.6.2` and a credential, while the Deem gate reads `cli-deem health` and skips a `stub` backend. Each arm asks `What is the cheapest way to confirm or rule out this hypothesis?` in three option orders per row and takes the modal pick, and Deem plans three calls per row.

### Keep Rule And Verdict

Before the first call the run prints `keep rule: coverage 10*M>=9*K, kill P(X>=L)<0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M`, and those checks run in that order with the first failure deciding. Only a completed arm prints a `verdict` line, the same line lands in the column of `report.json`, and no run has printed one yet. With `--out <dir>` every run writes `report.json`, even a stopped one, and an arm adds `calls.jsonl`, one record per call and per withheld row and order, never row text. A printed census, a skipped arm and a stopped arm all exit 0.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Script | Runs the seam search and the mined corpus, reads the fixture, prints the constants, the gates and the keep rule, and drives both judgment arms |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | Vitest | Thirty cases over synthetic fixtures, with stub `jev` and `cli-deem` binaries first on the path |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/debug-next-check.md`

Related references:
- [completion-claim-audit.md](completion-claim-audit.md) - the entry before this one in the category
- [alignment-suggestion-measurement.md](alignment-suggestion-measurement.md) - the entry after this one in the category
