---
title: "OpenCode — Runtime Sync Manifest"
description: "How .opencode derives from .skilled: a real directory of relative per-entry symlinks, why it is a directory rather than one link, which entries exist and why, and the two limits the arrangement cannot remove."
---

# OpenCode Sync Manifest

> `.skilled/` is the source of truth. `.opencode/` is a real directory holding one relative symlink per entry it needs, so every path under the older name still resolves while the directory itself stays visible to anything that reads the repository rather than a checkout.

---

## 1. OVERVIEW

OpenCode reads this directory for its skills, commands, agents and plugins, and `opencode.json` names `.opencode/bin/mcp-code-mode-launcher.cjs` as its MCP launcher. It carries no build or package files of ours. OpenCode writes its own `package.json`, `package-lock.json` and `node_modules` here to install the plugin SDK at whatever version the installed CLI expects, and writes a `.gitignore` alongside them saying so, so all four are runtime state rather than source. Anything installing or testing names the source tree directly, as the other runtime directories do. None of that content is authored here. Every entry is a relative symlink onto `.skilled/`, so editing a file through a path in this directory edits the file in `.skilled/`, because it is the same file.

**This directory is real, and that is deliberate.** The whole tree was once reachable through a single `.opencode -> .skilled` link. Git stores a symlink as a file whose content is the target path, and no git host resolves one server-side, so under that arrangement the directory could not be opened on the web and every URL beneath it returned the target string instead of the file. One link per entry keeps the directory itself a directory.

Drift is not possible for the linked entries: a symlink has no content of its own. Only `README.md` and this file are real, and neither is generated.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Why it is here |
|---|---|---|---|
| `skills` | relative symlink | `../.skilled/skills` | OpenCode's skill discovery root |
| `commands` | relative symlink | `../.skilled/commands` | Slash commands, read in the authored dialect |
| `agents` | relative symlink | `../.skilled/agents` | Agent definitions, read in the authored dialect |
| `plugins` | relative symlink | `../.skilled/plugins` | Plugin entrypoints OpenCode loads by glob |
| `node_modules` | relative symlink | `../.skilled/node_modules` | A plugin loaded through this root resolves its imports from wherever the path lands, so the name has to exist here too |
| `bin` | relative symlink | `../.skilled/bin` | Named directly by the MCP launcher entry in `opencode.json` |
| `scripts` | relative symlink | `../.skilled/scripts` | Hook installers and shell entrypoints addressed by this name |
| `hooks` | relative symlink | `../.skilled/hooks` | Hook implementations shared across runtimes |
| `specs` | relative symlink | `../.skilled/specs` | The spec alias other runtimes also resolve through this name |
| `changelog` | relative symlink | `../.skilled/changelog` | Addressed by this name from documentation |
| `logs` | relative symlink | `../.skilled/logs` | Runtime output directory |
| `manual-testing-playbook` | relative symlink | `../.skilled/manual-testing-playbook` | Playbook tree addressed by this name |
| `package.json`, `package-lock.json`, `node_modules`, `.gitignore` | runtime-written, untracked | OpenCode | The CLI installs its own plugin SDK here and ignores what it writes |
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
