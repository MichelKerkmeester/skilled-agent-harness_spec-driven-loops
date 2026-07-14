---
title: "Tasks: whole-repo verification gate (017 phase 010)"
description: "Tasks for phase 010 of the 017 kebab-case filesystem-naming program: measure the final migration candidate against the complete, evidence-pinned whole-repo gate."
trigger_phrases:
  - "whole-repo verification gate tasks"
  - "hyphen naming phase 010 tasks"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/010-whole-repo-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/010-whole-repo-gate"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Decomposed the gate into identity, naming, reference, history, behavior, and verdict tasks"
    next_safe_action: "Load the phase 000 baseline and frozen map before running any gate domain"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/010-whole-repo-gate/decision-record.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/010-whole-repo-gate/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Whole-repo verification gate

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

- [ ] T001 Load the phase 000 BASE SHA, candidate SHA, baseline command matrix, discovery counts, and Lane C values.
- [ ] T002 Load the frozen classified rename map and verify its hash and classification completeness.
- [ ] T003 Confirm phase 009 handoff evidence, isolated dependencies, tool versions, and the chosen Git similarity threshold.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Run the scope-aware `--all` naming guard and reconcile every exemption and frozen result.
- [ ] T005 [P] Run the rename-map-driven reference checker, dynamic-site disposition ledger, and import/path/link resolution.
- [ ] T006 [P] Run `git diff --name-status --find-renames=50% BASE CANDIDATE` and reconcile every map pair with `R`/`Rnn` status.
- [ ] T007 [P] Run every phase 000 strict validation, build, typecheck, test, discovery, and Lane C command on the same candidate.
- [ ] T008 Aggregate logs, exit codes, counts, scenario IDs/scores, and tracked-state observations into the candidate report.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify: zero in-scope snake_case filesystem names remain — the `--all` guard exits 0 with zero violations and no unknown classifications.
- [ ] T010 Verify: every reference is updated or dispositioned — unresolved count is 0, dynamic sites are all dispositioned, and the scan processed files.
- [ ] T011 Verify: rename history is preserved — every map pair is `R`/`Rnn`, with no delete-plus-add replacement.
- [ ] T012 Verify: the full validation/test matrix is green — every command exits 0 and discovery counts match the phase 000 baseline.
- [ ] T013 Verify: behavioral parity holds — imports, paths, and links are unbroken and Lane C IDs/scores meet the baseline rule.
- [ ] T014 Verify: exemptions and frozen history are respected and the verification pass leaves no unexpected tracked mutation.
- [ ] T015 Issue a single pass/fail verdict only after the checklist's P0 contract is satisfied.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Decision record and candidate report agree on the exact pass criteria and measurements
- [ ] Phase gate green with a reproducible, candidate-scoped report
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md`
- **Verification contract**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
