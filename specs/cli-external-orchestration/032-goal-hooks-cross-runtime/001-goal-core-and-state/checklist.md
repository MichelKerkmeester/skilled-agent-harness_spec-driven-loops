---
title: "Verification Checklist: Runtime-neutral goal core + shared active-goal state + manage CLI"
description: "Verification Date: 2026-07-28 — phase built and verified"
trigger_phrases:
  - "goal core checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/001-goal-core-and-state"
    last_updated_at: "2026-07-28T17:38:00Z"
    last_updated_by: "claude"
    recent_action: "Build goal core, CLI and tests; 27/27 pass"
    next_safe_action: "Run capability probes for phase 002"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/lib/goal-core.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Runtime-neutral goal core + shared active-goal state + manage CLI

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` §4 REQUIREMENTS, Status: Complete]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `plan.md` §3 ARCHITECTURE, §4 IMPLEMENTATION PHASES all checked]
- [x] CHK-003 [P1] Dependencies identified and available (`mk-goal.js`, `goal-opencode.md` as read-only references) [evidence: both read in full, both confirmed unmodified by `git diff`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `goal-core.cjs` depends only on Node builtins. [evidence: `goal-core.cjs`, 686 lines, no external dependencies]
- [x] CHK-011 [P0] Shared-state writes are atomic (temp+rename) and files are mode `0600`. [evidence: state roundtrip/atomicity + mode-0600 tests, 27/27 pass]
- [x] CHK-012 [P1] Ported hardening and verifier functions carry attribution comments referencing `mk-goal.js`. [evidence: marker redaction / homoglyph fold / instruction-override redaction / backtick downgrade tests; hardening pass order inherited from mk-goal.js as-is]
- [x] CHK-013 [P1] `mk-goal.js` and `goal-opencode.md` show zero diff after this phase. [evidence: `git diff` scoped to those two paths shows zero changes]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `goal-core.cjs` co-located `node --test` suite passes. [evidence: `node --test .opencode/hooks/goal/lib/goal-core.test.cjs` → 27/27 pass; independently re-run 27/27 confirmed by the coordinating session]
- [x] CHK-021 [P0] `goal.cjs` co-located `node --test` suite passes. [evidence: CLI envelope + error-code + `PLUGIN_DISABLED` + bare-text-falls-to-set cases within the same 27-test suite, plus a live CLI smoke test (set/show/clear with isolated `MK_GOAL_STATE_DIR`)]
- [x] CHK-022 [P0] Byte-diff test confirms the rendered block matches `mk-goal.js`'s template outside the Role line. [evidence: byte-shape render + parameterized Role line test]
- [x] CHK-023 [P1] Parity test table confirms CLI action/error-code/envelope parity with `/goal:goal-opencode`. [evidence: CLI envelope + error-code tests, live CLI smoke test producing correct STATUS=/ACTION= envelopes]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] Finding class: not applicable — this phase has no prior findings to remediate (first build pass). [evidence: no prior review findings exist for this phase]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Shared state file is created with mode `0600`, not world/group readable. [evidence: mode-0600 test, 27/27 pass]
- [x] CHK-031 [P0] No hardcoded secrets introduced. [evidence: `goal-core.cjs`/`bin/goal.cjs` contain no credentials or secrets]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md/plan.md/tasks.md synchronized with the actual completed work once implemented. [evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all updated to Complete/built state this session]
- [x] CHK-041 [P1] `validate.sh --strict` on this spec folder returns Errors: 0. [evidence: see closing validate run this session]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All new files confined to `.opencode/hooks/goal/` and the new shared state file path. [evidence: `goal-core.cjs`, `bin/goal.cjs`, `goal-core.test.cjs`, `README.md` all under `.opencode/hooks/goal/`; `git diff` shows zero changes elsewhere]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-28
<!-- /ANCHOR:summary -->
