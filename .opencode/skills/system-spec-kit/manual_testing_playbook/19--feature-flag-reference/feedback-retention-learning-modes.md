---
title: "443 -- Feedback Retention Learning Modes"
description: "Manual check that feedback retention learning is default-off, shadow mode writes audit-only decisions, active mode requires explicit evidence, and disabling restores inert behavior."
---

# 443 -- Feedback Retention Learning Modes

## 1. OVERVIEW

This scenario validates feedback retention learning safety gates. The master flag must be enabled before the reducer runs. Shadow mode may write audit rows without changing retention state. Active mode requires explicit shadow-evaluation evidence before it can mutate retention rows.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm feedback retention learning default-off, shadow, active, and disable behavior.
- Real user request: `Validate feedback retention learning without letting it delete or protect anything unless active mode has evidence.`
- Prompt: `Validate SPECKIT_FEEDBACK_RETENTION_LEARNING and SPECKIT_FEEDBACK_RETENTION_MODE across off, shadow, active, and disabled rollback steps.`
- Expected execution process: Seed feedback summaries in a sandbox, run with the master flag off, enable shadow mode and inspect audit-only decisions, switch to active mode without evidence and confirm refusal, rerun active mode with evidence and verify bounded retention updates, then disable the master flag and confirm no further updates.
- Expected signals: Off mode runs no feedback-driven audit or retention decisions (the baseline TTL sweep still deletes expired non-protected rows); shadow mode records `feedback_retention_learning` audit rows only; active mode without evidence fails closed; active mode with evidence applies bounded `delete`, `extend`, or `protect` decisions; disabling stops feedback-driven mutations.
- Desired user-visible outcome: The operator can prove shadow-first retention learning does not mutate retention state until all gates are satisfied.
- Pass/fail: PASS only when all safety gates are observed and disabling returns the reducer to inert behavior.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate SPECKIT_FEEDBACK_RETENTION_LEARNING and SPECKIT_FEEDBACK_RETENTION_MODE across off, shadow, active, and disabled rollback steps.
```

### Commands

1. Create a sandbox DB fixture with feedback aggregates that should produce one `protect`, one `extend`, and one `delete` decision.
2. Unset both vars: `unset SPECKIT_FEEDBACK_RETENTION_LEARNING SPECKIT_FEEDBACK_RETENTION_MODE`; restart the daemon or reducer process.
3. Run the reducer and capture zero feedback-driven retention mutations and no `feedback_retention_learning` audit rows; the baseline TTL sweep still deletes expired non-protected rows, so expect baseline deletion of any expired fixture rows.
4. Enable shadow: `export SPECKIT_FEEDBACK_RETENTION_LEARNING=true`; `export SPECKIT_FEEDBACK_RETENTION_MODE=shadow`; restart.
5. Run the reducer and inspect `governance_audit` for `feedback_retention_learning` rows. Verify retention fields are unchanged.
6. Switch to active without evidence: `export SPECKIT_FEEDBACK_RETENTION_MODE=active`; restart, run the reducer without shadow-evaluation evidence, and capture the fail-closed response.
7. Provide the required shadow-evaluation evidence input, rerun active mode, and inspect only the expected bounded retention changes.
8. Disable the master flag, restart, rerun the reducer, and verify no further retention rows change.

### Expected

- Off mode writes no feedback-driven audit or retention state; the baseline TTL sweep still deletes expired non-protected rows.
- Shadow mode writes audit decisions only.
- Active mode without evidence refuses to mutate.
- Active mode with evidence applies bounded retention decisions matching the fixture.
- Disabled rollback prevents additional mutations.

### Evidence

Fixture summary, env state per run, reducer output, `governance_audit` rows, retention before/after table, and disabled rollback transcript.

### Pass / Fail

- **Pass**: shadow mode is audit-only, active mode is evidence-gated, and disabled mode is inert.
- **Fail**: shadow changes retention state, active mode mutates without evidence, or disabled mode still runs the reducer.

### Failure Triage

Inspect `lib/feedback/feedback-retention-reducer.ts`, `lib/feedback/edge-tier-basement.ts`, and `tests/feedback-retention-reducer.vitest.ts`. Confirm the fixture produces decisions before treating a no-op as failure.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `19--feature-flag-reference/feedback-retention-learning-modes.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/feedback/feedback-retention-reducer.ts` | Retention reducer implementation |
| `mcp_server/lib/feedback/edge-tier-basement.ts` | Retention safety helper |
| `mcp_server/tests/feedback-retention-reducer.vitest.ts` | Reducer mode regression coverage |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 443
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/feedback-retention-learning-modes.md`
