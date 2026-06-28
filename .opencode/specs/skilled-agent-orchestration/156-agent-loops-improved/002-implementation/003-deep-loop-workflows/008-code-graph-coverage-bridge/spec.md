---
title: "Code-Graph to Coverage-Graph Init Bridge"
description: "The deep-context and deep-review loops start with an empty coverage graph, which the convergence check misreads as CONTINUE (zero nodes = no converged nodes). Seeding SLICE/FILE/SYMBOL/DEPENDENCY nodes from frontier_slices_json and code-graph imports before the first convergence check is needed."
trigger_phrases:
  - "code graph coverage bridge"
  - "coverage graph seed"
  - "empty coverage graph convergence"
  - "seed source coverage init"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/003-deep-loop-workflows/008-code-graph-coverage-bridge"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 36)"
    next_safe_action: "Add seeding step to deep_context_auto.yaml and upsert.cjs --seed-source flag"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_context_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Code-Graph to Coverage-Graph Init Bridge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 12 |
| **Predecessor** | 007-ideas-backlog-lifecycle |
| **Successor** | 009-loop-quality-benchmark |
| **Handoff Criteria** | Seeding step runs before first convergence check in both context and review modes; seeded nodes have `seed_source`/`seed_confidence` fields; empty-graph warning logged when seeding yields zero nodes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the deep-loop-workflows recommendations.

**Scope Boundary**: Code-graph→coverage-graph seeding for context mode (deep) and review mode (shallow). Full vocab expansion for review is a separate deep-rewrite variant.

**Dependencies**:
- No hard predecessors; can run independently

**Deliverables**:
- `deep_context_auto.yaml`: init seeding step before first convergence check; seeds `SLICE/FILE/SYMBOL/DEPENDENCY` nodes from `frontier_slices_json`/code-graph imports
- `upsert.cjs`: `--seed-source` flag required for seeding path
- `coverage-graph-db.ts`: seed path carrying `seed_source`/`seed_confidence` on seeded nodes
- `deep_review_auto.yaml`: shallow seed variant (fewer node types)
- Empty-graph warning logged when seeding yields zero nodes (non-fatal; run continues)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-context and deep-review loops start with an empty coverage graph. The convergence check interprets zero nodes as `CONTINUE` (no converged nodes yet), so the loop can never produce a meaningful STOP signal until it has added nodes through iteration — but it may add nodes slowly or not at all if the first iteration's focus doesn't match any code-graph entry. The source of a seeded node is not tracked, making seed-vs-organic coverage indistinguishable.

### Purpose
Seed `SLICE/FILE/SYMBOL/DEPENDENCY` nodes from `frontier_slices_json` and code-graph imports before the first convergence check; carry `seed_source` and `seed_confidence` on seeded nodes; log a warning when seeding yields zero nodes; seed context mode deep and review mode shallow.

> **Reference evidence**: `external/loop-cli-main/src/daemon/manager.ts:34-86` (init seeding from external graph); `external/kasper/src/agent-prompt-resolver.ts:203-240` (seed-source metadata on graph nodes). Research.md §5.2 + (iter 36).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deep_context_auto.yaml`: seeding step before first convergence check; seeds `SLICE/FILE/SYMBOL/DEPENDENCY` nodes from `frontier_slices_json`/code-graph imports
- `upsert.cjs`: `--seed-source <source>` and `--seed-confidence <value>` flags required for all seeding paths
- `coverage-graph-db.ts`: seed path adds `seed_source` and `seed_confidence` fields to seeded nodes; non-seeded nodes do not get these fields
- `deep_review_auto.yaml`: shallow seed variant (SLICE + FILE only; no SYMBOL/DEPENDENCY)
- Empty-graph warning logged when seeding yields zero nodes; run continues (non-fatal)

### Out of Scope
- Full vocab expansion for review mode (SYMBOL/DEPENDENCY in review) — rated as deep-rewrite variant; separate follow-up
- Cross-mode convergence contract changes — belongs to 003

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modify | Add init seeding step before first convergence check; seeds deep (all four node types) |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/upsert.cjs` | Modify | Add `--seed-source` and `--seed-confidence` flags; enforce flags on seed code path |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Modify | Seed path adds `seed_source`/`seed_confidence` to seeded nodes; empty-graph warning |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modify | Add shallow seed variant (SLICE + FILE only) before first convergence check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Seeding step runs before the first convergence check in both context and review modes; `seed_source` and `seed_confidence` fields present on all seeded nodes | After seeding, coverage graph has at least one node before first convergence check; seeded nodes have `seed_source` and `seed_confidence` fields; non-seeded nodes do not |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Empty-graph warning logged when seeding yields zero nodes; seeding step is non-fatal (run continues); code-graph unavailability at seed time produces a warning, not a hard failure | If code-graph is unavailable, seeding logs a warning and the loop starts with an empty graph; this is not treated as a fatal error |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After the seeding step, coverage graph has at least one node before the first convergence check; seeded nodes carry `seed_source` and `seed_confidence` fields; non-seeded nodes added during iterations do not carry these fields
- **SC-002**: When code-graph is unavailable at seed time, a warning is logged and the loop continues with an empty graph; no hard failure is thrown
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Code-graph unavailability at seed time could block the loop if treated as fatal | High | Seed step is non-fatal: warn and continue with empty graph |
| Risk | Review mode seeding too many nodes (SYMBOL/DEPENDENCY) could create a noisy initial coverage graph | Med | Review mode shallow seed: SLICE + FILE only; SYMBOL/DEPENDENCY expansion is a separate follow-up |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `seed_confidence` be a fixed constant (e.g., 0.5) or configurable per run? What is the appropriate default for code-graph-seeded nodes?
- What is the correct threshold separating "shallow" (review) from "deep" (context) seeding — just node types, or also depth of import traversal?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
