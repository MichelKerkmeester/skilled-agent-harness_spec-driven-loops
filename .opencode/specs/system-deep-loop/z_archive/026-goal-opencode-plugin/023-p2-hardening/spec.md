---
title: "Feature Specification: Phase 23: p2-hardening"
description: "Address the seven P2 hardening findings the orchestrator adjudicated as real from the 2026-07-04 dual-model deep review: two prompt-injection/secret-redaction gaps, a pause/resume wall-clock accounting bug, a budget_limited recovery dead-end, a retry-after unit-validation edge, a blocking statSync on the async continuation path, and two error-swallowing observability gaps."
trigger_phrases:
  - "goal plugin p2 hardening"
  - "redactEvidence secret patterns"
  - "wall clock pause resume bug"
  - "budget_limited recovery"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/023-p2-hardening"
    last_updated_at: "2026-07-04T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec from adjudicated P2 review findings"
    next_safe_action: "Dispatch implementation to cli-opencode executor"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/specs/system-deep-loop/026-goal-opencode-plugin/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-023-p2-hardening-20260704"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "2026-07-04, operator: selected the full seven-fix scope including F019 budget recovery and F020 retry-after unit validation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 23: p2-hardening

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 |
| **Predecessor** | 022-review-remediation |
| **Successor** | none |
| **Handoff Criteria** | All seven fixes land with per-fix RED/GREEN or structural regression tests; full plugin suite green from a fresh run; no behavior change beyond each fix's stated contract; strict validation Errors: 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the Goal plugin packet: the deferred P2 hardening tail from the 2026-07-04 dual-model deep review (MiniMax M3 + Kimi K2.7). Phase 022 fixed the one confirmed P1-class runtime bug and reconciled documentation; this phase takes the seven P2 findings the orchestrator adjudication confirmed as real and worth fixing. The intentional-design items (smoke-mode signalling, global-only kill switch) and cosmetic items (magic-constant naming, doc-field omissions) are NOT in scope.

**Scope Boundary**: `.opencode/plugins/mk-goal.js` plus its `node:test` suite. No command-surface, doc-surface, or schema changes. Each fix is behavior-preserving except for its own stated contract change.

**Dependencies**: none open. Phase 022 landed and is committed.

**Deliverables**:
- Expanded secret-redaction coverage in evidence/log output (F005)
- Role-label neutralizer that handles non-colon delimiters (F006)
- Wall-clock cap that excludes paused time and preserves remaining budget across resume (F024)
- A recovery path for `budget_limited` goals when the token budget is raised (F019)
- Retry-after parsing that honors an explicit unit before applying its epoch-ms heuristic (F020)
- A non-blocking async directory stat on the continuation dispatch path (F021)
- Debug-visible surfacing of previously-swallowed append/sweep errors (F004, F007)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Seven adjudicated P2 findings remain in `mk-goal.js`. (1) F005: `redactEvidence` (mk-goal.js:~380) redacts Bearer/JWT/`sk-`/`gh*_`/`xox*`/AWS/`api_key=` patterns but misses Google API keys (`AIza…`), PEM private-key blocks, and generic high-entropy hex/base64 secrets, so those can survive into persisted evidence and status output. (2) F006: the role-label neutralizer in `sanitizeInlineText` (mk-goal.js:~339-347) only rewrites labels followed by a colon, so `system = ...`, `developer -> ...`, or `assistant → ...` injection framings pass through un-neutralized. (3) F024: `continuationCapReason` (mk-goal.js:~1993) computes wall-clock elapsed as `now - startedAtMs`, and `resumeGoal` (mk-goal.js:~1530) never rebases `startedAtMs`; a goal paused and resumed later counts paused time against its wall budget and can hit `wall_clock_cap_reached` immediately on resume — a correctness regression in the phase-020 pause/resume feature. (4) F019: `budget_limited` is a real status whose transition map (mk-goal.js:~151) dead-ends at `{budget_limited, complete}`, and `resumeGoal`'s `allowedFrom` (mk-goal.js:~1533) omits it, so a goal that exhausts its token budget can never return to active even after the budget is raised — asymmetric with `usage_limited`, which auto-recovers. (5) F020: `retryAfterDeadlineFromValue` (mk-goal.js:~867) applies a `> 1e12 ⇒ treat as absolute epoch-ms` heuristic even when the caller passed an explicit `unit`, so a large seconds value can be misread as an epoch timestamp. (6) F021: `buildPromptAsyncOptions` (mk-goal.js:~2051) calls `statSync` on the async continuation-dispatch path, briefly blocking the event loop. (7) F004/F007: `appendGoalJsonl` (mk-goal.js:~695) and `sweepOrphanedActiveStates` (mk-goal.js:~1231) each `catch { return; }`, silently discarding disk/permission/integrity errors with no observability even under `MK_GOAL_DEBUG`.

