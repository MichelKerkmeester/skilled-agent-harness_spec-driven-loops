---
title: "CL-001 Claude Code UserPromptSubmit Hook"
description: "Manual validation for the Claude Code prompt-time skill advisor hook."
trigger_phrases:
  - "cl-001"
  - "claude code userpromptsubmit hook"
  - "claude code"
  - "claude"
version: 0.8.0.11
id: CL-001
category: cli_hooks_and_plugin
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: hooks/skill-advisor-hook.md
---

# CL-001 Claude Code UserPromptSubmit Hook

Prompt: Manual validation for the Claude Code prompt-time skill advisor hook.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the Claude Code `UserPromptSubmit` adapter returns `hookSpecificOutput.additionalContext` and fails open.

> Absorbed from former SAD-003 at 2026-05-07.

---

## 2. SCENARIO CONTRACT

- Advisor runtime build is current.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.
- Claude hook script exists at `runtime/dist/hooks/claude/user-prompt-submit.js`.

---

## 3. TEST EXECUTION

1. Build:

```bash
npm --prefix .skilled/skills/system-spec-kit/runtime run build
```

2. Run the hook through the shipped spec-kit shim with `SKILL_ADVISOR_DEBUG=1`, and count the diagnostics JSONL lines before and after the call. The shim runs the advisor hook as a child process and never forwards that child's stderr, so the diagnostic record is read from the JSONL file the advisor hook appends to when `SKILL_ADVISOR_DEBUG` is set:

```bash
mkdir -p /tmp/skill-advisor-playbook
DIAG=$(node --input-type=module -e "const m = await import('./.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/metrics.js'); console.log(m.advisorHookDiagnosticsPath(process.cwd()))")
BEFORE=$(cat "$DIAG" 2>/dev/null | wc -l | tr -d ' ')
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \
  | SKILL_ADVISOR_DEBUG=1 node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js \
  > /tmp/skill-advisor-playbook/cl-001.stdout.json 2> /tmp/skill-advisor-playbook/cl-001.shim-stderr.txt
echo "Exit: $?"
AFTER=$(cat "$DIAG" | wc -l | tr -d ' ')
echo "diagnostic lines: $BEFORE -> $AFTER"
cat /tmp/skill-advisor-playbook/cl-001.stdout.json
echo "shim stderr bytes: $(wc -c < /tmp/skill-advisor-playbook/cl-001.shim-stderr.txt | tr -d ' ')"
tail -n 1 "$DIAG"
grep -c 'help me commit my changes' "$DIAG"
```

3. Confirm the stderr channel on the advisor hook itself, which the shim hides. Pipe the same payload into the inner hook:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \
  | node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
  > /dev/null 2> /tmp/skill-advisor-playbook/cl-001.inner-stderr.jsonl
