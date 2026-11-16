---
name: cli-mistral-vibe
description: "Mistral Vibe (vibe) CLI executor for pinned print-mode one-task dispatch over a closed two-alias DeepSeek and GLM roster."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.0.0.0
---

# Mistral Vibe CLI Orchestrator - Cross-AI Task Delegation

> **Experimental mode.** Print mode is pinned on vibe 3.1.2 from captures in this repository.
> Both roster rows are hand-written, `allowed_models` closes the roster by model name, and ACP
> (`vibe-acp`) is deferred.

> **CRITICAL: SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Mistral Vibe binary (`vibe`). If the agent reading this skill is itself running inside Vibe, the skill MUST refuse to load and build no `vibe` command. The detection signals are `VIBE_SESSION=1` in the environment, which Vibe 3.1.2 sets on every shell command it spawns (`vibe/core/utils/shell.py` in the installed package), and `vibe-rs` or `vibe-app-server` in the process ancestry.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only**, never self-invocation.

Orchestrate Mistral Vibe (`vibe`, uv tool package `mistral-vibe`) for one-task print-mode runs: a read-only review, a single scoped implementation or an independent second opinion, with the model fixed by a hand-written roster row.
The packet's one pin record is [cli-reference.md](./references/cli-reference.md) section 1, and every flag it names was captured from a 3.1.2 run or read from the code that writes the record.
Each live result applies only to the route and behavior the saved capture exercised. Keep every behavior outside the saved captures marked UNKNOWN with the reason.

**Core principle**: the model row owns reasoning effort, so the caller owns composition. Every dispatch names exactly one roster alias, runs print mode from a scratch cwd with a disposable `VIBE_HOME`, and counts as complete only when `export.json` records `exit_code` 0 and `outcome` `finished`.

---

## 1. WHEN TO USE

### Activation Triggers

- **Explicit Vibe dispatch**: the task names Mistral Vibe or `vibe -p`.
- **Cross-AI validation**: an independent review or second opinion from a Vibe run that is not the calling runtime.
- **One-task print-mode work**: a bounded task that answers once and exits, with `export.json` as the outcome record.
- **Roster checks**: proving an alias resolves to a `mistral`-provider row with `thinking = "max"` before any model call.

### When NOT to Use

- **You ARE Vibe already.** If `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry, this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. Do the work in the current session instead.
- `vibe` is not on PATH, or `vibe --version` does not print `vibe 3.1.2`.
- Neither the Vibe sign-in key in the macOS keychain nor an exported `MISTRAL_API_KEY` is available.
- The task needs ACP (`vibe-acp`), an interactive session, a human answer mid-run or a persistent client.
- The task needs a model outside `deepseek-flash` and `glm-flash`, or reasoning effort other than the row's `max`.
- The task needs the `.vibe/` runtime folder, a hook or the deep-loop executor kind, none of which this packet builds.
- The only cwd available is the repository root.

---

## 2. SMART ROUTING

The hub routes here through its `cli-mistral-vibe` entries in `mode-registry.json` and `hub-router.json`, on compound signals such as "mistral vibe", "vibe -p" and "delegate to vibe"; the bare word "vibe" never routes here, because it is ordinary design language. Naming this packet's path also reaches the contract.
`command -v vibe` and `vibe --version` decide whether a local dispatch can run, and both run before every dispatch.
Every run loads [cli-reference.md](./references/cli-reference.md) and [prompt-quality-card.md](./assets/prompt-quality-card.md) first, before any intent selection.
Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources, and open only the matched files.

---

## 3. HOW IT WORKS

### Execution Ownership

This packet owns the dispatch contract: the hard rules, the roster, the argv shape and the prompt mechanics.
The deep-loop executor kind, the `.vibe/` runtime folder and the hook bundle belong to sibling packets and are not built here. Do not add a packet-local wrapper, spawn path or command builder.

**Print mode is the only dispatch surface.** `vibe -p TEXT`, a pipe into a bare `vibe -p`, and `vibe --prompt-file PATH` all run headless. ACP (`vibe-acp`) is a stdio JSON-RPC agent that writes no `export.json` and has no exit taxonomy, so it is deferred and is not a dispatch surface.

**Closed roster: non-roster aliases are FORBIDDEN.** Two aliases exist, `deepseek-flash` and `glm-flash`, each a `mistral`-provider row with `thinking = "max"`. [providers-and-models.md](./references/providers-and-models.md) section 3 is the one place the ids and rows are recorded. Vibe refuses an unknown id, but its built-in `mistral-medium-3.5` stays selectable beside the roster unless `allowed_models` lists the two model names, which only the repository config in a trusted folder applies. The preflight is the only gate.

### The Dispatch Shape

```bash
cd "$RUN_DIR" && node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$RUN_DIR/.vibe-home" && AI_SESSION_CHILD=1 VIBE_SPEC_FOLDER="$REPO/$SPEC_FOLDER" VIBE_HOME="$RUN_DIR/.vibe-home" vibe -p "$PROMPT" --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null
```

`$RUN_DIR` is a fresh temp directory outside the checkout. Swap `deepseek-flash` for `glm-flash` to use the other roster alias; no other value is allowed. The shape carries no `--trust`, because the run starts outside the checkout and there is no project config to trust. The repository hooks reach the run through the home instead: `node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"` writes `$VIBE_HOME/hooks.toml` with every guard and the session-start hook anchored to the checkout by absolute path, and Vibe loads the home file whatever the cwd. `AI_SESSION_CHILD=1` keeps the spec gate from denying the child's writes, and `VIBE_SPEC_FOLDER` names the packet whose goal slice the session-start hook injects; drop it when the task is bound to no packet. The annotated shape, the flag set and the four budgets are in [cli-reference.md](./references/cli-reference.md) sections 3 and 4.

