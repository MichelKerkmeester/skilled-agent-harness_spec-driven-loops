---
title: "Implementation Plan: Backfill description.json and graph-metadata.json for the nine z_archive root directories across .opencode/specs so each archive becomes a discoverable, cold-tier container node in the memory graph [template:level_2/plan.md]"
description: "Node.js/TypeScript backfill against nine known z_archive root paths: verify container-folder support in the existing generators, resolve parent_id per root, generate description.json plus graph-metadata.json with a one-level-deep children_ids, and tag each with the archived tier."
trigger_phrases:
  - "z_archive container backfill plan"
  - "archive root graph node plan"
  - "cold tier container plan"
  - "z_archive parent_id resolution"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/018-z-archive-metadata-backfill"
    last_updated_at: "2026-07-06T12:51:23.429Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 2 plan for the nine z_archive root container backfill"
    next_safe_action: "Author tasks.md, checklist.md and implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/active-row-predicate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/052-z-archive-metadata-backfill"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Backfill description.json and graph-metadata.json for the nine z_archive root directories across .opencode/specs so each archive becomes a discoverable, cold-tier container node in the memory graph

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js / TypeScript (`generate-description.ts`, `backfill-graph-metadata.ts`) |
| **Framework** | None. CLI scripts plus, for tier verification only, the MCP memory index |
| **Storage** | Filesystem JSON (`description.json`, `graph-metadata.json`) at each of the nine root paths; live SQLite `memory_index` for the archived-tier signal once indexed |
| **Testing** | Dry run against one clean root first (`skilled-agent-orchestration/z_archive`), then a rerun-idempotency check before touching the remaining eight |

### Overview
Four top-level tracks (`system-speckit`, `sk-design`, `skilled-agent-orchestration`, `system-deep-loop`) already carry `description.json` + `graph-metadata.json` at their own root with no `spec.md`, proving the container-node pattern already works in this system. This phase applies the same pattern to the nine `z_archive` roots: verify the existing generators accept a `spec.md`-less folder, resolve each root's `parent_id`, generate both files with a one-level-deep `children_ids`, and tag each with the archived/cold tier already shipped in `016/002`. No new tier mechanism gets built.
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
Batch metadata backfill against nine known paths, following the existing top-level-track container-node precedent. No new service or schema.

### Key Components
- **Container-folder support check**: Confirm `generate-description.js` / `backfill-graph-metadata.js` accept a folder with no `spec.md`, using the four already-registered tracks as the working reference.
- **`parent_id` resolver**: For each of the nine roots, resolve to the registered enclosing node (seven cases) or the enclosing archived folder (two nested cases); resolve to `null` where the enclosing folder itself is unregistered (`system-skill-advisor`).
- **`children_ids` builder**: One level deep only. Never recurses into a deeper nested `z_archive`.
- **Archived/cold-tier tagger**: Applies the same signal the shipped active-row predicate (`016/002`) already excludes from default recall, so the nine new container nodes never pollute live results.

