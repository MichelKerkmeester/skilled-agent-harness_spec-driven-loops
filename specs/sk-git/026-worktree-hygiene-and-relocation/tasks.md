---
title: "Tasks: Worktree Hygiene & Relocation"
description: "Executor-ready task list for pruning worktrees, enabling fsmonitor, and relocating the sk-git worktree base outside the checkout."
trigger_phrases:
  - "worktree relocation tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/026-worktree-hygiene-and-relocation"
    last_updated_at: "2026-08-21T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "All three items shipped; suites green"
    next_safe_action: "Operator decision on 0158 orphan; optional commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-tasks"
      parent_session_id: null
---
# Tasks: Worktree Hygiene & Relocation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Prune clean branch-backed worktrees except active 022 (non-forced `git worktree remove`) [evidence: 9 removed; 15 dirty correctly kept by git's own clean-tree gate]
- [x] T002 Preserve all branch refs [evidence: `git branch --list 'worktrees/*'` = 20 refs present after prune]
- [x] T003 Enable fsmonitor + untracked cache [evidence: `git config --get core.fsmonitor`=true, `core.untrackedcache`=true; git 2.50.1]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `_wn_base_dir()` resolver (env > git config > default `.worktrees`) [evidence: `worktree-naming.sh` REPO RESOLUTION section]
- [x] T005 Base-aware `is_valid_pair`, `create_named_worktree`, `create_detached_worktree` [evidence: negative-control in throwaway repo — worktree created at external base, pair valid, number not reused]
- [x] T006 Resolve base in launch wrapper and reaper; generalize reaper daemon-orphan detection [evidence: `worktree-session.sh` + `worktree-reaper.sh` resolvers; token-walk parent-canonicalization]
- [x] T007 Fix test absolute-emit assertion; add 6 relocated-base regression tests [evidence: `worktree-naming.test.sh` → 71/0 PASS/FAIL (was 65/0 before the +6 tests)]
- [x] T008 Update SKILL.md ALWAYS #4, scripts/README.md, allocator grammar comment [evidence: `{base}` grammar documented in all three]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Set `speckit.worktreeBase=~/worktrees/public`; create base dir [evidence: `git config --get` returns the path; same APFS volume `/dev/disk3s5`]
- [x] T010 Migrate 13 idle worktrees via `git worktree move` (022 + live excluded) [evidence: 13 moved, 0 failed; `lsof -d cwd` proved only 022 live]
- [x] T011 `git worktree repair`; verify registry + 022 integrity [evidence: registry OK; 022 branch intact, 3 uncommitted files preserved]
- [x] T012 Remove 2 empty orphan dirs (0009, 0080) [evidence: 0009=0 files, 0080=1 stale log; `git worktree prune` clean]
- [ ] T013 Decide on 0158 orphan (229M, no ref, no admin entry) [evidence: deferred to operator; no branch ref and no git admin entry, but removal is terminal]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Main-checkout file count reduced 2.79M → 587K (SC-001) [evidence: `find` before/after]
- [x] `git worktree repair` registry OK (SC-002) [evidence: "worktree registry OK"]
- [x] Active 022 intact (SC-003) [evidence: branch + 3 uncommitted files preserved]
- [x] `speckit.worktreeBase` set; new worktrees allocate outside checkout (SC-004) [evidence: negative-control + live config]

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
