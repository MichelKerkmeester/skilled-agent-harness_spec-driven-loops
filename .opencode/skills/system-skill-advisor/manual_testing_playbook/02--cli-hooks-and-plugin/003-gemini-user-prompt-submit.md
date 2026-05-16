---
title: "CL-003 Gemini CLI UserPromptSubmit Hook"
description: "Manual validation for Gemini BeforeAgent prompt-time advisor integration."
trigger_phrases:
  - "cl-003"
  - "gemini cli userpromptsubmit hook"
  - "gemini cli"
  - "gemini"
---

# CL-003 Gemini CLI UserPromptSubmit Hook

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate Gemini's prompt-equivalent hook adapter and its fail-open behavior.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- MCP server build is current.
- Gemini adapter exists at `mcp_server/dist/hooks/gemini/user-prompt-submit.js`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Build:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run build
```

2. Run:

```bash
printf '%s' '{"request":{"prompt":"create a flowchart for the auth process","cwd":"'"$PWD"'"},"hook_event_name":"BeforeAgent"}' | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js
```

3. Capture stdout and stderr.

### Expected Signals

- Exit code is `0`.
- Stdout is `{}` or `hookSpecificOutput.additionalContext`.
- Matching prompt returns an `Advisor:` brief.
- Diagnostics use `runtime: "gemini"`.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Unknown schema | Diagnostic `errorDetails: "GEMINI_UNKNOWN_SCHEMA"` | Update payload shape to include `prompt`, `userPrompt` or `request.prompt`. |
| No advisor output | `{}` with skipped status | Confirm prompt policy and status freshness. |
| Prompt leaks | Prompt literal in stderr | Block release. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: 02--cli-hooks-and-plugin/003-gemini-user-prompt-submit.md

<!-- /ANCHOR:5-source-metadata -->
