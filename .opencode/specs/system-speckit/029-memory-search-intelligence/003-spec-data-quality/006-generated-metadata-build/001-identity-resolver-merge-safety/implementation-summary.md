---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status IMPLEMENTED. Added a shared resolveSpecFolderIdentity helper consumed by both generators and made mergeGraphMetadata preserve a non-null parent_id and treat children_ids as append-only behind the default-OFF SPECKIT_IDENTITY_MERGE_SAFETY flag. The grandfather report listing is deferred to a follow-up pass. Verified by 11 new vitest plus 385 regression assertions, dist rebuilt."
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
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/001-identity-resolver-merge-safety"
    last_updated_at: "2026-07-06T18:49:38.029Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented and verified the resolver, both call-site swaps, and the flagged merge guard"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-identity-resolver-merge-safety |
| **Completed** | 2026-06-22, status IMPLEMENTED (grandfather report listing deferred) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status IMPLEMENTED. The shared resolver, both generator call-site swaps, and the flagged merge guard have landed and are verified. Every behavioral change is gated by the default-OFF `SPECKIT_IDENTITY_MERGE_SAFETY` flag, so the flag-OFF path is byte-identical to the shipped behavior. The grandfather report listing is the one scoped-out item, see Known Limitations.

### Shared spec-folder identity resolver

`resolveSpecFolderIdentity(absFolder)` returns a specs-root-relative `specFolder`, a `parentId`, and a `childrenIds` array from a single canonical specs-root anchor (`.opencode/specs`, falling back to a bare `specs` segment for legacy roots). It rejects an absolute path outside every supported specs root with a typed `SpecFolderIdentityError` rather than fabricating a `..`-prefixed path. Both generators now resolve identity through it when the flag is on: the graph build through `resolveBuildIdentity`, and the description writers through `resolveSpecFolderForDescription`, so the `description.json` `specFolder` and the graph `spec_folder` carry the identical string. The helper consolidates the previously split `resolveParentId` and `resolveChildrenIds` computations. It lives in the existing shared `lib/config/spec-doc-paths.ts` rather than a new `lib/graph/spec-doc-paths.ts`, because that module already exists and is already imported by the parser, which avoids a duplicate module and any import cycle.

### Merge-path lineage guard

`mergeGraphMetadata` now reconciles top-level lineage when the flag is on and an existing record is present. `parent_id` resolves as `refreshed ?? existing ?? null` so a null-deriving re-derive keeps a valid non-null parent, `children_ids` default to a stable union of existing and refreshed so a scoped or racing scan never deletes a child, a `parent_id_review_required` flag is set when a non-null parent is kept over a null recomputation, and relationship removal is reserved for an explicit `prune` option. A differing non-null refreshed parent stays authoritative without the review flag. The guard runs inside the merge, which executes before the volatile-ignoring idempotency compare, so an unchanged folder still compares equal and skips its write. With the flag off the merge is the previous spread, byte-identical.

### Default-OFF flag

