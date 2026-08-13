---
title: "Tasks: Fix and Test deep-pi"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-pi fix and test tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi"
    last_updated_at: "2026-08-07T20:30:37Z"
    last_updated_by: "spec-author"
    recent_action: "HANDOFF review's 4 confirmed findings fixed; 60/60 tests"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Fix and Test deep-pi

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reused the existing clone of `christopherarter/deep-pi` at commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549`; confirmed clean baseline first: `npm test` 8 files/52 tests passing, `npm run typecheck` clean, before any patch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Fix #1 implemented: `transformErrors`/`usageUnavailable` added to `ReportInput`, threaded from `stability`/`telemetry` state in the `/deeppi` handler, shown only when truthy (conditional array-spread); reset in `session_start` alongside `prunedThinking`/`preservedThinking` — `extensions/deeppi/telemetry.ts` +7 lines, `extensions/deeppi.ts` +4 lines
- [x] T003 Fix #2 implemented: unrecognized-`deepseek`-provider-id check added in `session_start`/`model_select` via a `warnedModelIds` Set (cleared each `session_start`), `ctx.ui?.notify?.(..., "warning")` fires once per distinct id per session — `isDeepPiModel`/`eligibility.ts` confirmed byte-for-byte unchanged (`git diff 0f1cbd8 -- extensions/deeppi/eligibility.ts` empty)
- [x] T004 Fix #3 implemented (operator default: implement since cheap and fully scoped, per goal directive — not skipped): early-return guard `if (!model.cost || !usage.cost) { state.costMathErrors++; return false; }` added in `recordUsage()` immediately before the `const totals = state.byModel[model.id]` line, i.e. before any mutation — confirmed via direct source read
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 New tests added: `tests/stability.test.ts` ("surfaces and resets stability transform errors at session boundaries") and `tests/telemetry.test.ts` ("surfaces unavailable usage and clears it on reset") — both confirm surfacing AND reset-on-next-`session_start`
- [x] T006 New tests added: `tests/deeppi.integration.test.ts` ("warns once per unrecognized DeepSeek model id in a session" — asserts exactly one notification, no `edit_lines` activation, re-warns after a fresh `session_start`) and `tests/eligibility.test.ts` ("keeps the warning fallback reachable without changing activation" — confirms `deepseek-v5-test` stays rejected by `isDeepPiModel` while matching the pattern, and both `opencode/deepseek-v4-flash-free`/`opencode-go/deepseek-v4-flash` fail the `provider === "deepseek"` gate)
- [x] T007 New test added: `tests/telemetry.test.ts` ("rejects usage with missing model pricing before changing totals") — asserts `recordUsage` returns `false`, `costMathErrors` increments to 1, and `responses`/`hitTokens`/`missTokens`/`actualInputCost` are byte-identical to their pre-call values (captured and compared directly)
- [x] T008 `npm test`: `Test Files 8 passed (8)`, `Tests 57 passed (57)` (52 existing + 5 new, later 60/60 after T010's fixes). `npm run typecheck`: exits 0, no output. Both re-run independently after the dispatch, not just trusted from its report. Negative control also run: temporarily removed fix #3's guard, re-ran its test — failed with `TypeError: Cannot read properties of undefined (reading 'input')` at the exact predicted line, confirming the test is real, not a tautology; guard restored, suite back to 57/57
- [x] T009 `git diff 0f1cbd8124b4fb35df97f85aa943d730f4aae549 --numstat -- extensions/ tests/` (re-confirmed after T010's fixes): `extensions/deeppi.ts` +30/-1, `extensions/deeppi/telemetry.ts` +13/-0, 5 test files +202/-3 total — 7 files, no other file touched. `extensions/deeppi/eligibility.ts` diff is empty (byte-identical). (The original LUNA dispatch's own reported numbers, +30/-2 and +122/-1, were transcribed imprecisely into these docs and are corrected here — a `gpt-5.6-sol` HANDOFF review caught the discrepancy, and this is the actual `git diff` output, not an estimate.)
- [x] T010 **Post-HANDOFF fixes** (a fresh `gpt-5.6-sol`, high/fast/read-only, independently reviewed this phase and found 4 real, confirmed gaps — all fixed and re-verified):
  1. `costMathErrors` (fix #3's own counter) was created, incremented, and reset, but never added to `ReportInput`/`formatDeepPiReport`/the `/deeppi` call site — the exact "silent counter" bug class this whole phase exists to prevent, reintroduced by fix #3 itself. Fixed: added to the interface, the report (shown only when >0), and the command handler's call site.
  2. The boundary-model test (`tests/eligibility.test.ts`) only checked `isDeepPiModel`/`matchesModelPattern` statically — it never actually ran `opencode`/`opencode-go` models through `warnOnUnrecognizedModel()`'s real code path, so a broken provider check wouldn't have been caught. Fixed: added `tests/deeppi.integration.test.ts`'s "stays silent through the real hook path" test, which does exactly that. Negative control run: broke the provider guard, confirmed this new test fails with the exact wrong notification; restored, confirmed 60/60 green again.
  3. `FakePi.notify()` discarded the notification severity argument, so no test could prove `warnOnUnrecognizedModel` actually uses `"warning"` severity. Fixed: `tests/fake-pi.ts` now captures severity; the existing warning test asserts it.
  4. `usage.cost === undefined` (the second half of fix #3's `||` condition) was never tested, only `model.cost === undefined`. Fixed: added a matching test in `tests/telemetry.test.ts`.
  All fixes re-vendored into `.pi/extensions/deep-pi/` (phase 2) and re-confirmed live (phase 3) — see those phases' docs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — REQ-003/fix #3 implemented (not skipped), per the goal directive's default
- [x] No `[B]` blocked tasks remaining
- [x] Full test suite (T008, 60/60 after T010), diff-based scope verification (T009, corrected), and the HANDOFF review's 4 confirmed findings (T010) all pass/close with real evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Successor**: `../002-vendor-and-repoint/`
<!-- /ANCHOR:cross-refs -->
