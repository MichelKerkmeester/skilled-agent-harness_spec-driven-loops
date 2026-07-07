---
title: "Verification Checklist: Phase 025 - PB-002 Advisor and Audit-Bundle Fix"
description: "Verification Date: 2026-07-07 - all checklist items verified with evidence"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 025 checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/025-pb002-advisor-and-audit-bundle-fix"
    last_updated_at: "2026-07-07T21:25:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Filled in evidence for all checklist items"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict, commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb002-advisor-fix-025"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 025 - PB-002 Advisor and Audit-Bundle Fix

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

- [x] CHK-001 [P0] Read PB-002's full scenario file and own Pass/Fail Criteria before designing any fix (verified)
- [x] CHK-002 [P1] Empirically re-tested PB-002's exact prompt against the current live scoring path before assuming either original-evidence claim still held — confirmed both defects reproduced (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every fix targets a specific, cited defect from the fresh audit's findings — no speculative or unrelated edits made under this phase (verified)
- [x] CHK-011 [P1] Attempt 1's advisor fix, once proven to not reach the live path, was root-caused via direct source-code grep (not guessed) before attempt 2 (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] PB-002 advisor half verified via the live daemon path, not the standalone CLI's local fallback — `sk-design` top-1 at confidence 0.9095 (verified)
- [x] CHK-021 [P0] PB-002 mode-resolution half verified via live re-dispatch — pure `foundations`, procedure card cited, confirmed/inferred separated, proof-required section present, no mutating tool (verified)
- [x] CHK-022 [P0] Regression: `AI-002` still `sk-code` top-1 at 0.913 via the live daemon path (verified)
- [x] CHK-023 [P0] Regression: `AI-004` still `sk-code` top-1 at 0.8993 via the live daemon path, unchanged from its pre-fix state (verified)
- [x] CHK-024 [P1] Regression sweep also tested `MR-004`; found a live-daemon-path FAIL conflicting with a same-day fresh-audit REFUTED verdict for the identical prompt — documented as an unresolved logic-sync conflict rather than silently reconciled or silently dropped (verified)
- [x] CHK-025 [P1] `~/.config/opencode/opencode.json` checked after every dispatch round in this phase — clean (no `mcp` key) throughout (verified)
- [x] CHK-026 [P1] `git status --porcelain` reviewed after each dispatch round — no stray files (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] PB-002 advisor-probe defect: root-caused to the wrong scoring backend on the first attempt (Python local-fallback), correctly re-targeted to the native daemon's actual data source (`graph-metadata.json`) on the second attempt, confirmed fixed via the live daemon (verified)
- [x] CHK-P0-002 [P0] PB-002 mode-resolution defect: fixed via a new "single-axis static review" exception in `sk-design/SKILL.md`'s Mode Vocabulary Guardrails, confirmed via live dispatch (verified)
- [x] CHK-P1-003 [P1] Fix-now finding 1 (family mislabel): all 3 files (`design-foundations`, `design-motion`, `design-audit`) confirmed `family: sk-design` via direct read (verified)
- [x] CHK-P1-004 [P1] Fix-now finding 2 (nonexistent sibling command): all 5 `command-metadata.json` occurrences reworded, JSON validity confirmed via `python3 -m json.tool` (verified)
- [x] CHK-P1-005 [P1] Fix-now finding 3 (`FR-001` prompt mismatch): index prompt now matches the feature-file's authoritative text, confirmed via direct read diff (verified)
- [x] CHK-P1-006 [P1] Operator decision (Open Design RUN risk, accept-as-is): documented directly in `design-mcp-open-design/SKILL.md`'s ALWAYS #4 and in `verdict-matrix.md`'s side-effects section (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No tool-surface or permission change in this phase — all edits are SKILL.md prose, JSON metadata, one Python scorer-weight-table addition, and front-matter field corrections (verified)
- [x] CHK-031 [P1] The `description.json` edit made alongside the `graph-metadata.json` fix was independently confirmed (via source grep) to be inert for the routing path it was intended to help — kept for catalog consistency, not relied on as the actual fix mechanism, and this distinction is documented so a future session doesn't waste time re-editing the wrong file again (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the actual 2-attempt PB-002 fix delivered (verified)
- [x] CHK-041 [P1] `verdict-matrix.md` updated with PB-002's fix, the fresh audit's findings, and both newly-surfaced items (MR-004 logic-sync conflict, AI-004 pre-existing bug) (verified)
- [x] CHK-042 [P2] Known Limitations honestly documents the MR-004 conflict and the AI-004 pre-existing bug as unresolved, out-of-scope items rather than omitting them (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` scoped to the 11 changed files reviewed before commit to confirm only this phase's intended edits are staged (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-07
<!-- /ANCHOR:summary -->
