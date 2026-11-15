---
title: "VIB-HK-021 -- Session cleanup writes its log line when the session closes"
description: "This scenario validates that closing a Vibe session runs the session-cleanup-end session_end hook, which writes the cleanup script's log line, judged from the cleanup log the hook writes."
version: 1.0.3.0
---

# VIB-HK-021 -- Session cleanup writes its log line when the session closes

This document captures the operator contract for `VIB-HK-021`.

---

## 1. OVERVIEW

This scenario asks a live Vibe session one small read-only question, then closes it through the runner's restart action. The `session-cleanup-end` `session_end` hook must run the shared cleanup script, which appends its log line at session end.

### Why This Matters

A Vibe `session_end` hook runs in the background and its output is ignored, so a broken binding or a hook that never fires leaves no trace in the conversation. The cleanup log line is the only durable evidence that teardown ran, and a missing line means stale session state is never swept.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks and the cleanup log.

- Objective: verify that closing the session runs `session-cleanup-end` and appends the cleanup script's log line.
- Real user request: `Tell me in one sentence what this project contains.`
- Prompt: `Tell me in one sentence what this project contains.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME`, records the cleanup log's line count, starts Vibe in the scratch project, and types the prompt. The runner's restart action then sends `/exit`, waits for the session to close, and starts a resumed subject. The `session_end` hook runs the cleanup script on the way out.
- Expected signals: the cleanup log gains a line after the close whose text is `action=skip reason=no-session-pid`, and the first turn's journal names `user:turn-start`.
- Desired user-visible outcome: the resumed session opens normally, and the cleanup log records that teardown ran for the closed session.
- Pass/fail: PASS when the log's line count grew, its newest line carries the cleanup action text and the resumed session still holds the earlier question. FAIL when the count did not grow, the newest line is not the cleanup line or the resumed session lost the question.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Tell me in one sentence what this project contains.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-021 | Session cleanup end | Write the cleanup log line when the session closes | `Tell me in one sentence what this project contains.` | `CONVERSATION_REPO_ROOT="$PWD" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/session-cleanup-end.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-021` | The cleanup log grows and its newest line reads `action=skip reason=no-session-pid`; the first turn's journal names `user:turn-start` | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus the cleanup log line in the check output | PASS when the log's line count grew after the close and its newest line carries the cleanup action text. FAIL when the count did not grow or the newest line is not the cleanup line. | 1. Read the close turn's check.txt. 2. Confirm `$VIBE_HOME/hooks.toml` lists `session-cleanup-end` at `session_end`. 3. Confirm the cleanup log path the plugin uses is the one the check reads. 4. Pipe a `session_end` payload into `.vibe/plugins/repo-guards/session-cleanup.mjs` and read the log. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "log=/private/tmp/vib-hk-021-session-cleanup.log; mkdir -p \"$(dirname \"$log\")\"; before=$(wc -l < \"$log\" 2>/dev/null || echo 0); printf '%s\\n' \"$before\" | tr -d ' ' > .cleanup-lines-before"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1",
    "SESSION_CLEANUP_LOG_PATH": "/private/tmp/vib-hk-021-session-cleanup.log"
  },
  "turns": [
    {
      "id": "request",
      "send": "Tell me in one sentence what this project contains.",
      "questions": [
        {
          "match": "[Ww]hich|[Ww]hat|[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "reply": "Whatever is in this folder; keep it to one sentence."
          },
          "optional": true
        }
      ],
      "check": "grep -rqsF 'user:turn-start' \"$VIBE_HOME/logs/session/unified\" && echo turn-start-bound"
    },
    {
      "id": "close",
      "action": "restart",
      "check": "log=${SESSION_CLEANUP_LOG_PATH:-${CLAUDE_SESSION_CLEANUP_LOG_PATH:-$HOME/.local/share/session-cleanup.log}}; before=$(cat .cleanup-lines-before); after=$(wc -l < \"$log\" 2>/dev/null || echo 0); after=$(printf '%s' \"$after\" | tr -d ' '); line=$(tail -n 1 \"$log\" 2>/dev/null); if printf '%s\\n' \"$line\" | grep -qF 'action=skip reason=no-session-pid' && [ \"$after\" -gt \"$before\" ]; then echo \"$line\"; else echo \"no-new-cleanup-line before=$before after=$after last=$line\"; exit 1; fi"
    },
    {
      "id": "resumed",
      "send": "Write the question I asked you before the restart into prev.txt in this folder, as one line.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation|[Ww]hich",
          "answer": {
            "other": "Just write prev.txt."
          },
          "optional": true
        }
      ],
      "check": "test -s prev.txt || { echo no-prev-file; exit 1; }; grep -qi 'project' prev.txt || { echo resumed-session-lost-history; exit 1; }; echo \"resumed-with-history: $(head -c 160 prev.txt)\""
    }
  ]
}
```

The cleanup log path follows the plugin's own override chain, so a run with `SESSION_CLEANUP_LOG_PATH` or its Claude alias set reads the same file the plugin writes. The script points `SESSION_CLEANUP_LOG_PATH` at a log of its own under `/private/tmp`, and the setup line names the same path, because the setup step runs without the script environment. A machine-wide log would let another session's line match the close check, or push this session's line out of the last position. Setup records the line count before Vibe starts, which is what lets the close check attribute the new line to this session rather than to an older entry. The runner's restart action closes the first session with `/exit` and then resumes it, so the check runs after the `session_end` hook has had its close grace. The spec gate is switched off because the scenario judges only the teardown hook.

### Expected

Turn `request` shows the session journal carries the `turn-start` binding. Turn `close` finds the cleanup log one line longer and its newest line is `action=skip reason=no-session-pid`. Turn `resumed` runs in the resumed session and asks for the first question to be written into `prev.txt`: the file names the project question, so the session-end hook closed the first process without losing the conversation the resume carries on.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log` and the cleanup log line the close check prints.

### Pass / Fail

- **Pass**: the log's line count grew after the close, the newest line carries the cleanup action text, and the resumed session writes the earlier question into `prev.txt`.
- **Fail**: the count did not grow, the newest line is not the cleanup line, the session never closed, or the resumed session lost the earlier question.

### Failure Triage

1. Read turns/close/check.txt and screen.txt.
2. Confirm the rendered `$VIBE_HOME/hooks.toml` lists `session-cleanup-end` at `session_end`.
3. Confirm the check and the plugin resolve the same cleanup log path.
4. Pipe a `session_end` payload into `.vibe/plugins/repo-guards/session-cleanup.mjs` and read the log.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`guards-and-hooks.md`](../../references/guards-and-hooks.md) | Vibe hook and plugin classification |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | The session_end hook under test |
| `.opencode/plugins/session-cleanup.js` | The shared cleanup plugin whose dispose runs the cleanup script |
| `.skilled/scripts/session-cleanup.sh` | The cleanup script that appends the log line |
| `.vibe/hooks.toml` | The hook binding |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-021
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/session-cleanup-end.md`
