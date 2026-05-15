---
title: "025 Devin CLI SessionStart Hook"
description: "Manual validation for the Devin CLI session-start hook that emits the kind=startup structural-context payload."
trigger_phrases:
  - "025"
  - "devin cli sessionstart hook"
  - "devin sessionstart"
  - "devin session start"
  - "mk-code-index devin"
importance_tier: "important"
---
# 025 Devin CLI SessionStart Hook

## 1. OVERVIEW

Validate the Devin CLI SessionStart hook reads `.code-graph-readiness.json`, emits the canonical `kind=startup` payload, and fails open on errors.

---

## 2. SCENARIO CONTRACT

- Objective: Validate that the Devin CLI SessionStart hook emits kind=startup structural-context payload across all source values, fails open on malformed input, and respects the disable env var.
- Real user request: `Confirm the Devin CLI SessionStart hook works correctly across startup, resume, clear, and compact sources, with fail-open behavior and env-var disable support.`
- Operator prompt: `Validate the Devin SessionStart hook by piping source payloads through the compiled hook. Verify kind=startup payload, fail-open behavior, and env-var disable. Return PASS/FAIL with command evidence.`
- Expected execution process: Verify hook dist artifact and `.devin/hooks.v1.json` registration exist, then pipe startup|resume|clear|compact source payloads through the compiled hook, plus a malformed stdin and a disable-env-var variant. Inspect stdout for hookSpecificOutput shape and stderr for fail-open diagnostics.
- Expected signals: Exit 0 in all runs. Startup/resume/compact emits `hookSpecificOutput.additionalContext` with `## Session Context` block. Clear source may emit startup payload or `{}`. Malformed and disabled runs emit `{}` with fail-open stderr diagnostics.
- Desired user-visible outcome: A verdict confirming the hook emits correct payloads, fails open, and respects the disable env var.
- Pass/fail: PASS if all 6 runs exit 0, active sources emit structural-context block, malformed/disabled emit `{}` with fail-open diagnostics, and registration cites the canonical compiled-hook path. FAIL otherwise.

---

## 3. TEST EXECUTION

### Commands

1. Verify dist artifact: `ls .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js`
2. Verify registration: `jq '.SessionStart[0].hooks[0].command' .devin/hooks.v1.json`
3. Pipe startup|resume|clear|compact source payloads through the compiled hook, collecting stdout and stderr per variant:
   ```bash
   for SRC in startup resume clear compact; do
     printf '%s' "{\"source\":\"$SRC\",\"session_id\":\"025-$SRC\",\"cwd\":\"$PWD\"}" \
       | node .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js \
       > "/tmp/devin-session-playbook/025-$SRC.stdout.json" 2> "/tmp/devin-session-playbook/025-$SRC.stderr"
   done
   ```
4. Malformed stdin: `printf '%s' 'not-json' | node <hook-path>`
5. Disable-env-var: `SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED=1 printf '{"source":"startup",...}' | node <hook-path>`

### Expected Output / Verification

Startup/resume/compact: parseable JSON with `hookSpecificOutput.hookEventName == "SessionStart"` and `additionalContext` containing `## Session Context` block. Malformed: literal `{}`, exit 0, stderr contains `fail_open`. Disabled: literal `{}`, exit 0, stderr contains `hook disabled via env var`.

### Cleanup

`rm -rf /tmp/devin-session-playbook`

### Variant Scenarios

Stale code-graph state probe: touch a tracked file without reindexing, pipe startup payload, verify stale-state advisory appears in additionalContext.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts` | Hook implementation |
| `.devin/hooks.v1.json` | Hook registration |

---

## 5. SOURCE METADATA

- Group: Devin Hooks
- Playbook ID: 025
- Canonical root source: `manual_testing_playbook.md`
