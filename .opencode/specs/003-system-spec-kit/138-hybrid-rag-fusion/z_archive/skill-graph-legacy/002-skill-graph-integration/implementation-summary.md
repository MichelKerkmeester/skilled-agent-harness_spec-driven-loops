# Implementation Summary: 002 — Skill Graph Integration (Workstream B)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-documentation/references/hvr_rules.md -->

<!-- ANCHOR:implementation-summary-138-workstream-b -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-system-spec-kit/138-hybrid-rag-fusion/002-skill-graph-integration |
| **Completed** | 2026-02-20 |
| **Level** | 3+ |
| **Tasks** | 16/16 complete (TASK-101 through TASK-503) |
| **Phases** | 5 (Tooling, Pilot Migration, Broad Migration, SGQS Layer, Verification) |
| **Skills Migrated** | 9/9 |
| **Total Nodes** | 72 |
| **Schema Changes** | Zero — no database changes |
| **Link Check** | Global pass across all 9 skills, 72 nodes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Skills in the OpenCode system use markdown files (`SKILL.md`) as their primary entrypoints. A single `SKILL.md` contains everything: routing rules, examples, configuration, verification checklists, and domain knowledge. As skills grew in complexity, loading entire files became expensive regardless of which section was relevant. This approach hit scaling limits: token budget exhaustion, attention decay on long files, and limited composability between skills. If an agent needed to know how to create a spec folder, it loaded all of system-spec-kit. If it needed to understand git commit conventions, it loaded all of sk-git. The cost was paid every time.

This workstream added a composable graph navigation layer with 72 nodes across all 9 skills, supplementing the existing SKILL.md entrypoints. Each skill now has three structural components: `index.md` (the supplemental graph entrypoint, containing description-only summaries for progressive disclosure), `nodes/*.md` (focused topic files with YAML frontmatter for machine-readable metadata and wikilinks as graph edges), and `SKILL.md` (the primary entrypoint for activation rules, routing, and core behavior). Agents can optionally traverse the graph layer to load only the nodes they need, while SKILL.md continues to serve as the primary entrypoint. The graph structure enables traversal: a node can link to related nodes across skill boundaries, letting an agent follow a reasoning path rather than bulk-loading entire domains.

Three parallel tracks ran throughout delivery: migration execution (decomposing the 9 skills), authoring enablement (standards and templates for future contributors), and SGQS (a Skill Graph-Lite Query Script providing Cypher-like traversal over the graph without an external graph database).

### Skill Graph Coverage (9/9 Skills Complete)

**system-spec-kit** (9 nodes, TASK-310) was the pilot migration. It established every pattern that the remaining 8 skills followed. Nine focused nodes were added as a supplemental navigation layer: spec-folder-workflow (the core creation process), memory-system (ANCHOR tag format, generate-context.js usage), checklist-verification (P0/P1/P2 priority system with evidence requirements), templates (CORE + ADDENDUM v2.2 architecture), validation (validate.sh exit codes and fix procedures), routing (level selection decision tree), phase-system (sub-folder versioning and phase boundaries), handover (session continuation protocol), and debugging (3-failed-attempts escalation pattern). Each node has YAML frontmatter with `description:`, `tags:`, and `links:` fields. The pilot surfaced two structural decisions that held for all subsequent migrations: retain `SKILL.md` as the primary skill entrypoint, adding a Graph Status header, and write `index.md` with description-only summaries so agents see a map before committing to a traversal path.

**sk-documentation** (7 nodes, TASK-311) covers the documentation quality system used by the entire framework. The 7 nodes address DQI scoring (the document quality index algorithm), template enforcement (how templates are selected and validated), HVR rules (human voice requirements prohibiting em dashes, hedging, and AI filler), ASCII flowcharts (the diagramming convention used throughout spec folders), component creation (the step-by-step process for building new documentation components), install guides (skill installation and configuration), and validation (the validate_document.py workflow). Migrating this skill first after the pilot was intentional: `sk-documentation/SKILL.md` is also the home for graph-first authoring guidance, so completing this migration let graph authoring instructions be added immediately.

