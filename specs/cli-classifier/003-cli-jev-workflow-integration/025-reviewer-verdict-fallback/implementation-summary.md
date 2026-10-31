---
title: "Implementation Summary: Phase 25: reviewer-verdict-fallback"
description: "Complete at the operator's label gate. score-verdict-fallback.cjs replays the reviewer scorer's own extractVerdict over the reviewer fixtures, operator-named outputs and reviewer reports with zero model calls, prints two zero-call baselines and stops at stop: fewer than 12 labeled regex-miss outputs, and its 31 tests cover both arms on logging stubs. Built and committed as d657558a2e."
trigger_phrases:
  - "reviewer verdict fallback summary"
  - "reviewer verdict fallback status"
  - "score-verdict-fallback planned"
  - "reviewer fallback results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback"
    last_updated_at: "2026-09-29T19:05:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Closed the phase at its label gate and recorded the build evidence in the phase docs"
    next_safe_action: "Operator: label 12 regex-miss outputs covering all three verdicts, then order a live run"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-025-reviewer-verdict-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 25: reviewer-verdict-fallback

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-reviewer-verdict-fallback |
| **Status** | Complete |
| **Completed** | 2026-09-29, at the operator's label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many recorded reviewer outputs the reviewer scorer's verdict regex misses, which of the fixtures, an operator-named outputs file or a reviewer report they come from, and how two zero-call rules do on the misses. Past a label gate of 12 labeled misses with each verdict present, a Jev arm and a Deem arm each ask one `choice` over `pass`, `fail` and `block` per miss in three option orders and print one verdict per column under the Keep Rule in `spec.md` section 4. The phase closes at the label gate, so no model run, no verdict line and no `--grader` wiring exist.

### Phase 25: reviewer-verdict-fallback

**The census.** `lib/score-verdict-fallback.cjs` (1,429 lines) imports `extractVerdict` from `reviewer-scorer.cjs` unchanged, merges each visible and hidden fixture case as `applyCase` does, replays the regex over every recorded `reviewer_output`, keeps only the misses and counts `per_test[].verdictMethod` in each named `reviewer-report.json`. A case without a recorded output is counted as `no recorded output` and never dispatched, because the scorer would send it to a live model (`reviewer-scorer.cjs:192`). From the final state, with logging stubs for `cli-deem` and `jev` first on `PATH`:

```text
fixture cases: 8 hits: 8 misses: 0
labeled: 0 (pass 0, fail 0, block 0)
baseline majority: pass right 0 of 0
baseline loose: right 0 of 0
baseline method: loose right 0 of 0
baseline unknown: right 0 of 0
question: Which verdict does this reviewer output give?
options: 3 sha256=6c5e221169decec88acef0f7f10d22b413b98cdaae775807e8587341b6b1f771
orders: 3, name order then rotated left by 1 and by 2
margin: 0.10
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M
power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031
stop: fewer than 12 labeled regex-miss outputs
```

Exit 0, no file written, and neither stub log was created. The gate order is fixed: fewer than 12 labeled regex-miss outputs, then `stop: no labeled <verdict> output`, then `no headroom` above 0.90 baseline accuracy, else `planned calls:`.

**The baselines and the label gate.** On the labeled misses the script prints the labels' majority class, a loose last-word rule that takes the last whole word `pass`, `fail` or `block` case-insensitively, the better of the two as the baseline method, and `unknown` for reference. The outputs file is JSONL with `id`, `output` and `label`, an optional `expectedVerdict` is kept and never scored, and a bad label exits 2 naming the row. Below the gate no arm opens.

**The arms.** `--jev` runs its gate and arm first, then `--deem`, each on its own switch and checks with no failover. `--deem` with a stub health reporting backend `stub` adds only `deem arm skipped: stub backend`; `--jev` with a stub `auth status --provider official` exiting 3 adds only the identity line and `jev arm skipped: no credential`; each exits 0 with the rest of stdout byte-identical to the census. `--deem` or `--jev` without `--out <dir>` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call. A run with either switch writes `report.json` under `--out`; a run past the gate also appends `calls.jsonl`, one line per call with `wallMs`, `exitCode`, `pick`, `pickProb` and the Deem commit pair or the Jev version, provider and model. Jev needs `--accept-payload` for an untracked outputs file.

