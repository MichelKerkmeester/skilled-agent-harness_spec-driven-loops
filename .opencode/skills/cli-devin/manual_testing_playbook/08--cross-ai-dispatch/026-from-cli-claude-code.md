---
title: "DV-022 -- Dispatch from cli-claude-code"
description: "This scenario validates a calling AI inside a cli-claude-code session can dispatch a devin task and integrate the output."
---

# DV-022 -- Dispatch from cli-claude-code

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-022`.

---

## 1. OVERVIEW

This scenario validates cross-AI dispatch from `cli-claude-code` to `cli-devin` for `DV-022`. A Claude Code session uses its Bash tool to dispatch `devin` via the cli-devin Default Invocation block and integrates the output through its Read tool.

### Why This Matters

cli-claude-code is the Anthropic-side sibling in the family. Validating dispatch from Claude Code is the natural counterpart to DV-021 (cli-codex) and DV-023 (cli-opencode). Operators in Claude Code sessions need to know the cli-devin contract works under Claude's tool stack.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a cli-claude-code session can dispatch `devin` via Bash and capture the output cleanly.
- Real user request: `From inside a Claude Code session, hand off a small refactor to Devin and bring back the result.`
- Prompt: `From a cli-claude-code session, dispatch devin --prompt-file /tmp/devin-from-claude.md --model swe-1.6 --permission-mode auto and confirm Claude Code captures stdout and integrates the result.`
- Expected execution process: cli-claude-code session loads cli-devin SKILL.md -> composes a prompt file via Write tool -> dispatches `devin` via Bash tool -> Reads the captured stdout -> integrates into the response.
- Expected signals: cli-claude-code's Bash invocation runs successfully. `devin` exits 0. cli-claude-code parses the output and integrates without losing context.
- Desired user-visible outcome: A working cross-AI dispatch demonstrating cli-claude-code → cli-devin works end-to-end.
- Pass/fail: PASS if Bash exit 0 AND `devin` exit 0 AND Claude integrates the output. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. From a fresh cli-claude-code session, load cli-devin SKILL.md.
2. Use the Write tool to create the prompt file at `/tmp/devin-from-claude.md`.
3. Use the Bash tool to dispatch `devin` with the prompt file.
4. Use the Read tool to load the captured output.
5. Claude Code integrates the output into its response.
6. Return a PASS/FAIL verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-022 | Dispatch from cli-claude-code | Verify cli-claude-code → cli-devin dispatch round trip | `From a cli-claude-code session, dispatch devin --prompt-file /tmp/devin-from-claude.md --model swe-1.6 --permission-mode auto and confirm Claude Code captures stdout and integrates the result.` | 1. Launch a cli-claude-code session. -> 2. Write tool: create `/tmp/devin-from-claude.md` with `Generate a TypeScript throttle(fn, ms) function with full type annotations.` -> 3. Bash tool: `devin --prompt-file /tmp/devin-from-claude.md --model swe-1.6 --permission-mode auto > /tmp/dv-022-output.ts 2>&1 </dev/null; echo "Devin exit: $?"` -> 4. Read tool: load `/tmp/dv-022-output.ts`. -> 5. Claude Code integrates the throttle function into its response. | Step 2: file written; Step 3: devin exits 0; Step 4: throttle function visible; Step 5: response references the function | Prompt file, devin stdout, Claude Code's integrated response, terminal transcript | PASS if all steps succeed AND Claude visibly integrates the output; FAIL if any step errors | (1) Verify Claude Code's Bash permissions allow `devin`; (2) check that `</dev/null` is appended in Claude's Bash invocation; (3) confirm Devin is on PATH from Claude's environment |

### Optional Supplemental Checks

- Try with different Claude models (Sonnet vs Opus) and confirm dispatch behavior is consistent.
- Use Claude's Task tool to delegate the entire dispatch to a sub-agent that loads cli-devin.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§6 Cross-CLI Patterns — from cli-claude-code) | Cross-CLI dispatch guidance |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation (the copy-paste shape Claude uses) |
| `../../references/integration_patterns.md` (§2 Use Case 1) | External runtime → local Devin pattern |

---

## 5. SOURCE METADATA

- Group: Cross-AI Dispatch
- Playbook ID: DV-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--cross-ai-dispatch/026-from-cli-claude-code.md`
