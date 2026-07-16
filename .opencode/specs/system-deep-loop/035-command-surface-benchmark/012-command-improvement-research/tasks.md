---
title: "Tasks: create-command + command-surface improvement research"
description: "Task breakdown for the two-lineage deep-research fan-out, the cross-model synthesis at research/research.md, run-integrity verification, and the downstream remediation handoff."
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: create-command + command-surface improvement research

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. The research and synthesis tasks (T001-T005) are complete: both lineages ran to depth and the reconciled backlog is in the tree. The downstream remediation handoff (T006) is open and belongs to successor packet 013.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Configure the two-lineage fan-out (glm52-max via cli-opencode, gpt56-sol-high-fast via cli-codex) with stop policy max-iterations and forced 5 iterations per lineage. Evidence: `research/orchestration-summary.json` records `loop_type: research`, `total_cli_lineages: 2`, `succeeded: 2`, `failed: 0`.
- [x] T002 — Launch both lineages through the skill-owned fanout-run.cjs driver, each isolated to its own boundary. Evidence: `research/lineages/glm52-max/` and `research/lineages/gpt56-sol-high-fast/` each contain `iterations/iteration-001..005.md` and a `deep-research-state.jsonl`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Run both lineages to depth without early convergence. Evidence: both `deep-research-state.jsonl` files report `stopReason: maxIterationsReached`; 5/5 iterations each, 10 total; convergence recorded as telemetry only.
- [x] T004 — Reconcile the two lineage syntheses into the cross-model backlog. Evidence: `research/research.md` §2 agreement matrix (A1-A7), §3 model-unique findings, §4 prioritized P0/P1/P2 backlog with target paths and acceptance criteria, §8 asset-layer detail.
- [x] T005 — Capture run provenance and route proof. Evidence: `research/research.md` §6 records both lineages 5/5, non-convergence ratios, `mode=research` route proof, and the timestamp/heartbeat data-quality notes; `research/orchestration-summary.json` corroborates the counts.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Verify packet conformance. Evidence: `validate.sh --strict` on this packet reports Errors:0 Warnings:0 after Level-1 restructure and metadata regeneration.
- [ ] T007 — Open the successor remediation packet on the keystone backlog items. Owner: 013-command-canon-remediation. Deferred: this packet is research and synthesis only.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Both lineages complete 5/5 iterations with stopReason maxIterationsReached, research/research.md carries the reconciled cross-model backlog with acceptance criteria and run provenance, and strict packet validation passes. Downstream remediation is tracked separately in successor packet 013.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark`. Predecessor: 011-create-benchmark-completeness-remediation. Successor: 013-command-canon-remediation.
<!-- /ANCHOR:cross-refs -->
