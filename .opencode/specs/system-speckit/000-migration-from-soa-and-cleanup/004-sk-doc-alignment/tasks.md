---
title: "Tasks: Align sk-doc numbering by coordinating with the live concurrent migration"
description: "Task breakdown for the sk-doc numbering-alignment coordination packet: baseline evidence (done), wait-and-re-verify (blocked on the concurrent session), and final verification."
trigger_phrases:
  - "sk-doc numbering alignment tasks"
  - "sk-doc concurrent migration tasks"
  - "sk-doc working tree clean tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task breakdown; Phase 1 done, Phase 2-3 blocked"
    next_safe_action: "Do not complete T004-T010 until sk-doc tree is clean"
    blockers:
      - "sk-doc tree dirty from concurrent migration (929 paths: 926 D + 3 untracked, mtime to 07:52); no git-mv/rm until clean."
    key_files:
      - ".opencode/specs/sk-doc/z_archive/"
      - ".opencode/specs/sk-doc/015-sk-doc-parent/"
      - ".opencode/specs/sk-doc/016-hub-doc-conformance-fixes/"
      - ".opencode/specs/sk-doc/030-benchmark-authoring-centralization/"
      - ".opencode/specs/sk-doc/019-sk-doc-router-alignment/"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/"
      - ".opencode/specs/sk-doc/033-create-diff-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Close 014 gap via archive renumber, or leave intentionally open?"
      - "Is 016->030 a reserved range, or should it renumber contiguously?"
    answered_questions: []
---
# Tasks: Align sk-doc numbering by coordinating with the live concurrent migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Verify sk-doc archive contiguity (`ls .opencode/specs/sk-doc/z_archive` → `001` through `013`, no `014`)
- [x] T002 Verify active packet state and tracked/untracked status (`ls .opencode/specs/sk-doc`; `git ls-files -- .opencode/specs/sk-doc/<dir>` per active folder)
- [x] T003 [P] Capture concurrent-session dirty-tree baseline (`git status --porcelain -- .opencode/specs/sk-doc` = 929 paths: 926 `D` + 3 `??`; newest mtime `2026-07-16 07:52:46`; last landed commit `087b57045c` at `07:26:55`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T004 Wait for the concurrent session to commit its sk-doc renumbering (blocked - external, no known timeline)
- [B] T005 Re-run `git status --porcelain -- .opencode/specs/sk-doc` and confirm zero output (blocked on T004)
- [B] T006 Diff the final on-disk sk-doc numbering against this packet's two documented target end-states (blocked on T005)
- [B] T007 If the result matches neither documented end-state, halt and ask the user (LOGIC-SYNC) rather than deciding unilaterally (blocked on T006)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T008 Record the verified final sk-doc numbering state with command evidence (blocked on T006/T007)
- [ ] T009 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment --strict` for this packet's own four docs
- [B] T010 Hand off verification evidence for a future `implementation-summary.md` (not authored in this scaffold phase; blocked on T008)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `git status --porcelain -- .opencode/specs/sk-doc` returned zero lines before any Phase 2/3 task was marked complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
