---
title: "Feature Specification: Phase 2: transactional re-mint"
description: "A failed re-mint leaves the worktree and the index exactly as the gate found them, and both auto-repair gates say out loud that they widen the commit."
trigger_phrases:
  - "transactional remint"
  - "partial failure staging"
  - "commit widening"
  - "restore staged"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: transactional re-mint

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The spec derived-metadata gate in `.opencode/scripts/git-hooks/pre-commit` batches every staged packet into one call to `repair-derived.cjs --apply`. When that call fails partway, the gate stages what succeeded and blocks. The tree the author retries from then carries the tool's partial rewrites, and the next attempt can be refused by the gate's own partial-staging rule instead of reporting the real failure.

This phase makes the failure path transactional. The gate snapshots its own output paths before the call, and on any non-zero exit it restores both the worktree files and their index entries, so `git status --porcelain` is byte-identical to the pre-run capture. It also documents the commit widening in both auto-repair gate headers and refuses a staged derived file that carries non-generated history.

**Key Decisions**: The restore is path-scoped to the gate's own outputs, never a whole-index reset. The assertion that decides the phase is `git status --porcelain` equality, not a staged-file listing, because the tool rewrites the worktree and an index-only restore leaves the same half-staged state behind.

**Critical Dependencies**: The phase 3 baseline. Without it a later gate change cannot be told from a gate regression.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `scaffold/002-transactional-remint` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-registry-walker-and-proof |
| **Successor** | 003-measure-and-declare |
| **Handoff Criteria** | The harness proves a mid-write failure leaves `git status --porcelain` byte-identical, and both auto-repair gate headers state the widening. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the One registry for every derived artifact, so no artifact owns a private staleness check specification.

**Scope Boundary**: One hook file and its test harness. The gate keeps its current selection rules, its batch call and its success path.

**Dependencies**:
- `runtime/cli/spec/repair-derived.cjs`, which the gate calls and which rewrites the worktree on disk
- `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`, the existing harness that already builds a throwaway repo for this gate

**Deliverables**:
- A snapshot and restore around the repair call in `.opencode/scripts/git-hooks/pre-commit`
- A partial-failure case in `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` that asserts `git status --porcelain` equality
- The widening note in both auto-repair gate headers

**Changelog**:
- This packet keeps no changelog folder. Phase closure is recorded by the parent phase map status.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The re-mint gate exists to keep a packet's generated metadata in step with its documents, and it does that by regenerating and staging. Its failure path is the weak part. One call covers every selected packet, so a failure can leave earlier packets already rewritten on disk, and the current code stages those rewrites before it blocks. The author then retries from a tree that is half written by the tool and half staged by the gate, and the gate's own partial-staging refusal can answer the retry instead of the real failure. Restoring only the index does not fix this, because the tool's writes landed in the worktree.

Two smaller hazards sit beside it. When the gate stages regenerated files, the commit carries content the author did not stage, and nothing in the hook says so. And when a staged derived file carries a hand edit, the gate regenerates over it and the commit attributes the change to the generator.

### Purpose

A failed re-mint is a no-op. The tree the author retries from is the tree they had before the gate ran, and the gate's effect on the commit is stated where the gate is read.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Snapshot the gate's own output paths before the call and restore both the worktree files and their index entries on any non-zero exit
- Keep the pathspec-narrowing refusal and the partial-staging refusal, which are both correct as they stand
- Document the commit-widening effect in both auto-repair gate headers
- Refuse a staged derived file whose pre-run content is neither HEAD's copy nor the generator's output

