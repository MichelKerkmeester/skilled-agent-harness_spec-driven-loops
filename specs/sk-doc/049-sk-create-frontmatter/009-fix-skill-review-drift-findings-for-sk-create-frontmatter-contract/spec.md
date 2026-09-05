---
title: "Feature Specification: Phase 9: fix the skill-review drift findings in the sk-create-frontmatter contract"
description: "A review of the shipped mode found the contract disagreeing with its own enforcement in four places, one declared trigger that the advisor scores at zero, a usage text that omits the one mode a hook runs, and a hub description within 115 characters of the silent discovery drop the mode itself warns about. This phase corrects each one where the packet may edit and records the rest with the file and the mechanism."
trigger_phrases:
  - "frontmatter contract drift"
  - "contract versus enforcement drift"
  - "sk-create-frontmatter remediation"
  - "hub description budget trim"
  - "declared trigger scores zero"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 9: fix the skill-review drift findings in the sk-create-frontmatter contract

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 008 measured the mode and closed. A second review then read the contract against the
validators that enforce it, against the fleet it describes, and against the advisor that routes to
it. The mode is sound and every gate it names passes. The contract is not sound: it states rules no
validator checks, a spec-document rule its own section 5 contradicts, and an enforcement claim the
checker's walk does not reach. One of its seventeen declared triggers scores zero in every advisor
lane. The engine's usage text omits `gate`, the one mode the post-edit hook runs. And the hub that
hosts the mode carries a 639-character description, putting the project 115 characters from the
8,000-character cutoff the mode documents as a silent discovery drop.

**Key Decisions**: correct every contract statement to what the code does, add the spaced alias the
advisor can score and record the underscore form as advisor-owned, trim the hub description to the
budget the mode itself sets and carry the compiled-routing refresh that edit requires, and reconcile
the packet documents that still contradict the closed state.

**Critical Dependencies**: the advisor CLI live for the routing replays, and a clean compiled-routing
guard before the hub edit so the negative control is observable.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-utilization-review |
| **Successor** | None |
| **Handoff Criteria** | Every drift finding is either corrected with its check re-run, or recorded with the file and the mechanism, and every gate in the phase 006 sweep is green from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the sk-create-frontmatter specification.

**Scope Boundary**: files under `.opencode/skills/sk-doc/sk-create-frontmatter/`, the mode's alias
entries in the hub's registry and stage-one vocabulary, the hub `SKILL.md` description line, the
engine's usage text in `sk-doc/shared/scripts/frontmatter-version.mjs`, and this packet's own
documents. The advisor scorer and the advisor's doc-frontmatter checker are outside it.

**Dependencies**:
- The advisor CLI at `.opencode/bin/skill-advisor.cjs`, for the before and after replays
- The compiled-routing tools under `.opencode/bin/`, because the hub `SKILL.md` is a pinned source
- The spec-kit validator, since the packet documents are part of the drift

**Deliverables**:
- A field reference whose every enforcement claim matches a validator that exists
- A declared trigger set the advisor can score, with the one it cannot recorded against its owner
- A hub description inside the budget the mode sets, with the routing gates green after it
- Packet documents that agree with each other about what closed and when

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode exists so that one place is accountable for what a frontmatter block must carry. A review
found that place making claims its own enforcement does not back: a delimiter rule no parser checks,
length limits no validator applies, a spec-document rule contradicted three sections later, and a
"required on every reference and asset" claim behind a checker that walks only top-level skill
folders in a mode that passes files carrying no block at all. A contract that overstates its
enforcement is the drift the mode was built to end.

### Purpose
Every statement in the contract that names an enforced rule points at a check that exists and
behaves as stated, and every packet document agrees with the shipped state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The field reference's section 1 parse diagram, section 5 validation rules, checklist, and the
  enforcement notes on the reference, asset and README templates
- The engine usage text, so it lists every mode the engine accepts
- The mode `SKILL.md`'s two recommended sections the packaging gate warns about
- The references router's missing overview section
- The declared trigger set: a scoreable alias for the one the advisor scores at zero, and the
  missing stage-one entry for `version field`
- The hub `SKILL.md` description, with the compiled-routing refresh and canary re-pin that edit
  carries
- The parent `goal.md`, the parent `spec.md` metadata residue, phase 008's checklist and titles

### Out of Scope
- The advisor scorer, including why the underscore form of one alias scores zero. Recorded with
  the file and the observation, not changed
