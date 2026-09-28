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
- Never stop the live daemon. Step 1's teardown sends no signal. Its sandbox daemon exits on a 12-second idle timeout, and the block removes the sandbox only once the lease, the socket and every open file in it are gone.

---

## 3. TEST EXECUTION

1. Native CLI (isolate both the socket and the DB so a cold daemon starts and inherits the flag). The cold start leaves a sandbox launcher and daemon running, and a daemon that outlives its sandbox recreates the folder the next time it writes to it. The block sends no signal. It gives the sandbox daemon a 12-second idle timeout. It then waits until the lease file is gone, the socket folder is empty, no process holds a file open in the sandbox and at least 25 seconds have passed, which outlasts the idle timeout and its six-second check. Only then does it remove the sandbox. The open-file test covers a launcher that crashes, because a crashing launcher deletes its lease without waiting for its daemon, and the daemon keeps its database open until it exits:

```bash
SANDBOX=$(mktemp -d /tmp/cp003.XXXXXX)
SYSTEM_SKILL_ADVISOR_DB_DIR="$SANDBOX/db" SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock" \
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2 \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" \
  --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
sandbox_advisor_running() {
  [ -e "$SANDBOX/db/.system-skill-advisor-launcher.json" ] || [ -n "$(ls -A "$SANDBOX/sock" 2>/dev/null)" ] ||
    [ -n "$(lsof -t +D "$SANDBOX" 2>/dev/null)" ]
}
for i in $(seq 1 60); do [ "$i" -gt 25 ] && ! sandbox_advisor_running && break; sleep 1; done
if sandbox_advisor_running; then
  echo "sandbox advisor still running after 60s; sandbox kept at $SANDBOX"
else
  rm -rf "$SANDBOX" && echo "sandbox advisor exited; sandbox removed"
fi
```

2. Python shim:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
```

3. OpenCode plugin:

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"
```

4. One hook adapter. The spec-kit shim never forwards its child's stderr, so read the skipped record from the diagnostics JSONL that `SKILL_ADVISOR_DEBUG=1` turns on:

```bash
DIAG=$(node --input-type=module -e "const m = await import('./.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/metrics.js'); console.log(m.advisorHookDiagnosticsPath(process.cwd()))")
BEFORE=$(cat "$DIAG" 2>/dev/null | wc -l | tr -d ' ')
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \
  | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 SKILL_ADVISOR_DEBUG=1 node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js
echo "Exit: $?"
AFTER=$(cat "$DIAG" | wc -l | tr -d ' ')
echo "diagnostic lines: $BEFORE -> $AFTER"
tail -n 1 "$DIAG"
```

Observed on 2026-09-26:

```text
{}
Exit: 0
diagnostic lines: 229 -> 230
{"timestamp":"2026-09-26T20:03:34.144Z","runtime":"claude","status":"skipped","freshness":"unavailable","durationMs":1,"cacheHit":false}
```

### Expected Signals

- Native `advisor_recommend` returns `recommendations: []`, `freshness: "unavailable"` and `ADVISOR_DISABLED`.
- Step 1 then prints `sandbox advisor exited; sandbox removed`, and no `/tmp/cp003.*` folder is left behind.
- Python shim returns `[]` or prompt-safe disabled output without native scoring.
- OpenCode plugin returns disabled/skipped output without invoking the advisor (covered by the plugin test's env opt-out case).
- Hook adapter prints `{}` and exits `0`. The diagnostics JSONL gains one line, and that newest record has `status: "skipped"` and `freshness: "unavailable"`. If the file had passed 300 lines, the append trims it to the newest 200, so read the last line instead of the count.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Any surface still recommends a skill | Non-empty recommendation under disabled env | Block release. |
| Disabled response includes prompt text | Search captured output for prompt literal | Block release. |
| Plugin only honors legacy env | New flag has no effect | Update the plugin after code approval. |
| Sandbox advisor outlives the wait | Step 1 prints `still running after 60s` and keeps the sandbox | Check the pids in the kept lease, if there is one, and the pids `lsof -t +D "$SANDBOX"` prints, with `ps`. Remove the sandbox by hand once none of them runs. Never stop the live daemon. |

---

## 4. SOURCE FILES

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.skilled/plugins/system-skill-advisor.js`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-003
- Canonical root source: manual-testing-playbook.md
- Feature file path: compat-and-disable/global-disable-flag.md
