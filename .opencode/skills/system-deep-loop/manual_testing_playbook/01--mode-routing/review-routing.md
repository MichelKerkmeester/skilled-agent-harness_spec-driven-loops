---
title: "MR-002: Review Mode Routing"
description: "Verify an iterative review request resolves to the review mode through the deep-loop-workflows hub."
version: "1.1.0.0"
---

# MR-002: Review Mode Routing

## 1. OVERVIEW

This scenario verifies that an iterative review request resolves to `workflowMode: review` and produces the review route with P0/P1/P2 finding expectations.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants a fresh iterative audit of risky code changes, ordered by severity.

**Exact prompt**:
```
Run a deep review of the current routing changes, iterate until findings converge, and report P0/P1/P2 issues with a verdict.
```

**Expected route**:
- Mode: `review`
- Command: `/deep:review`
- Agent: `deep-review`
- Backend: `runtime-loop-type`
- Runtime loop type: `review`
- Packet: `deep-review`
- Artifact root: `review/`

**Why this route is expected**:
- Registry fields: `workflowMode: "review"`, `runtimeLoopType: "review"`, `backendKind: "runtime-loop-type"`, `command: "/deep:review"`, `agent: "deep-review"`, `artifactRoot: "review/"`.
- Alias evidence: `aliases` includes `"deep-review"`, `"review loop"`, `"iterative review loop"`, `"severity weighted findings"`, `"convergence review"`, and `"release-readiness"`.
- Advisor evidence: `advisorRouting.routingClass: "lexical"` and `advisorRouting.legacyAdvisorId: "deep-review"`.

**Desired user-visible outcome**: The AI invokes or describes the `review` lane, names `/deep:review`, `deep-review`, `runtime-loop-type`, and `review/`, and frames output as severity-weighted findings plus verdict.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/deep-loop-workflows/SKILL.md` is readable.
2. `.opencode/skills/deep-loop-workflows/mode-registry.json` contains the `review` mode entry.
3. Skill advisor is callable if the operator chooses an advisor probe.

### Exact Command Sequence

1. **Advisor probe**:
   ```bash
   python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Run a deep review of the current routing changes, iterate until findings converge, and report P0/P1/P2 issues with a verdict." --threshold 0.8 > /tmp/dlw-MR-002/advisor.txt
   ```
2. **Invoke hub**: `Skill(deep-loop-workflows, "Run a deep review of the current routing changes, iterate until findings converge, and report P0/P1/P2 issues with a verdict.")`.
3. **Capture route**: save the AI response to `/tmp/dlw-MR-002/response.txt`.
4. **Compare to registry**: confirm the response matches the `review` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor top skill is `deep-loop-workflows` or the transcript shows the legacy review identity folding into the hub. |
| 2 | Hub selects `workflowMode: review`. |
| 3 | Response names `/deep:review`, agent `deep-review`, backend `runtime-loop-type`, and artifact root `review/`. |
| 4 | Response does not route to `research` solely because the word "iterate" appears. |

### Pass/Fail Criteria

- **PASS** iff the selected mode is `review` and all expected route fields match the registry.
- **PARTIAL** iff `review` is selected but the response omits one non-routing field such as `artifactRoot`.
- **FAIL** iff any non-review mode is selected, the command is not `/deep:review`, or the backend is not `runtime-loop-type`.

### Failure Triage

1. If advisor does not surface the hub, inspect `advisorRouting.routingClass: "lexical"` and `legacyAdvisorId: "deep-review"` in the registry.
2. If the hub picks research, verify the prompt's audit and severity words are preserved.
3. If the agent is wrong, compare the response against `agent: "deep-review"` in the registry.

## 4. SOURCE FILES

- `.opencode/skills/deep-loop-workflows/SKILL.md` - hub routing rule and mode table.
- `.opencode/skills/deep-loop-workflows/mode-registry.json` - `review` mode source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-MR-002/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
