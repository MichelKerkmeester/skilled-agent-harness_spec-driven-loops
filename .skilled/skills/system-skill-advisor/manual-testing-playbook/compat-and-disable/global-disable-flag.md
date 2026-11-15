---
title: "CP-003 Global Disable Flag"
description: "Manual validation that SPECKIT_SKILL_ADVISOR_HOOK_DISABLED disables all advisor prompt surfaces."
trigger_phrases:
  - "cp-003"
  - "global disable flag"
  - "global disable"
  - "global"
version: 0.8.6.0
id: CP-003
category: compat_and_disable
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# CP-003 Global Disable Flag

Prompt: Manual validation that SPECKIT_SKILL_ADVISOR_HOOK_DISABLED disables all advisor prompt surfaces.


---

## 1. OVERVIEW

Validate the common disable flag across the native CLI, Python shim, runtime hooks and OpenCode plugin.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Advisor runtime build is current.
- Capture env and command output.
- Never stop the live daemon. Step 1 reads the warm workspace daemon and sends it no signal.

---

## 3. TEST EXECUTION

### Commands

1. Native CLI against the warm workspace daemon, which runs without the switch. The client reads the switch in its own process before it connects, so each flagged call must abstain although the daemon would answer, the legacy name set to `1` and the canonical name set to `true`, and the unflagged call after them must still recommend. Each call names `/dev/null` as its flags file, so a switch saved in `.skilled/hooks/hook-flags.env` cannot decide it:

```bash
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --no-warm-only > /dev/null
HOOK_FLAGS_CONFIG=/dev/null SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
HOOK_FLAGS_CONFIG=/dev/null SYSTEM_SKILL_ADVISOR_DISABLED=true node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" --options '{"topK":1,"includeAbstainReasons":true}' --format json --timeout-ms 30000
HOOK_FLAGS_CONFIG=/dev/null env -u SPECKIT_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_HOOK_DISABLED -u SYSTEM_SKILL_ADVISOR_DISABLED -u SYSTEM_HOOKS_DISABLED node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "help me commit my changes" --options '{"topK":1}' --format json --timeout-ms 30000
```

2. Python shim:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "help me commit my changes"
```

3. OpenCode plugin:

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts -t "opt-out"
```

4. One hook adapter. The spec-kit shim never forwards its child's stderr, so read the skipped record from the diagnostics JSONL. The hook appends that record on every run, disabled or not, and `SKILL_ADVISOR_DEBUG=1` adds nothing to a skipped record:

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

### Expected Signals

- Step 1's two flagged calls each return `recommendations: []`, `freshness: "unavailable"` and `ADVISOR_DISABLED`, although the warm daemon would have answered, and the second names `SYSTEM_SKILL_ADVISOR_DISABLED` in its abstain reason.
- Step 1's unflagged call that follows returns at least one recommendation, so the switch did not reach the daemon.
- Python shim returns `[]` or prompt-safe disabled output without native scoring.
- OpenCode plugin returns disabled/skipped output without invoking the advisor (covered by the plugin test's env opt-out case).
- Hook adapter prints `{}` and exits `0`. The diagnostics JSONL gains one line, and that newest record has `status: "skipped"` and `freshness: "unavailable"`. If the file had passed 300 lines, the append trims it to the newest 200, so read the last line instead of the count.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Any surface still recommends a skill | Non-empty recommendation under disabled env | Block release. |
| Disabled response includes prompt text | Search captured output for prompt literal | Block release. |
| Plugin only honors legacy env | New flag has no effect | Update the plugin after code approval. |

### Evidence

- Capture each numbered step's output and exit status.
- Record whether each flagged native response has empty recommendations, freshness unavailable and ADVISOR_DISABLED, which switch each abstain reason names, and whether the unflagged call that follows still recommends.
- Record whether the Python shim returns an empty list or prompt-safe disabled output. Record whether the plugin returns disabled or skipped output without invoking the advisor.
- Capture the hook output {}, exit status 0, diagnostic line counts and newest record values status skipped and freshness unavailable.
- If the diagnostics file exceeds 300 lines, record that the append trims it to 200 and inspect the newest record.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any signal differs.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts`
- `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.opencode/plugins/system-skill-advisor.js`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`

---

## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-003
- Canonical root source: manual-testing-playbook.md
- Feature file path: compat-and-disable/global-disable-flag.md
