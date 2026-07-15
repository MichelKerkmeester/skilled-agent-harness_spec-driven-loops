# Iteration 4 — Issue C: Index-Wipe Regression

## METADATA
- Iteration: 4 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 3 — Issue C: index-wipe regression (0-node persist)

## INVESTIGATION
Read the deep-research charter, iterations 001-003, the native-rerun synthesis, and the native-rerun trial log. Then traced the destructive write path through:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- Adjacent tests in `code_graph/tests/code-graph-scan.vitest.ts` and `code_graph/tests/code-graph-atomic-persistence.vitest.ts`

Answer to the focus question: yes. A non-incremental scan can overwrite a populated graph with a zero-node state. The handler removes every tracked DB file absent from the new `indexFiles()` result set before checking whether the new scan produced any usable graph, and there is no guard that preserves the previous non-empty graph when `totalNodes` becomes 0.

## FINDINGS
- P0 `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:292` — full-scan pruning deletes every previously tracked file that is not present in the current scan result set, so a scope-mismatched scan with `results.length === 0` removes the existing populated graph before any replacement graph exists; recommended remediation: compute previous stats before pruning and block/quarantine full-scan persistence when previous `totalNodes > 0` and the candidate scan would persist `totalNodes === 0`, unless the user explicitly requests destructive reset.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:335` — scan metadata is updated even after a zero-node or errored scan: `last_git_head`, detector provenance summary, and code-graph scope are written without requiring `filesIndexed > 0` or `errors.length === 0`; recommended remediation: only promote scope/head/provenance metadata after a successful usable scan, or persist failed-scan metadata separately so readiness/status do not treat a failed empty scan as the live baseline.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:517` — `replaceEdges()` inserts supplied edges even when `sourceIds.length === 0`, which allows files with zero retained source nodes to add orphan edges; recommended remediation: filter edges to retained source IDs at the persistence boundary or reject edge persistence when there are no source nodes, and run `cleanupOrphans()` after destructive full-scan pruning.
- P2 `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:285` — scan tests assert normal removal of stale tracked files but do not cover the native regression shape, where a populated DB is followed by a full scan returning zero nodes; recommended remediation: add a regression test that seeds non-zero stats/tracked files, returns an empty or zero-node `indexFiles()` result, and asserts the handler blocks or preserves the prior graph instead of calling `removeFile()` across the old index.

## EVIDENCE
Native-rerun baseline:

```text
../002-native-deferred-trial-rerun/trials/trial-log.jsonl:
N-CG-001 first_scan_includeSkills_true: filesIndexed=9280 totalNodes=56843 totalEdges=36347.
N-CG-005 second_scan_default_scope: totalNodes=0 totalEdges=764 previousTotalNodes=56843 parserCrashCount=10.
N-CG-006 outline_query_sk_code_skill: error="graph is empty (0 nodes)".
N-CG-007 third_scan_includeSkills_true_recovery: totalNodes=0 totalEdges=764 parserCrashCount=10.
```

The native synthesis describes the same chain: broad scan succeeds, read queries block on manifest drift, default-scope scan excludes active system code and persists `totalNodes: 0`, then returning to `includeSkills:true` does not recover.

Destructive full-scan pruning:

```text
scan.ts:279 calls indexFiles(config, { skipFreshFiles: effectiveIncremental }).
scan.ts:290-299 branches on effectiveIncremental; full scans build indexedPaths from current results and call graphDb.removeFile(filePath) for every tracked file not in indexedPaths.
code-graph-db.ts:633-645 removeFile() deletes matching code_edges and then deletes the code_files row; code_nodes cascade from the file row.
scan.ts:392-401 reports post-persist DB counts from graphDb.getStats(), so the response reflects the now-pruned DB, not a protected candidate graph.
```

No zero-node guard was found on the scan path:

```text
scan.ts:284-288 initializes filesIndexed, totalNodes, and totalEdges to zero.
scan.ts:301-329 only increments totals while persisting current results.
scan.ts:331-342 writes detector/git/scope metadata without checking totalNodes or filesIndexed.
scan.ts:348-354 records the candidate manifest only for full scans with errors.length === 0, but this is after pruning and does not protect the prior graph.
scan.ts:366-368 skips cross-file call resolution when filesIndexed is 0.
scan.ts:392-401 reads DB stats and returns those counts.
```

Persistence layer details:

```text
code-graph-db.ts:463-479 upsertFile() updates or inserts a file row.
code-graph-db.ts:483-514 replaceNodes() deletes old nodes and deletes edges whose source or target was one of those old node IDs before inserting new nodes.
code-graph-db.ts:517-535 replaceEdges() deletes source edges only when sourceIds.length > 0, then inserts every supplied edge.
ensure-ready.ts:464-482 persistIndexedFileResult() stages the file, replaces nodes, replaces edges, and finalizes the file row in one per-file transaction.
```

Tests cover atomic per-file writes and ordinary stale-file removal, but not index-wipe preservation:

```text
code-graph-atomic-persistence.vitest.ts:56-142 verifies per-file transaction rollback when node replacement or finalize fails.
code-graph-scan.vitest.ts:285-343 verifies full reindex removes a stale tracked file during a normal one-file replacement.
code-graph-scan.vitest.ts:967-993 verifies incremental deleted-file cleanup.
```

Search result for the requested SQL patterns:

```text
No INSERT OR REPLACE was found in scan.ts or code-graph-db.ts.
code-graph-db.ts:486 uses INSERT OR IGNORE for code_nodes.
code-graph-db.ts:495 deletes code_nodes for a file before reinserting.
code-graph-db.ts:500 and code-graph-db.ts:528 delete code_edges during node/edge replacement.
code-graph-db.ts:643 deletes code_edges during removeFile().
```

## NEW INSIGHTS
- The wipe is not caused by `INSERT OR REPLACE`. It is caused by pre-persistence full-scan pruning against the current result set.
- The current design treats a full scan as authoritative even when it produces no usable graph, so scope mismatches and parser failures can become destructive write events.
- The native `0 nodes / 764 edges` shape is plausible from the persistence layer: `replaceEdges()` can insert edges when `sourceIds` is empty, and no orphan cleanup runs on the scan path after pruning.
- `recordCandidateManifest()` is not a protection mechanism for this regression. It runs after pruning, only when there are no errors, and only records the current tracked-file set.

## OPEN QUESTIONS
- Should the remediation quarantine only `totalNodes === 0`, or should it also reject severe drops such as `previousTotalNodes > 1000` and `candidateTotalNodes / previousTotalNodes < 0.1` unless forced?
- Should code graph maintain separate staged scan tables and promote them only after verification, instead of mutating the live graph during scan?
- Should `removeFile()` also invoke orphan cleanup, or should orphan cleanup remain a separate post-scan sweep to avoid expensive per-file work?