### Data Flow
```
9 known root paths
        |
        v
container-folder support check (4 existing tracks as precedent)
        |
        v
per-root: resolve parent_id -> build children_ids (1 level) -> generate description.json + graph-metadata.json
        |
        v
tag archived/cold tier -> memory graph gains 9 container nodes -> default recall unchanged
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This addendum applies: the new container nodes become part of the shared memory graph the moment they are indexed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `generate-description.ts` | Generates `description.json` for a spec folder; container-folder support for a `spec.md`-less path is unconfirmed at these nine specific paths | Verify against one root, use as-is if it already works | Dry run against `skilled-agent-orchestration/z_archive`, inspect output |
| `backfill-graph-metadata.ts` | Generates `graph-metadata.json`, including `children_ids` and `parent_id` | Verify container-folder support the same way; supply the resolved `parent_id` per root | Dry run against the same clean root, inspect `parent_id` and `children_ids` |
| `active-row-predicate.ts` (unchanged) | Already excludes `archived` tier from default recall | Not modified. This phase only needs its existing tier value applied to the nine new rows | `rg -n "archived" .opencode/skills/system-spec-kit/mcp_server/lib/search/active-row-predicate.ts` |
| `.opencode/specs/descriptions.json` (global index) | Aggregates all `description.json` files | Not a consumer in this phase; regenerated later via a separate reindex | Confirm untouched via `git diff` after the phase runs |
| Existing archived spec-folder metadata (hundreds of files) | Already generated and already indexed | Not touched | `git diff` scoped to exactly 18 new files (9 roots x 2 files each) |

Required inventories:
- Same-class producers: `rg -n "spec.md" .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` to confirm exactly where (if anywhere) the scripts require `spec.md` to exist.
- Consumers of changed symbols: not applicable. This phase adds data files; it does not change any exported function signature.
- Matrix axes: 7 roots with a cleanly registered enclosing node, 2 nested roots parenting to an already-archived folder, 1 root with non-spec external content, 2 fully empty roots, 1 root whose enclosing track is itself unregistered. Every root must be handled by name in Phase 2, not by a single generic branch.
- Algorithm invariant: `children_ids` for a root is exactly its direct children, never a recursive walk into a nested `z_archive`; a root's own metadata must never be confused with a child's metadata.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Reconfirm the nine root paths and their direct-child counts as a starting snapshot
- [ ] Determine whether `generate-description.js` / `backfill-graph-metadata.js` already accept a folder with no `spec.md`, using the four registered top-level tracks as precedent
- [ ] Resolve `parent_id` for each of the nine roots per the matrix in the Fix Addendum

### Phase 2: Core Implementation
- [ ] Generate `description.json` for each of the nine roots
- [ ] Generate `graph-metadata.json` for each of the nine roots with a one-level-deep `children_ids` and the resolved `parent_id`
- [ ] Tag each root's generated metadata with the archived/cold-tier signal
- [ ] Resolve the `sk-design/008-sk-design-parent/external/z_archive` edge case explicitly: represent its non-spec external reference content honestly instead of fabricating spec-folder-shaped entries

### Phase 3: Verification
- [ ] Validate all nine new `description.json`/`graph-metadata.json` pairs parse as valid JSON and pass `check-graph-metadata-shape.sh`
- [ ] Confirm no existing archived spec folder's metadata changed and `.opencode/specs/descriptions.json` was not touched
- [ ] Confirm default recall is unaffected by the nine new container nodes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Dry run | One clean root (`skilled-agent-orchestration/z_archive`) before the other eight | `generate-description.js` / `backfill-graph-metadata.js` manual invocation |
| Shape validation | All nine generated pairs | `check-graph-metadata-shape.sh`, JSON parse |
| Manual | Confirm default recall is unchanged after indexing | A recall query that previously surfaced archived content, before/after comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `generate-description.js` / `backfill-graph-metadata.js` container-folder support | Internal | Yellow (unconfirmed at these nine paths, though precedented at four tracks) | Falls back to hand-authoring a lean container node matching the existing track pattern |
| Shipped archived-tier mechanism (`active-row-predicate.ts`, `016/002` migration) | Internal | Green | No independent tier-gating mechanism exists to reuse; would need one built from scratch |
| Registered enclosing nodes for seven of nine roots | Internal | Green | `parent_id` resolution for those seven is a direct lookup, already confirmed present |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A generated container node fails `check-graph-metadata-shape.sh`, or indexing one of the nine nodes changes default recall results.
- **Procedure**: Delete the newly created `description.json`/`graph-metadata.json` pair for the affected root. Every change in this phase is a pure addition (nine new file pairs); nothing existing is modified, so rollback never needs a diff-restore.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: support check + parent_id resolution) ──► Phase 2 (Core: generate + tag) ──► Phase 3 (Verify)
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
|-------|------------|-------------------|
| Setup | Low | One dry run plus nine `parent_id` lookups |
| Core Implementation | Medium | Nine root pairs, one genuinely bespoke edge case (`external/z_archive`) |
| Verification | Low | Shape validation plus a before/after recall spot-check |
| **Total** | | Small, bounded backfill against nine known paths |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Dry run against one clean root completed and inspected before running the other eight
- [ ] `parent_id` resolution table finalized for all nine roots
- [ ] Confirmed the phase only creates new files, never edits an existing one

### Rollback Procedure
1. **Immediate**: Stop the backfill run if the dry run or shape validation fails on any root.
2. **Revert code**: Delete the specific root's `description.json`/`graph-metadata.json` pair; no other file is affected.
3. **Verify rollback**: Rerun `check-graph-metadata-shape.sh` on the remaining roots to confirm they are unaffected.
4. **Notify stakeholders**: Not user-facing; note the rollback in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No. This phase only creates new JSON files at nine known paths.
- **Reversal procedure**: `rm` the newly created `description.json`/`graph-metadata.json` for the affected root.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
