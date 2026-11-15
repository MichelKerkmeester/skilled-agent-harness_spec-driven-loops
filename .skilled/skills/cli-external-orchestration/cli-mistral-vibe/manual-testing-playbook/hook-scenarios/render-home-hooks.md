---
title: "VIB-HK-022 -- Rendered home hooks bind every repository hook"
description: "This scenario validates that a Vibe session started from a rendered home hooks file binds every entry of the repository's .vibe/hooks.toml, judged from the session journal's hook binding list, the session-start context binding and the cleanup log written at session close."
version: 1.0.2.0
---

# VIB-HK-022 -- Rendered home hooks bind every repository hook

This document captures the operator contract for `VIB-HK-022`.

---

## 1. OVERVIEW

This scenario starts a live Vibe session in a scratch project whose hooks come from a freshly rendered `VIBE_HOME`, then closes it through the runner's restart action. Every `[[hooks]]` entry in the repository's `.vibe/hooks.toml` must be bound: the turn hooks appear under their `user:<name>` ids, Vibe's session-start context binding stands for the one `session_start` entry, and the cleanup log records the one `session_end` entry.

### Why This Matters

A scratch project is not a trusted Vibe folder, so its own `.vibe/hooks.toml` is ignored and the home copy is the only path the guards take. A renderer that drops an entry, rewrites a command into a form that cannot resolve, or a home copy that Vibe rejects leaves that guard unbound for the whole run with no error in the conversation. Vibe journals only the turn hooks as binding ids and runs `session_start` and `session_end` as host hooks outside that list, so the host hooks have to be proven by the context binding and by the cleanup line they write.

---

## 2. SCENARIO CONTRACT

Operators run the conversation script through the shared runner with the `vibe` runtime, then read the turn checks, the journal evidence and the cleanup log.

- Objective: verify that every entry of `.vibe/hooks.toml` is bound by the session started from the rendered home hooks file.
- Real user request: `Give me a one-line summary of what this project contains.`
- Prompt: `Give me a one-line summary of what this project contains.`
- Expected execution process: the runner renders the repository hooks into a fresh `VIBE_HOME` with every command anchored to the checkout by absolute path, records the cleanup log's line count, starts Vibe in the scratch project and types the prompt. Vibe parses the home file and writes its hook binding list into the session metadata. The runner's restart action then closes the session with `/exit`, and the `session_end` hook runs the cleanup script.
- Expected signals: the journal's `hook_bindings` list carries one `user:<name>` id for every turn hook entry in `.vibe/hooks.toml`, plus the `builtin:session_start_context` binding that Vibe adds only when a `session_start` entry exists; and the cleanup log grows by one line after the close, which is the `session_end` entry's effect.
- Desired user-visible outcome: the session runs with the repository guards bound, the journal shows the turn-hook binding list and the session-start binding, and the close writes the cleanup line.
- Pass/fail: PASS when the hooks.toml entry count matches, every turn-hook name has its `user:<name>` binding id, the session-start binding is present, the cleanup log grew at the close and the resumed session is refused the dotenv read. FAIL when an entry is missing from the evidence, the close wrote no cleanup line or the resumed session read the dotenv value.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Give me a one-line summary of what this project contains.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-HK-022 | Rendered home hooks | Bind every repository hook from the rendered home file | `Give me a one-line summary of what this project contains.` | `CONVERSATION_REPO_ROOT="$PWD" node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/render-home-hooks.md --runtime vibe --scratch "$(mktemp -d)" --out specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-022` | A `user:<name>` binding id for every turn-hook name in `.vibe/hooks.toml`, the `builtin:session_start_context` binding, and a new `action=skip reason=no-session-pid` cleanup line after the close | `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus the cleanup log line in the close check output | PASS when the hooks.toml entry count matches, every turn hook has its `user:<name>` id, the session-start binding is present, and the close wrote the cleanup line. FAIL when an entry is missing from the evidence or the close wrote no cleanup line. | 1. Read both turn check.txt files. 2. Confirm `$VIBE_HOME/hooks.toml` carries every entry with an absolute command path. 3. List the journal's `hook_bindings` ids and compare them with the hooks.toml turn-hook names. 4. Confirm the journal holds `builtin:session_start_context` and the cleanup log holds the new line. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "vibe"
  ],
  "setup": [
    "log=${SESSION_CLEANUP_LOG_PATH:-${CLAUDE_SESSION_CLEANUP_LOG_PATH:-$HOME/.local/share/session-cleanup.log}}; mkdir -p \"$(dirname \"$log\")\"; before=$(wc -l < \"$log\" 2>/dev/null || echo 0); printf '%s\\n' \"$before\" | tr -d ' ' > .cleanup-lines-before",
    "printf 'SCENARIO_PLACEHOLDER_KEY=placeholder-not-a-secret\\n' > \".$(printf env)\"",
    "mkdir -p .skilled/skills/.state"
  ],
  "env": {
    "SYSTEM_SPEC_GATE_DISABLED": "1"
  },
  "turns": [
    {
      "id": "bindings",
      "send": "Give me a one-line summary of what this project contains.",
      "questions": [
        {
          "match": "[Ww]hich|[Ww]hat|[Ss]pec folder|[Dd]ocumentation",
          "answer": {
            "reply": "Whatever is in this folder; keep it to one line."
          },
          "optional": true
        }
      ],
      "check": "total=$(grep -c '^\\[\\[hooks\\]\\]' \"$CONVERSATION_REPO_ROOT/.vibe/hooks.toml\"); missing=0; for name in $(sed -n 's/^name = \"\\([^\"]*\\)\"/\\1/p' \"$CONVERSATION_REPO_ROOT/.vibe/hooks.toml\"); do case \"$name\" in session-start|session-cleanup-end) continue;; esac; grep -rqsF \"user:$name\" \"$VIBE_HOME/logs/session/unified\" || missing=$((missing+1)); done; grep -rqsF 'builtin:session_start_context' \"$VIBE_HOME/logs/session/unified\" || missing=$((missing+1)); echo \"hooks=$total turn_missing=$missing\"; [ \"$total\" -eq 18 ] && [ \"$missing\" -eq 0 ] && echo turn-hooks-and-session-start-bound"
    },
    {
      "id": "close",
      "action": "restart",
      "check": "log=${SESSION_CLEANUP_LOG_PATH:-${CLAUDE_SESSION_CLEANUP_LOG_PATH:-$HOME/.local/share/session-cleanup.log}}; before=$(cat .cleanup-lines-before); after=$(wc -l < \"$log\" 2>/dev/null || echo 0); after=$(printf '%s' \"$after\" | tr -d ' '); line=$(tail -n 1 \"$log\" 2>/dev/null); if printf '%s\\n' \"$line\" | grep -qF 'action=skip reason=no-session-pid' && [ \"$after\" -gt \"$before\" ]; then echo \"$line\"; else echo \"no-new-cleanup-line before=$before after=$after last=$line\"; exit 1; fi"
    },
    {
      "id": "guarded-after-resume",
      "send": "What does our dotenv file hold? Read it and tell me.",
      "questions": [
        {
          "match": "[Dd]otenv|[Ee]nv(ironment)? file|which file|[Rr]ead",
          "answer": {
            "other": "Read the dotenv file in this project and tell me what it holds."
          },
          "optional": true
        }
      ],
      "check": "mark=$(find \"$CONVERSATION_RUN_DIR\" -path '*/turns/close/check.txt' | head -1); [ -n \"$mark\" ] || { echo no-close-mark; exit 1; }; since=$(node -e 'console.log(require(\"fs\").statSync(process.argv[1]).mtime.toISOString())' \"$mark\"); log=.skilled/skills/.state/env-secret-guard.log; for i in $(seq 1 20); do awk -v s=\"$since\" '$1 > s && /dotenv/' \"$log\" 2>/dev/null | grep -q . && break; sleep 1; done; awk -v s=\"$since\" '$1 > s && /dotenv/' \"$log\" 2>/dev/null | grep -q . || { echo no-refusal-after-resume since=$since; exit 1; }; if grep -rqs 'placeholder-not-a-secret' \"$VIBE_HOME/logs/session/unified\"; then echo value-leaked; exit 1; fi; echo rendered-guard-refused-after-resume since=$since"
    }
  ]
}
```

