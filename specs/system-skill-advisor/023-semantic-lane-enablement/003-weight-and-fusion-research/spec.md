---
title: "Feature Specification: Phase 3: weight-and-fusion-research"
description: "Write the research plan that decides the lane weight: the sweep, the coverage-versus-weight comparison, the ranking interaction and the abstain regression. The plan is authored here and run later."
trigger_phrases:
  - "lane weight research"
  - "weight sweep plan"
  - "rrf interaction"
  - "abstain regression"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/003-weight-and-fusion-research"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification"
    next_safe_action: "Write research/research-plan.md and stop before dispatch"
    blockers: []
    key_files:
      - "research/research-plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-003-weight-and-fusion-research"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether a run exists that scores real vectors rather than fixture vectors"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: weight-and-fusion-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-embedding-population |
| **Successor** | 004-gated-enable |
| **Handoff Criteria** | The plan names its iterations, its executors and its questions, and a reader can run it without asking anything |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Semantic lane enablement specification.

**Scope Boundary**: Authoring a research plan. No run, no weight change and no code change.

**Dependencies**:
- Phase 001, for the baseline every sweep result is compared against.
- Phase 002, because a sweep run against missing vectors measures the gap rather than the weight.

**Deliverables**:
- `research/research-plan.md`, carrying the questions, the iteration budget, the executors and the artifact each question produces.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The lane weight is 0.05 because that is what the registry has always said. No measurement chose
it, and no measurement has tested it. Raising it is a scoring change that touches every routing
decision the advisor makes, so the change needs an argument stronger than the observation that
0.05 is small.

Two facts make a naive sweep useless. The accuracy gate captures its baseline with the test flag
set, which makes the lane substitute deterministic vectors, so a sweep measured through that gate
would be measuring fixtures rather than embeddings. And the lane feeds two separate paths in
ranking: the fused score, and a rerank that only applies inside a narrow window when two
candidates are close. A weight change moves both, and a result that cannot tell them apart cannot
be acted on.

### Purpose

Produce a plan a reader can execute without asking a question, whose answers are numbers rather
than opinions, and which phase 004 can apply directly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The questions, written so each has one artifact that answers it.
- The iteration budget, the stop policy and the executors.
- The measurement regime, including what runs with real vectors and what runs with fixtures.
- The regression set, including the out-of-scope controls and the abstain count.

### Out of Scope
- Running the research. Dispatch is a separate, separately gated action.
- Changing any weight. Phase 004 applies whatever this plan concludes.
- Reconciling the two scorers. They disagree on roughly a third of prompts, and that is a different packet.
- Per-mode embeddings. The graph holds hub-level nodes, and changing that granularity is a design change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research-plan.md` | Create | The questions, the budget, the executors and the artifacts |
| `research/measurement-regime.md` | Create | What is measured with real vectors, what with fixtures, and why |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | State every research question with the artifact that answers it and the number that closes it |
| REQ-002 | State the iteration budget, the stop policy and the executors, as a command a reader can run |
| REQ-003 | State which measurements use real vectors and which use fixtures, and why the distinction changes the answer |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Name the regression set, including the 224 out-of-scope controls and the abstain count that must not rise |
| REQ-005 | Separate the fused-score path from the rerank window, so a result attributes the movement to one of them |
| REQ-006 | Re-check each executor against its own skill document before dispatch, and record the models that were available |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every question names its artifact and its closing number. Matches AC-001.
- **SC-002**: The dispatch command is written out in full, with its iteration count and stop policy. Matches AC-002.
- **SC-003**: The measurement regime says which numbers come from real vectors. Matches AC-003.
- **SC-004**: The regression set is named with its row counts. Matches AC-004.
- **SC-005**: Nothing in the repository changed except the two documents this phase creates. Matches AC-006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 coverage | A sweep against missing vectors measures the wrong variable | The plan states full coverage as a precondition and names the query that proves it |
| Dependency | The executor roster | A named model that no longer exists stops the run at dispatch | REQ-006 requires re-reading each executor's skill document immediately before dispatch |
| Risk | The plan is executed before phase 002 finishes | High | The plan carries its precondition as its first line, and the goal criteria repeat it |
| Risk | A sweep result is read as a decision | Medium | The plan produces numbers, and phase 004 records the choice as a decision with its own reasoning |
| Risk | Early convergence stops the run at an agreeable answer | Medium | The stop policy is set to run the full budget, so convergence is telemetry rather than a stop |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each sweep point re-scores the frozen corpora rather than sampling them, so results are comparable across points.
- **NFR-P02**: A single sweep point completes inside one working session, or the plan says how it is split.

### Security
- **NFR-S01**: Research runs read the repository and write only inside this phase folder.

### Reliability
- **NFR-R01**: Every sweep point records the weights it ran under, so a result can be reproduced without reading the run log.
- **NFR-R02**: The run writes its state where the deep-research loop expects it, rather than in an improvised location.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a sweep point where the lane contributes nothing, which is a valid result and is recorded as one.
- Maximum length: the full 444-signal corpus at every sweep point, which is the largest run the plan schedules.
- Invalid format: a weight set that does not sum to the live total, which the resolver clamps per lane rather than rejecting.

### Error Scenarios
- External service failure: an executor that cannot be reached, which stops the run rather than silently reducing the iteration count.
- Network timeout: a long iteration, which the loop already bounds with its own timeout.
- Concurrent access: two sweep points sharing one daemon, which the plan avoids by running points in sequence.

### State Transitions
- Partial completion: a run that stops mid-budget, which resumes from its own state file.
- Session expiry: a lineage that outlives its timeout, which the plan bounds explicitly.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Two documents, no code |
| Risk | 3/25 | Nothing executes, so nothing regresses |
| Research | 18/20 | Designing a measurement whose default gate cannot see the variable under test |
| **Total** | **25/70** | **Level 2** |

`recommend-level.sh --loc 40 --files 3` returns level 0 at score 11, which scores lines of code
rather than research. This phase is authored at level 2 because it closes against acceptance
criteria and because its output decides a scoring change.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether any run scores real vectors rather than fixtures. Phase 001 answers it, and if the answer is none, this plan must design that run rather than assume it.
- Whether the executor roster still carries the models named in the plan. REQ-006 makes that a pre-dispatch check rather than an assumption.
<!-- /ANCHOR:questions -->

---