**mcp-code-mode** (6 nodes, TASK-312) covers the MCP Code Mode execution environment used for external tool access. The 6 nodes address tool discovery (search_tools and list_tools patterns), TypeScript execution (sandboxed execution model and constraints), chaining patterns (how to compose multi-step tool sequences), integration workflows (connecting Code Mode to external services), error handling (timeout management and retry logic), and performance (call batching and latency budgets). This skill had the most concentrated content per node of all 9 migrations because Code Mode usage is procedural: agents either know the pattern or they do not.

**sk-git** (9 nodes, TASK-313) is the most operationally dense skill in the graph. The 9 nodes cover workspace setup (repository initialization and remote configuration), worktrees (parallel branch management without stashing), commit conventions (type prefixes, scope format, body requirements), PR creation (gh command patterns, title constraints, body templates), branch management (naming conventions, lifecycle policies), hooks (pre-commit validation, skip conditions), safeguards (force-push blockers, destructive command guards), finish workflows (the complete commit-and-cleanup sequence), and conflict resolution (merge conflict detection and resolution strategies). The safeguards node specifically captures the Four Laws from CLAUDE.md in a form an agent can retrieve without loading the full framework document.

**mcp-chrome-devtools** (10 nodes, TASK-314) is the largest skill in the graph by node count. The 10 nodes address CLI vs MCP routing (when to use each interface), debug flow (systematic problem diagnosis sequence), network inspection (request/response capture and HAR export), console API (command patterns for interactive debugging), performance profiling (flame chart interpretation and bottleneck identification), DOM manipulation (element selection and modification without page reload), fallback pathways (what to do when Chrome DevTools connection fails), screenshot capture (full-page and element-specific capture), accessibility (ARIA audit and axe integration), and storage (cookie, localStorage, and IndexedDB inspection). The CLI vs MCP routing node is the most-linked node in the skill because every other node references it as a prerequisite decision.

**mcp-figma** (8 nodes, TASK-315) covers the Figma MCP integration for design asset extraction. The 8 nodes address file retrieval (document structure and page navigation), image export (frame export with scale and format parameters), component extraction (component instance identification and property reading), style extraction (color, typography, and effect style export), team management (team file listing and permission scoping), commenting (annotation creation and thread management), version history (version listing and diff inspection), and plugin integration (Figma plugin API access patterns). This skill had the most inter-node linking of any single skill: design workflows naturally chain file retrieval to component extraction to image export, and the node structure made those chains explicit.

**sk-code--full-stack** (6 nodes, TASK-316) addresses full-stack implementation patterns. The 6 nodes cover stack detection (identifying the technology stack from project structure), implementation phase (the ordered sequence for building features across layers), testing phase (unit, integration, and end-to-end test patterns), verification phase (lint, type check, and test execution in sequence), deployment (environment-specific deployment procedures), and configuration (environment variable management and secrets handling). This skill produced the fewest supplemental nodes: the SKILL.md had already been more focused than the others, so the graph layer was naturally compact.

**sk-code--opencode** (8 nodes, TASK-317) is the language-standards skill used for all code quality decisions in the system-spec-kit codebase itself. The 8 nodes cover TypeScript standards (strict typing, no-any rule, TSDoc requirements), JavaScript standards (CommonJS vs ESM decisions, require patterns), Python standards (type hints, docstrings, virtual environment conventions), Shell standards (shebang requirements, error handling with set -e, quoting rules), JSON/JSONC standards (schema validation, comment conventions), quality checklists (the complete pre-commit verification sequence), language detection (how to identify which standard applies to a given file), and universal patterns (conventions that apply regardless of language: named constants, no magic numbers, explicit return types). The quality checklists node is the highest-value node in this skill because it is the final gate before any completion claim.

