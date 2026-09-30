---
title: "Implementation Summary: Phase 24: hallucination-grader"
description: "Complete at the operator's label gate. The runner refuses an unknown --grader with exit 2 before a profile loads, buildGraderFn throws instead of returning the mock stub, and score-d4-agreement.cjs with 32 tests prints the zero-call census and stops at stop: fewer than 30 labeled outputs. Built and committed as fb3f9c0599."
trigger_phrases:
  - "hallucination grader summary"
  - "hallucination grader status"
  - "score-d4-agreement planned"
  - "d4 grader results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader"
    last_updated_at: "2026-09-29T16:30:55Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: build commit fb3f9c0599, 6 of 6 goal criteria ticked"
    next_safe_action: "Operator: label 30 outputs, then a live Deem run and a Jev run on their yes"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-024-hallucination-grader"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 24: hallucination-grader

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-hallucination-grader |
| **Status** | Complete |
| **Completed** | 2026-09-29, at the operator's label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many benchmark outputs map to fixtures, how many fixtures carry an allowlist, how often the deterministic hallucination-flag check agrees with the operator's labels and whether a 10-point gain fits, and an unknown `--grader` value stops the runner at startup instead of scoring with the mock stub. The phase closes at the label gate, so no model run, no verdict line and no served grader exist.

### Phase 24: hallucination-grader

**The startup check.** `run-benchmark.cjs` refuses a `--grader` value outside `noop`, `mock` and `llm` before any profile loads, and `buildGraderFn` in `scorer/score-model-variant.cjs` throws for the same values instead of returning the mock stub. From the final state:

```text
$ node S/run-benchmark.cjs --profile default --outputs-dir <empty dir> --scorer 5dim --grader jev
run-benchmark: unknown --grader 'jev' (expected noop, mock or llm)
Usage: node run-benchmark.cjs --profile ... [--allow-same-family]
(exit 2)
```

The boundary with `--grader noop --output <scratch file>` exits 0 as before.

**The census.** `scorer/score-d4-agreement.cjs` (1,323 lines) beside `score-model-variant.cjs` maps each `<id>.md` or `<id>.run<k>.md` under `--outputs` to `<id>.json` under `--fixtures`, scores `deterministic/hallucination-flag.cjs` unchanged as the baseline, parses the operator's labels and prints the label gate. The run on one output per fixture (21), with stub `cli-deem` and `jev` first on `PATH`, printed:

```text
outputs: 21
matched: 21
unmatched: 0
allowlist: 0 of 21
labels: none
```

then the baseline lines, the question, `margin: 0.10`, the `keep rule:` line and the power line, and stopped at `stop: fewer than 30 labeled outputs`. Exit 0, no file written and the stub call log never created. The boundary with one output named `no-such-fixture.md` prints `outputs: 22`, `matched: 21`, `unmatched: 1`.

**The arms and the verdict.** Past the gate, `--jev` first and then `--deem`, each behind its own switch and checks (goal D5). A failed check prints one skip line, leaves the rest of the output byte-identical and exits 0, and never starts the other arm. A passing arm asks one `noul` per labeled output, Deem once and Jev three reruns with no answer cache, records every call in `calls.jsonl` and prints one line per column under the Keep Rule fixed in `spec.md` section 4:

`verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f|n/a> p_win=<p> p_loss=<p> labels_sha256=<hash>`

Only a verdict from a live `--out` run counts. None ran here: every arm check, skip and verdict in this build came from the logging stubs in the tests.

**The tests.** `tests/d4-agreement.vitest.ts` (741 lines, 32 cases) covers each public surface with a happy path and an edge case: the output-to-fixture map with an unmatched output, the labels parser with a bad value, the class gate, the deterministic baseline on an unlisted flag, `no headroom` and `planned calls:`, a default run whose stubs log nothing, both gates with byte-identical skips, the payload gate, `--out` missing and the verdict cases `keep`, `kill`, `stop (margin)`, `stop (coverage)` and a Jev `stop (flips)`. `run-benchmark-hardening.vitest.ts` and `scorer.vitest.ts` hold one case each for the exit 2 and the throw.

