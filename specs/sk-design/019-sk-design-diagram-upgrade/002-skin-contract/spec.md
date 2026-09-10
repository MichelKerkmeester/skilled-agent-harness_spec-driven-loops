---
title: "Feature Specification: Phase 2: skin-contract"
description: "Sign the seven contract decisions the research surfaced, write the derivation record, and collapse every duplicated contract to one locus."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: skin-contract

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 2 signs the seven skin-contract decisions phase 1's research forced into the open, specifies
the derivation record's shape, and collapses four duplicated contracts — the 4px rule, the
accessible-SVG statement, ownership, and version — to one locus each. It touches no HTML and no
script; every deliverable is a decision, a record shape, or a documentation fix that a later phase
executes against.

**Key Decisions**: the accent's 2.863:1 departs rather than re-derives; connectors are structure
(ungated) unless painted with the accent; `#3d4460` becomes a type-scoped role, not a foundations
value.

**Critical Dependencies**: phase 1's reconciled fact base (`findings-ledger.md`, T001) must exist
before any of the other twelve tasks sign a decision (D10).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 6 |
| **Predecessor** | `001-upgrade-research` |
| **Successor** | `003-applicator-and-sentinels` |
| **Handoff Criteria** | Every value and both accent spellings trace to a primary and a rule; one locus per contract. Verified by: grep-verified traces; the loci counted. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams specification.

**Scope Boundary**: Decisions, records, and doc-level fixes only. No HTML, no script, no repaint —
those are 003's, 004's, and 005's respectively (D4's forced order).

**Dependencies**:
- `001-upgrade-research`'s reconciled fact base (this phase's own T001 output, `findings-ledger.md`)
- The parent goal's frozen decisions D1-D12, which this phase's decisions refine, never contradict

**Deliverables**:
- `findings-ledger.md` — the reconciled fact base (T001)
- Seven signed decisions (T002-T008), each citing the parent decision it refines
- Six mechanical write-ups and fixes (T009-T013, plus the decision slice of T012) that a GLM
  executor applies to the named skill files in a later pass

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Sign the seven decisions: the 4px exemption list resolving `SKILL.md:403` against `:337`; marker vocabulary and id-uniqueness scope; node and coral-element markup conventions; the self-contained bar (lean: keep the fonts link plus fallback chains); the emphasis mapping for an accent at 2.86:1 against a 3.0 gate; token-source scope with `#3d4460` promoted to a named role; the variant lattice. Write the derivation record — three lists, kinds, gates with `ungated` rows, tolerances, reference and sha256. One locus each for the 4px rule, the accessibility contract, ownership and version; fix the two YAML names in `diagram.md`.

### Purpose
**Gate this phase ends on:** Every one of the 25 values and both accent spellings traces to a primary and a rule by grep; exactly one locus each; `--default-diff` defines stock.

Named by phase 1's synthesis (`../001-upgrade-research/research/research.md`); the order is forced by the standard's own doctrines and is not a preference.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sign the seven skin-contract decisions research forced open: 4px exemptions, marker
  vocabulary/id scope, node markup + coral spelling, token-source scope, the self-contained bar,
  the derivation record's shape, and the emphasis/gates mapping
- Write `findings-ledger.md`, reconciling glm's 29 findings against sonnet's disk verification
  (D10), before any decision above is signed
- Collapse four duplicated contracts to one locus each: the version field (five loci), ownership
  registration, the accessible-SVG statement (three `SKILL.md` restatements), and the stale
  command YAML names
- Document the fallback chains that already ship in `style-guide.md`'s typography table

### Out of Scope
- The 4px grid contradiction's downstream *enforcement* — writing the regex family into
  `check-diagram-corpus.cjs` — that is 005's work; 002 only adjudicates which rule wins
- The actual repaint of 1,577 hex literals and the four template roots — that is 004's work; 002
  only specifies the derivation record's shape
- The applicator script and the `DIAGRAM_PALETTE` sentinel blocks — that is 003's work
- The sketchy variant's proof-or-descope execution — that is 004's work; D9's descope clause is
  already signed at the parent level
- Any edit to an `.html` example, template, or `.cjs` script — this phase writes zero code (see
  Problem Statement)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `findings-ledger.md` (this folder) | Create | The reconciled fact base every decision below cites (T001) |
| `goal.md` (this folder) | Create | The durable directive and the nine decision rows that refine the parent's D1-D12 |
| `.opencode/skills/sk-design/sk-design-diagram/SKILL.md` | Modify (later phase) | The 4px exemption clause, the marker/node conventions, the accessibility contract's single locus, the version field, the ownership line — all specified here, applied by a GLM execution pass after this phase's decisions are ratified |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Modify (later phase) | The derivation record's shape, the fallback-chain documentation fix, the version field |
| `.opencode/commands/design/diagram.md` | Modify (later phase) | Line 67's stale `create-diagram-*.yaml` names |
| `.opencode/skills/sk-design/sk-design-diagram/references/types/type-high-level.md` | Not a consumer of this phase | `#3d4460`'s only use site; read as evidence, not edited here |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md` | Create (later phase) | The derivation record artifact itself: three lists, four kinds, gates, tolerances, reference + sha256 |

