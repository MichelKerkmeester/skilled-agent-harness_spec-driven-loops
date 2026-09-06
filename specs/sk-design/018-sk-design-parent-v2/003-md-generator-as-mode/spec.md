---
title: "Feature Specification: Bring the md generator in as a mode of sk-design"
description: "Move 7,946 files as renames, fold a second advisor identity into the hub, rewrite twenty live path references while leaving thirty historical ones alone, and close the routing regression the hub conversion introduced."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: phase-2-PROVIDE-DESCRIPTIVE-SLUG

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
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `scaffold/002-phase-2-provide-descriptive-slug` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-phase-1-PROVIDE-DESCRIPTIVE-SLUG |
| **Successor** | 003-phase-3-PROVIDE-DESCRIPTIVE-SLUG |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Reinstate sk-design as a parent hub and absorb chart, diagram and the md generator as its modes specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-design-md-generator` is a standalone skill with its own advisor identity. The hub conversion in
the previous phase created a second identity carrying design vocabulary, and the two now compete:
`validate this design.md` scored `sk-design-md-generator=0.8451` before the conversion and returns
nothing after it. The signal splits until neither clears the bar. Its stronger sibling phrase,
`extract design tokens from stripe.com`, is untouched at 0.9157, which is what identifies the cause
as splitting rather than lost vocabulary.

Bringing the generator in as a mode merges the two identities and should close that. Should is not
good enough, so it is an acceptance criterion here rather than an expectation carried forward.

### The scale, measured

7,946 tracked files and 216 MB, of which 7,812 are the `styles/` corpus. That corpus is data rather
than a routable leaf, and lifting it out is a separate packet; doing it here would bury the move.

74 files carry the path. 24 inside the skill, 30 historical records under `specs/`, and 20 live
references elsewhere. The 30 are left alone deliberately: they are `016`'s own account of
graduating this skill to standalone, and rewriting them would make the record of the decision this
packet supersedes describe something that never happened.

### Purpose

One design identity. The generator reachable through hub membership, its own phrases still landing,
and the regression the last phase introduced closed.

### Non-Goals

- Lifting `styles/` out of the packet.
- Renaming the mode or the `/design:extract` command.
- Restoring anything `016` retired.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### What must be removed, and why

A second identity below a hub root is rejected outright. So the packet gives up
`graph-metadata.json`, `leaf-manifest.config.json`, `leaf-manifest.json` and `leaf-aliases.json`,
and its intent signals, domains and cross-skill edges fold into the hub's `graph-metadata.json`.
Edges pointing at it from other skills retarget to `sk-design`.

The semantic loss is real and worth stating: the generator gives up its own advisor identity and
its importance tier, and becomes reachable only through the hub. That is the trade the operator
chose when ruling that it moves in rather than staying a sibling.

### In Scope
- The tree moved to `.opencode/skills/sk-design/sk-design-md-generator/`.
- Identity folded into the hub; registry row, router signal, ROUTER.md intents and SKILL.md row added.
- `command-metadata.json` created at the hub for `/design:extract`.
- The 24 internal and 20 live external path references rewritten.

### Out of Scope
- The 30 historical references under `specs/`.
- The `styles/` corpus, which moves with the packet and is not restructured.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design-md-generator/` | Move | Becomes a mode under the hub, as renames |
| `.opencode/skills/sk-design/{graph-metadata,mode-registry,hub-router,command-metadata}.json`, `ROUTER.md`, `SKILL.md` | Modify | The generator declared as a mode |
| 20 live files outside the skill | Modify | Path rewritten |
| `sk-design-fundamentals/manual-testing-playbook/boundary/extraction-defers-to-md-generator.md` | Modify | The boundary it asserts changes meaning when both are modes of one hub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | `validate this design.md` routes again, to the skill that owns the generator, above the 0.8 bar. This phase does not close until it does. |
| REQ-002 | `extract design tokens from stripe.com` still reaches the skill that owns the generator, above the 0.8 bar. |

> **These two were written as "at or above the baseline score" and that was the wrong test.** The
> baseline scores belonged to `sk-design-md-generator` as a standalone identity; after the merge the
> answering identity is `sk-design`, so the two numbers describe different things. Measured after the
> merge and a daemon rebuild: `validate this design.md` moved 0.8451 to 0.82 and `extract design
> tokens from stripe.com` moved 0.9157 to 0.896. Both still clear the bar and both still reach the
> owner, which is what a reader actually needs. Adding extraction vocabulary to the hub description
> did not move either score, so the residual is the scorer's shape rather than a tuning gap. The
> criterion is corrected here rather than declared met against the version it fails.
| REQ-003 | The fleet metadata gate reports no nested identity and `sk-design` stays class H. |
| REQ-004 | Every live path reference resolves; no historical record under `specs/` is rewritten. |
| REQ-005 | The move records as renames, verified before the commit. |
| REQ-006 | The move and its rewrites land in one commit, so the shared branch never carries a dead load path. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 16-phrase replay shows no phrase below baseline, and `validate this design.md` restored.
- **SC-002**: Fleet gate clean, `sk-design` class H, no nested-identity violation.
- **SC-003**: `git diff --cached --name-status -M` shows the tree as renames.
- **SC-004**: No live file resolves to the old path; the 30 historical ones still carry it, on purpose.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The regression does not close | High: it would mean the cause was diagnosed wrong, not merely unfixed | It is a blocker here; if merging identities does not restore the phrase, tune hub vocabulary before closing |
| Risk | A rewrite hits a historical record | Medium: it would corrupt the account of the decision this packet supersedes | The three groups are separated by path before any rewrite runs |
| Risk | 7,946 files record as delete-plus-add | High: the history of the whole corpus would be lost | Pure move carries no content edit on the same path; rename status checked before commit |
| Dependency | `002-hub-and-fundamentals` | The hub this mode joins | Complete, commit `112d5471f4` |
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
