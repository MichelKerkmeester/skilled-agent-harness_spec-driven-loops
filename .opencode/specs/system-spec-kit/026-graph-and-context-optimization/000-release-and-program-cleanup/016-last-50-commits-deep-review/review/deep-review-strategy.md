# Deep Review Strategy — last 50 commits

## Review Target
- **Range:** `a9e9bdb0a5^..HEAD` (50 commits, HEAD `12de3d3a7e`). Target type: files (diff surface).
- **Reviewable code:** ~57 source + 64 test + ~195 config files; docs/changelogs (1314) + spec-metadata (183) under the docs angle. Concentration: `system-spec-kit/mcp_server/**`, `.opencode/bin/lib/*.cjs` + `*-launcher.cjs`, `shared/ipc/socket-server.ts`, `shared/embeddings/**`, advisor, code-graph, deep-loop-runtime, doctor scripts.
- Resolve per-angle files with: `git diff --name-only a9e9bdb0a5^..HEAD -- <angle path globs>`.

## Convergence
maxIterations 20, convergenceThreshold 0.10 (weighted P0=10/P1=5/P2=1 newFindingsRatio). Read-only — findings only, NO fixes. Every P0/P1 MUST carry file:line evidence tied to a verified code fact; adversarially verify P0s before reporting.

## Review Charter — 9 angles mapped to canonical dimensions
Each iteration covers the next dimension; within it, work the listed angles + hypotheses.

### correctness (highest risk — most iterations)
- **A1 launcher/IPC concurrency:** lease-CAS TOCTOU + heartbeat/proxy-stdout collision (`bin/mk-spec-memory-launcher.cjs` ~355-432); stale-heartbeat reclaim boundary; owner socket-path staleness (`bin/lib/launcher-ipc-bridge.cjs` ~344-350); cross-launcher inconsistency (advisor has NO owner-lease; code-index missing socketPath/JSON-RPC-error/proxy); socket-server copy drift vs code-index copy.
- **A2 memory-write & async enrichment:** partial-write/crash safety (`handlers/memory-save.ts` ~2860-2897, `handlers/save/enrichment-state.ts`); default-on enrichment blast radius (archived vs deprecated rows; auto-fix mutating content before link resolution); execution-status collapse (`handlers/save/post-insert.ts` ~435-499); error-class regressions E081→E085-089 (`handlers/save/response-builder.ts` ~495-533); entity-density cache invalidation completeness.
- **A3 causal/relation-inference:** conflict-guard edge-invalidation incl reciprocal + 3-node transitive contradiction cycles (`lib/causal/relation-backfill.ts` ~670-709, `lib/graph/contradiction-detection.ts`); honest-count delta on re-run/upsert (~532-575); dryRun default safety; causal_unlink tombstones.
- **A4 shutdown durability & lifecycle:** WAL-checkpoint-on-close data-loss window (`context-server.ts` ~1592/2169, `lib/runtime/shutdown-hooks.ts`); socket close() missing parent-dir fsync → stale-socket EADDRINUSE (`shared/ipc/socket-server.ts` ~363-387); dispose() idempotency / module-global socket leaks.

### security
- **A5 security & input robustness:** validator entry-guard bypass via programmatic `validateFolder()` import (`lib/validation/orchestrator.ts` ~456-462); socket-path tail-symlink TOCTOU (canonicalize realpaths ancestor only, re-appends raw tail) + `isWithinRoot` prefix matching; resource-exhaustion/symlink P0 follow-through.

### traceability
- **A7 MCP contract & API parity:** 37-tool registry + TOOL_LAYER_MAP (causal_unlink); schema acceptance (includeEmbeddings, memory_health); error-code contract honesty (`backfillJob.implemented=false`).
- **A8 config & gemini-removal completeness:** `_NOTE_` parity across opencode.json/.claude/mcp.json/.codex/config.toml/.devin/config.json; dangling refs after the 123-path gemini deletion (configs, agent mirrors, docs, scripts); constitutional pruning correctness.
- **A9 docs & changelog accuracy:** accuracy of the 33 AI-authored changelogs from this session vs the code (no invented verification, correct verdicts/counts); doc-drift in changed READMEs/playbook/feature-catalog.

