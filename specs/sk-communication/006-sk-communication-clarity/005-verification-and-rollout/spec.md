---
title: "Feature Specification: Phase 5: verification-and-rollout"
description: "Measure whether the landed changes altered observable output, then carry them across the runtime surfaces that derive from the root doc."
trigger_phrases:
  - "reply scoring harness"
  - "communication behavior benchmark"
  - "runtime mirror rollout"
  - "recursive strict validation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: verification-and-rollout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-sk-communication-upgrade |
| **Successor** | None |
| **Handoff Criteria** | The program closes only with a measured before-and-after and every derived surface regenerated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-communication clarity program.

**Scope Boundary**: Measurement and rollout of what phases 003 and 004 landed. This phase changes
no rule text and no skill contract. If a measurement shows a landed rule made output worse, it
reports that and the change is reverted in the phase that owns it.

**Dependencies**:
- Phases 003 and 004 landed, so there is something to measure.
- A baseline captured before those phases, or the measurement has no before.

**Deliverables**:
- A reply-scoring harness with fixed cases, a blind scoring rubric, and a recorded baseline.
- A before-and-after result with the delta reported, including the parts that did not move.
- The persistence mechanism, if phase 002 adopted one, so the rules survive a long thread.
- Every derived runtime surface regenerated, and the whole packet validated recursively.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nothing in this repository measures whether a communication rule changes a reply. The document
scanner reads a file on disk, not a live answer, so every claim that a rule improves replies is
currently unmeasured. Two mechanism gaps sit beside it. The reply-shape rule loads at the gate that
fires before a write, so a read-only turn never loads it, and no surface re-asserts the rules as a
thread grows long, which is the drift the response-style source names as its main failure mode.
Separately, one runtime's root doc is partly generated from the repository root doc, so a root-doc
change that is not regenerated leaves two runtimes disagreeing.

### Purpose

Produce a measured before-and-after for the landed changes, close the two mechanism gaps if they
were adopted, and leave every derived surface consistent with its source.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A reply-scoring harness under the skill's existing benchmark folder, with fixed cases and a blind rubric.
- A baseline captured from the pre-change state, and a re-run from the final state.
- A release gate stated in terms of what this repository can actually observe.
- The persistence mechanism, if adopted: a session-start injection or an equivalent re-assertion surface.
- Regenerating the derived runtime surfaces, including the generated section of the Codex root doc.
- `validate.sh --recursive --strict` over the whole packet.

### Out of Scope
- Changing rule text or skill contracts, which belong to phases 003 and 004.
- A blind human study, which this repository does not run and which a gate here must not pretend to have.
- Extending the harness to score anything beyond the cases the adopted rules target.
- Turning the projection on by default, which stays an operator decision on their own machine.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/benchmark/` | Create | Reply cases, blind rubric, and the recorded runs |
| `.opencode/hooks/` | Create | The persistence mechanism, only if phase 002 adopted one |
| `.codex/AGENTS.md` | Modify | Regenerate the section derived from the repository root doc |
| `.opencode/skills/sk-communication/changelog/` | Modify | Record the measured result alongside the change |
| `specs/sk-communication/006-sk-communication-clarity/` | Modify | Close the phase map and reconcile completion metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A baseline exists from the pre-change state, and the after-run uses the same cases, rubric and scoring procedure |
| REQ-002 | The delta is reported including the dimensions that did not move, because reporting only the improvements is how a measurement flatters itself |
| REQ-003 | Scoring is blind to which condition produced a reply, so the label cannot carry the score |
| REQ-004 | The release gate names only conditions this repository can observe, and says plainly which it cannot. The research settled one already: the source's powered blind human study has no equivalent capability here, so that condition is named as a gap rather than inherited |
| REQ-005 | Every derived runtime surface is regenerated from its source, and the generated sections match |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The persistence mechanism, if adopted, is opt-in and fails open: a broken mechanism never blocks a session start |
| REQ-007 | `validate.sh --recursive --strict` reports PASSED for the parent and all five children |
| REQ-008 | A measured regression on any dimension blocks the program's completion claim until it is fixed or waived by a decision record |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The harness runs from a clean checkout and produces a scored result file per condition.
- **SC-002**: The before-and-after delta is recorded per dimension, with no dimension omitted.
- **SC-003**: Recursive strict validation reports PASSED for the parent and all five children, read from the output rather than the exit status.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003 and 004 landed | Nothing to measure | The phase does not open until both close |
| Dependency | A pre-change baseline | The measurement has no before, so no regression claim is possible | Capture the baseline in phase 003's setup, before its first edit |
| Risk | A harness that scores what the rules already enforce | The result is a tautology dressed as evidence | Cases target the specific failures the adopted rules name, and include cases no adopted rule covers |
| Risk | A gate modeled on a study this repository cannot run | A completion claim resting on evidence that does not exist | REQ-004 restricts the gate to observable conditions and requires naming the gap |
| Risk | A session-start mechanism that throws | Every session start breaks | REQ-006 makes it opt-in and fail-open, exiting zero on any error |
| Risk | A regenerated surface diverging from its source | Two runtimes behaving differently under one rule set | REQ-005 makes the regeneration a blocker, verified by comparing generated sections |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The persistence mechanism adds no perceptible delay to session start, and its timeout is bounded.
- **NFR-P02**: The harness completes within one unattended run rather than requiring supervision.

### Security
- **NFR-S01**: No credential or key value appears in a case file, a rubric, or a recorded run.
- **NFR-S02**: The mechanism reads only the files it owns, resolved relative to its own location rather than a trusted environment variable.

### Reliability
- **NFR-R01**: Any mechanism failure exits zero and never blocks a session start.
- **NFR-R02**: Recorded runs are immutable once written, so a later run cannot overwrite its own baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a case set with no cases fails the harness loudly rather than reporting a vacuous pass.
- Maximum length: a reply longer than the scoring window is truncated at a recorded boundary, and the truncation is reported.
- Invalid format: a malformed case file fails the run rather than being skipped silently.

### Error Scenarios
- External service failure: a scoring model that is unreachable halts the run rather than recording a default score.
- Network timeout: the same, because a timeout recorded as a score is a fabricated measurement.
- Concurrent access: two runs write to separate recorded directories, never to a shared result file.

### State Transitions
- Partial completion: a half-finished run is recorded as partial and cannot serve as a baseline.
- Session expiry: the mechanism's opt-in flag is read per session, so an expired session simply reads it again.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | A harness, an optional hook, a regenerated surface, and packet closure |
| Risk | 14/25 | A session-start mechanism can break every session, which is why it must fail open |
| Research | 8/20 | The rubric design borrows an existing shape rather than inventing one |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which scoring surface judges the replies, given that a self-judged run is the same opinion twice?
- Is the persistence mechanism a session-start injection, a gate change, or an operator-run command, and does an opt-in default make it useless in practice?
<!-- /ANCHOR:questions -->

---

