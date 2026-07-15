---
title: "Verification Checklist: Underscore restyle of catalog/playbook content"
description: "Verification evidence for the hyphen->underscore content migration: rename completeness, reference-sweep integrity, classification stability, benchmark neutrality, and concurrent-session isolation."
trigger_phrases:
  - "underscore migration checklist"
  - "catalog content rename verification"
  - "hyphen to underscore checklist"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
    last_updated_at: "2026-07-12T11:31:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Checklist reconciled to shipped state with evidence"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Underscore Restyle of Catalog/Playbook Content

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Rename map computed from the live tree with collision hard-abort
  - **Evidence**: the `-`→`_` map was derived by `git ls-files` enumeration on path segments only; any collision aborts before `git mv`
- [x] CHK-002 [P0] Deny-list confirmed for non-content names
  - **Evidence**: skill/agent/command directory names, spec phase folders (`^[0-9]{3}-[a-z0-9-]+$`), `z_archive`, and changelogs excluded from the sweep
- [x] CHK-003 [P1] Separator-agnosticism verified before migrating
  - **Evidence**: validator classifies by parent-dir name (`validate_document.py:129,137`); Lane C loader selects by frontmatter (`load-playbook-scenarios.cjs:306`)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All in-scope tracked content folders/files use underscore_case (REQ-001)
  - **Evidence**: `git ls-files '**/feature_catalog/**/*-*.md' '**/manual_testing_playbook/**/*-*.md'` (excl z_archive) = 0 tracked
- [x] CHK-011 [P0] Underscore end-state present at expected scale (REQ-001)
  - **Evidence**: `git ls-files` finds 2,032 tracked underscore `.md` content files under the in-scope surfaces
- [x] CHK-012 [P1] Convention generators emit the underscore form (REQ-005)
  - **Evidence**: `create-feature-catalog` + `create-manual-testing-playbook` generators use `category_name` / `feature_name.md` (027 commit `7cc369f2ed`)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] No classification regression after rename (REQ-003)
  - **Evidence**: `validate.sh --strict` keeps catalog/playbook leaves typed; validator keys on the `feature_catalog`/`manual_testing_playbook` parent-dir name, not the slug
- [x] CHK-021 [P0] No dangling hyphenated path reference (REQ-002)
  - **Evidence**: root index tables + `category:` frontmatter + cross-ref links rewritten in the same pass; markdown-link guard clean
- [x] CHK-022 [P1] Lane C benchmark corpus unchanged (REQ-006)
  - **Evidence**: loader selects by frontmatter (`load-playbook-scenarios.cjs:306`) → scenario count + D1-D5 scoring separator-invariant
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded
  - **Evidence**: `naming-convention` migration — a repo-wide content rename spanning `feature_catalog/` + `manual_testing_playbook/` across every skill
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: the `create-*` generators (the only producers of new content names) rewritten to `category_name` / `feature_name.md` (027 commit `7cc369f2ed`)
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence**: root index tables, `category:` frontmatter, and cross-ref links swept; validator + Lane C loader confirmed separator-agnostic
- [x] CHK-FIX-004 [P0] Adversarial/edge cases considered
  - **Evidence**: digit-bearing topic names + rename collisions hard-abort before any `git mv`; the deny-list protects skill/phase-folder names; the word-boundary-safe sweep (enumerated via `git ls-files`) leaves hyphenated skill names in prose intact
- [x] CHK-FIX-005 [P1] Scope of the sweep listed before completion
  - **Evidence**: in-scope surfaces enumerated in `spec.md` §3; out-of-scope non-`.md` files + untracked concurrent files explicitly excluded
- [x] CHK-FIX-006 [P1] Global-state / cross-runtime variant checked
  - **Evidence**: two `validate_document.py` copies both key on parent-dir name; the rename is separator-only so both runtimes classify identically
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix range
  - **Evidence**: migration merged at `0659149d08` + `b5afa1206c`; generators at `7cc369f2ed`; end-state `git ls-files` residual = 0
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or machine-local paths introduced by the rename
  - **Evidence**: pure path-segment hyphen→underscore transform confirmed by `git ls-files` diff; no content bodies changed beyond reference links
- [x] CHK-031 [P1] Scope discipline: untracked concurrent-session files never staged
  - **Evidence**: the 50 hyphenated `.md` under `system-deep-loop/deep-alignment/` are `??` untracked (0 tracked); left untouched, not part of the migration diff
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/summary synchronized with the shipped migration
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` all reflect the merged rename + generator rewrite
- [x] CHK-041 [P1] Frozen history preserved
  - **Evidence**: `z_archive/**` + changelogs excluded from the sweep; hyphenated skill/agent/command/phase-folder names untouched
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Renames are path-segment only
  - **Evidence**: folders + per-feature files renamed via `git mv`; no files moved across categories or restructured
- [x] CHK-051 [P2] Stray non-content trees left alone
  - **Evidence**: a stray `.opencode/node_modules/` tree + `.advisor-state` dir under a playbook path are not content; never targeted by the sweep
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-12
**Verified By**: AI Assistant (Claude Opus 4.8)
<!-- /ANCHOR:summary -->
