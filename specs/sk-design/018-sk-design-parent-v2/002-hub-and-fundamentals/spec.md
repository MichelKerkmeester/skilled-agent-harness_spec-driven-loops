---
title: "Feature Specification: Turn sk-design into a parent hub carrying one mode"
description: "The smallest possible hub, assembled from content the root already owns. Today sk-design is a standalone skill; its SKILL.md and references become a fundamentals mode, and the root becomes routing only. Doing this first turns every later step into adding a mode to a shipped hub."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Reinstate the sk-design parent hub

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
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 003-md-generator-as-mode |
| **Handoff Criteria** | The hub passes the class H gate and `sk-design-fundamentals` resolves with a non-empty leaf set, so a second mode can be added |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Reinstate sk-design as a parent hub and absorb chart, diagram and the md generator as its modes specification.

**Scope Boundary**: The `sk-design` skill root and the content moving down into `sk-design-fundamentals/`. No other skill is touched. What `016` retired stays retired: the interface mode, the `commands/interface/` surface and the design-taste layer.

**Dependencies**:
- The skill-root metadata contract, which defines the hub and standalone classes
- `016-deprecate-sk-design-interface`, whose hub decision this reverses and whose scope decisions it keeps
- Nothing else in this packet; this is the first step by construction

**Deliverables**:
- A class H `sk-design` root: `ROUTER.md`, `description.json`, `mode-registry.json`, `hub-router.json`
- `sk-design-fundamentals/` carrying the former root content as 28 renames
- `scratch/routing-baseline.txt`, the sixteen-phrase measurement taken before anything moved
- The one routing regression named and handed to phase 003 as an acceptance criterion

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-design` is a standalone skill: a 501-line `SKILL.md` at the root doing both the routing and the
work. A hub cannot be reached that way, because the class contract makes the two shapes mutually
exclusive rather than merely different.

Read from the canon, the split is exact. `description.json`, `mode-registry.json` and
`hub-router.json` are **required on a hub and forbidden on a standalone**.
`leaf-manifest.config.json` is the mirror: **required on a standalone and forbidden on a hub**.
`leaf-aliases.json` changes kind rather than presence, from required-and-generated to
optional-and-authored. So conversion is not "add some files"; it is a class change where four files
appear and one must be deleted.

### Purpose

`sk-design` classifies as a parent hub carrying exactly one mode, `sk-design-fundamentals`, built
entirely from content the root already owns. Nothing new is authored except the routing surface.

### Non-Goals

- Adding any mode other than fundamentals. Later children do that.
- Changing what the fundamentals content says. It moves; it is not rewritten.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### The class change, file by file

| File | Today (standalone) | After (hub) | Action |
|------|--------------------|-------------|--------|
| `SKILL.md` | the work and the routing | routing only | rewritten at root, content moved into the mode |
| `description.json` | forbidden, absent | required | author |
| `mode-registry.json` | forbidden, absent | required | author, one workflow mode |
| `hub-router.json` | forbidden, absent | required | author |
| `ROUTER.md` | absent | stage-two control | author, re-rooted one level down |
| `leaf-manifest.config.json` | required, present | **forbidden** | delete |
| `leaf-aliases.json` | required, generated | optional, authored | drop the generated one |
| `leaf-manifest.json` | required, generated | required, generated | regenerate |
| `graph-metadata.json` | the advisor identity | the hub identity | keep, unchanged |

### In Scope
- `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/`, `changelog/` moved into `sk-design/sk-design-fundamentals/`.
- The five routing surfaces authored at the root, and the one forbidden file deleted.

### Out of Scope
- Any other mode, and any change to what the fundamentals content says.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-fundamentals/` | Create | Today's root content, moved |
| `.opencode/skills/sk-design/SKILL.md` | Rewrite | Routing only |
| `.opencode/skills/sk-design/{description,mode-registry,hub-router}.json`, `ROUTER.md` | Create | The hub surface |
| `.opencode/skills/sk-design/leaf-manifest.config.json` | Delete | Forbidden on a hub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | `sk-design` classifies as a parent hub under the fleet metadata gate, carrying every hub-required file and none of the hub-forbidden ones. |
| REQ-002 | The two design phrases in the baseline still reach `sk-design` at or above their recorded scores. |
| REQ-003 | Stage two resolves `sk-design-fundamentals` with a non-empty leaf set. |
| REQ-004 | The move lands as one commit, so the shared branch never shows a root without its `SKILL.md`. |
| REQ-005 | Git records the moved content as renames, not delete-plus-add. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The parent-skill check names `sk-design` and passes.
- **SC-002**: The fleet metadata gate classifies `sk-design` as a hub with no forbidden file.
- **SC-003**: `what padding should this have` and `contrast ratio failure on this button` score at or above 0.82 and 0.95 respectively.
- **SC-004**: `git diff --find-renames` shows the fundamentals content as renames.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The root loses its `SKILL.md` mid-change | High: the gate discovers roots by that file, so the skill would vanish from the fleet | Move and author in one commit |
| Risk | A forbidden file survives the conversion | Medium: the gate rejects a hub carrying a standalone's config | The class table above is checked file by file before commit |
| Risk | Design requests stop arriving | High: no gate covers reachability | Replay the two design phrases against the recorded baseline |
| Dependency | The routing baseline | The only record of what must not regress | Captured before any move, in the parent's `scratch/` |
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
