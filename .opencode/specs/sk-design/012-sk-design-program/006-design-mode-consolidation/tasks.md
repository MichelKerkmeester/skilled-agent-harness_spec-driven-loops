---
title: "Tasks: sk-design mode consolidation"
description: "Executable tasks for baseline capture, foundations and audit consolidation, four-mode routing regeneration, and strict verification."
trigger_phrases:
  - "sk-design consolidation tasks"
  - "design subworkflow migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-26T09:08:32Z"
    last_updated_by: "opencode"
    recent_action: "Created executable staged tasks for the consolidation"
    next_safe_action: "Complete baseline and inventory tasks"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Tasks: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`
<!-- /ANCHOR:notation -->

### Milestone Reference

| Milestone | Tasks | Status |
|-----------|-------|--------|
| M1 Baseline | T001-T005 | In Progress |
| M2 Foundations | T006-T009 | Pending |
| M3 Audit | T010-T013 | Pending |
| M4 Four-mode hub | T014-T018 | Pending |
| M5 Verification | T019-T025 | Pending |

### AI Execution Protocol

### Pre-Task Checklist

- [x] Read the canonical research synthesis and approved override.
- [x] Create the Level 3 packet before skill-tree edits.
- [ ] Confirm scoped target status and capture baselines before relocation.

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Baseline first; foundations and audit move sequentially; regenerate only after authored topology is final. |
| TASK-SCOPE | Modify only packet-listed consumers; classify historical references before changing them. |
| TASK-EVIDENCE | Record exact commands, counts, or paths for every completed task. |
| TASK-FROZEN | Do not edit any path beneath `styles/`; verify all tracked bytes before and after. |

#### Status Reporting Format

Record each task as `T### STATUS=<pending|active|done|blocked> EVIDENCE=<file:line|command|count>`.

### Blocked Task Protocol

Mark blocked work `[B]`, record the exact failing command and next safe action, and halt dependent tasks. Do not weaken assertions or hand-author generated metadata to bypass a gate.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Baseline and Inventory [Milestone M1]

- [ ] T001 Capture scoped Git status and current six-mode registry bytes.
- [ ] T002 [P] Capture package, command, corpus, fingerprint, checker, benchmark, and compiled-routing baselines.
- [ ] T003 [P] Inventory all live, generated, and historical old-path consumers.
- [ ] T004 Capture exact foundations/audit file accounting and target 69-leaf projection.
- [ ] T005 Capture tracked styles path count and SHA-256 manifest.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Foundations Consolidation [Milestone M2]

- [ ] T006 Add interface-owned permanent foundations subworkflow doctrine and routing. {deps: T001-T005}
- [ ] T007 Relocate foundations leaves, README, and changelog; transform `SKILL.md` to `contract.md`. {deps: T006}
- [ ] T008 Repoint foundations command assets, scripts, corpus, and live consumers. {deps: T007}
- [ ] T009 Run foundations command, corpus, and checker gates. {deps: T008}

### Audit Consolidation [Milestone M3]

- [ ] T010 Add interface-owned permanent audit subworkflow doctrine and routing. {deps: T009}
- [ ] T011 Relocate audit leaves, README, and changelog; transform `SKILL.md` to `contract.md`. {deps: T010}
- [ ] T012 Repoint audit reports, corpus, fingerprints, Bash verifiers, command assets, and live consumers. {deps: T011}
- [ ] T013 Run audit command, corpus, fingerprint, and checker gates. {deps: T012}

### Four-Mode Hub and Generation [Milestone M4]

- [ ] T014 Remove foundations and audit mode rows and nested identity metadata. {deps: T013}
- [ ] T015 Update hub/router/command metadata and canonical path/default prose. {deps: T014}
- [ ] T016 Verify exactly 112 subordinate relocations, two README moves, two contract transformations, and two changelogs. {deps: T015}
- [ ] T017 Regenerate the 69-leaf manifest, advisor metadata, compiled routing fixtures, and activation metadata. {deps: T016}
- [ ] T018 Prove no live old-path consumer or extra registry identity remains. {deps: T017}
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Final Verification and Reconciliation [Milestone M5]

- [ ] T019 Compare pre/post styles manifests and tracked path counts. {deps: T018}
- [ ] T020 Run final package, command, corpus, fingerprint, checker, and benchmark gates. {deps: T019}
- [ ] T021 Run compiled route sync/drift and parent-hub checks. {deps: T020}
- [ ] T022 Review scoped diff, comment hygiene, file permissions, and relocation accounting. {deps: T021}
- [ ] T023 Reconcile spec, plan, tasks, checklist, decisions, and implementation summary. {deps: T022}
- [ ] T024 Generate description/graph metadata and attempt memory indexing. {deps: T023}
- [ ] T025 Run strict SpecKit validation, completion analysis, and active-goal verification. {deps: T024}
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks are marked `[x]` with evidence.
- [ ] No blocked P0 or P1 task remains.
- [ ] Exact registry, relocation, leaf, and unchanged-style invariants pass.
- [ ] Both permanent commands retain complete behavior from interface-owned paths.
- [ ] All automated and strict documentation gates pass.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Architecture**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
