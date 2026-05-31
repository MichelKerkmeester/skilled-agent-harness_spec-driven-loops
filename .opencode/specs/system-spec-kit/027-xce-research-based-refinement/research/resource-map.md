# 027 XCE Research — Merged Resource Map

## Pt-01 Resources
---
title: "XCE Research — Resource Map (Path Ledger)"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
created: "2026-05-08T18:00:00Z"
---

# Resource Map — Path Ledger

Per spec.md REQ-009, this maps all file paths referenced during the 10-iteration deep-research run.

---

## Inputs (Read-Only Paths)

### External/ (XCE public surface)
| Path | Lines | Purpose |
|------|-------|---------|
| `external/README.md` | 283 | XCE public surface: tool catalog, steering rules, benchmark results, pricing, architecture diagram |
| `external/LICENSE` | 21 | MIT license — confirms Apache 2.0 / MIT compatibility for pattern adoption |
| `external/steering/CLAUDE.md` | 12 | Claude Code steering rules — "Always use xanther-xce" + "FIRST" pattern |
| `external/steering/kiro.md` | 12 | Kiro steering rules — "Always use xanther-xce" + "FIRST step when starting any task" |
| `external/steering/opencode-prompt.txt` | 4 | OpenCode steering rules — "Always use xanther-xce MCP tools for codebase understanding before reading files" |
| `external/steering/.clinerules` | 8 | Cline steering rules — "Call xce_get_context as your first action on any task" |
| `external/steering/.cursorrules` | 9 | Cursor steering rules — same pattern |
| `external/steering/.windsurfrules` | 9 | Windsurf steering rules — same pattern |
| `external/configs/*.json` | (5 files) | MCP server config shapes per IDE (referenced, not line-cited) |
| `external/assets/*.png` | (3 files) | Benchmark chart, hero, integration matrix (visual metadata extraction only) |

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/resource-map.md.
### MCP Server — Skill Advisor
| Path | Lines | Purpose |
|------|-------|---------|
| `mcp_server/skill_advisor/lib/render.ts` | 174 | renderAdvisorBrief(), capText, DEFAULT_TOKEN_CAP (80), confidence ≥ 0.8 threshold gate, FIRST_ACTION_HINT proposal target |
| `mcp_server/skill_advisor/lib/skill-advisor-brief.ts` | ~200 | renderSharedBrief() integration, prompt-boundary gate |
| `mcp_server/skill_advisor/lib/prompt-cache.ts` | 192 | Exact-match brief cache, token cap normalization, hit/miss counter |
| `mcp_server/skill_advisor/lib/scorer/` | (directory) | Scorer surface — reference only, out of scope |

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/resource-map.md.
### Spec Folder — Input Documents
| Path | Lines | Purpose |
|------|-------|---------|
| `spec.md` | 331 | Packet spec: 11 REQs, RQ1-RQ9, success criteria, risks, scope |
| `research/deep-research-config.json` | ~30 | Iteration config: maxIterations=10, convergenceThreshold=0.10, executor routing |
| `research/iterations/iteration-001.md` | 192 | RQ1: Architectural Context Gap — F-001 through F-006 |
| `research/iterations/iteration-002.md` | 193 | RQ2: Trace Tool Design — F-007 through F-012 |
| `research/iterations/iteration-003.md` | 176 | RQ3: Impact Analysis Schema — F-013 through F-019 |
| `research/iterations/iteration-004.md` | 171 | RQ4: Get-Context Combiner — F-020 through F-025 |
| `research/iterations/iteration-005.md` | 209 | RQ5: PRAT Reverse-Engineering — F-026 through F-032 |
| `research/iterations/iteration-006.md` | 252 | RQ6: Steering Pattern Transfer — F-033 through F-038 |
| `research/iterations/iteration-007.md` | 233 | RQ7: Benchmark Methodology — F-039 through F-042 |
| `research/iterations/iteration-008.md` | 287 | RQ8: Token Reduction Validation — F-043 through F-047 |
| `research/iterations/iteration-009.md` | 152 | RQ9: Non-Adoption Boundary — SKIP-1 through SKIP-9 |
| `research/findings-registry.json` | 1 | Pre-run registry (empty — filled by iterations) |
| `research/deltas/` | directory | Per-iteration delta JSONL records |

---

## Outputs (Created Paths)

