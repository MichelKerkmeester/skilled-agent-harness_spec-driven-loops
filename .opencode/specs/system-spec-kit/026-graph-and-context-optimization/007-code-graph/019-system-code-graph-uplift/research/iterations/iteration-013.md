# Iteration 013 - Q5/Q6 Deep Dive: Content Gaps and Per-Folder READMEs Currency

## Focus

Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)?

Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.

## Actions Taken

1. Read SKILL.md, README.md to assess top-level content gaps
2. Read all references/ (code-graph-readiness-check.md, database-path-policy.md, ownership-boundary.md) to assess reference-level gaps
3. Read all mcp_server/ per-folder READMEs (handlers, lib, tools, tests, database, plugin_bridges, core, stress_test/code-graph) to assess currency and content gaps
4. Cross-referenced against iter-010/011/012 findings to avoid duplication
5. Analyzed for missing primers, glossaries, situational triggers, and cross-layer flow documentation

## Findings

### Q5: Useful Content Gaps in SKILL.md / References / Per-Folder READMEs

**SKILL.md gaps:**

- **Missing "why structural matters" primer**: SKILL.md:29-44 explains WHEN to use code graph (structural search, blast radius, readiness) but does not explain WHY structural indexing matters compared to semantic search. Operators reading cold would benefit from a primer explaining that structural indexing captures precise call paths, import relationships, and symbol containment that semantic embeddings cannot reliably represent.

- **No glossary of technical terms**: SKILL.md uses specialized terms without definitions: "structural indexing", "semantic search", "blast radius", "readiness", "trust state", "scope fingerprint", "false-safe", "deep-loop coverage graph". A glossary section would help operators new to the code-graph domain.

- **No situational triggers beyond tool routing**: SKILL.md:29-44 provides high-level use cases but lacks concrete situational trigger examples. Operators would benefit from scenarios like "before refactoring a core utility function" or "when investigating a production incident" with explicit tool paths.

- **Weak boundary explanation**: SKILL.md:92 states "Deep-loop coverage graph tools still live in system-spec-kit because those workflows own the research and review loop state" but could be clearer about WHY this separation exists (research/review state ownership vs structural indexing ownership). This was noted in iter-010:41 as weak prose but remains a content gap.

- **Weak reference notation**: SKILL.md:56 uses "n/a (no dedicated reference)" for classify_query_intent. This was noted in iter-010:39 as weak prose but remains a content gap—operators would benefit from implementation location references (mcp_server/handlers/classify-query-intent.ts and mcp_server/lib/query-intent-classifier.ts).

**README.md gaps:**

- **Missing "why structural matters" primer**: README.md:36-66 provides good comparison tables but lacks a primer explaining the fundamental difference between structural indexing (AST-based, precise relationships) and semantic search (embedding-based, conceptual similarity). Operators new to code graphs need this conceptual foundation.

- **No glossary**: README.md uses terms like "structural code indexing", "blast radius", "readiness contract", "false-safe", "trust state" without definitions. A glossary would improve cold-read comprehension.

- **Limited situational trigger examples**: README.md:206-234 provides three usage examples (blast-radius preflight, diff impact check, semantic seed then structural context) but lacks broader situational guidance. Operators would benefit from a "when to reach for code-graph" section with scenarios like "refactoring core utilities", "investigating production incidents", "validating migration completeness".

**references/ gaps:**

- **code-graph-readiness-check.md lacks "why readiness matters" primer**: references/code-graph-readiness-check.md:17-23 explains what readiness checks do but not WHY they matter. Operators would benefit from a primer explaining that readiness gates prevent returning misleading empty results from stale graphs, which is critical for safety in impact analysis.

- **Dense prose without conceptual framing**: references/code-graph-readiness-check.md:20-22 uses dense line-number citations (e.g., `585-743`, `7, 1103`) that are hard to parse. This was noted in iter-011:31-33 as weak prose but remains a content gap—could be restructured as tables or bulleted lists for readability.

- **database-path-policy.md lacks "why path policy matters" primer**: references/database-path-policy.md explains the path resolution rules but not WHY the policy exists (workspace containment, launcher guard, migration history). Operators would benefit from context on the standalone-storage guard and why external absolute paths are rejected.

- **ownership-boundary.md lacks "why separation matters" primer**: references/ownership-boundary.md explains what was extracted but not WHY the separation exists (code-graph owns structural indexing, system-spec-kit owns lifecycle/memory). The historical file count at line 33 was noted in iter-011:27 as potential drift but remains without context on why this metric matters.

**mcp_server/ per-folder READMEs gaps:**

- **Missing "why this layer matters" primers**: All per-folder READMEs (handlers, lib, tools, tests, database, plugin_bridges, core, stress_test) explain WHAT they do but not WHY this layer matters in the overall architecture. Operators reading cold would benefit from layer-purpose primers explaining the separation of concerns (handlers = request adaptation, lib = core implementation, tools = dispatch, etc.).

