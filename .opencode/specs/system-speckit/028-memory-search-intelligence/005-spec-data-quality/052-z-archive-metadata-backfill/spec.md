---
title: "Feature Specification: Backfill description.json and graph-metadata.json for the nine z_archive root directories across .opencode/specs so each archive becomes a discoverable, cold-tier container node in the memory graph [template:level_2/spec.md]"
description: "Nine z_archive root directories contain hundreds of already-indexed archived spec folders, but none of the nine roots carries its own description.json or graph-metadata.json, so the archive as a collection has no graph node and cannot be traversed or discovered as a unit."
trigger_phrases:
  - "z_archive root metadata"
  - "archive container graph node"
  - "z_archive root backfill"
  - "cold tier container node"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/052-z-archive-metadata-backfill"
    last_updated_at: "2026-07-06T12:51:23.429Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 2 spec for the nine z_archive root container backfill"
    next_safe_action: "Audit container-folder support, then backfill the nine z_archive roots"
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
    open_questions:
      - "Does generate-description.js / backfill-graph-metadata.js already accept a folder with no spec.md, or does this phase need a manually-authored lean container node?"
      - "How should sk-design/008-sk-design-parent/external/z_archive represent children_ids given it holds non-spec external reference files and vendored directories, not archived spec folders?"
      - "Should system-skill-advisor (the track itself, currently unregistered) get a node as a byproduct of wiring its z_archive root's parent_id, or does that root's parent_id stay null until a separate phase backfills the track?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Backfill description.json and graph-metadata.json for the nine z_archive root directories across .opencode/specs so each archive becomes a discoverable, cold-tier container node in the memory graph

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
There are nine `z_archive` root directories across `.opencode/specs` (`system-speckit/z_archive`, `system-deep-loop/z_archive`, `skilled-agent-orchestration/z_archive`, `sk-design/z_archive`, `system-skill-advisor/z_archive`, `system-speckit/026-graph-and-context-optimization/z_archive`, `sk-design/008-sk-design-parent/external/z_archive`, plus two nested roots inside already-archived folders). Each root holds between zero and 116 archived items directly beneath it, and the archived spec folders inside already carry their own `description.json`/`graph-metadata.json` and are already indexed (confirmed: all 318 non-scratch spec folders under `system-speckit/z_archive` alone have both files). But none of the nine root directories itself has a `description.json` or `graph-metadata.json`. The archive as a collection has no graph node, so the memory graph can see individual archived spec folders but cannot traverse or discover "this archive" as a unit.

### Purpose
Give each of the nine `z_archive` roots a container-level `description.json` and `graph-metadata.json`, tagged with the archived/cold tier, so every archive becomes a discoverable, traversable graph node without surfacing in default recall.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Backfill `description.json` and `graph-metadata.json` for exactly the nine named `z_archive` root directories.
- `children_ids` for each root listing the archived items directly beneath it, one level deep only, never recursing into a deeper nested `z_archive`.
- `parent_id` wiring: the registered enclosing spec/track node where one exists (seven of nine roots), and the enclosing archived folder for the two nested roots (`system-deep-loop/z_archive/021-deep-skill-evolution/z_archive` parents to `021-deep-skill-evolution`; `system-speckit/z_archive/001-fix-command-dispatch/z_archive` parents to `001-fix-command-dispatch`).
- Confirming whether `generate-description.js` / `backfill-graph-metadata.js` already support a container folder with no `spec.md`. Precedent exists: `system-speckit`, `sk-design`, `skilled-agent-orchestration` and `system-deep-loop` each already carry `description.json` + `graph-metadata.json` at their own root with no `spec.md`.
- Tagging each root's generated metadata with the archived/cold-tier signal so the container itself enriches the graph without polluting default recall.

