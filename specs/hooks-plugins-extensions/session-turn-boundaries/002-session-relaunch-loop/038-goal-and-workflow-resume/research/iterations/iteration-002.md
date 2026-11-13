# Iteration 2: Session names across a hop (report section 3, Q2) plus two carried items

## Focus
Verify every claim and path:line citation in the report's Q2 section (`scratch/handover-gaps-research-2026-11-13.md:35-46`), settle its UNCONFIRMED items with each runtime's own `--help` output, learn the shape of a Claude `/rename` log entry, check for an OpenCode session-title API, and close two items carried from iteration 1: whether fan-out `started` ledger events carry a pid, and whether an OpenCode child session can still run when the parent goes idle. Q3 (other dropped state) is left for iteration 3.

## Actions Taken
1. Read the report in full and iteration 1's narrative so nothing is repeated.
2. Opened `.skilled/bin/skilled-loop` at 470-500, 590-680, 770-790, 935-945, 178-192 and 1220-1256, and `bin/session-relaunch.cjs` at 552-566 and 632-648.
3. Opened README 36-60, the Pi fixture, the Pi adapter's settings code and the OpenCode plugin's seed block (400-416).
4. Ran `command <binary> --help` for claude, pi, opencode, codex, cursor-agent and devin, plus `opencode run --help`, `opencode session --help`, `codex exec --help` and `codex resume --help`. All exited 0. Versions: `opencode v2.2.7`, `codex-cli 0.167.2`. The bare names are shell functions; `command` resolved to the binaries in `~/.local/bin` and `/opt/homebrew/bin`.
5. Searched `~/.claude/projects/**/*.jsonl` for title-like entry types, printing only `type` values and key names.
6. Searched the installed `@opencode-ai/sdk` (1.18.34) type and source files for a session update API, the session status type and any background-subagent behaviour.
7. Read the fan-out `started` emitter in `fanout-pool.cjs` and the snapshot handler in `fanout-run.cjs`.

## Findings

### Claude
1. **CONFIRMED.** `-n/--name` and `--name=` are captured into `SKILLED_LOOP_NAME`. [SOURCE: .skilled/bin/skilled-loop:775] [SOURCE: .skilled/bin/skilled-loop:782] The capture sits outside any runtime check, so the name is captured on every runtime, not only Claude and Pi. [INFERENCE: based on skilled-loop:771-788, a plain `case "$argument"` with no runtime test]
2. **CONFIRMED.** Claude replays it verbatim inside `build_relaunch_arguments`. [SOURCE: .skilled/bin/skilled-loop:604] [SOURCE: .skilled/bin/skilled-loop:616] [SOURCE: .skilled/bin/skilled-loop:617]
3. **CONFIRMED.** `prepare` takes the name only from the environment. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:560]
4. **CONFIRMED.** `consume` returns `name`. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:641] The wrapper calls `consumed_field` only for `model`, `provider` and `effort`. [SOURCE: .skilled/bin/skilled-loop:1226] [SOURCE: .skilled/bin/skilled-loop:1241] [SOURCE: .skilled/bin/skilled-loop:1252] A grep of the wrapper found no other `consumed_field` call.
5. **CONFIRMED by help.** Claude's help line: `-n, --name <name>   Set a display name for this session (shown in the prompt box, /resume picker, and terminal title)`.
6. **RESOLVED (was UNCONFIRMED): the shape of a `/rename` entry.** Claude session logs hold three title-like entry types, none with message content. `custom-title` has keys `["customTitle","sessionId","type"]`. `agent-name` has `["agentName","sessionId","type"]`. `ai-title` has `["aiTitle","sessionId","type"]`. Counts across the logs: 33,356 `custom-title`, 37,569 `agent-name`, 54,249 `ai-title`, in 51 files. In logs that hold a `/rename` local command, `custom-title` and `agent-name` entries appear in pairs, repeated through the file. [SOURCE: rg/jq over ~/.claude/projects/**/*.jsonl, type and key names only]
7. **NEW: `prepare` can read it cheaply.** The CLI already tails the Claude transcript for model and effort in `readClaudeSettings`. [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:229] The tail window is 256 KiB. [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:18] The same pass could take the last `custom-title.customTitle` and hand it to `preparePending` in place of the environment value at session-relaunch.cjs:560. Because the entries repeat through the file, a tail read will usually find one. That last point is inferred from the counts, not from Claude's writer. [INFERENCE: based on the entry counts and context-usage.cjs:229-245] Whether a launch `--name` also writes a `custom-title` entry is UNCONFIRMED; it would take a log from a session started with `--name` and never renamed.
8. **CONFIRMED (citation).** The suffix change belongs in `build_relaunch_arguments` at skilled-loop:616. Note that the wrapper reads `consume`'s fields only after the name is already in `SKILLED_LOOP_NAME`, so a live name from the record has to be read in the 1220-1256 block to beat the launch value, as model does. [INFERENCE: based on skilled-loop:1223-1238 and :616-617]

