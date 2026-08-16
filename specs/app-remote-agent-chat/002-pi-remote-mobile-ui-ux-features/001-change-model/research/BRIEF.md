# F1-change-model — research brief

**Feature:** Change the active AI model from within the app
**Tier:** YES — harden + improve the existing UX

**Goal:** A flawless in-app model switcher.
**Current state:** Works: a centered "<model> v" header opens a sheet listing host-confirmed models; selecting one calls set_model (host-confirmed, never optimistic).
**Desired:** Hardened, Claude/Kimi-grade: search/filter, provider grouping, current-model + capability hints, graceful switch-during-a-running-turn, pending/stale/error states.

**Target bar:** Claude iOS app + Kimi Code app.
**Sources:** Mobbin reference flows (via web) where relevant, general web crawl, and other remote-CLI / agent-chat apps on GitHub.
**Budget:** 5x deepseek (no early convergence).

Each `iter-NN-<model>.md` is one independent, cited pass under a rotating lens.
`SYNTHESIS.md` (written after) is the build-ready decision.
