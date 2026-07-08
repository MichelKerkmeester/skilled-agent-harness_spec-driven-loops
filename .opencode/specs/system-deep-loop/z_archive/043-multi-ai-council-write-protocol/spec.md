---
title: "Feature Specification: Multi-AI Council write protocol"
description: "Groups the archived Multi-AI Council output, persistence, deferral, write-authority, and main-agent enforcement phases that define how council deliberations produce durable ai-council artifacts."
trigger_phrases:
  - "multi-ai-council write protocol"
  - "council persistence write authority"
  - "ai-council artifact protocol"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/043-multi-ai-council-write-protocol"
    last_updated_at: "2026-07-08T00:00:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Created archive phase parent for council write-protocol phases"
    next_safe_action: "Resume a specific child phase for historical detail"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: Multi-AI Council write protocol

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Archived; mixed child states (`DONE`, completed, blocked, code-complete awaiting smoke) |
| **Created** | 2026-05-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `system-deep-loop` |
| **Parent Packet** | `system-deep-loop` |
| **Handoff Criteria** | Each child phase retains its own completion evidence; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Multi-AI Council write protocol spans multiple historical phases: council deliberations need a stable output structure, persistence machinery, deferral handling, write authority, and main-agent enforcement so council runs can produce durable `ai-council/` artifacts rather than chat-only reports.

### Purpose
Group the archived council write-protocol phases as one phase parent so readers can follow the protocol from output shape through persistence, deferrals, write authority, and main-agent enforcement. This parent organizes and tracks; implementation detail lives in each child phase.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All plans, task breakdowns, checklists, decisions, and continuity live in the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The archived Multi-AI Council output and persistence protocol phases.
- The archived deferral, write-authority, and main-agent write-enforcement phases.
- Parent-level navigation across child phase folders and recursive validation.

### Out of Scope
- Rewriting historical child conclusions, plans, task lists, implementation summaries, research logs, or review evidence.
- Changing the runtime council implementation or its historical verification evidence.
- Updating the shared `system-deep-loop/z_archive` graph metadata during parallel archive work.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This parent authors only `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives inside the phase children. Resume a specific phase with `/speckit:resume system-deep-loop/z_archive/043-multi-ai-council-write-protocol/[NNN-phase]/`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-multi-ai-council-output-protocol/` | Council deliberation outputs are transient: they return inline to chat and any intermediate seat outputs land in unstructured `scratch/` files | DONE; CHK-022/023 deferred (orchestrator-level writes scoped to follow-on) |
| 002 | `002-multi-ai-council-persistence/` | Packet 080 documents the `ai-council/` output protocol but provides no persistence machinery | DONE |
| 003 | `003-multi-ai-council-deferrals/` | [What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.] | Completed 2026-05-06; completion_pct 95 |
| 004 | `004-multi-ai-council-write-authority/` | The multi-ai-council agent is intentionally planning-only as of v3.4.1.0 | Blocked |
| 005 | `005-multi-ai-council-main-agent-write-enforcement/` | When the Multi-AI Council is invoked directly as a main agent in opencode (a Depth 0 user-initiated dispatch with no orchestrator wrapper), the counci | Code-complete; awaiting live sandbox-smoke verification |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before being treated as done.
- This parent tracks aggregate progress via the map.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at parent level. See child phases for historical blockers and deferred smoke evidence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../` (`system-deep-loop`)
- **Graph Metadata**: see `graph-metadata.json` for `derived.last_active_child_id`
