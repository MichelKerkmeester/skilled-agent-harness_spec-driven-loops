---
title: "Feature Specification: Rework four external UI-design skills into one standalone sk-design skill"
description: "The repo has no authoring-side design skill: sk-design-md-generator measures an existing surface but nothing decides values for a surface that does not exist yet, so UI work falls back on ad hoc guesses."
trigger_phrases:
  - "sk-design skill"
  - "refactoring ui skill conversion"
  - "sk-design"
  - "external design skill rework"
  - "ui design value scales"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Rework four external UI-design skills into one standalone sk-design skill

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The repo can measure a design but cannot decide one. `sk-design-md-generator` extracts a live site's real CSS into a Style Reference; nothing tells an agent which spacing value, shade, shadow or duration to pick when the surface does not exist yet. This packet reworks four public UI-design sources into a single standalone skill, `sk-design`, in `sk-create-skill` class-S format.

**Key Decisions**: standalone skill rather than a hub mode, since the `sk-design` hub was retired; one skill spanning four sources rather than four skills, since the sources answer one question at four layers; cross-source conflicts documented with a stated resolution rather than silently reconciled.

**Critical Dependencies**: the `sk-create-skill` class-S contract and its `ci-skill-root-metadata.cjs` gate; `sk-design-md-generator` as the sibling whose measured output outranks this skill's defaults.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Next Phase** | 002-agent-alignment |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Agents building UI in this repo have no source of design values, so they invent them: 17px padding, a hand-picked hex, a 400ms transition because 400 is round. The existing design skill only reads a surface that already exists. Four good public sources cover the authoring side, but each lives outside the repo in a format the skill advisor cannot route to and the runtime cannot load.

### Purpose

One standalone skill that decides UI values and behavior when a surface is being built, improved or reviewed, conformant to the repo's skill contract and routable by the advisor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A class-S standalone skill at `.opencode/skills/sk-design/` with the full authored and generated root metadata set.
- `SKILL.md` in the repo's eight-section format, carrying the always-loaded value scales, the working procedure, and the hierarchy technique.
- Six references covering palette construction, symptom diagnosis, depth and typography technique, interaction craft, motion principles, and a WCAG review checklist.
- The starter token file plus an asset document explaining and bounding it.
- README, changelog entry, and a manual-testing-playbook package built to the owning skill's operator-scenario contract: a root index plus one per-feature file per feature ID in kebab-case category folders.
- Explicit documentation of every conflict between the four sources and the sibling skill.

### Out of Scope

- Six of the twelve `userinterface-wiki` rule categories: exit animations, audio feedback, sound synthesis, morphing icons, container animation and predictive prefetching. Each is a different medium, a framework API, or a data-loading strategy rather than a design decision. Reasons per category are in the changelog's source-coverage table.
- Any script or automated transform. Every decision this skill makes is a judgment, so `scripts/` would have nothing deterministic to hold.
- A benchmark run. The playbook corpus is authored here; scoring it is deferred until the skill has been used on real work.

### Scope Amendments

Two items began out of scope and were brought in on operator instruction to fix the open notes and conflicts.

