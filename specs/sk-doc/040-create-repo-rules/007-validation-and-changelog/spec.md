---
title: "Feature Specification: Phase 7: Validation, Changelog and Closeout"
description: "Everything is built and nothing has been exercised. This phase runs the mode against a real request end to end, writes the changelog that finally makes the packet's empty directory exist in git, symlinks it into the sk-doc changelog tree, and closes the packet on evidence rather than on the absence of errors."
trigger_phrases:
  - "validation and closeout"
  - "changelog symlink"
  - "advisor smoke test"
  - "end to end exercise"
  - "packet closure"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: Validation, Changelog and Closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-command-and-hub-wiring |
| **Successor** | None |
| **Handoff Criteria** | The mode has authored a real rule and refused a real request; the changelog symlink resolves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the create-repo-rule packet, and it closes it.

**Scope Boundary**: exercising the mode, the changelog and its symlink, and packet
closure. No new capability - if the exercise finds a defect, it is fixed in the phase
that owns it rather than patched here.

**Dependencies**:
- Phases 3 through 6, so there is a reachable mode to exercise.

**Deliverables**:
- An end-to-end exercise: one request accepted and authored, one refused.
- `changelog/v1.0.0.0.md` in the mode packet.
- The symlink at `.opencode/changelog/sk-doc/create-repo-rule`.
- Recursive validation across the parent and all seven children.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six phases have produced a contract, a packet, two templates, a quality bar, a lifecycle contract and a registered command - and not one of them has been used. Every check so far has been structural: does the file parse, does the tree match, does the count rise. None of that answers whether an agent handed a real request routes here, runs the decision tests, and produces something worth loading. Separately, the packet's `changelog/` directory has existed since phase 3 and does not exist in git, because git does not track empty directories and the first version file was always this phase's output.

### Purpose
Exercise the mode against a real request in both directions - one accepted, one refused - and close the packet on what that produced.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **The accept path**: a genuine rule request, run end to end, producing a rule that passes the structural assertions and the phase-4 standards.
- **The refuse path**: a request that should fail a decision test, confirming the refusal names the test and the destination. This matters more than the accept path, because refusing is the common outcome.
- **The advisor smoke test**: confirm a request phrased in a user's own words reaches this mode rather than a sibling.
- **`changelog/v1.0.0.0.md`** to the changelog mode's format, which also makes the directory exist in git.
- **The symlink** `.opencode/changelog/sk-doc/create-repo-rule` pointing at the packet's changelog, matching the sibling convention.
- **Recursive validation** across the parent and all seven children.
- **Packet reconciliation**: statuses, the phase map, and the parent's completion claims agreeing.

### Out of Scope
- **Fixing defects the exercise finds** - they are reported and routed to the phase that owns them. A closeout phase that quietly patches earlier work hides where the defect came from.
- **Authoring real rules for this repository** - the exercise produces one as evidence; whether it ships is a separate decision.
- **A benchmark or manual-testing playbook** - both deferred with precedent in `target-tree.md`.
- **Enforcement tooling** - excluded in every phase since the first.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../sk-create-repo-rule/changelog/v1.0.0.0.md` | Create | First release entry; also materializes the directory |
| `.opencode/changelog/sk-doc/create-repo-rule` | Create | Symlink to the packet changelog |
| `../spec.md` | Modify | Phase map and parent status |
| Exercise artifacts | Create | In this phase's folder, as evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The mode is exercised on a real accept and a real refusal, with both outputs kept as evidence. |
| REQ-002 | The refusal names the decision test it failed and where the content belongs instead. |
| REQ-003 | The changelog symlink resolves - followed to a real directory, not merely created. |
| REQ-004 | `validate.sh --recursive --strict` passes for the parent and all seven children. |
| REQ-005 | Defects found by the exercise are reported and attributed to the owning phase, never silently patched here. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The advisor routes a plain-language rule request to this mode rather than a sibling. |
| REQ-007 | The changelog matches the format the changelog mode produces. |
| REQ-008 | The generated rule passes the phase-4 standards, not only the structural floor. |
| REQ-009 | The packet's documents agree with each other about completion state. |
| REQ-010 | The adoption outcome is reported honestly, including the case where the exercise found the mode wanting. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A rule produced by the mode passes both the structural assertions and the quality standards.
- **SC-002**: A refused request produces a named test and a named destination, not a bare no.
- **SC-003**: `.opencode/changelog/sk-doc/create-repo-rule` resolves to the packet's changelog directory.
- **SC-004**: The parent and all seven children validate, and no document contradicts another about state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The exercise is run charitably, choosing a request the mode obviously handles | High - it would certify nothing | Choose the refusal case first and choose it to be genuinely borderline; a mode that only refuses the obvious has not been tested |
| Risk | A defect is patched here rather than routed to its phase | Med - it would hide where the defect came from and leave the owning phase's record false | REQ-005 makes attribution explicit |
| Risk | The symlink is created and never followed | Med, and precedented in a sibling packet | REQ-003 requires following it |
| Risk | Closing the packet because the phases are done rather than because the mode works | High - it is the difference between finished and shipped | REQ-001 gates closure on an exercise, not on phase count |
| Dependency | Phases 3-6 | Nothing to exercise | Sequenced |
| Dependency | The advisor being reachable | The smoke test cannot run | Its connection has been intermittent this session; if it is down, the test is reported as not run rather than as passed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Evidence
- **NFR-E01**: Both exercise outputs are kept, including the refusal.
- **NFR-E02**: Every closure claim cites an observation rather than the absence of an error.

### Honesty
- **NFR-H01**: A check that could not run is reported as not run, never as passed.
- **NFR-H02**: A defect found at closeout is named in the summary even when it is not fixed here.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Exercise Boundaries
- **The accepted request produces a rule failing the phase-4 standards**: a phase-4 defect, reported there.
- **The refused request is accepted by the tests**: a phase-2 defect, and the more serious of the two.
- **The mode produces a structurally invalid rule**: a phase-3 defect, and the templates are the suspect.

### Symlink Boundaries
- **The changelog directory is still empty when the symlink is made**: write the version file first, or the link points at nothing git will carry.
- **A symlink already exists at that path**: inspect before overwriting.

### Closure Boundaries
- **A child left incomplete**: the parent says so rather than reporting Complete over it.
- **The advisor is unreachable**: the smoke test is recorded as not run, and closure notes the gap.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One changelog, one symlink, two exercise artifacts, reconciliation |
| Risk | 11/25 | Closes the packet; the risk is certifying something that does not work |
| Research | 5/20 | Formats and conventions already established by siblings |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the rule the exercise produces be shipped into `repo-rules/`? **Leaning no by default: it exists to prove the mode works, and shipping a rule because it was convenient to generate is exactly the restraint failure the decision tests refuse. Operator call if the rule turns out to be genuinely wanted.**
- What happens if the exercise shows the mode works but is not worth using? **Report it. Seven phases of sunk cost is not a reason to recommend a tool, and that verdict is more useful than a green checklist.**
<!-- /ANCHOR:questions -->

---
