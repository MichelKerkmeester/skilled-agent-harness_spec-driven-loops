---
title: cli-mistral-vibe
description: "Give one bounded task a fixed dispatch route and a written verdict from the export.json record, for Mistral Vibe print-mode runs under a pinned version, a closed two-alias roster and seven fail-closed rules."
trigger_phrases:
  - "mistral vibe"
  - "vibe print mode"
  - "delegate to vibe"
  - "vibe cli"
version: 1.0.4.0
---

# cli-mistral-vibe

> Run one bounded task in an external CLI and judge the result from the record the run writes, not from the text it prints.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | One bounded print-mode task: a read-only review, a single scoped implementation or an independent second opinion |
| **Invoke with** | "mistral vibe", "vibe -p", "vibe print mode" or "delegate to vibe" |
| **Works on** | A machine with the pinned `vibe 3.1.2` binary on PATH, a scratch working directory and a disposable `VIBE_HOME` |
| **Produces** | An `export.json` outcome record in the run's output folder, the answer text on stdout and any workspace changes |

### What It Does

This packet gives you a fixed route for one bounded task through Mistral Vibe (`vibe`) in print mode, plus a written verdict you can check. It fixes the command shape, names the two aliases that may carry `--model`, says where Vibe state may land and states how to judge the result. The [runtime instructions](./SKILL.md) hold the contract, and the [machine router](./ROUTER.md) maps a request to the file that answers it.

A Vibe run can look clean and still be wrong. `--output` carries no exit code, and a tool call that Vibe denied returns to the model as a tool error while the turn continues. The verdict is the pair `exit_code` and `outcome` in the `export.json` record that `--output-dir` writes on every exit. The [CLI reference](./references/cli-reference.md) holds the record fields and the exit codes, with the payload shapes beside them.

---

## 2. QUICK START