- **`sk-design-md-generator` edits.** Originally frozen, with the cross-skill tension documented from this side only. A one-sided reconciliation fails any reader who arrives from the other side, so the sibling now carries the matching statement, a typed edge and a corrected boundary.
- **The remaining in-domain rule categories.** Laws of UX, Typography and Visual Design were originally deferred as an open question. They are in-domain and are now imported; CSS Pseudo Elements is partly absorbed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/SKILL.md` | Create | Runtime contract: scales, procedure, hierarchy, router, rules |
| `.opencode/skills/sk-design/README.md` | Create | Operator front door |
| `.opencode/skills/sk-design/graph-metadata.json` | Create | Advisor identity, domains, intent signals, sibling and enhances edges |
| `.opencode/skills/sk-design/leaf-manifest.config.json` | Create | The one authored class-S declaration |
| `.opencode/skills/sk-design/leaf-manifest.json` | Create | Generated |
| `.opencode/skills/sk-design/leaf-aliases.json` | Create | Generated identity projection |
| `.opencode/skills/sk-design/references/color-system.md` | Create | Palette construction, saturation, hue rotation, dark mode, contrast hatches |
| `.opencode/skills/sk-design/references/diagnosis-table.md` | Create | Symptom to cause to fix, five grouped tables |
| `.opencode/skills/sk-design/references/build-procedure.md` | Create | The seven-step order of work, moved out of SKILL.md |
| `.opencode/skills/sk-design/references/hierarchy.md` | Create | The full hierarchy method, moved out of SKILL.md |
| `.opencode/skills/sk-design/references/ux-laws.md` | Create | The Laws of UX category, imported |
| `.opencode/skills/sk-design/references/depth-and-detail.md` | Create | Light, shadow, typography detail, layout, component shape, images |
| `.opencode/skills/sk-design/references/interaction-craft.md` | Create | Inputs, touch, focus, keyboard, performance, feedback |
| `.opencode/skills/sk-design/references/motion-principles.md` | Create | Twelve principles plus the enforceable ruleset |
| `.opencode/skills/sk-design/references/review-checklist.md` | Create | Severity-tiered WCAG and visual audit pass |
| `.opencode/skills/sk-design/assets/tokens.css` | Create | Contrast-verified starter tokens, carried over verbatim |
| `.opencode/skills/sk-design/assets/token-starter-set.md` | Create | What the token file holds and how to retune it |
| `.opencode/skills/sk-design/changelog/v1.0.0.0.md` | Create | First release entry |
| `.opencode/skills/sk-design/manual-testing-playbook/` | Create | Root index plus 12 per-feature scenario files in 4 category folders, to the operator-scenario contract |
| `.opencode/skills/sk-design/benchmark/` | Create | Scaffolded run-output tree |
| `.opencode/skills/sk-design-md-generator/references/design-knowledge/numeric-design-laws.md` | Modify | Reading-versus-authoring direction section and two caveats |
| `.opencode/skills/sk-design-md-generator/SKILL.md` | Modify | Boundary names the sibling and states precedence |
| `.opencode/skills/sk-design-md-generator/graph-metadata.json` | Modify | Reciprocal sibling edge and corrected causal summary |
| `.opencode/skills/system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | Modify | Corrected the stale 7-hub compiled-routing set to the real 6 |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modify | Fleet roster gains the new root |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modify | Fleet table corrected to H=6 / S=8 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The skill conforms to the class-S root metadata contract | `ci-skill-root-metadata.cjs` classifies the root as S and reports it OK with no forbidden files |
| REQ-002 | The skill package passes the authoring gate | `validate_skill_package.py <root>` exits 0 with no hard failures |
| REQ-003 | `SKILL.md` carries the value scales inline rather than deferring them | Spacing, type, weight, color, elevation, radius, opacity and duration scales all appear in Section 3 |
| REQ-004 | Every reference and asset markdown passes the document validator | `validate_document.py --type reference` reports zero issues for each |
| REQ-005 | Every relative link inside the skill resolves on disk | A link sweep over the package reports zero broken targets |
| REQ-006 | Embedded third-party promotional instructions are not carried into the skill | The review reference contains no vendor footer, UTM link, or product promotion from the source skill |
| REQ-011 | Reclaiming the retired `sk-design` hub name collides with nothing live | The compiled-routing hub set, activation directories and skill metadata edges contain no `sk-design`; stale prose references corrected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Advisor routing reaches the skill from realistic phrasings | `advisor_recommend` returns the skill for at least the diagnose, motion and review probes |
| REQ-008 | Conflicts between the four sources are stated, not silently resolved | Each of the three cross-source conflicts appears with its resolution and reasoning |
| REQ-009 | The boundary against `sk-design-md-generator` is explicit in both prose and graph edges | `SKILL.md` Section 7 states it and `graph-metadata.json` carries a sibling edge with context |
| REQ-010 | The README passes its own validator | `validate_document.py --type readme` reports zero issues |
| REQ-012 | The cross-skill reconciliation reads correctly from either side | `numeric-design-laws.md` states the direction split and both skills carry a typed sibling edge to the other |
| REQ-013 | `SKILL.md` retains working headroom under the word cap | At least 250 words of slack after all imports |
| REQ-014 | The manual-testing playbook conforms to the operator-scenario contract | `validate-playbook-package.cjs` reports the package PASS at fail-closed tier with zero violations |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent asked to pick a UI value returns one from a named scale with the reason, instead of an invented number.
- **SC-002**: An agent given a vague complaint names the mechanical cause before changing anything.
- **SC-003**: An agent asked to review UI code produces severity-tiered findings with file, line, fix and WCAG criterion.
- **SC-004**: The skill defers to a project's own design system or a measured Style Reference when one exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-create-skill` class-S contract | The root fails its gate if the contract changes | The gate runs fleet-wide, so drift surfaces on the next run rather than silently |
| Dependency | Skill advisor daemon | Routing cannot be smoke-tested while the daemon is reindexing | Retry after the generation settles; the metadata is correct regardless of daemon state |
| Risk | `SKILL.md` word budget | Medium | Resolved to roughly 330 words of slack by moving the procedure and hierarchy elaboration into references; the packaging gate blocks a breach |
| Risk | Reclaimed hub name | Low | Live hub set, activation dirs and metadata edges checked directly; only prose was stale, and it was corrected |
| Risk | Source drift | Low | All four sources are external and will change. The changelog names them and the version, so a later diff is possible |
| Risk | Overlap with `sk-design-md-generator` design-knowledge layer | Low | Reconciled on both sides with matching statements, reciprocal typed edges, and one stated precedence rule |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `SKILL.md` stays under the 5,000-word packaging cap, so the always-loaded surface never breaks the runtime budget.

