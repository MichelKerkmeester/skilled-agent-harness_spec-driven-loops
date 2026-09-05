---
title: "Feature Specification: Phase 2: scripts-into-runtime-nesting"
description: "The skill runs two npm workspace packages side by side, runtime/ (the engine) and scripts/ (the CLI over it); the operator wants scripts/ to live inside runtime/, a rename on the scale of the earlier mcp-server-to-runtime move."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: scripts-into-runtime-nesting

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (planning only - `recommend-level.sh` must re-score this folder to Level 3 before any execution task starts; see Risks) |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 7 |
| **Predecessor** | `../001-continuity-freshness-claim-binding/spec.md` |
| **Successor** | `../003-retrieval-coverage-alignment/spec.md` |
| **Handoff Criteria** | This folder is re-leveled to 3, an execution plan is authored at that level, and the operator approves the atomic-commit plan before any `git mv` runs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the decommission debt fixes specification.

**Scope Boundary**: The relative layout of `.opencode/skills/system-spec-kit/scripts/` and `.opencode/skills/system-spec-kit/runtime/` and every reference to their current paths. No behavior change to either package.

**Dependencies**:
- None on Phase 1. Independent of Phases 3-7, though it should land before Phase 7's naming decision closes, since a path rename changes the blast-radius count that decision cites.