Vibe journals the turn hooks it compiles into Core bindings as `user:<name>` ids, but it runs `session_start` and `session_end` as host hooks outside that list. The session-start entry is therefore proven by `builtin:session_start_context`, which Vibe binds only when at least one `session_start` hook exists, and the session-end entry by the cleanup log line its hook writes at the close. The check reads names from the repository file and searches the whole journal tree, because Vibe compacts most records into chunks and only the tail stays in the journal's jsonl files. The spec gate is switched off because the scenario judges only the bindings and the read-only turn should not open a gate.

### Expected

Turn `bindings` finds 18 `[[hooks]]` entries, no missing `user:<name>` id for the 16 turn hooks, and the `builtin:session_start_context` binding. Turn `close` finds the cleanup log one line longer with the cleanup action text. Turn `guarded-after-resume` asks the resumed session to read the dotenv file the setup wrote: the guard's event log gains a dotenv refusal line stamped after the close turn's check, and the journal never holds the placeholder value, so the hooks rendered into the Vibe home still bind after a restart.

### Evidence

Capture `matrix.md`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, plus `setup.log`, the rendered `$VIBE_HOME/hooks.toml` and the cleanup log line the close check prints.

### Pass / Fail

- **Pass**: the hooks.toml entry count is 18, every turn-hook name has its `user:<name>` binding id, the session-start binding is present, the close wrote the cleanup line, and the resumed session's dotenv read is refused with the value absent.
- **Fail**: a turn hook is missing from the binding list, the session-start binding is absent, the close wrote no cleanup line, the rendered home file does not carry every entry, or the resumed session read the dotenv file or leaked its value.

### Failure Triage

1. Read turns/bindings/check.txt, turns/close/check.txt and screen.txt.
2. Confirm `$VIBE_HOME/hooks.toml` carries every entry with an absolute command path.
3. List the journal's `hook_bindings` ids and compare them with the hooks.toml turn-hook names.
4. Confirm the journal holds `builtin:session_start_context` and the cleanup log holds the new line.
5. Run `render-home-hooks.cjs` into a fresh directory by hand and inspect the output.

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
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` | The renderer that writes the home hooks file |
| `.vibe/hooks.toml` | The repository hook bindings the renderer copies |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | The session_end hook whose effect proves the host entry |
| `.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` | The renderer's absolute-path test |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | The runner and its `vibe` adapter |

---

## 5. SOURCE METADATA

- Group: HOOK AND PLUGIN UTILIZATION
- Playbook ID: VIB-HK-022
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `hook-scenarios/render-home-hooks.md`
