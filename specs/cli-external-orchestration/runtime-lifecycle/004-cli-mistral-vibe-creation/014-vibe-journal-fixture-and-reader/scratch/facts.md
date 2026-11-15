# Facts: Vibe journal probes

Four questions, each answered from a keyed Vibe 3.1.2 run or named interactive-only.
The journal excerpts are in `journal-excerpts/`; the reader tests run on redacted
copies under `.skilled/hooks/shared/tests/session-readers/fixtures/vibe/`.

## Q1 - Is the final reply on disk when a post_agent hook starts?

Answer: Yes, as a `completion_succeeded` record; no, as a projection assistant message. The capture log (`journal-excerpts/post-agent-capture.json`) records `completion_succeeded: 2` and `last_assistant_text: ""` at hook start, and `journal-excerpts/post-agent-completion.jsonl` holds the reply the hook could read: `"text": "probe-ok"`.
Evidence: the payload was `{"session_id":"83423691-...","transcript_path":"...","cwd":"...","parent_session_id":null,"hook_event_name":"post_agent","agent_name":"auto-approve"}` with no reply field; the journal listing at hook start was 44,020 bytes, and the assistant message entry was written after the hook (the same journal ends at 50,023 bytes).
Consequence: phase 016 reads the reply through the reader's completion fallback, not the projection message.

## Q2 - What does a post_agent deny do, and does turn_id survive the retries?

Answer: the retry turn carries the deny reason, the third retry is the cap, and the fourth invocation is force-accepted. The retry output is `{"type":"retry","feedback":[{"text":"post-agent fixture: revise the reply"}]}`, and the next completion's `model_input.messages` appends that text as a user message. `DENY_MODE=always` recorded `retry, retry, retry, accept` (4 invocations); `DENY_MODE=once` recorded `retry, accept` (2).
turn_id across retries: `turn-606243334cd2925977f2b52432f7480c` on all four invocations; the once run kept `turn-188d531c4a194fa655a3404ac0d98e44` on both.
Evidence: `journal-excerpts/deny-always-hook-outcomes.jsonl`, `journal-excerpts/deny-always-turn-ids.txt`.
Consequence: phase 016 keys its once-per-turn mark on the reader's `turnId`, which is stable across the retries Vibe counts.

## Q3 - What does a context_compacted record look like on disk?

Answer: the compaction is a projection `checkpoint` entry with `kind: "compaction"`, `compaction_id` in its id (`checkpoint-compaction-d95bb2db-...`), `details.trigger: "automatic"`, `details.attempt: 1` and `details.summaryLength: 679`; the same compaction appears as a `context_compacted` observation in the `core_input` transition shape, and its summary is a `completion_succeeded` command whose action carries the `compaction_id`.
Record: `journal-excerpts/compaction-context-compacted.jsonl` (sequence 7) and `journal-excerpts/compaction-checkpoint.jsonl` (append in_progress, replace completed).
Evidence: the fixture model row pinned `max_context_length = 20000`, so the threshold was 10,000 tokens; the 12,051-byte prompt crossed it and one automatic compaction ran in one keyed turn.
Consequence: phase 018 matches `kind: "compaction"` checkpoints and uses `compactionsSince` with the entry's sequence as its watermark.

## Q4 - Does post_tool fire for ask_user_question?

Answer: interactive-only. A headless run never lists the tool (`NON_INTERACTIVE_DISABLED_TOOLS` in `vibe/acp/agent.py`), and the recorded tool catalog has no `ask_user_question`, so no headless run can fire it.
Operator procedure:
1. In a trusted project, add a `post_tool` hook matching `ask_user_question` that appends stdin to a log.
2. Start `vibe` in the TUI and ask it to use the question tool with two options.
3. Answer in the widget, then read the log: `tool_name` should be `ui.ask_user_question`, `tool_input` the questions, `tool_output` the `UserQuestionResult` (`answers`, `cancelled`).
4. If no entry appears, `post_tool` does not fire for the tool; record that here.
Consequence: phase 017 keeps the journal sweep as its fallback and does not assume a live post_tool capture for the question tool.

## Reader

`loadVibeSession` reads `<transcript_path>/journal/*.jsonl`, replays the public
session state, and returns the current turn's reply, tool calls, compactions and
turn id. The 011 scratch-cwd fixture pins the exact reply text and the recorded
`turn_id`; the post-agent fixture pins the completion fallback; the compaction
fixture pins `compactionsSince`. A foreign journal returns
`{ ok: false, code: 'unsupported_format' }`, and a read leaves the journal bytes
and modification time unchanged.
