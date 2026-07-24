---
title: "cli-external-orchestration: Feature Catalog"
description: "Current-state inventory for the cli-external-orchestration hub, covering CLI executor two-axis dispatch routing, default-on compiled routing, and cli-cursor's shared Cursor CLI/editor hook and spec-gate adapter surface."
trigger_phrases:
  - "cli-external-orchestration feature catalog"
  - "cli-external-orchestration hub capabilities"
  - "cli executor dispatch routing"
  - "cli-external-orchestration compiled routing"
  - "cli-cursor hooks"
  - "Cursor CLI spec-gate integration"
last_updated: "2026-07-24"
version: 1.3.0.0
---

# cli-external-orchestration: Feature Catalog

This catalog inventories the live `cli-external-orchestration` hub surface. The hub scores and dispatches one of four CLI-executor workflow packets (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`), each independently classifying intent, choosing or confirming a provider, and conducting the dispatched session. `cli-cursor` also exposes a Cursor hook and spec-gate adapter surface whose `.cursor/hooks.json` configuration is shared with the Cursor desktop editor. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to.

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

A default-on, flag-gated, additive directive in `cli-external-orchestration`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the CLI executor dispatch routing above.

#### Current Reality

The directive is on by default for `cli-external-orchestration`, one of the seven activated hubs: with `SPECKIT_COMPILED_ROUTING` unset, `node .opencode/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "<task>"` returns the authoritative decision and the hub follows it directly. Setting `SPECKIT_COMPILED_ROUTING=0` is the explicit kill-switch that forces legacy `hub-router.json`/`mode-registry.json` routing; any error or a `{"servingAuthority":"legacy"}` sentinel also leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.

---

## 4. CURSOR HOOKS AND SPEC-GATE INTEGRATION

### Cursor CLI Hooks And Spec-Gate Integration

#### Description

`cli-cursor`'s hook/spec-gate adapter layer maps Cursor lifecycle and tool events to session priming, completion evidence, and the shared Gate-3 mutation policy.

#### Current Reality

Live Cursor CLI dispatches confirm `sessionStart` through `session-start.ts`, `sessionEnd` through `session-end.ts`, and `preToolUse` through the deny-capable `spec-gate-enforce.mjs`; the latter's `permission: "deny"` response and exit code 2 were confirmed to block a real tool call. `spec-gate-classify.mjs` remains dormant because `beforeSubmitPrompt` never fires under the installed `cursor-agent` build. A committed, project-level `.cursor/hooks.json` (phase 010) registers `sessionStart`, `sessionEnd`, `preToolUse`, and `beforeSubmitPrompt` against these adapters, using relative paths confirmed to resolve correctly regardless of the invoking shell's working directory. Phase 011 extends the same file toward Claude-adapter parity: 5 additional `sessionStart`/`sessionEnd` repo-guard scripts (worktree guard, git-hooks check, dist-staleness check, codex-hooks check, session cleanup) run as direct commands; a `postToolUse` proxy (`post-tool-use.mjs`) chains `Write` and `Shell` tool calls into the existing post-edit-quality/code-graph-freshness/dispatch-audit hooks, live-fire confirmed against a real dispatch; and a second `preToolUse` entry (`task-dispatch-guard.mjs`, `matcher: "Task"`) live-fire confirmed a real subagent-delegation dispatch firing alongside the existing unmatched entry. Phase 011 also registered a `user-prompt-submit.ts` proxy (2nd `beforeSubmitPrompt` entry) and a `precompact.ts` proxy (`preCompact`) for parity, though delivery for both remains unconfirmed/dormant under the installed build, and authored an `mcp-route-guard.mjs` `beforeMCPExecution` advisory guard, initially left unwired pending a real payload capture. Phase 016 completed that: `.cursor/mcp.json` is now a symlink to the repo's own `.mcp.json` (Cursor's schema is byte-compatible with Claude's), which made `beforeMCPExecution`/`afterMCPExecution` live-capturable and revealed that Cursor splits the server and tool across `mcp_server_name` + a BARE `tool_name`, a shape the shared guard core — which parses only the packed `mcp__<server>__<tool>` / `<server>_<tool>` forms — could never match. The guard now recombines the two fields before forwarding, and is wired and live-fire confirmed. This configuration is shared with the Cursor desktop editor, so registration has cross-surface impact — any teammate opening this repo in the editor gets the same guards. `spec-gate-prebind.mjs` was authored by a concurrent session, is uncommitted, and has not yet been reviewed or tested in this catalog work; it is designed to pre-bind or open the Gate-3 state at `sessionStart`, but that design is not confirmed here, and it is deliberately not wired into `.cursor/hooks.json` for that reason — so the `preToolUse` deny path stays inert (fails open to `allow`) until something opens the Gate-3 state.

#### Source Files

See [`cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`](cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md) for the five adapter statuses, event behavior, and validation anchors.
