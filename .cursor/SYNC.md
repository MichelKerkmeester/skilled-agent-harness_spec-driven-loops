---
title: "Cursor CLI — Runtime Sync Manifest"
description: "How .cursor derives from .opencode and .claude: symlinked agents and commands, the hand-authored rules file Devin also reads, and how to detect drift."
---

# Cursor CLI Sync Manifest

> Everything Cursor consumes is a **symlink** onto a canonical file, so no mirror here can drift from its source. Only `hooks.json` and `rules/` are authored in this directory.

---

## 1. OVERVIEW

Cursor discovers agents and commands by **file convention**, not by CLI flag. That is worth stating plainly because an earlier pass in this repo grepped `cursor-agent --help` for an agent flag, found none, and wrongly concluded Cursor had no custom-agent concept — while all 13 agents were already loading.

Cursor loads custom subagents from two places, both confirmed live:

| Source | Status here |
|---|---|
| `.cursor/agents/*.md` | This repo's explicit mirrors |
| `.claude/agents/*.md` | Claude-format auto-import — worked before any mirror existed |

Agents source from **`.claude/agents/`**, not `.opencode/agents/`, because Cursor parses the Claude dialect (`tools:`). Commands source from `.opencode/commands/` directly. Note `~/.cursor/agents/` (user-level) is documented by Cursor but a live probe found the CLI did **not** load a profile placed there.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Target shape |
|---|---|---|---|
| `agents/*.md` (13) | symlink | `.claude/agents/<name>.md` | `../../.claude/agents/<name>.md` |
| `commands/*.md` (36) | symlink | `.opencode/commands/<path>.md` | flattened: `create/agent.md` → `create-agent.md` |
| `hooks/*` (15) | symlink | scattered `.opencode/**` | discovery mirror only |
| `hooks.json` | **hand-authored** | — | — |
| `rules/skill-routing.md` | **hand-authored** | — | also read by Devin |
| `mcp.json` | symlink | `../.mcp.json` → `.claude/mcp.json` | double hop |

No `.cursor/skills/` — Cursor's own skills live in `~/.cursor/skills-cursor/` and are managed by Cursor itself.

---

## 3. WHEN TO SYNC

- An agent is added or removed in `.claude/agents/` → re-run the mirror generator.
- A command is added, renamed or removed in `.opencode/commands/` → re-run the mirror generator.
- A hook is registered in `hooks.json` → re-run the generator for the matching `hooks/` symlink.
- Skill routing changes → hand-edit `rules/skill-routing.md`, and remember **Devin reads this file too**.

---

## 4. SYNC WORKFLOW

```bash
# Refresh every symlink tree (cursor agents + commands + hooks, and the devin trees)
node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs

# Verify roster coverage across all five runtime surfaces
node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

Both refuse to accept a real file where a symlink belongs — that is a silent fork, not a valid mirror.

---

## 5. FORMAT CONTRACT

**Agents.** Cursor's bundled `create-subagent` skill documents `name` + `description` frontmatter (both required) with the markdown body as the system prompt. Because the mirrors point into `.claude/agents/`, they carry Claude's `tools:` field too, which Cursor tolerates.

**Commands.** Flat namespace: `.cursor/commands/*.md`, so `deep/research.md` becomes `deep-research.md`. Cursor's own migration skill documents the glob as `.cursor/commands/*.md`.

**Hooks.** `hooks.json` is the most divergent of the four runtime configs:

- **camelCase** events (`preToolUse`, `beforeSubmitPrompt`) where the others use PascalCase.
- **Flat** entry lists — no `{matcher, hooks: [...]}` nesting; `matcher` is an optional key on the command object itself.
- A `"version": 1` discriminator, unique to Cursor.
- Bare `node …` commands with **no** `bash -c 'cd "$…_PROJECT_DIR"'` wrapper.
- Default `timeout: 10` where siblings use 5.
- A dedicated `beforeMCPExecution` event with no counterpart elsewhere.

**Known runtime limitation.** `beforeSubmitPrompt` is registered but **does not fire** under the tested CLI build, confirmed by a live marker probe. The adapter is designed to inject a per-turn skill-advisor brief; because it is dormant, `rules/skill-routing.md` carries static routing guidance as a complement — not a substitute for the dynamic brief.

---

## 6. REQUIRED PARITY

- 13 agents and 36 commands, names matching the canonical trees.
- Every entry under `agents/` and `commands/` is a symlink resolving into the canonical tree.
- No duplicate agent names between `.cursor/agents/` and the `.claude/agents/` auto-import — verified live: the roster lists each name once.

---

## 7. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Symlink trees incl. `hooks/` | `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 ok / 1 drift |
| Roster coverage | `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 ok / 1 drift |
| Everything at once | `/doctor runtime-mirrors` | read-only |

Live confirmation, which file checks cannot give you:

```bash
cursor-agent --force -p "List ONLY custom subagent profile names, one per line."
```

Expect the 13 repo agents alongside Cursor's own built-ins. Note that dispatching a subagent is additionally gated by this repo's `preToolUse` spec-gate — a refusal there is the guard working, not a missing agent.

---

## 8. KNOWN GAPS

- **`hooks.json` is hand-authored and unmirrorable.** Its dialect has no counterpart in the other three runtimes.
- **`rules/skill-routing.md` has no generator** and is not derived from the skill registry, so a new skill packet will not appear in it automatically.
- **`beforeSubmitPrompt` dormancy is unresolved upstream.** The static rules file mitigates but does not replace it.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`hooks/README.md`](hooks/README.md) | Why the mirror is discovery-only, incl. the compiled-ESM caveat |
| [`rules/skill-routing.md`](rules/skill-routing.md) | The static routing rule, also consumed by Devin |
| `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Dispatch contract and the corrected custom-agent record |
| [`../.claude/SYNC.md`](../.claude/SYNC.md) · [`../.codex/SYNC.md`](../.codex/SYNC.md) · [`../.devin/SYNC.md`](../.devin/SYNC.md) | Sibling runtime manifests |
