---
title: "DV-021 -- Dispatch from cli-codex (gpt-5.5 medium)"
description: "This scenario validates a calling AI inside a cli-codex (gpt-5.5 medium) session can dispatch a devin task using cli-devin's Default Invocation block and integrate the output."
---

# DV-021 -- Dispatch from cli-codex (gpt-5.5 medium)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-021`.

---

## 1. OVERVIEW

This scenario validates cross-AI dispatch from `cli-codex` to `cli-devin` for `DV-021`. A calling AI inside a `cli-codex` (gpt-5.5 medium) session reads cli-devin's SKILL.md §3 Default Invocation block, dispatches a Devin task via Bash, and integrates the output.

### Why This Matters

cli-codex is one of the four sibling CLIs in the family pattern. Validating dispatch from each peer proves the cli-devin contract works under each runtime's tool stack. Without this, the family-symmetry claim is theoretical.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a cli-codex session can dispatch `devin` via Bash and capture the output cleanly.
- Real user request: `From inside a Codex session, hand off a small refactor to Devin and bring back the result.`
- Prompt: `From a cli-codex session, dispatch devin --prompt-file /tmp/devin-from-codex.md --model swe-1.6 --permission-mode auto and confirm Codex captures stdout and integrates the result.`
- Expected execution process: cli-codex session loads cli-devin SKILL.md -> composes a prompt file -> dispatches `devin` via Codex's Bash tool with `--sandbox workspace-write` to allow the temp-file write -> captures stdout -> integrates.
- Expected signals: cli-codex's Bash invocation runs successfully. `devin` exits 0. cli-codex captures the output. The calling AI integrates the result without losing context.
- Desired user-visible outcome: A working cross-AI dispatch demonstrating cli-codex → cli-devin works end-to-end.
- Pass/fail: PASS if cli-codex Bash exit 0 AND `devin` exit 0 AND output captured. FAIL if either step errors OR if cli-codex couldn't read the captured output.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. From a fresh cli-codex session, load cli-devin SKILL.md.
2. Compose a small prompt file via Codex's Write tool (or Bash echo).
3. Dispatch `devin` with `--prompt-file` via Codex's Bash tool.
4. Codex captures stdout and reads it back.
5. Return a PASS/FAIL verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-021 | Dispatch from cli-codex (gpt-5.5 medium) | Verify cli-codex → cli-devin dispatch round trip | `From a cli-codex session, dispatch devin --prompt-file /tmp/devin-from-codex.md --model swe-1.6 --permission-mode auto and confirm Codex captures stdout and integrates the result.` | 1. Launch a cli-codex session with `--sandbox workspace-write` so it can write to /tmp. -> 2. From inside Codex, run: `bash: printf 'Generate a TypeScript debounce(fn, ms) function with full type annotations.\n' > /tmp/devin-from-codex.md` -> 3. Run: `bash: devin --prompt-file /tmp/devin-from-codex.md --model swe-1.6 --permission-mode auto > /tmp/dv-021-output.ts 2>&1 </dev/null; echo "Devin exit: $?"` -> 4. Run: `bash: head -20 /tmp/dv-021-output.ts` -> 5. Codex integrates the captured function into its response. | Step 2: prompt file written; Step 3: devin exits 0; Step 4: TypeScript debounce function visible; Step 5: cli-codex's final answer includes the function | Prompt file, devin stdout, cli-codex's integrated response, terminal transcript | PASS if all steps succeed AND cli-codex visibly integrates the output; FAIL if any step errors | (1) Verify cli-codex sandbox allows workspace-write; (2) check Codex's stdin handling — `</dev/null` is required; (3) confirm Devin is on PATH from Codex's environment |

### Optional Supplemental Checks

- Vary the cli-codex reasoning effort (low/medium/high) and confirm dispatch works at each level.
- Try a multi-step task: cli-codex plans, cli-devin executes, cli-codex reviews.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§6 Cross-CLI Patterns — from cli-codex) | Cross-CLI dispatch guidance |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation (the copy-paste shape cli-codex uses) |
| `../../references/integration_patterns.md` (§2 Use Case 1) | External runtime → local Devin pattern |

---

## 5. SOURCE METADATA

- Group: Cross-AI Dispatch
- Playbook ID: DV-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--cross-ai-dispatch/025-from-cli-codex.md`
