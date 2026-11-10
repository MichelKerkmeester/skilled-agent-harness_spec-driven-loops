---
title: "Feature Specification: Phase 9: existing-issue-fixes"
description: "Three existing defects surfaced during research and planning: the citation pattern cuts paths at a plus sign, the cli-opencode provider doc wrongly says the fan-out runner cannot use the Cline DeepSeek route, and the agent-mirror-sync CI job runs its checker without building the parser it imports. This phase fixes all three."
trigger_phrases:
  - "existing issue fixes"
  - "phase 9 existing issue fixes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: existing-issue-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | worktree branch from sk-git's allocator |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-docs-and-readmes |
| **Successor** | 010-verification-and-closeout |
| **Handoff Criteria** | `validate.sh --strict` on `001-removal-research` reports no unresolved SOURCE tag. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists. Implementation runs in the git worktree.

**Dependencies**:
- Phases: None

**Deliverables**:
- Add `+` to the path class and the lookbehind of `CITATION_RE`, with a test case
- Correct the Cline fan-out note in `providers-and-models.md`
- Add the Node setup, install and `system-spec-kit/shared` build steps the checker needs to `agent-mirror-sync.yml`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`CITATION_RE` in `classifier-cite-drift-scan.mjs` leaves `+` out of its path characters, so a citation of `.skilled/changelog/skilled/v3+/v3.5.0.0.md` reads as `/v3.5.0.0.md` and the SOURCE_TAGS rule reports it as unresolved. `providers-and-models.md` says the Cline DeepSeek entry is not wired into fan-out, but `pinReasoningEffortForModel` pins it to `xhigh` and `parseFanoutConfig` accepts it. `.github/workflows/agent-mirror-sync.yml` runs the agent mirror checker with no install or build step, while the checker loads `parse-frontmatter.js` from the gitignored `system-spec-kit/shared/dist/` build, so a pull request that changes an agent should fail that job on a missing module. This last one is inferred from the workflow and `.gitignore`; no CI run has confirmed it.

### Purpose
A `+` in a cited path resolves, and the provider doc matches the runner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `+` to the path class and the lookbehind of `CITATION_RE`, with a test case
- Correct the Cline fan-out note in `providers-and-models.md`
- Add the Node setup, install and `system-spec-kit/shared` build steps the checker needs to `agent-mirror-sync.yml`

### Out of Scope
- Stale `skill-benchmark` rows - fixed in phase 006
- Stale `BARTER.md` commands - fixed in phase 008

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (3 files) | Delete/Modify | The exact file list this phase owns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A `v3+` citation resolves. Verified by: a new test case in the cite-drift or SOURCE_TAGS tests passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The provider doc matches the code. Verified by: the note names the `xhigh` pin and fan-out support |
| REQ-003 | The CI job can load the checker's parser. Verified by: the workflow builds `system-spec-kit/shared` before running the checker; confirmed on the next pull request that touches an agent |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on `001-removal-research` reports no unresolved SOURCE tag.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases None | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | Widening the pattern lets `+` join a path to a preceding word | L | The lookbehind gains `+` so a match cannot start mid-path; the test covers both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek work unit carries one change set, short enough to finish in one dispatch.

### Security
- **NFR-S01**: Every dispatch names banned operations and allowed write paths and runs in the worktree.

### Reliability
- **NFR-R01**: Each work unit has a tree snapshot to roll back to.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Generated files are never hand-edited; phase 010 regenerates them.

### Error Scenarios
- A work unit writes outside its list: restore the snapshot and re-dispatch with the brief corrected.
- DevPass hits its limit: fall back to Cline at `xhigh`, then wait for the reset.

### State Transitions
- Partial phase: `tasks.md` marks each finished work unit with its snapshot hash.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Shared contracts; reversible by snapshot |
| Research | 3/20 | Done in phase 001 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Decisions are in `../002-removal-plan/decision-record.md`.
<!-- /ANCHOR:questions -->

---
