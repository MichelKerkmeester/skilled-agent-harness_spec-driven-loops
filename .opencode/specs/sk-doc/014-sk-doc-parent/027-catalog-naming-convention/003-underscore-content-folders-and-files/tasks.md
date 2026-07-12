---
title: "Tasks: Underscore restyle of catalog/playbook content"
description: "Task breakdown for the hyphen->underscore content migration: prepare (rename map + deny-list), execute (fanned-out rename + reference sweep), and verify (residual grep + strict validate + benchmark)."
trigger_phrases:
  - "underscore migration tasks"
  - "catalog content rename tasks"
  - "hyphen to underscore tasks"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
    last_updated_at: "2026-07-12T11:31:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks reconciled to shipped state with evidence"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Underscore Restyle of Catalog/Playbook Content

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enumerate the in-scope hyphenated content folders + per-feature `.md` files under `feature_catalog/` and `manual_testing_playbook/` via `git ls-files` across all skills (excl `z_archive`)
- [x] T002 Compute the `-`→`_` rename map on path segments only and hard-abort on any collision before writing (`git mv`)
- [x] T003 Confirm the deny-list protects skill/agent/command directory names, spec phase-folder names (`^[0-9]{3}-[a-z0-9-]+$`), `z_archive`, and changelogs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Rename all in-scope content folders hyphen→underscore (`feature_catalog/<category>/`, `manual_testing_playbook/<category>/`, plus `references/`/`assets/`/`benchmark/` content subfolders)
- [x] T005 [P] Rename all in-scope per-feature `.md` files hyphen→underscore (e.g. `read-path-freshness.md` → `read_path_freshness.md`)
- [x] T006 Rewrite live references in lockstep: root index tables (`feature_catalog.md` / `manual_testing_playbook.md` rows), `category:` frontmatter values, and markdown cross-ref links
- [x] T007 Rewrite the `create-feature-catalog` + `create-manual-testing-playbook` generators to emit `category_name` / `feature_name.md` (shipped as 027 parent commit `7cc369f2ed`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Merge the parallel agent branches path-scoped: `git log` confirms merge commits `0659149d08` + `b5afa1206c`
- [x] T009 Residual-hyphen grep gate = 0: `git ls-files '**/feature_catalog/**/*-*.md' '**/manual_testing_playbook/**/*-*.md'` (excl z_archive) returns 0 tracked
- [x] T010 Underscore end-state confirmed: `git ls-files` finds 2,032 tracked underscore `.md` content files present under the in-scope surfaces
- [x] T011 No classification regression: `validate.sh --strict` keeps every catalog/playbook leaf typed (validator keys on parent-dir name, `validate_document.py:129,137`)
- [x] T012 Confirm the 50 hyphenated `.md` under `system-deep-loop/deep-alignment/` are untracked concurrent-session files (`git status` shows `??`, 0 tracked) → out of scope, not migration residue
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`
- [x] No `[B]` blocked tasks
- [x] Residual tracked hyphenated content = 0 (excl z_archive)
- [x] Strict validate Errors 0 on the 027 parent
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
