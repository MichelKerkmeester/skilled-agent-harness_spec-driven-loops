---
title: "OpenCode Compatibility Root"
description: "Per-entry symlinks that expose the .skilled/ source tree under the .opencode/ name, so tools, consumer projects and machine configuration that address the old root keep resolving. Every entry here is a link; nothing is authored in this directory."
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

Nothing is authored here. Editing a file through a path in this directory edits
the file in `.skilled/`, because that is the same file.

## 2. WHAT IS HERE

Each entry is a symlink to its twin under `.skilled/`:

| Entry | Resolves to |
|---|---|
| `agents/`, `commands/`, `skills/`, `plugins/`, `hooks/` | the runtime surfaces each CLI loads |
| `bin/`, `scripts/` | executable programs and shell entrypoints |
| `changelog/`, `install-guides/`, `manual-testing-playbook/` | documentation trees |
| `logs/`, `specs/` | runtime output and the spec alias |
| `package.json`, `package-lock.json`, `bun.lock`, `vitest.config.bin.ts` | package and test configuration |

## 3. WHY IT EXISTS

Three groups still address the old name, and all of them keep working through
these links:

- **Consumer projects** that link this repository into their own root and expose
  only `.opencode`.
- **Machine configuration** that stores an absolute or project-relative path,
  such as an MCP launcher argument resolved from whichever project runs it.
- **Continuous integration** that checks out an older commit, where the tree
  still lived under this name.

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

## 5. RELATED

- [`.skilled/`](../.skilled) — the authored source tree
- [`AGENTS.md`](../AGENTS.md) — the runtime instruction file
- [`README.md`](../README.md) — repository overview
