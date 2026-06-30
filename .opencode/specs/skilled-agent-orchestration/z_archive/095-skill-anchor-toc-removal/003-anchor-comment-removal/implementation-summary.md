---
title: "Implementation Summary: Bulk Comment-Anchor Removal"
description: "Removed standalone ANCHOR comments from 673 in-scope skill markdown files; preserved spec-kit template anchors and live anchor-system documentation."
trigger_phrases:
  - "anchor comment removal summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/095-skill-anchor-toc-removal/003-anchor-comment-removal"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Removed standalone anchor comments from skill markdown"
    next_safe_action: "Proceed to phase 004 (verification + reconciliation)"
    blockers: []
    key_files:
      - "specs/skilled-agent-orchestration/z_archive/095-skill-anchor-toc-removal/002-toc-removal/strip_toc_anchors.py"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Bulk Comment-Anchor Removal

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 117-skill-anchor-toc-removal/003-anchor-comment-removal |
| **Completed** | 2026-05-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared transform's `--anchors` mode deleted every standalone `ANCHOR:name` /
`/ANCHOR:name` comment line from in-scope skill markdown (673 files). The carve-out
`system-spec-kit/templates/**` (26 files) was preserved because its anchors are consumed by
spec/memory generation and indexing. One glued closing marker (appended to a content line) survived
the whole-line regex and was removed by hand.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/**/*.md` (673) | Modified | Standalone anchor comments removed |
| `system-spec-kit/assets/level_decision_matrix.md` | Modified | Removed 1 stray glued closing marker |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran the shared transform in --anchors mode, preserved the consumed spec-kit template anchors, and fixed the one glued marker the whole-line regex could not reach.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Fence-agnostic anchor removal | A self-contained comment line is harmless to drop even inside an example; shows the new pattern |
| Preserve `system-spec-kit/templates/**` | Tooling (strip_templates.py, research extraction, memory indexing) consumes those anchors |
| Keep inline anchor *mentions* | Prose/commands documenting the live spec-kit anchor system reference, not declare, anchors |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Residual scan | Pass | 0 standalone anchor-comment lines in scope |
| Carve-out | Pass | 26 spec-kit template files retain anchors |
| Glued markers | Pass | 1 found and fixed; none remain |
| Consumer check | Pass | No sk-doc/create/skill script parses skill-doc anchors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Documentation of the spec-kit anchor system (grep/sed examples, validation-rule descriptions) is intentionally retained — that system remains live for spec/memory docs.
<!-- /ANCHOR:limitations -->
