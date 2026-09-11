---
title: "CP-003 Global Disable Flag"
description: "Manual validation that SPECKIT_SKILL_ADVISOR_HOOK_DISABLED disables all advisor prompt surfaces."
trigger_phrases:
  - "cp-003"
  - "global disable flag"
  - "global disable"
  - "global"
version: 0.8.0.13
id: CP-003
category: compat_and_disable
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# CP-003 Global Disable Flag

Prompt: Manual validation that SPECKIT_SKILL_ADVISOR_HOOK_DISABLED disables all advisor prompt surfaces.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the common disable flag across the native CLI, Python shim, runtime hooks and OpenCode plugin.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Advisor runtime build is current.
- Capture env and command output.

---

## 3. TEST EXECUTION

1. Native CLI (isolate both the socket and the DB so a cold daemon starts and inherits the flag):

```bash
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX)
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 \
  node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
rm -rf "$SANDBOX"
```

2. Python shim:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
```

3. OpenCode plugin:

```bash
npm --prefix .opencode/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"
```

4. One hook adapter:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .opencode/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js
```

### Expected Signals

- Native `advisor_recommend` returns `recommendations: []`, `freshness: "unavailable"` and `ADVISOR_DISABLED`.
- Python shim returns `[]` or prompt-safe disabled output without native scoring.
- OpenCode plugin returns disabled/skipped output without invoking the advisor (covered by the plugin test's env opt-out case).
- Hook adapter returns `{}` with skipped diagnostic.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Any surface still recommends a skill | Non-empty recommendation under disabled env | Block release. |
| Disabled response includes prompt text | Search captured output for prompt literal | Block release. |
| Plugin only honors legacy env | New flag has no effect | Update the plugin after code approval. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- `.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.opencode/plugins/system-skill-advisor.js`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-003
- Canonical root source: manual-testing-playbook.md
- Feature file path: compat-and-disable/global-disable-flag.md
