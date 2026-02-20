# Decision Record: Unified Hybrid RAG Fusion + Skill Graph

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/workflows-documentation/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Unified Architecture Approach

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |
| **Complexity Score Impact** | +20 (Architecture dimension — unified multi-workstream scope) |

---

### Context

Two independent feature tracks — Hybrid RAG Fusion (multi-channel retrieval with MMR and RRF) and Skill Graph Query Syntax (graph traversal for memory relationships) — were scoped separately but both target the same system: system-spec-kit's memory intelligence layer. Executing them as independent specs would require coordinating schema access, shared TypeScript infrastructure, and integration tests twice.

### Constraints

- Both workstreams share the same SQLite v15 schema and memory MCP server
- SGQS graph metadata directly enriches RAG fusion's graph retrieval channel
- Independent specs would produce competing migration paths and split test coverage
- Coordination overhead for two parallel spec tracks exceeds the cost of a single unified parent

---

### Decision

**We chose**: Combine Hybrid RAG Fusion and Skill Graph Query Syntax under a single parent spec (138-hybrid-rag-fusion) using sub-folder versioning for workstream separation.

**How it works**: The root spec folder provides shared governance, a unified decision record, and cross-workstream tracking. Workstream A (`001-rag-fusion/`) owns retrieval pipeline changes. Workstream B (`002-skill-graph/`) owns graph query execution. Both sub-folders maintain independent task tracking but reference this root for architectural decisions.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified parent + sub-folders (chosen)** | Shared infrastructure, natural integration, single governance view | Slightly more complex folder navigation | 9/10 |
| Separate independent specs | Full isolation, independent rollout | Missed SGQS-RAG synergies, duplicated coordination, schema race conditions | 5/10 |
| Sequential execution (RAG first, then Graph) | Reduced parallelism risk | Delays SGQS delivery by 4-6 weeks; RAG fusion misses graph channel enrichment at launch | 4/10 |

**Why this one**: Unified spec eliminates redundant coordination for two workstreams that share infrastructure and have a natural integration point (SGQS metadata enriches graph retrieval channel). The sub-folder structure preserves clean task separation without sacrificing shared governance.

---

### Consequences

**What improves**:
- Single schema access path reduces migration risk
- SGQS graph channel available to RAG fusion from day one
- Unified checklist and decision record for cross-workstream audits
- Integration test surface is shared, not duplicated

**What it costs**:
- Sub-folder navigation adds minor cognitive overhead. Mitigation: Root spec.md provides clear workstream index and routing guide.
- Unified governance means both workstreams must coordinate on shared decisions. Mitigation: ADR index at root; workstream-specific ADRs live in sub-folder decision records.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Workstream A delays block Workstream B | M | Sub-folders are independently executable; no hard dependency on delivery order |
| Shared schema changes conflict | H | ADR-002 zero-migration constraint eliminates this risk entirely |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both workstreams active simultaneously; coordination cost is real |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated; unified approach scored highest |
| 3 | **Sufficient?** | PASS | Sub-folder versioning provides required separation without new tooling |
| 4 | **Fits Goal?** | PASS | Directly accelerates delivery of unified memory intelligence upgrade |
| 5 | **Open Horizons?** | PASS | Sub-folder pattern is reusable for future multi-workstream specs |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Spec folder 138-hybrid-rag-fusion created as parent with sub-folders 001-rag-fusion/ and 002-skill-graph/
- Root decision-record.md governs cross-cutting decisions; workstream ADRs in sub-folder decision records
- Shared checklist.md at root tracks cross-workstream integration milestones

**How to roll back**: Archive 138 parent; create separate spec folders 139-rag-fusion and 140-skill-graph with content ported from sub-folders. No code changes required.

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Zero Schema Migration Constraint

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |
| **Complexity Score Impact** | +15 (Risk dimension — schema stability guarantee) |

---

### Context

Both workstreams need to store and query data. The system-spec-kit memory MCP uses a SQLite database at schema version 15. Introducing schema changes requires migration tooling, version management, forward/backward compatibility testing, and rollback procedures. Both Hybrid RAG Fusion and SGQS were evaluated to determine whether new columns, tables, or external databases were necessary.

### Constraints

