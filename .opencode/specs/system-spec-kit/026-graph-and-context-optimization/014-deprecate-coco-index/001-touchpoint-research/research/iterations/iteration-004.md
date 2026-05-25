# Iteration 004 - RQ4 Semantic-Search Vacuum + Replacement Policy

## Focus (RQ4)

Map every live route that directs "find code by concept / semantic / how-does-X-work" to CocoIndex, document what breaks when CocoIndex is removed, and present replacement policy options with a recommendation.

## Semantic-search routes to coco

| File (file:line) | Route/Instruction | What breaks | Mutation Class |
|------------------|-------------------|-------------|----------------|
| AGENTS.md:66 | MANDATORY TOOLS section lists "CocoIndex Code MCP - semantic code search" | Dead mandatory tool reference | EDIT-remove-ref |
| AGENTS.md:69-96 | CODE SEARCH DECISION TREE: "Searching by concept, intent, or 'how does X work'? -> CocoIndex search (semantic)" | Dead decision tree branch | EDIT-decouple |
| AGENTS.md:89-90 | CocoIndex triggers: "find code that does X", "how is X implemented", "where is the logic for X", "similar code", "find patterns" | Dead trigger list | EDIT-remove-ref |
| AGENTS.md:91-96 | MCP tool `search(query, languages, paths, num_results, refresh_index)` and CLI `ccc search "query"` | Dead tool/CLI references | EDIT-remove-ref |
| .claude/CLAUDE.md:5 | SEARCH ROUTING: "use CocoIndex semantic search (`mcp__cocoindex_code__search`) for concept, similarity, implementation-pattern, and 'how does this work' code discovery" | Dead routing instruction | EDIT-decouple |
| .opencode/agents/context.md:22 | mcpServers frontmatter includes "cocoindex_code" | Dead MCP server registration | EDIT-remove-ref |
| .opencode/agents/context.md:57 | "ROUTE BY QUERY TYPE -> Choose Code Graph, CocoIndex, Glob, Grep, Read, and memory tools" | Dead routing option | EDIT-decouple |
| .opencode/agents/context.md:62 | "Tool routing follows the evidence need: graph for structure, CocoIndex for semantic discovery" | Dead routing guidance | EDIT-decouple |
| .opencode/agents/context.md:76 | Allowed Tools table: "CocoIndex search - Concept-based code discovery" | Dead tool entry | EDIT-remove-ref |
| .opencode/agents/context.md:103 | Query Routing Matrix: "Semantic concept / 'how is X implemented' / similar patterns -> CocoIndex search" | Dead routing matrix entry | EDIT-decouple |
| .opencode/agents/context.md:125 | Tool Selection Flow: "Semantic concept or unknown implementation? -> CocoIndex search" | Dead flow branch | EDIT-decouple |
| .opencode/agents/context.md:150 | Default Tool Sequence: "CocoIndex search for concepts" | Dead tool sequence step | EDIT-decouple |
| .opencode/agents/context.md:179 | Layer 2 tools: "CocoIndex search" | Dead layer tool | EDIT-remove-ref |
| .opencode/agents/context.md:184 | "CocoIndex — Use for semantic discovery only when exact tokens are unknown" | Dead usage guidance | EDIT-remove-ref |
| .opencode/agents/context.md:344 | "Tool routing matches query type: semantic -> CocoIndex" | Dead routing rule | EDIT-decouple |
| .opencode/agents/deep-review.md:253 | MCP + Code Intelligence Tools: "mcp__cocoindex_code__search: semantic discovery when exact symbols are unknown" | Dead tool reference | EDIT-remove-ref |
| .opencode/commands/deep/start-research-loop.md:4 | allowed-tools frontmatter: "mcp__cocoindex_code__search" | Dead allowed-tool entry | EDIT-remove-ref |
| .opencode/commands/deep/start-review-loop.md:4 | allowed-tools frontmatter: "mcp__cocoindex_code__search" | Dead allowed-tool entry | EDIT-remove-ref |
| .opencode/commands/deep/ask-ai-council.md:5 | allowed-tools frontmatter: "mcp__cocoindex_code__search" | Dead allowed-tool entry | EDIT-remove-ref |
| .opencode/skills/system-code-graph/SKILL.md:16 | "Semantic search answers 'what does this code mean.' Structural indexing answers 'what does this code touch.'" | Dead conceptual contrast | EDIT-remove-ref |
| .opencode/skills/system-code-graph/SKILL.md:22-23 | Glossary: "Semantic search. Vector-embedding lookup over code (CocoIndex)" | Dead glossary entry | EDIT-remove-ref |
| .opencode/skills/system-code-graph/SKILL.md:74-76 | Router pseudocode: "semantic -> mcp-coco-index resources" and "hybrid -> CocoIndex seeds" | Dead routing branches | EDIT-decouple |
| .opencode/skills/system-code-graph/SKILL.md:84 | "references/integrations/ documents CCC bridge coordination with CocoIndex" | Dead integration reference | EDIT-remove-ref |
| .opencode/skills/system-code-graph/SKILL.md:123 | INTENT_SIGNALS "CCC" entry: keywords ["ccc", "cocoindex", "semantic", "hybrid"] | Dead intent signal | DELETE |
| .opencode/skills/system-code-graph/SKILL.md:291 | Tool dispatch table: "Bridge CocoIndex status, reindexing and feedback" | Dead table row | DELETE |
| .opencode/skills/system-code-graph/SKILL.md:404 | Related resources: "ccc_bridge_integration.md — when to use ccc_status / ccc_reindex / ccc_feedback and how they coordinate with CocoIndex" | Dead resource reference | EDIT-remove-ref |
| .opencode/skills/system-code-graph/ARCHITECTURE.md:73 | Architecture diagram: "CocoIndex bridge facade" | Dead architecture component | EDIT-remove-ref |
| .opencode/skills/system-code-graph/ARCHITECTURE.md:107 | "lib/ — Parser, readiness, apply-mode, CocoIndex bridge" | Dead lib component | EDIT-remove-ref |
| .opencode/skills/system-code-graph/ARCHITECTURE.md:158 | "Optional sqlite-vec extension provides vector similarity when CocoIndex seeds inject embeddings" | Dead extension reference | EDIT-remove-ref |
| .opencode/skills/system-code-graph/ARCHITECTURE.md:164 | "CocoIndex bridge. Thin pass-through facade for ccc_status, ccc_reindex, and ccc_feedback" | Dead bridge description | EDIT-remove-ref |
| .opencode/skills/system-code-graph/README.md:30 | Section header: "3.5 COCOINDEX BRIDGE" | Dead section | DELETE |
| .opencode/skills/system-code-graph/README.md:140 | "code_graph_context — Accepts seeds from CocoIndex, manual input, or graph lookups" | Dead seed source reference | EDIT-remove-ref |
| .opencode/skills/system-code-graph/README.md:155-161 | CocoIndex Bridge section with tool table | Dead section | DELETE |
| .opencode/skills/system-code-graph/README.md:262-264 | Workflow example: "CocoIndex semantic search for candidate files, then pass selected seeds to code_graph_context" | Dead workflow example | EDIT-remove-ref |
| .opencode/skills/system-code-graph/README.md:343 | Related resources: "ccc_bridge_integration.md" | Dead resource reference | EDIT-remove-ref |

