---
title: "Implementation Plan: Phase 17: hot-path-optimization"
description: "Memoize and cache the goal plugin's per-message hot paths (injection read/normalize, message.updated writes) behind fs-spy-proven acceptance criteria, with zero behavior change."
trigger_phrases:
  - "goal plugin hot path optimization plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/017-hot-path-optimization"
    last_updated_at: "2026-07-03T07:30:49Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from spec.md and audit dossier e-1 items"
    next_safe_action: "Wait for phase 016 to land; then start Phase 1 baseline spy instrumentation"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-017-hot-path-optimization-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: hot-path-optimization

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM plugin (`.opencode/plugins/mk-goal.js`), OpenCode plugin loader |
| **Framework** | None - flat plugin module with in-process runtime state |
| **Storage** | Flat JSON state files under `~/.config/opencode/goals/` (or `MK_GOAL_STATE_DIR` override), plus `.continuation.log`/`.goal-events.log` JSONL |
| **Testing** | `node:test` via `.cjs` files in `.opencode/plugins/tests/`, run with `node --test` |

### Overview
Eight targeted memoization/caching changes to `mk-goal.js`'s two hottest paths: the passive injection read (`appendGoalBrief` → `readGoal` → `normalizeStoredGoal` → `normalizeGoalPromptFields`) and the `message.updated` write path (`recordMessageUpdated` → `refreshGoalActivity` + `accountUsage`). Each change adds an in-process cache, memo, or throttle keyed on cheap-to-check state (file mtime, a `Set`/`Map` of known-initialized dirs, a last-run timestamp) so repeat work is skipped without changing what gets stored, injected, or returned. No new abstraction layer; each fix stays local to the function it optimizes.
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
Monolith plugin module; per-function memoization/caching at each hot-path call site. No new abstraction layer.

### Key Components
- **`appendGoalBrief` (mk-goal.js:1581-1596)**: add an mtime-keyed cache (goal object + a negative-cache marker for no-goal sessions) in `runtimeState`, invalidated whenever the state file's mtime changes.
- **`normalizeGoalPromptFields` (mk-goal.js:348-357)**: skip the `buildEnhancedGoalPrompt` rebuild when `rawGoal.goalPrompt` and `rawGoal.promptEnhancement` are both already present and pass a cheap validity check; only rebuild when fields are missing/invalid.
- **`normalizeOptions` (mk-goal.js:98-130)**: each public entry point (`setGoal`, `readGoal`, `executeGoalAction`, etc.) normalizes options once at its own boundary and threads the normalized `options` object to every internal helper it calls, instead of each helper re-normalizing.
- **`recordMessageUpdated` (mk-goal.js:1126-1140)**: merge `refreshGoalActivity` and `accountUsage` into one `mutateGoal` call so one `message.updated` event produces one queued mutation and one atomic write cycle.
- **`ensureGoalStateDir` (mk-goal.js:627-631)**: memoize per resolved `stateDir` in `runtimeState` (a `Set` of dirs already confirmed to exist this process) so `mkdir` is only issued once per directory per process.
- **`archiveGoalStateFile` (mk-goal.js:847-865)**: reuse the same throttle pattern already used by `sweepOrphanedActiveStates` (mk-goal.js:876-879) so `pruneArchive` runs at most once per throttle interval instead of on every archive.
- **`sweepOrphanedActiveStates` (mk-goal.js:874-902)**: `stat()` each candidate file first and only `readFile`+`JSON.parse` files whose mtime is already past the retention threshold.
- **`goalStateLines` (mk-goal.js:1602-1647)**: accept a flag/derive from `action` whether the caller needs `injection_preview`, and skip the `renderGoalInjection` call when it doesn't.

### Data Flow
No change to what is stored in state files, what is injected into the system prompt, or what tool output looks like. Only the number of filesystem operations and redundant in-memory recomputations performed to produce that identical output changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `appendGoalBrief` (:1581-1596) | Reads + normalizes goal state on every chat message | Add mtime-keyed cache + negative cache | fs-spy test: zero `readFile` on repeat call within mtime window |
| `normalizeGoalPromptFields` (:348-357) | Rebuilds prompt/CLEAR score on every `readGoal` | Lazy/memoized rebuild only when fields missing/invalid | Spy/counter test on `scoreEnhancedGoalPrompt` calls |
| `normalizeOptions` (:98-130) | Re-reads env + reallocates per call, 6+ times per chain | Normalize once per entry point, thread through | Call-count spy on one `setGoal` chain |
| `recordMessageUpdated` (:1126-1140) | Fires 2 queued mutations per `message.updated` | Merge into 1 mutator / 1 write cycle | Write-cycle spy: 1 fsync+rename+dir-fsync sequence per event |
| `ensureGoalStateDir` (:627-631) | `mkdir -r` on every write/append | Memoize per `stateDir` | fs-spy test: 1 `mkdir` across 2 writes to same dir |
| `archiveGoalStateFile` (:847-865) → `pruneArchive` (:825) | Prunes on every archive | Throttle like the orphan sweep (:876-879) | Call-count spy across N archives in one interval |
| `sweepOrphanedActiveStates` (:874-902) | Parses every state file for `updatedAtMs` | Stat-mtime prefilter, parse only candidates | Spy: 0 `JSON.parse` on non-expired files |
| `goalStateLines` (:1602-1647) | Always renders full injection preview | Lazy, action-scoped preview | Call-count spy on `renderGoalInjection` per action |
| `mk-goal-lifecycle.test.cjs`, `mk-goal-state.test.cjs` | Existing regression coverage for these paths | Extend with fs-spy assertions above | `node --test` green, no existing assertion rewritten |
| Phase 016 (`F1`, `F7`) | Owns e-1.5 (mutation label) and e-1.9 (continuation-log gate skip) | Not touched here - land first, this phase builds on top | Confirm 016 tasks.md all `[x]` before starting |

