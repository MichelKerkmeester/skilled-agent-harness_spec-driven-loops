---
title: "275 -- Council graph convergence edge cases"
description: "Validates council_graph_convergence handles empty or insufficient graph evidence without crashing."
audited_post_017: true
---

# 275 -- Council graph convergence edge cases

## 1. OVERVIEW

This scenario covers the council graph convergence edge path separately from basic graph reads.

---

## 2. SCENARIO CONTRACT

- Objective: Validate convergence blocker reporting on sparse graph data.
- Real user request: `Check council_graph_convergence on a sparse validation graph and report whether blockers are explicit.`
- RCAF Prompt: `Run council_graph_convergence for a sparse validation scope and verify it returns blockers or insufficient-evidence guidance.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Sparse input returns explicit blocker/insufficient-evidence output. - No unhandled exception appears. - Output includes enough detail for a council operator to decide the next action.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run council_graph_convergence for a sparse validation scope and verify it returns blockers or insufficient-evidence guidance.
```

### Commands

1. `council_graph_convergence({ scope: "playbook-017-empty-or-sparse" })`
2. Inspect convergence score, blocker list, and insufficient-evidence fields.
3. Confirm no mutation is required for the edge check.

### Expected Output / Verification

- Sparse input returns explicit blocker/insufficient-evidence output.
- No unhandled exception appears.
- Output includes enough detail for a council operator to decide the next action.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts`

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 275
- Tool: `council_graph_convergence`