cat /tmp/skill-advisor-playbook/cl-001.inner-stderr.jsonl
grep -c 'help me commit my changes' /tmp/skill-advisor-playbook/cl-001.inner-stderr.jsonl
```

### Absorbed Legacy Test Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-003 | Claude hook additional context | Confirm prompt-time hook surfaces advisor context and fails open safely | `Role: Runtime hook operator. Context: current MCP server build and Claude UserPromptSubmit hook script. Action: pipe a realistic prompt payload into the hook, capture stdout and stderr separately and inspect additional context plus diagnostics. Format: return PASS or FAIL with context presence, prompt-safety result and exit code.` | 1. `bash: npm --prefix .skilled/skills/system-spec-kit/runtime run build` -> 2. `bash: mkdir -p /tmp/skill-advisor-playbook` -> 3. `bash:` resolve `DIAG` with `advisorHookDiagnosticsPath(process.cwd())` and record its line count, as in step 2 above -> 4. `bash: printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \| SKILL_ADVISOR_DEBUG=1 node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js > /tmp/skill-advisor-playbook/cl-001.stdout.json 2> /tmp/skill-advisor-playbook/cl-001.shim-stderr.txt` -> 5. `bash: echo "Exit: $?"` -> 6. `bash: tail -n 1 "$DIAG"` -> 7. `bash:` pipe the same payload into `.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js` and capture its stderr | Exit code 0. Stdout is valid JSON and contains `hookSpecificOutput.additionalContext`. For a matching prompt it starts with `Advisor:` and a freshness word (`live` or `stale`). With no brief it starts with one of the three status lines: `Advisor: outage (`, `Advisor: no skill matched.` or `Advisor: prompt skipped.` `{}` means the shim failed, which is a FAIL. The shim's own stderr is empty. The diagnostics JSONL gains one line, and that record has `runtime: "claude"`, `emittedBytes` and `directivesSuppressed`. The inner hook's stderr carries the same record shape. The raw prompt literal is absent from both | Preconditions:<br>`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=UNSET`<br>`hook script exists`<br><br>Shim transcript, 2026-09-26, stdout abbreviated after the first directive label:<br>`Exit: 0`<br>`diagnostic lines: 228 -> 229`<br>`{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: live; use sk-git 0.95/0.12 pass.\nDirectives:\n- Comment hygiene [HARD BLOCK]: ..."}}`<br>`{"timestamp":"2026-09-26T20:03:24.005Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1755,"cacheHit":false,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}`<br>`0`<br><br>Shim stderr: 0 bytes.<br><br>Inner hook stderr:<br>`{"timestamp":"2026-09-26T20:03:25.450Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1257,"cacheHit":true,"skillLabel":"sk-git","emittedBytes":259,"directivesSuppressed":false}`<br>`0` | PASS - exit code was `0`; stdout was valid JSON with `hookSpecificOutput.additionalContext` starting `Advisor: live`; the diagnostics JSONL went from 228 to 229 lines and the new record had `runtime: "claude"`, `emittedBytes` and `directivesSuppressed`; the prompt literal `help me commit my changes` matched 0 times in the JSONL and in the inner hook's stderr. | 1. Verify compiled hook exists; 2. Rebuild MCP server; 3. Run `advisor_status`; 4. Confirm disable flag is unset; 5. Inspect hook parity tests |

### Expected Signals

- Exit code is `0`.
- Stdout contains `hookSpecificOutput.additionalContext`. For a matching prompt it starts with `Advisor:` and a freshness word (`live` or `stale`). With no brief it starts with one of the three status lines: `Advisor: outage (`, `Advisor: no skill matched.` or `Advisor: prompt skipped.` `{}` means the shim failed, which is a FAIL.
- The shim's own stderr is empty (`shim stderr bytes: 0`). It writes a `[speckit-hook:user-prompt-submit]` code there only when it fails open to `{}`.
- The diagnostics JSONL gains one line (`AFTER` is `BEFORE + 1`). If the file had passed 300 lines, the append trims it to the newest 200, so read the last line instead of the count.
- That newest record has `runtime: "claude"` and carries `emittedBytes` and `directivesSuppressed`.
- The inner hook's stderr carries the same record shape.
- `grep -c` finds the prompt literal 0 times in the JSONL and in the inner hook's stderr.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Script missing | Node reports module not found | Rebuild the advisor runtime. |
| No brief for obvious prompt | `additionalContext` starts with `Advisor: no skill matched.` or `Advisor: outage (` | Inspect diagnostic `freshness` and run `advisor_status`. |
| Stdout is `{}` | Shim diagnostic `CHILD_TIMEOUT` or `SPAWN_ERROR` on stderr | Check that `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is unset or below 2200 and rebuild the runtime. |
| No new diagnostics line | `AFTER` equals `BEFORE` | Confirm `SKILL_ADVISOR_DEBUG=1` reached the shim call and that `DIAG` resolved from the repository root. |
| Prompt text in diagnostics | Grep the JSONL and the inner hook's stderr for the prompt literal | Treat as privacy failure. |

---

## 4. SOURCE FILES

- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts`

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-001
- Canonical root source: manual-testing-playbook.md
- Feature file path: cli-hooks-and-plugin/claude-user-prompt-submit.md
