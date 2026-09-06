---
title: "Feature Specification: Close every gate this packet left red"
description: "The closing phase measured the fleet and found two gates red. `sk-doc`'s typed-gold playbook gate fails on four fixtures asserting `sk-doc` owns FLOWCHART, which the cutover made false. A compiled-routing scenario has no pass/fail criteria at all and"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Close every gate this packet left red

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Four failures, four different causes, none of them large. Three playbook fixtures move to a
`sk-design` hub playbook that this phase creates; the fourth is cross-hub and is moved with them and
repointed to a pair the design hub actually owns. A compiled-routing scenario gains the pass/fail
criteria it never had. Two spec documents get a closed anchor and a filled frontmatter field.

**Key Decisions**: create the sk-design hub playbook the fixtures need rather than delete them; repoint the cross-hub fixture rather than retire it, on operator instruction

**Critical Dependencies**: the mode rename in the preceding phase, so the fixtures move once and land on their final names

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | `006-design-mode-and-command-rename` |
| **Successor** | `008-fundamentals-beyond-ui` |
| **Handoff Criteria** | No gate this packet touched is red, and anything left failing has a named owner in writing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the design command surface and inherited failure closure specification.

**Scope Boundary**: `sk-doc`'s hub playbook and its index, a new `sk-design` hub playbook, one compiled-routing scenario,
and two spec documents in the router-unification packet. No routing metadata changes; no mode moves.

**Dependencies**:
- `006-design-mode-and-command-rename`: the fixtures should land on the renamed modes, not be moved twice
- The per-hub design of the typed-gold gate, which is why a cross-hub fixture validates nowhere
- The benchmark reports of 2026-07-21, which key results to the scenario ids being moved

**Deliverables**:
- A `sk-design` hub playbook carrying the three pure FLOWCHART fixtures, moved as renames
- The cross-hub fixture moved and repointed to a pair the design hub owns
- `sk-doc`'s playbook index corrected, with its scenario ranges and FLOWCHART rows updated
- Pass/fail criteria written for the compiled-routing scenario that has none
- A closed anchor and a filled frontmatter field in the two failing spec documents

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The closing phase measured the fleet and found two gates red. `sk-doc`'s typed-gold playbook gate
fails on four fixtures asserting `sk-doc` owns FLOWCHART, which the cutover made false. A
compiled-routing scenario has no pass/fail criteria at all and has been failing since before this
packet began. Two children of the router-unification packet fail on a malformed anchor and an empty
required frontmatter field. None of these is hard; all four were left because the fix crossed a scope
or ownership line that the phase measuring them could not cross alone.

### Purpose
No gate this packet touched is red, and nothing is left failing without a named owner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Moving four fixtures out of `sk-doc`'s hub playbook into a new `sk-design` one
- Repointing the cross-hub fixture so it validates under the hub it lands in
- Writing the missing pass/fail criteria for the compiled-routing scenario
- Repairing the malformed anchor and the empty frontmatter field

### Out of Scope
- Re-baselining `sk-doc`'s routing benchmark - the reports of 2026-07-21 stay as written, because they
  record what was measured then
- Any change to routing metadata, mode registries or hub routers - the preceding phase owns those
- The remaining warnings in `skill_graph_validate`, which are symmetry and weight-band advice rather
  than errors, and predate this packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/manual-testing-playbook/holdout/flowchart-natural.md` | Rename | Moves to the design hub's playbook |
| `.opencode/skills/sk-doc/manual-testing-playbook/holdout/ind-flowchart.md` | Rename | Same |
| `.opencode/skills/sk-doc/manual-testing-playbook/resource-loading/assets-only.md` | Rename | Same |
| `.opencode/skills/sk-doc/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | Rename + Modify | Moves, and its cross-hub pair is repointed |
| `.opencode/skills/sk-design/manual-testing-playbook/` | Create | The hub playbook the fixtures need |
| `.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index rows and scenario ranges |
| `.opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md` | Modify | Gains pass/fail criteria |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/010-learning-overlay/implementation-summary.md` | Modify | Empty required frontmatter field |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/023-sk-design-dissolution-routing-reactivation/decision-record.md` | Modify | Orphaned closing anchor |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `validate-playbook-topology --strict` passes on both hubs. |
| REQ-002 | `validate-compiled-routing-scenarios --strict` passes on `sk-doc`. |
| REQ-003 | Both failing children of the router-unification packet validate under `--strict`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every moved fixture records as a rename, so the benchmark reports of 2026-07-21 still resolve to a file with the same id. |
| REQ-005 | `sk-doc`'s playbook index describes the corpus it actually holds, including its scenario ranges. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate-playbook-topology --strict` exits 0 for `sk-doc` and for `sk-design`.
- **SC-002**: `validate-compiled-routing-scenarios --strict` exits 0 for `sk-doc`.
- **SC-003**: `validate.sh --strict` on the router-unification packet reports 25 of 25 folders passing, against 23 of 25.
- **SC-004**: `git diff --cached --name-status -M` shows the four fixtures as renames.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The typed-gold gate's per-hub design | A cross-hub fixture validates under neither hub | Repoint it to a pair the receiving hub owns |
| Dependency | The benchmark reports of 2026-07-21 | They key results to scenario ids | Keep the ids; move the files as renames |
| Risk | Repointing the cross-hub fixture changes what it tests | Medium | Record the change in the fixture and in the decision record, so a reader of the old reports is not misled |
| Risk | Creating a hub playbook adds a surface nobody runs | Medium | Name the invocation in the playbook index so it is discoverable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target; these are static fixtures and documents.

### Security
- **NFR-S01**: No credential, dependency or network call is added.

### Reliability
- **NFR-R01**: Every repaired gate is re-run and its output read, not its exit code trusted.

---

## 8. EDGE CASES

### Data Boundaries
- A fixture whose id appears in a published report: the id is kept, so the report still resolves.
- A fixture that validates under neither hub: repointed, and the change recorded where a reader will find it.

### Error Scenarios
- A gate that exits 0 while printing a failing verdict: `--strict` is used, and the output is read.
- A repair that fixes one gate and breaks another: every gate is re-run after every repair, not once at the end.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 9/25 | Files: 4 fixtures moved, 5 documents edited, 1 directory created |
| Risk | 8/25 | Auth: N, API: N, Breaking: one fixture changes what it tests |
| Research | 5/20 | The causes are already diagnosed in the closing phase |
| Multi-Agent | 2/15 | Single workstream |
| Coordination | 8/15 | Depends on the rename landing first so fixtures move once |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A moved fixture no longer matches the report that references its id | M | M | Move as renames and keep every id |
| R-002 | The repointed fixture misleads a reader of the 2026-07-21 reports | M | M | Record the change in the fixture itself and in the decision record |
| R-003 | The new hub playbook is never run by anyone | M | L | Name its invocation in the index |

---

## 11. USER STORIES

### US-001: Every gate this packet touched is green, or has a named owner in writing (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A reader of an old benchmark report can still find the fixture it names (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Which pair the repointed cross-hub fixture should model. `sk-design-chart` versus
  `sk-design-diagram` is a real ambiguity a reader could plausibly produce, and both are modes of the
  receiving hub, but the choice should be measured rather than asserted.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

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
