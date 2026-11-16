# Vibe tool names in pre_tool payloads (vibe 3.1.2)

Captured by a record-only `pre_tool` hook with `match = "*"` while the model read, wrote, edited, searched and ran a shell command. `tool_name` is always the qualified name.

| tool_name | tool_input keys |
|---|---|
| `file_system.bash` | `command`, `timeout` |
| `file_system.read_file` | `file_path` |
| `file_system.write_file` | `file_path`, `content` |
| `file_system.edit` | `file_path`, `old_string`, `new_string` |
| `connector_web_search.web_search` | `query`, `limit` |

Background shell commands go through the builtin `process.start`, which is the `tool_name` a payload carries. A `match` selector also accepts the alias `process_start`, so shell guards match `re:bash|process_start` and their tool-name map reads `process.start`. Input typed into a running background process goes through `process.write`, selector alias `process_write`, whose `text` or `bytesBase64` argument the guards that judge commands read as a shell command, since an interactive shell runs each line it receives; a `control` key carries no command. Subagents spawn through `agents.spawn`, which a selector matches as `agents_spawn`.
