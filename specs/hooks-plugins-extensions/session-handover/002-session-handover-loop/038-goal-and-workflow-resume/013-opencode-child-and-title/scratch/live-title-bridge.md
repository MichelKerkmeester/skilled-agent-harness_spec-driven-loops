# Live check: the plugin titles a session at a claim seed through the bridged session.update (OpenCode 2.2.7)

Recorded 2026-11-13 at 11:10:55 UTC on `opencode v2.2.7`, against commit `195f1d764c`.

## Setup

- Clone: `git clone --shared` of the worktree into the session scratchpad. HEAD was `195f1d764c`. `cmp` showed the clone's copies of `session-relaunch.js`, `lib/v2-bridge.js`, `nudge.cjs` and `relaunch-core.cjs` matched the worktree's byte for byte. `.opencode/node_modules`, which git ignores, was a symlink to the worktree's copy. No file in the clone was edited.
- Server: `opencode serve --hostname 127.0.0.1 --port 61672`, with the clone as cwd and `PWD`. Environment:
  - `SYSTEM_SESSION_RELAUNCH_OPENCODE_ENABLED=1`. session-relaunch is the one default-off concern (`.skilled/hooks/shared/hook-flags.cjs:104-106`). The plugin's `isEnabled` passes `{ runtime: 'opencode' }`, so this per-runtime switch turns it on (`hook-flags.cjs:228-234`). The clone has no `hook-flags.env` file, because git ignores it.
  - `SKILLED_LOOP_NAME=hop-title-bridge-check`. This is the title `titleSeedSession` reads (`session-relaunch.js:270`).
  - Every inherited `SKILLED_LOOP_*` variable was removed with `env -u`, including `SKILLED_LOOP_ID`. The calling shell sits inside an operator loop. With that id inherited, a user message to the test session could withdraw an arm of the operator's real loop (`withdrawArmForUserMessage`). The title path does not need `SKILLED_LOOP_ID`. `ps eww <pid>` showed only `SKILLED_LOOP_NAME` among the loop variables.
  - `SYSTEM_SPEC_GATE_ENFORCE=0` and `AI_SESSION_CHILD=1`, as in the earlier run.
- The server log listed `loading plugin` for `session-relaunch.js` in the clone location before the seed was sent.

## Seed accepted by the plugin

`nudge.seedInstructions` returns non-null when `relaunch-core.parseClaimSeed` accepts the prompt. That requires the prefix `[session-relaunch] claim and continue handoff ` followed by one absolute path, with no surrounding whitespace and no newline (`relaunch-core.cjs:50`, `:111-130`). The path only has to parse. It does not have to exist.

## Commands and results (auth: HTTP Basic, user `opencode`, the password `serve` printed)

1. `POST /api/session` with body `{"title":"oc013-bridge-before","location":{"directory":"<clone>"},"model":{"providerID":"llmgateway","id":"deepseek-v4.1-flash-1017"},"permissions":[{"action":"*","resource":"*","effect":"deny"}]}`. Response: HTTP 200, session `ses_e2b6667c4ffeSD0WUUESHrGFUw`, `"title":"oc013-bridge-before"`. The deny-all ruleset was a guard, so a model turn could not run the claim command.
2. Title before: `GET /api/session/ses_e2b6667c4ffeSD0WUUESHrGFUw` returned HTTP 200 with `"title":"oc013-bridge-before"`.
3. Seed: `POST /api/session/ses_e2b6667c4ffeSD0WUUESHrGFUw/prompt` with body `{"text": "[session-relaunch] claim and continue handoff <clone>/.skilled/handoff-check-note.md", "resume": false}`. Response: HTTP 200, inbox item `msg_1d49a78b60017vZHJ54UEXpT3n`, created `1794568255672`. With `resume: false` the server admits the message but starts no agent turn. The model never ran: the read-back shows 0 tokens and cost 0.
4. Title after (read 5 s later): `GET /api/session/ses_e2b6667c4ffeSD0WUUESHrGFUw` returned HTTP 200 with:

```json
{"data":{"id":"ses_e2b6667c4ffeSD0WUUESHrGFUw","projectID":"933aff1626d18c2e6cfdba185f557d1f3b206e5f","model":{"id":"deepseek-v4.1-flash-1017","providerID":"llmgateway","variant":"default"},"cost":0,"tokens":{"input":0,"output":0,"reasoning":0,"cache":{"read":0,"write":0}},"time":{"created":1794568198353,"updated":1794568255765},"title":"hop-title-bridge-check","permissions":[{"action":"*","resource":"*","effect":"deny"}],"location":{"directory":"<clone>"}}}
```

## What the evidence shows

- Title before: `oc013-bridge-before`. Title after: `hop-title-bridge-check`.
- `time.updated` is `1794568255765`, 93 ms after the seed message was created (`1794568255672`). No model turn ran in between.
- The value `hop-title-bridge-check` existed only in the server's environment. `rg -n SKILLED_LOOP_NAME` over `.opencode/plugins` (tests excluded) and `~/.config/opencode/plugins` finds one reader, `session-relaunch.js:270`. No other plugin calls a session update.
- So the plugin's claim seed path, `titleSeedSession`, and the bridged `client.session.update` were all reached. The native `ctx.session.update` accepted `{ sessionID, title }` as built (`v2-bridge.js:278-281`). No other argument shape was tried, because none was needed. The server log for the clone location held no error apart from the two known plugin load failures (`system-skill-advisor.js`, `system-spec-gate.js`, missing `dist` files) and the MCP connect failures.

## Cleanup

- The server, pid 83681, got SIGTERM and exited. `ps -p 83681` exits 1.
- The clone was deleted. `ls <clone>` exits 1.
- An earlier start, pid 6612, was stopped before any request. The zsh `$UNSET` expansion did not split, so that process still held the inherited loop variables. The server log shows no plugin loaded in it.

Bridge title verdict: yes
