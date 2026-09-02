---
title: "Feature Specification: Phase 1: utilization-review [template:level-3/spec.md]"
description: "The sk-create-frontmatter playbook had never been executed and the mode had never been measured for reachability, so nobody knew whether a person reaching for it gets what they came for. This phase runs all eleven scenarios, routes eight realistic prompts, and fixes what it can prove."
trigger_phrases:
  - "frontmatter utilization review"
  - "create-frontmatter playbook execution"
  - "frontmatter mode reachability"
  - "numstat inflation measurement"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: utilization-review

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The mode answers well when it is reached, and it is almost never reached. All eleven playbook
scenarios passed on first execution, including a negative control on the one that writes. Six of
eight realistic newcomer prompts returned no recommendation at all, and eight of the seventeen
keyword triggers the manifest declares still reach nothing after the routing pass.

**Key Decisions**: fix the four documentation defects that are provable and inside the mode, and write
up the routing gap and the shared-tier tool defect rather than editing files this phase does not own.

**Critical Dependencies**: the advisor CLI must be live for the routing measurement, and git history
must be present for the version scenarios.

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
| **Phase** | 8 of 8 |
| **Predecessor** | 007-human-voice-playbook |
| **Successor** | None |
| **Handoff Criteria** | Every scenario has a recorded outcome, the routing numbers are measured, and every fix passes the document and package gates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Utilization review of the sk-create-frontmatter mode specification.

**Scope Boundary**: files under `.opencode/skills/sk-doc/sk-create-frontmatter/`, excluding `SKILL.md`,
which is compiled-policy input. Hub routing files are excluded entirely.

**Dependencies**:
- The advisor CLI at `.opencode/bin/skill-advisor.cjs`, for the reachability measurement
- Git history, for the version-derivation scenarios
- The shared-tier scripts under `sk-doc/shared/scripts/`, which the scenarios call and this phase does not modify

**Deliverables**:
- An executed outcome for each of the eleven playbook scenarios
- Measured routing figures for eight newcomer prompts and seventeen declared triggers
- Four documentation defects fixed in place
- Two defects written up with the change each needs

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet ships eleven manual-testing scenarios that had never been run, so no claim about the
mode's behavior rested on an observation. Separately, nothing had measured whether a person who
describes a frontmatter problem in their own words ever reaches the mode, which is the difference
between a mode that works and a mode that is used.

### Purpose
Know, from evidence rather than from the documents, whether a person reaching for this mode gets
what they came for, and fix what that shows to be broken and inside the mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Executing all eleven playbook scenarios and recording each outcome
- Measuring advisor reachability for newcomer prompts and for the declared triggers
- Validating a real document of each of the four newly added class templates
- Confirming the versioning tool's `gate`, `verify` and `--help` behavior
- Correcting provable factual defects in the mode's editable documents

