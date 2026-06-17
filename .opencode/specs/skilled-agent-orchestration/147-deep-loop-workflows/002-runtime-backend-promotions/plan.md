---
title: "Implementation Plan: Runtime backend promotions"
description: "Implementation Plan for phase 002 of the deep-loop-workflows merge: Runtime backend promotions."
trigger_phrases:
  - "deep-loop-workflows phase 002"
  - "runtime-backend-promotions"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/002-runtime-backend-promotions"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 002 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-002-runtime-backend-promotions-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Runtime backend promotions

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, `.cjs`/`.ts` runtime, YAML command assets |
| **Framework** | deep-loop-workflows merge (two-skill architecture) |
| **Storage** | `.opencode/skills/`, `.opencode/commands/deep/`, advisor SQLite graph |
| **Testing** | byte-identical per-mode parity vs phase-001 baseline + `validate.sh --strict` |

### Overview
Promote only the named generic backend contracts while preserving all old public skill entrypoints as compatibility shims. Keep deep-loop-runtime MCP-free, keep improvement out of convergence loop types, and put emitResourceMap in non-discoverable workflow shared synthesis rather than the runtime. Execute read-only inventory and independent module/test work in parallel, then serialize final integration and parity signoff against the phase-001 baseline.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 001) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] Phase-001 baseline manifest and runtime-ownership ADR are present before edits.
- [ ] deep-loop-runtime contains promoted runtime-capabilities, artifact-root, loop-lock CLI, and lifecycle-taxonomy contracts.
- [ ] emitResourceMap lives in workflow shared synthesis, not deep-loop-runtime.
- [ ] Old research/review runtime-capabilities scripts remain byte-compatible shims.
- [ ] Research, review, and context reducers import artifact-root from runtime without artifact byte changes.
- [ ] Research and review reducers import resource-map emission from workflow shared synthesis without markdown byte changes.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G0** (opus seats): Serial precondition and API contract freeze from phase-001 baseline and current source contracts.
- **G1** (mixed seats): Parallel read-only inventory of existing resolver, artifact, resource-map, lock, and taxonomy behavior.
- **G2** (gpt seats): Parallel implementation of disjoint promoted backend/shared modules after API contract freeze.
- **G3** (mixed seats): Parallel per-file consumer rewires and docs updates with one owner per reducer/shim file.
- **G4** (mixed seats): Parallel contract, parity, no-MCP, no-discovery, and no-improvement-loopType verification.
- **G5** (opus seats): Serial final evidence capture and strict spec validation.

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 001) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Gate on phase-001 baseline manifest and runtime-ownership ADR before any Phase 002 edit. (`.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/**`, `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/002-runtime-backend-promotions/**`) — _verify:_ Baseline manifest readable and phase-001 strict validation evidence present.
- [ ] T2 Freeze exact promoted API and output contracts from current source files. (`.opencode/skills/deep-research/scripts/runtime-capabilities.cjs`, `.opencode/skills/deep-review/scripts/runtime-capabilities.cjs`, `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs`) — _verify:_ Inventory confirms no improvement loopType and six stopReason plus four sessionOutcome taxonomy.
- [ ] T3 Promote parameterized runtime-capabilities resolver and keep old scripts as byte-compatible shims. (`.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs`, `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs`, `.opencode/skills/deep-review/scripts/runtime-capabilities.cjs`) — _verify:_ Phase-001 command matrix for old scripts compares byte-identical stdout/stderr/exit codes.
- [ ] T4 Promote resolveArtifactRoot contract into runtime and rewire graph-backed reducers. (`.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`, `.opencode/skills/deep-research/scripts/reduce-state.cjs`, `.opencode/skills/deep-review/scripts/reduce-state.cjs`) — _verify:_ Golden artifact-root matrix and reducer fixture artifact trees match phase-001 bytes.
- [ ] T5 Move emitResourceMap to workflow shared synthesis, not runtime, and rewire research/review reducers. (`.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs`, `.opencode/skills/deep-research/scripts/reduce-state.cjs`, `.opencode/skills/deep-review/scripts/reduce-state.cjs`) — _verify:_ Research/review resource-map markdown bytes match old renderer; context/improvement are not newly accepted.
- [ ] T6 Add loop-lock CLI adapter over existing loop-lock.ts library. (`.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`) — _verify:_ CLI-vs-library tests cover acquire/status/refresh/release/stale reclaim and held-lock refusal.
- [ ] T7 Promote terminal lifecycle taxonomy and preserve improvement journal validation. (`.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs`, `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs`) — _verify:_ Valid/invalid journal event tests preserve exact accepted values and validation error strings.
- [ ] T8 Add focused unit and cross-skill contract tests for all promotions. (`.opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts`, `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts`, `.opencode/skills/deep-loop-runtime/tests/unit/lifecycle-taxonomy.vitest.ts`) — _verify:_ Vitest targeted promotion suite passes under system-spec-kit vitest config.
- [ ] T9 Assert improvement remains host-driven and absent from runtime convergence loop types. (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs`, `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts`) — _verify:_ Invalid convergence probe emits existing loopType validation message; loop-host valid modes remain four improvement lanes.
- [ ] T10 Verify no MCP or advisor-discovery surface was introduced. (`.opencode/skills/deep-loop-runtime/**`, `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs`) — _verify:_ No new mcp_server or MCP tool registrations; no discoverable deep-loop-workflows skill metadata in Phase 002.
- [ ] T11 Refresh runtime documentation for promoted backend contracts only. (`.opencode/skills/deep-loop-runtime/README.md`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md`, `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md`) — _verify:_ Docs state runtime is MCP-free and avoid public workflow routing claims.
- [ ] T12 Record phase evidence and run strict phase validation. (`.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/002-runtime-backend-promotions/plan.md`, `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/002-runtime-backend-promotions/tasks.md`, `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/002-runtime-backend-promotions/checklist.md`) — _verify:_ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/002-runtime-backend-promotions --strict exits 0.

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | Use the actual phase-001 baseline manifest as the only baseline source. Compare old research/review runtime-capability script stdout/stderr/exit bytes, artifact-root golden JSON for root/child/pt allocation cases, resource-map markdown bytes for frozen research/review deltas, and reducer-generated artifact trees after import rewires. Loop-lock CLI is additive, so prove CLI-vs-library behavior equivalence; also assert convergence.cjs still rejects improvement and no MCP or discoverable deep-loop-workflows metadata was added. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 001 | Internal phase | Gating | This phase cannot start until its predecessor is green |
| Phase-001 baseline | Internal | Gating | Parity cannot be proven without the baseline |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parity check fails or `validate.sh --strict` errors.
- **Procedure (per-strata)**: revert only this phase child's edits; the five old skill directories survive until phase 009, so rollback never requires a whole-tree reset.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | phase 001 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 12 tasks across 6 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **Capability resolver promotion changes CLI bytes or mode-specific errors.** -> Revert the runtime resolver and restore the two old resolver scripts from phase-001 baseline.
1. **Artifact-root promotion changes packet folder selection.** -> Restore reducer imports to system-spec-kit/shared/review-research-paths.cjs and remove runtime artifact-root module.
1. **Resource-map helper is accidentally promoted into deep-loop-runtime.** -> Delete runtime copy, restore reducer imports, and keep or revert only the workflow shared synthesis helper.
1. **Lifecycle taxonomy promotion leaks improvement into graph convergence.** -> Restore constants inside improvement-journal.cjs and remove runtime taxonomy import; convergence.cjs remains unchanged.
1. **Partial deep-loop-workflows directory becomes advisor-discoverable.** -> Remove accidental SKILL.md, description.json, or graph-metadata.json; keep only non-discoverable shared synthesis files or revert directory.
1. **Parallel workers conflict on reducer rewires.** -> Per-file revert the affected reducer and reapply with one owner per reducer file.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
