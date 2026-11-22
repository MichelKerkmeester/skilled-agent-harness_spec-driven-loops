---
title: "ASD-005 -- Session continuation"
description: "This scenario validates agent-task continuation for `ASD-005`. It focuses on continuing a prior task with `--session <id>` and confirming prior context is actually used."
version: 1.0.2.0
---

# ASD-005 -- Session continuation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ASD-005`.

---

## 1. OVERVIEW

This scenario continues a prior agent task via `aside --session <id> "<follow-up>"` and verifies the continuation demonstrably uses prior-task context. On Aside 1.26.626.1517 the agent run prints no session id. The id is the `id` column of the `sessions` table in `~/.aside/u/0/state.db`, and it equals the session folder name without its `YYYY-MM-DD_` prefix; the folder name itself is rejected as `Session not found`.

### Why This Matters

`--session` is the agent-task continuation contract — account-scoped, persistent across CLI invocations — and it is strictly NOT an MCP browser selector. Proving real context reuse (and documenting how the session id is obtained on the installed version) closes one of the packet's practical gaps: the session storage backend is an open research question.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ASD-005` and confirm the expected signals without contradictory evidence.

- Objective: Capture a session id from a prior task (ASD-004 or a fresh seed task), continue it with a follow-up that only makes sense with prior context, and verify the response uses that context.
- Real user request: `"Pick up where the last browser task left off and answer a follow-up."`
- Prompt: `Continue the prior Aside task by session id with a context-dependent follow-up and verify prior context is used.`
- Expected execution process: snapshot the session ids, seed task, read the new id from the state database, continuation, context judgment.
- Expected signals: id captured; continuation returns; the answer references prior-run content it was never re-told.
- Desired user-visible outcome: The follow-up answer plus the judgment that it required prior context.
- Pass/fail: PASS if continuation demonstrably reuses context; FAIL if it starts cold or errors. SKIP (documented) when the installed `aside` version surfaces no session id anywhere — a specific missing-feature blocker in this environment — that observation is itself the finding.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Continue the prior Aside task by session id with a context-dependent follow-up and verify prior context is used.`

### Commands

1. `bash: sqlite3 -readonly ~/.aside/u/0/state.db "SELECT id FROM sessions;" > <scratch>/asd005-ids-before.txt`
2. Seed: `bash: aside "Open https://example.com and note the exact page title" 2>&1`
3. `bash: sqlite3 -readonly ~/.aside/u/0/state.db "SELECT id FROM sessions;" | grep -vxFf <scratch>/asd005-ids-before.txt` prints the id the seed created; record that it came from the `sessions` table. If the run output or the Aside app task view shows an id instead, record that source.
4. `bash: aside --session <id> "What was the exact page title you noted?" 2>&1`

### Expected

- Step 2: seed task returns with the title noted (`Example Domain` on example.com, which has no `h1`)
- Step 3: exactly one new id appears
- Step 4: the continuation repeats the title without re-navigating from scratch (or shows prior-task awareness)

### Evidence

Both transcripts, the session id source, and the context-reuse judgment.

### Pass / Fail

- **Pass**: continuation returns AND demonstrates prior context.
- **Fail**: cold-start answer or error on a valid id.
- **SKIP**: no session id discoverable on the installed version, neither in the run output nor in the `sessions` table; document exactly where it was looked for.

### Failure Triage

1. Unknown/invalid session id error (`Session not found`): confirm the id verbatim and its source; a session folder name with its `YYYY-MM-DD_` prefix is rejected, so strip the prefix or use the `sessions` table value. Ids are account-scoped, so cross-check the active account (ASD-003).
2. Step 3 prints no id or several: another task ran between the two snapshots; rerun steps 1 to 3 with nothing else running.
3. Continuation behaves cold: record it; persistence guarantees are documented for transcripts and generated files; the exact recall behavior is installed-version evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/references/session-management.md` | Three-layer session model this scenario exercises |

---

## 5. SOURCE METADATA

- Group: AGENT TASK
- Playbook ID: ASD-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-task/session-continuation.md`
