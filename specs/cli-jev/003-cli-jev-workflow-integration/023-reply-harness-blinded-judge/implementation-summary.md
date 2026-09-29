---
title: "Implementation Summary: Phase 23: reply-harness-blinded-judge"
description: "Complete at the operator's label gate. The zero-call census, the mechanical baseline on three levels, the label gate, the Deem and Jev arms with one verdict per column and 43 tests are built and committed as b5e71ae777. The census counted 42 masked files, 38 distinct replies and 38 matches, and prints stop: fewer than 20 labeled replies (0 labeled) until the operator grades 20 replies."
trigger_phrases:
  - "reply harness judge summary"
  - "reply harness judge status"
  - "judge-agreement planned"
  - "blinded judge results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge"
    last_updated_at: "2026-09-29T16:06:52Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: build commit b5e71ae777, 6 of 6 goal criteria ticked"
    next_safe_action: "Orchestrator commits the phase docs and rebuilds the trigger index. The operator grades 20 replies, then a live Deem run and, on their yes, a Jev run"
    blockers: []
    key_files:
      - ".skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs"
      - ".skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/build-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-023-reply-harness-blinded-judge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 23: reply-harness-blinded-judge

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-reply-harness-blinded-judge |
| **Status** | Complete |
| **Completed** | 2026-09-29, at the operator's label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many masked reply-harness replies exist, how many are distinct and matched to committed reply files, how the mechanical scores map to three levels and whether a 10-point gain over that baseline fits. The phase closes at the label gate, so no model run, no verdict line and no served judge exist.

### Phase 23: reply-harness-blinded-judge

**The census.** `judge-agreement.mjs` in `.skilled/skills/sk-communication/benchmark/reply-harness/` (1,479 lines) joins each `--masked` directory to the `--replies` files by SHA-256 of the reply text, spawns `score.mjs` unchanged for the mechanical baseline, maps each `dimensionScores` value to `absent`, `partly met` or `fully met` and prints the label gate. The run on the three committed blind runs and their six replies directories, with stub `cli-deem` and `jev` first on `PATH`, printed:

```text
masked: 42
distinct: 38
matched: 38
unmatched: 0
no baseline: 1
questions sha256: 4267a28cadb34517a42d8ff5ffedba34d06ae194638e3780e3f724ef76501a47
baseline: score.mjs dimension scores, 0 = absent, 1 = fully met, between = partly met
baseline levels: absent=65 partly met=20 fully met=174
labels: none
labeled: 0
baseline agreement: n/a
margin: 0.10
keep rule: coverage 10*M >= 9*K, then kill when p_loss < 0.05, then margin 10*(A-B) >= 7*M, then sign test p_win < 0.05, then for jev flips 10*F <= 21*M
power: a keep needs at least 5 wins with no loss, 0.5^5 = 0.03125 < 0.05
stop: fewer than 20 labeled replies
```

Exit 0, no file written and both stub logs empty. The `no baseline: 1` line is one reply whose file the baseline could not score: dispatch 06b made a missing or empty reply file cost only that reply its baseline and let the census continue.

**The arms and the verdict.** Past the gate, `--jev` first and then `--deem`, each behind its own switch and checks (goal D5). A failed check prints one skip line, leaves the rest of the output byte-identical and exits 0, and never starts the other arm. A passing arm asks one rubric `score` per graded reply and dimension, Deem once per cell and Jev three reruns per cell with no answer cache, records every call in `calls.jsonl` and prints one line per column under the Keep Rule fixed in `spec.md` section 4:

`verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f|n/a> p_win=<p> p_loss=<p> labels_sha256=<hash>`

Only a verdict from a live `--out` run counts. None ran here: every arm check, skip and verdict in this build came from the logging stubs in the tests.

**The tests.** `judge-agreement.test.mjs` (920 lines, 43 `node:test` cases) covers each public surface with a happy path and an edge case: the census join with a reply edited after masking, the labels parser with a missing dimension and a same-reply conflict, the baseline mapping and its `no baseline` stand-in, 19 graded below the gate, `no headroom` on a saturated fixture, both stub gates with byte-identical prefixes, the payload gate for an untracked masked directory, `--deem` without `--out` exiting 2 before any read and the verdict cases `keep`, `stop (margin)`, `kill`, `stop (coverage)` and a Jev `stop (flips)`.

