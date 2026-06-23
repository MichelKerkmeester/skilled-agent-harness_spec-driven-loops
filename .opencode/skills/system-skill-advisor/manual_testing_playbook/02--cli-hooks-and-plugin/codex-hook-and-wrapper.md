---
title: "CL-004 Codex CLI Native Hooks And Wrapper Fallback"
description: "Manual validation for Codex SessionStart startup context, UserPromptSubmit advisor brief injection and prompt-wrapper fallback."
trigger_phrases:
  - "cl-004"
  - "codex cli hook and prompt wrapper"
  - "codex cli"
  - "codex"
version: 0.8.0.11
---

# CL-004 Codex CLI Native Hooks And Wrapper Fallback

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate native Codex `SessionStart` startup-context injection, native `UserPromptSubmit` advisor brief injection, stdin-over-argv parsing and the wrapper fallback used only when native hooks are unavailable.

---

## 2. SCENARIO CONTRACT

- MCP server build is current.
- Codex hooks are enabled with `[features].codex_hooks = true` in `~/.codex/config.toml` for live-session testing.
- User-level `~/.codex/hooks.json` keeps Superset `notify.sh` entries and adds Spec Kit Memory `SessionStart` + `UserPromptSubmit` entries.
- Codex SessionStart hook exists at `mcp_server/dist/hooks/codex/session-start.js`.
- Codex hook exists at `mcp_server/dist/hooks/codex/user-prompt-submit.js`.
- Prompt wrapper exists at `mcp_server/dist/hooks/codex/prompt-wrapper.js`.

---

## 3. TEST EXECUTION

1. Build:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run build
```

2. Run SessionStart:

```bash
printf '%s' '{"session_id":"manual-cl-004","hook_event_name":"SessionStart","source":"startup","cwd":"'"$PWD"'","model":"gpt-5.4","permission_mode":"default"}' | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js
```

3. Run UserPromptSubmit:

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

4. Run wrapper smoke:

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/prompt-wrapper.js
```

5. Verify live Codex feature visibility:

```bash
codex features list | rg 'codex_hooks'
```

6. For parser precedence, pass conflicting argv JSON while stdin contains the intended prompt and verify stdin wins.

### Expected Signals

- SessionStart exits `0` and returns `hookSpecificOutput.additionalContext` with startup context.
- UserPromptSubmit exits `0` and returns `{}` or `hookSpecificOutput.additionalContext` with the compact advisor brief.
- Wrapper exits `0` and returns `{}` unless hook policy reports unavailable. When active it returns `promptWrapper` and `wrappedPrompt`.
- `codex_hooks` reports `true` in live Codex feature output when the feature is enabled.
- Diagnostics use `runtime: "codex"`.
- Stdin JSON is canonical when stdin and argv both contain JSON.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Wrapper always rewrites | Output contains wrapper when hook policy is available | Inspect `detectCodexHookPolicy`. |
| SessionStart returns `{}` in a live smoke | No `additionalContext` in stdout | Check `~/.codex/config.toml`, hook command path and build output. |
| Argv beats stdin | Diagnostic source or output reflects argv prompt | Block release. Parser precedence regressed. |
| Prompt text in diagnostics | Grep stderr | Block release. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 02--cli-hooks-and-plugin/codex-hook-and-wrapper.md
