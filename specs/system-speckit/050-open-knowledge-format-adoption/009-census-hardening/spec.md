---
title: "Feature Specification: Phase 9: census-hardening"
description: "The citation census misreads paths that contain spaces, its accuracy per class rests on an 8-row spot check and a full run takes about 11 minutes. This phase fixes the parser and measures accuracy, speed and rebuildability."
trigger_phrases:
  - "census hardening"
  - "citation accuracy per class"
  - "paths with spaces"
  - "redirect table rebuild"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: census-hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-context-type-hardening |
| **Successor** | 010-source-tag-hardening |
| **Handoff Criteria** | The shared citation parser keeps paths that contain spaces, and every class in the census has a measured accuracy with its interval. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: `cite-drift-scan.mjs`, its redirect table and its tests. Phase 008 does not block this phase, so the two can run in parallel.

**Dependencies**:
- The phase 004 census at `5285608745fe` as the baseline.

**Deliverables**:
- `measurement-protocol.md`, dated before any sample is drawn.
- The space-in-path fix with a regression test.
- Accuracy per class from stratified random samples.
- A split of the gone class by cause.
- Timing before and after batching the git reads, and a redirect-table rebuild flag.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The census classified 140,287 citations and showed 27,320 as moved, but its accuracy per class rests on 8 moved rows checked by hand. The citation pattern stops at a space, so `REPO RULES.md:88` reads as `RULES.md:88` and counts as gone. The gone class also mixes real deletions with gitignored external material. A full run takes about 11 minutes, and the rename table has no rebuild flag.

### Purpose
Each class the census prints carries a measured accuracy with its interval, and the census is faster and rebuildable without changing a single count it gets right.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A measurement protocol written before the data: per-class sample sizes, the seed, ground-truth rules and pass thresholds.
- Paths that contain spaces resolve when the full path is a tracked file.
- Accuracy per class for moved, gone, past end and guessed.
- The gone class split into real deletions, ignored external material and parser misses.
- One batched git read instead of one `git show` per doc, timed before and after.
- A flag that rebuilds the redirect table.

### Out of Scope
- Repairing citations in the corpus - the census reports, it does not edit.
- Model calls in the default run - the default stays at zero calls.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | Space-in-path resolution, batched reads, rebuild flag |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modify | Regression tests |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` | Regenerate | Only through the new flag, byte-identical at the same commit |
| `measurement-protocol.md`, `scratch/` | Create | Protocol, samples, labels and results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `measurement-protocol.md` names every sample size, the seed, the ground-truth rule per class and every pass threshold, and its timestamp precedes every result file. |
| REQ-002 | A citation whose path contains spaces resolves when the full path is a tracked file, a test covers it, and the census delta for that case is reported. |
| REQ-003 | Each class gets a stratified random sample at the protocol's size. Ground truth comes from a factual check wherever one exists: file presence, git rename history or line count. |
| REQ-004 | Cases with no factual answer are labeled by two models from different families. Their agreement is reported as Cohen's kappa, and the operator labels the rows they dispute most. |
| REQ-005 | Accuracy per class is reported with a Wilson 95% interval and compared with the protocol's threshold. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The gone class is split by cause, with each cause counted over the whole class. |
| REQ-007 | A full census is timed before and after batching the git reads, and the output is byte-identical apart from the space-in-path delta. The default run still makes no model call and writes no file. |
| REQ-008 | A rebuild flag regenerates the redirect table byte-identical at the same commit. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every census class has a measured accuracy with an interval, from a sample drawn after the protocol was fixed.
- **SC-002**: The census is faster, rebuildable and reports paths with spaces correctly, with no other count changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Two model labelers | Judgment cases go unlabeled | Operator labels them, and the shortfall is recorded |
| Risk | A space-in-path fix over-matches prose | High | Accept a spaced path only when the whole path is a tracked file, and test the negative case |
| Risk | Batched reads change output | Med | Byte-compare the full output before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The protocol sets the speed target before timing starts.
- **NFR-P02**: Timing is the median of three runs on the same commit.

### Security
- **NFR-S01**: The default run reads no credential and makes no model call.
- **NFR-S02**: Ignored and `.env` paths stay refused and are never opened.

### Reliability
- **NFR-R01**: Samples are drawn with a recorded seed, so they can be redrawn.
- **NFR-R02**: The census output is deterministic at a fixed commit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A class smaller than its sample size: the whole class is checked.
- A spaced path that is also prose: stays unresolved unless the whole path is tracked.
- A citation inside a fence: still skipped.

### Error Scenarios
- Git batch reader fails: the scan exits non-zero and names the doc, never falls back silently.
- A labeler run fails: its rows are recorded as unlabeled.
- Rename history unavailable: the rebuild flag exits non-zero.

### State Transitions
- Partial sample: results carry the protocol version and are never merged across versions.
- Commit moves mid-run: the census names its commit, and the run restarts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One scanner, its table and tests |
| Risk | 8/25 | A shared parser used by phase 010 |
| Research | 8/20 | Sampling design and labeling |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- What accuracy threshold per class makes the census fit to act on? The protocol answers this before data.
<!-- /ANCHOR:questions -->

---
