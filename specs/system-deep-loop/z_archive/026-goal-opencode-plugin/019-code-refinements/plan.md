---
title: "Implementation Plan: Phase 19: code-refinements"
description: "Consolidate mk-goal.js's duplicated goal-ID normalization and continuation-patch mutators, unify its clock sources, add an explicit status-transition map, normalize the verifier envelope, name magic numbers, and document canonical status fields."
trigger_phrases:
  - "goal plugin code refinements plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/019-code-refinements"
    last_updated_at: "2026-07-03T07:30:50Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from spec.md and audit dossier e-2 items"
    next_safe_action: "Wait for phase 018 to land; then start Phase 1 baseline"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-019-code-refinements-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: code-refinements

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
| **Language/Stack** | Node.js ESM plugin (`.opencode/plugins/mk-goal.js`) |
| **Framework** | None - flat plugin module |
| **Storage** | Flat JSON state files; no schema change in this phase |
| **Testing** | `node:test` subtests (post-018 restructure) via `node --test` |

### Overview
Seven scoped refactors, each replacing a duplicated or implicit pattern with a single named implementation, verified by a structural grep invariant plus the existing (post-018 restructured) subtest suite staying green. No new runtime dependency, no schema change, no new public behavior - only internal consolidation and one documentation update (`goal_plugin.md` for e-2.9).
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
Monolith plugin module; local extract-and-replace refactors. No new abstraction layer beyond the two new helper functions named in scope.

### Key Components

**NOTE**: All line numbers below were re-verified 2026-07-03 immediately before phase 018 landed and are current as of that check, but re-confirm via `rg`/`grep` before editing since concurrent phase work may shift them further. mk-goal.js grew ~566 lines from phases 016/017 versus when this plan was first authored, so any earlier line numbers you may have cached are stale.

- **`normalizeGoalID(value)` (new)**: replaces the 7 copy-pasted `sanitizeInlineText(x,160).replace(/\s+/g,'-')` call sites (mk-goal.js:1265, 1353, 1579, 1598, 1615, 1632, 1823 - grew from 6 sites after phases 016/017 added a 7th); `goalIdFromFactory` (:487) reuses the same idiom internally (no trailing `.replace`, has its own empty-string fallback) - reuse only if its fallback-generation behavior is preserved exactly.
- **`patchGoalIfCurrent(sessionID, goalID, patch)` (new)**: replaces the shared normalize-then-`mutateGoal`-then-guard shape in `recordContinuationReason` (:1578), `recordContinuationBudgetStop` (:1597), `recordProviderUsageLimit` (:1614); each of the three becomes a thin wrapper supplying its own `patch` object.
- **Unified clock function**: `nowMs` (:190-192) becomes the single source; `retentionNowMs` (:991-993) and the raw `Date.now()` in `sweepOrphanedActiveStates` (function starts :1055, raw call at :1058) both resolve through it instead of independently re-implementing the same `Number.isFinite(options.nowMs) ? options.nowMs : Date.now()` fallback.
- **Status-transition map**: a `STATUS_TRANSITIONS` (or similar) structure consulted by `markGoalStatus` (:1230) before applying `status`, enumerated from every transition already exercised by the passing test suite plus the dossier's called-out gap (`complete` -> `active`).
- **`maybeVerifyGoal` envelope normalization**: `maybeVerifyGoal` starts at :1485; the early-return path (`return defaultVerifierResult(...)`, ~:1489, itself defined at :1421 returning 4 keys: verdict/confidence/reason/evidence) is extended to include every key the applied path (~:1527-1532, spreads `result` plus adds goalId/currentGoalId/verifierRunID/stale, 8 keys total) returns, using shared defaults rather than omission. Confirmed still a live gap as of this phase starting, not incidentally resolved by 016/017.
- **Named constants**: `GOAL_ID_MAX_CHARS = 160`, `OBJECTIVE_PREVIEW_RATIO = 0.12` (duplicated at :1544 and :1813 - identical formula, likely from phase 017 adding a second prompt-rendering path; consolidate both), `PROMPT_OVERHEAD_CHARS = 1900` (:356), and a named clamp-floor constant replacing the repeated `Math.max(3, ...)` (mk-goal.js:1836, 1848) - declared once near the top of the file alongside the existing `DEFAULT_*` constants.
- **`goal_plugin.md`**: a new subsection documenting that `tokens_used`/`usage_source` (or `budget_tokens_used`/`budget_usage_source` - determined by inspecting which pair callers/docs already reference as primary) is canonical, with the other pair noted as a legacy-compatible alias. Live output source: `goalStateLines` mk-goal.js:1934-1939.