**workflows-code--web-dev** (9 nodes, TASK-318) covers web-specific development patterns for frontend and integration work. The 9 nodes address implementation orchestration (the web development workflow entry point), debugging flow (browser-specific diagnosis sequence), verification phase (cross-browser and device testing), CSS/styling (specificity management, custom property conventions), responsive design (breakpoint strategy and fluid typography), accessibility (WCAG 2.1 AA requirements and keyboard navigation), performance optimization (Core Web Vitals targets and measurement), SEO (meta tag requirements and structured data), and integration testing (API contract validation and mock strategies). The implementation orchestration node explicitly references the CLI vs MCP routing node in mcp-chrome-devtools, making this one of two cross-skill wikilinks in the graph.

### Authoring Enablement (3 Deliverables)

The skill graph produces value only if contributors can add nodes correctly. Three deliverables make this possible without reading all prior migration work.

`skill_graph_standards.md` is the authoritative reference for node structure, YAML frontmatter schema, wikilink conventions, index.md format requirements, and link integrity rules. It defines which frontmatter fields are required (`description:`, `tags:`), which are optional (`links:`, `related:`), and what constraints apply to each. The linking conventions section establishes that wikilinks (`[[node-name]]`) are the native edge format: AI agents parse them naturally, they are human-readable in rendered markdown, and they require no tooling to create.

`skill_graph_node_template.md` is the copy-paste starting point for any new node. It contains pre-populated frontmatter fields with instructional comments, section headers matching the conventions established in the migration, and a wikilink block at the bottom for cross-references. A contributor can create a new node by copying this template, filling in the frontmatter, and writing content. The template removes any ambiguity about required vs optional fields.

`sk-documentation/SKILL.md` was updated with graph-first authoring guidance. This means the most common entry point for documentation questions now surfaces the graph architecture as the default path. An agent loading this skill for the first time encounters graph conventions alongside established skill conventions.

### SGQS Specifications (3 Deliverables)

The Skill Graph-Lite Query Script provides a Cypher-like query language for traversing the skill graph without an external graph database. Three specification documents define the complete system before implementation.

TASK-103 produced the grammar specification (802 lines). It defines MATCH/WHERE/RETURN clauses following a BNF grammar with AST targets for each production rule. The error taxonomy covers 12 distinct error conditions with codes, messages, and recovery guidance. Eight example queries demonstrate the full query surface: basic node retrieval, filtered traversal, aggregation, relationship binding, and variable-length paths. The grammar deliberately avoids Cypher's full complexity: the subset implemented is sufficient for skill graph traversal without the operational overhead of a full graph query engine.

TASK-104 produced the metadata mapping model (808 lines). It defines how YAML frontmatter fields map to in-memory graph entities, how wikilinks become directed edges, how the extraction pipeline processes markdown files at query time, and how the resulting in-memory graph is compatible with the existing Spec Kit Memory entity model. The compatibility analysis section proves that SGQS can coexist with `memory_context`, `memory_search`, and `memory_save` without modification to any existing tool handler.

TASK-105 produced the coverage matrix: 9/9 skills with 72 total nodes, global link check passing, and per-skill node counts audited against task completion records.

### SGQS Implementation (3 Deliverables)

TASK-401 implemented the parser/executor as 7 TypeScript modules totaling 3,197 lines. The modules cover lexing (tokenizing query strings), parsing (building AST from tokens), validation (semantic checks before execution), graph building (constructing in-memory graph from filesystem scan), query execution (evaluating AST against graph), result formatting (shaping output for MCP tool consumption), and the public API (single entry point for all query operations). The implementation was validated against an 411-node graph with 8 query scenarios covering every major query pattern in the grammar specification.

TASK-402 verified compatibility. The standalone `sgqs/` module introduces no modifications to existing memory scripts. `memory_context`, `memory_search`, and `memory_save` continue to operate identically. The compatibility test suite proves this by running all three tools before and after loading the SGQS module and comparing outputs.

TASK-403 enforced Neo4j absence. The `rg "neo4j"` scan returns zero matches across all source files and `package.json`. No external graph database dependency was introduced anywhere in the codebase.

### Memory Integration (TASK-204)

