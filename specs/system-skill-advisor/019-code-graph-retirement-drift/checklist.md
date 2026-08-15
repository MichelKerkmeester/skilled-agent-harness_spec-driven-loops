---
title: "Verification Checklist: Code-Graph Retirement Test Drift"
description: "Verification items for the scorer null-id hardening and suite triage."
trigger_phrases:
  - "code-graph retirement drift checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-code-graph-retirement-drift"
    last_updated_at: "2026-08-15T14:37:23Z"
    last_updated_by: "claude-code"
    recent_action: "Scorer null-id crash fixed via SOL-HIGH; remaining suite failures triaged"
    next_safe_action: "Owner decision on the unrelated drift and the corpus-authoring subset"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Graph Retirement Test Drift

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

- [x] CHK-001 [P0] Baseline suite captured before any change
  - **Evidence**: `vitest run` reported `36 failed | 839 passed | 7 skipped`
- [x] CHK-002 [P0] Executor availability + auth verified before dispatch
  - **Evidence**: `command -v codex` present; `codex login status` = logged in
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The scorer skips, never dereferences, a null/blank skill id
  - **Evidence**: `text.ts:52` returns `[]`; `explicit.ts:315` and `fusion.ts:101` filter invalid ids
- [x] CHK-011 [P1] Guards are additive; valid skills score unchanged
  - **Evidence**: `projectionWithUsableSkillIds` returns the same object when nothing is filtered
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Crash cluster runs green after the fix
  - **Evidence**: `tests/scorer/semantic-lane-promotion.vitest.ts` 4 tests pass; scorer dir `5 failed | 141 passed`
- [x] CHK-021 [P0] Typecheck stays clean
  - **Evidence**: `tsc --noEmit` exit `0`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No gate/test/baseline weakened to force a pass
  - **Evidence**: `git diff --stat` shows 4 source files only; no `tests/`, baseline, or `.jsonl` gate edit
- [x] CHK-FIX-002 [P0] Regeneration only via owning tooling
  - **Evidence**: `holdout-prompts.jsonl` via `build-holdout.mjs --write` (byte-stable); ambiguity regen rejected for unrelated `rr-hub6-*` delta
- [x] CHK-FIX-003 [P1] Residuals triaged, not force-fixed
  - **Evidence**: `bm25` / review-floor flagged as corpus-authoring; `parity`/`legacy`/`launcher`/`daemon` flagged as unrelated drift in `spec.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No file outside the declared scope modified
  - **Evidence**: `git status` shows only 4 files under `system-skill-advisor/mcp-server/`
- [x] CHK-031 [P1] No secrets in evidence excerpts
  - **Evidence**: excerpts are `file:line` citations only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks reflect the honest outcome
  - **Evidence**: `spec.md` records crash-fixed + triaged, not "all 36 fixed"
- [x] CHK-041 [P1] The `vitest` teardown hang is documented
  - **Evidence**: launcher-bootstrap `node_modules`-wipe recorded in `spec.md` risks
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only
  - **Evidence**: dispatch prompt/logs kept in the session scratchpad, not the repo
- [x] CHK-052 [P0] `validate.sh --strict` exits clean
  - **Evidence**: `validate.sh` on this packet reports `Errors: 0`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-15
<!-- /ANCHOR:summary -->