- SQLite v15 schema is production-active with existing memory data
- Schema migration tooling does not exist in the current codebase
- TypeScript orchestration layer can compute embeddings, scores, and graph traversals in process
- External vector DBs (Pinecone) and graph DBs (Neo4j) introduce infrastructure dependencies not present in the project

---

### Decision

**We chose**: All capabilities must execute on the existing v15 SQLite schema with no new tables, columns, or external databases.

**How it works**: Workstream A implements MMR, TRM, RRF, and multi-query expansion entirely in TypeScript using existing `memories` and `memory_relationships` tables. Workstream B implements SGQS graph traversal as an in-process interpreter over the same schema. Scores and intermediate results are computed at query time and not persisted.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Existing v15 schema only (chosen)** | Zero migration risk, no infrastructure overhead, instant rollback | Cannot store pre-computed embeddings or graph indexes (must recompute at query time) | 9/10 |
| Add vector columns to memories table | Faster retrieval, pre-computed distances | Schema migration required, large storage overhead per row, rollback complexity | 4/10 |
| Pinecone for vector storage | Purpose-built for embeddings, fast ANN search | External dependency, API costs, network latency, new credential management | 3/10 |
| Neo4j for graph storage | Native graph traversal, Cypher query language | Requires running external server, Docker dependency, data sync with SQLite | 2/10 |

**Why this one**: TypeScript in-process computation on existing schema is sufficient for the expected memory dataset sizes (thousands of entries, not millions). The zero-migration constraint eliminates an entire class of production risk and keeps the system dependency-free.

---

### Consequences

**What improves**:
- Instant rollback: feature flags off reverts to baseline retrieval with no data changes
- No external dependencies to provision, monitor, or pay for
- Schema stability for all existing memory data
- Simpler deployment (no migration step)

**What it costs**:
- Embeddings and graph traversal scores are computed at query time, not cached. Mitigation: Acceptable for current dataset sizes; caching layer can be added in a future spec if latency becomes measurable.
- Cannot use ANN (approximate nearest neighbor) algorithms that require pre-built indexes. Mitigation: Exact cosine similarity on in-memory vectors is sufficient for <10,000 memories.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Query latency increases with dataset growth | M | Monitor p95 latency; add caching if >500ms threshold hit |
| Schema v15 has insufficient fields for future needs | M | Evaluate on a per-spec basis; ADR-002 applies only to this spec |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Migration tooling absent; constraint is forced by current state |
| 2 | **Beyond Local Maxima?** | PASS | Four storage options evaluated; in-process approach scored highest for this scope |
| 3 | **Sufficient?** | PASS | In-process TypeScript handles required dataset sizes |
| 4 | **Fits Goal?** | PASS | Eliminates highest-risk delivery blocker (schema migration) |
| 5 | **Open Horizons?** | PASS | Does not prevent future schema changes in separate specs |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- No schema changes (constraint by definition)
- TypeScript query layer reads from `memories` and `memory_relationships` tables
- All scoring (MMR lambda, RRF k, cosine similarity) computed in process at retrieval time

**How to roll back**: No schema to revert. Disable feature flags (ADR-003) to restore baseline retrieval behavior.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Feature Flag Dark Launch Strategy (Workstream A)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |
| **Complexity Score Impact** | +10 (Risk dimension — controlled rollout) |

---

### Context

Workstream A modifies the core `memory_search` retrieval path — the most frequently called operation in the MCP server. Changes to retrieval ranking, MMR diversity reranking, and multi-query expansion affect every consumer of the memory context pipeline. A regression in this path would silently degrade all context delivery without an obvious failure signal.

### Constraints

- `memory_search` is called by every agent context load operation
- No automated regression test suite exists for retrieval quality
- Feature flags must not require schema changes (ADR-002)
- Rollback must be possible without redeployment (environment variable toggle)

---

### Decision

**We chose**: Ship all Workstream A capabilities behind environment variable feature flags defaulting to false: `SPECKIT_MMR`, `SPECKIT_TRM`, `SPECKIT_MULTI_QUERY`.

