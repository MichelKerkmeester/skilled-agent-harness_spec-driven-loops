---
title: "CU-016 -- --resume explicit chat id"
description: "This scenario validates Cursor's --resume [chatId] flag for `CU-016`. It focuses on confirming an explicit resume by session_id (captured from --output-format json) produces a coherent continuation of a specific earlier session."
version: 1.0.0.0
---

# CU-016 -- --resume explicit chat id

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-016`.

---

## 1. OVERVIEW

This scenario validates `--resume [chatId]` for `CU-016`. It focuses on confirming a follow-up dispatch that explicitly names a captured `session_id` returns to that specific earlier session and produces a coherent continuation.

### Why This Matters

`--resume` is distinct from `--continue`: it targets a specific, previously-captured session id rather than "whatever ran last". `references/agent-delegation.md` §6 documents `--resume <chatId>` for "Returning to a specific earlier session by its known id" - relevant to cross-AI orchestration where multiple sessions may be in flight and the orchestrator needs to target one precisely, not just the most recent.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-016` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--resume "$SESSION_ID"` (captured from a prior `--output-format json` dispatch) returns to that specific session and produces a correct continuation.
- Real user request: `I need to come back to that specific Cursor session from earlier and finish the task, not just whatever ran most recently.`
- Prompt (Turn 1, --output-format json): `Sketch a TypeScript Order type (id, items, total fields) and write it to /tmp/cli-cursor-playbook-cu016/order.ts.`
- Prompt (Turn 2, --resume): `Implement a total() function for the type from Turn 1.`
- Expected execution process: Operator pre-cleans the target temp directory -> dispatches Turn 1 with `--output-format json` and captures the `session_id` field from the JSON envelope -> dispatches Turn 2 with `--resume "$SESSION_ID" --model composer-2.5` -> inspects Turn 2's output/file changes for a correct reference to the Turn 1 `Order` type's actual field shape.
- Expected signals: Turn 1's JSON output includes a `session_id` field with a non-empty value. Turn 2 (`cursor-agent -p ... --resume "$SESSION_ID" --model composer-2.5`) exits 0 and its output or file changes reference the Turn 1 `Order` type's actual field names.
- Desired user-visible outcome: A working resumed task with the actual `session_id` captured as evidence, honestly reporting the observed round-trip behavior rather than assuming it in advance.
- Pass/fail: PASS if Turn 1's JSON output contains a usable `session_id` AND Turn 2's resumed dispatch correctly references the Turn 1 type's fields. FAIL if Turn 1's JSON output lacks a `session_id`, or Turn 2 errors, or produces content that does not match (or fabricates) the Turn 1 type's fields.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-clean `/tmp/cli-cursor-playbook-cu016/`.
2. Dispatch Turn 1 with `--output-format json` and extract `session_id` via `jq`.
3. Dispatch Turn 2 with `--resume "$SESSION_ID"`, deliberately omitting the field list from the prompt.
4. Inspect Turn 2's output/file changes for correct field references.
5. Return a PASS/FAIL verdict naming the captured `session_id` and the fields Turn 2 correctly (or incorrectly) referenced.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-016 | --resume explicit chat id | Verify --resume with a captured session_id correctly returns to that session | Turn 1: `Sketch a TypeScript Order type (id, items, total fields) and write it to /tmp/cli-cursor-playbook-cu016/order.ts.` Turn 2: `Implement a total() function for the type from Turn 1.` | 1. `bash: rm -rf /tmp/cli-cursor-playbook-cu016 && mkdir -p /tmp/cli-cursor-playbook-cu016` -> 2. `cursor-agent -p "Sketch a TypeScript Order type (id, items, total fields) and write it to /tmp/cli-cursor-playbook-cu016/order.ts." --model composer-2.5 --auto-review --sandbox enabled --output-format json </dev/null > /tmp/cli-cursor-cu016-turn1.json 2>&1` -> 3. `bash: SESSION_ID=$(jq -r '.session_id' /tmp/cli-cursor-cu016-turn1.json)` -> 4. `bash: cat /tmp/cli-cursor-playbook-cu016/order.ts` -> 5. `cursor-agent -p "Implement a total() function for the type from Turn 1." --resume "$SESSION_ID" --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu016-turn2.txt 2>&1` -> 6. `bash: cat /tmp/cli-cursor-cu016-turn2.txt` -> 7. `bash: grep -E "id\|items\|total" /tmp/cli-cursor-cu016-turn2.txt` | Step 2: Turn 1 exit 0, valid JSON; Step 3: non-empty `session_id` extracted; Step 4: `order.ts` contains an `Order` type with the three fields; Step 5: Turn 2 exit 0; Step 6-7: Turn 2's output references `id`/`items`/`total` without them being restated in the Turn 2 prompt | Turn 1 JSON envelope, extracted `session_id`, Turn 1 file contents, Turn 2 stdout, both exit codes | PASS if `session_id` is captured AND Turn 2 exits 0 AND correctly references the Turn 1 type's actual fields; FAIL if `session_id` is missing/empty, Turn 2 errors, or its output references different/fabricated fields | (1) Confirm `jq` is available and the JSON envelope actually contains a `session_id` key per `references/cli-reference.md` §6; (2) re-run Turn 1 if the JSON parse fails; (3) cross-check against `CU-015`'s `--continue` result to isolate whether the issue is `--resume`-specific |

### Optional Supplemental Checks

- Dispatch an unrelated Turn 1'/Turn 2' pair concurrently and confirm `--resume` with the correct id never cross-contaminates with the other session's context.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/agent-delegation.md` (§6 Session Continuity) | Documents `--resume <chatId>` and its use case |
| `../../references/cli-reference.md` (§6 Output Handling, §4 Session & Continuity Flags) | Authoritative `--output-format json`/`session_id`/`--resume` reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | §6 "Considerations" - capturing `session_id` from JSON output for later resume |
| `../../references/cli-reference.md` | §6 Output Handling - `--output-format json` envelope shape |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CU-016
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/resume-explicit-chat-id.md`