- The advisor's doc-frontmatter checker walk. Extending it into nested packets would newly fail 22
  files in other skills, which is a fleet decision. The contract is corrected to say what the
  checker covers
- The other three over-budget descriptions the audit names, in `sk-code`, `system-spec-kit` and
  the `design` agent. Other owners
- The spec-kit scaffolder, which emitted empty child bodies with a success banner twice. Recorded
  as an adjacent defect

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modify | Parse diagram, section 5 rules, checklist, enforcement notes |
| `.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md` | Modify | Spaced alias in the keyword list, sections 7 and 8 |
| `.opencode/skills/sk-doc/sk-create-frontmatter/references/README.md` | Modify | Overview section |
| `.opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | Modify | Usage text lists `gate` |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Spaced alias |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modify | `version field` and the spaced alias in stage one |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | Description trimmed to budget |
| Compiled-routing manifests and the canary digest set | Regenerate | Carried by the hub `SKILL.md` edit |
| `../goal.md`, `../spec.md`, `../008-utilization-review/{spec,tasks,acceptance-criteria}.md` | Modify | Reconcile with the closed state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every enforcement claim in the field reference names a check that exists and behaves as the claim states, or is removed |
| REQ-002 | Every declared trigger the advisor can score routes to the mode on its own signal, and the one it cannot is recorded against its owner |
| REQ-003 | The engine's usage text lists every mode its dispatcher accepts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The hub description sits inside the per-skill soft target the contract sets, and every compiled-routing gate is green after the edit |
| REQ-005 | The packaging gate and the document validator report no warning on any file of the mode |
| REQ-006 | The parent and phase 008 documents agree with each other about status, level, branch and completion |
| REQ-007 | Everything written passes the human-voice, document and spec validators |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: a reader of section 5 can name, for each rule, the script that enforces it or the sentence that says nothing does
- **SC-002**: the advisor replay after the change shows every declared trigger except the recorded one routing to the mode above the incidental floor
- **SC-003**: the description audit reports the project total with more than 400 characters of headroom under the 8,000 cutoff
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The hub description feeds the advisor's lexical lane, so trimming it can move routing for the whole hub | High if a route-gold row depends on a dropped token | Baseline eight hub-shaped prompts before the edit, replay after, and hold the change to the canary's route-gold rows |
| Risk | The hub `SKILL.md` is a pinned compiled-routing source, so the edit turns the guard stale | Medium, the hub stops serving compiled until re-minted | Re-mint both manifests and re-pin the canary in the same pass, as phase 008 recorded |
| Dependency | Advisor CLI | Without it no routing claim can be measured | Confirm `freshness: live` on every replay |
| Risk | A concurrent session shares this checkout with many uncommitted files | Medium, a pin can capture bytes that are not this work's | Read the canary's red entries before re-pinning and name every file the pin set captures |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: no gate this phase runs may take longer than it did in phase 008. The fleet version gate ran over 2,958 files in under a minute and stays the reference.

### Security
- **NFR-S01**: no step runs the versioning engine in `apply` mode against the fleet. Version application is scoped to the files this phase edited.

### Reliability
- **NFR-R01**: the hub edit is held to a negative control. The guard must report `stale-manifest` after the edit and `fresh` after the re-mint, or the refresh proved nothing.

---

## 8. EDGE CASES

### Data Boundaries
- A declared trigger that scores zero in every lane cannot be repaired from vocabulary the hub already carries. It is recorded against the scorer rather than re-added.
- The checker's shape mode passes a file with only `title` and `description`. The contract must say that, or a reader will believe the five-field block is enforced.

### Error Scenarios
- The canary red on an entry that is not this work's: read the entry before re-pinning, and name it in the summary.
- The advisor cold: an empty list is indistinguishable from a miss, so every replay records `freshness`.

---

## 9. COMPLEXITY ASSESSMENT

| Factor | Score | Notes |
|--------|-------|-------|
| Files touched | 3 | Nine authored files plus regenerated artifacts |
| Blast radius | 3 | One hub-wide routing input, held to the canary |
| Reversibility | 1 | Every file tracked, one `git checkout` per surface |
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: See `../spec.md`
- **Predecessor**: See `../008-utilization-review/implementation-summary.md`, whose section 7 measured the routing this phase extends
- **Field reference under repair**: `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`