**The eight docs (parent D6, through sk-doc).** The harness `README.md` row and run-order step, `SKILL.md`, the skill `README.md`, `changelog/v1.4.0.0.md`, the catalog entry `feature-catalog/evaluation-and-observability/offline-judge-agreement.md` with its index rows and the playbook scenario `manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` with its index rows. Each passed `validate_document.py`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` | Created | Census, mechanical baseline, labels and gate, both arms and one verdict per column, 1,479 lines. Briefs 01 to 12 plus 06b |
| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` | Created | 43 tests with a fixture run and logging stubs, 920 lines. Briefs 01 to 12 plus 06b |
| `benchmark/reply-harness/README.md` | Modified | One "What each piece does" row and one run-order step. Brief 13 |
| `sk-communication/SKILL.md` | Modified | One sentence naming the offline judge measurement. Brief 14 |
| `sk-communication/README.md` | Modified | One line naming the script and its switches. Brief 15 |
| `sk-communication/changelog/v1.4.0.0.md` | Created | The next changelog entry. Brief 16 |
| `feature-catalog/evaluation-and-observability/offline-judge-agreement.md` | Created | One catalog entry. Brief 17 |
| `feature-catalog/feature-catalog.md` | Modified | The index rows. Briefs 18 and 18b |
| `manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` | Created | The scenario, `cmp` equal to its draft. Brief 19 |
| `manual-testing-playbook/manual-testing-playbook.md` | Modified | The index rows, `cmp` equal to its draft. Brief 20 |
| `sk-communication/leaf-manifest.json`, `leaf-aliases.json` | Regenerated | By `ci-skill-root-metadata.cjs --fix --skill sk-communication` after review P1 1 |
| `.hermes/skills/sk-communication/SKILL.md` | Regenerated | The 020 sync run's copy, left unstaged until this commit |
| `sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Regenerated | By `test_readme_verdict_parity.py --write`, moving the harness README's verdict from fail to pass |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: briefs, baselines, logs, drafts and evidence |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |

`b5e71ae777` holds 14 files: the two scripts, the eight docs and the four generated files. No harness script, rubric, case set or release-gate file changed, so the harness and its release gate behave as before by construction.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. A build orchestrator leaf started at HEAD `bf830c3d47`, captured the baseline in `BE` section 1 and wrote the briefs into `scratch/w4-build/briefs/`. It ran dispatches 01 to 18 and 11b on the roster parent D5 set then held: Devin `deepseek-v4-1-flash-max` for the code and Pi `llmgateway/mimo-v2.6-pro` at `high` for the docs, all exit 0. The operator then said "Dont use opus" and chose "Stop them now" and "No Claude leaves", so the session stopped the leaf with its executors idle and ran the three remaining doc briefs itself through Pi: `18b-doc.md` (a sentence the catalog index edit had dropped), `19-doc.md` (the playbook scenario, `cmp` equal to its draft) and `20-doc.md` (the playbook index, `cmp` equal to its draft). Each printed `STATUS: DONE` with its checks passing. Parent D5 now says only Devin and Pi write.

The session then reran the proof plan from the final state: `proof.sh` with logging stubs first on `PATH` gave `p1 rc=0`, `p2 rc=0`, `p3 rc=0`, `p6-grep rc=1`, `p1 stub log lines: 0`, both switch runs' stdout prefixes byte-identical to the census, `p2 tail: deem arm skipped: stub backend`, `p3 tail: jev: path=<stub>/jev provider=official|jev arm skipped: no credential` and `porcelain identical: yes` (sk-communication paths compared on their own: equal). The tests ended `tests 43, pass 43, fail 0`, `validate_document.py` exited 0 on all 8 changed docs and the comment hygiene checker exited 0 on both scripts.

It sent the code and the docs to a second model family for review, split by author family and read only, with the reviewed-file SHA-1 `82857a393c75b5e3c26bddde37b55215341bf249` unchanged before and after both runs: Pi MiMo on the code Devin wrote (819 s) `VERDICT: PASS` with 4 P2, and Devin DeepSeek on the docs Pi wrote (521 s) `VERDICT: FAIL` with 2 P1 and 3 P2. Both P1 findings closed: the skill's own generator rewrote `leaf-manifest.json` and `leaf-aliases.json` (`ci-skill-root-metadata.cjs --fix --skill sk-communication`), and Pi fix brief `fix/f1.md` (128 s) appended one sentence to the playbook scenario and its index section naming `--jev` and its gate. The Devin recheck (101 s) found both closed and returned `VERDICT: PASS`, the reviewed files plus the two leaf files at SHA-1 `d6d5f8f7229af334122b5d7b3777f63565d98f61` unchanged before and after. The 7 P2 findings were recorded and not chased (parent D5). The session committed the build as `b5e71ae777`. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The baseline is the harness's own mechanical score | A judge earns its place only by agreeing with the operator more often than what the harness already computes for free |
| Replies join by text hash, not by the path in `order-sealed.json` | One committed sealed order names directories that now hold other replies, so a path join would score the wrong text |
| The sign test counts replies, not cells | The seven cells of one reply are not independent, so counting cells would overstate the evidence |
| A Deem `score` holds by its commit pair | A `score` has no option order to rotate, and the served model is deterministic (research C4) |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its label-gate stop from the final state is Complete, and only the operator writes grades |
| Record the review's P2 findings and fix none | Parent D5 as amended on 2026-09-29: fix P0 and P1, record P2 |
| A keep serves nothing | Using a judge anywhere needs a later phase and the operator's call (goal D5) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator ran the build checks on 2026-09-29 and the orchestrator session reran the proof plan from the final state before the commit. `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where they disagree, `SE` wins.

