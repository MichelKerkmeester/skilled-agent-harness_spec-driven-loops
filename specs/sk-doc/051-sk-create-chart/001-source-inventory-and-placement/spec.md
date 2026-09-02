---
title: "Feature Specification: Phase 1: source-inventory-and-placement"
description: "The clone is 124 files across three chart families, a colour system and two validators. Nothing yet says which of those files belong here, and the packet cannot be shaped until one question is answered: is this a mode under the documentation hub, or a standalone skill?"
trigger_phrases:
  - "chart source inventory"
  - "lieflat placement decision"
  - "mode or standalone skill"
  - "adoption inventory"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: source-inventory-and-placement

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A read-only phase. Every file in the source clone gets a disposition, and the placement question gets an answered-with-evidence verdict rather than an assumption. Nothing is written into the skills tree, so a wrong answer here costs nothing until phase 3 acts on it.

**Key Decisions**: Mode under sk-doc versus standalone skill, and whether the 18M of documentation images cross over at all

**Critical Dependencies**: The source clone, already fetched to scratch

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-translation-and-voice |
| **Handoff Criteria** | Every source file is classified as port, translate, adapt or drop, with a reason recorded for each drop, and the placement decision names the option that lost |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Bring the lieflat-charts skill into this repository as sk-create-chart specification.

**Scope Boundary**: Read and record only. No file is created, moved or edited outside this packet.

**Dependencies**:
- The `lieflat-charts` clone in scratch, which is the only copy of the source this packet reads

**Deliverables**:
- A per-file inventory with a disposition and a reason
- A placement decision, stated as a decision, with the rejected option and why it lost
- A character census recording where the Chinese text actually is

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The source repository is already shaped like a skill. It has a `SKILL.md`, a README, a catalog, agents, docs, examples, scripts and 51 templates. That shape is a trap, because it looks close enough to ours to invite a copy, and it is not ours.

Two things have to be settled before anything moves. Which files come across, since 18M of the 38M clone is documentation imagery and a chart skill may or may not need it. And where the result lives, since the name suggests a mode under the documentation hub while the subject sits further from documentation than any current sibling.

### Purpose

Every source file has a recorded disposition, and the placement question has an answer with the evidence that produced it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A file-by-file inventory of the clone, each row carrying port, translate, adapt or drop
- A character census locating the Chinese text, by file and by count
- The placement decision, compared against the existing documentation-hub modes on size and on subject distance
- The source licence and provenance, recorded once so a later reader does not have to go looking

### Out of Scope

- Any write into `.opencode/skills/`. This phase is read only, which is what makes a wrong answer cheap
- Translation. Phase 2 owns that, and doing it here would mix a decision with an execution
- Judging the charts themselves. Whether a template is good is not this packet's question

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| specs/sk-doc/051-sk-create-chart/001-source-inventory-and-placement/research/inventory.md | Create | The per-file dispositions and the character census |
| specs/sk-doc/051-sk-create-chart/001-source-inventory-and-placement/decision-record.md | Create | The placement decision and the option it beat |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every file in the clone is classified as port, translate, adapt or drop. A drop carries a one-line reason. |
| REQ-002 | The placement decision names the documentation-hub modes it was compared against, with their file counts and their subject. |
| REQ-003 | The character census reports Chinese character counts per file, so phase 2 knows its own size before it starts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The source licence and upstream commit are recorded, so the provenance of ported content stays traceable. |
| REQ-005 | The disposition of the 57 binary assets is decided explicitly rather than by default. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh scan of the clone returns the same file count as the inventory, and no file is unclassified.
- **SC-002**: The decision record states the losing option and the reason it lost, not only the chosen one.
- **SC-003**: The character census total matches a fresh count run over the same files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The source clone in scratch | Scratch is session-scoped and can be cleared | Record the upstream URL and commit so the clone can be refetched |
| Risk | Placement decided by the skill name rather than by evidence | High. Phase 3 builds the wrong shape and phase 5 wires it into the wrong hub | Require the comparison table before the decision, not after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. This phase produces documents, and no runtime path changes.

### Security
- **NFR-S01**: The clone is third-party code. Read it, do not execute anything from it during inventory.

### Reliability
- **NFR-R01**: The inventory has to be reproducible. A second scan by a different reader returns the same counts.

---

## 8. EDGE CASES

### Data Boundaries
- A file that is neither text nor a known binary asset gets its own disposition rather than being folded into a bucket.
- An empty file still gets a row, because a silently skipped file is how a count goes wrong.

### Error Scenarios
- The clone is missing or partial: refetch from the recorded upstream rather than inventorying what is there.
- A file's encoding defeats the character census: record it as unknown with the reason, and let phase 2 handle it by hand.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 124 read, 2 written. No runtime surface touched. |
| Risk | 4/25 | Auth: N, API: N, Breaking: N. Read-only phase. |
| Research | 16/20 | The placement question is genuinely open and needs comparison work. |
| Multi-Agent | 4/15 | Workstreams: 1. |
| Coordination | 8/15 | Dependencies: every later phase reads this one's output. |
| **Total** | **44/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Placement chosen from the skill name rather than from evidence | H | M | Comparison table required before the verdict |
| R-002 | A file slips through unclassified and surfaces in phase 4 with no owner | M | M | Count reconciliation against a fresh scan |
| R-003 | The documentation imagery is ported by default because dropping it felt like a loss | M | H | Force an explicit decision on the binary assets |

---

## 11. USER STORIES

### US-001: The placement verdict (Priority: P0)

**As a** phase 3 implementer, **I want** to know whether I am building a hub mode or a standalone skill, **so that** I build the right shape once instead of the wrong shape twice.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The translation size (Priority: P1)

**As a** phase 2 implementer, **I want** to know how much Chinese text there is and where, **so that** I can size the work before starting rather than discovering it midway.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Do the 57 binary assets come across at all? They are 18M of documentation imagery, and a chart skill may be better served by a handful of representative shots.
- If placement lands on standalone, does the skill still answer to the documentation hub's advisor vocabulary, or does it get its own identity?
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
