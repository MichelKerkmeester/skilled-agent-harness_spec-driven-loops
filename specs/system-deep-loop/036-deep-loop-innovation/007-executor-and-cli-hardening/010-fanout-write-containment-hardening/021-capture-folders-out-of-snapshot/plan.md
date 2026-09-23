---
title: "Implementation Plan: Capture Folders out of the Containment Snapshot"
description: "Level 2 implementation plan for phase 021 of the fan-out write containment hardening packet. It adds a capture path guard to the containment snapshot and to violation detection, untracks all capture output and ignores both capture kinds so a worktree removes again. It also prunes the capture READMEs from the sk-doc verdict baseline to keep parity."
trigger_phrases:
  - "containment capture snapshot"
  - "capture folders untracked"
  - "worktree remove path limit"
  - "capture never copies a capture"
  - "detection capture guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Capture Folders out of the Containment Snapshot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript in the deep-loop runtime with Python and shell checks |
| **Framework** | the deep-loop write containment library |
| **Storage** | N/A - insufficient source context |
| **Testing** | vitest and the Python parity script named in section 5 |

### Overview
A fan-out snapshot in write-containment.ts copied every untracked path outside a lane into the containment baseline, so each run nested the previous captures one level deeper and tracked capture paths grew to 971 characters. This plan adds a capture path guard to the snapshot loop and to the detection loop, ignores both capture kinds, untracks the capture output and prunes the capture READMEs from the sk-doc verdict baseline. Two tests lock the guards and each one failed before its guard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (the problem is recorded in the evidence pack)
- [x] Success criteria measurable (AC-001 to AC-006 are Met)
- [x] Dependencies identified (the touched surfaces are listed in the fix addendum)

### Definition of Done
- [x] All acceptance criteria met (AC-001 to AC-006 are Met)
- [x] Tests passing (if applicable) (79 passed in the containment suite and 395 passed with 1 skipped across the six containment related files)
- [x] Docs updated (spec/plan/tasks) (T011 is done)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a path segment guard shared by the snapshot loop and the detection loop

### Key Components
- **CAPTURE_DIRS list in write-containment.ts**: names the containment baseline folder and the pass quarantine folder that count as capture output.
- **isContainmentCapturePath(path) helper**: matches a capture folder by path segment anywhere in the path, whichever run wrote it.
- **snapshotOutOfScopeDirtyPaths**: copies untracked paths outside a lane into the containment baseline and now skips capture paths after the unattributable skip.
- **detectNewOutOfScopeViolations**: reports new out of scope violations against the baseline and now skips capture paths before the baseline lookup.

### Data Flow
A run snapshots the untracked paths outside its lane into the containment baseline under its lineage folder and later detection subtracts that baseline. Both loops now skip any path that carries a capture folder segment, so a capture never copies a capture and an earlier run's captures are never new violations. The gitignore rules keep both capture kinds out of tracking so a worktree of the fixed tree removes again.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Producer: snapshotOutOfScopeDirtyPaths in write-containment.ts | Copies every untracked path outside a lane into the containment baseline | Update. Skip capture paths after the unattributable skip | The snapshot test in write-containment.vitest.ts, 79 passed |
| Producer: detectNewOutOfScopeViolations in write-containment.ts | Reports new out of scope violations against the baseline | Update. Skip capture paths before the baseline lookup | The detection test in write-containment.vitest.ts, 79 passed |
| Consumer: .gitignore | Governs which paths git tracks | Update. Two ignore patterns with a comment on why | git ls-files under both capture kinds returns 0 files and the longest tracked path is 353 |
| Consumer: the sk-doc README verdict baseline in baseline-readme-verdicts.json | Pins the expected README verdicts for the code folder check | Update. Drop the 246 capture READMEs, 1,304 entries to 1,058 | test_readme_verdict_parity.py reports PARITY PASS with 1,058 files and 0 diffs |
| Consumer: worktree removal | Removes a lane worktree with plain git worktree remove | Unchanged | The live removal proof, git worktree add and git worktree remove both exit 0 and the folder is gone |

Required inventories:
- Same-class producers: `rg -n 'snapshotOutOfScopeDirtyPaths|detectNewOutOfScopeViolations' .skilled/skills/system-deep-loop/runtime/lib/deep-loop` to list every reader of the containment baseline and the untracked path set.
- Consumers of changed symbols: `rg -n 'isContainmentCapturePath|CAPTURE_DIRS' . --glob '*.ts' --glob '*.md'` to list every consumer of the new guard.
- Matrix axes: the two guarded functions, the snapshot and the detection, and the two capture kinds, the containment baseline folder and the pass quarantine folder. All four rows carry the same path segment guard.
- Algorithm invariant: a path that carries a capture folder segment must never be copied into a baseline and must never be reported as a new violation, whichever run wrote it. The adversarial case is a capture left by an earlier run, which each later run used to nest one level deeper until tracked paths reached 971 characters and git worktree remove failed with File name too long.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
T001 through T011 are all done.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | write-containment.vitest.ts including the two new baseline content capture tests (79 passed) | vitest |
| Integration | The six containment related test files (395 passed, 1 skipped) | vitest |
| Integration | Runtime typecheck (exit 0) | the runtime typecheck |
| Integration | Capture tracking check with git ls-files under both capture kinds (0 files, longest tracked path 353) | git ls-files |
| Integration | sk-doc README verdict parity (PARITY PASS, 1,058 files, 0 diffs) | test_readme_verdict_parity.py |
| Integration | sk-code drift guards (all 2 guards passed, 0 errors) | the sk-code drift guards |
| Manual | Live removal proof of a fresh worktree at the final HEAD (115,878 tracked files, longest absolute path 448 characters) | git worktree add --detach and plain git worktree remove |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| write-containment.ts snapshot and detection loops | Internal | Green | None. Both guards landed together in commit 162a3bd816 |
| The capture output in git tracking | Internal | Green | None. It was untracked in commit b7648ec0b0 and the content stays in history |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a capture folder lands in a baseline again, detection reports an earlier run's capture as a new violation, or a worktree fails to remove.
- **Procedure**: revert commit 162a3bd816 and commit b7648ec0b0 on branch worktrees/066-ci-cleanup-follow-ups.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001) ──► Core (T002 to T008) ──► Verify (T009 to T011)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (T001) | None | Core |
| Core (T002 to T008) | Setup | Verify |
| Verify (T009 to T011) | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | N/A - insufficient source context | N/A - insufficient source context |
| Core Implementation | N/A - insufficient source context | N/A - insufficient source context |
| Verification | N/A - insufficient source context | N/A - insufficient source context |
| **Total** | | **N/A - insufficient source context** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): N/A - the untracked capture content stays in git history
- [ ] Feature flag configured: N/A - insufficient source context
- [ ] Monitoring alerts set: N/A - insufficient source context

### Rollback Procedure
1. Revert commit 162a3bd816, which restores the unguarded snapshot and detection loops.
2. Revert commit b7648ec0b0, which restores the tracking of the capture output and of the capture READMEs in the sk-doc baseline.
3. Verify the rollback with the checks in section 5 and expect the state observed before these commits.
4. Notify stakeholders: N/A - insufficient source context.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

