---
title: "DV-008 -- SWE-1.6 (default — context gathering / tool use / simple-medium tasks)"
description: "This scenario validates that --model swe-1.6 is the documented skill default and is the right shape for context gathering, tool use, and simple-to-medium well-defined code tasks."
---

# DV-008 -- SWE-1.6 (default — context gathering / tool use / simple-medium tasks)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-008`.

---

## 1. OVERVIEW

This scenario validates `--model swe-1.6` for `DV-008`. SWE-1.6 is Cognition's coding-specialized model and the documented cli-devin default — the right pick for **context gathering**, **tool use**, and **simple-to-medium code tasks that are clearly defined beforehand**.

### Why This Matters

SWE-1.6 is the load-bearing default and is sized for the fastest-feedback Devin work: read the codebase, run a tool, write a small clearly-scoped function. SKILL.md §3 names it as the zero-input model. If SWE-1.6 weren't available on the operator's install, every default dispatch in the family pattern would fall through to either an error or a silent substitution — both of which the cli-devin RULES forbid.

**v1.0.2.0 — SWE-1.6 Prompt-Quality Contract**: As of v1.0.2.0, every production `--model swe-1.6` dispatch MUST be composed through `sk-prompt` (STAR / RCAF / BUILD framework + CLEAR 5-check) AND include an explicit `<pre-plan>` block (ordered steps + per-step acceptance criteria + stop conditions + verification approach). See `assets/prompt_templates.md` §2 for the canonical pre-planned template and SKILL.md ALWAYS rule #12. This scenario tests SWE-1.6's binary surface accessibility with a deliberately minimal prompt; for real-world coding work, the operator MUST use the pre-planned template — skipping it is the single largest cause of underwhelming SWE-1.6 output. If pre-planning reveals the task is more complex than SWE-1.6's clearly-defined zone, escalate to `--model deepseek-v4` rather than throw freeform prompt at SWE-1.6.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `--model swe-1.6` is accepted and that Devin produces a coherent result on a clearly-scoped task (one file, well-defined acceptance criteria).
- Real user request: `Write a small utility for me — clearly defined, single file. Use Devin's default coding model.`
- Prompt: `Dispatch a single-file, clearly-scoped utility-generation task with --model swe-1.6 --permission-mode auto and confirm Devin produces a working implementation in one pass.`
- Expected execution process: Operator picks a small, well-defined target (single TypeScript utility function with explicit signature and acceptance criteria) -> dispatches Devin -> confirms the output matches the signature and passes a basic correctness check.
- Expected signals: `devin` exits 0. Stdout shows a function matching the requested signature. The output references the expected behavior. Dispatched command line includes `--model swe-1.6`.
- Desired user-visible outcome: A working utility function that the operator can drop in without further reasoning iteration.
- Pass/fail: PASS if exit 0 AND output contains a function matching the signature AND dispatch line includes `--model swe-1.6`. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a clearly-scoped task: "TypeScript `debounce(fn, ms)` function with full type annotations and JSDoc."
2. Compose the prompt file with explicit signature and acceptance criteria.
3. Dispatch with `--model swe-1.6 --permission-mode auto`.
4. Inspect the output for the function signature and basic correctness signals.
5. Return a PASS/FAIL verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-008 | SWE-1.6 (default — context gathering / tool use / simple-medium tasks) | Verify SWE-1.6 is accepted and produces a working result on a clearly-scoped single-file task | `Dispatch a single-file, clearly-scoped utility-generation task with --model swe-1.6 --permission-mode auto and confirm Devin produces a working implementation in one pass.` | 1. `bash: printf 'Generate a TypeScript debounce(fn: (...args: unknown[]) => void, ms: number) function. Return the wrapped function. Include JSDoc with one usage example. Output the function file only — no explanation.\n' > /tmp/dv-008-prompt.md` -> 2. `devin --prompt-file /tmp/dv-008-prompt.md --model swe-1.6 --permission-mode auto > /tmp/dv-008-output.ts 2>&1 </dev/null; echo "Exit: $?"` -> 3. `bash: grep -E "function debounce\|debounce\(" /tmp/dv-008-output.ts` -> 4. `bash: head -30 /tmp/dv-008-output.ts` | Step 2: exit 0; Step 3: `debounce` reference present; Step 4: function signature visible with type annotations | Prompt file, dispatch log, function file, terminal transcript | PASS if exit 0 AND output contains debounce function AND dispatch line includes `--model swe-1.6`; FAIL otherwise | (1) Verify `--model swe-1.6` is in `devin --help`; (2) re-dispatch foreground to see live agent-loop steps; (3) if the task feels too complex for one pass, scale back to a simpler signature |

### Optional Supplemental Checks

- Compile the captured output with `npx tsc --noEmit` to confirm type validity.
- Run a 2nd well-defined task (e.g. `clamp(n, min, max)`) and confirm SWE-1.6 handles it equally cleanly.
- Compare iteration counts vs DV-009 (DeepSeek v4) on the same prompt — SWE-1.6 should be faster on simple work.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 Model Selection) | Documents SWE-1.6 as default |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation + §3 Model Selection (SWE-1.6 row) |
| `../../references/devin_tools.md` (§1.2 Four-Model Preset) | Cross-CLI capability comparison |
| `../../references/agent_delegation.md` (§3 Routing Matrix) | SWE-1.6 task-type mapping |

---

## 5. SOURCE METADATA

- Group: Model Presets
- Playbook ID: DV-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--model-presets/008-swe-1-6-default.md`
