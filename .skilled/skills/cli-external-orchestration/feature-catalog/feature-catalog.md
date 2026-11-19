---
title: "cli-external-orchestration: Feature Catalog"
description: "Current-state inventory for CLI executor routing, compiled dispatch, Cursor hooks, authorization, session-isolated goal bindings, the experimental DeepSeek Harness mode and the experimental Mistral Vibe mode."
trigger_phrases:
  - "cli-external-orchestration feature catalog"
  - "cli-external-orchestration hub capabilities"
  - "cli executor dispatch routing"
  - "cli-external-orchestration compiled routing"
  - "cli-cursor hooks"
  - "Cursor CLI spec-gate integration"
  - "cross-runtime goal isolation"
  - "DeepSeek Harness Dispatch Mode"
  - "Mistral Vibe Dispatch Mode"
last_updated: "2026-11-19"
version: 1.7.11.0
---

# cli-external-orchestration: Feature Catalog

This catalog inventories the live `cli-external-orchestration` hub surface. The hub scores and dispatches one of eight CLI-executor workflow packets (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`), each independently classifying intent, choosing or confirming a provider and conducting the dispatched session. `cli-cursor` also exposes a Cursor hook and spec-gate adapter surface whose `.cursor/hooks.json` configuration is shared with the Cursor desktop editor. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `cli-external-orchestration` hub. The hub does not itself run a CLI session. It resolves which executor packet conducts it.

---

## 2. CLI EXECUTOR DISPATCH ROUTING

### CLI Executor Two-Axis Dispatch Routing

#### Description

`mode-registry.json` and `hub-router.json` jointly resolve a request to a single executor, an ordered bundle, or a deferred disambiguation across the hub's eight modes.

#### Current Reality

The eight workflow packets are `packetKind: "workflow"`. Each dispatches writes into this repository's own workspace. The transport this hub used to carry, `cli-jev`, moved to the `cli-classifier` hub at [`../../cli-classifier/SKILL.md`](../../cli-classifier/SKILL.md) as mode `cli-jev` over the `cli-jev` packet, and the `transport-axis` extension went with it, so this registry declares no extension at all. The router defers rather than silently defaulting to `cli-opencode` on genuine ambiguity.

#### Source Files

See [`cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`](cli-executor-dispatch-routing/cli-executor-dispatch-routing.md) for the two-axis model, routing rule, and outcome set.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

A default-on, flag-gated directive in `cli-external-orchestration`'s `ROUTER.md` asks the compiled per-hub router contract to resolve the mode before falling through to registry-driven dispatch.

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

The committed `.cursor/hooks.json` registers lifecycle, session-start Gate-3 prebinding, mutation-gate, post-tool, task-dispatch, prompt-submit, pre-compact, and MCP advisory adapters. The prebind validates `SYSTEM_SPEC_FOLDER` or opens explicitly enabled state for top-level sessions while preserving disabled and child-session no-ops. `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, and `beforeMCPExecution` have confirmed delivery paths. Prompt-submit and pre-compact delivery remain unconfirmed.

#### Source Files

See [`cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`](cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md) for the event behavior, current registration authority, and durable validation anchors.

---

## 5. CLI DISPATCH AUTHORIZATION AND INSPECTION

### Shared Dispatch Inspector And Pi Authorization Gate

#### Description

One runtime-neutral inspector classifies a Bash command as `direct`, `ambiguous` or `none`, and the Pi preflight gate turns that classification into an allow/deny authorization decision. Claude, Codex, Devin and Pi call the shared cores directly, Cursor translates its hook events through Claude adapters, DeepSeek Harness calls the same preflight and audit cores from its repo-guards adapters, and Mistral Vibe calls the same rule engine from its repo-guards preflight. It recognizes all eight executors plus the `cli-jev` judgment shapes, including the `dsh` headless forms.

#### Current Reality

A quoted command-position executor is normalized as a real dispatch: `"devin" -p x` classifies as `direct cli-devin` (identical to the unquoted form) and is audit-visible, while multi-word quoted prose and quoted arguments correctly stay `none`. Under Pi, a `direct` dispatch is denied unless the user's own request names the matching executor, an `ambiguous` command is denied, and `none` is a no-op. Run the shared inspector suite (`npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs`) and the Pi preflight suite (`npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.test.ts`). All cases are expected to pass.

#### Source Files

See [`cli-dispatch-authorization/cli-dispatch-authorization.md`](cli-dispatch-authorization/cli-dispatch-authorization.md) for the classification model, the authorization mapping, and the durable test anchors.

---

## 6. SESSION-ISOLATED GOAL BINDINGS

### Native Session Scope And Legacy Quarantine

#### Description

The runtime-neutral goal core stores one record per workspace, runtime, and native session id, and binds that session to a spec packet whose `goal.md` is the directive. Pi supplies identity through its extension session manager. Cursor supplies identity to its `sessionStart` hook. Devin supplies it to its `SessionStart` and `UserPromptSubmit` hooks. The OpenCode-native `opencode-goal` plugin remains a separate per-session system that shares the packet slice module.

#### Current Reality

Pi has a native registered `/goal-pi` management command (bind, resent, log, packet, set and the lifecycle actions) plus session-bound injection with the resend reminder and turn-end verification. Cursor has session-bound injection with the reminder and a session-free `/goal-cursor packet <path>` read. Every management action still fails with `UNSUPPORTED_SESSION_BINDING`. Devin is injection-only through `.skilled/hooks/goal/devin/goal-inject.mjs`. Claude Code and Codex keep their native host goal command and reach the packet goal through the speckit workflows. Legacy `active-goal.json` is never injected automatically and can only be inspected, migrated to an explicit validated scope, or archived. Aggregate diagnostics expose counts and classification without raw session ids.

#### Source Files

See [`.skilled/hooks/goal/README.md`](../../../hooks/goal/README.md) for the support matrix, state layout, command examples, rollback, and automated verification. The operator scenario is [`goal-manage-cli.md`](../manual-testing-playbook/plugins-and-hooks/goal-manage-cli.md).

---

## 7. OPENCODE VERSION DETECTION

### OpenCode Version Detection

#### Description

A `cli-opencode` lineage resolves the installed OpenCode binary, parses its `--version` output into a version family, and refuses an OpenCode 1 binary rather than dispatching it.

#### Current Reality

The runtime resolves the binary, probes its `--version` output, and refuses the lineage unless the parsed family is `v2`, so a binary named `opencode` that reports a 2.x version is dispatched as OpenCode 2 and one that reports a 1.x version is refused with a message naming OpenCode 1 as unsupported. A probe that finds no supported version refuses the lineage instead of guessing, and a native fan-out lineage is refused because OpenCode 2 `run` cannot start a registered command. Run the dual-dispatch suite (`npx vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`). All cases are expected to pass.

#### Source Files

See [`opencode-dual-version-dispatch/opencode-dual-version-dispatch.md`](opencode-dual-version-dispatch/opencode-dual-version-dispatch.md) for the resolution and probe contract, the lineage argv, and the durable test anchors.

---

## 8. DEEPSEEK HARNESS DISPATCH MODE

### DeepSeek Harness Dispatch Mode

#### Description

`cli-deepseek-harness` is the seventh workflow mode. It composes and checks a one-task `dsh --profile headless` dispatch over a closed two-route DeepSeek V4.1 Flash roster, and it remains experimental. LLM Gateway (2026-11-06) and OpenCode Go (2026-11-07) answered a keyed run.

#### Current Reality

The mode routes on harness vocabulary only: `dsh`, `dsh headless`, `deepseek harness` and `delegate to dsh`. A DeepSeek model named with another runtime, such as "use cli-opencode with deepseek-v4.1-flash", stays on that runtime. The shared dispatch inspector classifies a `dsh --profile headless` or `dsh headless` command as `direct cli-deepseek-harness`, and the rule engine judges it against the packet's thirteen hard rules before it spawns. The LLM Gateway route answered a keyed run on 2026-11-06 and is the default. The OpenCode Go route answered a keyed run on 2026-11-07 and runs only when a request names it.

#### Source Files

See [`deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md`](deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md) for the routing vocabulary, the dispatch shape the rules enforce and what stays unconfirmed.

---

## 9. MISTRAL VIBE DISPATCH MODE

### Mistral Vibe Dispatch Mode

#### Description

`cli-mistral-vibe` is the eighth workflow mode. It composes and checks a one-task `vibe -p` print-mode dispatch over a closed two-alias DeepSeek and GLM roster, and it remains experimental. Print mode is pinned on vibe 3.1.2 from captures in this repository; both roster rows are hand-written, `allowed_models` closes the roster by model name, and ACP (`vibe-acp`) is deferred.

#### Current Reality

The mode routes on Vibe vocabulary only: `mistral vibe`, `vibe -p`, `vibe print mode` and `delegate to vibe`. The bare word "vibe" stays ordinary design language and selects nothing. A dispatch runs from a scratch cwd with a disposable `VIBE_HOME`, names one of `deepseek-flash` and `glm-flash`, and counts as complete only when `export.json` records `exit_code` 0 and `outcome` `finished`. The shared dispatch inspector classifies a Vibe print run as `direct cli-mistral-vibe`, and the rule engine judges it against the packet's seven hard rules before it spawns.

#### Source Files

See [`mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md`](mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md) for the routing vocabulary, the dispatch shape the rules enforce and what stays unconfirmed.
