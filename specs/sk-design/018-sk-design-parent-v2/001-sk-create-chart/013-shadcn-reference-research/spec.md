---
title: "Feature Specification: Phase 1: shadcn-reference-research [template:level-3/spec.md]"
description: "Six research angles against a frozen local copy of shadcn's 70 charts, asking what transfers to a standalone-HTML corpus that bans React, Recharts and Tailwind outright. Decisions transfer, code never."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: shadcn-reference-research

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

shadcn ships 70 charts built on React, Recharts v3 and Tailwind. Our corpus is 26 standalone HTML forms enforced by 31 checks, one of which errors on any external reference at all. Nothing ports, so the question is which of shadcn's *decisions* our corpus should adopt: its single config surface, its tooltip contract, its oklch colour ramp, and its defaults at the points where a chart can mislead.

**Key Decisions**: extraction is deterministic and runs before any iteration, so every angle reads one frozen corpus rather than re-fetching; an angle that drifts toward wrapping Recharts has failed.

**Critical Dependencies**: none external. The corpus is already extracted to `scratch/shadcn/`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/013-shadcn-reference-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-chart-hover-and-pointer-states |
| **Successor** | None |
| **Handoff Criteria** | Six angles answered with cited evidence, each finding sorted into enforceable or judgement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the shadcn chart reference research specification.

**Scope Boundary**: research only. No template is rebuilt and no checker rule is added by this phase; it produces the findings a later phase would implement.

**Dependencies**:
- The frozen corpus at `scratch/shadcn/` (70 charts plus `chart.tsx`, extracted 2026-09-07)
- Siblings `007-fidelity-and-library-research` and `008-evilcharts-reference-research`, which are the same kind of work and must not be repeated

**Deliverables**:
- `research/research.md`, one section per angle, every claim cited to a file
- A sorted list: findings enforceable in `check-corpus.cjs` versus findings that stay per-template judgement

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our 26 chart forms were authored without reference to how the most-used open chart library in the same design tradition solves the same problems. shadcn has made explicit decisions about the author's edit surface, the tooltip contract, colour and the defaults at every point where a chart can mislead, and we do not know which of ours are considered choices and which are simply what got written first.

### Purpose
Know which of shadcn's decisions our corpus should adopt, and which of ours are already better, with evidence for both.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Six angles, one per iteration, in order.

1. **Catalog delta, form versus variant.** Classify all 70 into distinct forms versus restyles of a form the 26 already carry, naming the reader question each distinct form answers. The corpus is radar 14, pie 11, line 10, bar 10, area 10, tooltip 9, radial 6, and the area family alone is default/axes/gradient/icons/interactive/legend/linear/stacked/stacked-expand/step, of which two are distinct forms. A naive count concludes we are missing 44 charts and is wrong. Radar at 14 entries is where the miscount will be worst.
2. **Adjustability, the config surface.** One `ChartConfig` object maps a series key to label, icon, colour or per-theme colour, and everything downstream reads `var(--color-<key>)`. Count the distinct edit sites needed to retarget one of our templates today, then decide whether a single adjustment point is reachable within our constraints.
3. **Hover, tooltip and the pointer contract.** `ChartTooltipContent` decides `indicator` dot/line/dashed, `hideLabel`, `hideIndicator`, `labelFormatter`, `formatter`, `nameKey` and `labelKey`, all of which we leave per template. Decide which belong in corpus-wide contract. Separately compare Recharts' `accessibilityLayer` against our `role="img"` plus mandatory `data-chart-table`, with an actual keyboard walk.
4. **Colour, measured not admired.** Compare shadcn's five oklch ramp tokens with light/dark pairs against our palette on adjacent-hue distinguishability, contrast against both grounds, and the three common colour-vision deficiencies.
5. **Data accuracy, where charts lie.** Axis domain and zero baseline, stacking order, curve interpolation, null and gap handling, tick generation. Establish what the 70 do, what our 26 do, and where either default draws a picture the data does not support.
6. **What the checker learns.** Sort every finding into enforceable in `check-corpus.cjs` versus per-template judgement, naming the assertion and what it errors on.

### Out of Scope

- Wrapping, vendoring or porting Recharts. `checkNoExternalResources` errors on any external reference, so this is not a trade-off to weigh, it is a constraint.
- Rebuilding any template. This phase produces findings; a later phase implements them.
- Re-running what siblings 007 and 008 already established.
- Adjectives in place of measurement, particularly in angle 4.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | One section per angle, every claim cited |
| `scratch/shadcn/` | Created | Frozen corpus, gitignored: upstream source is read, never vendored |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | [Requirement description] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | [Requirement description] |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
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
