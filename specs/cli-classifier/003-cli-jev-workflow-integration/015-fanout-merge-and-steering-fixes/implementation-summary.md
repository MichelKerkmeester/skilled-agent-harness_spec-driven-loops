---
title: "Implementation Summary: Fan-out Merge Under-count and Per-Iteration Steering"
description: "The fan-out merge now rebuilds a short research registry from markdown, graph and delta finding records and counts what it cannot rebuild as a gap. The three rounds' replay sources 134, 105 and 168 findings with gaps of 0, 13 and 38. A CLI lineage's loop prompt now names its steer.md by absolute path."
trigger_phrases:
  - "fanout merge fix status"
  - "steering line status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes"
    last_updated_at: "2026-09-27T21:00:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase from the build evidence; 7 of 7 AC Met"
    next_safe_action: "None; the orchestrator commits the phase docs"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should a partial rebuild replace the registry only on a zero gap, or combine with it by id"
      - "Should the kept-registry gap count only count-only iterations when structured and count-only records mix"
      - "Should steering reach native lineages through a prompt-pack token"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Fan-out Merge Under-count and Per-Iteration Steering

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-fanout-merge-and-steering-fixes |
| **Status** | Complete |
| **Completed** | 2026-09-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The fan-out merge no longer reports fewer findings than your research lineages recorded, and each CLI lineage is now told where its lead's review lives.

### Fan-out Merge Under-count and Per-Iteration Steering

**The short-registry gate.** The merge used to rebuild a lineage from its state log only when the lineage's registry was empty. Every short lineage had written a few summary findings, so its count-only findings were never rebuilt. Now a research registry holding fewer findings than its count-only `findingsCount` sum is rebuilt too. The rebuild replaces the registry's findings only when it holds more, as D3 sets.

**Delta records as a third source.** Per iteration, the merge tries markdown, then graph events, then the lineage's `deltas/iter-NNN.jsonl` `type: "finding"` records, each by exact count. The delta reader goes through the existing `requireRealDirectory` and `resolveOptionalRealFile` guards, and a symlinked delta file fails the merge closed. A line that does not parse, or a record without text, fails only that iteration's match.

**A counted gap instead of a throw.** An iteration no source matches now adds its count to `metrics.reconstructionGaps` instead of discarding the whole lineage. A kept registry records the gap even when the rebuild throws on a structured-count mismatch, the one throw that stays.

**The legacy-shaped export.** The exported `reconstructResearchRegistryFromState` keeps its old shape, because a TypeScript shadow is parity-tested against it. `main` calls the internal `rebuildResearchRegistryFromState`, which carries the gap metrics.

**The steering line.** `buildLoopPrompt` now tells a CLI lineage, before each iteration, to read `<lineageDir>/steer.md` by absolute path when it exists, to weigh it without letting it override the angle or the workflow contract, and to list it among that iteration's sources. It grants no write outside the lineage. Native lineages get no such line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modified | Short-registry gate, delta source, counted gap, legacy-shaped export. +126/-27. Commit `7de30fb16f` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | The conditional `steer.md` lines in `buildLoopPrompt`. +9/-0. Commit `7de30fb16f` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modified | Four tests: short registry rebuilt from delta records, no iteration matches, gap on a throw, symlinked delta. +205/-0. Commit `7de30fb16f` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | The `steer.md` prompt test. +14/-0. Commit `7de30fb16f` |