### Dispatch Lifecycle

1. Create the scratch cwd, point `VIBE_HOME` at a fresh directory inside it, copy `$REPO/.vibe/config.toml` to `$VIBE_HOME/config.toml`, and render the repository hooks into the home with `render-home-hooks.cjs`.
2. Export `MISTRAL_API_KEY`, run `command -v vibe` and `vibe --version </dev/null`, and refuse anything but `vibe 3.1.2`.
3. Pick exactly one roster alias and confirm the run's home carries its row.
4. Compose the prompt with [prompt-quality-card.md](./assets/prompt-quality-card.md): the child preamble first, then the inlined persona, then the task.
5. Run the dispatch shape, keeping stdout, stderr and the exit code apart.
6. Read `out/export.json` and require `exit_code` 0 with `outcome` `finished`, then check the diff and the tests.

### Dispatch-Critical Gotchas

- **A clean stdout proves nothing.** `--output` carries no exit code, and a denied tool call returns to the model as a tool error while the turn continues, so a run whose tool calls were denied can still exit 0. Read `export.json`.
- **No reasoning flag exists.** Effort is the model row's `thinking` field, and `max` is a property of the row. A dispatch cannot raise or lower it on the command line.
- **An empty home offers one model.** A fresh `VIBE_HOME` with no `config.toml` answers `Available: mistral-medium-3.5`, so `--model deepseek-flash` exits 1 with `usage_error`. The home a dispatch uses must carry the two rows, so the caller copies the repository's `.vibe/config.toml` into it first: `cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"`. That copy also brings `allowed_models`, which closes `mistral-medium-3.5` out.
- **The typed command leaves the process table.** `vibe` is a Python launcher that execs the bundled Rust `vibe-rs`, which talks to `vibe-app-server`, so a recursion guard matches `vibe-rs` and `vibe-app-server`.
- **Interactive Vibe exits 1.** A bare `vibe`, or a pipe with no `-p`, fails with `Error: Interactive mode needs a terminal. Use -p/--prompt to run without one.`
- **`--output-dir` is the only audit trail.** It writes `export.json` and the session journal on every exit, whatever the exit code.
- **`--add-dir` loads that folder's hooks too.** A build run that writes into the checkout passes `--add-dir "$REPO"`, and Vibe then also loads `$REPO/.vibe/hooks.toml`. Those hooks find the checkout with `git rev-parse --show-toplevel`, which prints nothing from a cwd outside git, so every hook fails with `Cannot find module '/.vibe/plugins/repo-guards/spec-gate.mjs'` and every tool call is skipped. Start such a run from a scratch folder inside the checkout, below its root, with `VIBE_HOME` still outside it.

### Provider Preflight

