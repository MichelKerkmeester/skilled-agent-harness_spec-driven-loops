---
title: "Implementation Summary"
description: "Complete at its label gate. score-fanout-pairs.cjs prints the pair census of the recorded fan-out lineage registries with zero model calls, reports the merge's own decision on each near-line and cross-body pair with dedup on and off, writes a 60-row pair sheet outside the repository and stops at stop: fewer than 40 labeled pairs until the operator labels 40 pairs, 10 of them cross-body; past the gate its --jev and --deem arms print one verdict per backend column under the Keep Rule fixed in section 4. Its 42 tests cover both classes, the merge oracle, the label gate, both gates, the Keep Rule and the requalify lines, and no run has printed a verdict line. Built as fe84dd1899."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record"
    last_updated_at: "2026-09-30T07:30:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build committed as fe84dd1899, closed at its label gate"
    next_safe_action: "Operator: name a pair-sheet path, then label 40 pairs and 10 cross-body"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-fanout-merge-shadow-record"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A pair-sheet path outside the repository, 40 labeled pairs with 10 cross-body, then a live Deem run and a Jev run on the operator's yes"
      - "The six recorded P2 findings"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-fanout-merge-shadow-record |
| **Status** | Complete |
| **Completed** | 2026-09-30, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many cross-lineage finding pairs the tracked fan-out runs hold, how the merge's own collapse decides each near-line and cross-body pair with near-duplicate deduplication on and off, and hand the pair sheet to the operator for labels. Once the operator labels 40 pairs, 10 of them cross-body, a `--jev` or `--deem` run has one verdict per backend column waiting under the Keep Rule fixed in `spec.md` section 4. The phase closes at the label gate: no labels file exists, so every run prints `stop: fewer than 40 labeled pairs` and no verdict line has printed. No merge, registry or fan-out run changed, so every fan-out merge stays as today.

### Phase 30: fanout-merge-shadow-record

