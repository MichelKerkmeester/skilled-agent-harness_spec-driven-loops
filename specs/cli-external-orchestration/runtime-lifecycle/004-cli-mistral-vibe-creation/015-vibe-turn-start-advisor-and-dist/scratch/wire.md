# Vibe 3.1.2 wire fields this phase reads and writes

Source: the installed package's hook reference,
`vibe/plugins/builtins/vibe/skills/vibe/SKILL.md`, sections "Wire protocol" and
"Structured-response schema". The `pre_tool` capture under
`.vibe/plugins/repo-guards/fixtures/wire-format/captured-pre-tool-input.json`
confirms the envelope shape on this version.

## `pre_agent` input (stdin, one JSON object)

| Field | Type | Use here |
|---|---|---|
| `hook_event_name` | `"pre_agent"` | The composer rejects any other event. |
| `session_id` | string | The advisor handler's session key, and the key of the per-session head receipt. |
| `parent_session_id` | string or null | Non-null marks a subagent, which gets no advisor brief. |
| `transcript_path` | string | Passed to the advisor handler so its file-backed directive store can prove a repeat. |
| `cwd` | string | The session folder. The advisor part uses the checkout root instead, so a scratch-cwd dispatch still resolves the advisor CLI. |
| `agent_name` | string | Not read; the entry's `match = "main"` already excludes subagents. |
| `turn_id` | string | Not read. |
| `prompt` | string | The operator's text, attachments excluded. A blank prompt gets no brief. |

The child signal is the inherited `AI_SESSION_CHILD=1` environment variable, the
same marker every repo hook reads, plus the payload's `parent_session_id` for a
subagent Vibe spawned itself.

## `pre_agent` reply (stdout, one JSON object)

```json
{"hook_specific_output": {"additional_context": "Advisor: ..."}}
```

`additional_context` is added after the user's message, for the model only, and
stays in the conversation for later turns. `decision` is omitted: a `deny` on
this event ends the turn, which this phase never does. A non-zero exit, a
timeout or non-conforming stdout is a failure path, so the composer always exits
0 and prints either one valid object or nothing.

## `post_tool` input (stdin, one JSON object)

| Field | Type | Use here |
|---|---|---|
| `hook_event_name` | `"post_tool"` | Not read; the entry's `match` already selects the tool. |
| `tool_name` | string | Always qualified (`file_system.write_file`, `file_system.edit`, `file_system.bash`, `process_start`). |
| `tool_input` | object | `file_path` for a write or edit, `command` for a shell call. |
| `tool_status` | `"success"` or `"failure"` | A failed call changes nothing, so the hook stays silent. |
| `cwd` | string | A relative `file_path` resolves against it. |

## `post_tool` reply (stdout, one JSON object)

```json
{"hook_specific_output": {"additional_context": "..."}}
```

The text is appended to the tool result the model reads. The entry is
non-strict, so a failing hook leaves that result intact instead of clearing it.
