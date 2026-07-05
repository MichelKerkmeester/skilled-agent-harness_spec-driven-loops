---
title: "Tasks: Phase 19: code-refinements"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal plugin code refinements tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/019-code-refinements"
    last_updated_at: "2026-07-03T16:09:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Hit metadata validation block"
    next_safe_action: "Approve metadata refresh"
    blockers:
      - "Strict validation requires generated metadata refresh outside allowed write paths"
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-019-code-refinements-20260703"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: code-refinements

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 018 `tasks.md` shows all tasks `[x]`; run `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` fresh and paste the baseline output
  - Evidence: Phase 018 `tasks.md` shows T001-T014 and completion criteria all `[x]`. Baseline `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` reported `# tests 83`, `# pass 83`, `# fail 0`, duration `1770.134083ms`.
- [x] T002 `rg -n "markGoalStatus\(" .opencode/plugins/mk-goal.js .opencode/plugins/tests` to enumerate every call site and status argument actually exercised, deriving the transition set the new map must permit
  - Evidence: Live enumeration found `markGoalStatus` definition plus only two production call sites: `markGoalStatus(sessionID, 'complete', options)` and `markGoalStatus(sessionID, 'paused', ...)`. Existing passing tests exercise active-to-complete through the registered tool path; the new transition test preserves active-to-paused and active-to-complete.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [e-2.1] Extract `normalizeGoalID(value)`, replace all copy-pasted `sanitizeInlineText(x,160).replace(/\s+/g,'-')` call sites - re-verify current count/locations via `rg -n "sanitizeInlineText\([^)]*160\)\.replace"` first (7 sites confirmed at mk-goal.js:1265, 1353, 1579, 1598, 1615, 1632, 1823 as of this phase starting - grew from 6 after phases 016/017; do NOT assume these citations are still exhaustive, re-grep before finalizing) (and `goalIdFromFactory` at :487's near-variant if fallback behavior is preserved exactly); REQ-001 grep invariant passes
  - Evidence: Initial grep found 8 inline normalization sites in `.opencode/plugins/mk-goal.js`, including the extra stored-goal normalization site. Final invariant `rg -n "sanitizeInlineText\([^)]*160\)\.replace\(/\\s\+/g" .opencode/plugins/mk-goal.js` returned no output. `normalizeGoalID` has one definition and 8 call sites, including `goalIdFromFactory` with its empty-normalized fallback preserved.
- [x] T004 [e-2.2] Extract `patchGoalIfCurrent(sessionID, goalID, patch)`, refactor `recordContinuationReason` (mk-goal.js:1578), `recordContinuationBudgetStop` (:1597), `recordProviderUsageLimit` (:1614) to use it; REQ-003 verified, existing continuation tests green
  - Evidence: `patchGoalIfCurrent` has one definition. The three continuation mutators remain as thin wrappers. Full suite reports `# tests 85`, `# pass 85`, `# fail 0`.
- [x] T005 [e-2.3] Unify the clock: repoint `retentionNowMs` (mk-goal.js:991-993) and the raw `Date.now()` in `sweepOrphanedActiveStates` (function starts mk-goal.js:1055, raw call at :1058) through `nowMs` (mk-goal.js:190-192); REQ-004 grep invariant passes
  - Evidence: `rg -n "Date\.now\(\)" .opencode/plugins/mk-goal.js` reports only `nowMs`. Retention, archive prune throttle, orphan sweep, and atomic temp names now use `nowMs`.
- [x] T006 [e-2.4] Add an explicit status-transition map to `markGoalStatus` (mk-goal.js:1230) derived from T002's enumeration, rejecting `complete`→`active` and any other transition not in the enumerated set; REQ-002 verified
  - Evidence: RED run of `node --test .opencode/plugins/tests/mk-goal-supervisor.test.cjs` reported `# tests 7`, `# pass 5`, `# fail 2`, including `Missing expected rejection` for terminal resurrection. GREEN run after the map reported `# tests 7`, `# pass 7`, `# fail 0`.
- [x] T007 [P] [e-2.5] Normalize `maybeVerifyGoal`'s (function starts mk-goal.js:1485) early-return envelope (`defaultVerifierResult()` call ~:1489, defined :1421, returns 4 keys: verdict/confidence/reason/evidence) to match the applied-path key set (~:1527-1532, spreads result plus goalId/currentGoalId/verifierRunID/stale, 8 keys total); REQ-005 deepEqual test passes. Confirmed still a live gap as of this phase starting - re-verify both envelopes' actual keys via direct read before assuming this doc's key lists are exhaustive.
  - Evidence: RED run showed the early path had only `confidence`, `evidence`, `reason`, `verdict`. GREEN run confirms both early and applied paths expose `confidence`, `currentGoalId`, `evidence`, `goalId`, `reason`, `stale`, `verdict`, `verifierRunID`.
- [x] T008 [P] [e-2.8] Name the magic-number constants: goal-id cap 160 (multiple sites, same as T003's normalizeGoalID targets), objective-preview ratio 0.12 (duplicated at :1544 and :1813 - both are the identical formula `Math.max(60, Math.min(600, Math.floor(options.maxInjectionChars * 0.12)))`, consolidate both), prompt-overhead 1900 (:356), clamp floors `Math.max(3, ...)` (:1836, 1848); REQ-006 grep invariant passes. Re-verify all counts via `rg` first, these may have shifted further.
  - Evidence: `rg -n "\b160\b|\b0\.12\b|\b1900\b|Math\.max\(3," .opencode/plugins/mk-goal.js` reports only `GOAL_ID_MAX_CHARS = 160`, `PROMPT_OVERHEAD_CHARS = 1900`, and `OBJECTIVE_PREVIEW_RATIO = 0.12`.
- [x] T009 [P] [e-2.9] Document the canonical status field pair (`tokens_used`/`budget_tokens_used`, `usage_source`/`budget_usage_source`, mk-goal.js:1934-1939) in `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`; REQ-007 verified against live `goalStateLines` output
  - Evidence: `goal_plugin.md` now documents `tokens_used` and `usage_source` as canonical and `budget_tokens_used` and `budget_usage_source` as legacy-compatible aliases. This matches the live `goalStateLines` order and the existing docs that list `tokens_used` and `usage_source` first.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the fresh full plugin suite, confirm zero regressions vs T001 baseline (other than the intentional invalid-transition rejection); paste output
  - Evidence: Final `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` reported `# tests 85`, `# pass 85`, `# fail 0`, duration `1744.506166ms`. Delta from T001 is +2 regression subtests, both passing.
- [x] T011 Run the grep invariants for T003/T005/T008 (`rg -n` patterns from plan.md's affected-surfaces table), confirm zero remaining inline duplicates/magic numbers
  - Evidence: REQ-001 inline normalization grep returned no output. REQ-004 `Date.now()` grep reports only the `nowMs` function. REQ-006 magic-number grep reports only the three named constants for `160`, `1900`, and `0.12`; no `Math.max(3,` remains.
- [x] T012 Confirm T006's invalid-transition test rejects `complete`→`active` (and any other out-of-map transition) while every previously-tested transition still succeeds
  - Evidence: New test `status transitions reject terminal resurrection and preserve known valid transitions` confirms active-to-paused and active-to-complete still succeed, while complete-to-active and complete-to-paused reject with `INVALID_STATUS_TRANSITION`. RED before fix: `# tests 7`, `# pass 5`, `# fail 2`. GREEN after fix: `# tests 7`, `# pass 7`, `# fail 0`.
- [x] T013 Update `checklist.md` per-REQ rows with evidence citations; run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/032-goal-opencode-plugin/019-code-refinements --strict`; write `implementation-summary.md`
  - Evidence: No `checklist.md` exists for this Level 1 phase, so checklist update was skipped. `implementation-summary.md` was written. `node --check` passed for `.opencode/plugins/mk-goal.js`, `.opencode/plugins/tests/mk-goal-supervisor.test.cjs`, and `.opencode/plugins/tests/mk-goal-export-contract.test.cjs`. Comment hygiene passed with no output under `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh`. Alignment drift passed with Findings: 0, Errors: 0, Warnings: 0, Violations: 0. `description.json`/`graph-metadata.json` were outside the dispatch's allowed write paths (by design); the orchestrator regenerated them via `backfill-graph-metadata.js` post-dispatch. `SPECKIT_VALIDATE_LEGACY=1 bash validate.sh --strict` now reports Errors: 0, Warnings: 1 (the same benign non-blocking `ANCHORS_VALID` deviation confirmed harmless in phases 015-018).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md`, section B "e-2 Refinements" (items 1, 2, 3, 4, 5, 8, 9)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