### Data Flow
No change to stored state shape, injected prompt content, or tool output for any valid input. The status-transition map (e-2.4) is the one item that changes observable behavior at the margin: a previously-silent invalid transition (e.g. `complete` -> `active`) now fails explicitly - this is the one deliberate, dossier-called-out exception to strict behavior preservation, and REQ-002 states it as an explicit acceptance criterion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 7x `sanitizeInlineText(x,160).replace(/\s+/g,'-')` (:1265,1353,1579,1598,1615,1632,1823 - re-verify count, grew from 6) | Copy-pasted goal-ID normalization | Extract to `normalizeGoalID()`, replace all found | `rg` zero remaining inline idiom outside the helper |
| `recordContinuationReason`/`recordContinuationBudgetStop`/`recordProviderUsageLimit` (:1578,1597,1614) | 3 near-duplicate patch mutators | Collapse into `patchGoalIfCurrent` | `rg` 1 definition; existing continuation tests green |
| `nowMs` (:190-192), `retentionNowMs` (:991-993), raw `Date.now()` (:1058, inside `sweepOrphanedActiveStates` :1055) | 3 independent clock accessors | Unify behind 1 clock function | `rg -n "Date.now()"` zero hits outside the clock function; fixed-`nowMs` test observes same time everywhere |
| `markGoalStatus` (:1230) | Accepts any `VALID_STATUSES` target from any state | Add explicit transition map | Invalid transition (e.g. complete→active) test now fails/rejects; all previously-tested transitions still succeed |
| `maybeVerifyGoal` (:1485) | Early-return envelope (`defaultVerifierResult()` :1421, 4 keys) omits keys present in applied path (~:1527-1532, 8 keys) | Normalize both paths to same key set | `Object.keys(...).sort()` deepEqual test on both paths |
| Magic numbers 160/0.12(x2)/1900/`Math.max(3,...)` (:356,1544,1813,1836,1848 - 0.12 duplicated, re-verify all counts) | Unnamed inline literals | Named constants | `rg` each value found once at its constant declaration |
| `goalStateLines` (:1934-1939) duplicate field pairs | Undocumented canonical-field ambiguity | Document in `goal_plugin.md` | Doc review against live output |
| `.opencode/plugins/tests/mk-goal-*.test.cjs` (post-018 subtests) | Regression coverage for all refactored functions | Extend with structural/consolidation assertions | `node --test` green |

Required inventories:
- Same-class producers: `rg -n "sanitizeInlineText\([^)]*160\)" .opencode/plugins/mk-goal.js` before extracting, to confirm the current call-site count (7 as of this phase starting, previously 6 - counts have already shifted once from added code between phases; catch any further drift the dossier or this plan missed).
- Consumers of changed symbols: `rg -n "recordContinuationReason|recordContinuationBudgetStop|recordProviderUsageLimit|nowMs\(|retentionNowMs\(|markGoalStatus\(|maybeVerifyGoal\(" .opencode/plugins/mk-goal.js .opencode/plugins/tests` to confirm every call site is accounted for before consolidating.
- Matrix axes: per status-transition pair (valid vs invalid, e.g. active→paused valid, complete→active invalid); early-return vs applied-path `maybeVerifyGoal` envelope keys; canonical vs alias status field in `goalStateLines` output.
- Algorithm invariant: every consolidation must produce byte-identical stored JSON and tool output for every previously-valid input; the status-transition map is the sole intentional behavior change (invalid transitions now rejected) and must be called out explicitly in the implementation-summary.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [ ] Confirm phase 018 is complete (tasks.md all `[x]`, fresh subtest run green)
- [ ] Run full plugin suite fresh, paste baseline output as the pre-refactor reference
- [ ] Enumerate every `markGoalStatus` call site and every status value passed to it across the codebase and tests, to derive the status-transition map from actually-exercised transitions