### Out of Scope
- Re-touching the archived spec folders' own `description.json`/`graph-metadata.json` - already present and already indexed; this phase never opens those files.
- The global `.opencode/specs/descriptions.json` - regenerated later via a separate reindex, coordinated with the parked reindex track noted in the packet's continuity memory.
- Registering `system-skill-advisor` (the track itself, currently unregistered) or `sk-design/008-sk-design-parent/external` (an unregistered intermediate container) as new graph nodes in their own right - out of scope beyond what is strictly needed to wire the two roots that sit inside them.
- Changing the archived-tier recall mechanism itself. The shared active-row predicate and the one-time 6,090-row archived-tier backfill already shipped (`016/002-archived-tier-and-tombstone-read-exclusions`, `8142e1dae3`). This phase reuses that mechanism; it does not redesign it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/system-speckit/z_archive/description.json`, `graph-metadata.json` | Create | Container node for the largest, most standard root (25 direct children) |
| `.opencode/specs/system-deep-loop/z_archive/description.json`, `graph-metadata.json` | Create | Container node (28 direct children) |
| `.opencode/specs/skilled-agent-orchestration/z_archive/description.json`, `graph-metadata.json` | Create | Container node (116 direct children) |
| `.opencode/specs/sk-design/z_archive/description.json`, `graph-metadata.json` | Create | Container node, currently empty (`.gitkeep` only), `children_ids: []` |
| `.opencode/specs/system-skill-advisor/z_archive/description.json`, `graph-metadata.json` | Create | Container node, currently empty, enclosing track itself unregistered |
| `.opencode/specs/system-speckit/026-graph-and-context-optimization/z_archive/description.json`, `graph-metadata.json` | Create | Container node (4 direct children), parent already registered |
| `.opencode/specs/sk-design/008-sk-design-parent/external/z_archive/description.json`, `graph-metadata.json` | Create | Container node holding non-spec external reference files and two vendored directories, not archived spec folders |
| `.opencode/specs/system-deep-loop/z_archive/021-deep-skill-evolution/z_archive/description.json`, `graph-metadata.json` | Create | Nested container node, parents to `021-deep-skill-evolution` |
| `.opencode/specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/description.json`, `graph-metadata.json` | Create | Nested container node (92 direct children), parents to `001-fix-command-dispatch` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Every one of the nine named `z_archive` root directories gets a valid `description.json` | Each of the nine paths has a `description.json` that parses as valid JSON after the phase runs |
| REQ-002 | Every one of the nine named `z_archive` root directories gets a valid `graph-metadata.json` with a `children_ids` array | Each of the nine paths has a `graph-metadata.json` that parses as valid JSON and includes a `children_ids` array after the phase runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | `parent_id` resolves correctly for the seven roots whose enclosing folder is already a registered spec/track node | Given a z_archive root whose enclosing folder already has `description.json` + `graph-metadata.json` (e.g. `system-speckit`, `sk-design`, `skilled-agent-orchestration`, `system-deep-loop`, `system-speckit/026-graph-and-context-optimization`), When that root's `graph-metadata.json` is generated, Then its `parent_id` points at that registered enclosing node |
| REQ-004 | `parent_id` resolves to the enclosing archived folder for the two nested roots, not to the outer `z_archive` | Given the two nested roots (`system-deep-loop/z_archive/021-deep-skill-evolution/z_archive` and `system-speckit/z_archive/001-fix-command-dispatch/z_archive`), When their `graph-metadata.json` is generated, Then `parent_id` resolves to `021-deep-skill-evolution` and `001-fix-command-dispatch` respectively |
| REQ-005 | `children_ids` for each root lists only the archived items directly beneath it | Given a z_archive root's direct contents, When `children_ids` is populated, Then it lists exactly the items one level deep and excludes anything nested inside a deeper `z_archive` |
| REQ-006 | Each root's generated metadata carries the archived/cold-tier signal | Given the generated `description.json`/`graph-metadata.json` for each of the nine roots, When it reaches the memory index, Then it carries the same archived/cold-tier signal the shipped active-row predicate already excludes from default recall |
| REQ-007 | No existing archived spec folder's metadata is modified | Given the child spec folders already nested under each z_archive root, When this phase runs, Then none of their existing `description.json`/`graph-metadata.json` files change |
| REQ-008 | The global descriptions index is not touched | Given `.opencode/specs/descriptions.json`, When this phase runs, Then that file is not edited; it is regenerated later via a separate reindex |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine named `z_archive` roots have valid `description.json` + `graph-metadata.json` and are graph-reachable as cold-tier container nodes.
- **SC-002**: Default recall behavior is unchanged, and neither the existing child spec-folder metadata nor the global `descriptions.json` was touched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `generate-description.js` / `backfill-graph-metadata.js` container-folder support (no `spec.md`) | Unconfirmed for these nine paths specifically | Four top-level tracks already prove the pattern works (`system-speckit`, `sk-design`, `skilled-agent-orchestration`, `system-deep-loop` each have both files with no `spec.md`); verify against one clean root first |
| Dependency | The shipped archived-tier mechanism (`active-row-predicate.ts`, `016/002` migration) | This phase reuses it and does not rebuild it | No new tier logic; only apply the existing signal to nine new rows |
| Risk | `sk-design/008-sk-design-parent/external/z_archive` holds non-spec external reference files and two vendored directories, not archived spec folders | `children_ids` semantics may not cleanly apply | Resolve explicitly in Phase 2 rather than fabricating spec-folder-shaped entries for non-spec content |
| Risk | Two roots are fully empty today (`sk-design/z_archive` has only `.gitkeep`; `system-skill-advisor/z_archive` has nothing) | `children_ids: []` must not be treated as a generator error | Confirm the generator tolerates an empty container before treating a zero-child result as a failure |
| Risk | `system-skill-advisor` (the track enclosing one root) has no registered node itself | That root's `parent_id` has no natural registered target | Document as an open question; resolve to `null` rather than inventing an unregistered parent reference |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Backfilling all nine roots completes in a single bounded run (filesystem writes only); tier verification against the live memory index may run separately and can be daemon-backed.

### Security
- **NFR-S01**: Writes touch only the nine named root paths' own `description.json`/`graph-metadata.json`. No other file, including any existing archived spec folder's metadata or the global `descriptions.json`, is mutated.

### Reliability
- **NFR-R01**: Rerunning the backfill against an already-completed root is idempotent - no duplicate `children_ids` entries, no unnecessary diff.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Two roots are fully empty (`sk-design/z_archive`, `system-skill-advisor/z_archive`): `children_ids: []` is the correct, non-error result.
- One root (`sk-design/008-sk-design-parent/external/z_archive`) holds non-spec external reference markdown files and two vendored directories, not numbered archived spec folders: its `children_ids` must reflect what it actually holds rather than fabricating spec-folder-shaped entries.
- Two roots are nested inside already-archived folders: their `parent_id` is that enclosing folder, not the outer `z_archive`.

### Error Scenarios
- If `generate-description.js`/`backfill-graph-metadata.js` reject a folder with no `spec.md`, fall back to manually authoring a lean container node matching the precedent already used for `system-speckit`, `sk-design`, `skilled-agent-orchestration` and `system-deep-loop`.
- A root whose enclosing folder has no registered metadata (`system-skill-advisor`) resolves `parent_id` to `null` rather than a broken reference.

### State Transitions
- Not applicable. This is a one-time backfill against nine known paths, not a recurring state machine. A future new `z_archive` root appearing under a different skill or track would need the same treatment as a separate follow-up, not a re-run of this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Nine target directories, two existing scripts to verify or invoke, no new code path if the generators already support container folders |
| Risk | 10/25 | Touches graph `parent_id` wiring and tier tagging, but additive-only; no existing file is mutated |
| Research | 14/20 | Must confirm generator container-folder support, resolve the `external/` non-spec-content case, and confirm the `system-skill-advisor` parent gap |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does `generate-description.js` / `backfill-graph-metadata.js` already accept a folder with no `spec.md`, or does this phase need to hand-author a lean container node?
- How should `sk-design/008-sk-design-parent/external/z_archive` represent `children_ids` given it holds non-spec external reference files and vendored directories, not archived spec folders?
- Should `system-skill-advisor` (the track itself, currently unregistered) get a node as a byproduct of wiring its `z_archive` root's `parent_id`, or does that root's `parent_id` stay `null` until a separate phase backfills the track?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
