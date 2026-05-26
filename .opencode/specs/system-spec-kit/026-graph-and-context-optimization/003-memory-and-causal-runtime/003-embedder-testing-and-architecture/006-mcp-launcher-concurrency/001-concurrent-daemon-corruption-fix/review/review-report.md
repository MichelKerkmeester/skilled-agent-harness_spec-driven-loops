# Deep-Review Report — 001

- Scope: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix`
- Session: rvw-001-20260518-095042
- Iterations: 8 of 8 allocated
- Stop reason: max-iterations reached
- Completed: 2026-05-18T09:59:12Z

## Per-Iter Verdicts

| Iter | Dimension | P0 | P1 | P2 | Verdict |
|---|---|--:|--:|--:|---|
| 001 | correctness | 0 | 1 | 0 | CONDITIONAL |
| 002 | security | 0 | 0 | 2 | CONDITIONAL |
| 003 | traceability | 0 | 1 | 0 | CONDITIONAL |
| 004 | maintainability | 0 | 1 | 3 | CONDITIONAL |
| 005 | correctness | 0 | 0 | 0 | PASS |
| 006 | security | 0 | 1 | 3 | CONDITIONAL |
| 007 | traceability | 0 | 1 | 0 | CONDITIONAL |
| 008 | maintainability | 0 | 0 | 1 | PASS |

## Findings Aggregate

(Concatenated findings from all iters; review individual iter files for full evidence.)


### From iteration-001.md


### [P1] Missing integration test for REQ-001 launcher exit behavior
- File: `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts:85-133`
- Evidence: REQ-001 acceptance criteria states "Spawning launcher #2 while #1 is alive: #2 exits with code 0 within 2 seconds, prints LEASE_HELD_BY:<owner-pid>, does NOT open the SQLite file." The actual test suite only contains unit tests for isLeaseHeld() semantics (lines 96-119) and WAL pragma assertion (lines 121-132). No test actually spawns the launcher process twice via child_process.spawn and asserts exit code 0 and stdout containing LEASE_HELD_BY:<pid>.
- Impact: The critical user-facing behavior is not verified. Unit tests on isLeaseHeld() do not prove the launcher.cjs exit logic (lines 356-377) works end-to-end, including the env var gate and the actual process.exit(0) call.
- Suggested fix: Add an integration test in launcher-bootstrap.vitest.ts that uses child_process.spawn to launch mk-skill-advisor-launcher.cjs twice, asserting the second spawn exits with code 0 within 2s and stdout contains LEASE_HELD_BY:<pid>. This is acknowledged in implementation-summary.md limitation #1 as deferred but should be completed for full correctness coverage.


### From iteration-002.md


### From iteration-003.md


### From iteration-004.md


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


### From iteration-005.md


No new correctness findings in this iteration. All correctness issues were identified in prior iterations:
- Iteration-001 (correctness): P1 missing integration test for REQ-001 launcher exit behavior
- Iteration-002 (security/correctness): P1 DB-dir override false-negative, P2 TOCTOU race in isLeaseHeld()
- Iteration-003 (traceability): P1 REQ-004 stale-PID reclamation lacks test coverage, P1 SC-003 three-DB-open paths test coverage incomplete


### From iteration-006.md


### [P1] CHK-015 incomplete — lease file workspace-local constraint not verified
- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix/checklist.md:96`
- Evidence: CHK-015 states "Lease file is workspace-local. `.mk-skill-advisor-launcher.json` resolves under `.opencode/skills/system-skill-advisor/mcp_server/database/`; no absolute paths escape workspace root." This is marked incomplete in checklist.md. However, the implementation in launcher.cjs:118-124 and lease.ts:131-137 uses `process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR` with `path.resolve()`, which allows arbitrary filesystem locations. The lease file is not constrained to the workspace root when DB-dir override is used.
- Impact: Operators who use DB-dir override can place the lease file outside the workspace, violating the intended security boundary that CHK-015 is supposed to enforce. This could allow lease file placement in system directories or other workspaces, creating cross-workspace interference or privilege escalation risks if an attacker can influence the environment.
- Suggested fix: Either (1) add path validation to restrict DB-dir override to subdirectories of the workspace root, (2) reject DB-dir override when MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER=1, or (3) update CHK-015 to acknowledge the override exception and require operator acknowledgment. Complete CHK-015 with evidence of the chosen approach.

