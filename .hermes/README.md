---
title: "Hermes Agent in Skilled"
description: "How Hermes Agent uses this repository: preloadable skills and agent personas, prompt templates, the opt-in repo-guards plugin, the operator steps Hermes keeps user-level and the checks that keep the copies in step."
trigger_phrases:
  - "hermes agent in skilled"
  - "hermes folder readme"
  - "hermes repo-guards plugin"
---

# Hermes Agent in Skilled

> Hermes Agent can preload Skilled skills and agent personas by name, and an opt-in plugin brings the shared guards into its sessions.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in Hermes Agent with the shared skills, personas and guards |
| **Start with** | Finish the operator steps in section 3, then run a prompt template or preload a skill with `-s` |
| **Works on** | Hermes sessions started from this checkout, after the trust grant |
| **Checked by** | The commands in section 5 |

### What You Get

Hermes reads exactly two things from a project folder: `skills/`, once the project is trusted, and `plugins/`, behind an opt-in variable. Its configuration, providers, MCP servers and trust grant all live in your `~/.hermes/`, so this folder never holds them.

Hermes scans every project skill folder with a security scanner at session start. A linked skill folder drags its scripts and references through that scan, which once took ten minutes and quarantined every hub. So `skills/` holds markdown-only copies, and each copy names its canonical folder for the files it does not carry.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Hermes gets it |
|---|---|
| Instructions | Nothing in this folder supplies instructions. Hermes keeps its own config in `~/.hermes/`, and the advisor brief reaches each prompt through the plugin |
| Skills | Every canonical `SKILL.md` as a markdown copy in `skills/`. Preload one with `-s <name>` |
| Agents | Hermes has no agent flag, so each shared agent is mirrored as `skills/agent-<name>/`. `-s agent-<name>` preloads the whole persona, and `HERMES_AGENT_PERSONA=<name>` makes the plugin bind it as the session persona |
| Commands | Prompt templates in `prompts/`. Run one with `hermes chat -Q --oneshot --query-file .hermes/prompts/<name>.md`, then append your request below the template's last line |
| Hooks and guards | The `repo-guards` plugin in `plugins/repo-guards/`. It runs the advisor and the spec-folder classifier before each model call, the dispatch lint, the MCP route guard and a read-only refusal before each tool call, and the post-edit and injection checks after each result. Every hook fails open |
| Advisor | Before each model call, the plugin appends the skill advisor brief |
| Goals | The plugin binds the packet named by `HERMES_SPEC_FOLDER` to the session when it starts |
| MCP | Code Mode is added once per machine with `hermes mcp add code_mode`. A session reaches it only when its `-t` list names `code_mode` |
| Dispatch | [`cli-hermes`](../.skilled/skills/cli-external-orchestration/cli-hermes/README.md) hands work to Hermes from another runtime. Without the plugin, it puts the persona into the prompt instead |

---

## 3. GETTING STARTED

Hermes keeps four settings at user level, so no repository file can set them. Set these once per machine.

1. **Provider.** Add a `providers:` block named `llmgateway` to `~/.hermes/config.yaml` with `key_env: LLMGATEWAY_API_KEY`. Put the key in `~/.hermes/.env`. Then `hermes config get providers.llmgateway.base_url` should print the URL.
2. **Trust.** Run `hermes skills trust` once from the repository root, so `skills/` loads.
3. **Plugin.** Set `HERMES_ENABLE_PROJECT_PLUGINS=1` for any session that should run the guards. List `repo-guards` under `plugins.enabled` in `~/.hermes/config.yaml`. `hermes plugins enable` refuses project keys, so add that line by hand.
4. **Code Mode.** Add the server once per machine with the command below, then enable the tools that the packet's MCP policy names. The enable prompt needs an answer on stdin.

```bash
printf 'Y\n' | hermes mcp add code_mode --command node --env UTCP_CONFIG_FILE=.utcp_config.json --args .skilled/bin/mcp-code-mode-launcher.cjs
```

Once those are set, a template runs like this: `hermes chat -Q --oneshot --query-file .hermes/prompts/create-agent.md`.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `skills/<name>/`, `skills/agent-<name>/` | Generated copies | Written by `sync-skills-hermes.cjs`. They are copies, not links, because Hermes scans linked folders in full |
| `prompts/*.md` | Generated | Written by `sync-prompts-hermes.cjs`. Each stub points at its canonical command file |
| `plugins/repo-guards/` | Authored | The Python plugin, its manifest and its tests |
| `agents` | Link | `../.skilled/agents`, the source that the skill generator reads |
| `repo-rules`, `manual-testing-playbook` | Links | The rule files and the `cli-hermes` playbook |
| `README.md`, `SYNC.md` | Authored | The documentation, including the plugin's hook map |

Hermes's own file tools refuse writes into a `.hermes` folder, so write these files from outside a Hermes session.

**The one rule:** never edit a copy in `skills/`. Change the `SKILL.md` or `ROUTER.md` in `.skilled/skills/`, then rerun `sync-skills-hermes.cjs`. Rerun it after every change to either file, because write mode also prunes stale folders.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check
hermes plugins validate .hermes/plugins/repo-guards
```

The first prints `PASS: 67 Hermes skill copies in sync`. The second prints a `PASS` line. The third ends with `Validation passed.` Each exits 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **A quarantined copy disappears.** Hermes's prose scanner can rate a copy's own text as dangerous. A quarantined copy is missing from `hermes skills list` and cannot be preloaded with `-s`.
- **Plugin text is capped.** A plugin prompt section holds at most 4,000 characters.
- **Sub-agents receive a goal and context.** They do not receive an agent file.
- **Nothing guards a session without the plugin.** Both plugin settings in section 3 must be on before the guards run.
- **Every hook fails open.** A fault in a guard core lets the work continue without that guard.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full inventory, the operator steps and the plugin's hook map
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores
- [`cli-hermes`](../.skilled/skills/cli-external-orchestration/cli-hermes/README.md): dispatching Hermes from another runtime
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
- [`README.md`](../README.md): the repository overview
