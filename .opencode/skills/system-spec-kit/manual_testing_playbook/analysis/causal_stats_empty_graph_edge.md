---
title: "027 -- Causal stats empty graph edge"
description: "Validates memory_causal_stats returns a structured zero-state when no causal links match."
audited_post_017: true
version: 3.6.0.2
id: analysis-causal-stats-empty-graph-edge
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 027 -- Causal stats empty graph edge

## 1. OVERVIEW

This scenario adds an edge fixture for causal statistics: empty scopes should be diagnosable.

---

## 2. SCENARIO CONTRACT

- Objective: Validate causal stats empty-scope handling.
- Real user request: `Run causal stats for an empty validation scope and prove the zero-state is structured.`
- RCAF Prompt: `Run memory_causal_stats with a scope that should match no links and verify zero-state output.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Response returns zero counts without crashing. - Relation/count fields are present and numeric. - Guidance for creating links is explicit when the graph is empty.
- Desired user-visible outcome: A concise PASS/FAIL/SKIP/UNAUTOMATABLE verdict with cited evidence (PARTIAL is an aggregate feature/packet state, not a per-scenario verdict).
- Pass/fail: PASS if all expected signals are present; FAIL if the tool errors unexpectedly, omits required evidence, or an edge signal is missing.

---

## 3. TEST EXECUTION

### Prompt

```
Run memory_causal_stats with a scope that should match no links and verify zero-state output.
```

### Commands

1. `memory_causal_stats({ scope: "playbook-017-empty-causal-scope" })`
2. Inspect total edge count, relation counts, and hints.
3. Confirm it recommends `memory_causal_link` for creating relationships when appropriate.

### Expected Output / Verification

- Response returns zero counts without crashing.
- Relation/count fields are present and numeric.
- Guidance for creating links is explicit when the graph is empty.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: 027
- Tool: `memory_causal_stats`
