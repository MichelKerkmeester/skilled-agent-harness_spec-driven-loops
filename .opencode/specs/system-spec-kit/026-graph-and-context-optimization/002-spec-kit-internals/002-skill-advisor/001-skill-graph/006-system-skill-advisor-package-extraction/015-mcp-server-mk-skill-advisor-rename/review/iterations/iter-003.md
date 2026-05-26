# Iteration 003: ROBUSTNESS

**Dimension**: Robustness — MCP launcher resilience, error handling, schema validation, edge cases

**Date**: 2026-05-14

**Executor**: opencode-go/deepseek-v4-pro

---

## Investigation Summary

Reviewed the launcher (`mk-skill-advisor-launcher.cjs`) and server (`advisor-server.ts`) for error handling robustness, signal handling, bootstrap resilience, and edge case coverage. The rename itself introduced no new behavioral paths — all robustness characteristics are inherited from the pre-rename code.

### Launcher Robustness (mk-skill-advisor-launcher.cjs)

| Aspect | Observation | Status |
|--------|-------------|--------|
| Bootstrap lock acquisition | Uses mkdir-based locking with 120s deadline, fallback when artifacts already ready | Adequate |
| Env file loading | Graceful — skips missing files, prints count loaded | Adequate |
| Artifact readiness check | Checks `dist/system-skill-advisor/mcp_server/advisor-server.js` exists before skipping build | Adequate |
| Build failure handling | Throws descriptive error if artifacts missing after build | Adequate |
| State file writes | Wraps in try/catch; writes success and failure states | Adequate |
| Signal forwarding | Forwards SIGINT/SIGTERM/SIGHUP to child process with 5s fallback exit | Adequate |
| Lock cleanup | Lockdir removed in finally block regardless of success/failure | Adequate |
| Path refresh | `refreshPaths()` called on startup to resolve all mk-prefixed paths | Adequate |

**Path correctness check**: The `serverEntrypoint()` at line 106 returns `dist/system-skill-advisor/mcp_server/advisor-server.js`. This uses the folder name `system-skill-advisor` in the dist path, which is correct per ADR-002. However, all launcher log prefixes, state file names, lockdir names, and command payloads correctly use `mk-skill-advisor-launcher`.

### Server Robustness (advisor-server.ts)

| Aspect | Observation | Status |
|--------|-------------|--------|
| Server registration | `{ name: 'mk_skill_advisor', version: '0.1.0' }` — correct | Adequate |
| Unknown tool handling | Returns `isError: true` with descriptive message | Adequate |
| Dispatch error handling | Catches errors in `CallToolRequestSchema` handler, returns JSON error | Adequate |
| Shutdown | Graceful shutdown on SIGINT/SIGTERM with daemon cleanup and DB close | Adequate |
| Startup scan failure | Catches errors in `startupSkillGraphScan`, logs warning, does not crash | Adequate |
| DB availability | `initSkillGraphDb` called before scan; scan errors are non-fatal | Adequate |
| Chokidar loading | Throws descriptive error if watch factory fails to load | Adequate |
| Log prefix | All log prefixes use `[mk-skill-advisor-launcher]` — consistent | Adequate |

### Edge Cases

| Edge Case | Handling | Status |
|-----------|----------|--------|
| Old `.skill-advisor-launcher.json` state file | Renamed via `git mv`; new launcher reads only `.mk-skill-advisor-launcher.json`. If old state file somehow persists, it's ignored. | Low risk |
| Stale MCP sessions | Note in `implementation-summary.md` — sessions may need restart. Not a code issue. | Documented |
| SQLite DB churn | Launcher/smoke may dirty the DB file; kept out of commit scope. | Managed |
| Concurrent launcher instances | Bootstrap lock prevents concurrent builds. | Adequate |

---

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| F-005 | P2 | Launcher `buildIfNeeded` installs into dist without verifying dist output matches renamed log prefix | `mk-skill-advisor-launcher.cjs:119-137` | robustness |

### F-005: No post-build verification of mk-prefixed log output

**Rationale**: The `buildIfNeeded` function at `mk-skill-advisor-launcher.cjs:119-137` checks only that required artifact files exist (`artifactsReady()` checks `dist/system-skill-advisor/mcp_server/advisor-server.js`). It does not verify that the built dist output actually contains the expected `mk-skill-advisor-launcher` log prefix or `mk_skill_advisor` server name. If a stale dist with the old `system_skill_advisor` registration were present, the build might be skipped (since the file exists) even though the content is outdated. This was actually encountered during the original implementation — the first launcher smoke exposed stale dist output with the old log prefix, requiring a rebuild. The current code relies on the timestamp-based build system rather than content verification.

**Suggested Remediation**: Consider adding a content-based freshness check (e.g., hash of `advisor-server.ts` source vs stored hash in state file) or ensuring the build system uses content hashing. Alternatively, document that `npm run build` must be run after any source changes.

---

## Convergence Delta

New findings vs prior iterations: **1** (F-005). Cumulative: 2 P2 from iter-001 (F-001, F-002, F-003), 1 P2 from iter-002 (F-004), 1 P2 from iter-003 (F-005). No P0 or P1 findings.

## Dimension Coverage

| Dimension | Status |
|-----------|--------|
| ARCHITECTURE | Covered (iter-001) |
| CORRECTNESS | Covered (iter-002) |
| ROBUSTNESS | Covered (this iteration) |
| TESTING | Pending |
| DOCUMENTATION | Pending |
