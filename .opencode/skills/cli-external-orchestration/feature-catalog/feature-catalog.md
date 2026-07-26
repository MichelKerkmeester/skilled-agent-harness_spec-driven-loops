---
title: "cli-external-orchestration: Feature Catalog"
description: "Current-state inventory for the cli-external-orchestration hub, covering four CLI executor workflows, default-on compiled routing, and cli-cursor's shared hook and spec-gate adapter surface."
trigger_phrases:
  - "cli-external-orchestration feature catalog"
  - "cli-external-orchestration hub capabilities"
  - "cli executor dispatch routing"
  - "cli-external-orchestration compiled routing"
  - "cli-cursor hooks"
  - "Cursor CLI spec-gate integration"
last_updated: "2026-07-25"
version: 1.5.0.0
---

# cli-external-orchestration: Feature Catalog

This catalog inventories the live `cli-external-orchestration` hub surface. The hub scores and dispatches one of four CLI-executor workflow packets (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`), each independently classifying intent, choosing or confirming a provider, and conducting the dispatched session. `cli-cursor` also exposes a Cursor hook and spec-gate adapter surface whose `.cursor/hooks.json` configuration is shared with the Cursor desktop editor. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `cli-external-orchestration` hub. The hub does not itself run a CLI session; it resolves which executor packet conducts it.

---

## 2. CLI EXECUTOR DISPATCH ROUTING

### CLI Executor Two-Axis Dispatch Routing

#### Description

`mode-registry.json` and `hub-router.json` jointly resolve a request to a single executor, an ordered bundle, or a deferred disambiguation across the hub's four packets.

#### Current Reality

All four packets are `packetKind: "workflow"` with zero extension axes; each dispatches writes into this repository's own workspace. The router defers rather than silently defaulting to `cli-opencode` on genuine ambiguity.

#### Source Files

See [`cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`](cli-executor-dispatch-routing/cli-executor-dispatch-routing.md) for the two-axis model, routing rule, and outcome set.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

A default-on, flag-gated directive in `cli-external-orchestration`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to registry-driven dispatch.

#### Current Reality

With `SPECKIT_COMPILED_ROUTING` unset, the activated hub follows a fresh compiled-serving manifest. Setting `SPECKIT_COMPILED_ROUTING=0`, encountering a resolver error, or receiving a legacy serving sentinel leaves routing on the registry-driven path.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.

---

## 4. CURSOR HOOKS AND SPEC-GATE INTEGRATION

### Cursor CLI Hooks And Spec-Gate Integration

#### Description

`cli-cursor`'s hook/spec-gate adapter layer maps Cursor lifecycle and tool events to session priming, mutation policy, post-tool checks, dispatch guards, compaction support, and MCP routing advice.

#### Current Reality

The committed `.cursor/hooks.json` registers lifecycle, session-start Gate-3 prebinding, mutation-gate, post-tool, task-dispatch, prompt-submit, pre-compact, and MCP advisory adapters. The prebind validates `MK_SPEC_FOLDER` or opens explicitly enabled state for top-level sessions while preserving disabled and child-session no-ops. `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, and `beforeMCPExecution` have confirmed delivery paths; prompt-submit and pre-compact delivery remain unconfirmed.

#### Source Files

See [`cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`](cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md) for the event behavior, current registration authority, and durable validation anchors.
