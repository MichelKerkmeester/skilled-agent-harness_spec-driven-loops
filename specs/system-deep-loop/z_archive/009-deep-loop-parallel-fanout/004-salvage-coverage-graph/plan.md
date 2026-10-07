---
title: "Implementation Plan: Phase 004 — Salvage sweep + coverage-graph per-sessionId"
description: "Reconstructed Level 2 implementation plan for the salvage and coverage-isolation phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "salvage coverage graph plan"
  - "fanout salvage coverage isolation plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 004 — Salvage sweep + coverage-graph per-sessionId

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js runtime script (`fanout-pool.cjs`) plus the shared coverage-graph writer |
| **Framework** | deep-loop-runtime fan-out with per-lineage sub-packets |
| **Storage** | Shared `deep-loop-graph.sqlite` keyed by per-lineage `session_id` |
| **Testing** | Unit salvage cases plus a two-lineage integration no-collision assertion |

### Overview
Make every iteration yield a usable artifact even when an executor does not write its file, and confirm that per-lineage session ids keep parallel lineages from colliding on the shared coverage SQLite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 per-lineage spawn path available
- [ ] Shared coverage-graph writer behavior understood

### Definition of Done
- [ ] Missing iteration files are salvaged from executor stdout
- [ ] Two lineages share one SQLite with no collision
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reuse-first: sweep with the existing `post-dispatch-validate.ts#validateIterationOutputs` instead of a new validator, and rely on the existing WAL writer lock rather than changing the schema.

### Key Components
- `fanout-pool.cjs` salvage step
- `{sub-packet}/logs/iter-NNN.out` capture from the spawn path
- `convergence.cjs` plus coverage writes keyed by `session_id`

### Data Flow
After each lineage sub-loop, a missing or empty iteration file is recovered by parsing the captured stdout and writing `iterations/iteration-NNN.md`, then appending a `salvaged_from_stdout` event and re-validating.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Salvage sweep
- [ ] Sweep lineage outputs and recover missing iteration files from stdout

### Phase 2: Coverage isolation
- [ ] Confirm per-lineage `session_id` scoping needs no schema change

### Phase 3: Verification
- [ ] Unit salvage cases plus the two-lineage no-collision integration test
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit coverage for the salvage outcomes and one integration assertion over a shared `deep-loop-graph.sqlite`; exact command output is Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 per-lineage spawn path | Internal | Not recorded | Salvage has no per-lineage stdout to sweep |
| Shared coverage-graph SQLite (existing) | Internal | Existing | Isolation below the salvage step cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was worked.
<!-- /ANCHOR:rollback -->
