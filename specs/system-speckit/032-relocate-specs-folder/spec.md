---
title: "Feature Specification: Relocate Specs Folder"
description: "Phase-parent: evaluate and (if approved) execute moving the root spec-kit folder from .opencode/specs/ to a top-level specs/ directory."
trigger_phrases:
  - "relocate specs folder"
  - "specs folder outside opencode"
  - "root specs directory"
  - "move .opencode/specs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder"
    last_updated_at: "2026-08-07T11:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phases 3 and 4 both complete; T015 operator review open"
    next_safe_action: "Operator reviews the final state (003's T015)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Relocate Specs Folder

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Phase 001 research converges with a ranked implication set; an explicit go/no-go decision on the move is recorded before any phase attempts the actual relocation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The canonical spec-kit tree currently lives at `.opencode/specs/`. A root-level `specs` symlink already points at it (`specs -> .opencode/specs`, tracked in git with a pre-staged `.gitignore` `!specs` negation), suggesting the repo anticipates specs living at the root eventually. Before making that the literal directory (moving the real folder to `specs/` at repo root and leaving `.opencode/specs` as whatever back-reference makes sense, or removing the indirection entirely), the blast radius is large and mostly undiscovered: spec-kit tooling (`validate.sh`, `create.sh`, generators, the memory MCP server) resolves paths relative to `.opencode/`, every runtime mirror (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) may carry its own expectations, the global `~/.gitignore_global` already special-cases `/specs` and `/.opencode/` for downstream repos that symlink this one, and thousands of files under the current tree reference `.opencode/specs/...` paths in frontmatter, scripts, and prose.

### Purpose

Phase 001 runs bounded, non-implementing research to surface every implication of the move — tooling path assumptions, cross-runtime symlink mechanics, git/gitignore interactions, memory-MCP path resolution, and migration risk — before any phase attempts the relocation itself. No code or path changes happen in phase 001.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Phase 001: dual-executor deep research on the implications of relocating the specs root.
- Later phases (not yet planned): a go/no-go decision, and — only if approved — a migration plan and execution.

### Out of Scope

- Any actual file move in phase 001. Research only; no code, path, or config changes.
- Any change to the existing root `specs` symlink or `.gitignore` `!specs`/`!.opencode/` negation rules during phase 001.

### Files to Change

None in phase 001 (research-only). Per-phase detail for any later implementation phase lives in that phase's own `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| — | — | 001 | Research phase touches no repo files outside its own `research/` state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-relocation-implications-research/ | Dual-executor (GLM-5.2 High via cli-devin, Grok 4.5 High via cli-cursor) deep research: implications of moving the specs root outside .opencode | Complete — CONDITIONAL-GO |
| 2 | 002-migration-plan/ | Design the topology-inversion migration: invert the 21-entry resolver registry, adapt the existing `spec-root-*` primitives, resolve the downstream-ownership policy decision | Complete — both ADRs Accepted |
| 3 | 003-migration-execution/ | Execute the accepted plan: topology-flip function, 21-entry registry inversion, atomic symlink-flip + `.gitignore` rebase, Memory MCP reindex | Complete — all 11 steps executed and verified, T015 operator review open |
| 4 | 004-code-graph-index-flag-deprecation/ | Remove the dead `SPECKIT_CODE_GRAPH_INDEX_*` maintainer-mode flag mechanism (git filter, config, doc, dead env-var fallback), discovered as a side effect of phase 3's `scripts/` cleanup | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume system-speckit/032-relocate-specs-folder/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-relocation-implications-research | 002-migration-plan | Research converged with a ranked implication list and an explicit recommendation | `research/research.md` present with findings; operator reviewed and confirmed proceeding to a migration plan |
| 002-migration-plan | 003-migration-execution | Both ADRs Accepted; operator explicitly confirmed proceeding to execution scoping | `decision-record.md` ADR-001 and ADR-002 both status Accepted |
| 003-migration-execution | 004-code-graph-index-flag-deprecation | Not a sequential dependency — 004 is a self-contained cleanup discovered mid-phase-3, scoped and run independently | `004/tasks.md` T001-T008 all `[x]` with evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Resolved by phase 001 research: neither a literal rename nor keeping `.opencode/specs` as-is — the recommended shape is a **flip**, real tree at `specs/` with `.opencode/specs -> ../specs` as a back-symlink, which neutralizes 99.6% of in-repo references at zero repointing cost. See `001-relocation-implications-research/research/research.md` §6.
- Resolved by phase 001 research: no runtime mirror needs its own `specs` symlink — none of `.claude`, `.codex`, `.cursor`, `.devin`, `.pi` carry one today, and the flip covers them automatically.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folder `001-relocation-implications-research/` for research state and findings
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
