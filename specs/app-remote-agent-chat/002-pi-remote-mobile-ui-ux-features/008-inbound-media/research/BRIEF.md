# F8-inbound-media — research brief

**Feature:** Preview media/screenshots that pi sends, inline
**Tier:** NO — reach the desired result with flawless UX

**Goal:** Let pi surface an image/screenshot into the transcript, previewed inline as a card and full-screen — the inbound analog of F5, designed security-first.
**Current state:** Not possible: the pi RPC protocol has NO image content block (transcript kinds are text/thinking/plan/tool_call/tool_result/file_diff/usage). pi cannot send a raw image today.
**Desired:** A new redacted INBOUND image content type: relay-sanitized bytes served under an opaque artifact id + revision + digest (no raw host paths or unbounded bytes in durable state), an inline thumbnail card + full-screen viewer (reuse F6), with size/type limits and redaction rules. This crosses the read-only/redaction posture on the inbound side — design the content block, sanitization, delivery, and how it is redacted in the durable transcript.

**Target bar:** Claude iOS app + Kimi Code app.
**Sources:** Mobbin reference flows (via web) where relevant, general web crawl, and other remote-CLI / agent-chat apps on GitHub.
**Budget:** 5x sol + 5x grok + 5x deepseek (no early convergence).

Each `iter-NN-<model>.md` is one independent, cited pass under a rotating lens.
`SYNTHESIS.md` (written after) is the build-ready decision.
