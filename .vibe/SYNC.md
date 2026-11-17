---
title: "Mistral Vibe: Runtime Sync Manifest"
description: "How .vibe/ derives from .skilled: the hand-authored config and guard bundle, the generated agent profiles, the skill links, the prompt stubs and the checks that catch drift."
trigger_phrases:
  - "vibe sync manifest"
  - "vibe surface inventory"
  - "vibe mirror drift"
---

# Mistral Vibe Sync Manifest

> `.skilled/` is the source of truth. This folder carries the Vibe config and guard bundle by hand, and three generators write the mirror trees.

---

## 1. OVERVIEW

Vibe walks up from the working directory to find `.vibe/config.toml`, nearest first, and reads that folder root only. It looks no deeper. `config.toml`, `hooks.toml` and the `agents/`, `skills/`, `plugins/` and `prompts/` folders all resolve from that one root. A discovered config applies only when its own folder is trusted, so an untrusted run uses the home config alone and none of the rows below apply. `--trust` from a subdirectory trusts that subdirectory, never the checkout root. The root `AGENTS.md` loads from the project tree outermost first, so the shared instructions arrive with no wiring.

The folder follows the split `.dsh/` uses. `config.toml` and `hooks.toml` are hand-authored, and so is the `plugins/` bundle. The generated trees are `agents/`, `skills/` and `prompts/`, and `manual-testing-playbook` is a link rather than a copy. This file is hand-authored too. The generated trees cannot be authored here, because each generator derives its output from `.skilled/` and a write run prunes anything it did not write.

`config.toml` closes the selectable models by each row's `name`, not its `alias`. An alias list only warns and leaves every configured model selectable. Each row pins `thinking = "max"`, because Vibe has no reasoning flag.

---

## 2. SURFACE INVENTORY

One row for each entry in this folder.

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `config.toml` | authored here | none | No. No generator reads or writes it |
| `hooks.toml` | authored here | none | No. No generator reads or writes it |
| `agents/<name>.toml` | generated profile | `.skilled/agents/*.md` | Yes. `sync-agents-vibe.cjs --check` |
| `skills/<name>` | generated relative symlink | `.skilled/skills/**/SKILL.md` | Yes. `sync-skills-vibe.cjs --check` |
| `prompts/*.md` | generated pointer stub | `.skilled/commands/**/*.md` | Yes. `sync-prompts-vibe.cjs --check` |
| `plugins/repo-guards/` | authored here | none | No. Most scripts import a core under `.skilled/` at run time, and `session-cleanup.mjs` loads `.opencode/plugins/session-cleanup.js`, so a core change needs no copy |
| `plugins/README.md` | authored here | `hooks.toml` and `.opencode/plugins/` | Yes, by hand. It maps each plugin to the entry that does its job, so a new plugin or entry needs a row. Vibe reads each direct subdirectory as a plugin, so this file never loads |
| `manual-testing-playbook` | hand-made relative symlink | `../.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook` | No. The link holds no content of its own |
| `README.md` | authored here | none | Yes, by hand. No check reads it |
| `SYNC.md` | authored here | none | Yes, by hand. No check reads this table |

### Agents

One `.toml` per `.skilled/agents/*.md`, `README.md` excepted, named by the source stem. A profile keeps `description` and carries the markdown body as `instructions`. A source with `mode: subagent` also gets `agent_type = "subagent"`, because Vibe refuses to spawn a profile without it. Ten sources declare `subagent`, and `orchestrate.md` declares `primary`, so its profile carries no `agent_type`. Vibe reserves the stem `main` for its built-in agent, so the generator refuses a source named `main.md`.

### Skills

`skills/<name>` is a relative symlink to the skill folder, named by that skill's frontmatter `name`. The link points at the folder, so the skill's own subfolders travel with it. A top-level `local-*` source is left out as operator-private, and so is a skill whose frontmatter name carries that prefix. An existing `local-*` link in the output is preserved and never pruned. A duplicate name fails the generator, because Vibe loads only the first claimant. A source with no name or description is skipped with a warning, and a description over 1024 characters warns, because Vibe rejects it.

### Prompts

