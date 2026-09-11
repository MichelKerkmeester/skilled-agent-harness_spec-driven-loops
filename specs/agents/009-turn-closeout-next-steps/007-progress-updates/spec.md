---
title: "Feature Specification: Phase 7: progress-updates"
description: "Decide whether forward-looking progress updates earn an eleventh repo rule, using the four decision tests, and record the verdict with the test that decided it."
trigger_phrases:
  - "forward looking progress update"
  - "roadmap style update"
  - "what happens at each checkpoint"
  - "say the plan before working"
  - "clipped register versus a plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: progress-updates

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-synthesis-presentation |
| **Successor** | None |
| **Handoff Criteria** | The four decision tests are answered with evidence and the verdict names its deciding test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the turn close-out packet. It asks the same question phases 001 and 006
asked, about a third behaviour: may it exist as a repo rule.

**Scope Boundary**: Research and decision only. No file under `repo-rules/`, and neither
`REPO RULES.md` nor `AGENTS.md`, is modified by this phase. Authoring and wiring were conditional
on a `new-rule-file` verdict, which the tests did not return.

**Dependencies**:
- `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md`, which owns the tests
- Phase 001's output, `repo-rules/handoff-and-questions.md`, the nearest behavioural neighbour
- Phase 006's research, the nearest procedural precedent and the owner of the HVR-in-a-reply answer

**Deliverables**:
- `research/research.md`, the four tests answered with `file:line` evidence
- A verdict naming exactly one route, with the test that decided it
- A drafted `AGENTS.md` bullet the operator may apply, deliberately not applied

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator asked for forward-looking progress updates during multi-step work: a numbered list of
what is planned, what happens next, and what to expect at each checkpoint. Nothing in the framework
obliges that. `AGENTS.md`:177 obliges planning before acting but not telling anyone the plan, and
`AGENTS.md`:153 instructs the opposite reflex while working, "Clipped, act, don't narrate". The
result is a long multi-step turn where the operator sees tool calls and then a boundary report, with
no cheap moment to redirect.

### Purpose
Settle whether that behaviour may exist as an eleventh repo rule, using the four decision tests,
before anything is written. A rule that restates `communication.md` costs context on every reply and
returns nothing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reading the live corpus directly: `AGENTS.md`, `REPO RULES.md`, all ten `repo-rules/` files.
- Running the four decision tests in order and recording each answer with evidence.
- Inventorying the existing homes line by line, `communication.md` sections 7 through 9 first.
- Stating the relationship to `handoff-and-questions.md` and to phase 006's verdict.
- A verdict naming one of `new-rule-file`, `AGENTS.md-row` or `refuse`, and its deciding test.
- Drafting the exact replacement content if the verdict is not a rule file.

### Out of Scope
- Authoring a rule file. Conditional on a `new-rule-file` verdict, which did not arrive.
- Editing `REPO RULES.md` or `AGENTS.md`. The proposed row is new normative content rather than a
  pointer, and this packet may only make pointer edits to `AGENTS.md`.
- Re-opening the HVR-in-a-reply boundary. Phase 006 settled it and this phase adopts that answer.
- The deep-loop fan-out runner. Its write containment reverts dirty files outside the lineage and
  this checkout carries roughly 98 dirty entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/agents/009-turn-closeout-next-steps/007-progress-updates/research/research.md` | Create | The four tests, the home inventory, the verdict |
| `specs/agents/009-turn-closeout-next-steps/007-progress-updates/spec.md` | Create | This document |
| `specs/agents/009-turn-closeout-next-steps/spec.md` | Modify | Phase map row for 007, repaired from the scaffold's malformed output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | All four decision tests answered in order, each citing `file:line` evidence rather than recall |
| REQ-002 | A verdict naming exactly one route and the test that decided it |
| REQ-003 | No file under `repo-rules/`, and neither `REPO RULES.md` nor `AGENTS.md`, modified by this phase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The relationship to `handoff-and-questions.md`, to `communication.md` sections 7 through 9, and to the phase 006 verdict stated plainly, including any duplication |
| REQ-005 | Candidate trigger phrases checked against all ten rule files for collisions |
| REQ-006 | If the verdict is not a rule file, the replacement content drafted precisely enough for the operator to apply in one move |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh <folder> --strict` prints an explicit `RESULT: PASSED`.
- **SC-002**: Every citation in `research/research.md` resolves to the line it names.
- **SC-003**: No change to `repo-rules/`, `REPO RULES.md` or `AGENTS.md` originates in this phase. Both root documents carry a pre-existing uncommitted diff from phases 003 and 004, so the check is a content grep over `git diff` rather than a clean `git status`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Authoring treated as the goal, producing an eleventh rule that restates `communication.md` | High. Context cost on every reply, no behaviour change | Run the tests before drafting; the research records why the file route was refused |
| Risk | A progress update placed at the turn end, where `handoff-and-questions.md` §2 forbids listing your own remaining work | Medium. Damages the rule phase 001 shipped | The research states the before-and-during versus at-the-end boundary explicitly |
| Dependency | `communication.md` line count against the 250 ceiling | Decides whether the section route exists at all | Measured this session at 244 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The proposed content adds one bullet to an always-loaded document, so its context cost is bounded at roughly three lines on every turn.
- **NFR-P02**: No new file is loaded at Gate 5, so the router's per-write load is unchanged.

### Security
- **NFR-S01**: Not applicable. No credential, auth or data surface is touched.
- **NFR-S02**: Not applicable. The phase writes only inside its own spec folder.

### Reliability
- **NFR-R01**: The verdict must survive re-derivation. Every load-bearing claim carries a resolving citation so a later reader can check it rather than trust it.
- **NFR-R02**: Refused routes are recorded with their deciding test so the same proposal is not re-argued from scratch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Read-only turn: Gate 5 never fires, so a rule file carries nothing. This is the case that decided test one.
- Non-interactive dispatch: nobody reads the chat, so the update has no audience and the obligation is inert rather than wrong.
- Single-step turn: no multi-step stretch exists, so the proposed bullet does not fire.

### Error Scenarios
- Trigger-phrase collision: checked against all ten files, none found, and the check is moot once part one refuses.
- Router trigger containment: a new rule's row would be a subset of the existing "Write any substantive reply" row, which no phrase choice fixes.
- Stale validation build: `validate.sh` exits 3 with no rule output rather than passing, so the run is read for an explicit `RESULT: PASSED`.

### State Transitions
- Verdict overturned by operator override: recorded as route two in the research, with the cost named.
- Behaviour grows into a cluster later: recorded as route one, and part one would stop refusing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One research document, one spec folder, zero production files |
| Risk | 6/25 | The risk is writing the wrong thing into an always-loaded document, not breaking anything |
| Research | 16/20 | The whole phase is the research: four tests, ten rule files, two precedents |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **For the operator, and the only thing blocked.** Apply the drafted `AGENTS.md` §3 bullet from `research/research.md` section 7, or override the verdict and direct the rule-file route as you did in phase 001. The bullet is new normative content rather than a pointer, so this packet will not apply it unasked.
- **Still open from phase 001, and it compounds.** The non-pointer clause added to `AGENTS.md`:518 is recorded in the parent spec as awaiting confirmation. A second unconfirmed non-pointer clause should not land before the first is signed off.
- **Consolidatable with phase 006.** Both this request and 006's ask for HVR in a chat message, and both reach the same sentence, `communication.md`:120. One amendment settles both.
<!-- /ANCHOR:questions -->

---

