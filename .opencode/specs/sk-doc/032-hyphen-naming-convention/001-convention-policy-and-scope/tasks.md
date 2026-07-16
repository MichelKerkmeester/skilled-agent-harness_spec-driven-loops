---
title: "Tasks: convention policy and scope (032 phase 001)"
description: "Tasks for phase 001 of the 032 kebab-case filesystem-naming program: convention policy and scope."
trigger_phrases:
  - "convention policy and scope tasks"
  - "hyphen naming phase 001 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored for the 032 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Convention policy and scope

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

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 The canonical kebab-case convention doc (rule + rationale) under sk-doc, linked from the create-* skills
- [ ] T003 The full exemption/deny-list boundary: `.py`, Python import-package dirs, vendored/third-party, generated/lockfiles, tool-mandated filenames, test-runner magic, frozen surfaces
- [ ] T004 The out-of-scope line: code identifiers, JSON/YAML/TOML keys, frontmatter FIELDS, DB columns keep idiomatic case; frontmatter VALUES that are paths/slugs do change
- [ ] T005 The frozen-history exception (append-only supersession; scope-aware zero-snake gate)
- [ ] T006 A decision record capturing the GPT-5.6-sol review outcome and the program decisions (dual-name tolerance, dependency-closure batching, fresh-install, numbering)
- [ ] T007 Formal supersession of the 027 underscore ADR
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: A canonical convention doc states hyphens are the sole in-scope filesystem-naming form with `.py` and Python package dirs exempt — The doc exists under sk-doc and is linked from the create-* skills
- [ ] T009 Verify: The exemption set and the identifier/key + frontmatter-value boundary are written unambiguously — Each exemption class is enumerated with an example; the frontmatter value-vs-key line is explicit
- [ ] T010 Verify: The frozen-history exception and scope-aware gate are documented — The doc states frozen surfaces are append-only and excluded from the zero-snake gate
- [ ] T011 Verify: A decision record supersedes the 027 underscore ADR — The 027 ADR is referenced and marked superseded
- [ ] T012 Verify: The decision record captures the dual-name tolerance and dependency-closure batching decisions — Both decisions appear with rationale and alternatives considered
- [ ] T013 Verify: The decision record records the fresh-install (no-symlink) and packet-numbering decisions — Both are stated with their evidence
- [ ] T014 Verify: Python import-package directory handling is documented as exempt — The doc explains why `_`->`-` on a package dir breaks `import`
- [ ] T015 Verify: The convention doc is the single canonical source referenced by later phases — Later phase specs point at the convention doc, not ad-hoc rules
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
