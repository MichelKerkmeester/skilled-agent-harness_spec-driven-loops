# 058 delta — verified

## Section 1: EDITs (modifications to existing files)

### Group A: 3 SKILL.md files

EDIT A-001: system-spec-kit/SKILL.md:Line 14
  FROM: `## 1. WHEN TO USE`
  TO:   `## 1. WHEN TO USE\n<!-- ANCHOR:1-when-to-use -->`
  REASON: Add missing anchor tag per template pattern
  ITER: 002

EDIT A-002: system-spec-kit/SKILL.md:Line 76
  FROM: `---`
  TO:   `<!-- /ANCHOR:1-when-to-use -->\n---`
  REASON: Add missing anchor end tag per template pattern
  ITER: 002

EDIT A-003: system-spec-kit/SKILL.md:Line 78
  FROM: `## 2. SMART ROUTING`
  TO:   `## 2. SMART ROUTING\n<!-- ANCHOR:2-smart-routing -->`
  REASON: Add missing anchor tag per template pattern
  ITER: 002

EDIT A-004: system-spec-kit/SKILL.md:Line 353
  FROM: `---`
  TO:   `<!-- /ANCHOR:2-smart-routing -->\n---`
  REASON: Add missing anchor end tag per template pattern
  ITER: 002

EDIT A-005: system-spec-kit/SKILL.md:Line 355
  FROM: `## 3. HOW IT WORKS`
  TO:   `## 3. HOW IT WORKS\n<!-- ANCHOR:3-how-it-works -->`
  REASON: Add missing anchor tag per template pattern
  ITER: 002

EDIT A-006: system-spec-kit/SKILL.md:Line 377
  FROM: `---`
  TO:   `<!-- /ANCHOR:3-how-it-works -->\n---`
  REASON: Add missing anchor end tag per template pattern
  ITER: 002

EDIT A-007: system-spec-kit/SKILL.md:Line 379
  FROM: `## 4. RULES`
  TO:   `## 4. RULES\n<!-- ANCHOR:4-rules -->`
  REASON: Add missing anchor tag per template pattern
  ITER: 002

EDIT A-008: system-spec-kit/SKILL.md:Line 428
  FROM: `---`
  TO:   `<!-- /ANCHOR:4-rules -->\n---`
  REASON: Add missing anchor end tag per template pattern
  ITER: 002

EDIT A-009: system-spec-kit/SKILL.md:Line 431
  FROM: `## 5. SUCCESS CRITERIA`
  TO:   `## 5. SUCCESS CRITERIA\n<!-- ANCHOR:5-success-criteria -->`
  REASON: Add missing anchor tag per template pattern
  ITER: 002

EDIT A-010: system-spec-kit/SKILL.md:Line 435
  FROM: `---`
  TO:   `<!-- /ANCHOR:5-success-criteria -->\n---`
  REASON: Add missing anchor end tag per template pattern
  ITER: 002

EDIT A-011: system-spec-kit/SKILL.md:Line 437
  FROM: `## 6. INTEGRATION POINTS`
  TO:   `## 6. INTEGRATION POINTS\n<!-- ANCHOR:6-integration-points -->`
  REASON: Add missing anchor tag per template pattern
  ITER: 002

EDIT A-012: system-spec-kit/SKILL.md:Line 456
  FROM: `---`
  TO:   `<!-- /ANCHOR:6-integration-points -->\n---`
  REASON: Add missing anchor end tag per template pattern
  ITER: 002

EDIT A-013: system-spec-kit/SKILL.md:Line 460
  FROM: `## 7. REFERENCES AND RELATED RESOURCES`
  TO:   `## 7. REFERENCES AND RELATED RESOURCES\n<!-- ANCHOR:7-references-and-related-resources -->`
  REASON: Add missing anchor tag per template pattern
  ITER: 002

EDIT A-014: system-spec-kit/SKILL.md:Line 466 (end of file)
  FROM: `[end of file]`
  TO:   `<!-- /ANCHOR:7-references-and-related-resources -->`
  REASON: Add missing anchor end tag per template pattern
  ITER: 002

EDIT A-015: system-spec-kit/SKILL.md:Line 379
  FROM: `## 4. RULES\n\n### ✅ ALWAYS`
  TO:   `## 4. RULES\n\n### ALWAYS`
  REASON: Remove emoji prefix to match template's exact subsection naming requirements
  ITER: 001

