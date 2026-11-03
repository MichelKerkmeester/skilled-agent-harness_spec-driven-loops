---
title: "PI-023 -- Session-lifecycle bridges across compaction"
description: "This scenario validates Pi session context recovery after compaction for `PI-023`. It checks the compact hook record and a later marker recall."
stage: routing
id: "PI-023"
version: 1.0.1.0
---

# PI-023 -- Session-lifecycle bridges across compaction

This document captures the conversation contract, current behavior, execution flow, source anchors and metadata for `PI-023`.

---

## 1. OVERVIEW

This scenario validates Pi's `session_compact` recovery bridge for `PI-023`. It focuses on the custom message recorded during compaction and the follow-up's access to earlier session state.

### Why This Matters

Pi only fires `session_compact` during an interactive session. A later reply that recalls the marker shows whether the compacted session kept useful state.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `PI-023` and check the session record and follow-up response.

- Objective: Confirm `/compact` records the `session-compact-context` custom message and a follow-up can retrieve a marker from before compaction.
- Real user request: `Keep this marker through compaction, then tell me what it was.`
- Prompt: `Remember this exact session marker for after compaction: birch-signal-29. Give me a 60-item checklist for preserving session decisions, with two concise sentences per item, then finish by repeating the marker. Keep it available for my follow-up.`
- Expected execution process: Setup confirms the session-hook fixture and Pi login, creates or copies `.pi`, merges `compaction.keepRecentTokens: 200` into `.pi/settings.json` while preserving existing keys, copies `.skilled`, and records `.pi-run-start` last. The subject then uses Pi's normal agent directory with the runner's unique session ID, receives a substantial request, compacts the session, has this run's session JSONL checked for the custom message, and is asked to recall the marker.
- Expected signals: The first response contains `birch-signal-29`; Pi's session history contains `session-compact-context`; the post-compaction response contains the same marker.
- Desired user-visible outcome: A concise confirmation that the session compacted and retained the requested marker.
- Pass/fail: PASS if the custom message appears in the session history and the post-compaction response contains the marker after its send. FAIL if compaction does not record the message or the follow-up loses the marker. SKIP from setup if the session-hook fixture or Pi login is unavailable; record the one-line blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Remember this exact session marker for after compaction: birch-signal-29. Give me a 60-item checklist for preserving session decisions, with two concise sentences per item, then finish by repeating the marker. Keep it available for my follow-up.`

### Conversation Script

```json conversation
{
  "runtimes": ["pi"],
  "setup": [
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/.pi/extensions/session-compact-context.ts\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts\" ]; then printf '%s\\n' 'Pi session-hook fixture unavailable'; exit 77; fi",
    "if [ ! -s \"${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/auth.json\" ] && ! env | grep -q '_API_KEY=.'; then printf '%s\\n' 'Pi login unavailable: no auth.json or provider API key'; exit 77; fi",
    "mkdir -p .pi",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.pi/.\" .pi/; fi",
    "node -e 'const fs = require(\"node:fs\"); const path = \".pi/settings.json\"; const settings = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, \"utf8\")) : {}; settings.compaction = Object.assign({}, settings.compaction, { keepRecentTokens: 200 }); fs.writeFileSync(path, JSON.stringify(settings, null, 2) + \"\\n\");'",
    "if [ -d \"$CONVERSATION_REPO_ROOT/.skilled\" ]; then cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled; fi",
    "touch .pi-run-start"
  ],
  "turns": [
    {
      "id": "marker-seed",
      "send": "Remember this exact session marker for after compaction: birch-signal-29. Give me a 60-item checklist for preserving session decisions, with two concise sentences per item, then finish by repeating the marker. Keep it available for my follow-up.",
      "check": "awk 'index($0, \"Remember this exact session marker\") && index($0, \"60-item checklist\") { after=1; next } after && index($0, \"birch-signal-29\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/history.txt\""
    },
    {
      "id": "compact",
      "action": "compact",
      "check": "session_dir=\"${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/sessions\"; test -d \"$session_dir\" && find \"$session_dir\" -type f -name '*.jsonl' -newer .pi-run-start -exec sh -c 'grep -qF \"birch-signal-29\" \"$1\" && grep -qF \"session-compact-context\" \"$1\"' sh {} \\; -print | grep -q ."
    },
    {
      "id": "marker-recall",
      "send": "What exact session marker did I ask you to keep for after compaction? Reply with only the marker.",
      "check": "awk 'index($0, \"Reply with only the marker.\") { after=1; next } after && index($0, \"birch-signal-29\") { found=1; exit } END { exit !found }' \"$CONVERSATION_TURN_DIR/screen.txt\""
    }
  ]
}
```

- The first `send` matches the contract prompt exactly.
- Setup skips the runtime with a one-line blocker when the session-hook fixture or Pi login is missing, so no subject starts.
- After creating or copying `.pi`, setup uses Node to merge `compaction.keepRecentTokens: 200` into `.pi/settings.json`, preserving existing top-level and `compaction` keys.
- Setup writes `.pi-run-start` in the scratch project last, so the compaction check only reads session JSONL written by this run rather than a session left by an earlier one.
- The marker-seed check reads `history.txt`, because the 60-item reply scrolls the send echo past the 50-row `screen.txt`; it starts matching after the echoed send, so the prompt's own marker cannot satisfy it.
- The compaction check reads only session JSONL under Pi's normal agent directory that is newer than `.pi-run-start`.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges-conversation.md --runtime pi --scratch <scratch-dir-outside-repository> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

Pi's session history contains the `session-compact-context` custom message in the same session as the marker prompt, and the follow-up reply contains `birch-signal-29` after its send echo.

### Evidence

Use the marker-seed `history.txt`, the marker-recall `screen.txt`, and the session JSONL under Pi's normal agent directory that was written after `.pi-run-start` and contains both the marker and `session-compact-context`.

### Pass / Fail

- **Pass**: The compact turn finds the custom message in session history, and the follow-up reply contains `birch-signal-29` after its current send echo.
- **Fail**: The compact event is absent from the session history, the runtime refuses to compact the populated session, or the follow-up screen does not contain the marker.
- **Skip**: Setup reports the session-hook fixture or Pi login missing. Setup prints a one-line blocker and exits 77, so the subject never starts.

### Failure Triage

Confirm that the copied `.pi/extensions/session-compact-context.ts` symlink resolves through the copied `.skilled` tree; setup already reports a missing fixture or login as a skip. If `/compact` reports that the session is too small, confirm `.pi/settings.json` has `compaction.keepRecentTokens: 200`; if it does, increase the checklist response in the prompt and rerun in a fresh scratch project. If the compact turn finds no session file, confirm `.pi-run-start` exists in the scratch project: a session older than that timestamp is ignored on purpose, so a stale session cannot pass the check. If the marker-seed check fails, read its `history.txt`: the check ignores the echoed send, so a miss means the reply never repeated the marker. If the event is present but recall fails, inspect the compacted summary in that same session JSONL.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-023 | Session-lifecycle bridges across compaction | Preserve a session marker across compaction | `Remember this exact session marker for after compaction: birch-signal-29. Give me a 60-item checklist for preserving session decisions, with two concise sentences per item, then finish by repeating the marker. Keep it available for my follow-up.` | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges-conversation.md --runtime pi --scratch <scratch-dir-outside-repository> --out <evidence-dir>` | The session JSONL contains `session-compact-context` and the post-compaction reply returns `birch-signal-29` after its send echo | Turn history and screen files plus Pi session JSONL | PASS if both signals appear; FAIL if either is absent or compaction refuses the populated session; SKIP from setup if the fixture or Pi login is unavailable | Check the copied extension symlink and confirm .pi/settings.json sets compaction.keepRecentTokens to 200. If Pi still reports that the session is too small, increase the response size. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `hook-extension-layer/session-lifecycle-bridges.md` | Existing command-level coverage and the interactive-only compaction boundary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Handles Pi's `session_compact` event and records the custom recovery message |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Shared compaction lifecycle regression coverage |

---

## 5. SOURCE METADATA

- Group: Hook Extension Layer
- Playbook ID: PI-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hook-extension-layer/session-lifecycle-bridges-conversation.md`
