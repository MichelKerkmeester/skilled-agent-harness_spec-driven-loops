---
title: "Implementation Summary"
description: "This phase is planned and not yet built. Clarifies frontmatter value-source order, adds grouped-detail reporting, and retires one-off scripts."
trigger_phrases:
  - "fold one off repairs implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs"
    last_updated_at: "2026-10-08T04:22:48Z"
    last_updated_by: "claude"
    recent_action: "Planned fold one-off repairs"
    next_safe_action: "Implement per tasks.md"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-fold-one-off-repairs |
| **Status** | Planned, not yet built |
| **Level** | 2 |
| **Created** | 2026-10-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Will Be Built

This phase is planned and not yet built. Phase 15 delivered archive re-derivation. This phase consolidates the remaining one-off repair logic by clarifying frontmatter value-source order and adding grouped-detail reporting.

This phase builds:
1. Clarified frontmatter value-source order: template literal per document class first, respecting that goal.md uses `important` and `planning`.
2. Grouped-detail report mode in upgrade-legacy showing failures grouped by rule with detail counts.
3. Tests pinning both behaviors to prevent regression.

### Files to Change (not yet modified)

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Clarify value-source order, add grouped-detail report |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Modify | Ensure template literal per document class comes first |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Add tests for value-source and grouped-detail |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Will Be Delivered

1. Audit fillMissingFrontmatter for value-source order and document class handling.
2. Update logic to ensure template literal per class comes before spec.md copy.
3. Implement grouped-detail report in upgrade-legacy.mjs showing failures grouped by rule.
4. Add tests for both features.
5. Run the full test suite to verify no regressions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions Made

| Decision | Why |
|----------|-----|
| Template literal per document class takes precedence | Goal.md uses `important` and `planning`; respecting class-specific defaults prevents misclassification |
| Grouped-detail report shows "### folder / x RULE" | Groups failures by rule to show which rules block the most packets |
| One-offs are retired and folded into permanent tools | Phase 13's batch scripts worked but are not testable or maintainable long-term |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification Checklist

| Check | Verification | Status |
|-------|--------------|--------|
| Value-source respects document class | Test with goal.md class in upgrade-legacy.vitest.ts shows template literal precedence | Unmet |
| Grouped-detail report implemented | Upgrade-legacy.mjs output shows "### folder / x RULE" format with counts | Unmet |
| Full suite passes | `npm test` in runtime/cli shows 0 failures | Unmet |
| No regressions | Same test run shows no new failures compared to baseline | Unmet |
<!-- /ANCHOR:verification -->

---


