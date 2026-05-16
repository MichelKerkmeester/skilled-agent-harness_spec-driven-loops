# Iter 003 — ARCHITECTURE.md vs mcp_server source code drift

## Question

Which statements in ARCHITECTURE.md drift from actual mcp_server source code, including tool registrations, lane weights, database paths, build commands, and module structure?

## Evidence (file:line citations required)

**Evidence 1: Tool registration count comparison**
- ARCHITECTURE.md states: "The current server id is `mk_skill_advisor`. It is registered as a native MCP server and exposes **8 public tools plus 1 internal trusted-caller tool** (9 total)" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="42-48" />
- Source code tools/index.ts defines 4 advisor tools: advisor_recommend, advisor_rebuild, advisor_status, advisor_validate <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts" lines="37-43" />
- Source code skill-graph-tools.ts defines 5 skill graph tools: skill_graph_scan, skill_graph_query, skill_graph_status, skill_graph_validate, skill_graph_propagate_enhances <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts" lines="85-91" />
- Total tool count: 9 tools (4 advisor + 5 skill graph), matching ARCHITECTURE.md claim <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts" lines="37-43" />

**Evidence 2: Lane weights comparison**
- ARCHITECTURE.md lane weight table: explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="146-152" />
- Source code lane-registry.ts: explicit_author weight 0.42, lexical weight 0.28, graph_causal weight 0.13, derived_generated weight 0.12, semantic_shadow weight 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />
- Source code weights-config.ts exports these exact same weights via DEFAULT_SCORER_LANE_WEIGHTS <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts" lines="14-18" />
- All lane weights match exactly between documentation and source code <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />

**Evidence 3: Database path comparison**
- ARCHITECTURE.md states default path: `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="186-190" />
- Source code advisor-server.ts resolveSkillGraphDbPath() returns path.join(resolveSkillGraphDbDir(), 'skill-graph.sqlite') <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="40-42" />
- Source code logs DB path at startup: `console.error(`[mk-skill-advisor-launcher] DB: ${resolveSkillGraphDbPath()}`)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" line="234" />
- Database path matches documentation exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="40-42" />

**Evidence 4: Build command drift**
- ARCHITECTURE.md states TypeScript build command: `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` and `run typecheck` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="262" />
- This references system-spec-kit's mcp_server build command, not system-skill-advisor's own build command <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="262" />
- ARCHITECTURE.md describes system-skill-advisor as "standalone Gate 2 routing subsystem" that "owns the `mk_skill_advisor` MCP server" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="40-42" />
- Standalone package should reference its own build command, not cross-package dependency <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="262" />

**Evidence 5: Skill-graph library location drift**
- ARCHITECTURE.md states: "The `lib/skill-graph/` database/query library remains in `system-spec-kit` until packet 011 moves it" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="17" />
- ARCHITECTURE.md FUTURE WORK section reinforces: "Packet 011: move or settle the `lib/skill-graph/` library location so handlers no longer depend on the `system-spec-kit` runtime tree" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="278" />
- Source code advisor-server.ts imports from local skill-graph: `import { initDb as initSkillGraphDb, resolveSkillGraphDbDir } from './lib/skill-graph/skill-graph-db.js'` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="18-23" />
- Source code skill-graph-db.ts exists at system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts with comment "Uses the advisor package-local skill-graph.sqlite runtime database" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="1-5" />
- No skill-graph-db.ts found in system-spec-kit/mcp_server/lib directory via find_file_by_name <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib" />

**Evidence 6: MCP server ID comparison**
- ARCHITECTURE.md states: "The current server id is `mk_skill_advisor`" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="42" />
- Source code advisor-server.ts defines server: `const server = new Server({ name: 'mk_skill_advisor', version: '0.1.0' }` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="192-195" />
- Server ID matches exactly between documentation and source code <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="192-195" />

**Evidence 7: Handler structure comparison**
- ARCHITECTURE.md MCP SURFACE table lists handlers: handlers/advisor-recommend.ts, handlers/advisor-rebuild.ts, handlers/advisor-status.ts, handlers/advisor-validate.ts, handlers/skill-graph/scan.ts, handlers/skill-graph/query.ts, handlers/skill-graph/status.ts, handlers/skill-graph/validate.ts, handlers/skill-graph/propagate-enhances.ts <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="217-228" />
- Source code handlers directory contains exactly these files: advisor-rebuild.ts, advisor-recommend.ts, advisor-status.ts, advisor-validate.ts, skill-graph/scan.ts, skill-graph/query.ts, skill-graph/status.ts, skill-graph/validate.ts, skill-graph/propagate-enhances.ts <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/handlers" />
- Handler structure matches documentation exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/handlers" />

