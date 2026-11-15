---
title: cli-mistral-vibe
description: Cross-AI dispatcher for Mistral Vibe (vibe) print-mode runs, with a pinned version, a closed two-alias roster and seven fail-closed dispatch rules.
trigger_phrases:
  - "mistral vibe"
  - "vibe print mode"
  - "delegate to vibe"
  - "vibe cli"
version: 1.0.2.0
---

# cli-mistral-vibe

> Dispatch one scoped task to Mistral Vibe in print mode and read the outcome from the `export.json` record the run writes.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | One-task print-mode reviews, scoped implementations and second opinions on the two roster aliases |
| **Invoke with** | "mistral vibe", "vibe -p", "vibe print mode", "delegate to vibe" |
| **Works on** | A runtime that can reach the pinned `vibe` binary, from a scratch cwd with a disposable `VIBE_HOME` |
| **Produces** | An `export.json` outcome record, the model's answer text and any workspace changes |

### What It Does

The packet tells a caller how to compose a Vibe print-mode dispatch, which alias selects which model, where Vibe state may and may not land, and how to judge the result. It keeps the CLI contract, the roster, the runtime folder and the guard plan in separate references, with every behavior outside the saved captures marked UNKNOWN.

### Why This Skill Exists

Vibe picks its model from a config row, not from a reasoning flag. Print mode has no reasoning option, and effort is the model row's `thinking` field.

A fresh `VIBE_HOME` with no `config.toml` offers one model, so `--model deepseek-flash` exits 1 with `usage_error`. A run whose tool calls were denied can still exit 0, because `--output` carries no exit code. A dispatch started from the repository root puts the root `.env` and `AGENTS.md` in reach of Vibe's project discovery.

This packet fixes the argv shape, names the two aliases that may run and states seven rules the dispatch preflight checks.

### Status

Print mode is pinned on vibe 3.1.2 from captures in this repository. Both roster rows are hand-written, `allowed_models` closes the roster by model name, and ACP (`vibe-acp`) is deferred.

---

## 2. QUICK START

**Step 1: Make a scratch home and cwd, copy the config, then probe the binary.**

~~~bash
REPO="$(pwd -P)"   # run from the checkout root, then leave it
RUN_DIR="$(mktemp -d)"; export VIBE_HOME="$RUN_DIR/.vibe-home"; cd "$RUN_DIR"
mkdir -p "$VIBE_HOME" && cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"   # the guards and the goal hook
command -v vibe && vibe --version </dev/null
~~~

The version must print `vibe 3.1.2`. Stop on anything else.

**Step 2: Export the key and pick one roster alias.**

~~~bash
test -n "${MISTRAL_API_KEY:-}" || echo "MISTRAL_API_KEY is not exported; the mistral provider would fall back to browser sign-in."
~~~

Name `deepseek-flash` or `glm-flash` and nothing else. The home a dispatch uses must carry the two rows, and the copied `config.toml` also brings `allowed_models`, which closes the built-in `mistral-medium-3.5` out.

**Step 3: Dispatch in print mode and read the outcome record.**

~~~bash
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$RUN_DIR/.vibe-home" && AI_SESSION_CHILD=1 VIBE_SPEC_FOLDER="$REPO/$SPEC_FOLDER" VIBE_HOME="$RUN_DIR/.vibe-home" vibe -p "$PROMPT" --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null
~~~

The run line repeats the render and names the home itself, because the preflight judges each command on its own and refuses a run whose home was set or rendered by an earlier line. A run is complete only when `$RUN_DIR/out/export.json` records `exit_code` 0 and `outcome` `finished`. Never read the outcome from stdout, from `--output json` or from the exit status alone.

---

## 3. HOW IT WORKS

### The Conductor Model

The calling AI stays the conductor. It picks the alias, writes a scoped prompt with the persona inlined, runs the dispatch from a scratch cwd and validates `export.json`, the diff and the tests. Vibe is the delegated executor, and it answers one task and exits.

### Print Mode Is the Only Dispatch Surface

`vibe -p TEXT`, a pipe into a bare `vibe -p`, and `vibe --prompt-file PATH` all run headless. ACP (`vibe-acp`) is a stdio JSON-RPC agent that writes no `export.json` and has no exit taxonomy, so it is deferred and is not a dispatch surface.

### Fail-Closed Rules