**The script.** `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` (1,826 lines, Node CommonJS, the standard library plus `require('./fanout-merge.cjs')` for its two exported merge functions) runs with `node` from the repository root. Its usage is `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs [--out <dir>] [--labels <file>] [--write-pair-sheet <path>] [--jev] [--deem]`. From the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`, the default run exits 0 in 1 s and prints:

```text
runs: research=57 review=46
pairs: research=19 review=105
class near-line: research=0 review=0
class cross-body: research=19 review=105
merge decisions: near-line research dedup-on same=0 different=0 dedup-off same=0 different=0
merge decisions: near-line review dedup-on same=0 different=0 dedup-off same=0 different=0
merge decisions: cross-body research dedup-on same=0 different=19 dedup-off same=0 different=19
merge decisions: cross-body review dedup-on same=0 different=93 dedup-off same=0 different=93
title rule: research=410 of 2233 findings carry a title
title rule: review=1026 of 1039 findings carry a title
body fields: research=690 of 2233 findings carry a body field
body fields: review=294 of 1039 findings carry a body field
merge undecidable: 12
stop: fewer than 40 labeled pairs
```

The counts read the live tree, so a later run may differ. The walker reads the tracked `{research,review}/lineages/<label>/` registries, groups them into runs keyed `<loop>:<runDir>`, keeps only runs with two or more lineages, and pairs findings across those lineages. `near-line` pairs share the merge's body key and carry a title overlap in `[0.05, 0.30)`; `cross-body` pairs differ in body and reach a title or text overlap of 0.5 or more. A pair the merge drops on one side before comparing is `undecidable` and stays out of both classes. The baseline per pair is whichever of the merge's two decisions reads more labels right, dedup off on a tie. `--write-pair-sheet <path>` writes at most 60 pairs per class in ascending SHA-256 of the pair key, each row carrying both findings' text, their lineages, the run path and an empty `label`; a path inside the repository prints `refusing to write the pair sheet inside the repository`, exits 2 and writes no file, and the sheet written outside the repository holds 60 rows. `--labels <file>` reads the filled sheet back, rejects a bad row by its row number with exit 2, and drops a key the census no longer sees. The label gate then prints one line: `stop: fewer than 40 labeled pairs`, `stop: fewer than 10 labeled cross-body pairs`, `no headroom` above 90 percent, or `planned calls: jev <3K+1>, deem <2K>`. `--jev` and `--deem` each need `--out <dir>` and run one backend behind its own gate, Jev first, then Deem (parent D1), each regardless of the other's outcome; below the gate both switches print `<backend> arm skipped: label gate`, call no stub and write only `report.json`. The Jev arm withholds a pair whose two registries are not both at `origin/main` as `unmeasured_unpublished`, and no key or credential is read or written. No real run has printed a `verdict` line, so the script claims none.

**The tests.** `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` (42 cases) runs the script against fixture lineage registries in temp directories with stub `jev` and `cli-deem` binaries first on `PATH`. It covers the walker over both research registry names and a one-lineage run, the review findings field, both classes inside, below and at the edge of their bands, the selection parity with the merge, the merge oracle with both decisions and the one-side-drop `undecidable` case, the baseline picks, the pair sheet outside and its refusal inside, both stop lines, `no headroom`, the Jev gate pass and the exit-3 skip, an unpublished pair withheld, the Deem stub-backend skip and a disagreeing pair marked `unstable`, `keep`, `kill`, `stop (coverage)` and `stop (flips)`, and one requalify case per arm. From `runtime`, `npx vitest run tests/unit/score-fanout-pairs.vitest.ts` prints `Tests 42 passed (42)`, against the goal's floor of 22.

**The docs (parent D6, through sk-doc).** `.skilled/skills/system-deep-loop/SKILL.md` (one sentence in the section 3 Backend paragraph naming the script, the 40-pair and 10-cross-body gate, both stop lines and both switches) with its regenerated Hermes copy, `runtime/README.md` (one line in the section 3 consumer paragraph), `runtime/scripts/README.md` (one table row), `runtime/changelog/v1.9.0.0.md`, the catalog leaf `runtime/feature-catalog/fanout/fanout-pair-replay.md` (Feature ID F059) with its index block in `feature-catalog.md`, and the playbook leaf `runtime/manual-testing-playbook/fanout/fanout-pair-replay.md` (DLR-059) with its index rows. `validate_document.py` exits 0 on each. The hub `SKILL.md` `version:` (3.0.1.0) and the hub changelog stay unchanged, since the release note lives in `runtime/changelog/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` | Created | The census, both pair classes, the merge oracle and baseline, the pair sheet and label reader, the label gate, both arms, the Keep Rule and the report, 1,826 lines. Briefs c1 to c9, c10f and c11f to c11i |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` | Created | 42 cases over every public surface with fixture registries and stub backends. Briefs c1 to c9 and c11f to c11i |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modified | One sentence in the section 3 Backend paragraph naming the script, the gate and both switches. Brief d3, fix f1 |
| `.hermes/skills/system-deep-loop/SKILL.md` | Regenerated | The Hermes copy of the hub `SKILL.md`, in sync |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modified | One line naming the script, its zero-call default, the label gate and both switches. Brief d2 |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modified | One row for the script. Brief d1, fix f1 |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.0.0.md` | Created | The next runtime changelog entry after 029's `v1.8.0.0.md`. Brief d4 |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` | Created | The catalog leaf, Feature ID F059. Brief d5a |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | Modified | The index H3 block, the `fanout` row and the entry count. Brief d5b |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-pair-replay.md` | Created | Scenario DLR-059 covering the census run, the label-gate stop and a stub-backend skip. Brief d6a |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | Modified | The scenario index row and the counts. Brief d6b |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md`, `deep-research.contract.md` and `deep-review.contract.md` | Regenerated | Recompiled from this phase's staged tree, since they hash the hub `SKILL.md` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` and `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json` | Regenerated | The pre-commit route-remint gate re-minted them |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs, evidence and facts, untracked |