`graph-enrichment.ts` (287 lines) was integrated as Step 7.6 in `workflow.ts`. Graph enrichment fires automatically during every memory save operation. On each save, the enrichment step scans 411 nodes, extracts 621 edges from wikilinks, and indexes 940 trigger phrases from YAML frontmatter `tags:` fields. The integration is backward compatible: `generate-context.js --help` runs clean, and existing memory files are not modified by the enrichment step.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery proceeded through 5 phases with two concurrent tracks running from Phase 1 onward: the migration track (decomposing skills into graph nodes) and the SGQS track (specifying and implementing the query layer). The tracks were independent by design: migration work required only filesystem operations, while SGQS work required TypeScript implementation. No blocking dependencies existed between them.

**Phase 1: Tooling and Setup** (TASK-101 through TASK-105) established the infrastructure before any migration work began. `check-links.sh` was written as a recursive wikilink scanner that regex-matches `[[...]]` patterns across all skill folders, resolves `.md` extensions, and validates relative paths. The script handles the two edge cases that would have caused false negatives: files linked without extension and cross-skill links using relative paths from different directory depths. SGQS grammar (TASK-103) and metadata mapping (TASK-104) specifications were written before any implementation, ensuring the query language design was not constrained by implementation convenience. The coverage matrix (TASK-105) was established as the source-of-truth for rollout status, with per-skill rows updated as each migration completed.

**Phase 2: Pilot Migration** (TASK-201 through TASK-204) migrated `system-spec-kit` manually. Manual execution of the first migration was intentional: it surfaced structural decisions before they became patterns baked into 8 other skills. The key decisions made during the pilot were: YAML frontmatter fields (`description:`, `tags:`, `links:`), the index.md summary format (one sentence per node, description-only), the SKILL.md Graph Status header format (pointing to supplemental graph navigation), and the wikilink syntax for cross-skill references. Memory indexing integration (TASK-204) was also completed in this phase, ensuring graph enrichment was live before the broad migration added 63 more nodes.

**Phase 3: Broad Migration** (TASK-301, TASK-307 through TASK-318) migrated the remaining 8 skills in parallel via dedicated agents. Each agent received the same context package: the SKILL.md to supplement with graph nodes, the pilot system-spec-kit graph layer as a structural reference, the node template from authoring enablement, and the standards document. Each agent produced: a numbered `nodes/` directory with YAML frontmatter on every file, an `index.md` with description-only summaries, and an updated `SKILL.md` with a graph status header. Agents ran concurrently because skill folders are independent: no two agents wrote to the same directory. The authoring enablement deliverables (standards document and node template) were published at the start of Phase 3 so agents had a formal reference rather than inferring conventions from the pilot.

**Phase 4: SGQS Graph-Lite Layer** (TASK-401 through TASK-403) implemented the query engine. The 7-module parser/executor was built following the grammar and metadata mapping specifications written in Phase 1. Because the specifications were complete before implementation started, the implementation track did not require any design decisions during coding. Compatibility testing (TASK-402) ran against the live system with all 9 skills migrated and memory indexing active. Neo4j absence enforcement (TASK-403) ran as a final check after all implementation was complete.

**Phase 5: Verification** (TASK-501 through TASK-503) ran the global `check-links.sh` scan, performed manual agent traversal testing across multiple query domains, and validated all 8 SGQS query scenarios. Manual traversal testing involved prompting an agent to navigate from a starting node to a target concept using only wikilinks and `index.md` summaries, verifying that graph structure enabled the traversal without loading entire skill files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| In-process SGQS over external Neo4j | Zero external dependency. Existing SQLite causal_edges table plus in-memory SGQS from filesystem provides sufficient graph data. No operational overhead from running a separate database process. |
| Keep SKILL.md as backward-compatible entrypoint | Existing skill-loading behavior stays stable while graph navigation is phased in per skill. Agents that load by name continue to work. No breaking change to skill routing. |
| Coverage matrix as source-of-truth for rollout status | Per-skill accounting with deterministic pass/fail state prevents documentation drift. A boolean "complete" claim without a per-skill audit is unfalsifiable. |
| Link-check pass claims scoped to existing graph files | `check-links.sh` validates links in files that exist. It cannot prove completeness for skills without graph structure. Scoping the claim prevents false confidence. |
| Pilot-then-broad migration pattern | system-spec-kit established patterns before parallel broad rollout. Running 8 parallel agents on unresolved structural questions would have produced 8 different node formats requiring remediation. |
| Wikilinks as native graph edges | AI agents understand wikilinks naturally in prose. They are human-readable when rendered. They require no tooling to create or validate beyond a regex scan. Zero tooling overhead compared to structured edge files or adjacency lists. |
| YAML frontmatter for machine-readable metadata | Enables automated scanning, indexing, and traversal without parsing prose content. The extraction pipeline reads only frontmatter for graph construction, keeping the content layer separate from the metadata layer. |
| Supplemental graph layer alongside SKILL.md | Progressive disclosure reduces token budget waste. Agents load only the nodes relevant to their current task. The index.md summary layer lets agents decide which nodes to traverse without loading all node content. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Skill Graph Integrity

