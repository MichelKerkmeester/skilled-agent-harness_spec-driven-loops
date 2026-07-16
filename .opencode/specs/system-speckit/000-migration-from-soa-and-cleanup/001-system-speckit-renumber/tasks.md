---
title: "Tasks: Renumber system-speckit active packets above the archive ceiling"
description: "Task breakdown for removing 4 stale stub directories, git mv'ing 16 active packets from 001-016 to 026-041, repairing self-referential path tokens, regenerating metadata, and verifying with strict recursive validation."
trigger_phrases:
  - "system-speckit renumber tasks"
  - "026-041 git mv tasks"
  - "packet ref-repair tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Broke plan phases into per-row tasks"
    next_safe_action: "Start T001 once stub approval granted"
    blockers:
      - "T-STUB (stub removal) is gated on operator approval per spec.md REQ-001; do not mark it [x] without that approval recorded."
    key_files:
      - ".opencode/specs/system-speckit/z_archive/"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-system-speckit-renumber-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Renumber system-speckit active packets above the archive ceiling

<!-- SPECKIT_LEVEL: 2 -->

---

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

- [ ] T001 Open a clean sk-git worktree off `origin/skilled/v4.0.0.0` for this renumber (do not execute on the shared branch)
- [ ] T002 Capture baseline `git ls-files .opencode/specs/system-speckit/<001..016> | wc -l` per packet (expect sum 18,359: 7, 9583, 4725, 3783, 10, 43, 17, 8, 7, 46, 6, 45, 49, 6, 18, 6)
- [ ] T003 Capture baseline `bash validate.sh <each of 001..016> --recursive --strict` error counts per packet (sum = regression baseline)
- [ ] T004 [B] Re-run repo-wide `rg -n "system-speckit/(00[1-9]|01[0-6])-" .` inside the fresh worktree to reconfirm 0 hits outside `.opencode/specs/system-speckit/**` still holds (blocked on: worktree being current with any concurrent-session edits)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

This phase mirrors plan.md §4 Phase 2: stub-removal gate first, then the 16 renames low-target-first, then per-row ref repair immediately after each rename (not as one giant deferred sweep).

