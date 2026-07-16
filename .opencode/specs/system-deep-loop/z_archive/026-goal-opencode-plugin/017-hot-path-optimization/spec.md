---
title: "Feature Specification: Phase 17: hot-path-optimization"
description: "The passive goal-injection path re-reads and fully re-normalizes goal state (including a 7-regex CLEAR scoring pass) on every chat message, and message.updated triggers two separate atomic write cycles with duplicate fsync/rename/dir-fsync work."
trigger_phrases:
  - "goal plugin hot path optimization"
  - "appendGoalBrief performance"
  - "mk-goal.js message.updated double write"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/017-hot-path-optimization"
    last_updated_at: "2026-07-03T07:30:49Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from four-reviewer audit dossier e-1 items"
    next_safe_action: "Await phase 016 to land, then author plan.md phase sequencing detail"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: hot-path-optimization

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 |
| **Predecessor** | 016-plugin-correctness-fixes |
| **Successor** | 018-test-architecture-restructure |
| **Handoff Criteria** | Every e-1 item below has a measurable acceptance criterion proven by an fs-spy test or a checked-in micro-benchmark; full plugin test suite green; zero behavior change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the Goal plugin review remediation: performance-only hardening of `.opencode/plugins/mk-goal.js`'s hot paths, sourced from the four-reviewer audit dossier (`../scratch/2026-07-03-four-reviewer-audit-findings.md`, section B "e-1 Optimizations").

**Scope Boundary**: `mk-goal.js` performance only. Every change in this phase MUST be behavior-preserving — same inputs produce the same stored state, injected prompt text, and tool output as before. This phase runs only AFTER phase 016 (plugin-correctness-fixes) lands, because both phases edit the same file and 016's F1/F7 fixes touch code this phase also optimizes (see Sequencing below).

**Dependencies**:
- Phase 016 (plugin-correctness-fixes) must be complete and its tests green before this phase starts — shared-file edit ordering, not a design dependency.

**Deliverables**:
- Memoized/lazy `normalizeGoalPromptFields` rebuild (e-1.1)
- mtime-keyed cache (incl. negative cache) for `appendGoalBrief` (e-1.2)
- Single `normalizeOptions` call threaded through each entry point instead of 6+ re-invocations per chain (e-1.3)
- `recordMessageUpdated` collapsed into one queued mutation / one atomic write cycle per `message.updated` (e-1.4)
- Memoized `ensureGoalStateDir` per `stateDir` (e-1.6)
- Throttled `pruneArchive` invocation from `archiveGoalStateFile` (e-1.7)
- Stat-mtime prefilter before parsing state files in `sweepOrphanedActiveStates` (e-1.8)
- Lazy, action-scoped `goalStateLines` injection preview instead of always rendering a second full pass (e-1.10)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The passive injection path runs on every single chat message: `appendGoalBrief` (mk-goal.js:1581-1596) does a disk read plus a full `JSON.parse` plus a complete `normalizeStoredGoal` pass with no cache, and that normalize pass unconditionally re-runs `buildEnhancedGoalPrompt()` — including a 7-regex CLEAR-scoring pass — inside `normalizeGoalPromptFields` (mk-goal.js:348-357) even when the stored prompt fields are already valid. Separately, `recordMessageUpdated` (mk-goal.js:1126-1140) fires two independently queued mutations (`refreshGoalActivity` + `accountUsage`) per `message.updated` event, so ordinary chat traffic pays two full atomic write cycles — each with file fsync + rename + directory fsync (mk-goal.js:778-801) — where one would do.

### Purpose
The goal plugin's per-message hot paths (injection read/normalize and `message.updated` write) do the minimum necessary work, with zero observable change to stored goal state, injected prompt content, or tool output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `normalizeGoalPromptFields` lazy/memoized rebuild (e-1.1)
- `appendGoalBrief` mtime-keyed read cache incl. negative cache (e-1.2)
- `normalizeOptions` single-call threading per entry point (e-1.3)
- `recordMessageUpdated` merged into one mutator / one write cycle (e-1.4)
- `ensureGoalStateDir` per-`stateDir` memoization (e-1.6)
- `archiveGoalStateFile`'s `pruneArchive` call throttled like the orphan sweep (e-1.7)
- `sweepOrphanedActiveStates` stat-mtime prefilter before JSON parse (e-1.8)
- `goalStateLines` lazy/action-scoped injection preview (e-1.10)

