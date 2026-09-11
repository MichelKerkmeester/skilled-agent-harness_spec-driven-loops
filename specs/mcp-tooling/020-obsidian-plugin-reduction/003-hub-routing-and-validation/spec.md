---
title: "Feature Specification: Phase 3: hub-routing-and-validation"
description: "Reconcile the mcp-tooling hub leaf manifest, registry and router vocabulary to the reduced plugin set, then run the authoritative gates."
trigger_phrases:
  - "mcp-tooling hub leaf manifest obsidian"
  - "hub router vocabulary plugin removal"
  - "validate obsidian plugin reduction"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: hub-routing-and-validation

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY


The parent hub still carries leaf paths, alias phrases and router vocabulary for the removed
plugins. This phase reconciles all three, then runs the gates that decide whether the packet
closes: the per-hub parent-skill check, a compiled-route replay, and recursive spec validation.

**Key Decisions**: the hub's `graph-metadata.json` needs no change, because among the affected
vocabulary it carries only `iconic`, which is retained.

**Critical Dependencies**: phases 1 and 2. A gate run over a half-reconciled tree reports on a
state nobody is shipping.

---
<!-- ANCHOR:metadata -->

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-skill-surface-reconciliation |
| **Successor** | None |
| **Handoff Criteria** | Every gate passes from the final state, with output read and recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->

## Phase Context

This is **Phase 3** of the Reduce mcp-obsidian dedicated plugin support to Iconic and Health.md
only specification.

**Scope Boundary**: the parent hub's routing files, plus the verification of the whole packet.

**Dependencies**:
- Phases 1 and 2 complete. Gates run over a partially reconciled tree are misleading.

**Deliverables**:
- Hub leaf manifest, registry and router carrying no removed vocabulary.
- Gate output recorded as evidence rather than summarized as a verdict.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->

## 2. PROBLEM & PURPOSE

### Problem Statement
Routing runs in two stages, and phase 2 only fixed the second one inside the mode. The hub still
lists sixty-odd leaf paths that no longer exist, and its router still scores `dataview`, `charts`
and `outliner` vocabulary toward a mode that can no longer serve those requests. A hub that routes
a request it cannot answer is worse than one that defers.

### Purpose
The hub's three routing files describe the reduced mode, and the authoritative gates confirm it
from the final state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->

## 3. SCOPE

### In Scope
- `.opencode/skills/mcp-tooling/leaf-manifest.json`: the mcp-obsidian mode's leaf list.
- `.opencode/skills/mcp-tooling/mode-registry.json`: alias phrases naming removed plugins.
- `.opencode/skills/mcp-tooling/hub-router.json`: vocabulary classes and router signals for
  `charts`, `dataview`, `dataviewjs`, `dataview query`, `dataview-query`, `charts-render`,
  `outliner`, `obsidian outliner` and `outliner-editing`.
- Running and recording: the per-hub parent-skill check, a compiled-route replay, recursive
  `validate.sh --strict`, and the residue scan over the whole repository.

### Out of Scope
- `.opencode/skills/mcp-tooling/graph-metadata.json` - among the affected vocabulary it carries
  only `iconic`, which is retained, so it needs no edit. Verified by inspection before this phase
  was written.
- Vocabulary for the other eight modes under the hub. Only the mcp-obsidian entries change.
- Rebuilding the compiled routing bundle. The activation artifact holds a fence and a manifest,
  not baked vocabulary, so it reads the router at request time.
- Committing or pushing. The operator decides when and where this lands.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Modify | Remove leaf paths under the removed plugin directories from the mcp-obsidian mode entry |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Remove alias phrases naming removed plugins |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | Remove the removed plugins' vocabulary and signals |
| `.opencode/skills/mcp-tooling/mcp-notion/references/migration-inventory.md` | Modify | Repoint three recovery links broken by this packet's deletions |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` plus its `retrieval/fixtures/` pair | Regenerate | The committed index mapped live phrases onto 61 deleted files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every leaf path listed for the mcp-obsidian mode resolves on disk |
| REQ-002 | No removed-plugin vocabulary survives in `hub-router.json` or `mode-registry.json` |
| REQ-003 | Retained vocabulary for Iconic, Health.md and the theme system is untouched |
| REQ-004 | The per-hub gate is run with the hub path passed explicitly, and its output is read |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Recursive `validate.sh --strict` over the packet reports `RESULT: PASSED` for every folder |
| REQ-006 | A repository-wide residue scan finds no reference to a removed doc-set path outside changelog history and this packet's own documents |
| REQ-007 | Gate output is recorded in `implementation-summary.md` as observed text, not as a verdict |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->

## 5. SUCCESS CRITERIA

- **SC-001**: Every leaf path for the mode resolves, checked path by path rather than by count.
- **SC-002**: The per-hub check and recursive validation both print an affirmative pass line from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The per-hub gate is run without the hub path and reports on a different hub | High | Pass the hub path explicitly and read the subject line before the verdict |
| Risk | A stale compiled orchestrator makes `validate.sh` exit 3 with no rule output, which a sweep reads as a pass | High | Require an explicit `RESULT: PASSED` line; rebuild the runtime if the staleness message appears |
| Risk | Validating the phase parent reports on the last child rather than the parent | Medium | Take the first `RESULT:` line per folder and validate children individually |
| Risk | Retained vocabulary is removed alongside the rest | High | Iconic, Health.md and theme terms are listed as untouchable and asserted afterwards |
| Dependency | Phases 1 and 2 | Blocking | Gates over a half-reconciled tree describe a state nobody ships |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Hub routing does no more work than before; entries are removed, never added.

### Security
- **NFR-S01**: No credential or environment value enters any routing file.

### Reliability
- **NFR-R01**: Every leaf path listed for the mode resolves, so no route can resolve to a missing file.

---

## 8. EDGE CASES

### Data Boundaries
- A vocabulary term serves two modes: leave it. Only terms exclusive to a removed plugin go.
- A leaf entry points at a retained file under a removed grouping: keep the file, fix the grouping.

### Error Scenarios
- `validate.sh` prints the stale-orchestrator message and exits 3: rebuild the runtime and re-run. Do not read the silence as a pass.
- The per-hub gate passes but a replayed request does not reach the mode: the two stages disagree, so fix both rather than the one that failed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 3, LOC: ~80 removed, Systems: 2 (mode and hub) |
| Risk | 10/25 | Auth: N, API: N, Breaking: a wrong edit silently misroutes |
| Research | 5/20 | The two-stage model is documented; the vocabulary must be read per term |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 12/15 | Dependencies: both prior phases, plus four gates |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Gate run against the wrong hub | H | M | Pass the hub path; read the subject line |
| R-002 | Green run that never executed | H | M | Require the affirmative `RESULT: PASSED` marker |
| R-003 | Retained vocabulary removed | H | L | Listed as untouchable; asserted after the edit |
| R-004 | Registered read as routed | M | M | Replay a real request through both stages |

---

## 11. USER STORIES

### US-001: Requests route to a mode that can serve them (Priority: P0)

**As an** agent asking about a removed plugin, **I want** the hub to defer rather than route,
**so that** I get a disambiguation prompt instead of a mode that has nothing to say.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Evidence rather than assertion (Priority: P1)

**As a** reader of the closeout, **I want** the gate output recorded verbatim, **so that** I can
tell a gate that passed from a gate that never ran.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

None. The hub's `graph-metadata.json` exclusion was verified by inspection rather than assumed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the Architecture Decision Record section at the end of `plan.md`

---


