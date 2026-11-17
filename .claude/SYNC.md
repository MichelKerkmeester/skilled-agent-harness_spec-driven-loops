---
title: "Claude Code: Runtime Sync Manifest"
description: "How .claude/ derives from .skilled: the trees it links, the agents it keeps in Claude's own dialect, the hook registrations rendered from one registry and the checks that catch drift."
trigger_phrases:
  - "claude code sync manifest"
  - "claude surface inventory"
  - "claude hook registration drift"
---

# Claude Code Sync Manifest

> `.skilled/` is the source of truth. Almost every entry here is a link onto it. The agents are a maintained fork in Claude's dialect, and the hook registrations come from one shared registry.

---

## 1. OVERVIEW

A session started at the checkout root loads `.claude/settings.json` for its hooks and permissions, and that file also sets the environment. The session finds commands under `commands/` and agents under `agents/`. It reaches the Code Mode server through the root `.mcp.json`, which points at `mcp.json` here. Instructions are the exception. Claude Code reads a file named `CLAUDE.md`. This checkout ships none, so the shared `AGENTS.md` reaches a session only when your own user file points at it.

Whole trees arrive as links. `skills` exposes the shared skill tree and `repo-rules` exposes the rules. The testing playbook is linked the same way. Each command file is one link. Each hook link points at the adapter that `settings.json` runs by its real path under `.skilled/`.

The agents are real files. Claude declares tools in a `tools:` line, and the shared agent files declare a `permission:` map instead, so no link can serve both. `check-agent-mirror-sync.cjs` holds each pair together at commit time.

---

## 2. SURFACE INVENTORY

One row for each surface this folder exposes, with the mechanism that keeps it in step.

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `skills` | relative symlink | `../.skilled/skills` | No. The link holds no content of its own |
| `repo-rules` | relative symlink | `../.skilled/repo-rules` | No. The link holds no content of its own |
| `manual-testing-playbook` | relative symlink | `../.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook` | No. The link holds no content of its own |
| `.utcp_config.json` | relative symlink | `../.utcp_config.json` | No. The link holds no content of its own |
| `commands/` | real directory of per-file links | `.skilled/commands/**/*.md` | Yes. `sync-runtime-mirrors.cjs --check` reports a link that is absent or points at the wrong source, and a file no source expects. A Git-ignored `local-*` link is still checked and written when its source exists in `.skilled/commands/`. Only the prune pass skips it |
| `hooks/` | per-file links | the `.skilled/` adapter paths in `settings.json` | Yes. The same check reports a link that is absent or points at the wrong source |
| `agents/*.md` | real files maintained here | `.skilled/agents/*.md` | Yes. `check-agent-mirror-sync.cjs --all` blocks a commit when a body differs |
| `agents/README.txt` | authored | none | Yes. No check reads it |
| `settings.json` | authored, except the `hooks` key | the `hooks` key is rendered from `hook-registry.json` | Yes. `sync-hook-registrations.cjs --check` reports a `hooks` key that differs from the registry |
| `settings.local.json` | operator-local | none | No. Git ignores it |
| `mcp.json` | authored here and canonical | none | No. The root `.mcp.json` links to it |
| `statusline-command.sh` | authored | none | No. No file here registers it |
| `README.md` | authored | none | No |
| `SYNC.md` | authored | none | No. No check reads it |

---

## 3. WHAT THIS FOLDER NEVER HOLDS

Everything below lives outside this folder on purpose.

| Kept out | Where it lives | Why |
|---|---|---|
| A `CLAUDE.md` | `../AGENTS.md` | Claude Code reads a file of that name at the root, and a second instruction source beside the shared one would drift from it |
| A second copy of a linked tree | `.skilled/` | The link is the only copy, so a duplicate here would fall behind the source |
| A hook core | `.skilled/hooks/` | Most links point at a thin adapter that calls the core. The `.skilled/bin/` scripts and `session-cleanup.sh` are whole programs, and a skill-owned hook keeps its code in the owning skill |

---

## 4. WHEN TO SYNC

