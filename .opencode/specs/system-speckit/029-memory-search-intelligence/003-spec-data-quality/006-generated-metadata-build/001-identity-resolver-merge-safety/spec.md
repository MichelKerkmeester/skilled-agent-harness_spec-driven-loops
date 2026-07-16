---
title: "Feature Specification: Shared Identity Resolver and Merge Safety [template:level_2/spec.md]"
description: "The spec-kit generators that produce description.json and graph-metadata.json drift on identity and lose lineage. description.json stores a caller-base-relative specFolder while graph metadata strips to a specs-root-relative path, and mergeGraphMetadata spreads the refreshed snapshot so top-level parent_id and children_ids come from the recomputation, meaning a null-deriving parent erases lineage and a scoped or racing scan deletes children."
trigger_phrases:
  - "shared spec folder identity resolver"
  - "merge graph metadata parent preservation"
  - "children ids append only"
  - "parent id reconciled merge"
  - "spec folder identity canonicalizer"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/001-identity-resolver-merge-safety"
    last_updated_at: "2026-07-04T17:11:53.814Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded identity-resolver and merge-safety spec from research recs 2 and 3"
    next_safe_action: "Run speckit plan to decompose the resolver and the merge guard"
    blockers: []
    key_files:
      - "../031-generated-metadata-quality-research/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the resolver lives in a shared spec-doc-paths module or beside the parser"
    answered_questions:
      - "Whether the merge prefers refreshed or existing parent_id, it reconciles as refreshed then existing then null"
---
# Feature Specification: Shared Identity Resolver and Merge Safety

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | IMPLEMENTED (grandfather report listing deferred) |
| **Created** | 2026-06-22 |
| **Branch** | `033-identity-resolver-merge-safety` |
| **Parent Spec** | ../spec.md |
| **Successor** | ../002-scoped-backfill-boundary/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two generators that emit `description.json` and `graph-metadata.json` disagree on spec-folder identity and the graph merge path loses lineage. Research 031 section 4 ranks both findings P0/M and confirms each against live code in its section 6.

Identity drift, rec #2. `description.json` stores a caller-base-relative path. The discovery builder computes `specFolder` as `path.relative(basePath, folderPath)` at `folder-discovery.ts:809`, so the value carried into `description.json` is whatever the caller passed as the base. Graph metadata instead stores a specs-root-relative path in `spec_folder` and `packet_id`, the form `system-speckit/029-memory-search-intelligence/002-spec-data-quality/NNN-slug`. The two files therefore carry two different shapes for the same folder, which breaks joins between description discovery and the graph and reintroduces path-shape churn whenever the caller base changes. No single helper returns the canonical specs-root-relative `specFolder`, `parentId`, and `childrenIds` from an absolute path, so each generator recomputes identity its own way and `mergeGraphMetadata` has no safe parent-preservation rule to lean on.

Lineage loss, rec #3. `mergeGraphMetadata` spreads the refreshed snapshot at `graph-metadata-parser.ts:1149-1161`, so top-level `parent_id` and `children_ids` are taken verbatim from the recomputation and are never reconciled against the persisted file. The build path derives `parent_id: resolveParentId(specFolder)` at `:1129`, which returns null when the parent cannot be resolved, and `children_ids: resolveChildrenIds(...)` at `:1130`, which reflects only what the current scan saw. The result is two failure modes. A re-derive whose `resolveParentId` returns null erases a previously valid non-null parent, and a scoped or racing scan that sees fewer children replaces the stored `children_ids` and deletes relationships. The merge already preserves `manual`, `created_at`, `last_accessed_at`, and the chronology pointers, but it does not preserve top-level lineage, so the very fields that record the folder's place in the tree are the ones it discards.

The two findings are coupled. A shared identity resolver gives the merge a single source for the recomputed `parentId` and `childrenIds`, and the merge guard turns that source into a safe append-only and reconciled write rather than a destructive overwrite.

