# Live title call (OpenCode 2.2.7)

Recorded 2026-11-13 at 10:04:38 UTC against the server from `trace-child-idle.md` (`opencode serve --port 50443`, `opencode v2.2.7`), session `ses_e2ba4d077ffeyYHxTtw1vSFCwS`. Every request carried HTTP Basic auth (user `opencode`, the password `serve` printed); the password is not recorded here.

## 1. The route from the task

Request:

```text
curl -sS -u opencode:<password> -X PATCH http://127.0.0.1:50443/session/ses_e2ba4d077ffeyYHxTtw1vSFCwS -H 'content-type: application/json' -d '{"title":"hop-title-check"}'
```

Response: HTTP 405, empty body. curl exit 0.

Read-back `curl -sS -u opencode:<password> http://127.0.0.1:50443/session/ses_e2ba4d077ffeyYHxTtw1vSFCwS`: HTTP 200 with the web app's HTML page (`<title data-sm>OpenCode</title>`), not session JSON. `/session/<id>` is a web UI route on 2.2.7, not an API route.

## 2. The route the server's API document names

The server's `GET /openapi.json` names `PATCH /api/session/{sessionID}`, operationId `session.update`, summary "Update session", body properties `title`, `metadata`, `permissions`, `archived`, success `204`.

Before, `GET /api/session/ses_e2ba4d077ffeyYHxTtw1vSFCwS`: HTTP 200, `"title":"oc013-parent-2"`.

Request:

```text
curl -sS -u opencode:<password> -X PATCH http://127.0.0.1:50443/api/session/ses_e2ba4d077ffeyYHxTtw1vSFCwS -H 'content-type: application/json' -d '{"title":"hop-title-check"}'
```

Response: HTTP 204, empty body. curl exit 0.

Read-back `curl -sS -u opencode:<password> http://127.0.0.1:50443/api/session/ses_e2ba4d077ffeyYHxTtw1vSFCwS`: HTTP 200,

```json
{"data":{"id":"ses_e2ba4d077ffeyYHxTtw1vSFCwS","projectID":"933aff1626d18c2e6cfdba185f557d1f3b206e5f","model":{"id":"deepseek-v4.1-flash-1017","providerID":"llmgateway","variant":"default"},"cost":0.0053733240000000005,"tokens":{"input":34078,"output":192,"reasoning":157,"cache":{"read":17408,"write":0}},"outcome":"succeeded","time":{"created":1794564108197,"updated":1794564278237,"busy":1794564208882,"idle":1794564210864},"title":"hop-title-check","location":{"directory":"<COPY>"}}}
```

The trace plugin then logged a v2 `session.renamed` event with keys `sessionID` and `title` for that session (`trace-child-idle.jsonl` lines 223 raw and 224 bridged).

## 3. The client a plugin holds

From `trace-child-idle.jsonl`:

- Line 2, the `dualPlugin` bridge's v1 client (what `session-relaunch.js` receives as `ctx.client`): `typeof client.session.update` is `undefined`; its session keys are `messages`, `promptAsync`, `create`, `prompt`, `delete`.
- Line 1, the native v2 setup context: `typeof ctx.session.update` is `function`; `ctx.client` is `undefined`.

So the title can be set on 2.2.7, but only through the v2 `ctx.session.update`, which the bridge does not expose to a v1 plugin (`.opencode/plugins/lib/v2-bridge.js:218-280`).

Title verdict: yes
Client update: undefined
