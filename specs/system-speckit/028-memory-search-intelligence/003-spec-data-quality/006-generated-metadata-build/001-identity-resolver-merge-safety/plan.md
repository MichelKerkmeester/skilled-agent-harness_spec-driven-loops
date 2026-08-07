---
title: "Implementation Plan: Shared Identity Resolver and Merge Safety [template:level_2/plan.md]"
description: "Introduce a shared resolveSpecFolderIdentity helper returning a specs-root-relative specFolder, parentId, and childrenIds consumed by both generators, and make mergeGraphMetadata preserve a non-null existing parent_id and treat children_ids as append-only, all behind a default-OFF flag with a grandfather report mode so existing files do not mass-fail."
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/001-identity-resolver-merge-safety"
    last_updated_at: "2026-07-04T17:11:53.814Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the resolver, the two call-site swaps, and the flagged merge guard"
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
# Implementation Plan: Shared Identity Resolver and Merge Safety

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server lib plus a vitest scratch suite |
| **Framework** | spec-kit graph metadata parser and folder discovery |
| **Storage** | The generated `description.json` and `graph-metadata.json` files, no DB change |
| **Testing** | A vitest covering the resolver path shape and the merge preservation, append-only, and prune invariants |

### Overview
This phase fixes the two coupled identity and lineage findings from research 031 section 4. It adds one shared `resolveSpecFolderIdentity(absFolder)` that returns a specs-root-relative `specFolder`, `parentId`, and `childrenIds` from a single canonical anchor, then routes both the `description.json` generator in `folder-discovery.ts` and the `graph-metadata.json` build in `graph-metadata-parser.ts` through it, which removes the path-shape drift between the caller-base-relative discovery path at `folder-discovery.ts:809` and the specs-root-relative graph form. It then adds a guard inside `mergeGraphMetadata` that reconciles `parent_id` as `refreshed ?? existing ?? null` and defaults `children_ids` to a stable union of existing and refreshed, so the spread at `graph-metadata-parser.ts:1149-1161` can no longer let a null-deriving or scoped re-derive erase lineage. Every behavioral change ships behind a default-OFF flag with a grandfather report mode, because existing files carry the prefixed paths and prose statuses the new contract rejects and must stay observable before they are enforced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single shared resolver consumed by two generators, plus a guard inside the existing merge. One new helper module owns the canonical identity computation, the two generators call it instead of recomputing identity their own way, and the merge gains a reconciliation and union step before the schema parse. No new lens, no ranking change, and no edit to the volatile-ignoring idempotency compare.

### Key Components
- **`spec-doc-paths.ts`**: the new home for `resolveSpecFolderIdentity(absFolder)`, returning a specs-root-relative `specFolder`, a `parentId`, and a `childrenIds` array from one canonical specs-root anchor, with a typed contract error for an outside-root path.
- **`graph-metadata-parser.ts` build**: derives identity through the shared resolver rather than the split `resolveParentId` and `resolveChildrenIds`, so the graph `spec_folder` and the description `specFolder` agree.
- **`graph-metadata-parser.ts` merge**: `mergeGraphMetadata` gains a guard that reconciles `parent_id` as `refreshed ?? existing ?? null` with a review flag on a preserved non-null parent, and defaults `children_ids` to a stable union, all behind the default-OFF flag.
- **`folder-discovery.ts` generator**: emits the specs-root-relative `specFolder` from the shared resolver rather than the caller-base-relative `path.relative(basePath, folderPath)` at line 809.
- **`identity-resolver-merge-safety.vitest.ts`**: the scratch suite proving the resolver path shape and the merge invariants, including the adversarial outside-root, no-op, prune-only, and silent-re-parent cases.

### Data Flow
The build calls `resolveSpecFolderIdentity(absFolder)` once, receives the specs-root-relative `specFolder`, `parentId`, and `childrenIds`, and constructs the refreshed snapshot from them. The description generator calls the same resolver and writes the same `specFolder` shape. On merge, the guard reads the existing persisted record and the refreshed snapshot, reconciles `parent_id` as `refreshed ?? existing ?? null`, unions `children_ids`, sets a review flag when it preserved a non-null parent over a null recomputation, and only then hands the payload to the schema parse and the volatile-ignoring idempotency compare. With the flag OFF the guard is bypassed and the report mode lists every folder whose identity or lineage would change without writing it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `folder-discovery.ts:809` `specFolder` | Computes `path.relative(basePath, folderPath)`, a caller-base-relative path written into `description.json` | replace with the specs-root-relative `specFolder` from the shared resolver | a test deriving `description.json` asserts the `specFolder` is specs-root-relative and matches the graph `spec_folder` for the same folder |
| `graph-metadata-parser.ts:1129-1130` build identity | Sets `parent_id: resolveParentId(specFolder)` and `children_ids: resolveChildrenIds(...)` from two split functions | build via `resolveSpecFolderIdentity` so the build identity comes from one canonical computation | the build snapshot carries the resolver `parentId` and `childrenIds`, and the two split functions are consolidated into the shared helper |
| `graph-metadata-parser.ts:1149-1161` `mergeGraphMetadata` | Spreads `...refreshed`, so top-level `parent_id` and `children_ids` come verbatim from the refreshed snapshot and a null-deriving or scoped re-derive erases lineage | add the guard reconciling `parent_id` as `refreshed ?? existing ?? null` and unioning `children_ids`, behind the default-OFF flag with a review flag on a preserved non-null parent | a merge with a null refreshed parent and a present existing parent keeps the existing value, and a refreshed snapshot missing a child retains the existing child |
| `spec-doc-paths.ts` resolver | Does not exist | create `resolveSpecFolderIdentity(absFolder)` returning specs-root-relative `specFolder`, `parentId`, `childrenIds`, with a typed contract error for an outside-root path | a unit test asserts the path shape, the parent and children, and the outside-root rejection |
| Default-OFF flag and grandfather report | No flag gates the merge behavior and there is no report mode | gate the merge behavioral change behind a default-OFF flag and add a report mode that lists would-change folders without writing | with the flag OFF the merge behaves as today, the report prints the changed-folder list and writes nothing |
| The volatile-ignoring idempotency compare | Skips a no-op write so graph metadata stays idempotent | leave unchanged, run the guard before the compare so an unchanged folder still compares equal | a no-op re-derive on an unchanged folder still skips its write under the flag ON |