**Evidence 8: Prior iteration cross-reference**
- Iteration-001 focused on SKILL.md anchor coverage and smart-router conformance, not ARCHITECTURE.md vs source code drift <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-002 focused on README.md marketing voice gap audit vs peer system-code-graph, not ARCHITECTURE.md technical accuracy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-002.md" lines="1-119" />
- Neither prior iteration examined build commands or skill-graph library location claims in ARCHITECTURE.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Build command references wrong package (P0, impact-rank 9, sub-phase-target: 004)**
- ARCHITECTURE.md line 262 references `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` instead of system-skill-advisor's own build command <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="262" />
- This contradicts ARCHITECTURE.md's own description of system-skill-advisor as "standalone Gate 2 routing subsystem" that "owns the `mk_skill_advisor` MCP server" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="40-42" />
- Standalone package documentation should reference its own build commands, not cross-package dependencies <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="262" />
- This drift misleads operators about where to run build/typecheck commands for the advisor package <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="262" />

**Finding 2: Skill-graph library location already migrated (P0, impact-rank 8, sub-phase-target: 004)**
- ARCHITECTURE.md line 17 states "The `lib/skill-graph/` database/query library remains in `system-spec-kit` until packet 011 moves it" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="17" />
- ARCHITECTURE.md line 278 lists "Packet 011: move or settle the `lib/skill-graph/` library location" as future work <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="278" />
- Source code advisor-server.ts imports skill-graph functions from local path: `from './lib/skill-graph/skill-graph-db.js'` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="18-23" />
- Source code skill-graph-db.ts exists at system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts with package-local database comment <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts" lines="1-5" />
- No skill-graph-db.ts found in system-spec-kit/mcp_server/lib, indicating migration already complete <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib" />
- Documentation describes current state as pre-migration when source code shows migration already complete <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="17" />

**Finding 3: Tool registration accurate (P2, impact-rank 2, sub-phase-target: 004)**
- ARCHITECTURE.md correctly states 9 tools (8 public + 1 internal trusted-caller) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="42-48" />
- Source code tools/index.ts lists 4 advisor tools <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts" lines="37-43" />
- Source code skill-graph-tools.ts lists 5 skill graph tools <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts" lines="85-91" />
- Total matches exactly: 4 + 5 = 9 tools <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts" lines="37-43" />

**Finding 4: Lane weights accurate (P2, impact-rank 2, sub-phase-target: 004)**
- ARCHITECTURE.md lane weights: explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="146-152" />
- Source code lane-registry.ts weights match exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />
- Source code weights-config.ts exports same weights <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts" lines="14-18" />
- All weights sum to 1.0 (0.42 + 0.28 + 0.13 + 0.12 + 0.05) in both locations <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts" lines="8-12" />

**Finding 5: Database path accurate (P2, impact-rank 2, sub-phase-target: 004)**
- ARCHITECTURE.md path: `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="186-190" />
- Source code resolveSkillGraphDbPath() returns same path construction <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="40-42" />
- Startup log confirms DB path usage <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" line="234" />
- Path matches exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="40-42" />

**Finding 6: MCP server ID accurate (P2, impact-rank 2, sub-phase-target: 004)**
- ARCHITECTURE.md server id: `mk_skill_advisor` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="42" />
- Source code server name: `'mk_skill_advisor'` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="192-195" />
- Server ID matches exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts" lines="192-195" />

**Finding 7: Handler structure accurate (P2, impact-rank 2, sub-phase-target: 004)**
- ARCHITECTURE.md lists 9 handler paths matching tool count <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="217-228" />
- Source code handlers directory contains exactly these 9 handler files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/handlers" />
- Handler structure matches documentation exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/handlers" />

## Gaps for next iter

1. **Gap 1**: Determine the correct build command for system-skill-advisor (is there a package.json? does it use system-spec-kit's build infrastructure intentionally?).

2. **Gap 2**: Investigate when the skill-graph library migration from system-spec-kit to system-skill-advisor actually occurred to understand if ARCHITECTURE.md is stale or if packet 011 is already complete.

3. **Gap 3**: Check if there are other cross-package dependencies in ARCHITECTURE.md that should be package-local for the standalone advisor package.

4. **Gap 4**: Verify if the Python regression harness path in line 264 is correct or if it also references the wrong package location.

## JSONL delta row

```json
{"type":"iteration","iteration":3,"timestamp_utc":"2026-05-16T10:05:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"ARCHITECTURE.md vs mcp_server source code drift","findings_count":7,"gaps_count":4,"newInfoRatio":0.75,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"]}
```