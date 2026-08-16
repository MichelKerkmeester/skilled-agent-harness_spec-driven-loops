# F7-rich-content-blocks — research brief

**Feature:** Claude-style rich content blocks — bash Command/Output cards + code/text artifact cards with copy + full-screen
**Tier:** PARTIAL — reach the desired result with flawless UX

**Goal:** Render the transcript content pi already sends (tool calls/results, code, long text) as polished Claude-app-grade blocks: a bash Command/Output card, code blocks with syntax + Copy, and a text/prompt "artifact" card with Copy + open-full-screen — reusing the F6 viewer shell.
**Current state:** Partial: tool_call/tool_result collapse into a quiet grouped "Activity" disclosure; assistant text is plain serif prose; there is no Copy or full-screen affordance on code, commands, or long text; only file_diff renders as a styled card.
**Desired:** Claude-parity content blocks, all READ-ONLY over already-redacted content: a bash/tool Command + Output card that expands to a full-screen modal; fenced code rendered with syntax + a Copy button + open-full-screen; a long-text / goal-prompt "artifact" card (label, preview, Copy, expand). No new mutation; no host-filesystem reads.

**Target bar:** Claude iOS app + Kimi Code app.
**Sources:** Mobbin reference flows (via web) where relevant, general web crawl, and other remote-CLI / agent-chat apps on GitHub.
**Budget:** 5x sol + 5x grok (no early convergence).

Each `iter-NN-<model>.md` is one independent, cited pass under a rotating lens.
`SYNTHESIS.md` (written after) is the build-ready decision.
