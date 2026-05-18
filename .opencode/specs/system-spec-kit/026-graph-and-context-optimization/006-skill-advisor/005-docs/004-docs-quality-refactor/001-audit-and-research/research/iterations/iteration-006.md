# Iter 006 — references/db-path-policy.md and standalone-mcp-shape.md freshness

## Question

Are the database path policy and standalone MCP shape references consistent with the current mcp_server/database/ layout and the live mk_skill_advisor server registration?

## Evidence (file:line citations required)

**Evidence 1: Database path policy documentation**
- db-path-policy.md states the advisor database lives at `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="28-32" />
- db-path-policy.md explicitly states the database must not live under `.opencode/skills/system-spec-kit/mcp_server/database/` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="34-38" />
- db-path-policy.md documents SQLite sidecars (skill-graph.sqlite-wal, skill-graph.sqlite-shm) stay beside the database file <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="40-45" />
- db-path-policy.md states `MK_SKILL_ADVISOR_DB_DIR` is allowed for tests and CI only, with `SYSTEM_SKILL_ADVISOR_DB_DIR` as legacy fallback <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="68-72" />

**Evidence 2: Standalone MCP shape documentation**
- standalone-mcp-shape.md states ADR-001 chooses a standalone MCP server named `mk_skill_advisor` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md" lines="17-20" />
- standalone-mcp-shape.md documents the boundary: `mk_skill_advisor -> advisor tools and skill graph DB` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md" lines="39-42" />
- standalone-mcp-shape.md states the memory MCP server may keep a temporary bridge for legacy advisor_* calls during migration but must not remain long-term owner <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md" lines="44-45" />

**Evidence 3: Live mk_skill_advisor registration in opencode.json**
- opencode.json registers `mk_skill_advisor` as a local MCP server with command `node .opencode/bin/mk-skill-advisor-launcher.cjs` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" lines="37-42" />
- opencode.json sets `MK_SKILL_ADVISOR_DB_DIR` environment variable to `.opencode/skills/system-skill-advisor/mcp_server/database` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" line="46" />
- opencode.json _NOTE_1_DB states: "Database lives at .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite by default; MK_SKILL_ADVISOR_DB_DIR overrides, with SYSTEM_SKILL_ADVISOR_DB_DIR as a legacy fallback" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" line="44" />

**Evidence 4: Actual database directory layout**
- Database directory listing shows skill-graph.sqlite exists at the expected path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database" />
- Database directory contains .mk-skill-advisor-launcher.json and .mk-skill-advisor-launcher.lockdir/ for launcher state management <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database" />
- Database directory contains README.md documenting the default path and sidecar behavior <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" lines="16-18" />
- No -wal or -shm sidecar files are currently present in the database directory (database likely not active during this audit) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database" />

**Evidence 5: Database README consistency**
- database/README.md states the default database path is `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" line="18" />
- database/README.md confirms SQLite sidecars such as `-wal` and `-shm` live beside the database when active <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" line="18" />
- database/README.md states tests may override the directory with `MK_SKILL_ADVISOR_DB_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` remains legacy fallback <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" line="25" />
- database/README.md links to db-path-policy.md as related resource <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" line="32" />

**Evidence 6: Grep pattern verification**
- Grep for `skill-graph.sqlite|MK_SKILL_ADVISOR_DB_DIR|mk_skill_advisor` found 7 matches in db-path-policy.md covering path, policy, and migration notes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="6,31,43,59,70,81" />
- Grep found 3 matches in standalone-mcp-shape.md covering trigger phrase, server name, and boundary diagram <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md" lines="6,19,40" />
- Grep found 4 matches in opencode.json covering server registration, DB note, and environment variable <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" lines="37,44,46" />