| Check | Result |
|-------|--------|
| Zero-call census, stub `cli-deem` and `jev` first on `PATH` | `p1 rc=0`, `p1 stub log lines: 0`, `masked: 42`, `distinct: 38`, `matched: 38`, `unmatched: 0`, `no baseline: 1`, `labels: none`, `labeled: 0`, `baseline agreement: n/a`, `margin: 0.10`, the `keep rule:` and power lines and `stop: fewer than 20 labeled replies`, no file written (`SE` section 2; rerun by this closure pass) |
| `--deem` with the stub health reporting backend `stub` | `p2 rc=0`, `p2 tail: deem arm skipped: stub backend`, the stdout prefix byte-identical to the census (`SE` section 2) |
| `--jev` with the stub `auth status --provider official` exiting 3 | `p3 rc=0`, `p3 tail: jev: path=<stub>/jev provider=official|jev arm skipped: no credential`, the stdout prefix byte-identical to the census (`SE` section 2) |
| `node --test judge-agreement.test.mjs` | `tests 43`, `pass 43`, `fail 0`, exit 0. Baseline: the harness shipped no test file (`BE` section 1, `SE` section 2) |
| Key grep and porcelain | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script: `p6-grep rc=1`, no match. `git status --porcelain` identical before and after the runs, sk-communication paths also compared on their own (`SE` section 2) |
| `validate_document.py` on the 8 changed docs | Exit 0 each, the catalog index with `--type feature_catalog` and the playbook index with `--type playbook` (`SE` section 2) |
| Comment hygiene | Exit 0 on `judge-agreement.mjs` and `judge-agreement.test.mjs` (`SE` section 2) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (819 s), Devin DeepSeek on the docs `VERDICT: FAIL` (521 s) with 2 P1 and 3 P2; both P1 closed and the recheck `VERDICT: PASS` (101 s). 7 P2 findings recorded. SHA-1s `82857a393c...` and `d6d5f8f722...` unchanged before and after (`SE` section 3) |
| Build commit | `b5e71ae777` feat(sk-communication), 14 files, confirmed by `git show --stat` at this closure pass (`SE` section 4) |
| Generated files | `baseline-readme-verdicts.json` rewritten by `test_readme_verdict_parity.py --write`, then `PARITY PASS: verdict diff is empty`. `sync-skills-hermes.cjs --check` lists no sk-communication drift (`SE` section 4) |
| Trigger index | Stale for the new docs: this closure pass found 0 matches for `judge-agreement` in `runtime/data/trigger-index.json`, last rebuilt at `bf830c3d47`. A rebuild follows after the commit (`SE` section 3 P2 7) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, re-deriving `graph-metadata.json`; the `_memory` block is written by hand and left as recorded (`SE` and this pass) |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, `Errors: 0  Warnings: 1` (the continuity-freshness check is not opted in), 0 lines matching `RESULT: FAILED`, exit 0 |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3451`, at or under 4000, `packet_budget=unknown` by design for a phase child, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The grades are the operator's, and everything after them waits.** 0 of 38 distinct replies are graded, so the census prints `stop: fewer than 20 labeled replies` and no arm calls. T018 waits on at least 20 graded replies, and parent D4 puts that outside this phase's completion.
2. **A live Deem run needs the labels.** After 20 graded replies: `node judge-agreement.mjs <the census switches> --labels <file> --deem --out <dir>`. No model was called in this build: every run used the logging stubs.
3. **A live Jev run needs the labels and the operator's yes.** T019, plus `jev` 0.6.2 and a credential `jev auth status --provider P` resolves. The build never waits for the flag.
4. **Serving is not in this phase.** A `keep` serves nothing: using a judge anywhere needs a later phase the operator opens (goal D5).
5. **7 review P2 findings are recorded, not fixed** (parent D5): the `jev --version` gate compares only the first line; the requalify branches are untested; the Deem exit-4 retry and mid-run commit-change stop are untested; the `jev auth test` line in `calls.jsonl` says `measured` though it holds no judgment; the changelog's keep-rule summary drops the exact kill test and the Jev flip bound; the exit-table stops (2, 3, 4, 130, timeout) and the requalify lines are untested; and the trigger index is stale for the new docs.
6. **The trigger index needs a rebuild after this commit** (P2 7). This pass found 0 matches for `judge-agreement` in `runtime/data/trigger-index.json`, last rebuilt at `bf830c3d47`.
7. **The reply set is small.** 38 distinct replies answer 7 cases from 2 models, so a verdict would describe this set only (`spec.md` section 6).
8. **Premise corrections at close.** This file's "Nothing is built yet" is replaced by the build record, `spec.md`'s Status and description now say Complete and commit `b5e71ae777`, and `goal.md`'s log records the fixture-shape difference against T003.
9. **`../changelog/` has no directory.** `spec.md`'s Changelog note finds no parent changelog to refresh at close, and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
