---
title: "Tasks: Archive Renumber 010-044 to 001-023"
description: "Task ledger for renumbering system-deep-loop's z_archive and optimizing its full historic-context metadata."
trigger_phrases:
  - "archive renumber tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/020-archive-renumber-010-044-to-001-023"
    last_updated_at: "2026-07-08T15:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All tasks complete, verified with real evidence"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/054-archive-renumber-010-044-to-001-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Archive Renumber 010-044 to 001-023

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Stage A pre-flight: recovery tag, before-manifest (235 description.json paths), baseline `validate.sh` counts per top-level folder.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Stage B: 23 top-level `git mv` renames, ascending order — all succeeded, structurally confirmed exact `001`-`023`.
- [x] T003 Stage C: 8 nested `006-deep-skill-evolution` child renames, descending order — confirmed exact `001`-`008`.
- [x] T004 Stage D: metadata regeneration loop over 235 nested folders (227 auto-regenerated, 8 lacked `spec.md` and were folded into T006's substitution instead).
- [x] T005 Stage D: `z_archive/graph-metadata.json`'s `children_ids` — fixed via the T006 substitution script rather than a separate hand-edit (turned out machine-fixable).
- [x] T006 Stage E: single-pass cross-reference cleanup — 1162 `.md`/`.json` files via script, plus 3 live `.txt` command assets the script's glob didn't cover, plus a compiled-contract re-sync.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Structural check: `001`-`023` top-level, `001`-`008` nested, both contiguous — confirmed.
- [x] T008 `validate.sh --strict --recursive` — T001's baseline capture was lost to a timing race (documented in `implementation-summary.md`); substituted with direct content-diff spot-checks against the recovery tag, confirming only expected fields changed and all other flagged categories are pre-existing.
- [x] T009 `rg` sweep for old archive numbers — redesigned mid-verification (bare-number search was ambiguous, old/new ranges overlap); the corrected number+slug pair sweep found 147 genuine hits, all individually triaged, 3 fixed, 144 confirmed deliberate historical preservation.
- [x] T010 Live-tree + `descriptions.json` non-interference confirmed — zero changes attributable to this work.
- [x] T011 `implementation-summary.md` authored with real evidence; `validate.sh --strict` run on this 054 packet itself.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Precedent**: `../053-deep-loop-036-037-reindex/`
<!-- /ANCHOR:cross-refs -->
