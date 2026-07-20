---
title: "cli-external-orchestration: Feature Catalog"
description: "Current-state inventory for the cli-external-orchestration hub, covering its CLI executor two-axis dispatch routing and the opt-in compiled-routing fast path that resolves ahead of it."
trigger_phrases:
  - "cli-external-orchestration feature catalog"
  - "cli-external-orchestration hub capabilities"
  - "cli executor dispatch routing"
  - "cli-external-orchestration compiled routing"
last_updated: "2026-07-21"
version: 1.0.0.0
---

# cli-external-orchestration: Feature Catalog

This catalog inventories the live `cli-external-orchestration` hub surface. The hub scores and dispatches one of three CLI-executor workflow packets (`cli-opencode`, `cli-claude-code`, `cli-codex`), each independently classifying intent, choosing or confirming a provider, and conducting the dispatched session. An opt-in, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `cli-external-orchestration` hub. The hub does not itself run a CLI session — it resolves which executor packet conducts it.

---

## 2. CLI EXECUTOR DISPATCH ROUTING

### CLI Executor Two-Axis Dispatch Routing

#### Description

`mode-registry.json` and `hub-router.json` jointly resolve a request to a single executor, an ordered bundle, or a deferred disambiguation across the hub's three packets.

#### Current Reality

All three packets are `packetKind: "workflow"` with zero extension axes (no surface, transport, or runtime-loop axis); each dispatches writes into this repository's own workspace. The router defers rather than silently defaulting to `cli-opencode` on genuine ambiguity.

#### Source Files

See [`cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`](cli-executor-dispatch-routing/cli-executor-dispatch-routing.md) for the two-axis model, routing rule, and outcome set.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

An opt-in, flag-gated, additive directive in `cli-external-orchestration`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the CLI executor dispatch routing above.

#### Current Reality

The directive is off by default: `SPECKIT_COMPILED_ROUTING` is unset in normal operation, so `cli-external-orchestration` continues to route entirely through `hub-router.json`/`mode-registry.json`. When the flag is force-enabled and `cli-external-orchestration`'s promoted activation manifest authorizes compiled serving, `node .opencode/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "<task>"` returns the authoritative decision instead; any error or a `{"servingAuthority":"legacy"}` sentinel leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.