[hard-rules.json](./hard-rules.json) carries seven rules at severity `error`: `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `vibe-closed-roster`, `no-repo-root-cwd`, `stdin-redirect-required` and `rendered-home-hooks`.

---

## 4. STRUCTURE

```text
cli-mistral-vibe/
  SKILL.md                                  # Runtime instructions and rules
  ROUTER.md                                 # Machine router: intent map, resource map and loading levels
  README.md                                 # Folder orientation and navigation for the packet
  hard-rules.json                           # The seven fail-closed dispatch rules
  assets/
    prompt-quality-card.md                  # Thin prompt-quality delegator plus Vibe print-mode addenda
  changelog/                                # Versioned release notes
  references/
    cli-reference.md                        # Version pin, prompt sources, flag set, budgets, dispatch shape, exit contract
    providers-and-models.md                 # The mistral provider row, the two roster aliases and the allowed_models close
    runtime-folder-and-sync.md              # The .vibe/ folder, the trust gate and VIBE_HOME isolation
    guards-and-hooks.md                     # The seven hook types, the per-plugin seam and the captured wire format
```

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Use cli-mistral-vibe when the request names Mistral Vibe, `vibe -p`, `vibe print mode` or says "delegate to vibe" for a one-task print-mode run with an `export.json` outcome record. Use a sibling packet when the request names another CLI.

### Sibling Boundaries

| Skill | Relationship |
|---|---|
| cli-deepseek-harness | DeepSeek Harness headless runs, with a closed two-route patch roster |
| cli-opencode | Full OpenCode runtime, plugins and detached sessions |
| cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi | Their own vendors' CLIs and model families |

### Resource Map

- CLI behavior: [references/cli-reference.md](./references/cli-reference.md)
- Roster and models: [references/providers-and-models.md](./references/providers-and-models.md)
- Runtime folder: [references/runtime-folder-and-sync.md](./references/runtime-folder-and-sync.md)
- Guards: [references/guards-and-hooks.md](./references/guards-and-hooks.md)
- Prompt asset: [assets/prompt-quality-card.md](./assets/prompt-quality-card.md)
- Dispatch rules: [hard-rules.json](./hard-rules.json)

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `vibe` is not found | The binary is absent from PATH | Install the pinned uv tool package `mistral-vibe`, then rerun the probe |
| `vibe --version` prints another version | A different release is installed | Re-pin before dispatching on it |
| Exit 1 with `usage_error` and `Available: mistral-medium-3.5` | The `VIBE_HOME` carried no `config.toml`, so the roster rows were absent | Copy `$REPO/.vibe/config.toml` into the home before the run |
| Exit 1 with `Missing MISTRAL_API_KEY` | The `mistral` provider fell back to browser sign-in | Export `MISTRAL_API_KEY` in the child's environment, by name |
| Exit 1 with `Interactive mode needs a terminal` | A bare `vibe`, or a pipe with no `-p` | Use `-p TEXT`, a pipe into a bare `vibe -p`, or `--prompt-file PATH` |
| A clean stdout but no trustworthy verdict | `--output` carries no exit code, and a denied tool call still lets the turn continue | Read `exit_code` and `outcome` from `export.json` |
| A recursion guard never matches `vibe` | The launcher execs the bundled Rust `vibe-rs`, which talks to `vibe-app-server` | Match `vibe-rs` and `vibe-app-server` |

---

## 7. FAQ

**Q: Why is there no reasoning flag?**

A: Effort is the model row's `thinking` field, and `max` is a property of the row. A dispatch cannot raise or lower it on the command line.

**Q: Why copy `config.toml` into the run's home?**

A: An empty home offers one model, so `--model deepseek-flash` exits 1 with `usage_error`. The copy brings the two roster rows and `allowed_models`, which closes the built-in `mistral-medium-3.5` out.

**Q: Does a clean stdout mean the run worked?**

A: No. `--output` carries no exit code, and a denied tool call returns to the model as a tool error while the turn continues. Read `export.json`.

**Q: Can a lineage dispatch Vibe?**

A: Yes, as a fan-out lineage beside a second executor group, through the shared runtime's `cli-mistral-vibe` executor kind. The lineage runs with `--auto-approve` and with no confinement, so give it only work you would let run unattended. The runner renders the repository's guard hooks into the lineage's home, so the guards and the goal slice still apply.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| Availability | `command -v vibe` prints a path and `vibe --version` prints `vibe 3.1.2` |
| Provider | `MISTRAL_API_KEY` is exported in the child's environment |
| Completion | `export.json` records `exit_code` 0 and `outcome` `finished` |
| Rules | `hard-rules.json` parses and carries all seven rule ids |
| Flags | Every flag this contract names appears in the captured help text or in the flag table that grounds it separately |
| Packet shape | `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-mistral-vibe` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime instructions and rules |
| [ROUTER.md](./ROUTER.md#3-machine-router) | Machine router: intent map, resource map and loading levels |
| [hard-rules.json](./hard-rules.json) | The seven fail-closed dispatch rules |
| [references/cli-reference.md](./references/cli-reference.md) | Flags, dispatch shape and exit contract |
| [references/providers-and-models.md](./references/providers-and-models.md) | The closed roster |
| [assets/prompt-quality-card.md](./assets/prompt-quality-card.md) | Thin prompt-quality delegator |
