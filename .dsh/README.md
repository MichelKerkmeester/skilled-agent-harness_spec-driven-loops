---
title: "dsh in Skilled"
description: "How DeepSeek's dsh agent CLI uses this repository: the route, lineage and guard patches, the repo-guards bundle, generated skill links, prompt stubs and persona patches, and how to check them."
trigger_phrases:
  - "dsh in skilled"
  - "dsh runtime folder"
  - "dsh route patch"
---

# dsh in Skilled

> Run DeepSeek's `dsh` agent CLI on one scoped task at a time, with a pinned model route, the shared guards and a disposable home for each run.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | One headless DeepSeek V4.1 Flash run: a read-only review, a scoped change or a second opinion |
| **Start with** | Compose the patches from section 3 in a scratch folder, never in the repository root |
| **Works on** | A `dsh` binary at the pinned version, with the route's key set in the environment |
| **Checked by** | The commands in section 5 |

### What You Get

`dsh` picks its own model unless a patch says otherwise, and its default route is DeepSeek's official API, which this repository never uses. This folder holds the patches that select a route, switch off what a headless run must not do and load the shared guards.

A dispatch composes the patches it names. It takes one route patch, the lineage patch and the guards patch, plus the MCP patch when the run needs Code Mode. An interactive session such as `dsh web` takes the guards patch without the lineage patch, so it also gets the skill advisor, the `/goal-dsh` tool and the session-start checks.

The package is experimental. The LLM Gateway route is verified, and the OpenCode Go route is configured but not verified.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How dsh gets it |
|---|---|
| Instructions | A persona patch in `agents/` carries an agent's full text as the system prompt |
| Skills | `skills/` holds one link per canonical skill, named by its frontmatter `name`. dsh finds them one level deep |
| Agents | `agents/<name>.patch.yml`, one persona patch per shared agent, passed to a run with `--patch` |
| Commands | `prompts/` holds pointer stubs. A dispatcher composes a stub into the task text and appends the request below its last line |
| Hooks and guards | The `repo-guards` bundle in `plugins/repo-guards/`. Its adapters are links into the shared hook code. The interactive-only adapters switch off in a fan-out run |
| MCP | `mcp-code-mode.patch.yml` mounts the `code_mode` server over stdio. The patch is opt-in |
| Goals | Interactive sessions get `/goal-dsh` and the `dsh_goal` tool. The lineage patch turns off the goal tools that need a human turn |
| Advisor | The `prompt-advisor` adapter runs in interactive sessions only |
| Dispatch | `cli-deepseek-harness` owns the dispatch contract, including the rules the preflight enforces before every run |

---

## 3. GETTING STARTED

Run from a scratch folder, never from the repository root. The root holds a `.env` file, and headless dsh would read it. The prompt travels on stdin, and the lone `-` at the end tells dsh to read it.

```bash
REPO="$(pwd -P)"
H=$(mktemp -d); W=$(mktemp -d)
cd "$W" && printf 'Reply with the single word OK' | DSH_HOME="$H" dsh --profile headless \
  --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" \
  --patch "$REPO/.dsh/patches/lineage.patch.yml" \
  --patch "$REPO/.dsh/patches/guards.patch.yml" \
  --json --permission-mode read-only --approval-policy never -
```

The last stdout line is a `final` event. Exit 0 with `final.reason.kind` set to `completed` means success. Without `LLMGATEWAY_API_KEY` the run exits 1, and the final event carries `MISSING_CREDENTIAL`. To use the OpenCode Go route, swap in `route-opencode-go-deepseek.patch.yml` and set `OPENCODE_API_KEY`.

The dispatch preflight refuses any run that breaks its hard rules. Those include exactly one route patch, the lineage and guards patches, `--json` and `--approval-policy never`.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `patches/*.patch.yml` | Authored | The two route patches, the lineage patch, the guards patch and the opt-in MCP patch |
| `plugins/repo-guards/` | Authored | The bundle entry, the leaf marker plugin, the tests and the `adapters/` folder |
| `plugins/repo-guards/adapters/` | Links | One per adapter in the hook library, plus two shared helpers |
| `skills/` | Generated links | One per canonical skill, written by `sync-skills-dsh.cjs` |
| `prompts/` | Generated stubs | Written by `sync-prompts-dsh.cjs` |
| `agents/` | Generated persona patches | Written by `sync-agents-dsh.cjs` |
| `README.md`, `SYNC.md` | Authored | The documentation |

Keys and `.env` files stay out of this folder. The launch environment or a disposable `$DSH_HOME/.env` holds them.

**The one rule:** edit the source in `.skilled/`, then rerun the matching generator. The route, lineage and guards patches are hand-authored. After you change a route's model, endpoint or key variable, edit its patch and run the composition check in section 5.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --check
node --test .dsh/plugins/repo-guards/tests/
```

Each generator prints a `PASS` line and exits 0. The bundle tests run the plugin's own checks. Then confirm that the patches still compose, from a disposable home and a scratch folder:

```bash
H=$(mktemp -d); W=$(mktemp -d); R="$PWD/.dsh/patches"
(cd "$W" && DSH_HOME="$H" dsh --profile headless \
  --patch "$R/route-llmgateway-deepseek.patch.yml" \
  --patch "$R/lineage.patch.yml" --dump-config </dev/null)
```

The composition check exits 0 with empty stderr. Its output names `llmgateway` and `deepseek-v4.1-flash-1017` on the default model row, and it shows telemetry as `DISABLED`. Any stderr line about an unmatched patch target is a failure. Repeat it with the OpenCode Go route patch to check that one too.

`/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **The OpenCode Go endpoint is unverified.** It stays unverified until a keyed run proves it.
- **Effort levels are unverified on the wire.** Whether either endpoint accepts `max` is not proven until a keyed run.
- **A guard that fails to load runs the lineage unguarded.** A plugin that fails to load prints `did not activate`, and the deep-loop runner fails a lineage whose stderr holds that line.
- **A renamed base row silently disables a patch.** A patch whose target row is missing becomes a loader warning and does nothing. The composition check catches it.
- **The MCP patch is never in a default run.** A caller adds it, and the deep-loop runner adds it only for a lineage that names `code_mode`.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory, generators and drift checks
- [`plugins/repo-guards/README.md`](./plugins/repo-guards/README.md): the bundle, its adapters and the error policy
- `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/README.md`: the dispatch mode and its rules
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