### Research Synthesis (this iteration)
| Path | Lines (est.) | Purpose |
|------|-------------|---------|
| `research/research.md` | ~400 | Final synthesis: executive summary, 9 RQ sections, PRAT reconstruction, steering pattern transfer, alternatives, open questions, references |
| `research/findings.md` | ~280 | Adoption matrix: 21 feature rows classified (4 ADOPT, 9 ADAPT, 2 DEFER, 6 SKIP) with file:line cites, blast radius, sub-packet mapping. "Will NOT adopt" section has 9 expanded rationale items. |
| `research/sub-packet-proposals.md` | ~270 | 5 sub-packet proposals: 028 (HLD/LLD), 029 (Trace), 030 (Impact Analysis), 031 (Advisor Mandate), 032 (Eval Harness). Each with scope, level, dependencies, risk register, out-of-scope guard. Dependency graph. |
| `research/resource-map.md` | ~150 | This file — path ledger with Inputs, Outputs, and External References sections. |
| `research/deep-research-state.jsonl` | 15 lines | State machine: config + 10 iterations + 2 events (executor fallback, convergence). |

### Per-Iteration Outputs (created in iters 001-009)
| Path | Purpose |
|------|---------|
| `research/iterations/iteration-NNN.md` (9 files) | Per-iteration findings, actions, tool-call logs |
| `research/deltas/iter-NNN.jsonl` (9 files) | Per-iteration delta records (structured findings export) |
| `research/logs/` | Iteration logs |
| `research/prompts/` | Per-iteration LLM prompt files |

---

## External References (URLs from `external/README.md` only)

Per spec.md REQ-009, only URLs that appear verbatim in `external/README.md` are included:

| URL | Source line | Description |
|-----|------------|-------------|
| `https://xanther.ai` | README:12 | Xanther website |
| `https://app.xanther.ai` | README:13 | Xanther dashboard |
| `https://discord.gg/Y768kBRS` | README:14 | Xanther Discord community |
| `https://github.com/Xanther-Ai/xanther-cli` | README:15 | Xanther CLI source repository |
| `https://www.swebench.com/` | README:37 | SWE-bench Verified benchmark site |
| `https://xanther.ai/signup` | README:53 | Xanther sign-up page |
| `https://mcp.xanther.ai/sse` | README:74, 88 | XCE MCP server SSE endpoint |
| `https://xanther.ai/pricing` | README:271 | Xanther pricing page |
| `https://xanther.ai/benchmarks` | README:279 | Xanther benchmark results page |

**No other external URLs were referenced during this research run.**

## Pt-02 Resources
# 027 pt-02 Resource Map

## Inputs

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/resource-map.md.
### Pass-1 artifacts

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/research.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/findings.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/resource-map.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-008.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-009.md`

### pt-02 pass-2 artifacts read

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deep-research-config.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/findings-registry.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-008.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-009.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-010.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-001.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-002.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-003.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-004.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-005.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-006.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-007.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-008.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-009.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-010.jsonl`

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/resource-map.md.
### cli-opencode references

- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/cli-opencode/references/integration_patterns.md`
- `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md`
- `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md`

## Outputs

### Iteration files

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-007.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-008.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-009.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations/iteration-010.md`

### Delta files

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-001.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-002.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-003.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-004.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-005.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-006.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-007.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-008.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-009.jsonl`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas/iter-010.jsonl`

### Prompts and logs

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-1.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-2.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-3.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-4.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-5.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-6.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-7.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-8.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-9.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/iter-10.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/prompts/synthesis.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/logs/synthesis-stdout.log`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/logs/synthesis-stderr.log`

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/resource-map.md.
## External References

- None. This pass used internal files only.

## Cross-Packet Dependencies

- Pass 2 depends on pass 1's parent synthesis and phase scaffolds for the adoption surface and original phase split.
- Phase 001 amendments feed Phase 002 through `classifyFileRole()` and the open-string `file_role` contract.
- Phase 002 amendments feed Phase 003 only for optional downstream narrative reuse; Phase 003 deterministic MVP remains independent.
- Phase 003 amendments feed Phase 005 because Phase 005 calibrates risk weights and evaluates impact-analysis behavior.
- Phase 004 amendments feed Phase 005 because the eval harness measures the advisor first-action treatment.
- Phase 005 depends on all four implementation phases and should remain last unless subprocess hardening is split into a prerequisite packet.
- pt-02 does not modify any phase scaffold; it proposes changes for a follow-on amendment packet.

## Audit Trail

```bash
test -f .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deep-research-state.jsonl
```

```bash
rg -n '"event":"converged"|"iteration":10' .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deep-research-state.jsonl
```

```bash
find .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/iterations -name 'iteration-*.md' | wc -l
```

