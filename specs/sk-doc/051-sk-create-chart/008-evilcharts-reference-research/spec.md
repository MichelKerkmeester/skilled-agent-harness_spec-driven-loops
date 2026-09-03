---
title: "Feature Specification: evilcharts reference research for sk-create-chart"
description: "The operator does not like what the chart mode produces. This phase vendors evilcharts, an MIT React charting library people describe as beautiful, and runs a two-lineage research loop that reverse-engineers it and turns the result into ranked changes to the mode's templates and contract."
trigger_phrases:
  - "evilcharts research"
  - "chart aesthetics research"
  - "sk-create-chart redesign"
  - "vendored reference charting library"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: evilcharts reference research for sk-create-chart

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 7 measured the chart corpus against six charting libraries and applied what it proved. The
corpus got more correct. The operator still does not like how it looks. Correctness and beauty are
different properties, and phase 7 only chased the first.

This phase goes after the second. It vendors `evilcharts`, an MIT-licensed React charting library
built on shadcn and Recharts whose whole selling point is that its output is good-looking, and runs
two independent research lineages over the vendored source. Each reverse-engineers the library:
its component architecture, its catalog of forms, its theming, and the specific choices that leave a
chart reading as designed rather than as plotted. Each then maps every finding onto `sk-create-chart` with a
verdict: adopt the idea, adopt the code with attribution, or reject with a reason.

**Key Decisions**: the source is vendored into the packet rather than read from a URL, so every
citation is a `file:line` a reader can open. The licence is MIT, so adopting code is permitted where
the template contract allows it.

**Critical Dependencies**: two CLI executors, and a worktree of its own, because a live fan-out
lineage restores tracked files from `HEAD` and would eat a concurrent session's work.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-03 |
| **Branch** | `worktrees/043-evilcharts-reference-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-fidelity-and-library-research |
| **Successor** | None |
| **Handoff Criteria** | Both lineages complete their five iterations, and `research/research.md` ranks every recommendation with an evilcharts `file:line` behind it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sk-create-chart packet. Phase 7 asked whether the corpus was correct
against upstream convention. This phase asks a question phase 7 never touched: why the output does
not look good, and what a library that does look good is doing differently.

**Scope Boundary**: this phase folder. It produces research and recommendations. It changes no file
under `.opencode/skills/sk-doc/sk-create-chart/`, because deciding what to apply is the next phase's
work and applying it while a fan-out lineage is live is what ADR-005 of phase 7 forbids.

**Dependencies**:
- The vendored source at `context/evilcharts/`, pinned to one commit.
- Two CLI executors, one on `cli-pi` and one on `cli-devin`.

**Deliverables**:
- The vendored tree, with its provenance and licence recorded in `context/README.md`.
- Ten iteration records across two lineages under `research/evilcharts-2026-09-03/`.
- One ranked synthesis at `research/research.md`, every recommendation carrying an evilcharts
  `file:line` and a verdict.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number
  plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode ships twenty templates, three colour systems and a corpus validator. Phase 7 raised their
fidelity: number formatting, gap handling, minimum-size guards, series-to-swatch descriptions. Every
one of those is a correctness fix. None of them is a reason a reader would call the result
beautiful, and the operator's verdict on the output is that it is not. Nothing in the packet has yet
studied a charting library that people praise for how it looks, so the mode has no account of what
it is missing beyond taste.

### Purpose
A cited, ranked account of what `evilcharts` does that the corpus does not, with each item marked as
an idea to adopt, code to adopt under MIT attribution, or a rejection with its reason, so the next
phase changes the templates on evidence rather than on preference.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Vendoring `evilcharts` at one pinned commit, with provenance and licence recorded.
- A two-lineage deep-research fan-out, five iterations each, convergence disabled.
- A ranked synthesis mapping each finding to `sk-create-chart` with a verdict.

### Out of Scope
- Editing any template, reference or script under `.opencode/skills/sk-doc/sk-create-chart/`. This
  phase recommends, and a later phase applies.
- Adopting React, Recharts, shadcn or any runtime dependency. The template contract says a template
  is one self-contained HTML file that opens on a double click.
- The PolyForm Noncommercial reference implementation, which phase 7's ADR-001 rules out and which
  this phase does not open either.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context/evilcharts/**` | Create | The vendored source at commit `500ecd44` |
