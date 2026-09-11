---
title: "Feature Specification: Phase 6: synthesis-presentation"
description: "Decide whether presenting a synthesized set of recommendations in chat earns its own repo rule, and establish what each of the six deep-loop modes has to present given what it actually produces."
trigger_phrases:
  - "synthesis presentation research"
  - "recommendations in chat"
  - "deep loop results display"
  - "hvr in a reply"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: synthesis-presentation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-verification |
| **Successor** | None |
| **Handoff Criteria** | Research answers the four decision tests and returns a per-mode presentation table for all six deep-loop modes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6**, a second rule in the same programme as the handoff rule phases 001 to 005 shipped.

**Scope Boundary**: Research is read-only and writes only inside `006-synthesis-presentation/`. The rule itself is authored after the research returns. The deep-loop runtime change is a separate packet at `specs/system-deep-loop/046-synthesis-chat-presentation` and is not written here.

**Dependencies**:
- `cli-pi` on PATH, dispatching `deepseek-v4.1-flash` through the DevPass gateway at `max` effort
- The six deep-loop presentation contracts under `.opencode/commands/deep/assets/`
- The HVR standard, `communication.md`, and the repo-rule authoring references

**Deliverables**:
- `research/research.md` with four iterations and resolving `file:line` citations
- An answer to each of the four decision tests
- A per-mode table saying what each of the six modes should present, derived from what that mode actually produces

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A deep-loop run can spend twenty minutes producing a ranked set of recommendations and then report an iteration count, four file paths and a status token. The findings stay in a file the operator has to open. This happened in this packet's own phase 001: the run completed four iterations and wrote a 265-line synthesis, and the presentation contract's success template offered no way to say what it found.

All six modes share the shape. Deep review gets closest with severity tallies and a verdict token, and still names no finding.

### Purpose
Establish whether the fix belongs in a repo rule, in the deep-loop contracts, or in both, and what each mode owes the reader given that the six produce different things. A benchmark reporting a score does not have recommendations to rank.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four read-only research iterations
- The four decision tests, answered with evidence
- A per-mode analysis of all six deep-loop modes: what the mode produces, and what its chat presentation should carry
- Whether HVR can bind a chat reply, given that `communication.md` currently scopes it to documents

### Out of Scope
- Authoring the rule, which follows the research
- Editing any deep-loop presentation contract, which belongs to the sibling packet
- Changing the HVR standard itself

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Four-iteration research output |
| `research/resource-map.md` | Create | Sources consulted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Answer all four decision tests, including whether `communication.md` section 8 already carries this |
| REQ-002 | Return a per-mode table for all six modes: what it produces, what the chat presentation should carry, what it should not |
| REQ-003 | Decide whether HVR can bind a reply, quoting the boundary `communication.md` section 4 sets |
| REQ-004 | Every claim carries a `file:line` citation that resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Say which `AGENTS.md` sections would anchor the rule |
| REQ-006 | Say whether the rule and the deep-loop contracts would duplicate each other, and where the line sits |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four iterations recorded, none a restatement of the brief
- **SC-002**: Each decision test answered with evidence, including an answer of refuse
- **SC-003**: The per-mode table covers all six modes and distinguishes them rather than repeating one answer
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Write containment reverts unrelated dirty files again | High | Full working-tree patch taken before dispatch; orchestrator writes nothing outside the lineage while it runs |
| Risk | One model four times is one opinion repeated | Medium | The restraint test is grounded in an in-session failure rather than model judgment |
| Risk | The per-mode answer collapses into one generic answer | Medium | The brief requires the table to distinguish modes and says why they differ |
| Dependency | DevPass gateway credential | No dispatch reaches the model | Check output text, never the exit code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Exactly four iterations, no early convergence stop
- **NFR-P02**: The run completes unattended in one session

### Security
- **NFR-S01**: No provider key in any prompt or artifact
- **NFR-S02**: Write authority bound to this phase folder

### Reliability
- **NFR-R01**: Each iteration writes state before the next begins
- **NFR-R02**: A failed iteration is recorded, never dropped
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A mode with no recommendations to rank: the table says what it presents instead
- A synthesis too long for chat: the rule must say what gets cut, not just that it is shortened
- A run that found nothing: the presentation still has to say so

### Error Scenarios
- Provider refuses the model id: stop and report, never substitute
- Containment reverts out-of-lineage files: restore from the pre-dispatch patch
- Lineage marked rejected while its research succeeded: read the artifacts, not the status

### State Transitions
- Partial completion: iterations already written stay, the run resumes from state
- Session expiry: state is externalized, a fresh context resumes from the JSONL
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Read-only, two artifacts, six contracts plus the rule corpus |
| Risk | 5/25 | No runtime change in this phase |
| Research | 18/20 | The whole phase is investigation |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the rule and the deep-loop contract change duplicate each other, or does the rule bind the behaviour while the contracts carry the per-mode shape?
- Can HVR bind a reply, or does the rule reach into it for the tells only while `communication.md` keeps the reply boundary?
<!-- /ANCHOR:questions -->

---
