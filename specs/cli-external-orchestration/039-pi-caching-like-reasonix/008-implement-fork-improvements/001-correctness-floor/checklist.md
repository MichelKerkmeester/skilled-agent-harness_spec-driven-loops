---
title: "Verification Checklist: Correctness Floor"
description: "Verification gates for the P0 correctness-floor phase: cold-start telemetry, single-sourced ownership boundary, combined-host composition test, hook-level guard coverage, and the report command's side effect."
trigger_phrases:
  - "correctness floor checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/008-implement-fork-improvements/001-correctness-floor"
    last_updated_at: "2026-08-08T09:03:34Z"
    last_updated_by: "implementation"
    recent_action: "Completed and evidenced all correctness-floor checks"
    next_safe_action: "Hand off to phase 002"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The two-wrapper runner bridge succeeded; the fallback was not taken."
      - "The ownership definition is a test-only fixture and the combined host uses the existing FakePi."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Correctness Floor

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Execution status:** this checklist records the final implementation state. All checks below were run after the operator authorized implementation in `tasks.md` T002.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Operator authorization to modify files under `.pi/extensions/` obtained and recorded before any edit
  Verification: the user authorization is quoted in `tasks.md` T002; implementation stayed within the requested paths.
- [x] CHK-002 [P0] Real pre-change baseline captured in both forks, not assumed
  Verification: baseline output in `tasks.md` Evidence Record shows deep-pi 8 files/60 tests, optimizer 25 tests, and all four commands exited 0.
- [x] CHK-003 [P1] All four P0 citations re-verified against the live source immediately before editing
  Verification: the live source dump recorded `telemetry.ts` lines 50-56, ownership predicates at `eligibility.ts:14-18` and `index.ts:1279-1281`, guards at `7280/7298/7304/7425/7479/7541`, and the report call at `deeppi.ts:67-80`.
- [x] CHK-004 [P1] The vendored copies confirmed to match their spec-recorded state before editing, so the final diff is attributable to this phase [evidence: `tasks.md:52` records baseline output and `eligibility.ts:14` plus `index.ts:1279` remain unchanged]
  Verification: the pre-change baseline and cited source were read from the live vendored copies; no runtime ownership predicate change was made.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] REQ-001's guard admits cache-write-only turns without admitting empty ones
  Verification: live source has the total-token test `input + cacheRead + cacheWrite === 0`; telemetry tests pass for both cache-write-only and fully empty records.
- [x] CHK-011 [P0] REQ-006 is a field move, not a workaround — `TelemetryState.latestChurn` has no remaining readers
  Verification: `rg -n latestChurn` shows stability state as the source, `ReportInput` as the boundary, and no command assignment or telemetry-state field.
- [x] CHK-012 [P0] The activation boundary is unchanged in behavior, and the two predicates' agreement is checked beyond the fixture's own four entries
  Verification: `eligibility.ts` and `index.ts` are unmodified; both real predicates pass the shared owned/excluded fixture contract. A HANDOFF review correctly showed the fixture-only check does not catch a one-sided change outside its four entries — it in-memory-widened `isDeepPiModel` to accept `deepseek/deepseek-v4-ultra` and confirmed all four fixture cases still passed despite the predicates disagreeing on that model. `ownership-composition.test.ts` now also directly compares both real predicates against each other (no fixed expected answer) across a 60-candidate synthetic matrix that includes that exact model id; reproducing the same one-sided widening against the live source made this new test fail with the disagreement named, then passed again once reverted.
- [x] CHK-013 [P1] The shared ownership definition is test-scoped and does not couple the two packages' runtime or vendoring
  Verification: the JSON fixture is loaded only by tests; neither package `files` allowlist changed and neither runtime extension imports it.
- [x] CHK-014 [P1] The runner bridge stayed a bridge and did not become a suite migration
  Verification: `one-owner.ts` has no runner import; deep-pi remains vitest; optimizer remains node:test + jiti and only its file glob changed.
- [x] CHK-015 [P1] No unrelated files or incidental edits
  Verification: scoped status/diff review below contains only requested implementation files, test files, shared files, and this phase's documents; unrelated pre-existing worktree changes were not edited.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Both forks' full suites pass from the final state
  Verification: final output records deep-pi `Test Files 9 passed (9)`, `Tests 66 passed (66)` and optimizer `ℹ pass 34`, `ℹ fail 0`; both exited 0.
- [x] CHK-021 [P0] Every P0 fix has a negative control that reproduced its predicted failure
  Verification: `tasks.md` T017-T020 and its Evidence Record contain the exact REQ-001, REQ-002, REQ-004, REQ-005, and REQ-006 failures and restored-green results.
- [x] CHK-022 [P0] The composition test genuinely executed rather than silently skipping
  Verification: deep-pi reported `Tests 3 passed (3)`; optimizer printed all three named tests and reported `ℹ tests 3`, `ℹ pass 3`, `ℹ fail 0`.
- [x] CHK-023 [P0] All six hook guards are exercised through their real handlers, not through the predicate alone
  Verification: each test invokes the registered real hook; deleting each guard produced exactly one failure with 5 pass / 1 fail, and the restored run reported 6/6.
- [x] CHK-024 [P1] `tsc --noEmit` exits 0 in both forks
  Verification: both final `npm run typecheck` commands printed their npm script headers and exited 0.
