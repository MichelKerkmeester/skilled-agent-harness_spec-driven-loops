---
title: "Implementation Summary: Validate advisor extraction and remove deprecated bridge"
description: "Planned execution ledger for child 006; records the scaffolded validation and cleanup contract before implementation runs."
trigger_phrases:
  - "013/009/006 implementation summary"
  - "advisor cleanup implementation ledger"
  - "system_skill_advisor final validation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/006-validation-cleanup-and-deprecation-removal"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Docs authored"
    next_safe_action: "Execute Phase 1 inventory"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0130090060000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-006-validation-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This dispatch authored the Level 3 spec docs only; cleanup implementation remains pending."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Validate Advisor Extraction and Remove Deprecated Bridge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `006-validation-cleanup-and-deprecation-removal` |
| **Status** | Planned |
| **Level** | 3 |
| **Created** | 2026-05-14 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This scaffold turns child 006 from raw templates into an executable Level 3 packet for the final advisor extraction pass. It defines the validation matrix, bridge-removal gate, stale-doc cleanup policy, cross-runtime smoke expectations, checklist rows, and metadata needed before the actual cleanup run begins.

### Specification Contract

The spec now describes Step 5 of ADR-001's migration: validate the standalone `system_skill_advisor` MCP server, prove all runtimes call it directly, then remove the temporary `spec_kit_memory` advisor proxy and stale old-path documentation.

### Execution Plan

The plan uses three phases: setup inventory, implementation cleanup, and final verification. The critical gate is ADR-003: proxy removal requires zero callers in spec packets, zero callers in plugin/code surfaces, and manual operator confirmation.

### Decision Ledger

Five ADR entries are authored:

| ADR | Decision |
|-----|----------|
| ADR-001 | Parent ADR remains authoritative. |
| ADR-002 | Full validation surface required for completion. |
| ADR-003 | Deprecation removal requires zero callers plus operator confirmation. |
| ADR-004 | Delete stale live docs, annotate legitimate historical refs. |
| ADR-005 | Final proof requires cross-runtime smoke plus old-surface absence checks. |

### Metadata

`description.json` and `graph-metadata.json` identify this child as planned packet `006` under the `009-system-skill-advisor-extraction` phase parent.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scaffold was authored from the existing Level 3 template files already present in the packet folder. Required parent and sibling context came from ADR-001, the phase parent spec, child 003's spec and description shape, and child 003's implementation summary note that remaining old path references may be historical or child 006 cleanup work.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep packet status planned | This dispatch is spec-docs-only and does not execute cleanup. |
| Require validation before deletion | The proxy exists to protect callers during migration, so removal needs evidence first. |
| Preserve parent ADR topology | Child 006 should not reopen server-id or tool-id decisions. |
| Track historical docs separately from live docs | Migration rationale remains useful, but operator instructions must be current. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Required reading | PASS: ADR-001, parent spec, child 003 spec, child 003 description, and child 003 implementation summary were read. |
| Scope discipline | PASS: authored docs are scoped to `013/009/006` plus its metadata files. |
| Strict validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/006-validation-cleanup-and-deprecation-removal --strict --verbose` exited 0. |
| JSON parse smoke | PASS: Node `JSON.parse` smoke passed for `description.json` and `graph-metadata.json`. |
| Runtime cleanup validation | Not run: packet implementation remains planned. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cleanup not executed.** The memory proxy, stale docs, runtime probes, DB checks, and package-local tests remain future work for the implementation run.
2. **Operator confirmation pending.** ADR-003 blocks proxy deletion until zero-caller evidence and manual confirmation are captured.
3. **Checklist mostly pending.** Only scaffold-authoring checklist rows are checked; implementation evidence must update the remaining rows.
<!-- /ANCHOR:limitations -->
