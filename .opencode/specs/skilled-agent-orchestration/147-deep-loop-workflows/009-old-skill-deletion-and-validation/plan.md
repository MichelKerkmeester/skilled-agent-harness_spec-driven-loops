---
title: "Implementation Plan: Old-skill deletion and full-surface validation"
description: "Implementation Plan for phase 009 of the deep-loop-workflows merge: Old-skill deletion and full-surface validation."
trigger_phrases:
  - "deep-loop-workflows phase 009"
  - "old-skill-deletion-and-validation"
  - "deep loop merge implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/009-old-skill-deletion-and-validation"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled implementation plan from parallel planning fleet"
    next_safe_action: "Execute phase 009 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-009-old-skill-deletion-and-validation-implementationplan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Old-skill deletion and full-surface validation

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
Run phase 009 as a gated finalizer: prove prior phases and the phase-001 baseline are green, fix the /doctor deep-loop council-graph coverage blocker while old dirs still exist, delete exactly the five old skill dirs, then rebuild advisor state and run the full release gate set. Most fleet seats are read-only verifiers; only one doctor-coverage writer, one deletion writer, and one serialized advisor-state lane perform mutations.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor (phase 008) green.
- [ ] Phase-001 parity baseline available.
- [ ] Scope limited to this phase per `spec.md`.

### Definition of Done
- [ ] Phase 001 baseline evidence exists and covers 5 modes, 8 commands, advisor routing, and Lane-D dry-run parity.
- [ ] Phase 008 handoff is green before deletion.
- [ ] deep-loop-workflows has exactly one hub graph-metadata.json and no per-mode graph metadata.
- [ ] /doctor deep-loop covers both deep-loop-graph.sqlite and council-graph.sqlite.
- [ ] Route validation passes.
- [ ] Runtime council graph status/query/convergence smoke checks pass.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated phase in the deep-loop-workflows merge pipeline. Additive/reversible (old skill dirs survive until phase 009).

### Parallel Groups (worker fleet)
- **G1** (mixed seats): Read-only preflight: phase handoff, baseline availability, registry shape, stale-reference checks before deletion.
- **G2** (opus seats): Single-writer /doctor deep-loop council-graph coverage fix.
- **G3** (mixed seats): Post-doctor runtime and route validation that can run before deletion.
- **G4** (opus seats): Final deletion of exactly the five old skill directories.
- **G5** (opus seats): Serialized trusted advisor graph rebuild after deletion.
- **G6** (mixed seats): Parallel post-delete validation: advisor parity, mirrors, command/mode parity, registry and backend invariants.
- **G7** (opus seats): Closeout documentation and strict spec validation after all gates pass.

### Read/Write Split
Read-only analysis + parity capture run on `gpt-5.5-fast --variant high` (cli-opencode); file writes/edits run on `opus-4.8` via `claude2`; the orchestrator reduces and validates.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read predecessor continuity (phase 008) and `../research/research.md`.
- [ ] Load the phase-001 parity baseline for the affected modes/surfaces.