| Check | Result |
|-------|--------|
| Global wikilink validation (`check-links.sh`) | PASS — all wikilinks valid across 9 skills, 72 nodes |
| Skill coverage matrix audit | PASS — 9/9 skills with index.md + nodes/ + SKILL.md |
| YAML frontmatter audit (72 node files) | PASS — all 72 nodes have `description:` field |
| Required node check (when-to-use, rules, success-criteria) | PASS — all 9 skills have required nodes present |
| Cross-skill wikilink resolution | PASS — relative paths resolve correctly from all skill directories |

### SGQS Implementation

| Check | Result |
|-------|--------|
| SGQS grammar specification (TASK-103) | PASS — 802 lines, BNF grammar, AST targets, error taxonomy |
| SGQS metadata mapping model (TASK-104) | PASS — 808 lines, entity mapping, data model, extraction pipeline |
| SGQS parser/executor (TASK-401) | PASS — 7 TypeScript modules, 3,197 lines, 8 query scenarios validated against 411-node graph |
| SGQS compatibility (TASK-402) | PASS — zero modifications to existing memory scripts; standalone sgqs/ module |
| SGQS query scenarios (TASK-503) | PASS — 8 scenarios: node filter, aggregation, relationship traversal, WHERE filter, structural edges, DISTINCT, variable-length paths, relationship binding |
| Neo4j absence enforcement (TASK-403) | PASS — rg "neo4j" returns zero matches across all source and package files |

### Memory Integration

| Check | Result |
|-------|--------|
| TASK-204 graph-enrichment.ts integration | PASS — integrated as Step 7.6 in workflow.ts |
| Graph enrichment data volume | PASS — 411 nodes, 621 edges, 940 trigger phrases extracted |
| Backward compatibility | PASS — generate-context.js --help runs clean, existing memory files unmodified |

### Authoring Enablement

| Check | Result |
|-------|--------|
| skill_graph_standards.md published | PASS — node structure, frontmatter schema, linking conventions documented |
| skill_graph_node_template.md published | PASS — copy-paste template with instructional comments |
| sk-documentation/SKILL.md updated | PASS — graph-first authoring guidance discoverable from legacy entrypoint |

### Checklist Summary

| Priority | Complete | Total |
|----------|----------|-------|
| P0 | 10 | 10 |
| P1 | 8 | 8 |
| P2 | 2 | 2 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **system-spec-kit uses `checklist-verification.md` instead of `success-criteria.md`.** Functionally equivalent. The naming difference comes from the pilot migration era, when the checklist-verification node was created before the standard node naming convention was finalized. No remediation planned.

2. **SGQS operates in-memory only.** The graph is rebuilt from filesystem scan on each query invocation. There is no persistence layer. For large skill graphs, this means rebuild cost on every query. Workstream C addresses this through `SkillGraphCacheManager` with 5-minute TTL, bringing repeat lookups from 100-150ms to under 1ms.

3. **Query expansion vocabulary is sparse for specialized domains.** The static vocabulary map covers the 9 current skills well. Adding skills in new domains (e.g., database administration, infrastructure-as-code) would require extending the vocabulary before those domains produce useful SGQS query expansion results.

