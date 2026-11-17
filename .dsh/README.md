---
title: "dsh in Skilled"
description: "How the dsh runtime uses this repository: its patch layers, the repo-guards bundle, the generated skill links and persona patches, and the checks that confirm them."
trigger_phrases:
  - "dsh in skilled"
  - "dsh runtime folder"
  - "dsh route patch"
---

# dsh in Skilled

> One scoped task per run in DeepSeek Harness, with a pinned route and the shared guards, in a disposable home.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | One scoped task in a guarded dsh run, such as a review or a scoped build |
| **Start with** | `dsh web --patch .dsh/patches/guards.patch.yml` from the repository root |
| **Works on** | Sessions you start with `--patch`. dsh reads `.dsh/skills/` on its own and nothing else here |
| **Checked by** | The check commands in section 5 |

### What You Get

dsh builds every run from layers of patches. This folder holds the `--patch` layers the repository owns, so each run is composed instead of being fixed in a profile. The layers select the model route and switch off what a leaf must not run, and the guards arrive through the bundle in the same way. No adapter copies its guard core. Each adapter in `plugins/repo-guards/adapters/` is a link into `.skilled/`, beside one authored `README.md`, so a fix to a core reaches this runtime on the next run.

The base profile points at the official DeepSeek API, which this repository never dispatches. A run that names no route patch falls through to that default. One route patch per route replaces the default model row, so the file you pass decides the route.

dsh is a release candidate here. A new release can rename a row that a patch targets, and the patch then does nothing. Treat these files as pinned to one release and rerun the composition check after any change.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How dsh gets it |
|---|---|
| Instructions | dsh reads `$DSH_HOME/AGENTS.md`, then every `AGENTS.md` and `CLAUDE.md` from the git root down to the working directory, including the `.local.md` overlays, inside a byte budget. A dispatch that starts outside the checkout may never reach the root file, so state the rules a child needs in the prompt. |
| Skills | `skills/` holds one generated relative link per skill, named by its frontmatter `name`. dsh looks for `<projectRoot>/.dsh/skills/<name>/SKILL.md` one level deep and follows the link, so a linked skill keeps its references, assets and scripts. |
| Agents | `agents/<name>.patch.yml` is a generated persona patch. dsh has no agent-file loader, so a persona reaches a run as `--patch` and replaces the `system-prompt` row's `personaPrefix`. |
| Commands | `prompts/` holds generated pointer stubs. dsh has no command loader, so a dispatcher composes a stub into the task text and appends your request below its last line. |
| Hooks and guards | The `guards.patch.yml` row inserts the `repo-guards` bundle, which registers the shared adapters. The lineage patch inserts a marker row, and the interactive-only adapters step aside when they see it. |
| Dispatch rules | A headless dispatch is checked against `hard-rules.json` before it spawns. The shared preflight denies a command that breaks a rule, and the same cores run inside a dsh run through the bundle. |
| MCP | `mcp-code-mode.patch.yml` mounts one `code_mode` server over stdio. MCP is opt-in, so a run sees it only when it names that patch. |
| Goals | An interactive session gets `/goal-dsh` and the `dsh_goal` tool. The lineage patch switches off the native goal rows, so a leaf reads a packet's chat slice through the goal context adapter instead. |

---

## 3. GETTING STARTED

Run the commands from the repository root unless a step says otherwise.

1. Confirm the binary. A missing path or a release other than the pinned one stops a dispatch before a command is built.

   ```bash
   H=$(mktemp -d)
   command -v dsh
   DSH_HOME="$H" dsh --version </dev/null
   ```

   The last two lines print the absolute path to the binary and the release. `DSH_HOME` points at a throwaway directory because a profile-scoped command writes profile files into whichever home it resolves.

2. Start an interactive session with the guards loaded:

   ```bash
   dsh web --patch .dsh/patches/guards.patch.yml
   ```

   The composed profile carries the `repo-guards` row. Leave the lineage patch off here. It exists for a fan-out leaf, and it turns off the goal tool and the session-start advisories that an interactive session uses.

3. Start a headless run from a scratch directory with a home of its own. Name a route patch, then add the lineage patch with the guards patch. The prompt travels on stdin. The dispatch packet in section 7 carries the command shape and the prompt templates.

