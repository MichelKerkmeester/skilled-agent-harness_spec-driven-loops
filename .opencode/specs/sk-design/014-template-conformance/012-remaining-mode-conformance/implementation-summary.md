---
title: "Implementation Summary: Template conformance for design-md-generator and design-mcp-open-design"
description: "Planned-state implementation summary: no work has started on either mode's conformance fixes; this document records the pre-work state and will be rewritten once the enum fix, exemplar-file decision, and heading numbering land."
trigger_phrases:
  - "remaining mode conformance implementation summary"
  - "design-md-generator conformance summary"
  - "design-mcp-open-design conformance summary"
importance_tier: "important"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/012-remaining-mode-conformance"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored packet; status Planned, nothing implemented"
    next_safe_action: "Begin Phase 1: fix extraction-workflow.md's importance_tier"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Template conformance for design-md-generator and design-mcp-open-design
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-remaining-mode-conformance |
| **Completed** | Not started |
| **Level** | 2 |
| **Status** | Planned |
| **Completion Pct** | 0% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is Planned: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are authored, but `extraction-workflow.md:10` still carries the off-enum `importance_tier: "high"`, the four exemplar `DESIGN.md` files still sit under `references/` with their off-enum `contextType: reference`, and all 5 non-conformant `design-mcp-open-design` reference files still use unnumbered H2s.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| _(none yet)_ | — | Work has not started |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable yet. Once Phase 1-4 of `plan.md` execute, this section will record: the enum fix, the relocate-vs-exempt decision made for the four exemplar files and its rationale, and the heading-numbering diffs for each of the 5 `design-mcp-open-design` files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Relocate-vs-exempt: TBD | To be recorded here once Phase 2 completes, based on the citing-site check |
| Never rewrite the exemplar `DESIGN.md` files' content | They are measured output artifacts, not authored guidance prose |
| Leave the 4 already-conformant `design-mcp-open-design` reference files untouched | Scope discipline — fix only the confirmed 5 non-conformant files |
| Defer `003-design-motion`'s conformance to `010-motion-merge` | Avoids duplicating or conflicting with that packet's wholesale rewrite |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Enum grep | Not run | — | Blocked on Phase 1 completing |
| Exemplar-file citation check | Not run | — | Blocked on Phase 2 starting |
| Heading diff (5 files) | Not run | — | Blocked on Phase 3 completing |
| Checklist | Not run | 0/14 | See `checklist.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No work started** — this summary exists only to satisfy the Level 2 document set at authoring time; it will need a full rewrite once Phase 1-4 execute.
2. **Relocate-vs-exempt undecided** — the spec names both options as valid; the executing agent must decide based on a real citing-site check, not default to whichever is easiest.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| _(none yet)_ | _(none yet)_ | No execution has occurred to deviate from the plan |

<!-- /ANCHOR:deviations -->