EDIT A-016: system-spec-kit/SKILL.md:Line 395
  FROM: `### ❌ NEVER`
  TO:   `### NEVER`
  REASON: Remove emoji prefix to match template's exact subsection naming requirements
  ITER: 001

EDIT A-017: system-spec-kit/SKILL.md:Line 413
  FROM: `### ⚠️ ESCALATE IF`
  TO:   `### ESCALATE IF`
  REASON: Remove emoji prefix to match template's exact subsection naming requirements
  ITER: 001

EDIT A-018: system-code-graph/SKILL.md:Line 51-57
  FROM: `| Intent | Tool | Reference |\n|-------|------|-----------|\n| Structural scan/index | mcp__mk_code_index__code_graph_scan | feature_catalog/08--doctor-code-graph/00-doctor-scan-mode.md |\n| Structural query | mcp__mk_code_index__code_graph_query | feature_catalog/08--doctor-code-graph/02-doctor-query-mode.md |\n| Graph status | mcp__mk_code_index__code_graph_status | feature_catalog/08--doctor-code-graph/03-doctor-status-mode.md |\n| Graph validation | mcp__mk_code_index__code_graph_validate | feature_catalog/08--doctor-code-graph/04-doctor-validate-mode.md |\n| Detect changes | mcp__mk_code_index__code_graph_detect_changes | feature_catalog/08--doctor-code-graph/05-doctor-detect-changes.md |\n| Context retrieval | mcp__mk_code_index__code_graph_context | feature_catalog/08--doctor-code-graph/06-doctor-context-mode.md |`
  TO:   `| Intent | Tool | Reference |\n|-------|------|-----------|\n| Structural scan/index | mcp__mk_code_index__code_graph_scan | feature_catalog/08--doctor-code-graph/00-doctor-scan-mode.md |\n| Structural query | mcp__mk_code_index__code_graph_query | feature_catalog/08--doctor-code-graph/02-doctor-query-mode.md |\n| Graph status | mcp__mk_code_index__code_graph_status | feature_catalog/08--doctor-code-graph/03-doctor-status-mode.md |\n| Graph validation | mcp__mk_code_index__code_graph_validate | feature_catalog/08--doctor-code-graph/04-doctor-validate-mode.md |\n| Detect changes | mcp__mk_code_index__code_graph_detect_changes | feature_catalog/08--doctor-code-graph/05-doctor-detect-changes.md |\n| Context retrieval | mcp__mk_code_index__code_graph_context | feature_catalog/08--doctor-code-graph/06-doctor-context-mode.md |\n| Execute verification-gated apply-mode recovery operations | mcp__mk_code_index__code_graph_apply | feature_catalog/08--doctor-code-graph/01-doctor-apply-mode.md |\n| Classify natural-language queries into structural/semantic/hybrid intent | mcp__mk_code_index__code_graph_classify_query_intent | [Add appropriate reference if documentation exists] |`
  REASON: Add missing tools to Smart Routing table
  ITER: 005

EDIT A-019: system-skill-advisor/SKILL.md:Line 14
  FROM: `importance_tier: "important"`
  TO:   `[remove this line]`
  REASON: Remove stale frontmatter key - only appears in test fixture, not used in scoring logic
  ITER: 006

EDIT A-020: system-skill-advisor/SKILL.md:Line 189
  FROM: `lib/skill-graph/ database/query logic remains in system-spec-kit until the pending packet 011 cleanup`
  TO:   `lib/skill-graph/ database/query logic is fully migrated to system-skill-advisor (extraction complete)`
  REASON: Update documentation to reflect current state - extraction already complete
  ITER: 015

### Group B: 3 mcp_server READMEs

EDIT B-001: system-spec-kit/mcp_server/README.md:Line 129-130
  FROM: `code_graph/` and `skill_advisor/` subdirectory references
  TO:   Remove these lines (directories moved to separate packages per ADR-002)
  REASON: Remove references to non-existent directories
  ITER: 008

