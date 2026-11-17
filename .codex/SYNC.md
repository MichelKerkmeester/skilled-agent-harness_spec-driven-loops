---
title: "Codex CLI: Runtime Sync Manifest"
description: "How .codex/ derives from .skilled: the generated agents, prompts and hook registrations, the links into the hook library, the authored files and the checks that catch drift."
trigger_phrases:
  - "codex sync manifest"
  - "codex surface inventory"
  - "codex generated agents and prompts"
---

# Codex CLI Sync Manifest

> `.skilled/` is the source of truth. Generators write the agents and prompts from it and render the hook registration, so a change belongs in the source.

---

## 1. OVERVIEW

Codex reads the root `AGENTS.md` as its project instructions. It reads `.codex/hooks.json` once the checkout is trusted, and each command in that file changes to `${CODEX_PROJECT_DIR:-$PWD}` before it runs a real file under `.skilled/`. `config.toml` turns hooks on and registers the Code Mode MCP server, whose command is `.skilled/bin/mcp-code-mode-launcher.cjs`.

Codex also reads the user-global `~/.codex/hooks.json`. A copy of these entries in that file registers every hook a second time. The installer removes those copies and any repo entry whose adapter is gone, and it leaves third-party entries alone.

Most of this folder is generated. `agents/` holds one TOML file per shared agent, and `prompts/` holds one flat stub per command. `hooks.json` is rendered from the shared hook registry, and `hooks/` holds a link per command in it so a reader can find the file a hook runs. The agent and prompt generators delete output they no longer expect, and the link pass prunes an entry nothing expects.

`config.toml`, `hooks/README.md`, `README.md` and `SYNC.md` are written by hand. No generator writes `config.toml`. It holds the MCP server inline, while `.claude/` and `.cursor/` keep theirs in `mcp.json`.

The links in `hooks/` are for a reader. Codex runs the adapter at the path `hooks.json` names, never through this folder.

---

## 2. SURFACE INVENTORY

One row for each surface in this folder. A link holds no content of its own, so the file behind it is the only copy.

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `agents/*.toml` | generated | `.skilled/agents/*.md` | Yes. `sync-agents.cjs --check` reports a file that is missing or stale, and one it did not expect |
| `prompts/*.md` | generated | `.skilled/commands/**/*.md`, minus the commands the mirror policy excludes | Yes. `sync-prompts.cjs --check` reports the same two cases |
| `hooks/*` | one relative link per command in `hooks.json` | the adapter each command names under `.skilled/` | Yes. `sync-runtime-mirrors.cjs --check` reports a link that is missing or aimed at the wrong path, and an entry nothing expects |
| `hooks/README.md` | authored | none | No. It is the link index, and nothing generates it |
| `hooks.json` | generated | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Yes. `sync-hook-registrations.cjs --check` reports a file that differs from the registry |
| `config.toml` | authored | none | No. No generator writes it |
| `manual-testing-playbook` | whole-folder relative link | `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook` | No. Nothing to keep in step |
| `repo-rules` | whole-folder relative link | `../.skilled/repo-rules` | No. Nothing to keep in step |
| `README.md` | authored | none | No. It describes the folder for a user |
| `SYNC.md` | authored | none | No. Nothing generates it |

---

## 3. WHAT THIS FOLDER NEVER HOLDS

Everything below lives outside this folder on purpose.

| Kept out | Where it lives | Why |
|---|---|---|
| An agent body | `.skilled/agents/` | The TOML here is a rendered copy, so the source is the one place to edit |
| A command definition | `.skilled/commands/` | Each stub points at its canonical file and tells the reader to follow it |
| A hook core | `.skilled/hooks/` and the skill folder that owns it | `hooks.json` names the real path, and a copy here would fall behind the core |
| A skills tree | `.skilled/skills/` | There is no `skills/` and no `commands/` here. The advisor brief that arrives with a prompt names the skill to load |
| The shared instructions | `../AGENTS.md` | The root file is the only copy, and every runtime reads it |

---

## 4. WHEN TO SYNC

- A file under `.skilled/agents/` is added, renamed or edited → run `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`.
- A file under `.skilled/commands/` is added, renamed or deleted → run `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs`. A deleted command leaves a stub that points at nothing until you run it.
- The mirror policy starts or stops excluding a command → edit `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs`, then run the two command generators in the workflow below.
- A hook is added or rebound → edit `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, run `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`, then run `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` so `hooks/` gains or loses its link.
- `.codex/hooks.json` changes → nothing to install, because Codex reads the file from the checkout. Run `node .skilled/bin/install-codex-hooks.mjs --check` to confirm the user-global file holds no copy.
- `config.toml` or `hooks/README.md` changes → edit it by hand. No generator writes either one.

---

## 5. SYNC WORKFLOW

Run each command from the repository root.

```bash
# 1. Regenerate the agents and prompts. Each run deletes output it no longer expects.
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs

# 2. Render hooks.json from the shared registry, then refresh the hook links.
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs

