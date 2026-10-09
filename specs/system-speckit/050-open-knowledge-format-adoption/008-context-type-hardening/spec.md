---
title: "Feature Specification: Phase 8: context-type-hardening"
description: "The contextType warning prints nothing today, so nobody knows whether generators or model writers emit off-list values, what the warning catches or how often it is wrong. This phase measures all three."
trigger_phrases:
  - "context type hardening"
  - "frontmatter value measurement"
  - "warning recall matrix"
  - "off-list rate"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: context-type-hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-docs-and-closeout |
| **Successor** | 009-census-hardening |
| **Handoff Criteria** | Every measurement below has a recorded number, the command behind it and a 95% interval where it is a rate. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: Measure the shared `contextType` and `importance_tier` list and its two warnings, the spec-kit `FRONTMATTER_VALUES` rule and the sk-doc `validate_document.py` check. Fix only what the measurement shows is wrong.

**Dependencies**:
- Phase 003's shared list and both warnings, and the phase 007 rule tests.

**Deliverables**:
- `measurement-protocol.md`, dated before any data is drawn.
- Off-list rates for generators and for three model writers.
- A recall and precision result for both warnings over a planted matrix.
- A false-alarm count over every existing spec doc and skill doc.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 measured the cleanup: 33 distinct spec-doc values became 12, and 102 off-list values became 0. It did not measure the warning going forward. Nobody knows whether the `/create:*` generators, the spec-kit templates or a model writing a spec doc cold emit off-list values, what the two warnings catch across quoting, case and position, or how often they warn wrongly.

### Purpose
Every claim about the warnings' forward value rests on a number with its command and its interval.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A measurement protocol written before the data: sets, sizes, seeds and pass thresholds.
- Off-list rate of every generator that seeds `contextType` or `importance_tier`.
- Off-list rate of docs written cold by DeepSeek V4.1 Flash, Luna 6 and SWE 2.
- Recall and precision of both warnings over a planted matrix.
- False alarms over the existing corpus.
- A source fix and a regression test for each defect the measurement finds.

### Out of Scope
- Turning either warning into an error - root decision D1 keeps new checks warn-only.
- Changing the canonical values or aliases - only a measured defect can justify that, and it would be its own decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `measurement-protocol.md` | Create | The protocol, fixed before data |
| `scratch/` | Create | Matrix fixtures, model outputs and result files |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs` | Modify only on a measured defect | Source fix |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify only on a measured defect | Source fix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `measurement-protocol.md` names every set, size, seed and pass threshold, and its timestamp precedes every result file. |
| REQ-002 | Every generator that seeds `contextType` or `importance_tier` is enumerated and its off-list rate reported. |
| REQ-003 | Each of the three models writes the protocol's number of spec docs cold from one fixed brief, and its off-list rate is reported with a Wilson 95% interval. |
| REQ-004 | Both warnings run over a planted matrix of every canonical value, every alias and the protocol's off-list values, crossed with quoting, letter case and position. Recall and precision are reported for each warning. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Both warnings run over every existing spec doc and skill doc, and each warning they print is listed with its cause. |
| REQ-006 | Each defect the measurement finds is fixed at its source with a regression test, and no packet changes its validation result. |
| REQ-007 | Every number in the implementation summary names the command that produced it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recall and precision of both warnings over the planted matrix are known, and both are 100% or each miss has a fix.
- **SC-002**: The forward off-list rate for generators and model writers is a number with an interval, not a guess.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The three CLI executors | Model rates cannot be measured | Record the shortfall per model and report the others |
| Risk | Thresholds chosen after seeing data | High | REQ-001 dates the protocol before any result file |
| Risk | Small model samples give wide intervals | Med | Report the interval and do not claim more than it supports |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The matrix run finishes in under five minutes.
- **NFR-P02**: The corpus run reports its wall time.

### Security
- **NFR-S01**: Model briefs carry no credential or private path.
- **NFR-S02**: Model outputs stay in `scratch/` and never enter the corpus.

### Reliability
- **NFR-R01**: The matrix is generated from a fixed seed, so a rerun gives the same rows.
- **NFR-R02**: Every result file can be regenerated by the command recorded beside it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty value: `FRONTMATTER_VALID` owns it, so the matrix expects no warning from these rules.
- A value only in the body: expects no warning.
- Mixed case and quotes: expects the alias to pass.

### Error Scenarios
- A model run fails or times out: the row is recorded as missing, never as clean.
- The shared list is unreadable: both warnings report a skipped check, and the matrix records that row as a failure.
- Two warnings disagree: the disagreement is listed and traced.

### State Transitions
- Partial run: results carry the matrix version, so a partial set is never mixed with a full one.
- Protocol change after data: forbidden, a new protocol version starts a new run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two checkers, generators, three model runs |
| Risk | 4/25 | Measurement first, fixes only on evidence |
| Research | 8/20 | Matrix design and model sampling |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How many cold-written docs per model does the protocol need for an interval narrow enough to act on? The protocol answers this before data.
<!-- /ANCHOR:questions -->

---
