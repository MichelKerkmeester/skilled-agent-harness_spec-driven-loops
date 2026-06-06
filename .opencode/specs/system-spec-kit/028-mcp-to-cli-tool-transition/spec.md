---
title: "MCP to CLI Tool Transition"
description: "Phase-parent packet for transitioning the mk-spec-memory MCP surface to a CLI tool: feasibility research, dual-stack CLI delivery, and the eventual migration decision."
trigger_phrases:
  - "mcp to cli transition"
  - "028 transition"
  - "spec-memory cli phases"
  - "memory mcp cli"
  - "dual-stack cli program"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition"
    last_updated_at: "2026-06-06T12:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 001 research complete: GO verdict, zero unknowns, 10-13d implementation estimate"
    next_safe_action: "Open the dual-stack CLI implementation phase via speckit:plan"
    blockers: []
    key_files:
      - "spec.md"
      - "001-spec-memory-cli/spec.md"
      - "001-spec-memory-cli/research/research.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "028 is the parent packet for the MCP-to-CLI transition; the completed feasibility/design/risk research lives under child phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: MCP to CLI Tool Transition (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mk-spec-memory MCP server (37 tools) is the spec-kit's continuity backbone, but the MCP transport carries real operational costs: a mid-session transport disconnect permanently removes the tools from a live session because Claude Code never reconnects MCP transports, every session pays tool-schema token overhead, and each runtime needs separate MCP registration. A CLI surface over the same daemon removes the transport fragility without losing any feature.

### Purpose

Transition the memory MCP surface to a CLI tool in phases: settle feasibility with evidence, ship a dual-stack CLI (MCP stays registered; CLI becomes the resilience + universal surface for hooks, cron, CI, and transport-down recovery), and only then decide on full migration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Feasibility, architecture, and risk research for replacing the MCP protocol layer with a CLI over the existing daemon/IPC socket.
- Dual-stack delivery: `spec-memory` CLI alongside the existing MCP registration, with auto-spawn, session-identity continuity, and the verified design-delta set.
- The eventual migration decision (move runtime surfaces off MCP references) as a later, separately-gated phase.

### Out of Scope

- MCP removal — the MCP registration stays through the dual-stack window.
- Daemon redesign — the daemon, IPC bridge, session proxy, and all 37 handlers stay unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 001-spec-memory-cli/** | Complete | Research phase: feasibility, design, risk closure (done) |
| mcp_server/spec-memory-cli.ts, .opencode/bin/spec-memory.cjs | Future phase | Dual-stack CLI implementation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Scope |
|-------|--------|--------|-------|
| 001 | `001-spec-memory-cli/` | Complete | Four research runs: feasibility GO verdict (zero feature loss iff the daemon stays), dual-stack CLI design (codegen from TOOL_DEFINITIONS, exits 0/1/64/69/75), risk resolution, and total risk closure (2 RESOLVED, 4 MITIGATED-terminal, 2 ACCEPTED, 0 unknowns); 8 design deltas; 10–13d implementation estimate |
| 002+ | not yet created | Pending | Dual-stack CLI implementation (inherits the 8 delta specs and corrected measurements), then a separately-gated migration decision |

### Phase Transition Rules

- Each phase child carries its own full doc set (spec/plan/tasks/implementation-summary); this parent stays a lean control file.
- The implementation phase must absorb the 8 design deltas (D1–D7, DD-001) verbatim from `001-spec-memory-cli/research/research.md` §14 and re-estimate as routine planning hygiene.
- Full migration of MCP references (measured: 93 files / 1,041 references) stays out of scope until the dual-stack window proves the CLI in production use.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at parent level. Phase-001 research closed all feasibility and risk questions; implementation-phase questions belong to the next child packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `001-spec-memory-cli/spec.md` — completed research phase (verdict chain, generated findings fence)
- `001-spec-memory-cli/research/research.md` — canonical merged synthesis (§1–14)
- `context-index.md` — packet reorganization bridge
