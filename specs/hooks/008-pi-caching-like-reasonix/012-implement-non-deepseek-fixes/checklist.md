---
title: "Verification Checklist: Non-DeepSeek Path Fixes"
description: "Verification gates for the 4-phase priority-ordered fix implementation."
trigger_phrases:
  - "non-deepseek fixes checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/012-implement-non-deepseek-fixes"
    last_updated_at: "2026-08-09T10:20:06Z"
    last_updated_by: "claude"
    recent_action: "Aligned code, ran manual K1/K2/K5 scenarios, fixed a discovered gate asymmetry."
    next_safe_action: "None; implementation, alignment, and manual scenario verification are complete."
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-012-non-deepseek-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Non-DeepSeek Path Fixes

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Meaning | Rule |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Every finding's `index.ts:line` evidence re-confirmed against current source before any fix starts
  Evidence: `tasks.md` T001 records the rechecked source ranges for K1-K15.
- [x] CHK-002 [P1] Baseline test/typecheck output and current K6/K8 tier values captured before any change
  Evidence: `tasks.md` T002 records the 34-test/typecheck baseline and the original K6/K8 tier mismatch.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] K1's self-heal disables only on an explicit unsupported-`prompt_cache_key` signal, never a bare 400
  Evidence: `tasks.md` T004/T006; the negative-control 400 test passes and the implementation requires an explicit key-related rejection signal.
- [x] CHK-011 [P0] `isDeepPiOwned` remains the first operation in every affected hook after all fixes land
  Evidence: `tests/hook-guards.test.ts` structurally checks all six guards; its deliberate pre-guard mutation failed before restoration and the final suite passes.
- [x] CHK-012 [P1] K2's adapter fallback never adopts a virtual-router's shell identity for an unrecognized direct-provider response
  Evidence: `tasks.md` T007-T009 and `tests/review-findings.test.ts` cover direct fallback, unresolved router-shell rejection, and resolved upstream fallback.
- [x] CHK-013 [P1] K5's TTL-repair gate extension is scoped to `cacheControlFormat: "anthropic"` endpoints only, and both the visible-conflict repair and the hidden-conflict recording gate cover that endpoint type symmetrically
  Evidence: `tasks.md` T010-T012 and T030; the focused regression tests cover Anthropic-formatted OpenAI-compatible requests versus plain OpenAI-compatible requests, plus the T030-discovered-and-fixed recording-gate asymmetry with its negative-control-verified test.
- [x] CHK-014 [P2] Phase 3 items (K4, K6, K9, K11) are either implemented against stated gating evidence or explicitly deferred with that evidence cited
  Evidence: `tasks.md` T013-T018 records K6/K9 implementation, K11's host investigation, and K4's evidence-gated deferral.
- [x] CHK-015 [P2] Phase 4 items are documentation-only; no code change smuggled in under a "minor" label
  Evidence: `tasks.md` T019-T025 records documentation edits, no-op confirmations, and the K15 deferral; no Phase 4 code edit was made.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm test` / `npm run typecheck` pass in `pi-cache-optimizer` after every phase
  Evidence: `tasks.md` T026 records clean High, Medium, Low, and Minor/final gates; the post-T030 final run passes 51 tests across 13 suites and typecheck exits 0.
- [x] CHK-021 [P0] `deep-pi`'s test suite is unaffected by any change in this packet
  Evidence: `tasks.md` T026 records the untouched `deep-pi` final result: 81 tests across 11 files and typecheck exit 0.
- [x] CHK-022 [P0] `validate.sh --recursive --strict` passes for the whole `039` packet after Phase 4 closes
  Evidence: Final `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/hooks/008-pi-caching-like-reasonix --recursive --strict` exits 0.
- [x] CHK-023 [P1] `git status --porcelain` shows only the intended files changed
  Evidence: The operator prohibited all git commands, so no git status was run; T028 records the no-git scoped inventory of the files edited and confirms no task-created temporary output.
- [x] CHK-024 [P1] Manual end-to-end scenarios (real hook sequences, not test-runner mocks) run for K1/K2/K5, with results captured and any discovered defect fixed and regression-tested
  Evidence: `tasks.md` T030; 9/9 scenarios pass after fixing the K5 recording-gate asymmetry, with a negative-control-verified regression test added.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All 6 requirements (REQ-001 through REQ-006) addressed or explicitly deferred with user approval
  Evidence: `spec.md` REQ-001 through REQ-006 are covered by completed T003-T016 and the documented T018/T025 plan-approved deferrals.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No credential, token, or secret material introduced in any code or doc change
  Evidence: Final `rg --pcre2` credential-pattern scan over the scoped code and docs returned no assigned credentials, tokens, or secret literals.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The K6/K8 priority-tier inconsistency between `research.md` and `findings-registry.json` is resolved
  Evidence: `tasks.md` T013 and both final documents record K6=P2 and K8=P1 with the canonical lineage-registry rationale.
- [x] CHK-041 [P1] No internal phase/packet/ADR/REQ/CHK/task-id leaks into `CHANGES-FROM-UPSTREAM.md` prose
  Evidence: Final `CHANGES-FROM-UPSTREAM.md` review contains only durable runtime and provenance wording; no internal bookkeeping identifier was added.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray scratch/temp file left outside the scratchpad
  Evidence: Final `find` inventory over the workspace and scoped packet found no task-created scratch, temporary, backup, or generated test artifacts; git was not invoked per operator instruction.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 11 | 11/11 |
| P2 Items | 3 | 3/3 |

**Status**: Complete — all checklist items verified with evidence; T018 and T025 are deferred as planned.
<!-- /ANCHOR:summary -->
