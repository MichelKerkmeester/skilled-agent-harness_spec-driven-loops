---
title: "Implementation Summary: Goal docs hygiene + cross-runtime contracts"
description: "Planned closeout phase for packet 032, not yet built. Records the intended rename-fallout fixes and documentation updates ahead of implementation, which is gated on phases 001-007 landing first."
trigger_phrases:
  - "goal docs hygiene summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/008-goal-docs-hygiene"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 1 doc set for phase 008; nothing implemented yet"
    next_safe_action: "Implement after phases 001-007 land, per phase-dependency order"
    blockers:
      - "Depends on phases 001-007 landing first."
    key_files:
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
      - ".opencode/skills/system-spec-kit/references/hooks/goal-plugin.md"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-008-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope: docs-only closeout phase, no new hook code."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-goal-docs-hygiene |
| **Completed** | Not yet built |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet built. This phase is authored as a Level 1 spec-doc set only, describing what its implementation will do once phases 001-007 land: fix the four known stale rename-fallout references, repair `mk-goal-tool-path.test.cjs`'s broken path, add the new goal hooks to `injection-contract.md`, update `goal-plugin.md` (or a new sibling) with the shared-file state model and capability matrix, update the constitutional runtime-routing rule, and author a behavioral concern README for `.opencode/hooks/goal/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Not yet delivered | Implementation blocked on phases 001-007 landing first |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Per the parent packet's phase order, this phase must run last: it documents and closes out what phases 001-007 build (goal core, capability probes, per-runtime adapters, dispatch-shape coverage, plugin symlinks), so nothing here can be written accurately before those artifacts exist. This spec/plan/tasks set was authored ahead of implementation to reserve the phase's scope and requirements per the operator-approved plan.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Sequence this phase strictly last | It documents/finalizes what phases 001-007 build; writing it earlier would risk describing unbuilt or speculative artifacts |
| Level 1, not Level 2 | Docs-only closeout with a small, well-bounded file list (~8 files), no code or architecture change |
| Keep `goal-plugin.md` vs. new `goal-cross-runtime.md` as an open question | Decision depends on how much new content the phase 002 capability matrix and phase 001 manage-CLI contract actually add; deferred to implementation time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Manual | Not yet run | Repo-wide grep sweep for stale references pending implementation |
| Unit | Not yet run | `mk-goal-tool-path.test.cjs` fix pending implementation |
| Documentation | Not yet run | `validate_document.py` on touched/new docs pending implementation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** This packet reserves the phase's scope and requirements; no rename-fallout fix, test repair, or documentation update has been applied yet.
2. **Hard-gated on phases 001-007.** Any attempt to write the injection-contract entries or the capability-matrix section before those phases land would describe artifacts that do not exist yet.
3. **Sibling-doc decision deferred.** Whether `goal-plugin.md` is updated in place or a new `goal-cross-runtime.md` is authored is left open until the real content volume from phases 001-002 is known.
<!-- /ANCHOR:limitations -->
