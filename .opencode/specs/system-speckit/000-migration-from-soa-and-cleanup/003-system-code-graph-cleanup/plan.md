---
title: "Implementation Plan: Remove untracked stub packets below the system-code-graph archive ceiling"
description: "Verify-then-delete plan for the two untracked, zero-tracked-file stub directories (007-code-graph-buildout, 009-advisor-codegraph-shared-features) left on disk below the system-code-graph archive ceiling after the 001-011->025-035 renumber migration."
trigger_phrases:
  - "system-code-graph stub cleanup plan"
  - "remove untracked spec stubs plan"
  - "archive ceiling packet cleanup plan"
  - "007 009 stub directory removal plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded verify-then-rm-rf cleanup plan with evidence"
    next_safe_action: "Run Phase 1 verification then Phase 2 delete"
    blockers: []
    key_files:
      - ".opencode/specs/system-code-graph/007-code-graph-buildout/"
      - ".opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/"
      - ".opencode/specs/system-code-graph/z_archive/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-system-code-graph-cleanup-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "No renumber is required — real active packets (025-035) are already correctly numbered; this packet only removes the 2 untracked stub squatters."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remove untracked stub packets below the system-code-graph archive ceiling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (bash), git, filesystem |
| **Framework** | None — spec-kit packet housekeeping only |
| **Storage** | Local filesystem spec-folder tree under `.opencode/specs/system-code-graph/` |
| **Testing** | `git ls-files`, `find`, `rg`/`grep`, `ls -d` sorted listing, `validate.sh --strict` |

### Overview
Run a 2-step verify-then-remove sequence per stub directory: (1) confirm 0 tracked files via `git ls-files` and enumerate on-disk contents via `find` to prove they are stray scratch/log artifacts, then (2) `rm -rf` each directory. Because both directories are untracked, the deletion never touches git history and requires no commit-side rollback — the safety gate is entirely in the pre-deletion verification, not in reversibility after the fact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Both stub directories confirmed untracked (`git ls-files` returns empty for both) during scaffolding.
- [x] Remaining basename references classified: `context-index.md` (historical rename-mapping record, keep as-is) and `descriptions.json` (152 stale search-index entries, out-of-scope follow-up).

### Definition of Done
- [ ] `.opencode/specs/system-code-graph/007-code-graph-buildout/` removed from disk.
- [ ] `.opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/` removed from disk.
- [ ] Sorted packet listing shows archive max `024` immediately followed by active min `025` with no gap-filler directory.
- [ ] `git status --porcelain` shows no diff attributable to this deletion (directories were untracked).
- [ ] Strict packet validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verify-then-delete housekeeping (no application architecture involved).

### Key Components
- **Verification gate**: `git ls-files` + `find` inventory, run before any destructive command, to prove 0 tracked files and classify on-disk contents.
- **Reference-classification gate**: repo-wide `rg`/`grep` for both basenames, with every hit sorted into historical-audit or stale-index, and zero hits allowed in the "active live link" bucket.
- **Deletion step**: `rm -rf` against each confirmed-safe directory.
- **Post-condition check**: sorted numeric directory listing re-run to confirm the archive-ceiling/active-floor invariant (`024 < 025`, no gap directory) still holds.