**Evidence 7: Prior iteration cross-reference**
- Iteration-001 focused on SKILL.md anchor coverage and smart-router conformance, did not examine database path policy or MCP shape <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-002 focused on README.md marketing voice gap audit, did not examine database paths or MCP registration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-002.md" lines="1-119" />
- Iteration-003 focused on ARCHITECTURE.md vs source code drift, verified database path accuracy in ARCHITECTURE.md (lines 23-25) but did not examine db-path-policy.md or standalone-mcp-shape.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md" lines="21-25" />
- Iteration-004 focused on INSTALL_GUIDE.md command verification, did not examine database path policy or MCP shape references <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-004.md" lines="1-112" />
- Iteration-005 focused on references/advisor-scorer.md vs scorer source code, did not examine database path policy or standalone MCP shape <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-005.md" lines="1-114" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Database path policy consistent across documentation and implementation (P2, impact-rank 2, sub-phase-target: 004)**
- db-path-policy.md documents the database path as `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="28-32" />
- opencode.json sets `MK_SKILL_ADVISOR_DB_DIR` to `.opencode/skills/system-skill-advisor/mcp_server/database`, matching the policy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" line="46" />
- database/README.md confirms the default path matches the policy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" line="18" />
- Actual database directory contains skill-graph.sqlite at the documented location <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database" />
- Iteration-003 also verified ARCHITECTURE.md database path matches source code, confirming cross-document consistency <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md" lines="83-87" />

**Finding 2: Standalone MCP shape consistent with live registration (P2, impact-rank 2, sub-phase-target: 004)**
- standalone-mcp-shape.md states ADR-001 chooses standalone MCP server named `mk_skill_advisor` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md" lines="17-20" />
- opencode.json registers `mk_skill_advisor` as a local MCP server with the exact name documented <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" lines="37-42" />
- standalone-mcp-shape.md documents the boundary as `mk_skill_advisor -> advisor tools and skill graph DB` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md" lines="39-42" />
- opencode.json _NOTE_2_TOOLS confirms mk_skill_advisor registers advisor tools and skill graph tools <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" line="45" />

**Finding 3: Environment variable override policy consistent (P2, impact-rank 2, sub-phase-target: 004)**
- db-path-policy.md states `MK_SKILL_ADVISOR_DB_DIR` is allowed for tests and CI only, with `SYSTEM_SKILL_ADVISOR_DB_DIR` as legacy fallback <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="68-72" />
- opencode.json sets `MK_SKILL_ADVISOR_DB_DIR` in environment and documents the legacy fallback in _NOTE_1_DB <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" lines="44-46" />
- database/README.md confirms the same override policy with legacy fallback <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" line="25" />
- All three sources agree on the override semantics and legacy fallback behavior

**Finding 4: SQLite sidecar documentation accurate (P2, impact-rank 2, sub-phase-target: 004)**
- db-path-policy.md documents SQLite sidecars (skill-graph.sqlite-wal, skill-graph.sqlite-shm) stay beside the database file <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="40-45" />
- database/README.md confirms SQLite sidecars such as `-wal` and `-shm` live beside the database when active <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md" line="18" />
- Current database directory has no sidecar files, which is consistent with an inactive database (sidecars only appear during active use) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database" />
- Documentation correctly describes transient sidecar behavior

**Finding 5: Package-local ownership constraint enforced (P2, impact-rank 2, sub-phase-target: 004)**
- db-path-policy.md explicitly states the database must not live under `.opencode/skills/system-spec-kit/mcp_server/database/` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="34-38" />
- opencode.json registration uses the advisor package-local path, not system-spec-kit path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json" lines="44-46" />
- Actual database directory exists under system-skill-advisor, not system-spec-kit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database" />
- Iteration-003 found skill-graph library already migrated to advisor package, confirming ownership separation is complete <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md" lines="63-69" />

## Gaps for next iter

1. **Gap 1**: Investigate whether the temporary bridge for legacy advisor_* calls mentioned in standalone-mcp-shape.md still exists in the memory MCP server or if migration is complete.

2. **Gap 2**: Verify if ARCHITECTURE.md migration notes about packet 011 moving the skill-graph library are stale given that iteration-003 found the migration already complete.

3. **Gap 3**: Check if there are any remaining cross-package references in other documentation (README.md, SKILL.md) that should be updated to reflect the standalone advisor package ownership.

4. **Gap 4**: Examine whether the child packet ownership table in standalone-mcp-shape.md (002-006 packets) is still accurate or if packets have completed.

## JSONL delta row

```json
{"type":"iteration","iteration":6,"timestamp_utc":"2026-05-16T10:10:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"references/db-path-policy.md and standalone-mcp-shape.md freshness","findings_count":5,"gaps_count":4,"newInfoRatio":0.25,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/standalone-mcp-shape.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/opencode.json","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/README.md"]}
```