# Iteration 006 — F4: Cursor MCP config-resolution chain (env overrides)

## Focus
Document Cursor's exact MCP config-resolution chain (project vs user vs the symlink chain) and where per-server `env` overrides (e.g. `SK_VISION_MODEL`) must live to actually take effect.

## Actions Taken
1. Traced the local symlink/config files: `.cursor/mcp.json -> ../.mcp.json`, `.mcp.json -> .claude/mcp.json`, and the `.claude/mcp.json` sk-vision entry (which currently has NO env block).
2. Read `cli-cursor/references/shared-editor-config.md` and `cli-reference.md` §9 for the resolution contract.
3. Web-researched Cursor vs Claude Code MCP config files and env handling.

## Findings

### The resolution chain (confirmed)
Cursor CLI reads the **same config files the Cursor editor reads** — there is no tool-private namespace:
- Project/workspace scope: `.cursor/mcp.json`
- User/global scope: `~/.cursor/mcp.json`
- Precedence: project → user/global → nested. Cursor loads/merges project and global MCP config.

In the repository the effective file is reached through **two symlinks**: `.cursor/mcp.json → ../.mcp.json → .claude/mcp.json`. So Cursor *functionally* reads the `.claude/mcp.json` content, but only **because** `.cursor/mcp.json` symlinks to it. The problem: `env` placed directly in `.claude/mcp.json` (as if it were a Claude-Code file) is **not read by Cursor as a Cursor file** unless the `.cursor/mcp.json` chain resolves to it — and even then, Cursor's config merger reads the resolved `.mcp.json`/`.claude/mcp.json` as a *project* file, not as a Claude-Code-namespaced file.

The finding literally states: "Setting SK_VISION_MODEL in `.claude/mcp.json` had no effect; the effective config is `.mcp.json` (reached via the `.cursor/mcp.json` symlink)." This is **expected per Cursor's design**: Cursor only honors env in **its own** config chain (`.cursor/mcp.json` project, `~/.cursor/mcp.json` user). Static `env` written into the shared file does not apply unless Cursor's own chain picks it up AND the server def is in the scope Cursor merges.

### Bug vs expected
**Expected** — with one real gap in the skill's host plumbing:
- Expected: Cursor does not read `.claude/mcp.json` as a Claude-Code file; it reads `.cursor/mcp.json` (symlinked) per Cursor's project scope. The `env` must live in the **Cursor-scoped** config (`.cursor/mcp.json` project or `~/.cursor/mcp.json` user), inside the server's `env` block, or via `envFile` for stdio servers.
- Gap: the sk-vision `hooks/cursor/mcp.json` blob is a **portable reference** only and is NOT wired into the effective chain as an owned source. The shared `.claude/mcp.json` entry is the one Cursor actually reaches, but the skill documents `hooks/cursor/mcp.json` as the Cursor entry ("portable Cursor entry") without making clear that per-server env must be authored into the **live** config Cursor resolves — and that `.claude/mcp.json` is a shared file the skill cannot own.

### The cleanest durable fix / documentation
1. **Author per-server env where Cursor resolves it:** put `SK_VISION_MODEL` (and any server env) in the `env` block of the sk-vision server within `.cursor/mcp.json` (or a project-scoped `.mcp.json` that `.cursor/mcp.json` symlinks to), or use `envFile`. Do not put it only in `.claude/mcp.json` and expect Cursor to apply it.
2. **Socket/envFile pattern (repo-recommended):** for distinct per-repo credentials, define the server only in `.cursor/mcp.json` pointing at a project-local, gitignored `envFile` (e.g. `.env.mcp`). This avoids committing secrets and avoids duplicate-server merge issues.
3. **Docs gap:** the cli-cursor skill and sk-vision `hooks/README.md` should state the resolution chain explicitly (Cursor reads `.cursor/mcp.json`, symlinked here to `.claude/mcp.json`; env belongs in Cursor's own scope) and that the portable `hooks/cursor/mcp.json` is a reference blob, not an owned source Cursor auto-loads.

### Cross-host generalization
This is Cursor-specific (shared-with-editor config surface, `.cursor/mcp.json`). The generalizable lesson: **per-server env must be authored in the host's own config scope** (Cursor `.cursor/mcp.json`; Claude Code `.mcp.json`; Devin env in the MCP definition / launch). The four hosts read different files, so a shared `.claude/mcp.json`-centric assumption breaks Cursor.

## Questions Answered
- Q: Where must per-server env live for Cursor? A: In Cursor's own `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (user) `env` block / `envFile` — not only in `.claude/mcp.json`.
- Q: Is the chain a bug? A: No — expected Cursor design; the gap is sk-vision docs/host-plumbing clarity.

## Questions Remaining
- None for F4.

## Next Focus
Iteration 7: F5a — the base64 'Incorrect padding' root cause (confirmed in iteration 1) and the durable decoder fix.

## Ruled Out
- Reading env from `.claude/mcp.json` as a general Cursor mechanism (not supported; Cursor honors its own scope).

## Source Citations
- [SOURCE: file: .opencode/skills/cli-external-orchestration/cli-cursor/references/shared-editor-config.md:25,39-52]
- [SOURCE: file: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:243]
- [SOURCE: file: hooks/README.md — Cursor chain]
- [SOURCE: web docs.cursor.com/context/model-context-protocol]
- [SOURCE: web forum.cursor.com — duplicate-mcp-servers-in-cursor-settings/151971; envFile pattern]
