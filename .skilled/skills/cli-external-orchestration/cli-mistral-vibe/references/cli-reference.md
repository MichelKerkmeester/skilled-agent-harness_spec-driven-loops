---
title: "Mistral Vibe CLI - Print-Mode Command Reference"
description: "The pinned vibe 3.1.2 print-mode surface: how a prompt reaches the process, the flag set, the four budgets, the composed dispatch shape, the three output payloads, the export.json outcome record, the exit taxonomy and the process names a recursion guard matches."
trigger_phrases:
  - "vibe print mode flags"
  - "vibe cli reference"
  - "vibe export.json fields"
  - "vibe exit code contract"
  - "vibe prompt sources"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Mistral Vibe CLI - Print-Mode Command Reference

Open this file before composing or checking a `vibe` print-mode command line. Everything it states was captured from a 3.1.2 run in this repository or read from the code that writes the record, so a flag absent here is a flag print mode does not have.

---

## 1. OVERVIEW

### Purpose

Keeps the observed print-mode contract in one place: how a prompt reaches the process, which flags exist, what each output mode writes, what the run record holds and what an exit code means.

### When to Use

- Composing a Vibe dispatch before launch.
- Checking a command line another agent built.
- Classifying a failed run from its `export.json` and exit code.
- Deciding whether a recursion guard or a preflight will recognise the running process.

### Evidence Base

| Capture | What it pins | Path |
|---|---|---|
| Stdin and prompt-file runs | The three prompt sources and the no-`-p` refusal | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/evidence/stdin.md` |
| Catalog check | Alias resolution, the unknown-model exit and `outcome: usage_error` | `.../004-vibe-contract-pin/evidence/catalog.md` |
| Ancestor walk | The process names a live run shows | `.../004-vibe-contract-pin/evidence/ancestors.txt` |
| JSON payload | The `--output json` array shape | `.../004-vibe-contract-pin/evidence/output-json.txt` |
| Streaming payload | The `--output streaming` line shape | `.../004-vibe-contract-pin/evidence/output-streaming.txt` |
| Outcome record | Every `export.json` field | `.../004-vibe-contract-pin/evidence/export.json` |
| Text payload and exit | The `text` reply and the process exit | `.../004-vibe-contract-pin/evidence/stdout-text.txt`, `.../004-vibe-contract-pin/evidence/exit-code.txt` |
| Contract read | The flag list, the four budgets and the exit taxonomy | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/research.md` sections 3 and 4 |

The flag list and the exit taxonomy are a source read of the installed package and its help capture, recorded in `research.md` sections 3 and 4. The payload shapes, the prompt sources, the process names and the `export.json` field set are observations from the captures above.

### Version Pin