### Pi
9. **CONFIRMED.** Pi replays the name the same way. [SOURCE: .skilled/bin/skilled-loop:631] [SOURCE: .skilled/bin/skilled-loop:632] Help line: `--name, -n <name>              Set session display name`, and the example `pi --name "Refactor auth module"`.
10. **CONFIRMED.** The fixture has `"sessionName": null`, so the field exists in Pi's event and was empty in that capture. [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/pi-assistant-message-end.json:9]
11. **CONFIRMED.** The Pi adapter's arm settings hold only `model`, `provider` and `effort`; no `sessionName` read exists in the adapter. [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:423] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:461] README:42 says the extension hands model, provider and thinking to the record at arm. [SOURCE: .skilled/hooks/session-relaunch/README.md:42]

### OpenCode, Codex, Cursor, Devin
12. **CONFIRMED.** `-n/--name` is classed value-taking for codex, cursor, devin and opencode in `skilled_loop_replay_takes_value`. [SOURCE: .skilled/bin/skilled-loop:478] [SOURCE: .skilled/bin/skilled-loop:495] [SOURCE: .skilled/bin/skilled-loop:496] It is also record-backed. [SOURCE: .skilled/bin/skilled-loop:596] [SOURCE: .skilled/bin/skilled-loop:597] Record-backed options are kept out of replay. [SOURCE: .skilled/bin/skilled-loop:940] No arm for the four adds a name. [SOURCE: .skilled/bin/skilled-loop:637] [SOURCE: .skilled/bin/skilled-loop:674]
13. **RESOLVED (was UNCONFIRMED): none of the four takes a name flag at launch.** A grep of each root help for `-n`, `--name`, `--title`, `rename` and `title` matched nothing on opencode, codex, cursor-agent or devin. Per runtime:
    - **OpenCode:** the root command has no name or title flag. `opencode run --help` has `--title string            Session title`, but the wrapper starts the root command with `--prompt` [SOURCE: .skilled/bin/skilled-loop:647], so that flag is not reachable on a hop.
    - **Codex:** sessions have names, but no flag sets one. `codex resume --help`: `Session id (UUID) or session name. UUIDs take precedence if it parses.` `codex --help`: `archive           Archive a saved session by id or session name`. No launch flag names a session.
    - **Cursor:** no name flag. The only nearby option is `-w, --worktree [name]`, which names a worktree, not a session.
    - **Devin:** sessions have names (`rm         Delete a session by id or name`), but no flag sets one.
14. **NEW: the wrapper's flag lists claim more than the help shows.** The comments say the lists follow each runtime's `--help` [SOURCE: .skilled/bin/skilled-loop:477] [SOURCE: .skilled/bin/skilled-loop:590], yet `-n/--name` is listed for four runtimes whose help has no such flag. The effect on a hop is harmless, since the option is stripped. A launch that passes `-n` to one of these runtimes is a separate question this iteration did not test. [INFERENCE: based on the help greps and skilled-loop:495-497, :596-597]
15. **NEW: the name still reaches the record on these runtimes.** Because the capture at skilled-loop:775 is runtime-agnostic and `prepare` reads `SKILLED_LOOP_NAME`, an OpenCode, Codex, Cursor or Devin record carries the launch name; nothing consumes it. [INFERENCE: based on skilled-loop:775-787 and session-relaunch.cjs:560]
16. **RESOLVED (was UNCONFIRMED): a plugin can set an OpenCode title.** The installed SDK types `SessionUpdateData` with `title?: string` on the `/session/{id}` route. [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:1916] [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:1918] [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:1926] `Session.update` takes it. [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/gen/sdk.gen.d.ts:130] Other repo plugins already call `client.session.*`. [SOURCE: .opencode/plugins/ask-surface-guard.js:80] The relaunch plugin makes no `client` call today, so it would need the client from its plugin context. Two limits stay UNCONFIRMED: the SDK is 1.18.34 while the runtime is 2.2.7, so whether that route still sets the title on 2.2.7 needs one live call; and the plugin's seed block [SOURCE: .opencode/plugins/session-relaunch.js:407] [SOURCE: .opencode/plugins/session-relaunch.js:414] has no name in hand, since the note carries none.
17. **CONFIRMED.** Cursor and Devin start a hop only from the printed claim command, because no arm event exists for them. [SOURCE: .skilled/hooks/session-relaunch/README.md:58]

