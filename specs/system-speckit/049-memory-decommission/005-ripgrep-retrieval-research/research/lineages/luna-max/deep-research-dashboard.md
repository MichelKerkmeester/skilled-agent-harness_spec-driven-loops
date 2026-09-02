---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Optimize the ripgrep-first retrieval design that packet specs/system-speckit/049-memory-decommission replaces the system-spec-memory MCP database with, so phases 001-trigger-index-replacement and 004-grep-convention-doc-retrofit can be expanded and improved before they are built. Read the parent spec.md, goal.md and the four phase specs first. Investigate, with evidence from this repository and from ripgrep documentation and source: (1) the generated trigger-index design over trigger_phrases frontmatter: JSON shape, phrase normalization and tokenization, multi-word and partial-phrase matching, case folding, stop-word and stemming choices that need no embeddings, lookup algorithm and cold-start latency against a 200ms budget, idempotent generation, malformed-frontmatter reporting, and how it must match or exceed the current LOWER(trigger_phrases) LIKE lane in mcp-server/lib/search/hybrid-search.ts; (2) ripgrep invocation conventions that replace memory_search, memory_context and memory_quick_search: flag choices such as --json, -l, -c, -F, -i, -w, --multiline, --glob, --type-add, --sort, --max-count, --pre, .rgignore and .ignore files to exclude z_archive and node_modules, and how to get useful ranking from rg output alone; (3) the corpus shape that makes grep precise: frontmatter key stability, one-fact-per-line, ANCHOR markers, naming grammar, what belongs in trigger_phrases and what does not; (4) what the retired MCP surface offered that grep cannot, such as continuity frontmatter writing, causal graph, resource maps, and what replaces each; (5) a parity harness design and frozen prompt set; (6) failure modes, edge cases, and measurable acceptance criteria. Produce concrete, ranked recommendations that amend the phase 001 and 004 specs, plans and tasks, each citing file paths and lines. Execution note for this lineage: you are the executor and the leaf. Perform every iteration yourself, in this session, reading files and writing the iteration, delta, state and research artifacts directly into your lineage directory. Never spawn codex exec, opencode run, or any other nested CLI or agent process for an iteration.
- Started: 2026-09-02T17:10:52.423Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-luna-max-1788368614908-8t310f
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Trigger-index contract and exact-lane parity | - | 0.92 | 9 | complete |
| 2 | ripgrep invocation and replacement contract | - | 0.84 | 8 | complete |
| 3 | corpus precision and MCP capability boundary | - | 0.78 | 8 | complete |
| 4 | parity harness, frozen prompts, and measurable gates | - | 0.72 | 8 | complete |
| 5 | final cross-check and ranked amendment map | - | 0.68 | 8 | complete |

- iterationsCompleted: 5
- keyFindings: 23
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] What exact trigger-index shape, normalization, matching, and lookup contract preserves or exceeds `exactTriggerSearch` and its `LOWER(trigger_phrases) LIKE` behavior? [legacy-import]
- [ ] Which ripgrep flags and invocation recipes replace `memory_search`, `memory_context`, and `memory_quick_search`, including deterministic ranking and ignore rules? [legacy-import]
- [ ] Which frontmatter, one-fact-per-line, ANCHOR, naming, and trigger-phrase conventions make the corpus grep-precise without rewriting bodies? [legacy-import]
- [ ] Which continuity, graph, resource-map, and reporting capabilities are lost with MCP retirement, and what explicit replacements preserve their useful contracts? [legacy-import]
- [ ] What frozen prompts, parity harness, latency measurements, malformed-input reports, and acceptance thresholds make the replacement safe to build? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] What exact trigger-index shape, normalization, matching, and lookup contract preserves or exceeds `exactTriggerSearch` and its `LOWER(trigger_phrases) LIKE` behavior?
- [ ] Which ripgrep flags and invocation recipes replace `memory_search`, `memory_context`, and `memory_quick_search`, including deterministic ranking and ignore rules?
- [ ] Which frontmatter, one-fact-per-line, ANCHOR, naming, and trigger-phrase conventions make the corpus grep-precise without rewriting bodies?
- [ ] Which continuity, graph, resource-map, and reporting capabilities are lost with MCP retirement, and what explicit replacements preserve their useful contracts?
- [ ] What frozen prompts, parity harness, latency measurements, malformed-input reports, and acceptance thresholds make the replacement safe to build?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▆▆▅▅▄▄▄▃▃▃▂▂▂▁▁▁
- score sparkline: ██▇▇▆▆▅▅▄▄▄▃▃▃▂▂▂▁▁▁
- Last 3 ratios: 0.78 -> 0.72 -> 0.68
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.68
- coverageBySources: {"code":80,"raw.githubusercontent.com":3}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A phrase-only map with no substring postings is ruled out for parity because SQL uses `%token%` and admits partial tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:817-819]` (iteration 1)
- Stop-word removal and stemming are ruled out for v1 because neither exists in the baseline trigger lane and both alter the required superset relation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764]` (iteration 1)
- The planned root-level `retrieval/generate-trigger-index.mjs`, `retrieval/parity-check.mjs`, and `retrieval/fixtures/prompt-set.json` are not present in this checkout; their intended work is described by phase 001 instead. I did not create them because this run is research-only and lineage-scoped. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]` (iteration 1)
- `--sort=path` as relevance ranking: it is path ordering, single-threaded, and cannot express field/phrase priority. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]` (iteration 2)
- `-w` as trigger substring parity. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473]` (iteration 2)
- Combining `--json` with `-l` or `-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]` (iteration 2)
- Default `--multiline` or `--pre` for Markdown. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]` (iteration 2)
- Claiming `rg` replaces continuity writes, causal traversal, or session state is ruled out because the commands are read-only and the phase-002/handler contracts are stateful. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]` (iteration 3)
- Re-running the body-based automatic trigger extractor during index generation is ruled out: it has its own stop-word/n-gram policy and would change an author-controlled frontmatter contract. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:571-658]` (iteration 3)
- Reflowing every legacy body to one fact per line is ruled out by phase 004's no-body-rewrite boundary. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]` (iteration 3)
- Silently adding `session`/`context` to sparse documents is ruled out for a grep-precision corpus because the editor currently uses those as generic fallbacks. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` (iteration 3)
- `rg --sort=path` as relevance ranking, default multiline/preprocessing, and `--json` combined with `-l`/`-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,4238-4294,5489-5527,6207-6240,6289-6340]` (iteration 5)
- A phrase-only index without substring postings. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]` (iteration 5)
- Embeddings, stemming, stop-word expansion, or semantic paraphrase recovery in lexical v1. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764; specs/system-speckit/049-memory-decommission/goal.md:43-55]` (iteration 5)
- Reflowing legacy bodies or silently injecting generic `session`/`context` triggers. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123; .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
What exact trigger-index shape, normalization, matching, and lookup contract preserves or exceeds `exactTriggerSearch` and its `LOWER(trigger_phrases) LIKE` behavior?

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