**How it works**: Each flag guards a distinct retrieval enhancement. `SPECKIT_MMR=true` enables Maximal Marginal Relevance reranking post-retrieval. `SPECKIT_TRM=true` enables temporal recency weighting in scoring. `SPECKIT_MULTI_QUERY=true` enables query expansion before retrieval. Flags are independent and composable. All flags default to false, preserving baseline behavior on deployment.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Feature flags defaulting false (chosen)** | Zero-risk deployment, instant rollback, gradual enablement | Adds conditional branching to retrieval path; flags must be cleaned up post-stabilization | 9/10 |
| Direct production deployment | Simpler code (no flags) | Any regression immediately affects all context loads; no rollback without redeploy | 2/10 |
| Branch-based separation | Clean code until merge | Does not address risk at merge time; delays integration testing | 3/10 |
| A/B test framework | Scientific measurement | Over-engineered for single-user system; no traffic split meaningful | 1/10 |

**Why this one**: Feature flags with false defaults give the deployment risk profile of a no-op while enabling production testing of each enhancement independently. Each flag can be enabled, monitored, and disabled in under 60 seconds without a code change.

---

### Consequences

**What improves**:
- Deployment of Workstream A carries zero risk to baseline retrieval quality
- Each enhancement can be validated independently before enabling the next
- Rollback requires only an environment variable change

**What it costs**:
- Three additional conditional branches in the retrieval path. Mitigation: Branches are top-level guards (if MMR_ENABLED), not nested; performance cost is negligible.
- Flags must be removed after stabilization to avoid permanent conditional debt. Mitigation: Flag cleanup tracked as P1 task in tasks.md after 30-day stable period.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flags left enabled after stabilization without cleanup | L | P1 task in tasks.md with explicit cleanup checkpoint |
| Flag interaction bugs when multiple flags enabled | M | Integration tests cover all flag combination states |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Core retrieval path change requires risk mitigation |
| 2 | **Beyond Local Maxima?** | PASS | Four deployment strategies evaluated |
| 3 | **Sufficient?** | PASS | Three flags cover all Workstream A capabilities |
| 4 | **Fits Goal?** | PASS | Enables safe delivery of high-value retrieval improvements |
| 5 | **Open Horizons?** | PASS | Flag pattern is reusable for future MCP server enhancements |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `SPECKIT_MMR` flag guards MMR reranking in `memory_search` handler
- `SPECKIT_TRM` flag guards temporal recency multiplier in score calculation
- `SPECKIT_MULTI_QUERY` flag guards query expansion pre-retrieval
- All three flags read from environment at server startup; no runtime config changes

**How to roll back**: Set `SPECKIT_MMR=false SPECKIT_TRM=false SPECKIT_MULTI_QUERY=false` in environment. Restart MCP server. No data changes required.

**Sub-folder reference**: Detailed task breakdown in `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/001-rag-fusion/tasks.md`

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: SGQS In-Process Execution (Workstream B)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted — Implemented |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |
| **Complexity Score Impact** | +25 (Research dimension — novel query interpreter) |

---

### Context

Workstream B needs graph traversal semantics over memory relationships: finding related memories by edge type, traversing multi-hop paths, filtering by relationship strength. The natural solution is a graph database (Neo4j) with Cypher query language. However, the system has no external server dependencies and ADR-002 prohibits external databases. The alternative is implementing a graph traversal capability that works on the existing SQLite `memory_relationships` table.

### Constraints

- No external server infrastructure (ADR-002)
- Must use existing SQLite schema (v15)
- Graph queries must be expressible in a syntax that TypeScript can parse and execute
- Must integrate with the existing MCP tool interface (skill graph queries as MCP tool calls)

---

### Decision

**We chose**: Implement SGQS as an in-process TypeScript interpreter that accepts a Neo4j-style Cypher subset syntax and executes it against the SQLite `memory_relationships` table.

**How it works**: A purpose-built SGQS parser tokenizes graph query strings (e.g., `MATCH (m:memory)-[r:RELATED_TO]->(n) WHERE r.strength > 0.7 RETURN n`). The interpreter maps parsed AST nodes to SQLite JOIN queries on `memories` and `memory_relationships`. Results are returned as structured memory objects. The interpreter runs entirely in process within the MCP server TypeScript runtime.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-process TypeScript SGQS interpreter (chosen)** | Zero infrastructure, runs on existing schema, dependency-free | Must implement subset of Cypher semantics; limited to SQLite join expressiveness | 9/10 |
| External Neo4j server | Full Cypher support, native graph algorithms | Requires running server, data sync with SQLite, Docker dependency, violates ADR-002 | 1/10 |
| Cypher client library (without Neo4j) | Parsing handled externally | No execution layer without graph DB; still requires Neo4j or equivalent | 1/10 |
| Raw SQL graph traversal (no query language) | Simplest implementation | No reusable query interface; every traversal pattern requires custom SQL | 4/10 |

