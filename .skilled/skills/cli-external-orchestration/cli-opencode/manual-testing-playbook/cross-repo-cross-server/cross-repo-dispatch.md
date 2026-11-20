---
title: "CO-029 -- Cross-repo dispatch from the spawn directory"
description: "This scenario validates cross-repo dispatch for `CO-029`. It focuses on confirming a dispatch started in another repo's directory targets that repo's plugin / skill / MCP runtime without leaving the calling session."
version: 1.4.12.0
---

# CO-029 -- Cross-repo dispatch from the spawn directory

**Version note.** The commands in this scenario target OpenCode 2 (2.3.2). `run` has no directory flag, so the spawn directory carries the working directory: `cd <other-repo-path> && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "<prompt>"`. Check that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first; `llmgateway/deepseek-v4.1-flash-1017` is the default, while `opencode-go/` stays selectable and needs its own login (`opencode auth login opencode-go`).

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-029`.

---

## 1. OVERVIEW

This scenario validates cross-repo dispatch for `CO-029`. It focuses on confirming that starting the dispatch in `<other-repo-path>` (per `references/opencode-tools.md` §6 + `references/cli-reference.md` §4) successfully targets a different repository's plugin / skill / MCP runtime when the calling session is in a different repo or in a fresh shell.

### Why This Matters

Cross-repo dispatch is one of the unique value props of cli-opencode (per `references/opencode-tools.md` §7, where sibling cli-* skills' binaries have no equivalent). It enables a calling AI in repo A to dispatch into repo B's runtime without leaving session A. If the spawn directory does not actually pin the dispatched session's CWD to the target repo (or silently uses the caller's CWD), cross-repo workflows regress. This test confirms the cross-repo contract by dispatching from a sibling location and verifying the dispatched session sees that path as its working directory.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-029` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the spawn directory targets a different repository path so the dispatched session reports the cross-repo path as its working directory and lists files from that repo (not the caller's repo).
- Real user request: `From <repo-root> (or fresh shell), start opencode in a sibling repo path (or any other valid repo path on the machine) and have the session list the top-level files. Confirm the listing matches the cross-repo path, not the caller's repo.`
- Prompt: `Start opencode in another valid repo path; verify the session lists that path, not <repo-root>.`
- Expected execution process: The external-AI orchestrator picks a different valid directory on the machine (the parent of `$(pwd)` is a safe choice, typically containing the operator's repo plus sibling repos), dispatches from `<that-path>` and asks the dispatched session to list its working directory contents. Validates the listing matches the cross-repo path.
- Expected signals: Dispatch exits 0. The dispatched session response references the cross-repo path or files unique to it. The response does NOT name files unique to the operator's repo as the working dir. Runtime under 90 seconds.
- Desired user-visible outcome: Verdict naming the cross-repo path and at least one file the session listed.
- Pass/fail: PASS if exit 0 AND response references files from the cross-repo path AND not files from the operator's repo. FAIL if response says it sees the operator's repo or fails to list cross-repo files.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pick a valid different directory (the parent of `$(pwd)` is safe and reachable).
3. In ONE shell invocation: derive `PARENT`/`PARENT_BASENAME`, dispatch from `"$PARENT"` with a list-top-files prompt, and capture the dispatch's own exit status immediately (`status=$?`) before running any other command. A later, separate shell would see `PARENT`/`PARENT_BASENAME` empty and `$?` would report an unrelated command's status, not the dispatch's.
4. Inspect the response for the cross-repo path or its files.
5. Return a verdict naming the path and one listed file.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-029 | Cross-repo dispatch from the spawn directory | Confirm that starting the dispatch in `<other-repo-path>` targets a different repo's runtime and the dispatched session reports that path as CWD | `Start opencode in another valid repo path; verify the session lists that path, not <repo-root>.` | 1. `bash: PARENT=$(dirname "$(pwd)"); PARENT_BASENAME="$(basename "$PARENT")"; echo "Cross-repo target: $PARENT (basename=$PARENT_BASENAME)"; ls -1 "$PARENT" \| head -5; cd "$PARENT" && opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Use the bash tool to run \`pwd\` and \`ls -1 \| head -5\`. In your final reply, name the working directory exactly as pwd printed it and list the top 5 entries you saw." > /tmp/co-029-events.jsonl 2>&1 </dev/null; status=$?; echo "Exit: $status"` -> 2. `bash: jq -r 'select(.type == "tool_use" or .type == "text") \| (.part.state.output // .part.text)' /tmp/co-029-events.jsonl \| grep -ci "$PARENT_BASENAME"` -> 3. `bash: jq -r 'select(.type == "tool_use" or .type == "text") \| (.part.state.output // .part.text)' /tmp/co-029-events.jsonl \| grep -ciE '(\.skilled/skill\|cli-opencode/SKILL\.md)'` | Step 1 (single shell): PARENT/PARENT_BASENAME derived and listed. Events captured. `Exit: 0` reflects the dispatch's OWN status, captured in the same shell before any other command could overwrite `$?`. Step 2: count of `$PARENT_BASENAME` references >= 1 (the cross-repo path appeared), so re-derive `PARENT_BASENAME` if running this step in a fresh shell. Step 3: count of operator-repo-only file references = 0 (the dispatched session is NOT seeing the operator repo as its CWD) | `/tmp/co-029-events.jsonl`, terminal listings (PARENT + PARENT_BASENAME), grep counts | PASS if exit 0 AND cross-repo path referenced AND zero operator-repo-only file references in the listing. FAIL if response says CWD is the operator repo or fails to list cross-repo files | 1. If the response says CWD is the operator repo, the binary may be ignoring the spawn directory. File a regression bug. 2. If the response is generic (no listing), re-prompt with stronger explicit "use the bash tool" instruction. 3. If the cross-repo target does not exist, swap to another known-good directory like `~` or `/tmp` (note: `/tmp` will not have plugins, but the CWD test still works). 4. If `PARENT`/`PARENT_BASENAME` are empty in a later step, re-derive them or re-run step 1 as one shell block, because playbook steps do not share shell state. 5. Confirm `opencode --version` reports a major-2 build, since `run` has no directory flag |

### Optional Supplemental Checks

For full cross-repo plugin verification, dispatch from a real second repo (e.g., a sibling Barter repo if available) and ask the session to list its plugins/skills. Confirm the listing includes plugins/skills unique to that second repo, NOT plugins/skills from the operator's repo. This proves the entire plugin/skill/MCP runtime is loaded from the spawn directory, not the caller's CWD.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/opencode-tools.md` (§6 CROSS-REPO DISPATCH) | Documents the cross-repo capability |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §1 activation triggers (cross-repo dispatch), §3 default invocation shape |
| `../../references/cli-reference.md` (§4 flag table, which lists no directory flag on `run`) | Flag documentation |

---

## 5. SOURCE METADATA

- Group: Cross-Repo and Cross-Server
- Playbook ID: CO-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cross-repo-cross-server/cross-repo-dispatch.md`