### Phase 2: Core Implementation
- [ ] REQ-001/e-2.1: extract `normalizeGoalID()`, replace all 6 call sites (+ `goalIdFromFactory` if safe)
- [ ] REQ-003/e-2.2: extract `patchGoalIfCurrent()`, refactor the 3 continuation-patch mutators to use it
- [ ] REQ-004/e-2.3: unify the clock behind one function, repoint `retentionNowMs` and the sweep's raw `Date.now()`
- [ ] REQ-002/e-2.4: add the explicit status-transition map to `markGoalStatus`, derived from Phase 1's enumeration
- [ ] REQ-005/e-2.5: normalize `maybeVerifyGoal`'s early-return envelope to match the applied-path key set
- [ ] REQ-006/e-2.8: name the magic-number constants and repoint their use sites
- [ ] REQ-007/e-2.9: document the canonical status fields in `goal_plugin.md`

### Phase 3: Verification
- [ ] Run the fresh full plugin suite, confirm zero regressions vs Phase 1 baseline
- [ ] Run the grep invariants for REQ-001, 003, 004, 006 (zero remaining duplicates/inline literals)
- [ ] Run the structural deepEqual test for REQ-005 (early-return vs applied-path envelope keys)
- [ ] Run the invalid-transition test for REQ-002, confirm it fails/rejects as expected
- [ ] Review `goal_plugin.md`'s new section against live `goalStateLines` output for REQ-007
- [ ] Update `checklist.md` and `implementation-summary.md` with evidence citations
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `normalizeGoalID`, `patchGoalIfCurrent`, unified clock, named constants (REQ-001, 003, 004, 006) | `node:test` subtests, post-018 structure |
| Structural | Status-transition map (REQ-002), verifier envelope key parity (REQ-005) | `node:test` deepEqual/throws assertions |
| Regression | Full existing plugin suite | `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` |
| Static | Zero remaining inline duplicates/magic numbers | `rg -n` invariants listed in the affected-surfaces table |
| Manual | `goal_plugin.md` doc review against live `goalStateLines` output | Direct file read + comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 018 (test-architecture-restructure) | Internal, same-file sequencing | Must be complete before this phase starts | Refactoring against monolithic test files would give coarser regression signal for these consolidations |
| Phase 020 (capability-additions) | Internal, sequencing | Runs after this phase; not a blocker for 019 | None - 020 adds new capabilities on top of the now-refactored code |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing test fails (other than the intentionally-added invalid-transition test), or fs/behavior evidence shows a stored-state or output difference beyond the one documented status-transition exception
- **Procedure**: Revert the specific refactor via targeted `git checkout` of `mk-goal.js` for that hunk; each of the 7 e-2 items is an independent, separately-committable change
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

Final phase in the serial chain **016 → 017 → 018 → 019 (this phase)**, all touching `.opencode/plugins/mk-goal.js`. This phase runs last because it refactors code whose correctness (016), performance (017), and test structure (018) have already been fixed/hardened - refactoring earlier would mean re-verifying these consolidations against code and tests that were still changing underneath them. Land 019 with a fresh green full-suite run; phase 020 (capability-additions) then builds new features on top of this fully-remediated baseline.
<!-- /ANCHOR:sequencing -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

