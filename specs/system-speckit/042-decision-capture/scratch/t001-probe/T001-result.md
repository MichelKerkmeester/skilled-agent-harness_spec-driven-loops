# T001 live probe result

2026-11-01, run by the main Claude Code session (Opus 5.5) on the operator's yes.

1. Backed up `.claude/settings.local.json` (gitignored) to `settings.local.json.before`. Appended `posttooluse-hook.json` under `hooks.PostToolUse`, with matcher `AskUserQuestion`.
2. Asked one harmless AskUserQuestion. The operator answered "Probe answer A". Claude Code picked up the hook change mid-session, so no restart and no `/hooks` approval was needed.
3. The hook wrote `.skilled/skills/.state/decision-capture/probe/claude-posttooluse.json` (copied here as `probe-capture.json`). Its payload keys are `session_id, transcript_path, cwd, scratchpad_dir, prompt_id, permission_mode, effort, hook_event_name, tool_name, tool_input, tool_response, tool_use_id, duration_ms`. `tool_name` is `AskUserQuestion`, `tool_response` has keys `questions, answers, annotations`, and `tool_response.answers` maps the question text to the answer: `{"Probe test question …": "Probe answer A"}`.
4. Restored `.claude/settings.local.json` from the backup, byte-identical (`cmp` exit 0), so no probe hook remains.

Verdict: PASS. A Claude PostToolUse hook receives the AskUserQuestion answers in `tool_response.answers`. That is the input `ask-capture-posttooluse.mjs` reads, so T020 can register the real capture hook.

Before commit, the raw `probe-capture.json` and `settings.local.json.before` were deleted. The first carried a real session id and local paths; the second carried the operator's local permission list. The same payload shape is committed in redacted form as `.skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json`, which the adapter test feeds.
