# Live trace: parent idle while a backgrounded sub-agent is busy (OpenCode 2.2.7)

Recorded 2026-11-13, 10:01:48 to 10:04:54 UTC. Raw trace: `trace-child-idle.jsonl` (226 lines). Line numbers below are lines of that file.

## What ran

- Binary: `/Users/michelkerkmeester/.local/bin/opencode --version` printed `opencode v2.2.7`.
- COPY: `git clone --shared` of the worktree at HEAD `59c7aede7d` into the session scratchpad. `.opencode/node_modules` (gitignored, absent from the clone) was a symlink to the worktree's copy so `v2-bridge.js` could import `zod`. COPY's `session-relaunch.js` and `lib/v2-bridge.js` were byte-identical to the worktree's (`diff -q`).
- Trace plugin: `COPY/.opencode/plugins/zz-oc013-trace.js`, a native v2 plugin (`export default { id, async setup(ctx) }`). Lane `raw` logs every event from `ctx.event.subscribe({ signal })` as delivered by OpenCode. Lane `bridged` wraps a v1 server in the same `dualPlugin` from `lib/v2-bridge.js` that `session-relaunch.js` uses, and logs what that v1 `event` hook receives. Each row: type, session id, `info.parentID`, every key path matching `/parent/i` (`parentPaths`), status type.
- Server: `opencode serve --hostname 127.0.0.1 --port 50443`, cwd and `PWD` set to COPY, `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`. HTTP routes taken from the server's own `GET /openapi.json` (fetched with `opencode api --server`). All routes need HTTP Basic auth, user `opencode`, password printed by `serve`.
- Parent 1: `POST /api/session` with model `llmgateway-providers/alibaba/deepseek-v4.1-flash-1017` (listed by `opencode models`). Its first step failed with HTTP 403 `provider.auth`: "Direct provider routing is not available on coding plans. Use the canonical model id (e.g. `deepseek-v4.1-flash-1017`) without a provider prefix". No sub-agent started.
- Parent 2: `POST /api/session` with model `llmgateway/deepseek-v4.1-flash-1017` (same model, canonical gateway id, also listed by `opencode models`, and the model `opencode.json` names). Session `ses_e2ba4d077ffeyYHxTtw1vSFCwS`. Prompt (`POST /api/session/{id}/prompt`): launch one `general` sub-agent whose only job is `sleep 90`. The child was `ses_e2ba4c44fffeQU0PM9VdPO0Gy4` (agent `general`, title "Run sleep 90").
- Background, at 10:02:01 with the parent id, after the child's shell started (line 123):
  - `POST /experimental/session/{parent}/background` returned HTTP 405 with an empty body.
  - `POST /api/experimental/session/{parent}/background` returned HTTP 404.
  - `POST /api/session/{parent}/background` (operationId `session.background`, "Move active foreground backgroundable tools for this session into background observation") returned HTTP 204. This is the call that took effect.
- Recorded 125 s after the background call, then the title check, then the server was stopped.

## Ordered events as the session-relaunch plugin receives them (lane `bridged`)

Deltas and `project.updated` omitted. The raw lane carries the same v2 types one line earlier; `message.updated`, `message.part.updated` and `session.idle` exist only on the bridged lane (bridge mappings and the `session.execution.succeeded` alias).

| Line | UTC | Type | Session | Parent id path | Status |
|------|-----|------|---------|----------------|--------|
| 47 | 10:01:48.255 | `session.created` | parent | - | - |
| 55 | 10:01:48.304 | `session.execution.started` | parent | - | - |
| 78 | 10:01:51.277 | `session.tool.called` | parent | - | - |
| 81 | 10:01:51.373 | `session.created` | child | `parentID`=ses_e2ba4d077ffeyYHxTtw1vSFCwS | - |
| 89 | 10:01:51.384 | `session.execution.started` | child | - | - |
| 120 | 10:01:54.209 | `session.tool.called` | child | - | - |
| 123 | 10:01:54.217 | `shell.created` (sh_1d45b4727001ItT3NE94FVdKdN) | - | - | running |
| 127 | 10:02:01.351 | `session.inbox.enqueued` | parent | - | - |
| 129 | 10:02:01.356 | `session.tool.success` | parent | - | - |
| 138 | 10:02:04.616 | `session.step.started` | parent | - | - |
| 157 | 10:02:05.420 | `session.text.ended` | parent | - | - |
| 166 | 10:02:06.552 | `session.execution.succeeded` | parent | - | - |
| 167 | 10:02:06.553 | `session.idle` | parent | - | - |
| 169 | 10:03:24.231 | `shell.exited` | - | - | exited |
| 171 | 10:03:24.241 | `session.tool.success` | child | - | - |
| 197 | 10:03:28.880 | `session.execution.succeeded` | child | - | - |
| 198 | 10:03:28.882 | `session.idle` | child | - | - |
| 199 | 10:03:28.882 | `session.inbox.enqueued` | parent | - | - |
| 201 | 10:03:28.888 | `session.execution.started` | parent | - | - |
| 221 | 10:03:30.866 | `session.execution.succeeded` | parent | - | - |
| 222 | 10:03:30.866 | `session.idle` | parent | - | - |
| 224 | 10:04:38.245 | `session.renamed` | parent | - | - |

Every child session event between lines 85 and 198 carries the child id `ses_e2ba4c44fffeQU0PM9VdPO0Gy4`.

## Observations

- The parent's bridged `session.idle` (line 167, 10:02:06.553) arrived 5 s after the background call, while the child's `sleep 90` shell was still running (`shell.created` running at line 123, `shell.exited` only at line 169, 10:03:24) and before the child's own `session.execution.succeeded` (line 197). The child was busy for 82 s after the parent went idle.
- When the child finished, the parent received the result as a new inbox item (line 199), started a second execution (line 201) and went idle again (line 222). The bridge's idle dedupe resets on `session.execution.started`, so the second parent idle was delivered.
- The child's parent id is on the child's `session.created` only, as a top-level `parentID` (raw line 80 `data.parentID`; bridged line 81 `properties.parentID`). It is not at `properties.info.parentID`: v2 sends no `info`, and the bridge synthesizes `info: { id: sessionID }` only (`.opencode/plugins/lib/v2-bridge.js:421`). `session-relaunch.js:326-336` tests `properties.info.parentID`, so as written it does not recognise this child.
- No `session.updated` event and no `session.status` event appeared in the plugin stream or in a parallel `GET /api/event` SSE capture. The v2 event enum in the server's OpenAPI document lists no `session.updated`. Busy and idle for a child are visible only as `session.execution.started` and `session.execution.succeeded` (and the bridged `session.idle` alias). The status field was null on every session event.
- The bridged init row (line 2) logged `typeof client.session.update` as `undefined`; the raw `ctx.session.update` was `function` (line 1).

Verdict: yes
Child parentID: yes

Field path: `properties.parentID` on the child's `session.created` as the bridged plugin receives it (raw v2 `data.parentID`), lines 80 and 81. `properties.info.parentID`, the path the plugin reads today, is absent.
