---
title: "Implementation Plan: Phase 22: verification-fixes"
description: "Eleven small changes in the skill advisor, each behind a test that fails first: a watchdog that notices its own suspension, an early parent PID, agreeing semantic lane gates, a refresh that survives a throwing pass, a silent disabled hook, a DSH boundary that drops the route receipt, two comments and a pinned strip case."
trigger_phrases:
  - "verification fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: verification-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS on Node, ES module DSH adapter, Python scorer |
| **Framework** | None; the skill advisor daemon, its launcher and its prompt hooks |
| **Storage** | SQLite through `better-sqlite3`, the skill-graph database and the route receipt files |
| **Testing** | Vitest (runtime and `.skilled/vitest.config.bin.ts`), `node --test` for the DSH adapter, the Python test script |

### Overview
Change the launcher watchdog, the daemon's parent watch, the semantic lane and fusion health, the background refresh, the Claude hook's crash path and the DSH adapter. Each fix lands with a test that fails on the worktree base `24749648b24`. The watcher test is shown to fail when the refresh call is removed, and the strip case is pinned in the shared fixture.
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
- [x] The runtime, bin, DSH and Python suites print no failure absent from the baseline, and each new test failed first
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Daemon-owned singleton state with injected clocks and timers for tests.

### Key Components
- **`startHeartbeatWatchdog`** (launcher): remembers its last check time and skips one check after a gap above two intervals.
- **`startParentWatch`** (`liveness.ts`): takes an optional `parentPid`, which `main()` reads before startup work.
- **`skillVectorCoverageRefusal`** (`semantic-shadow.ts`): the one coverage gate for the pre-embed check, the lane and the exact rerank.
- **`refreshEmbeddingsInBackground`** (`skill-graph-db.ts`): catches per pass, so a queued request always gets its pass.
- **DSH `closeBoundary`**: drops the route receipt, rotates the clock and holds that session's next turn until both finish.

### Data Flow
The launcher spawns the server, which writes a heartbeat and watches its parent. The watcher reindexes and requests a vector refresh. A prompt passes through the hook, which runs the recommend handler, where the lane checks coverage before any embed and fusion decides which lanes count toward confidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from `../021-epic-verification/evidence/report.md`: finding classes `instance-only`, `class-of-bug` and `matrix/evidence`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Launcher `startHeartbeatWatchdog` | Reaps a wedged server | update | Two suspension tests in `launcher-heartbeat-watchdog.vitest.ts` |
| `liveness.ts` `startParentWatch`, `advisor-server.ts` `main` | Exit on launcher death | update | Early-PID test in `liveness.vitest.ts` |
| `semantic-shadow.ts` both lane functions and the embed wrapper | Lane gates | update | Three tests in `semantic-lane-weight-zero.vitest.ts` |
| `fusion.ts` `projectionRuntimeLaneHealth` | Marks the lane degraded on a stale index | update | Same file, fusion assertion |
| `advisor-recommend.ts` `mergeSemanticShadowRuntimeLaneHealth` | Which reasons leave the live total | update | Same file, merge assertion |
| `skill-graph-db.ts` refresh loop | Drains queued requests | update | Throw-with-queue test |
| `watcher.ts` default reindex | Requests a refresh | unchanged | New behavioral test, mutation-checked |
| Claude hook catch | Crash fallback | update | Disabled-crash test |
| DSH adapter boundary handlers | Clock rotation | update | Two tests in `dsh-prompt-advisor.test.mjs` |
| `semantic-shadow-ablation.vitest.ts`, `projection-embedding-staleness.vitest.ts` | Asserted the stale reason at weight 0 | update | The live-weight assertion moves to the 0.05 staleness test |

Required inventories:
- Same-class producers: the three places that read coverage now call one helper; `rg -n "embeddingCoverage\(" runtime/lib/scorer` prints only that helper.
- Consumers of changed symbols: `rg -n "startParentWatch|startHeartbeatWatchdog|mergeSemanticShadowRuntimeLaneHealth|refreshEmbeddingsInBackground" .skilled --glob '!**/dist/**'`.
- Matrix axes: watchdog (normal gap, long gap then fresh, long gap then silent); refresh (no queue, queue after success, queue after throw, every pass throws); lane (weight 0 stale, live complete, live incomplete, exact rerank).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline. Implementation writes each test, watches it fail, then fixes the source. Verification rebuilds, rescans and reruns every suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Watchdog, parent watch, lane gates, fusion health, refresh loop, hook catch, DSH boundary | Vitest, `node --test` |
| Integration | Full runtime suite after `skill_graph_scan --trusted`, the bin suite, the DSH tests and the Python scorer test | Vitest, `node --test`, Python |
| Manual | None; the sleep case is covered by injected clocks | N/A |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Worktree `worktrees/489-advisor-verification-fixes` | Internal | Green | Work would move to a new worktree from sk-git |
| A rebuilt `dist` and a fresh scan | Internal | Green | The real-advisor hook tests read `Advisor: stale` until both run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite gains a failure, or a daemon is reaped or kept alive wrongly in the launcher log.
- **Procedure**: revert the fix commit on the branch, or the merge commit on main, with `git revert`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The 021 report | Implementation |
| Implementation | Baseline suite run | Verification |
| Verification | All eleven fixes | Merge |
<!-- /ANCHOR:phase-deps -->

---
