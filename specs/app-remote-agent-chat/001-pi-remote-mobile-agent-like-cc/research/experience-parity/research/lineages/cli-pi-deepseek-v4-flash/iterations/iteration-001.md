# Iteration 1: Prior-Art Landscape Survey

## Focus
Survey what actually ships today for remote/mobile control of coding agents — Claude Code Remote Control (the reference product), Copilot + GitHub Mobile, Cursor mobile, OpenAI Codex remote, Devin — plus the streaming event vocabulary (`--output-format stream-json`) that powers transcript UIs. Map each to the 041 architecture constraints (loopback relay, tailnet-only, foreground authority, redaction).

## Findings

### F1. Claude Code Remote Control — the reference pairing (v2.1.51+, push in v2.1.110+)
- Pairing: `claude remote-control` prints a session URL + QR code; phone opens it in the Claude app / claude.ai/code while signed into the **same claude.ai account**. Requires full-scope login token (`claude` + `/login`), subscription (Pro/Max/Team/Enterprise), Team/Enterprise owner toggle. No inbound ports — outbound HTTPS only (port 443).
- Phone capabilities: view conversation transcript, responses, tool activity, background subagents/workflows; send messages, images, files (as `@` references); **approve tool calls via permission prompts**; push notifications when long tasks finish or a decision is needed; find sessions by name in the session list.
- Approval UX: permission prompts stay open until answered; forwarded dialogs (model-choice etc.) close with no-action default after `dialogExpiry` (5 min default).
- Limits: one remote session per interactive process; session dies with the terminal/VS Code; ~10-minute network outage → timeout and process exit; `/plugin`, `/resume` are local-only.
- Implication for Pi: the reference product routes through Anthropic's cloud (account auth, outbound-only, claude.ai/code session list). Pi's tailnet-only loopback relay has NO vendor cloud — a structural privacy win, but it must compensate for the missing account-layer conveniences (session list, QR pairing, push) with its own mechanisms. `dialogExpiry` shows the reference already struggles with stale approval dialogs — a lease/CAS design point.

### F2. The transcript event vocabulary already exists as NDJSON: `--output-format stream-json`
- Claude Code headless emits newline-delimited JSON events (`stream_event` with `delta.type == "text_delta"`, plus message/tool events); community parsers (udhaykumarbala/claude-code-parser) document the event types; official docs only sketch the format, the protocol is effectively community-maintained ([SOURCE: github.com/anthropics/claude-code/issues/24596]).
- Implication: Pi's `--mode rpc` already emits structured events (per 041-003 framing); the design space is the **relay event schema**, not the RPC framing. The reference's vocabulary (text deltas, tool calls, tool results, subagent/workflow activity) is the bar to exceed with: extended-thinking deltas, TODO/plan list events, edit diff events, token/cost events — none of which stream-json exposes richly today (issue #24596 complains about missing event-type reference; cost/usage is only in final result JSON).

### F3. Copilot + GitHub Mobile — the async PR loop (best mobile *workflow*)
- Assign an issue to the Copilot coding agent from GitHub Mobile; agent works asynchronously, drafts a PR; review/merge from phone. Mission Control (Oct 2025) assigns/steers/tracks tasks anywhere on GitHub ([SOURCE: github.blog]).
- Implication: this is the strongest *task-delegation* loop but it is GitHub-cloud-bound and PR-shaped; Pi's model is session-shaped with exact-action approval, which is a different (finer-grained) control surface. Pi should borrow the "mission control" list/steer/track pattern for its session list + steer controls.

### F4. Cursor + OpenAI moved to phone remote control in 2026
- Cursor: iOS app + remote control of background agents (June 2026 changelog), background agent on web/mobile ([SOURCE: cursor.com/changelog/ios-mobile-app]); Cursor 2.0 extends.
- OpenAI: Codex remote access brought to ChatGPT iOS/iPad/Android ([SOURCE: techradar]).
- Implication: phone-control is the 2026 competitive frontier; first-mover advantage is thin, so a privacy-preserving design that *exceeds* the reference on approval fidelity and notification actionability is still winnable.

### F5. Devin — cloud-VM agent, not a phone-control layer
- Devin runs on cloud VMs and is explicitly not a phone-control experience; cannot test on physical phones ([SOURCE: docs.devin.ai]).
- Implication: not prior art for UX; relevant only for background-task patterns (fully detached execution).

### F6. 041 constraint map for the design space (architecture anchor)
- 003: one Pi child per session; immutable epochs; redacted envelopes persist-before-broadcast; session catalog with opaque client IDs; mutation ledger with clientMutationId/digest CAS.
- 004: loopback relay behind tailnet-only Tailscale Serve; short-lived app sessions; one-use WS tickets; exact-Origin validation; default-deny.
- 005: foreground PWA; epoch-sequenced reconciliation; offline read-only redacted cache; host-private data server-side.
- 006: final-boundary approval extension; canonical digest recomputed pre-execution; one lease; first-valid-CAS settles; expiry/revocation/epoch invalidation; metadata-only audit.
- 007: generic content-free push hints only after committed transitions; opaque lookup id + generic category; fetch-on-open reauth + epoch revalidation.

## Sources Consulted
- [SOURCE: https://code.claude.com/docs/en/remote-control] (fetched)
- [SOURCE: https://github.com/anthropics/claude-code/issues/24596]
- [SOURCE: https://backgroundclaude.com/blog/stream-json]
- [SOURCE: https://github.com/udhaykumarbala/claude-code-parser]
- [SOURCE: https://github.blog/ai-and-ml/github-copilot/assigning-and-completing-issues-with-coding-agent-in-github-copilot/]
- [SOURCE: https://github.blog/changelog/2025-10-28-a-mission-control-to-assign-steer-and-track-copilot-coding-agent-tasks/]
- [SOURCE: https://cursor.com/changelog/ios-mobile-app]
- [SOURCE: https://www.techradar.com/pro/a-new-rhythm-for-collaboration-is-emerging-openai-adds-remote-access-to-bring-codex-to-chatgpt-for-iphone-ipad-and-android]
- [SOURCE: https://docs.devin.ai/get-started/devin-intro]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/{003,004,005,006,007}/spec.md]

## Assessment
- newInfoRatio: 1.00
- Novelty justification: First pass; every finding is new to this packet; establishes the competitive baseline and the architecture constraint map.
- Confidence: high on shipped reference facts (vendor docs); medium on future-dated changelog claims (2026 releases).

## Reflection
- What worked: vendor-docs-first search; the remote-control doc fetch pinned the exact reference UX (QR pairing, approval prompts, dialog expiry, outage timeout, one-session-per-process).
- What failed / ruled out: Devin as UX prior art (cloud-VM, no phone layer); treating stream-json as an official protocol (it is community-maintained).
- Key insight: the reference product's weakest joints are exactly Pi's design targets: notification actionability, approval friction, session list discoverability, and cloud-free pairing.

## Recommended Next Focus
Axis 1a: design the relay transcript event schema — event vocabulary for streaming text, extended thinking, TODO/plan lists, tool-call inputs, edit diffs, tool results, token/cost — mapped onto 003 epoch/envelope persistence.
