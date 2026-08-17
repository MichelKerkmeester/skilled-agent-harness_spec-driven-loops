---
title: "Tasks: Fan-out synthesis lineage aggregation"
description: "Executable task list for lineage-aware deep-research fan-in, canonical synthesis, and verification."
trigger_phrases:
  - "fanout synthesis tasks"
  - "lineage aggregation implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/005-fanout-fanin-durable-orchestration/007-fanout-synthesis-lineage-aggregation"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Completed Packet 1 implementation and canonical verification"
    next_safe_action: "Begin the dependent sk-design mode-consolidation packet"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fan-out Synthesis Lineage Aggregation

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:ai-protocol -->
## AI Execution Protocol

### Pre-Task Checklist

- [x] Read `spec.md`, `plan.md`, `checklist.md`, and `decision-record.md` before runtime edits.
- [x] Confirm every runtime target is clean with `git status --short -- <target paths>`.
- [x] Capture focused test and contract-compiler baselines before implementation.

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Complete registry and reducer behavior before workflow and generated-contract changes. |
| TASK-SCOPE | Edit only files listed in `spec.md`; do not alter lineage source artifacts. |
| TASK-EVIDENCE | Record an exact command or artifact path for every completed task. |
| TASK-WORKFLOW | Use canonical `/deep:research` synthesis; never author `research.md` manually. |

### Status Reporting Format

Report each task as `T### STATUS=<pending|active|done|blocked> EVIDENCE=<file:line|command>`.

### Blocked Task Protocol

Mark blocked work `[B]`, record the exact failing command and next safe action, and halt dependent tasks. Never replace the named deep-research workflow with manual synthesis.
<!-- /ANCHOR:ai-protocol -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture targeted runtime and workflow baselines (`scratch/` evidence) [evidence: `npx --no-install vitest run tests/unit/fanout-merge.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts --no-coverage` -> 2 files, 50 tests passed; `compile-command-contracts.cjs --command deep/research` rendered successfully]
- [x] T002 Verify the existing research packet has empty root inputs and complete lineage inputs [evidence: root `research/iterations/` and `research/deltas/` contain 0 entries; `research/lineages/sol/` contains five iteration files and five delta files]
- [x] T003 Capture epistemic baseline and validate planning artifacts [evidence: manual baseline knowledge=90, uncertainty=10, context=95; Spec Memory preflight returned `MCP error -32001: Request timed out`; planning docs were read before closure]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Repair existing-empty registry reconstruction (`fanout-merge.cjs`) [evidence: focused runtime gate 63/63]
- [x] T005 Publish byte-identical canonical and compatibility registries (`fanout-merge.cjs`) [evidence: canonical SHA-256 `66536750917bd63f789234e89d58f5a47f6d9b5c6b980a02e7eb324c204b33df` for both outputs]
- [x] T006 Add fan-out resource-map-only lineage delta aggregation (`reduce-state.cjs`) [evidence: five canonical lineage delta rows; source registry bytes preserved by integration test]
- [x] T007 Update auto synthesis input discovery and invariants (`deep-research-auto.yaml`) [evidence: complete/incomplete/malformed workflow regressions]
- [x] T008 Update confirm synthesis parity (`deep-research-confirm.yaml`) [evidence: resource-map flag and synthesis invariant parity assertions]
- [x] T009 [P] Add merge and CLI regressions (`fanout-merge.vitest.ts`) [evidence: count-only headings, malformed JSONL, duplicate basename, and symlink cases pass]
- [x] T010 [P] Add lineage delta resource-map regressions (`deep-research-reduce-state.vitest.ts`) [evidence: aggregation and symlink-output cases pass]
- [x] T011 Align compiler/checker/renderer output-path parity and regenerate all four compiled contracts [evidence: `[CONTRACT DRIFT] OK commands=4`; compiler tests 16/16]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run targeted and package-level deep-loop tests [evidence: `npm test -- --maxWorkers=1` -> 138 files, 2561 tests passed; typecheck passed]
- [x] T013 Run canonical `/deep:research` synthesis for the existing five-iteration packet [evidence: command-owned `/deep:research:auto` Phase 3 synthesis at `2026-07-26T06:24:04.312Z`]
- [x] T014 Verify both registry names, lineage attribution, resource map, research output, and synthesis event [evidence: identical registry hashes, 34 findings, five delta rows, 17 sections, `totalIterations:5`, no iteration six]
- [x] T015 Update parent map, metadata, checklist, decision evidence, and implementation summary [evidence: `../spec.md`, `graph-metadata.json`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`]
- [x] T016 Run strict validation and capture postflight learning evidence [evidence: strict validator and completion analysis passed; Spec Memory postflight returned `MCP error -32001: Request timed out`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are marked `[x]` with command or file evidence. [evidence: `tasks.md` T001-T016]
- [x] No blocked P0 or P1 task remains.
- [x] Canonical synthesis completed without creating iteration six.
- [x] Packet 2 may begin only after this packet passes strict validation. [evidence: `validate.sh --strict`]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Architecture**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