**The docs (parent D6, through sk-doc).** `SKILL.md` (version 1.17.2.0 to 1.18.0.0), `README.md`, `changelog/v1.18.0.0.md`, the catalog entry `feature-catalog/scoring-system/hallucination-grader-agreement.md` with its index rows, the grader sentence of `feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md`, and the playbook scenario `manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md` with its index rows, plus the scorer and tests README rows. Each passed `validate_document.py`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/model-benchmark/run-benchmark.cjs` | Modified | The `VALID_GRADERS` guard: exit 2 naming the value with the usage line before any profile loads. Brief 01 |
| `scripts/model-benchmark/scorer/score-model-variant.cjs` | Modified | `buildGraderFn` throws for a kind outside `noop`, `mock` and `llm`. Brief 02 |
| `scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Created | Census, deterministic baseline, labels and gate, both gates and arms and one verdict per column, 1,323 lines. Briefs 03 to 13 |
| `scripts/model-benchmark/tests/d4-agreement.vitest.ts` | Created | 32 cases over every public surface with logging stubs, 741 lines. Briefs 03 to 13 |
| `scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts` | Modified | The unknown-grader exit-2 case. Brief 01 |
| `scripts/model-benchmark/tests/scorer.vitest.ts` | Modified | The `buildGraderFn` throw case. Brief 02 |
| `deep-improvement/SKILL.md` | Modified | The scoring line names the startup check and the offline measurement; version 1.17.2.0 to 1.18.0.0. Brief e1 |
| `deep-improvement/README.md` | Modified | One sentence in the Lane B paragraph naming the measurement. Brief e2 |
| `scripts/model-benchmark/scorer/README.md` | Modified | The script's tree line and table row. Brief e3 |
| `scripts/model-benchmark/tests/README.md` | Modified | The new file's row and the totals, 158 across 12 to 205 across 14. Brief e4 |
| `deep-improvement/changelog/v1.18.0.0.md` | Created | The next changelog entry. Brief 14 |
| `deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md` | Created | One catalog entry. Brief 15 |
| `deep-improvement/feature-catalog/feature-catalog.md` | Modified | The index rows. Brief 17 |
| `deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md` | Modified | The grader-selection sentence names the exit. Brief 18 |
| `deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md` | Created | The scenario covering the exit, the census and a stub skip. Brief 16 |
| `deep-improvement/manual-testing-playbook/manual-testing-playbook.md` | Modified | The index rows. Brief 19 |
| `.hermes/skills/deep-improvement/SKILL.md` | Regenerated | The sync run's copy of `SKILL.md` |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: briefs, baselines, logs and evidence |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |

`fb3f9c0599` feat(deep-improvement): refuse unknown graders and measure D4 grader agreement holds 17 files: the runner guard and the grader throw with their two test additions, the scorer and its test, the 10 docs and the Hermes copy. Not pushed. No benchmark fixture, deterministic check, profile or grader harness file changed, so the benchmark behaves as before except for an unknown grader kind.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. A build orchestrator leaf (Opus 5.5 xhigh, under parent D5 as it stood before the 2026-09-29 amendment) captured the baseline in `scratch/w4-build/baseline/` and ran briefs 01 to 19 from `scratch/w4-build/briefs/`: Devin `deepseek-v4-1-flash-max` for the code (01 to 13) and Pi `llmgateway/mimo-v2.6-pro` at `high` for the docs (14 to 19), each exit 0 with a `STATUS: DONE` handback. The operator then said "Dont use opus", chose "Stop them now" and "No Claude leaves", and the session stopped the leaf before it wrote its build record. Four docs the spec names were still unchanged: the packet `SKILL.md`, its `README.md`, and the scorer and tests READMEs. The session wrote a FACTS block read from the code (`scratch/w4-session/docs/facts.txt`) and four doc briefs, run through Pi: `e1` (141 s), `e2` (130 s), `e3` (159 s) and `e4` (235 s), each exit 0 with `STATUS: DONE`. Parent D5 now says only Devin and Pi write.

