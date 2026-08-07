---
title: "Tasks: Lib Runtime Migration"
description: "Task breakdown for moving 13 deep-loop + coverage-graph lib .ts files into the deep-loop-runtime peer skill via git mv with internal import patching."
trigger_phrases:
  - "118/002 tasks"
  - "git mv deep-loop"
  - "git mv coverage-graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/003-lib-runtime-migration"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 30-task breakdown across three phases."
    next_safe_action: "Confirm phase 001 PASS, then start T001."
    blockers: []
    completion_pct: 100
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:1180020020020020020020020020020020020020020020020020020020020002"
      session_id: "118-002-lib-runtime-migration-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Lib Runtime Migration

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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Estimated effort: 10-15 minutes.

- [ ] T001 Confirm phase 001 PASS in `../001-runtime-skill-scaffold/implementation-summary.md` (cite commit SHA in this phase's implementation-summary.md) [3m]
- [ ] T002 Verify `.opencode/skills/deep-loop-runtime/lib/deep-loop/` exists (empty dir OK) [1m]
- [ ] T003 Verify `.opencode/skills/deep-loop-runtime/lib/coverage-graph/` exists (empty dir OK) [1m]
- [ ] T004 Verify clean tree on the 13 source paths under `.opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/` (`git status` shows nothing modified there) [2m]
- [ ] T005 [P] Capture pre-move import graph snapshot: run `grep -rn '^import\|^export.*from' .opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/*.ts` and stash output in this phase's implementation-summary.md or a scratch note [5m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Estimated effort: 30-45 minutes.

### deep-loop git-mv steps (10 files)

- [ ] T006 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` [1m]
- [ ] T007 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` [1m]
- [ ] T008 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` [1m]
- [ ] T009 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` [1m]
- [ ] T010 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/atomic-state.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` [1m]
- [ ] T011 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` [1m]
- [ ] T012 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` [1m]
- [ ] T013 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/permissions-gate.ts` [1m]
- [ ] T014 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` [1m]
- [ ] T015 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` [1m]

### coverage-graph git-mv steps (3 files)

- [ ] T016 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` (DB schema + connection — lifecycle ownership transfers per user directive) [1m]
- [ ] T017 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` [1m]
- [ ] T018 `git mv .opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` [1m]

### Internal cross-import patching

- [ ] T019 Patch any intra-`deep-loop/` relative imports broken by the move (most should remain valid because all 10 files moved together) [5m]
- [ ] T020 Patch any intra-`coverage-graph/` relative imports broken by the move (most should remain valid because all 3 files moved together) [3m]
- [ ] T021 Patch any cross-folder imports between `deep-loop/` and `coverage-graph/` so they resolve under the new `deep-loop-runtime/lib/` root [5m]
- [ ] T022 Stage and commit the move + import-patch (conventional commit message under `feat(skilled-agent-orchestration/118/002):`) [3m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Estimated effort: 15-20 minutes.

### Compile + Static Checks

- [ ] T023 Run `tsc --noEmit` against the moved files from the runtime skill root; confirm zero errors on those files (record stdout snippet as evidence in implementation-summary.md) [5m]
- [ ] T024 Run orphaned-import grep: `grep -r "system-spec-kit/mcp_server/lib/deep-loop\|system-spec-kit/mcp_server/lib/coverage-graph" .opencode/skills/deep-loop-runtime/lib/` returns zero matches [2m]
- [ ] T025 Run `git log --follow` on at least 3 moved files (one from each folder + `coverage-graph-db.ts`); confirm pre-move history visible [3m]

### Source Tree Cleanup Verification

- [ ] T026 Confirm `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` has no `.ts` files remaining [1m]
- [ ] T027 Confirm `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` has no `.ts` files remaining [1m]

### Documentation + Validation

- [ ] T028 Document expected downstream MCP-handler compile breakage in implementation-summary.md (cite affected handler paths) [3m]
- [ ] T029 Update checklist.md items with evidence [2m]
- [ ] T030 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/003-lib-runtime-migration --strict` and confirm 0 errors + 0 warnings [2m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] tsc clean for moved files
- [ ] No orphaned imports inside moved tree
- [ ] checklist.md fully verified with evidence
- [ ] strict validate.sh exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Phase Spec**: See `../spec.md`
- **Predecessor Phase**: See `../001-runtime-skill-scaffold/`
- **Successor Phase**: See `../003-script-shim-and-db-relocation/`
<!-- /ANCHOR:cross-refs -->
</content>
</invoke>