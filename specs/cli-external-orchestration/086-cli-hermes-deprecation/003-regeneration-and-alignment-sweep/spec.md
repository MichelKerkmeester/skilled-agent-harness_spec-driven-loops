---
title: "Feature Specification: Phase 3: regeneration-and-alignment-sweep"
description: "Rebuild compiled routing, the deep command contracts and the trigger index after the removal, then sweep the repository for any remaining Hermes reference."
trigger_phrases:
  - "hermes removal alignment sweep"
  - "regenerate after hermes removal"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: regeneration-and-alignment-sweep

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `worktrees/321-deprecate-cli-hermes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-docs-and-registries |
| **Successor** | None |
| **Handoff Criteria** | Compiled routing serves every hub and the residue sweep finds only justified hits |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Deprecate and remove the cli-hermes executor and the .hermes runtime folder specification.

**Scope Boundary**: Derived artifacts: the compiled-routing closure and manifests, the compiled deep command contracts and the trigger index with its fixtures, then a repository-wide residue sweep.

**Dependencies**:
- Phases 1 and 2 finished every source edit

**Deliverables**:
- Compiled routing serving both affected hubs
- Fresh contracts and trigger index
- A residue sweep with every kept hit justified
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the source edits, three derived layers still carried Hermes: the compiled-routing closure fell back to legacy routing for two hubs, the compiled deep command contracts no longer matched their sources, and the trigger index still indexed deleted docs.

### Purpose
Regenerate every derived layer from its source and prove nothing live still names Hermes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
node .skilled/bin/compiled-route-status.cjs --hub cli-external-orchestration
before: servingAuthority legacy, causeCode stale-manifest
after: servingAuthority compiled, causeCode compiled-serving
node --test .skilled/bin/tests/compiled-route-*.test.cjs
before: 85 of 101 pass; after: 101/101
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sync the authored compiled-routing closure and re-mint the two hub manifests
- Regenerate the compiled deep command contracts
- Regenerate the trigger index and its fixtures
- Sweep the repository for remaining Hermes references

### Out of Scope
- The archived canary harness, which already fails on main on a stale `.opencode` path - it is not a gate for this change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/**` | Modify | Authored routing closure and manifests |
| `.skilled/bin/lib/compiled-routing/**` | Modify | Served routing mirror and manifests |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Regenerate | Deep command contracts |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and retrieval fixtures | Regenerate | Trigger index |
| `.skilled/hooks/session-relaunch/README.md`, relaunch playbook | Modify | Drop two dead spike links |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Compiled routing serves both affected hubs and the move simulation resolves every hub |
| REQ-002 | No live file outside `specs/` and released changelogs names the Hermes runtime without a stated reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The trigger index matches the corpus |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `compiled-route-sync.cjs --verify` prints move-simulation OK for all 7 hubs
- **SC-002**: `check-contract-drift.cjs` prints OK for 3 commands
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Authored routing closure under `specs/` | Served copies drift from authored files | Copy served edits back, then run the sync check |
| Risk | A kept hit hides a live reference | Low | List every kept hit with its reason |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase removes code and documentation and runs no service, so it sets no performance, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a hub whose sources did not change keeps its manifest.
- Maximum input: the trigger index rebuilds over the whole documentation corpus.
- Failure path: the sync refuses with MOVE-SIMULATION FAILED until manifests are re-minted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Derived artifacts plus a sweep |
| Risk | 10/25 | Routing serving state |
| Research | 8/20 | Tracing the routing build chain |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose full removal with no backup on 2026-11-07.
<!-- /ANCHOR:questions -->

---