**The tests.** `tests/verdict-fallback.vitest.ts` (941 lines, 31 cases) covers each public surface with a happy path and an edge case: the visible and hidden fixture merge, a case with no recorded output, the outputs parser with a bad label, the reports reader, 11 labeled misses and a missing `block` label at the gate, the loose baseline, `no headroom`, the bare run whose stubs log nothing, the Deem and Jev gates and their skip lines, the payload rule, `--out` missing, the requalify line and the verdicts `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (flips)` on stub answers.

**The docs (parent D6, through sk-doc).** `lib/README.md` and `tests/README.md`, `SKILL.md` (version 1.19.0.0) and `README.md`, `changelog/v1.19.0.0.md`, the catalog entry `feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md` with its index rows, and the playbook scenario `manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md` (MB-052) with its index rows. Each passed `validate_document.py`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Created | Census, two zero-call baselines, labels and gate, both arms and one verdict per column, 1,429 lines. Briefs c1 to c10, c6f, c11f |
| `scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | Created | 31 cases over every public surface with logging stubs, 941 lines. Briefs c1 to c10, c1b, c11g |
| `scripts/model-benchmark/lib/README.md` | Modified | The script's key-files row and the corrected entrypoint and Imports rows. Brief d11, fix f1 |
| `scripts/model-benchmark/tests/README.md` | Modified | The new test file's row and the suite totals, 205 across 14 to 236 across 15. Brief d12 |
| `deep-improvement/SKILL.md` | Modified | The scoring bullet names the offline census and its gate; version to 1.19.0.0. Brief d13 |
| `deep-improvement/README.md` | Modified | One line naming the script and its switches. Brief d14 |
| `deep-improvement/changelog/v1.19.0.0.md` | Created | The next changelog entry. Brief d15 |
| `deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md` | Created | One catalog entry, version 1.19.0.0. Brief d16 |
| `deep-improvement/feature-catalog/feature-catalog.md` | Modified | The index block and the category row, 5 to 6 features. Brief d17, fix f3 |
| `deep-improvement/manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md` | Created | Scenario MB-052 covering the census and a stub-backend skip. Brief d18 |
| `deep-improvement/manual-testing-playbook/manual-testing-playbook.md` | Modified | The index block under section 15, covers 7 to 8, subtotal 46 to 47. Brief d19, fix f2 |
| `.hermes/skills/deep-improvement/SKILL.md` | Regenerated | The sync run's copy of `SKILL.md`, 72 copies in sync |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs and evidence, untracked |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |

`d657558a2e` feat(deep-improvement): measure a model fallback for missed reviewer verdicts holds 12 files: the script and its test, the nine docs and the Hermes copy. Not pushed. `reviewer-scorer.cjs`, the reviewer fixtures, `reviewer-regression.json`, `reviewer-schema.md` and the two workflow YAML files are unchanged, so every reviewer benchmark behaves as today.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/`, ran the build through CLI executors and verified each result itself. Code steps c1 to c5 and the fixture fix c1b ran on Devin `deepseek-v4-1-flash-max`; Devin's daily quota ran out at step c6 before it wrote anything, so c6 went to Pi `llmgateway/mimo-v2.6-pro` (1,548 s) and c6f to c10 to DeepSeek V4.1 Flash on Cline, each exit 0 with `STATUS: DONE`. Doc steps d11 to d19 ran on Pi MiMo from a facts file the session built from its own runs. Parent D5, amended the same day, allows only DeepSeek V4.1 Flash or MiMo v2.6 Pro to write, with no Claude leaves.

One step deviated from the design. After c6 the test check failed 4 of 16: `main([])` exited 2 with `ENOENT`, because the shipped profile names `fixtureDir` repository-relative and `loadFixtureCases` tried only the working directory and the profile's folder, as the sibling `reviewer-scorer.cjs` does, so it worked only from the repository root. Fix c6f adds a repository-root step between the two, a superset of the sibling's order.

