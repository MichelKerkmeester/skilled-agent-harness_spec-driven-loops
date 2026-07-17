---
title: "Tasks: deep-review filesystem names (032 phase 007/004)"
description: "Execution tasks for renaming deep-review resources and repairing state, report, catalog, playbook, and command path consumers without changing review contracts."
trigger_phrases:
  - "deep-review tasks"
  - "deep review kebab-case naming tasks"
  - "review packet path repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/004-deep-review"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep review tasks"
    next_safe_action: "Execute the deep review rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-review filesystem names

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

- [ ] T001 Load the deep-review frozen map, BASE resource/state/report manifest, and scenario baseline.
- [ ] T002 [P] Inventory the 15 underscore-bearing directory families and 96 underscore-bearing files.
- [ ] T003 Trace resource-map strings, reducer/report path builders, command/agent references, and generated-output exclusions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify every review path and record dynamic/non-filesystem string dispositions.
- [ ] T005 Rename review assets, references, catalog/playbook categories and leaves, severity/dimension paths, and underscore-bearing files.
- [ ] T006 Update `SKILL.md` resource paths, README/index links, command/agent references, tests, and state/report path values.
- [ ] T007 Preserve finding IDs, severity/convergence values, generated output, tool names, identifiers, and Python/package exemptions.
- [ ] T008 Record the final map, stale-reference sweep, and scenario/finding coverage evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Resolve every old/new review resource, Markdown, state, reducer, and report path, including dynamic sites.
- [ ] T010 Compare catalog leaves, playbook scenarios, review-depth rollout coverage, and finding IDs with BASE.
- [ ] T011 Run review routing, state reconstruction, convergence, report, and severity checks with non-zero discovery.
- [ ] T012 Confirm no sibling surface or protected contract changed and attach the evidence to the checklist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
<!-- /ANCHOR:cross-refs -->
