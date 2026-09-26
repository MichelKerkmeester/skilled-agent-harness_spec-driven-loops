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

2. Run hook smoke:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js
```

3. Capture stderr diagnostics separately from stdout.

### Absorbed Legacy Test Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-003 | Claude hook additional context | Confirm prompt-time hook surfaces advisor context and fails open safely | `Role: Runtime hook operator. Context: current MCP server build and Claude UserPromptSubmit hook script. Action: pipe a realistic prompt payload into the hook, capture stdout and stderr separately and inspect additional context plus diagnostics. Format: return PASS or FAIL with context presence, prompt-safety result and exit code.` | 1. `bash: npm --prefix .skilled/skills/system-spec-kit/runtime run build` -> 2. `bash: mkdir -p /tmp/skill-advisor-playbook` -> 3. `bash: printf '%s' '{"prompt":"Create a manual testing playbook for this skill and validate the root document.","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \| node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js > /tmp/skill-advisor-playbook/sad-003.stdout.json 2> /tmp/skill-advisor-playbook/sad-003.stderr.jsonl` -> 4. `bash: echo "Exit: $?"` | Exit code 0. Stdout is valid JSON and contains `hookSpecificOutput.additionalContext`. For a matching prompt it starts with `Advisor:` and a freshness word (`live` or `stale`). With no brief it starts with one of the three status lines: `Advisor: outage (`, `Advisor: no skill matched.` or `Advisor: prompt skipped.` `{}` means the shim failed, which is a FAIL. Stderr diagnostics identify `runtime: "claude"` and carry `emittedBytes` and `directivesSuppressed`. Raw prompt literal is absent from stderr | Preconditions:<br>`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=UNSET`<br>`hook script exists`<br><br>Build output:<br>`> @spec-kit/runtime@1.8.0 build`<br>`> tsc --build && node scripts/finalize-dist.mjs`<br><br>Hook transcript:<br>`Exit: 0`<br>`--- STDOUT ---`<br>`{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Advisor: stale; use sk-git 0.95/0.23 pass.\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations."}}`<br><br>`--- STDERR ---`<br>`{"timestamp":"2026-07-03T01:55:55.968Z","runtime":"claude","status":"ok","freshness":"stale","durationMs":456,"cacheHit":false,"errorDetails":"SOURCE_NEWER_THAN_SKILL_GRAPH","skillLabel":"sk-git"}` | PASS - exit code was `0`; stdout was valid JSON with `hookSpecificOutput.additionalContext` starting `Advisor:`; stderr diagnostic JSONL had `runtime: "claude"`; raw prompt text `help me commit my changes` was absent from stderr. | 1. Verify compiled hook exists; 2. Rebuild MCP server; 3. Run `advisor_status`; 4. Confirm disable flag is unset; 5. Inspect hook parity tests |

### Expected Signals

- Exit code is `0`.
- Stdout contains `hookSpecificOutput.additionalContext`. For a matching prompt it starts with `Advisor:` and a freshness word (`live` or `stale`). With no brief it starts with one of the three status lines: `Advisor: outage (`, `Advisor: no skill matched.` or `Advisor: prompt skipped.` `{}` means the shim failed, which is a FAIL.
- Stderr diagnostic JSONL has `runtime: "claude"` and no raw prompt text.
- The stderr diagnostic line carries `emittedBytes` and `directivesSuppressed`.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Script missing | Node reports module not found | Rebuild the advisor runtime. |
| No brief for obvious prompt | `additionalContext` starts with `Advisor: no skill matched.` or `Advisor: outage (` | Inspect diagnostic `freshness` and run `advisor_status`. |
| Stdout is `{}` | Shim diagnostic `CHILD_TIMEOUT` or `SPAWN_ERROR` on stderr | Check that `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is unset or below 2200 and rebuild the runtime. |
| Prompt text in stderr | Grep captured stderr for prompt literal | Treat as privacy failure. |

---

## 4. SOURCE FILES

- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-001
- Canonical root source: manual-testing-playbook.md
- Feature file path: cli-hooks-and-plugin/claude-user-prompt-submit.md