### maintainability
- **A6 test integrity & verification honesty:** un-skipped launcher-lease tests still racy on socket-listen timing (`tests/launcher-lease.vitest.ts`); auto-fix-default coverage reduced (`tests/quality-loop.vitest.ts`); contradiction-cycle test gap; deep-loop fan-out non-zero-exit-counted-as-success.

## Iteration plan (dimension/angle rotation, weighted to risk)
1. Inventory pass: map the 50-commit code surface, file types, hotspots; no findings required.
2-6. correctness: A1 / A2 / A3 / A4 / (revisit A1+A2 hotspots).
7-8. security: A5 (entry-guard, socket TOCTOU) + A4∩A5 lifecycle-security overlap.
9-11. traceability: A7 / A8 (gemini-removal dangling refs) / A9 (changelog accuracy vs code).
12-13. maintainability: A6 test integrity / dead-code + advisory honesty.
14-20. Adversarial verify of all P0/P1; revisit least-covered dimension; deepen any open hotspot; converge.

## Progress Log

### Running finding counts (cumulative)
- **P0:** 0 | **P1:** 2 (F-002, F-003) | **P2:** 2 (F-004, F-005)

### Dimension status
- **correctness:** in progress — A1 complete (iter 2, score 0.62). Remaining: A2 (iter 3), A3 (iter 4), A4 (iter 5).
- **security:** not started (iters 7-8).
- **traceability:** not started (iters 9-11).
- **maintainability:** not started (iters 12-13).

### What Worked
- **iter 2 (A1):** Cross-launcher token-grep parity + `diff -u` of the socket-server copies surfaced two real drift defects fast; reading the full `classifyOwnerLease`/`acquireOwnerLeaseFile` sequence (not just the cited lines) exposed the EPERM-before-heartbeat ordering bug the charter did not anticipate.

### What Failed / Refuted
- **iter 2:** Charter A1 P0 hypotheses (lease-CAS reclaim TOCTOU; LEASE_HELD_BY/proxy stdout collision) were both DISPROVEN by reading the re-read serialization (383-384) and the proxy-owns-stdout comment (195-201). Charter claim "code-index missing owner-lease" is REFUTED (code-index has 9 owner-lease tokens); its real gap is sessionProxy=0.

### Exhausted Approaches
- A1 lease-CAS-TOCTOU-as-P0: BLOCKED (re-read serializes racers; do not retry as P0 — residual is durability F-004 only).
- A1 LEASE_HELD_BY-stdout-collision: BLOCKED (proxy owns stdout; raw marker intentionally unused).

### Carry-forward for adversarial-verify (iters 14-20)
- Re-assert F-002 (EPERM reclaim) and F-004 (reclaim durability) under skeptic challenge.
- F-003 (code-graph socket-server fork) feeds A5 (iter 7 security TOCTOU surface) and A6 (iter 12 drift-guard test gap).
- A1 revisit: cross-launcher session-proxy parity gap (code-index sessionProxy=0).

## Next Focus
- **Dimension:** correctness | **Angle:** A2 memory-write & async enrichment.
- **Target first:** `mcp_server/handlers/memory-save.ts` partial-write/crash safety + transaction rollback (~2860-2897, churn 307); then `handlers/save/enrichment-state.ts` deferral semantics, default-on enrichment blast radius (archived vs deprecated rows; auto-fix mutating content pre-link-resolution), exec-status collapse (`handlers/save/post-insert.ts` ~435-499), E081→E085-089 (`handlers/save/response-builder.ts` ~495-533), entity-density cache invalidation (`handlers/mutation-hooks.ts`).
- **Required evidence:** transaction boundary + rollback path; whether enrichment defers AFTER commit or mutates pre-commit; exact error-code constants; cache-invalidation call sites.

## Known Context
- This session shipped these 50 commits' tail (docs-drift remediation, gemini removal, 33 changelogs, timeline) and HIT a concurrent-session git-index race — runtime-coordination code is the top concern.
- Multiple Claude/codex sessions share this checkout; code-graph MCP is currently disconnected (optional code-example bootstrap unavailable; loop convergence graph + graphless fallback still apply).
