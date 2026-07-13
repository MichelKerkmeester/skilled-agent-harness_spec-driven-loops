---
title: "Tasks: worktree, baseline, and census (017 phase 000)"
description: "Tasks for phase 000 of the 017 kebab-case filesystem-naming program: worktree, baseline, and census."
trigger_phrases:
  - "worktree, baseline, and census tasks"
  - "hyphen naming phase 000 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/000-worktree-baseline-and-census"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/000-worktree-baseline-and-census"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Worktree, baseline, and census

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Pin an immutable BASE SHA (`git rev-parse origin/skilled/v4.0.0.0^{commit}`) and record it
- [ ] T003 Create the isolated worktree `.worktrees/0037-017-hyphen-naming` on branch `wt/0037-017-hyphen-naming` off BASE, with isolated `SPEC_KIT_DB_DIR` / `SPECKIT_CODE_GRAPH_DB_DIR` / `SPECKIT_IPC_SOCKET_DIR`
- [ ] T004 A fresh, deterministic dependency install + build in the worktree (never symlink `node_modules` or `dist`)
- [ ] T005 Capture the baseline: naming census, symlink + file-mode manifest, test-discovery counts, recursive strict-validate output, Lane C scenario IDs + scores, and an exact/casefold/NFC collision report
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: An immutable BASE SHA is pinned and recorded for the whole program — BASE resolves to a full commit SHA and is stored in the baseline artifact
- [ ] T007 Verify: The isolated worktree exists off BASE with its own git index and isolated DB/socket dirs — `git -C <wt> rev-parse --git-dir` differs from the main tree; DB/socket env vars point inside the worktree
- [ ] T008 Verify: A fresh deterministic install + build succeeds in the worktree without symlinks — `realpath` on resolved deps and dist stays inside the worktree; a clean install completes
- [ ] T009 Verify: The naming census counts only in-scope snake_case names at BASE — The census excludes .py, vendored, generated, and tool-mandated names
- [ ] T010 Verify: The baseline records test-discovery counts, strict-validate output, and Lane C scenario IDs+scores — Each is captured to a file keyed by BASE
- [ ] T011 Verify: A casefold/NFC collision report is produced for the census set — The report lists 0 unresolved collisions or enumerates them
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
