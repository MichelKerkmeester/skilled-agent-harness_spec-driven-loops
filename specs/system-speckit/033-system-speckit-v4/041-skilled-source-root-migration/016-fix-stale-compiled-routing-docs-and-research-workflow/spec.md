---
title: "Feature Specification: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow"
description: "Correct the compiled-routing text that still describes seven hubs and the pre-rename directory layout, keep the resolver's authored source in step with its promoted copy, and stop the research workflows passing a validator rule that was retired."
trigger_phrases:
  - "stale seven hub text"
  - "compiled routing architecture correction"
  - "retired template headers rule"
  - "phase 16 stale docs"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-19 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-compiled-serving-admission-research |
| **Successor** | None |
| **Handoff Criteria** | No live file states a seven-hub cohort or names a pre-rename compiled-routing directory, both resolver copies are identical, and no research workflow passes a rule the validator lacks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the skilled source-root migration specification.

**Scope Boundary**: The stale text phase 15 found and the operator chose to fix on 2026-09-19, plus text of the same kind in the same files. Comments and documentation only, apart from four rule lists in two workflow files. No routing behaviour changes.

**Dependencies**:
- Phase 15 found the stale text and the retired rule.

**Deliverables**:
- Corrected compiled-routing comments, reference and phase 13 record.
- Research workflows that pass only rules the validator has.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Compiled routing serves five hubs, but four places still say seven: the resolver's cohort comment, the advisor's cohort comment, a test header, and the compiled-routing architecture reference. The reference also names directories that were renamed (`006-parent-hub-rollout`, `010-live-activation`, `011-runtime-engine`) and cites the dissolved sk-design hub as the model build. Phase 13 corrected the promoted resolver's comment without its authored source, so the next promotion would restore the old wording. Separately, both research workflows pass `TEMPLATE_HEADERS` to the validator, a rule retired in `fd33222d92b`; the validator rejects the whole rule list, so those checks never run as written.

### Purpose
Every live description of compiled routing matches the code, and every validator call in the research workflows runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The cohort comments in both resolver copies, the advisor flag module and the foundation test header.
- The compiled-routing architecture reference: hub count, current directory names, the retired model build, and the admission step, which now names the gold checker the operator chose on 2026-09-19 as planned, not built.
- The phase 13 implementation summary's seven-hub sentence.
- `TEMPLATE_HEADERS` in the rule lists of `deep-research-auto.yaml` and `deep-research-confirm.yaml`.

### Out of Scope
- Building the admission checker - a later phase.
- The seven spec-mutation audit events the append gateway refuses by design - the research workflows ask for rows the ledger schema deliberately pins, and deciding which side changes is the operator's.
- Eight system-spec-kit docs, playbook scenarios and test fixtures that still name `TEMPLATE_HEADERS` - same class, different owner; recorded for their own change.
- The stale text in closed spec records other than phase 13's summary - frozen history.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modify | Cohort comment |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs` | Modify | Same comment, so the two copies are identical again |
| `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Modify | Cohort comment and resolver path |
| `.skilled/bin/compiled-routing-foundation.vitest.ts` | Modify | Header comment |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | Modify | Hub count, paths, model build, admission step |
| `../013-clear-pre-existing-ci-and-doc-debt/implementation-summary.md` | Modify | Hub count |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modify | Drop the retired rule from four rule lists |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No routing behaviour changes: every compiled-routing test and the route guard pass as before. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | No live compiled-routing file states a seven-hub cohort or names a pre-rename directory. |
| REQ-003 | The two resolver copies are byte-identical. |
| REQ-004 | Every `SPECKIT_RULES` list in the two research workflows names only rules the validator has, and each runs. |
| REQ-005 | The compiled command contracts that digest these workflows stay current. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A search for the stale count and the renamed directories over the live tree finds nothing outside frozen history.
- **SC-002**: The workflows' rule lists run against a real spec folder and report a result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A resolver edit changes behaviour | High | Comment lines only; the route tests and guard run after |
| Risk | The workflow edit leaves a compiled contract stale | Med | Run the contract drift check and recompile if it reports drift |
| Dependency | The advisor's local build | Low | The flag module's change is a comment; rebuild only if the staleness check asks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime cost; the code changes are comments.

### Security
- **NFR-S01**: No private home-derived path in any tracked file.

### Reliability
- **NFR-R01**: The promoted resolver can be rebuilt from its source without losing a correction.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Closed spec records that say seven stay as written, except phase 13's summary, which this packet owns.

### Error Scenarios
- The validator rejects a rule list: the workflow step fails before it checks anything, which is the defect being fixed.

### State Transitions
- A later promotion copies the authored resolver over the runtime copy; after this phase that copy changes nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Eight files, comments and docs |
| Risk | 4/25 | No behaviour change |
| Research | 4/20 | Phase 15 found every item |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which side changes for the refused spec-mutation audit events: the ledger schema gains stems for them, or the spec-check protocol stops requiring them?
<!-- /ANCHOR:questions -->

---
