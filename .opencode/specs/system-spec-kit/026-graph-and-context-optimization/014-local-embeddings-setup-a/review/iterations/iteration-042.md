# Deep Review v4 Iteration 042 - Codex launcher path

## Focus

Verify `.codex/config.toml` routes Spec Kit Memory through the launcher and that the launcher spawns the expected context server.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| None | - | - | `.codex/config.toml:9-11` now uses `command = "node"` and `args = [".opencode/bin/spec-kit-memory-launcher.cjs"]`. The launcher resolves `root` from its own location at `.opencode/bin/spec-kit-memory-launcher.cjs:6`, loads `.env.local` and `.env` at lines 35-40, and spawns `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` at lines 178-183. A brief runtime probe confirmed the spawned server logged the `__q8.sqlite` path. | Keep. |

## Notes

This resolves `P0-V3-LAUNCHER-001` for Codex. The launcher receives no explicit context-server arg; it derives the child path internally, which is consistent across Codex, Claude, Gemini, `.mcp.json`, and `opencode.json`.
