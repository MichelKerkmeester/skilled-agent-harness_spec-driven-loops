---
title: "Feature Specification: Phase 5: history-rewrite"
description: "Rewrite main, skilled/v4.0.0.0 and the tags on a mirror clone so every existing commit carries a Spec path where the mapping cascade finds one and a Commit-Id ordinal always, remap every hash citation under specs/ from the commit map, and publish only after a written rollback and a fresh yes."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 5: history-rewrite

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

About 9,100 commits get the same trailer paragraph new commits get. A plan file assigns each old SHA an ordinal by topological order and a packet where the refined cascade finds one. filter-repo stamps from that plan on a mirror, the commit map drives the citation remap, and the operator authorizes the force-push after the rehearsal passes its invariants.

**Key Decisions**: ordinals by topological order from a pinned SHA; the plan is frozen before the rewrite and never minted inside the callback; a bare backup is the rollback

**Critical Dependencies**: git filter-repo; a writer freeze for the window; the operator's yes before the push

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-09-11 |
| **Branch** | `worktrees/048-crawlable-commit-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-search-surface |
| **Successor** | 006-docs-and-release |
| **Handoff Criteria** | Rewritten main and skilled/v4.0.0.0 on origin, zero old-prefix citations under specs/, recursive validate green, followers synced |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Crawlable commit history: a search-optimized, numbered commit message format for sk-git and the retroactive rewrite of existing history specification.

**Scope Boundary**: main, skilled/v4.0.0.0 and the tags the plan lists from the live refs. Other branches and worktrees are rebased or archived, never rewritten. Nothing but message text changes in any commit.

**Dependencies**:
- ADR-001 and ADR-004 in `../002-format-decision/decision-record.md`
- The stamper and allocator from phase 003, so new commits after the rewrite continue the sequence
- Research iterations 7, 8 and 9 for the cascade, the filter-repo contract and the order of operations

**Deliverables**:
- `scripts/build-commit-plan.py`: old SHA to ordinal and packet, with the rule that decided it
- `scripts/stamp-callback.py` and `scripts/rewrite-run.sh`: the mirror rewrite with invariants
- `scripts/remap-citations.py`: hash citations under specs/ from the commit map
- `scripts/stamp-branch.sh`: ordinals for a branch's unique commits at rebase time
- A rehearsal report, the rollback sentence, the operator's recorded yes, and the follower sync record

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
New commits carry an address. Old ones do not, so every query the format promises returns nothing for the history that matters. About 12,700 hash tokens in spec documents would go stale the moment the history is rewritten unless they are remapped in the same step.

### Purpose
After this phase `git log --grep` by packet or ordinal resolves old commits on origin exactly as it resolves new ones, and no spec document cites a hash that no longer exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The frozen plan: every commit on the pinned tip gets an ordinal, and a packet where the cascade finds one
- The mirror rewrite with stamped trailers and its invariant checks
- The citation remap under specs/ and the 31 skill files that cite hashes
- The push, the follower sync and the rebase or archive of every other branch and worktree

### Out of Scope
- Rewriting any branch other than the two lines and the tags - operator decision D3
- Re-signing the 11 signed commits or 98 annotated tags - gpg is not installed here and the loss is accepted in the record
- Changing anything in a commit but its message text - the rewrite is for the format only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/build-commit-plan.py` | Create | Plan builder with the refined cascade and tie-breaks |
| `scripts/stamp-callback.py` | Create | filter-repo commit callback that formats the planned trailers |
| `scripts/rewrite-run.sh` | Create | Backup, mirror, rewrite, invariants, rehearsal |
| `scripts/remap-citations.py` | Create | Prefix-exact remap from the commit map, dry-run first |
| `scripts/stamp-branch.sh` | Create | Stamp a branch's unique commits after rebase |
| `specs/**/*.md` and 31 skill markdown files | Modify | Hash citations remapped |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The plan assigns exactly one seven-digit ordinal per commit on the pinned tip, in topological order, and is reproducible from the SHA |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The cascade excludes rolling and generated spec files and requires scope consistency before the single-touch rule, and a 100-commit sample is judged by the conductor with the error rate recorded |
| REQ-003 | The rehearsal on a throwaway mirror proves tree hashes, authors and dates unchanged, one Commit-Id per message, tag count preserved, and commit-map rows equal to the commit count |
| REQ-004 | The remap leaves zero tokens that resolve to an old prefix and leaves every non-commit token byte-identical |
| REQ-005 | The force-push happens only after the rollback sentence and the operator's yes are recorded in this phase |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git log --fixed-strings --grep='Commit-Id: 0000001'` on origin/main returns the root commit
- **SC-002**: `rg` over specs/ finds zero old prefixes from the commit map and recursive validate passes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | git filter-repo on PATH | no rewrite | already installed and verified |
| Risk | Writers advance the branch during the window | plan and map diverge | autosync off, sessions paused, tips recorded before anything |
| Risk | Pruned objects cannot be recovered | rollback impossible | bare backup kept until every check passes |
| Risk | Commit messages cite hashes that the first pass cannot remap | 551 dangling tokens | second pass from the cumulative commit map, recommended in the record |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: the full mirror rewrite and remap finish inside one working session

### Security
- **NFR-S01**: the push carries the pre-push exemption for main and skilled/v* only; no other ref is pushed

### Reliability
- **NFR-R01**: every step is rerunnable from the backup

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a commit with no packet signal gets an ordinal and no Spec line
- Maximum length: 9,999,999 ordinals, far beyond the history

### Error Scenarios
- External service failure: a failed push leaves origin untouched; retry after the freeze is confirmed
- Network timeout: same

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 2,000 touched by the remap, five scripts |
| Risk | 25/25 | Rewrites shared history, force-push |
| Research | 5/20 | decided |
| Multi-Agent | 10/15 | three dispatches |
| Coordination | 15/15 | writer freeze, operator gate, follower sync |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The rewrite reaches origin before the invariants pass | H | L | The push is a separate step behind the operator's yes |
| R-002 | A follower rebases onto the old tip after the push | M | M | Live branch reset and autosync re-enabled only after followers are re-pointed |

---

## 11. USER STORIES

### US-001: Old commits answer the same queries (Priority: P0)

**As a** maintainer, **I want** a packet query to return its old commits too, **so that** the format is not new-history only.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Citations keep resolving (Priority: P0)

**As a** reader of a spec document, **I want** every cited hash to resolve after the rewrite, **so that** the evidence trail survives.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Second pass for the 551 hash citations inside commit messages: the record recommends yes. Confirmed with the operator at the push gate.
- Replace refs policy: delete-no-add recommended. Confirmed at the push gate.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