One stub per canonical command `.md`, with the source path flattened into the name: `.skilled/commands/create/goal.md` becomes `create-goal.md`. Vibe has no command loader and no `$ARGUMENTS` substitution, so a dispatcher composes the stub into the task text and appends the user request below the stub's last line. `README.md` and `*.contract.md` are skipped, and the walk does not descend into `assets/`, `scripts/` or `fixtures/`. A collision after flattening fails the generator.

### Guards

`hooks.toml` declares 18 entries. Thirteen run a script in `plugins/repo-guards/`, and five run an adapter under `.skilled/hooks/<concern>/vibe/`. Most scripts import a runtime-neutral core from `.skilled/`, and `session-cleanup.mjs` loads the shared `.opencode/plugins/session-cleanup.js` at run time, so a rule changes in one place. `repo-guards/` carries no `plugin.json`, so Vibe does not load it as a plugin. The entries load only in a trusted checkout, like `config.toml`. A dispatch from a scratch folder gets them through its disposable `VIBE_HOME`: `plugins/repo-guards/render-home-hooks.cjs` writes `hooks.toml` there with `$(git rev-parse --show-toplevel)` replaced by the resolved checkout root, at dispatch time. No rendered copy is committed, so none can drift. The plugin README owns the entry map and each guard's behaviour.

---

## 3. WHAT THIS FOLDER NEVER HOLDS

Everything below lives outside this folder on purpose.

| Kept out | Where it lives | Why |
|---|---|---|
| API keys and `.env` files | the launch environment or a disposable `$VIBE_HOME/.env` | A key in the repository leaks to every dispatch |
| `VIBE_HOME` contents: user config, logs, history, the trust store | a fresh temporary home outside the checkout | An unset `VIBE_HOME` writes `~/.vibe`, and a home inside the checkout can be staged by accident |
| `.vibe/commands/` | nowhere | Vibe has no command loader, so a prompt stub carries the pointer |
| `skill_paths` | unset in `config.toml` | `.vibe/skills/` is then the only project skill source, so the precedence question cannot arise |

---

## 4. WHEN TO SYNC

- A `.skilled/skills/**/SKILL.md` is added, renamed or deleted, or its frontmatter `name` changes → run `sync-skills-vibe.cjs`. A write run prunes stale links.
- A `.skilled/commands/**` file is added, renamed or deleted → run `sync-prompts-vibe.cjs`.
- A `.skilled/agents/*.md` file is added, renamed, deleted or edited → run `sync-agents-vibe.cjs`.
- A generated link is missing or points at a moved folder → run `sync-skills-vibe.cjs`.
- A guard's rule changes → edit the core the [plugin README's](./plugins/README.md) entry map names, under `.skilled/` or `.opencode/plugins/`, and copy nothing. The adapter imports the core at run time.
- A hook entry changes or a new one is needed → edit `hooks.toml` by hand. No generator writes it.
- A model row or `allowed_models` entry changes → edit `config.toml` by hand. No generator checks it.

---

## 5. SYNC WORKFLOW

```bash
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs
```

A write run on a clean tree ends with one line per generator and exits 0:

```text
[vibe-agent-sync] Wrote 0 of 11 agent profiles; pruned 0.
[vibe-skill-sync] Wrote 0 of 55 links; pruned 0.
[vibe-prompt-sync] Wrote 0 of 46 prompts; pruned 0.
```

