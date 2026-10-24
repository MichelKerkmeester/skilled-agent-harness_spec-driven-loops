---
title: "Feature Specification: Phase 14: goal-no-budget-stop"
description: "Only the OpenCode goal plugin stopped a goal on a limit, through a token budget, a turn cap and a wall-clock cap. The shared core behind Pi, Cursor and Devin never did. This phase removes the three stops so no runtime ends or silences a running goal on a budget, a turn count or elapsed time."
trigger_phrases:
  - "goal no budget stop"
  - "phase 14 goal no budget stop"
  - "goal never stops on a budget"
  - "opencode goal turn cap"
  - "opencode goal wall clock cap"
  - "budget_limited goal status"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: goal-no-budget-stop

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-claude-goal-copy-block |
| **Successor** | None |
| **Handoff Criteria** | The OpenCode plugin holds no budget, turn or time stop. The OpenCode suites and the shared core suite assert that a goal keeps running. Older `budget_limited` records still load and resume. Every doc that named the old limits says there is none. `validate.sh --strict` prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Create the sk-create-goal sk-doc mode specification. The operator asked for it on 2026-10-24: the goal plugins and hooks of every runtime must never stop a long-running goal on a budget, a turn count or elapsed time. A look at the goal code of every runtime found that only the OpenCode plugin enforced limits.

**Scope Boundary**: What each runtime's goal plugin or hook does about a budget, a turn count or elapsed time. The OpenCode plugin loses its three stops and everything that served them. The shared core behind Pi, Cursor and Devin and the Hermes plugin stay unchanged, because neither ever stopped a goal on a limit. The `tokenBudget` field and `--budget N` stay as a recorded reading. The `budget_limited` status value, token and time accounting, the 1500 ms cooldown between continuations and the provider `usage_limited` status stay too.

**Dependencies**:
- The shared core, `.skilled/hooks/goal/lib/goal-core.cjs`, is the reference. Its only status values are `active`, `paused`, `complete` and `cleared`, so the plugin is brought to its rule and the core needs no code change.
- Goal records an older plugin version wrote must still load and resume, so the `budget_limited` value stays.

**Deliverables**:
- `.opencode/plugins/opencode-goal.js` without the budget status switch, the resume refusal while over budget, the cap and budget checks, the two env variables, the `maxAutoTurns` and `maxWallMs` options, the stored `maxAutoTurns` field and four status lines.
- Twelve OpenCode tests rewritten to assert that the goal keeps running, and one new core test that pins the same rule.
- The plugin doc, the command doc, the feature catalog and playbook entries, the env reference and `.env.example` updated to say there is no limit.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The OpenCode goal plugin stopped a goal three ways. A token budget that was crossed set the status `budget_limited` and suppressed continuation. An auto-turn cap, 8 by default and set by `OPENCODE_GOAL_MAX_AUTO_TURNS`, stopped it after that many continuations. A wall-clock cap, 30 minutes by default and set by `OPENCODE_GOAL_MAX_WALL_MS`, stopped it after that much time. The shared core behind Pi, Cursor and Devin never enforced a limit, since it only counts turns and injects whenever the status is `active`, so the runtimes disagreed on how long a goal may run.

### Purpose
A goal on any runtime keeps running until it is completed, paused or cleared, and the OpenCode plugin follows the same rule as the shared core.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the budget status switch in both token-accounting paths and the resume refusal while over budget.
- Remove the cap and budget checks and their helper functions from the continuation decision.
- Remove the cap check from the turn reservation.
- Remove the env variables `OPENCODE_GOAL_MAX_AUTO_TURNS` and `OPENCODE_GOAL_MAX_WALL_MS`, the `maxAutoTurns` and `maxWallMs` options and the stored `maxAutoTurns` field.
- Remove the status lines `max_auto_turns`, `remaining_auto_turns`, `max_wall_ms` and `remaining_wall_ms`, and print the usage line as `iteration N` with no ratio, as the shared core does.
- Keep `tokenBudget` and `--budget N` as a recorded reading, shown as `token_budget` and in the usage line.
- Rewrite the twelve OpenCode tests that asserted the old stops, add one core test and update every doc that named the limits.

