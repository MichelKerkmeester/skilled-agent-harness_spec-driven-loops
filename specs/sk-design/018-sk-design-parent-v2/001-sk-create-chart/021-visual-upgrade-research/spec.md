---
title: "Feature Specification: deep research on the external reference library for visual upgrades"
description: "Two parallel five-iteration deep-research lineages, GPT-5.6 Luna via codex and GLM-5.3-Flash via pi over DevPass, judge the chart corpus against the external reference library across five visual angles and rank what to upgrade in templates, assets and the chart skill."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: deep research on the external reference library for visual upgrades

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 20 built a library of 52 page captures and 210 zoomed chart crops from outside sources. This phase asks two independent models to compare our 26 forms against it, five angles each, and to rank what should change. The output is findings; a later phase implements.

**Key Decisions**: two lineages on different model families so the findings can be cross-checked; `max-iterations` stop policy so neither lane converges early; the same five-angle brief for both.

**Critical Dependencies**: the phase 20 library on disk; codex and pi reachable; the fan-out runner.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The corpus has been upgraded against one reference, shadcn, and re-based on the cursor register. The library now holds Vercel, Carbon, Apple, Tremor, Mantine, LayerChart, Observable Plot, Unovis and editorial products at chart level, and nobody has yet read our forms against them systematically.

### Purpose
A ranked, evidence-cited list of visual upgrades for templates, assets and the skill, agreed or contested across two model lineages, each item marked implementable today or needing a gate or contract change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `research/dispatch-prompt.md`: the five-angle brief both lineages follow.
- `research/lineages/luna/`: five iterations on GPT-5.6 Luna, max reasoning, fast tier, via codex.
- `research/lineages/glm/`: five iterations on GLM-5.3-Flash, max thinking, via pi over the DevPass gateway.
- `research/research.md`: the cross-lineage synthesis, with agreements, disagreements and a ranked backlog.

### Out of Scope
- Implementing anything - findings only; a later phase builds.
- Fetching new sources - the library is frozen on disk.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/dispatch-prompt.md` | Create | The brief |
| `research/lineages/{luna,glm}/**` | Create | Lineage state, iterations, research.md |
| `research/research.md` | Create | Synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both lineages complete five iterations under `max-iterations` and leave a `research.md` with the five angle headings and cited evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The synthesis ranks recommendations across both lineages, marks agreement and disagreement, and tags each implementable today or needing a gate or contract change |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `orchestration-summary.json` reports two lineages succeeded, zero failed; each `research.md` has five iteration headings.
- **SC-002**: `research/research.md` exists with a ranked backlog citing capture names and template lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | codex CLI and pi with the DevPass gateway | A lane cannot run | The other lane still delivers; rerun the failed lane alone |
| Risk | A text-only model cannot see the crops | Med | The brief tells it to say so and to work from the index notes and local HTML |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each lineage stays under the runner's four-hour ceiling.

### Security
- **NFR-S01**: Lineages write only inside their lineage directory; no network fetches.

### Reliability
- **NFR-R01**: State is externalised per iteration so a stalled lane can be resumed.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a lane that cannot open images says so in iteration one and continues from the notes.
- Maximum length: five iterations each, capped by the runner.

### Error Scenarios
- External service failure: a failed lane is recorded in the orchestration summary and rerun alone.
- Network timeout: the runner's retry and lag ceilings apply.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: research artefacts only |
| Risk | 3/25 | Nothing shipped changes |
| Research | 18/20 | Ten iterations across two models |
| Multi-Agent | 12/15 | Two parallel lineages |
| Coordination | 6/15 | One synthesis over two lanes |
| **Total** | **47/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A lane returns adjectives instead of measurements | M | M | The brief fails angle 4 on adjectives; the synthesis discounts unmeasured claims |

---

## 11. USER STORIES

### US-001: Know what to upgrade (Priority: P0)

**As a** chart-skill owner, **I want** a ranked list of visual upgrades with evidence, **so that** the next build phase has a backlog rather than a mood board.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Know where ours is already better (Priority: P1)

**As a** chart-skill owner, **I want** the findings to say plainly where the corpus already beats the library, **so that** good decisions are not undone by novelty.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- The glm lane has four angles left. Rerun it in an isolated worktree so the runner's containment sweep cannot touch another session's edits, and at `high` thinking unless the operator wants the pace of `max` (one angle per hour).
- The figure-aspect finding needs the crops in view to settle.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


