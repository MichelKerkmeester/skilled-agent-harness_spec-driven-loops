---
title: cli-deepseek-harness
description: Cross-AI dispatcher for DeepSeek Harness (dsh) headless runs, with a pinned version, a closed two-route roster and twelve fail-closed dispatch rules.
trigger_phrases:
  - "deepseek harness"
  - "dsh headless"
  - "delegate to dsh"
  - "deepseek harness cli"
version: 1.0.0.0
---

# cli-deepseek-harness

> Dispatch one scoped task to DeepSeek Harness in headless mode and get back a JSON event stream whose final event says whether the task completed.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | One-task headless reviews, scoped implementations and second opinions on DeepSeek V4.1 Flash |
| **Invoke with** | "deepseek harness", "dsh headless", "delegate to dsh" |
| **Works on** | A runtime that can reach the pinned `dsh` binary, from a scratch cwd with a disposable `DSH_HOME` |
| **Produces** | A newline-delimited JSON event stream, a final answer text and any workspace changes |

### Why This Skill Exists

DeepSeek Harness picks its own model. Its headless mode has no model, provider, timeout or working-directory option, and its built-in default route is the official DeepSeek API, which this repository never uses. A hand-built dispatch that forgets the route patch reaches that default. One started from the repository root reads the root `.env`. One that trusts a parseable stream can miss a failure, because a keyless run prints a valid final event and still exits 1.

This packet makes those mistakes hard to make. It fixes the argv shape, names the two routes that may run and states twelve rules the dispatch preflight checks. Every flag it names was captured from the installed binary.

### What It Does

The packet tells a caller how to compose a dsh dispatch, which route patch selects which model, where dsh state may and may not land, and how to judge the result. It keeps the runtime folder, the guards, MCP and the fan-out executor in separate references, with route status tied to the evidence for that route.

### Status

LLM Gateway `deepseek-v4.1-flash-1017` is verified on dsh 0.2.2-rc.1 (2026-11-06) and is the default route. OpenCode Go `deepseek-v4.1-flash` is configured, not verified, and stays out of defaults. The executor kind remains experimental while OpenCode Go is unverified.

---

## 2. QUICK START

**Step 1: Make a scratch home and cwd, then probe the binary.**

~~~bash
REPO="$(pwd -P)"   # run from the checkout root, then leave it
RUN_DIR="$(mktemp -d)"; export DSH_HOME="$RUN_DIR/.dsh-home"; cd "$RUN_DIR"
command -v dsh && dsh --version </dev/null
~~~

The version must be the pin in [cli-reference.md](./references/cli-reference.md) section 2. Stop on anything else.

**Step 2: Prove the patches compose, with no model call.**

~~~bash
dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" \
  --patch "$REPO/.dsh/patches/lineage.patch.yml" --dump-config </dev/null
~~~

Expect exit 0, nothing on stderr and the route's provider and model under `agent-default-model`.

**Step 3: Dispatch with the prompt on stdin and check the final event.**

~~~bash
dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" \
  --patch "$REPO/.dsh/patches/lineage.patch.yml" \
  --patch "$REPO/.dsh/patches/guards.patch.yml" \
  --json --permission-mode read-only --approval-policy never - <prompt.md >stdout.jsonl
~~~

A run is complete only on exit 0 and a last line with `"type":"final"` and `reason.kind` `completed`. The validator script is in [prompt-templates.md](./assets/prompt-templates.md) section 6.

---

## 3. HOW IT WORKS

### The Conductor Model

The calling AI stays the conductor. It picks the route, writes a scoped prompt with the persona inlined, runs the dispatch from a scratch cwd and validates the stream, the diff and the tests. dsh is the delegated executor, and it answers one task and exits.

### Composition, Not Flags

dsh builds its runtime from layered YAML patches, and the last layer wins per row. The route patch replaces the provider and default-model rows, and the lineage patch switches off telemetry export, the DeepSeek session log, native goal rounds and plan mode. The offline pin showed both changes in the composed config before any model call.

### Fail-Closed Rules

[hard-rules.json](./hard-rules.json) carries twelve rules at severity `error`, from `headless-only` to `mcp-opt-in-only`. The shared dispatch preflight evaluates them before every shell command in each runtime that loads it, and inside dsh through the repo-guards bundle.

---

## 4. STRUCTURE

