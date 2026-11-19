---
title: "CO-003 -- Working directory from the spawn directory"
description: "This scenario validates the spawn directory for `CO-003`. It focuses on confirming the dispatched session's working directory matches the directory the dispatch started in, so the session loads the correct repository's plugins, skills, and MCP servers."
version: 1.4.11.0
---

# CO-003 -- Working directory from the spawn directory

**Version note.** These commands target OpenCode 2 (2.3.2). `run` has no directory flag, so the spawn directory carries the working directory: `cd <repo-root> && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "<prompt>" </dev/null`. Check that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first; `llmgateway/deepseek-v4.1-flash-1017` is the default, while `opencode-go/` stays selectable and needs its own login (`opencode auth login opencode-go`).

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-003`.

---

## 1. OVERVIEW

This scenario validates the spawn directory as the working directory for `CO-003`. It focuses on confirming that starting the dispatch in a directory pins the dispatched OpenCode session's working directory, and that the session loads plugins, skills and MCP servers from that path rather than the caller's CWD.

### Why This Matters

The cli-opencode default invocation always starts the dispatch in the repo root to avoid CWD ambiguity (per SKILL.md §3 "Default Invocation"). If the spawn directory is silently ignored or overridden by the caller's CWD, cross-repo dispatch (use case from CO-029) silently breaks and the dispatched session loads the wrong project's plugins. This is the foundational test that proves the spawn directory pins the CWD inside the dispatched session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the spawn directory pins the dispatched session's working directory so a `pwd`-equivalent inside the session returns that path, not the caller's CWD.
- Real user request: `Run opencode from /tmp but start the dispatch in the Public repo, and have OpenCode tell me which directory it sees as its working dir. Confirm it matches the repo path.`
- Prompt: `From /tmp, start opencode in <repo-root>; verify the session reports that directory, not /tmp.`
- Expected execution process: The external-AI orchestrator captures the operator's repo root via `REPO_ROOT="$(pwd)"`, runs `cd /tmp` (or otherwise changes the parent shell's CWD), dispatches from `"$REPO_ROOT"` with a prompt that asks the session to surface its working directory, then validates the response references the captured `REPO_ROOT` rather than `/tmp`.
- Expected signals: Dispatch exits 0. The session response references the Public repo path or names project-specific files like `AGENTS.md`, `opencode.json` or `.skilled/`. The response does NOT mention `/tmp` as the working directory.
- Desired user-visible outcome: Verdict naming the observed working directory and confirming it matches the spawn directory.
- Pass/fail: PASS if exit 0 AND response names the spawn directory or project-specific files AND does not name `/tmp`. FAIL if response says it sees `/tmp` or fails to surface the spawn path.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Change parent shell CWD to `/tmp` so the difference is observable.
3. Dispatch from `<Public-repo-root>` with a prompt that asks the session to print its working directory and list a few entries.
4. Inspect the session's reply for the spawn path or project-specific markers.
5. Return a verdict naming the observed working directory.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-003 | Working directory from the spawn directory | Confirm the spawn directory pins the dispatched session's working directory rather than inheriting the caller's CWD | `From /tmp, start opencode in <repo-root>; verify the session reports that directory, not /tmp.` | 1. `bash: REPO_ROOT="$(pwd)" && REPO_BASENAME="$(basename "$REPO_ROOT")" && cd /tmp && pwd && echo "REPO_ROOT=$REPO_ROOT REPO_BASENAME=$REPO_BASENAME"` -> 2. `bash: cd "$REPO_ROOT" && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Use the shell tool to run \`pwd\` and \`ls -1 \| head -3\`. In your final reply, name the working directory exactly as pwd printed it." > /tmp/co-003-events.jsonl 2>&1 </dev/null` -> 3. `bash: echo "Exit: $?"` -> 4. `bash: jq -r 'select(.type == "tool_use") \| .part.state.output' /tmp/co-003-events.jsonl \| grep -c "$REPO_BASENAME"` -> 5. `bash: jq -r 'select(.type == "tool_use") \| .part.state.output' /tmp/co-003-events.jsonl \| grep -c "/tmp"` | Step 1: REPO_ROOT captured (must equal the operator's project root) and parent CWD changed to `/tmp`. Step 2: events captured non-empty. Step 3: exit 0. Step 4: count of `$REPO_BASENAME` references >= 1 (the dispatched session sees the spawn path). Step 5: count of `/tmp` references = 0 in `tool_use` output (the parent CWD did not leak in) | `/tmp/co-003-events.jsonl`, terminal transcript including parent CWD before dispatch and the captured REPO_ROOT/REPO_BASENAME | PASS if exit 0 AND spawn path basename appears in `tool_use` output AND `/tmp` does not appear in that output. FAIL if dispatched session reports CWD as `/tmp` or fails to surface the spawn path | 1. Confirm the dispatch starts in the target directory: `run` has no directory flag, so the `cd` is the only thing that sets it. 2. Run `opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null` and confirm no directory flag is listed (drift handled per `references/cli-reference.md` §9). 3. If the session's shell tool prints `/tmp`, the binary may be inheriting the parent CWD. File a bug and fall back to running from the repo root directly. |

### Optional Supplemental Checks

For cross-repo verification, repeat the test starting in `<other-repo-root>` (any other repo on the machine, captured into a `OTHER_REPO_ROOT` variable on the operator side) and confirm the dispatched session reports the second repo's path: `cd "$OTHER_REPO_ROOT" && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "<prompt>" </dev/null`. This is the foundation for the cross-repo dispatch tested in CO-029.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§4 flag table, which lists no directory flag on `run`) | Documents the working directory contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 3 (start the dispatch in the repo root) and §3 default invocation shape |
| `../../references/opencode-tools.md` (§6 Cross-Repo Dispatch) | Documents the cross-repo capability that depends on this pinning |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CO-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/dir-flag-working-directory.md`
