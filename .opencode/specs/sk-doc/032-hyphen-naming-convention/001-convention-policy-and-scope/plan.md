---
title: "Implementation Plan: convention policy and scope (032 phase 001)"
description: "Implementation Plan for phase 001 of the 032 kebab-case filesystem-naming program: convention policy and scope."
trigger_phrases:
  - "convention policy and scope implementation plan"
  - "hyphen naming phase 001 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored for the 032 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Convention policy and scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 001) |
| **Change class** | Convention / decision record |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
There is no single authoritative statement that kebab-case (hyphens) is the canonical filesystem-naming form, nor a written exemption boundary, nor a record of the program decisions from the GPT design review. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] A canonical convention doc states hyphens are the sole in-scope filesystem-naming form with `.py` and Python package dirs exempt
- [ ] The exemption set and the identifier/key + frontmatter-value boundary are written unambiguously
- [ ] The frozen-history exception and scope-aware gate are documented
- [ ] A decision record supersedes the 027 underscore ADR
- [ ] The decision record captures the dual-name tolerance and dependency-closure batching decisions
- [ ] The decision record records the fresh-install (no-symlink) and packet-numbering decisions
- [ ] Python import-package directory handling is documented as exempt
- [ ] The convention doc is the single canonical source referenced by later phases

### Definition of Done
- [ ] One canonical convention doc is the single source of truth
- [ ] The 027 ADR is formally superseded and the program decisions are recorded
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The canonical kebab-case convention doc (rule + rationale) under sk-doc, linked from the create-* skills.
- The full exemption/deny-list boundary: `.py`, Python import-package dirs, vendored/third-party, generated/lockfiles, tool-mandated filenames, test-runner magic, frozen surfaces.
- The out-of-scope line: code identifiers, JSON/YAML/TOML keys, frontmatter FIELDS, DB columns keep idiomatic case; frontmatter VALUES that are paths/slugs do change.
- The frozen-history exception (append-only supersession; scope-aware zero-snake gate).
- A decision record capturing the GPT-5.6-sol review outcome and the program decisions (dual-name tolerance, dependency-closure batching, fresh-install, numbering).
- Formal supersession of the 027 underscore ADR.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- The canonical kebab-case convention doc (rule + rationale) under sk-doc, linked from the create-* skills.
- The full exemption/deny-list boundary: `.py`, Python import-package dirs, vendored/third-party, generated/lockfiles, tool-mandated filenames, test-runner magic, frozen surfaces.
- The out-of-scope line: code identifiers, JSON/YAML/TOML keys, frontmatter FIELDS, DB columns keep idiomatic case; frontmatter VALUES that are paths/slugs do change.
- The frozen-history exception (append-only supersession; scope-aware zero-snake gate).
- A decision record capturing the GPT-5.6-sol review outcome and the program decisions (dual-name tolerance, dependency-closure batching, fresh-install, numbering).
- Formal supersession of the 027 underscore ADR.

### Phase 3: Verification
- The doc exists under sk-doc and is linked from the create-* skills
- Each exemption class is enumerated with an example; the frontmatter value-vs-key line is explicit
- The doc states frozen surfaces are append-only and excluded from the zero-snake gate
- The 027 ADR is referenced and marked superseded
- Both decisions appear with rationale and alternatives considered
- Both are stated with their evidence
- The doc explains why `_`->`-` on a package dir breaks `import`
- Later phase specs point at the convention doc, not ad-hoc rules
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | The doc exists under sk-doc and is linked from the create-* skills |
| REQ-002 | Each exemption class is enumerated with an example; the frontmatter value-vs-key line is explicit |
| REQ-003 | The doc states frozen surfaces are append-only and excluded from the zero-snake gate |
| REQ-004 | The 027 ADR is referenced and marked superseded |
| REQ-005 | Both decisions appear with rationale and alternatives considered |
| REQ-006 | Both are stated with their evidence |
| REQ-007 | The doc explains why `_`->`-` on a package dir breaks `import` |
| REQ-008 | Later phase specs point at the convention doc, not ad-hoc rules |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 032 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