### Purpose
Introduce one shared `resolveSpecFolderIdentity(absFolder)` that returns a specs-root-relative `specFolder`, `parentId`, and `childrenIds`, consumed by both generators so the path shape stops drifting, and make `mergeGraphMetadata` preserve a non-null existing `parent_id` and treat `children_ids` as append-only, so a scoped or null-deriving re-derive can no longer erase lineage. Every behavioral change ships behind a default-OFF flag with a grandfather report mode, because existing files already carry the prefixed paths and prose statuses the new contract rejects and must not mass-fail on first rollout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shared `resolveSpecFolderIdentity(absFolder)` helper that returns a specs-root-relative `specFolder`, a `parentId`, and a `childrenIds` array derived from one canonical specs-root anchor, replacing the two divergent identity computations.
- Routing the `description.json` generator in `folder-discovery.ts` and the `graph-metadata.json` build in `graph-metadata-parser.ts` through that single resolver so both files carry the specs-root-relative path shape.
- A merge guard in `mergeGraphMetadata` that preserves an existing non-null `parent_id` when the recomputation returns null, reconciles `parent_id` as `refreshed ?? existing ?? null`, and defaults `children_ids` to a stable union of existing and refreshed entries.
- A default-OFF flag that gates the merge behavioral change, plus a grandfather report mode that lists the folders whose stored identity or lineage would change under the new contract without writing them, so the first rollout is observable before it is enforced.
- An explicit prune or repair mode as the only path that removes a relationship, so relationship deletion is never a side effect of a scoped scan.
- A review flag on the merged record when an existing non-null parent is preserved over a null recomputation, so a genuinely re-parented folder is still surfaced rather than silently kept.