A write run rewrites only the tree it owns. It deletes any generated output entry with no source, except a preserved `local-*` skill link, and leaves `config.toml`, `hooks.toml`, `plugins/` and this file alone.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs --check
```

A check writes nothing. In sync each one ends with a `PASS` line and exits 0:

```text
[vibe-agent-sync] PASS: 11 agent profiles are in sync.
[vibe-skill-sync] PASS: 55 skill links are in sync.
[vibe-prompt-sync] PASS: 46 prompt stubs are in sync.
```

On drift it prints `Drift detected:` and one line per item, then a `FAIL` line, and exits 1. The `vibe-mirror` job in [the command-tree parity workflow](../.github/workflows/command-tree-parity.yml) runs the three checks on a pull request or a push to `main` or `skilled/**` that touches `.vibe/`, a command, an agent or a `SKILL.md`.

---

## 6. FORMAT CONTRACT

A Vibe agent profile is the one generated dialect. The generator writes TOML, not markdown, and the agent body becomes one escaped string.

```toml
# Generated by sync-agents-vibe.cjs from .skilled/agents/design.md; do not edit by hand.
description = "Design specialist: values and behavior from sk-code-frontend's visual references, Style Reference measurement, charts and diagrams. LEAF."
agent_type = "subagent"
instructions = "<the markdown body as one escaped TOML string>"
```

The header names the source file. `description` is copied, and `agent_type` is added when the source declares `mode: subagent`. The body becomes `instructions`, so a body change reaches the profile on the next run. Every other key is dropped, including the `name` and the `permission` map, so a change to a dropped key never arrives. A prompt stub points at its command file without copying it, so a command body change leaves the stub unchanged.

---

## 7. REQUIRED PARITY

- Every canonical agent in `.skilled/agents/` has a profile here. `agent-roster-mirror-check.cjs` prints an `OK` line for `vibe` with `11/11 present` for this runtime and checks the other runtimes in the same run.
- Every canonical command has a stub here unless the shared command-scope list marks it runtime-exclusive. The prompt check is authoritative.
- Every canonical skill has a link here named by its frontmatter `name`, except a source in an excluded directory and an operator `local-*` entry. The skill check is authoritative.

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Skill links match their sources | `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs --check` | 0 in sync, 1 on drift |
| Prompt stubs match their commands | `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs --check` | 0 in sync, 1 on drift |
| Agent profiles match their sources | `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check` | 0 in sync, 1 on drift |
| Every runtime carries the agent roster | `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 covered, 1 on drift, 2 on a checker error |
| Mirror, generator and roster checks for every runtime | `/doctor:runtime-mirrors`, from a Claude Code, OpenCode, Codex, Cursor or Pi session | read-only |

The three tree checks print a `PASS` line and exit 0 in sync. The roster check ends with `STATUS=OK`. None of the four writes.

---

## 9. KNOWN GAPS

- **The inventory has no test.** No suite reads this table, so a row can fall behind the folder. `.opencode/` has a layout suite for its own table and `.vibe/` has none.
- **The plugin map has no check.** `plugins/README.md` maps each OpenCode plugin to the Vibe entry that does its job. A new plugin or entry needs a row by hand, and nothing compares the map with the files it describes.
- **A hook command path can go stale.** `hooks.toml` names each script, and no CI job proves that every path still resolves. The loop in the plugin README's validation section reports one `MISSING` line per dead path, but nothing runs it for you.
- **The playbook link has no check.** `manual-testing-playbook` is not generator output, so a moved playbook leaves a dead link and no check reports it.
- **Two authored files have no generator.** `config.toml` and `hooks.toml` change by hand, so nothing proves either one matches what the runtime expects. Only a live session shows it.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a user of Vibe in this repository gets, and how to check the folder |
| [`plugins/README.md`](./plugins/README.md) | The hook map, the plugin map, the switch table and the error policy |
| [`config.toml`](./config.toml) | The provider and the model rows, with the model list closed by name |
| [`hooks.toml`](./hooks.toml) | The 18 hook entries this folder loads |
| [`manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The Vibe playbook and its scenario verdicts |
| [`../.skilled/hooks/README.md`](../.skilled/hooks/README.md) | The hook cores and the switch index |
| [`runtime-folder-and-sync.md`](../.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/runtime-folder-and-sync.md) | The folder contract, the trust gate, the VIBE_HOME rules and the skill precedence note |
| [`../.dsh/SYNC.md`](../.dsh/SYNC.md) | A sibling manifest that uses the same split |
| [`../AGENTS.md`](../AGENTS.md) | The shared instructions a session loads |

<!-- readme-check
allow-ref main.md | a source name the generator refuses, named here as what must not exist
allow-ref plugin.json | the manifest Vibe looks for in a plugin folder, which repo-guards/ deliberately lacks
allow-ref .vibe/commands/ | a folder Vibe never reads, named here as what this folder never holds
-->
