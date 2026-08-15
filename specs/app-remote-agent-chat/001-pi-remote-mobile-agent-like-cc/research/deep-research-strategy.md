# Deep Research Strategy — Custom Claude-App-Style Mobile Client for pi via RPC Mode

## Charter

Design a custom mobile client for the pi coding agent that replicates the Claude app / Claude Code Remote Control UX, driven by `pi --mode rpc`. Research must cover: protocol surface, session model, transport, security, UX parity, streaming, notifications, attachments, deployment, testing, and a build roadmap. All 20 iterations run (no early convergence).

## Key Questions

- Q1: What is the complete `pi --mode rpc` command/event surface a client must implement?
- Q2: How do sessions (JSONL, resume, switch, fork, clone, entry cursors) map to a mobile session-list UI?
- Q3: What transport (Tailscale Serve, WebSocket relay, Cloudflare Tunnel, SSH) best fits mobile with reconnect?
- Q4: What security model (auth, per-session authorization, locking, sandboxing) is mandatory?
- Q5: Which Claude-app UX elements are replicable (chat bubbles, tool activity, approvals, push, attachments)?
- Q6: How to render streaming deltas (text/thinking/toolcall) in a mobile client?
- Q7: How to implement push notifications via pi extension events?
- Q8: What web stack + relay architecture should the client use?
- Q9: How to handle reconnect, in-flight turns, and double-submit prevention?
- Q10: What is the build roadmap, MVP scope, and verification plan?

## Focus Plan (20 iterations, no early convergence)

1. RPC protocol surface inventory (commands, events, extension UI) — devin/glm
2. Session model → session-list UI mapping — devin/glm
3. Transport options comparison (latency, auth, reconnect) — devin/glm
4. Security architecture (auth, per-session authz, locking, least privilege) — devin/glm
5. Claude app UX reference (session list, chat, tool activity, approvals, push) — cursor/grok
6. Streaming delta rendering design (text/thinking/toolcall) — cursor/grok
7. Push notifications via pi extension events (ntfy/Telegram) — cursor/grok
8. Steering interaction model (prompt vs steer vs follow_up, abort, queueing) — cursor/grok
9. Web client stack + PWA + mobile browser terminal (xterm.js) — pi/gpt-5.6-sol
10. Relay server architecture (Node, RPC child supervision, health, restart) — pi/gpt-5.6-sol
11. Reconnect & state reconciliation (cursors, in-flight turns, double-submit) — pi/gpt-5.6-sol
12. Auth implementation (WebAuthn/passkeys, tokens, capability scoping) — pi/gpt-5.6-sol
13. Multi-session & multi-device sync and locking — pi/gpt-5.6-sol
14. File/image attachments over RPC (images field, @-references) — pi/gpt-5.6-sol
15. Prior art: pi-chat architecture, community RPC/web clients — pi/deepseek
16. Cost/performance indicators (tokens, compaction, context stats) — pi/deepseek
17. Error handling & observability (extension_error, retry events, logs) — pi/deepseek
18. Deployment topology (home Mac vs VPS vs Codespaces, Docker, TLS, rate limits) — pi/deepseek
19. End-to-end testing & verification plan — pi/deepseek
20. Build roadmap: milestones, effort, risks, MVP definition — pi/deepseek

## What Worked

- (empty — iterations will append)

## What Failed

- (empty)

## Exhausted Approaches

- (empty)

## Ruled-Out Directions

- (empty)

## Divergence Frontier

- (empty)

## Next Focus

Iteration 001: RPC protocol surface inventory
