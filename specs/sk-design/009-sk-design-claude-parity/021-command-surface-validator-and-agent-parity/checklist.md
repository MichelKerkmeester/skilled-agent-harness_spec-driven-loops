---
title: "Verification Checklist: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes"
description: "Verification Date: 2026-07-07 - all checklist items verified with evidence"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 021 checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/021-command-surface-validator-and-agent-parity"
    last_updated_at: "2026-07-07T12:15:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Filled in evidence for all checklist items"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict, commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "surface-validator-021"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 021 - Command Surface Validator Rewrite & Deep-Research Finding Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Full validator script read (2600+ lines) before any rewrite, to enumerate every surface-stage check exactly (verified)
- [x] CHK-002 [P1] All 5 command wrapper files plus `audit.md`'s owned assets read in full as the ground truth for the real Phase 015 shape (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on the rewritten script (verified)
- [x] CHK-011 [P1] No dead code left behind: 8 now-unused extraction helpers removed, confirmed via `grep -n` showing each function name previously appeared only in its own declaration afterward (verified)
- [x] CHK-012 [P1] `command-metadata.json` still parses as valid JSON after the sibling-entry edits, via `python3 -c "import json; json.load(...)"` (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `design-command-surface-check.mjs` reaches `STATUS=PASS STAGE=complete SUMMARY invalid=0 drift=0` (verified)
- [x] CHK-021 [P0] Fix iterated correctly through the drift count, not weakened blindly: 77 drift items after the first rewrite pass, narrowed root causes (trailing-period comparison, absolute-vs-relative choreography resource paths), down to 10, then 0 after two targeted follow-up fixes (verified)
- [x] CHK-022 [P1] Every rewritten check still asserts a real `record` field against real file content -- none replaced with an unconditional pass, confirmed by re-reading the final function bodies against this checklist's own review (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] Metadata-stage errors fixed: invalid `:auto|:confirm` flag entry removed, `design-mcp-open-design` sibling entries added to all 5 commands' `discriminator.preferSiblingWhen` (verified)
- [x] CHK-P0-002 [P0] Surface-drift stage rewritten and reaches a genuine clean pass (verified)
- [x] CHK-P1-003 [P1] Obsolete `mcp-open-design` naming fixed in `design-md-generator/{SKILL.md,README.md,references/extraction_workflow.md}` and `feature_catalog/feature_catalog.md` (7 occurrences across 4 files); the historical changelog entry deliberately left untouched (verified)
- [x] CHK-P1-004 [P1] `.opencode/agents/design.md` and `.claude/agents/design.md` both updated with the 6th mode, tool-surface downshift rules, and the packet-path note; confirmed the two mirrors differ only in frontmatter/path-convention via `diff` (verified)
- [x] CHK-P1-005 [P1] `sk-design/SKILL.md` version bumped `1.1.0.0` -> `1.2.0.0` (verified)
- [x] CHK-P2-006 [P2] `collectRosterReconciliationDrift`'s transport-command exemption verified to fix exactly the 2 `route-fixture-drift`/`missing-wrapper` false positives for `design-mcp-open-design` seen before this fix, without suppressing the analogous checks for the 5 real commands (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No tool-surface or permission grant was widened by this phase; the design agent's tool-surface downshift rules are additive documentation of an existing registry constraint, not a new capability (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with actual delivered scope (verified)
- [x] CHK-041 [P2] Known Limitations honestly documents the fuzzy-matching tradeoff (word-overlap thresholds tolerate Phase 015's independent rewording but are strictly weaker than exact-substring matching) (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` scoped to sk-design/design-command/agent paths reviewed and cross-checked against `git diff` to separate this phase's files from 8 unrelated concurrent-session dirty files (5 `description.json` regenerations, 3 `sk-doc` path fixes in `design-audit/foundations/motion/SKILL.md`), which are excluded from this phase's commit (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-07-07
<!-- /ANCHOR:summary -->
