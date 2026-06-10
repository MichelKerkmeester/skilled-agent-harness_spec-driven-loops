---
title: "Implementation Summary: Phase 4: Release and Program Cleanup [system-spec-kit/028-mcp-to-cli-tool-transition/004-release-and-program-cleanup/implementation-summary]"
description: "IN PROGRESS — running summary for the 028 post-release doc-alignment phase; final state recorded at phase close."
trigger_phrases:
  - "028 release cleanup result"
  - "004 release-and-program-cleanup result"
  - "cli transition doc cleanup summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/004-release-and-program-cleanup"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Scaffolded running phase record; work not started"
    next_safe_action: "Execute tasks.md groups; update this record as groups close"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mcp-to-cli-tool-transition/004-release-and-program-cleanup |
| **Completed** | NOT YET — phase in progress (scaffolded 2026-06-10) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing shipped yet — this is the running summary for an in-progress phase. The phase scaffold (spec/plan/tasks/checklist + metadata) is in place, and the Phase 1 truth-source inventory is pinned: three CLI wrappers in `.opencode/bin/`, three `mcp_server` CLI entry points, three OpenCode plugins (including the new `mk-spec-memory.js`), the 11-variable CLI env var inventory (confirmed absent from `ENV_REFERENCE.md`), the doctor route CLI-probe state (skill-advisor/skill-budget present; memory/code-graph absent), and the three changelog track slots (after v3.5.0.4 / v1.1.0.0 / v0.6.0).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Added | Phase scaffold (Level 2) |
| `description.json`, `graph-metadata.json` | Added | Packet metadata |
| `../spec.md` (parent) | Modified | Phase map row for 004 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending — delivery notes are recorded here as tasks.md groups (a)-(h) close. The approach is verification-first: diff each doc surface against shipped behavior, patch only real drift, reconcile (never duplicate) the in-flight concurrent-agent work on skill READMEs and catalogs/playbooks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Single Level 2 phase instead of a phase-parent like 026's `000-release-and-program-cleanup` | 028's cleanup universe is one coherent doc-alignment sweep, not eight independent workstreams |
| Doctor memory/code-graph CLI-probe gap is verify-and-disposition, not auto-edit | Parity may be intentionally deferred to owning workstreams; needs operator sign-off (REQ-004) |
| Changelog written via skill-local paths | `.opencode/changelog/<track>` directories are symlinks; git tracks the real skill-local files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Pending. Planned evidence at close: SC-001 stale-claim grep (hit-free per group), SC-002 bidirectional ENV_REFERENCE-vs-code env var diff, checklist.md P0/P1 completion, and `validate.sh --strict` exit 0 on this folder and the parent.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- This summary intentionally precedes the work — it exists as the running continuity surface for the phase and must not be read as a completion claim until the Metadata "Completed" field carries a date and the Verification section carries evidence.
- T9xx transport-down drills and the tri-daemon spawn drill remain owned by the workstream phases; this phase closes independently of them.
<!-- /ANCHOR:limitations -->
