---
title: "Feature Specification: Move chart and diagram from sk-doc to sk-design"
description: "Two packets leave a documentation hub for a design hub, and both hubs change in one commit because a router signal naming a packet that is not on disk fails whichever hub is wrong. The step that decides whether the restructure was worth doing."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Chart and diagram as sk-design modes

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 003-md-generator-as-mode |
| **Successor** | 001-sk-create-chart |
| **Handoff Criteria** | The chart skill lives under `sk-design`, so its spec packet can be filed there |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Reinstate sk-design as a parent hub and absorb chart, diagram and the md generator as its modes specification.

**Scope Boundary**: Both hubs. `sk-doc` is not a bystander: its registry rows, router signals, vocabulary and prose counts change in the same commit. The `sk-create-` prefix is deliberately not renamed.

**Dependencies**:
- `002-hub-and-fundamentals` and `003-md-generator-as-mode`, in that order
- The `sk-doc` hub, which loses two modes in the same commit
- The advisor daemon and the `sk-doc` compiled routing, both of which serve stale answers until refreshed by name

**Deliverables**:
- `sk-design/sk-create-chart/` and `sk-create-diagram/`, 249 files moved as renames
- Both hubs class H in one commit, with registry rows, router signals, vocabulary and prose counts moved together
- Eleven `intent_signals` that fix four phrases which reached nobody at baseline
- `check-corpus.cjs --render` printing `RESULT: PASSED` from the new location

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-create-chart` and `sk-create-diagram` live in a documentation hub whose other thirteen modes
produce prose. They produce visual artefacts judged by design criteria. That mismatch is the whole
argument for this packet: without these two, the design hub is the two-mode shape that was
deliberately deleted in August.

### The measured surface

Both hubs must change together. `sk-doc` mentions the two packets across eight routing surfaces,
`ROUTER.md` most heavily at 139 hits. Sixteen files outside either hub carry a live path, including
the markdown agent in four runtime mirrors, six command assets, two command entry documents, and a
runtime hook that routes post-edit quality checks.

### Purpose

A request for a chart or a diagram reaches `sk-design`. `sk-doc` no longer claims either, and no
commit in between leaves a router signal pointing at a packet that is not on disk.

### Non-Goals

- Renaming either packet. `sk-create-chart` keeps its name inside `sk-design`; a prefix rename would
  double the rewrite across four mirrors, the scorer shim, the bridges and the canaries.
- Fixing the inherited long-phrase weakness, where task-shaped chart phrasings reach nobody.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Why one commit

A router signal whose packet is absent fails the owning hub. Editing `sk-doc` and `sk-design` in
separate commits leaves the shared branch broken in between, and other sessions write here.

### In Scope
- Both packets moved to `.opencode/skills/sk-design/`.
- `sk-doc`: registry rows, router signals and vocabulary, tie-break order, ROUTER.md intents and
  resource maps, graph vocabulary, description keywords and prose, SKILL.md mode table and its
  count, command metadata, leaf manifest.
- `sk-design`: the mirror of all of the above, gaining what `sk-doc` loses.
- The sixteen live path references.

### Out of Scope
- Historical records under `specs/`.
- The two retrieval fixtures shared with another session's in-flight work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-{chart,diagram}/` | Move | To `sk-design/` |
| `.opencode/skills/sk-doc/*` routing surfaces | Modify | Both packets removed |
| `.opencode/skills/sk-design/*` routing surfaces | Modify | Both packets declared |
| 16 live files outside both hubs | Modify | Path rewritten |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | The chart and diagram phrases that reached `sk-doc` at baseline reach `sk-design` after the cutover, above the 0.8 bar. |
| REQ-002 | `sk-doc` no longer claims either, and its own control phrases are unchanged. |
| REQ-003 | Both hubs pass the fleet metadata gate in the same commit. |
| REQ-004 | The chart corpus checker still prints `RESULT: PASSED` from the skill's new location. |
| REQ-005 | Both packets move as renames. |
| REQ-006 | The advisor is rebuilt and its generation observed to move before any routing claim is made. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `create a chart`, `chart template`, `sk-create-chart` and `make a diagram` name `sk-design`.
- **SC-002**: `write a readme`, `build a feature catalog` and `create a repo rule file` still name `sk-doc`.
- **SC-003**: Fleet gate clean with both hubs class H.
- **SC-004**: The chart corpus checker green from the new path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | One hub edited without the other | High: a signal naming an absent packet fails a hub on the shared branch | One commit, both sides, verified before staging |
| Risk | The chart corpus checker breaks on the new path | High: it is the proof that a night of chart work still stands | Run it from the new location before committing |
| Risk | A runtime hook keeps a dead path | Medium: post-edit quality routing would silently stop matching | The hook is in the sixteen and is rewritten with them |
| Dependency | `003-md-generator-as-mode` | The hub these packets join | Complete, commit `fa35e09653` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
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
