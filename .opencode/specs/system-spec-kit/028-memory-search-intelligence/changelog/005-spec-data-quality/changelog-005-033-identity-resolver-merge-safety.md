---
title: "Changelog: Identity Resolver Merge Safety [005-spec-data-quality/033-identity-resolver-merge-safety]"
description: "Chronological changelog for the identity resolver merge safety phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/033-identity-resolver-merge-safety` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Shipped a shared `resolveSpecFolderIdentity` helper consumed by both the graph build and the description writers so a single specs-root-relative identity drives both files. Made `mergeGraphMetadata` keep a non-null `parent_id` and union `children_ids` on merge so a scoped or racing scan never erases lineage. Every behavioral change sits behind the default-OFF `SPECKIT_IDENTITY_MERGE_SAFETY` flag, so the flag-OFF path is byte-identical to prior behavior. Verified by 11 new vitest cases plus the graph and description regression suites. The flag later GRADUATED to default-ON after the scoped migration.

### Added

- `resolveSpecFolderIdentity(absFolder)` and `SpecFolderIdentityError` in `lib/config/spec-doc-paths.ts`, returning a specs-root-relative `specFolder`, a `parentId`, and a `childrenIds` array from one canonical specs-root anchor, rejecting an outside-root path rather than fabricating a `..`-prefixed path.
- The default-OFF `SPECKIT_IDENTITY_MERGE_SAFETY` flag and its `isIdentityMergeSafetyEnabled` reader, read env-only with no rollout-policy fallback.
- The optional top-level `parent_id_review_required` field carrying the preservation review flag.
- `tests/identity-resolver-merge-safety.vitest.ts` covering the resolver path shape, the merge invariants, and the adversarial outside-root, no-op, flag-OFF, and prune-only cases.

### Changed

- Both generators resolve identity through the shared helper when the flag is on, the graph build via `resolveBuildIdentity` and the description writers via `resolveSpecFolderForDescription`, so `description.json` `specFolder` and the graph `spec_folder` carry the identical string.
- `mergeGraphMetadata` reconciles lineage when the flag is on, resolving `parent_id` as `refreshed ?? existing ?? null`, defaulting `children_ids` to a stable union of existing and refreshed, and setting `parent_id_review_required` when a non-null parent is kept over a null recomputation. Relationship removal is reserved for an explicit `prune` option. The guard runs before the volatile-ignoring idempotency compare so an unchanged folder still skips its write.
- `folder-discovery.ts` emits the specs-root-relative `specFolder` from the resolver at both the aggregate-cache and per-folder writers.

### Fixed

- No fixes recorded.

### Verification

- The resolver returns the specs-root-relative shape and rejects an outside-root path - PASS, `tests/identity-resolver-merge-safety.vitest.ts` 11/11.
- A null-deriving re-derive preserves an existing non-null `parent_id` with a review flag, and a differing non-null refreshed parent stays authoritative - PASS, vitest merge-invariant cases.
- A scoped scan missing a child leaves the union intact and only prune mode removes a child - PASS, vitest.
- Flag-OFF merge behaves as before - PASS, graph-metadata regression suites 48/48, folder-discovery and description suites 337/337.
- Dist rebuilt - PASS, `npm run build` (tsc).

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`: added the shared resolver and `SpecFolderIdentityError`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`: added the default-OFF flag and its reader.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`: added the optional `parent_id_review_required` field.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`: build via `resolveBuildIdentity` and the flagged merge guard.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`: emit the specs-root-relative `specFolder` at both writers.
- `.opencode/skills/system-spec-kit/mcp_server/tests/identity-resolver-merge-safety.vitest.ts`: resolver and merge-invariant coverage.

### Follow-Ups

- `SPECKIT_IDENTITY_MERGE_SAFETY` GRADUATED to default-ON after the scoped migration restamped the legacy prefixed-path folders.
- The grandfather report listing that enumerates would-change folders before enforcement was the deferred follow-up that preceded graduation.