### Data Flow
Verification and classification run first and produce the go/no-go evidence; only after both gates pass does the deletion step execute; the post-condition check then re-derives the same directory listing used in `spec.md` SC-002 to confirm the intended end state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/specs/system-code-graph/007-code-graph-buildout/` | Untracked stub directory holding stray scratch/log artifacts | Delete | `git ls-files` (pre) + `ls` (post, expect "No such file or directory") |
| `.opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/` | Untracked stub directory holding stray review-lineage log artifacts | Delete | `git ls-files` (pre) + `ls` (post, expect "No such file or directory") |
| `.opencode/specs/system-code-graph/context-index.md` | Historical rename-mapping record (`007->031`, `009->033`) | Unchanged — not a consumer of the deleted directories' content, it documents the migration as completed history | `rg -n "007-code-graph-buildout|009-advisor-codegraph-shared-features" context-index.md` confirms the only hits are inside the rename-mapping table, framed in the past tense |
| `.opencode/specs/descriptions.json` | Stale search-index `specFolder` entries (142 for `007-code-graph-buildout*`, 10 for `009-advisor-codegraph-shared-features*`) | Unchanged in this packet — flagged as an out-of-scope reindex follow-up | `grep -c '"specFolder": "system-code-graph/007-code-graph-buildout' .opencode/specs/descriptions.json` and the `009-` equivalent, captured as baseline evidence in `implementation-summary.md` |

Required inventories:
- Same-class producers: `git ls-files .opencode/specs/system-code-graph/007-code-graph-buildout .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` (expect empty for both — proves instance-only/zero-tracked status).
- Consumers of changed basenames: `rg -rl "007-code-graph-buildout|009-advisor-codegraph-shared-features" . --glob '!**/node_modules/**'` (classify every hit as historical/`context-index.md` or stale-index/`descriptions.json`; zero hits may be classified as an active live link).
- Matrix axes: directory (2: `007-code-graph-buildout`, `009-advisor-codegraph-shared-features`) x check (git-tracking status, on-disk content inventory, basename-reference classification, post-deletion listing invariant).
- Algorithm invariant: no `rm -rf` executes against either path until `git ls-files` for that exact path returns empty output in the same session.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm `git ls-files .opencode/specs/system-code-graph/007-code-graph-buildout .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` returns empty immediately before deletion (do not rely solely on the scaffolding-time check).
- [ ] Run `find` against both directories to capture the exact on-disk content list as pre-deletion evidence.
- [ ] Re-run the repo-wide basename grep and reconfirm the historical/stale-index classification still holds (no new live reference introduced since scaffolding).

### Phase 2: Core Implementation
- [ ] `rm -rf .opencode/specs/system-code-graph/007-code-graph-buildout/`
- [ ] `rm -rf .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/`

### Phase 3: Verification
- [ ] Confirm both paths now report "No such file or directory" via `ls`.
- [ ] Re-run `ls -d .opencode/specs/system-code-graph/*/ | grep -oE '[0-9]{3}-[a-z0-9-]+' | sort -n` and confirm archive max `024` is immediately followed by active min `025` with no gap-filler directory.
- [ ] Confirm `git status --porcelain` shows no diff caused by this deletion (untracked paths only).
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup --strict`.
- [ ] Update `implementation-summary.md` and `checklist.md` with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Pre-condition check | Both stub directories | `git ls-files`, `find` |
| Reference classification | Repo-wide basename mentions | `rg`/`grep` |
| Post-condition check | `system-code-graph/` directory listing | `ls -d`, `grep -oE`, `sort -n` |
| Packet validation | This packet's own docs | `bash .../validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git ls-files` verification | Internal tool | Available | If it ever returns a tracked file for either path, HALT and do not delete (Four Laws, Law 4). |
| Strict spec validation script | Internal tool | Available | If validation fails, fix packet docs before claiming completion; does not block the directory deletion itself. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A tracked file or a needed non-scratch artifact is discovered inside either directory after deletion (should not happen given the pre-deletion `git ls-files` gate, but named for completeness).
- **Procedure**: Because both directories are untracked, `git` cannot restore deleted content — there is no git-side rollback. The mitigation is entirely pre-emptive: the Phase 1 verification gate (fresh `git ls-files` + `find` inventory) must run and be reviewed immediately before Phase 2's `rm -rf`, not after.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Verify) ──► Phase 2 (Delete) ──► Phase 3 (Re-verify + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Verify | None | Delete |
| Delete | Verify | Re-verify + validate |
| Re-verify + validate | Delete | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Verify | Low | 5-10 minutes |
| Delete | Low | <5 minutes |
| Re-verify + validate | Low | 5-10 minutes |
| **Total** | | **~15-25 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No production deployment or data migration involved — local spec-folder housekeeping only.
- [ ] `git ls-files` re-run immediately before deletion, not relying on the scaffolding-time snapshot.

### Rollback Procedure
1. N/A for git-side revert (untracked paths cannot be restored via `git checkout`/`git revert`).
2. If content is later found to be needed, it would have to be recreated manually or recovered from the review/validation run that originally produced it (outside this packet's scope).
3. Verify rollback is not applicable: prevention (the pre-deletion gate) is the control, not recovery.
4. Notify stakeholders only if a genuinely needed artifact is discovered missing post-deletion.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — untracked filesystem deletion, no data migration to reverse.
<!-- /ANCHOR:enhanced-rollback -->
