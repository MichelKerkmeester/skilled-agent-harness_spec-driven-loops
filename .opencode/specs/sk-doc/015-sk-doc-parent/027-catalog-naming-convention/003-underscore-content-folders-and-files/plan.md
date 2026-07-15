---
title: "Implementation Plan: Underscore restyle of catalog/playbook content"
description: "Migration plan for the hyphen->underscore restyle of all catalog/playbook content folders and files: a deterministic path-segment rename with in-lockstep reference sweep, fanned out across parallel agent branches by skill family, merged path-scoped."
trigger_phrases:
  - "underscore migration plan"
  - "catalog content rename plan"
  - "hyphen to underscore plan"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
    last_updated_at: "2026-07-12T11:31:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Migration plan reconciled to shipped state"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Underscore Restyle of Catalog/Playbook Content

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `feature_catalog/` + `manual_testing_playbook/` content trees across all skills; `create-*` generators |
| **Change class** | Mechanical rename (hyphen→underscore) on path segments + in-lockstep reference sweep |
| **Testing** | `validate.sh --strict` recursive; Lane C smart-routing benchmark (regression check); markdown-link guard |
| **Runtime dependency** | None keys on the separator — validator classifies by parent-dir name; Lane C loader by frontmatter |

### Overview
Rename every hyphenated catalog/playbook content folder and per-feature `.md` file to `underscore_case`, rewriting all
live references in the same pass. Because the transform is a pure `-`→`_` on path segments and no runtime gate keys on
the separator, the work fanned out cleanly across three parallel agent branches partitioned by skill family, each
merged path-scoped.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rename map computed from the live tree with collision hard-abort
- [x] Deny-list confirmed (skill/agent/command names, phase folders, z_archive, changelogs)
- [x] Lane C separator-agnosticism verified (`load-playbook-scenarios.cjs:306`)

### Definition of Done
- [x] All in-scope tracked folders + files renamed; every live reference rewritten
- [x] `git ls-files` residual hyphenated content = 0 (excl z_archive)
- [x] Convention generators emit underscore form
- [x] `validate.sh --recursive --strict` Errors 0 on the 027 parent
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Migration Approach
A deterministic rename engine enumerates all hyphenated content folders + `.md` files under the in-scope surfaces,
computes the `-`→`_` rename map on path segments only, hard-aborts on any collision, then `git mv`s and rewrites root
index tables + `category:` frontmatter + nav/cross-ref links in the same pass. The deny-list protects skill/agent/
command directory names, spec phase-folder names, `z_archive`, and changelogs.

### Component Disposition
- **Content folders + per-feature files** → renamed hyphen→underscore.
- **Root index tables + `category:` frontmatter + cross-ref links** → rewritten in lockstep.
- **`create-*` generators** → emit `category_name` / `feature_name.md` (shipped as 027 commit `7cc369f2ed`).
- **Skill/agent/command names, phase folders, z_archive, changelogs** → untouched (deny-list).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Prepare
- [x] Compute rename map from the live tree; hard-abort on collision; confirm deny-list

### Phase 2: Execute
- [x] Fan out across parallel agent branches by skill family: `git mv` folders + files; rewrite references in lockstep

### Phase 3: Merge + Verify
- [x] Merge branches path-scoped (`b5afa1206c`, `0659149d08`); residual-hyphen grep gate; strict validate
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | `git ls-files` residual hyphenated content = 0 (excl z_archive) | git + ripgrep |
| Classification | Every catalog/playbook leaf still typed (not downgraded) | `validate.sh --strict` |
| Benchmark | Lane C scenario count + D1-D5 scoring unchanged | skill-benchmark harness |
| Doc | Whole-workspace markdown-link guard clean | check-markdown-links |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| spec-kit validator | Internal | Green | Cannot confirm no classification regression |
| Lane C harness | Internal | Green | Cannot confirm no benchmark regression |
| Sibling re-nest (parent 001/002) | Internal | Complete | Tree consistency across the 027 parent |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a broken reference or a mis-typed leaf surfaces post-merge
- **Procedure**: `git revert` the migration merge commits (`0659149d08`, `b5afa1206c`); the transform is a pure
  path-segment rename, so revert is lossless
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Prepare) ──> Phase 2 (Execute) ──> Phase 3 (Merge + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Prepare | None | Execute |
| Execute | Prepare | Merge + Verify |
| Merge + Verify | Execute | None |
<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Prepare | Medium | 30 minutes |
| Execute | Medium | fanned out across 3 parallel branches |
| Merge + verify | Low-Medium | 30 minutes |
| **Total** | | **~2 hours wall-clock** |
<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-migration Checklist
- [x] Rename map computed with collision hard-abort
- [x] Deny-list reviewed for skill/agent/command names + phase folders
- [x] Executed in isolated worktrees; commits path-scoped

### Rollback Procedure
1. `git revert 0659149d08 b5afa1206c` → restores hyphen-case content + references
2. Re-run `validate.sh --strict` to confirm the reverted tree is clean

### Data Reversal
- **Has data migrations?** No — path-segment renames only, fully git-reversible
<!-- /ANCHOR:l2-rollback -->