The session then reran the proof plan from the final state, with logging stubs for `cli-deem` and `jev` first on `PATH`. The default run exits 0 and prints `fixture cases: 8 hits: 8 misses: 0`, both baselines, `margin: 0.10`, the keep rule, the power line and `stop: fewer than 12 labeled regex-miss outputs`; the stub log was never written. `--deem --out <dir>` against a stub health reporting backend `stub` exits 0 and adds only `deem arm skipped: stub backend`; `--jev --out <dir>` with `auth status` exiting 3 exits 0 and adds only the identity line and `jev arm skipped: no credential`; each `--out` folder holds only `report.json`, which the spec's file table allows. `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded` before any call. `git status --porcelain` was equal before and after, the key grep exits 1, and the comment hygiene checker exits 0 on the script and its test.

The suite ran from the final state: `verdict-fallback.vitest.ts` 31 of 31, `npx vitest run model-benchmark/tests/` `Test Files 15 passed (15)` and `Tests 236 passed (236)` against the pre-phase 14 files and 205 tests, and the whole deep-improvement suite `43 failed` and `395 passed` of 438 with its 46 `FAIL` names identical to 024's baseline list, so this phase adds no failure. The generators stayed fresh: `sync-skills-hermes.cjs --check` `PASS: 72 Hermes skill copies in sync`, `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`, README verdict parity `PARITY PASS`, `compiled-route-guard.cjs` exit 0, and the catalog package back to `violations=36` with none in this phase's files.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (871 s) and printed `VERDICT: FAIL` with 1 P1 and 3 P2; the P1 was that `calls.jsonl` records kept `pick` but dropped the picked key's probability, which REQ-009 takes from phase 017's REQ-008. Fix c11f adds `pickProb` to every record, from `answers.answer.probabilities` else null, and c11g pins it in the tests; the recheck prints `VERDICT: PASS` and agrees that this script's three options hold no `none` key to log. DeepSeek on Cline reviewed the docs and step 6 (354 s) and printed `VERDICT: FAIL` with 2 P1 and 2 P2: `lib/README.md` called the new script the folder's single entrypoint and called `sweep-reporter.cjs` the one intra-lib edge. Fix f1 corrects both rows; fixes f2 and f3 add the playbook's missing mentions and clear the one new catalog description warning. The recheck prints `VERDICT: PASS` with all four closed. The four remaining P2 findings are recorded, not chased (parent D5).

The session committed the build as `d657558a2e`, 12 files, not pushed. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The census imports `extractVerdict` | A copied regex could drift from the one the scorer runs, and then the census would count the wrong misses |
| The census never dispatches a case | The scorer sends a case without a recorded output to a live model, which a zero-call census must never do |
| The label is the verdict the output gives | The fallback extracts what a reviewer decided. The fixture's `expectedVerdict` is what the reviewer should have decided, a different question |
| The baseline includes a loose last-word rule | If a wider regex classifies the misses as well, R5 needs no model at all, and the keep rule should show that |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its label-gate stop from the final state is Complete, and only the operator writes labels |
| Fix every P1 and record P2 | Parent D5 as amended on 2026-09-29. The one code P1 and the two doc P1s were fixed and rechecked, and the four P2s are recorded |
| The path order gains a repository-root step | The shipped profile names `fixtureDir` repository-relative, and the sibling's order resolved it only from the repository root; the new step is a superset, so every path the sibling resolves still resolves the same way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record.

