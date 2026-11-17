---
title: "Cursor CLI: Runtime Sync Manifest"
description: "How .cursor derives from .skilled and .claude: its linked trees, the generated hooks.json, the authored files and the checks that catch drift."
trigger_phrases:
  - "cursor sync manifest"
  - "cursor surface inventory"
  - "cursor hook registration drift"
---

# Cursor CLI Sync Manifest

> `.skilled/` and `.claude/agents/` hold the content. This folder points at it. A generator writes `hooks.json` whole.

---

## 1. OVERVIEW

Cursor reads this folder by file convention. A session takes its hooks from `hooks.json`, its agents from `agents/`, its commands from `commands/` and its rule files from `rules/`. It takes MCP servers from `mcp.json`. A link resolves to its source at read time, so an edit to the source is the edit the session sees.

Most entries are links. `agents/*.md` points at `.claude/agents/<name>.md`, and `commands/*.md` points at `.skilled/commands/**/*.md` under a flat name. Every link under `hooks/` names an adapter that `hooks.json` also calls under `.skilled/`. The generated file is `hooks.json`, which `sync-hook-registrations.cjs` renders from the shared registry. `rules/skill-routing.md`, `mcp.json`, `cli.json`, `README.md` and `SYNC.md` are written here.

The authored files carry decisions that no generator derives. The routing rule names the packets a session should open. `mcp.json` registers the Code Mode server. `cli.json` denies read and write on the dotenv files.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `agents/*.md` | relative symlink | `.claude/agents/<name>.md` | Yes. `sync-runtime-mirrors.cjs --check` reports a missing link or one that points elsewhere. |
| `commands/*.md` | relative symlink, flat name | `.skilled/commands/**/*.md` | Yes. The same check covers each link. `goal-cursor.md` is authored and outside it. |
| `hooks/*` | relative symlink, one per adapter | the `.skilled/` paths in `hooks.json` | Yes. The same check reports a missing link, a link that points elsewhere or a stray entry. |
| `hooks/README.md` | authored | none | No. It is the link index, and the prune pass leaves it alone |
| `hooks.json` | generated | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Yes. `sync-hook-registrations.cjs --check` catches a hand edit. |
| `rules/skill-routing.md` | authored, with two generated pointer blocks | the root `AGENTS.md` lines, through `sync-gate1-pointers.cjs` | Partly. `sync-gate1-pointers.cjs --check` covers the blocks. The packet list has no check. |
| `mcp.json` | authored copy | `.claude/mcp.json` | Yes. No check compares this copy with `.claude/mcp.json`. |
| `cli.json` | authored | none | Yes. No check reads it. Cursor applies it as its deny list. |
| `repo-rules` | relative symlink | `../.skilled/repo-rules` | No. The link holds no content. |
| `manual-testing-playbook` | relative symlink | `../.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook` | No. The link holds no content. |
| `README.md` | authored | none | No source to drift from. No check reads it. |
| `SYNC.md` | authored | none | No source to drift from. No check reads it. |

---

## 3. WHAT THIS FOLDER NEVER HOLDS

| Kept out | Where it lives | Why |
|---|---|---|
| A copy of the shared instructions | `../AGENTS.md` | Cursor reads the root file on its own, so a copy here would age against it. |
| A skills tree | `.skilled/skills/` | `rules/skill-routing.md` points at those packets. A second copy would need its own edits. |
| A hook core | `.skilled/hooks/` | `hooks.json` names the adapter. The adapter calls the core. A core here would serve one runtime. |
| Dotenv values | the operator's own `.env` files | `cli.json` denies read and write on those paths. |

---

## 4. WHEN TO SYNC

- An agent is added or removed in `.claude/agents/` → run `sync-runtime-mirrors.cjs`.
- A command is added, renamed or removed in `.skilled/commands/` → run the same generator.
- A hook is added or rebound → edit `hook-registry.json` and run `sync-hook-registrations.cjs`. Then run `sync-runtime-mirrors.cjs` for its link.
- A Gate 1 or Gate 2 line changes in the root `AGENTS.md` → run `sync-gate1-pointers.cjs`.
- A packet joins or leaves the routing rule → edit `rules/skill-routing.md` by hand. No generator writes that list.
- A file inside a linked tree changes → nothing to run. The link resolves to the new content.