### Out of Scope
- **Removing either auto-repair gate.** The measured alternative is worse: the human-fix path was never taken, which is how 450 packets staled.
- **A whole-index or whole-worktree restore.** That would discard work the author staged themselves, which is a worse failure than the one being fixed.
- **Changing the batch call shape.** One process for every packet stays, and the batching assertion already in the harness must keep passing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Transactional restore, the widening note in both auto-repair gates, the non-generated-history refusal |
| `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Partial-failure case asserting `git status --porcelain` equality, plus the refusal case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On any non-zero exit from the re-mint call, the worktree files and index entries for each selected packet's `graph-metadata.json` and `description.json` return to their pre-run state |
| REQ-002 | The restore is path-scoped to those two paths per selected packet, never the whole index or the whole worktree |
| REQ-003 | On success the gate still stages the files it rewrote, because that is what the gate exists to do |
| REQ-004 | Both auto-repair gate headers state that staging regenerated outputs widens the commit beyond what the author staged |
| REQ-005 | The pathspec-narrowed refusal and the partial-staging refusal both survive, and the partial-staging check still runs before any write |
| REQ-006 | A staged derived file whose pre-run content is neither HEAD's copy nor the generator's output is refused by name, after the tree has been restored |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-900 | The phase exit criterion is verified from the final state |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

**SC-001**: In the harness fixture, a stub that rewrites a packet's derived files and then exits 2 leaves `git status --porcelain` byte-identical to the pre-run capture
Red when: any staged or unstaged difference survives the failure, which is what the current stage-the-successes branch produces.

**SC-002**: The partial-failure case proves the failure happened after at least one write
Red when: the case passes against a stub that fails before writing anything, because then the equality assertion proves nothing about the restore.

**SC-003**: Both auto-repair gate headers state the widening
Red when: either header block lacks the statement, which a grep over the two comment blocks shows.

**SC-004**: A pathspec-narrowed commit is still refused with its existing message
Red when: the gate proceeds under a throwaway index or the message disappears.

**SC-005**: After a mid-write failure, a second hook run reports the real failure rather than a half-staged tree
Red when: the retry exits with the gate's partial-staging refusal instead of the tool's failure.

**SC-006**: A staged derived file carrying non-generated history is refused by name and is not overwritten
Red when: the gate regenerates over it and the commit proceeds, which is today's behavior.

**SC-007**: The phase edits exactly two files
Red when: `git status --porcelain` shows any modified path other than the hook and its harness.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing the hook while another session holds changes to it | High | Land only after the phase 3 baseline exists, and confirm the file is not dirty before starting |
| Risk | A restore that discards work the author staged themselves | High | Restore is path-scoped to the gate's own declared outputs, never the whole index |
| Risk | The non-generated-history refusal fires on a legitimate re-derive | Med | It fires only when the pre-run content differs from both HEAD's copy and the generator's output, so a normal stale file passes |
| Risk | The partial-failure case passes vacuously | Med | The case records the mid-write observation before the restore runs, which SC-002 requires |
| Dependency | `repair-derived.cjs` exit codes 0, 1 and 2 | High | The restore keys on any non-zero exit, so it does not depend on which failure code arrives |
| Dependency | Phase 003's baseline | High | Gate changes are compared against it, so this phase lands after that measurement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The snapshot and restore cost two file reads and two file writes per selected packet on the failure path, and nothing extra on success beyond the bytes already staged

### Security
- **NFR-S01**: The restore writes only paths the gate already declared as its own outputs, so no path outside a selected packet is ever written

### Reliability
- **NFR-R01**: Two consecutive failed runs leave the tree in the same state, because the restore runs before the gate reports and the snapshot is retaken on every run

---

## 8. EDGE CASES

### Data Boundaries
- A packet whose derived files were both absent before the run: the restore removes whatever the tool created rather than writing an empty file
- A derived file that was untracked before the run: the restore returns it to untracked, not to staged

### Error Scenarios
- The generator fails before writing anything: the restore is a no-op and the gate blocks with the tool's output
- The generator fails after writing one of the pair: the restore returns both files, because the pair is snapshotted together
- A pathspec-narrowed commit: the existing refusal fires before the snapshot, because staging into a throwaway index is unsafe in that mode

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2 modified, LOC: about 30 in the hook, Systems: 1 |
| Risk | 12/25 | Auth: N, API: N, Breaking: Y in the failure path only |
| Research | 5/20 | The hook and its harness are the whole surface |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: phase 3 baseline |
| **Total** | **36/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A restore removes work the author staged | H | L | Path-scoped to the gate's own output pair per packet |
| R-002 | The refusal misfires on a legitimate re-derive | M | L | It compares against both HEAD's copy and the generator's output |
| R-003 | The hook change collides with a concurrent session | H | M | Confirm the file is clean before editing, and land after the phase 3 baseline |
| R-004 | The new case passes without exercising the restore | M | M | SC-002 requires the mid-write observation |

---

## 11. USER STORIES

### US-001: Retry after a failed re-mint from a clean tree (Priority: P0)

**As a** commit author, **I want** a failed re-mint to leave my worktree and index exactly as they were, **so that** my retry reports the real failure instead of a half-staged tree.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Know what the gate will add to my commit (Priority: P1)

**As a** commit author, **I want** the hook header to say that regenerated outputs are staged into my commit, **so that** I am not surprised by content I did not stage.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- None open. The parent carries the two architectural questions this decomposition deliberately defers.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the ADR section in `plan.md`, this packet carries no `decision-record.md`

---

