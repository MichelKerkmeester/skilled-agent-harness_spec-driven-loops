---
title: "Verification Checklist: Phase 16: plugin-correctness-fixes"
description: "Verification Date: 2026-07-03"
trigger_phrases:
  - "goal plugin correctness fixes checklist"
  - "mk-goal F1-F12 verification"
  - "D1-D3 contract verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes"
    last_updated_at: "2026-07-03T13:34:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Completed Phase 16 checklist"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-016-plugin-correctness-fixes-20260703-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 16: plugin-correctness-fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Complete |
| **P1** | Required | Complete |
| **P2** | Optional | Complete |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 P0 Requirements documented in `spec.md`.
  - Evidence: `spec.md` REQ-001 through REQ-009 cover F1-F12 plus D1-D3.
- [x] CHK-002 P0 Technical approach defined in `plan.md`.
  - Evidence: `plan.md` architecture, affected-surfaces table, and five-phase implementation plan define the fix order.
- [x] CHK-003 P1 Baseline test run captured before first edit.
  - Evidence: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` passed before edits with tests 6, pass 6, fail 0, duration `864.782542ms`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:per-finding-p2 -->
## Per-Finding Verification - P2 Findings

- [x] CHK-F1 P0 Log hygiene and bounded JSONL growth.
  - Evidence: `mk-goal-continuation.test.cjs` RED `6 !== 0`, GREEN 1/1.
- [x] CHK-F2 P0 Continuation in-flight lock TOCTOU closed.
  - Evidence: `mk-goal-continuation.test.cjs` RED `19 !== 1`, GREEN 1/1.
- [x] CHK-F3 P0 Archive/sweep routes through `mutationQueues`.
  - Evidence: `mk-goal-lifecycle.test.cjs` RED `true !== false`, GREEN 1/1.
- [x] CHK-F4 P0 Disabled event handling is fully inert.
  - Evidence: `mk-goal-lifecycle.test.cjs` RED created `.archive` and `.goal-events.log`, GREEN 1/1.
- [x] CHK-F5 P0 Sanitizer and evidence redaction bypasses closed.
  - Evidence: `mk-goal-state.test.cjs` RED on `(system: do X)`, GREEN 1/1; adversarial rows cover punctuation prefix, role token, homoglyph variant, Bearer, and JWT axes.
- [x] CHK-F6 P0 Usage accounting uses bounded per-message delta map.
  - Evidence: `mk-goal-lifecycle.test.cjs` RED `150 !== 110`, GREEN 1/1.
- [x] CHK-F7 P0 `mutation=` label computed inside queued mutator.
  - Evidence: `mk-goal-tool-path.test.cjs` RED terminal same-objective set emitted `mutation=refreshed`, GREEN 1/1.
<!-- /ANCHOR:per-finding-p2 -->

---

<!-- ANCHOR:per-finding-p3 -->
## Per-Finding Verification - P3 Findings

- [x] CHK-F8 P1 `query.directory` uses path validation, not text sanitization.
  - Evidence: `mk-goal-continuation.test.cjs` RED `user:workspace/café` became `user-role:workspace/café`, GREEN 1/1.
- [x] CHK-F9 P1 Event errors always append to `.goal-events.log`.
  - Evidence: `mk-goal-lifecycle.test.cjs` RED missing `event_error`, GREEN 1/1.
- [x] CHK-F10 P1 Stored-goal fields are whitelisted and `tokenBudget` is revalidated.
  - Evidence: `mk-goal-state.test.cjs` RED `true !== false`, GREEN 1/1.
- [x] CHK-F11 P1 Disabled flag is re-evaluated per call for events, transform, and tools.
  - Evidence: `mk-goal-lifecycle.test.cjs` RED transform injected while disabled, GREEN 1/1.
- [x] CHK-F12 P1 `fsyncDirectory` failure logging targets the state root.
  - Evidence: `mk-goal-state.test.cjs` RED no root `fsync_directory_error`, GREEN 1/1; `mk-goal-export-contract.test.cjs` GREEN 1/1.
<!-- /ANCHOR:per-finding-p3 -->

---

<!-- ANCHOR:per-finding-contract -->
## Per-Finding Verification - Contract Alignment

- [x] CHK-D1 P0 `ACTION` added to failure envelope.
  - Evidence: `mk-goal-tool-path.test.cjs` RED missing `ACTION`, GREEN 1/1.
- [x] CHK-D2 P1 `mutation=` documented in `goal_opencode.md`.
  - Evidence: grep found `mutation=created`, `mutation=refreshed`, and `mutation=replaced` in `.opencode/commands/goal_opencode.md`.
- [x] CHK-D3 P1 `MK_GOAL_PLUGIN_DISABLED` fail-closed behavior documented.
  - Evidence: grep found `MK_GOAL_PLUGIN_DISABLED`, `STATUS=FAIL ACTION`, and `code=PLUGIN_DISABLED` in `.opencode/commands/goal_opencode.md`.
<!-- /ANCHOR:per-finding-contract -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 P0 Code passes syntax and alignment checks.
  - Evidence: `node --check .opencode/plugins/mk-goal.js` passed; `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins` passed with findings 0, errors 0, warnings 0, violations 0.
- [x] CHK-011 P0 No console errors or warnings introduced.
  - Evidence: final full suite stderr contains only TAP output and the existing `mk-goal tool-path tests passed` line.
- [x] CHK-012 P1 Error handling implemented for each fix.
  - Evidence: F9 event-error logging, F10 invalid `tokenBudget` rejection, F12 root-targeted fsync logging, and disabled fail-closed tests all pass.
- [x] CHK-013 P1 Code follows project patterns.
  - Evidence: fixes reuse `mutationQueues`, retention pruning machinery, pre-await lock pattern, and existing tool envelope helpers.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 P0 All acceptance criteria met.
  - Evidence: F1-F12 and D1-D3 rows above are all checked with passing regression evidence.
- [x] CHK-021 P0 Full six-file plugin suite green in a fresh run.
  - Evidence: final `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` passed tests 6, pass 6, fail 0, duration `1494.893916ms`.
- [x] CHK-022 P1 Edge cases tested.
  - Evidence: F2 20-call concurrent idle burst, F3 archive-vs-usage race, F6 interleaved message stream, and F5 adversarial sanitizer table all pass.
- [x] CHK-023 P1 Export contract pins all `__test` seam names.
  - Evidence: `mk-goal-export-contract.test.cjs` passed after adding the `fsyncDirectory` seam to the expected name list.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 P0 Finding classes confirmed.
  - Evidence: implementation summary lists all F1-F12 and D1-D3 classes against `spec.md` requirements.
- [x] CHK-FIX-002 P0 Same-class producer inventory completed.
  - Evidence: grep for `STATUS=FAIL|failureLines` shows the plugin producer in `mk-goal.js`; other hits are command docs/templates outside this plugin envelope.
- [x] CHK-FIX-003 P0 Consumer inventory completed for changed helpers and fields.
  - Evidence: grep over `.opencode/plugins` found the changed helper call sites in `mk-goal.js` and updated tests; no second plugin producer needed the D1 change.
- [x] CHK-FIX-004 P0 F5 adversarial table covers delimiter, joined-input/homoglyph, no-op, Bearer, and JWT cases.
  - Evidence: `mk-goal-state.test.cjs` sanitizer table covers six role-label rows plus existing whitespace fixtures and verifier redaction fixtures.
- [x] CHK-FIX-005 P1 F5 matrix axes and row count listed.
  - Evidence: axes are prefix class, role token, homoglyph variant, and evidence secret class; six explicit role-label rows plus Bearer/JWT redaction rows.
- [x] CHK-FIX-006 P1 Hostile env/global-state variants executed.
  - Evidence: F4 disabled event inertness, F11 mid-process env flip, and F1 default-config always-hit gate logging tests pass.
- [x] CHK-FIX-007 P1 Evidence pinned to explicit diff/test evidence.
  - Evidence: this phase has no commit SHA by instruction; evidence cites exact test commands and RED/GREEN outputs.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 P0 No hardcoded secrets introduced.
  - Evidence: added strings are synthetic test tokens and are asserted redacted from persisted/output state.
- [x] CHK-031 P0 Input validation implemented for path/text surfaces touched by F5 and F8.
  - Evidence: F5 sanitizer table and F8 directory existence validation tests pass.
- [x] CHK-032 P1 Sanitizer/redaction bypasses closed.
  - Evidence: punctuation-prefixed role labels, Cyrillic homoglyph role tokens, Bearer token, and bare JWT fixtures pass.
- [x] CHK-033 P1 Disabled-flag fail-closed behavior verified.
  - Evidence: F4, F11, and D3 evidence rows are checked.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 P1 Spec, plan, tasks, and checklist synchronized.
  - Evidence: all four docs cover F1-F12 plus D1-D3 and this checklist records matching closure evidence.
- [x] CHK-041 P1 Code comments adequate and durable.
  - Evidence: comment hygiene passed with `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` on all modified plugin/test JS/CJS files.
- [x] CHK-042 P2 `goal_opencode.md` updated for D2 and D3.
  - Evidence: command doc grep found `mutation=`, `MK_GOAL_PLUGIN_DISABLED`, and `STATUS=FAIL ACTION`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 P1 Temp files in scratch only.
  - Evidence: no manual temp files were created for this phase; tests use OS temp dirs and remove them.
- [x] CHK-051 P1 Scratch cleaned before completion.
  - Evidence: no phase scratch files were created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 21/21 |
| P1 Items | 22 | 22/22 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-03
<!-- /ANCHOR:summary -->
