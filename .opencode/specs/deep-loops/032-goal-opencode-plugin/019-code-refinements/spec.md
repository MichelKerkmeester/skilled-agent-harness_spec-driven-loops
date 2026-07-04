---
title: "Feature Specification: Phase 19: code-refinements"
description: "mk-goal.js carries copy-pasted goal-ID normalization (7x, grew from 6x pre-phase-016/017), near-duplicate continuation-patch mutators, three separate clock sources, an implicit any-to-any status transition map, unnamed magic numbers (0.12 ratio now duplicated at 2 sites), and two undocumented duplicate status-field pairs - the duplication and implicit contracts that made the F-series bugs possible. NOTE: all line-number citations in this doc predate phases 016/017's ~566-line growth in mk-goal.js and are stale; re-locate every target via grep for the exact code pattern before editing, not the cited line number."
trigger_phrases:
  - "goal plugin code refinements"
  - "normalizeGoalID extraction"
  - "patchGoalIfCurrent consolidation"
  - "goal plugin status field documentation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/019-code-refinements"
    last_updated_at: "2026-07-03T07:30:50Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from four-reviewer audit dossier e-2 items (1-5, 8-9)"
    next_safe_action: "Await phase 018 to land, then author plan.md phase sequencing detail"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/skills/system-spec-kit/references/hooks/goal_plugin.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-019-code-refinements-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 19: code-refinements

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
| **Priority** | P3 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 |
| **Predecessor** | 018-test-architecture-restructure |
| **Successor** | 020-capability-additions |
| **Handoff Criteria** | Every e-2 item in scope is refactored behind a structural grep-verifiable invariant; full plugin test suite green; goal_plugin.md documents the canonical status fields |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the Goal plugin review remediation: behavior-preserving refactors of `.opencode/plugins/mk-goal.js`'s duplication and implicit-contract sources, sourced from the four-reviewer audit dossier (`../scratch/2026-07-03-four-reviewer-audit-findings.md`, section B "e-2 Refinements", items 1-5 and 8-9).

**Scope Boundary**: `mk-goal.js` refactors plus one documentation file (`goal_plugin.md`) for e-2.9. Every change is behavior-preserving: the same inputs must produce the same stored state, injected prompt, and tool output as before. This phase runs only after phase 018 (test-architecture-restructure) lands, so these refactors are verified against the already-restructured subtest suite rather than the old monolithic files.

**Dependencies**:
- Phase 018 (test-architecture-restructure) must be complete before this phase starts - shared-file edit ordering.

