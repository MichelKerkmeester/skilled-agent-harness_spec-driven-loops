---
title: "Implementation Plan: create-command + command-surface improvement research"
description: "Plan for the two-lineage deep-research fan-out that mines the 066 benchmark findings and the create-command canon into a prioritized cross-model improvement backlog at research/research.md, research and synthesis only."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/012-command-improvement-research"
    last_updated_at: "2026-07-16T08:31:18Z"
    last_updated_by: "claude"
    recent_action: "Synthesized 2-lineage fan-out into research/research.md"
    next_safe_action: "Open remediation packet on keystone K1"
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_template.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: create-command + command-surface improvement research

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a two-lineage deep-research fan-out with forced non-convergence over the 066 command-surface benchmark findings and the create-command authoring canon, then reconcile the two lineage syntheses into one cross-model backlog at research/research.md. GLM-5.2 at max reasoning via cli-opencode and GPT-5.6-Sol at high reasoning / fast tier via cli-codex each run 5 iterations to depth. The output is a prioritized improvement backlog with target paths and acceptance criteria; the packet is research and synthesis only and touches no shipped runtime.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Both lineages complete 5/5 iterations with stopReason maxIterationsReached; 10 total, no early convergence.
- research/research.md carries an agreement matrix, model-unique findings, a prioritized backlog with acceptance criteria, and a run-provenance section.
- Every backlog item names concrete target files and a testable acceptance criterion.
- validate.sh --strict passes with Errors:0 Warnings:0.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The skill-owned fanout-run.cjs driver (--loop-type research) spawns two isolated lineages, each writing only to its own research/lineages/<label>/ boundary and running the full phase_init → phase_main_loop → phase_synthesis cycle. The glm52-max lineage dispatches through cli-opencode to zai-coding-plan/glm-5.2 at max reasoning; the gpt56-sol-high-fast lineage dispatches through cli-codex to gpt-5.6-sol at high reasoning and fast service tier. Stop policy is max-iterations, so convergence telemetry is recorded but never ends a lineage early. After both lineages finish, a synthesis pass reconciles the two lineage research.md files into the top-level research/research.md — agreements strengthened, single-lineage findings flagged, disagreements noted — and emits the prioritized backlog with a dependency spine.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fan-out run
Launch both lineages through fanout-run.cjs with stop policy max-iterations, forcing 5 iterations per lineage. Each lineage reads the 066 benchmark artifacts and the create-command / create-benchmark canon and writes iterations and state into its own boundary.

### Phase 2: Cross-model synthesis
Reconcile the two lineage syntheses into research/research.md: build the agreement matrix, record model-unique findings, and emit the prioritized P0/P1/P2 backlog with target paths, acceptance criteria, and a dependency spine.

### Phase 3: Run-integrity verification
Confirm both lineages reached 5/5 iterations with stopReason maxIterationsReached, capture the non-convergence and route-proof evidence, and pass strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verify run integrity from the lineage state records (5/5 iterations each, stopReason maxIterationsReached, route-proof fields present) and the orchestration summary (2 succeeded, 0 failed). Verify synthesis completeness by checking research/research.md for the agreement matrix, model-unique findings, prioritized backlog, and provenance sections. Verify packet conformance with validate.sh --strict.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on the 066 benchmark artifacts and findings, the create-command and create-benchmark authoring canon, and the skill-owned fanout-run.cjs research driver with the cli-opencode and cli-codex transports. Feeds the successor remediation packet 013-command-canon-remediation, which opens on the keystone backlog items.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet produces research and synthesis only and mutates no shipped runtime; there is nothing to roll back. Superseding research would replace research/research.md via a fresh fan-out rather than reverting a code change.
<!-- /ANCHOR:rollback -->