Required inventories:
- Same-class producers: `rg -n 'resolveParentId|resolveChildrenIds|path.relative\(.*folderPath\)|spec_folder|specFolder' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'mergeGraphMetadata|resolveSpecFolderIdentity|buildGraphMetadata' .opencode/skills/system-spec-kit`.
- Matrix axes: resolver path shape, resolver outside-root error, null refreshed parent over present existing parent, differing non-null refreshed parent, refreshed missing a child, no-op re-derive under flag ON, prune mode removal, flag OFF passthrough.
- Algorithm invariant: identity is specs-root-relative and shared, the merge reconciles `parent_id` as `refreshed ?? existing ?? null` and unions `children_ids`, removal is prune-only, a preserved non-null parent carries a review flag, and the change is gated by the default-OFF flag with a grandfather report.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the canonical specs-root anchor the resolver must use, and that both generators can import a shared helper without a module cycle
- [ ] Inventory every call site of `resolveParentId`, `resolveChildrenIds`, and the `folder-discovery.ts:809` `path.relative` identity that the resolver consolidates
- [ ] Choose the default-OFF flag name and its read site, and confirm the report mode can run without writing
- [ ] Confirm the merge guard can run before the volatile-ignoring compare so a no-op re-derive still skips its write

### Phase 2: Core Implementation
- [ ] Create `spec-doc-paths.ts` with `resolveSpecFolderIdentity(absFolder)` returning specs-root-relative `specFolder`, `parentId`, `childrenIds`, with a typed contract error for an outside-root path
- [ ] Route the `graph-metadata-parser.ts` build through the shared resolver, consolidating the split `resolveParentId` and `resolveChildrenIds`
- [ ] Route the `folder-discovery.ts` generator through the shared resolver so the `description.json` `specFolder` is specs-root-relative
- [ ] Add the merge guard reconciling `parent_id` as `refreshed ?? existing ?? null` and unioning `children_ids`, behind the default-OFF flag, with a review flag on a preserved non-null parent and prune-only removal
- [ ] Add the grandfather report mode that lists would-change folders without writing

### Phase 3: Verification
- [ ] The resolver returns the specs-root-relative path shape and rejects an outside-root path
- [ ] `description.json` `specFolder` and `graph-metadata.json` `spec_folder` carry the identical specs-root-relative string for one folder
- [ ] A null-deriving re-derive preserves an existing non-null `parent_id` with a review flag, and a differing non-null refreshed parent stays authoritative
- [ ] A scoped scan missing a child leaves the union intact, and only prune mode removes a child
- [ ] With the flag OFF the merge behaves as today and the report lists the changed folders without writing
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveSpecFolderIdentity` returns the specs-root-relative `specFolder`, `parentId`, and `childrenIds`, rejects an outside-root path, and both generators emit the matching shape | `identity-resolver-merge-safety.vitest.ts` |
| Integration | `mergeGraphMetadata` reconciles `parent_id` as `refreshed ?? existing ?? null`, unions `children_ids`, sets the review flag on a preserved non-null parent, removes only under prune mode, and passes through unchanged with the flag OFF | `identity-resolver-merge-safety.vitest.ts` over crafted existing and refreshed payloads |
| Manual | Run the grandfather report mode over the live specs tree and confirm it lists the would-change folders without writing | report-mode dry run plus a working-tree diff check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `resolveParentId` and `resolveChildrenIds` in `graph-metadata-parser.ts` | Internal | Green | The resolver consolidates them, so the build identity changes once in the shared helper |
| The `graphMetadataEqualIgnoringVolatile` no-op skip | Internal | Green | The guard must run before the compare so an unchanged folder stays idempotent |
| A canonical specs-root anchor reachable from both generators | Internal | Green | Without one shared anchor the path shapes cannot converge |
| The default-OFF flag plumbing | Internal | Yellow | The behavioral change cannot graduate until the flag and the report mode prove the change set is safe |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new specs-root-relative `specFolder` churns existing `description.json` files, or the merge guard preserves a stale parent on a genuinely re-parented folder.
- **Procedure**: Leave the flag OFF so the merge behaves as today, and revert the resolver call-site swaps if the path-shape change proves unsafe before a scoped migration. The grandfather report carries no write, so disabling it has no data effect.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Grandfather report run over the live tree and the would-change folder list reviewed
- [ ] Outside-root rejection proven by a unit assertion
- [ ] No-op idempotency preserved under the flag ON

### Rollback Procedure
1. Set the merge behavioral flag OFF so the merge behaves as today
2. Revert the `folder-discovery.ts` and `graph-metadata-parser.ts` resolver call-site swaps if the path-shape change proves unsafe
3. Confirm the grandfather report carries no write, so disabling it has no data effect
4. Re-derive one folder and confirm the generators return to their shipped behavior

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds one helper, swaps two call sites, and guards the merge behind a default-OFF flag, with the path-shape migration deferred to a scoped follow-up
<!-- /ANCHOR:enhanced-rollback -->

---
