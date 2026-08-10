# Iteration 2: Claude-app UX parity + session model mapping

## Focus

Map Claude-app UX surfaces (session list, chat transcript, session actions) onto Pi RPC session commands and on-disk session storage, given that RPC has no `list_sessions` command.

## Findings

1. **Session list is a relay filesystem API, not an RPC command.** Pi stores sessions under `--session-dir` / `PI_CODING_AGENT_SESSION_DIR` (default family `~/.pi/agent/sessions/.../session.jsonl` per help). The relay must: (a) enumerate session files, (b) read header metadata (id, cwd, timestamp, optional display name), (c) expose REST/WS list to the PWA. Selecting a row issues `switch_session` with `sessionPath`; New Chat issues `new_session` (optionally with `parentSession`); rename issues `set_session_name`. [SOURCE: pi --help session flags] [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: Iteration 1 f-no-list-sessions]

2. **Claude-app session actions map cleanly onto RPC session commands.** | Claude-app action | RPC | Notes | |---|---|---| | Open session | `switch_session` | Cancellable via `session_before_switch` extension | | New chat | `new_session` | Returns `{cancelled}` | | Branch / edit-from-here | `fork` + `get_fork_messages` | Fork from user `entryId` | | Duplicate thread | `clone` | Same leaf, new session | | Export | `export_html` | Optional `outputPath` | Display name is first-class via `--name` / `set_session_name` and appears in `get_state.sessionName`. [SOURCE: https://pi.dev/docs/latest/rpc]

3. **Chat transcript should prefer `get_entries` (+ live events) over `get_messages` alone.** `get_entries` returns the append-only tree with stable ids and supports `since` cursors for reconnect; it includes pre-compaction history and abandoned branches. `get_tree` supplies hierarchy for a branch picker. `get_messages` is the LLM-facing message list without the full entry tree. Live UI appends from streaming events; cold open hydrates from `get_entries` then attaches the event stream. [SOURCE: https://pi.dev/docs/latest/rpc]

4. **Claude-app UX parity matrix (MVP vs later).** Must-have MVP: session list + rename, chat bubbles (user/assistant), streaming text, tool activity rows, approval dialogs (`confirm`/`select`), abort, composer with queue indicators. Later: fork/clone UI, tree/branch explorer, HTML export share, compaction/cost footer from `get_session_stats.contextUsage`, slash-command palette from `get_commands`. Not portable from TUI: `custom()`, footer/header/editor component hooks — RPC docs mark these no-ops/unsupported. [SOURCE: https://pi.dev/docs/latest/rpc Extension UI Protocol]

5. **Multi-device locking should live in the relay, not Pi RPC.** RPC binds one agent process to one session file at a time (`switch_session` replaces active session). Claude-app multi-device "same account" behavior requires the relay to enforce single-writer locks per `sessionId`, fan-out read-only event mirrors if desired, and reject concurrent `prompt` from a second device with an explicit UI error. [SOURCE: https://pi.dev/docs/latest/rpc] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:85-92]

## Sources Consulted

- https://pi.dev/docs/latest/rpc (Session + Extension UI sections)
- `pi --help` session flag block (live 0.84.1)
- Iteration 001 findings (no list_sessions; relay topology)
- Parent strategy Q2/Q5 (read-only)

## Assessment

- **newInfoRatio:** 0.85
- **Novelty justification:** Session-list filesystem ownership, Claude→RPC action matrix, get_entries-first transcript strategy, and relay-level multi-device locking are new relative to iteration 1's protocol inventory.
- **Confidence:** High on command mapping; medium on exact on-disk session header schema (inferred from help path + session header event shape in JSON docs).

## Reflection

### What worked
- Treating missing `list_sessions` as a design input rather than a blocker produced a concrete relay API split (FS list vs RPC switch).

### What failed / ruled out
- **Ruled out:** Expecting TUI-only UI hooks (`custom()`, setFooter/Header/EditorComponent) to power mobile chrome — unsupported/no-op in RPC mode. [SOURCE: https://pi.dev/docs/latest/rpc]
- **Partial miss:** Did not dump a live session JSONL header in this iteration (would need writing outside lineage / user home); defer precise header field inventory.

### Open questions carried forward
- Exact session JSONL header fields available without parsing full history.
- Whether project-scoped `--session-id` sessions should appear in a separate list section from global sessions.

## Recommended Next Focus

Iteration 003: Streaming delta rendering + tool activity + approval dialogs — map `message_update` / `tool_execution_*` / `extension_ui_request` to mobile chat bubbles, tool cards, and modal approvals.