```text
cli-deepseek-harness/
  SKILL.md                                  # Runtime instructions and rules
  ROUTER.md                                 # Machine router: intent map, resource map and loading levels
  README.md                                 # Folder orientation and navigation for the packet
  hard-rules.json                           # The twelve fail-closed dispatch rules
  assets/
    prompt-quality-card.md                  # Thin prompt-quality delegator plus dsh addenda
    prompt-templates.md                     # Preflight, composition check, review, implementation, validation, handback
  changelog/                                # Versioned release notes
  references/
    cli-reference.md                        # Version pin, headless options, launcher flags, dispatch shape, exit contract
    providers-and-models.md                 # The closed two-route roster and the route patch shape
    runtime-folder-and-sync.md              # .dsh/ layout, DSH_HOME isolation, skills, prompts, personas
    guards-and-hooks.md                     # Harness seams, the repo-guards plugin bundle, the port table
    mcp.md                                  # MCP off by default and the opt-in Code Mode patch
    fanout-executor.md                      # The experimental executor kind and its lineage command
    repin-runbook.md                         # Repeat route, confinement, reasoning and lineage probes after an rc bump
```

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Use cli-deepseek-harness when the request names DeepSeek Harness or `dsh`, or needs a one-task headless DeepSeek V4.1 Flash run with a machine-readable result. Use a sibling packet when the request names another CLI, or when it wants DeepSeek through cli-pi or cli-opencode rather than through the harness.

### Sibling Boundaries

| Skill | Relationship |
|---|---|
| cli-pi | Pi's coding agent. It also reaches DeepSeek models, through its own provider flags |
| cli-hermes | Hermes Agent quiet one-shot dispatch over LLM Gateway |
| cli-opencode | Full OpenCode runtime, plugins and detached sessions |
| cli-claude-code, cli-codex, cli-cursor, cli-devin | Their own vendors' CLIs and model families |

### Resource Map

- CLI behavior: [references/cli-reference.md](./references/cli-reference.md)
- Routes and models: [references/providers-and-models.md](./references/providers-and-models.md)
- Runtime folder: [references/runtime-folder-and-sync.md](./references/runtime-folder-and-sync.md)
- Guards: [references/guards-and-hooks.md](./references/guards-and-hooks.md)
- MCP: [references/mcp.md](./references/mcp.md)
- Fan-out: [references/fanout-executor.md](./references/fanout-executor.md)
- Re-pin after an rc bump: [references/repin-runbook.md](./references/repin-runbook.md)
- Prompt assets: [assets/prompt-templates.md](./assets/prompt-templates.md)

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `dsh` is not found | The binary is absent from PATH | Install the pinned package, then rerun the probe |
| `dsh --version` prints another version | A different release is installed | Re-pin offline before dispatching on it |
| Exit 1, final reason `error`, code `MISSING_CREDENTIAL` | The route's key variable is not set | Export the variable stderr names, by name, in the dispatch environment |
| A command carries a model or provider option | dsh headless has no such option, so the command is wrong whatever dsh does with it | Drop the option and select the model with the route patch |
| `--dump-config` prints a stderr line | A patch may target a row the release renamed | Fix the patch before any dispatch |
| The `session` event's `cwd` is the repository root | The dispatch started at the root | Stop. Rerun from a scratch cwd, because the root `.env` was readable |

---

## 7. FAQ

**Q: Why two route patches instead of a model option?**

A: dsh headless has no model option. The route patch replaces the default-model row, so one checked-in patch per route is the only way to choose a model, and keeping them separate keeps the routes from crossing.

**Q: Does a valid JSON stream mean the run worked?**

A: No. The keyless offline run printed a well-formed stream whose final event reported an error, and exited 1. Read the exit code and the final reason together.

**Q: Why not use `~/.dsh`?**

A: Every profile-scoped command initializes profile files in the home it resolves, and an unset `DSH_HOME` resolves to `~/.dsh`. A disposable home keeps dispatch state out of the operator's own setup.

**Q: Is the OpenCode Go route ready?**

A: It is configured, not verified. No request was sent because its key was unset, so which documented endpoint authenticates remains UNKNOWN. Keep it out of defaults.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| Availability | `command -v dsh` prints a path and `dsh --version` prints the pin |
| Composition | `--dump-config` with the route and lineage patches exits 0 with empty stderr |
| Completion | Exit 0 and a last `final` event with `reason.kind` `completed` |
| Rules | `hard-rules.json` parses and carries all twelve rule ids |
| Flags | Every double-dash token in `references/cli-reference.md` is in the captured help text, except the four launcher flags that file grounds separately |
| Packet shape | `node .skilled/commands/doctor/scripts/sk-skill-check.cjs .skilled/skills/cli-external-orchestration/cli-deepseek-harness` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime instructions and rules |
| [ROUTER.md](./ROUTER.md#3-machine-router) | Machine router: intent map, resource map and loading levels |
| [hard-rules.json](./hard-rules.json) | The twelve fail-closed dispatch rules |
| [references/cli-reference.md](./references/cli-reference.md) | Flags, dispatch shape and exit contract |
| [references/providers-and-models.md](./references/providers-and-models.md) | The closed roster |
| [assets/prompt-quality-card.md](./assets/prompt-quality-card.md) | Thin prompt-quality delegator |
| [assets/prompt-templates.md](./assets/prompt-templates.md) | Reusable dsh dispatch templates |
