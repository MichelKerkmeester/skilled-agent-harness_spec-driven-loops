# iter-005 — SECURITY

**Dimension**: Security — DB integrity, MCP boundary, auth chain, trusted-caller validation, env-var leakage
**Date**: 2026-05-15
**Files Reviewed**: trusted-caller.ts, caller-context.ts, advisor-validate.ts, skill-graph/scan.ts, subprocess.ts, shadow-sink.ts, advisor-server.ts

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| S-001 | P2 | `advisor-validate.ts` spawns `python3 -c` passing full `process.env` to subprocess — env-var leakage surface | `advisor-validate.ts:296-304` | security/env-leakage |
| S-002 | P2 | `workspaceRoot` from untrusted caller args passed as argv to Python subprocess without path validation | `advisor-validate.ts:296` | security/input-validation |
| S-003 | P2 | Launcher loads `.env` and `.env.local` files and forwards entire env to child process — broad env surface | `mk-skill-advisor-launcher.cjs:12-40, 166` | security/env-surface |
| S-004 | P1 | `shadow-sink.ts` writes shadow deltas to path from env var `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` without sanitization | `shadow-sink.ts:44` | security/path-injection |

## Analysis

### MCP boundary: SOLID

- `AsyncLocalStorage`-based caller context propagation (`caller-context.ts`) isolates per-request state
- `trusted-caller.ts` provides explicit `requireTrustedCaller()` gate used by `skill-graph/scan.ts` and other state-modifying handlers
- `advisor-server.ts:198-203` `resolveTrustedCaller()` inspects `metadata.trusted`, `metadata.callerAuthority`, and `metadata.transport`
- Untrusted callers receive `UNTRUSTED_CALLER` rejection — no silent fallback to unauthenticated access

### DB integrity: GOOD

- `checkSqliteIntegrity` with `PRAGMA quick_check`
- all DB writes use parameterized queries (better-sqlite3 prepared statements)
- schema migrations use static `db.exec()` strings (not user-controlled)
- `skill-graph-db.ts` uses `renameSync` for atomic SQLite file replacement

### Auth chain: ADEQUATE

- Server → `buildCallerContext` → `runWithCallerContext` → `requireTrustedCaller` → handler
- Each state-modifying handler independently verifies trusted status
- Read-only handlers (advisor_status) do not require trusted caller — correct separation

### Env-var and path concerns: MINOR

S-001: `advisor-validate.ts:299` spreads `process.env` into subprocess env. This passes ALL env vars (including potentially sensitive ones like API keys for embeddings) to the Python parity scorer. Should whitelist only the env vars needed.

S-002: `workspaceRoot` from untrusted caller args is passed directly as `sys.argv[1]` to `python3 -c`. While the Python script uses it only for path resolution (not shell execution), a malicious value could cause unexpected behavior. Path validation before passing to subprocess would be safer.

S-004: `shadow-sink.ts:44` reads `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` from env and uses it as a file path without sanitization. If this env var is controllable by an attacker, it could write shadow data to arbitrary locations.

## Verdict: PASS with 1 P1, 3 P2 advisories