**Why this one**: In-process execution is the only option compatible with ADR-002 and the zero-dependency constraint. The Cypher subset covers the graph traversal patterns needed by the memory context pipeline. Implementing the interpreter in TypeScript keeps the full capability within the existing MCP server process.

---

### Consequences

**What improves**:
- Graph traversal queries become first-class MCP tool capabilities
- SGQS graph metadata available to RAG fusion's graph retrieval channel (ADR-001 integration point)
- No new infrastructure to maintain or monitor
- Query syntax is human-readable and debuggable

**What it costs**:
- Implementing a Cypher subset interpreter is significant engineering work (~800 LOC). Mitigation: Scope limited to 6 MATCH/WHERE/RETURN patterns sufficient for memory graph traversal; full Cypher not required.
- SQLite JOINs for multi-hop traversal are less performant than native graph algorithms. Mitigation: Acceptable for current dataset sizes; depth limit of 3 hops prevents runaway queries.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Parser complexity exceeds estimate | M | Scope limited to 6 query patterns; recursive descent parser well-understood approach |
| Multi-hop JOIN performance degrades | M | Depth limit of 3 hops; query timeout at 5s enforced in MCP handler |
| SGQS syntax diverges from real Cypher (future migration pain) | L | Documented as intentional subset; migration guide written if Neo4j added later |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Graph traversal capability does not exist in current system; memory relationships underutilized |
| 2 | **Beyond Local Maxima?** | PASS | Four options evaluated; in-process interpreter is the only viable approach given constraints |
| 3 | **Sufficient?** | PASS | 6-pattern subset covers all identified memory graph query use cases |
| 4 | **Fits Goal?** | PASS | SGQS graph channel directly feeds RAG fusion multi-channel retrieval |
| 5 | **Open Horizons?** | PASS | Interpreter can be extended with additional patterns without schema changes |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- New `sgqs/` module in MCP server TypeScript source: parser, AST types, interpreter, SQLite translator
- New MCP tool `memory_graph_query` accepting SGQS query strings
- `memory_relationships` table queried via generated JOIN statements from SGQS AST
- Graph channel results fed into RAG fusion scoring pipeline

**How to roll back**: Remove `memory_graph_query` MCP tool registration. SGQS module is additive; removing it does not affect existing MCP tools. No data changes required.

**Sub-folder reference**: Detailed implementation plan in `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/002-skill-graph/plan.md`

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Sub-Folder Versioning for Workstreams

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | Michel Kerkmeester |
| **Complexity Score Impact** | +5 (Architecture dimension — spec governance pattern) |

---

### Context

Two distinct workstreams (RAG Fusion and Skill Graph) need independent task tracking, separate implementation plans, and dedicated checklists. Merging them into a single flat spec folder would create task list conflicts and make it impossible to track workstream-specific progress. Assigning separate spec numbers would lose the shared governance benefit established in ADR-001.

### Constraints

- system-spec-kit supports sub-folder versioning (`001-name/`, `002-name/`) under a parent spec
- Each sub-folder must support independent memory context, tasks.md, and checklist.md
- Parent spec folder must remain the authoritative governance root
- Sub-folder naming must follow the 3-digit padding convention

---

### Decision

**We chose**: Use `001-rag-fusion/` and `002-skill-graph/` as workstream sub-folders under the `138-hybrid-rag-fusion/` parent, following the system-spec-kit sub-folder versioning pattern.

**How it works**: Each sub-folder contains its own spec.md, plan.md, tasks.md, checklist.md, and memory/ directory. The parent 138 folder contains this decision-record.md, a unified spec.md (project overview), and cross-workstream tracking. The parent's memory context is saved separately from sub-folder memory contexts.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sub-folder versioning 001/ 002/ (chosen)** | Independent tracking, shared governance, follows existing spec-kit pattern | Sub-folder navigation adds one directory level | 9/10 |
| Single flat spec folder | Simplest structure | Mixed task lists, impossible to track workstream progress independently | 3/10 |
| Separate spec numbers (139, 140) | Full independence | Loses shared governance; ADR-001 rationale invalidated | 4/10 |
| Feature branches in tasks.md | Flat structure, branched tasks | Non-standard pattern; checklist tracking becomes complex | 2/10 |

