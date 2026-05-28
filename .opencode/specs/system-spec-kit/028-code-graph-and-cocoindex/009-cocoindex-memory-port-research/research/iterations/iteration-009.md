# Iteration 009 - K2.5 final recommendation and synthesis prep

## Focus

K2.5 asks for the final naming recommendation matrix after combining character savings, migration churn, and runtime risk.

This is a synthesis iteration, not a new discovery pass. It closes the final open question by combining:

- K2.4 migration ceiling from iteration 1: 166 `mcp__mk_spec_memory__` occurrences under the requested file-type filter.
- K2.1 prefix construction from iteration 7: raw MCP tool names stay separate from host-rendered prefixes.
- K2.2 runtime constraints from iteration 8: Gemini policy parsing makes underscores in server aliases ambiguous; hyphenated `mk-memory` is clean.
- K2.3 prefix redundancy from iteration 8: the live surface has 59 raw tool registrations, and keeping raw names unchanged is the lowest-risk first move.

## Actions Taken

- Re-read iteration 8's namespace verdict and delta record.
- Re-read the K2.4 callsite count from iteration 1.
- Re-read K1.1 through K1.5 verdict snippets to prepare the cross-axis implementation packet map.
- Did not perform fresh source discovery; this iteration mostly normalizes prior findings into the final matrix.

## Part A - Final Naming Recommendation Matrix

| Option | Server | Tools | Net char delta per tool vs current `mcp__mk_spec_memory__memory_context` | Migration callsites affected | Gemini compat | Risk level | Recommended? |
| --- | --- | --- | ---: | ---: | --- | --- | --- |
| Status quo | `spec_kit_memory` | unchanged | 0 | 0 | AMBIGUOUS | LOW no-op | - |
| Recommendation A: server-only rename | `mk-memory` | unchanged | -6 | 166 per K2.4 | OK | LOW | **YES** |
| Option B: server plus drop memory prefix | `mk-memory` | `memory_*` to bare names | -13 to -19 | 166 plus about 120 tool refs | OK | MEDIUM | Defer |
| Option C: bare `mk` server | `mk` | unchanged | -13 | 166 | OK but generic | MEDIUM | No |
| Option D: split into multiple servers | `mk-memory`, `mk-code-graph`, `mk-skill-graph`, etc. | drop family prefixes | varies | 166 plus 200+ | OK | HIGH | No |

### Matrix Rationale

Status quo has the lowest immediate migration risk, but it leaves the one real runtime defect found in this track: Gemini composes MCP FQNs as `mcp_{serverName}_{toolName}` and warns against underscores in MCP server names because policy parsing splits after `mcp_` (iteration 8, K2.2; iteration 7, K2.1). That makes `spec_kit_memory` operationally familiar but policy-ambiguous.

Recommendation A is the right starting move. It changes only the configured server alias from `spec_kit_memory` to `mk-memory`, keeps all 59 raw tool names unchanged, avoids Gemini's underscore ambiguity, stays inside the provider-safe `A-Za-z0-9_-` class recorded in prior regex evidence, and limits migration to the 166 host-rendered callsites counted in iteration 1. It saves fewer characters than `mk`, but keeps semantic room for future siblings such as `mk-code` or `mk-skill`.

Option B is viable only as a follow-on. Dropping `memory_` from the largest family would save more text for calls like `memory_context`, but iteration 8 found the MCP surface is no longer a pure memory-only surface: graph, session, advisor, task, eval, council, and deep-loop families need prefixes to avoid generic verbs such as `query`, `status`, `context`, `upsert`, and `convergence`. Even within `memory_*`, names such as `list`, `stats`, `health`, `delete`, `update`, and `validate` lose standalone clarity.

Option C has better length but worse namespace design. Bare `mk` is parseable in Gemini, but it consumes the root namespace and becomes awkward if the system later separates memory, code graph, skill graph, or advisor services.

Option D is a larger architecture migration disguised as a naming cleanup. Splitting servers could make bare tool names cleaner, but it multiplies runtime configs, permission policy surfaces, docs, tests, and migration routes. That is not earned by the current evidence.

### Final K2.5 Recommendation

Confirm Option A: rename the MCP server alias from `spec_kit_memory` to `mk-memory` and keep all raw tool names unchanged.

Treat Option B as a possible second packet only after the server-only migration is proven in Claude Code, OpenCode, Codex, and Gemini. Do not combine tool renames with the server alias migration.

## Part B - Cross-Axis Cohesion Summary

| Axis | Prior answer | Composes with | Suggested implementation packet | ROI x effort score |
| --- | --- | --- | --- | --- |
| K1.1 memoization plus dependency DAG | YES-WITH-ADAPTATION in iteration 2 | K1.4 chunk fingerprints; K1.3 statediff later for target apply semantics | 028 - Memoization plus dependency-DAG indexing foundation | HIGH ROI, MEDIUM effort |
| K1.2 tombstones plus lifecycle sweep | YES-WITH-ADAPTATION in iteration 3 | K1.5 generated edge lifecycle; K1.3 later for planned edge reconciliation | 029 - Causal-graph lifecycle tombstones plus sweep | MEDIUM ROI, LOW effort |
| K1.3 statediff reconciliation | YES-WITH-ADAPTATION in iteration 4 | K1.1 dependency planning; K1.4 chunk rows; K1.5 regenerated edge proposals | 030 - Statediff reconciliation layer | MEDIUM ROI, HIGH effort |
| K1.4 chunked spec-doc embeddings | YES-WITH-ADAPTATION in iteration 5 | K1.1 memo fingerprints; K1.5 Phase 2 if LLM extraction is ever enabled | 028 - Memoization plus dependency-DAG indexing foundation | HIGH ROI, MEDIUM effort |
| K1.5 auto causal-edge derivation | YES-WITH-ADAPTATION in iteration 6 | K1.2 lifecycle cleanup; K1.4 chunk IDs for later LLM evidence; K1.3 for regenerated edge reconciliation | 031 - Auto causal-edge derivation deterministic Phase 1 | HIGH ROI, LOW effort |
| K1.6 query intelligence | NON-PORT in iteration 7 | None for Track-1 implementation; keep as a boundary finding | No packet | LOW ROI, no implementation |
| K2.x MCP namespace | Server-only rename favored by iterations 7-9 | Independent of K1 work; should ship as a small UX/runtime compatibility packet | 032 - MCP namespace rename `spec_kit_memory` to `mk-memory` | HIGH visibility, LOW effort |

