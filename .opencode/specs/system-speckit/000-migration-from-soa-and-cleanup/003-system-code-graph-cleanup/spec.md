---
title: "Feature Specification: Remove untracked stub packets below the system-code-graph archive ceiling"
description: "Two untracked, zero-tracked-file stub directories (007-code-graph-buildout, 009-advisor-codegraph-shared-features) squat below the system-code-graph z_archive ceiling (max 024) even though their tracked content already migrated to 031/033. Delete them so no numbered gap-fillers sit between the archive and the compliant active range (025-035)."
trigger_phrases:
  - "system-code-graph stub cleanup"
  - "remove untracked spec stubs"
  - "archive ceiling packet cleanup"
  - "007 009 stub directory removal"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded stub-directory cleanup spec and plan docs"
    next_safe_action: "Run verify-then-rm-rf plan Phase 2 sequence"
    blockers: []
    key_files:
      - ".opencode/specs/system-code-graph/007-code-graph-buildout/"
      - ".opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/"
      - ".opencode/specs/system-code-graph/z_archive/"
      - ".opencode/specs/system-code-graph/context-index.md"
      - ".opencode/specs/descriptions.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-system-code-graph-cleanup-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the 152 stale descriptions.json specFolder entries still pointing at the old 007-/009- basenames be reindexed in a follow-up packet? Not a blocker for this deletion since they are search-index staleness, not a live filesystem/git reference."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Remove untracked stub packets below the system-code-graph archive ceiling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/specs/system-code-graph/z_archive/` is contiguous `001`-`024`, and the active tracked packets (`025-code-graph-core` through `035-rust-backend-rewrite-research`) are already correctly numbered above that ceiling. However, two directories still sit on disk between those ranges: `007-code-graph-buildout` and `009-advisor-codegraph-shared-features`. Both are confirmed untracked by git (`git ls-files` returns empty for each) — their tracked content was already migrated by the prior renumber commit (`5476c1e5486 refactor(system-code-graph): renumber active packets 001-011 to 025-035`) into `031-code-graph-buildout` and `033-advisor-code-graph-shared-features` respectively. What remains in the two stub directories is stray untracked scratch/log output (playbook-validation evidence logs under `007-code-graph-buildout/010-playbook-validation-and-hardening/**/scratch/*.log`, and review-lineage logs under `009-advisor-codegraph-shared-features/review/lineages/**/logs/review.log`) left behind by the migration, not live packet content.

### Purpose
Delete the two untracked stub directories so the `system-code-graph` packet folder contains only the contiguous archive (`001`-`024`) and the compliant active range (`025`-`035`), with no numbered gap-filler directories confusing the packet number line, and with zero tracked files touched by the removal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify via `git ls-files` that both stub directories contain 0 tracked files.
- Verify (via repo-wide grep) that no *active/live* documentation or code path references either stub directory's basename as a current target.
- Delete `.opencode/specs/system-code-graph/007-code-graph-buildout/` (untracked scratch/log artifacts only).
- Delete `.opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/` (untracked review-lineage log artifacts only).
- Re-confirm the packet number line after deletion: archive max (`024`) immediately followed by active min (`025`) with no intervening directory.

### Out of Scope
- Renumbering any active tracked packet under `system-code-graph/` — `025`-`035` are already compliant and untouched by this packet.
- Reconciling the 152 stale `descriptions.json` search-index entries (`specFolder` still reading `system-code-graph/007-code-graph-buildout...` or `system-code-graph/009-advisor-codegraph-shared-features...`) — this is memory/search-index staleness from the prior renumber, tracked separately as a reindex follow-up, and is unaffected by (does not block, and is not fixed by) deleting the on-disk stub directories.
- Rewriting `context-index.md`'s rename-mapping table, which intentionally documents `007 -> 031` ("number only") and `009 -> 033` ("slug normalized") as historical migration history, not a live pointer into the deleted directories.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-code-graph/007-code-graph-buildout/` | Delete | Untracked stub directory; 0 tracked files (`git ls-files` confirmed empty); contains only stray scratch/log artifacts from the completed 001-011->025-035 renumber migration. |
| `.opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/` | Delete | Untracked stub directory; 0 tracked files (`git ls-files` confirmed empty); contains only stray review-lineage log artifacts from the same completed migration. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify zero tracked files before deletion | `git ls-files .opencode/specs/system-code-graph/007-code-graph-buildout .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` returns empty output for both paths. |
| REQ-002 | Classify every remaining basename reference | Repo-wide grep for `007-code-graph-buildout` and `009-advisor-codegraph-shared-features` produces a finite hit list where every hit is classified as either historical/audit (e.g. `context-index.md` rename-mapping table) or stale-index (`descriptions.json` `specFolder` entries), with zero hits classified as an active live link that would break on deletion. |
| REQ-003 | Delete both untracked stub directories | `ls .opencode/specs/system-code-graph/007-code-graph-buildout` and `ls .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` both report "No such file or directory" after execution. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confirm the packet number-line invariant holds post-deletion | `ls -d .opencode/specs/system-code-graph/*/ \| grep -oE '[0-9]{3}-[a-z0-9-]+' \| sort -n` lists only the archive-relevant range and `025-code-graph-core` through `035-rust-backend-rewrite-research`, with archive max `024` and active min `025` and no gap-filler directory between them. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git ls-files .opencode/specs/system-code-graph/007-code-graph-buildout .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` returns empty both before and after deletion (git history/tracked-file set is unaffected, since nothing tracked existed there).
- **SC-002**: Post-deletion, `ls -d .opencode/specs/system-code-graph/*/` shows exactly `z_archive/` plus the 11 active packets `025`-`035`; no `007-` or `009-` prefixed directory remains.
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None — directories are untracked, so no git history rewrite or force-push is required. | N/A | Confirmed via `git status --porcelain` on both paths (no output) and `git log --all` (only shows the historical rename commit, not current tracking). |
| Risk | Stray scratch/log files inside the stubs are mistaken for still-needed evidence. | Low — deleting review/validation logs from an already-completed and already-migrated review. | Pre-deletion `find` inventory (captured in `plan.md` Phase 1) confirms contents are `scratch/*.log` and `review/lineages/**/logs/review.log` artifacts, not spec docs, and zero tracked files exist to lose. |
| Risk | `descriptions.json` stale entries are misread as a "live reference" that blocks deletion. | Low — could cause unnecessary scope creep into reindexing. | REQ-002 explicitly classifies these as stale-index, out-of-scope follow-up, not a live pointer requiring remediation before deletion. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — filesystem directory deletion only, no runtime performance surface.

### Security
- **NFR-S01**: N/A — no auth, no secrets, no external data.

### Reliability
- **NFR-R01**: Deletion must be idempotent and re-runnable; a second `rm -rf` against an already-absent path must not be treated as a failure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A, both target paths are fixed and known.
- Maximum length: N/A.
- Invalid format: N/A.

### Error Scenarios
- Path already removed by a concurrent process: treat as success (goal state already reached), verify with `ls` returning "No such file or directory".
- Unexpected tracked file discovered inside either directory at execution time: HALT per the Four Laws (Law 4) and re-run `git ls-files` before proceeding; do not delete if a tracked file is found.

### State Transitions
- Partial completion (one directory deleted, one not): re-run the same verify-then-delete sequence for the remaining directory; each directory's deletion is independent and order-agnostic.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | Two directory deletions, zero tracked files, zero code changes. |
| Risk | 2/25 | Untracked-only removal; no git history rewrite; low blast radius per the brief. |
| Research | 5/20 | Required confirming git-tracking status and classifying remaining basename references (context-index.md history vs. descriptions.json stale index). |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the 152 stale `descriptions.json` `specFolder` entries pointing at the old `007-`/`009-` basenames be reindexed in a follow-up packet? Not a blocker for this deletion.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
