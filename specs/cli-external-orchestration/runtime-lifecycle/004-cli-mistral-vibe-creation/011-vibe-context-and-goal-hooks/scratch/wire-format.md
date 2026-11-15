# session_start wire format (read from phase 008)

Source: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` section 5.

- Input: one JSON object on stdin with `session_id`, `transcript_path`, `cwd`, `parent_session_id`, `hook_event_name` (`session_start`) and `source`. Only the `pre_tool` payload was captured in phase 008; the `session_start` fields are documented, not observed.
- Reply: exit 0 with empty stdout adds nothing. Exit 0 with `{"hook_specific_output": {"additional_context": "<text>"}}` adds the text; `.vibe/plugins/repo-guards/session-cleanup.mjs` already answers in this shape.
- `session_start` reads `additional_context` and `system_message` only, cannot block and does not accept `strict`. It fires for a main session, not a subagent.
- Phase 008 registered one `session_start` entry, `session-cleanup-start`. This phase replaces it with the composing entry, so the file still holds one. Vibe would join several entries' contexts with a blank line (`vibe/app_server/_host_hooks.py:336`); one entry keeps the order fixed.
