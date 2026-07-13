---
title: "Tasks: convention policy and scope (019 phase 001)"
description: "Tasks for phase 001 of the 019 kebab-case filesystem-naming program: convention policy and scope."
trigger_phrases:
  - "convention policy and scope tasks"
  - "hyphen naming phase 001 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Convention policy and scope

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Confirm predecessor phases landed and the execution worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 The canonical kebab-case convention doc (rule + rationale) under sk-doc
- [ ] T003 The full exemption set: `.py`, vendored/third-party, generated/lockfiles, tool-mandated filenames
- [ ] T004 The explicit out-of-scope line: code identifiers, JSON/YAML keys, frontmatter fields, DB columns keep idiomatic case
- [ ] T005 A decision record formally superseding the 027 underscore ADR
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: A canonical convention doc states hyphens are the sole in-scope filesystem-naming form with `.py` exempt — Doc exists under sk-doc and is linked from the create-* skills
- [ ] T007 Verify: The exemption set and the identifier/key out-of-scope boundary are written unambiguously — Each exemption class is enumerated with an example
- [ ] T008 Verify: A decision record supersedes the 027 underscore ADR — The 027 ADR is referenced and marked superseded
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
