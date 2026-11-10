---
title: "Implementation Plan: Phase 8: write-containment-scoping"
description: "Move live-run discovery into the write-containment library so every caller excludes live sibling runs, keep unowned writes attributed, and pin that a new out-of-scope file is recorded."
trigger_phrases:
  - "write containment scoping plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: write-containment-scoping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript library, CommonJS runner, vitest |
| **Framework** | system-deep-loop runtime write containment |
| **Storage** | git status of the worktree; loop lock files in run artifact dirs |
| **Testing** | vitest in `runtime/` with temp git repositories |

### Overview
The fix sits where the attribution is decided: the containment library. Fan-out already discovers live sibling runs from their locks; that discovery moves into the library and runs inside snapshot and detection, so the single-executor YAMLs get it with no call-site edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Runtime vitest at least 2880 passed plus new tests
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer; one implementation shared by every caller.

### Key Components
- **`write-containment.ts`**: snapshot, detection, quarantine and revert of out-of-scope writes.
- **`fanout-run.cjs`**: fan-out runner, today the only caller that excludes live sibling runs.
- **`loop-lock.ts`**: `isStaleLoopLock`, the liveness test.

### Data Flow
Before dispatch the caller snapshots dirty out-of-scope paths; after dispatch detection diffs again and subtracts the baseline and the unattributable dirs; enforcement records, quarantines and reverts what remains.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `snapshotOutOfScopeDirtyPaths` | Repo-wide baseline | update | live sibling test |
| `detectNewOutOfScopeViolations` | Repo-wide detection | update | live, stale and repo-root tests |
| `fanout-run.cjs` discovery | Local copy | update | fan-out suite |
| Four single-executor YAML call sites | Pass no exclusions | unchanged, inherit the fix | call-site test |

Required inventories:
- Same-class producers: `rg -n "readStatusEntries|unattributableDirs" .skilled/skills/system-deep-loop/runtime`.
- Consumers: `rg -n "snapshotOutOfScopeDirtyPaths|enforceWriteContainment" .skilled/commands/deep .skilled/skills/system-deep-loop/runtime/scripts`.
- Matrix axes: lock state (live, stale, none) by write location (sibling folder, repo root, nested new folder).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the runtime baseline from the phase 007 final gate. Implementation runs one Luna worker for the discovery move and one for the nested-folder test. Verification reruns the runtime suite and the cross-family review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Discovery, attribution matrix, nested new folder | vitest with temp git repos |
| Integration | Fan-out containment path | existing fan-out suite |
| Manual | N/A: the temp-repo tests run two lock holders side by side, which is the concurrent probe | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-6-luna` high fast | External | Green | Fall back to DeepSeek and log it |
| cli-pi `opencode-go/deepseek-v4.1-flash` max | External | Green | Review moves to Luna with a fresh context |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Containment stops recording a write it should own.
- **Procedure**: `git revert` the phase commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007 commit | Implementation |
| Implementation | Baseline recorded | Verification |
| Verification | Implementation and review | Phase 015 |
<!-- /ANCHOR:phase-deps -->

---