EDIT B-002: system-spec-kit/mcp_server/README.md:Line 141
  FROM: [`code_graph/README.md`](code_graph/README.md#8-scan-scope)
  TO:   Update reference to point to system-code-graph skill documentation or remove
  REASON: Reference to non-existent code_graph README
  ITER: 008

EDIT B-003: system-spec-kit/mcp_server/README.md:Line 147
  FROM: `handlers/ → lib/ / code_graph/ / skill_advisor/ / formatters/`
  TO:   `handlers/ → lib/ / formatters/ / database adapters`
  REASON: Update dependency direction to remove references to moved packages
  ITER: 008

EDIT B-004: system-spec-kit/mcp_server/README.md:Line 149
  FROM: `hooks/ → lib/ / code_graph/ / skill_advisor/ read surfaces`
  TO:   `hooks/ → lib/ read surfaces`
  REASON: Update hooks dependency to remove references to moved packages
  ITER: 008

EDIT B-005: system-spec-kit/mcp_server/README.md:Lines 172, 184
  FROM: Directory tree entries for `code_graph/` and `skill_advisor/`
  TO:   Remove these lines
  REASON: Remove references to non-existent directories in directory tree
  ITER: 008

EDIT B-006: system-spec-kit/mcp_server/README.md:Line 210
  FROM: `code_graph/` row in key files table
  TO:   Remove this row or update to reference external system-code-graph package
  REASON: Remove reference to non-existent code_graph/ directory
  ITER: 008

EDIT B-007: system-spec-kit/mcp_server/README.md:Line 211
  FROM: `skill_advisor/` row in key files table
  TO:   Remove this row or update to reference external system-skill-advisor package
  REASON: Remove reference to non-existent skill_advisor/ directory
  ITER: 008

EDIT B-008: system-spec-kit/mcp_server/README.md:Line 227
  FROM: Handler logic rule mentioning `code_graph/` and `skill_advisor/`
  TO:   "Handler modules may call lib/, formatters/, and database adapters"
  REASON: Update boundaries table to remove references to moved packages
  ITER: 008

EDIT B-009: system-spec-kit/mcp_server/README.md:Line 228
  FROM: `lib/ and code_graph/ should not import top-level handlers`
  TO:   "lib/ should not import top-level handlers"
  REASON: Update domain logic rule to remove reference to moved package
  ITER: 008

EDIT B-010: system-spec-kit/mcp_server/README.md:Line 257
  FROM: `lib, code_graph, skill_advisor, database` as the domain layer
  TO:   `lib, database`
  REASON: Update main tool flow diagram to remove references to moved packages
  ITER: 008

EDIT B-011: system-spec-kit/mcp_server/README.md:Line 279
  FROM: `code_graph/handlers/*` row in entrypoints table
  TO:   Remove this row
  REASON: Remove reference to non-existent code_graph/handlers/
  ITER: 008

EDIT B-012: system-spec-kit/mcp_server/README.md:Line 280
  FROM: `skill_advisor/handlers/*` row in entrypoints table
  TO:   Remove this row
  REASON: Remove reference to non-existent skill_advisor/handlers/
  ITER: 008

EDIT B-013: system-skill-advisor/mcp_server/tools/README.md:Lines 117-124
  FROM: Entrypoints table with 8 tools (missing skillGraphPropagateEnhancesTool)
  TO:   Add row: `| skillGraphPropagateEnhancesTool | Descriptor | Registers skill_graph_propagate_enhances. |`
  REASON: Add missing tool to entrpoints table
  ITER: 007

EDIT B-014: system-skill-advisor/references/db-path-policy.md:Line 22
  FROM: `<!-- ANCHOR:1-policy -->`
  TO:   `<!-- ANCHOR:2-policy -->`
  REASON: Fix anchor numbering to match section header "2. POLICY"
  ITER: 013

EDIT B-015: system-skill-advisor/references/db-path-policy.md:Line 24
  FROM: `<!-- ANCHOR:2-rationale -->`
  TO:   `<!-- ANCHOR:3-rationale -->`
  REASON: Fix anchor numbering to match section header "3. RATIONALE"
  ITER: 013

EDIT B-016: system-skill-advisor/references/db-path-policy.md:Line 26
  FROM: `<!-- ANCHOR:3-test-and-ci-override -->`
  TO:   `<!-- ANCHOR:4-test-and-ci-override -->`
  REASON: Fix anchor numbering to match section header "4. TEST AND CI OVERRIDE"
  ITER: 013

EDIT B-017: system-skill-advisor/references/db-path-policy.md:Line 28
  FROM: `<!-- ANCHOR:4-migration-notes -->`
  TO:   `<!-- ANCHOR:5-migration-notes -->`
  REASON: Fix anchor numbering to match section header "5. MIGRATION NOTES"
  ITER: 013

## Section 2: NEW FILES (Phase 4 Batch C)

### NEW-001: system-skill-advisor/references/advisor-scorer.md
- ITER: 014
- Section outline:
  1. OVERVIEW
  2. LANE ATTRIBUTION MODEL
  3. LEXICAL LANE
  4. SEMANTIC SHADOW LANE
  5. GRAPH CAUSAL LANE
  6. EXPLICIT AUTHOR LANE
  7. DERIVED GENERATED LANE
  8. SCORE FUSION AND CONFIDENCE CALIBRATION
  9. UNCERTAINTY AND AMBIGUITY DETECTION
  10. PROMPT ISOLATION SAFETY
- Key facts:
  - 5-lane fusion system with weights: explicit_author (0.42), lexical (0.28), graph_causal (0.13), derived_generated (0.12), semantic_shadow (0.05)
  - Lane attribution provides prompt-safe explanations without echoing raw prompt text
  - Confidence assembly uses liveNormalized with baseConstant (0.52) + liveNormalizedRampCoefficient (0.43)
  - Derived-dominant short-circuit pins confidence to 0.72 when derived lane dominates and directScore < 0.2
  - Task-intent floor (0.82) applies when directScore >= 0.18 or liveNormalized >= 0.2

### NEW-002: system-skill-advisor/references/propagate-enhances.md
- ITER: 015
- Section outline:
  1. OVERVIEW
  2. DETECTION RULES
  3. OPERATION MODES
  4. INVARIANTS
  5. WHEN IT RUNS
- Key facts:
  - Internal MCP tool skill_graph_propagate_enhances for detecting missing inbound enhances edges
  - Three detection rules: family-inference (max 0.45), asset-shape (max 0.30), sibling-transitivity (max 0.15)
  - Three modes: report (default), propose, apply
  - Requires trusted caller authentication via requireTrustedCaller
  - Workspace escape guard: resolved skillsRoot must stay under cwd

### NEW-003: system-skill-advisor/references/skill-graph-extraction-plan.md
- ITER: 015
- Section outline:
  1. CURRENT LOCATION
  2. DOCUMENTATION DRIFT
  3. EXTRACTION STATUS
  4. ROADMAP
- Key facts:
  - lib/skill-graph/ currently in system-skill-advisor/mcp_server/lib/skill-graph/
  - Contains 3 files: README.md, skill-graph-db.ts, skill-graph-queries.ts
  - Extraction is COMPLETE (no pending work)
  - SKILL.md line 189 documentation drift needs update

### NEW-004: system-skill-advisor/references/tool-ids-reference.md
- ITER: 016
- Section outline:
  1. Overview
  2. Advisor Tools (4 public tools)
  3. Skill Graph Tools (5 public tools)
  4. Internal Tools (1 internal tool)
  5. MCP Namespace Convention
  6. Schema Index
- Key facts:
  - 9 public tools + 1 internal tool (skill_graph_propagate_enhances)
  - Namespace pattern: mcp__mk_skill_advisor__<tool<tool_name>
  - Advisor tools: recommend, rebuild, status, validate
  - Skill graph tools: scan, query, status, validate, propagate_enhances
  - All tools use snake_case naming in MCP namespace

### NEW-005: system-code-graph/references/code-graph-readiness-check.md
- ITER: 017
- Section outline:
  1. Purpose & Scope
  2. Preconditions Checked
  3. Readiness Gates
  4. Failure Modes
  5. Recovery Procedures
  6. Handler Integration
  7. Diagnostics Payload
- Key facts:
  - ensureCodeGraphReady() in lib/ensure-ready.ts:585-743
  - 10-second timeout guard for auto-indexing
  - Called by query, context, verify, detect-changes handlers
  - Preconditions: graph emptiness, scope fingerprint, git HEAD drift, file mtime staleness, candidate manifest drift
  - Recovery procedures: CG-RP-001 (SQLite corruption), CG-RP-002 (partial scan failure), CG-RP-003 (rollback bad apply)

### NEW-006: system-code-graph/references/ownership-boundary.md
- ITER: 018
- Section outline:
  1. Overview
  2. What Lives in system-spec-kit
  3. What Lives in system-code-graph
  4. Integration Points
  5. Extraction History
  6. Decision Rationale
  7. Future Considerations
- Key facts:
  - Deep-loop and coverage-graph stay in system-spec-kit (workflow state ownership)
  - Structural indexing moved to system-code-graph (pure code-structure service)
  - Integration points: code-graph-boundary.ts, MCP tool calls, in-process imports, shared SQLite
  - Packet 014 extraction moved 108 code-graph files
  - ADR-001 and ADR-002 decisions defined the boundary

### NEW-007: system-code-graph/references/database-path-policy.md
- ITER: 019
- Section outline:
  1. OVERVIEW
  2. POLICY
  3. RATIONALE
  4. TEST AND CI OVERRIDE
  5. MIGRATION NOTES
- Key facts:
  - Canonical path: .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite
  - Forbidden location: .opencode/skills/system-spec-kit/mcp_server/database/
  - SPECKIT_CODE_GRAPH_DB_DIR environment variable for test/CI override
  - ADR-002 extraction constraint requires DB-local ownership
  - Launcher enforces standalone-storage guard

## Section 3: Major expansion specs

### EXPAND-001: system-skill-advisor/mcp_server/README.md (66 → ~280 lines)
- 9-section scaffold from iter 011 + 012 outline
- Each section's bullet content:

**1. TABLE OF CONTENTS**
- Navigation links to all major sections
- Anchor-based navigation for direct section jumping

**2. OVERVIEW**
- Purpose: native skill recommendation routing, freshness tracking, skill graph relationship queries
- Current state: advisor-server.ts as MCP transport, tools/ for dispatch, handlers/ for orchestration, lib/ for business logic
- Key capabilities: 9 tools (4 advisor_* + 5 skill_graph_*)
- Local-first design with skill-graph.sqlite database

**3. ARCHITECTURE**
- ASCII diagram: MCP clients → advisor-server.ts → tools/ → handlers/ → lib/ → database/
- Transport layer via advisor-server.ts (lines 1-262)
- Tool dispatcher in tools/index.ts
- Handler layer in handlers/ with advisor tools and skill-graph subhandlers
- Library layer in lib/ with 11+ submodules
- Database layer with skill-graph.sqlite

**4. PACKAGE TOPOLOGY**
- Dependency hierarchy: advisor-server.ts → tools/ → handlers/ → lib/ → database/
- Allowed directions: tools/ → handlers/ → lib/, handlers/ → schemas/, lib/ → database/
- Disallowed directions: lib/ → tools/, lib/ → handlers/, database/ → handlers/, schemas/ → handlers/

**5. DIRECTORY TREE**
- Complete tree structure with all directories
- advisor-server.ts, tools/, handlers/, lib/, schemas/, database/, data/, compat/, bench/, tests/, scripts/

**6. KEY FILES**
- advisor-server.ts (lines 1-262): MCP transport entrypoint
- tools/index.ts: Tool descriptor registry
- tools/skill-graph-tools.ts (lines 1-143): Skill graph tool definitions
- handlers/index.ts: Handler export barrel
- lib/skill-graph/skill-graph-db.ts: SQLite schema initialization
- lib/skill-graph/skill-graph-queries.ts: Prepared graph relationship queries
- lib/scorer/: Native scoring implementation
- lib/daemon/lifecycle.ts: Advisor daemon lifecycle
- database/skill-graph.sqlite: Local SQLite database

**7. BOUNDARIES AND FLOW**
- Boundary rules: Transport → Tools → Handlers → Lib → Database → Schemas
- Tool invocation flow: MCP request → advisor-server.ts → tools/index.ts → handlers/* → lib/* → database → schemas → response
- Public API surface: MCP tools through advisor-server.ts, tools/, handlers/
- Storage boundary: SQLite access behind package modules

**8. ENTRYPOINTS**
- advisor-server.ts: MCP server entrypoint
- advisor_recommend: Returns skill recommendations
- advisor_rebuild: Rebuilds advisor index
- advisor_status: Reports advisor health
- advisor_validate: Validates advisor configuration
- skill_graph_scan: Indexes skill metadata
- skill_graph_query: Queries skill graph relationships
- skill_graph_status: Reports skill graph health
- skill_graph_validate: Validates skill graph
- skill_graph_propagate_enhances: Detects missing enhances edges

**9. VALIDATION**
- Build verification: npm run build
- Test execution: npm test -- --runInBand
- Documentation validation: sk-doc validate for README files
- Expected results: build and tests exit 0, README validation reports no blocking issues

## Summary
- Total EDITs across SKILL.md + mcp_server READMEs: 34 (14 anchors + 3 emoji removal + 2 tool additions + 1 frontmatter removal + 1 doc update + 12 ADR-002 cleanup + 1 tool table addition + 4 anchor fixes)
- Total NEW files: 7 (4 in system-skill-advisor/references/, 3 in system-code-graph/references/)
- Total expand specs: 1 (system-skill-advisor/mcp_server/README.md expansion from 66 to ~280 lines)
