---
title: "OpenCode — Runtime Sync Manifest"
description: "How .opencode derives from .skilled: a real directory of relative per-entry symlinks, why it is a directory rather than one link, which entries exist and why, and the two limits the arrangement cannot remove."
---

# OpenCode Sync Manifest

> `.skilled/` is the source of truth. `.opencode/` is a real directory holding one relative symlink per entry it needs, so every path under the older name still resolves while the directory itself stays visible to anything that reads the repository rather than a checkout.

---

## 1. OVERVIEW

OpenCode reads this directory for its skills, commands, agents and plugins, and `opencode.json` names `.skilled/bin/mcp-code-mode-launcher.cjs` as its MCP launcher. Two kinds of content are real here. The plugins are authored here, because they import the OpenCode plugin SDK and resolve it from the `node_modules` beside them. `.skilled/plugins` links back to them. `package.json` and `package-lock.json` are tracked: the plugins are ES modules and take their module type from `package.json`, OpenCode merges its dependency entry into that file rather than replacing it, and the lockfile pins the SDK that `npm ci` installs here. `node_modules` and `.gitignore` are written at install time and are not tracked. Every other entry is a relative symlink onto `.skilled/`, so editing a file through one of those paths edits the file in `.skilled/`, because it is the same file.

**This directory is real, and that is deliberate.** The whole tree was once reachable through a single `.opencode -> .skilled` link. Git stores a symlink as a file whose content is the target path, and no git host resolves one server-side, so under that arrangement the directory could not be opened on the web and every URL beneath it returned the target string instead of the file. One link per entry keeps the directory itself a directory.

Drift is not possible for the linked entries: a symlink has no content of its own. The real files are `README.md`, this file, the two package files and the plugins, and none of them is generated.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Why it is here |
|---|---|---|---|
| `skills` | relative symlink | `../.skilled/skills` | OpenCode's skill discovery root |
| `commands` | relative symlink | `../.skilled/commands` | Slash commands, read in the authored dialect |
| `agents` | relative symlink | `../.skilled/agents` | Agent definitions, read in the authored dialect |
| `plugins` | **authored here** | — | The plugin entrypoints themselves. They import the OpenCode plugin SDK, so no other runtime can load them, and living here binds them to the SDK this directory installs rather than the one the source tree pins. `.skilled/plugins` is a relative link back to this directory |
| `node_modules` | real directory, untracked | `npm ci` in this directory, from `package-lock.json` | The plugin SDK the plugins import, resolved from beside them |
| `bin` | relative symlink | `../.skilled/bin` | Git hooks, scripts, skill metadata and docs still name programs through this path; it stays until they name `.skilled/bin` |
| `scripts` | relative symlink | `../.skilled/scripts` | Hook installers and shell entrypoints addressed by this name |
| `hooks` | relative symlink | `../.skilled/hooks` | Hook implementations shared across runtimes |
| `specs` | relative symlink | `../.skilled/specs` | The spec alias other runtimes also resolve through this name |
| `changelog` | relative symlink | `../.skilled/changelog` | Addressed by this name from documentation |
| `manual-testing-playbook` | relative symlink | `../.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` | This runtime's own playbook, named the way every other runtime names its own |
| `package.json`, `package-lock.json` | tracked | hand-maintained, merged by OpenCode | Declare the module type the ES-module plugins need, and pin the SDK they are written against |
| `.gitignore` | runtime-written, untracked | OpenCode | Written when OpenCode installs the SDK |
| `README.md` | real file | hand-maintained | Orientation for anyone who opens the directory expecting the tree |
| `SYNC.md` | real file | hand-maintained | This manifest |

---

## 3. LIMITS THIS ARRANGEMENT KEEPS

Two remain, and no arrangement short of a second full copy of the tree removes either.

**A URL below this directory does not resolve.** Each entry is a symlink, so a raw request for a path under this name returns the link's target text rather than the file. The directory listing works; the files below it do not. Write `.skilled/` in anything that becomes a link.

**A checkout without symlink support loses the entries.** Each becomes a small text file holding its target path, and paths below it stop resolving. On such a filesystem, Windows included unless symlinks are enabled, run `git config --global core.symlinks true` before cloning.

---

## 4. DRIFT DETECTION

```bash
# every entry resolves
for e in .opencode/*; do [ -e "$e" ] || echo "BROKEN $e"; done

# every linked entry points inside the source tree, relatively
for e in .opencode/*; do [ -L "$e" ] && case "$(readlink "$e")" in ../.skilled/*) ;; *) echo "OFF-TREE $e";; esac; done

# the runtime loads through this name
opencode run --command speckit/search "probe"
```

---

## 5. RELATED

- [`README.md`](./README.md) — what this directory is, for someone browsing the repository
- [`../.skilled`](../.skilled) — the authored source tree
- [`../opencode.json`](../opencode.json) — the runtime's own configuration
