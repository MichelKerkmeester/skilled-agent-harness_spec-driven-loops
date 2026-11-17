---
title: "DeepSeek Harness: Runtime Sync Manifest"
description: "How .dsh derives from .skilled: generated skill links, prompt stubs and persona patches, authored patches and guard bundle, then the checks that catch drift."
trigger_phrases:
  - "dsh sync manifest"
  - "dsh surface inventory"
  - "dsh patch drift"
---

# DeepSeek Harness Sync Manifest

> `.skilled/` is the source of truth. Three trees here are generated from it. One folder of adapter links is written by the mirror writer. The patches are hand-authored because each one is a diff against a base profile.

---

## 1. OVERVIEW

dsh reads one path in this folder on its own. It discovers a skill at `<projectRoot>/.dsh/skills/<name>/SKILL.md`, one level deep. It follows the link. Every other file reaches a run only when a dispatch names it. A patch arrives as a `--patch` argument. The layers apply in argv order, so a later layer wins per row. A prompt stub arrives when a dispatcher copies it into the task text. A persona patch arrives only when the dispatch passes it.

Three trees are generated. `skills/` holds one link per skill. `prompts/` holds one pointer stub per command. `agents/` holds one persona patch per agent. The adapter links under `plugins/repo-guards/adapters/` come from the mirror writer that serves every runtime. The rest is written here. No source tree declares a patch or a guard bundle, so both are authored.

---

## 2. SURFACE INVENTORY

One row for each surface this folder exposes.

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `patches/route-llmgateway-deepseek.patch.yml` | authored route patch | none | Yes. `--dump-config` names the provider and model it declares. A renamed base row leaves the patch a no-op with a stderr warning |
| `patches/route-opencode-go-deepseek.patch.yml` | authored route patch | none | Yes. The same check reads its provider and model |
| `patches/lineage.patch.yml` | authored lineage patch | none | Yes. `--dump-config` shows `mode: DISABLED` on telemetry and a disabled flag on each row it names |
| `patches/guards.patch.yml` | authored patch that inserts the guard rows | none | Yes. `--dump-config` with it shows the `repo-guards` row. With the lineage patch also named, it shows the marker row |
| `patches/mcp-code-mode.patch.yml` | authored, opt-in patch that mounts one stdio server | none | Yes. `--dump-config` with it shows the `mcp-code-mode` row |
| `plugins/repo-guards/` | authored bundle entry, marker plugin, adapter folder and tests | none | Yes. The bundle suite reads the two patches and checks the loader each adapter uses. Nothing compares the bundle source to a source tree |
| `plugins/repo-guards/adapters/` | one relative link per adapter, plus an authored `README.md` and two helper links | `.skilled/hooks/*/dsh/*.mjs` and the skill-owned `hooks/dsh/` files | Yes. `sync-runtime-mirrors.cjs --check` reports a link that is absent or points at the wrong source |
| `skills/<name>` | generated relative link, one per `SKILL.md`, named by its frontmatter `name` | `.skilled/skills/**/SKILL.md` | Yes. `sync-skills-dsh.cjs --check` reports a missing, stale or extra link |
| `prompts/*.md` | generated pointer stub | `.skilled/commands/**/*.md` | Yes. `sync-prompts-dsh.cjs --check` reports a missing, stale or extra stub |
| `agents/<name>.patch.yml` | generated persona patch, one `system-prompt` row | `.skilled/agents/*.md` | Yes. `sync-agents-dsh.cjs --check` reports a missing, stale or extra patch |
| `manual-testing-playbook` | relative link to a folder | `../.skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook` | No. The link holds no content of its own |
| `README.md` | authored | none | No. Nothing here generates it |
| `SYNC.md` | authored | none | No. Nothing here generates it |

The bundle registers one adapter per link and reads the lineage marker to keep its interactive-only adapters off. The [bundle README](./plugins/repo-guards/README.md) section 4 owns the entry map, with each event and its effect. Section 5 owns the failure policy. The two helper links are not entries.

---

## 3. WHAT THIS FOLDER NEVER HOLDS

| Kept out | Where it lives | Why |
|---|---|---|
| API keys and `.env` files | the launch environment or a disposable `$DSH_HOME/.env` | Headless reads keys from the environment, then `<cwd>/.env`, then `$DSH_HOME/.env`. A key in the checkout reaches every dispatch |
| Profiles, sessions and storages | `$DSH_HOME`, one fresh home per dispatch | dsh writes them as it runs. A home is process state |
| `node_modules` | the dsh installation | A bundle resolves its imports from the installation that runs `dsh` |

Start a dispatch outside the repository root. The root holds a `.env`. Headless reads it.

---

## 4. WHEN TO SYNC

- A skill is added, renamed or deleted → run `sync-skills-dsh.cjs`. A change to its frontmatter `name` also needs a run. A write run prunes a link whose source is gone and leaves a `local-*` entry alone.
- A command file is added, renamed or deleted → run `sync-prompts-dsh.cjs`.
- An agent file in `.skilled/agents/` changes → run `sync-agents-dsh.cjs`.
- A hook adapter is added, renamed or removed → run `sync-runtime-mirrors.cjs` for the link under `adapters/`.
- A provider, endpoint, key variable or roster entry changes → edit the matching patch by hand, then run the composition check in section 5.
- A dsh release changes a base row → rerun the composition check. A patch whose target row is gone is only a loader warning, so the whole patch can go quiet.

