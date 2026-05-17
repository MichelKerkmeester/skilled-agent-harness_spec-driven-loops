---
title: "277 -- Deep-loop graph convergence edge cases"
description: "Validates deep_loop_graph_convergence returns blockers for sparse iteration evidence."
audited_post_017: true
---

# 277 -- Deep-loop graph convergence edge cases

## 1. OVERVIEW

This scenario tests convergence reporting when the deep-loop graph has too little evidence to declare completion.

---

## 2. SCENARIO CONTRACT

- Objective: Validate convergence edge handling for deep-loop graph.
- Real user request: `Check deep_loop_graph_convergence on sparse validation state and report explicit blockers.`
- RCAF Prompt: `Run deep_loop_graph_convergence for a sparse validation scope and verify blocker output.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Sparse input returns blockers or insufficient-evidence guidance. - No unhandled exception appears. - Output identifies what evidence would unblock convergence.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run deep_loop_graph_convergence for a sparse validation scope and verify blocker output.
```

### Commands

1. `deep_loop_graph_convergence({ scope: "playbook-017-empty-or-sparse" })`
2. Inspect convergence score, missing-dimension details, and next-action guidance.

### Expected Output / Verification

- Sparse input returns blockers or insufficient-evidence guidance.
- No unhandled exception appears.
- Output identifies what evidence would unblock convergence.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 277
- Tool: `deep_loop_graph_convergence`
