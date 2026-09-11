---
title: "Feature Specification: Phase 1: git-workflow-run-failures"
description: "Find every git workflow that can fail an automated run in this repository, reproduce each, and adjust sk-git and the hooks so a run survives them, with a test or a recorded reproduction per adjustment."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: git-workflow-run-failures

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

This packet hit several git behaviors that failed or misled an automated run: a containment revert of the orchestrator's own edits, a silently dead detached child, a false advisory on every multi-path add, a stall watchdog that misreads buffered output, hooks that are inert in a worktree, and a branch that moves during a run. This phase starts from those, hunts for more, and fixes the producers.

**Key Decisions**: analysis first on cli-pi, then one adjustment per dispatch; each adjustment changes the producer, ships a test or reproduction, and is confirmed by a fresh fan-out lineage that settles clean

**Critical Dependencies**: phase 005 dispatches settled, because the analysis lineage runs under write containment

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-docs-and-release |
| **Successor** | None |
| **Handoff Criteria** | Every listed workflow marked reproduced or ruled out, every adjustment tested, and a fresh lineage that settles with succeeded 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Crawlable commit history specification.

**Scope Boundary**: sk-git scripts and references, the git hooks under `.opencode/scripts/git-hooks/`, the live-sync scripts under `.opencode/bin/`, and the fan-out runner's containment and watchdog behavior where the producer is git-facing. Runtime changes outside those need their own packet.

**Dependencies**:
- `scratch/observed-failures.md`, the list gathered while this packet ran
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` and `fanout-run.cjs` for the containment and watchdog producers

**Deliverables**:
- `research/research.md`: every candidate workflow with reproduced or ruled out and the producer named
- One adjustment per confirmed failure, each with a harness case or a recorded reproduction
- A fresh fan-out lineage run that settles clean after the adjustments

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Automated runs in this repository hand work to detached children and fan-out lineages, and git behaviors that a human shrugs off end those runs: a revert that erases an orchestrator's work, a hook that blocks a commit nobody can answer for, an advisory that cries wolf on every add. Each one costs a rerun or a false failure.

### Purpose
After this phase a run that touches git survives the behaviors this packet met, and the ones it did not meet have been looked for.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reproduce or rule out every workflow on the observed list and any the analysis adds
- Adjust the producer for each confirmed failure, in sk-git, the hooks or the live-sync scripts
- Document each adjustment in sk-git through sk-doc and cover it with a test
- Prove the result with one clean fan-out lineage

### Out of Scope
- Changing the deep-loop runtime's containment model - a shared runtime with its own packet track; this phase names the seam and the files, and asks
- Anything that fails a run for a non-git reason - out of this packet's purpose

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Analysis with reproductions |
| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` | Modify | Advisory pathspec false positive |
| `.opencode/scripts/git-hooks/*` | Modify | Whatever the analysis confirms |
| `.opencode/skills/sk-git/references/*.md` | Modify | Documented run-safe behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every workflow on the observed list is reproduced or shown impossible, with the command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Each confirmed failure gets an adjustment at the producer with a test or a recorded reproduction |
| REQ-003 | A fresh fan-out lineage launched after the adjustments settles with succeeded 1 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md lists every candidate with a verdict and a command
- **SC-002**: orchestration-summary.json of the proof lineage shows succeeded 1, failed 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | write containment in the runtime | analysis lineage fails on the conductor's edits | the conductor edits nothing while it runs |
| Risk | An adjustment lives in the shared runtime, not in git | Med | name the seam and the files, ask, do not edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: not applicable

### Security
- **NFR-S01**: no adjustment weakens a blocking gate; an automation-aware path is added beside it

### Reliability
- **NFR-R01**: every adjustment is covered by an existing harness or a new case in it

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a candidate that cannot be reproduced is ruled out with the attempt recorded
- Maximum length: not applicable

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: about 8, Systems: 3 |
| Risk | 12/25 | hooks and sync scripts |
| Research | 15/20 | analysis lineage |
| Multi-Agent | 10/15 | one research lineage, several dispatches |
| Coordination | 8/15 | must wait for 005 |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An adjustment silences a gate instead of fixing the producer | H | L | Each adjustment names the mechanism and keeps the gate for interactive use |

---

## 11. USER STORIES

### US-001: A run survives git (Priority: P0)

**As an** orchestrator, **I want** a fan-out lineage to settle clean when the repository is used as documented, **so that** a rerun is never the fix.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Advisories tell the truth (Priority: P1)

**As a** committer, **I want** the preflight advisory to fire only when the command really matches nothing, **so that** I keep reading it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the containment adjustment belongs to this packet or to a system-deep-loop packet: decided when the analysis names the seam.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


