---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will add a shared resolveSpecFolderIdentity helper consumed by both generators and make mergeGraphMetadata preserve a non-null parent_id and treat children_ids as append-only behind a default-OFF flag with a grandfather report mode. No code change has landed."
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
    recent_action: "Scaffolded PLANNED docs for resolver and merge guard"
    next_safe_action: "Hold for implementation, no code change has landed yet"
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
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Shared spec-folder identity resolver

The phase will add one `resolveSpecFolderIdentity(absFolder)` that returns a specs-root-relative `specFolder`, a `parentId`, and a `childrenIds` array from a single canonical specs-root anchor. Today the `description.json` generator computes a caller-base-relative path at `folder-discovery.ts:809` while the graph build stores a specs-root-relative path, so the same folder carries two shapes and joins between description discovery and the graph break. Routing both generators through the shared resolver makes the `description.json` `specFolder` and the graph `spec_folder` carry the identical string, and gives the merge path one source for the recomputed parent and children. The resolver rejects an absolute path outside every supported specs root with a typed contract error rather than fabricating a `..`-prefixed path.

### Merge-path lineage guard

The phase will add a guard inside `mergeGraphMetadata`. Today the merge spreads the refreshed snapshot at `graph-metadata-parser.ts:1149-1161`, so top-level `parent_id` and `children_ids` come verbatim from the recomputation, and the build derives `parent_id: resolveParentId(specFolder)` at `:1129` which returns null when the parent cannot be resolved. A null-deriving re-derive therefore erases a valid non-null parent, and a scoped or racing scan that sees fewer children replaces the stored set and deletes relationships. The guard reconciles `parent_id` as `refreshed ?? existing ?? null`, defaults `children_ids` to a stable union of existing and refreshed, sets a review flag when it preserves a non-null parent over a null recomputation, and reserves relationship removal for an explicit prune or repair mode. It runs before the volatile-ignoring idempotency compare so an unchanged folder still skips its write.

### Default-OFF flag and grandfather report

The merge behavioral change will ship behind a default-OFF flag with a grandfather report mode, because existing files carry the prefixed paths and prose statuses the new contract rejects and must not mass-fail on first rollout. With the flag OFF the merge behaves exactly as today, and the report mode lists every folder whose identity or lineage would change without writing it, so the change set is observable before it is enforced. The behavior graduates only after a scoped migration confirms the report list is safe.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/spec-doc-paths.ts` | Planned create | Shared `resolveSpecFolderIdentity(absFolder)` returning specs-root-relative `specFolder`, `parentId`, `childrenIds` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Build via the resolver and add the flagged merge guard preserving `parent_id` and unioning `children_ids` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Planned modify | Emit the specs-root-relative `specFolder` from the resolver rather than the line 809 caller-base path |
| `.opencode/skills/system-spec-kit/scripts/tests/identity-resolver-merge-safety.vitest.ts` | Planned create | Resolver path-shape and merge-invariant coverage with adversarial outside-root, no-op, and prune-only cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence creates the shared resolver first, then swaps the two generator call sites onto it so the path shape converges, then adds the merge guard behind the default-OFF flag with the review flag and the prune-only removal, then adds the grandfather report mode. The resolver path-shape proof, the outside-root rejection proof, the null-parent preservation proof, the append-only child proof, and the flag-OFF passthrough proof land with the vitest. The grandfather report runs over the live tree to confirm it lists the would-change folders without writing.
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
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned test command is `vitest run identity-resolver-merge-safety` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| The resolver returns the specs-root-relative shape and rejects an outside-root path | PLANNED, not yet run |
| `description.json` `specFolder` and `graph-metadata.json` `spec_folder` match for one folder | PLANNED, not yet run |
| A null-deriving re-derive preserves an existing non-null `parent_id` with a review flag | PLANNED, not yet run |
| A scoped scan missing a child leaves the union intact and only prune mode removes a child | PLANNED, not yet run |
| With the flag OFF the merge behaves as today and the report lists would-change folders without writing | PLANNED, not yet run |
| A no-op re-derive on an unchanged folder still skips its write under the flag ON | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Path-shape migration deferred.** The new specs-root-relative `specFolder` changes the stored value for existing folders that carried a caller-base path, so the migration of those files is a scoped follow-up gated behind the grandfather report, not part of this phase.
3. **Silent re-parent edge.** The preservation rule keeps a non-null parent over a null recomputation, so a genuinely re-parented folder relies on the review flag to be surfaced rather than silently kept.
4. **Union growth.** The append-only union can accumulate stale children until an explicit prune run, which is the sanctioned path to shrink the set.
<!-- /ANCHOR:limitations -->

---
