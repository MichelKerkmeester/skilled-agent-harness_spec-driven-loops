# Research Synthesis: 026 Deep-Review Audit Root Causes

## 1. Executive Summary

The common root cause is contract governance drift. The audit findings are not one isolated stale-doc episode; they show repeated divergence between public MCP schemas, runtime input schemas, handler persistence behavior, generated metadata, and operator-facing docs. The cleanest example is governed ingest: the tool boundary accepts governance fields, validates them, and then drops them before the scan or async ingest path reaches indexing. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/tool-input-schemas.ts:455] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-index.ts:721]

Metadata drift is systemic. A read-only scan over 026/027 metadata found 732 graph-metadata files and conservative lower-bound drift buckets of 23 Draft specs marked graph-complete and 64 In Progress specs with completion docs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/status-mismatch-scan.json:2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/status-mismatch-scan.json:5]

Memory-correctness impact is real but uneven. Entity-density staleness is a bounded routing-quality bug; atomic save has a rare but real durability window; community fallback and causal edge writers are more serious because they can cross or omit scope constraints. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts:105] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts:360] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-search.ts:1006]

Security severity depends on the actual threat model. Under a local single-user MCP model, most P0-labeled issues should be calibrated as P1/high correctness or privacy-boundary defects. They become P0 only if tenant/user/agent scopes are treated as mutually untrusted principals on a shared server. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/scope-governance.ts:428]

Deep-loop fanout defects have high blast radius for multi-lineage artifacts because subprocess exit codes and concurrency semantics are not faithfully represented in the pool summary. The current eight source review slices are less suspect because each was single-lineage, but parent orchestration summaries alone are insufficient proof of subprocess success. [SOURCE: .opencode/skills/deep-loop-runtime/src/fanout-pool.cjs:207] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/orchestration-summary.tsv:2]

## 2. Method

This lineage followed the deep-research loop in three phases. Phase init bound artifact_dir directly to the fanout override and created lineage-local state. The main loop ran five iterations: review-cluster taxonomy, memory/security calibration, metadata systemicness, fanout blast radius, and convergence/negative knowledge. Synthesis emitted this research report and resource map inside the lineage artifact directory only.

No reviewed implementation files were modified. The lineages were analyzed from direct source reads, review registries, generated evidence summaries, and per-iteration deltas.

## 3. Source Inventory

Primary sources were the eight review registries, the memory/retrieval MCP implementation, graph metadata parser/tests, deep-loop fanout runtime, and sample drifted packet metadata. The resource map lists every source family used by this lineage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/resource-map.md:1]

## 4. Root Cause: Contract Governance Drift

The audit repeatedly finds one shape at the boundary and a different shape in execution. The memory_embedding_reconcile public schema uses mode values while the install guide still tells operators to use dryRun:false. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/tool-schemas.ts:342] [SOURCE: .opencode/skills/system-spec-kit/INSTALL_GUIDE.md:737]

Governed ingest is the strongest runtime example. The scan and ingest schemas include governance fields, and the implementation validates governed ingest. But scan calls indexSingleFile with only quality/fromScan/embedding options, and async ingest stores only id, paths, and specFolder in the job. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/tool-input-schemas.ts:455] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-index.ts:330] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-index.ts:721] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-ingest.ts:263]

The same pattern shows up in public schema omissions. memory_causal_stats advertises an empty input schema while the handler accepts a backfill object. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/tool-schemas.ts:454] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/causal-graph.ts:92]

Answer to Q1: the common root cause is missing contract enforcement across doc examples, public tool schemas, runtime validators, persistence metadata, and generated status outputs. Sweeping docs will not hold unless the contracts are executable and tested end-to-end.

## 5. Metadata Drift

Metadata drift is systemic. The graph metadata parser can derive complete from implementation-summary presence when checklist evidence is absent. [SOURCE: .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts:1030] The test suite explicitly encodes that fallback as expected behavior, so it is not merely a stale artifact accident. [SOURCE: .opencode/skills/system-spec-kit/graph/graph-metadata-schema.vitest.ts:310]

