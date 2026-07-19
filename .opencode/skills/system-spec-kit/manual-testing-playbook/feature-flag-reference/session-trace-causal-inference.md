---
title: "442 -- Session-Trace Causal Inference"
description: "Manual check that session-trace causal inference is default-off, deferred-only when enabled, and creates only weak auto-session edges from same-session feedback traces."
version: 3.6.0.1
id: feature-flag-reference-session-trace-causal-inference
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 442 -- Session-Trace Causal Inference

## 1. OVERVIEW

This scenario validates the session-trace causal reducer gate. The reducer is not a live retrieval side effect. It runs only when enabled in deferred maintenance or dry-run mode and derives weak `auto-session` edges from same-session feedback traces.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm default-off and deferred-only causal inference behavior.
- Real user request: `Validate that session trace causal inference only runs when enabled and never mutates edges during ordinary searches.`
- Prompt: `Validate SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE with disabled, dry-run, enabled deferred, and disabled rollback steps.`
- Expected execution process: Seed same-session feedback traces in a sandbox, verify disabled reducer returns no writes, enable the flag, run dry-run to inspect candidates, run deferred apply, inspect created weak edges, then disable and verify no new candidates are applied.
- Expected signals: Disabled mode creates zero edges; dry-run returns candidates and skip reasons; enabled deferred apply inserts at most five weak `auto-session` edges using same-session traces; ordinary retrieval calls do not invoke the reducer.
- Desired user-visible outcome: The operator can state the reducer is deferred, bounded, and opt-in.
- Pass/fail: PASS only when disabled mode is inert, enabled dry-run is inspectable, apply is bounded, and disabling restores inert behavior.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE with disabled, dry-run, enabled deferred, and disabled rollback steps.
```

### Commands

1. Create or use a sandbox DB with at least three memories and feedback traces sharing one `sessionId` and query context.
2. Unset the flag: `unset SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE`; restart the daemon or handler process.
3. Run the reducer entry through the maintenance harness or focused vitest in disabled mode and capture that zero edges are inserted.
4. Run `memory_search({ query: "session causal probe", sessionId: "playbook-442", includeTrace: true })` and verify no causal reducer side effect occurs during retrieval.
5. Enable the flag: `export SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=true`; restart the daemon or reducer process.
6. Run the reducer in dry-run mode and capture candidate source IDs, target ID, skip reasons, and the bounded candidate count.
7. Run the reducer in deferred apply mode and inspect `causal_edges` or `memory_drift_why({ memoryId: "<target>", relations: ["supports"], direction: "incoming" })` for weak `auto-session` edges.
8. Disable the flag, restart, repeat the reducer apply, and verify no additional edges are created.

### Expected

- Disabled runs insert zero edges.
- Dry-run returns candidates without writes.
- Enabled deferred apply inserts no more than five weak same-session edges.
- Retrieval calls do not run the reducer as a request-time side effect.
- Disabled rollback creates no additional edges.

### Evidence

Seed fixture description, disabled and enabled reducer output, edge-count before/after table, dry-run candidate payload, and retrieval transcript proving no request-time mutation.

### Pass / Fail

- **Pass**: reducer is disabled by default, dry-run-only until deferred apply, bounded when enabled, and inert again after disabling.
- **Fail**: retrieval creates edges, disabled mode writes, dry-run mutates state, or enabled apply exceeds the documented bound.

### Failure Triage

Inspect `lib/feedback/session-trace-causal-reducer.ts`, `tests/session-trace-causal-reducer.vitest.ts`, and causal-edge insertion provenance. Verify the fixture contains same-session traces before judging empty candidates.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-flag-reference/session-trace-causal-inference.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp-server/lib/feedback/session-trace-causal-reducer.ts` | Deferred causal reducer |
| `mcp-server/tests/session-trace-causal-reducer.vitest.ts` | Reducer regression coverage |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 442
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `feature-flag-reference/session-trace-causal-inference.md`