Required inventories:
- Same-class producers: `rg -n "normalizeOptions\(" .opencode/plugins/mk-goal.js` to confirm every call site before threading a single normalized options object through.
- Consumers of changed symbols: `rg -n "appendGoalBrief|recordMessageUpdated|ensureGoalStateDir|goalStateLines" .opencode/plugins/mk-goal.js .opencode/plugins/tests` to confirm no other caller assumes the pre-optimization call count.
- Matrix axes: cache-hit vs cache-miss vs negative-cache (no goal); single vs concurrent `message.updated` events; fresh vs already-initialized `stateDir`; non-expired vs expired sweep candidates; preview-needed vs preview-not-needed actions.
- Algorithm invariant: every optimization must produce byte-identical stored JSON, injected prompt text, and tool STATUS/ACTION output as the pre-optimization code, for every axis above.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [ ] Confirm phase 016 is complete (tasks.md all `[x]`, fresh test run green)
- [ ] Run full plugin suite fresh, paste baseline output as the pre-change reference
- [ ] Add fs-call-count/spy scaffolding to `mk-goal-lifecycle.test.cjs` and `mk-goal-state.test.cjs` (instrumented `readFile`/`mkdir`/`JSON.parse` counters) before any production-code change, so REQ-001 through REQ-008 can each show a failing-then-passing delta

### Phase 2: Core Implementation
- [ ] REQ-001/e-1.2: mtime-keyed cache + negative cache for `appendGoalBrief`
- [ ] REQ-002/e-1.4: merge `recordMessageUpdated`'s two mutations into one
- [ ] REQ-003/e-1.1: lazy/memoized `normalizeGoalPromptFields` rebuild
- [ ] REQ-004/e-1.3: single `normalizeOptions` call per entry point, threaded through
- [ ] REQ-005/e-1.6: memoize `ensureGoalStateDir` per `stateDir`
- [ ] REQ-006/e-1.7: throttle `archiveGoalStateFile`'s `pruneArchive` call
- [ ] REQ-007/e-1.8: stat-mtime prefilter in `sweepOrphanedActiveStates`
- [ ] REQ-008/e-1.10: lazy, action-scoped `goalStateLines` injection preview

### Phase 3: Verification
- [ ] Run full plugin suite fresh, confirm zero regressions vs Phase 1 baseline
- [ ] Paste fs-spy/call-count evidence for each REQ-001 through REQ-008
- [ ] Add/finalize micro-benchmark script(s) in `scratch/` demonstrating the message.updated write-cycle reduction and injection-read cache hit
- [ ] Update `checklist.md` and `implementation-summary.md` with evidence citations
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/fs-spy | Cache hit/miss counts, mkdir memoization, prune throttling, sweep prefilter, preview laziness (REQ-001, 003, 005, 006, 007, 008) | `node:test` with `node:fs/promises` mocked/instrumented in `.cjs` test files |
| Unit/call-count | `normalizeOptions` invocation count per entry point, `renderGoalInjection` calls per action (REQ-004, 008) | Same `.cjs` harness, spy wrapper around the target function |
| Integration | `message.updated` end-to-end write-cycle count (REQ-002) | `mk-goal-lifecycle.test.cjs` full event-handler path |
| Regression | Full existing plugin suite | `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` |
| Manual | Micro-benchmark wall-clock/fs-count comparison, checked into `scratch/` | Ad hoc Node script, output pasted into implementation-summary.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 016 (plugin-correctness-fixes) | Internal, same-file sequencing | Must be complete before this phase starts | If 016 is still in progress, defer starting this phase's implementation to avoid merge conflicts and risk of re-breaking a just-fixed bug |
| Phase 018 (test-architecture-restructure) | Internal, sequencing | Runs after this phase; not a blocker for 017 | None - 018 restructures whatever test files exist after 016+017+019 land |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing plugin test fails, or fs-spy evidence shows a behavior change (different stored JSON, different injected text, different tool output) rather than a pure performance improvement
- **Procedure**: Revert the specific memoization/cache change via targeted `git checkout` of `mk-goal.js` for that hunk; each e-1 item is an independent, separately-committable change so a single regression does not require rolling back the whole phase
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

This phase is part of a serial chain across four phases that all edit `.opencode/plugins/mk-goal.js`: **016 → 017 → 018 → 019**. Each phase must land with a fresh green full plugin test run before the next phase starts implementation, because they share the same file and interleaved WIP would risk conflicting or double-reverting changes:

1. **016 (plugin-correctness-fixes)** lands first - fixes F1-F12/D1-D3, including e-1.5 (mutation label in mutator) and e-1.9 (continuation-log gate-skip), both folded into 016's F7/F1 remedies.
2. **017 (this phase)** lands second - performance-only optimizations on top of 016's corrected behavior. Do not start implementation until 016's `tasks.md` shows all tasks `[x]`.
3. **018 (test-architecture-restructure)** lands third - converts whichever test files exist after 016+017 to `node:test` subtests, so new regression tests added by both prior phases get restructured exactly once instead of twice.
4. **019 (code-refinements)** lands fourth - dedupe/refactor work on the now-optimized, now-restructured codebase.
<!-- /ANCHOR:sequencing -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

