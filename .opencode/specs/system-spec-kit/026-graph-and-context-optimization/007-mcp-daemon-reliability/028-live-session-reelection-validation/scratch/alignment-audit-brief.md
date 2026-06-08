# Alignment audit brief: docs vs recent daemon-reliability fixes

Repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## The recent fixes the docs must reflect (source of truth)
1. **Re-election is now DEFAULT-ON (packet 027).** `SPECKIT_DAEMON_REELECTION=1` is committed in all three runtime configs: `.claude/mcp.json` (via the `.mcp.json` symlink), `opencode.json`, `.codex/config.toml`. It was previously experimental / default-off. Effect: the shared mk-spec-memory daemon now outlives its owning session. On owner disposal the launcher RELEASES the detached daemon (keeps the daemon lease, drops only the owner lease) instead of killing it, so a connected live secondary keeps MCP transport.
2. **Reap-before-respawn fix (packet 028).** A fresh session started AFTER an owner disposal used to reclaim the stale lease and spawn a SECOND daemon on the same WAL database (double-writer), because lease liveness keyed on the dead owner pid not the live daemon childPid. The launcher now reaps the recorded child on the stale-lease reclaim branch before respawn (under the owner-lease O_EXCL mutex, bailing to a lease-held report on EPERM), so the single-writer invariant holds and a cold restart matches the prior behavior.
3. **Live two-session test (packet 028).** `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` runs two real launchers in an isolated fake-root, three cases: live-secondary survives (flag on), daemon dies (flag off), fresh session after disposal is the single writer. Complements the hermetic `daemon-reelection-release-integration.vitest.ts`.
4. **Release:** all of the above is folded into changelog `v3.5.0.4` (the single latest release). `ENV_REFERENCE.md` re-election row is already updated.

## Already-updated (do NOT re-flag): `ENV_REFERENCE.md`, `v3.5.0.4.md`, `RELEASE_NOTES.md`, the 3 runtime configs.

## Your job
For your assigned target files only, find anything STALE, MISSING, WRONG, or CONTRADICTORY versus the four fixes above. Examples: a doc that still calls re-election experimental/default-off; a feature-catalog or playbook entry that lacks the default-on flip, the reap fix, or the new live test; a hard-coded file/scenario COUNT that is now wrong; a README/skill-doc lifecycle description that no longer matches.

Report each finding as: `FILE:LINE | what is stale | recommended exact change`. If a target is already aligned, say so explicitly. Be concrete and cite line numbers. You may read and grep (read-only); do not edit anything.
