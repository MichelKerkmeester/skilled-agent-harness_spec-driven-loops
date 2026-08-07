# Iteration 2: KQ2 Daemon Dependency Audit

## Focus

Identify resident services and what a CLI loses or must emulate.

## Findings

1. Startup initializes SQLite, resolves the active embedder, runs a startup scan, starts the daemon lifecycle, then exposes stdio and IPC surfaces [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:264].
2. The watcher is a resident service with debounce, stable-write, storm, cooldown, busy-retry, diagnostic ring buffer, target refresh, flush, and generation suppression controls [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:41].
3. Prompt-cache state is in memory, process-local, capped at 1000 entries, and keyed by prompt/source/runtime/thresholds [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts:10].
4. Shadow telemetry is a file-appending sink with rotation and workspace-root path guard [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts:80].
5. `advisor_status` separates artifact freshness from daemon trust state; missing PID evidence can downgrade trust without necessarily changing artifact freshness [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:118].

## Sources Consulted

- `advisor-server.ts`
- `lib/daemon/watcher.ts`
- `lib/prompt-cache.ts`
- `lib/shadow/shadow-sink.ts`
- `handlers/advisor-status.ts`

## Assessment

`newInfoRatio`: 0.78. Confidence high on resident services; live orphan process count could not be rechecked because `ps` was denied by the sandbox.

## Reflection

What worked: tracing startup and handler dependencies. What failed: live process inspection. Ruled out: daemonless parity without replacing watcher/cache/telemetry semantics.

## Recommended Next Focus

KQ3: map which spec-memory CLI answers transfer and where skill-advisor diverges.
