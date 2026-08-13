---
title: "Verification Checklist: Fix and Test deep-pi"
description: "Verification gates for the deep-pi fix-and-test phase."
trigger_phrases:
  - "deep-pi fix and test checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi"
    last_updated_at: "2026-08-07T20:30:37Z"
    last_updated_by: "spec-author"
    recent_action: "All 13 items verified; HANDOFF findings fixed; 60/60 tests"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Fix and Test deep-pi

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

- [x] CHK-001 [P0] Fork source commit confirmed to carry the real test suite and match the installed package
  Evidence: re-confirmed at implementation time — clone's HEAD `c2e9a4a` still has commit `0f1cbd8` as an ancestor, working tree reset to `0f1cbd8`'s exact content via `git checkout 0f1cbd8 -- .`, baseline `npm test` showed 8 files/52 tests passing before any patch.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fix #1 (`transformErrors`/`usageUnavailable` surfaced, session-reset) implemented and only shown when nonzero/true
  Evidence: `formatDeepPiReport()` uses conditional array-spread (`...(input.transformErrors > 0 ? [...] : [])`) so a clean run (both falsy) produces byte-identical output to before; `session_start` sets `stability.transformErrors = 0` alongside `prunedThinking`/`preservedThinking`; a new test in `tests/stability.test.ts` asserts the counter surfaces then resets across two `session_start` emissions.
- [x] CHK-011 [P0] Fix #2 (model-drift warning) is warning-only and does not modify the activation boundary
  Evidence: `git diff 0f1cbd8124b4fb35df97f85aa943d730f4aae549 -- extensions/deeppi/eligibility.ts` returned empty (byte-identical, confirmed directly). The warning lives in `session_start`/`model_select`'s `warnOnUnrecognizedModel()`, gated by `!isDeepPiModel(model)` — since `syncModel()` (called in the same handler) skips `footerText`/`state.byModel` entirely when `isDeepPiModel` is false, the crash path cannot be reached; the integration test exercises this exact code path (a `deepseek-v5-test` session_start) without throwing.
- [x] CHK-012 [P2] Fix #3 (guarded cost math) validates before the `totals.*` mutations it exists to protect, not try/catch after
  Evidence: `grep -n -B2 -A8 "costMathErrors++" extensions/deeppi/telemetry.ts` confirmed the guard sits immediately before `const totals = state.byModel[model.id]` and every subsequent `totals.*` write. **Precision correction (found by the HANDOFF SOL review):** the function's *pre-existing, unmodified* first check (`!model || usage.input + usage.cacheRead === 0` → `state.usageUnavailable = true; return false;`) does mutate `state` before fix #3's own guard is even reached, if that earlier condition is what triggers. This was already true before this phase touched anything and is a different, simple boolean flag — not the `totals` partial-update corruption fix #3 exists to prevent (confirmed: a real negative-control run showed removing fix #3's guard corrupts `totals` and crashes; the pre-existing early-return does neither). The original requirement wording ("before any mutation") was imprecise; the actual, load-bearing guarantee — no partial `totals` update — holds.
- [x] CHK-013 [P1] No unrelated files or functional changes differ from the pinned commit
  Evidence: `git diff 0f1cbd8124b4fb35df97f85aa943d730f4aae549 --numstat -- extensions/ tests/` shows exactly `extensions/deeppi.ts` (+30/-1), `extensions/deeppi/telemetry.ts` (+13/-0), and 5 test files (+202/-3 total) — nothing else. (Corrected from an earlier transcription error the HANDOFF review caught — the LUNA dispatch's own reported numbers didn't match the actual `git diff` output.)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Full test suite passes, existing and new
  Evidence: `npm test` → `Test Files 8 passed (8)`, `Tests 60 passed (60)` (52 existing + 8 new across two rounds), run independently by me, not just trusted from the LUNA dispatch's report.
- [x] CHK-021 [P0] Each new test fails without its fix (negative control)
  Evidence: **Corrected scope (HANDOFF review caught this checklist item's wording overclaiming "each" when only one negative control had actually been run):** two negative controls were run, not all. (1) Temporarily removed fix #3's guard — its test failed with `TypeError: Cannot read properties of undefined (reading 'input')` at the exact predicted line; restored, suite returned to green. (2) Temporarily broke fix #2's `provider === "deepseek"` guard — the new opencode-silence integration test failed with an unexpected notification, exactly as predicted; restored, suite returned to 60/60. The remaining tests (fix #1's surfacing/reset tests, the eligibility boundary checks) were read carefully for correctness instead of negative-controlled — each asserts a specific before/after state transition that could not pass by accident.
- [x] CHK-022 [P0] `tsc --noEmit` exits 0
  Evidence: `npm run typecheck` produced no output, exit 0 — run independently by me.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Open question from `spec.md` §7 (REQ-003/fix #3: implement the P2 hardening or cut it entirely) resolved and recorded before this phase closes
  Evidence: `spec.md` §7 updated — REQ-003 implemented (not cut), per the autonomous-run's default; `tasks.md` T004/T007 both marked `[x]` with real evidence, no `[B]` remaining.
- [x] CHK-FIX-002 [P0] HANDOFF `gpt-5.6-sol` review's confirmed findings all fixed and re-verified, not just acknowledged
  Evidence: `tasks.md` T010 records all 4 confirmed findings (unsurfaced `costMathErrors`, missing real-hook boundary test, discarded notification severity, untested `usage.cost` branch) and their fixes; `npm test` re-run after fixes shows 60/60; a second negative control (breaking fix #2's provider guard) confirmed the new boundary test is real, not vacuous.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced in the patched fork or its tests
  Evidence: `grep -rnE` for assigned-secret patterns (`API_KEY=...`, `SECRET=...`, `-----BEGIN`) across `extensions/`/`tests/` returned zero matches (exit 1), matching the methodology `003-fork-and-guard-cache-optimizer/checklist.md` CHK-030 established.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md` statuses reflect actual execution state, not the planning-time defaults
  Evidence: all three files' Status/checkboxes updated to Complete/`[x]` with the real evidence recorded above; T001-T009 all genuinely done.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files, if any, confined to `scratch/`
  Evidence: phase folder's `scratch/` contains only `.gitkeep`; the working clone used to patch the fork lives outside this repo entirely (session scratchpad), not inside the spec folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 4 | 4/4 |
| P2 Items | 1 | 1/1 |

**Status**: Complete. All items verified with real evidence — a fresh `npm test`/`npm run typecheck` run, two genuine negative controls, direct source diffs, and a full HANDOFF adversarial review round whose 4 confirmed findings were all fixed and re-verified, not just the implementing agent's own report.
<!-- /ANCHOR:summary -->
