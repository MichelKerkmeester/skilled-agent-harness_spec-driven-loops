---
title: "Tasks: Remove untracked stub packets below the system-code-graph archive ceiling"
description: "Task breakdown for verifying and deleting the 2 untracked stub directories (007-code-graph-buildout, 009-advisor-codegraph-shared-features) below the system-code-graph archive ceiling."
trigger_phrases:
  - "system-code-graph stub cleanup tasks"
  - "remove untracked spec stubs tasks"
  - "007 009 stub directory removal tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded task breakdown for stub cleanup"
    next_safe_action: "Execute Phase 1 through 3 tasks in order"
    blockers: []
    key_files:
      - ".opencode/specs/system-code-graph/007-code-graph-buildout/"
      - ".opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-system-code-graph-cleanup-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remove untracked stub packets below the system-code-graph archive ceiling

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

- [ ] T001 Re-run `git ls-files .opencode/specs/system-code-graph/007-code-graph-buildout .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` immediately before deletion and confirm empty output for both paths
- [ ] T002 [P] Run `find .opencode/specs/system-code-graph/007-code-graph-buildout` and capture the on-disk content list as pre-deletion evidence
- [ ] T003 [P] Run `find .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` and capture the on-disk content list as pre-deletion evidence
- [ ] T004 Re-run the repo-wide `rg` sweep for both basenames and reconfirm every hit still classifies as historical (`context-index.md`) or stale-index (`descriptions.json`), with none newly classified as an active live link
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 `rm -rf .opencode/specs/system-code-graph/007-code-graph-buildout/`
- [ ] T006 `rm -rf .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm `ls .opencode/specs/system-code-graph/007-code-graph-buildout` reports "No such file or directory"
- [ ] T008 Confirm `ls .opencode/specs/system-code-graph/009-advisor-codegraph-shared-features` reports "No such file or directory"
- [ ] T009 Re-run `ls -d .opencode/specs/system-code-graph/*/ | grep -oE '[0-9]{3}-[a-z0-9-]+' | sort -n` and confirm archive max `024` is immediately followed by active min `025` with no gap-filler directory remaining
- [ ] T010 Confirm `git status --porcelain` shows no diff attributable to this deletion (both paths were untracked)
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/003-system-code-graph-cleanup --strict`
- [ ] T012 Update `implementation-summary.md` and `checklist.md` with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (directories absent, number-line invariant confirmed, strict validation passed)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
