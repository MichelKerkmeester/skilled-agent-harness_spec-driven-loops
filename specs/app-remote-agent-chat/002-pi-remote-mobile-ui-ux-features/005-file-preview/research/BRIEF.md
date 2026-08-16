# F6-file-preview — research brief

**Feature:** See and preview a file like the Claude app
**Tier:** PARTIAL — reach the desired result with flawless UX

**Goal:** Open and preview files/artifacts inline the way Claude does (not just rendered diffs).
**Current state:** Partial: file_diff blocks render as styled diff cards and plans as checklists; there is no artifact/file preview surface (open, image/pdf/text/code viewer).
**Desired:** A Claude-style artifact/file viewer: tap to open full-screen, image/pdf/text/code renderers, redaction-aware (only shows what the relay already sends), share/close, a11y.

**Target bar:** Claude iOS app + Kimi Code app.
**Sources:** Mobbin reference flows (via web) where relevant, general web crawl, and other remote-CLI / agent-chat apps on GitHub.
**Budget:** 5x sol + 5x grok (no early convergence).

Each `iter-NN-<model>.md` is one independent, cited pass under a rotating lens.
`SYNTHESIS.md` (written after) is the build-ready decision.