### Carried items from iteration 1
18. **RESOLVED: fan-out `started` events carry no pid.** The pool emits `{ event: 'started', label, index, attempt, at }` before the work function runs. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:369] The runner's snapshot handler stores only status and `started_at_iso` from it. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:363] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:364] Because the event fires before the spawn, the pid does not exist yet. Iteration 1's finding 20 therefore costs more than one field: `detectOrphanedLineages` would have to read the pid from the later liveness records (iteration 1, fanout-pool.cjs:176) or from a new post-spawn event. [INFERENCE: based on fanout-pool.cjs:362-372]
19. **NARROWED, still not observed: an OpenCode child can run past its parent's block.** The installed SDK's v2 client has a `background` call documented as "Detach any synchronous subagents currently blocking the session and continue them in the background." [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/sdk.gen.js:284] Its route is `/experimental/session/{sessionID}/background` [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/types.gen.d.ts:6710], and a config field `backgroundSubagents: boolean` exists. [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/types.gen.d.ts:1747] So OpenCode supports subagents that keep running after the parent is unblocked, and the parent can then reach `session.idle`. That `session.idle` fires for the parent while a backgrounded child is `busy` is inferred, not traced. `SessionStatus` carries `idle`, `retry` and `busy` [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:396], and `session.idle` carries only `sessionID` [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:413], so the plugin must track child status itself, which supports iteration 1's finding 8. Missing evidence: an event trace on 2.2.7 with a backgrounded subagent.

## Ruled Out
- Reading `opencode session --help` for a rename: it has no title or name option.
- Using `opencode run --title` on a hop: the wrapper starts the root command, not `run`.

## Dead Ends
- A launch flag for naming on Codex, Cursor, Devin and the OpenCode root command: the help output has none. Candidates for "Exhausted Approaches".

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: the wrapper's comments say its option lists follow `--help`, but four `-n/--name` entries are not in the help (finding 14). Recorded, not resolved.
- Missing dependencies: no OpenCode 2.2.7 event trace and no unrenamed `--name` Claude log; both named above.
- Partial success: the first two help runs failed with exit 127 because `timeout` and zsh word splitting stopped `command` from resolving; rerun with `command ${=c}` succeeded, exit 0 for all.

## SCOPE VIOLATIONS
- None.

## Sources Consulted
- scratch/handover-gaps-research-2026-11-13.md:35-46, :70-81
- .skilled/bin/skilled-loop:178-192, :470-500, :590-680, :770-790, :935-945, :1220-1256
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:552-566, :632-648
- .skilled/hooks/session-relaunch/README.md:36-60
- .skilled/hooks/session-relaunch/tests/fixtures/pi-assistant-message-end.json:1-15
- .skilled/hooks/session-relaunch/pi/session-relaunch.ts:417-461
- .skilled/hooks/session-relaunch/lib/context-usage.cjs:18, :229-245
- .opencode/plugins/session-relaunch.js:400-416; .opencode/plugins/ask-surface-guard.js:80
- .opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts, dist/gen/sdk.gen.d.ts, dist/v2/gen/sdk.gen.js, dist/v2/gen/types.gen.d.ts
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:360-372; fanout-run.cjs:355-392
- `command <binary> --help` for claude, pi, opencode (+ run, session), codex (+ exec, resume), cursor-agent, devin
- ~/.claude/projects/**/*.jsonl (entry types and key names only)

## Assessment
- New information ratio: 0.80
- Questions addressed: Session names; Running workers (carried items)
- Questions answered: Session names; Running workers (its remaining item now has its missing evidence named)

## Questions Answered
- Session names: per runtime, Claude and Pi replay the launch name and take `-n/--name`; OpenCode, Codex, Cursor and Devin drop it and have no launch flag; OpenCode's plugin SDK can set a title; a Claude `/rename` is a `custom-title` entry `prepare` can read.
- Running workers: the pid question resolves to "no pid on `started`"; the OpenCode child-at-idle item is narrowed to a supported feature with its missing trace named.

## Questions Remaining
- Q3 other dropped state, Q4 report accuracy beyond Q1 and Q2, Q5 re-ranking.

## Reflection
- What worked and why: help output closed the four "UNCONFIRMED" flags at once, and the SDK's own doc comment answered the OpenCode child question that repo code could not.
- What did not work and why: the first help runs failed because `timeout command ...` runs `command` as a program and zsh does not split `$c`.
- What I would do differently: use `${=c}` in zsh loops from the start.

## Recommended Next Focus
Iteration 3: Q3 other dropped state (permission mode, Pi mode flags, added directories, wakeups, crons, todo list), Q4 report accuracy, and Q5 re-ranking. For re-ranking, report change 9 shrinks: OpenCode can be named through `client.session.update` in the plugin; Codex, Cursor and Devin cannot be named at launch at all. Report change 6 becomes cheaper on Claude through the `custom-title` entry.
