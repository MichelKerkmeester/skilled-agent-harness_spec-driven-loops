---
title: "Implementation Plan: convention policy and scope (019 phase 001)"
description: "Implementation Plan for phase 001 of the 019 kebab-case filesystem-naming program: convention policy and scope."
trigger_phrases:
  - "convention policy and scope implementation plan"
  - "hyphen naming phase 001 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Convention policy and scope

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 001) |
| **Change class** | Convention / logic / tooling |
| **Execution** | Worktree (established in phase 005) |

### Overview
There is no single authoritative statement that kebab-case (hyphens) is the canonical filesystem-naming form, nor a written exemption boundary. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] A canonical convention doc states hyphens are the sole in-scope filesystem-naming form with `.py` exempt
- [ ] The exemption set and the identifier/key out-of-scope boundary are written unambiguously
- [ ] A decision record supersedes the 027 underscore ADR

### Definition of Done
- [ ] One canonical convention doc is the single source of truth
- [ ] The 027 ADR is formally superseded
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The canonical kebab-case convention doc (rule + rationale) under sk-doc.
- The full exemption set: `.py`, vendored/third-party, generated/lockfiles, tool-mandated filenames.
- The explicit out-of-scope line: code identifiers, JSON/YAML keys, frontmatter fields, DB columns keep idiomatic case.
- A decision record formally superseding the 027 underscore ADR.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- The canonical kebab-case convention doc (rule + rationale) under sk-doc.
- The full exemption set: `.py`, vendored/third-party, generated/lockfiles, tool-mandated filenames.
- The explicit out-of-scope line: code identifiers, JSON/YAML keys, frontmatter fields, DB columns keep idiomatic case.
- A decision record formally superseding the 027 underscore ADR.

### Phase 3: Verification
- Doc exists under sk-doc and is linked from the create-* skills
- Each exemption class is enumerated with an example
- The 027 ADR is referenced and marked superseded
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Doc exists under sk-doc and is linked from the create-* skills |
| REQ-002 | Each exemption class is enumerated with an example |
| REQ-003 | The 027 ADR is referenced and marked superseded |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 019 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state. No data migration is involved — filesystem renames and reference rewrites are fully git-reversible.
<!-- /ANCHOR:rollback -->
