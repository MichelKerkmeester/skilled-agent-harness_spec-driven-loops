---
title: "Spec-Memory CLI Workstream"
description: "Phase-parent packet for the spec-memory CLI: completed feasibility/design/risk research (phase 000) and the three implementation phases that deliver the dual-stack CLI over the existing daemon."
trigger_phrases:
  - "spec-memory cli workstream"
  - "spec-memory cli phases"
  - "dual-stack cli implementation"
  - "memory cli build"
  - "028 001 phases"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All three implementation phases verified complete"
    next_safe_action: "Continue dual-stack observation window (open by design)"
    blockers: []
    key_files:
      - "spec.md"
      - "000-spec-memory-cli-research/research/research.md"
      - "001-cli-core/spec.md"
      - "002-hardening-and-tests/spec.md"
      - "003-runtime-integration/spec.md"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Research settled GO with zero unknowns (phase 000); implementation proceeds as phases 001-003."
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

# Feature Specification: Spec-Memory CLI Workstream (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-09 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mk-spec-memory daemon's only client surface is the MCP protocol layer: mid-session transport disconnects permanently remove the tools, every session pays schema token overhead, and hooks/cron/CI have no sanctioned path to the daemon at all.

### Purpose

Deliver the `spec-memory` CLI as a second IPC client over the unchanged daemon — dual-stack with the MCP registration — so transport-down recovery, hooks, cron, and scripts all have a first-class path to the 37 continuity tools.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The completed research record (feasibility, design, risk closure) as phase 000
- The dual-stack CLI build, its regression suites, and runtime adoption as phases 001–003

### Out of Scope

- MCP removal and migration of the measured 93-file/1,041-reference MCP surface — tracked at the transition-program level (`../spec.md`), not in this workstream

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 000-spec-memory-cli-research/** | Complete | Research record (runs 1–4, GO verdict, zero unknowns) |
| 001-cli-core/**, 002-hardening-and-tests/**, 003-runtime-integration/** | Complete | Implementation phases (~10–13d total) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | 000-spec-memory-cli-research/ | Research record: four deep-research runs ending in GO + zero unknowns (2 RESOLVED, 4 MITIGATED-terminal, 2 ACCEPTED); 8 delta specs; corrected measurements; 10–13d estimate | Complete |
| 1 | 001-cli-core/ | spec-memory CLI binary: 37 subcommands generated from TOOL_DEFINITIONS, Zod at argv, IPC connect + auto-spawn, exits 0/1/64/69/75, shim guards | Complete |
| 2 | 002-hardening-and-tests/ | Regression-lock the guarantees: D1 dual-spawn, D2 dual-client, D7 lifecycle suites + all-37 parity + D5 exit-69 docs (~3–4d) | Complete |
| 3 | 003-runtime-integration/ | Adoption surfaces: runtime allowlists, hook pairing for Claude/Codex (CLI-backed warm-only path in the existing adapters), NEW OpenCode plugin for spec-memory, packaging, transport-down fallback, dual-stack window (~2–3d, re-estimate with plugin scope) | Complete (dual-stack observation window open) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Phase 000 is the scope authority: implementation phases inherit its delta specs and measurements verbatim

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 000-spec-memory-cli-research | 001-cli-core | Research terminal: zero unknowns; delta specs pinned | `000-spec-memory-cli-research/research/research.md` §14 |
| 001-cli-core | 002-hardening-and-tests | CLI core exists; hardening now regression-locks all-37 invocation, dual-spawn, dual-client parity, and timing | Targeted CLI tests + live `memory_stats` smoke; full matrix in phase 002 |
| 002-hardening-and-tests | 003-runtime-integration | D1/D2/D7 + parity suites green; zero orphaned daemons post-suite | Full vitest run + process-table assertion |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at parent level. Phase-000 research closed all feasibility and risk questions; implementation-phase questions belong to the phase children.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `000-spec-memory-cli-research/research/research.md` — canonical merged synthesis (§1–14), scope authority for all phases
- `000-spec-memory-cli-research/spec.md` — research-phase spec with the generated findings fence
- `../spec.md` — transition-program parent (028)
- `../context-index.md` — packet reorganization bridge
