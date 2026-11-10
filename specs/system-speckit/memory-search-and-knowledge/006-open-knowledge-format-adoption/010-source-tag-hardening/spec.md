---
title: "Feature Specification: Phase 10: source-tag-hardening"
description: "On 20 existing packets, 4,407 of 5,860 source tags warn, and a sample shows the gone class mixes real deletions, a space-in-path bug and gitignored material whose result depends on where the check runs. This phase fixes those and measures accuracy and recall."
trigger_phrases:
  - "source tag hardening"
  - "source tag accuracy"
  - "planted bad tags"
  - "ignored folder consistency"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: source-tag-hardening

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
| **Phase** | 10 of 10 |
| **Predecessor** | 009-census-hardening |
| **Successor** | None |
| **Handoff Criteria** | The `SOURCE_TAGS` rule has a measured accuracy and recall per class, and gives the same result in the worktree and the main checkout. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: The `SOURCE_TAGS` helper and rule, their tests and their measurement. The shared citation parser is phase 009's and is reused, not copied.

**Dependencies**:
- Phase 009's space-in-path fix in the shared parser.

**Deliverables**:
- `measurement-protocol.md`, dated before any sample is drawn.
- Whole-tag paths and consistent handling of ignored folders.
- Accuracy per class on a stratified sample of the 20-packet warnings.
- Recall per class on a planted lineage.
- A worktree versus main-checkout comparison.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
With the cutoff lifted on the 20 comparison packets, 4,407 of 5,860 checked tags warn: 1,748 moved, 1,575 gone, 1,040 guessed and 44 past end. Of the gone tags, 627 are real deletions, 47 are `REPO RULES.md` cut at its space, and most of the other 901 point into gitignored folders. Those read as gone in a worktree, where the material is absent, but are refused silently in the main checkout, where it exists. The rule's accuracy is unmeasured, and its result depends on where it runs.

### Purpose
A `SOURCE_TAGS` warning means the same thing everywhere, and its accuracy and recall per class are measured numbers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A measurement protocol written before the data.
- The path inside a `[SOURCE: ...]` tag is read whole, so spaces survive.
- A tag under a gitignored folder gets one result whether or not the file is present.
- Accuracy per class on a stratified sample, and recall per class on planted tags.
- The 20-packet comparison rerun in the worktree and the main checkout.

### Out of Scope
- Checking whether cited lines support a claim - the rule proves existence only.
- Running on packets created on or before the cutoff by default - root decision D1.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Modify | Whole-tag paths, ignored-folder handling |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts` | Modify | Regression tests |
| `measurement-protocol.md`, `scratch/` | Create | Protocol, samples, labels and results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `measurement-protocol.md` names every sample size, the seed, the ground-truth rule per class and every pass threshold, and its timestamp precedes every result file. |
| REQ-002 | The path inside a `[SOURCE: ...]` tag is read whole, so a tag citing `REPO RULES.md:88` resolves, and a test covers it. |
| REQ-003 | A tag under a gitignored folder gets the same result whether or not the file is present, and a test covers both cases. |
| REQ-004 | A stratified random sample of the warnings, drawn after the fixes, has its accuracy per class reported with a Wilson 95% interval against the protocol's threshold. Ground truth is factual where possible, and two model labelers from different families settle the rest. |
| REQ-005 | A planted lineage with known bad tags of every class measures recall per class. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The 20-packet comparison run in the worktree and in the main checkout gives identical warnings. |
| REQ-007 | With the default cutoff, no existing packet changes its validation result, and the rule's run time per packet is reported before and after. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every warning class has a measured accuracy and recall with intervals.
- **SC-002**: The rule gives one answer for one packet, wherever it runs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 009's parser fix | Spaced paths stay broken | This phase starts after 009's parser tests pass |
| Risk | Silencing ignored folders hides real breakage | Med | Count the silenced tags and report them as their own figure |
| Risk | The main checkout differs for other reasons | Med | Compare at the same commit and list every difference with its cause |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Rule run time per packet does not grow by more than the protocol allows.
- **NFR-P02**: The planted lineage runs in under a minute.

### Security
- **NFR-S01**: Ignored and `.env` paths are never opened.
- **NFR-S02**: The rule makes no model call.

### Reliability
- **NFR-R01**: Samples use a recorded seed.
- **NFR-R02**: Results are identical across checkouts at one commit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A tag holding several citations: each is read whole up to its comma.
- A tag holding a URL or prose: still skipped.
- A class smaller than its sample size: the whole class is checked.

### Error Scenarios
- Git unavailable: the rule reports a skipped check, never a pass.
- A labeler run fails: its rows are recorded as unlabeled.
- The main checkout is at another commit: the comparison waits until both match.

### State Transitions
- Partial sample: results carry the protocol version.
- Cutoff changed mid-run: the run restarts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One helper, its tests and a comparison |
| Risk | 6/25 | Warn-only, cutoff-gated |
| Research | 8/20 | Sampling, labeling and planted recall |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What accuracy per class makes the rule fit to keep at warn? The protocol answers this before data.
<!-- /ANCHOR:questions -->

---
