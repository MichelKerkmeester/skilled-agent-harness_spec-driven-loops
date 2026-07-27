---
title: "Implementation Summary: sk-design structural anomalies"
description: "Planned-state implementation summary: none of the four structural items has been executed yet; this document records the pre-work state and will be rewritten once the stub removal and index addition land."
trigger_phrases:
  - "sk-design structural anomalies summary"
  - "design-mcp-open-design loose executables summary"
  - "compiled-routing missing index summary"
  - "vestigial node_modules stub summary"
importance_tier: "normal"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T14:53:08.592Z"
    last_updated_by: "spec-author"
    recent_action: "Authored packet; status Planned, nothing implemented"
    next_safe_action: "Remove the vestigial node_modules stub (lowest-risk item first)"
    blockers:
      - "Loose .mjs executables decision requires operator input before any move"
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: sk-design structural anomalies
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-structural-anomalies |
| **Completed** | Not started |
| **Level** | 2 |
| **Status** | Planned |
| **Completion Pct** | 0% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is Planned: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are authored, but none of the four items has been executed. `design-md-generator/node_modules/` still exists on disk, `benchmark/compiled-routing/` still has no `README.md`, the four `.mjs` files at `design-mcp-open-design/`'s root are untouched, and the two legitimate absences remain simply unremediated (by design).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| _(none yet)_ | — | Work has not started |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable yet. Once Phase 1-4 of `plan.md` execute, this section will record the actual delivery sequence: the stub-removal commit, the benchmark-index commit, and confirmation that the `.mjs` relocation and the two legitimate absences remained record-only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Bundle four small items into one Level 2 packet instead of four packets | Each item is too small to warrant its own spec folder; the operator has repeatedly rejected over-ceremony |
| Leave the `.mjs` relocation as a recorded decision, not executed | Moving them changes an import, transport tests, and a shared checker script — real blast radius requiring operator input, not a sweep |
| Do not add `procedures/` to `design-mcp-open-design` or `scripts/` to `design-motion` | Both absences are legitimate; manufacturing structure a mode doesn't need would be gold-plating |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Stub removal check | Not run | — | Blocked on Phase 1 executing |
| Benchmark index check | Not run | — | Blocked on Phase 2 executing |
| Record-only confirmation | Not run | — | Blocked on Phase 3 executing (documentation-only, still unexecuted) |
| Checklist | Not run | 0/10 | See `checklist.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No work started** — this summary exists only to satisfy the Level 2 document set at authoring time; it will need a full rewrite once Phase 1-4 execute.
2. **`.mjs` relocation stays open indefinitely** until the operator decides — this packet does not resolve it, only surfaces it clearly.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| _(none yet)_ | _(none yet)_ | No execution has occurred to deviate from the plan |

<!-- /ANCHOR:deviations -->
