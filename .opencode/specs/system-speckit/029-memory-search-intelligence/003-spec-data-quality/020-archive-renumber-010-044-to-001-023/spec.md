---
title: "Feature Specification: Renumber system-deep-loop's z_archive from 010-044 to a contiguous 001-023 and optimize its full historic-context metadata"
description: "z_archive's 23 top-level packets are numbered 010, 012-014, 020-035, 042-044 instead of 001-023, and 10 of those numbers collide digit-for-digit with unrelated live packets. Renumber to 001-023, regenerate metadata across all 234 nested spec-folders, and fix cross-reference citations."
trigger_phrases:
  - "system-deep-loop archive renumber"
  - "z_archive 001-023"
  - "deep-loop archive collision fix"
  - "archive historic context optimize"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/020-archive-renumber-010-044-to-001-023"
    last_updated_at: "2026-07-08T15:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored Level 2 spec for the z_archive renumbering + full-depth metadata optimization"
    next_safe_action: "Execute the 23 top-level + 8 nested git mv renames"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/z_archive/graph-metadata.json"
      - ".opencode/specs/system-deep-loop/z_archive/010-sk-recursive-agent-loop"
      - ".opencode/specs/system-deep-loop/z_archive/021-deep-skill-evolution"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/054-archive-renumber-010-044-to-001-023"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope depth: full-depth (234 nested spec-folders + 1017 frontmatter/prose citations), confirmed by operator over top-level-only."
      - "SQLite/vector daemon reindex: explicitly deferred to a separate, later, operator-triggered pass — confirmed by operator."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Renumber system-deep-loop's z_archive from 010-044 to a contiguous 001-023 and optimize its full historic-context metadata

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../019-deep-loop-036-037-reindex/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/specs/system-deep-loop/z_archive/` numbers its 23 top-level archived packets `010, 012-014, 020-035, 042-044` — not the `001-023` a fresh archive would use. This isn't purely cosmetic: 10 of those numbers (`029, 030, 031, 032, 033, 034, 035, 042, 043, 044`) are digit-identical to unrelated, currently-active LIVE packets at `.opencode/specs/system-deep-loop/`'s own top level (e.g. archive's `029-agent-deep-review-optimization` vs live's `029-deep-loop-workflows` — completely different work sharing a number). One nested phase-parent, `021-deep-skill-evolution`, additionally numbers its own children `000-007` instead of `001-008`, the only zero-based sequence found anywhere in either tree. Beyond the directory names, every one of the 234 nested spec-folders under these 23 roots carries `description.json`/`graph-metadata.json` self-references (specFolder/specId/parentChain/packet_id/spec_folder/children_ids) that go stale the moment a folder moves, and 1017 markdown files carry a `packet_pointer:` frontmatter field or prose citation of the old numbers.

### Purpose
Renumber the 23 top-level archive folders to `001-023` (contiguous, below live's minimum of `029`, eliminating all 10 collisions as a side effect with zero changes to the live tree), shift `021-deep-skill-evolution`'s (becoming `006-...`) children `000-007` to `001-008`, regenerate every affected folder's own identity metadata, and fix every `packet_pointer:` frontmatter field and confirmed prose citation of the old numbers — so the archive is genuinely internally consistent, not just superficially renamed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` all 23 top-level `z_archive/` packets per the fixed old→new mapping (§4 REQ-001).
- `git mv` the 8 children of `021-deep-skill-evolution` (becoming `006-deep-skill-evolution`) from `000-007` to `001-008`.
- Regenerate `description.json`/`graph-metadata.json` for all 234 nested spec-folders under the renamed roots via `generate-description.js` + `backfill-graph-metadata.js`.
- Hand-edit `z_archive/graph-metadata.json`'s `children_ids` array to the 23 new paths (not machine-regeneratable — no `spec.md` at that level).
- Fix all 1017 markdown files' `packet_pointer:` frontmatter fields and any prose citing the old archive numbers, via a single-pass dictionary-substitution script (not chained sequential `sed`, to avoid double-substitution corruption across the 23-item mapping).
- Overlap-check `z_archive/` and `.opencode/specs/descriptions.json` for concurrent-session activity immediately before executing the renames.

