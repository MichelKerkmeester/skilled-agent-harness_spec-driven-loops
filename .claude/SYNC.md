---
title: "Claude Code — Runtime Sync Manifest"
description: "How .claude derives from .skilled: which surfaces are symlinks, which is a guarded fork, which are hand-authored, and how to detect drift."
---

# Claude Code Sync Manifest

> `.skilled/` is the source of truth for shared content. `.claude/` is mostly a set of whole-directory or generated per-file symlinks onto it — with one deliberate content fork, `agents/`, held in step by a pre-commit gate.

---

## 1. OVERVIEW

Claude Code reads this directory for its hooks, agents and MCP servers. Almost nothing here is authored content. Skills, specs and the changelog are whole-directory symlinks. Commands are a generated, filtered per-file mirror so OpenCode-only entries never enter Claude's repository discovery tree.

The exception matters. `.claude/agents/` holds **real files**, not symlinks, because Claude's agent dialect (`tools:`) differs from OpenCode's (`mode`/`temperature`/`permission:`). The bodies are otherwise the same document. A blocking pre-commit gate keeps the pair aligned.

**Canonical source is not uniform across this repo.** `.claude/agents/` is canonical for Cursor and Devin (they symlink into it, because they parse the Claude dialect), while `.skilled/agents/` is canonical for `.claude/agents/` itself and for the generated Codex TOMLs. Two upstreams, deliberately.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `commands/**/*.md` (45) | filtered per-file symlinks | `.skilled/commands/**/*.md` | Yes — guarded by the mirror generator; OpenCode-only entries are excluded |
| `skills` | whole-dir symlink | `../.skilled/skills` | No |
| `manual-testing-playbook` | whole-dir symlink | `../.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook` | No |
| `.utcp_config.json` | symlink | `../.utcp_config.json` | No |
| `agents/*.md` | **real forked copy** | `.skilled/agents/*.md` | **Yes** — guarded by pre-commit gate |
| `agents/README.txt` | real file | hand-maintained | Yes — no gate |
| `hooks/*` (29 symlinks) | per-file symlinks | scattered `.skilled/**` | Yes — guarded by the mirror generator |
| `settings.json` | authored, except its `hooks` key | `hooks` is rendered from `hook-registry.json` by `sync-hook-registrations.cjs` | The `hooks` key, if hand-edited. `--check` reports it |
| `mcp.json` | **real file, and it is canonical** | — | Root `.mcp.json` symlinks *to it*; Cursor reaches it via that hop |
| `statusline-command.sh` | real file | — | n/a |
| `settings.local.json` | operator-local | — | gitignored, never synced |

There is no `CLAUDE.md` here or at the repository root. Claude Code reads the root `AGENTS.md` directly, and a second instruction file would load twice and drift, which `/doctor:agents-md` checks.

`hooks/` is a **discovery mirror only**. Every command string in `settings.json` targets `.skilled/...` directly, so the symlinks exist for humans and tooling to find adapters, not for execution. See `hooks/README.md`.

---

## 3. WHEN TO SYNC

- An agent changes in `.skilled/agents/` → the `.claude/agents/` twin must be updated in the same commit, or the pre-commit gate blocks you.
- A new agent is added → add it to both trees and to `agents/README.txt`. Then run the mirror generator so Cursor and Devin pick it up, and the Codex, Pi and DeepSeek Harness agent generators for the rest.
- A hook is added or rebound → edit `hook-registry.json`, run `sync-hook-registrations.cjs` to render the `hooks` key of `settings.json`, then run the mirror generator to add the matching `hooks/` symlink.
- A command is added, removed, or changes runtime scope → run the mirror generator; ordinary edits to an already-linked command need no relink.
- Skills or specs change → nothing to do; they are whole-directory symlinks.

---

## 4. SYNC WORKFLOW

```bash
# 1. Verify the agent fork is still aligned with .skilled (this is the pre-commit gate)
node .skilled/bin/check-agent-mirror-sync.cjs --all

# 2. Render the hooks key of settings.json from the shared hook registry
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs

# 3. Refresh every symlink tree this repo owns (includes .claude/hooks)
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs

# 4. Confirm the other runtimes cover the canonical roster
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
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

- The same agents, by name, in every runtime that carries agents.
- Every shared command reachable from Claude's repository command tree. OpenCode-only commands are excluded. The drift check below is authoritative.
- An agent added here must reach `.skilled/agents`, `.codex/agents`, `.cursor/agents`, `.devin/agents`, `.pi/agents` and `.dsh/agents`.
- `agents/README.txt` lists every agent present in the directory.

---

## 7. DRIFT CHECKS

| Check | Command | Exit |
|---|---|---|
| Agent fork alignment | `node .skilled/bin/check-agent-mirror-sync.cjs --all` | 0 ok / non-zero blocks commit |
| Hook registrations, all four JSON runtimes | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | 0 ok / 1 drift |
| Symlink trees incl. `hooks/` | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | 0 ok / 1 drift |
| Roster coverage, all runtimes | `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | 0 ok / 1 drift / 2 canonical missing |
| Everything at once | `/doctor runtime-mirrors` | read-only |

---

## 8. KNOWN GAPS

- **`agents/` is a fork, not a mirror.** The pre-commit gate compares token sets, so a pure-prose edit on one side can pass while the two documents diverge in wording. Only a real symlink or a generator would remove this class entirely.
- **`agents/README.txt` has no gate.** It drifted before — a newly added agent was missing from it while the agent file existed.
- **A hand edit to the `hooks` key of `settings.json` does not last.** The next `sync-hook-registrations.cjs` run overwrites it. Change `hook-registry.json` instead. The other keys stay authored.
- **The command mirror proves repository discovery boundaries, not product-internal behavior.** A live Claude version may expose separate native capabilities that this repository check neither confirms nor denies.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`hooks/README.md`](hooks/README.md) | Why `hooks/` is discovery-only and not the execution path |
| [`agents/README.txt`](agents/README.txt) | Agent roster |
| [`../.codex/SYNC.md`](../.codex/SYNC.md) · [`../.cursor/SYNC.md`](../.cursor/SYNC.md) · [`../.devin/SYNC.md`](../.devin/SYNC.md) · [`../.pi/SYNC.md`](../.pi/SYNC.md) | Sibling runtime manifests |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | The symlink-tree generator |
