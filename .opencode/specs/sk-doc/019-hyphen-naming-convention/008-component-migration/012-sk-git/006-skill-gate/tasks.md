---
title: "Tasks: sk-git skill gate (017 phase 008/012/006)"
description: "Read-only tasks for the final sk-git sibling rollup and whole-surface naming gate."
trigger_phrases:
  - "sk-git skill gate tasks"
  - "017 sk-git rollup tasks"
  - "whole surface naming gate tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the sk-git rollup gate task breakdown"
    next_safe_action: "Run the read-only rollup after sibling phases land"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/"
      - "../001-references/checklist.md"
      - "../002-assets/checklist.md"
      - "../003-manual-testing-playbook/checklist.md"
      - "../004-benchmark/checklist.md"
      - "../005-changelog-verify/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-git skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin the candidate and BASE SHAs.
- [ ] T002 Collect sibling 001-005 checklist results, SOL report hashes, map counts, and no-mutation proofs.
- [ ] T003 [P] Snapshot every tracked sk-git path and active path pointer before the rollup.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Reconcile the nine reference, three asset, 49 manual-playbook, and two benchmark-profile dispositions with sibling hashes.
- [ ] T005 Verify the changelog/version evidence against the phase 005 contract.
- [ ] T006 Run the all-path naming scan over .opencode/skills/sk-git and classify every underscore name by the 017 exemption set.
- [ ] T007 Run the active-pointer resolver and check for source/target duplicates.
- [ ] T008 Record failures with the owning sibling phase; do not repair them in the gate.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify every sibling P0 check passes and no stray implementation-summary.md or scratch/ remains in a leaf.
- [ ] T010 Verify aggregate counts, hashes, exemptions, and full tracked-path scan are consistent.
- [ ] T011 Verify zero unexempt in-scope snake_case paths and zero stale active source pointers.
- [ ] T012 Verify gate status/diff is unchanged before and after inspection.
- [ ] T013 Record commands, exit codes, counts, hashes, candidate SHA, BASE SHA, and routed findings in the SOL report.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x].
- [ ] No [B] blocked tasks remain.
- [ ] Every phase requirement has evidence in the checklist and SOL report.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Acceptance contract**: See checklist.md
- **Parent map**: See ../spec.md
<!-- /ANCHOR:cross-refs -->