```bash
find .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/deltas -name 'iter-*.jsonl' | wc -l
```

```bash
wc -c .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/research.md .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/findings.md .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/sub-packet-amendments.md .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/resource-map.md
```

```bash
rg -n 'BLOCKING|CONFIRMED|NO-CHANGE-NEEDED' .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/findings.md
```

```bash
rg -n 'NEEDS_AMENDMENT|NO_CHANGES_NEEDED' .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/sub-packet-amendments.md
```

## Pt-03 Resources
# Resource Map — 027-XCE Pt-03

> Inventory of files examined across 10 iterations. Treat this as the EXCLUSION SET when looking for net-new files in pt-04 or follow-on work — flag only missed-from-map candidates as gaps.

**Generated:** 2026-05-09T10:11:00Z (post-synthesis)
**Packet:** `research/027-xce-research-pt-03/`
**Method:** manual aggregation from deltas + iter narrative file:line citations

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/resource-map.md.
## System-spec-kit memory backend

### Handlers
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/handlers/memory-triggers.ts` | 6 | Trigger handler, activation, scope filtering |
| `mcp_server/handlers/memory-context.ts` | 7 | memory_context strategy + intent routing |
| `mcp_server/handlers/memory-search.ts` | 7, 8 | V2 pipeline + caching + feedback logging |
| `mcp_server/handlers/session-resume.ts` | 5 | Session resume payload, coco availability |

### Search pipeline
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/search/pipeline/README.md` | 7 | 4-stage pipeline contract |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | 7, 10 | Rerank stage + cross-encoder adapter |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | 7 | Filter/cap, ordering immutability |
| `mcp_server/lib/search/cross-encoder.ts` | 10 | Provider-generic rerank with cache + circuit breaker |
| `mcp_server/lib/search/causal-boost.ts` | 7, 8 | Intent-aware causal boost, sparse-first traversal, neighbor injection |
| `mcp_server/lib/search/llm-cache.ts` | 7 | LLM cache TTL/LRU pattern |
| `mcp_server/lib/search/llm-reformulation.ts` | 7 | LLM call + cache + fail-open precedent |
| `mcp_server/lib/search/embedding-expansion.ts` | 6 | Semantic query-expansion precedent |
| `mcp_server/lib/search/cocoindex-calibration.ts` | 5 | Overfetch + dedup + path-class-count telemetry |

### Embeddings + cache
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/cache/embedding-cache.ts` | 6, 10 | Persistent embedding cache schema |
| `mcp_server/lib/embeddings/embedding-pipeline.ts` | 6 | Save-time embedding lookup/generate/store |
| `mcp_server/lib/embeddings/factory.ts` | 6 | Provider auto-resolution (Voyage default `voyage-4`) |

### Trigger matching + parsing
| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/parsing/trigger-matcher.ts` | 6 | Lexical trigger matching, candidate index |

---

## Causal graph + retention + feedback

| Path | Iterations | Purpose |
|---|---|---|
| `mcp_server/lib/storage/causal-edges.ts` | 8, 9 | Relations, NFR-R01 caps, insertEdge, batch, weight history, createSpecDocumentChain |
| `mcp_server/lib/storage/consolidation.ts` | 8, 9 | Hebbian decay cycle, stale-edge detection |
| `mcp_server/lib/storage/vector-index-schema.ts` | 8, 9 | causal_edges uniqueness, retention columns |
| `mcp_server/lib/storage/vector-index-store.ts` | 9 | Half-life decay fallback |
| `mcp_server/lib/storage/vector-index-queries.ts` | 6, 9 | Vector + decay queries |
| `mcp_server/lib/storage/memory-summaries.ts` | 6 | Local cosine helper, BLOB-to-Float32 |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | 9 | Current TTL-only retention sweep |
| `mcp_server/lib/feedback/feedback-ledger.ts` | 4, 8, 9 | Event schema, confidence hierarchy, queries |
| `mcp_server/lib/feedback/shadow-scoring.ts` | 9 | Promotion-gate weekly-cycle pattern |
| `mcp_server/lib/feedback/batch-learning.ts` | 3 | `MAX_BOOST_DELTA = 0.10` precedent |
| `mcp_server/lib/feedback/query-flow-tracker.ts` | 8 | Result-cited event logging |
| `mcp_server/lib/cognitive/tier-classifier.ts` | 9 | Null half-life for constitutional/critical |
| `mcp_server/lib/cognitive/importance-tiers.ts` | 9 | Tier `decay: false` policy |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | 9 | Infinity stability for constitutional/critical |

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-03/resource-map.md.