The scan result gives a scale signal: 732 graph-metadata files scanned, 623 with both graph and spec statuses, 381 raw status mismatches, 23 Draft specs marked graph-complete, and 64 In Progress specs with completion docs. The raw count is noisy because spec status strings are free-form, but the two conservative buckets are enough to show systemic drift. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/status-mismatch-scan.json:2]

A concrete 027 packet demonstrates the failure: the spec says Status Draft while graph-metadata derived status says complete. [SOURCE: .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/spec.md:48] [SOURCE: .opencode/specs/system-spec-kit/027-code-graph-mcp/003-incremental-index-foundation/graph-metadata.json:42]

Answer to Q2: systemic. The generator and packet conventions allow derived metadata to overstate readiness, and repeated renumbering/consolidation leaves stale IDs and links behind.

## 6. Memory Correctness Impact

Entity-density staleness is a correctness issue with bounded user impact. The cache is TTL-based and supports explicit invalidation, but memory update/title-trigger mutation paths do not invalidate the entity-density cache. That can under- or over-activate graph-channel routing for a short window. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts:105] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts:153] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/vector-index-mutations.ts:489]

Atomic save is a durability issue. The flow writes a pending file, indexes it, and later promotes the pending file. A crash or promotion failure between indexing and promotion can leave memory_index pointing at a final file that was not promoted. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts:360] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts:362] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/atomic-index-memory.ts:378]

Community fallback is a stronger scoped-correctness issue. Normal candidate generation has scope filters, but fallback community search has no scope parameter and the fetch by member IDs does not reapply tenant/user/agent scope. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/stage1-candidate-gen.ts:1069] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/community-search.ts:101] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-search.ts:1006]

Causal graph writes can create integrity drift because the public handler accepts bare IDs and insertEdge intentionally defers FK existence checks. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/causal-graph.ts:688] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/causal-edges.ts:279]

Answer to Q3: memory correctness findings matter, but their severity should be split by effect. Cache invalidation is transient retrieval quality. Atomic save is rare durability risk. Scope-bypassing fallback and bare-ID graph writes are the highest-impact correctness issues.

## 7. P0 Severity Calibration

P0 labels are overbroad unless the deployment treats tenant/user/agent scopes as mutually untrusted principals using the same MCP process. Scope helpers exist, which shows the intended authorization model, but some paths bypass or omit that model. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/scope-governance.ts:428]

Under local single-user MCP, a caller who can invoke memory_causal_link or memory_search is already trusted at the tool boundary. In that model, the bug is state corruption or privacy-boundary confusion, not unauthenticated remote compromise. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/causal-graph.ts:688] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-search.ts:1181]

Answer to Q4: calibrate most P0 findings to P1/high unless the product promise includes hard isolation between tenants/users/agents within one local server. The remediation should still be urgent because the code already models scope and then fails to enforce it consistently.

## 8. Deep-Loop Blast Radius

Fanout bugs can invalidate orchestration-level confidence. The runner uses spawnSync inside a capped pool worker, so nominal concurrency is serialized in practice. [SOURCE: .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:344]

Pool success accounting counts fulfilled worker promises rather than subprocess exit codes. A subprocess can return non-zero and still produce a fulfilled worker result unless the worker throws. [SOURCE: .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:362] [SOURCE: .opencode/skills/deep-loop-runtime/src/fanout-pool.cjs:207]

Iterations is documented as a per-lineage max-iterations override, but fanout-run only uses it for timeout sizing. [SOURCE: .opencode/skills/deep-loop-runtime/src/executor-config.ts:292] [SOURCE: .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:154]

Answer to Q5: multi-lineage fanout artifacts are suspect where completion depends on parallelism, subprocess exit status, or per-lineage iteration budgets. The eight review slices feeding this synthesis are less suspect because each source slice was single-lineage, but parent summaries alone cannot prove subprocess success. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/orchestration-summary.tsv:2]

## 9. Cross-Cutting Root Causes

First, there is no single executable contract joining docs, public schemas, runtime validators, and handlers. That is why memory_embedding_reconcile, memory_causal_stats, governed ingest, and catalog/playbook claims drift independently. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/tool-schemas.ts:342]

