---
title: "IL-004: AI System Improvement Command-Bridge Routing"
description: "Verify /deep:ai-system-improvement routes to the ai-system-improvement lane through command-bridge routing and the external-adapter backend."
version: "1.1.0.0"
---

# IL-004: AI System Improvement Command-Bridge Routing

## 1. OVERVIEW

This scenario verifies that the non-developer AI-system improvement lane is reached by its command bridge and resolves to the external adapter backend.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants to refine a packaged non-developer AI system with its external scoring loop.

**Exact prompt**:
```
/deep:ai-system-improvement Evaluate the packaged non-dev AI system, run its external scoring loop, and recommend safe refinements.
```

**Expected route**:
- Mode: `ai-system-improvement`
- Command: `/deep:ai-system-improvement`
- Agent: `deep-improvement`
- Backend: `external-adapter`
- Runtime loop type: `null`
- Loop host mode: `non-dev-ai-system-refine`
- Packet: `deep-improvement`
- Artifact root: `improvement/`

**Why this route is expected**:
- Registry fields: `workflowMode: "ai-system-improvement"`, `runtimeLoopType: null`, `backendKind: "external-adapter"`, `loopHostMode: "non-dev-ai-system-refine"`, `command: "/deep:ai-system-improvement"`, `agent: "deep-improvement"`, `artifactRoot: "improvement/"`.
- External owner evidence: `externalLoopOwner: "external packaging (e.g. Barter Copywriter) owns the Python loop, gates, scoring, and kill-switches"`.
- Alias evidence: `aliases` includes `"non-dev ai system"`, `"non-dev-ai-system"`, and `"package ai system benchmark"`.
- Advisor evidence: `advisorRouting.routingClass: "command-bridge"` and `advisorRouting.packetSkillName: "deep-improvement"`.

**Desired user-visible outcome**: The AI routes to `ai-system-improvement` through the command, names `external-adapter`, preserves null `runtimeLoopType`, and states that the external packaging owns the loop.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/deep-loop-workflows/mode-registry.json` contains the `ai-system-improvement` mode entry.
2. The orchestrator can accept `/deep:ai-system-improvement` command prompts.

### Exact Command Sequence

1. **Invoke command surface**: enter the exact prompt into the orchestrator runtime.
2. **Capture route**: save the AI response to `/tmp/dlw-IL-004/response.txt`.
3. **Compare to registry**: confirm the response matches the `ai-system-improvement` registry entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Command surface selects `/deep:ai-system-improvement`. |
| 2 | Route resolves to `workflowMode: ai-system-improvement`. |
| 2 | Response names backend `external-adapter`, loop host mode `non-dev-ai-system-refine`, and artifact root `improvement/`. |
| 3 | Response states or implies command-bridge behavior and external loop ownership. |

### Pass/Fail Criteria

- **PASS** iff `/deep:ai-system-improvement` resolves to `ai-system-improvement` with the expected registry fields.
- **PARTIAL** iff route is correct but external ownership is not explained.
- **FAIL** iff the lane fires from a bare advisor alias, routes to `agent-improvement`, uses `improvement-host`, or assigns a non-null runtime loop type.

### Failure Triage

1. If agent-improvement wins, verify the exact prompt includes `/deep:ai-system-improvement`.
2. If backend is wrong, re-read `backendKind: "external-adapter"`.
3. If external ownership is missing, check the registry's `externalLoopOwner` field.

## 4. SOURCE FILES

- `.opencode/skills/deep-loop-workflows/SKILL.md` - improvement family routing rule.
- `.opencode/skills/deep-loop-workflows/mode-registry.json` - `ai-system-improvement` source of truth.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No for this routing test
- **Sandbox**: `/tmp/dlw-IL-004/`
- **Concurrent-safe**: Run serially with other command-bridge tests
- **Last validated**: pending first manual run
