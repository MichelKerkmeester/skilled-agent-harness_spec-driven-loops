# Resource Map — cli-pi-deepseek-v4-flash lineage

Emitted from converged research deltas (`deltas/iter-001..006.jsonl`). Sources cited across the lineage:

## Pi (installed package)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/rpc.md` — protocol: framing, commands, events, extension-UI sub-protocol, types (I1, I2, I3, I4, I6)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md` — extension trust statement (I4)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/sessions.md` — negative: no session-dir layout documented (I6)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-client.js` — settlement resolution on `agent_settled` (I6)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/modes/rpc/rpc-types.d.ts` — `leafId`, `sessionFile`; negative: no idempotency fields (I1, I3, I6)
- `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md` — RPC mode pinning (I1)

## Web/platform standards
- RFC 6455 (WebSocket), RFC 8291 (push message encryption), RFC 8292 (VAPID) (I1, I3, I4, I5)
- W3C Push API; MDN: WebSocket API, WebSocket client applications, Push API, Background Sync (I1, I5)
- WebKit blog 13878 (iOS web push), Apple developer docs (web push in web apps), web.dev service workers, WebKit storage policy blog 14403, bugs.webkit.org/201866 (I5)

## Security
- OWASP WebSocket Security Cheat Sheet; OWASP WSTG WebSockets testing (I4)
- Tailscale: kb/1242 (serve), kb/1223 (funnel), ACL docs, Funnel introduction blog (I4)

## Messaging semantics
- Azure Service Bus message loss/duplicates; Kafka design (exactly-once); AWS SQS (FIFO dedup window); Socket.IO delivery guarantees + state recovery; Ably idempotency (I3)

## Claude parity reference
- code.claude.com remote-control, permission-modes, permissions; GitHub issue #29214; claude.com MCP app design guidelines; Apple HIG loading; Claude help center artifacts/visual content (I2)

## Coverage
- 6 iteration deltas: 37 findings (6+6+6+7+6+6), 6 ruled-out directions + 4+3+4+4+4+1 = 20 eliminated entries total across iterations, 6 ranked residual risks, 9 acceptance gates.
