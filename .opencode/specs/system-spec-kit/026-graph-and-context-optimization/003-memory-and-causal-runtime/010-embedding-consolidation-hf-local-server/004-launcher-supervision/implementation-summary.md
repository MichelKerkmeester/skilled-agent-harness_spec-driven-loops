---
title: "Implementation Summary: Add launcher supervision for the hf model server"
description: "Implemented. The launcher lazily spawns + supervises hf-model-server as a launcher-owned sibling child: 2nd crash-loop guard, generalized RSS watchdog, modelServerPid lease, probeModelServer, and an hf-embed-respawn wx lock — reusing F1/F3 algorithms with separate state. F1 (14) + F3 (4) suites stay green; adversarially reviewed (0 confirmed defects)."
trigger_phrases:
  - "launcher-owned model-server supervision implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision"
    last_updated_at: "2026-05-29T09:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Launcher supervises hf-model-server; F1 14 + F3 4 stay green; 24 total; review clean"
    next_safe_action: "Phase 005: retire the sidecar apparatus + collapse the execution router"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000594"
      session_id: "029-004-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-launcher-supervision |
| **Completed** | 2026-05-29 (implemented + headless-verified; F1/F3 non-regressed) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mk-spec-memory launcher now lazily spawns and supervises `hf-model-server.cjs` as a **launcher-owned sibling child** (not detached), reusing the F1/F3 algorithms with separate model-server state. Lazy-spawn mechanism: the launcher binds a tiny demand listener on the embed UDS; the daemon-side hf-local client's first `/api/health` hits it, which spawns the model server (via `launchModelServer`) and replies 503-loading (the client retries through the cold-load). A read-only session never spawns it. Supervision: a **second** `createCrashLoopGuard` + relaunch timer drives the same `superviseChildExit` (independent of the daemon's guard); `startRssWatchdog` was generalized to take a target pid + the model-server ceiling env (`SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB`/`_RSS_SELF_EXIT`) while the daemon's watchdog is unchanged; an additive `modelServerPid` lease field; the signal cascade reaps both trees; reap-before-respawn + an `hf-embed-respawn.lock` (wx + stale reclaim) single-winner; `probeModelServer` (GET /api/health, ready||loading = alive) added to the bridge as a separate function from `probeDaemon`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Lazy demand listener + `launchModelServer` + 2nd crash-loop guard/timer + generalized RSS watchdog + `modelServerPid` lease + reap/teardown + `hf-embed-respawn.lock` (+ F-001 fix: demand-listener EADDRINUSE unlink-retry) |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | `probeModelServer(socketPath)` GET /api/health probe (separate from `probeDaemon`) |
| `mcp_server/tests/embedders/launcher-model-server.vitest.ts` | Create | 6 tests: lazy/no-spawn, demand→spawn, 2nd-guard relaunch/give-up, generalized watchdog targets model pid, modelServerPid additive+reaped, probeModelServer ready/loading=alive |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-codex` dispatch (`gpt-5.5`, xhigh, fast, `--sandbox workspace-write`) fenced to the launcher + bridge + a new test. Independent verification (node --check + the F1/F3 + new suites) and a 5-lens opus adversarial review focused on F1/F3 non-regression — verdict: **0 confirmed defects**, F1 (daemon watchdog/relaunch/childPid/graceful-exit) and F3 (probeDaemon/maybeBridgeLeaseHolder/respawn) confirmed byte-equivalent/untouched, the lazy-spawn demand path race-safe and launcher-owned. The orchestrator fixed one P2 the review raised: the demand listener's `listen()` now does an EADDRINUSE unlink-retry (mirroring the model server) so a stale socket from a prior crash can't silently disable lazy embeds. F1 14/14 + F3 4/4 + 6 new = 24 green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep implementation status pending | This pass is spec authoring only; implementation must occur in a later scoped session |
| Preserve Level-1 anchors and phase headers from the reference packet | The validator enforces template shape and anchor consistency |
| Include concrete verification command tokens | Future implementers need runnable checks, and implementation-summary verification must not be vague |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` launcher + bridge | PASS |
| `vitest run` F1 launcher-watchdog (non-regression) | PASS (14/14) |
| `vitest run` F3 launcher-ipc-bridge-probe (non-regression) | PASS (4/4) |
| `vitest run` new launcher-model-server | PASS (6/6) |
| 5-lens opus adversarial review (F1 / F3 non-regression, lazy-spawn, supervision, wx-lock/scope) | PASS — 0 confirmed defects; 1 P2 (demand-listener EADDRINUSE) fixed |
| `validate.sh --strict` on this packet | PASS |
| SC: live first-embed spawn / RSS recycle | DEFERRED — needs a running daemon + model server |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live first-embed spawn not exercised** — the lazy demand→spawn, RSS recycle, and reap-before-respawn are covered by injected-spawn/ps tests; a live daemon + model server is the natural follow-up.
2. **Remaining P2 review notes (non-blocking):** the async signal-teardown end-to-end path and the give-up→re-arm demand-listener path have thin behavioral coverage (validated by code review, not a dedicated test).
3. **Sidecar still present** — both the old sidecar path and the new model-server path coexist until phase 005 retires the sidecar; `SPECKIT_EMBEDDER_EXECUTION` is still honored until then.
<!-- /ANCHOR:limitations -->