| Field | Value | Source |
|---|---|---|
| Version | `3.1.2` | `export.json` field `vibe_version` |
| Launcher | `~/.local/bin/vibe` | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/research.md` |
| Install | uv tool venv, package `mistral-vibe` | `research.md` section 2 |
| Record schema | `schema_version` `1` | `export.json` |

This table is the packet's one pin record. A new release is re-pinned from a fresh capture before any dispatch uses it.

---

## 2. PROMPT SOURCES

Print mode takes the prompt three ways, and only the third needs no `-p`.

| Source | Command shape | Result | Evidence |
|---|---|---|---|
| Flag argument | `vibe -p TEXT ... </dev/null` | Exit 0, `outcome` `finished`, stdout `OK` | `export.json`, `stdout-text.txt` |
| Stdin behind a bare `-p` | `printf '%s' "$PROMPT"` piped into `vibe -p` | Exit 0, `outcome` `finished`, stdout `OK` | `stdin.md` Run A |
| Prompt file | `vibe --prompt-file PATH` | Exit 0, `outcome` `finished`, stdout `OK` | `stdin.md` Run C |
| A pipe with no `-p` | prompt piped into bare `vibe` | Exit 1, refused | `stdin.md` Run B |

All three forms finished cleanly. The text, json, streaming and GLM captures all used `-p "<prompt>"` with `</dev/null`.

The refusal reads `Error: Interactive mode needs a terminal. Use -p/--prompt to run without one.` So stdin is a prompt source only behind a bare `-p`, and a dispatch that pipes its prompt still passes `-p`.

`--prompt-file PATH` alone runs print mode, with no `-p` beside it. The captured run passed `--prompt-file ./prompt.txt` with `</dev/null` and finished cleanly (`stdin.md`).

The research left stdin open, because the binary's own message reads "Pass either -p TEXT or --prompt-file" (`research.md` section 3). The captured pipe closes that question in favour of stdin behind `-p`.

A `-p TEXT` or `--prompt-file` dispatch ends with `</dev/null`, so an inherited stdin cannot hang the run. A pipe into a bare `-p` already supplies stdin and needs no redirect.

---

## 3. FLAGS

### Flag Set

| Flag | Meaning | Grounding |
|---|---|---|
| `--model ALIAS` | Picks a model row by alias. An id with no row exits 1 with `Error: Unknown model: <id>. Available: <aliases>` | `catalog.md` |
| `--agent NAME` | Picks an agent profile for the run | `research.md` section 3 |
| `--auto-approve` | Pre-approves tool calls so nothing waits on a human | `research.md` section 3 |
| `--smart-approve` | Routes approvals through the smart-approve utility model | `research.md` section 3 |
| `--trust` | Trusts the working directory for this run. It does not reach a `.vibe/config.toml` in a parent folder, so the repository config applies only through the home's `trusted_folders.toml` | `trust-probe.md` |
| `--enabled-tools` | Narrows the tool set to the named tools | `research.md` section 3 |
| `--disabled-tools` | Removes the named tools from the set | `research.md` section 3 |
| `--workdir` | Sets the working directory; the environment variable `VIBE_CWD` does the same | `research.md` section 3 |
| `--add-dir` | Grants one more directory to the run | `research.md` section 3 |
| `--worktree` | Runs the session in a git worktree | `research.md` section 3 |
| `--output` | Selects `text`, `json` or `streaming` on stdout | `output-json.txt`, `output-streaming.txt`, `stdout-text.txt` |
| `--output-dir` | Writes `export.json` and the session journal into the named directory on every exit | `export.json` |

The export echoes the effective configuration, so a caller confirms what a tool flag did by reading `config.enabled_tools`, `config.disabled_tools`, `config.tools`, `config.outside_workdir`, `config.enable_auto_approve`, `config.smart_approve_available` and `config.default_agent` (`export.json`). The captured record lists `disabled_tools` as `["ask_user_question", "cron"]`, so a caller reading that field sees the effective set rather than a restatement of the command line.

### Model Aliases

`--model` takes an alias, and an alias resolves only against a model row in the run's config. With a fresh empty `VIBE_HOME` and no `config.toml`, both roster ids exit 1 with `Error: Unknown model: <id>. Available: mistral-medium-3.5` (`catalog.md`). With the repository's hand-written rows in place, the same probe answers `Available: deepseek-flash, glm-flash, mistral-medium-3.5`, and the built-in free row is not selectable by its alias (`catalog.md`).

So the selectable set is the hand-written aliases plus the built-in `mistral-medium-3.5`, and closing it to the roster takes `allowed_models`. A dispatch names `deepseek-flash` or `glm-flash`, and the roster detail lives in [providers-and-models.md](./providers-and-models.md).

### Budgets

Four flags bound a run. The capture passed none, so all four record `null` in `export.json` under `limits`:

| Flag | `limits` key | What it bounds |
|---|---|---|
| `--max-turns` | `max_turns` | The number of turns |
| `--max-price` | `max_price` | Cumulative spend in dollars, across the root session and its subagents |
| `--max-tokens` | `max_tokens` | Token count |
| `--time-limit` | `time_limit_s` | Wall-clock seconds |

A budget that trips stops the run without finishing it, which is exit 3 in the taxonomy of section 6. The dollar unit of `--max-price` matches the `cost_usd` the same record reports, and its scope across the root session and its subagents is recorded in `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/research.md` section 3.

### Reasoning Effort

No reasoning flag exists. Effort lives in the model row's `thinking` field, and the research records the flag's absence from `vibe --help` as merge-verified (`research.md` section 4). The captured config shows the mechanism directly: the `deepseek-flash` row carries `"thinking": "max"` beside a `thinking_levels` ladder of `off`, `low`, `medium`, `high` and `max` (`export.json`).

A dispatch therefore cannot raise or lower effort on the command line, and an executor that needs the `max` pin rejects an alias whose row does not carry it.

---

## 4. THE DISPATCH SHAPE

Every dispatch composes the same line. Variables keep the shape copyable and the paths explicit:

```bash
cd "$RUN_DIR" && AI_SESSION_CHILD=1 VIBE_SPEC_FOLDER="$REPO/$SPEC_FOLDER" VIBE_HOME="$RUN_DIR/.vibe-home" vibe -p "$PROMPT" --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null
```

| Part | Why | Hard rule |
|---|---|---|
| `cd "$RUN_DIR"` | The repository root holds a dotenv file and the root `AGENTS.md`, so a root-cwd run puts both in reach of project discovery | `no-repo-root-cwd` |
| `AI_SESSION_CHILD=1` | Marks the run as a dispatched child, so the spec gate in the rendered hooks never denies its writes | none; the sibling CLI packets set it the same way |
| `VIBE_SPEC_FOLDER="$REPO/$SPEC_FOLDER"` | Names the packet whose goal slice the session-start hook injects; drop it when the task has no packet | none |
| `VIBE_HOME="$RUN_DIR/.vibe-home"` | Logs, `vibehistory` and `trusted_folders.toml` land in the disposable home instead of the operator's `~/.vibe`, and the rendered `hooks.toml` loads from it | `isolated-vibe-home` |
| `vibe -p "$PROMPT"` | Print mode is the only dispatch surface; interactive `vibe` and `vibe-acp` are refused | `print-mode-only` |
| `--model deepseek-flash` | A roster alias whose row carries `thinking = "max"` | `vibe-closed-roster` |
| `--output-dir "$RUN_DIR/out"` | The caller reads `out/export.json`, never stdout | `output-dir-required` |
| `</dev/null` | An inherited stdin cannot hang the run | `stdin-redirect-required` |

`RUN_DIR` is a fresh temp directory and the dispatch never starts at the repository root. Before the run, `node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$VIBE_HOME"` writes the repository hooks into the home with absolute paths: the project `.vibe/hooks.toml` loads only from a trusted project root, so a scratch-cwd run sees only the home copy. The `mistral` provider takes browser sign-in or `MISTRAL_API_KEY` (`research.md` section 4), so a dispatch passes the key in its own environment rather than relying on the operator's sign-in.

