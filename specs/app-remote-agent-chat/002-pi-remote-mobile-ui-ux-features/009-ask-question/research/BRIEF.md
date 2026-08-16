# 009-ask-question — research brief

**Feature:** Support pi’s ask-question extension in the PWA
**Tier:** PARTIAL/NO — new surface, reach desired UX

**Goal:** Render pi’s ask-question prompts inline in the mobile chat with a terminal-style, keyboard-friendly question card — the way OpenCode, Claude, and Codex present agent questions.
**Current state:** pi exposes an ask-question extension on the desktop terminal; the PWA has no surface for it, so agent questions cannot be answered from the phone.
**Desired:** An inline question card (prompt + selectable options + free-text where allowed), keyboard/great-thumb navigation, host-confirmed answer submission, in the fixed ink-on-parchment system — UX on par with OpenCode / Claude / Codex ask-question prompts.

**Target bar:** OpenCode, Claude, and Codex ask-question / prompt UIs; plus Mobbin/Refero reference flows.
**Reference apps:** OpenCode, Claude, Codex, plus Dot, Perplexity, Copilot, Manus, Grok, Pi, Meta AI, ChatGPT, Gemini, Genie via Mobbin/Refero.
**Sources:** Mobbin (code mode) + Refero (code mode) real reference screens, general web crawl, and the named apps’ docs.
**Budget:** reference-screen research loop (to be run); no early convergence.

Each research pass captures/cites real reference screens and derives adoptable
patterns. `research.md` (written after) is the build-ready decision.
