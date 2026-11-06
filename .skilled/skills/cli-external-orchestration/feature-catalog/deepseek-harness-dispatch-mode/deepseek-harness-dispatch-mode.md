---
title: "DeepSeek Harness Dispatch Mode"
description: "`cli-deepseek-harness` is the eighth workflow mode. It composes and checks a one-task `dsh --profile headless` dispatch over a closed two-route DeepSeek V4.1 Flash roster, and it remains experimental while OpenCode Go is configured but not verified."
trigger_phrases:
  - "DeepSeek Harness Dispatch Mode"
  - "deepseek harness"
  - "dsh headless"
  - "delegate to dsh"
  - "cli-deepseek-harness"
version: 1.0.1.0
---

# DeepSeek Harness Dispatch Mode (dsh)

## 1. OVERVIEW

`cli-deepseek-harness` is the eighth workflow mode. It composes and checks a one-task `dsh --profile headless` dispatch over a closed two-route DeepSeek V4.1 Flash roster, and it remains experimental while OpenCode Go is configured but not verified.

DeepSeek Harness picks its own model. Its headless mode has no model, provider, timeout or working-directory option, so the packet fixes the model through a checked-in route patch and fixes the rest through the argv shape. A caller reaches the mode through the hub like any sibling. The LLM Gateway route has answered a keyed run; the OpenCode Go route has not been run with a key.

---

## 2. HOW IT WORKS

### Routing

The hub selects the mode on harness vocabulary only: `dsh`, `dsh headless`, `deepseek harness` and `delegate to dsh`. None of these is a bare model word. A request that names a DeepSeek model with another runtime goes to that runtime, so "use cli-opencode with deepseek-v4.1-flash" resolves to `cli-opencode`. Once the mode is selected, stage two loads the packet's CLI reference and its prompt-quality card.

### The Dispatch Shape

A dispatch starts from a fresh scratch directory with `DSH_HOME` inside it and pipes the prompt to `dsh --profile headless`. The argv passes exactly one roster route patch, the lineage patch and the guards patch by absolute path, then `--json`, `--approval-policy never` and a lone `-`. A run counts as complete only on exit 0 plus a last `final` event whose `reason.kind` is `completed`. A keyless run shows why both are needed: it prints a well-formed `final` event with `reason.kind` `error` and exits 1.

### Enforcement

The shared dispatch inspector classifies the headless forms as `direct cli-deepseek-harness` and leaves `dsh plugin`, help, version and config-dump commands as `none`. The rule engine then judges the command against thirteen blocking hard rules before it spawns: `headless-only`, `stdin-dash-required`, `route-patch-required`, `closed-roster`, `approval-never-required`, `dsh-home-isolated`, `lineage-patch-required`, `guards-patch-required`, `json-final-and-exit-required`, `pinned-version-required`, `dsh-availability-required`, `no-repo-root-dotenv` and `mcp-opt-in-only`.

### What Stays Unconfirmed

The LLM Gateway route answered a keyed run on 2026-11-06 with exit 0 and a `completed` final event, and one deep-research fan-out lineage completed on it. The OpenCode Go route composes offline but is configured, not verified: no keyed request has been sent, so its endpoint is unconfirmed and it stays out of default allowlists.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Shared | The dispatch contract: activation, the dispatch shape, the lifecycle and the ALWAYS, NEVER and ESCALATE rules. |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` | Shared | The thirteen blocking dsh dispatch rules the rule engine evaluates. |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/cli-reference.md` | Shared | The version pin, the headless option set, the launcher flags and the exit contract. |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md` | Shared | The closed two-route roster, the route patch shape and what stays unconfirmed. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Shared | Classifies the dsh headless forms as `direct cli-deepseek-harness`. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Shared | Implements one check per dsh hard rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Automated test | The dsh headless forms resolve to the packet, and management, help, version and config-dump commands do not. |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Node test | A complete isolated dispatch passes every dsh rule, and each rule refuses its own violating command. |

---

## 4. SOURCE METADATA

- Group: DeepSeek Harness Dispatch Mode
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md`

Related references:
- [cli-executor-dispatch-routing.md](../cli-executor-dispatch-routing/cli-executor-dispatch-routing.md) - the hub routing that selects this mode among the eight.
- [cli-dispatch-authorization.md](../cli-dispatch-authorization/cli-dispatch-authorization.md) - the inspector and rule engine that judge a dsh command before it runs.