**Deliverables**:
- One `normalizeGoalID()` helper replacing the 7 copy-pasted `sanitizeInlineText(x,160).replace(/\s+/g,'-')` call sites (grew from 6 after phases 016/017; re-verify count via `rg` first) (e-2.1)
- `recordContinuationReason`/`recordContinuationBudgetStop`/`recordProviderUsageLimit` collapsed into one `patchGoalIfCurrent(sessionID, goalID, patch)` (e-2.2)
- One injected clock used by `nowMs`, `retentionNowMs`, and the raw `Date.now()` call in `sweepOrphanedActiveStates` (e-2.3)
- An explicit status-transition map constraining `markGoalStatus` (e-2.4)
- A normalized `maybeVerifyGoal` envelope so the early-return and applied paths return the same keys (e-2.5)
- Named constants for the goal-id cap (160), objective-preview ratio (0.12), prompt-overhead budget (1900), and clamp floors (`Math.max(3, ...)`) (e-2.8)
- `goal_plugin.md` documents which status field is canonical: `tokens_used` vs `budget_tokens_used`, `usage_source` vs `budget_usage_source` (e-2.9)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mk-goal.js` contains duplication and implicit contracts that made the F-series correctness bugs (fixed in phase 016) possible in the first place: the `sanitizeInlineText(x,160).replace(/\s+/g,'-')` goal-ID normalization idiom is copy-pasted **7 times as of this phase starting** (re-confirmed at mk-goal.js:1265, 1353, 1579, 1598, 1615, 1632, 1823 - grew from the originally-documented 6 sites after phases 016/017 added a 7th; re-verify via `rg` before implementing since this may have shifted further), plus a near-variant at `goalIdFromFactory` (mk-goal.js:487) using the same idiom internally without the `.replace` chain; three continuation-patch mutators (`recordContinuationReason` :1578, `recordContinuationBudgetStop` :1597, `recordProviderUsageLimit` :1614) repeat the same normalize-then-`mutateGoal`-then-guard shape; three separate clock accessors exist (`nowMs` at :190-192, `retentionNowMs` at :991-993, and a raw `Date.now()` at :1058 inside `sweepOrphanedActiveStates`, which starts at :1055); `markGoalStatus` (mk-goal.js:1230) accepts any `VALID_STATUSES` target from any current state with no transition map, so a terminal `complete` goal can be silently resurrected to `active`; `maybeVerifyGoal`'s (function starts :1485) early-return envelope (the `defaultVerifierResult()` call, 4 keys: verdict/confidence/reason/evidence) omits keys present in its applied-path envelope (spreads `result` then adds `goalId`/`currentGoalId`/`verifierRunID`/`stale`, 8 keys total - confirmed still a live gap, not resolved by 016/017), forcing callers to rely on `undefined` fall-through; and magic numbers (160-char cap, 0.12 preview ratio - **now duplicated at 2 identical sites, :1544 and :1813, confirm both before consolidating**, 1900-char prompt overhead at :356, `Math.max(3, ...)` clamp floors at :1836 and :1848) appear unnamed at their use sites. Separately, `goalStateLines` (mk-goal.js:1934-1939) emits two field-name pairs for the same values (`tokens_used`/`budget_tokens_used`, `usage_source`/`budget_usage_source`) with no documentation of which is canonical.

### Purpose
`mk-goal.js`'s duplicated normalization/patch logic is consolidated into single implementations, its clock sources are unified, its status transitions and verifier envelope are explicit and consistent, its magic numbers are named, and `goal_plugin.md` documents the canonical status fields - with zero behavior change anywhere.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- e-2.1: Extract `normalizeGoalID()`, replace all 7 copy-pasted call sites as currently found by `rg` (plus the `goalIdFromFactory` near-variant if it can share the same helper without changing its fallback behavior)
- e-2.2: Collapse the three continuation-patch mutators into one `patchGoalIfCurrent(sessionID, goalID, patch)`
- e-2.3: Unify `nowMs`, `retentionNowMs`, and the raw `Date.now()` call behind one injected clock
- e-2.4: Explicit status-transition map for `markGoalStatus`, rejecting invalid transitions (e.g. `complete` -> `active`)
- e-2.5: Normalize `maybeVerifyGoal`'s early-return envelope to include the same keys as the applied-path envelope
- e-2.8: Name the magic numbers (160-char goal-id cap, 0.12 objective-preview ratio, 1900-char prompt overhead, `Math.max(3, ...)` clamp floors) as constants
- e-2.9: Document the canonical status fields (`tokens_used` vs `budget_tokens_used`, `usage_source` vs `budget_usage_source`) in `goal_plugin.md`

### Out of Scope
- e-2.6 (route archive/sweep through mutationQueues) and e-2.7 (role-label prefix + Bearer/JWT redaction) - folded into phase 016 (F3, F5)
- e-2.10 (subtest conversion) and e-2.11 (test-helper dedupe) - owned by phase 018
- Any performance/caching change - owned by phase 017
- New verbs, env vars, or capabilities - owned by phase 020
- Any change to `VALID_STATUSES`' membership (only the transition MAP is added, not new statuses)
- Renaming the duplicate status-field pairs themselves (`tokens_used`/`budget_tokens_used` etc.) - e-2.9 is documentation-only; removing a field is a behavior change requiring its own decision

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Extract `normalizeGoalID()`, `patchGoalIfCurrent()`, unify clock, add status-transition map, normalize verifier envelope, name magic-number constants |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Modify | Document which status field is canonical (e-2.9) - the only non-`mk-goal.js` file this phase touches |
| `.opencode/plugins/tests/mk-goal-*.test.cjs` | Modify | Add/adjust subtests (post-018 restructure) asserting the refactored helpers produce identical output to the pre-refactor call sites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | e-2.1: Exactly one `normalizeGoalID()` definition; zero remaining inline `sanitizeInlineText(x,160).replace(/\s+/g,'-')` idioms | `rg -n "sanitizeInlineText\([^)]*160\)\.replace\(/\\\\s\+/g" .opencode/plugins/mk-goal.js` returns zero hits outside the single helper definition; `rg -n "normalizeGoalID"` shows exactly 1 definition and 7+ call sites (re-count at implementation time, do not assume 7 is still current) |
| REQ-002 | e-2.4: `markGoalStatus` rejects invalid status transitions via an explicit transition map | A test asserting `complete` -> `active` (and other invalid transitions) throws `GoalError`/is rejected; all previously-valid transitions (e.g. `active` -> `paused`, `active` -> `complete`) still succeed unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | e-2.2: `recordContinuationReason`, `recordContinuationBudgetStop`, `recordProviderUsageLimit` are implemented as calls into one `patchGoalIfCurrent(sessionID, goalID, patch)` | `rg -n "async function patchGoalIfCurrent"` shows exactly 1 definition; the three original functions either call it or are removed in favor of direct call sites using it; existing tests for all three continuation-reason paths still pass unchanged |
| REQ-004 | e-2.3: One injected clock used everywhere; `nowMs`, `retentionNowMs`, and the raw `Date.now()` in `sweepOrphanedActiveStates` all resolve through it | `rg -n "Date\.now\(\)" .opencode/plugins/mk-goal.js` shows zero direct call sites outside the single clock function; tests injecting a fixed `nowMs` via options observe that fixed time in retention/sweep logic too |
| REQ-005 | e-2.5: `maybeVerifyGoal`'s early-return envelope has the same key set as its applied-path envelope | A structural test (`Object.keys(...).sort()` deepEqual) confirms both return paths produce identical key sets; existing callers relying on either path still function unchanged |
| REQ-006 | e-2.8: Goal-id cap (160), objective-preview ratio (0.12), prompt-overhead (1900), and clamp floors (`Math.max(3, ...)`) are named constants, not inline literals | `rg -n "\b160\b|\b0\.12\b|\b1900\b|Math\.max\(3," .opencode/plugins/mk-goal.js` shows each value defined once as a named constant and referenced by name at each prior use site |
| REQ-007 | e-2.9: `goal_plugin.md` states which of `tokens_used`/`budget_tokens_used` and `usage_source`/`budget_usage_source` is canonical | `goal_plugin.md` contains a section naming the canonical field of each pair and the relationship between them, verified against the live `goalStateLines` output (mk-goal.js:1934-1939) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full plugin test suite (`node --test .opencode/plugins/tests/mk-goal-*.test.cjs`) is green before and after every refactor in this phase, with no assertion rewritten to accommodate a behavior change
- **SC-002**: Every e-2 item in scope (1, 2, 3, 4, 5, 8, 9) is verifiable by a structural `grep` invariant (single definition, zero remaining inline duplicates, named constant) as stated in its REQ's acceptance criteria
- **SC-003**: `goal_plugin.md` documents the canonical status fields, matching the live code exactly
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 018 must land first (test files must already be in subtest form) | Medium - refactoring against monolithic test files would make regression detection coarser | Do not start until phase 018's `tasks.md` shows all tasks `[x]` and a fresh subtest run is green |
| Risk | Adding a status-transition map (e-2.4) could reject a transition some existing code path silently relies on | Medium - could break a legitimate but previously-unvalidated transition | Enumerate every existing call site of `markGoalStatus` before defining the map; the map must be a strict superset of every transition currently exercised by passing tests |
| Risk | Collapsing 3 continuation-patch mutators into 1 could subtly change which fields each one sets if their patches aren't extracted precisely | Medium - regression in continuation-suppression or budget/usage-limit state | Diff all 3 functions' return objects field-by-field before consolidating; existing per-function tests (continuation test file) must stay green unmodified |
| Risk | Unifying the clock could change retention/sweep math if `retentionNowMs`'s fallback-to-`Date.now()` semantics differ subtly from `nowMs`'s | Low - both already share the same `options.nowMs` override pattern | Confirm both functions' fallback behavior is identical before merging (both already do `Number.isFinite(options.nowMs) ? options.nowMs : Date.now()`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All e-2.1-2.5, 2.8, 2.9 items are refactors/documentation with clear remedy shapes and no design decision pending.
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

- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md`, section B "e-2 Refinements" (items 1, 2, 3, 4, 5, 8, 9)
- **Predecessor**: `../018-test-architecture-restructure/` (lands before this phase)
<!-- /ANCHOR:cross-refs -->
