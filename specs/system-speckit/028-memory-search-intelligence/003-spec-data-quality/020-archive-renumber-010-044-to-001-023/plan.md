---
title: "Implementation Plan: Archive Renumber 010-044 to 001-023"
description: "Dependency-ordered plan for renumbering system-deep-loop's z_archive, regenerating its full-depth metadata, and fixing cross-reference citations."
trigger_phrases:
  - "archive renumber plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/020-archive-renumber-010-044-to-001-023"
    last_updated_at: "2026-07-08T15:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from approved plan-mode design"
    next_safe_action: "Execute Stage A (pre-flight already captured), then Stage B renames"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/054-archive-renumber-010-044-to-001-023"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Archive Renumber 010-044 to 001-023

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, `git mv`, Node.js scripts |
| **Framework** | `generate-description.js` / `backfill-graph-metadata.js` (system-spec-kit), `validate.sh --strict --recursive` |
| **Testing** | Delta-based `validate.sh` comparison against a captured pre-rename baseline (not zero-error, per REQ-010) |

### Overview
5 stages: pre-flight (done — recovery tag + before-manifest + baseline capture already run), rename (23 top-level + 8 nested, fixed collision-free ordering), metadata regeneration (234 nested folders + 1 hand-edited container), cross-reference cleanup (1017 files, single-pass substitution), verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `z_archive/` confirmed clean, `descriptions.json` confirmed dirty-from-elsewhere (leave untouched).
- [x] Recovery tag + before-manifest captured.
- [x] Baseline `validate.sh` counts captured per top-level folder.

### Definition of Done
- [ ] All 234 nested folders' identity metadata matches their new path.
- [ ] `rg` sweep for old archive numbers returns zero hits repo-wide.
- [ ] `validate.sh --strict` delta-matches baseline (no new failure category) per renamed folder.
- [ ] Live tree and `descriptions.json` confirmed untouched.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same class of work as `053-deep-loop-036-037-reindex`, scaled ~12x (2 folders → 23+8; 10 docs → 1017). Rename first (atomic per-folder `git mv`), regenerate second (identity fields derive from current on-disk path, must run after rename completes), cross-reference cleanup third (independent of the first two, but logically follows since it fixes citations of the now-final numbers).

### Stage sequence

**Stage A — Pre-flight (complete).** Recovery tag `checkpoint/archive-renumber-pre-<ts>`, before-manifest (235 description.json paths), baseline `validate.sh --strict --recursive` per top-level folder.

**Stage B — Top-level renames.** 23 `git mv` operations, ascending source-number order (proven collision-free — no target number is ever occupied by a not-yet-moved source):
```
010→001 012→002 013→003 014→004 020→005 021→006 022→007 023→008
024→009 025→010 026→011 027→012 028→013 029→014 030→015 031→016
032→017 033→018 034→019 035→020 042→021 043→022 044→023
```

**Stage C — Nested child shift.** `006-deep-skill-evolution`'s (post-rename name) children `000-007 → 001-008`, descending source order (`007→008` first, `000→001` last — ascending would collide with the not-yet-moved `001-deep-ai-council`).

**Stage D — Metadata regeneration.** Loop `generate-description.js <folder> .opencode/specs` + `backfill-graph-metadata.js <folder>` over every `description.json` found under the renamed tree (234 files, covers top-23 + nested-8 + ~203 deeper descendants in one pass). Hand-edit `z_archive/graph-metadata.json`'s `children_ids` array separately (not machine-regeneratable — no `spec.md` at that level; its `description.json` needs no edit, confirmed it names children by slug/count not number).

**Stage E — Cross-reference cleanup.** Single-pass dictionary-substitution script (Python/Node, regex-callback matching `z_archive/(\d{3})-` against the mapping dict) across all 1017 files with a `packet_pointer:` field or prose citation of an old number — never 23 chained `sed` calls (double-substitution corruption risk, same failure class caught and fixed earlier this session).

**Stage F — Verification.** Structural (`find` listings), `validate.sh --strict --recursive` per top-level folder vs Stage-A baseline (delta, not zero), `rg` sweep before/after, live-tree + `descriptions.json` non-interference checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Stage A: pre-flight complete.

### Phase 2: Core Implementation
- [ ] Stage B: 23 top-level renames.
- [ ] Stage C: 8 nested child renames.
- [ ] Stage D: metadata regeneration (234 folders + container hand-edit).
- [ ] Stage E: cross-reference cleanup (1017 files).

### Phase 3: Verification
- [ ] Stage F: full verification suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Folder listing contiguity | `find z_archive -maxdepth 1 -type d \| sort` |
| Static | Cross-reference residue | `rg` sweep for old-number path segments |
| Delta | Validation drift | `validate.sh --strict --recursive` per folder vs Stage-A baseline |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `generate-description.js` / `backfill-graph-metadata.js` dist builds | Internal | Confirmed current | Regeneration would fail or use stale logic |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any verification step in Stage F fails to delta-match baseline, or a concurrent-session conflict is detected mid-sequence.
- **Procedure**: nothing is committed until Stage F passes. `git checkout -- .opencode/specs/system-deep-loop/z_archive/` fully reverts every move and regenerated file in one shot. Never blanket-revert `descriptions.json` (unrelated in-flight changes). If interrupted mid-sequence, diff current folder listing against the Stage-A before-manifest to identify exactly which moves completed — the collision-free ordering proof holds from any resume point.
<!-- /ANCHOR:rollback -->
