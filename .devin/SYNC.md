---
title: "Devin CLI: Runtime Sync Manifest"
description: "How .devin/ derives from .skilled: the agent profiles it links to the Claude files, the hook file rendered from the shared registry, the folder links and the checks that catch drift."
trigger_phrases:
  - "devin sync manifest"
  - "devin surface inventory"
  - "devin hook registration drift"
---

# Devin CLI Sync Manifest

> `.skilled/` is the source of truth. Almost every path here is a link onto it, and one generated file follows the shared hook registry.

---

## 1. OVERVIEW

Devin keeps its config in `.devin/` at the project root. It reads its hooks from `hooks.v1.json`, and each command there changes to the folder that `DEVIN_PROJECT_DIR` names before it runs a file under `.skilled/`. An agent profile sits at `agents/<name>/AGENT.md`, one folder per profile, with a fixed file name inside. A skill is reached through the `skills` link. Devin has no command-file surface, so a folder of command files here would register nothing.

Almost every path in this folder is a link. The agent profiles point at `.claude/agents/`, and each entry in `hooks/` points at the file `hooks.v1.json` runs. A few whole folders arrive the same way, among them `skills` and `repo-rules`.

`hooks.v1.json` is the one generated file. `sync-hook-registrations.cjs` renders it from the shared hook registry, which names each hook once with its per-runtime bindings. The rest is written by hand. `mcp_config.json` belongs to Devin and registers the Code Mode server. `config.json` turns off Devin's import of a Claude config, so a session loads this checkout's own `AGENTS.md`. Neither file has a source under `.skilled/`, and no generator writes either one.

---

## 2. SURFACE INVENTORY

One row for each path in this folder, with the mechanism that keeps it in step.

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `agents/<name>/AGENT.md` | one relative link per profile, inside a folder named for the agent | `.claude/agents/<name>.md` | Yes. `sync-runtime-mirrors.cjs --check` names a link that is missing or aimed at the wrong file, and a folder nothing expects |
| `hooks/*` | one relative link per distinct script that `hooks.v1.json` runs | the `.skilled/` path that command names | Yes. The same check catches a missing link and one aimed elsewhere |
| `hooks/README.md` | authored | none | No. It is the link index, and nothing generates it |
| `hooks.v1.json` | generated | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Yes. `sync-hook-registrations.cjs --check` names a file that differs from the registry |
| `config.json` | authored | none | No. No generator writes it |
| `config.local.json` | operator-local | none | No. A local git exclude keeps it out of the repository, and no generator reads it |
| `mcp_config.json` | authored here | none | No. Devin owns the file |
| `skills` | whole-folder relative link | `../.skilled/skills` | No. Nothing to keep in step |
| `repo-rules` | whole-folder relative link | `../.skilled/repo-rules` | No. Nothing to keep in step |
| `manual-testing-playbook` | whole-folder relative link | `../.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook` | No. Nothing to keep in step |
| `README.md` | authored | none | No. It describes the folder for a user |
| `SYNC.md` | authored | none | No. Nothing generates it |

The agent tree is nested one folder per profile. `sync-runtime-mirrors.cjs` skips `Explore`, because Claude Code resolves a subagent by exact name and no other runtime carries that built-in. The roster check skips it too.

---

## 3. WHAT THIS FOLDER NEVER HOLDS

Everything below lives outside this folder on purpose.

| Kept out | Where it lives | Why |
|---|---|---|
| A `commands/` folder | `.skilled/commands/` | Devin has no command-file surface. The binary has no `commands` subcommand, so a folder here would register nothing |
| A `rules/` folder | `../.cursor/rules/` and `../AGENTS.md` | Devin reads the Cursor rules and the root instructions file, so a copy here would be a second rule source that drifts from them |
| A hook core | `.skilled/hooks/` and the skill folder that owns it | `hooks.v1.json` names the real path. A copy here would fall behind the core |
| A second copy of a linked tree | `.skilled/` | The link is the only copy. A duplicate would fall behind the source |

---

## 4. WHEN TO SYNC

- An agent is added, renamed or removed in `.claude/agents/` → run `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` so the folders here follow.
- A hook is added or rebound → edit `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, run `sync-hook-registrations.cjs` to render `hooks.v1.json`, then run `sync-runtime-mirrors.cjs` so `hooks/` gains or loses the matching link.
- A file inside a linked tree changes → nothing to run. The link resolves to the changed file.
- Skill routing changes → edit `.cursor/rules/skill-routing.md`. Devin reads that file, so nothing here needs a run.
- `config.json` or `mcp_config.json` changes → edit it by hand. No generator writes either one. `hooks/README.md` is the same.

---

## 5. SYNC WORKFLOW

Run each command from the repository root.

```bash
# 1. Render hooks.v1.json from the shared registry.
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs

# 2. Refresh the agent and hook links.
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

A tree that already matches its target reports nothing changed. The registration pass ends with a line shaped like `[hook-registration-sync] Wrote 0 of 4 registration files from the 36-hook registry; 22 Pi extensions resolve.` The link pass ends with `[runtime-mirror-sync] Linked 0, removed 0, of 260 expected mirrors.` The count after `of` is fixed by the registry or the link set, not by the run.

