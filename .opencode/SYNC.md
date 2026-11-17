---
title: "OpenCode: Runtime Sync Manifest"
description: "How .opencode/ derives from .skilled: the surfaces that are links, the plugins and the goal command that are authored here, the install the plugins need and the checks that catch drift."
trigger_phrases:
  - "opencode sync manifest"
  - "opencode surface inventory"
  - "opencode link drift"
---

# OpenCode Sync Manifest

> `.skilled/` is the source of truth. This folder exposes it under the older `.opencode/` name, one relative link per entry, and adds the plugins only this runtime loads.

---

## 1. OVERVIEW

A session started at the repository root reads this folder for its project skills, agents, commands and plugins. The `skills` link is the skill discovery root, `agents` and `commands` hold the definitions OpenCode loads, and every `.js` file at the top of `plugins/` is a plugin it loads. `opencode.json` names no plugin path, so a plugin is registered by being a file in that folder. The same file registers the Code Mode server, whose command is `.skilled/bin/mcp-code-mode-launcher.cjs`, and it holds the model, agent, permission and MCP settings for the session.

Most of the folder is a link. `skills`, `agents`, `hooks`, `bin`, `scripts`, `repo-rules` and `manual-testing-playbook` each point at a directory under `.skilled/`. Inside `commands/`, every top-level entry of `.skilled/commands/` arrives as a link except the git-ignored `assets` folder. A private `local-*` entry is neither written nor pruned, so an operator checkout can carry one as a link, and `goal-opencode.md` is the only real file there. A link holds no content of its own, so the file behind it is the only copy and an edit through the link lands on the source.

The plugins are authored here. They are written against the OpenCode plugin SDK, which the `node_modules/` this folder installs makes resolvable beside them, and no other runtime can load a plugin written against that SDK. `commands/goal-opencode.md` drives the goal plugin, which only this runtime loads. `package.json` sets the module type the plugins need and pins the SDK version, and `package-lock.json` fixes the versions that `npm ci` installs.

---

## 2. SURFACE INVENTORY

One row for each entry in this folder, whether it is a link, a directory or a file. The layout suite reads this table, so a row that no longer matches the disk fails the run.

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `skills` | relative symlink | `../.skilled/skills` | No. The link holds no content of its own |
| `commands` | real directory | none | Yes. `sync-runtime-mirrors.cjs --check` reports a link that is absent or points at the wrong source, and one whose source is gone |
| `agents` | relative symlink | `../.skilled/agents` | No. Nothing to keep in step |
| `plugins` | authored here | none | No. Nothing generates it, and a new entry needs no registration |
| `node_modules` | real directory, installed | none | No. Git ignores it, and `npm ci` rebuilds it from the lockfile |
| `bin` | relative symlink | `../.skilled/bin` | No. The link holds no content of its own |
| `scripts` | relative symlink | `../.skilled/scripts` | No. Nothing to keep in step |
| `hooks` | relative symlink | `../.skilled/hooks` | No. The link holds no content of its own |
| `repo-rules` | relative symlink | `../.skilled/repo-rules` | No. Nothing to keep in step |
| `manual-testing-playbook` | relative symlink | `../.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` | No. The link holds no content of its own |
| `package.json` | authored | none | No. It sets the module type and the SDK version |
| `package-lock.json` | authored | none | No. It pins what `npm ci` installs |
| `.gitignore` | runtime-written | none | No. Written when the SDK is installed |
| `README.md` | authored | none | No |
| `SYNC.md` | authored | none | Yes, this table. The layout suite fails on a row that no longer matches the disk |

---

## 3. WHAT THIS FOLDER NEVER HOLDS

Everything below lives outside this folder on purpose.

| Kept out | Where it lives | Why |
|---|---|---|
| A second copy of a linked tree | `.skilled/` | The link is the only copy, so a duplicate here would fall behind the source |
| A copy of a hook core | `.skilled/hooks/` | Each plugin entry imports its core, so a rule changes once for every runtime |
| The shared instructions | `../AGENTS.md` | The root file is the only copy, so an edit there needs no mirror step |
| The runtime settings | `../opencode.json` | The model, agent, permission and MCP settings sit in one file at the root |

---

## 4. WHEN TO SYNC

- The set of top-level entries under `.skilled/commands/` changes → run `sync-runtime-mirrors.cjs`. A write run adds the link for a new entry and prunes the link a removed entry left behind. A private `local-*` entry is neither written nor pruned.
- A file inside a linked tree changes → nothing to run. The link resolves to the changed file.
- A plugin entry changes, or the core it calls changes → edit the plugin here for the transport and the core under `.skilled/hooks/` for the rule. No generator writes either one.
- `package.json` or `package-lock.json` changes → run `npm ci` in this folder so `node_modules/` matches the pinned versions.

---

## 5. SYNC WORKFLOW

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

A write run prints one line, `[runtime-mirror-sync] Linked <added>, removed <pruned>, of <total> expected mirrors.`, and exits 0. It repairs every mirror link it owns, so in this folder only the command links change. The plugins, the package files and the two documents stay as they are.

---

## 6. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Command links match the source tree | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 in sync, 1 on drift |
| Every entry resolves | `for e in .opencode/* .opencode/commands/*; do [ -e "$e" ] || echo "BROKEN $e"; done` | 0, and each dead link prints one `BROKEN` line |
| The inventory matches the disk | `node --test .skilled/bin/tests/opencode-compat-layout.test.cjs` | 0 pass, 1 fail |
| Every runtime at once | `/doctor:runtime-mirrors` | read-only |

The synchronizer prints one `PASS:` line with its mirror count and its tree count, or one drift line per problem. The loop prints nothing when every entry resolves. The suite prints one pass line per inventory row. None of them writes.

---

## 7. KNOWN GAPS

- **A raw URL under this folder returns the link text.** Git stores a link as its target path, and a git host does not resolve one, so a URL below `.opencode/` serves that path instead of the file. The folder [README](./README.md) records the same limit. No check reads a URL, so write `.skilled/` paths in anything that becomes a link.
- **A clone without symlink support loses the entries.** Each link becomes a small file holding its target path, so every path below it stops resolving. Nothing checks for that before the clone, and on such a filesystem you set `core.symlinks` first.
- **The inventory suite runs in no workflow.** No file under `.github/workflows/` invokes `opencode-compat-layout.test.cjs`, so a row that stops matching the disk is caught only when someone runs the suite by hand.
- **Prose carries no check.** The suite reads the inventory table and a few fixed paths. It does not read a sentence, so prose here or in the folder README that stops matching the code goes unnoticed.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What this runtime adds for you, and the commands that check the folder |
| [`plugins/README.md`](./plugins/README.md) | Each plugin entry, the core it calls and the switches that silence it |
| [`plugins/ARCHITECTURE.md`](./plugins/ARCHITECTURE.md) | The dual export, the bridge and its known limits |
| [`../.skilled/hooks/README.md`](../.skilled/hooks/README.md) | The hook cores and the coverage matrix |
| [`../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md) | The generator that writes the command links, and its check |
| [`../opencode.json`](../opencode.json) | The runtime settings and the Code Mode server |
| [`../AGENTS.md`](../AGENTS.md) | The shared instructions |