**Step 1: Prepare a scratch home and render the repository hooks into it.** Run the block from the checkout root, then leave that root.

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
export VIBE_HOME="$RUN_DIR/.vibe-home"
mkdir -p "$VIBE_HOME"
cp "$REPO/.vibe/config.toml" "$VIBE_HOME/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"
```

Expected output: the renderer prints the absolute path of the `hooks.toml` it wrote, which ends in `/.vibe-home/hooks.toml`. The copied config brings the two roster rows and the `allowed_models` close with it.

**Step 2: Probe the binary.**

```bash
command -v vibe
vibe --version </dev/null
```

Expected output: the first line prints the path of the `vibe` executable on PATH, and the second prints `vibe 3.1.2`. Stop when either line differs, because the packet is pinned on that release.

**Step 3: Dispatch print mode from the scratch directory.** Export `MISTRAL_API_KEY` in the child's environment first, and name the variable in the prompt rather than its value. The run repeats the render on its own line, because the dispatch preflight checks one command at a time.

```bash
cd "$RUN_DIR" && node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$RUN_DIR/.vibe-home" && AI_SESSION_CHILD=1 VIBE_SPEC_FOLDER="$REPO/$SPEC_FOLDER" VIBE_HOME="$RUN_DIR/.vibe-home" vibe -p "$PROMPT" --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null
```

`SPEC_FOLDER` is the task's packet path inside the checkout. Swap `deepseek-flash` for `glm-flash` to use the other alias, and drop `VIBE_SPEC_FOLDER` when the task is bound to no packet. Expected output: Vibe prints its answer on stdout, and the run writes `out/export.json` plus the session journal into the output folder. The printed text is not the verdict.

**Step 4: Read the outcome record.**

```bash
node -e 'const r=JSON.parse(require("node:fs").readFileSync(process.argv[1],"utf8"));console.log(r.exit_code, r.outcome)' "$RUN_DIR/out/export.json"
```

Expected output: `0 finished`. Any other pair is a failure, whatever stdout said.

---

## 3. HOW IT WORKS

A dispatch runs in one direction. The caller composes a prompt, and Vibe runs it once from a scratch directory. Then the caller reads the record.

```text
┌────────────────────────────────────────────────────────────┐
│ A bounded task that names Vibe                             │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Compose the prompt: child preamble, persona, task          │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Fresh VIBE_HOME: config.toml plus rendered hooks.toml      │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│ vibe -p TEXT --model alias --output-dir DIR                │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Read DIR/export.json: exit_code and outcome                │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│ Check the diff and the tests, then keep or reject the work │
└────────────────────────────────────────────────────────────┘
```

### The Conductor Keeps the Verdict

The calling agent stays the conductor. It picks the alias, writes a scoped prompt with the persona inlined, runs the dispatch from a scratch directory and judges the result. Vibe is the delegated executor, answers one task and exits. A Vibe lineage under the deep-loop runtime follows the same split from the runner's side: the shared runtime owns the process adapter, and this packet supplies the rules and the roster.

### Print Mode Is the Only Dispatch Surface

Print mode accepts a prompt through `-p TEXT` or `--prompt-file PATH`. It also reads stdin behind a bare `vibe -p`. A bare `vibe` exits 1 with `Error: Interactive mode needs a terminal. Use -p/--prompt to run without one.`, and ACP (`vibe-acp`) is a stdio JSON-RPC agent that writes no record. Neither counts as a dispatch surface. The [CLI reference](./references/cli-reference.md) sections 2 and 5 record the prompt sources and the payload each one prints.

### The Dispatch Line

Every part of the line carries a rule. `cd "$RUN_DIR"` keeps the checkout's root `.env` and `AGENTS.md` out of Vibe's project discovery. The chained render writes `$VIBE_HOME/hooks.toml` with every guard anchored to the checkout by absolute path. `VIBE_HOME` sends logs and the trust store to a folder you discard at the end. `--model` names one roster alias and `--output-dir` names the record folder. `</dev/null` stops an inherited stdin from hanging the run, and `AI_SESSION_CHILD=1` marks the child so the spec gate never denies its writes. The part-by-part table with the rule behind each one is in the [CLI reference](./references/cli-reference.md) section 4.

### The File Map

| File | What it holds |
|---|---|
| [`SKILL.md`](./SKILL.md) | The activation triggers, the dispatch shape, the rules and the success criteria |
| [`ROUTER.md`](./ROUTER.md) | The intent map, the resource map and the loading levels a router parses |
| [`hard-rules.json`](./hard-rules.json) | The seven fail-closed rules at severity `error`, with the message each check carries |
| [`references/cli-reference.md`](./references/cli-reference.md) | The version pin, the prompt sources, the flag set, the four budgets, the dispatch shape, the payloads, the record fields and the exit codes |
| [`references/providers-and-models.md`](./references/providers-and-models.md) | The `mistral` provider row, the two model rows, the `allowed_models` close and the billing split |
| [`references/runtime-folder-and-sync.md`](./references/runtime-folder-and-sync.md) | The `.vibe/` folder, the trust gate, the three generators and `VIBE_HOME` isolation |
| [`references/guards-and-hooks.md`](./references/guards-and-hooks.md) | The seven hook types, where a hook is declared, when it loads and the captured wire format |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | The delegator to the canonical prompt card, plus the Vibe print-mode addenda |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The operator directory for 41 scenarios across nine folders, plus 14 adapter stress cells |
| [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) | The release note for the packet |

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a request names Mistral Vibe or `vibe -p` and the work is one bounded task. A read-only review fits. So does a single scoped implementation, where the brief names the file to change and the check that proves it. An independent second opinion fits when you want an answer from outside the calling runtime. A roster check fits as well, where you prove an alias resolves before a model call.

Stay out when the work needs an interactive session, because an unattended run has no terminal. Stay out when it needs ACP or a persistent client, which print mode does not provide. Stay out when it needs a model outside the two aliases, because the roster is closed. A run whose only working directory is the repository root is refused, so create a scratch directory instead.

### Related Skills

| Skill | Relationship |
|---|---|
| `cli-external-orchestration` (hub) | Owns advisor identity, mode registration and the routing rows that select this mode |
| `cli-deepseek-harness` | The same packet shape for a second CLI, with its own pinned headless contract and closed roster |
| `cli-opencode` | OpenCode runtime dispatch, plugins and in-OpenCode parallel sessions, for work that needs more than one task |
| `cli-pi`, `cli-codex`, `cli-cursor`, `cli-claude-code`, `cli-devin` | Their own CLI contracts. A request that names one of them routes there. |
| `sk-prompt` | Owns the canonical prompt card that the packet's prompt asset delegates to |
| `system-spec-kit` | Owns the spec folder, the session gate and the continuity records |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `vibe` is not found | The binary is not on PATH | Install the pinned uv tool package `mistral-vibe`, then rerun the probe |
| `vibe --version` prints another release | A different release is installed | Re-pin from a fresh capture before any dispatch uses it |
| Exit 1 with `usage_error` and `Available: mistral-medium-3.5` | The `VIBE_HOME` carried no `config.toml`, so the roster rows were absent | Copy `$REPO/.vibe/config.toml` into the home before the run |
| Exit 1 with `Missing MISTRAL_API_KEY` | The `mistral` provider fell back to browser sign-in, which an unattended run cannot complete | Export `MISTRAL_API_KEY` in the child's environment |
| Exit 1 with `Error: Interactive mode needs a terminal` | A bare `vibe` ran, or a pipe arrived with no `-p` | Use `-p TEXT`, `--prompt-file PATH` or a pipe into a bare `vibe -p` |
| A clean stdout but no trustworthy verdict | `--output` carries no exit code, and a denied tool call still lets the turn continue | Read `exit_code` and `outcome` from `export.json`, then read the session journal for the deny |
| Every hook fails with `Cannot find module '/.vibe/plugins/repo-guards/spec-gate.mjs'` | An `--add-dir` run started outside git, so `git rev-parse --show-toplevel` printed nothing | Start that run from a scratch folder inside the checkout, below its root, with `VIBE_HOME` still outside it |
| A recursion guard never matches `vibe` | The launcher execs the bundled Rust `vibe-rs`, which talks to `vibe-app-server` | Match `vibe-rs` and `vibe-app-server` |

---

## 6. FAQ

### Why is there no reasoning flag?

Effort is the model row's `thinking` field, and `max` is a property of that row. A dispatch cannot raise or lower it on the command line, and an alias whose row does not carry `max` is off-roster.

### Why copy `config.toml` into the run's home?

A fresh home with no config offers one model, so `--model deepseek-flash` exits 1 with `usage_error` and lists `Available: mistral-medium-3.5`. The copy adds the two roster rows and the `allowed_models` close, which takes the built-in row out of the selectable set.

### Does a clean stdout mean the run worked?

No. `--output` carries no exit code, and a denied tool call returns to the model as a tool error while the turn continues, so a run can exit 0 with its work undone. The verdict is the pair `exit_code` and `outcome` in `export.json`.

### Can a lineage dispatch Vibe?

Yes, as a fan-out lineage beside a second executor group, through the shared runtime's `cli-mistral-vibe` executor kind. A single-executor run is refused. A lineage runs with `--auto-approve` and with no confinement, so give it only work you would let run unattended. The runner renders the repository's guard hooks into the lineage's home and passes `VIBE_SPEC_FOLDER`, so the guards and the goal slice still apply. The spec gate stays off there, because the runner sets `SYSTEM_SPEC_GATE_DISABLED=1` for every lineage.

---

## 7. VERIFICATION

| Check | Result |
|---|---|
| README structure | The validator command below reports `Total issues: 0` and exits 0 |
| Dispatch rules | The rule check below prints `7` and the seven rule ids |
| Availability | `command -v vibe` prints a path and `vibe --version` prints `vibe 3.1.2` |
| Provider key | `MISTRAL_API_KEY` is exported in the child's environment |
| Completion | `export.json` records `exit_code` 0 and `outcome` `finished` |
| Operator scenarios | `manual-testing-playbook/` holds 41 scenarios across nine folders and 14 adapter stress cells |

**Check the rule sidecar.**

```bash
node -e "const rules=require('./.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json');console.log(rules.length, rules.map((rule)=>rule.id).join(' '))"
```

Expected output: `7 print-mode-only isolated-vibe-home output-dir-required vibe-closed-roster no-repo-root-cwd stdin-redirect-required rendered-home-hooks`.

**Check this document.**

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-mistral-vibe/README.md --type readme
```

Expected output: `Document type: readme` followed by `Total issues: 0`, and exit 0.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the rules and the success criteria |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and loading levels |
| [`hard-rules.json`](./hard-rules.json) | The seven fail-closed dispatch rules |
| [`references/cli-reference.md`](./references/cli-reference.md) | The version pin, the flags, the dispatch shape and the exit codes |
| [`references/providers-and-models.md`](./references/providers-and-models.md) | The provider row, the two model rows and the `allowed_models` close |
| [`references/runtime-folder-and-sync.md`](./references/runtime-folder-and-sync.md) | The `.vibe/` folder, the trust gate and `VIBE_HOME` isolation |
| [`references/guards-and-hooks.md`](./references/guards-and-hooks.md) | Hook types, hook declaration and the captured wire format |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | The prompt card delegator and the print-mode addenda |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator scenarios, evidence rules and verdicts |
| [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) | The release note for the packet |