`7de30fb16f` touches only these four files (`git show --numstat 7de30fb16f`). The build base is `6f47c32dce`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator recorded the base and the baselines, then replayed the pre-fix merge over temp copies of the three rounds' lineages and tabulated them before any code change. Briefs 04, 05 and 06 from `scratch/briefs/` ran on cursor Grok 4.7 xhigh fast, and the orchestrator verified each diff. The first full suite failed one existing parity test, and a cross-family review by the `review` agent on Claude Opus 5.5 found no P0 or P1. Follow-up briefs 15, 14, 12 and 13 repaired the parity drift, added the missing symlink test, fixed a stale comment and made a thrown rebuild still record its gap. The orchestrator then reran the tests, the full suite and the replay, and committed the build once as `7de30fb16f`. These phase docs were closed from that evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read delta `finding` records instead of widening the markdown parser | The delta records' per-iteration counts match the state log for most count-only findings in all three rounds, while the markdown shapes vary by lineage |
| Rebuild per iteration and count the rest as a gap | One unmatched iteration used to throw, the lineage fell back to its short registry and the gap read 0 |
| Keep the registry when it holds more findings than the rebuild | Replacing 9 registry findings with 0 rebuilt ones would lose findings, as round 3 grok would |
| Keep the structured-count throw | The existing test expecting `lineage_reconstruction_failed` depends on it, and AC-005 requires that test to pass. Only markdown, graph and delta non-matches become a gap |
| Keep the exported reconstruction legacy-shaped | The TypeScript shadow at `.skilled/skills/system-deep-loop/runtime/lib/result-envelopes/legacy-shadow.ts` mirrors it and sits outside D2's file list, so the export stays as the shadow expects |
| Steer CLI lineages through `buildLoopPrompt` only | A CLI lineage runs every iteration in one subprocess from that one prompt. Native lineages use a different input and are left for a separate design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:diagnosis -->
## Diagnosis

REQ-001's table, taken before any code change. The replay of the `6f47c32dce` script over temp copies printed `001-deep-research 85 0`, `004-deep-research-expansion 74 0` and `007-classifier-deep-research 65 0`, each merge exit 0. A read-only tabulator over the committed lineages printed the rows below, and its totals equal the post-fix replay.

| Round | Lineage | Registry | Count-only sum | Unmatched iterations (findings) | After the fix |
|-------|---------|----------|----------------|---------------------------------|---------------|
| 1 (`001-deep-research`) | deepseek | 8 | 57 | none. Iteration 6 matches delta only, the rest markdown | rebuilt 57 |
| 1 | grok | 22 | 0 (structured records) | none | registry 22 |
| 1 | mimo | 55 | 55 | none, all delta | registry 55, gate not fired |
| 2 (`004-deep-research-expansion`) | deepseek | 21 | 41 | none, all delta | rebuilt 41 |
| 2 | grok | 7 | 21 | 1, 2, 3 (13). Iteration 4 delta, 5 markdown | rebuilt 8, gap 13 |
| 2 | mimo | 26 | 26 | none, all delta | registry 26 |
| 2 | swe | 20 | 30 | none. Iteration 1 markdown, 2 to 5 delta | rebuilt 30 |
| 3 (`007-classifier-deep-research`) | deepseek | 13 | 83 | 1 (12: delta holds 11) | rebuilt 71, gap 12 |
| 3 | glm | 25 (`metrics.sourceFindings` 24) | 0 | none | registry kept, counted as 24 (71 + 24 + 9 + 9 + 55 = 168) |
| 3 | grok | 9 | 35 | all 10 (35) | registry 9 kept, gap 26 |
| 3 | mimo | 9 | 0 | none | registry 9 |
| 3 | swe | 10 | 55 | none, all delta | rebuilt 55 |

Round totals after the fix: round 1 sources 134 with gap 0, round 2 105 with gap 13, and round 3 168 with gap 38.
<!-- /ANCHOR:diagnosis -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator ran every build check on 2026-09-27. `S` is `.skilled/skills/system-deep-loop/runtime`.

