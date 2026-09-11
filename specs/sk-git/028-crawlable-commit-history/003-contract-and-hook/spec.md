---
title: "Feature Specification: Phase 3: contract and hook"
description: "Make the approved grammar the enforced contract: the commit-msg whitelist and duplicate check, a commit-id allocator, a prepare-commit-msg stamper, and the sk-git skill documents, each with a test or a validator run."
trigger_phrases:
  - "commit-msg whitelist"
  - "commit-id allocator"
  - "prepare-commit-msg stamper"
  - "sk-git commit contract update"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: contract and hook

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The approved grammar becomes code and contract in four dispatches on cli-pi with DeepSeek V4.1 Flash: the hook whitelist with its first test, the ordinal allocator with its test, the stamper hook with its test, and the sk-git skill documents through sk-doc. The hook change lands first because the stamper would otherwise disable the four-path body gate.

**Key Decisions**: order fixed by ADR-002; every code file ships with a harness; docs validated by sk-doc

**Critical Dependencies**: `../002-format-decision/decision-record.md`; the global hooks path, which means edits here take effect only once they reach the main clone

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-format-decision |
| **Successor** | 004-search-surface |
| **Handoff Criteria** | All hook and allocator harnesses exit 0, run-all-drift-guards.sh exits 0, validate_document.py exits 0 for every touched skill document |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Crawlable Commit History specification.

**Scope Boundary**: hooks under `.opencode/scripts/git-hooks/`, scripts under `.opencode/skills/sk-git/scripts/`, and the sk-git skill documents that state the commit contract. No history is touched.

**Dependencies**:
- The five decisions in `../002-format-decision/decision-record.md`
- `scripts/worktree-naming.sh` as the allocator pattern

**Deliverables**:
- `commit-msg` whitelist and duplicate check, `tests/commit-msg.test.sh`
- `scripts/commit-id-naming.sh`, `scripts/tests/commit-id-naming.test.sh`
- `prepare-commit-msg`, `tests/prepare-commit-msg.test.sh`
- SKILL.md section 6, the template asset, commit-workflows step 5, quick-reference rows

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The contract exists only in a decision record. The hook still treats the new keys as prose, nothing mints an ordinal, nothing stamps one, and the skill documents still describe `Refs:` as the only packet link.

### Purpose
After this phase a commit made on this machine carries a unique ordinal and, when told the packet, a `Spec:` path, and the hook refuses a malformed or duplicate id. The skill documents say so, and validators agree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The commit-msg trailer whitelist, colon-only, and the duplicate and shape checks
- The ordinal allocator with a lock, a high-water file and a history rescan
- The prepare-commit-msg stamper: fresh paragraph, keep on amend, re-mint on cherry-pick, repository-aware
- The skill documents that carry the contract, through sk-doc create-skill

### Out of Scope
- Search recipes and catalog entries - phase 004
- Any change to existing commits - phase 005
- The README, changelog and advisor metadata - phase 006

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/git-hooks/commit-msg` | Modify | Whitelist branch, shape check, duplicate check |
| `.opencode/scripts/git-hooks/tests/commit-msg.test.sh` | Create | First harness for the hook |
| `.opencode/skills/sk-git/scripts/commit-id-naming.sh` | Create | Ordinal allocator |
| `.opencode/skills/sk-git/scripts/tests/commit-id-naming.test.sh` | Create | Allocator harness |
| `.opencode/scripts/git-hooks/prepare-commit-msg` | Create | Stamper |
| `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh` | Create | Stamper harness |
| `.opencode/scripts/git-hooks/README.md`, `tests/README.md` | Modify | Inventory rows |
| `.opencode/skills/sk-git/SKILL.md` | Modify | Section 6 body contract, ALWAYS rule 5, hard rules |
| `.opencode/skills/sk-git/assets/commit-message-template.md` | Modify | Examples in the new shape |
| `.opencode/skills/sk-git/references/commit-workflows.md` | Modify | Step 5 |
| `.opencode/skills/sk-git/references/quick-reference.md` | Modify | Commit rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The hook whitelists `Spec:` and `Commit-Id:` on a colon-only branch and refuses a malformed or duplicate id, HEAD excluded |
| REQ-002 | The allocator mints seven-digit ordinals under a lock and rebuilds its high-water from history |
| REQ-003 | The stamper keeps an id on amend, re-mints on cherry-pick, forces a fresh paragraph and exits silently outside this repository |
| REQ-004 | Every new script has a harness that exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The skill documents describe the contract and pass validate_document.py |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: three harnesses and run-all-drift-guards.sh exit 0
- **SC-002**: an empty commit made with the hooks installed carries a `Commit-Id:` the hook accepts
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Global hooks path points at the main clone | Worktree edits are inert until merged | Harnesses run the hook file by path; the live smoke waits for the merge |
| Risk | A detached cli-pi child dies silently | Partial files | Dispatch through the attached background runner and diff after every return |
| Risk | Stamper misfires in another repository | Foreign commits get keys | Repository identity check first, tested |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: a mint costs under one second with a warm high-water file

### Security
- **NFR-S01**: no hook writes outside the message file and the common Git directory

### Reliability
- **NFR-R01**: an allocator failure never blocks a commit; the hook still validates what is there

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a message that is only comments is left alone
- Maximum length: ordinal ceiling 9999999 refused

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 11, LOC: about 600, Systems: 2 |
| Risk | 15/25 | Machine-wide hooks |
| Research | 5/20 | Decided in 002 |
| Multi-Agent | 10/15 | Four cli-pi dispatches |
| Coordination | 10/15 | Fixed order |
| **Total** | **55/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Two clones mint the same ordinal | M | L | Hook duplicate check, re-mint |
| R-002 | The stamper merges into a `Context:` line | M | M | Blank-line rule with a fixture |

---

## 11. USER STORIES

### US-001: Commit and get an address (Priority: P0)

**As a** committer, **I want** every commit to carry a unique ordinal without doing anything, **so that** the address exists the moment the commit does.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Refuse a bad id (Priority: P0)

**As a** maintainer, **I want** the hook to refuse a malformed or duplicate id, **so that** the address stays unique.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `../002-format-decision/decision-record.md`

---
