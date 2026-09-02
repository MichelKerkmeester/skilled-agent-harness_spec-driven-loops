---
title: "Feature Specification: Phase 1: utilization-review"
description: "Utilization review of the sk-create-with-human-voice mode: run the never-executed manual-testing playbook end to end, route newcomer prompts through the advisor, exercise the scanner and the scope gate, then fix what is provable and write up what needs a decision."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: utilization-review

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The `sk-create-with-human-voice` mode passed its conformance audit and had never been used. This phase asks the different question: does a person reaching for it get what they came for. It runs all nine manual-testing scenarios for the first time, routes eight newcomer prompts through the live advisor, exercises the template-payload detection and the fixture exemption on real files, and constructs the boundary case where the standard and accuracy pull apart.

**Key Decisions**: fix only what is provable and inside the mode, write up anything needing a rule change or a hub change. Leave `SKILL.md` untouched because it is compiled-policy input.

**Critical Dependencies**: the shipped scanner, the two shipped fixtures and the live skill advisor daemon.

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
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Acceptance criteria all `Met` and the phase validates `--strict` clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Utilization review of the create-with-human-voice mode specification.

**Scope Boundary**: the packet at `.opencode/skills/sk-doc/sk-create-with-human-voice/`, excluding `SKILL.md` and every hub routing file.

**Dependencies**:
- `scripts/hvr_scan.py` and the standard it parses at run time
- `.opencode/skills/sk-doc/scripts/validate_document.py`
- `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
- the skill advisor daemon behind `.opencode/bin/skill-advisor.cjs`

**Deliverables**:
- a recorded outcome for all nine playbook scenarios
- a routing result for eight newcomer prompts
- five fixes inside the mode
- six write-ups for decisions that sit outside it

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode ships a nine-scenario manual-testing playbook that nobody had ever run, so no claim it makes about the workflow had been tested against the workflow. Its own report template emitted six hard blockers of the standard it owns, its worked example no longer matched the scanner it cites, and half of what a newcomer would type never reaches it.

### Purpose
Every scenario has a recorded outcome, every provable defect inside the mode is fixed, and every defect outside it is written up with the evidence that found it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Executing all nine playbook scenarios and recording each outcome with evidence
- Routing eight newcomer prompts through the live advisor and recording where each lands
- Exercising template-payload detection and the document-validator fixture exemption on real files
- Fixing provable defects inside the packet

### Out of Scope
- `SKILL.md` - compiled-policy input, changes are recorded as prepared text instead
- Hub routing files (`graph-metadata.json`, `hub-router.json`, `mode-registry.json`) - the routing gap belongs to the hub and is written up
- `references/hvr-rules.md` scoring semantics - two incompatible scoring systems is a rule change, not a repair
- `scripts/hvr_scan.py` behavior - the template-detection and Oxford heuristics are arguably correct and are written up

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/assets/voice-report-template.md` | Modify | Remove six em dashes from the fenced template payload |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md` | Modify | Sync the worked example with live scanner output |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` | Modify | Record the template-detection caveat with its observed instance |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/README.md` | Modify | Correct the invocation instruction |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md` | Modify | Correct the runnability claim and name the operator-supplied targets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the nine playbook scenarios carries a recorded outcome: passed, failed with evidence, or could not run with the reason |
| REQ-002 | Anything this phase writes or edits inside the packet scans with zero new hard blockers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Eight newcomer prompts are routed through the live advisor and each result is recorded |
| REQ-004 | The playbook package still satisfies its operator contract with a nonzero operator count |
| REQ-005 | Every finding that cannot be fixed inside the mode is written up with the observation that found it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate-playbook-package.cjs` prints `PASS` with `operator=9` after the playbook edits
- **SC-002**: `hvr_scan.py` exits 0 on the report template, which exited 1 with six hard blockers before this phase
- **SC-003**: `validate_document.py` exits 0 on all five edited files
- **SC-004**: the two shipped fixture controls report the same numbers after the phase as before it
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Skill advisor daemon | Routing results cannot be measured | The daemon answered live for all eight prompts, `freshness=live` on each |
| Risk | A playbook edit reclassifies a scenario as routing gold | The operator count drops to zero and the contract silently stops being checked | Only prose in the root document changed, no `expected_*` frontmatter was added, and the count was re-read after the edit |
| Risk | A concurrent session reverts this work | Every claim in this packet becomes false without warning | Observed once. File modification times and the reflog are the evidence, and the fixes were re-applied and re-verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: a full scan of any packet document finishes in under a second, which is what makes the re-scan step affordable

### Security
- **NFR-S01**: no scenario in this phase writes outside the packet or the phase folder

### Reliability
- **NFR-R01**: the scanner fails closed on a thin parse, exiting 2 rather than reporting a clean scan

---

## 8. EDGE CASES

### Data Boundaries
- A document with no mechanical findings still owes the judgment pass, which `HVT-003` proves on a target scoring 99 out of 100
- A document past roughly 400 lines drops the absolute score for hard blockers plus density, which `HVS-003` exercises on a 510-line target

### Error Scenarios
- The standard's section shape moves: the scanner exits 2 and refuses to report a clean scan
- A target outside the repository: `git status --porcelain` cannot assert it, so a checksum substitutes and the substitution is recorded

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 5 edited, LOC: about 40 changed, Systems: 1 packet |
| Risk | 14/25 | Auth: N, API: N, Breaking: N, but the report template is a shared shape |
| Research | 18/20 | Nine unexecuted scenarios, eight routing probes and two tool surfaces |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: scanner, document validator, playbook validator, advisor daemon |
| **Total** | **56/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A playbook edit turns an operator scenario into a skipped routing-gold file | H | L | The operator count is read after every playbook edit, not assumed |
| R-002 | The worked example drifts again when the file it cites changes | M | M | Written up as an operator item, since pinning it needs a decision |
| R-003 | A concurrent session restores this branch over staged work | H | M | Observed once in this session. Verify by content before reporting, never by memory of having written it |

---

## 11. USER STORIES

### US-001: A newcomer asks for prose that sounds human (Priority: P0)

**As a** writer with a draft that reads like a machine wrote it, **I want** my request to reach the voice mode and produce an edited draft with both scan numbers, **so that** I can see the pass happened rather than take its word for it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: An operator runs the playbook (Priority: P1)

**As an** operator validating the packet before it ships, **I want** every scenario to name the target it needs, **so that** a run measures the workflow rather than stalling on a placeholder.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Should the standard's five category weights be reconciled with the point system, or should one of the two be retired
- Should the hub's advisor vocabulary gain the plain phrasings a newcomer uses, given four of eight probes missed the mode
- Should `is_template_path` gate on the fence language tag so a code payload is not reported as prose
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
