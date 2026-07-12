---
title: "AI-004: No False Fire on Plain Code Edit"
description: "Verify a plain code-edit prompt routes to sk-code and not to the system-deep-loop hub."
version: "1.1.0.0"
---

# AI-004: No False Fire on Plain Code Edit

## 1. OVERVIEW

This scenario verifies that the deep-loop hub does not capture ordinary implementation work. A plain code-edit prompt should route to `sk-code`, not to `system-deep-loop`.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer asks for a targeted code change with no iterative research, review, council, benchmark, or improvement-loop intent.

**Exact prompt**:
```
Update the TypeScript helper that formats CLI output so it trims trailing blank lines and run the relevant tests.
```

**Expected route**:
- Expected top-level skill: `sk-code`
- Expected deep-loop mode: none
- Expected deep-loop command: none
- Expected deep-loop agent: none
- Expected deep-loop backend: none
- Expected deep-loop artifact root: none

**Why this route is expected**:
- Hub source: system-deep-loop is for active deep-loop workflows, not single quick read/edit work.
- Hub source: When NOT to Use includes `A single quick read/edit (no loop) - use the relevant code or doc skill directly.`
- Registry evidence: every deep-loop mode requires a matching `workflowMode` such as `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, or `ai-system-improvement`; the prompt does not express any of those controls.

**Desired user-visible outcome**: The advisor or orchestrator routes the prompt to `sk-code` and does not load or invoke the deep-loop hub.

## 3. TEST EXECUTION

### Preconditions

1. The `sk-code` skill is registered in the same runtime.
2. `.opencode/skills/system-deep-loop/SKILL.md` contains the When NOT to Use rule.
3. Skill advisor is callable.

### Exact Command Sequence

1. **Advisor probe**:
   ```bash
   python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Update the TypeScript helper that formats CLI output so it trims trailing blank lines and run the relevant tests." --threshold 0.8 > /tmp/dlw-AI-004/advisor.txt
   ```
2. **Inspect top skill**: save parsed result to `/tmp/dlw-AI-004/parsed.txt`.
3. **Invoke orchestrator** with the exact prompt and capture which skill is loaded.
4. **Confirm no deep-loop route**: save response to `/tmp/dlw-AI-004/response.txt`.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor top skill is `sk-code`, not `system-deep-loop`. |
| 3 | Orchestrator uses code-work routing. |
| 4 | No `workflowMode`, `/deep:*` command, deep-loop agent, backend, or artifact root is selected. |

### Pass/Fail Criteria

- **PASS** iff the prompt routes to `sk-code` and deep-loop remains inactive.
- **PARTIAL** iff advisor is unavailable but the orchestrator response clearly chooses code-work routing and does not invoke deep-loop.
- **FAIL** iff `system-deep-loop` wins, a deep-loop mode is selected, or the AI starts a loop for the plain code edit.

### Failure Triage

1. If deep-loop fires, check whether the prompt accidentally contains `deep`, `loop`, `research`, `review`, `council`, `benchmark`, or `improvement` trigger language.
2. If `sk-code` does not win, inspect the advisor output for the competing top skill before changing any routing assets.
3. If the orchestrator starts a loop, re-read the hub's When NOT to Use rule for single quick read/edit work.

## 4. SOURCE FILES

- `.opencode/skills/system-deep-loop/SKILL.md` - When NOT to Use and hub scope.
- `.opencode/skills/system-deep-loop/mode-registry.json` - finite list of deep-loop modes.

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Sandbox**: `/tmp/dlw-AI-004/`
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