### Version Loci (REQ-010)

Five loci disagree today; T010 collapses them to one (`SKILL.md`'s frontmatter field survives).

| Locus | Current value |
|-------|----------------|
| `SKILL.md:5` | `1.0.0.0` — this locus (the frontmatter field) survives; the seed value is Open Question, see §12 |
| `references/foundations/style-guide.md:14` | `1.0.0.5` |
| `manual-testing-playbook/manual-testing-playbook.md:4` | `1.0.0.5` |
| `README.md:7` | `1.0.0.7` |
| `feature-catalog/feature-catalog.md:11` | `1.0.0.5` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The phase MUST write `findings-ledger.md` reconciling glm's 29 findings (F1.1-F4.6) plus sonnet's iteration-5 citations and new findings into one fact base, with a verdict and a node+task attribution for each, before any other requirement below is signed (D10; T001). |
| REQ-002 | The phase MUST adjudicate the 4px grid contradiction between `SKILL.md:403` and `:337`, naming the exemption list (font sizes, plus a new derived-label-offset clause covering the flowchart's `y=230/239/298/307` violations) (D5; F1.5, F1.10, S3.1; T002). |
| REQ-003 | The phase MUST sign the marker vocabulary ("define only what you draw," per file) and the id-uniqueness scope (unique per file) (D6; F1.7; T003). |
| REQ-004 | The phase MUST sign the node markup convention (`data-diagram-node`, budgets count tagged nodes not raw rects) and settle that both accent spellings count as one coral element (D7; F1.8; T004). |
| REQ-005 | The phase MUST sign token-source scope: `#3d4460` promoted to a type-scoped role, and `#ffffff`'s backend/API/step treatment role recorded so the repaint does not mistake it for a paper substitute (D9; F1.9, F2.2, S2.1; T005). |
| REQ-006 | The phase MUST sign the self-contained bar: one whitelisted stylesheet host, fallback chains already shipping, no exception precedent to port, and an in/out-of-corpus call for `assets/icons.html` (D2; F1.4, F3.1, S3.2; T006). |
| REQ-007 | The phase MUST specify the derivation record's shape: three lists (light/dark/terminal), four kinds (primary/derived/fixed/untokenized), gates with ungated rows, a tolerance model, and the reference-path-plus-sha256 pin (D1; F2.4, F3.6, S2.3; T007). |
| REQ-008 | The phase MUST sign the emphasis/gates mapping: the accent's 2.863:1 recorded as a departure, `soft`'s text-carrying restriction, and the connectors marks-vs-structure classification (D8; F2.5, F3.7; T008). |
| REQ-010 | The phase MUST collapse the five disagreeing version loci to `SKILL.md`'s frontmatter field as the single surviving locus (D12; F4.3; T010). |
| REQ-011 | The phase MUST fix `diagram.md:67`'s stale YAML names and move ownership registration from `sk-doc` to `sk-design` (D12; F4.6; T011). |
| REQ-012 | The phase MUST designate one canonical locus for the accessible-SVG contract statement, with `SKILL.md`'s other two restatements becoming cross-references (D12; F4.5's decision slice; T012). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The phase MUST record the pin-discipline inheritance (reference path + sha256, no second carried Style Reference, the 34 examples as the exemplar set) (D3; F3.5; T009). |
| REQ-013 | The phase MUST document the fallback chains that already ship in `style-guide.md`'s typography table (D2; F3.2; T013). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `findings-ledger.md` exists and lists every one of glm's 29 findings plus sonnet's iteration-5 citations and new findings, each with a verdict and a node+task attribution.
- **SC-002**: Every one of the seven signed decisions (T002-T008) names the parent decision (D1-D12) it refines.
- **SC-003**: The 4px exemption list names exactly two clauses (font sizes, derived label offsets) and cites both `SKILL.md:337` and `:403`.
- **SC-004**: The derivation record's specified shape names three lists, four kinds (including the new `untokenized` kind), and a reference-path-plus-sha256 pin.
- **SC-005**: The version-loci table names all five disagreeing loci (`SKILL.md:5`, `style-guide.md:14`, `manual-testing-playbook.md:4`, `README.md:7`, `feature-catalog.md:11`) and the single surviving locus.
- **SC-006**: `tasks.md` carries thirteen tasks (T001-T013), each ending in a real `— executor:` suffix (operator, GLM-5.3-Flash max via cli-pi (DevPass), or human review).
- **SC-007**: `acceptance-criteria.md` carries one AC row per REQ (thirteen rows) with a non-placeholder Verification cell.
- **SC-008**: No bracketed placeholder (`[word]` pattern) remains in `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, or `goal.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `findings-ledger.md` (T001) | Every other task cites a fact from it; a wrong reconciliation propagates to seven signed decisions | Ledger's per-row verdict is taken directly from `lineages/sonnet/findings-registry.json`, not re-derived by hand |
| Dependency | The parent goal's frozen D1-D12 | A decision row that contradicts a parent decision is an amendment, not a refinement, and blocks this phase | Every decision row in `goal.md` cites the parent decision id it refines; none proposes a new value for a frozen choice |
| Risk | The accent's 2.863:1 departure is later revisited at 004 or 005 under pressure to "just pass the gate" | Would silently change the shipped brand accent, contradicting the parent's own D8 | `plan.md` ADR-001 records the rejected alternative (re-derive) and why it was rejected |
| Risk | The derivation-record artifact's actual file path is a planning-time inference (`references/foundations/derivation-record.md`), not yet confirmed by an executor | 003's applicator could target a different path | `plan.md` ADR-003 and `tasks.md`'s T007 both name the same path; flagged as a judgment call in this phase's own log |
| Risk | The tally-framing mismatch (15/15/1 vs. the registry's 19/11/1) | Could confuse a reader comparing this ledger to the dispatch brief that spawned it | `findings-ledger.md` states both framings explicitly rather than silently picking one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable — this phase ships no runtime code. The nearest analog is document
  length, and no anchor may exceed what a reviewer can read in one sitting (informal, not
  measured).

### Security
- **NFR-S01**: No auth surface. This phase writes documents; nothing here handles credentials,
  network calls, or user input.

### Reliability
- **NFR-R01**: The phase's own reliability target is validator-shaped, not uptime-shaped:
  `validate.sh --strict` must report `RESULT: PASSED` before this phase's completion is claimed by
  the orchestrator.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: Not applicable — this phase has no runtime input; its "input" is the fixed research
  fact base, which already exists on disk.
- Maximum length: If a future decision needs an eighth or ninth clause beyond the seven signed
  here, it is a new decision row in `goal.md`, not a rewrite of an existing one (decisions are
  frozen once signed; changing one is an amendment).

### Error Scenarios
- A future phase's executor cannot find `references/foundations/derivation-record.md` at the path
  this phase names: the executor halts and reports a path mismatch rather than guessing a new
  location, per the global HALT conditions.
- A finding's corrected value in this ledger is later shown to be wrong by direct inspection: the
  discovering phase amends `findings-ledger.md` with a dated correction row rather than silently
  overwriting the original entry.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 7 authored in this folder, 5 named as future-phase targets; LOC: ~2,500 across the seven docs; Systems: 1 (the diagram skill's contract surface) |
| Risk | 10/25 | Auth: N/A; API: N/A; Breaking: a wrong decision here cascades to 003-006, but nothing ships until those phases execute |
| Research | 5/20 | Investigation is complete — this phase consumes 001's reconciled research rather than generating new findings |
| Multi-Agent | 6/15 | Two lineages (glm, sonnet) feed this phase's fact base; this phase itself is single-threaded |
| Coordination | 10/15 | Every decision gates 003 (D4's forced order); a wrong decision blocks four downstream phases |
| **Total** | **49/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A signed decision contradicts a frozen parent decision (D1-D12) | H | L | Every decision row cites the parent id it refines; reviewed against the parent `goal.md` before signing |
| R-002 | The derivation-record path named here is wrong once 003 tries to read it | M | M | Flagged explicitly as a judgment call in this phase's log; 003's own planning re-confirms the path before building the applicator |
| R-003 | The tally-framing mismatch confuses a downstream reader | L | M | Stated explicitly in `findings-ledger.md` rather than silently resolved |

---

## 11. USER STORIES

### US-001: Applicator author (Priority: P0)

**As a** the engineer who builds phase 3's applicator, **I want** a signed derivation-record shape with a reference path and a sha256 pin, **so that** I can write a script that reads one source of truth instead of five conflicting `style-guide.md` passages.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-007).

---

### US-002: Checker author (Priority: P1)

**As a** the engineer who builds phase 5's checker, **I want** the 4px exemption list, the marker vocabulary, and the node markup convention signed in writing, **so that** I can encode each as a named family instead of guessing at intent from the corpus.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-002, AC-003, AC-004).

---

## 12. OPEN QUESTIONS

- The exact byte path for the derivation-record artifact (`references/foundations/derivation-record.md`, inferred here) is not independently confirmed against 003's expectations; 003's own planning should re-confirm it before the applicator is built.
- Whether the version field's collapsed value should be seeded at 1.0.0.7 (the highest of the three disagreeing values) or reset to reflect this packet's own scope is left to whichever phase actually edits `SKILL.md`'s frontmatter (004 or 005); T010 states the locus, not the number.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` §`L3: ARCHITECTURE DECISION RECORD` (this packet carries its ADRs inside `plan.md`; there is no separate `decision-record.md`)

---
