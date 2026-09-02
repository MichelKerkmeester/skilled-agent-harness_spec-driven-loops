---
title: "Feature Specification: Fidelity and library research for sk-create-chart"
description: "The chart mode shipped with three reference overviews numbered from zero and with no measurement of its output against what mature open-source charting produces. This phase fixes the numbering, runs a ten-iteration research loop against six libraries, and applies what the loop proves."
trigger_phrases:
  - "sk-create-chart fidelity"
  - "chart library research"
  - "chart template improvement"
  - "overview renumbering"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Fidelity and library research for sk-create-chart

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The `sk-create-chart` mode ships twenty chart templates, three colour systems, a template contract and a corpus check. It works, and nothing had measured it against what mature open-source charting produces. This phase does three things: it renumbers three reference overviews that started at section zero, it runs a ten-iteration deep-research loop comparing the corpus to Chart.js, D3, Vega-Lite, Plotly, Observable Plot and ECharts, and it applies the improvements the loop proves and that fit inside the template contract.

**Key Decisions**: the licensing constraint means "better" is reached through independent work and MIT-class libraries rather than through the PolyForm Noncommercial reference implementation. Anything that changes the template contract is written up as a decision instead of applied.

**Critical Dependencies**: the deep-research loop runs on a CLI executor whose availability decided which model ran.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-playbook-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | Corpus check passes with `--render` from the final state, and every applied change traces to a research finding |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the sk-create-chart packet. Phases 1 through 6 brought the mode into this repository, translated it, scaffolded the packet, built the native corpus, wired the routing and wrote the playbook. This phase is the first that asks whether the delivered output measures up, rather than whether it is present.

**Scope Boundary**: the mode directory `.opencode/skills/sk-doc/sk-create-chart/` and this phase folder. `SKILL.md` is excluded because it is a compiled-policy input, so any change to it is recorded here as prepared text rather than applied.

**Dependencies**:
- The corpus check `scripts/check-corpus.cjs`, which is the authoritative gate for every template edit.
- A CLI executor for the research loop.

**Deliverables**:
- Three reference overviews renumbered from `## 0.` to `## 1.`, with every citation that pointed at a shifted section updated.
- Ten research iteration records and a synthesis under `research/`.
- Applied template improvements, each passing the corpus check with `--render`.
- Decisions recorded for anything larger than a template edit.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three reference overviews start at `## 0. OVERVIEW`, which reads as an off-by-one to anyone scanning the section list, and no document in the mode explains why zero was chosen. Separately, the corpus had never been compared to what the best open-source charting libraries deliver, so nobody could say where it falls short and where it is already ahead. Improvements were being guessed at rather than measured.

### Purpose
The overviews are numbered from one, and the corpus has a measured, cited account of its distance from upstream convention, with the provable improvements applied and the rest recorded as decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renumbering the overview sections in `references/catalog.md`, `references/color-system.md` and `references/template-contract.md`.
- Updating every citation inside the mode that names a shifted section number.
- A ten-iteration deep-research loop with convergence disabled.
- Template edits the research supports, gated on `check-corpus.cjs --render`.

### Out of Scope
- `SKILL.md`, because it is a compiled-policy input. Any change is recorded as prepared text.
- Changes to the template contract itself, because a contract change is a decision the operator makes rather than an edit this phase applies.
- The PolyForm Noncommercial reference implementation, which is not opened by this phase or by any executor it dispatches.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` | Modify | Overview renumbered, self-citation updated |
| `.opencode/skills/sk-doc/sk-create-chart/references/color-system.md` | Modify | Overview renumbered |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | Overview renumbered |
| `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/**` | Modify | Six citations of shifted template-contract sections updated |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | Improvements the research supports |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No overview section in the mode starts at zero, and every citation that named a shifted section resolves to the section it meant |
| REQ-002 | The research loop completes ten iterations with convergence disabled, and writes its records where the deep-research skill puts them |
| REQ-003 | Every template change passes `check-corpus.cjs --render` from the final state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A recommendation the research makes that would change the template contract is recorded as a decision rather than applied |
| REQ-005 | Everything written in this phase scores zero hard blockers under `hvr_scan.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rn '## 0\. OVERVIEW' .opencode/skills/sk-doc/sk-create-chart/` returns nothing, and the before-run of the same command is recorded in `implementation-summary.md`.
- **SC-002**: `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the final state.
- **SC-003**: Ten iteration records and one synthesis exist under `research/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | CLI executor availability | The named model may be rate limited, which stops the loop before it starts | Three executors are permitted, and the one that ran is recorded |
| Risk | The render check flakes | A red run reads as a real failure | A different file failing each run is the browser, the same file every run is a chart drawing nothing |
| Risk | A library recommendation breaks the no-dependency contract | A template stops opening on a double click | Every recommendation states how it satisfies the contract or why it cannot |
| Risk | The fan-out write-containment guard reverts concurrent edits | Uncommitted work in the same tree is restored from HEAD | Do not author files in the working tree while a lineage is live. This risk was realised in this phase and is recorded in the implementation summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A delivered template stays one file that opens with no build step and no network.

### Security
- **NFR-S01**: Nothing from a PolyForm Noncommercial source enters this MIT repository, by copy or by paraphrase.

### Reliability
- **NFR-R01**: The corpus check is the authority on whether a template edit shipped correctly, and a failing run blocks the claim.

---

## 8. EDGE CASES

### Data Boundaries
- A template whose data block holds one row: the axis ladder still has to produce a readable scale.
- A label longer than the space the legend estimates for it: the current width estimate assumes a constant advance per character.

### Error Scenarios
- The render check fails on a different file each run: that is the headless browser, not the corpus.
- The research executor returns a citation that does not resolve: the finding is treated as unverified and is not applied.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 3 references plus 6 playbook files plus up to 20 templates, Systems: 1 |
| Risk | 8/25 | Auth: N, API: N, Breaking: N, contract-bounded edits only |
| Research | 18/20 | A ten-iteration loop across six external libraries |
| Multi-Agent | 8/15 | One dispatched research lineage |
| Coordination | 6/15 | Dependencies: the corpus check and one executor |
| **Total** | **54/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An applied change breaks a template silently, passing structure and drawing nothing | H | L | The render check opens every file and asserts real elements in the figure |
| R-002 | The research reads as fluent restatement rather than measurement | M | M | Every finding carries a corpus `file:line` and a named upstream source |
| R-003 | Scope widens from template edits into contract changes | M | M | Contract changes are recorded as decisions, never applied here |
| R-004 | A live fan-out lineage reverts concurrent uncommitted work in the same tree | H | M | Realised. Recorded in the implementation summary with the exact path list |

---

## 11. USER STORIES

### US-001: Reading the reference set (Priority: P0)

**As a** reader opening `template-contract.md`, **I want** the section list to start at one, **so that** I am not left wondering what section zero was for.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Improving a template on evidence (Priority: P1)

**As an** author extending the corpus, **I want** a cited account of where the corpus sits against upstream convention, **so that** I change what is measurably behind rather than what I happened to notice.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the tick-formatting and legend-collision gaps the research names are worth the per-template cost across twenty files.
- Whether the axis ladder duplicated across nine templates should stay duplicated, given that the contract forbids a shared runtime.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