The six rules in the table are the ones [../hard-rules.json](../hard-rules.json) enforces, and a dispatch that breaks one breaks the packet's contract.

---

## 5. OUTPUT PAYLOADS

`--output` selects what stdout carries. None of the three carries the exit code.

### Text

`--output text` prints the reply. The captured run's stdout holds `OK` and nothing else (`stdout-text.txt`), and the process exit sits beside it in `exit-code.txt` as `0`.

### JSON

`--output json` prints one JSON array of session entries at the end of the run. The captured array holds two entries for a one-turn run (`output-json.txt`):

| Entry | `role` | `source` | `content` | `outcome` |
|---|---|---|---|---|
| 1 | `user` | `turn_start` | the prompt text | `null` |
| 2 | `assistant` | `harness` | the reply text | `{"type":"committed"}` |

Each entry carries `id`, `sessionId`, `turnId`, `inputEntryId`, `createdAt`, `updatedAt`, `generationStatus`, `relatedEntryId`, `type`, `role`, `content[]`, `source`, `userDisplayContent` and `outcome`. The assistant entry's `inputEntryId` points at the user entry's `id`, and `type` is `message` on both.

### Streaming

`--output streaming` prints the same entries as one JSON object per line. The captured run holds two lines with the same field set and the same two roles (`output-streaming.txt`).

The two payloads differ only in framing: one array at the end, or one object per line. A caller that reads the reply from stdout reads `content[].text` on the assistant entry.

A clean stdout proves nothing about completion. A denied tool call returns to the model as a tool error and the turn continues, so a run whose tool calls were denied can still exit 0 (`research.md` section 3). The audit reads `export.json`, never stdout.

---

## 6. OUTCOME RECORD

`--output-dir DIR` writes `export.json` into `DIR` on every exit, whatever the exit code (`research.md` section 3). The capture in this repository is one such record.

### Fields

| Field | What it holds | Captured value |
|---|---|---|
| `vibe_version` | The running version | `3.1.2` |
| `schema_version` | The record schema | `1` |
| `outcome` | The run's verdict word | `finished` |
| `stop_reason` | Why the run stopped, when it did not finish | `null` |
| `error` | The error record, when there is one | `null` |
| `session_id` | The session id | a UUID |
| `usage` | `input_tokens`, `output_tokens`, `cached_input_tokens`, `total_tokens` | `8454`, `3`, `3456`, `8457` |
| `cost_usd` | The run's cost in dollars | `0.0` |
| `steps` | The step count | `1` |
| `config` | The effective configuration, redacted | the full block |
| `limits` | The four budgets as passed | all `null` |
| `subagents` | One record per subagent | absent; no subagent ran |
| `journal_dir` | The journal folder name | `session` |
| `started_at`, `ended_at` | ISO timestamps | the run's bounds |
| `exit_code` | The process exit code | `0` |

