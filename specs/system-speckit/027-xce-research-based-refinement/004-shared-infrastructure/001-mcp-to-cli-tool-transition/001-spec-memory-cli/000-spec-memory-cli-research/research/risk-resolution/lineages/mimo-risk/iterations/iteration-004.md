# Iteration 004 — RQ7: Session-Identity Semantics + RQ8: Build/Activation Drift

- **Date:** 2026-06-06T12:50:00Z
- **Focus:** RQ7 (session-identity semantics) and RQ8 (build/activation drift)
- **Status:** complete

---

## RQ7: Session-Identity Semantics — RESOLVED

### Question
sessionId propagation verified in dedup/learning/working-memory code paths; what non-codex runtimes pass.

### Findings

**1. Session ID resolution chain.** `resolveSessionTrackingId()` in `context-server.ts:518-536` resolves sessionId from 4 sources in priority order:
1. `args.sessionId` or `args.session_id` (explicit from caller — MCP tool args or CLI `--session-id`)
2. `extra.sessionId` (transport metadata from MCP SDK)
3. `process.env.CODEX_THREAD_ID` (Codex runtime env)
4. `FALLBACK_SESSION_TRACKING_ID` (generated fallback)

**2. CLI session propagation: identical to MCP.** The proposed CLI passes `--session-id <value>` which maps to `args.sessionId` — the same resolution path as MCP tool args. No code change needed. [SOURCE: context-server.ts:525-526]

**3. Non-Codex runtime sessionId sources:**

| Runtime | Session source | Mechanism |
|---|---|---|
| Codex CLI | `CODEX_THREAD_ID` env var | Auto-injected by Codex runtime |
| Claude Code | `args.sessionId` via hooks | `hooks/claude/user-prompt-submit.ts` passes session context |
| OpenCode | `args.sessionId` via plugin | Plugin injects session state |
| CLI (proposed) | `--session-id` flag | Explicit CLI arg → `args.sessionId` |

**4. Session dedup uses sessionId.** The `session_sent_memories` table tracks `(session_id, memory_hash)` pairs to prevent duplicate sends. The sessionId is the same value regardless of whether it came from MCP or CLI. [SOURCE: mcp_server/lib/session/session-manager.ts:444-536]

**5. Working-memory continuity.** The `session_state` table stores `(session_id, ...)` for working-memory context. `session_bootstrap` and `session_resume` both use sessionId as the key. CLI calls with the same sessionId as MCP calls share the same working memory. [SOURCE: mcp_server/handlers/memory-context.ts:1139]

**6. Sticky session fallback.** A module-global `lastKnownSessionId` (context-server.ts:542) provides follow-on tool correlation for tools that lack an explicit sessionId param. This works for both MCP and IPC clients since they share the same process.

### Classification: **RESOLVED**
Session identity resolution is transport-agnostic. The CLI's `--session-id` flag maps to `args.sessionId`, the same path as MCP. Non-Codex runtimes use hooks/plugins to inject sessionId. The dedup, learning, and working-memory code paths are sessionId-keyed and agnostic to the transport layer.

---

## RQ8: Build/Activation Drift — MITIGATED

### Question
shim→dist staleness; launcher bootstrap-lock coverage of the CLI handoff.

### Findings

**1. Dist-freshness test exists.** `dist-freshness.vitest.ts` compares source `.ts` mtimes against compiled `.js` mtimes for canonical exports. If source is newer than dist, the test fails. This catches build drift in CI. [SOURCE: mcp_server/tests/dist-freshness.vitest.ts:38-50]

**2. Shim→dist dependency chain.** The proposed CLI shim (`.opencode/bin/spec-memory.cjs`) would `require()` the compiled `dist/spec-memory-cli.js`. If `spec-memory-cli.ts` is edited without `npm run build`, the shim runs stale compiled code. [SOURCE: ../../cli-backend/lineages/gpt/research.md:72-73]

**3. Bootstrap lock coverage.** The launcher's `acquireBootstrapLock()` uses `mkdir` (atomic on POSIX) with stale reclaim after 5 minutes (`BOOTSTRAP_LOCK_STALE_MS = 300000`). This prevents concurrent builds from corrupting the dist output. [SOURCE: mk-spec-memory-launcher.cjs:94, 1151-1193]

**4. Existing build tooling.** `npm run build` (TypeScript compilation) and `npm run typecheck` under the mcp_server package already handle the source→dist pipeline. The CLI would be another entry in this pipeline. [SOURCE: ../../cli-backend/lineages/gpt/research.md:83]

**5. Mitigation: the CLI should include a dist-freshness check.** The shim can check if `dist/spec-memory-cli.js` exists and is newer than `spec-memory-cli.ts` before executing. If stale, print a warning and exit 69. This mirrors the existing `dist-freshness.vitest.ts` pattern.

### Classification: **MITIGATED**
Design delta: the CLI shim must include a dist-freshness check (warn + exit 69 if source newer than dist). The existing `dist-freshness.vitest.ts` catches drift in CI. The bootstrap lock prevents concurrent build corruption.

---

## New Risks Discovered

None.

## Ruled-Out Approaches

- Dynamic TypeScript compilation at CLI invocation: too slow, defeats the purpose of pre-compiled dist
- Removing the shim layer: the shim provides env loading, socket probe, and auto-spawn; it is the correct architecture

## Next Focus

Iteration 5: RQ9 (Dual-client load) + RQ10 (Effort reconciliation) + RQ11 (Platform/socket constraints)
