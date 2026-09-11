---
title: "Implementation Plan: Phase 2: transactional re-mint"
description: "Snapshot the gate's own output paths before the repair call, restore both the worktree files and their index entries on any non-zero exit, document the widening in both gates and refuse a staged derived file that carries non-generated history."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: transactional re-mint

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, inside the pre-commit hook |
| **Framework** | Git plumbing, no library |
| **Storage** | A temporary snapshot directory for the gate's output pair per packet |
| **Testing** | The existing throwaway-repo harness at `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` |

### Overview
The gate already knows which packet paths it owns: each selected packet's `graph-metadata.json` and `description.json`. Before it calls `repair-derived.cjs --apply`, it copies those files into a temporary snapshot and records which of them the index already carried. On any non-zero exit it restores the worktree copies and re-adds only the paths that were staged before, then blocks with the tool's output. The assertion that decides the phase is `git status --porcelain` equality, because the tool rewrites the worktree and the gate's own partial-staging rule reads the worktree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A snapshot and restore wrapped around one child process call, scoped to the paths the gate owns.

### Key Components
- **Snapshot**: for each selected packet, copy `graph-metadata.json` and `description.json` into a temporary directory and record whether each path was present and whether it was staged.
- **Restore**: on any non-zero exit, copy the snapshots back, remove paths the tool created, return untracked paths to untracked and re-add only the paths that were staged before.
- **Non-generated-history refusal**: compare each rewritten file's pre-run content against HEAD's copy and the generator's output. Content that matches neither is a hand edit and is refused by name, after the restore.
- **Widening note**: one sentence in each auto-repair gate header stating that staged regenerated outputs widen the commit.