`fe84dd1899` feat(deep-loop) holds 16 files, 3,057 insertions and 12 deletions: the script, its test, the eight docs, the Hermes copy, the three recompiled contracts and the two re-minted activation manifests. Not pushed. The trigger index follows in its own commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/` and ran the build through CLI executors. Parent D5, amended on 2026-09-29, allows only Pi writes with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The design ran on DeepSeek V4.1 Flash through Cline after Devin's daily quota ran out; code steps c1 to c9 and every code fix ran on DeepSeek V4.1 Flash through Cline, each checked by the test file, and the docs d1 to d6 ran on Pi MiMo at `high`, written from `scratch/w4-session/docs/facts.txt`.

The build's deviations are logged in `goal.md`. c1 wrote the fixtures and the three walker tests first, so its check failed 3 of 3 with `walkRuns is not a function` until c2. c7 failed 2 of 28 with `summarizeColumn is not defined`, since step C7's Jev arm calls a function step C9 adds; as in 027, c8 and c9 ran with no per-step check, then the test file once, `Tests 39 passed (39)`. A session finding carried from 033: `spawnSync` stops at a 1 MB `maxBuffer` by default and `git ls-files -z` prints 15.7 MB on this repository, so fix c10f sets `maxBuffer` on the listing call. Design step D7, the version pass, did not run: ruling 3 runs it only when `parent-skill-check.cjs` reports `13b-version`, and it reported `PASS: 13b-version: SKILL.md version 3.0.1.0 matches the newest changelog entry`, so the hub version stays as it was.

The session then reran the proof plan from the final state, with logging stubs first on `PATH` and every output in its own scratchpad. The default run exits 0 in 1 s with the census block above and `stop: fewer than 40 labeled pairs`, and the stub log was never written. `--deem --out <dir>` and `--jev --out <dir>` each added only their own `<backend> arm skipped: label gate`, called no stub and wrote only `report.json`. `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call and with no stdout. `--write-pair-sheet ./.pair-sheet.jsonl` exits 2 with `refusing to write the pair sheet inside the repository` and writes no file; outside the repository the sheet holds 60 rows. `git status --porcelain` was equal before and after, the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test. The final-state test file prints `Tests 42 passed (42)`. The runtime suite run with the staged state printed 128 files passed and 2,531 tests passed; after 029 it held 127 files and 2,489 tests, so this phase adds one file and its 42 tests and no failure.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (`review-code-pi.md`, 683 s) and printed `VERDICT: FAIL`, 1 P0, 1 P1 and 4 P2. The P0: `mergeDecision` read a one-side drop as `same`, since the merge also returns one finding when it drops a side before comparing. On the real tree all nine `same` decisions were one-side drops, so the cross-body review line moved from `same=9 different=93` to `same=0 different=93` under both settings and `merge undecidable` from 3 to 12. c11f asked the merge about each side alone first and returned `undecidable` when either side does not survive alone, c11g added the test, c11h and c11i added one requalify test per arm for the P1, and the recheck printed `VERDICT: PASS` with no new P0 or P1 (270 s). DeepSeek on Cline reviewed the docs (`review-docs-ds.md`, 380 s) and printed `VERDICT: FAIL`, 2 P1 and 4 P2, REQ-011 not met: the hub `SKILL.md` sentence named neither the gate nor a switch, and the `runtime/scripts/README.md` row named the switches but not the gate. f1 (Pi MiMo, 118 s) names the 40-pair and 10-cross-body gate, the stop lines, `--jev`, `--deem` and `--out <dir>` in both, and the recheck printed `VERDICT: PASS` with REQ-011 met across all six docs it names (109 s). The six P2 findings are recorded, not chased (parent D5).

