---
title: "Tasks: commands subtree rollup gate (017 phase 008/013/010)"
description: "Blocking aggregation tasks for sibling acceptance, whole-tree kebab-case closure, exemption evidence, and active reference integrity."
trigger_phrases:
  - "commands rollup gate tasks"
  - "commands subtree acceptance tasks"
  - "command naming gate tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored commands rollup tasks"
    next_safe_action: "Aggregate child acceptance receipts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Commands subtree rollup gate

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

`[P0]` blocks the subtree gate, `[P1]` requires closure before acceptance, and `[P2]` is supporting evidence. This phase may report and block; it may not create new migration work.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] TSK-001 [P0] Collect accepted checklists and evidence from phases 001–009.
- [ ] TSK-002 [P0] Confirm each child reports BASE/candidate revisions, scoped diff, tests, and final disposition map.
- [ ] TSK-003 [P0] Merge the child maps into one command-surface manifest and reject missing rows or duplicate ownership.
- [ ] TSK-004 [P1] Merge the exemption ledger and verify every exception has a policy reason and evidence.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] TSK-005 [P0] Scan every `.opencode/commands/**` file and directory basename for in-scope snake_case names.
- [ ] TSK-006 [P0] Compare all remaining underscore names with Python, package, tool-mandated, generated, fixture, and frozen-history exemptions.
- [ ] TSK-007 [P0] Resolve active links and pointers, search for old active paths, and reject broken or intermediate destinations.
- [ ] TSK-008 [P1] Run exact/casefold/NFC collision checks over final targets and the complete manifest.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] TSK-009 [P0] Run command discovery and the relevant command-reference/self-test checks.
- [ ] TSK-010 [P0] Confirm generated, tool, fixture, and loose-command boundary receipts match the final tree.
- [ ] TSK-011 [P1] Compare the whole-tree results to each child checklist and identify any owning blocker without editing its files.
- [ ] TSK-012 [P0] Publish PASS only when all blocking checks pass; otherwise publish a blocking report naming the child and evidence gap.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] All nine sibling phases are accepted
- [ ] The manifest is exhaustive and unique
- [ ] Every non-exempt basename is kebab-case and active references resolve
- [ ] The gate report contains the blocking/pass rationale and all receipts
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Blocking verifier**: See `checklist.md`
- **Child contracts**: See `../001-create-namespace/checklist.md` through `../009-command-assets/checklist.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/decision-record.md`
<!-- /ANCHOR:cross-refs -->
