---
title: "OpenCode Compatibility Root"
description: "Per-entry symlinks that expose the .skilled/ source tree under the .opencode/ name, so tools, consumer projects and machine configuration that address the old root keep resolving. The plugins and their package files are the only content authored here."
trigger_phrases:
  - "opencode compatibility root"
  - "old source root"
  - "opencode symlink directory"
---

# OpenCode Compatibility Root

---

## 1. OVERVIEW

The authored tree lives in [`.skilled/`](../.skilled). This directory exposes the
same tree under the older `.opencode/` name, one symlink per top-level entry, so
anything that addresses `.opencode/<path>` still reaches the real file.

The plugins are authored here, because only this runtime loads them. `package.json` and `package-lock.json` are tracked, since the plugins are ES modules that take their module type from the first and the SDK version from the second. `npm ci` here installs `node_modules`, which is not tracked. Editing a file through any other path in this directory edits
the file in `.skilled/`, because that is the same file.

---

## 2. WHAT IS HERE

Every entry in this table except `plugins/` is a symlink to its twin under `.skilled/`. The other real files are the two package files, this README, `SYNC.md` and the runtime-written `.gitignore`:

| Entry | Resolves to |
|---|---|
| `agents/`, `commands/`, `skills/`, `hooks/` | the runtime surfaces each CLI loads |
| `plugins/` | authored here, not a link: only this runtime loads them |
| `bin/`, `scripts/` | executable programs and shell entrypoints |
| `changelog/`, `manual-testing-playbook/` | documentation trees |
| `logs/`, `specs/` | runtime output and the spec alias |

---

## 3. WHY IT EXISTS

Three groups still address the old name, and all of them keep working through
these links:

- **Consumer projects** that link this repository into their own root and expose
  only `.opencode`.
- **Machine configuration** that stores an absolute or project-relative path,
  such as an MCP launcher argument resolved from whichever project runs it.
- **Continuous integration** that checks out an older commit, where the tree
  still lived under this name.

---

## 4. USING IT

Prefer `.skilled/` in anything you write. Both spellings resolve on a normal
checkout, but only `.skilled/` resolves on the web: a symlink is stored as a
link rather than a directory, so `raw.githubusercontent.com` and the GitHub file
browser return the link's target text for a path under `.opencode/`, never the
file. Repository links, documentation and new code should name `.skilled/`.

Cloning on a filesystem without symlink support, which includes Windows unless
symlinks are enabled, turns each entry here into a small text file holding its
target path, and paths below it stop resolving. Enable symlinks before cloning:

```bash
git config --global core.symlinks true
```

---

## 5. RELATED

- [`SYNC.md`](./SYNC.md) — the surface inventory and drift checks for this directory
- [`.skilled/`](../.skilled) — the authored source tree
- [`AGENTS.md`](../AGENTS.md) — the runtime instruction file
- [`README.md`](../README.md) — repository overview
