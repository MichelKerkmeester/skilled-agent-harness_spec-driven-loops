# Facts: the question tool's post_tool payload

Phase 014 settled that only an interactive session can answer this tool, and left
the payload shape to the operator procedure. The builder that assembles the
payload is readable in the installed package, so the three facts the adapter and
the sweep depend on are pinned here from source, with the interactive run still
the only proof that the hook is reached at all.

## 1. Is the hook reached for ask_user_question?

Answer: interactive-only, and the hook fires when the widget returns. A
non-interactive run removes the tool (`NON_INTERACTIVE_DISABLED_TOOLS` in
`vibe/acp/agent.py:188`), so a headless dispatch can never answer a question and
nothing is captured there. The TUI path runs the call through the host's
user-input request (`mistralai_vibe_local_harness/vibe/_host.py:2896`), and
`_post_tool_payload` (`mistralai_vibe_local_harness/vibe/_foreign_hooks.py:610`)
builds the same envelope every other tool produces. The operator procedure in
phase 014's `scratch/facts.md` Q4 is the run that confirms it; until that run,
the sweep is the capture path that does not depend on the answer.

## 2. What name does the hook see?

Answer: the qualified name `ui.ask_user_question`. `qualified_tool_name`
(`mistralai_vibe_local_harness/vibe/_hook_matcher.py:103`) prefixes a provided
tool with its group, and the projection table keys the same string
(`vibe/app_server/_unified_tool_projection.py:1830`). A `match` on the short name
alone would miss the call, so the adapter accepts the short name and any
`<group>.ask_user_question` spelling.

## 3. What shape does the result carry?

Answer: `tool_output` is the tool result's `structured_content`, which is the
`UserQuestionResult` dump: `{"answers": [{"question": "...", "answer": "...",
"isOther": false}], "cancelled": false}`. The dump uses camelCase aliases
(`_json_value` in `mistralai_vibe_local_harness/vibe/_session.py:4828` dumps with
`by_alias=True`), so the per-answer flag is `isOther` and not the Python field
name `is_other`; the mapper reads only `question` and `answer`, so neither
spelling can change a record. `tool_output_text` carries the same answers as
`question: answer` lines and is the fallback when no structured content arrives.

## Consequences for this phase

- The mapper takes the answers list, not the question-keyed object the shared
  normalizer reads, so it converts one to the other before normalizing.
- `cancelled: true` means the operator dismissed the widget, so it yields no
  record even though the call succeeded.
- The journal records the same result under the tool effect's
  `state.output.structured_content`, which is what the save-time sweep reads.
- The key is the tool call id plus the question index, so the live hook and the
  sweep write one key for one answer.