## Replacement policy options

### Option (a): DROP semantic code search — rely on code-graph structural + Grep/Glob only

**Pros:**
- Cleanest break — no semantic search gap to fill
- Simpler routing logic: structural (code-graph) vs exact (Grep/Glob)
- No dependency on external semantic search infrastructure
- Reduces tool surface and complexity

**Cons:**
- Loses concept/intent-based discovery ("find code that does X", "how is X implemented")
- Users must know exact tokens/symbols to find code
- Loses similarity search for patterns when exact names are unknown
- May increase exploration time for unfamiliar codebases
- Breaks existing workflows that rely on semantic discovery

**Mutation scope:**
- Remove all CocoIndex routing from decision trees
- Update guidance to emphasize exact-token search (Grep) and structural queries (code-graph)
- Remove semantic/intent classification from routing logic
- Update agent documentation to reflect structural-only discovery

### Option (b): REPOINT concept search to memory_search (spec-docs/memory, not arbitrary code)

**Pros:**
- Preserves semantic/intent-based search capability
- Leverages existing mk-spec-memory infrastructure
- No new external dependencies
- Memory search already indexes spec docs, decisions, and patterns

**Cons:**
- **Critical mismatch:** memory_search indexes spec docs and saved memories, NOT arbitrary code files
- Cannot find implementation details in un-documented code
- Only works for well-documented code with spec folders
- Does not solve the core problem of finding code by concept in the codebase itself
- Creates false expectation — semantic search would only find documented patterns, not live code

**Mutation scope:**
- Repoint semantic routes to memory_search instead of CocoIndex
- Update routing guidance to clarify memory_search scope (spec docs only)
- Add warnings that memory_search does not index arbitrary code
- May require memory_search index expansion (out of scope for this deprecation)

### Option (c): HYBRID — Grep + code-graph structural as the documented path; concept queries fall back to grep

**Pros:**
- Preserves discovery capability without semantic backend
- Uses existing tools (Grep, code-graph) — no new infrastructure
- Grep can approximate concept search with smart pattern construction
- code-graph provides structural context that Grep lacks
- Maintains routing structure (concept -> grep + structural verification)

**Cons:**
- Grep is not true semantic search — requires known tokens/patterns
- Concept queries become "best-effort" rather than semantic
- May require more iteration from users to find the right patterns
- Loses the "unknown implementation" discovery use case
- Requires updating guidance to set expectations correctly