The session then reran the proof plan from the final state, with stub `cli-deem` and `jev` binaries that log every call first on `PATH`. Proof 1: `--grader jev` exits 2 with `run-benchmark: unknown --grader 'jev' (expected noop, mock or llm)` and the usage line, and `--grader noop` exits 0. Proof 2: the census prints `outputs: 21`, `matched: 21`, `unmatched: 0`, `allowlist: 0 of 21`, `labels: none`, the baseline lines, the question, `margin: 0.10`, the keep-rule line, the power line and `stop: fewer than 30 labeled outputs`, and the stub call log is never created. Proof 3: `--deem` with a stub health reporting backend `stub` prints `deem arm skipped: stub backend`, and `--jev` with a stub `jev` that prints `jev 0.6.2` and exits 3 on `auth status` prints `jev: path=<stub>/jev provider=official` and `jev arm skipped: no credential`, each exit 0 with only `report.json` in the `--out` folder. Proof 4: `npx vitest run model-benchmark/tests/` prints `Test Files 14 passed (14)`, `Tests 205 passed (205)` against the baseline `13 passed`, `171 passed`, and the whole deep-improvement suite's 46 `FAIL` lines are identical to `baseline/full-suite-fail-names-before.txt`. Proof 5: `git status --porcelain` is equal before and after the census runs and the secret grep exits 1. Proof 6 needs 30 operator labels and stays open. `validate_document.py` exited 0 on all 10 changed docs, the comment hygiene checker exited 0 on the scorer, its test, `run-benchmark.cjs` and `score-model-variant.cjs`, and the generators and hub came out fresh.

It sent the code and the docs to a second model family for review, split by author family and read only, with the SHA-1 over the 16 reviewed files `3c047811adb3fc819f4b4faa3200249b8eb4e850` unchanged before and after both runs: Pi MiMo on the code Devin wrote (870 s) `VERDICT: PASS` with 1 P2, and Devin DeepSeek on the docs Pi wrote (523 s) `VERDICT: PASS` with 2 P2, both marking REQ-001 to REQ-014 met and Devin running playbook scenario 5D-051 end to end. Both reviewers noted the missing `build-evidence.md` and reviewed against the diff and the tree. The 4 P2 findings were recorded and not chased (parent D5). The session committed the build as `fb3f9c0599`, and after the commit `compiled-route-guard.cjs` reports all hubs fresh; the trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| An unknown grader kind exits 2 | A grader silently swapped for a stub changes the scores a reader trusts, and the research names this fix as R7's first step |
| The measurement lives in its own script | The runner stays byte-identical for every known grader kind, and no classifier answer can reach D4 |
| The baseline method includes the majority class | The deterministic check reads an empty allowlist today, so a fair baseline takes the better of the two |
| A Deem `noul` holds by its commit pair | A `noul` has no options to rotate, and the served model is deterministic (research C4) |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its label-gate stop from the final state is Complete, and only the operator writes labels |
| Record the review's P2 findings and fix none | Parent D5 as amended on 2026-09-29: fix P0 and P1, record P2 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The build orchestrator captured the baseline on 2026-09-29 and the orchestrator session reran the proof plan from the final state before the commit. The build orchestrator left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) is the phase's build record and `BL` is `scratch/w4-build/baseline/`.