### Data Flow
Select packets from staged documents, refuse a partly staged packet, snapshot the output pair per packet, call the tool once for all packets, then either stage the rewrites or restore the snapshot and block.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a fix to a failure path in one gate.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/scripts/git-hooks/pre-commit`, spec re-mint block | Producer of the staged metadata and owner of the failure path | update, the restore replaces the stage-the-successes branch | Harness case asserting `git status --porcelain` equality |
| `.opencode/scripts/git-hooks/pre-commit`, route re-mint block | Second auto-repair gate that stages regenerated outputs | update, header comment only | Grep of the two header blocks |
| `runtime/cli/spec/repair-derived.cjs` | The called tool, which rewrites the worktree | unchanged, the gate adapts to how it writes | Restore assertion reads the worktree, not the index |
| `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` | Existing harness for both gates | update, new partial-failure and refusal cases | The harness itself |

Required inventories:
- Same-class producers: `git diff --cached --name-only --diff-filter=ACMR -- 'specs/**/*.md'` shows the selection rule the snapshot must mirror.
- Consumers of the restored paths: `rg -n 'graph-metadata.json|description.json' .opencode/scripts/git-hooks` shows every read and write the gate already performs on the pair.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Snapshot and restore helper behavior on the pair, including a missing file and an untracked file | The harness's throwaway repo |
| Integration | A stub that rewrites both files and then exits 2, asserted with `git status --porcelain` equality | `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` |
| Integration | A retry after the failure reports the tool's failure, not the gate's partial-staging refusal | Same harness, second run in the same fixture |
| Regression | The pathspec-narrowing case and the batching case still pass | Existing harness cases 15 and 17 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 baseline | Internal | Planned | A gate change cannot be told from a gate regression without it |
| `repair-derived.cjs` non-zero exits | Internal | Green | The restore keys on any non-zero exit, so it does not care which code arrives |
| Bash 3.2 compatibility of the hook | Internal | Green | macOS ships Bash 3.2 and the hook already guards its array expansions for it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The restore removes work an author staged, or the refusal fires on a legitimate re-derive
- **Procedure**: Revert the two files. The previous hook behavior is the stage-the-successes branch, which returns with `git checkout -- .opencode/scripts/git-hooks`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Failure path read ──────┐
                        ├──► Snapshot and restore ──► Harness cases ──► Exit evidence
Harness extended ───────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Implementation | Low | 2 to 3 hours |
| Verification | Med | 2 hours |
| **Total** | | **5 to 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm the hook file is not dirty before editing, because a concurrent session commits to this repository
- [ ] Confirm the phase 003 baseline exists
- [ ] Confirm no data migration is involved

### Rollback Procedure
1. Revert `.opencode/scripts/git-hooks/pre-commit`
2. Revert `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`
3. Run the harness to confirm the previous behavior is back

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Snapshot helper │────►│ Restore on exit │────►│ Harness cases   │
│ per output pair │     │ worktree + index│     │ equality assert │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Snapshot helper | The packet selection loop | Per-packet file copies and staged flags | Restore |
| Restore | Snapshot helper | Pre-run worktree and index state | Harness equality case |
| Refusal check | Generator output and HEAD copies | A named refusal or a pass | Harness refusal case |
| Widening note | None | Two updated header blocks | Exit evidence |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Snapshot and restore helper** - 2 hours - CRITICAL
2. **Partial-failure harness case** - 2 hours - CRITICAL
3. **Refusal check and widening note** - 1 hour - CRITICAL

**Total Critical Path**: About 5 hours

**Parallel Opportunities**:
- The widening note is independent of the restore work
- The refusal check reuses the snapshot the restore already needs
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Restore exists | A stub failure leaves `git status --porcelain` unchanged | End of Implementation |
| M2 | Retry is clean | A second run reports the tool's failure, not the partial-staging refusal | End of Implementation |
| M3 | Exit evidence recorded | Harness cases pass, the batching case still passes and `validate.sh --strict` passes | End of Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Restore the worktree and the index together, scoped to the gate's own outputs

**Status**: Proposed

**Context**: The tool rewrites the worktree. An index-only restore leaves the tool's writes on disk, and the gate's own partial-staging refusal reads the worktree, so a retry can be answered by that refusal instead of the real failure. A whole-index reset would discard work the author staged themselves.

**Decision**: Snapshot the pair per selected packet, restore the worktree copies and the index entries the snapshot recorded and touch nothing else.

**Consequences**:
- A retry after a failure behaves as if the failed run never happened
- The gate now carries a small amount of state, which must be cleaned up on success as well as failure

**Alternatives Rejected**:
- Index-only restore: leaves the worktree rewrite and the half-staged retry
- Whole-index reset: discards author work and violates scope

### ADR-002: Refuse non-generated history by comparing three contents

**Status**: Proposed

**Context**: The gate regenerates over a staged derived file, so a hand edit staged in that file is silently replaced and the commit attributes it to the generator.

**Decision**: After the call, for each file the tool rewrote, compare the pre-run content against HEAD's copy and against the tool's output. Content that matches neither is refused by name, after the tree is restored.

**Consequences**:
- A hand edit in a generated file stops the commit with a message that names the file
- A normal stale file and a file the author already re-derived both pass, because each matches HEAD's copy or the tool's output

**Alternatives Rejected**:
- Refusing every staged derived file: the normal stale file is staged by the gate itself, so that refuses the gate's own work

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm `.opencode/scripts/git-hooks/pre-commit` is clean before editing
- [ ] Confirm the phase 003 baseline exists
- [ ] Confirm the harness runs green before the first edit

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Extend the harness with a failing partial-failure case before changing the hook, so the case is known to be able to fail |
| TASK-SCOPE | Edits stay inside the hook and its harness. A needed change to `repair-derived.cjs` stops the phase and is raised instead |

### Status Reporting Format
Report phase status as: `Phase 002 - <Draft|Implementation|Verified> - restore <absent|present> - blocking on: <none | the named failure>`.

### Blocked Task Protocol
If the hook file is dirty when the phase starts, wait for it to land rather than merging two edits by hand. If the phase 003 baseline is absent, stop and record that as the blocker.
<!-- /ANCHOR:ai-execution-protocol -->

---