### Purpose
Evidence redaction covers the common secret formats; the injection sanitizer neutralizes role labels regardless of delimiter; the wall-clock cap measures only active time and survives pause/resume; a budget-raised goal can resume; retry-after parsing respects an explicit unit; the continuation path performs no synchronous filesystem I/O; and previously-silent state-write failures are visible under debug — all with no other behavior change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F005: extend `redactEvidence` with Google API key, PEM private-key block, and generic high-entropy hex/base64 secret patterns
- F006: extend the role-label neutralizer to match `=`, `->`, and `→` delimiters in addition to `:`
- F024: track consumed active wall time across pause; rebase `startedAtMs` on resume so paused spans do not count
- F019: allow a `budget_limited` goal to return to active when the token budget has been raised above `tokensUsed`, guarded by a budget re-check
- F020: honor an explicit `unit` ('s'/'ms') in `retryAfterDeadlineFromValue`; apply the epoch-ms heuristic only when the unit is unknown
- F021: replace the `statSync` directory check on the continuation path with async `stat`
- F004/F007: surface the swallowed `appendGoalJsonl` and `sweepOrphanedActiveStates` errors under `MK_GOAL_DEBUG` via a non-recursive debug write

### Out of Scope
- F022 (smoke mode returns `would_fire` before the `promptAsync` check) — intentional dry-run signal
- F023 (per-session emergency kill switch) — feature request needing its own design, not a defect
- F011 (debug-log unbounded growth) — already bounded by `pruneJsonlLog`, which `appendGoalJsonl` calls; verified, no fix needed
- Cosmetic P2s: dead-code branches, remaining unnamed constants, output-field documentation omissions
- Command-surface, feature-catalog, playbook, or `goal_plugin.md` changes — no doc drift is introduced by these code fixes
- Removing the duplicate `budget_*` alias status fields — intentional legacy aliases per phase 019

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | All seven fixes: redaction patterns, role-delimiter neutralizer, wall-clock pause/resume accounting, budget_limited recovery, retry-after unit validation, async stat, debug error surfacing |
| `.opencode/plugins/tests/mk-goal-*.test.cjs` | Modify | Per-fix RED/GREEN or structural regression subtests across the appropriate existing test files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F024: the wall-clock cap measures only active (non-paused) time; a goal paused and resumed after a long wall-clock gap is not immediately capped | A test that creates a goal, advances the injected clock near the wall cap, pauses, advances the clock well past the cap, resumes, and asserts `continuationCapReason` is NOT `wall_clock_cap_reached` and remaining wall budget reflects only pre-pause active time. Existing wall-cap tests (active-only goals) stay green |
| REQ-002 | F019: a `budget_limited` goal returns to active when the token budget is raised above `tokensUsed`; a still-exhausted budget goal cannot resume | RED/GREEN: a test raising the budget then resuming a `budget_limited` goal ends `active`; a companion test resuming without raising the budget stays `budget_limited` (or is rejected). The `usage_limited` and `paused` recovery paths remain unchanged |
| REQ-003 | F005: `redactEvidence` redacts Google API keys, PEM private-key blocks, and generic high-entropy hex/base64 secrets, in addition to the existing patterns | A table test feeding one fixture per new secret format asserts each is replaced with the redaction marker; a companion test asserts non-secret text (ordinary hex like a short commit sha, prose) is NOT over-redacted |
| REQ-004 | F006: the role-label neutralizer rewrites `system`/`developer`/`assistant`/`tool`/`user` labels when followed by `=`, `->`, or `→`, not only `:` | RED/GREEN: fixtures using each delimiter are neutralized post-fix; a fixture that previously passed (colon) still neutralizes; ordinary text containing `=`/`->` around non-role words is unaffected |

