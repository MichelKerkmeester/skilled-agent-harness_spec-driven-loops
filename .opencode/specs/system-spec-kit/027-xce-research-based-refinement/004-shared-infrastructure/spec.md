---
title: "Feature Specification: Shared Infrastructure (Phase Parent)"
description: "Phase-parent for the cross-cutting transport, command, storage, dependency, and process-lifecycle phases that all three daemons rely on."
trigger_phrases:
  - "027 shared infrastructure"
  - "mcp to cli tool transition"
  - "command presentation workflow separation"
  - "cli tooling ux"
  - "ipc client cap hardening"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure"
    last_updated_at: "2026-06-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconcile phase map + child topology/status to nine on-disk children"
    next_safe_action: "Resume or validate a child phase folder"
    blockers: []
    key_files:
      - "spec.md"
      - "001-mcp-to-cli-tool-transition/spec.md"
      - "002-command-presentation-workflow-separation/spec.md"
      - "003-storage-adapter-ports/spec.md"
      - "004-cli-tooling-ux/spec.md"
      - "005-autonomous-dependency-patching/spec.md"
      - "006-code-mode-orphan-lifecycle/spec.md"
      - "007-ipc-client-cap-hardening/spec.md"
      - "008-mcp-config-alignment-reelection-default/spec.md"
      - "009-code-graph-code-only-indexing/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration narratives, renamed-from, X to Y history
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Shared Infrastructure (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several 027 phases live in the shared layers that span subsystems: the daemon CLI front-doors, command presentation/workflow separation, the storage adapter seam, CLI UX hardening, dependency patching, IPC client-cap, and code-mode orphan lifecycle. They share the shared-infrastructure surface rather than any single daemon, so they belong under one themed parent.

### Purpose
Own the shared-infrastructure child phases so each can be resumed and validated independently while the parent keeps the phase map and handoff order visible.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dual-stack CLI front-doors over the mk-* MCP daemons and their UX/docs/automation hardening.
- Command presentation and workflow separation across command families.
- Five-port storage adapter seam, autonomous dependency patching, IPC client-cap hardening, and code-mode orphan lifecycle.

### Out of Scope
- Memory-store and search work (track 002).
- Advisor and code-graph feature adoption (track 003).
- Implementation detail at the parent level.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| child phase folders `[0-9][0-9][0-9]-*/` | Modify/Create | all | Per-phase implementation lives in the child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-mcp-to-cli-tool-transition/` | Dual-stack CLI front-doors over the mk-* MCP daemons (spec-memory, code-index, skill-advisor) | Phase Parent |
| 002 | `002-command-presentation-workflow-separation/` | Split presentation (startup questions, dashboards, results templates) out of command.md into routed files | Complete |
| 003 | `003-storage-adapter-ports/` | Five-port storage adapter seam (vector, lexical, traversal, maintenance, contention) | Complete |
| 004 | `004-cli-tooling-ux/` | CLI tooling UX/docs/integration/automation hardening for the three daemon CLI front-doors | Phase Parent |
| 005 | `005-autonomous-dependency-patching/` | Autonomous npm-audit detection + lockfile-only remediation across OpenCode skill package roots | Complete |
| 006 | `006-code-mode-orphan-lifecycle/` | mcp-code-mode stdio server exits with its session; PPID-1 orphan reap | Complete |
| 007 | `007-ipc-client-cap-hardening/` | Daemon IPC client cap raised 8 to 64 across sources and nine config env blocks | Complete |
| 008 | `008-mcp-config-alignment-reelection-default/` | MCP config 1:1 alignment across runtimes + daemon re-election default-on | Complete |
| 009 | `009-code-graph-code-only-indexing/` | Drop markdown/prose from the code graph (code + structured config only) + selectable maintainer mode | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| (per-child) | (next child) | Each child ships and validates independently under tolerant policy | Per-child strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open at the parent level; per-phase questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
