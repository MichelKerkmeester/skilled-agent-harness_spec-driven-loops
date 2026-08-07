---
title: "Iter 018 — Track 8: ownership-boundary.md spec"
iteration: 18
track: 8
focus: "ownership-boundary.md spec"
status: complete
newInfoRatio: 0.85
findings: 7
timestamp: 2026-05-15T17:31:35Z
---

## Iter 018 Findings

### Research Summary

I've researched the ownership boundary between system-spec-kit and system-code-graph by examining:

1. **Packet 014 (system-code-graph-extraction)** - The extraction history that moved structural indexing from system-spec-kit to a standalone skill
2. **Deep-loop library** - Executor support for deep research/review workflows (stays in system-spec-kit)
3. **Coverage-graph library** - Deep-loop coverage graph storage and query (stays in system-spec-kit)
4. **Code-graph-boundary.ts** - The integration boundary where system-spec-kit reads system-code-graph data
5. **Current architecture docs** - SKILL.md and ARCHITECTURE.md in both skills

### Key Ownership Rationale

**Why deep-loop + coverage tools stay in system-spec-kit:**
- Deep-loop owns research and review loop state (executor configuration, audit logs, prompt rendering, post-dispatch validation)
- Coverage-graph owns session-scoped deep-loop coverage graphs with convergence snapshots
- These are workflow-state management concerns, not structural code indexing
- They integrate with spec-folder lifecycle, memory continuity, and session management
- Moving them would divorce research/review state from the spec-kit workflow engine

**Why structural indexing moved to system-code-graph:**
- AST parsing, symbol extraction, and graph storage are pure code-structure concerns
- Readiness state machine, scan loop, and query paths are independent of spec workflows
- MCP tool surface (code_graph_*, ccc_*, detect_changes) is a standalone service
- Allows independent iteration on graph algorithms without touching spec-kit

### Integration Points

**system-spec-kit → system-code-graph read paths:**
1. **Startup briefs** - `code-graph-boundary.ts` reads `.code-graph-readiness.json` marker from system-code-graph database
2. **MCP tool calls** - `callCodeGraphTool()` spawns mk-code-index launcher subprocess for query/status/classify operations
3. **In-process imports** - Handlers/hooks import directly from `system-code-graph/mcp_server/lib/*` for shared readiness helpers
4. **Shared SQLite** - Single-writer scan loop in system-code-graph; readers in both skills coordinate via WAL mode

**Contract boundary:**
- system-spec-kit owns the workflow orchestration and research state
- system-code-graph owns the structural data and read path safety
- The boundary is the readiness marker + MCP tool interface + shared DB file

---

## Spec: ownership-boundary.md

### Frontmatter Shape

```yaml
---
title: "Ownership Boundary: system-spec-kit vs system-code-graph"
description: "Explains why deep-loop and coverage tools remain in system-spec-kit while structural indexing lives in system-code-graph, with integration points and extraction history."
trigger_phrases:
  - "ownership boundary"
  - "deep loop vs code graph"
  "coverage graph ownership"
  - "system-spec-kit system-code-graph split"
importance_tier: "important"
contextType: "reference"
---
```

### Section Outline

1. **Overview**
   - Purpose of this document
   - High-level ownership split rationale

2. **What Lives in system-spec-kit**
   - Deep-loop library (executor support)
   - Coverage-graph library (deep-loop coverage graphs)
   - Rationale: workflow state ownership

3. **What Lives in system-code-graph**
   - Structural indexing (AST parsing, symbol extraction)
   - Readiness state machine
   - MCP tool surface (code_graph_*, ccc_*, detect_changes)
   - Rationale: pure code-structure service

4. **Integration Points**
   - Startup briefs via code-graph-boundary.ts
   - MCP tool calls (subprocess spawning)
   - In-process library imports
   - Shared SQLite coordination

5. **Extraction History**
   - Packet 014 (system-code-graph-extraction)
   - ADR-001 and ADR-002 decisions
   - What moved vs what stayed

6. **Decision Rationale**
   - Why deep-loop stayed (workflow state coupling)
   - Why coverage-graph stayed (session-scoped research state)
   - Why structural indexing moved (service independence)

7. **Future Considerations**
   - Potential migration scenarios
   - When to reconsider boundaries

### Key Facts Per Section

**Section 1 - Overview:**
- Document clarifies the intentional split between workflow state (system-spec-kit) and structural data (system-code-graph)
- The boundary emerged from packet 014 extraction analysis
- Prevents confusion about why some graph-related code stayed in spec-kit

**Section 2 - system-spec-kit ownership:**
- Deep-loop: executor-config.ts, executor-audit.ts, post-dispatch-validate.ts, prompt-pack.ts
- Coverage-graph: coverage-graph-db.ts, coverage-graph-query.ts, coverage-graph-signals.ts
- These own research/review loop state, iteration logs, convergence snapshots
- Tightly coupled to spec-folder lifecycle and memory continuity

**Section 3 - system-code-graph ownership:**
- Structural indexer (tree-sitter parsing, symbol extraction)
- SQLite graph storage (code_files, code_nodes, code_edges tables)
- Readiness state machine (fresh/stale/empty/error/absent)
- 10 MCP tools via mk-code-index server
- Pure code-structure service with no workflow dependencies

**Section 4 - Integration points:**
- code-graph-boundary.ts in system-spec-kit reads readiness marker from system-code-graph database
- callCodeGraphTool() spawns mk-code-index launcher subprocess for MCP operations
- Direct in-process imports from system-code-graph/mcp_server/lib/* for shared helpers
- Shared SQLite file with single-writer invariant (scan loop in system-code-graph)

**Section 5 - Extraction history:**
- Packet 014 (system-spec-kit/026-graph-and-context-optimization/005-code-graph/014-system-code-graph-extraction)
- Executed 6-phase migration (015-020) + 14 follow-on phases (021-034)
- ADR-001 locked: co-resident MCP (later superseded), stable tool-ids, DB move, sibling imports
- ADR-002 superseded Q3: moved to standalone MCP topology
- 108 code-graph files moved; deep-loop and coverage-graph explicitly excluded

**Section 6 - Decision rationale:**
- Deep-loop stayed because it owns executor configuration and research loop state
- Coverage-graph stayed because it's session-scoped to spec-folder research workflows
- Structural indexing moved because it's a reusable service independent of spec workflows
- Separation allows independent iteration on graph algorithms vs workflow orchestration

**Section 7 - Future considerations:**
- No current plans to migrate deep-loop or coverage-graph
- Migration would require decoupling from spec-folder lifecycle and memory continuity
- Consider only if deep-loop becomes a general-purpose executor service beyond spec workflows

ITER_018_COMPLETE: 7 findings, newInfoRatio=0.85
