---
title: "Feature Specification: Phase 13: shadcn-reference-research"
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
# Feature Specification: Phase 13: shadcn-reference-research

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
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/013-shadcn-reference-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-chart-hover-and-pointer-states |
| **Successor** | 014-shadcn-adoptions |
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
| REQ-001 | Six angles are answered in order, one iteration each, against the frozen corpus at `scratch/shadcn/` and the shipped corpus under `.opencode/skills/sk-design/sk-design-chart/`, with every claim cited to a file and line |
| REQ-002 | Every finding is sorted into implementable today, needs a corpus change, or per-template judgement, and every shadcn decision carries a verdict: adopt the idea, keep ours, or eliminate with a reason |
| REQ-003 | No angle wraps, vendors or ports Recharts, and no template or checker rule changes in this phase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Colour is compared by measurement, not adjectives: adjacent hue gap, contrast on both grounds and simulated colour-vision deficiency separation for both palettes |
| REQ-005 | Findings that need a browser to prove are reported as unknown rather than inferred from source |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` holds one section per angle, six in total, each closing with ranked decisions tagged implementable today or needs a corpus change.
- **SC-002**: A successor phase exists that takes the implementable decisions as its scope, so the research is consumed rather than filed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The frozen corpus at `scratch/shadcn/` | An angle cannot cite what it claims | Re-extract with the `gh api` commands recorded in section 3 |
| Risk | An angle drifts toward wrapping Recharts, which the corpus checker forbids outright | Med | Section 3 names it a constraint rather than a trade-off, and angle 6 sorts every finding into enforceable or judgement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each angle is one bounded iteration under the twelve-call cap the research loop enforces.

### Security
- **NFR-S01**: The frozen corpus stays under `scratch/`, gitignored; upstream source is read and never vendored into the skill.

### Reliability
- **NFR-R01**: Every claim cites a file and line so a reader can re-verify it against the frozen copy.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an angle whose evidence is absent reports the absence, as angle 3 did for the browser walk.
- Maximum length: the 70-file corpus is classified by form, never enumerated file by file.

### Error Scenarios
- External service failure: none; the corpus is local and frozen.
- Network timeout: not applicable; nothing is fetched.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 71 read, 1 written; Systems: 1 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N |
| Research | 18/20 | Six angles, measured colour comparison |
| Multi-Agent | 5/15 | One lineage |
| Coordination | 6/15 | Depends on siblings 007 and 008 |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An angle counts shadcn's 70 files as 70 forms and concludes the corpus is 44 short | M | M | Section 3 names the miscount; angle 1 classifies by reader question |
| R-002 | Runtime claims are made without a browser | M | H | Angle 3 and 6 report browser-dependent behaviour as unknown |

---

## 11. USER STORIES

### US-001: Know what to adopt (Priority: P0)

**As a** chart-corpus maintainer, **I want** each shadcn decision judged against ours with evidence, **so that** the next phase implements ideas and not preferences.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Know what stays (Priority: P1)

**As a** chart author, **I want** the deliberate omissions (radar, pie, natural curves) recorded with their reasons, **so that** a future request for them meets a documented answer.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

Carried into `014-shadcn-adoptions` as operator decisions, since each needs a policy before a checker assertion means anything:

- Which candidate forms does the product demand, rather than shadcn's variant inventory suggest?
- Which colour-vision-deficiency model and threshold should become policy, if any?
- Do focus order, Enter/Space handlers, pointer reach and card values pass at runtime once a browser is available?
- Is semantic metadata worth its maintenance cost for domain, curve, null and tick checks and for arbitrary retargeting?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



