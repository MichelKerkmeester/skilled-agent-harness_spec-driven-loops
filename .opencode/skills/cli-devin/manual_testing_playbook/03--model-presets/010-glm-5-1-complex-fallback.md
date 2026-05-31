---
title: "DV-010 -- GLM 5.1 (complex-task fallback — agentic / tool-use)"
description: "This scenario validates that --model glm-5.1 works as the documented complex-task fallback for agentic / tool-use heavy work when DeepSeek v4 doesn't fit."
---

# DV-010 -- GLM 5.1 (complex-task fallback — agentic / tool-use)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-010`.

---

## 1. OVERVIEW

This scenario validates `--model glm-5.1` for `DV-010`. GLM 5.1 is one of two documented **complex-task fallbacks** in cli-devin's four-model preset — the right pick when DeepSeek v4 doesn't fit a complex task and the work is heavy on **agentic / tool-use** patterns (MCP chains, structured multi-step planning, tool orchestration).

### Why This Matters

The cli-devin Routing Matrix designates GLM 5.1 as a complex-task fallback alongside Kimi k2.6. Operators need empirical evidence that GLM 5.1 is reachable and produces coherent output on agentic-shape work — otherwise the fallback recommendation has no operational basis.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `--model glm-5.1` is accepted and produces coherent output on an agentic / tool-use complex task (one that would benefit from structured multi-step planning rather than deep single-stream reasoning).
- Real user request: `DeepSeek v4 didn't fit this task — it's heavy on MCP / tool chaining. Try GLM 5.1.`
- Prompt: `Dispatch a complex agentic / MCP-heavy task with --model glm-5.1 --permission-mode auto and confirm GLM 5.1 produces a coherent multi-step plan.`
- Expected execution process: Operator picks an agentic task (e.g. "use the X MCP server to enumerate Y, group by Z, produce a Markdown plan") -> dispatches with GLM 5.1 -> captures output -> verifies the output is a coherent multi-step plan.
- Expected signals: `devin` exits 0. Stdout contains a structured multi-step plan. Dispatched command line includes `--model glm-5.1`. The output references the tool / MCP server / structured grouping requested.
- Desired user-visible outcome: A working agentic plan that the operator can review and feed into a follow-up dispatch.
- Pass/fail: PASS if exit 0 AND output is a coherent multi-step plan AND dispatch line includes `--model glm-5.1`. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick an agentic task framed around tool chaining (e.g. "enumerate files in a folder, group by extension, propose a refactor plan per group").
2. Dispatch with `--model glm-5.1 --permission-mode auto`.
3. Capture the output.
4. Verify the output is a structured multi-step plan with the requested grouping.
5. Return a PASS/FAIL verdict naming the step count and grouping accuracy.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-010 | GLM 5.1 (complex-task fallback — agentic / tool-use) | Verify GLM 5.1 is accepted and produces a coherent multi-step plan on an agentic complex task | `Dispatch a complex agentic / MCP-heavy task with --model glm-5.1 --permission-mode auto and confirm GLM 5.1 produces a coherent multi-step plan.` | 1. `bash: printf 'Enumerate all .md files under .opencode/skills/cli-devin/. Group them by directory (root, references, assets, changelog, manual_testing_playbook). For each group, propose a documentation hygiene check (one specific check per group). Output a Markdown plan with one section per group. Do not modify any files.\n' > /tmp/dv-010-prompt.md` -> 2. `devin --prompt-file /tmp/dv-010-prompt.md --model glm-5.1 --permission-mode auto > /tmp/dv-010-output.md 2>&1 </dev/null; echo "Exit: $?"` -> 3. `bash: head -40 /tmp/dv-010-output.md` -> 4. `bash: grep -c '^## ' /tmp/dv-010-output.md` (count plan sections) | Step 2: exit 0; Step 3: structured Markdown with section headings; Step 4: at least 4 plan sections (one per directory group) | Prompt file, dispatch log, plan output, terminal transcript | PASS if exit 0 AND output is a coherent multi-step plan AND dispatch line includes `--model glm-5.1`; FAIL otherwise | (1) Verify `--model glm-5.1` is in `devin --help`; (2) compare against the same prompt under DeepSeek v4 (DV-009) — GLM 5.1 should show more structured agentic chaining; (3) confirm GLM model name hasn't rotated |

### Optional Supplemental Checks

- Try a real MCP-server-heavy prompt if a Devin-side MCP server is configured (e.g. linear, github, slack) — observe how GLM 5.1 orchestrates calls.
- Compare timings and structural quality against Kimi k2.6 (DV-026) on the same agentic task.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 Model Selection) | Documents GLM 5.1 row |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Model Selection (GLM 5.1 row) |
| `../../references/agent_delegation.md` (§3 Routing Matrix + §6 Example 3) | Routes agentic complex tasks to GLM 5.1 fallback |
| `../../references/devin_tools.md` (§3 When to pick cli-devin) | Cross-CLI fallback routing |

---

## 5. SOURCE METADATA

- Group: Model Presets
- Playbook ID: DV-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--model-presets/010-glm-5-1-complex-fallback.md`