### Phase 2: Core Implementation
- [ ] T1 Confirm phase 001 baseline evidence and phase 008 green handoff before starting finalization. (`.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/**`, `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/008-framework-docs-sweep/**`, `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/spec.md`) — _verify:_ Baseline covers five modes, eight commands, advisor routing, and Lane-D dry-run parity; phase 008 stale-reference gate is green.
- [ ] T2 Verify merged hub shape and recursive graph-metadata invariant. (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/mode-registry.json`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`) — _verify:_ Glob for .opencode/skills/deep-loop-workflows/*/graph-metadata.json returns empty; registry has workflowMode, runtimeLoopType or null, and backendKind for every mode.
- [ ] T3 Run pre-delete stale old-skill reference scan. (`**/*`) — _verify:_ No unapproved stale references remain and UNKNOWN-TARGET scan is empty.
- [ ] T4 Extend /doctor deep-loop to cover council-graph.sqlite as well as deep-loop-graph.sqlite. (`.opencode/commands/doctor/assets/doctor_deep-loop.yaml`, `.opencode/commands/doctor/_routes.yaml`, `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt`) — _verify:_ bash .opencode/commands/doctor/scripts/route-validate.sh plus council status smoke via .opencode/skills/deep-loop-runtime/scripts/status.cjs --loop-type council.
- [ ] T5 Validate existing runtime council CLI support used by /doctor. (`.opencode/skills/deep-loop-runtime/scripts/{status.cjs,query.cjs,convergence.cjs}`, `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`, `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts`) — _verify:_ Council graph tests pass; convergence.cjs still accepts exactly research, review, council, context.
- [ ] T6 Delete exactly the five old deep-loop workflow skill directories. (`.opencode/skills/deep-ai-council/`, `.opencode/skills/deep-context/`, `.opencode/skills/deep-improvement/`) — _verify:_ Each old directory is absent; deep-loop-workflows and deep-loop-runtime remain present.
- [ ] T7 Rebuild advisor skill graph after deletion. (`.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`) — _verify:_ rejectedEdges=0 and old skill IDs are absent from skill_graph_status.
- [ ] T8 Run advisor routing validation for skill plus mode output. (`.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/**`) — _verify:_ Recommendations assert deep-loop-workflows plus concrete mode; no deleted old skill wins.
- [ ] T9 Verify native agent mirror parity after deletion. (`.opencode/agents/{deep-context,deep-research,deep-review,deep-improvement,deep-ai-council}.md`, `.claude/agents/{deep-context,deep-research,deep-review,deep-improvement,deep-ai-council}.md`, `.codex/agents/{deep-context,deep-research,deep-review,deep-improvement,deep-ai-council}.md`) — _verify:_ Three-way mirror parity passes except documented runtime-specific path-convention lines.
- [ ] T10 Rerun phase-001 parity harness after deletion. (`.opencode/commands/deep*.md`, `.opencode/commands/deep*/**`, `.opencode/commands/doctor/**`) — _verify:_ Normalized hashes are byte-identical to phase-001 baseline; Lane D uses dry-run baseline.
- [ ] T11 Verify discriminator and frozen backend invariants. (`.opencode/skills/deep-loop-workflows/mode-registry.json`, `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`, `.opencode/skills/deep-loop-runtime/scripts/status.cjs`) — _verify:_ Improvement modes have runtimeLoopType null; graph-backed modes map to context/research/review/council; no MCP tool is added to deep-loop-runtime.
- [ ] T12 Record final evidence and run strict spec validation. (`.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/009-old-skill-deletion-and-validation/checklist.md`, `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/009-old-skill-deletion-and-validation/implementation-summary.md`, `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/spec.md`) — _verify:_ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/009-old-skill-deletion-and-validation --strict and parent recursive validation are green.

### Phase 3: Verification
- [ ] Run the Parity Check (below).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Parity | This phase's affected modes/surfaces | After deletion, consume the phase-001 baseline manifest and rerun the same single-executor normalized capture for all five modes and eight /deep:* commands. Require byte-identical normalized artifact hashes for modes and commands; advisor parity is behavior-preservation with skill=deep-loop-workflows plus concrete mode, rejectedEdges=0, and no old skill winners. |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 008 | Internal phase | Gating | This phase cannot start until its predecessor is green |
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
| Setup | phase 008 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Next pipeline phase |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read baseline + predecessor |
| Core Implementation | High | 12 tasks across 7 parallel group(s) |
| Verification | Medium | parity + strict validation |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase-001 baseline captured for affected surfaces.
- [ ] Old skill directories intact (deletion only in phase 009).

### Rollback Procedure
1. **/doctor council support changes research/review semantics.** -> Revert only doctor_deep-loop.yaml, _routes.yaml, and doctor_speckit_presentation.txt, then rerun route validation.
1. **Recursive advisor scanner finds nested mode graph-metadata.json and throws.** -> Remove nested per-mode graph metadata, keep only the hub graph-metadata.json, then rerun trusted skill_graph_scan.
1. **Deletion happens before a stale old-skill reference is found.** -> Restore the five deleted directories from VCS and route the missed reference to its owning prior phase.
1. **Advisor DB remains stale and recommends deleted skill IDs.** -> Rerun trusted skill_graph_scan/advisor_rebuild; if still stale, restore old dirs and debug phase-006 graph collapse.
1. **Byte parity fails after deletion.** -> Treat as regression, restore old dirs if needed, keep doctor fix separate, and route mismatch to the owning prior phase.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git restore the affected files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
