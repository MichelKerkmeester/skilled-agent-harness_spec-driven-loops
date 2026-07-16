---
title: "Implementation Plan: Code-Graph to Coverage-Graph Init Bridge"
description: "Documents the completed code-graph seeding bridge for initial coverage graph state in context and review modes."
trigger_phrases:
  - "code graph coverage bridge"
  - "coverage graph seed"
  - "empty coverage graph convergence"
  - "seed source coverage init"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/008-code-graph-coverage-bridge"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_context_auto.yaml"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/upsert.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Code-Graph to Coverage-Graph Init Bridge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-loop YAML workflow, JavaScript CLI, TypeScript coverage-graph storage |
| **Framework** | `deep-loop-runtime` coverage graph used by context and review deep loops |
| **Storage** | Coverage-graph nodes seeded from code graph and frontier slice data |
| **Testing** | Seed-path checks, empty-graph warning checks, context/review init-order checks |

### Overview
This completed work seeds coverage graph state from code graph and frontier slice inputs before the first convergence check. Context mode receives deep seeding across slice, file, symbol, and dependency nodes; review mode receives a shallow slice/file seed, with warnings instead of fatal errors when code graph data is unavailable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Empty coverage graph behavior was identified as misleading convergence input.
- [x] Context and review seeding depths are separated.
- [x] Full review vocab expansion remains out of scope.

### Definition of Done
- [x] Context workflow seeds before first convergence check.
- [x] Review workflow seeds before first convergence check with shallow node types.
- [x] Seeded nodes carry `seed_source` and `seed_confidence`.
- [x] Code-graph unavailability logs a non-fatal warning.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Initialization bridge: derive initial coverage graph nodes from known code graph/frontier inputs, annotate them as seeded, and let organic iteration nodes remain unannotated.

### Key Components
- **`deep_context_auto.yaml`**: Runs deep seeding before first convergence check.
- **`upsert.cjs`**: Accepts `--seed-source` and `--seed-confidence` for seeding paths.
- **`coverage-graph-db.ts`**: Persists seed metadata on seeded nodes.
- **`deep_review_auto.yaml`**: Runs shallow seed variant for review mode.

### Data Flow
Frontier slice and code graph inputs feed the seeding step, the upsert path writes coverage graph nodes with seed metadata, and the first convergence check sees a non-empty graph when data is available. If seeding yields zero nodes, the workflow logs a warning and continues.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Context workflow | Initializes deep context loop | Add deep seed step before convergence | Coverage graph has seed nodes before first check |
| Review workflow | Initializes deep review loop | Add shallow seed step | Only slice/file seed in review mode |
| Upsert CLI | Writes graph nodes | Require seed metadata for seeding path | Seeded nodes include source and confidence |
| Coverage graph DB | Stores node metadata | Persist seed fields only for seeded nodes | Organic nodes lack seed metadata |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and capture context/review seeding requirements.
- [x] Identify workflow, CLI, and DB surfaces.
- [x] Keep full review symbol/dependency expansion out of scope.

### Phase 2: Core Implementation
- [x] Add context-mode seeding before the first convergence check.
- [x] Add `--seed-source` and `--seed-confidence` flags to seeding upsert path.
- [x] Persist `seed_source` and `seed_confidence` on seeded nodes.
- [x] Add review-mode shallow seeding.
- [x] Log non-fatal warnings for zero-node or unavailable code graph seeding.

### Phase 3: Verification
- [x] Verify seeded nodes exist before first convergence check when data is available.
- [x] Verify seeded nodes include metadata and organic nodes do not.
- [x] Verify code graph unavailability warns and allows the run to continue.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Workflow ordering | Seed step before convergence in context/review | YAML inspection or workflow fixture |
| Storage metadata | Seeded versus organic nodes | Coverage graph DB test |
| Degraded mode | Code graph unavailable or zero nodes | Seeding fixture with warning assertion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Code graph data | Runtime input | Optional | Missing data logs warning and starts with empty graph |
| Full review vocab expansion | Follow-up | Out of scope | Review stays shallow until separate deep rewrite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Seeding blocks loop startup, seed metadata pollutes organic nodes, or review mode becomes noisy from over-seeding.
- **Procedure**: Revert context/review workflow seed steps, upsert seed flags, and coverage DB seed metadata handling, then restore empty-graph startup with a documented convergence limitation.
<!-- /ANCHOR:rollback -->
