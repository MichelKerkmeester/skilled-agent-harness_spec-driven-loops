---
title: "Goal: Phase 21: dsh-remaining-direct-writers"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh remaining direct writers goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/021-dsh-remaining-direct-writers"
    last_updated_at: "2026-11-15T05:44:33Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 21: dsh-remaining-direct-writers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every row the post-dispatch validator and the write-containment guard write on a ledger-backed deep-loop state log survives the next projection refresh and the executor check finds the executor on the iteration's opening row there. A state log with no ledger beside it behaves as today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator asked on 2026-11-15 to fix all five items phase 020 left open, reusing phase 020's `appendFailureRow` rather than a copy of it |
| D2 | Review carries the three rows whole under the existing `deep_review.iteration_recorded` stem. Research gets three new reducer-read stems, `deep_research.verification_degraded`, `deep_research.containment_violation` and `deep_research.containment_contested` |
| D3 | A diagnostic write never throws: with no session id or a gateway refusal, the row is written directly and stderr says the next refresh drops it |
| D4 | The executor check accepts the opening row only on a ledger-backed state log |
| D5 | The research prompt pack changes in one sentence only |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  18 passed (18)`, and `7 failed | 11 passed (18)` with the nine source files at `HEAD`
- [x] `npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/check-ledger-stem-producers.vitest.ts` in the same folder prints `Tests  65 passed (65)`
- [x] `npm run typecheck` in the same folder exits 0, `node scripts/check-ledger-stem-producers.cjs` prints `"registered":91` and `node scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`
- [x] The full deep-loop suite fails no test in a file this phase changed or that loads a changed module, and any other failure passes when its file runs alone
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Measure | Done | The probe in `spec.md` section 2 printed `after refresh=0` for all three rows in both modes at `73a8a2d9c1` |
| Build | Done | Nine source files, four workflows, the prompt pack, two regenerated contracts and four test files, as `implementation-summary.md` lists |
| Verify | Done | Each new test failed on the old sources and passed after. The gate results are in `implementation-summary.md` |
| Release and verify | Done | 2026-11-15: the review loop protocol sentence was corrected too, v1.6.29.0 written, contracts regenerated after the version bump, and the final full suite printed 2941 passed and 8 skipped of 2949 with no failure |

### Deviations and findings

| Item | Note |
|------|------|
| Baseline had one failure | The full suite at `HEAD` printed `1 failed \| 2928 passed \| 8 skipped (2937)`. The failure is a 2 second shim timeout in `tests/stress/cli-adapter/fanout.vitest.ts`, and that file alone passed at `HEAD` |
| The validate step is declarative | `post_dispatch_validate` names `validateIterationOutputs` and runs `verify-iteration.cjs`. Each step now carries a `sessionId` key beside `dispatchReceipt`, so the documented call has the id it needs |
| The suite criterion was sharpened | The final run failed one timing test the baseline run did not, `fanout-pool.vitest.ts`, while the baseline run failed a different one. Neither loads a changed module and both pass alone, so the criterion now names that standard instead of an identical failure list |
| A static import broke plain Node loading | The first full run failed eight tests, because `write-containment.ts` is loaded without tsx by the fan-out runner and its tests and could no longer resolve `executor-audit.js`. The guard now loads the helper through a guarded top-level `import()` |
| The no-session test also fails on old code | The old guard wrote the row but printed no stderr line, and the test reads that line |
<!-- /ANCHOR:log -->
