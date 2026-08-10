---
title: "cli-external-orchestration: Feature Catalog"
description: "Current-state inventory for CLI executor routing, compiled dispatch, Cursor hooks, authorization, and session-isolated goal bindings."
trigger_phrases:
  - "cli-external-orchestration feature catalog"
  - "cli-external-orchestration hub capabilities"
  - "cli executor dispatch routing"
  - "cli-external-orchestration compiled routing"
  - "cli-cursor hooks"
  - "Cursor CLI spec-gate integration"
  - "cross-runtime goal isolation"
last_updated: "2026-08-10"
version: 1.6.0.0
---

# cli-external-orchestration: Feature Catalog

This catalog inventories the live `cli-external-orchestration` hub surface. The hub scores and dispatches one of six CLI-executor workflow packets (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`), each independently classifying intent, choosing or confirming a provider, and conducting the dispatched session. `cli-cursor` also exposes a Cursor hook and spec-gate adapter surface whose `.cursor/hooks.json` configuration is shared with the Cursor desktop editor. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `cli-external-orchestration` hub. The hub does not itself run a CLI session; it resolves which executor packet conducts it.

---

## 2. CLI EXECUTOR DISPATCH ROUTING

### CLI Executor Two-Axis Dispatch Routing

#### Description

`mode-registry.json` and `hub-router.json` jointly resolve a request to a single executor, an ordered bundle, or a deferred disambiguation across the hub's six packets.

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

---

## 5. CLI DISPATCH AUTHORIZATION AND INSPECTION

### Shared Dispatch Inspector And Pi Authorization Gate

#### Description

One runtime-neutral inspector classifies a Bash command as `direct`, `ambiguous`, or `none`, and the Pi preflight gate turns that classification into an allow/deny authorization decision. The inspector is shared across the Claude, Codex, Devin, and Pi dispatch hooks and feeds both the observational audit trail and the Pi gate.

#### Current Reality

A quoted command-position executor is normalized as a real dispatch: `"devin" -p x` classifies as `direct cli-devin` (identical to the unquoted form) and is audit-visible, while multi-word quoted prose and quoted arguments correctly stay `none`. Under Pi, a `direct` dispatch is denied unless the user's own request names the matching executor, an `ambiguous` command is denied, `none` is a no-op, and a `cli-pi` self-dispatch is never authorized. The shared inspector suite passes 356/356 and the Pi preflight suite passes 32/32.

#### Source Files

See [`cli-dispatch-authorization/cli-dispatch-authorization.md`](cli-dispatch-authorization/cli-dispatch-authorization.md) for the classification model, the authorization mapping, and the durable test anchors.

---

## 6. SESSION-ISOLATED GOAL BINDINGS

### Native Session Scope And Legacy Quarantine

#### Description

The runtime-neutral goal core stores one active goal per workspace, runtime, and native session id. Pi supplies identity through its extension session manager; Cursor supplies identity to its `sessionStart` hook. The OpenCode-native `mk-goal` plugin remains a separate per-session system.

#### Current Reality

Pi has a native registered `/goal-pi` management command plus session-bound injection and turn-end verification. Cursor has session-bound injection but no safe management bridge, so `/goal-cursor` fails with `UNSUPPORTED_SESSION_BINDING`. Claude Code uses its native feature where available; Codex has no adapter. Legacy `active-goal.json` is never injected automatically and can only be inspected, migrated to an explicit validated scope, or archived. Aggregate diagnostics expose counts and classification without raw session ids.

#### Source Files

See [`.opencode/hooks/goal/README.md`](../../../hooks/goal/README.md) for the support matrix, state layout, command examples, rollback, and automated verification. The operator scenario is [`goal-manage-cli.md`](../manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md).
