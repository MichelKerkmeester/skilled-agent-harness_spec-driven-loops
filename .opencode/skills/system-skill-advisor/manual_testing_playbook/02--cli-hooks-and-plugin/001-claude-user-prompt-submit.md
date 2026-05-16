---
title: "CL-001 Claude Code UserPromptSubmit Hook"
description: "Manual validation for the Claude Code prompt-time skill advisor hook."
trigger_phrases:
  - "cl-001"
  - "claude code userpromptsubmit hook"
  - "claude code"
  - "claude"
---

# CL-001 Claude Code UserPromptSubmit Hook

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate the Claude Code `UserPromptSubmit` adapter returns `hookSpecificOutput.additionalContext` and fails open.

> Absorbed from former SAD-003 at 2026-05-07.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- MCP server build is current.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.
- Claude hook script exists at `mcp_server/dist/hooks/claude/user-prompt-submit.js`.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Build:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run build
```

2. Run hook smoke:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js
```

3. Capture stderr diagnostics separately from stdout.

### Absorbed Legacy Test Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SAD-003 | Claude hook additional context | Confirm prompt-time hook surfaces advisor context and fails open safely | `Role: Runtime hook operator. Context: current MCP server build and Claude UserPromptSubmit hook script. Action: pipe a realistic prompt payload into the hook, capture stdout and stderr separately and inspect additional context plus diagnostics. Format: return PASS or FAIL with context presence, prompt-safety result and exit code.` | 1. `bash: npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` -> 2. `bash: mkdir -p /tmp/skill-advisor-playbook` -> 3. `bash: printf '%s' '{"prompt":"Create a manual testing playbook for this skill and validate the root document.","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' \| node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js > /tmp/skill-advisor-playbook/sad-003.stdout.json 2> /tmp/skill-advisor-playbook/sad-003.stderr.jsonl` -> 4. `bash: echo "Exit: $?"` | Exit code 0. Stdout is valid JSON. Stdout is `{}` or contains `hookSpecificOutput.additionalContext`. Stderr diagnostics identify `runtime: "claude"`. Raw prompt literal is absent from stderr | Captured stdout, stderr, command transcript and exit code | PASS if exit 0, stdout JSON is valid, additional context or documented fail-open output appears and diagnostics are prompt-safe. FAIL otherwise | 1. Verify compiled hook exists; 2. Rebuild MCP server; 3. Run `advisor_status`; 4. Confirm disable flag is unset; 5. Inspect hook parity tests |

### Expected Signals

- Exit code is `0`.
- Stdout is `{}` or contains `hookSpecificOutput.additionalContext`.
- For a matching prompt, `additionalContext` starts with `Advisor:`.
- Stderr diagnostic JSONL has `runtime: "claude"` and no raw prompt text.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Script missing | Node reports module not found | Rebuild MCP server. |
| No brief for obvious prompt | `{}` with `status: "skipped"` or `fail_open` | Inspect diagnostic `freshness` and run `advisor_status`. |
| Prompt text in stderr | Grep captured stderr for prompt literal | Treat as privacy failure. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 02--cli-hooks-and-plugin/001-claude-user-prompt-submit.md

<!-- /ANCHOR:5-source-metadata -->