### Proposed Downstream Packets

#### 028 - Memoization plus dependency-DAG indexing foundation

Bundle K1.1 and the K1.4 chunk-fingerprint substrate. This should ship before deeper statediff or LLM-derived graph work because it establishes stable invalidation units.

Primary files affected:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/prepared-memory.ts`

Estimated LOC: 650-1,100.

Dependencies: none hard, but it should precede packets 030 and any K1.5 Phase 2 work.

Test impact: memory index scan tests, schema migration tests, embedding/vector cache tests, hybrid search result-shape tests. Existing whole-doc assumptions may break once child chunk rows are returned or aggregated.

#### 029 - Causal-graph lifecycle tombstones plus sweep

Bundle K1.2 only. It is self-contained and should reduce orphan-edge risk before generated edges increase graph volume.

Primary files affected:

- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`

Estimated LOC: 250-450.

Dependencies: none hard. Prefer shipping before packet 031 so auto-created edges inherit a clean lifecycle.

Test impact: delete, bulk delete, stale index cleanup, causal orphan cleanup, retention sweep, and any test asserting physical edge deletion without an audit trail.

#### 030 - Statediff reconciliation layer

Bundle K1.3. This is the highest-effort Track-1 port because it touches planning and apply semantics across durable targets.

Primary files affected:

- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/statediff.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/post-mutation-hooks.ts`

Estimated LOC: 800-1,400.

Dependencies: packet 028 should ship first so statediff can plan against stable chunk and memo identities. Packet 029 is recommended before applying statediff to causal edges.

Test impact: broad. `memory_index_scan` categorization tests, alias divergence tests, post-mutation hook tests, embedding/FTS projection tests, and cache invalidation tests will likely need new action-batch assertions.

#### 031 - Auto causal-edge derivation deterministic Phase 1

Bundle K1.5 Phase 1 only. Do the deterministic frontmatter/metadata promoter now; defer LLM extraction, embedding-assisted canonicalization, and quarantine workflow.

Primary files affected:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/spec/graph-metadata.ts`

Estimated LOC: 300-650.

Dependencies: packet 029 preferred first for tombstone/sweep safety. Packet 028 is optional for Phase 1, but required before any chunk-evidence or LLM Phase 2.

Test impact: causal graph stats, relation-window caps, graph metadata parsing, endpoint resolution, duplicate-edge handling, and any tests assuming all `created_by='auto'` edges are absent.

#### 032 - MCP namespace rename `spec_kit_memory` to `mk-memory`

Bundle K2.x. This is independent of the Track-1 data-model work and should stay small.

Primary files affected:

- `.claude/mcp.json`
- `opencode.json`
- `.codex/config.toml`
- `.gemini/settings.json`
- Docs, prompts, and tests containing `mcp__mk_spec_memory__`

Estimated LOC: 150-300 changed lines, mostly mechanical references.

Dependencies: none. Ship separately from tool renames.

Test impact: runtime config loading tests, docs/examples snapshot tests, MCP tool invocation examples, prompt fixtures, and any tests matching the old fully qualified `mcp__mk_spec_memory__*` rendering.

## Part C - Convergence Signal

This iteration's new information ratio is low because K2.5 is a decision synthesis over already answered axes. The only new content is the normalized recommendation matrix and downstream packet grouping; the technical evidence comes from iterations 1 through 8.

Recommended convergence record:

```json
{"type":"iteration","iteration":9,"newInfoRatio":0.22,"status":"synthesis","focus":"k2-5-final-recommendation-and-synthesis-prep","answeredQuestions":["K2.5"]}
```

With K2.5 answered, all planned questions are closed:

- K1.1 answered in iteration 2.
- K1.2 answered in iteration 3.
- K1.3 answered in iteration 4.
- K1.4 answered in iteration 5.
- K1.5 answered in iteration 6.
- K1.6 answered in iteration 7.
- K2.1 answered in iteration 7.
- K2.2 answered in iteration 8.
- K2.3 answered in iteration 8.
- K2.4 answered in iteration 1.
- K2.5 answered here.

## Verdict on K2.5

Choose Option A: server-only rename to `mk-memory`, raw tool names unchanged.

The trade-off is favorable: six characters saved per fully qualified call, Gemini underscore ambiguity removed, future namespace room preserved, and migration churn limited to the 166 counted server-prefix callsites. More aggressive shortening is real but should be a later, separately tested migration.

## Questions Answered

- K2.5 answered: final recommendation is `spec_kit_memory` to `mk-memory`, with all raw tool names unchanged.

## Questions Remaining

None. The 11/11 planned research questions are answered.

## Next Focus

Stop is justified if the convergence controller requires a three-signal vote. If iteration 10 still runs, it should be a short cross-axis synthesis pass that converts the packet map above into the final research report and downstream implementation backlog.
