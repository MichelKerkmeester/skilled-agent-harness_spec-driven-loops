---
title: "Tasks: Integrate Latest & Closeout"
description: "Tasks for phase 017 of the system-deep-loop recommendations implementation: final integration, drift reopening, whole-system gate rerun, and packet closeout."
trigger_phrases:
  - "integrate latest and closeout tasks"
  - "deep-loop phase 017 tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/017-integrate-latest-and-closeout"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/017-integrate-latest-and-closeout"
    last_updated_at: "2026-07-15T16:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped integrate, recensus, reopen, gate, and closeout work into tasks"
    next_safe_action: "Confirm phase-016 evidence and start the final integration preflight"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Integrate Latest & Closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `016-whole-system-gate` is green on its pre-integration SHA and its receipts are available (`016-whole-system-gate/`) [30m]
- [ ] T002 Confirm the pinned 000 baseline, parent 065 status, phase-tree manifest, open-item ledger, and changelog surfaces (`065-deep-loop-innovation/`) [30m]
- [ ] T003 Record the latest origin target, current HEAD, pre-integration candidate SHA, and clean-worktree result (`git status`, `git log`) [20m]
- [ ] T004 Establish the isolated integration worktree and path-scoped candidate boundary (`sk-git` worktree lifecycle) [30m]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Integrate latest origin into the clean worktree and resolve only candidate conflicts; record merge result and final SHA (`git` integration record) [1h]
- [ ] T006 Build the touched-contract recensus from the integration diff and map every changed contract to its owning phase (`drift ledger`) [1h]
- [ ] T007 Classify each touched contract as relevant drift or non-relevant drift using input/output, baseline, schema/persistence, dependency/write-set, and evidence-binding criteria (`drift ledger`) [1h]
- [ ] T008 Reopen every phase affected by relevant drift and downstream consumers whose declared inputs changed; preserve prior receipts as historical evidence (`phase status and gate records`) [1h]
- [ ] T009 Record explicit non-relevant dispositions for reviewed changes that leave phase acceptance surfaces unchanged (`drift ledger`) [30m]
- [ ] T010 Prepare append-only 065 open-item dispositions, changelog entries, parent rollup changes, and deterministic metadata-generation inputs (`spec.md`, `changelog/`, metadata tooling) [1h]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Rerun the complete phase-016 whole-system gate on the exact final SHA (`016-whole-system-gate` gate commands) [2-4h]
- [ ] T012 Verify exact-SHA behavior and mode baselines, mixed-version replay, crash injection, counterfactual and degeneration tests, and parity against 000 (`016-whole-system-gate` evidence) [2h]
- [ ] T013 Obtain the blocking SOL receipt bound to the final SHA and record all gate commands and exit codes (`SOL receipt`) [1h]
- [ ] T014 Run recursive `validate.sh --strict` and confirm no stale pre-integration receipt is presented as final (`validate.sh`) [30m]
- [ ] T015 Regenerate `description.json` and `graph-metadata.json` through deterministic tooling across the affected packet tree (`metadata tooling`) [45m]
- [ ] T016 Reconcile parent phase-map status, child status fields, completion percentages, changelogs, and open-item dispositions (`065-deep-loop-innovation/`) [1h]
- [ ] T017 Record any approved carry-forward items with owner and next action; do not delete historical open-item entries (`065 open-item ledger`) [30m]
- [ ] T018 Publish the final closeout record with reviewed drift set, reopen set, final SHA, gate result, metadata result, and rollback point (`phase 017 evidence`) [45m]
- [ ] T019 Merge or hand off the final candidate only after the closeout checklist is green and the worktree mutation scope is reconciled (`sk-git`) [30m]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase-016 whole-system gate is green on the exact final SHA
- [ ] Relevant drift has no unreopened owning phase
- [ ] Parent rollup, changelogs, open items, and generated metadata are consistent
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
