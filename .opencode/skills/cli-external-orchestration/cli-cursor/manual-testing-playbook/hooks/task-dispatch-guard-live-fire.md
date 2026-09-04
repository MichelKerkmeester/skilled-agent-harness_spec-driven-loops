---
title: "CU-021 -- Task-matcher preToolUse dispatch guard live-fire"
description: "This scenario validates that a second preToolUse array entry with \"matcher\": \"Task\" fires alongside the existing unmatched preToolUse entry for a real Task tool call for `CU-021`, reproducing phase 011's live subagent-delegation dispatch evidence in an isolated temp workspace."
version: 1.0.0.0
---

# CU-021 -- Task-matcher preToolUse dispatch guard live-fire

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-021`.

---

## 1. OVERVIEW

This scenario validates that a `preToolUse` array entry scoped with `"matcher": "Task"` fires alongside the pre-existing unmatched `preToolUse` entry for the SAME `Task` tool call, under a real `cursor-agent -p` dispatch requesting explicit subagent delegation. It reproduces, first-hand, the live event-delivery evidence phase 011 of this creation packet captured, using an isolated temporary workspace so this repo's real, committed `.cursor/hooks.json` (phases 010/011) and its live gate state are never touched by this scenario's own test run.

### Why This Matters

This repo's `.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` is registered as a SECOND `preToolUse` entry alongside the existing unmatched `spec-gate-enforce.mjs` entry, proxying to the same deep-loop dispatch guard (`.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs`, via the `claude/task-dispatch-guard.cjs` adapter) Claude Code's own `preToolUse` hook already uses. If Cursor's `matcher` schema field stopped routing by `tool_name`, or if adding a second array entry silently shadowed the first, the deep-loop dispatch guard would go dark for Cursor-originated subagent delegation without any visible failure.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-021` and confirm the expected signals without contradictory evidence.