| Check | Result |
|-------|--------|
| Unknown grader at startup | `--grader jev` exits 2 with `run-benchmark: unknown --grader 'jev' (expected noop, mock or llm)` and the usage line before any profile load; the boundary with `--grader noop --output <scratch file>` exits 0 (`SE` section 2, proof 1) |
| Zero-call census, stub `cli-deem` and `jev` first on `PATH` | Exit 0 with `outputs: 21`, `matched: 21`, `unmatched: 0`, `allowlist: 0 of 21`, `labels: none`, the baseline lines, `margin: 0.10`, the `keep rule:` line, the power line and `stop: fewer than 30 labeled outputs`; no file written and the stub call log never created. Boundary: `no-such-fixture.md` prints `outputs: 22`, `matched: 21`, `unmatched: 1` (`SE` section 2, proof 2) |
| `--deem` with the stub health reporting backend `stub` | Exit 0, one added line `deem arm skipped: stub backend`, the rest of the stdout byte-identical to the census (`SE` section 2, proof 3) |
| `--jev` with the stub `auth status` exiting 3 | Exit 0, `jev: path=<stub>/jev provider=official` and `jev arm skipped: no credential`; the stub log holds only `cli-deem health`, `jev --version` and `jev auth status --provider official` (`SE` section 2, proof 3) |
| `npx vitest run model-benchmark/tests/` | `Test Files 14 passed (14)`, `Tests 205 passed (205)`, exit 0, against the baseline `13 passed`, `171 passed` (`BL/vitest-model-benchmark-before.txt`); `d4-agreement.vitest.ts` alone `Tests 32 passed (32)` where REQ-013 asks for at least 16 (`SE` section 2, proof 4) |
| Whole deep-improvement suite | `Test Files 8 failed | 27 passed (35)`, `Tests 43 failed | 364 passed (407)` against the baseline `8 failed | 26 passed (34)`, `43 failed | 330 passed (373)`, and the 46 `FAIL` lines identical to `BL/full-suite-fail-names-before.txt` (`diff` empty), so the build adds no failure (`SE` section 2, proof 4) |
| Key grep and porcelain | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the scorer exits 1, no match; `git status --porcelain` equal before and after the census runs (`SE` section 2, proof 5) |
| `validate_document.py` on the 10 changed docs | Exit 0 on each (`SE` section 2) |
| Comment hygiene | Exit 0 on the scorer, its test, `run-benchmark.cjs` and `score-model-variant.cjs` (`SE` section 2) |
| Generators and hub | `sync-skills-hermes.cjs --check` `PASS: 72 Hermes skill copies in sync`, `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`, README verdict parity `PARITY PASS: verdict diff is empty`, `parent-skill-check.cjs .skilled/skills/system-deep-loop` all hard invariants passed (`SE` section 2) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (870 s) with 1 P2, Devin DeepSeek on the docs `VERDICT: PASS` (523 s) with 2 P2, REQ-001 to REQ-014 met; 4 P2 findings recorded. SHA-1 `3c047811adb3fc819f4b4faa3200249b8eb4e850` over the 16 reviewed files unchanged before and after both runs (`SE` section 3) |
| Build commit | `fb3f9c0599` feat(deep-improvement), 17 files, confirmed by `git show --stat` at this closure pass (`SE` section 4) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 4) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, re-deriving `graph-metadata.json`; the `_memory` block is written by hand and left as recorded |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 1` (the continuity-freshness check is not opted in), 0 lines matching `RESULT: FAILED`, exit 0 |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3681`, at or under 4000, `packet_budget=unknown` by design for a phase child, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and everything after them waits.** No benchmark output carries a label, so the census prints `stop: fewer than 30 labeled outputs` and no arm calls. T020 waits on at least 30 labeled outputs with 5 per class, and parent D4 puts that outside this phase's completion.
2. **A live Deem run needs the labels.** After 30 labeled outputs: `node score-d4-agreement.cjs --outputs <dir> --labels <file> --deem --out <dir>`. No model was called in this build: every run used the logging stubs.
3. **A live Jev run needs the labels and the operator's yes.** T021, plus `jev` 0.6.2 and a credential `jev auth status --provider P` resolves. The build never waits for the flag.
4. **Serving is not in this phase.** A `keep` wires nothing: adding a grader kind needs a later phase the operator opens, and that phase must also settle the failed grade's 0.0 (goal D5).
5. **The baseline is weak today.** No fixture carries an `allowlist`, so the deterministic check judges every output against `{}`, and a win over it says little until the owner adds allowlists (`spec.md` section 7).
6. **4 review P2 findings are recorded, not fixed** (parent D5): the `tests/README.md:49` count cell for `d4-agreement.vitest.ts` is empty (32); `tests/README.md:37,40` give `scorer.vitest.ts` 10 (11 now) and `run-benchmark-hardening.vitest.ts` 6 (8 now); `SKILL.md:222` and `README.md:108` omit the 5-per-class floor of the arm gate; and the comment above the `VALID_GRADERS` guard (`run-benchmark.cjs:587`) still describes the mock fallback `buildGraderFn` no longer has.
7. **No `build-evidence.md` and no pre-fix negative-control record.** The build orchestrator left no build record, so the session record is the build record and T008's pre-fix run was never written. This closure pass confirmed the pre-fix behavior by reading `fb3f9c0599^`'s files: no `VALID_GRADERS` guard in `run-benchmark.cjs` and a `buildGraderFn` that falls through to the mock stub (`SE` sections 1 and 3).
8. **Premise corrections at close.** This file's "Nothing is built yet" is replaced by the build record, `spec.md`'s Status and description now say Complete and commit `fb3f9c0599`, and `plan.md`'s builder roster now states parent D5 as the operator amended it on 2026-09-29: only Devin and Pi write, with no Claude leaves.
9. **`../changelog/` has no directory.** `spec.md`'s Changelog note finds no parent changelog to refresh at close, and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
