---
title: "Verification Checklist: Session-Id Parity Tests"
description: "Level 3 checklist for the cross-mode parity suite: green-on-truth, red-on-drift, runtime emission coverage."
trigger_phrases:
  - "parity tests checklist"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-deep-loop/007-deep-review-followup-hardening/003-session-id-parity-tests"
    last_updated_at: "2026-07-04T16:33:20.693Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Recorded implementation evidence"
    next_safe_action: "Use parity suite during future YAML edits"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/unit/workflow-session-id-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-003-parity-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Session-Id Parity Tests

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md contains REQ-001..REQ-008]
  - **Evidence**: REQ-001..REQ-004 with the contract's four pieces enumerated
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md defines structural parsing plus prompt-builder assertions]
  - **Evidence**: Contract-test pattern with structural parsing
- [x] CHK-003 [P1] Decision recorded [EVIDENCE: decision-record.md ADR-001 accepted]
  - **Evidence**: decision-record.md ADR-001 (structural over end-to-end)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Comment hygiene clean [EVIDENCE: python3 comment-hygiene checker exited 0]
  - **Evidence**: `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/skills/deep-loop-runtime/tests/unit/workflow-session-id-parity.vitest.ts` exited 0 with no output. An earlier `bash` invocation failed because the checker is a Python script despite the `.sh` extension; rerun with `python3` resolved it.
- [x] CHK-011 [P1] Assertions are structural (parsed nodes), literal only for contract tokens [EVIDENCE: findBlock/readScalar helpers scope checks to YAML nodes]
  - **Evidence**: `workflow-session-id-parity.vitest.ts` uses indentation-scoped `findBlock()` and `readScalar()` over `step_resolve_session_id`, `if_present.bind`, `if_absent.bind`, and `step_create_config.populate`; exact literals are limited to `{session_id}`, `{session_id_init}`, `{ISO_8601_NOW}`, and `{AUTO_SESSION_ID}`.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-002: suite green on the aligned current state, no YAML modified [EVIDENCE: targeted suite passed 1 file/2 tests and YAML git diff was empty]
  - **Evidence**: `npm test -- tests/unit/workflow-session-id-parity.vitest.ts` passed after restoration: 1 test file passed, 2 tests passed, duration 103ms. `git diff -- .opencode/commands/deep/assets/deep_review_auto.yaml .opencode/commands/deep/assets/deep_context_auto.yaml .opencode/commands/deep/assets/deep_research_auto.yaml` produced no output.
- [x] CHK-021 [P0] REQ-001: each drift class injected once fails with a mode-naming message; all restored [EVIDENCE: four TRUE RED drift messages recorded below]
  - **Evidence**: Drift messages observed: `review: missing step_resolve_session_id`; `context: if_present must bind session_id_init from {session_id}`; `research: if_absent must bind session_id_init from {AUTO_SESSION_ID}`; `review: config creation must consume {session_id_init} for sessionId`. All three YAML assets were restored and diff-clean.
- [x] CHK-022 [P1] REQ-003: prompt emission asserted for review, context, research [EVIDENCE: buildLoopPrompt assertion loops over all three modes]
  - **Evidence**: The new suite imports `buildLoopPrompt` from `scripts/fanout-run.cjs` and asserts `session_id:` is present for loop types `review`, `context`, and `research`.
- [x] CHK-023 [P1] REQ-004: per-mode fallbacks pinned (timestamp vs AUTO_SESSION_ID) [EVIDENCE: review fallback and context/research fallback asserted]
  - **Evidence**: Structural fallback assertions pin `review -> {ISO_8601_NOW}` and `context/research -> {AUTO_SESSION_ID}`; the research fallback injection failed with the expected mode-naming message.
- [x] CHK-024 [P0] Full deep-loop-runtime suite: 0 new failures [EVIDENCE: final full suite matched known 2-file baseline]
  - **Evidence**: Final `npm test` result: 62 test files total; 60 passed and 2 failed, 587 tests total; 585 passed and 2 failed. The only failures were the known baseline files `dependency-seams.vitest.ts` and `executor-provenance-mismatch.vitest.ts`. First full run also showed an intermittent `loop-lock.vitest.ts` failure; isolated rerun passed 12/12 and the final full rerun cleared it.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P1] All three modes covered symmetrically (no mode with weaker assertions) [EVIDENCE: MODE_CONTRACTS drives identical assertions per mode]
  - **Evidence**: `MODE_CONTRACTS` enumerates review, context, and research and runs the same resolve-step, bind, fallback, config-consumption, and prompt-emission assertions for every mode.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No secrets, no dispatch, no network
  - **Evidence**: Hermetic file + function tests; N/A by construction

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] implementation-summary.md with drift-injection evidence [EVIDENCE: implementation-summary.md verification table lists all four drift checks]
  - **Evidence**: `implementation-summary.md` authored with the four drift injections and their failure messages in the verification table.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Exactly one new test file + this spec folder; no production files touched [EVIDENCE: only one runtime test file added; YAML assets restored diff-clean]
  - **Evidence**: Only `.opencode/skills/deep-loop-runtime/tests/unit/workflow-session-id-parity.vitest.ts` was added outside the approved spec folder. The three production YAML assets were temporarily mutated only for drift injection and restored byte-clean; `fanout-run.cjs` was read but not modified.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Matches ADR-001: no dispatch tests; both contract halves covered [EVIDENCE: hermetic file/function suite only]
  - **Evidence**: Test suite is hermetic file/function testing only: it parses the YAML assets structurally and calls the exported `buildLoopPrompt` function. No deep-loop dispatch, network, or model calls run.

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P2] Suite runtime impact negligible (file parses + pure calls)
  - **Evidence**: Targeted parity suite duration was 103ms on the final green rerun.

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P2] Rollback is file deletion
  - **Evidence**: Test-only child; no production surface

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P2] No regulatory surface
  - **Evidence**: Internal tests; N/A by construction

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All five docs agree on final state [EVIDENCE: spec, plan, tasks, checklist, decision record, and summary all state test-only complete; strict validation exited 0]
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` agree that the structural contract-test decision was implemented as test-only work with 0 new runtime-suite failures. Final strict validation passed after graph metadata refresh.

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

- [x] CHK-150 [P0] Orchestrator independently re-ran the suite and drift injections [EVIDENCE: targeted, drift-red, isolated loop-lock, and full-suite reruns recorded]
  - **Evidence**: Orchestrator verification, separate from the implementer session: confirmed all three YAML assets byte-clean via git diff after the implementer's injections, re-ran the parity suite green (2/2), performed an independent fifth drift injection (renamed context's resolve step; suite failed with the exact mode-naming message "context: missing step_resolve_session_id"; restored diff-clean and green), and re-ran the full suite to the known two-failure baseline (60/62 files passing). Note: the implementer originally filled this item with its own runs; corrected because the sign-off requires verification independent of the implementer.

<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-07-02T17:16:50Z
**Verified By**: OpenCode gpt-5.5
**ADRs**: 1 documented (decision-record.md), Accepted

<!-- /ANCHOR:summary -->