The session committed the build as `fe84dd1899`, 16 files, not pushed. `sync-skills-hermes.cjs` wrote 1 of 72 copies and the session staged the Hermes `SKILL.md`; `recompile-contracts.sh` printed `[CONTRACT DRIFT] OK commands=3`; the staged set passed the key grep (exit 1); the pre-commit route-remint gate re-minted `system-deep-loop` and staged both manifests, and after the commit `compiled-route-guard.cjs` lists `system-deep-loop` fresh. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the baseline from the merge's exports, not a copy | A copied rule can drift from the merge. The exports are what a real run uses |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its gate stop from the final state is Complete, and only the operator labels. T016 and T017 stay `[B]`, and the completion rows were amended to carve them out |
| Two switches, one provider, no failover | Parent D1 and D5: Jev first, then Deem, each behind its own gate, and a failed gate never starts the other backend |
| `reader=none named` on every verdict | The research's promote line needs a reader, and naming one is the operator's call. A keep alone must not look like a promotion |
| Ask the merge about each side alone | The merge returns one finding for a one-side drop as well as for a real collapse, so a pair must be `undecidable` unless both findings survive alone |
| Fix P0 and P1, record P2 | Parent D5 as amended on 2026-09-29. Both review P1 findings are closed and rechecked, and six P2 findings are recorded |
| Recompile the contracts in the build commit | The three compiled deep command contracts hash the hub `SKILL.md`, and the pre-commit route-remint gate needs the staged state fresh |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the run facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Default run on the real tree, stubs first on `PATH` | Exit 0 in 1 s with `runs: research=57 review=46`, `pairs: research=19 review=105`, both `class` lines, the four `merge decisions:` lines, the `title rule:` and `body fields:` lines, `merge undecidable: 12` and `stop: fewer than 40 labeled pairs`; the stub log was never written (`SE` section 2) |
| `--deem --out <dir>` and `--jev --out <dir>` below the gate, and `--deem` without `--out` | Each `--out` run adds only its own `<backend> arm skipped: label gate`, calls no stub and writes only `report.json`; `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call and with no stdout (`SE` section 2) |
| `--write-pair-sheet` inside and outside the repository | Inside the repository: exit 2 with `refusing to write the pair sheet inside the repository` and no file. Outside: exit 0 with 60 rows, every `label` empty (`SE` section 2; `facts.txt`) |
| `npx vitest run tests/unit/score-fanout-pairs.vitest.ts` from `runtime` | `Tests 42 passed (42)`, exit 0, against goal criterion 3's floor of 22 (`SE` section 2) |
| The runtime suite | 128 files passed and 2,531 tests passed, the baseline's 127 files and 2,489 tests plus this phase's one file and 42 tests, with no failure (`SE` section 2) |
| Merge diff, key grep and `git status` | `fanout-merge.cjs` has no diff, the key grep exits 1 with no match, `git status --porcelain` was equal before and after each run, and the comment hygiene checker exits 0 on the script and its test (`SE` section 2) |
| `validate_document.py` on the changed docs | Exit 0 on all eight docs (the two index files with `--type feature_catalog` and `--type playbook`), and fix f1's recheck re-read all six docs REQ-011 names (`SE` sections 2 and 3; `facts.txt`) |
| Generators and packages | `sync-skills-hermes.cjs` wrote 1 of 72 copies and the session staged the Hermes copy; `recompile-contracts.sh` printed `[CONTRACT DRIFT] OK commands=3`; `parent-skill-check.cjs` printed `OK, 0 warnings`; the catalog package reported `violations=176` with one new `packet_history_metadata` warning on the F059 line, a line every runtime entry carries; the playbook package printed `PASS ... scenarios=58 ... violations=0`, one scenario more than 029's 57; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible` (`SE` section 4) |
| Cross-family review | Pi MiMo on the code `VERDICT: FAIL` (1 P0, 1 P1, 4 P2), closed by c11f to c11i with recheck `VERDICT: PASS`; DeepSeek on Cline on the docs `VERDICT: FAIL` (2 P1, 4 P2), closed by f1 with recheck `VERDICT: PASS`, REQ-011 met. The SHA-1 over each review's files was equal before and after (`SE` section 3) |
| Build commit | `fe84dd1899` feat(deep-loop), 16 files, 3,057 insertions and 12 deletions, not pushed (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0; `graph-metadata.json` re-derived |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, `Errors: 0  Warnings: 0` |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3757`; `packet_budget=unknown` by design for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and every verdict waits.** No labels file exists. The final run prints `stop: fewer than 40 labeled pairs` and calls nothing, so T016 (a pair-sheet path the operator names outside the repository) and T017 (the gated model runs) stay `[B]`, and parent D4 puts that outside this phase's completion.
2. **No verdict line exists.** The default run and every gated run stopped at the label gate, so the Keep Rule's verdict path is pinned only on fixtures and no real column has been measured.
3. **No reader is named.** A `keep` here promotes nothing. R15's promote line waits for the operator to name who reads a shadow pair record.
4. **Serving is not in this phase.** A keep wires nothing, and any served form needs a later phase and the operator's call.
5. **Six review P2 findings are recorded, not fixed** (parent D5): `C = expected * M` leaves out the measured calls of a partly measured pair (both reviews); `nearestRank` is exported with no caller and no test; the test helper `labeledFixture` is never called; the Jev withholding check proves the registry paths exist at `origin/main` but the text sent is read from the working tree, so a tracked registry edited locally sends unpublished text (both reviews); the stub-backend skip test drives `deemGate` alone instead of comparing census bytes around it; and the Jev withholding guard reads `registries.length > 0` where both lookups must resolve, a case `main` cannot reach.
6. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record.
7. **Premise corrections at close.** `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, its deliverables and Files to Change rows name what was built, the changelog row names `v1.9.0.0.md` in place of the planning's `v1.5.0.1.md`, and its generated-copies row names the Hermes copy, the two activation manifests and the three recompiled contracts. `plan.md`'s roster states parent D5, its dependency row records 027 to 029 as Complete, and its step 7 records the gate stop. `tasks.md`'s notation carries the closure record, and its completion rows carve out T016 beside T017 (parent D4).
<!-- /ANCHOR:limitations -->

---
