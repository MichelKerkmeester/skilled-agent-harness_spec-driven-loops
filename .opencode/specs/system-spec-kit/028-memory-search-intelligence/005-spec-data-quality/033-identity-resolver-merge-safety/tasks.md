---
title: "Tasks: Shared Identity Resolver and Merge Safety [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared spec folder identity resolver"
  - "merge graph metadata parent preservation"
  - "children ids append only"
  - "parent id reconciled merge"
  - "spec folder identity canonicalizer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/033-identity-resolver-merge-safety"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasked the resolver, the two call-site swaps, and the flagged merge guard"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/spec-doc-paths.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/identity-resolver-merge-safety.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Shared Identity Resolver and Merge Safety

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

- [ ] T001 Confirm the canonical specs-root anchor the resolver must use and that both generators can import a shared helper without a module cycle (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/spec-doc-paths.ts`)
- [ ] T002 Inventory every call site of `resolveParentId`, `resolveChildrenIds`, and the line 809 `path.relative` identity the resolver consolidates (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T003 [P] Choose the default-OFF flag name and its read site and confirm the report mode can run without writing
- [ ] T004 [P] Confirm the merge guard can run before the volatile-ignoring compare so a no-op re-derive still skips its write (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create `resolveSpecFolderIdentity(absFolder)` returning specs-root-relative `specFolder`, `parentId`, and `childrenIds`, with a typed contract error for an outside-root path (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/spec-doc-paths.ts`)
- [ ] T006 Route the build through the shared resolver, consolidating the split `resolveParentId` and `resolveChildrenIds` at lines 1129-1130 (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T007 Route the `description.json` generator through the shared resolver so the `specFolder` is specs-root-relative rather than the line 809 caller-base path (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T008 Add the merge guard reconciling `parent_id` as `refreshed ?? existing ?? null` and unioning `children_ids`, behind the default-OFF flag, with a review flag on a preserved non-null parent and prune-only removal (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T009 Add the grandfather report mode that lists would-change folders without writing (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Prove the resolver returns the specs-root-relative shape and rejects an outside-root path, and both generators emit the matching `specFolder` (`.opencode/skills/system-spec-kit/scripts/tests/identity-resolver-merge-safety.vitest.ts`)
- [ ] T011 Prove a null-deriving re-derive preserves an existing non-null `parent_id` with a review flag, a differing non-null refreshed parent stays authoritative, a scoped scan missing a child leaves the union intact with prune-only removal, and the flag OFF passes through unchanged (`.opencode/skills/system-spec-kit/scripts/tests/identity-resolver-merge-safety.vitest.ts`)
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