# 3. Remove stale copies of these entries from the user-global file.
node .skilled/bin/install-codex-hooks.mjs
```

A write run reports what it changed. Each command generator prints a `Wrote <changed> of <total>` line with its own prefix, and the link pass prints `[runtime-mirror-sync] Linked <added>, removed <pruned>, of <total> expected mirrors.` When the installer changes the user-global file, it prints a JSON report whose `backup` field names the copy it made. The agent and prompt generators also prune, so a renamed agent or a removed command leaves no old file behind.

The installer only removes. Before it changes an existing user-global file, it copies the file to `<target>.bak-<timestamp>`, keeps every entry the project does not own, and drops an event that is left with no groups. A write run from a linked worktree is refused unless you pass `--allow-worktree`. `--dry-run` prints the same report and writes nothing.

---

## 6. FORMAT CONTRACT

An agent is TOML. The frontmatter becomes flat keys, and the body sits in `developer_instructions`, in a triple-quoted string unless the body itself carries `'''`, which switches it to a JSON string.

```toml
# Agent: review
# Converted from: .skilled/agents/review.md
name = "review"
description = "Code review specialist that applies the sk-code review mode's floor and lens, with a severity-based verdict and an advisory score, for PRs and code changes"
sandbox_mode = "read-only"
model = "<from the generator's table>"
model_reasoning_effort = "high"

developer_instructions = '''
... full markdown body ...
'''
```

The translation is one way. `sandbox_mode` collapses to `workspace-write` or `read-only`. The generator takes it from a per-agent table when the agent is listed there, and otherwise derives it from the source frontmatter: the value is `workspace-write` when the frontmatter grants tool access that can change a file, such as `write` or `bash`, in a permission or tool-list block. `model` and `model_reasoning_effort` never come from the agent file. Reading a TOML back cannot recover the permission block or the table entry.

`hooks.json` is a JSON object whose `hooks` key maps each event to an array of groups, and each group holds an optional `matcher` beside a `hooks` array. The six events are `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` and `PreCompact`. There is no `SessionEnd`, so cleanup runs on `Stop`. A shell matcher names both `exec` and `Bash`. All but one command carry a fallback after `||`, so a missing adapter prints an `mk-hook-drift` line and a message instead of failing the event. The exception is the detached `git-primary-reconcile.sh` entry, which discards its output.

---

## 7. REQUIRED PARITY

- Every agent TOML matches the output its source produces, and every prompt stub matches its command. The two `--check` runs are authoritative.
- A prompt name is the flattened command path, so `.skilled/commands/create/agent.md` becomes `create-agent.md`.
- Every stub cites a canonical file that exists. `sync-prompts.cjs --check` reports a stub with no source as `EXTRA`.
- `hooks.json` matches the shared registry. `sync-hook-registrations.cjs --check` is authoritative for all four runtime registration files.

---

## 8. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Generated agents | `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` | 0 in sync / 1 drift |
| Generated prompts | `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check` | 0 in sync / 1 drift |
| Hook registrations | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | 0 in sync / 1 drift / 2 the check failed |
| Hook links | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 in sync / 1 drift |
| Command asset references | `node .skilled/commands/scripts/validate-command-references.cjs` | 0 ok / 1 violation |
| User-global hook file | `node .skilled/bin/install-codex-hooks.mjs --check` | 0 clean / 1 a copy or orphan remains |
| Mirror, generator and roster checks for every runtime | `/doctor-runtime-mirrors` | read-only |

A pass prints a PASS line from each check, and the link check prints a visibility line before its own. The agent check begins `[codex-agent-sync] PASS:`, the prompt check begins `[codex-prompt-sync] PASS:`, and the registration check begins `[hook-registration-sync] PASS:`. The link check ends with a `[runtime-mirror-sync] PASS:` line, the reference check begins `OK  command references resolve`, and the installer prints `install-codex-hooks: OK` and the path to `~/.codex/hooks.json`. None of them writes.

---

## 9. KNOWN GAPS

- **A hand edit to `hooks.json` is lost.** It is rendered from `hook-registry.json`, so the next registration run overwrites the file. Change the registry file instead.
- **`config.toml` has no drift check.** No generator writes it and no drift check compares it with a source. `/doctor:mcp` does check that it registers the Code Mode launcher and the `.utcp_config.json` path.
- **A top-level folder link is unchecked.** `repo-rules` and `manual-testing-playbook` are relative links and nothing reads them, so a dangling link shows up only when a reader follows it.
- **The installer check can go silent.** `SYSTEM_HOOKS_DISABLED=1` or `SYSTEM_HOOK_INSTALL_DISABLED=1`, with the legacy `MK_HOOK_INSTALL_DISABLED=1` still read, returns the installer before it reads either file, so `--check` prints nothing and exits 0.
- **Prompt staleness is quiet at runtime.** A stub that points at a deleted command is still a valid prompt file, and nothing checks its path when it loads. Only the checks above compare it with the command tree.
- **Nothing reads this table.** A row that stops matching the disk is caught only when a reader compares it with the folder listing.

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | What a Codex session gets here, and the commands that check the folder |
| [`hooks/README.md`](./hooks/README.md) | Each link, the event it serves, and the hook switches |
| [`../.skilled/skills/system-spec-kit/runtime/cli/codex/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/codex/README.md) | The agent and prompt generator contract |
| [`../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md) | The hook registration and link generators |
| [`../.skilled/bin/README.md`](../.skilled/bin/README.md) | The installer entry and its `--check` mode |
| [`../.skilled/bin/lib/user-hook-file.mjs`](../.skilled/bin/lib/user-hook-file.mjs) | The ownership key and the worktree guard the installer shares with the Claude sync |
| [`../AGENTS.md`](../AGENTS.md) | The shared instructions |
| [`../.claude/SYNC.md`](../.claude/SYNC.md) · [`../.cursor/SYNC.md`](../.cursor/SYNC.md) · [`../.devin/SYNC.md`](../.devin/SYNC.md) · [`../.pi/SYNC.md`](../.pi/SYNC.md) · [`../.opencode/SYNC.md`](../.opencode/SYNC.md) · [`../.dsh/SYNC.md`](../.dsh/SYNC.md) · [`../.vibe/SYNC.md`](../.vibe/SYNC.md) | Sibling runtime manifests |
