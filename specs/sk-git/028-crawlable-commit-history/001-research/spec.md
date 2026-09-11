---
title: "Feature Specification: Phase 1: research"
description: "Ten iterations of DeepSeek V4.1 Flash deep research on a numbered, searchable commit grammar for sk-git, on minting a per-commit identifier without collisions, and on rewriting 9,106 commits with their spec citations remapped."
trigger_phrases:
  - "commit format research"
  - "crawlable commit research"
  - "commit identifier minting"
  - "history rewrite research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: research

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

sk-git's commits are readable but not addressable. This phase runs ten research iterations, one angle each, to find the grammar, the identifier rule and the rewrite method the later phases implement. It produces findings only.

**Key Decisions**: cli-pi with deepseek-v4.1-flash at max thinking, convergence off, ten iterations required

**Critical Dependencies**: `pi` on PATH with the llmgateway provider credential, the spec-kit runtime built in the worktree

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-format-decision |
| **Handoff Criteria** | Ten iteration records in deep-research-state.jsonl and a ranked research/research.md with file:line citations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Crawlable Commit History specification.

**Scope Boundary**: Findings only. The research writes under `research/` and changes nothing else.

**Dependencies**:
- `.opencode/skills/sk-git/SKILL.md` lines 375 to 495, the current commit contract
- `.opencode/scripts/git-hooks/commit-msg`, the blocking hook
- The live history: 9,106 commits, 59 branches, 20 worktrees, 5 tags

**Deliverables**:
- `research/research.md` with ranked recommendations
- `research/iterations/iteration-001.md` through `iteration-010.md`
- `research/deep-research-state.jsonl` with ten records

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing in a commit today can be looked up the way `sk-git/028` can. The hook rejects numeric scopes and process labels in the subject, spec paths reach commits only through an optional `Refs:` line, and the hash is the only stable key. The later phases need a grammar and an identifier rule chosen on evidence, and a rewrite method that does not orphan the ~11,000 hash citations in `specs/`.

### Purpose
When this phase is done, the grammar candidates, the identifier minting options and the rewrite method are ranked with evidence, and phase 002 can freeze one of each. The findings live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The subject, body and trailer grammar that makes commits findable by `git log --grep`, GitHub search and the spec-kit trigger index
- How a stable per-commit number is minted at commit time and survives rebases, cherry-picks and parallel worktrees
- How the retrofit assigns identifiers to 9,106 existing commits, from their `Refs:` lines, touched packet paths or a fixed ordinal
- How `git filter-repo` rewrites message text, emits the old-to-new map and how the citations under `specs/` are remapped
- What the `commit-msg` hook, the preflight rule and the advisory layer must change to hold the new grammar

### Out of Scope
- Implementing any of it - phases 003 to 005 own that
- Changing the worktree and branch grammar - sk-git already owns it and it is not in question

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Ranked findings |
| `research/iterations/*.md` | Create | One record per iteration |
| `research/deep-research-state.jsonl` | Create | Loop state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Ten iterations run on cli-pi with deepseek-v4.1-flash at max thinking, convergence off |
| REQ-002 | Every finding cites a local file and line |
| REQ-003 | research.md ranks recommendations and marks each implementable today or needs a decision |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each grammar candidate is tested against the current commit-msg regexes and the result recorded |
| REQ-005 | The rewrite angle names the exact filter-repo invocation and the citation remap method |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/deep-research-state.jsonl` holds ten iteration records
- **SC-002**: One citation opened by the orchestrator resolves to the quoted text
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llmgateway credential for pi | Run cannot start | Probe with a one-line dispatch before the loop |
| Risk | The lineage stalls after a few iterations | Fewer than ten records | Resume from state, one iteration per relaunch |
| Risk | The model restates the brief instead of reading files | Findings without evidence | Brief carries paths to read and demands file:line |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration stays under twelve tool calls and writes its file before moving on

### Security
- **NFR-S01**: The child runs with no write authority outside `research/`

### Reliability
- **NFR-R01**: The run is resumable from `deep-research-state.jsonl`

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a lineage that writes no iteration file is a failed run, not a converged one
- Maximum length: ten iterations, no more

### Error Scenarios
- External service failure: a provider capacity error stops the lineage, and the orchestrator relaunches from state
- Network timeout: `--offline` is set, nothing is fetched

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 3, LOC: 0, Systems: 1 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N |
| Research | 20/20 | Ten-angle investigation |
| Multi-Agent | 10/15 | Workstreams: 1 external executor |
| Coordination | 5/15 | Dependencies: 1 |
| **Total** | **50/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Research proposes a grammar the hook cannot hold | M | M | REQ-004 forces the test |
| R-002 | Rewrite method ignores the citations | H | L | REQ-005 names the remap method |

---

## 11. USER STORIES

### US-001: Find the commits behind a packet (Priority: P0)

**As a** maintainer, **I want** one search that returns every commit for `sk-git/028`, **so that** I can review a packet's history without reading the log by eye.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep old citations valid (Priority: P1)

**As a** reader of a spec document, **I want** the commit hashes it cites to resolve after the rewrite, **so that** the evidence trail stays intact.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Is the identifier minted per track, per packet or repository-wide?
- Does the retrofit derive identifiers from `Refs:` lines and touched paths, or assign a fixed ordinal?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Findings**: See `research/research.md`

---
