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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/033-identity-resolver-merge-safety"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented the resolver, both call-site swaps, and the flagged merge guard with passing vitest"
    next_safe_action: "Build the grandfather report listing then graduate the flag behind a scoped migration"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/identity-resolver-merge-safety.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 90
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

- [x] T001 Confirm the canonical specs-root anchor the resolver must use and that both generators can import a shared helper without a module cycle. The shared helper lives in the existing `lib/config/spec-doc-paths.ts`, already imported by the parser, so no new module or cycle is introduced (`.opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`)
- [x] T002 Inventory every call site of `resolveParentId`, `resolveChildrenIds`, and the line 809 `path.relative` identity the resolver consolidates. Build identity consolidated through `resolveBuildIdentity`, and the second per-folder `description.json` writer at `generatePerFolderDescription` was found to compute the same caller-base path and was routed too (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [x] T003 [P] Choose the default-OFF flag name and its read site. Flag `SPECKIT_IDENTITY_MERGE_SAFETY` reads env-only in `capability-flags.ts::isIdentityMergeSafetyEnabled`, strictly default-OFF with no rollout-policy fallback (`.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`)
- [x] T004 [P] Confirm the merge guard can run before the volatile-ignoring compare so a no-op re-derive still skips its write. The guard runs inside `mergeGraphMetadata`, which `refreshGraphMetadataForSpecFolder` calls before `graphMetadataEqualIgnoringVolatile`, and the rerun assertion proves the union is stable (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create `resolveSpecFolderIdentity(absFolder)` returning specs-root-relative `specFolder`, `parentId`, and `childrenIds`, with a typed `SpecFolderIdentityError` for an outside-root path. Lives in the existing shared module rather than a new `lib/graph/spec-doc-paths.ts` (`.opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`)
- [x] T006 Route the build through the shared resolver via `resolveBuildIdentity`, consolidating the split `resolveParentId` and `resolveChildrenIds`, behind the flag with a legacy fallback when the flag is off (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [x] T007 Route both the aggregate-cache `specFolder` and the per-folder `description.json` writer through the shared resolver so the `specFolder` is specs-root-relative rather than the caller-base path (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T008 Add the merge guard reconciling `parent_id` as `refreshed ?? existing ?? null` and unioning `children_ids`, behind the default-OFF flag, with a review flag on a preserved non-null parent and prune-only removal (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T009 Add the grandfather report mode that lists would-change folders without writing. DEFERRED: outside this implementation pass, which was scoped to the resolver and the merge guard only. The default-OFF flag that makes the rollout safe IS shipped, the report listing that enumerates would-change folders is the follow-up (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove the resolver returns the specs-root-relative shape and rejects an outside-root path, and both generators emit the matching `specFolder`. Covered by the resolver and shared-identity suites, 11/11 passing (`.opencode/skills/system-spec-kit/mcp_server/tests/identity-resolver-merge-safety.vitest.ts`)
- [x] T011 Prove a null-deriving re-derive preserves an existing non-null `parent_id` with a review flag, a differing non-null refreshed parent stays authoritative, a scoped scan missing a child leaves the union intact with prune-only removal, and the flag OFF passes through unchanged. Covered by the merge-safety suite, 11/11 passing (`.opencode/skills/system-spec-kit/mcp_server/tests/identity-resolver-merge-safety.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All in-scope tasks marked `[x]` (T009 grandfather report listing deferred to the follow-up pass)
- [x] No `[B]` blocked tasks remaining
- [x] Automated verification passed: 11/11 new vitest, 48/48 graph-metadata regression, 337/337 folder-discovery and description regression
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