| Check | Result |
|-------|--------|
| Zero-call census, stubs first on `PATH` | Exit 0 with `fixture cases: 8 hits: 8 misses: 0`, both baselines, `margin: 0.10`, the `keep rule:` line, the power line and `stop: fewer than 12 labeled regex-miss outputs`; no file written and the stub log never created (`SE` section 2) |
| `--deem --out <dir>` with the stub health reporting backend `stub` | Exit 0, one added line `deem arm skipped: stub backend`, the rest of stdout byte-identical to the census; the `--out` folder holds only `report.json` (`SE` section 2) |
| `--jev --out <dir>` with the stub `auth status --provider official` exiting 3 | Exit 0, the identity line and `jev arm skipped: no credential`, the rest byte-identical; only `report.json` written (`SE` section 2) |
| `--deem` without `--out` | Exit 2 with `--deem needs --out <dir> so every call is recorded`, before any call (`SE` section 2) |
| `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` | `Tests 31 passed (31)`, exit 0, against REQ-011's floor of 16 (`SE` section 2) |
| `npx vitest run model-benchmark/tests/` | `Test Files 15 passed (15)`, `Tests 236 passed (236)`, exit 0, against the pre-phase 14 files and 205 tests (`SE` section 2) |
| Whole deep-improvement suite | `43 failed`, `395 passed` of 438; the 46 `FAIL` names are identical to 024's baseline list, so this phase adds no failure (`SE` section 2) |
| Key grep and porcelain | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script exits 1, no match; `git status --porcelain` equal before and after every run; the comment hygiene checker exits 0 on the script and its test (`SE` section 2) |
| `validate_document.py` on the nine changed docs | Exit 0 on each, including the catalog root with `--type feature_catalog` and the playbook root with `--type playbook` (`SE` section 3 and `logs/review-docs-ds.last.txt`) |
| Generators and packages | `sync-skills-hermes.cjs --check` `PASS: 72 Hermes skill copies in sync`; catalog package `violations=36`, none in this phase's files; playbook package `violations=0 warnings=1`; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; `compiled-route-guard.cjs` exit 0 (`SE` section 4) |
| Cross-family review | Pi MiMo on the code `VERDICT: FAIL` (871 s, 1 P1, 3 P2) closed by c11f and c11g, recheck `VERDICT: PASS`; DeepSeek on Cline on the docs and step 6 `VERDICT: FAIL` (354 s, 2 P1, 2 P2) closed by f1 to f3, recheck `VERDICT: PASS`; 4 P2 findings recorded. SHA-1 over each review's files equal before and after (`SE` section 3) |
| Build commit | `d657558a2e` feat(deep-improvement), 12 files, not pushed, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0: `graph-metadata.json` rewritten, `description.json` unchanged; the `_memory` blocks are written by hand and left as recorded |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, exit 0 |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3403`, at or under 4000; `packet_budget=unknown` by design for a phase child; exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and everything after them waits.** No recorded reviewer output misses the regex (8 fixture cases, 8 hits, 0 misses), so the census prints `stop: fewer than 12 labeled regex-miss outputs` and no arm calls. T016 and T017 wait on at least 12 labeled misses with each verdict present, and parent D4 puts that outside this phase's completion.
2. **A live Deem run needs the labels.** After 12 labeled misses: `node score-verdict-fallback.cjs --outputs <file> --deem --out <dir>`. No model was called in this build: every run used the logging stubs.
3. **A live Jev run needs the labels and the operator's yes.** T017, plus `jev` 0.6.2, a credential the `auth status` check resolves, and `--accept-payload` when the outputs file is untracked. The build never waits for the flag.
4. **Serving is not in this phase.** A `keep` wires nothing: a classifier value for `--grader` needs a later phase the operator opens (goal D5).
5. **The power is low.** 12 labeled misses allow a keep only with at least 5 discordant wins and no loss, as the power line prints.
6. **4 review P2 findings are recorded, not fixed** (parent D5): the `USAGE` comment says the line prints when the run cannot start, but no path prints it; the Jev version gate compares only the first stdout line to `jev 0.6.2`; the test named "a bad label exits 2 naming the row" asserts only that `parseOutputs` throws and never runs `main`; and the deep-improvement `README.md` frontmatter stays at 1.17.0.38 and the playbook root at 1.17.0.44 while the release is 1.19.0.0, drift that predates this phase.
7. **The path resolution deviates from the design.** Design section 2 said to resolve `fixtureDir` as `reviewer-scorer.cjs:73-86` does; fix c6f adds a repository-root step between the working directory and the profile's folder, a superset of the sibling's order, because the shipped profile names `fixtureDir` repository-relative and the check failed 4 of 16 without it.
8. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record, and both reviewers reviewed against the tree and the session's logs.
9. **Premise corrections at close.** `spec.md`'s Status and description now say Complete and commit `d657558a2e`, its changelog cell names `v1.19.0.0.md` in place of the planning-time `v1.9.0.0.md`, and `plan.md`'s builder roster now states parent D5 as the operator amended it on 2026-09-29, with no Claude leaves.
10. **`../changelog/` has no directory.** `spec.md`'s Changelog note finds no parent changelog to refresh at close, and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
