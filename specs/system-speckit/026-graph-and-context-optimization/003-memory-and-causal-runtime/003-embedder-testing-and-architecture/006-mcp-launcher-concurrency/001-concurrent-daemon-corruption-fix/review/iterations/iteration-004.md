Completed iteration 4 for the maintainability dimension. Found 1 P1 issue (hardcoded SQLite error code list in WAL fallback) and 3 P2 issues (DB-dir override logic duplication, undocumented hard-coded timeout constants, custom env var parsing). All findings include file:line citations and suggested fixes. The verdict is CONDITIONAL due to the P1 finding.
ide logic duplication, undocumented hard-coded timeout constants, custom env var parsing instead of standard library). These are distinct from prior iteration findings which focused on correctness, security, and traceability.

## Findings

### [P1] Hardcoded SQLite error code list in WAL pragma fallback
- File: `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:292-298`
- Evidence: The WAL pragma fallback catches specific error codes: `EACCES`, `EROFS`, `SQLITE_READONLY`, `SQLITE_CANTOPEN`, `SQLITE_IOERR_WRITE`. This is a hardcoded list that may become stale as SQLite error codes evolve across versions.
- Impact: If SQLite adds new error codes for read-only filesystem scenarios in future versions, the fallback will not handle them, causing the launcher to fail instead of gracefully degrading to DELETE journal mode. This is a maintainability risk that could cause runtime failures after SQLite upgrades.
- Suggested fix: Extract the error code list to a documented constant with a comment explaining which SQLite versions these codes cover, or use a more general error detection pattern (e.g., catch all filesystem-related error codes via regex on error message or error class).

### [P2] DB-dir override logic duplicated across 3 locations
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:118-124`, `.opencode/bin/mk-skill-advisor-launcher.cjs:131-137`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:207-220`
- Evidence: Three separate functions implement the same DB-dir override pattern: `advisorDbPath()` (lines 118-124), `leasePath()` (lines 131-137) in launcher.cjs, and `resolveSkillGraphDbDir()` (lines 207-220) in skill-graph-db.ts. All use `process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR` with `path.resolve()`.
- Impact: Violates DRY principle. Future changes to the override logic (e.g., adding validation, supporting a new env var, changing precedence) must be made in 3 places, increasing the risk of inconsistencies and bugs.
- Suggested fix: Extract the override logic to a shared utility function in a common module (e.g., `lib/utils/db-path.ts`) and import it in all three locations.

### [P2] Hard-coded timeout constants scattered and undocumented
- File: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts:51-52`, `.opencode/bin/mk-skill-advisor-launcher.cjs:65`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:287`
- Evidence: `DEFAULT_STALE_AFTER_MS = 30_000`, `DEFAULT_HEARTBEAT_MS = 5_000` in lease.ts; `BOOTSTRAP_LOCK_TIMEOUT_MS = 120_000` in launcher.cjs; `busy_timeout = 5000` in skill-graph-db.ts. No documentation explains why these specific values were chosen or what the operational trade-offs are.
- Impact: Future maintainers cannot reason about whether these values are appropriate for different deployment scenarios (high-latency networks, slow disks, different workloads). Changes require trial-and-error instead of informed decisions.
- Suggested fix: Add inline comments or a constants documentation file explaining the rationale for each timeout value (e.g., "30s stale-after allows for process crash + OS cleanup; 5s heartbeat is 6x faster than stale detection to avoid false positives").

### [P2] Custom env var parsing instead of standard library
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:19-40`
- Evidence: The `loadEnvFile()` function implements a minimal env var parser with basic key-value matching and quote stripping, instead of using a standard library like `dotenv` which handles edge cases (comments, multiline values, variable expansion, escaped characters).
- Impact: Reinvents a solved problem. The custom parser may miss edge cases that operators expect (e.g., values with internal spaces, shell-style variable expansion, multiline secrets). Maintenance burden for handling new edge cases falls on this codebase.
- Suggested fix: Replace the custom parser with `dotenv` or a similar well-maintained library, or document the exact subset of .env syntax that is supported and explicitly reject unsupported patterns with clear error messages.

## Notes

Dimension coverage: maintainability reviewed across code duplication, hard-coded constants, custom parsing logic, and error code handling. The implementation is generally clean and well-structured, with clear function separation and reasonable abstractions. The lease primitive (lease.ts) is well-designed with exported interfaces and testable internals. The launcher (launcher.cjs) follows a clear main() flow with signal handling and cleanup. The DB layer (skill-graph-db.ts) has good separation between lifecycle, schema, and indexing concerns. The findings above are hygiene and polish issues that improve maintainability but do not indicate fundamental design flaws. Prior iterations found correctness (iteration-001), security (iteration-002), and traceability (iteration-003) issues; these maintainability findings are distinct and complementary.

Review verdict: CONDITIONAL