The behavioral change ships behind `SPECKIT_IDENTITY_MERGE_SAFETY`, read env-only with no rollout-policy fallback so an un-set environment can never flip it on. With the flag off both generators keep their legacy identity and the merge spreads as before. The grandfather report listing that enumerates would-change folders before enforcement is deferred to the follow-up pass.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Modify | Added shared `resolveSpecFolderIdentity(absFolder)` and `SpecFolderIdentityError` returning specs-root-relative `specFolder`, `parentId`, `childrenIds` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Added the default-OFF `SPECKIT_IDENTITY_MERGE_SAFETY` flag and its `isIdentityMergeSafetyEnabled` reader |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modify | Added the optional `parent_id_review_required` field carrying the preservation review flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Build via `resolveBuildIdentity` and the flagged merge guard preserving `parent_id` and unioning `children_ids` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Emit the specs-root-relative `specFolder` from the resolver at both the aggregate-cache and per-folder writers |
| `.opencode/skills/system-spec-kit/mcp_server/tests/identity-resolver-merge-safety.vitest.ts` | Create | Resolver path-shape and merge-invariant coverage with adversarial outside-root, no-op, flag-OFF, and prune-only cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in the planned sequence. The shared resolver landed first, then the two generator call sites were swapped onto it behind the flag so the path shape converges, then the merge guard with the review flag and the prune-only removal, all gated by the default-OFF flag. The resolver path-shape proof, the outside-root rejection proof, the null-parent preservation proof, the append-only child proof, and the flag-OFF passthrough proof all land in the vitest, 11/11 passing. The graph-metadata parser regression suites (48/48) and the folder-discovery and description regression suites (337/337) confirm no flag-OFF regression. The dist was rebuilt with `npm run build` (tsc). The grandfather report listing over the live tree is the deferred follow-up.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared `resolveSpecFolderIdentity` consumed by both generators | The path-shape drift comes from two divergent identity computations, so a single canonical source removes it and gives the merge one parent and children source |
| Store the specs-root-relative shape in both files | The graph already uses it and joins between the description and the graph break when the two shapes differ |
| Reconcile `parent_id` as `refreshed ?? existing ?? null` | A null-deriving re-derive must not erase a valid non-null parent, while a genuine re-parent with a non-null refreshed value stays authoritative |
| Default `children_ids` to a stable union | A scoped or racing scan that sees fewer children must not delete relationships, so addition is safe and removal is explicit |
| Reserve removal for an explicit prune or repair mode | Relationship deletion must never be a side effect of a normal scoped scan |
| Ship behind a default-OFF flag with a grandfather report | Existing files carry the prefixed paths and prose statuses the new contract rejects, so the change must be observable before it is enforced |
| Run the guard before the idempotency compare | An unchanged folder must still compare equal and skip its write, keeping graph metadata idempotent |
| Put the resolver in the existing `lib/config/spec-doc-paths.ts`, not a new `lib/graph/spec-doc-paths.ts` | The shared module already exists in config and is already imported by the parser, so reusing it avoids a duplicate module and any import cycle. Deviation from the spec Files-to-Change table, which assumed a create |
| Route the per-folder `description.json` writer too, not only the line-809 aggregate-cache path | `generatePerFolderDescription` computes the same caller-base `specFolder` independently, so routing only line 809 would leave the real `description.json` file on the old shape. Both writers go through one flag-gated helper |
| Carry the review flag as an optional top-level `parent_id_review_required` boolean | Optional keeps a clean record and the flag-OFF merge byte-identical, and the field survives the idempotency compare stably across reruns |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Test command: `npx vitest run tests/identity-resolver-merge-safety.vitest.ts --config vitest.config.ts` from `mcp_server`, 11/11 passing. Regression: `npx vitest run tests/graph/graph-metadata-lineage.vitest.ts tests/graph-metadata-schema.vitest.ts tests/graph-metadata-integration.vitest.ts tests/path-boundary.vitest.ts tests/p0-c-graph-metadata-laundering.vitest.ts` 48/48, plus the folder-discovery and description suites 337/337. Dist rebuilt with `npm run build`.

| Check | Result |
|-------|--------|
| The resolver returns the specs-root-relative shape and rejects an outside-root path | PASS |
| `description.json` `specFolder` and `graph-metadata.json` `spec_folder` match for one folder | PASS |
| A null-deriving re-derive preserves an existing non-null `parent_id` with a review flag | PASS |
| A differing non-null refreshed parent stays authoritative without the review flag | PASS |
| A scoped scan missing a child leaves the union intact and only prune mode removes a child | PASS |
| With the flag OFF the merge behaves as today (regression suites green) | PASS |
| The union order is stable across a rerun under the flag ON | PASS |
| The grandfather report lists would-change folders without writing | DEFERRED, follow-up pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Grandfather report listing deferred.** This pass shipped the resolver and the merge guard behind the default-OFF flag, which is the safety mechanism that keeps the rollout observable. The report mode that enumerates would-change folders before enforcement is the scoped follow-up, so the flag must stay OFF until that listing exists and a scoped migration confirms the change set is safe.
2. **Path-shape migration deferred.** The new specs-root-relative `specFolder` changes the stored value for existing folders that carried a caller-base path, so the migration of those files is a scoped follow-up gated behind the grandfather report, not part of this phase. This is why the behavior is opt-in and OFF by default.
3. **Silent re-parent edge.** The preservation rule keeps a non-null parent over a null recomputation, so a genuinely re-parented folder relies on the `parent_id_review_required` flag to be surfaced rather than silently kept.
4. **Union growth.** The append-only union can accumulate stale children until an explicit prune run, which is the sanctioned path to shrink the set.
5. **Changes left uncommitted.** All edits are unstaged in the working tree for the orchestrator to review, so no fix SHA exists yet.
<!-- /ANCHOR:limitations -->

---
