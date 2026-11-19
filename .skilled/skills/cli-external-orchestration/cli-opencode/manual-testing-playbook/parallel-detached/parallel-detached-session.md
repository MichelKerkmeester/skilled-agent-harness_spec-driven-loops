---
title: "CO-026 -- Parallel detached session (use case 2)"
description: "This scenario validates the parallel detached session pattern (use case 2) for `CO-026`. It focuses on confirming an in-OpenCode operator can spawn a SEPARATE OpenCode session through a headless server reached with `--server <url>`, with its own session id, independently exportable via `opencode session export`."
version: 1.4.6.0
---

# CO-026 -- Parallel detached session (use case 2)

**Version note.** The commands in this scenario target OpenCode 2 (2.3.2). `run` has no port flag, so a detached session is started with `opencode serve` and reached with `--server <url>`.

**Status: [unverified] on OpenCode 2.** No v2 run of this procedure has been recorded. The steps below follow the 2.3.2 help text (`opencode serve`, the global `--server` flag, `opencode session export`), but nobody has run them end to end, so the expected signals and the pass condition are the intended contract, not observed results. Record the first v2 run before treating a PASS as evidence.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-026`.

---

## 1. OVERVIEW

> **DESTRUCTIVE SCENARIO (CHK-033):** This scenario publishes nothing. `--share` is not a `run` flag, so no dispatch passes it. The scenario still runs inside the sandbox tmpdir it names (`/tmp/co-share-sandbox-026/`) so no dispatch touches the operator's real project tree. Recovery and teardown steps in section 3 (Failure Triage) MUST be executed after every run, pass or fail.

This scenario validates Parallel detached session (use case 2) for `CO-026`. It focuses on confirming the documented use case 2 path in `references/integration-patterns.md` §3. An in-OpenCode operator can spawn a SEPARATE OpenCode session through a headless server started with `opencode serve` and reached with `--server <url>`, with its own session id, distinct from the parent session and independently addressable via `opencode session export <session-id>`. The installed runtime persists session state in a shared SQLite database and storage tree under `~/.local/share/opencode/` (`opencode.db`, `storage/`, `snapshot/`). There is no per-session directory under `~/.opencode/state/` on a standard install, so this scenario proves session independence via the documented `opencode session export` subcommand rather than a filesystem directory that does not exist.

### Why This Matters

Use case 2 is the documented exception to the self-invocation guard. The guard MUST trip on in-OpenCode runtime AND the prompt MUST include parallel-session keywords for the dispatch to be permitted (per ADR-001 + SKILL.md §1 "When NOT to Use" exception clause). If the dispatch is refused even with valid parallel-session keywords, every ablation, worker farm and parallel research workflow regresses. If the dispatch is permitted without parallel-session keywords, the safety story collapses. This test exercises the legitimate use case 2 path with the keywords included.

> **Cross-AI dependency note:** This scenario can be executed from outside OpenCode (the originating runtime is unimportant). What matters is that the dispatched `opencode run --server <url>` command emits a `step_start` event with a `sessionID` distinct from the originator's session id (if any) and that `opencode session export <session-id>` can retrieve that session independently. PASS condition is satisfied by opencode emitting the new session id and that session being independently exportable. No URL is published: `--share` is not a `run` flag, and NEVER rule 2 forbids passing it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-026` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `opencode run --server <url>` (with explicit parallel-session keywords in the prompt) creates a SEPARATE session with its own session id, independently retrievable via `opencode session export <session-id>`.
- Real user request: `Spawn a parallel detached opencode session against a headless server to run a small isolated worker task. Confirm the new session has its own session id and can be retrieved independently, and that we did NOT trigger the self-invocation refusal.`
- RCAF Prompt: `As an in-OpenCode operator (or external runtime simulating one) spawning a parallel detached OpenCode session for a small isolated worker task, dispatch opencode run with --server http://127.0.0.1:4096 and a prompt that explicitly says "parallel detached session" + "ablation suite" so the smart router permits use case 2. Verify the dispatch creates a new session with its own session id, that opencode session export <session-id> retrieves that exact session, and that the dispatch is NOT refused with the self-invocation message. Return a concise pass/fail verdict naming the new session id and confirming the export succeeded.`
- Expected execution process: The external-AI orchestrator starts a headless server with `opencode serve`, dispatches `opencode run --server <url>` from the sandbox directory with a prompt that explicitly includes the parallel-session keywords. Captures the JSON event stream, extracts the `sessionID` from `step_start`, validates `opencode session export <session-id>` succeeds and returns that same session id, and validates no refusal message appears. No `--share` is passed: it is not a `run` flag and NEVER rule 2 forbids it.
- Expected signals: Dispatch exits 0. JSON event stream emits a `step_start` event with a non-empty `sessionID`. `opencode session export <session-id>` exits 0 and its JSON output references that same session id. No refusal message ("self-invocation refused") in stderr. The session id is distinct from the originating session (if any).
- Desired user-visible outcome: Verdict naming the new session id and confirming the export succeeded.
- Pass/fail: [unverified] on OpenCode 2, because no v2 run has been recorded. PASS if exit 0 AND new `sessionID` captured AND `opencode session export <session-id>` succeeds for that id AND no refusal message. FAIL if dispatch is refused or the session cannot be independently exported.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pre-create the sandbox tmpdir: `rm -rf /tmp/co-share-sandbox-026/ && mkdir -p /tmp/co-share-sandbox-026/`. NEVER run the dispatch in the operator project tree.
3. Start a headless server with `opencode serve` and read the URL it prints.
4. Dispatch `opencode run --server <url>` from `/tmp/co-share-sandbox-026/` with a prompt including the parallel-session keywords.
5. Capture the new `sessionID` from `step_start`.
6. Run `opencode session export <session-id>` and validate it succeeds and returns that same id.
7. Confirm no refusal message in stderr.
8. Confirm the dispatch passed no `--share`, so nothing was published. The sandbox directory MUST NOT be the operator project tree.
9. After the run (pass or fail) remove the sandbox tmpdir via `rm -rf /tmp/co-share-sandbox-026/` and confirm the capture files are outside the project tree.
10. Return a verdict naming the session id, export status and sandbox teardown confirmation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-026 | Parallel detached session (use case 2) | Confirm that `opencode run --server <url>` with parallel-session keywords creates a separate session id that exports independently | `As an in-OpenCode operator (or external runtime simulating one) spawning a parallel detached OpenCode session for a small isolated worker task, dispatch opencode run with --server http://127.0.0.1:4096 and a prompt that explicitly says "parallel detached session" + "ablation suite" so the smart router permits use case 2. Verify the dispatch creates a new session with its own session id, that opencode session export <session-id> retrieves that exact session, and that the dispatch is NOT refused with the self-invocation message. Return a concise pass/fail verdict naming the new session id and confirming the export succeeded.` | 1. `bash: rm -rf /tmp/co-share-sandbox-026/ && mkdir -p /tmp/co-share-sandbox-026/` -> 2. `bash: opencode serve > /tmp/co-026-serve.log 2>&1 & echo "SERVE_PID: $!"; sleep 3; head -5 /tmp/co-026-serve.log` -> 3. `bash: cd /tmp/co-share-sandbox-026/ && opencode run --server http://127.0.0.1:4096 -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Spawn a parallel detached session for a small isolated ablation suite worker. Briefly say hello and confirm you are running in a separate OpenCode session." > /tmp/co-026-events.jsonl 2>&1 </dev/null && echo "DISPATCH: $?"` -> 4. `bash: SID=$(jq -r 'select(.type == "step_start") \| .sessionID' /tmp/co-026-events.jsonl \| head -1) && echo "Detached SID=$SID"` -> 5. `bash: opencode session export "$SID" > /tmp/co-026-export.json 2>&1; echo "EXPORT_EXIT: $?"; jq -r '.id // empty' /tmp/co-026-export.json` -> 6. `bash: grep -ciE 'self-invocation refused' /tmp/co-026-events.jsonl` -> 7. `bash: jq -r 'select(.type == "text") \| .part.text' /tmp/co-026-events.jsonl \| grep -ciE '(parallel\|detached\|separate)'` | Step 1: sandbox tmpdir created at `/tmp/co-share-sandbox-026/`. Step 2: the server starts and prints its URL. Step 3: DISPATCH exit 0 (dispatch was permitted because the prompt has parallel-session keywords) and the dispatch starts in the sandbox tmpdir, not the operator project tree. Step 4: SID captured non-empty. Step 5: `EXPORT_EXIT: 0` and the exported JSON's id matches `$SID`. Step 6: refusal message count = 0. Step 7: the reply text references parallel/detached/separate (acknowledging the use case 2 context) | `/tmp/co-026-events.jsonl`, `/tmp/co-026-export.json`, `/tmp/co-026-serve.log`, terminal echoes, sandbox tmpdir path | No `--share` is passed, so nothing is published. The sandbox directory MUST NOT be the operator project tree. PASS requires exit 0 AND new SID captured AND `opencode session export "$SID"` succeeds and matches AND zero refusal messages AND the dispatch started in the sandbox tmpdir (not the operator project tree). FAIL if dispatch refused, export fails or returns a different id, session id is empty, OR the dispatch started outside the sandbox tmpdir | 1. Recovery / teardown (RUN AFTER EVERY RUN, pass or fail): (a) Remove the sandbox tmpdir with `rm -rf /tmp/co-share-sandbox-026/`. (b) Remove the capture files `/tmp/co-026-events.jsonl`, `/tmp/co-026-export.json` and `/tmp/co-026-serve.log`. 2. If the dispatch is refused with the self-invocation message, the prompt may not have the correct parallel-session keywords. Re-prompt with explicit "parallel detached" wording. 3. If `opencode session export "$SID"` fails, confirm the session id was captured correctly and that the runtime's shared DB at `~/.local/share/opencode/opencode.db` is reachable. 4. If the server prints a URL other than `http://127.0.0.1:4096`, pass that URL to `--server` instead. 5. NEVER pass `--share`: it is not a `run` flag and publishes nothing. NEVER run the dispatch in the operator project tree |

### Optional Supplemental Checks

For server isolation, dispatch a second parallel detached session against the same headless server immediately after the first. Confirm both have distinct session ids AND both export independently via `opencode session export <session-id>`. This proves multiple parallel sessions can coexist on the same machine without state contention, even though they share the same underlying `opencode.db`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/integration-patterns.md` (§3 USE CASE 2: IN-OPENCODE PARALLEL DETACHED SESSION) | Use case 2 contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 "When NOT to Use" parallel-session exception, §2 self-invocation guard parallel-session keyword check, NEVER rule 2 (`--share` is not a `run` flag) |
| `../../assets/prompt-templates.md` (TEMPLATE 2: IN-OPENCODE PARALLEL DETACHED SESSION) | Canonical use case 2 prompt shape |
| `../../references/cli-reference.md` | §3 `opencode serve` and `opencode session export` subcommands, §4 `--server` flag row, §8 session persistence layout |

---

## 5. SOURCE METADATA

- Group: Parallel Detached
- Playbook ID: CO-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `parallel-detached/parallel-detached-session.md`