`subagents[]` is in the field list the research reads from the export writer (`research.md` section 3) and has no key in this capture, because the run spawned no subagent. The rest of the table is the capture's own key set.

### Exit Codes

| Exit | Meaning | Outcome recorded | Evidence |
|---|---|---|---|
| `0` | Finished | `finished` | `export.json`, `exit-code.txt` |
| `1` | Usage or config error | `usage_error` | `catalog.md` |
| `2` | Infrastructure failure under the agent | not captured | `research.md` section 3 |
| `3` | Stopped without finishing: a turn, token, price or time bound, termination, length or refusal | not captured | `research.md` section 3 |
| `4` | Aborted by the agent socket | not captured | `research.md` section 3 |

Both unknown-model probes exited 1 and recorded `outcome: usage_error` (`catalog.md`), which is the one non-zero row this repository has observed.

### The Verdict

The verdict is the pair `exit_code` plus `outcome`, read from `export.json`. Count a run complete only when `exit_code` is `0` and `outcome` is `finished`; any other pair is a failure whatever stdout said.

---

## 7. PROCESS NAMES

The ancestor walk recorded during a live dispatch lists these processes (`ancestors.txt`):

```text
73654 sh
73653 zsh
73477 vibe-app-server
73476 vibe-rs
73467 zsh
60327 claude
30369 bash
26621 zsh
26619 login
88673 orca-terminal-host
```

`vibe-rs` and its child `vibe-app-server` appear; `vibe` does not. The reason is in the architecture: `vibe` is a Python launcher that execs the bundled Rust `vibe-rs`, which talks to `vibe-app-server` (`research.md` section 3). The launcher's process image is replaced, so the name a typed command carries is gone by the time the run is visible in the process table.

A recursion guard therefore matches `vibe-rs` and `vibe-app-server`. A guard that matches only `vibe` finds nothing in this capture, and a guard that matches only the typed command would let a lineage re-enter itself.

---

## 8. ISOLATION

`VIBE_HOME` is set fresh per dispatch, on the same command line as the run. An unset `VIBE_HOME` falls back to `~/.vibe`, and the research recorded that fallback happening: Vibe commands created `~/.vibe/logs/`, `~/.vibe/vibehistory` and `~/.vibe/trusted_folders.toml` in the operator's home during that run (`research.md` section 5, merge-verified). A `VIBE_HOME` inside the checkout leaks the same state into the repository instead.

The captured dispatch shows the redirect working. Its `config.session_logging.save_dir` points at `<temp run dir>/logs/session`, not at a home directory (`export.json`), so the journal and the session log both landed inside the disposable run directory.

Isolation also isolates the model roster. A fresh empty `VIBE_HOME` with no `config.toml` offers only the built-in `mistral-medium-3.5`, which is why both roster ids failed in the catalog probe (`catalog.md`). A dispatch that names a roster alias needs a `config.toml` in that home, and the mirror that supplies it is [runtime-folder-and-sync.md](./runtime-folder-and-sync.md).

---

## 9. LINEAGE DISPATCH

A fan-out lineage dispatches Vibe through the deep-loop runner's `cli-mistral-vibe` executor kind, so the runner builds the command line an operator would otherwise type: a disposable `VIBE_HOME` per lineage, `VIBE_SPEC_FOLDER` as an absolute path, and the rendered repository hooks in that home before the run starts. The executor kind and the lineage posture are in [../SKILL.md](../SKILL.md).

The runner also sets `SPECKIT_DIST_AUTO_REBUILD=0` for the lineage. Every Vibe lineage runs the session-start dist check, and that check's default self-heal compiles a stale package into the checkout, so sibling lineages starting together would race one build. With the switch off, the lineage keeps the staleness warning and the parent session keeps the rebuild. The switch suppresses the compile, not the check. The render step and what it writes are in [guards-and-hooks.md](./guards-and-hooks.md).

---

## 10. RELATED

- [providers-and-models.md](./providers-and-models.md) - the `mistral` provider row, the two roster models with `thinking = "max"`, and `allowed_models`.
- [runtime-folder-and-sync.md](./runtime-folder-and-sync.md) - the `.vibe/` layout and the generated mirror a dispatch's `VIBE_HOME` carries.
- [guards-and-hooks.md](./guards-and-hooks.md) - the hook types and which of them accept `strict`.
- [../hard-rules.json](../hard-rules.json) - the six rules the dispatch shape satisfies.