**Deliverables**:
- A chosen target layout that resolves the `runtime/scripts/` collision.
- A resolution-based (not grep-only) inventory of every path reference.
- A re-leveled Level 3 execution packet, planned but not started here.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/system-spec-kit/` runs two npm workspace packages side by side: `runtime/` (the `@spec-kit/runtime` engine - validation, metadata, hooks) and `scripts/` (the `@spec-kit/scripts` CLI workspace over it - `scripts/spec/validate.sh`, `scripts/memory/generate-context.ts`, `scripts/retrieval/`). The operator wants `scripts/` nested inside `runtime/`. The skill's own `package.json:7-11` already declares `runtime` and `scripts` as sibling workspace members alongside `shared`, and `runtime/` already has its own `runtime/scripts/` directory (`finalize-dist.mjs`, `run-tests.mjs`, `run-tests-sharded.mjs`, `tests/`) - a literal `git mv scripts runtime/scripts` collides with content that already exists at that path. This mirrors the earlier `mcp-server` → `runtime` rename (packet 053, commit `aef7852400`, 708 files) in shape but not in size: every hook config, CI workflow, doctor asset, agent mirror, README, and the paths CLAUDE.md names directly (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, `scripts/dist/memory/generate-context.js`, `scripts/retrieval/lookup-trigger-index.mjs`) would change.

### Purpose
A target layout is chosen that avoids the `runtime/scripts/` name collision, every reference to the old `scripts/` path is inventoried by resolution (import graphs, config file parsing, CI job execution) rather than text search alone, and the move is planned as one atomic commit with a rollback ref - but not executed in this phase, since the scope alone qualifies for Level 3 (see Risks).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate every current reference to `.opencode/skills/system-spec-kit/scripts/` by resolution: `rg` for a first pass, then confirm each hit is a live consumer by following the import, `require`, `spawnSync`, YAML `command:` field, or shell `source`/`.` that resolves the path, not just a text match.
- Choose the target layout. Two candidates evaluated in this phase: (a) `runtime/cli/` - move the CLI workspace to a name that cannot collide with `runtime/scripts/`'s existing build-tooling content; (b) fold `runtime/scripts/`'s three files (`finalize-dist.mjs`, `run-tests.mjs`, `run-tests-sharded.mjs`) and its `tests/` directory into the incoming `scripts/` tree first, freeing the `runtime/scripts/` name for the nested workspace. Recommend (a): renaming three build-tooling files is a much smaller collision-resolution footprint than merging an entire CLI workspace's directory names into an existing tree.
- Update `.opencode/skills/system-spec-kit/package.json`'s `workspaces` array (`["shared", "runtime", "scripts"]`) to the new relative path.
- Update `scripts/lib/dist-freshness.cjs`'s source table, every hook config's script path (`.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json`), every CI workflow referencing `scripts/`, `.opencode/commands/doctor` assets, agent mirrors, and CLAUDE.md's three named paths.
- Plan the ten-iteration review pass that packet 053 ran after its own rename, scoped to this move.

### Out of Scope
- Executing the `git mv` itself - this phase produces the resolution-based inventory and the target-layout decision; the move is a Level 3 packet that this phase's `spec.md` recommends creating, not this folder re-purposed mid-flight.
- Any behavior change inside either package - this is a path rename only.
- Renaming `@spec-kit/scripts` or `@spec-kit/runtime` as npm package names - only the on-disk directory relationship changes unless the execution phase's inventory shows the package name must move too.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (this phase) `spec.md`, `plan.md`, `tasks.md` | Create (already scaffolded) | Planning-only; no source files change in this phase |
| (execution phase, out of scope here) `.opencode/skills/system-spec-kit/scripts/**` | Move | `git mv` to the chosen target layout |
| (execution phase) `.opencode/skills/system-spec-kit/package.json` | Modify | `workspaces` array |
| (execution phase) `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`, hook configs, CI workflows, CLAUDE.md | Modify | Every resolved path reference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every current reference to `.opencode/skills/system-spec-kit/scripts/` is inventoried by resolution - the entry actually executes, imports, or resolves the path, not merely contains its text - before any execution phase is authored |
| REQ-002 | The `runtime/scripts/` name collision is resolved by an explicit, documented target-layout decision (this phase recommends option (a): `runtime/cli/`) before `git mv` is planned |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `recommend-level.sh` is run against this folder and its score is recorded; if it returns Level 3 (expected, given the packet-053 precedent's own scale), a new Level 3 execution packet is the recommended next step rather than continuing in this Level 2 folder |
| REQ-004 | The execution plan (drafted here, run later) specifies one atomic commit via `git mv`, followed immediately by `dist-freshness.cjs`, hook-symlink, workspace-membership, and CLAUDE.md updates in the same commit, plus the full gate set and a ten-iteration review pass, mirroring packet 053's own closeout |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The resolution-based inventory names every hook config, CI workflow, doctor asset, agent mirror, README, and CLAUDE.md path that would break, with a file:line citation for each, before this phase closes.
- **SC-002**: `recommend-level.sh` has been run against this folder and its numeric score and recommended level are recorded in this packet's acceptance criteria.
- **SC-003**: The target-layout decision and its collision-avoidance rationale are recorded so the execution phase can start from a decision, not a re-investigation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | This phase is scoped and documented as Level 2 by the parent's scaffold, but the move itself is Level-3-scale work (708-file precedent at packet 053) | High if execution starts without re-leveling | This spec explicitly states: `recommend-level.sh` MUST be run and the execution packet MUST be created at Level 3 before any `git mv`; this folder does not execute the move |
| Risk | A grep-only inventory misses a reference resolved only at runtime (e.g., a path built from a template string, or a symlink target) | High - a missed reference silently breaks a hook or CI job | Resolution-based inventory (import graphs, `spawnSync` targets, YAML `command:` fields) per REQ-001, not grep alone |
| Dependency | Packet 053's own review-loop precedent and its lineage artifacts, for the review-pass shape this phase's plan reuses | Low - precedent already exists and is readable | Cite `specs/system-speckit/053-spec-kit-runtime-rename/` directly in the execution plan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable to this planning-only phase.
- **NFR-P02**: The execution phase's atomic commit must not increase `npm install` or `npm run build` wall-clock time in either package (path rename only, no new dependency).

### Security
- **NFR-S01**: No new environment variable or credential surface.
- **NFR-S02**: No secret or path outside the skill root is touched by the move.

### Reliability
- **NFR-R01**: The execution phase's rollback is a single `git revert` of the atomic commit - documented in that phase's plan, not this one.
- **NFR-R02**: No hook, CI job, or doctor route may resolve to a dangling path after the move; the execution phase's gate set proves this before closing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable - this phase produces a written inventory, not a runtime input path.
- Maximum length: the inventory may run to hundreds of references, matching packet 053's 708-file precedent in kind if not in count; the inventory format groups by consumer class (hooks, CI, doctor, mirrors, docs) rather than listing every file flat.
- Invalid format: a reference that resolves ambiguously (e.g., a glob that matches both the old and a coincidentally-named new path) is flagged for manual resolution, not auto-resolved.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: the execution phase's single atomic commit avoids a half-moved intermediate state that a concurrent process could observe; this phase does not touch the filesystem.

### State Transitions
- Partial completion: this phase itself has no partial-completion risk - it is a planning document. The execution phase's atomic-commit requirement (REQ-004) is what prevents a partial move there.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | This phase only produces an inventory and a decision; the move itself is out of scope and belongs to a future Level 3 packet |
| Risk | 6/25 | Planning-only; the real risk (a missed reference breaking a live hook) is deferred to the execution phase's own gate |
| Research | 4/20 | The precedent (packet 053) and the collision (`runtime/scripts/` already populated) are both already confirmed by direct inspection |
| **Total** | **18/70** | **Level 2 for this planning phase; the execution phase must be scored independently and is expected to land at Level 3** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open for this planning phase. The execution phase's own `recommend-level.sh` run is not a question - it is REQ-003, a required action before that phase starts.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