Second, metadata readiness is inferred from weak proxies. Implementation-summary presence can outrank unresolved status truth. [SOURCE: .opencode/skills/system-spec-kit/graph/graph-metadata-parser.ts:1030]

Third, orchestration reports summarize process management rather than validating semantic success. [SOURCE: .opencode/skills/deep-loop-runtime/src/fanout-pool.cjs:207]

## 10. Blast Radius Table

| Area | Failure Mode | Blast Radius | Severity Calibration |
| --- | --- | --- | --- |
| Docs/schema | Public examples differ from accepted runtime shape | Operator confusion, broken tool calls | P1 correctness/docs |
| Governed ingest | Accepted metadata dropped before persistence | Scope/audit data missing | P1 correctness/privacy |
| Entity density | Update paths leave TTL cache stale | Short-window retrieval routing degradation | P2/P1 depending frequency |
| Atomic save | DB index before final file promotion | Rare DB/file inconsistency on crash or promotion failure | P1 durability |
| Community fallback | Scoped search fallback lacks scope filter | Cross-scope retrieval under shared-scope use | P1, P0 only with untrusted principals |
| Causal graph | Bare-ID writes defer existence/scope checks | Orphan/wrong-target graph edges | P1, P0 only with untrusted principals |
| Graph metadata | Completion inferred from weak docs | Readiness dashboards and context routing wrong | P1 program integrity |
| Fanout | Exit/concurrency/iteration semantics drift | False confidence in multi-agent results | P1 orchestration |

## 11. Recommendations

1. Create executable contract tests that compare public MCP schemas, runtime Zod schemas, docs examples, and handler behavior for every tool.
2. Make governed metadata persistence mandatory for every path that accepts governance fields; fail closed when propagation cannot be proven.
3. Tighten graph metadata readiness derivation so complete requires explicit status or checklist evidence, not implementation-summary presence alone.
4. Recalibrate security labels by threat model. Keep P0 only for proven cross-principal or remote unauthenticated compromise.
5. Fix fanout-run to use async child processes, throw or mark failed on non-zero exit codes, and enforce per-lineage iteration budgets in the loop prompt/state machine.
6. Add artifact validation that reads state JSONL, per-lineage exit status, iteration counts, and synthesis completeness before parent reducers mark fanout complete.

## Eliminated Alternatives

| Alternative | Verdict | Reason |
| --- | --- | --- |
| The audit is mostly stale documentation | Eliminated | Runtime handlers and persistence paths contradict accepted schemas, not only prose. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory-index.ts:721] |
| Metadata drift is isolated to one or two packets | Eliminated | Broad scan plus parser fallback show systemic behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/status-mismatch-scan.json:2] |
| Memory defects are all permanent corruption | Eliminated | Entity-density is TTL-bounded routing quality, while atomic save and causal/community paths have different impacts. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/memory/entity-density.ts:105] |
| P0 is always the right label | Eliminated | Local single-user MCP lacks the untrusted shared-principal condition needed for critical security severity. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/src/scope-governance.ts:428] |
| Current eight source slices are invalid because fanout is broken | Eliminated | Each source review slice summary shows one lineage and no fanout parallelism requirement. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/orchestration-summary.tsv:2] |

## 12. Open Questions

- UNKNOWN: exact runtime frequency of atomic promotion failures was not measured; the risk is inferred from code ordering.
- UNKNOWN: exact historical count of suspect multi-lineage fanout artifacts requires a separate artifact-level audit across all prior orchestration logs.
- UNKNOWN: product-level threat model for tenant/user/agent isolation is not fully settled in the reviewed sources; severity should be updated once that promise is explicit.

## 13. Convergence Report

The loop converged after five iterations. New information ratio fell from 1.00 to 0.62, 0.55, 0.38, and finally 0.03. The last pass produced no new root-cause family and only refined eliminated alternatives and open questions.

## 14. References

See resource-map.md for source families and iteration reports for per-pass citations. Structured state is in deep-research-state.jsonl and deltas/iter-*.jsonl.
