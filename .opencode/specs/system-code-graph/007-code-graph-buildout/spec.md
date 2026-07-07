---
title: "Feature Specification: Code Graph [system-code-graph/007-code-graph-buildout/spec]"
description: "Build and harden the code-graph structural-indexing surface: the standalone package, CocoIndex decoupling, startup fixes, and the code-graph runtime, resilience, extraction, and documentation sub-themes."
trigger_phrases:
  - "026 code graph"
  - "code graph structural indexing"
  - "coco-index decoupling"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout"
    last_updated_at: "2026-05-26T17:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase-parent map during the 026 wave-4 phase work."
    next_safe_action: "Resume or plan a child phase folder listed in the Phase Documentation Map."
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

# Feature Specification: Code Graph

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Build and harden the code-graph structural-indexing surface: the standalone package, CocoIndex decoupling, startup fixes, and the code-graph runtime, resilience, extraction, and documentation sub-themes. Code graph is a structural surface distinct from the memory store and cross-links to it.

### Purpose
Own navigation, the child-phase map, and aggregate status for this theme. Each child phase folder owns its own planning, execution, and verification.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the child phase folders for this theme and their aggregate status.
- Provide the navigation map from this theme to each child phase folder.

### Out of Scope
- Per-child implementation detail (lives in each child phase folder).
- Phase history narration (lives in the root `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-mcp-shared-dependency-startup-fix/` … `009-system-code-graph-uplift-phase-parent/` | Modify | children | Per-child work lives in the child phase folders |
| `spec.md`, `graph-metadata.json`, `description.json` | Modify | this | Theme navigation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. The Status column reports child state.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-mcp-shared-dependency-startup-fix/` | Fix @spec-kit/shared dependency declaration for mk_code_index MCP startup | complete |
| 002 | `002-deprecate-coco-index/` | Remove mcp-coco-index and rerank-sidecar; stand code-graph alone as structural-only | in progress (95%) |
| 003 | `003-code-graph-workspace-root-fix/` | Fix workspace-root and socket-dir resolution for code-index MCP reconnection | complete |
| 004 | `004-runtime-and-scan/` | Code-graph runtime upgrades, scan scope and correctness, resolver and hooks, excludes | complete |
| 005 | `005-resilience-and-advisor/` | Advisor refinement, backend resilience research and implementation, iteration-quality, doctor apply-mode | complete |
| 006 | `006-extraction-and-isolation/` | system-code-graph extraction, decision record, standalone-MCP pivot, three-way isolation | complete |
| 007 | `007-docs-and-readmes/` | Doctor diagnostic phase-a, READMEs, doc-drift alignment, cross-skill and reference-template polish | complete |
| 008 | `008-real-world-usefulness-test-planning/` | Real-world usefulness test planning (nested phase parent) | complete |
| 009 | `009-system-code-graph-uplift-phase-parent/` | system-code-graph uplift (nested phase parent) | complete |
| 010 | `010-playbook-validation-and-hardening/` | Code-graph manual-testing playbook validation (22 scenarios) + remediation/hardening | complete |
| 011 | `011-source-bug-and-misalignment-audit/` | Source bug and documentation misalignment audit for system-code-graph | complete (remediation pending) |
| 012 | `012-empty-graph-first-time-auto-scan/` | Empty-graph first-time auto-establish under default scope | complete |
| 013 | `013-owner-lease-election-race/` | Owner-lease single-writer election race investigation | investigated (fix deferred) |
| 014 | `014-gold-query-battery-repair/` | Repair stale Code Graph gold-query battery after extraction | complete |
### Phase Transition Rules

- Each child MUST pass `validate.sh` independently.
- This parent tracks aggregate progress via the map; per-child detail stays in the children.
- Deferred and abandoned children remain in place with explicit status; they are not removed.
- Use `/spec_kit:resume` on a child folder to resume it.
- Run `validate.sh --recursive` on this folder to validate all children as a unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-mcp-shared-dependency-startup-fix` | `009-system-code-graph-uplift-phase-parent` | Earlier children stable before later children build on them | Each child validates independently |
| `013-owner-lease-election-race` | `014-gold-query-battery-repair` | Deferred race investigation does not block fixture repair | Repaired battery passes `code_graph_verify` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Deferred children are tracked in place and resumed via their folders when prioritized.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