### Out of Scope
- The scoped backfill boundary, rec #1, which is a separate phase that adds the `--spec-folder` target and the `--all` guard.
- The description and global-cache content-hash gating, rec #5, and the targeted global-cache upsert, rec #8, which are the idempotency phases.
- The status enum closure, rec #6, the legacy-status re-derive, rec #7, and the first-class generated-metadata validator, rec #9, which are the contract-enforcement phases.
- The drift gate, rec #10, the shared synopsis extractor, rec #11, and the authoritative z exclusion helper, rec #12.
- Any change to the volatile-ignoring idempotency compare, which research 031 confirms graph metadata is already idempotent through.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/spec-doc-paths.ts` | Create | Home for the shared `resolveSpecFolderIdentity(absFolder)` returning specs-root-relative `specFolder`, `parentId`, and `childrenIds` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Build via the shared resolver, and add the merge guard that preserves non-null `parent_id`, reconciles it, and treats `children_ids` as append-only behind the default-OFF flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Emit the specs-root-relative `specFolder` from the shared resolver rather than the caller-base-relative path at line 809 |
| `.opencode/skills/system-spec-kit/scripts/tests/identity-resolver-merge-safety.vitest.ts` | Create | Unit and adversarial coverage for the resolver path shape and the merge preservation, append-only, and prune-mode invariants |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A shared `resolveSpecFolderIdentity(absFolder)` MUST return a specs-root-relative `specFolder`, a `parentId`, and a `childrenIds` array from one canonical specs-root anchor | A unit test passes an absolute folder path and asserts the returned `specFolder` equals the specs-root-relative form, `parentId` is the specs-root-relative parent, and `childrenIds` are specs-root-relative, with no caller-base leakage |
| REQ-002 | Both the `description.json` generator and the `graph-metadata.json` build MUST consume the shared resolver so the `specFolder` path shape matches across both files | A test deriving both files for one folder asserts the `description.json` `specFolder` and the graph `spec_folder` carry the identical specs-root-relative string, and the `folder-discovery.ts:809` caller-base path is no longer the source |
| REQ-003 | `mergeGraphMetadata` MUST reconcile `parent_id` as `refreshed ?? existing ?? null` so a null-deriving re-derive preserves an existing non-null parent | A merge test with a refreshed snapshot whose `parent_id` is null and an existing record whose `parent_id` is non-null asserts the merged `parent_id` keeps the existing value and carries a review flag |
| REQ-004 | `mergeGraphMetadata` MUST default `children_ids` to a stable union of existing and refreshed entries, so a scoped or racing scan never deletes a child | A merge test with a refreshed snapshot missing a child the existing record holds asserts the merged `children_ids` retains the existing child, and the union order is stable across reruns |
| REQ-005 | Relationship removal MUST require an explicit prune or repair mode, never a side effect of a scoped scan | A test confirms a normal merge never shrinks `children_ids` or nulls a non-null `parent_id`, and only the explicit prune-mode path removes a relationship |
| REQ-006 | The merge behavioral change MUST ship behind a default-OFF flag with a grandfather report mode that lists the folders whose identity or lineage would change without writing them | With the flag OFF, the merge behaves as today and the report mode prints the would-change folder list and writes nothing, and only with the flag ON does the preservation and append-only behavior apply |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The resolver MUST reject an absolute path that resolves outside any supported specs root rather than fabricating a relative path | A test passes an outside-root absolute path and asserts the resolver returns a typed contract error rather than a `..`-prefixed or caller-base `specFolder` |
| REQ-008 | The merge guard MUST set a review flag when it preserves an existing non-null `parent_id` over a null recomputation, so a genuinely re-parented folder is still surfaced | A merge test asserts the preservation path sets the review flag, and a merge where the refreshed parent is non-null and differs does NOT silently keep the old parent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: For one folder, `description.json` `specFolder` and `graph-metadata.json` `spec_folder` carry the identical specs-root-relative string, proving the shared resolver removed the path-shape drift.
- **SC-002**: A re-derive whose `resolveParentId` returns null preserves an existing non-null `parent_id` with a review flag, proving the merge no longer erases lineage.
- **SC-003**: A scoped scan that sees fewer children leaves the stored `children_ids` union intact, and only an explicit prune mode removes a child, proving children are append-only by default.
- **SC-004**: With the flag OFF the merge behaves exactly as today and the grandfather report lists every folder whose identity or lineage would change without writing it, proving the rollout is observable before it is enforced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The new specs-root-relative `specFolder` in `description.json` changes the stored value for existing folders that carried a caller-base path | High | Ship behind the default-OFF flag, surface every changed folder through the grandfather report first, and graduate only after a scoped migration |
| Risk | A genuinely re-parented folder is silently kept on its old parent by the preservation rule | Medium | REQ-008 sets a review flag on every preservation and keeps a differing non-null refreshed parent authoritative |
| Risk | The append-only union grows `children_ids` with stale entries when a child is legitimately removed | Medium | REQ-005 reserves removal for the explicit prune or repair mode, which is the sanctioned path to shrink the set |
| Dependency | `resolveParentId` and `resolveChildrenIds` in `graph-metadata-parser.ts` | The resolver consolidates their logic, so a behavior change there must be reflected once in the shared helper | Move the canonical computation into `resolveSpecFolderIdentity` and have the build call it rather than the two split functions |
| Dependency | The volatile-ignoring idempotency compare | The merge change must not defeat the no-op skip that keeps graph metadata idempotent | Keep the preservation and union logic inside the merge before the compare, so an unchanged folder still compares equal and skips its write |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The resolver computes identity from path segments only, with no filesystem walk beyond the child enumeration the build already performs, so it adds no measurable cost to a derive.

### Reliability
- **NFR-R01**: The resolver is deterministic on a fixed absolute path and specs-root set, so two runs on the same folder return the identical `specFolder`, `parentId`, and `childrenIds`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder directly under a specs root with no parent packet: the resolver returns a `parentId` of the specs-root-relative parent or null, and the merge keeps null without flagging a review.
- A phase parent whose children are enumerated by a scoped scan that misses a sibling: the merge union retains the missing sibling rather than deleting it.

### Error Scenarios
- An absolute path outside every supported specs root: the resolver returns a typed contract error rather than a `..`-prefixed `specFolder`.
- An existing record whose `parent_id` is non-null and whose refreshed `parent_id` is a different non-null value: the merge keeps the refreshed value as authoritative and does not apply the preserve-on-null rule.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One shared resolver, two generator call-site swaps, and one merge guard, all behind a flag with a report mode |
| Risk | 9/25 | No ranking change, risk is identity-value churn on existing files and a silent re-parent, both mitigated by the flag and the review flag |
| Research | 4/20 | Both recs verified to file:line in research 031 section 4 and section 6 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether `resolveSpecFolderIdentity` lives in a new `spec-doc-paths.ts` module or beside the parser, given both generators must import it without a cycle.
- Whether the grandfather report writes a one-time changed-folder manifest into the phase scratch area or only prints to stdout for the first rollout.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Convergent root-cause fix, PLANNED. Research 031 names the shared identity resolver the single fix four angles reached independently and the merge-path lineage guard the safety fix that stops a scoped or null-deriving re-derive from erasing relationships. Both are P0/M and both are verified to file:line, the path-shape drift at `folder-discovery.ts:809` against the specs-root-relative graph form, and the lineage loss at `graph-metadata-parser.ts:1149-1161` where the merge spreads the refreshed snapshot over the persisted `parent_id` and `children_ids`. The build is one shared resolver, two call-site swaps, and one merge guard, all behind a default-OFF flag with a grandfather report mode because existing files carry the prefixed paths and prose statuses the new contract rejects. This phase measures and preserves identity, it does not migrate the existing files, which graduates only after the report mode proves the change set is safe.
<!-- /ANCHOR:verdict -->