4. Run the checks in section 5 after you change a source file or a patch.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `patches/` | Authored | The route patches, the lineage patch, the guards patch and the opt-in MCP patch. Each one replaces or inserts rows, so it reads as a diff against the base profile. |
| `plugins/repo-guards/` | Authored | The bundle entry, the leaf marker plugin, the adapters folder and the bundle tests |
| `plugins/repo-guards/adapters/` | Links | One relative link per adapter, plus two helpers that `index.mjs` does not register |
| `skills/` | Generated links | Written by `sync-skills-dsh.cjs`, one link per skill |
| `prompts/` | Generated stubs | Written by `sync-prompts-dsh.cjs`, one stub per command |
| `agents/` | Generated persona patches | Written by `sync-agents-dsh.cjs`, one patch per agent |
| `manual-testing-playbook` | Link | Points at the playbook the dispatch packet keeps in its own folder |
| `README.md`, `SYNC.md` | Authored | The two documents |

**The one rule:** never edit a generated path by hand. Change the source under `.skilled/`, then rerun the matching generator. The [sync manifest](./SYNC.md) lists every surface with its source and the check that catches drift.

Keys and `.env` files stay out of this folder. The launch environment holds them, or a disposable `$DSH_HOME/.env` does.

---

## 5. CHECKING IT IS HEALTHY

Run these from the repository root.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --check
```

Each command ends with a `PASS` line that starts with its own tag, such as `[dsh-skill-sync] PASS`, and exits 0. A drifted tree exits 1.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

Two lines print. The second carries `[runtime-mirror-sync] PASS`, and the command exits 0. This check reads every `dsh/` folder in the hook library, so a new adapter with no link in `adapters/` fails it.

```bash
node --test .skilled/hooks/*/tests/dsh-*.test.mjs .skilled/skills/system-skill-advisor/hooks/tests/dsh-*.test.mjs .dsh/plugins/repo-guards/tests/
```

The summary reports `fail 0` and the command exits 0. These suites run each adapter against a fixture plugin context, so they cover the translation and not a live model call.

```bash
H=$(mktemp -d); DSH_HOME="$H" dsh --profile headless --patch .dsh/patches/route-llmgateway-deepseek.patch.yml --patch .dsh/patches/lineage.patch.yml --patch .dsh/patches/guards.patch.yml --dump-config </dev/null
```

Exit 0 with nothing on stderr. `agent-default-model` reads `provider: llmgateway` and `model: deepseek-v4.1-flash-1017`, and `session-telemetry-otel` reads `mode: DISABLED`. Repeat it with `route-opencode-go-deepseek.patch.yml`, which names `opencode-go` and `deepseek-v4.1-flash`. Any stderr line about an unmatched patch target is a failure.

This run prints the composed config and makes no model call. Keep the command on one line, and name the route patch as written. The dispatch preflight reads the command text, so a route patch behind a shell variable is denied with `route-patch-required`.

`/doctor:runtime-mirrors` runs the same mirror comparison across every runtime folder, from a Claude Code, OpenCode, Codex, Cursor or Pi session, because dsh has no command loader.

---

## 6. LIMITS AND KNOWN GAPS

- **The OpenCode Go route is proven but not the default.** A keyed run has answered on that endpoint, as the [DeepSeek Harness provider reference](../.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md) records. The comment in the patch file that calls it unverified is older than that run. The composition check in section 5 shows only that the patch applies.
- **The top reasoning effort is proven only for LLM Gateway.** Each route patch declares `off`, `high` and `max`. The Gateway run at `max` completed with no `UNSUPPORTED_REASONING_EFFORT` error. Whether OpenCode Go accepts `max` on the wire is still unknown.
- **A plugin that fails to load runs the rest unguarded.** The runtime prints `did not activate` and carries on. The deep-loop runner fails a lineage whose stderr holds that line, and a keyless boot of the guards patch is the cheap check.
- **A renamed base row silently disables a patch.** A patch whose target row is missing becomes a loader warning. The composition check in section 5 catches it, so rerun that check after a dsh release change.
- **The MCP patch is never in a default run.** A caller adds it, and the deep-loop runner adds it only for a lineage that names `code_mode`.
- **A write outside the cwd is only partly confined.** A saved probe denied a write under `$HOME` but allowed a sibling path under the OS temp directory, so two disposable homes under that directory are not a boundary between lineages.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory and every drift check
- [`plugins/repo-guards/README.md`](./plugins/repo-guards/README.md): the bundle and its adapter links
- [`manual-testing-playbook`](./manual-testing-playbook/manual-testing-playbook.md): the live probes and their evidence rules
- [the dispatch packet](../.skilled/skills/cli-external-orchestration/cli-deepseek-harness/README.md): the command shape and the rules the preflight enforces
- [the hook library](../.skilled/hooks/README.md): the guard cores and their switches
- [`AGENTS.md`](../AGENTS.md): the shared instruction file

<!-- readme-check
allow-ref CLAUDE.md | an instruction file name dsh looks for, which this repository does not ship
allow-ref .local.md | the overlay file suffix dsh reads, not a file
-->
