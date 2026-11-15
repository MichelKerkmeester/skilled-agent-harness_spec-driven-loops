---
id: AI-002
category: advisor_integration
stage: routing
title: "AI-002: Lexical Mode Scoring"
description: "Verify research and review are lexically routed modes with legacy advisor ids preserved in the registry projection."
expected_intent: research
expected_workflow_mode: research
expected_leaf_resources: []
version: "1.2.1.0"
---

# AI-002: Lexical Mode Scoring

## 1. OVERVIEW

This scenario verifies that the two workflow families are lexically scored modes, as declared by `advisorRouting.routingClass: "lexical"`.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator runs a small advisor battery to confirm lexical routing remains intact for the two named mode families.

**Exact prompt**:
```
deep-research: run an iterative investigation workflow and summarize findings.
```

**Additional advisor probes** (each lexical mode family scored through its own `legacyAdvisorId`):
```
deep-review: run an iterative review loop and produce severity weighted findings.
```

**Expected route**:
- `deep-research` prompt resolves to mode `research`, command `/deep:research`, agent `deep-research`.
- `deep-review` prompt resolves to mode `review`, command `/deep:review`, agent `deep-review`.

**Why this route is expected**:
- `research` registry evidence: `advisorRouting.routingClass: "lexical"`, `legacyAdvisorId: "deep-research"`, and `aliases` includes `"deep-research"`.
- `review` registry evidence: `advisorRouting.routingClass: "lexical"`, `legacyAdvisorId: "deep-review"`, and `aliases` includes `"deep-review"`.

**Desired user-visible outcome**: The AI distinguishes lexical mode scoring from alias-fold and command-bridge behavior and resolves each prompt to the expected mode.

---

## 3. TEST EXECUTION

### Preconditions

1. `.skilled/skills/system-deep-loop/mode-registry.json` contains the `research` and `review` entries.
2. Skill advisor is callable.

### Prompt

- Prompt: `deep-research: run an iterative investigation workflow and summarize findings.`
- Additional probe: `deep-review: run an iterative review loop and produce severity weighted findings.`

### Exact Command Sequence

1. **Run advisor probes**: run the skill advisor once for each prompt and append output to `/tmp/dlw-AI-002/advisor.jsonl`.
2. **Invoke hub**: invoke `Skill(system-deep-loop, "<prompt>")` once for each prompt.
3. **Capture routes**: save responses to `/tmp/dlw-AI-002/routes.txt`.
4. **Compare to registry**: confirm each lexical mode maps to its expected command and agent.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Each prompt has lexical evidence through its `legacyAdvisorId`. |
| 2 | Hub selects `research` and `review` respectively. |
| 3 | Responses name the expected commands and agents. |

### Evidence

- Advisor probe log: `/tmp/dlw-AI-002/advisor.jsonl`.
- Route transcript: `/tmp/dlw-AI-002/routes.txt`, showing the resolved mode, command, and agent for each of the two prompts.

### Pass/Fail Criteria

- **PASS**: both lexical prompts resolve to the expected modes and route fields, whether or not the response also narrates the lexical-scoring mechanism.
- **FAIL**: any prompt resolves to the wrong lexical mode.

### Failure Triage

1. If research loses, inspect `legacyAdvisorId: "deep-research"`.
2. If review loses, inspect `legacyAdvisorId: "deep-review"`.

---

## 4. SOURCE FILES

- `.skilled/skills/system-deep-loop/SKILL.md` - hub routing rule.
- `.skilled/skills/system-deep-loop/mode-registry.json` - lexical advisor routing fields.
- [manual-testing-playbook.md](../manual-testing-playbook.md) - root directory page and scenario summary.

---

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-AI-002/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
