---
title: "DV-029 -- DeepSeek-v4-pro via cli-devin Cognition Pro through sk-ai-small-model + sk-prompt"
description: "Verifies the model-profile-driven executor selection for DeepSeek-v4-pro (one of three paths) and the sk-prompt composition pipeline for cli-devin Cognition Pro dispatch."
---

# DV-029 -- DeepSeek-v4-pro via cli-devin Cognition Pro through sk-ai-small-model + sk-prompt

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-029`.

---

## 1. OVERVIEW

DeepSeek-v4-pro has THREE dispatch paths declared in `sk-prompt/assets/model-profiles.json`: cli-devin via Cognition Pro, cli-opencode via DeepSeek API direct, and cli-opencode via opencode-go. This scenario validates the cli-devin Cognition Pro path: `sk-ai-small-model` exposes the dispatch matrix, the operator consciously picks the cli-devin path (vs the two cli-opencode alternatives), `sk-prompt` composes with the SWE-1.6-style contract (which also applies to deepseek-v4 + kimi-k2.6 per cli-devin SKILL.md §3), and `cli-devin --model deepseek-v4` runs the dispatch.

### Why This Matters

The dispatch matrix is the canonical contract for executor selection. If the operator doesn't consciously pick a path, the choice defaults silently — quota pool exhaustion in one channel can stall work that another channel could carry. This scenario proves the matrix is consulted and the rationale is captured. It also proves the bundle-gate-aversion finding from packet 113 (verbose constraint language degrades all three Pro-tier models, not just SWE-1.6) survives in the production playbook.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DV-029` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the three-skill flow on a complex DeepSeek-v4-pro task, with the executor choice grounded in `sk-prompt/assets/model-profiles.json`.
- Real user request: `Use DeepSeek-v4-pro for this multi-step refactor — through Devin, not opencode.`
- Prompt: `Consult sk-ai-small-model for the DeepSeek-v4-pro dispatch matrix and pick the cli-devin Cognition Pro path. Compose the prompt through sk-prompt with RCAF + medium pre-plan + standard bundle-gate per the cli-devin v1.0.6.x contract. Dispatch a complex multi-step task with --model deepseek-v4 --permission-mode auto.`
- Expected execution process: Read model-profiles.json deepseek-v4-pro entry -> pick cli-devin executor based on quota_pool + operator intent -> sk-prompt composes RCAF/BUILD with medium pre-plan + standard bundle-gate -> devin dispatches.
- Expected signals: Operator records executor-selection rationale citing the model-profiles.json deepseek-v4-pro entry. Composed prompt uses RCAF or BUILD with medium pre-plan density and standard (NOT strict) bundle-gate wording. `devin --model deepseek-v4` exits 0. Output addresses all acceptance criteria in the pre-plan.
- Desired user-visible outcome: A working implementation plus the matrix-consultation evidence trail.
- Pass/fail: PASS if rationale is documented AND prompt is medium-density + standard bundle-gate AND `devin --model deepseek-v4` exits 0 AND output meets acceptance criteria. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the advisor smoke test: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "DeepSeek-v4-pro complex refactor via Devin"` and confirm `sk-ai-small-model` + `cli-devin` both surface.
2. Read `.opencode/skills/sk-prompt/assets/model-profiles.json` deepseek-v4-pro entry. Document the three paths and why cli-devin/cognition-pro is chosen (operator preference, Pro plan quota available, no DeepSeek API key needed).
3. Pick a complex task: "refactor a 3-file class hierarchy to inject a dependency, preserving the public API + all tests passing."
4. Compose `/tmp/dv-029-prompt.md` via sk-prompt with RCAF or BUILD framework, medium pre-plan (3-4 ordered steps + acceptance criteria + verification steps), and standard bundle-gate wording.
5. Dispatch `devin --prompt-file /tmp/dv-029-prompt.md --model deepseek-v4 --permission-mode auto`.
6. Verify the output addresses the 3 acceptance criteria.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-029 | DeepSeek-v4-pro via cli-devin Cognition Pro through sk-ai-small-model + sk-prompt | Verify executor selection from the dispatch matrix and composition through sk-prompt for a complex DeepSeek-v4-pro dispatch | `Consult sk-ai-small-model for the DeepSeek-v4-pro dispatch matrix and pick the cli-devin Cognition Pro path. Compose the prompt through sk-prompt with RCAF + medium pre-plan + standard bundle-gate. Dispatch a complex multi-step task with --model deepseek-v4 --permission-mode auto.` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "DeepSeek-v4-pro complex refactor via Devin" \| jq -r '.[:3][] \| "\(.skill) \(.confidence)"'` -> 2. `bash: jq '.models[] \| select(.id == "deepseek-v4-pro") \| {executors, primary_quota_pool}' .opencode/skills/sk-prompt/assets/model-profiles.json` -> 3. compose `/tmp/dv-029-prompt.md` with RCAF/BUILD + medium pre-plan + standard bundle-gate -> 4. `bash: devin --prompt-file /tmp/dv-029-prompt.md --model deepseek-v4 --permission-mode auto > /tmp/dv-029-output.log 2>&1 </dev/null; echo "Exit: $?"` -> 5. inspect output | Step 1: sk-ai-small-model + cli-devin both above 0.85; Step 2: 3 executors visible, primary_quota_pool=cognition-pro; Step 3: prompt contains medium pre-plan (3-4 steps) + NOT "MUST" / "STRICT" / "BANNED" bundle-gate language; Step 4: exit 0 | Advisor output, model-profiles entry JSON, prompt file with composition rationale, dispatch log | PASS if executor rationale documented AND prompt is medium + standard bundle-gate AND devin exits 0 AND output addresses all pre-plan acceptance criteria; FAIL otherwise | (1) If advisor confidence low: rebuild graph; (2) if prompt is strict bundle-gate: re-read packet 113 finding in cli-devin SKILL.md §3 — "do NOT pair BUILD with strict bundle-gate"; (3) if devin fails with quota error: switch to one of the other 2 paths (DeepSeek API or opencode-go) per the matrix |

### Optional Supplemental Checks

- Repeat the dispatch with `--model deepseek-v4 --permission-mode dangerous` (after recording approval) to confirm the model accepts both modes.
- Compare prompt outcomes: same task with strict bundle-gate vs standard bundle-gate — strict should produce more defensive / conservative output per the packet 113 finding.
- Dispatch the same task via `cli-opencode --model deepseek/deepseek-v4-pro` (DeepSeek API direct) and `cli-opencode --model opencode-go/deepseek-v4-pro` to compare all three paths.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../sk-ai-small-model/SKILL.md` | Dispatch matrix table |
| `../../../sk-ai-small-model/references/pattern-index.md` | Pattern-to-canonical-location map |
| `../../../sk-prompt/assets/model-profiles.json` | deepseek-v4-pro entry: 3 executor paths |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 SWE-1.6 Prompt-Quality Contract (extended to deepseek-v4 + kimi-k2.6 per v1.0.6.x) |
| `../../../system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Advisor scorer entry point |
| `../../assets/prompt_templates.md` | Composition templates for Pro-tier models |

---

## 5. SOURCE METADATA

- Group: Model Presets
- Playbook ID: DV-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--model-presets/006-deepseek-v4-via-sk-ai-small-model-and-sk-prompt.md`
