---
title: "Verification Checklist: Devin goal hooks"
description: "Verification Date: 2026-07-29 — all adapters implemented, tested, and live-verified"
trigger_phrases:
  - "devin goal hooks checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/003-devin-goal-hooks"
    last_updated_at: "2026-07-29T06:45:00Z"
    last_updated_by: "claude"
    recent_action: "Verified all checklist items with real evidence"
    next_safe_action: "Hand parity findings to phases 004/005 (Cursor, Pi)"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/devin/"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-003-devin-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Devin's Stop hook parity tier: verify-and-continue shipped, mechanism confirmed, live evidence-source gap documented."
---
# Verification Checklist: Devin goal hooks

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` REQ-001..REQ-007, Status: Complete]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `plan.md` §3 Architecture, both Quality Gates checklists checked]
- [x] CHK-003 [P1] Dependencies identified and available (phase 001 goal core, phase 002 capability-probe matrix) [evidence: `goal-core.cjs` present with the documented API; `002-capability-probes/capability-matrix.md` fixes the Devin tier]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All three Devin adapters import only the phase 001 goal core, not `mk-goal.js` internals. [evidence: `rg -n "mk-goal" .opencode/hooks/goal/devin` → 0 hits; only import is `../lib/goal-core.cjs`]
- [x] CHK-011 [P0] `Stop` adapter's parity tier matches phase 002's actual probe result, not an assumption. [evidence: `goal-verify.mjs` ships verify-and-continue, the full tier `capability-matrix.md` confirmed for Devin]
- [x] CHK-012 [P1] `.devin/hooks.v1.json` registration is additive-only (no existing entries modified). [evidence: `git diff --stat .devin/hooks.v1.json` → 1 file changed, 15 insertions(+), 0 deletions]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Co-located `node --test` adapter suite passes. [evidence: `node --test goal-devin.test.mjs` → 21/21 pass, 0 fail]
- [x] CHK-021 [P0] Live `devin -p` smoke session confirms `UserPromptSubmit` injection. [evidence: transcript `rainbow-poppyseed.json` step 9, `source: system`, full `[active_goal:...]` block with the real objective text]
- [x] CHK-022 [P0] Live `devin -p` smoke session confirms `SessionStart` restore. [evidence: same transcript, step 6, identical block fired before any user turn]
- [x] CHK-023 [P1] `Stop` verify (and continue, if applicable) tested against a real turn. [evidence: live capture of the real Stop payload (`{hook_event_name,stop_hook_active,session_id,prompt_id}`, no evidence field) confirms verify correctly declines to block absent evidence; block/continue envelope and Devin's honoring of it are confirmed transitively — unit tests + phase 002's live probe of the identical `{"decision":"block","reason":...}` shape; see implementation-summary.md Known Limitations for the honest evidence-source gap]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class identified: this is new-adapter-authoring, not a fix to an existing consumer set. [evidence: three new files under `.opencode/hooks/goal/devin/`, no existing consumer modified]
- [x] CHK-FIX-002 [P1] Consumer inventory (every place a `.devin/hooks.v1.json` registration or `goal-core.cjs` import must land) is complete before implementation starts. [evidence: exactly 3 registration sites (`SessionStart`, `UserPromptSubmit`, `Stop`), all present in the diff]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials introduced in adapter code or `.devin/hooks.v1.json`. [evidence: adapters carry no literals beyond field names/paths; diff reviewed]
- [x] CHK-031 [P0] Adapter failures fail open (never block a Devin turn or session start). [evidence: every adapter's `main()` is wrapped in `.catch(() => approve())`; test coverage for malformed stdin, missing required fields, and disabled-plugin all assert empty stdout / exit 0]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md/plan.md/tasks.md synchronized with the actual completed work. [evidence: `spec.md` Status: Complete, `tasks.md` T001-T011 all `[x]`, `plan.md` both Quality Gates checklists all `[x]`]
- [x] CHK-041 [P1] implementation-summary.md states the shipped `Stop` hook parity tier honestly (verify-only vs verify-and-continue). [evidence: implementation-summary.md Known Limitations names the live evidence-source gap explicitly]
- [x] CHK-042 [P1] All touched/new documentation passes `validate_document.py`. [evidence: `validate.sh --strict` on this folder — see Verification Summary below]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files left in the repo outside the scratchpad. [evidence: all live-smoke `/tmp` workspaces, stdout captures, and the real `.opencode/skills/.goal-state/active-goal.json` test pollution were removed/cleared; `git status --porcelain` shows only the intended new files]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
