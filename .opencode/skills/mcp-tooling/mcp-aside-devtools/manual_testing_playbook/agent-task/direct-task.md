---
title: "ASD-004 -- Direct natural-language task"
description: "This scenario validates the agent-task lane for `ASD-004`. It focuses on running a read-only natural-language task and judging the user-visible outcome, with pauses treated as human gates."
version: 1.0.0.0
---

# ASD-004 -- Direct natural-language task

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-004`.

---

## 1. OVERVIEW

This scenario runs the primary Aside surface — `aside "<task>"` — on a harmless read-only goal and judges the outcome, not just the exit code.

### Why This Matters

The agent-task lane is the packet's headline capability and the one lane where success cannot be reduced to exit codes: a clean exit with a wrong or empty answer is a failure. It is also where the human-gate model (approvals, MFA, CAPTCHA) first shows up in practice.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `aside "Open https://example.com and summarize the page"` returns and the output plausibly summarizes the page; document any pause as a human boundary.
- Real user request: `"Have the browser agent open example.com and tell me what's on it."`
- Prompt: `Run a read-only Aside agent task summarizing https://example.com and judge the outcome.`
- Expected execution process: preflight (ASD-001/003 assumed), single task run, outcome judgment.
- Expected signals: run returns; output references the page's actual content; pauses documented, not retried.
- Desired user-visible outcome: The summary plus a verdict on whether it matches the real page.
- Pass/fail: PASS if the run returns and the summary matches the page; FAIL on error or an outcome that does not answer the goal.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a read-only Aside agent task summarizing https://example.com and judge the outcome.`

### Commands

1. Precondition: ASD-001 (binary) and ASD-003 (account) passed.
2. `bash: aside "Open https://example.com and summarize the page" 2>&1`
3. Judge the output against the page's known content (the example.com placeholder text).

### Expected

- Step 2: returns with a natural-language result
- Step 3: the summary reflects the page's real content

### Evidence

Full task transcript (stderr included), the summary text, and the judgment rationale. Redact anything account-identifying beyond the account id.

### Pass / Fail

- **Pass**: run returns AND the summary matches the page.
- **Fail**: errored run, empty output, or a summary of the wrong page.

### Failure Triage

1. Pause on approval/MFA/CAPTCHA: not a failure — document the human gate, act in the Aside app if authorized, and record resume behavior.
2. Signed-out failure of built-in models: cross-reference ASD-003; recover via operator account selection, then re-run once.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/examples/agent-task-session.sh` | Scripted equivalent of this lane |

---

## 5. SOURCE METADATA

- Group: AGENT TASK
- Playbook ID: ASD-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `agent-task/direct-task.md`
