---
title: "Feature Specification: Phase 53: retire-unproven-features"
description: "Spec-track narrowing, routing clarify default and alignment folder suggestion never earned a keep. The operator retired all three, so their scorers, tests, catalog entries, playbook scenarios and every other mention outside spec folders are removed."
trigger_phrases:
  - "retire unproven jev features"
  - "remove track narrowing scorer"
  - "remove clarify default scorer"
  - "remove folder suggestion scorer"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 53: retire-unproven-features

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 53 of 53 |
| **Predecessor** | 052-unproven-feature-proof |
| **Successor** | None |
| **Handoff Criteria** | No file outside `specs/` names the three retired features, and every suite holds its baseline less the deleted tests |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 53** of the cli-jev workflow integration packet. Phase 52 retested folder suggestion and it stopped on margin. Spec-track narrowing and clarify default stayed unproven, each needing months of data collection. The operator chose to retire all three.

**Scope Boundary**: Files outside `specs/` only. Spec folders keep the full record, including phase 52's proof plan.

**Dependencies**:
- Phase 52's commits, which this phase partly reverts

**Deliverables**:
- The three scorers and their tests deleted
- Their catalog entries, playbook scenarios, README and skill mentions removed
- The keep-rule gates in `scorer-report.mjs`, used only by these scorers, removed
- Their packet changelog entries withdrawn in place

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository ships measurement tooling for three features that never beat their baselines. Their docs present them as available, and the shared scorer kit carries gates nothing else uses.

### Purpose
Nothing outside spec folders describes or runs the three retired features, and every kept feature still works.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `score-track-narrowing.mjs`, `score-clarify-default.cjs`, `score-alignment-suggestion.ts` and their tests
- Delete their feature catalog entries and playbook scenarios, and fix the catalog and playbook indexes
- Remove their mentions from skill READMEs, `SKILL.md` files and folder READMEs
- Remove the keep-rule gates from `scorer-report.mjs` and their tests
- Withdraw or trim seven packet changelog entries
- Regenerate the Hermes copies, the trigger index and the README baselines

### Out of Scope
- Spec folders - they keep the record by design
- Recorded runs under `~/.skilled/.labels/` - they sit outside the repository
- `leaf-route-replay.cjs`, the injection screen and the other proven features - they stay

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/**` | Delete and modify | Two scorers, two tests, three READMEs |
| `.skilled/skills/system-spec-kit/{feature-catalog,manual-testing-playbook}/**` | Delete and modify | Two entries, two scenarios, two indexes |
| `.skilled/skills/sk-doc/**` | Delete and modify | One scorer, its test, one entry, one scenario, indexes and READMEs |
| `.skilled/skills/cli-classifier/**` | Modify | Keep-rule gates, catalog, measurement doc, READMEs |
| Seven packet changelogs | Modify | Withdrawn or trimmed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No file outside `specs/` names the three retired scorers or features, apart from unrelated fixture text that a reader would not take for a feature |
| REQ-002 | Every kept suite passes, with counts lower only by the deleted tests |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Catalog and playbook indexes, counts and ID ranges stay consistent after the removals |
| REQ-004 | Every edited Markdown file passes `validate_document.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A repository grep outside `specs/` for the retired names finds only the declared exceptions.
- **SC-002**: The suite rerun matches baseline less the deleted tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A kept module imports a deleted one | A kept suite breaks | Grep for imports first and rerun every suite |
| Risk | A shared kit helper is still used elsewhere | The injection screen scorer breaks | Remove only the keep-rule gates and grep each export first |
| Dependency | Generated mirrors and indexes | Stale copies keep the old names | Regenerate Hermes, the trigger index and README baselines |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Removal only.

### Security
- **NFR-S01**: No credential or session text is touched.

### Reliability
- **NFR-R01**: Every removal is a tracked deletion, so one revert restores it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A changelog entry that only described a retired feature is withdrawn in place, so version numbers stay whole.
- A mixed entry keeps its kept text and loses only the retired part.

### Error Scenarios
- A grep hit inside generated files is cleared by regeneration, never by hand.

### State Transitions
- Phase 52's spec folder keeps its record unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 40 files across three skills |
| Risk | 6/25 | Removal of tooling no live path uses |
| Research | 2/20 | Inventory by grep |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
