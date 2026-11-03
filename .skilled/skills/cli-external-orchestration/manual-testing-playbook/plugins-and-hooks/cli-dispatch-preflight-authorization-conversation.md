---
title: "CE-P05 -- CLI Dispatch Preflight Authorization Conversation"
description: "This scenario validates Pi's dispatch preflight authorization repair for CE-P05. It focuses on requiring an explicit executor name before a direct Codex dispatch can proceed."
trigger_phrases:
  - "dispatch preflight authorization conversation"
  - "Pi dispatch authorization follow-up"
  - "CE-P05"
id: CE-P05
version: 1.0.0.0
---

# CE-P05 -- CLI Dispatch Preflight Authorization Conversation

This document captures the conversation contract and execution flow for `CE-P05`.

---

## 1. OVERVIEW

This scenario validates the Pi dispatch preflight authorization repair for `CE-P05`. It checks that the user's follow-up names the executor before Pi allows the direct Codex dispatch.

### Why This Matters

The preflight hook blocks a direct CLI dispatch when the user's request does not name its executor. A follow-up that names `cli-codex` should let the same read-only dispatch proceed and leave an audit record in the scratch project.

---

## 2. SCENARIO CONTRACT

Operators run the exact conversation and runner command for `CE-P05` and confirm each turn's shell check passes.

- Objective: Confirm Pi denies a Codex dispatch without an explicit executor name, then allows the follow-up that names `cli-codex` and records the completed dispatch.
- Real user request: Run one read-only Codex request, then repeat it after naming the executor.
- Prompt: `Run command -v codex first. If it succeeds, use Bash to run codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" -c approval_policy=never --sandbox read-only "Reply exactly READY." </dev/null and show me the result.`
- Expected execution process: The first request checks that Codex is on `PATH`, then attempts the direct dispatch without naming `cli-codex`. Pi blocks that call. The follow-up names `cli-codex` and repeats the same read-only command. Pi allows the call and its audit extension records it.
- Expected signals: Turn 1's runtime history contains `Pi dispatch denied for cli-codex. Name the matching executor in the user request.` after the send echo, and its scratch audit log has no `cli-codex` dispatch line because Pi blocks the Bash call. Turn 2's scratch audit log contains a JSONL line with `"runtime":"pi"` and `"skill":"cli-codex"`.
- Desired user-visible outcome: The unnamed dispatch does not execute. After the user names `cli-codex`, the dispatch completes and appears in the audit log.
- Pass/fail: PASS if the first turn prints the specific missing-name denial for `cli-codex` and leaves no `cli-codex` audit entry, and the authorized follow-up produces the matching audit line. FAIL if that denial is never printed, the first attempt is recorded, or the authorized follow-up does not produce the matching audit line.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run command -v codex first. If it succeeds, use Bash to run codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" -c approval_policy=never --sandbox read-only "Reply exactly READY." </dev/null and show me the result.`

### Conversation Script

```json conversation
{
  "runtimes": ["pi"],
  "setup": [
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/.pi/extensions/dispatch-preflight-lint.ts\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.pi/extensions/dispatch-audit.ts\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.skilled/hooks/dispatch/lib/dispatch-audit.mjs\" ]; then printf 'Pi dispatch fixtures are unavailable\\n'; exit 77; fi",
    "if ! command -v codex >/dev/null 2>&1; then printf 'codex CLI is unavailable\\n'; exit 77; fi",
    "CODEX_AUTH=$(codex login status 2>&1 || true); if ! printf '%s\\n' \"$CODEX_AUTH\" | grep -Eiq '(^logged in|chatgpt-oauth)'; then printf 'Codex ChatGPT OAuth is unavailable\\n'; exit 77; fi",
    "if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.openai.com/; then printf 'Codex network access is unavailable\\n'; exit 77; fi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude; fi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode; fi",
    "if [ -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ]; then cp \"$CONVERSATION_REPO_ROOT/opencode.json\" opencode.json; fi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.codex\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.codex\" .codex; fi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi; fi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.devin\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.devin\" .devin; fi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.skilled\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled; fi",
    "rm -f .skilled/logs/cli-dispatch-audit.log .skilled/logs/cli-dispatch-audit.log.1"
  ],
  "turns": [
    {
      "id": "deny-unnamed-executor",
      "send": "Run command -v codex first. If it succeeds, use Bash to run codex exec --model gpt-5.5 -c model_reasoning_effort=\"medium\" -c service_tier=\"fast\" -c approval_policy=never --sandbox read-only \"Reply exactly READY.\" </dev/null and show me the result.",
      "questions": [
        {
          "match": "[Dd]ispatch (auth|preflight)|[Rr]e-authori[sz]e|[Dd]rop the codex",
          "answer": { "select": ["Drop"] },
          "optional": true
        }
      ],
      "check": "awk 'index($0, \"Run command -v codex first.\") { after=1; next } after { tail=tail $0 \" \" } END { exit index(tail, \"Pi dispatch denied for cli-codex. Name the matching executor in the user request.\") == 0 }' \"$CONVERSATION_TURN_DIR/history.txt\" || { echo 'no denial for the unnamed cli-codex executor after the send echo'; exit 1; }; if [ -f .skilled/logs/cli-dispatch-audit.log ] && grep -Fq '\"skill\":\"cli-codex\"' .skilled/logs/cli-dispatch-audit.log; then echo 'unauthorized dispatch was recorded'; exit 1; fi; echo 'preflight denied because the user request omitted cli-codex and no dispatch was recorded'"
    },
    {
      "id": "allow-named-executor",
      "send": "Use cli-codex for the previous request. Run command -v codex first. If it succeeds, use Bash to run codex exec --model gpt-5.5 -c model_reasoning_effort=\"medium\" -c service_tier=\"fast\" -c approval_policy=never --sandbox read-only \"Reply exactly READY.\" </dev/null and show me the result.",
      "questions": [
        {
          "match": "[Ss]pec folder|[Dd]ocumentation (scope|folder|path)",
          "answer": { "reply": "D" },
          "optional": true
        }
      ],
      "check": "grep -Eq '\"runtime\":\"pi\".*\"skill\":\"cli-codex\"' .skilled/logs/cli-dispatch-audit.log"
    }
  ]
}
```