### Out of Scope
- Any LIVE (non-archived) `system-deep-loop` folder — none of the 19 live packets (`029-045, 051-053`) are touched; the collision is resolved purely because the archive's new max (`023`) sits below live's min (`029`).
- The global `.opencode/specs/descriptions.json` master index — has no scoped-update path in the code, and is independently mid-flight-dirty from another process; regenerated later via a separate reindex, not edited here.
- The SQLite/vector daemon index (`context-index.sqlite` + vector DBs) — a real scoped mechanism exists (`memory_index_scan` with `specFolder`), but this pass explicitly defers it to a separate, operator-triggered follow-up per the repo's own "coordinate with 124/019" caution.
- `021-deep-skill-evolution`'s (becoming `006-...`) own nested `z_archive/arc-workspaces/...` sub-archive — no `NNN-` basename, never a rename target/source, rides along inside its renamed parent untouched.
- The precomputed research cache `sk-doc/999-sk-doc-parent/001-research-and-canon/research/precomputed/facade-topology.txt` — accepted staleness, optional refresh only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/system-deep-loop/z_archive/{010,012,013,014,020-035,042-044}-*` | Rename | 23 top-level `git mv` operations per the §4 REQ-001 mapping |
| `.opencode/specs/system-deep-loop/z_archive/006-deep-skill-evolution/{000-007}-*` | Rename | 8 nested `git mv` operations, `000-007 → 001-008`, descending order |
| Every `description.json`/`graph-metadata.json` under the 23 renamed roots (234 files total) | Modify | Regenerated via `generate-description.js` / `backfill-graph-metadata.js` |
| `.opencode/specs/system-deep-loop/z_archive/graph-metadata.json` | Modify | Hand-edit `children_ids` to the 23 new paths |
| 1017 markdown files under `z_archive/` with `packet_pointer:` frontmatter or prose citing an old number | Modify | Single-pass dictionary substitution |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | All 23 top-level archive folders renamed per the fixed mapping | `010→001, 012→002, 013→003, 014→004, 020→005, 021→006, 022→007, 023→008, 024→009, 025→010, 026→011, 027→012, 028→013, 029→014, 030→015, 031→016, 032→017, 033→018, 034→019, 035→020, 042→021, 043→022, 044→023` — `find z_archive -maxdepth 1 -type d \| sort` reads exactly `001`...`023` |
| REQ-002 | `006-deep-skill-evolution`'s children renumbered `000-007 → 001-008` | `find z_archive/006-deep-skill-evolution -maxdepth 1 -type d \| sort` reads exactly `001`...`008` |
| REQ-003 | No LIVE `system-deep-loop` folder is touched | `git status --porcelain -- .opencode/specs/system-deep-loop/` excluding `z_archive/` is empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-004 | Every renamed folder's own identity metadata matches its new path | Given each of the 234 nested spec-folders' `description.json`/`graph-metadata.json` currently self-reference an old path, When regenerated via `generate-description.js`/`backfill-graph-metadata.js`, Then `specFolder`/`specId`/`packet_id`/`spec_folder` all read the new path |
| REQ-005 | `z_archive/graph-metadata.json`'s `children_ids` lists the 23 new paths | Given the array currently lists the 23 old paths, When hand-edited, Then it lists exactly the 23 new paths with no old-number remnants |
| REQ-006 | Every `packet_pointer:` frontmatter field and prose citation of an old archive number is fixed | Given 1017 files currently cite an old number, When the single-pass substitution runs, Then `rg` for any old archive-number path segment under `z_archive/` returns zero matches |
| REQ-007 | No inbound reference elsewhere in the repo still cites an old archive number | Given the confirmed pre-rename `rg` sweep found zero inbound archive-number citations (only two unrelated LIVE-number citations, out of scope), When the post-rename sweep re-runs, Then it also returns zero matches |
| REQ-008 | `.opencode/specs/descriptions.json` is not touched | Given the file is independently mid-flight-dirty from another process, When this phase runs, Then `git diff -- descriptions.json` shows no hunk attributable to this work |
| REQ-009 | No concurrent-session conflict at execution time | Given `z_archive/` was confirmed clean and `descriptions.json` confirmed dirty (from elsewhere) during planning, When execution begins, Then a fresh `git status` re-check on `z_archive/` confirms it is still clean immediately before the first `git mv` |
| REQ-010 | Verification is delta-based against the captured pre-rename baseline, not zero-error | Given `validate.sh --strict` does not currently pass 0/0 on this tree unmodified (pre-existing drift), When post-rename validation runs per renamed folder, Then error/warning counts match the pre-rename baseline for that folder's stable suffix, with no new failure category |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `z_archive/` is numbered `001-023`, fully contiguous, zero collisions with the live tree's `029-053` range.
- **SC-002**: All 234 nested spec-folders' identity metadata matches their current path; `z_archive/graph-metadata.json`'s `children_ids` is correct.
- **SC-003**: Zero remaining `packet_pointer:`/prose citations of an old archive number anywhere in the repo (`rg` sweep confirms).
- **SC-004**: The live tree, `.opencode/specs/descriptions.json`, and the SQLite/vector daemon index are all untouched by this pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `generate-description.js` / `backfill-graph-metadata.js` | Regeneration mechanism for 234 folders | Reused as-is, same invocation proven earlier this session for `052-deep-loop-unification` |
| Risk | A concurrent session touches `z_archive/` or `descriptions.json` mid-sequence | Could corrupt the rename or clobber unrelated in-flight work | Pre-flight + immediate-pre-execution `git status` re-check; never write to `descriptions.json`; recovery tag + before-manifest captured for rollback |
| Risk | Chained sequential substitution across the 23-item mapping double-corrupts citations (an early rule's output caught by a later rule) | Silent, hard-to-detect data corruption in archived docs | Single-pass dictionary-lookup substitution per file, not 23 sequential `sed` calls — same failure class caught and fixed earlier this session during the `system-deep-loop` skill rename |
| Risk | `validate.sh --strict` has pre-existing, rename-unrelated drift on this tree | A naive "must reach 0/0" bar is unreachable and would misreport real progress as failure | Delta-based verification against a captured pre-rename baseline, per REQ-010 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding — both scope-depth and reindex-inclusion questions were resolved with the operator before this spec was authored (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
REQ-009
REQ-010
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