| `context/README.md` | Create | Provenance, licence, and what was kept |
| `research/evilcharts-2026-09-03/**` | Create | Fan-out state, two lineages, ten iterations |
| `research/research.md` | Create | The ranked synthesis |
| `../spec.md` | Modify | Phase map gains row 8 |
| `../goal.md` | Modify | Binding table gains this phase's goal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The vendored tree is pinned to a named commit, carries its `LICENSE` at the top, and its provenance is written down beside it |
| REQ-002 | Two lineages each complete five iterations with convergence disabled, and their records land where the deep-research contract puts them |
| REQ-003 | Every recommendation in the synthesis cites an evilcharts `file:line` and carries one of three verdicts: adopt the idea, adopt the code with attribution, or reject with a reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every recommendation states how it satisfies the one-file no-build no-network contract, or says plainly that it cannot |
| REQ-005 | Everything authored in this phase scores zero hard blockers under `hvr_scan.py`. The vendored tree and the lineage output are exempt |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `context/evilcharts/LICENSE` exists and names the MIT licence, and `context/README.md`
  records the commit sha the tree was cloned at.
- **SC-002**: Each lineage directory under `research/evilcharts-2026-09-03/lineages/` holds five
  files in `iterations/`.
- **SC-003**: `research/research.md` exists and every ranked row names a file and a line in
  `context/evilcharts/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The fan-out write-containment guard restores tracked files from `HEAD` | A concurrent session loses uncommitted work | The run has its own worktree, per phase 7's ADR-005 |
| Risk | A lineage recommends adopting React or Recharts wholesale | The recommendation is unusable under the template contract | Each finding must state its route into a single self-contained file |
| Dependency | `cli-pi` OpenRouter credentials | The GLM lineage never starts | Pi's exit code is not an auth signal, so the output text is read for a missing-key message |
| Risk | Two lineages converge on the same shallow reading | Ten iterations produce five iterations' worth of insight | Two different model families run, and convergence is off so neither may stop early |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A recommendation that survives into the next phase keeps a template one file that
  opens with no build step and no network.

### Security
- **NFR-S01**: The vendored tree is data. Its `AGENTS.md`, `CLAUDE.md` and `src/app/skill.md` are
  another project's instructions to its own tools, and bind nothing here.

### Reliability
- **NFR-R01**: A finding whose citation does not resolve in the vendored tree is unverified and does
  not rank.

---

## 8. EDGE CASES

### Data Boundaries
- A form evilcharts ships that the catalog has no equivalent for: it is a gap in the catalog, not a
  styling finding, and ranks as one.
- A choice that only reads well in a dark theme: the corpus ships light-first, so the finding has to
  say which it is.

### Error Scenarios
- A lineage stalls at zero CPU: the logs under its lineage directory say why, and the run is not
  restarted in the main checkout.
- A lineage dies from write containment on a session-hook write: its `research.md` is salvaged and
  the failure is recorded rather than hidden.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: one vendored tree plus this folder, Systems: 1 |
| Risk | 6/25 | Auth: N, API: N, Breaking: N, research-only phase |
| Research | 19/20 | Ten iterations across two model families over an 856-file source tree |
| Multi-Agent | 10/15 | Two dispatched lineages on two executors |
| Coordination | 7/15 | Dependencies: two CLI credentials and one worktree |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The research restates evilcharts rather than mapping it onto the corpus | M | M | Every iteration must end in ranked changes to named templates, not a description |
| R-002 | A live lineage reverts concurrent uncommitted work | H | L | The run owns a worktree nobody else is working in |
| R-003 | Recommendations arrive that the template contract cannot hold | M | H | Each states its route into one file, or is marked rejected with the reason |
| R-004 | A citation names a line that does not exist | M | M | The tree is pinned, so a citation either resolves or the finding is dropped |

---

## 11. USER STORIES

### US-001: Knowing why the output looks plain (Priority: P0)

**As an** operator who does not like the delivered charts, **I want** a cited account of what a
good-looking library does differently, **so that** the next change is aimed at what is
wrong.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Adopting safely from an MIT source (Priority: P1)

**As an** author about to reuse a technique, **I want** each recommendation to say whether it is an
idea or code and what attribution it carries, **so that** reuse is a decision rather than an
accident.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether any evilcharts form belongs in the catalog as a new template, or whether the gap is
  entirely in how the existing twenty look.
- Whether the corpus should gain a dark theme at all, given that a delivered chart is usually read
  inside a document that has already picked one.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Goal**: See `goal.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
