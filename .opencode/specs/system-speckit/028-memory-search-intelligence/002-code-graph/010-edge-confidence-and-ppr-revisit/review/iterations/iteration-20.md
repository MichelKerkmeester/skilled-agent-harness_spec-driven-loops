# Dimension

Final completeness pass across correctness, security, traceability, and maintainability. This iteration only checked for obvious gaps adjacent to the already confirmed P1/P2 set and ranked release risk; it did not re-emit prior findings as new findings.

# Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-config.json:9`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl:33`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:204`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:701`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:777`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1112`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1156`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:712`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:727`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:740`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:907`
- `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:120`
- `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:132`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:148`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:175`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1166`
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:47`
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:61`
- `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:159`
- `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:171`

# Part A (Gap Check)

Seeded-PPR flag-off staleness: I did not find a PPR-side equivalent to P1-019. The seeded-PPR flag is read fresh through `seededPprRankingEnabled()` and `shouldUseSeededPprRanking()` before entering the impact-mode PPR branch, and the PPR-specific maps (`edgesByNode`, `nodeSummaries`, `candidatesByEdge`) are local to `collectSeededPprImpactRanking()` for a single request. When the flag is off, the branch falls through to the legacy impact path at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1146-1156`. I found no PPR DB write, trace-log persistence, cache write, or telemetry surface that would continue influencing later flag-off behavior. This does not downgrade P1-001: the top-level Memory MCP dist import still happens before the flag check.

EvidenceClass blind spots: I found one additional same-family gap outside iteration 18's scoped `mcp_server/lib` grep. `code_graph_query` relationship output and scan enrichment both convert metadata to a coarser `edgeEvidenceClass`, but their predicates only check `metadata.evidenceClass === 'INFERRED'` and do not treat `AMBIGUOUS` as weak unless `metadata.detectorProvenance === 'heuristic'` is also present. Structural same-file CALLS metadata currently sets heuristic provenance for ambiguous edges, which is counterevidence against universal breakage. However, the cross-file resolver's metadata updater only writes `confidence` and `evidenceClass` while preserving whatever metadata was already present; if it updates an older/null-metadata edge, `AMBIGUOUS` can be surfaced as `direct_call` in relationship-query/enrichment consumers.

Top-level import pattern: I found no second startup-blocking top-level dynamic import in the session's changed production files matching P1-001. The only production top-level `await import()` with a cross-package compiled artifact dependency is `code-graph-context.ts:32`. Other production dynamic imports observed are inside functions (`structural-indexer.ts:920`, `tree-sitter-parser.ts:177`) or test-only imports, so they do not create the same MCP-server startup failure mode.

# Part B (Final Risk Ranking)

The highest real-world risk is P1-001. It is not just an incorrect feature result under an experimental flag; it can prevent the code-graph MCP server from starting in any checkout where the system-spec-kit compiled traversal dist artifact is absent, because `code-graph-context.ts` imports it at module load before the seeded-PPR flag is checked. Blocking before any production flag flip: P1-001, P1-002, P1-007, P1-018-001, P1-019-001, and the new P1-020-001, because they affect startup reliability or live query semantics once operators exercise the gated paths or reuse a flag-on DB. Blocking before claiming this packet complete: P1-003, P1-008, P1-013, and P1-014-001, because they make release evidence and reproducibility untrustworthy even if runtime flags stay default-off. Lower urgency: the P2 documentation/playbook/test-harness cleanup items, because they are advisory while both flags remain default-off and do not directly alter server behavior.

# Findings by Severity (P0/P1/P2)

## P0

None.

## P1

### P1-020-001 [P1] AMBIGUOUS evidence can be classified as direct-call evidence outside `code_graph_context`

Claim: Relationship-query and scan enrichment consumers only classify `metadata.evidenceClass === 'INFERRED'` as weak; `AMBIGUOUS` falls through to `direct_call` unless `detectorProvenance` is also present and set to `heuristic`. Cross-file confidence differentiation can write `evidenceClass: 'AMBIGUOUS'` without guaranteeing `detectorProvenance`, so older/null-metadata edges can be mislabeled as direct evidence.

EvidenceRefs: `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:727`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:740-751`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:907-913`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:120-134`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:47-65`, `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:159-160`.

CounterevidenceSought: Checked the main same-file producer and found structural-indexer ambiguous CALLS metadata is built with `detectorProvenance: 'heuristic'`, so those edges are classified weakly despite the missing AMBIGUOUS branch. Checked cross-file resolver update logic and found it preserves existing metadata but only guarantees `confidence` and `evidenceClass` on write, leaving old/null metadata without guaranteed provenance.

AlternativeExplanation: The current normal reindex path likely gives most CALLS edges provenance metadata, so the bug may only surface on older DBs, partial migrations, manually inserted rows, or rows whose metadata was previously null.

FinalSeverity: P1.

Confidence: 0.83.

DowngradeTrigger: Downgrade to P2 or close if the supported deployment contract requires a full fresh reindex before enabling edge-confidence differentiation and tests prove all AMBIGUOUS-producing write paths always carry `detectorProvenance: 'heuristic'` before any relationship or scan enrichment consumer reads them.

FindingClass: cross-consumer.

ContentHash: `handlers-query-scan-ambiguous-evidenceclass-weakness-v1`.

## P2

None new.

# Traceability Checks

- `review_core.md` severity doctrine loaded; P1 is appropriate for correctness/spec mismatch or must-fix gate issues before merge.
- Gap check covered the three requested families: seeded-PPR flag-off staleness, other `evidenceClass` consumers, and other top-level dynamic imports.
- Prior findings were not re-emitted as new findings.
- New finding is scoped to consumers outside iteration 18's stated `mcp_server/lib` grep surface.

# Verdict

CONDITIONAL. This final iteration adds one P1 cross-consumer gap and leaves the packet release-blocked by the existing active P1 set. No P0 was found.

# Next Dimension

None -- this is the final iteration

Review verdict: CONDITIONAL
