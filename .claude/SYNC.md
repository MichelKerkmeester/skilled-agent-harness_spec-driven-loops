---
title: "Claude Code — Runtime Sync Manifest"
description: "How .claude derives from .opencode: which surfaces are symlinks, which is a guarded fork, which are hand-authored, and how to detect drift."
---

# Claude Code Sync Manifest

> `.opencode/` is the source of truth for shared content. `.claude/` is mostly a set of symlinks onto it — with one deliberate exception, `agents/`, which is a real fork held in step by a pre-commit gate.

---

## 1. OVERVIEW

Claude Code reads this directory for its hooks, agents, MCP servers and runtime routing. Almost nothing here is authored content: commands, skills, specs and the changelog are whole-directory symlinks, so they cannot drift by construction.

The exception matters. `.claude/agents/` holds **real files**, not symlinks, because Claude's agent dialect (`tools:`) differs from OpenCode's (`mode`/`temperature`/`permission:`). The bodies are otherwise the same document. A blocking pre-commit gate keeps the pair aligned.

**Canonical source is not uniform across this repo.** `.claude/agents/` is canonical for Cursor and Devin (they symlink into it, because they parse the Claude dialect), while `.opencode/agents/` is canonical for `.claude/agents/` itself and for the generated Codex TOMLs. Two upstreams, deliberately.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `commands` | whole-dir symlink | `../.opencode/commands` | No — same inode |
| `skills` | whole-dir symlink | `../.opencode/skills` | No |
| `specs` | whole-dir symlink | `../.opencode/specs` | No |
| `changelog` | whole-dir symlink | `../.opencode/changelog` | No |
| `manual-testing-playbook` | whole-dir symlink | `../.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook` | No |
| `.utcp_config.json` | symlink | `../.utcp_config.json` | No |
| `agents/*.md` (13) | **real forked copy** | `.opencode/agents/*.md` | **Yes** — guarded by pre-commit gate |
| `agents/README.txt` | real file | hand-maintained | Yes — no gate |
| `hooks/*` (18 symlinks) | per-file symlinks | scattered `.opencode/**` | Yes — guarded by the mirror generator |
| `settings.json` | **hand-authored** | — | n/a — no counterpart to sync with |
| `mcp.json` | **real file, and it is canonical** | — | Root `.mcp.json` symlinks *to it*; Cursor reaches it via that hop |
| `statusline-command.sh` | real file | — | n/a |
| `CLAUDE.md` | **hand-authored** runtime routing overlay | — | n/a — distinct from repo-root `CLAUDE.md`, which symlinks to `AGENTS.md` |
| `settings.local.json` | operator-local | — | gitignored, never synced |

`hooks/` is a **discovery mirror only**. Every command string in `settings.json` targets `.opencode/...` directly, so the symlinks exist for humans and tooling to find adapters, not for execution. See `hooks/README.md`.

---

## 3. WHEN TO SYNC

- An agent changes in `.opencode/agents/` → the `.claude/agents/` twin must be updated in the same commit, or the pre-commit gate blocks you.
- A new agent is added → add it to both trees, to `agents/README.txt`, and run the mirror generator so Cursor and Devin pick it up.
- A hook is registered in `settings.json` → run the mirror generator to add the matching `hooks/` symlink.
- Commands, skills or specs change → nothing to do; they are symlinks.

---

## 4. SYNC WORKFLOW

```bash
# 1. Verify the agent fork is still aligned with .opencode (this is the pre-commit gate)
node .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all

# 2. Refresh every symlink tree this repo owns (includes .claude/hooks)
node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs

# 3. Confirm coverage across all five runtime surfaces
node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

---

## 5. FORMAT CONTRACT

Agent frontmatter is Claude's own dialect:

```yaml
---
name: review
description: Code review specialist with pattern validation, quality scoring, and standards enforcement
---
```

`tools:` is a comma-separated allowlist supporting `mcp__…__*` globs. It has no OpenCode equivalent — OpenCode expresses the same intent as a `permission:` map, and the mapping is lossy in both directions. That is why the fork exists.

The body is identical to the OpenCode twin except for the self-referential `**Path Convention**` line, which names this tree. `check-agent-mirror-sync.cjs` compares **token sets, not bytes**, normalising those runtime path strings, so the pair passes despite differing byte-for-byte.

`settings.json` hook entries are PascalCase events holding nested `{matcher, hooks: [...]}` groups, with `matcher: ""` on non-tool events, and commands wrapped as `bash -c 'cd "${CLAUDE_PROJECT_DIR:-$PWD}" && …'`.

---

## 6. REQUIRED PARITY

- 13 agents, same names, in all five surfaces.
- 35 commands reachable from every runtime that supports them. The count moves as commands are added or retired; the drift checks below are authoritative, not this number.
- An agent added here must reach `.opencode/agents`, `.codex/agents`, `.cursor/agents` and `.devin/agents`.
- `agents/README.txt` lists every agent present in the directory.

---

## 7. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Agent fork alignment | `node .opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` | 0 ok / non-zero blocks commit |
| Symlink trees incl. `hooks/` | `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 ok / 1 drift |
| Roster coverage, all runtimes | `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 ok / 1 drift / 2 canonical missing |
| Everything at once | `/doctor runtime-mirrors` | read-only |

---

## 8. KNOWN GAPS

- **`agents/` is a fork, not a mirror.** The pre-commit gate compares token sets, so a pure-prose edit on one side can pass while the two documents diverge in wording. Only a real symlink or a generator would remove this class entirely.
- **`agents/README.txt` has no gate.** It drifted before — `deep-alignment` was missing from it while the agent file existed.
- **`settings.json` is hand-authored and unmirrorable.** The four runtimes use incompatible event vocabularies and entry shapes; no generator can produce it from a shared source.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`hooks/README.md`](hooks/README.md) | Why `hooks/` is discovery-only and not the execution path |
| [`agents/README.txt`](agents/README.txt) | Agent roster |
| [`../.codex/SYNC.md`](../.codex/SYNC.md) · [`../.cursor/SYNC.md`](../.cursor/SYNC.md) · [`../.devin/SYNC.md`](../.devin/SYNC.md) · [`../.pi/SYNC.md`](../.pi/SYNC.md) | Sibling runtime manifests |
| `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs` | The symlink-tree generator |