### Out of Scope
- The shared core code and the Pi, Cursor and Devin hooks - the core never had a limit stop, so there is nothing to remove. One core test is added to pin that.
- The Hermes plugin - it has no goal limit.
- The `usage_limited` status - it records a provider quota, not a goal limit.
- The 1500 ms cooldown between continuations - it spaces turns and never ends a goal.
- Rewriting goal records an older version wrote - a record already suppressed with a cap or budget reason stays suppressed, as the risks table records.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/opencode-goal.js` | Modify | Remove the three stops, the two env variables, the two options, the stored cap field and four status lines. The same file is reachable as `.skilled/plugins/opencode-goal.js` through the `.skilled/plugins` link |
| `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs`, `opencode-goal-continuation.test.cjs`, `opencode-goal-lifecycle.test.cjs`, `opencode-goal-render-parity.test.cjs`, `opencode-goal-state.test.cjs` | Modify | Twelve tests that asserted the old stops now assert that the goal keeps running. One pair of cap tests became one test |
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modify | One new test, `a recorded token budget never ends or silences a goal that keeps running` |
| `.skilled/hooks/goal/goal-plugin.md` | Modify | States that no budget, turn count or elapsed time ends a goal |
| `.skilled/commands/goal-opencode.md` | Modify | States the same, and says `--budget N` is a recorded reading |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md` | Modify | The system-spec-kit entries describe a goal with no ceiling |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modify | The system-skill-advisor entries describe a goal with no ceiling |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` | Modify | Drop the two retired env variables |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The OpenCode goal plugin never stops, pauses or silences a goal because of a token budget, a turn count or elapsed time. It has no budget status switch, no resume refusal while over budget, no cap or budget check in the continuation decision or the turn reservation, no `OPENCODE_GOAL_MAX_AUTO_TURNS` or `OPENCODE_GOAL_MAX_WALL_MS`, no `maxAutoTurns` or `maxWallMs` option and no stored `maxAutoTurns` field. |
| REQ-002 | No other runtime stops a goal on a limit either. The shared core behind Pi, Cursor and Devin and the Hermes plugin stay unchanged, and a core test pins that a recorded token budget never ends or silences a goal that keeps running. |
| REQ-003 | What is not a goal limit stays: `tokenBudget` and `--budget N` as a recorded reading, the `budget_limited` value so older records still load and resume, token and time accounting, the 1500 ms cooldown between continuations and the `usage_limited` status. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Status output drops `max_auto_turns`, `remaining_auto_turns`, `max_wall_ms` and `remaining_wall_ms`, and the usage line reads `iteration N` with no ratio, matching the shared core. |
| REQ-005 | The OpenCode suites assert that the goal keeps running where they asserted the old stops. Twelve tests are rewritten, and the rewritten and new tests fail against the pre-change plugin. |
| REQ-006 | The plugin doc, the command doc, the feature catalog and playbook entries, `ENV-REFERENCE.md` and `.env.example` say that no budget, turn count or elapsed time ends a goal, and none lists a retired env variable as live. |
| REQ-007 | This spec folder validates with `validate.sh --strict` and prints `RESULT: PASSED`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The OpenCode goal suites pass 151 of 151, from a baseline of 152 of 152, and `goal-core.test.cjs` passes 87 of 87 with its new test.
- **SC-002**: Against the pre-change plugin, 10 of the rewritten or new tests fail, which shows they test the change.
- **SC-003**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Goal records an older version wrote | Medium: a `budget_limited` record would stop loading | The `budget_limited` value stays, and `/goal-opencode resume` still reactivates it |
| Risk | A goal can now run without any ceiling | Medium: only the operator or the goal's own completion ends it | The operator stops a goal with `/goal-opencode pause` or `/goal-opencode clear`, and the 1500 ms cooldown still spaces continuations |
| Risk | A record an older version already suppressed with a cap or budget reason has `continuationSuppressed` true | Low | It stays suppressed until it is set again or the two-day active-state sweep archives it. `/goal-opencode resume` only works on `paused`, `usage_limited` and `budget_limited` records |
| Risk | Removing code from the continuation decision changes behavior the tests no longer pin | Medium | Twelve tests assert the goal keeps running, and the negative control shows 10 of them fail against the pre-change plugin |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The continuation decision and the turn reservation only lose checks. No timing target applies and none was measured.
- **NFR-P02**: The 1500 ms cooldown stays, so continuations stay spaced as before.

### Security
- **NFR-S01**: The change removes two env variables and two options and adds no input.
- **NFR-S02**: N/A. No credential, auth or permission handling is in scope.

### Reliability
- **NFR-R01**: A record with the status `budget_limited` still loads and resumes.
- **NFR-R02**: Every goal suite in scope reports `fail 0`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a goal set without `--budget` has no recorded budget and runs without a ceiling.
- Maximum length: the iteration count has no maximum, and the usage line reads `iteration N` for any N.
- Invalid format: a retired env variable set in the environment has no effect, because nothing in the plugin reads it.

### Error Scenarios
- External service failure: a provider quota still sets `usage_limited`, which records the provider's limit and not a goal limit. `/goal-opencode resume` reactivates it.
- Network timeout: not affected. The change removes checks and adds no call.
- Concurrent access: not affected. The turn reservation loses its cap check and nothing else.

### State Transitions
- Partial completion: a goal an older version suppressed with a cap or budget reason stays suppressed until it is set again or the two-day sweep archives it.
- Session expiry: not affected. Elapsed time is still recorded as accounting and never ends a goal.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One plugin file, six test files and eight doc or config files, all a removal of limit logic |
| Risk | 10/25 | A goal runs with no ceiling, and older records must still load |
| Research | 4/20 | A look at the goal code of each runtime found the one producer |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the plugin clear `continuationSuppressed` on a record an older version suppressed with a cap or budget reason? It does not today, so such a record stays suppressed until it is set again or the two-day sweep archives it. This phase leaves it as it is.
<!-- /ANCHOR:questions -->

---