- [x] CHK-025 [P1] The documented intermediate accounting state is asserted, not left implicit
  Verification: telemetry test asserts `responses` increments while `hitTokens`, `missTokens`, and `actualInputCost` remain zero for cache-write-only input.

### Negative-control receipts

These are the exact failure messages captured before restoring each fix:

| Requirement | Reverted behavior | Observed failure |
|-------------|-------------------|------------------|
| REQ-001 | Old guard omitted `cacheWrite` | `AssertionError: expected false to be true // Object.is equality` at `tests/telemetry.test.ts:51:6` |
| REQ-002 | Fixture added `deepseek/deepseek-v4-ultra` | deep-pi: `AssertionError: expected false to be true` at `tests/ownership-composition.test.ts:61:40`; optimizer: `AssertionError [ERR_ASSERTION]: deepseek/deepseek-v4-ultra` followed by `false !== true` at `:65:23` |
| REQ-004 | Optimizer not registered on the combined host | `AssertionError [ERR_ASSERTION]: opencode/deepseek-v4-flash-free` with actual `'undefined'` versus expected `'string'` at `:105:25` |
| REQ-005 | Each of the six guards deleted in turn | `4 !== 0` (`session_start`), `1 !== 0` (`model_select`), global key actual `'hook-guard-session'` versus expected `'sentinel-cache-key'`, payload actual object versus expected `undefined`, `1 !== 0` (`after_provider_response`), and `1 !== 0` (`message_end`) |
| REQ-006 | Old telemetry churn reader/state and command assignment restored | `AssertionError: expected ... to contain 'Prefix churn:       tool-schema'`; rendered line was `Prefix churn:       none` at `tests/deeppi.integration.test.ts:132:37` |

Every REQ-005 reverted run reported 5 passing tests and 1 failing test. Each reverted change was restored, and the final focused check passed before the full gate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All four P0 action-list items are addressed, none silently dropped [evidence: `tasks.md:62` through `tasks.md:74` and tests 66 passed]
  Verification: research action-list items 1-4 map to the completed REQ-001 through REQ-006 work; every mapped test passes.
- [x] CHK-FIX-002 [P0] The runner mismatch is resolved, not documented as a reason the composition test does not exist [evidence: composition tests 3 passed under vitest and node:test]
  Verification: both named wrappers executed and reported passing composition tests.
- [x] CHK-FIX-003 [P1] `f-deeppi-cas-gap` stayed excluded, with its reason on record
  Verification: `spec.md` §7 retains the `hashlines.ts:91-101` post-rename verification rationale; no implementation task proposes changing that path.
- [x] CHK-FIX-004 [P1] Open questions from `spec.md` §7 resolved and recorded before this phase closes
  Verification: `spec.md` §7 records the test-only fixture decision and the existing-FakePi decision.
- [x] CHK-FIX-005 [P2] If §3's fallback runner option was taken, it is recorded rather than applied silently
  Verification: the two-wrapper bridge passed, so the fallback was not taken; this is recorded in `plan.md` §3 and this checklist.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced in either fork or in the new shared fixture [evidence: `package.json:18` allowlist unchanged; fixture contains only provider/id pairs]
  Verification: changed implementation paths contain no assigned-secret or PEM markers; the fixture contains only provider/id pairs.
- [x] CHK-031 [P0] The new shared fixture and composition test read no live credential and reach no network
  Verification: the fixture is static JSON and `one-owner.ts` is pure; tests use local FakePi and temporary directories only.
- [x] CHK-032 [P1] No change widens what either extension is permitted to act on [evidence: `eligibility.ts:14` unchanged and composition tests 3 passed]
  Verification: runtime predicate files are unchanged and excluded-entry composition assertions pass for both neighbors.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and this checklist reflect actual execution state, not the planning-time defaults
  Verification: spec status is Complete; plan, tasks, and checklist boxes and evidence reflect final execution.
- [x] CHK-041 [P1] The 001-to-002 seam is still accurate after implementation [evidence: `tasks.md:64` pins recorded tokens while phase 002 retains accounting scope]
  Verification: this phase admits cache-write-only turns but does not route cacheWrite accounting; phase 002 retains ownership of accounting semantics.
- [x] CHK-042 [P2] Any deviation from `plan.md` §3's approach is recorded with its reason
  Verification: no fallback or unplanned architecture was used; the test-only fixture decision is recorded explicitly.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New shared files live at a path both forks can reach without either package shipping them
  Verification: the fixture and composition body sit under `.pi/extensions/shared/`, outside both package `files` allowlists; both test runners loaded them successfully.
- [x] CHK-051 [P1] No temp or scratch artifact left inside either extension directory or this spec folder [evidence: `git diff review` and scoped status show only intended paths]
  Verification: temporary agent directories are removed by test teardown; scoped status review shows only intended paths.
- [x] CHK-052 [P2] No `implementation-summary.md` exists for this phase until it is actually implemented
  Verification: implementation is complete; the execution summary is created only after the implementation and final evidence are recorded.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 3 | 3/3 |

**Status**: Complete — all 30 gates are verified against the final implementation. Exact negative-control failures and restored-green results are recorded in `tasks.md` T017-T020 and its Evidence Record; final suite and typecheck output is recorded under T022.
<!-- /ANCHOR:summary -->