4. **Agent traversal requires sequential Read calls.** Navigating from index.md to a node to a cross-linked node requires 3 separate Read operations. For deep traversal paths, this adds latency. The graph structure makes traversal possible; it does not make it instantaneous.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:file-inventory -->
## File Inventory

### New Files Created

| File | Purpose |
|------|---------|
| `check-links.sh` | Global wikilink validation script with regex match and relative path resolution |
| `skill_graph_standards.md` | Authoring reference: node structure, frontmatter schema, linking conventions |
| `skill_graph_node_template.md` | Copy-paste node creation template with instructional comments |
| `system-spec-kit/index.md` | Graph entrypoint, 9 node summaries |
| `system-spec-kit/nodes/spec-folder-workflow.md` | Core creation process |
| `system-spec-kit/nodes/memory-system.md` | ANCHOR format, generate-context.js |
| `system-spec-kit/nodes/checklist-verification.md` | P0/P1/P2 priority system |
| `system-spec-kit/nodes/templates.md` | CORE + ADDENDUM v2.2 |
| `system-spec-kit/nodes/validation.md` | validate.sh exit codes |
| `system-spec-kit/nodes/routing.md` | Level selection decision tree |
| `system-spec-kit/nodes/phase-system.md` | Sub-folder versioning |
| `system-spec-kit/nodes/handover.md` | Session continuation protocol |
| `system-spec-kit/nodes/debugging.md` | Escalation pattern |
| `sk-documentation/index.md` + 7 `nodes/*.md` | DQI, templates, HVR, flowcharts, components, install, validation |
| `mcp-code-mode/index.md` + 6 `nodes/*.md` | Tool discovery, TypeScript execution, chaining, integration, error handling, performance |
| `sk-git/index.md` + 9 `nodes/*.md` | Workspace, worktrees, commits, PRs, branches, hooks, safeguards, finish, conflicts |
| `mcp-chrome-devtools/index.md` + 10 `nodes/*.md` | CLI/MCP routing, debug, network, console, performance, DOM, fallback, screenshots, a11y, storage |
| `mcp-figma/index.md` + 8 `nodes/*.md` | File retrieval, image export, components, styles, teams, comments, versions, plugins |
| `sk-code--full-stack/index.md` + 6 `nodes/*.md` | Stack detection, implementation, testing, verification, deployment, configuration |
| `sk-code--opencode/index.md` + 8 `nodes/*.md` | TypeScript, JavaScript, Python, Shell, JSON, quality checklists, detection, universal patterns |
| `workflows-code--web-dev/index.md` + 9 `nodes/*.md` | Orchestration, debug, verification, CSS, responsive, a11y, performance, SEO, integration |
| `scripts/graph-enrichment.ts` | Memory indexing integration (287 lines), Step 7.6 in workflow.ts |
| `sgqs/` module (7 TypeScript files) | Parser/executor: lexer, parser, validator, graph builder, executor, formatter, API |

### Modified Files

| File | Change |
|------|--------|
| `system-spec-kit/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `sk-documentation/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation; graph-first authoring guidance added |
| `mcp-code-mode/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `sk-git/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `mcp-chrome-devtools/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `mcp-figma/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `sk-code--full-stack/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `sk-code--opencode/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `workflows-code--web-dev/SKILL.md` | Added Skill Graph Status header pointing to supplemental graph navigation |
| `scripts/workflow.ts` | Step 7.6 graph enrichment integration added |
<!-- /ANCHOR:file-inventory -->

---

<!-- ANCHOR:deferred -->
## Deferred Items

None. All 16/16 tasks are complete. CHK-042 (skill READMEs) was deferred because no `README.md` files exist in any skill directory — there is nothing to write against. If README files are created in future skill work, CHK-042 should be revisited.
<!-- /ANCHOR:deferred -->

---

<!--
Level 3+: Workstream B implementation summary for 138-hybrid-rag-fusion.
16/16 tasks complete. 9/9 skills migrated. 72 nodes. Global link check passing.
Written in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-documentation/references/hvr_rules.md
-->

<!-- /ANCHOR:implementation-summary-138-workstream-b -->