**Mutation scope:**
- Update decision trees: concept/intent queries -> Grep + code-graph verification
- Remove CocoIndex semantic branch from routing logic
- Add guidance on constructing effective Grep patterns for concept discovery
- Update agent documentation to emphasize Grep + code-graph workflow
- Neutralize semantic/intent classification in code-graph (already planned in RQ3)

## Recommendation

**Chosen policy: Option (c) — HYBRID (Grep + code-graph structural)**

**Rationale:**
1. **Preserves discovery capability:** Unlike option (a), this maintains a path for concept-based discovery, even if it's best-effort rather than true semantic.
2. **No infrastructure dependency:** Unlike option (b), this doesn't create a false expectation by repointing to memory_search (which doesn't index arbitrary code).
3. **Leverages existing tools:** Grep and code-graph are already available and well-understood.
4. **Realistic expectations:** Users can still discover code by concept, but they'll need to iterate on patterns rather than getting semantic matches.
5. **Aligns with RQ3:** The code-graph decouple work already neutralizes semantic routing, so this policy completes that transition.

**Doc rewrite list (by phase):**

**Phase 1: Core routing docs (highest priority)**
- AGENTS.md:69-96 — Rewrite CODE SEARCH DECISION TREE to remove CocoIndex branch, add Grep + code-graph path for concept queries
- AGENTS.md:89-90 — Remove CocoIndex triggers list, replace with Grep pattern guidance
- .claude/CLAUDE.md:5 — Rewrite SEARCH ROUTING to remove CocoIndex, add Grep + code-graph guidance
- .opencode/agents/context.md:57,62,103,125,150,184,344 — Update all routing matrices, flows, and guidance to use Grep + code-graph instead of CocoIndex

**Phase 2: Agent and command tool permissions**
- .opencode/agents/context.md:22 — Remove "cocoindex_code" from mcpServers frontmatter
- .opencode/agents/deep-review.md:253 — Remove CocoIndex tool reference from MCP + Code Intelligence Tools section
- .opencode/commands/deep/start-research-loop.md:4 — Remove "mcp__cocoindex_code__search" from allowed-tools
- .opencode/commands/deep/start-review-loop.md:4 — Remove "mcp__cocoindex_code__search" from allowed-tools
- .opencode/commands/deep/ask-ai-council.md:5 — Remove "mcp__cocoindex_code__search" from allowed-tools

**Phase 3: Code-graph documentation (aligns with RQ3 decouple)**
- .opencode/skills/system-code-graph/SKILL.md:16 — Remove semantic vs structural contrast, update to structural-only guidance
- .opencode/skills/system-code-graph/SKILL.md:22-23 — Remove "Semantic search" glossary entry
- .opencode/skills/system-code-graph/SKILL.md:74-76 — Remove semantic/hybrid routing branches from pseudocode
- .opencode/skills/system-code-graph/SKILL.md:84 — Remove CCC bridge integration reference
- .opencode/skills/system-code-graph/SKILL.md:123 — DELETE CCC intent signal entry
- .opencode/skills/system-code-graph/SKILL.md:291 — DELETE CocoIndex bridge table row
- .opencode/skills/system-code-graph/SKILL.md:404 — Remove ccc_bridge_integration.md resource reference
- .opencode/skills/system-code-graph/ARCHITECTURE.md:73,107,158,164 — Remove CocoIndex bridge references from architecture
- .opencode/skills/system-code-graph/README.md:30,140,155-161,262-264,343 — Remove CocoIndex bridge section and references

**Phase 4: Verification and cleanup**
- AGENTS.md:66 — Remove "CocoIndex Code MCP" from MANDATORY TOOLS section
- Verify all semantic routing references are removed or repointed
- Update any remaining conceptual guidance that assumes semantic search exists

## Gaps for next iteration

1. **Runtime config mirrors:** This iteration focused on canonical paths (`.opencode/agents/`, `.opencode/commands/`, `.opencode/skills/`). Need to enumerate semantic search routing in runtime mirrors (`.claude/`, `.gemini/`, `.codex/`) for RQ5 4-runtime mirror analysis.

2. **Grep pattern guidance:** The HYBRID policy assumes Grep can approximate concept search, but there's no documented guidance on constructing effective Grep patterns for concept discovery. Need to develop or reference existing Grep pattern best practices.

3. **code-graph context seed sources:** The `code_graph_context` tool accepts seeds from "CocoIndex, manual input, or graph lookups" [SOURCE: .opencode/skills/system-code-graph/README.md:140]. After CocoIndex removal, need to clarify if manual input and graph lookups are sufficient, or if the seed contract needs updating.

4. **User expectation management:** The transition from semantic search to Grep + code-graph may break user workflows that rely on concept discovery. Need to identify which user-facing workflows (README, install guides, playbooks) promise semantic search and update them to set correct expectations.

5. **Integration with RQ3:** This iteration's recommendation aligns with RQ3's code-graph decouple work (neutralizing semantic routing in `query-intent-classifier.ts`). Need to verify that the HYBRID policy is consistent with the RQ3 neutralization strategy chosen in iteration-003.
