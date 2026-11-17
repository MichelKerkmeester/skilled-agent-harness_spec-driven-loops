---
title: "OpenCode in Skilled"
description: "How OpenCode uses this repository: the plugins it loads from plugins/, the skills, agents and commands it links from .skilled/, the Code Mode launcher and the link checks that keep the .opencode paths working."
trigger_phrases:
  - "opencode in skilled"
  - "opencode folder readme"
  - "opencode plugins"
---

# OpenCode in Skilled

> OpenCode reaches the shared skills and agents through links into `.skilled/`, and runs its own plugins against the shared hook cores.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in OpenCode with the shared skills and the authored plugins |
| **Start with** | `opencode` from the repository root, after one install inside `.opencode/` |
| **Works on** | Every session started at the repository root, on OpenCode 1 or OpenCode 2 |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

Most of this folder is a link into `.skilled/`. A skill or an agent changes once there and the change appears here, because a link holds no content of its own. The plugins are the part written here, because they import the OpenCode plugin SDK and no other runtime loads them.

Every plugin exports one object with a `server` entry and a `setup` entry. OpenCode 1 runs `server` and OpenCode 2 runs `setup`, which wraps the same factory. Most of the guards behind them live in `.skilled/hooks/`, so a rule changes in one place for every runtime. The shared instructions arrive through the root `AGENTS.md`.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How OpenCode gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), the instruction file every runtime reads from the repository root |
| Skills | The `skills` link puts the authored skills at `.opencode/skills`, the path OpenCode reads |
| Agents | The `agents` link exposes `.skilled/agents` in the authored format, so no translated copy is needed |
| Commands | `commands/` holds one link per top-level entry of `.skilled/commands/` that git does not ignore, plus `goal-opencode.md`, the goal command written here |
| Hooks and guards | The `.js` files at the top of `plugins/`. `opencode.json` names no plugin path, so a file in that folder is the registration. The [plugin index](./plugins/README.md) maps each entry to the core it calls |
| Goals | `opencode-goal.js` holds the goal state machine, and `/goal-opencode` drives its `opencode_goal` tools |
| MCP | The root `opencode.json` names `.skilled/bin/mcp-code-mode-launcher.cjs` as the Code Mode command, with `.utcp_config.json` as its UTCP config |

---

## 3. GETTING STARTED

1. Run `npm ci` in `.opencode/` once. It installs the plugin SDK into `node_modules/`, which git ignores.
2. Start `opencode` from the repository root. OpenCode reads the links and loads every `.js` file at the top of `plugins/`.
3. Use `/goal-opencode` for the session goal, and the shared commands as usual. OpenCode registers every `*.md` file under a `commands/` folder at any depth.
4. Run the checks in section 5 after you change a command or a link.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `skills`, `agents`, `hooks`, `bin`, `scripts`, `repo-rules` | Link | Each points at its own tree under `.skilled/` |
| `manual-testing-playbook` | Link | The `cli-opencode` playbook |
| `commands/` | Real folder of links | One link per top-level entry of `.skilled/commands/` that git does not ignore, written by `sync-runtime-mirrors.cjs`. A private `local-*` link is neither written nor pruned. `goal-opencode.md` is written here |
| `plugins/` | Authored | The plugin entries, with `lib/` and `tests/`. They sit here because they import the plugin SDK |
| `package.json`, `package-lock.json` | Authored | The module type and the pinned SDK install |
| `node_modules/` | Installed | Written by `npm ci` from the lockfile. Git ignores it |
| `.gitignore` | Written at install | The ignore list for this folder |
| `README.md`, `SYNC.md` | Authored | The documentation |

**The one rule:** Edit the source in `.skilled/`. A link has no content of its own, so the linked files cannot drift. The command links are the only generated set here, so rerun `sync-runtime-mirrors.cjs` after a command is added or removed. The plugins are authored here and have no source elsewhere. The [sync manifest](./SYNC.md) lists every surface with its source and its check.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
for e in .opencode/* .opencode/commands/*; do
  [ -e "$e" ] || echo "BROKEN $e"
done
node --test .skilled/bin/tests/opencode-compat-layout.test.cjs
```

The first command prints a `PASS` line with its mirror and tree counts, then exits 0. On drift it prints one line per problem and exits 1.

The loop prints nothing and exits 0 when every entry resolves. Each dead link adds one `BROKEN` line.

The suite prints a pass line per inventory row. It reports `ℹ fail 0` and exits 0. `/doctor:runtime-mirrors` runs every runtime's mirror check once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **A link does not resolve on a web host.** Git stores a link as its target path, so a URL below `.opencode/` serves that path instead of the file. Write `.skilled/` in anything that becomes a link.
- **A clone without symlink support loses the entries.** Each link becomes a small file holding its target path, and every path below it stops resolving. Set `core.symlinks` before the clone on such a host.
- **The git message gate has no off switch.** `sk-git-message-gate.js` refuses a commit message and a branch name that break the sk-git templates. It also refuses when the rulebook exists but cannot be read. `SYSTEM_HOOKS_DISABLED=1` silences most plugins and not this one.
- **The hand-over nudge ships off.** `session-handover.js` stays silent until `SYSTEM_SESSION_HANDOVER_OPENCODE_ENABLED=1`, or until the global `SYSTEM_SESSION_HANDOVER_ENABLED=1` while the OpenCode switch is unset.
- **A hard-rule dispatch is refused.** `cli-dispatch-audit.js` throws when a dispatch breaks a hard rule in the target skill's `SKILL.md`.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory and the drift checks
- [`plugins/README.md`](./plugins/README.md): each plugin entry and the core it calls
- [`plugins/ARCHITECTURE.md`](./plugins/ARCHITECTURE.md): the dual export and the bridge limits
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`cli-opencode`](../.skilled/skills/cli-external-orchestration/cli-opencode/README.md): dispatching OpenCode from another runtime
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