---

## 5. SYNC WORKFLOW

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs
```

With every file already in step, the first prints `[hook-registration-sync] Wrote 0 of 4 registration files from the 36-hook registry; 22 Pi extensions resolve.` and exits 0. The second prints `[runtime-mirror-sync] Linked 0, removed 0, of 260 expected mirrors.` and exits 0. The third prints `[gate1-pointer-sync] Wrote 0 of 1 pointer blocks.` and exits 0.

The mirror generator does more than fill a gap. In check mode it reports a real file where a link belongs as drift rather than accepting it. A write run replaces that file with a link and removes a link that no source expects.

---

## 6. FORMAT CONTRACT

`sync-hook-registrations.cjs` writes `hooks.json` in Cursor's own shape. Event names are camelCase. Each event holds a flat list. `matcher` is a key on the entry rather than a wrapper around it. The file opens with `"version": 1`. An entry runs the adapter with `timeout: 10` and no `cd` wrapper. Most entries add a fallback message for an adapter that is missing.

```json
"preToolUse": [
  {
    "command": "node .skilled/hooks/overlay-guard/cursor/overlay-guard.mjs",
    "type": "command",
    "matcher": "Write",
    "timeout": 10
  }
]
```

`beforeMCPExecution` appears in this file and in no other rendered registration file. The registry holds the concern behind each hook and the event name each runtime uses. The rendered file keeps the event name and the command but drops the concern, so a reader sees Cursor's event and a command but nothing about the core it reaches. A hand edit cannot survive the next render for that reason.

---

## 7. REQUIRED PARITY

- Every shared agent has a link in `agents/`, so Cursor sees the same roster as the other runtimes. The roster check is authoritative and prints `OK   cursor    11/11 symlinked`.
- Every shared command has a flat link in `commands/`. `goal-cursor.md` is the one authored command. `command-scope.cjs` keeps the generator from pruning it.
- Agents link to `.claude/agents/` rather than `.skilled/agents/` because Cursor reads the `tools:` field. The shared files declare a `permission:` map instead.

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Mirror links and their targets | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 in sync / 1 on drift |
| Hook registrations | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | 0 in sync / 1 on drift / 2 on a registry it cannot render |
| Gate pointer blocks | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` | 0 in sync / 1 on drift / 2 on a missing source line |
| Roster coverage | `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 covered / 1 on drift / 2 on a checker error |
| Everything at once | `/doctor-runtime-mirrors` | read-only |

Each check ends with a verdict line. The mirror check prints a `PASS` line with its mirror and tree counts. The hook check prints a `PASS` line with the registry count. The pointer check prints `PASS`. The roster check ends with `STATUS=OK`.

---

## 9. KNOWN GAPS

- **`mcp.json` is a copy, not a link.** It matches `.claude/mcp.json` today. No check compares this copy with the Claude one, so an edit to either leaves the other stale.
- **`cli.json` has no check.** No gate reads the permission list, so a dropped pattern goes unreported.
- **A hand edit to `hooks.json` does not last.** The next `sync-hook-registrations.cjs` run renders the file again from `hook-registry.json`.
- **The packet list in the routing rule has no generator.** `sync-gate1-pointers.cjs --check` covers the two pointer blocks only, so a new packet does not appear on its own.
- **The `beforeSubmitPrompt` brief never arrives.** [`rules/skill-routing.md`](./rules/skill-routing.md) records that the adapter is registered but dormant under the tested CLI build, so the static rule carries the guidance in its place.
- **The [`goal-cursor` command](./commands/goal-cursor.md) cannot bind a goal.** Cursor's command surface carries no session identity, so every action except `packet` and `packet-log` fails with `code=UNSUPPORTED_SESSION_BINDING`.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a session here gets and the checks that confirm it |
| [`hooks/README.md`](./hooks/README.md) | The link index, with the real file each entry runs |
| [`rules/skill-routing.md`](./rules/skill-routing.md) | The static routing rule that Cursor and Devin share |
| [`runtime-mirrors/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md) | The registry, the renderer and the link generator |
| [`../.claude/SYNC.md`](../.claude/SYNC.md) | The source of every agent file this folder links |
