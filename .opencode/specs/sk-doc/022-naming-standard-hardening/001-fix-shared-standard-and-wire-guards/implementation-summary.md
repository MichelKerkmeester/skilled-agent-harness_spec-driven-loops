---
title: "Implementation Summary: Fix the Shared Naming Standard and Wire the Kebab Guards"
description: "Planned, not yet implemented. This phase will reconcile core-standards.md to the kebab canon and wire the existing kebab guards into a gate. This summary is a forward-looking placeholder the implementer replaces on completion."
trigger_phrases:
  - "core-standards kebab summary"
  - "kebab guard wiring summary"
  - "phase 001 planned"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/001-fix-shared-standard-and-wire-guards"
    last_updated_at: "2026-07-20T10:13:27Z"
    last_updated_by: "claude-code"
    recent_action: "Wrote the phase-001 planning placeholder record"
    next_safe_action: "Implement the plan and record the evidence here"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-fix-shared-standard-and-wire-guards |
| **Status** | Planned (not yet implemented) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. This is a planning placeholder; the spec, plan, and tasks define the work. When this phase ships, replace this section with the impact narrative.

### Planned Change

This phase will make the shared standard doc state the kebab canon and put a kebab guard behind a gate. `core-standards.md` §2/§4/§5 stop teaching snake_case, and a staged underscore authored name gets blocked instead of landing advisory-only.

### Files To Change

| File | Action | Purpose |
|------|--------|---------|
| `shared/references/core-standards.md` | Modify | Flip §2/§4/§5 to kebab; fix the §53 framing |
| `.opencode/scripts/git-hooks/pre-commit` (or CI) | Modify | Invoke the kebab guard on changed paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Planning stage. The implementer executes tasks.md, then records the delivery approach here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reconcile the doc rather than delete it | core-standards.md is cited by other modes; it must state the canon, not vanish. |
| Wire the existing guards rather than write new detection | The guards exist and pass unit tests; the gap is that nothing runs them. |
| Gate host (hook vs CI vs both) left open | Resolved during implementation per the open question; recorded here on completion. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard unit tests (`test_no_new_snake_case_guard.py`) | Not yet run, planned |
| Gate blocks a staged underscore name | Not yet run, planned |
| `validate_document.py` on edited core-standards.md | Not yet run, planned |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** This is a planning placeholder; the phase has no shipped code or doc edits yet.
2. **Legacy underscore roots.** The `--all` guard mode may hard-error on shipped legacy underscore roots until a separate content workstream migrates them; the plan uses `--changed-since` first.
<!-- /ANCHOR:limitations -->
