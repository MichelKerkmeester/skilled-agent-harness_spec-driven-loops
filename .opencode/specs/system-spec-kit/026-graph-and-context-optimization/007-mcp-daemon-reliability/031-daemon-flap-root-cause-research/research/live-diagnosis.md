# Live diagnosis — the current daemon-down state (orchestrator-confirmed, 2026-06-14 ~16:13 UTC)

This is the concrete failure the root-cause research must explain and fix. All items here were confirmed by running commands this session (not inferred).

## Confirmed observations
- **mk-skill-advisor**: launcher/daemon process NOT running. A raw `net.connect("/tmp/mk-skill-advisor/daemon-ipc.sock")` returns **ECONNREFUSED** → the socket FILE persists on disk but nothing listens (stale socket). Warm CLI probe → error. **DOWN.**
- **mk-spec-memory**: launcher/daemon NOT running; socket stale (mtime 14:25); warm CLI probe → error. **DOWN.** (`hf-embed.pid` also present in its /tmp dir.)
- **mk-code-index**: **3 launcher processes alive** (`mk-code-index-launcher.cjs`, uptimes ~1d8h, ~1d6h, ~2.5h); warm CLI probe → **ok**. **UP, but with orphan launcher pile-up.**
- **7 interactive runtime processes** (claude/opencode) alive on this machine = multiple concurrent sessions. A concurrent session was actively committing spec-150 work during this session (it also deprecated/deleted mcp-magicpath).
- No persistent daemon/launcher log found at `/tmp/mk-*/` or under `.opencode/` obvious paths, so the exact kill event is not recoverable from a log.
- This session is **Claude Code** (not OpenCode). SessionStart hook reported "Code Graph: unavailable" + memory startup-only; mid-session the `mk_skill_advisor` MCP transport disconnected. The daemons were never cleanly bridged into this Claude session.

## Why this matters / the paradox to resolve
Per memory + the packet history, daemon re-election is DEFAULT-ON (027 + packet 140 resolved deferrals), the disposal-flap guard shipped (017), dead-socket reap shipped (019), code-index reconnecting proxy shipped (020), orphan-sweep stop-hook exists (021, default-off), ownership re-election shipped (022/027/028). The root cause was identified as `child.kill(signal)` in `shutdownLauncherForSignal`. **Yet the skill-advisor + spec-memory daemons are still dead with stale sockets, and code-index launchers still pile up.** The research must explain WHY the flap/teardown persists after 30 phases of fixes, and propose the definitive root-cause fix.

## Key code under investigation
- `.opencode/bin/lib/model-server-supervision.cjs` (relaunch-decision helpers; per memory, re-exported by the launchers; tested via launcher-watchdog.vitest.ts)
- `.opencode/bin/mk-skill-advisor-launcher.cjs`, `mk-spec-memory-launcher.cjs`, `mk-code-index-launcher.cjs`
- The 3 runtime configs that set re-election default-on (opencode.json / .claude / .codex)

## Existing packet (build on it, do NOT re-derive)
`system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` — 30 child phases (001-030). Most relevant: 003 (research), 017 (disposal-flap-guard), 019 (dead-socket-reap), 020 (code-index reconnecting proxy), 021 (orphan-sweep stop-hook), 022 (ownership re-election), 027 (reelection default-on), 028 (live-session reelection validation), 029 (cross-session kill scoping), 030 (client-side reconnect survival).