Use the key the Vibe browser sign-in (`vibe --setup`) stores in the macOS keychain, item `ai.mistral.vibe`, account `MISTRAL_API_KEY`. Mistral bills that key to the plan's Vibe budget and any other Mistral key to the separate API budget, and a `MISTRAL_API_KEY` in the environment overrides the keychain. Export `MISTRAL_API_KEY="$(/usr/bin/security find-generic-password -s ai.mistral.vibe -a MISTRAL_API_KEY -w)"` before launch, and fall back to another key only when the keychain has none. The deep-loop runner makes this swap itself for a `cli-mistral-vibe` lineage. With no key and no sign-in, the provider falls back to browser sign-in, which an unattended run cannot complete, and a keyless run has exited 1 with `Missing MISTRAL_API_KEY`.
Fail closed — do not build a command — when neither key is available, when `command -v vibe` fails, or when `vibe --version` does not print `vibe 3.1.2`. Surface the missing item and stop. Never pass a key in a prompt or write one into the checkout.

---

## 4. RULES

The seven fail-closed rules live in [hard-rules.json](./hard-rules.json): `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `vibe-closed-roster`, `no-repo-root-cwd`, `stdin-redirect-required` and `rendered-home-hooks`.

### ✅ ALWAYS

1. Run `command -v vibe` and `vibe --version </dev/null` before every dispatch, and refuse anything but `vibe 3.1.2`.
2. Export `MISTRAL_API_KEY` in the child's environment, set to the Vibe sign-in key when the keychain holds one, and name the variable in the prompt rather than its value.
3. Dispatch print mode: `vibe -p TEXT ... </dev/null`, a pipe into a bare `vibe -p`, or `vibe --prompt-file PATH ... </dev/null`.
4. Set `VIBE_HOME` to a fresh directory outside the checkout, on the same command line as the run, and render the repository hooks into it before the run.
5. Set `AI_SESSION_CHILD=1` on the run, and `VIBE_SPEC_FOLDER` to the absolute packet path when the task is bound to a packet.
6. Run from a scratch cwd outside the checkout, never the repository root. A write run that passes `--add-dir` runs from a scratch folder inside the checkout instead, as the `--add-dir` gotcha explains.
7. Name one roster alias with `--model`, and pass `--output-dir DIR`.
8. Count a run complete only when `DIR/export.json` records `exit_code` 0 and `outcome` `finished`.
9. Compose every dispatch as `{child preamble + resolved agent persona + task prompt}`, inlining the persona block, because the fresh `VIBE_HOME` a dispatch builds holds only `config.toml` and the rendered `hooks.toml`, never the `.vibe/agents/` profiles. Canonical contract: `../../sk-prompt/assets/cli-prompt-quality-card.md` section 6 "PERSONA INJECTION".
10. Set `AI_SESSION_CHILD=1` in the child's environment and copy the preamble from [`shared/references/child-dispatch-preamble.md`](../shared/references/child-dispatch-preamble.md) to the top of the prompt.
11. Give a build dispatch one change per brief: the file, the edit and the check that proves it.
12. Keep status specific: print mode is pinned, ACP is deferred, and unresolved behaviors remain UNKNOWN with their evidence gap.

### ⛔ NEVER

1. Never dispatch interactive `vibe`, a pipe with no `-p`, or `vibe-acp`.
2. Never start a run with the repository root as its cwd.
3. Never run with `VIBE_HOME` unset or inside the checkout.
4. Never read the outcome from stdout, from `--output json` or from the exit status alone.
5. Never name an alias outside `deepseek-flash` and `glm-flash`, and never write a model row for one.
6. Never pass a reasoning flag. None exists.
7. Never put a key, dotenv content or a credential value in a prompt or a file in the checkout.
8. Never dispatch Vibe from inside a Vibe run, and never rely on `vibe` as the process name a guard matches.
9. Never make Vibe a default route. DevPass, the LLM Gateway route at `llmgateway/deepseek-v4.1-flash-1017`, stays the default on every runtime.
10. Never build a second Vibe adapter, a packet-local wrapper or a hub row inside this packet.

### ⚠️ ESCALATE IF

1. `vibe` is missing from PATH or `vibe --version` does not print `vibe 3.1.2`.
2. Neither the sign-in key nor `MISTRAL_API_KEY` is available, or a run fails with `402 API budget exhausted`.
3. The task needs a model outside the two aliases, or reasoning effort other than the row's `max`.
4. The task needs ACP, a hook, the `.vibe/` runtime folder or the deep-loop executor kind.
5. `export.json` is absent, or its pair is not `0`/`finished`.
6. The task depends on behavior still marked UNKNOWN: a keyless run without a sign-in, or the `allowed_models` close.

---

## 5. REFERENCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - The version pin, the three prompt sources, the flag set, the four budgets, the dispatch shape, the output payloads, the `export.json` fields, the exit taxonomy and the process names
- [providers-and-models.md](./references/providers-and-models.md) - The `mistral` provider row, the two roster aliases, the `allowed_models` close, the catalog result, the default route and the two billing budgets
- [runtime-folder-and-sync.md](./references/runtime-folder-and-sync.md) - The `.vibe/` folder, the trust gate, the generators and `VIBE_HOME` isolation, built by the runtime-folder packet
- [guards-and-hooks.md](./references/guards-and-hooks.md) - The seven hook types, the per-plugin seam that phases 014 to 019 built, and the captured wire format

### Templates and Assets

- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Thin delegator to the canonical prompt card, plus the Vibe print-mode addenda

### External Sources

- [Contract pin evidence](../../../../specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/evidence/export.json) - The captured outcome record, with the prompt-source, catalog, payload and process-name captures beside it
- [Research synthesis](../../../../specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/research.md) - The source-backed design behind every rule

---

## 6. SUCCESS CRITERIA

### Dispatch Completion

- `vibe` is on PATH at `vibe 3.1.2` and `MISTRAL_API_KEY` is exported before launch.
- The argv carries print mode, one roster alias, `--output-dir`, `</dev/null`, a disposable `VIBE_HOME`, `AI_SESSION_CHILD=1` and a scratch cwd, and the home holds the rendered `hooks.toml`.
- `export.json` records `exit_code` 0 and `outcome` `finished`, and the workspace changes pass the caller's verification gates.

### Packet Quality

- Every flag this contract names appears in the captured help text or in the flag table that grounds it separately.
- The roster is two aliases with `thinking = "max"`, ACP is deferred, and every remaining UNKNOWN has a reason.
- No hub registration, router row or default-route claim is made here.

---

## 7. INTEGRATION POINTS

### Hub Integration

The hub owns advisor identity, mode registration and router policy. This packet owns only the Vibe dispatch contract, and it must not add `description.json` or `graph-metadata.json`. `mode-registry.json` and `hub-router.json` both carry a `cli-mistral-vibe` row, so the mode is registered and routed.

### Deep-Loop Integration

The shared runtime is the sole process adapter for lineages, through its `cli-mistral-vibe` executor kind. This packet supplies the rules, the roster and the prompt mechanics. Vibe runs only as a fan-out lineage beside a second executor group, and a single-executor run is refused. The runner gives each lineage its own `VIBE_HOME`, closes stdin, and scores the lineage from `export.json`. A lineage runs with `--auto-approve` and has no confinement. The runner renders the repository hooks into each lineage's home and passes `VIBE_SPEC_FOLDER`, so the guards and the goal slice reach the lineage even though it trusts only its own folder; the spec gate stays off there, because the runner sets `SYSTEM_SPEC_GATE_DISABLED=1` for every lineage.

### Code and Spec Integration

sk-code owns code verification. system-spec-kit owns Gate 3, spec folders and continuity. Name the established spec folder in a delegated prompt when the parent workflow has one.

### Session Handover Integration

Session handover is on by default for Claude Code only. A Vibe session hands over only when `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`, or the master `SYSTEM_SESSION_HANDOVER_ENABLED=1`, is set in the shell before `skilled-loop vibe` starts; without it, `prepare` refuses and names both switches. In an untrusted checkout, start the loop as `skilled-loop vibe --trust`, so both the sender and the receiver load `.vibe/config.toml` and `.vibe/hooks.toml`. The tiers and the claim flow are in `.skilled/hooks/session-handover/README.md`.

### Tool Roles

- Bash runs the probes and the dispatch.
- Read, Glob and Grep inspect prompts, references, `export.json` and returned changes.
- This packet grants no new external tools.

---

## 8. REFERENCES AND RELATED RESOURCES

Start with the CLI reference and the prompt-quality card, then load only the references matching the task. This file is the packet's entry point, and [ROUTER.md](./ROUTER.md) maps each request to the resources it loads. The packet has no prompt templates yet.

Related skills: cli-deepseek-harness, cli-pi, cli-opencode, cli-claude-code, cli-codex, cli-cursor and cli-devin for sibling CLI dispatch, sk-code for code standards and system-spec-kit for packet handback.