- The first `send` matches the scenario contract prompt exactly. A file-descriptor duplication redirect such as `2>&1` makes Pi's preflight classify the command as ambiguous and deny it before executor authorization is checked.
- The first check reads `history.txt` after this turn's echoed send and requires the specific denial for `cli-codex`, proving the unnamed request was rejected for missing authorization rather than an ambiguous command. An audit log that stays empty for any other reason, such as an extension that never loaded, fails the turn. The check then asserts the scratch audit log holds no `cli-codex` dispatch. The second check asserts the audit line for the authorized dispatch. Neither check writes under the repository.
- Setup reports a one-line blocker and exits `77` when the Pi fixtures, Codex CLI, ChatGPT OAuth login or network connection is missing, so no subject starts.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization-conversation.md --runtime pi --scratch <scratch-dir> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

- Turn 1 is blocked because the user named the binary but did not name the executor, so the runtime history after the send echo carries the specific `cli-codex` authorization denial and the scratch audit log has no `cli-codex` entry for that attempt.
- Turn 2 is allowed after the user names `cli-codex`.
- The scratch project's `.skilled/logs/cli-dispatch-audit.log` has a JSONL line with runtime `pi` and skill `cli-codex`.
- A missing Pi fixture, Codex CLI, ChatGPT OAuth login or network connection makes setup print one reason and exit `77`, recording `SKIP` before any subject starts.

### Evidence

The runner captures each turn's `screen.txt`, `history.txt` and `check.txt`. Turn 1's denial is read from `history.txt` because the reply can scroll the line past the visible 50 rows. Both checks read the audit log from the scratch project, so the repository stays unchanged.

### Pass / Fail

- **Pass**: Both checks exit 0. The first finds the specific missing-name denial for `cli-codex` after the send echo and finds no `cli-codex` audit entry. The second finds the Pi audit entry for the authorized `cli-codex` dispatch.
- **Skip**: Setup finds a required Pi fixture, Codex CLI, ChatGPT OAuth login or network connection unavailable, prints a one-line reason and exits `77`; no turn runs.
- **Fail**: Turn 1 prints no specific missing-name denial for `cli-codex`, meaning the preflight guard did not block for the intended reason, or Turn 1 records the blocked dispatch, or Turn 2 does not create an audit entry for the allowed dispatch.

### Failure Triage

Read the failing turn's `check.txt` and the scratch project's `.skilled/logs/cli-dispatch-audit.log`. Turn 1 should print the specific missing-name denial for `cli-codex` after its echoed send and have no line for `cli-codex`; Turn 2 should have a line recording runtime `pi` and skill `cli-codex`. When Turn 1 reports no specific denial, read its `history.txt` after the echoed send: if the dispatch ran unblocked, confirm the copied `.pi/extensions/dispatch-preflight-lint.ts` resolves through the copied `.skilled` tree, because a preflight extension that never loaded also leaves the audit log empty. When setup passed but Turn 2 failed, read only text after that turn's echoed send for an authentication or network error.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `cli-dispatch-preflight-authorization.md` | Existing in-process authorization scenario |

This plugin and hook scenario has no dedicated feature-catalog entry.

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/dispatch-preflight-lint.ts` | Pi authorization gate |
| `.pi/extensions/dispatch-audit.ts` | Pi audit extension |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Shared Pi preflight decision logic |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Runtime-neutral audit record writer |

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: CE-P05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `plugins-and-hooks/cli-dispatch-preflight-authorization-conversation.md`
