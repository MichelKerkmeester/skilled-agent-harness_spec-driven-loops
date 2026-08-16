# F3-slash-commands — research brief

**Feature:** Typed "/" commands with the real host command list, inline like a terminal
**Tier:** PARTIAL — reach the desired result with flawless UX

**Goal:** Type "/" in the composer and get a live, filterable list of the ACTUAL available host commands with descriptions and argument hints.
**Current state:** Partial: the real get_commands catalog (relay-filtered) is reachable via a "+" tools popover that inserts "/name ", but typing "/" in the main composer does NOT open an inline list.
**Desired:** Terminal-style inline trigger: "/" as first char opens a list above the composer; fuzzy filter as you type; descriptions + arg hints; keyboard + touch selection; never auto-submits.

**Target bar:** Claude iOS app + Kimi Code app.
**Sources:** Mobbin reference flows (via web) where relevant, general web crawl, and other remote-CLI / agent-chat apps on GitHub.
**Budget:** 5x sol + 5x grok (no early convergence).

Each `iter-NN-<model>.md` is one independent, cited pass under a rotating lens.
`SYNTHESIS.md` (written after) is the build-ready decision.
