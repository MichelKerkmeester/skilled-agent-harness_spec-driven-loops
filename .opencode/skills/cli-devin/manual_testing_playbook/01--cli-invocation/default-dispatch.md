---
title: "DV-001 -- Default dispatch (swe-1.6 normal)"
description: "This scenario validates the canonical zero-input default dispatch (swe-1.6 + permission-mode auto) for `DV-001`. It focuses on confirming the documented skill default produces a working code-generation answer with exit code 0."
---

# DV-001 -- Default dispatch (swe-1.6 normal)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-001`.

---

## 1. OVERVIEW

This scenario validates the canonical zero-input default dispatch for `DV-001`. It focuses on confirming the documented skill default (`--model swe-1.6 --permission-mode auto`) produces a working code-generation answer with exit code 0 when dispatched non-interactively via `--prompt-file`.

### Why This Matters

The default invocation is the single most important contract in this skill. SKILL.md §3 mandates `--model swe-1.6 --permission-mode auto` as the zero-input baseline. If this baseline regresses, every other scenario built on top of it inherits the failure. This scenario is on the critical-path list (§5 of the root playbook).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DV-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify the documented zero-input default dispatch returns a usable code-generation answer with exit code 0.
- Real user request: `Generate a tiny TypeScript fizzbuzz function for me using whatever the cli-devin default is.`
- Prompt: `Generate a TypeScript fizzbuzz function with the documented cli-devin default and report model, permission mode, exit code, and PASS/FAIL.`
- Expected execution process: Operator confirms preconditions (devin installed, authenticated, non-Devin runtime) -> writes the prompt to /tmp/dv-001-prompt.md -> dispatches the documented default invocation via `--prompt-file` -> captures stdout to a temp file -> inspects the captured TypeScript for fizzbuzz semantics -> records the dispatched command line as evidence.
- Expected signals: `devin` exits 0. Stdout contains a TypeScript function named `fizzbuzz`. Output references `n`, `Fizz`, `Buzz` and `FizzBuzz` semantics. The dispatched command line includes `--model swe-1.6` and `--permission-mode auto`.
- Desired user-visible outcome: A working `fizzbuzz` function with operator-readable evidence that the documented default invocation pattern was used verbatim.
- Pass/fail: PASS if exit code is 0 AND the TypeScript output contains valid fizzbuzz semantics AND the dispatched command line includes both documented default flags. FAIL if any of these checks miss.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Generate a tiny TypeScript fizzbuzz using the documented default."
2. Confirm runtime is non-Devin (Claude Code, Codex, Gemini, OpenCode or shell).
3. Write the prompt file to `/tmp/dv-001-prompt.md`.
4. Execute the dispatch verbatim with the documented default flags.
5. Inspect the captured stdout for valid TypeScript and fizzbuzz semantics.
6. Return a one-paragraph PASS/FAIL verdict naming the model, permission mode and exit code observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-001 | Default dispatch (swe-1.6 normal) | Verify the canonical zero-input default dispatch returns a usable code-generation answer with exit 0 | `Generate a TypeScript fizzbuzz function with the documented cli-devin default and report model, permission mode, exit code, and PASS/FAIL.` | 1. `bash: command -v devin` -> 2. `bash: env \| grep -i '^DEVIN_'` (must be empty) -> 3. `bash: devin auth status` -> 4. `bash: printf 'Generate a single TypeScript function fizzbuzz(n: number): string[] that returns the fizzbuzz sequence from 1 to n. Output only the function body and its signature, no explanation.\n' > /tmp/dv-001-prompt.md` -> 5. `devin --prompt-file /tmp/dv-001-prompt.md --model swe-1.6 --permission-mode auto > /tmp/dv-001-output.ts 2>&1 </dev/null` -> 6. `bash: echo "Exit: $?"` -> 7. `bash: grep -E "fizzbuzz\|Fizz\|Buzz\|FizzBuzz" /tmp/dv-001-output.ts` | Step 1: devin path printed; Step 2: empty; Step 3: authenticated; Step 4: prompt file written; Step 5: exit 0; Step 7: at least 4 fizzbuzz-keyword matches | Captured stdout file `/tmp/dv-001-output.ts`, prompt file `/tmp/dv-001-prompt.md`, full dispatched command line, exit code, terminal transcript | PASS if Steps 1-7 all match expected signals AND the dispatched command includes `--model swe-1.6 --permission-mode auto`; FAIL if exit code is non-zero, stdout lacks the function, OR either default flag is missing | (1) Re-run `command -v devin` to confirm install; (2) re-run `devin auth login` if auth expired; (3) inspect `/tmp/dv-001-output.ts` for partial output; (4) reproduce dispatch foreground (no `</dev/null`) to see prompts |

### Optional Supplemental Checks

- Compile the captured TypeScript with `bash: npx tsc --noEmit --target ES2020 /tmp/dv-001-output.ts` to confirm syntactic validity.
- Re-run the dispatch with the SAME flags and confirm consistent behavior across two consecutive invocations.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation) | Documents the canonical default `--model swe-1.6 --permission-mode auto` |
| `../../references/cli_reference.md` (§4 Flags, §5 Model Selection) | Authoritative flag and model reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill default-invocation contract (§3) and ALWAYS rule 4 (§4) |
| `../../references/cli_reference.md` | CLI flag reference for `--model`, `--permission-mode`, and `--prompt-file` |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/default-dispatch.md`
