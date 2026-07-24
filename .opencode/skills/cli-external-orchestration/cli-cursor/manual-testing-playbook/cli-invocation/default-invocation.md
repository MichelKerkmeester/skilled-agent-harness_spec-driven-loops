---
title: "CU-001 -- Default invocation (auto model, text output)"
description: "This scenario validates the canonical zero-input default dispatch (auto model + text output, paired with the skill's documented auto-review/sandbox-enabled approval default) for `CU-001`. It focuses on confirming the documented skill default produces a usable inline answer with exit code 0."
version: 1.0.0.0
---

# CU-001 -- Default invocation (auto model, text output)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-001`.

---

## 1. OVERVIEW

This scenario validates the canonical zero-input default dispatch for `CU-001`. It focuses on confirming the documented skill default (`--model auto --output-format text`, paired with `--auto-review --sandbox enabled`) produces a usable inline code answer with exit code 0.

### Why This Matters

The default invocation is the single most important contract in this skill. SKILL.md §3 "Default Invocation" mandates `cursor-agent -p "<prompt>" --output-format text --model auto --auto-review --sandbox enabled` as the zero-input baseline. If this baseline regresses, every other scenario built on top of it inherits the failure. This scenario is on the critical-path list (§5 of the root playbook).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify the documented zero-input default dispatch returns a usable inline code answer with exit code 0.
- Real user request: `Ask Cursor to write a tiny TypeScript fizzbuzz function for me using whatever the cli-cursor default is.`
- Prompt: `Generate a TypeScript function fizzbuzz(n: number): string[] that returns the fizzbuzz sequence from 1 to n. Output only the function body and its signature in your response text, no file writes, no explanation.`
- Expected execution process: Operator confirms preconditions (cursor-agent installed, authenticated via output-text check, non-Cursor runtime) -> dispatches the documented default invocation -> captures stdout to a temp file -> inspects the captured text for fizzbuzz semantics -> confirms no unintended file writes -> records the dispatched command line as evidence.
- Expected signals: `cursor-agent -p` exits 0. Output text contains a TypeScript function named `fizzbuzz` referencing `Fizz`/`Buzz`/`FizzBuzz` semantics. `git status --porcelain` stays clean (the prompt explicitly asks for an inline answer, not a file write). The dispatched command line includes `--model auto --output-format text --auto-review --sandbox enabled`.
- Desired user-visible outcome: A working `fizzbuzz` function returned inline, with operator-readable evidence that the documented default invocation pattern was used verbatim.
- Pass/fail: PASS if exit code is 0 AND the output text contains valid fizzbuzz semantics AND `git status --porcelain` stays clean AND the dispatched command line includes all documented default flags. FAIL if any of these checks miss.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain language: "Generate a tiny TypeScript fizzbuzz using the documented default, no file writes."
2. Confirm runtime is non-Cursor (Claude Code, Codex, OpenCode or shell) and confirm auth via `cursor-agent about` output text.
3. Execute the dispatch verbatim with all documented default flags.
4. Inspect the captured stdout for valid TypeScript and fizzbuzz semantics.
5. Confirm `git status --porcelain` is clean (no unintended writes).
6. Return a one-paragraph PASS/FAIL verdict naming the model and output format observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-001 | Default invocation (auto model, text output) | Verify the canonical zero-input default dispatch returns a usable inline answer with exit 0 | `Generate a TypeScript function fizzbuzz(n: number): string[] that returns the fizzbuzz sequence from 1 to n. Output only the function body and its signature in your response text, no file writes, no explanation.` | 1. `bash: command -v cursor-agent` -> 2. `bash: env \| grep -i cursor_` (must be empty) -> 3. `bash: cursor-agent about \| grep -i "User Email"` (must show a real email, not "Not logged in") -> 4. `bash: git status --porcelain > /tmp/cli-cursor-cu001-pre.txt` -> 5. `cursor-agent -p "Generate a TypeScript function fizzbuzz(n: number): string[] that returns the fizzbuzz sequence from 1 to n. Output only the function body and its signature in your response text, no file writes, no explanation." --model auto --output-format text --auto-review --sandbox enabled </dev/null > /tmp/cli-cursor-cu001.txt 2>&1` -> 6. `bash: cat /tmp/cli-cursor-cu001.txt` -> 7. `bash: grep -E "fizzbuzz\|Fizz\|Buzz\|FizzBuzz" /tmp/cli-cursor-cu001.txt` -> 8. `bash: git status --porcelain > /tmp/cli-cursor-cu001-post.txt && diff /tmp/cli-cursor-cu001-pre.txt /tmp/cli-cursor-cu001-post.txt` | Step 1: cursor-agent path printed; Step 2: empty (no Cursor env vars); Step 3: real email shown; Step 4: pre-snapshot captured; Step 5: exit 0; Step 6: output contains TypeScript function `fizzbuzz`; Step 7: at least 4 fizzbuzz-keyword matches; Step 8: pre/post snapshots identical | Captured stdout file `/tmp/cli-cursor-cu001.txt`, full dispatched command line, exit code, pre/post `git status` snapshots | PASS if Steps 1-8 all match expected signals AND the dispatched command includes `--model auto --output-format text --auto-review --sandbox enabled`; FAIL if exit code is non-zero, output lacks the function, OR any file was unexpectedly created/modified | (1) Re-run `command -v cursor-agent` to confirm install; (2) re-run `cursor-agent login` if `about` shows "Not logged in"; (3) inspect `/tmp/cli-cursor-cu001.txt` for partial output; (4) reproduce dispatch with `2>&1 \| tee` to capture stderr inline |

### Optional Supplemental Checks

- Compile the captured TypeScript snippet with `bash: npx tsc --noEmit --target ES2020 /tmp/cli-cursor-cu001.txt` (after stripping any prose) to confirm syntactic validity.
- Re-run the dispatch with the SAME flags and confirm consistent behavior across two consecutive invocations.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation) | Documents the canonical default `cursor-agent -p "<prompt>" --output-format text --model auto --auto-review --sandbox enabled` |
| `../../references/cli-reference.md` (§4 Command-Line Flags, §5 Model Selection) | Authoritative flag and model reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill default-invocation contract (§3) and ALWAYS rule 7 (§4) |
| `../../references/cli-reference.md` | CLI flag reference for `--model`, `--output-format`, `--auto-review`, `--sandbox` |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CU-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/default-invocation.md`
