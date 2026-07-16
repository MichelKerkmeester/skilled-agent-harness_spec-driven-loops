---
title: "Tasks: Full-Repo Generated-JSON Migration [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "full repo json migration"
  - "stage 3 generated json migration"
  - "scoped per folder generator loop"
  - "byte stable second run gate"
  - "regenerate description and graph metadata repo wide"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/039-full-repo-json-migration"
    last_updated_at: "2026-07-04T17:11:58.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the task list at PLANNED, all tasks pending"
    next_safe_action: "Confirm J1 to J4, then start the enumerator task"
    blockers:
      - "HARD-GATED on phases 033 through 036 being done and tested"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-039-full-repo-json-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Full-Repo Generated-JSON Migration

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

- [x] T001 Confirm phases 033 through 036 are done and tested and the J1 to J4 flags can be turned ON (verified the shipped dist exports the idempotent writes, the identity resolver and the integrity validator)
- [x] T002 Confirm the scoped `--spec-folder` generator path accepts a single folder and the enumerator reaches `z_archive` and `z_future` (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
- [x] T003 [P] Decide the commit batching, by track with the archive trees as their own batch (recorded in the implementation summary, the live run and commits are orchestrator-owned)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the folder enumerator over the whole `.opencode/specs` tree including the archive trees (`.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts`)
- [x] T005 Build the scoped regeneration loop that calls the per-folder generator once per folder with the J1 to J4 flags ON, never the whole-tree walk (`.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts`)
- [x] T006 Preserve `parent_id` and `children_ids` through regeneration and write the enum-clean status and prefixed paths, the identity-merge-safety flag is set on so the scoped path resolves specs-root-relative identity and preserves parent links (`.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts`)
- [x] T007 Wire the phase 036 generated-metadata validator as the zero-violation conformance gate over the regenerated tree, exposed as the `--verify` companion (`.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts`)
- [x] T008 Add the per-folder coverage summary counting enumerated, migrated, skipped-noop, failed and excluded folders (`.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts`)
- [x] T009 Author the vitest covering full coverage including archives, the scoped-path-only call pattern, a no-diff second run and a zero-violation validator pass (`.opencode/skills/system-spec-kit/scripts/tests/migrate-generated-json.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T010 Run the live full-repo migration, then the validator and `validate.sh`, and confirm zero enum, path and parent-link violations (orchestrator-owned high-blast run, proven on a dry-run sample so far)
- [B] T011 Re-run the migration and confirm an empty diff, then land scoped commits batched by track with the archives as their own batch (orchestrator-owned)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
</content>