### [P2] CHK-016 incomplete — PID-spoofing attack surface not fully verified
- File: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix/checklist.md:97`
- Evidence: CHK-016 states "No PID-spoofing attack surface. Launcher only does `kill -0 <pid>` (existence probe), never `kill <signal> <pid>` against the recorded owner." This is marked incomplete in checklist.md. The implementation in lease.ts:161 correctly uses `process.kill(snapshot.pid, 0)` for liveness probing only. However, the checklist item itself is not verified with evidence (e.g., grep output showing no other signal types, test coverage for the liveness probe).
- Impact: The security constraint is not formally verified. While the code appears correct (only signal 0 is used), the lack of verification evidence means future changes could inadvertently introduce signal-based attacks without detection.
- Suggested fix: Complete CHK-016 with grep evidence (e.g., `rg 'process\.kill.*pid' .opencode/bin/mk-skill-advisor-launcher.cjs .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` showing only signal 0 usage) and/or add a vitest case that mocks process.kill and asserts only signal 0 is called.

### [P2] Custom env var parser lacks validation for dangerous patterns
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:19-40`
- Evidence: The `loadEnvFile()` function implements a minimal env var parser with basic key-value matching and quote stripping (lines 26-32). It does not handle edge cases like multiline values, shell-style variable expansion, escaped characters, or values with internal spaces. The regex `^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$` accepts any value after `=`, including potentially dangerous patterns.
- Impact: If an operator or malicious actor can influence the .env file content, they could inject unexpected values that bypass intended security controls (e.g., setting MK_SKILL_ADVISOR_DB_DIR to a path containing special characters, or using multiline values to confuse the parser). However, in practice this is low-risk because the operator typically controls their environment and the parser is conservative.
- Suggested fix: Either (1) replace the custom parser with a standard library like `dotenv` which handles edge cases, or (2) document the exact subset of .env syntax supported and explicitly reject unsupported patterns with clear error messages (e.g., reject values containing newlines or unescaped quotes).

### [P2] DB-dir override allows arbitrary filesystem access without validation
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:118-124`, `.opencode/bin/mk-skill-advisor-launcher.cjs:131-137`, `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:207-220`
- Evidence: Three separate functions implement the same DB-dir override pattern: `advisorDbPath()` (launcher.cjs:118-124), `leasePath()` (launcher.cjs:131-137), and `resolveSkillGraphDbDir()` (skill-graph-db.ts:207-220). All use `process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR` with `path.resolve()` without any validation to ensure the resolved path is within the workspace root or a safe location.
- Impact: An attacker who can set these environment variables (e.g., via compromised CI script, malicious subprocess, or social engineering) can redirect the SQLite database and lease files to arbitrary filesystem locations, potentially overwriting sensitive files or exfiltrating data. However, in practice this is low-risk because the operator typically controls their environment.
- Suggested fix: Add path validation to restrict DB-dir overrides to subdirectories of the workspace root, or add a warning log when an override is used pointing outside the workspace. This complements the P1 CHK-015 finding by addressing the implementation-level hardening.


### From iteration-007.md


### From iteration-008.md


## Notes

This report was generated by the minimal-viable driver `run-deep-review-arc.sh`. It does NOT run the canonical YAML reducer / dashboard / composite-convergence math. Per-iter findings are equally valid as a canonical dispatch would produce; the simplified concatenation here is the only deviation from canonical synthesis.