- Objective: Verify a `matcher: "Task"`-scoped `preToolUse` entry fires alongside the existing unmatched `preToolUse` entry for the same `Task` tool call, using an isolated temp workspace.
- Real user request: `I want to be sure the Task-scoped dispatch guard this repo's adapter depends on actually fires alongside the general guard, not instead of it.`
- Prompt: `In an isolated temp workspace with its own hooks.json wiring two preToolUse entries (one unmatched, one matcher: "Task") to a logging probe, dispatch a task that explicitly requests subagent delegation and confirm both entries fire for the same Task call.`
- Expected execution process: Operator creates an isolated temp workspace (`/tmp/cli-cursor-cu021-workspace/`) with its own `.cursor/hooks.json` wiring two `preToolUse` array entries (one with no `matcher`, one with `"matcher": "Task"`) to a logging probe script -> dispatches `cursor-agent -p` with `--workspace` pointed at that isolated directory, asking the model to explicitly delegate a small piece of work to a subagent so a `Task` tool call actually occurs -> inspects the probe log for entries from both wired `preToolUse` array positions against the same `tool_use_id`/`session_id`.
- Expected signals: The probe log shows at least one `preToolUse` entry from the unmatched wiring AND at least one `preToolUse` entry from the `matcher: "Task"` wiring, both correlated to the same dispatched `Task` tool call - matching phase 011's live-fire dispatch 3 evidence (`preToolUse-Task-fired` and `preToolUse-unmatched-fired` for the same call).
- Desired user-visible outcome: A reproduced, first-hand confirmation that Cursor's `matcher` schema field routes a second `preToolUse` entry by `tool_name` without shadowing the pre-existing unmatched entry, independent of trusting the phase 011 summary alone.
- Pass/fail: PASS if the probe log shows both entries firing for the same `Task` call. FAIL if either entry is absent, or if only one of the two ever fires across repeated attempts.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create an isolated temp workspace with its own `hooks.json` wiring two `preToolUse` array entries (unmatched, and `matcher: "Task"`) to a logging probe script that appends `{event, matcher, tool_name, timestamp}` to a log file.
2. Dispatch `cursor-agent -p` with `--workspace` pointed at the isolated temp workspace, explicitly requesting subagent delegation so a `Task` tool call occurs.
3. Inspect the probe log for entries from both wired `preToolUse` positions.
4. Confirm this repo's own real `.cursor/hooks.json` (if any) was never touched by this scenario.
5. Return a PASS/FAIL verdict naming the exact entries observed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-021 | Task-matcher preToolUse dispatch guard live-fire | Verify a matcher:"Task" preToolUse entry fires alongside the unmatched entry for the same Task call | `In an isolated temp workspace with its own hooks.json wiring two preToolUse entries (one unmatched, one matcher: "Task") to a logging probe, dispatch a task that explicitly requests subagent delegation and confirm both entries fire for the same Task call.` | 1. `bash: rm -rf /tmp/cli-cursor-cu021-workspace && mkdir -p /tmp/cli-cursor-cu021-workspace/.cursor && printf '#!/bin/sh\necho "{\"event\":\"preToolUse\",\"matcher\":\"$1\",\"ts\":\"$(date -u +%%Y-%%m-%%dT%%H:%%M:%%SZ)\"}" >> /tmp/cli-cursor-cu021-probe.log\necho "{\"permission\":\"allow\"}"\n' > /tmp/cli-cursor-cu021-probe.sh && chmod +x /tmp/cli-cursor-cu021-probe.sh` -> 2. `bash: printf '{"version":1,"hooks":{"preToolUse":[{"command":"/tmp/cli-cursor-cu021-probe.sh unmatched","type":"command"},{"command":"/tmp/cli-cursor-cu021-probe.sh Task","type":"command","matcher":"Task"}]}}' > /tmp/cli-cursor-cu021-workspace/.cursor/hooks.json` -> 3. `bash: rm -f /tmp/cli-cursor-cu021-probe.log` -> 4. `cursor-agent -p "Delegate this to a subagent: write a one-line hello.txt file" --workspace /tmp/cli-cursor-cu021-workspace --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu021-stdout.txt 2>&1` -> 5. `bash: cat /tmp/cli-cursor-cu021-probe.log` -> 6. `bash: git -C . status --porcelain .cursor/hooks.json 2>/dev/null` (confirm this repo's own `.cursor/hooks.json` was untouched) | Step 1-2: probe script and isolated `hooks.json` created; Step 3: log cleared; Step 4: exit 0; Step 5: log contains both an `unmatched` entry AND a `Task` entry for the dispatched Task call; Step 6: no change to this repo's own hook config | Isolated `hooks.json` contents, probe log contents, dispatched stdout, confirmation this repo's real config was untouched | PASS if the probe log contains both the unmatched and the `Task`-matcher entries for the same dispatch AND this repo's own `.cursor/hooks.json` was untouched; FAIL if either entry is missing, or if this repo's own hook config was inadvertently modified | (1) Re-check `--workspace` actually pointed at the isolated dir, not this repo; (2) confirm the model actually issued a `Task` tool call rather than doing the work inline (re-word the prompt to be more explicit about delegation if not); (3) re-read `mcp-server/hooks/cursor/task-dispatch-guard.mjs`'s header comment for the exact confirmed live-fire shape if results diverge |

### Optional Supplemental Checks

- Extend the same harness to confirm a nested child session (a Task-delegated subagent's own subsequent tool call) re-fires `preToolUse` under its own child `session_id`, cross-checking against phase 004's original `Task` tool_name discovery.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/hook-contract.md` (§2 Schema, §4 Documented Agent Events) | Documents the `matcher` schema field and the full agent-event roster |
| `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/011-cursor-hooks-claude-parity/implementation-summary.md` | Phase 011's live-fire dispatch-3 evidence: `preToolUse-Task-fired` and `preToolUse-unmatched-fired` for the same Task call |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../../hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | The real `matcher: "Task"`-wired `preToolUse` guard this scenario's live-fire evidence supports |
| `../../../../../hooks/task-dispatch/lib/dispatch-guard.cjs` | The shared deep-loop dispatch guard core `task-dispatch-guard.mjs` proxies to |
| `../../../../system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | The pre-existing unmatched `preToolUse` entry this scenario confirms keeps firing alongside the new matched entry |

---

## 5. SOURCE METADATA

- Group: Hooks
- Playbook ID: CU-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hooks/task-dispatch-guard-live-fire.md`