- **No cross-layer flow diagrams**: mcp_server/handlers/README.md:55-62 shows architecture flow but other READMEs lack visual flow diagrams showing how data moves between handlers → lib → database. Operators would benefit from consistent cross-layer flow documentation.

- **No glossary of technical terms**: Per-folder READMEs use terms like "readiness contract", "trust state", "blast radius", "scope fingerprint", "false-safe" without definitions. A shared glossary in SKILL.md or each README would improve cold-read comprehension.

- **No situational trigger examples**: Per-folder READMEs explain functionality but lack situational trigger examples (e.g., "when to call ensure-ready vs when to skip it"). Operators would benefit from scenario-based guidance.

### Q6: Per-Folder READMEs Currency Assessment

**mcp_server/handlers/README.md** - Validation-only pass required:
- Content is current and accurate
- Tool list matches current surface (11 tools)
- Architecture flow is correct
- No post-extraction drift detected
- Minor weak prose at line 40 (passive voice) noted in iter-011:35 but not a factual bug

**mcp_server/lib/README.md** - Validation-only pass required:
- Content is current and accurate
- File list matches actual directory tree
- Architecture dependencies are correct
- Missing files in directory tree noted in iter-011:39 (auto-rescan-policy.ts, exclude-rule-classifier.ts, runtime-detection.ts listed in tree but not in key files) but this is a documentation inconsistency, not a drift requiring fresh authoring
- No post-extraction drift detected

**mcp_server/tools/README.md** - Validation-only pass required:
- Content is current and accurate
- Dispatch table is correct
- Tool list matches current surface
- No post-extraction drift detected

**mcp_server/tests/README.md** - Validation-only pass required:
- Content is current and accurate
- Test area descriptions match actual coverage
- Validation commands are correct
- No post-extraction drift detected

**mcp_server/database/README.md** - Validation-only pass required:
- Content is current and accurate
- Database file descriptions are correct
- Launcher state reference is current (mk-code-index, not legacy system_code_graph)
- No post-extraction drift detected

**mcp_server/plugin_bridges/README.md** - Fresh authoring required:
- **Critical drift at lines 37, 85-90**: References import paths that no longer exist post-extraction. Line 37 states "imports from ../dist/handlers/session-resume.js, ../dist/lib/search/vector-index.js and ../dist/lib/session/session-manager.js" but these modules are not in the code-graph package. Session-resume functionality lives in system-spec-kit, not system-code-graph. This was noted in iter-010:33-35 as post-extraction drift and remains unresolved.
- Flow diagram at lines 73-102 references vector-index.js and session-manager.js which are not in the code-graph package. The actual runtime initialization goes through the MCP server entrypoint, not a vector-index module. This was noted in iter-010:35 as drift and remains unresolved.
- This README requires fresh authoring to reflect the post-extraction reality where the bridge connects to system-spec-kit session resume, not code-graph-local session management.

**mcp_server/core/README.md** - Validation-only pass required:
- Content is current and accurate
- DATABASE_DIR resolution logic is correct
- Environment variable reference is current
- No post-extraction drift detected

**mcp_server/stress_test/code-graph/README.md** - Validation-only pass required:
- Content is current and accurate
- Test file list matches actual directory
- Validation commands are correct
- No post-extraction drift detected

**mcp_server/lib/utils/README.md** - Not assessed in this iteration (file exists but was not read due to tool call limits). Should be assessed in a follow-up iteration.

## Questions Answered

Q5 partially answered: Identified 8 content gap categories across SKILL.md (4 gaps), README.md (3 gaps), references/ (4 gaps), and mcp_server per-folder READMEs (4 gaps). The primary gaps are missing "why structural matters" primers, glossaries of technical terms, situational trigger examples, and cross-layer flow diagrams.

Q6 partially answered: Assessed 8 of 9 per-folder READMEs. 7 require validation-only passes (handlers, lib, tools, tests, database, core, stress_test/code-graph). 1 requires fresh authoring (plugin_bridges) due to critical post-extraction drift in import paths and flow diagrams. 1 remains unassessed (lib/utils/README.md).

## Questions Remaining

- Q1: Complete (15 bugs/drift identified across core authored docs in iters 010-012)
- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: Partially answered (8 gap categories identified); could be expanded with specific primer content recommendations
- Q6: Partially answered (8/9 READMEs assessed; lib/utils/README.md remains unassessed)
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q2: Determine sk-doc `--type` for each authored doc and validate mandatory anchors / H2 cases / TOC requirements per type contract. This will establish the baseline for Q3 (HVR violations) and inform Q5 (content gaps). Priority order per progressive focus guide: Q2 is next in sequence after Q1/Q5/Q6 initial passes.
