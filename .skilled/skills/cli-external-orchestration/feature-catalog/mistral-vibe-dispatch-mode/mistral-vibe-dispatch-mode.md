---
title: "Mistral Vibe Dispatch Mode"
description: "`cli-mistral-vibe` is the eighth workflow mode. It composes and checks a one-task `vibe -p` print-mode dispatch over a closed two-alias DeepSeek and GLM roster, and it remains experimental. Print mode is pinned on vibe 3.1.2 from captures in this repository; both roster rows are hand-written, `allowed_models` closes the roster by model name, and ACP (`vibe-acp`) is deferred."
trigger_phrases:
  - "Mistral Vibe Dispatch Mode"
  - "mistral vibe"
  - "vibe print mode"
  - "delegate to vibe"
  - "cli-mistral-vibe"
version: 1.0.1.0
---

# Mistral Vibe Dispatch Mode (vibe)

## 1. OVERVIEW

`cli-mistral-vibe` is the eighth workflow mode. It composes and checks a one-task `vibe -p` print-mode dispatch over a closed two-alias DeepSeek and GLM roster, and it remains experimental. Print mode is pinned on vibe 3.1.2 from captures in this repository; both roster rows are hand-written, `allowed_models` closes the roster by model name, and ACP (`vibe-acp`) is deferred.

Vibe picks its model from a config row, not from a reasoning flag. Print mode has no reasoning option, and effort is the row's `thinking` field, so the packet fixes the model through a hand-written roster row and fixes the rest through the argv shape. A caller reaches the mode through the hub like any sibling.

---

## 2. HOW IT WORKS

### Routing

The hub selects the mode on Vibe vocabulary only: `mistral vibe`, `vibe -p`, `vibe print mode` and `delegate to vibe`. The bare word "vibe" never routes, because it is ordinary design language. A request that names a DeepSeek model with another runtime stays on that runtime. Once the mode is selected, stage two loads the packet's CLI reference and its prompt-quality card.

### The Dispatch Shape

A dispatch starts from a fresh scratch directory outside the checkout, points `VIBE_HOME` at a directory inside it and copies the repository's `.vibe/config.toml` into that home. It exports `MISTRAL_API_KEY`, probes `command -v vibe` and `vibe --version` for `vibe 3.1.2`, renders the repository hooks into the home, then runs `AI_SESSION_CHILD=1 vibe -p TEXT --model <alias> --output-dir DIR </dev/null`, with `VIBE_SPEC_FOLDER` naming the packet when the task has one. A run counts as complete only when `DIR/export.json` records `exit_code` 0 and `outcome` `finished`. A clean stdout proves nothing: `--output` carries no exit code, and a denied tool call returns to the model as a tool error while the turn continues.

### Enforcement

The shared dispatch inspector classifies a `vibe` print run as `direct cli-mistral-vibe` and leaves the version, help and config commands as `none`. The rule engine then judges the command against seven blocking hard rules before it spawns: `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `vibe-closed-roster`, `no-repo-root-cwd`, `stdin-redirect-required` and `rendered-home-hooks`, which requires the render step to chain before the run and name the same home. Inside the run, the repository's guards and goal hook load from the disposable home: `render-home-hooks.cjs` writes `.vibe/hooks.toml` there with absolute paths, because the project file loads only from a trusted project root.

### Hooks And Guards

The rendered home carries the repository guard bundle and three composition points. `spec-gate-classify` (the prompt classifier) and `turn-start` (the advisor brief, the completion advisory, the save nudge and the compaction re-injection) run on `pre_agent`; `turn-end` runs on `post_agent` and composes the completion advisory with the ask-surface reprompt; the strict guards run on `pre_tool`; the non-strict post-edit quality, dist-freshness, injection-screen, compaction-context and decision-capture checks run on `post_tool`; and `session-start` and `session-end` carry the context injection and cleanup. The per-plugin seam, its event and the run that proved it are in `references/guards-and-hooks.md` section 4.

### What Stays Unconfirmed

ACP (`vibe-acp`) is a stdio JSON-RPC agent that writes no `export.json` and has no exit taxonomy, so it is deferred. Whether Vibe loads a working-directory `.env` is UNKNOWN, and the no-repo-root rule refuses that cwd either way. Whether a Vibe turn draws on the same Mistral usage pool as an API turn is UNKNOWN, so no cost claim combines the two. Of the seven hook payloads, only the `pre_tool` and `post_agent` inputs were captured; the other five are documented rather than observed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md` | Shared | The dispatch contract: activation, the dispatch shape, the lifecycle and the ALWAYS, NEVER and ESCALATE rules. |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` | Shared | The seven blocking Vibe dispatch rules the rule engine evaluates. |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md` | Shared | The version pin, the three prompt sources, the flag set, the four budgets, the dispatch shape, the output payloads, the `export.json` fields, the exit taxonomy and the process names. |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/providers-and-models.md` | Shared | The `mistral` provider row, the two roster aliases, the `allowed_models` close, the catalog result, the default route and the billing question. |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/runtime-folder-and-sync.md` | Shared | The `.vibe/` folder, the trust gate, the three generators and `VIBE_HOME` isolation. |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Shared | The seven hook types, the plugin port table and the captured wire format. |
| `.skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs` | Shared | Classifies the Vibe print forms as `direct cli-mistral-vibe`. |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Shared | Implements one check per Vibe hard rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs` | Automated test | The Vibe print forms resolve to the packet, and version, help and config commands do not. |
| `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` | Node test | A complete isolated dispatch passes every Vibe rule, and each rule refuses its own violating command. |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` | Vitest | The fan-out adapter's command build, `VIBE_HOME` handling and `export.json` scoring against a shimmed binary. |

---

## 4. SOURCE METADATA

- Group: Mistral Vibe Dispatch Mode
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md`

Related references:
- [cli-executor-dispatch-routing.md](../cli-executor-dispatch-routing/cli-executor-dispatch-routing.md) - the hub routing that selects this mode among the eight.
- [cli-dispatch-authorization.md](../cli-dispatch-authorization/cli-dispatch-authorization.md) - the inspector and rule engine that judge a Vibe command before it runs.