### Out of Scope
- `e-1.5` (mutation-label-in-mutator) and `e-1.9` (continuation-log gate-logging skip) - folded into phase 016 (`F7` and `F1` respectively); this phase does not re-touch those code paths
- Any behavior-changing fix (correctness bugs F1-F12, D1-D3) - owned by phase 016
- Test architecture / subtest conversion - owned by phase 018
- Code refinements (dedupe helpers, clock unification, status-transition map, magic-number naming, doc updates) - owned by phase 019
- New capabilities, verbs, or env vars - owned by phase 020

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Memoize/lazy-load hot-path normalization, cache injection reads, merge the two `message.updated` mutations, throttle prune/memoize state-dir creation, prefilter sweep candidates, lazy injection preview |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modify | Add fs-call-count spy assertions for the merged `message.updated` write cycle and cache behavior |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modify | Add fs-spy assertions for `appendGoalBrief` cache hits/misses and `ensureGoalStateDir` memoization |
| `../017-hot-path-optimization/scratch/` | Create | Micro-benchmark script(s) demonstrating before/after fs-call counts and/or wall-clock deltas for the hot paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | e-1.2: `appendGoalBrief` caches goal reads keyed by the state file's mtime, including a negative cache for no-goal sessions | A second `appendGoalBrief` call within the same mtime window performs zero `fs.readFile` calls, proven by an fs-spy test; a no-goal session's second call also performs zero `fs.readFile`/ENOENT round-trips |
| REQ-002 | e-1.4: `recordMessageUpdated` produces at most one atomic write cycle per `message.updated` event | One `message.updated` event results in exactly one queued mutation observed via `mutationQueues` instrumentation or a write-cycle spy (file write + fsync + rename + dir fsync counted once, not twice) |
| REQ-003 | e-1.1: `normalizeGoalPromptFields` does not re-run `buildEnhancedGoalPrompt`'s 7-regex CLEAR-scoring pass when the stored `goalPrompt`/`promptEnhancement` fields are already present and valid | A `readGoal` call on a goal with valid stored prompt fields performs zero calls into `scoreEnhancedGoalPrompt`, proven by a spy/counter test; a goal with missing/invalid prompt fields still rebuilds them correctly (existing behavior preserved) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | e-1.3: `normalizeOptions` is called once per public entry point and threaded through, not re-invoked internally | A `setGoal` call chain invokes `normalizeOptions` exactly once, proven by a call-count spy (dossier baseline: 6+ invocations per chain today) |
| REQ-005 | e-1.6: `ensureGoalStateDir` memoizes per `stateDir` so `mkdir` is not re-issued on every write/append once the directory is known to exist | Two consecutive writes to the same `stateDir` in one process result in exactly one `mkdir` call, proven by an fs-spy test |
| REQ-006 | e-1.7: `archiveGoalStateFile` throttles its `pruneArchive` call the same way the orphan sweep is throttled, instead of pruning on every archive | N archive operations within one throttle interval result in at most one `pruneArchive` invocation (readdir + per-file stat), proven by a call-count spy |
| REQ-007 | e-1.8: `sweepOrphanedActiveStates` stat-mtimes state files before parsing JSON, and only parses candidates past the retention threshold | A sweep over a directory of fresh (non-expired) state files performs zero `JSON.parse` calls on those files, proven by a spy/counter test; expired files are still correctly identified and archived |
| REQ-008 | e-1.10: `goalStateLines` only renders the full injection preview when the caller's action actually needs it, instead of unconditionally re-running `renderGoalInjection` | Calling `goalStateLines` for an action that does not surface `injection_preview` performs zero additional `renderGoalInjection` calls beyond what the caller already needed, proven by a call-count spy; actions that DO need the preview (`show`, tool responses) still render it correctly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every e-1 item in scope (e-1.1, e-1.2, e-1.3, e-1.4, e-1.6, e-1.7, e-1.8, e-1.10) has a passing fs-call-count spy test and/or micro-benchmark evidence checked into `scratch/`
- **SC-002**: The full plugin test suite (`node --test .opencode/plugins/tests/mk-goal-*.test.cjs`) is green before and after this phase's changes, with no assertion rewritten to accommodate a behavior change
- **SC-003**: A micro-benchmark or spy count demonstrates the `message.updated` hot path performs one write cycle instead of two, and `appendGoalBrief` performs zero `fs.readFile` calls on a cache hit
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 016 must land first (shared-file sequencing, not a design dependency) | High - editing mk-goal.js concurrently with 016 risks merge conflicts and re-introducing fixed bugs | Do not start phase 017 implementation until phase 016's tasks.md shows all tasks `[x]` and its fresh test run is green |
| Risk | Merging `refreshGoalActivity` + `accountUsage` into one mutator could silently change write ordering or error semantics | Medium - behavior regression in usage accounting or activity tracking | New fs-spy/behavior tests assert identical final state before/after the merge; existing lifecycle tests must stay green unmodified |
| Risk | mtime-keyed caching could serve stale data if a concurrent process writes without the in-process cache observing the change | Medium - stale goal state briefly injected | Cache key includes the file's actual mtime (not a fixed TTL), so any external write invalidates the cache on next read |
| Risk | Reducing per-message dir-fsync durability could weaken crash-safety guarantees | Low-Medium - a crash between merged writes could lose one side's update instead of neither | Keep the merged mutator's write path atomic (single write + rename + fsync); do not remove fsync, only avoid doing it twice |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The dossier's e-1 items are self-contained optimization targets with clear remedy shapes; no design decision is required before implementation.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md`, section B "e-1 Optimizations" (items 1, 2, 3, 4, 6, 7, 8, 10)
- **Predecessor**: `../016-plugin-correctness-fixes/` (F1, F7 own e-1.5 and e-1.9)
<!-- /ANCHOR:cross-refs -->