---

## 5. SYNC WORKFLOW

Run these from the repository root.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

Each tree generator ends with a `Wrote` line under its own tag. That line states the number it wrote and pruned. The command exits 0. The mirror writer ends with a `Linked` line that states the number it linked and removed. A clean tree writes nothing and prunes nothing.

Then check that the patches still compose. The run prints the composed config and makes no model call.

```bash
H=$(mktemp -d); DSH_HOME="$H" dsh --profile headless --patch .dsh/patches/route-llmgateway-deepseek.patch.yml --patch .dsh/patches/lineage.patch.yml --dump-config </dev/null
```

Keep the command on one line and name each patch file as written. The dispatch preflight reads the command text, so a continued line or a patch behind a shell variable is parsed as a dispatch and denied.

The run exits 0 with nothing on stderr. `agent-default-model` names the provider and model the route patch declares. `session-telemetry-otel` reads `mode: DISABLED`. Repeat it with `route-opencode-go-deepseek.patch.yml`, which names its own provider and model. Any stderr line about an unmatched patch target is a failure.

To compose with the guard bundle, add the guards patch after the lineage patch.

```bash
H=$(mktemp -d); DSH_HOME="$H" dsh --profile headless --patch .dsh/patches/route-llmgateway-deepseek.patch.yml --patch .dsh/patches/lineage.patch.yml --patch .dsh/patches/guards.patch.yml --dump-config </dev/null
```

The run exits 0 with nothing on stderr. The config carries a `repo-guards` row and a `repo-guards-lineage-leaf` row.

---

## 6. FORMAT CONTRACT

A persona patch is the one generated dialect. `sync-agents-dsh.cjs` strips the frontmatter from a shared agent file and writes one `system-prompt` row whose `personaPrefix` is the body as a YAML block scalar.

```yaml
# Generated by sync-agents-dsh.cjs from .skilled/agents/review.md
- id: system-prompt
  config:
    personaPrefix: |2
```

Every line of the agent body follows the indicator, indented by six spaces. The translation loses the frontmatter, so the patch never carries the agent's declared `name` or its `permission` map. The header names the source file. A body change reaches the patch on the next run. A frontmatter change never does.

---

## 7. REQUIRED PARITY

- Every agent in `.skilled/agents/` has `agents/<name>.patch.yml` here. The roster check covers every runtime and prints the `dsh` count it finds.
- Every `SKILL.md` under `.skilled/skills/` has a link in `skills/`, named by its frontmatter `name`. A directory the generator excludes and an operator `local-*` entry are the exceptions.
- Every `.mjs` file in a hook library `dsh/` folder has one link in `adapters/`. The mirror check is authoritative.

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Skill links match their sources | `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check` | 0 in sync, 1 on drift |
| Prompt stubs match their commands | `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check` | 0 in sync, 1 on drift |
| Persona patches match their agents | `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --check` | 0 in sync, 1 on drift |
| Adapter links match the hook library | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 in sync, 1 on drift |
| Every adapter behaves | `node --test .skilled/hooks/*/tests/dsh-*.test.mjs .skilled/skills/system-skill-advisor/hooks/tests/dsh-*.test.mjs .dsh/plugins/repo-guards/tests/` | 0 pass, 1 fail |
| Every runtime covers the agent roster | `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 covered, 1 on drift, 2 on a checker error |
| The patches still compose | the `--dump-config` runs in section 5 | 0 composed. Read stderr for an unmatched target |
| Mirror, generator and roster checks for every runtime | `/doctor:runtime-mirrors`, from a Claude Code, OpenCode, Codex, Cursor or Pi session | read-only |

Each `--check` command prints a `PASS` line and exits 0 when in sync. On drift the three tree generators print a `FAIL` line and all four commands exit 1. The mirror writer prints `[runtime-mirror-sync] Drift detected:` with one line per drift item instead. The test output reports `fail 0`. The roster check prints a final `STATUS=OK` line.

---

## 9. KNOWN GAPS

- **An authored patch has no check.** A wrong endpoint or key variable composes without an error. Only a keyed run proves the endpoint.
- **A failed plugin load leaves the run unguarded.** dsh prints `did not activate` and carries on. The deep-loop runner fails a lineage whose stderr holds that line. That check runs after the run has finished.
- **A manifest row can fall behind the folder.** No check reads this file, so a new file or a removed one needs a row edited by hand.
- **The mirror check proves the link, not the adapter.** The adapter tests cover behavior. An adapter with no test is found only by reading the folder.
- **The MCP row is opt-in.** A dispatch that names no MCP patch never loads the server, so a broken row shows up only in a run that names it.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a session here works on and the commands that check the folder |
| [`plugins/repo-guards/README.md`](./plugins/repo-guards/README.md) | The bundle, its entry map and its error policy |
| [`plugins/repo-guards/adapters/README.md`](./plugins/repo-guards/adapters/README.md) | One row per adapter link and the event it serves |
| [`../.skilled/hooks/README.md`](../.skilled/hooks/README.md) | The hook cores and the switch each concern reads |
| [`runtime-folder-and-sync.md`](../.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/runtime-folder-and-sync.md) | The folder layout and the three homes |
| [`../.claude/SYNC.md`](../.claude/SYNC.md) | A sibling runtime manifest |

<!-- readme-check
allow-ref hooks/dsh/ | the dsh folder inside each skill that owns a hook, a pattern rather than one path
-->