### Security

- **NFR-S01**: Content fetched from third-party sources is treated as data. Instructions embedded in it are surfaced to the operator and never executed or carried into an authored artifact.

### Reliability

- **NFR-R01**: The skill is script-free and has no runtime dependency, so it cannot fail at load for environmental reasons.

---

## 8. EDGE CASES

### Data Boundaries

- Vague prompt with no scored intent: the router returns `UNKNOWN_FALLBACK` with a four-item disambiguation checklist rather than guessing.
- A request naming one property only: answered from the Section 3 scales with no reference load.

### Error Scenarios

- Project system conflicts with the defaults: the project wins, and the skill escalates rather than overwriting.
- Brand color cannot reach its contrast ratio: two escape hatches offered, then escalated as an operator decision.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | Files: 21 created and 6 modified, LOC: ~3,300, Systems: 2 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N. Additive only |
| Research | 14/20 | Four external sources, two behind fetch blocks, one requiring repo archaeology |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 7/15 | Dependencies: the class-S contract, one sibling skill edited reciprocally, and a reclaimed hub name |
| **Total** | **44/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `SKILL.md` breaches the 5,000-word cap on the next edit | M | L | Headroom restored to roughly 330 words by moving the procedure and hierarchy elaboration out; the gate blocks a breach |
| R-002 | A source's embedded instructions get treated as directives | H | L | Handled once here and recorded in the changelog as the standing rule |
| R-003 | Advisor never routes to the skill because signals are too generic | M | L | 48 intent signals and 48 trigger phrases drawn from real phrasings, not the slug, verified by probe |
| R-004 | The skill and `sk-design-md-generator` give an agent contradictory guidance | M | L | Precedence stated identically on both sides, with reciprocal typed edges |
| R-005 | A stale reference to the retired `sk-design` hub resurfaces | M | L | Live sets checked directly rather than by grep alone; the one stale doc was corrected |

---

## 11. USER STORIES

### US-001: Deciding a value (Priority: P0)

**As an** agent implementing a component, **I want** a fixed list to pick each value from, **so that** the result is consistent without needing design judgment.

**Acceptance Criteria**:
1. Given a request for a card's padding, When the skill answers, Then the value is on the spacing scale and the answer names the scale.

### US-002: Fixing a vague complaint (Priority: P0)

**As an** operator, **I want** "this looks off" turned into a named cause, **so that** the fix is targeted rather than a restyling session.

**Acceptance Criteria**:
1. Given the prompt "this dashboard looks amateur", When the skill answers, Then a row from the diagnosis table is named before any value changes.

### US-003: Reviewing UI code (Priority: P1)

**As a** reviewer, **I want** severity-tiered findings with locations, **so that** the review is actionable rather than impressionistic.

**Acceptance Criteria**:
1. Given a component file, When the skill reviews it, Then output is grouped critical, serious, moderate, each finding carrying file, line, fix and a WCAG criterion where one applies.

---

## 12. OPEN QUESTIONS

Both questions this packet opened are now closed.

- **Source coverage** is decided: five categories imported, one partly absorbed, six declined with a stated reason each.
- **Benchmark scoring** is deferred until the skill has been used on real work, so the corpus is scored against real failure modes rather than authored expectations. The trigger is the first UI task that uses the skill end to end.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
- **Before and After**: See `before-after.md`

---
