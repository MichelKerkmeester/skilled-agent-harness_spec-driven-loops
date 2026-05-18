Completed iteration 8 for the maintainability dimension. Found 2 P2 issues:

1. **skill-graph-db.ts is very large with mixed concerns** - The file is 1149 lines and mixes database lifecycle, schema management, metadata helpers, indexing logic, and other concerns, making it hard to navigate and maintain.

2. **Error messages in launcher.cjs could be more actionable** - Error messages describe what went wrong but lack remediation guidance, increasing debugging time for operators.

Both findings are distinct from iteration-4's maintainability issues (hardcoded SQLite error codes, DB-dir override logic duplication, undocumented timeout constants, custom env var parsing). No P0 or P1 maintainability issues were found.

**Review verdict: PASS**
ll-graph-db.ts:1-1149`
- Evidence: The file is 1149 lines long and mixes multiple concerns: database lifecycle, schema management, metadata helpers, indexing logic, embedding refresh, skill graph queries, and rebuild operations. Sections 4-7 (lines 200-602) show database lifecycle, metadata, indexing helpers, and the indexer all in one file.
- Impact: Large files with mixed concerns are harder to navigate, test, and reason about. Future changes require understanding the entire file context, increasing cognitive load and risk of unintended side effects. The file size exceeds typical maintainability guidelines (often 300-500 lines per module).
- Suggested fix: Consider splitting skill-graph-db.ts into focused modules: `db-lifecycle.ts` (initDb, getDb, closeDb), `db-schema.ts` (SCHEMA_SQL, migrations), `metadata.ts` (get/set metadata helpers), `indexer.ts` (indexing logic), and keep the main file for public API exports and coordination.

### [P2] Error messages in launcher.cjs could be more actionable
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:175, 241, 251, 288`
- Evidence: Error messages like `${command} ${args.join(' ')} exited ${result.status}` (line 175), `system-skill-advisor not found at ${rel(kitDir)}` (line 241), `bootstrap finished but artifacts are still missing: ${missing.map(rel).join(', ')}` (line 251), and `bootstrap lock timed out at ${rel(lockDir)}` (line 288) describe what went wrong but lack remediation guidance.
- Impact: Operators encountering these errors must infer the next steps. For example, the "bootstrap lock timed out" error does not explain whether to manually delete the lock, wait longer, or check for stuck processes. This increases debugging time and operational friction.
- Suggested fix: Enhance error messages with actionable guidance, e.g., "bootstrap lock timed out at <path>; delete the lock directory manually if no other launcher is running, or investigate stuck processes with `lsof | grep skill-graph`".

## Notes

Dimension coverage: maintainability reviewed across code organization, file size, error message clarity, and documentation alignment. The implementation is generally clean with clear function separation in lease.ts (well-designed interfaces, testable internals) and launcher.cjs (clear main() flow with signal handling). The daemon-lease-contract.md was updated to document the launcher-boundary enforcement and WAL pragmas, showing good documentation discipline. Prior iteration-4 found P1 hardcoded SQLite error codes and P2 issues (DB-dir override logic duplication, undocumented timeout constants, custom env var parsing). The findings above are distinct new maintainability opportunities not covered in iteration-4. No P0 or P1 maintainability issues were found in this iteration.

Review verdict: PASS