**Why this one**: Sub-folder versioning is the canonical system-spec-kit pattern for multi-workstream specs. It provides the separation needed for independent progress tracking while preserving the unified governance established by ADR-001. The pattern is already supported by `validate.sh`, `memory_search`, and `generate-context.js`.

---

### Consequences

**What improves**:
- Each workstream team member can navigate directly to their sub-folder for daily work
- Memory context saves are workstream-specific (no context pollution between workstreams)
- Validate.sh and calculate-completeness.sh work correctly on each sub-folder independently
- Parent-level view provides unified governance without diving into sub-folders

**What it costs**:
- Workstream contributors must understand the parent/child spec relationship. Mitigation: Parent spec.md includes workstream index and navigation guide.
- Memory saves require explicit sub-folder paths. Mitigation: `generate-context.js` supports `003-system-spec-kit/138-hybrid-rag-fusion/001-rag-fusion` path format.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sub-folder specs diverge from parent governance decisions | M | Parent decision-record.md is authoritative; sub-folder ADRs reference parent ADRs |
| Memory context retrieval misses sub-folder context | L | `memory_search` with specFolder parameter targets correct sub-folder path |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two workstreams with independent delivery timelines require separate tracking |
| 2 | **Beyond Local Maxima?** | PASS | Four structural options evaluated |
| 3 | **Sufficient?** | PASS | Sub-folder pattern is already supported by all spec-kit tooling |
| 4 | **Fits Goal?** | PASS | Enables independent workstream progress without losing unified governance |
| 5 | **Open Horizons?** | PASS | Pattern scales to additional workstreams (003-name/) if scope expands |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `001-rag-fusion/` created with full Level 3 spec set (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- `002-skill-graph/` created with full Level 3 spec set
- Parent `138-hybrid-rag-fusion/` retains root-level decision-record.md, spec.md, and cross-workstream checklist items
- Memory saves use sub-folder paths for workstream-specific context

**How to roll back**: Move sub-folder contents to parent root; renumber tasks to avoid conflicts. No code changes required.

**Sub-folder references**:
- Workstream A: `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/001-rag-fusion/`
- Workstream B: `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/002-skill-graph/`

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-index -->
## ADR Index

| ADR | Title | Status | Date | Workstream |
|-----|-------|--------|------|------------|
| ADR-001 | Unified Architecture Approach | Accepted | 2026-02-20 | Both |
| ADR-002 | Zero Schema Migration Constraint | Accepted | 2026-02-20 | Both |
| ADR-003 | Feature Flag Dark Launch Strategy | Accepted | 2026-02-20 | Workstream A (RAG Fusion) |
| ADR-004 | SGQS In-Process Execution | Accepted — Implemented | 2026-02-20 | Workstream B (Skill Graph) |
| ADR-005 | Sub-Folder Versioning for Workstreams | Accepted | 2026-02-20 | Both |

**Sub-folder decision records**:
- Workstream A (RAG Fusion): `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/001-rag-fusion/decision-record.md`
- Workstream B (Skill Graph): `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/002-skill-graph/decision-record.md`
- Workstream C (Unified Graph Intelligence): `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/003-unified-graph-intelligence/decision-record.md`

<!-- /ANCHOR:adr-index -->

---

<!-- ANCHOR:workstream-c-adrs -->
## Workstream C Decision Records

> Full Workstream C (Unified Graph Intelligence) ADRs are maintained in `003-unified-graph-intelligence/decision-record.md` and include:
> - ADR-001: Virtual Graph Adapter over SQLite-Only Merge
> - ADR-002: Cache-First SGQS over Per-Call Filesystem Rebuild
> - ADR-003: Composite graphSearchFn over Separate Graph Channels
> - ADR-004: Phased Feature-Flag Rollout over Big-Bang Activation
> - ADR-005: Namespace-Prefixed Unified IDs over Shared ID Space
<!-- /ANCHOR:workstream-c-adrs -->

---

<!--
Level 3+ Decision Record: Five ADRs covering unified architecture, schema constraint, dark launch strategy, SGQS in-process execution, and sub-folder versioning.
Active voice throughout. No hedging. Trade-offs documented honestly.
Sub-folder references included for workstream-specific detail.
HVR rules: .opencode/skill/workflows-documentation/references/hvr_rules.md
-->