| Check | Result |
|-------|--------|
| Orchestrator, T001: `git merge-base --is-ancestor` for `ac156a7112` and `9fe8526284` against `6f47c32dce`, and `git diff --stat main 6f47c32dce -- S/scripts/fanout-run.cjs` | `both`; empty diff |
| Orchestrator, T002 baseline: `cd S && npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` | `Test Files 3 passed (3)`, `Tests 214 passed (214)` |
| Orchestrator, T002 baseline: `cd S && npx vitest run --no-coverage` | `Test Files 155 passed (155)`, `Tests 2708 passed \| 8 skipped (2716)` |
| Orchestrator, T003: the acceptance replay loop with the `6f47c32dce` script | `85 0`, `74 0`, `65 0`, each merge exit 0. No leftover file |
| Orchestrator, AC-002 and AC-003: `-t "short registry"` on `fanout-merge.vitest.ts` | `Tests 2 passed \| 57 skipped (59)`, exit 0 |
| Orchestrator, AC-004: `-t "no iteration matches"` | `Tests 1 passed \| 58 skipped (59)` |
| Orchestrator, AC-006: `-t "steer.md"` on `fanout-run.vitest.ts`, rerun at `7de30fb16f` | `Tests 1 passed \| 153 skipped (154)`, exit 0 |
| Orchestrator, step 07: the two new tests with the `6f47c32dce` script swapped in | `Tests 2 failed \| 57 skipped (59)`, exit 1. `cmp` after the restore printed nothing, exit 0 |
| Orchestrator, first full suite after briefs 04 to 06 | `Test Files 1 failed \| 154 passed (155)`, `Tests 1 failed \| 2710 passed \| 8 skipped (2719)`, exit 1: `result-envelopes.vitest.ts > legacy shadow parity` |
| Orchestrator, after briefs 15 and 14: `cd S && npx vitest run --no-coverage tests/unit/result-envelopes.vitest.ts tests/unit/fanout-merge.vitest.ts` | `Test Files 2 passed (2)`, `Tests 90 passed (90)`, exit 0 |
| Orchestrator, the four new merge tests with the `6f47c32dce` script swapped in | `Tests 4 failed \| 57 skipped (61)`, exit 1. Restore byte-identical |
| Orchestrator, brief 13 alone reverted (`registryCount > 0` back to `reconstructed`) | `Tests 1 failed \| 60 skipped (61)`, exit 1, "expected +0 to be 1". Restore byte-identical |
| Orchestrator, T012 final: the three test files | `Test Files 3 passed (3)`, `Tests 219 passed (219)`, exit 0. Baseline 214 + 5 |
| Orchestrator, AC-005 at `7de30fb16f`: `cd S && npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts` | `Test Files 1 passed (1)`, `Tests 61 passed (61)`, exit 0. Baseline 57 (`grep -cE '^\s*it\('` on the `6f47c32dce` file, no skip or todo) plus the 4 new tests |
| Orchestrator, T012 final: `cd S && npx vitest run --no-coverage` | `Test Files 155 passed (155)`, `Tests 2713 passed \| 8 skipped (2721)`, exit 0, 1264 s. Baseline 2708 + 5, the same 8 skipped |
| Orchestrator, T013 and T014: the final replay, then `git status --short -- 'specs/cli-jev/003-cli-jev-workflow-integration/*/research'` | `134 0`, `105 13`, `168 38`, each merge exit 0 with 0 `lineage_reconstruction_failed` warnings. Git status printed nothing, and no temp directory remains |
| Orchestrator, T015: the step 10 comment-hygiene grep over the four files against `6f47c32dce` | No output, grep exit 1 |
| Orchestrator, CHK-010: `node --check` on `fanout-merge.cjs` and `fanout-run.cjs` | Exit 0, no output |
| Reviewer, the `review` agent on Claude Opus 5.5 over the uncommitted diff | No P0 or P1; nothing in the steer line. `fanout-merge.vitest.ts` 59/59 and `-t steer.md` 1 passed at that state |
| Closure leaf, read-only: `git show --numstat 7de30fb16f` | The four files above only |
| Closure leaf, read-only: the plan's producer `rg` over `S/scripts` and the consumer `rg` over `.skilled` | Writer `fanout-merge.cjs` only; readers `synthesis-closeout.cjs`, `fanout-merge.vitest.ts` and `result-envelopes.vitest.ts` |
| Closure leaf: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0 |
| Closure leaf: `validate.sh <this phase> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, 0 `RESULT: FAILED` lines, on the final state of these docs. `AC_COVERAGE` stays an advisory: the rows cite commands and observed output, not file:line |
| Closure leaf: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0, on the final state of these docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Executor switch.** The brief index named codex gpt-5.5, at high for 04 and 05 and medium for 06. Codex hit its usage limit, so all seven briefs ran on cursor Grok 4.7 xhigh fast, and the orchestrator verified each diff the same way.
2. **A full-suite regression and its repair.** Brief 04 added `sourceFindings` and `reconstructionGaps` to the exported reconstruction, and the legacy shadow parity test failed. The shadow is outside D2's file list, so brief 15 restored the export's legacy shape instead of editing the shadow.
3. **Five new tests, not three.** The review's gaps added the throw-gap test (brief 13) and the symlinked-delta test (brief 14).
4. **"short registry" selects two tests.** Brief 04's no-match title holds the phrase, so `-t "short registry"` runs 2 tests and brief 05's expected `grep -c` of 1 prints 2. Both tests are intended.
5. **T005 order.** The short-registry test was written with the delta reader in brief 05, not before it. Its failure on the pre-fix script was proven afterwards.
6. **Stale premises corrected.** The 11-line `fanout-run.cjs` difference from `main` was gone at the base. The `buildLoopPrompt` call site is `fanout-run.cjs:3267` at `6f47c32dce`, not `:3260`. The convergence check is at `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:347-359`, not in `deep-research-auto.yaml` or `deep-research-confirm.yaml`, and D2's wording was amended to say so. `../changelog/` does not exist, so there was nothing to refresh. Each is corrected in `spec.md`, `plan.md` and the `goal.md` log.
7. **Missing registry with no match.** A missing-registry lineage whose iterations all go unmatched used to throw and be skipped with a warning. It now merges with 0 findings and a counted gap, which is REQ-004's intent. REQ-002's "keeps today's behavior" still holds when evidence matches.
8. **Briefs kept.** CHK-051 asks for a clean `scratch/`. `scratch/briefs/` stays as the record the executors built from, as in phases 012 to 014.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Owner item: the kept-registry gap undercounts on mixed records.** The gap is the count-only sum minus the whole registry count, so it reads low when structured and count-only iterations mix. It is AC-004's own formula, and no committed lineage mixes the two. Review P2, left unchanged.
2. **Owner design question: a partial rebuild replaces the registry.** When a rebuild holds more findings than the registry it replaces it, dropping the registry's own findings. D3 and REQ-004 require this. The owner can choose to replace only on a zero-gap rebuild, or to combine by id. Review P2, left unchanged.
3. **Owner item: delta files are checked only when a rebuild runs.** A symlinked delta in a lineage that needs no rebuild passes, because no delta file is read then (brief 05, NFR-P01). Nothing is read through the link, and the reviewer agrees it is not a bypass. Review P2, left unchanged.
4. **The no-match test asserts metrics only.** Its registry holds bare strings, which `mergeResearchRegistries` drops from `keyFindings` while `sourceFindings` still counts them. That behavior predates this phase and is out of scope.
5. **Rounds 2 and 3 stay `synthesis_incomplete`.** They still raise `state_finding_reconstruction_gap`, and their `sourceFindings` (105, 168) stay below the recorded count-only totals (118, 173). The gap is named, not closed. Round 3 grok's 26 unmatched findings are the largest share.
6. **Steering reach stays unmeasured.** No model call was allowed in this phase, so no live fan-out run checks that iterations read `steer.md`. The next real research run's iteration sources show it. Native lineages get no steering line.
<!-- /ANCHOR:limitations -->

---
