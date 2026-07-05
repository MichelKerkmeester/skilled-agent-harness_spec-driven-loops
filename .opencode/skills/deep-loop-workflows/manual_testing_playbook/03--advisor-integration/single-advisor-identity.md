---
title: "AI-001: Single Advisor Identity"
description: "Verify positive deep-loop controls surface deep-loop-workflows as the parent hub identity instead of separate discoverable child skills."
version: "1.1.0.0"
---

# AI-001: Single Advisor Identity

## 1. OVERVIEW

This scenario verifies the hub identity rule: positive deep-loop prompts should surface `deep-loop-workflows` as the public advisor-routable identity, with the hub then resolving the mode through the registry.

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator checks that the advisor treats the deep-loop family as one hub, while still preserving mode-level routing inside the hub.

**Exact prompt set**:
```
Use deep research to investigate registry drift and write a research summary.
Run a deep review and report P0/P1/P2 findings with a verdict.
Run an AI council deliberation with multiple planning seats and converge on a recommendation.
Evaluate and score an agent candidate for promotion or rollback.
```

**Expected route**:
- Public advisor identity: `deep-loop-workflows`
- Resolved modes: `research`, `review`, `ai-council`, `agent-improvement`
- Commands: `/deep:research`, `/deep:review`, `/deep:ai-council`, `/deep:agent-improvement`
- Agents: `deep-research`, `deep-review`, `ai-council`, `deep-improvement`

**Why this route is expected**:
- Hub source: the hub says `deep-loop-workflows` is the public, advisor-routable home for active deep-loop personas.
- Hub source: the advisor routes any deep-loop query to the single identity `deep-loop-workflows`; the hub then picks the mode.
- Registry evidence: the four tested modes contain `advisorRouting.routingClass` values `"lexical"`, `"lexical"`, `"lexical"`, and `"alias-fold"` respectively.
- Registry evidence: the commands and agents are `"/deep:research"` with `"deep-research"`, `"/deep:review"` with `"deep-review"`, `"/deep:ai-council"` with `"ai-council"`, and `"/deep:agent-improvement"` with `"deep-improvement"`.

**Desired user-visible outcome**: The AI reports one public skill identity and four mode-level routes, rather than treating nested mode packets as separate advisor skills.

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/deep-loop-workflows/SKILL.md` states the single advisor identity rule.
2. `.opencode/skills/deep-loop-workflows/mode-registry.json` contains the four tested mode entries.
3. Skill advisor is callable.

### Exact Command Sequence

1. **Run advisor probes**: run the skill advisor once for each prompt and append output to `/tmp/dlw-AI-001/advisor.jsonl`.
2. **Invoke hub**: invoke `Skill(deep-loop-workflows, "<prompt>")` once for each prompt.
3. **Capture routes**: save mode-level responses to `/tmp/dlw-AI-001/routes.txt`.
4. **Compare to registry**: confirm each response matches the expected mode entry.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor output surfaces `deep-loop-workflows` or a documented legacy identity folded into the hub. |
| 2 | Hub resolves exactly one primary `workflowMode` per prompt. |
| 3 | No child packet advertises itself as a separate public advisor identity. |
| 4 | Each command and agent pair matches `mode-registry.json`. |

### Pass/Fail Criteria

- **PASS** iff one public advisor identity is observed and all four resolved modes match the registry.
- **PARTIAL** iff routing is correct but advisor output exposes a legacy identity in addition to the hub and the transcript clearly folds it back to `deep-loop-workflows`.
- **FAIL** iff a child packet is treated as an independent public skill identity, a prompt resolves to multiple modes, or a route contradicts the registry.

### Failure Triage

1. If a child identity appears standalone, re-read the hub statement that exactly one advisor identity is preserved.
2. If a prompt resolves to multiple modes, inspect dominant-intent selection in the hub routing rule.
3. If route fields drift, compare each observed mode to the matching `modes[]` entry.

## 4. SOURCE FILES

- `.opencode/skills/deep-loop-workflows/SKILL.md` - public advisor identity and hub routing rule.
- `.opencode/skills/deep-loop-workflows/mode-registry.json` - advisor routing projection and mode fields.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-AI-001/`
- **Concurrent-safe**: Yes, with advisor probe cap
- **Last validated**: pending first manual run
