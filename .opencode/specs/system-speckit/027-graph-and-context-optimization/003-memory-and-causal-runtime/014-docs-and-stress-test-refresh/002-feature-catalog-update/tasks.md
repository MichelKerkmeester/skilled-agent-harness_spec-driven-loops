---
title: "Tasks: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "feature catalog update tasks"
  - "catalog v2 front proxy error codes tasks"
  - "register feature files tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored and registered six feature-catalog deltas; packet validated"
    next_safe_action: "None binding; sibling 003-readme-cluster-update can link these files"
    blockers: []
    key_files:
      - "feature_catalog/feature_catalog.md"
      - "feature_catalog/lifecycle/checkpoint-creation-checkpointcreate.md"
      - "feature_catalog/pipeline-architecture/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "feature-catalog-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes

<!-- SPECKIT_LEVEL: 3 -->
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

**Phase 1 - Expand checkpoint files with the v2 path** (no new files; expand-in-place).

- [x] T001 Expand the v2 `VACUUM INTO` create path, v29 columns, manifest, `active_vec` shard-attach (lifecycle/checkpoint-creation-checkpointcreate.md)
- [x] T002 Document the `.needs-rebuild` sentinel and `MAX_CHECKPOINTS` dir-aware pruning in the create file (lifecycle/checkpoint-creation-checkpointcreate.md)
- [x] T003 Expand the v2 file-swap restore, `reopenActiveDatabase`, two-phase restore journal (`swap-pending`/`swap-done`) (lifecycle/checkpoint-restore-checkpointrestore.md)
- [x] T004 Document boot crash-recovery and the `.needs-rebuild` sentinel in the restore file (lifecycle/checkpoint-restore-checkpointrestore.md)
- [x] T005 Sync the matching Description/How-It-Works blocks in section 6 Lifecycle (feature_catalog/feature_catalog.md)
- [x] T006 Gate: every checkpoint claim traces to a read source anchor in checkpoints.ts / vector-index-schema.ts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase 2 - New front-proxy, schema-history, and error-code files** (create + register).

- [x] T007 Author the front-proxy file: reconnecting session proxy, in-place daemon recycle, `SPECKIT_BACKEND_ONLY`, `-32002` fail-closed (pipeline-architecture/mcp-launcher-front-proxy.md)
- [x] T008 Author the schema-version-history file: v28 → v29 → v30 timeline and what each migration added (bug-fixes-and-data-integrity/schema-version-history-v28-v30.md)
- [x] T009 Author the unified error-code reference: `E429`, `-32001` (retryable recycle — STILL LIVE), `-32002` (protocol fail-closed) (bug-fixes-and-data-integrity/error-code-reference.md)
- [x] T010 Register the three new files in the index (feature_catalog/feature_catalog.md)
- [x] T011 Gate: `-32001` documented as still-live; 36-tool count preserved; claims trace to launcher / schema / errors anchors
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase 3 - Enrichment discoverability, sk-git, registration, and validation**.

- [x] T012 Author the enrichment-marker file with the `post_insert_enrichment` trigger phrase and the four marker columns (memory-quality-and-indexing/post-insert-enrichment-marker.md)
- [x] T013 Author the sk-git worktree-convention file: `wt/{NNNN}-{name}` branches, `.worktrees/{NNNN}-{name}` dirs, cross-reference to the sk-git skill (tooling-and-scripts/sk-git-worktree-convention.md)
- [x] T014 Register both new files in the index (feature_catalog/feature_catalog.md)
- [x] T015 Run `validate.sh --strict` on this packet to Errors: 0
- [x] T016 Gate: every new file registered; accuracy pass complete; packet validates clean
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every behavioral claim traces to a read source anchor
- [x] `-32001` documented as still-live; 36-tool count preserved
- [x] `validate.sh --strict` on this packet passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