### P2 - Suggested (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | F020: `retryAfterDeadlineFromValue` honors an explicit `unit` and applies the `>1e12 ⇒ epoch-ms` heuristic only when `unit` is null/unknown | A test with `unit='s'` and a value above `1e12` returns `now + value*1000` (delta seconds), not the raw value as an absolute timestamp; existing `unit='ms'` and epoch-heuristic (unknown-unit) cases stay unchanged |
| REQ-006 | F021: the continuation dispatch path performs no synchronous filesystem stat | `rg -n "statSync" .opencode/plugins/mk-goal.js` shows no call on the continuation path (the import may be removed if unused); the directory-resolution behavior is unchanged, verified by the existing continuation tests staying green |
| REQ-007 | F004/F007: `appendGoalJsonl` and `sweepOrphanedActiveStates` surface their caught errors under `MK_GOAL_DEBUG` without recursing through the same failing append | With `MK_GOAL_DEBUG` set and the state directory made unwritable in a fixture, each function emits a debug signal (e.g. stderr line or an injected debug sink) and still returns without throwing; with debug off, behavior is byte-identical to today (silent, no throw) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full plugin suite (`node --test .opencode/plugins/tests/*.test.cjs`) green from a fresh run before AND after, with every new regression test proven RED against pre-fix code where a RED/GREEN pair is specified (REQ-001, REQ-002, REQ-004)
- **SC-002**: Each of the seven fixes is verifiable by its stated test or grep invariant; no existing assertion is rewritten to accommodate a behavior change other than the seven stated contracts
- **SC-003**: Strict validation on this folder reports Errors: 0 (the packet's benign ANCHORS_VALID warning is acceptable); comment hygiene and alignment drift on `mk-goal.js` are clean
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wall-clock rebasing (F024) could double-count or lose active time if the pause/resume accounting is off by one span | Medium - continuation could stop too early or run past budget | Track a single accumulated `activeWallMs` at pause and rebase `startedAtMs = now - activeWallMs` at resume; assert the invariant `now - startedAtMs == pre-pause active elapsed` in the test |
| Risk | Budget recovery (F019) could resume a still-exhausted goal, immediately re-capping it | Medium - resume churn | Gate the `budget_limited -> active` transition on `!budgetWasCrossed(tokensUsed, tokenBudget)`; add the guarded transition to the map, do not open it unconditionally |
| Risk | Broader redaction regexes (F005) could over-redact legitimate text (e.g. a hex commit sha) | Medium - evidence becomes unreadable | Require a minimum entropy/length for the generic hex/base64 pattern; include a non-over-redaction test with ordinary short hex and prose |
| Risk | Async stat conversion (F021) changes `buildPromptAsyncOptions` from sync to async, touching its call site | Low | Make the function async and await it at the single call site; the existing continuation test covers the path |
| Dependency | Generated metadata refresh | Low | Orchestrator runs backfill-graph-metadata.js post-dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator selected the full seven-fix scope on 2026-07-04; the two design points (wall-time rebasing model for F024, budget re-check guard for F019) are settled in Requirements and Risks.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../review/review-report.md` section 10 (orchestrator adjudication) plus `../review/lineages/kimi-review/review-report.md` (F004-F024 detail)
- **Predecessor**: `../022-review-remediation/`
<!-- /ANCHOR:cross-refs -->