- An agent changes in `.skilled/agents/` → carry the same change into `agents/` in the same commit. The pre-commit gate blocks a pair that differs.
- A new agent joins the roster → add the shared file and its Claude twin, register the agent in `.skilled/agents/agent-registry.json` and run `node .skilled/bin/sync-agent-roster.cjs`. Run `sync-runtime-mirrors.cjs` so Cursor and Devin link the new file, and add it to `agents/README.txt` here.
- A hook is added or rebound → edit `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, run `sync-hook-registrations.cjs` to render the `hooks` key, then run `sync-runtime-mirrors.cjs` for the matching link.
- A command is added or removed → run `sync-runtime-mirrors.cjs`. An edit inside a linked command needs no relink.
- A file inside a linked tree changes → nothing to run. The link resolves to the changed file.

---

## 5. SYNC WORKFLOW

```bash
node .skilled/bin/check-agent-mirror-sync.cjs --all
```

Ends with `agent-mirror-sync: 11 agent(s) checked — all comparable mirrors in sync — OK` and exits 0. The agent count follows the roster.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs
```

Prints `[hook-registration-sync] Wrote 0 of 4 registration files from the 36-hook registry; 22 Pi extensions resolve.` when every file already matches, and exits 0. It rewrites the `hooks` key of `settings.json` and leaves every other key alone.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

Prints `[runtime-mirror-sync] Linked 0, removed 0, of 260 expected mirrors.` when every link already matches, and exits 0. A write run also removes a link that no source expects.

---

## 6. FORMAT CONTRACT

A Claude agent file declares its `name` and `description` in frontmatter. It adds a `tools:` line, a comma-separated allowlist of the tools the agent may call.

```yaml
---
name: review
description: Code review specialist that applies the sk-code review mode's floor and lens, with a severity-based verdict and an advisory score, for PRs and code changes
tools: Read, Bash, Grep, Glob
---
```

OpenCode expresses the same intent as a `permission:` map. The translation loses detail in both directions, which is why this folder keeps a real file for each agent.

`settings.json` holds one list per event. Each group carries a `matcher` and a `hooks` list, and a non-tool event uses an empty matcher. Every command changes into the project root with `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}"'` and then runs the adapter by its `.skilled/` path.

The body of each shared agent file follows its twin, and `Explore.md` has none (section 7). The two differ where a path names its own tree. The gate compares token sets and the order of the load-bearing steps after it normalises those paths. A reworded sentence that reuses the same words passes, so wording can differ while the check stays green.

---

## 7. REQUIRED PARITY

- Every agent in `.skilled/agents/` has a file in `agents/`, and Cursor and Devin link each one of those files. The roster check is authoritative.
- Every shared command is reachable from `commands/` under its own path, so a session that types the command name finds it. The mirror check prints the count it sees.
- `Explore` is the one agent file with no twin, because Claude Code resolves a subagent by exact name and lets this file replace its built-in. The roster check and the mirror generator both skip it.

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Agent fork matches the shared body | `node .skilled/bin/check-agent-mirror-sync.cjs --all` | 0 in sync, 1 on drift, 2 on a bad option, 3 when the built parser is missing |
| Hook registrations match the registry | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | 0 in sync, 1 on drift, 2 on a registry it cannot render |
| Links match their sources | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 in sync, 1 on drift |
| Every runtime covers the roster | `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 covered, 1 on drift, 2 on a checker error |
| Every runtime at once | `/doctor:runtime-mirrors` | read-only |

Each check ends with a verdict line. The agent check ends with an `OK` line and the mirror check prints a `PASS` line with its mirror and tree counts. The registration check prints a `PASS` line with the registry count, and the roster check ends with `STATUS=OK`.

---

## 9. KNOWN GAPS

- **The agent fork is compared as token sets.** A reworded sentence that reuses the same words passes, so the agent file and its twin can differ in wording while the check stays green.
- **`agents/README.txt` has no check.** A new agent file can sit in `agents/` and never appear in the roster beside it.
- **A hand edit to the `hooks` key does not last.** The next write run renders that key from the registry and the edit is gone. Change `hook-registry.json` instead.
- **The links prove discovery, not behavior.** They show that each path resolves from this folder. They cannot show how a given release uses it.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a session here gets, and the commands that check the folder |
| [`hooks/README.md`](./hooks/README.md) | One row per hook link, with the real path `settings.json` runs |
| [`agents/README.txt`](./agents/README.txt) | The agent roster and the dialect contract |
| [`../.skilled/hooks/README.md`](../.skilled/hooks/README.md) | The hook cores and the coverage matrix, with the switch each concern reads |
| [`runtime-mirrors/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md) | The generators that write the links and the registry renderer |
| [`../.opencode/SYNC.md`](../.opencode/SYNC.md) | A sibling runtime manifest |
| [`../AGENTS.md`](../AGENTS.md) | The shared instructions |

<!-- readme-check
allow-ref CLAUDE.md | the instruction file Claude Code reads, which this repository deliberately does not ship
-->
