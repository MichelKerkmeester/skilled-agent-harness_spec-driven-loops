---
title: "ASD-005 -- Session continuation"
description: "This scenario validates agent-task continuation for `ASD-005`. It focuses on continuing a prior task with `--session <id>` and confirming prior context is actually used."
version: 1.0.0.0
---

# ASD-005 -- Session continuation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-005`.

---

## 1. OVERVIEW

This scenario continues a prior agent task via `aside --session <id> "<follow-up>"` and verifies the continuation demonstrably uses prior-task context.

### Why This Matters

`--session` is the agent-task continuation contract — account-scoped, persistent across CLI invocations — and it is strictly NOT an MCP browser selector. Proving real context reuse (and documenting how the session id is obtained on the installed version) closes one of the packet's practical gaps: the session storage backend is an open research question.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-005` and confirm the expected signals without contradictory evidence.

- Objective: Capture a session id from a prior task (ASD-004 or a fresh seed task), continue it with a follow-up that only makes sense with prior context, and verify the response uses that context.
- Real user request: `"Pick up where the last browser task left off and answer a follow-up."`
- Prompt: `Continue the prior Aside task by session id with a context-dependent follow-up and verify prior context is used.`
- Expected execution process: seed task, session-id capture, continuation, context judgment.
- Expected signals: id captured; continuation returns; the answer references prior-run content it was never re-told.
- Desired user-visible outcome: The follow-up answer plus the judgment that it required prior context.
- Pass/fail: PASS if continuation demonstrably reuses context; FAIL if it starts cold or errors. SKIP (documented) if the installed version surfaces no session id anywhere — that observation is itself the finding.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Continue the prior Aside task by session id with a context-dependent follow-up and verify prior context is used.`

### Commands

1. Seed: `bash: aside "Open https://example.com and note the exact page heading" 2>&1`
2. Capture the session id from the run output or the Aside app task view; record WHERE it was found.
3. `bash: aside --session <id> "What was the exact heading you noted?" 2>&1`

### Expected

- Step 1: seed task returns with the heading noted
- Step 3: the continuation repeats the heading without re-navigating from scratch (or shows prior-task awareness)

### Evidence

Both transcripts, the session id source, and the context-reuse judgment.

### Pass / Fail

- **Pass**: continuation returns AND demonstrates prior context.
- **Fail**: cold-start answer or error on a valid id.
- **SKIP**: no session id discoverable on the installed version — document exactly where it was looked for.

### Failure Triage

1. Unknown/invalid session id error: confirm the id verbatim and its source; ids are account-scoped, so cross-check the active account (ASD-003).
2. Continuation behaves cold: record it — persistence guarantees are documented for transcripts and generated files; the exact recall behavior is installed-version evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/session_management.md` | Three-layer session model this scenario exercises |

---

## 5. SOURCE METADATA

- Group: AGENT TASK
- Playbook ID: ASD-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `agent_task/session_continuation.md`
