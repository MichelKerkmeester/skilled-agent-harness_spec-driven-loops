# F2-change-effort — research brief

**Feature:** Change the effort / reasoning level from within the app
**Tier:** YES — harden + improve the existing UX

**Goal:** A flawless in-app effort switcher.
**Current state:** Works: an Effort control in the model sheet lists the host levels (pi exposes off/high/max) and calls set_thinking_level.
**Desired:** Hardened: legible labels + what each level means, switch-mid-turn behavior, disabled/unavailable handling, a11y, and how it reads next to the model control.

**Target bar:** Claude iOS app + Kimi Code app.
**Sources:** Mobbin reference flows (via web) where relevant, general web crawl, and other remote-CLI / agent-chat apps on GitHub.
**Budget:** 5x deepseek (no early convergence).

Each `iter-NN-<model>.md` is one independent, cited pass under a rotating lens.
`SYNTHESIS.md` (written after) is the build-ready decision.
