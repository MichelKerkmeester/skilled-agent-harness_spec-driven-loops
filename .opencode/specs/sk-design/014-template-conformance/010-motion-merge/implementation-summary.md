---
title: "Implementation Summary: Merge design-motion into design-interface"
description: "Planned-state implementation summary: no work has started on the design-motion merge; this document records the pre-work state and will be rewritten once the ordering decision, content move, and surface rewire land."
trigger_phrases:
  - "motion merge implementation summary"
  - "design-motion retirement summary"
  - "restraint gate ordering summary"
importance_tier: "important"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/010-motion-merge"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored packet; status Planned, nothing implemented"
    next_safe_action: "Begin Phase 1: read b217d74b819, decide ordering mechanism"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Merge design-motion into design-interface
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-motion-merge |
| **Completed** | Not started |
| **Level** | 2 |
| **Status** | Planned |
| **Completion Pct** | 0% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is Planned: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are authored, but no content has moved, no filename collision has been resolved, and no command/router/test rewiring has occurred. `design-motion/` still exists as a standalone 39-file, 4,175-line mode with its own `SKILL.md`, `README.md`, and `/interface:motion` command; `hub-router.json`, `grounding-receipt.mjs`, and both test rosters still reflect the pre-merge topology.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| _(none yet)_ | — | Work has not started |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable yet. Once Phase 1-4 of `plan.md` execute, this section will record: the chosen restraint-gate ordering mechanism and rationale, the content-move commit, the 9 collision resolutions, the command/router/test rewire commit(s), and the final `design-motion/` deletion — landed as this phase's own commit, independently revertible from siblings `009`/`011`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Ordering mechanism: TBD (`DEFAULT_RESOURCE` vs. preflight §10 row) | To be recorded here once Phase 1 completes; this row is the load-bearing decision the plan gates on |
| Reuse commit `b217d74b819`'s sequence rather than inventing a fresh approach | Proven pattern for a mode-into-mode merge in this hub |
| Delete `motion-character-handoff.md` rather than repoint it | With one mode there is no boundary left to cross |
| Land as its own commit, separate from `009`/`011` | Program-wide revertability rule |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Ordering-mechanism trace | Not run | — | Blocked on Phase 1 starting |
| Grep sweep (`design-motion`) | Not run | — | Blocked on Phase 2-3 completing |
| `design-command-surface-check.mjs` | Not run | — | Blocked on Phase 3 completing |
| Test rosters | Not run | — | Blocked on Phase 3 completing |
| Checklist | Not run | 0/14 | See `checklist.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No work started** — this summary exists only to satisfy the Level 2 document set at authoring time; it will need a full rewrite once Phase 1-4 execute.
2. **Ordering-mechanism risk unresolved** — if neither `DEFAULT_RESOURCE` nor the preflight §10 row is genuinely enforceable, this packet cannot proceed to Phase 2 at all, and the outcome would be an escalation rather than a completed merge.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| _(none yet)_ | _(none yet)_ | No execution has occurred to deviate from the plan |

<!-- /ANCHOR:deviations -->
