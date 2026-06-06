# RCAF DEEP REVIEW — ITERATION 8 — second adversarial pass

## ROLE
Expert reviewer. Concise, file:line evidence. WRITE BOTH iteration-008.md AND delta JSONL.

## CONTEXT
Iter 8 of 10. Cumulative F-001..F-030. Status: 0 P0 / 15 P1 / 13 P2.
**Critical instruction**: iter-7 printed findings to stdout but did NOT write the markdown + JSONL files. You MUST write both files this iter. Use the `write_file` or `edit_file` tool explicitly.

## ACTION

**Focus**: second adversarial sweep + areas prior iters skipped.

**Step 1: Storage edge cases**
- Read `lib/coverage-graph/coverage-graph-db.ts` end-to-end. Check:
  - WAL mode enabled? (better-sqlite3 default)
  - PRAGMA journal_mode + synchronous correctly set for crash safety?
  - Schema version tracking (CREATE TABLE schema_migrations?)
  - Any prepared statement leaks?
- Read the actual `.sqlite` file metadata: is the schema what coverage-graph-db.ts expects, or was it created by an older migration?

Cite file:line. P1 for crash-unsafe; P2 for missing best-practices.

**Step 2: Test isolation + cleanup**
- Sample 3 vitest files. Verify:
  - `afterEach` / `afterAll` cleanup of temp dirs, locks, DB connections
  - Tests don't leak state between runs (deterministic order-independence)
  - No hardcoded absolute paths

Cite file:line. P1 for flaky tests; P2 for cleanup gaps.

**Step 3: Script error-path coverage**
- For each .cjs script, identify the error paths:
  - Missing required arg → exit 3?
  - DB connection fails → exit 2?
  - Invalid JSON in input → exit 3?
  - Lib function throws → exit 1?
- Are all error paths tested by the `*-script.vitest.ts` integration tests?

Cite file:line. P1 for untested error paths; P2 for stylistic.

**Step 4: Documentation completeness vs reality**
- For each lib/*.ts file, sample 2-3 exported functions. Verify the JSDoc / module header describes what the function actually does (no stale docs).

Cite file:line. P2 for doc drift.

**Step 5: WRITE BOTH FILES**

`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/iterations/iteration-008.md`:
```markdown
# Iteration 8 — Second Adversarial Pass

## Summary
...

## Findings
### P0
### P1
### P2

## Convergence Signal
- newFindings: <N>
- Cumulative: ...
```

`.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/deltas/iter-008.jsonl`:
```jsonl
{"iter":8,"finding_id":"F-031","severity":"P1","dimension":"...","file":"...","title":"...","evidence":"...","fix":"..."}
```

REQUIRED: write BOTH files via tool calls. Do not just print to stdout.

After writing:
`ITER-8 DONE: <P0>/<P1>/<P2>, dimensions=adversarial-pass-2`