The link pass also prunes. It removes a link that no source expects, and an agent folder that no profile expects. The registration pass overwrites its whole file, so a hand edit in it never survives.

---

## 6. FORMAT CONTRACT

### The Hook File

`hooks.v1.json` is a JSON object whose top-level keys are event names. There is no `hooks` wrapper, and the version lives in the file name. Each event holds an array of groups, and a group carries a `matcher` beside a `hooks` array. An entry in that array carries a `type` of `command` beside its command string. A timeout sits on the same entry.

Matchers are anchored regex, so `^exec$` matches one tool name and `^(edit|write)$` matches either. The eight events are `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PermissionRequest`, `Stop`, `PostCompaction` and `SessionEnd`. Devin is the only runtime whose event order carries `PermissionRequest` and `PostCompaction`.

The first group of `PreToolUse`, cut after its first command:

```json
{
  "PreToolUse": [
    {
      "matcher": "^exec$",
      "hooks": [
        {
          "type": "command",
          "command": "bash -c 'cd \"${DEVIN_PROJECT_DIR:-$PWD}\" && node .skilled/hooks/cli-dispatch/devin/dispatch-preflight-lint.mjs'",
          "timeout": 5
        }
      ]
    }
  ]
}
```

The translation runs one way. The registry records each hook's `id` and concern, plus its binding for each runtime. The rendered file keeps the command string and its timeout, and the fallback survives as the shell clause it produced. `id` and `concern` stay behind, so the concern cannot be read back out of the file. [`hooks/README.md`](./hooks/README.md) carries the map.

### The Linked Agent Files

No translation happens for an agent. Devin parses the Claude dialect, including the `tools:` line, so each profile here is a link onto the Claude file and the two cannot disagree about content.

A profile must still survive a strict YAML parse. A `description:` value with an unquoted colon is invalid YAML, and Devin drops the whole file instead of reporting an error.

```yaml
---
name: review
description: Code review specialist that applies the sk-code review mode's floor and lens, with a severity-based verdict and an advisory score, for PRs and code changes
tools: Read, Bash, Grep, Glob
---
```

---

## 7. REQUIRED PARITY

- Every agent in the canonical roster has a folder here whose `AGENT.md` points at its `.claude/agents/` file. The roster check is authoritative.
- Every command in `hooks.v1.json` has a matching link in `hooks/`. `sync-runtime-mirrors.cjs --check` names a command with no link.
- `hooks.v1.json` matches the shared registry. The same `--check` run covers all four JSON runtime files.
- Every linked agent profile parses as strict YAML. No check enforces it, so it holds only as long as the canonical file does.

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Hook registrations | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | 0 in sync / 1 drift / 2 when the check cannot run |
| Agent and hook links | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 in sync / 1 drift |
| Roster coverage | `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 covered / 1 drift / 2 when the checker cannot run |
| Mirror, generator and roster checks for every runtime | `/doctor:runtime-mirrors`, from a Claude Code, OpenCode, Codex, Cursor or Pi session | read-only |

A pass prints a verdict line. The registration check prints a `[hook-registration-sync] PASS:` line with its file and registry counts. The link check prints a visibility line first, then `[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.` The roster check prints one `OK` line per runtime and ends with `STATUS=OK`. A drift finding prints one line per bad path before the exit code. A link that is missing or aimed elsewhere carries a `MISSING` or `STALE` prefix, and an entry nothing expects carries `EXTRA`. None of these commands writes.

---

## 9. KNOWN GAPS

> [!WARNING]
> A hand edit to `hooks.v1.json` is lost. The next registration run renders the file from the registry and the edit is gone. Change `hook-registry.json` instead.

- **No strict-YAML gate.** Nothing blocks an unquoted colon in a `description:` line of a canonical agent file. The profile then vanishes from Devin with no message, and the only sign is a missing name.
- **The whole-folder links have no check.** A link such as `skills` is never read by a script, so a dangling one shows up only when a reader follows it. The same holds for `repo-rules` and the playbook link.
- **`config.json` and `mcp_config.json` have no drift check.** No generator writes them and no check compares them with a source. A wrong key shows up only inside a session.
- **`PostCompaction` has not been seen firing.** It needs a session long enough to compact, and a scenario-sized dispatch cannot force one. A defect in that adapter would stay hidden.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a session here gets, and the commands that check the folder |
| [`hooks/README.md`](./hooks/README.md) | One row per link, with the real path `hooks.v1.json` runs |
| [`../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md) | The registry, the renderer and the link generator |
| [`../.skilled/hooks/README.md`](../.skilled/hooks/README.md) | The hook cores and the switch each concern reads |
| [`../.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md`](../.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md) | The dispatch contract for another runtime calling Devin |
| [`../AGENTS.md`](../AGENTS.md) | The shared instructions |
| [`../.claude/SYNC.md`](../.claude/SYNC.md) · [`../.codex/SYNC.md`](../.codex/SYNC.md) · [`../.cursor/SYNC.md`](../.cursor/SYNC.md) · [`../.dsh/SYNC.md`](../.dsh/SYNC.md) · [`../.opencode/SYNC.md`](../.opencode/SYNC.md) · [`../.pi/SYNC.md`](../.pi/SYNC.md) · [`../.vibe/SYNC.md`](../.vibe/SYNC.md) | Sibling runtime manifests |
