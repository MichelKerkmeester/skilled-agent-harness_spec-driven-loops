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
- Operator prompt: `Run memory_causal_stats with a scope that should match no links and verify zero-state output.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Response returns zero counts without crashing. - Relation/count fields are present and numeric. - Guidance for creating links is explicit when the graph is empty.
- Desired user-visible outcome: A concise PASS, FAIL, or SKIP verdict with cited evidence; use SKIP only when a required environment prerequisite is unavailable.
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

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the handler or script listed in section 4 is the one actually loaded, and that any compiled output under `dist/` is current for it.
3. Compare the observed response field by field against the Expected block, and quote the first field that disagrees.


### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- `.opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts`

---

## 5. SOURCE METADATA

- Group: Analysis
- Playbook ID: 027
- Tool: `memory_causal_stats`
