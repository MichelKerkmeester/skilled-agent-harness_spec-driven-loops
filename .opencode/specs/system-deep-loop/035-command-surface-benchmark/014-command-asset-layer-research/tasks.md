---
title: "Tasks: command asset-layer improvement research"
description: "Task breakdown for the two-lineage command asset-layer deep-research run, the cross-model synthesis at research/research.md, and the downstream 013 remediation hand-off."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/014-command-asset-layer-research"
    last_updated_at: "2026-07-16T08:31:41Z"
    last_updated_by: "claude"
    recent_action: "Completed 2-lineage asset-layer deep-research run; synthesized cross-model backlog"
    next_safe_action: "Author 013 remediation phases from research.md asset-layer deltas"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/orchestration-summary.json"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command asset-layer improvement research

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. The research and synthesis tasks are complete: both lineages ran their full 5 forced iterations and the cross-model backlog is in `research/research.md`. The downstream tasks stay open — the backlog feeds the 013 remediation phases, which are authored in that packet.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Scope the run: pin the two lineages, the forced-max-iterations stop policy, and the five research questions against the 012 asset-layer defects. Evidence: `spec.md` §3–§4 and `research/research.md` header (2 lineages × 5 forced iterations, `stopPolicy: max-iterations`).
- [x] T002 — Launch the fan-out through the skill-owned `fanout-run.cjs --loop-type research` with both lineage boundaries provisioned. Evidence: `research/orchestration-summary.json` (`loop_type: research`, `total: 2`, `succeeded: 2`) and `research/lineages/<label>/`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Run both lineages to their forced iteration cap and capture per-iteration records. Evidence: `research/lineages/*/iterations/iteration-001..005.md`; both lineages 5/5, `stopReason` maxIterationsReached, `mode: research` on every record.
- [x] T004 — Reconcile the two lineage syntheses into the cross-model agreement matrix and model-unique findings. Evidence: `research/research.md` §2 (agreement matrix B1–B11) and §3 (GLM-only / GPT-only findings).
- [x] T005 — Assemble the tiered asset-layer backlog with per-delta targets, acceptance criteria, and 012→013 mappings, covering AL1–AL6 and confirming the AL4 false-cycle defect. Evidence: `research/research.md` §4 (A-K/A-W/A-G) and §1 (AL4 proven at `validate-command-references.cjs:185-193` / `:55`).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Verify forced non-convergence and the artifact boundary from the run telemetry. Evidence: `research/research.md` §6 (both lineages `maxIterationsReached`, GPT new-info flat 0.90×5, GLM avg 0.80, no early stop; all writes under lineage dirs).
- [ ] T007 — Author the 013 remediation phases (001–005) from the backlog deltas. Owner: the 013 packet. Blocked-by: none; sequenced after this synthesis. Evidence: pending in `013-command-canon-remediation`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The research run completes both lineages at 5/5 forced iterations, the cross-model backlog in `research/research.md` covers AL1–AL6 with per-delta targets and acceptance criteria, and the packet's Level-1 docs pass `validate.sh --strict`. Final packet closeout follows once the 013 remediation phases consume the backlog.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark`. Predecessor: 013-command-canon-remediation. Successor: none (highest-numbered child). Deliverable: `research/research.md`.
<!-- /ANCHOR:cross-refs -->