### Out of Scope
- `SKILL.md` - compiled-policy input, so any change to it is prepared text rather than an edit
- Hub routing files, including `sk-doc/graph-metadata.json` - the routing repair belongs to the hub owner
- `sk-doc/shared/scripts/frontmatter-version.mjs` - the mode's own manifest places the engine in the shared tier
- Pre-existing human-voice blockers in files this phase touched - fixing them is a separate sweep

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modify | Move the blockquote out of the class table, and correct the spec-document rule at nine sites |
| `.opencode/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modify | Replace the 3-5x inflation estimate with the measured figure |
| `.opencode/skills/sk-doc/sk-create-frontmatter/README.md` | Modify | Same correction, and drop the worked case that no longer reproduces |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md` | Modify | Same correction in the silent-failures and FMV-002 summaries |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/numstat-gate.md` | Modify | Grade FMV-002 on producing both numbers rather than on the size of the gap |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/version-derivation/idempotent-rerun.md` | Modify | Correct the FMV-004 expectation that `verify` reports every file correct |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every playbook scenario has a recorded outcome: passed, failed with evidence, or could not run with the reason |
| REQ-002 | The mode's reachability from natural language is measured, for newcomer prompts and for the declared triggers |
| REQ-003 | A real document of each newly added class template is validated against that template |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The versioning tool's `gate`, `verify` and `--help` behavior is observed, and ownership of any defect is stated |
| REQ-005 | Any documented figure the corpus contradicts is remeasured and corrected where this phase may edit |
| REQ-006 | Any documented rule the repository contradicts is corrected where this phase may edit |
| REQ-007 | Everything written passes the human-voice, document and spec validators |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: eleven of eleven scenarios executed with a recorded outcome, and the playbook still reports a nonzero operator count
- **SC-002**: the reachability figures are stated as counts observed from the advisor, not as estimates
- **SC-003**: every corrected claim carries the measurement that replaced it
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor CLI | Without it the reachability requirement cannot be met | Confirmed live before measuring, `freshness: live` in every response |
| Dependency | Git history | The version scenarios read commit history and a shallow clone changes the numbers | Full history present, checked by running the engine over 1,214 documents |
| Risk | A sibling session shares this checkout and has run stashes and branch switches | High. Work can revert between writing and reporting | Each file staged the moment it was correct, and every file read back before this phase was reported |
| Risk | Measuring one corpus and generalizing | Medium. The inflation figure could differ elsewhere | Measured two skills including the oldest, 1,214 documents, and the corrected text names the corpus it was measured on |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: a lone `--help` on the versioning engine should return in under a second. It does not, and the finding is written up rather than fixed here.

### Security
- **NFR-S01**: no scenario in this phase runs the versioning engine in `apply` mode, so no document outside the named scope can be rewritten by a scenario run.

### Reliability
- **NFR-R01**: the one scenario that writes creates a single temporary document and is graded only after the tree is clean again.

---

## 8. EDGE CASES

### Data Boundaries
- A skill argument naming the packet rather than a top-level skill directory: the engine discovers zero files and reports success over an empty set, which the playbook documents and this phase confirmed.
- A document with no frontmatter at all: the gate skips it rather than failing, and one such file exists under `sk-doc`.

### Error Scenarios
- `verify` on a healthy tree: exits 1 with mismatches, because writing a version is itself an edit. That is the documented state and not a failure.
- A stale or absent advisor: a prompt returns an empty recommendation list, which cannot be told apart from a prompt that matched nothing. Every measurement in this phase confirmed `freshness: live` first.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 6 modified, Systems: advisor, versioning engine, three validators |
| Risk | 12/25 | Auth: N, API: N, Breaking: N. Documentation only, but the corrected claims are ones other modes cite |
| Research | 18/20 | Eleven unexecuted scenarios, an unmeasured routing surface, and two documented figures needing corpus measurement |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 9/15 | Dependencies: a shared checkout with a concurrent session |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A concurrent session reverts files between writing and reporting | H | M | Stage each file the moment it is correct, and read every file back before reporting |
| R-002 | The corrected inflation figure is measured on two skills and stated as general | M | L | The corrected text names the corpus and the date it was measured |
| R-003 | The routing gap is written up and never acted on, so the mode stays unreachable | H | M | The write-up names the file, the mechanism and the exact vocabulary that reaches nothing |

---

## 11. USER STORIES

### US-001: Reach the contract by describing the problem (Priority: P0)

**As a** person whose frontmatter block was rejected, **I want** to describe that in my own words and be routed to the mode that owns the contract, **so that** I do not have to already know the word `frontmatter` to get help with frontmatter.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Trust a documented number (Priority: P1)

**As a** person deriving a version, **I want** the magnitudes the documents quote to match what the repository actually does, **so that** a plausible wrong answer is distinguishable from a right one.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Who owns the repair of `sk-doc/graph-metadata.json` so the eight dead triggers resolve, and does the mode's `Keyword triggers:` line stay the declaration of record when the hub metadata is what the advisor reads?
- Should `frontmatter-version.mjs` parse `--help` before discovery, given that the engine sits in the shared tier and four command workflows call it?
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
