---
title: "DV-028 -- SWE-1.6 dispatch via sk-prompt-small-model + sk-prompt (triple-skill flow)"
description: "Verifies the canonical three-skill happy-path for SWE-1.6 work: sk-prompt-small-model surfaces via the advisor, sk-prompt composes a CLEAR-passing RCAF prompt with the required pre-plan block, and cli-devin dispatches the result with --model swe-1.6."
---

# DV-028 -- SWE-1.6 dispatch via sk-prompt-small-model + sk-prompt (triple-skill flow)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-028`.

---

## 1. OVERVIEW

This scenario validates that the small-model dispatch matrix wires `sk-prompt-small-model` to the advisor's high-confidence lanes, that `sk-prompt` composes a CLEAR-passing prompt with the SWE-1.6 pre-plan block, and that `cli-devin --model swe-1.6` runs the resulting prompt end-to-end. Every SWE-1.6 dispatch in production is expected to follow this path — the three skills must compose correctly.

### Why This Matters

SWE-1.6 dispatches that skip `sk-prompt` are the single largest cause of underwhelming output (SKILL.md §3 ALWAYS rule #12). `sk-prompt-small-model` is the discovery anchor that makes the pattern findable when an operator mentions a model name. If any one of the three skills fails to engage, the dispatch degrades to a freeform prompt the model is not optimized for. This scenario is the integration test that proves the wiring works.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DV-028` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `sk-prompt-small-model`, `sk-prompt`, and `cli-devin` engage correctly on a SWE-1.6 dispatch.
- Real user request: `Use SWE-1.6 to write me a debounce utility — clearly defined.`
- Prompt: `Run the skill advisor on "dispatch SWE-1.6 to write a debounce utility" and confirm sk-prompt-small-model + cli-devin both surface above the 0.8 threshold. Compose the actual dispatch through sk-prompt with RCAF + a 3-step pre-plan block, then run cli-devin with --model swe-1.6 --permission-mode auto and capture the output.`
- Expected execution process: Advisor surfaces sk-prompt-small-model + cli-devin -> sk-prompt composes RCAF + pre-plan -> devin dispatches the composed prompt with `--model swe-1.6` -> output captured.
- Expected signals: Advisor confidence ≥ 0.85 for sk-prompt-small-model AND ≥ 0.80 for cli-devin. Composed prompt contains `<pre-plan>` block with ≥ 3 ordered steps. `devin` exits 0. Stdout contains a working debounce function.
- Desired user-visible outcome: A working debounce function plus an evidence trail showing each of the three skills was consulted and contributed.
- Pass/fail: PASS if advisor surfaces both skills above threshold AND prompt has pre-plan block AND `devin` exits 0 AND output contains a debounce function. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the advisor smoke test: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "dispatch SWE-1.6 to write a debounce utility"` and confirm `sk-prompt-small-model` and `cli-devin` both appear above 0.8.
2. Open `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/cli-devin/assets/prompt_templates.md` (§2 SWE-1.6 pre-plan template).
3. Compose the RCAF prompt with explicit Role / Context / Action / Format + a 3-step pre-plan block + acceptance criteria.
4. Dispatch with `devin --prompt-file /tmp/dv-028-prompt.md --model swe-1.6 --permission-mode auto`.
5. Verify the function in the output meets the signature.
6. Return PASS/FAIL.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-028 | SWE-1.6 dispatch via sk-prompt-small-model + sk-prompt | Verify the triple-skill integration produces a working SWE-1.6 dispatch | `Run the skill advisor on "dispatch SWE-1.6 to write a debounce utility" and confirm sk-prompt-small-model + cli-devin both surface above the 0.8 threshold. Compose the actual dispatch through sk-prompt with RCAF + a 3-step pre-plan block, then run cli-devin with --model swe-1.6 --permission-mode auto.` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "dispatch SWE-1.6 to write a debounce utility" \| jq -r '.[:3][] \| "\(.skill) \(.confidence)"'` -> 2. compose `/tmp/dv-028-prompt.md` with RCAF + `<pre-plan>` block + signature: `function debounce(fn: (...args: unknown[]) => void, ms: number)` -> 3. `bash: devin --prompt-file /tmp/dv-028-prompt.md --model swe-1.6 --permission-mode auto > /tmp/dv-028-output.ts 2>&1 </dev/null; echo "Exit: $?"` -> 4. `bash: grep -E "function debounce\|debounce\(" /tmp/dv-028-output.ts` | Step 1: sk-prompt-small-model conf ≥ 0.85, cli-devin ≥ 0.80; Step 2: prompt contains `<pre-plan>`; Step 3: exit 0; Step 4: debounce reference present | Advisor output, prompt file, dispatch log, output file | PASS if all 4 conditions met; FAIL otherwise | (1) If advisor confidence low: rebuild graph via `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty`; (2) if pre-plan missing: re-read sk-prompt SKILL.md §3 and cli-devin assets/prompt_templates.md §2; (3) if devin fails: bisect by running each step separately |

### Optional Supplemental Checks

- Compile the captured output with `npx tsc --noEmit` to confirm type validity.
- Repeat the advisor smoke test with prompt variants ("use Devin's SWE-1.6 for a utility", "small-model debounce"). All variants must keep sk-prompt-small-model in the top 2.
- Read `.opencode/skills/sk-prompt-small-model/references/pattern-index.md` and confirm the SWE-1.6 pattern row points at `cli-devin/references/context-budget.md`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../sk-prompt-small-model/SKILL.md` | Sentinel skill body + activation triggers |
| `../../../sk-prompt-small-model/references/pattern-index.md` | Pattern-to-canonical-location map |
| `../../../sk-prompt/SKILL.md` | DEPTH thinking + CLEAR scoring contract |
| `../../assets/prompt_templates.md` | §2 SWE-1.6 pre-plan template |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 SWE-1.6 Prompt-Quality Contract + ALWAYS rule #12 |
| `../../../system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Advisor scorer entry point |
| `../../../system-skill-advisor/mcp_server/scripts/skill-graph.json` | Compiled skill graph with enhances edges |
| `../../../sk-prompt-small-model/assets/model-profiles.json` | swe-1.6 entry: cognition-free pool, single executor path |

---

## 5. SOURCE METADATA

- Group: Model Presets
- Playbook ID: DV-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--model-presets/012-swe16-via-sk-prompt-small-model-and-sk-prompt.md`