- [ ] T005 [B] Resolve the stub-handling decision (snapshot-first vs. direct removal) per operator input; blocked until spec.md REQ-001 is explicitly approved
- [ ] T006 Remove `.opencode/specs/system-speckit/026-graph-and-context-optimization/` (untracked stub, wrong slug for target position; 470 files/255M)
- [ ] T007 Remove `.opencode/specs/system-speckit/027-xce-research-based-refinement/` (untracked stub, wrong slug for target position; 1,331 files/26M)
- [ ] T008 Remove `.opencode/specs/system-speckit/028-memory-search-intelligence/` (untracked stub, wrong slug for target position; 14 files/408K)
- [ ] T009 Remove `.opencode/specs/system-speckit/029-phased-spec-preference/` (untracked stub, wrong slug for target position; 1 file/0B)
- [ ] T010 Verify all 4 stub paths report "No such file or directory" before any rename below runs
- [ ] T011 `git mv .opencode/specs/system-speckit/001-cmd-memory-output .opencode/specs/system-speckit/026-cmd-memory-output`; verify `git status --porcelain` shows `R`
- [ ] T012 Ref-repair `026-cmd-memory-output/**` — rewrite every `system-speckit/001-cmd-memory-output` token to `system-speckit/026-cmd-memory-output`
- [ ] T013 `git mv .opencode/specs/system-speckit/002-graph-and-context-optimization .opencode/specs/system-speckit/027-graph-and-context-optimization`; verify `git status --porcelain` shows `R` (largest packet: 9,583 tracked files)
- [ ] T014 Ref-repair `027-graph-and-context-optimization/**` — rewrite every `system-speckit/002-graph-and-context-optimization` token to `system-speckit/027-graph-and-context-optimization` (largest repair surface: 3,533 files-with-match at baseline)
- [ ] T015 `git mv .opencode/specs/system-speckit/003-xce-research-based-refinement .opencode/specs/system-speckit/028-xce-research-based-refinement`; verify `git status --porcelain` shows `R` (4,725 tracked files)
- [ ] T016 Ref-repair `028-xce-research-based-refinement/**` — rewrite every `system-speckit/003-xce-research-based-refinement` token to `system-speckit/028-xce-research-based-refinement` (1,038 files-with-match at baseline)
- [ ] T017 `git mv .opencode/specs/system-speckit/004-memory-search-intelligence .opencode/specs/system-speckit/029-memory-search-intelligence`; verify `git status --porcelain` shows `R` (3,783 tracked files)
- [ ] T018 Ref-repair `029-memory-search-intelligence/**` — rewrite every `system-speckit/004-memory-search-intelligence` token to `system-speckit/029-memory-search-intelligence` (2,578 files-with-match at baseline)
- [ ] T019 `git mv .opencode/specs/system-speckit/005-rust-backend-rewrite-research .opencode/specs/system-speckit/030-rust-backend-rewrite-research`; verify `git status --porcelain` shows `R`
- [ ] T020 Ref-repair `030-rust-backend-rewrite-research/**` — rewrite every `system-speckit/005-rust-backend-rewrite-research` token to `system-speckit/030-rust-backend-rewrite-research`
- [ ] T021 `git mv .opencode/specs/system-speckit/006-spec-gate-enforce-readiness .opencode/specs/system-speckit/031-spec-gate-enforce-readiness`; verify `git status --porcelain` shows `R`
- [ ] T022 Ref-repair `031-spec-gate-enforce-readiness/**` — rewrite every `system-speckit/006-spec-gate-enforce-readiness` token to `system-speckit/031-spec-gate-enforce-readiness`
- [ ] T023 `git mv .opencode/specs/system-speckit/007-phased-spec-preference .opencode/specs/system-speckit/032-phased-spec-preference`; verify `git status --porcelain` shows `R`
- [ ] T024 Ref-repair `032-phased-spec-preference/**` — rewrite every `system-speckit/007-phased-spec-preference` token to `system-speckit/032-phased-spec-preference`
- [ ] T025 `git mv .opencode/specs/system-speckit/008-vitest-invariance-maintenance .opencode/specs/system-speckit/033-vitest-invariance-maintenance`; verify `git status --porcelain` shows `R`
- [ ] T026 Ref-repair `033-vitest-invariance-maintenance/**` — rewrite every `system-speckit/008-vitest-invariance-maintenance` token to `system-speckit/033-vitest-invariance-maintenance`
- [ ] T027 `git mv .opencode/specs/system-speckit/009-cmd-merge-spec-kit-phase .opencode/specs/system-speckit/034-cmd-merge-spec-kit-phase`; verify `git status --porcelain` shows `R`
- [ ] T028 Ref-repair `034-cmd-merge-spec-kit-phase/**` — rewrite every `system-speckit/009-cmd-merge-spec-kit-phase` token to `system-speckit/034-cmd-merge-spec-kit-phase`
- [ ] T029 `git mv .opencode/specs/system-speckit/010-cmd-spec-kit-ux-upgrade .opencode/specs/system-speckit/035-cmd-spec-kit-ux-upgrade`; verify `git status --porcelain` shows `R`
- [ ] T030 Ref-repair `035-cmd-spec-kit-ux-upgrade/**` — rewrite every `system-speckit/010-cmd-spec-kit-ux-upgrade` token to `system-speckit/035-cmd-spec-kit-ux-upgrade`
- [ ] T031 `git mv .opencode/specs/system-speckit/011-spec-kit-ux-adoptions .opencode/specs/system-speckit/036-spec-kit-ux-adoptions`; verify `git status --porcelain` shows `R`
- [ ] T032 Ref-repair `036-spec-kit-ux-adoptions/**` — rewrite every `system-speckit/011-spec-kit-ux-adoptions` token to `system-speckit/036-spec-kit-ux-adoptions`
- [ ] T033 `git mv .opencode/specs/system-speckit/012-spec-kit-coco-sk-code-research .opencode/specs/system-speckit/037-spec-kit-coco-sk-code-research`; verify `git status --porcelain` shows `R`
- [ ] T034 Ref-repair `037-spec-kit-coco-sk-code-research/**` — rewrite every `system-speckit/012-spec-kit-coco-sk-code-research` token to `system-speckit/037-spec-kit-coco-sk-code-research`
- [ ] T035 `git mv .opencode/specs/system-speckit/013-spec-kit-auto-mode-noninteractive-contract .opencode/specs/system-speckit/038-spec-kit-auto-mode-noninteractive-contract`; verify `git status --porcelain` shows `R`
- [ ] T036 Ref-repair `038-spec-kit-auto-mode-noninteractive-contract/**` — rewrite every `system-speckit/013-spec-kit-auto-mode-noninteractive-contract` token to `system-speckit/038-spec-kit-auto-mode-noninteractive-contract`
- [ ] T037 `git mv .opencode/specs/system-speckit/014-subphase-recatalog-and-archive .opencode/specs/system-speckit/039-subphase-recatalog-and-archive`; verify `git status --porcelain` shows `R`
- [ ] T038 Ref-repair `039-subphase-recatalog-and-archive/**` — rewrite every `system-speckit/014-subphase-recatalog-and-archive` token to `system-speckit/039-subphase-recatalog-and-archive`
- [ ] T039 `git mv .opencode/specs/system-speckit/015-base-files-renumbering-name-cleanup .opencode/specs/system-speckit/040-base-files-renumbering-name-cleanup`; verify `git status --porcelain` shows `R`
- [ ] T040 Ref-repair `040-base-files-renumbering-name-cleanup/**` — rewrite every `system-speckit/015-base-files-renumbering-name-cleanup` token to `system-speckit/040-base-files-renumbering-name-cleanup`, AND correct (or explicitly defer with a documented reason) its pre-existing stale `packet_pointer` (`skilled-agent-orchestration/z_archive/090-...`)
- [ ] T041 `git mv .opencode/specs/system-speckit/016-cmd-speckit-family-rename .opencode/specs/system-speckit/041-cmd-speckit-family-rename`; verify `git status --porcelain` shows `R`
- [ ] T042 Ref-repair `041-cmd-speckit-family-rename/**` — rewrite every `system-speckit/016-cmd-speckit-family-rename` token to `system-speckit/041-cmd-speckit-family-rename`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T043 [P] Run `generate-description.js <folder> <repo-root>` from the MAIN tree's `dist/` for all 16 renamed packets (and any phase children found under them)
- [ ] T044 [P] Run `backfill-graph-metadata.js <spec-folder>` (single-packet mode) from the MAIN tree's `dist/` for all 16 renamed packets
- [ ] T045 Re-run repo-wide `rg -n "system-speckit/(00[1-9]|01[0-6])-" .`; expect 0 matches anywhere
- [ ] T046 Run `bash validate.sh <each of 026..041> --recursive --strict`; sum error counts and diff against T003's baseline (delta must be <= 0)
- [ ] T047 Confirm number-line invariant: `ls -d .opencode/specs/system-speckit/*/ | grep -oE '^[0-9]{3}' | sort -u` shows archive max `025` immediately followed by active min `026`, no `001-016` remaining
- [ ] T048 Author `implementation-summary.md` recording the executed rename map, ref-repair evidence per packet, metadata-regen results, and the validate.sh delta table
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T004 and T005's blockers explicitly resolved, not skipped)
- [ ] Manual verification passed (T043-T047 all show clean/expected output)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
