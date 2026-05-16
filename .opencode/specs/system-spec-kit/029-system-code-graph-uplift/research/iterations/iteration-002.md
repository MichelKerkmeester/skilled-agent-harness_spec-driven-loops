# Iteration 002

## Focus

Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)?

Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.

## Actions Taken

1. Read findings registry to identify question IDs for Q5 (`question-5-q5-what-useful-content-gaps-exist-in-skill-md-references-per-folder-mcp-server-r`) and Q6 (`question-6-q6-which-per-folder-mcp-server-readmes-handlers-lib-tools-tests-core-plugin-brid`)

2. Used find_file_by_name to discover all markdown files under `.opencode/skills/system-code-graph/` to map the authored doc landscape

3. Read core authored docs: SKILL.md, README.md, and mcp_server/README.md to assess current content state and identify gaps

4. Read all per-folder mcp_server READMEs (handlers, lib, tools, core, database, tests, plugin_bridges, stress_test/code-graph, lib/utils, tests/handlers) to determine which need fresh authoring vs validation-only

5. Read reference docs (ownership-boundary.md, code-graph-readiness-check.md, database-path-policy.md) to assess content completeness for cold operators

## Findings

### Q5: Useful Content Gaps

**SKILL.md content gaps:**
- Missing "why structural matters" primer: SKILL.md jumps straight to "WHEN TO USE" without explaining the foundational value proposition of structural indexing vs text search vs semantic search <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/SKILL.md" lines="29-44" />
- Missing glossary: Terms like "readiness contract", "blast radius", "structural indexing", "false-safe graph reads" are used without definition <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/SKILL.md" lines="29-44" />
- Missing situational triggers: No guidance on when to prefer code graph tools vs other surfaces in ambiguous cases (e.g., when both structure and semantics matter) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/SKILL.md" lines="47-76" />
- Missing "cold start" operator guidance: No section explaining what operators need to understand before using the skill for the first time

**Reference docs content gaps:**
- ownership-boundary.md is technically detailed but lacks operator-friendly explanation of why the split matters for day-to-day work <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/references/ownership-boundary.md" lines="18-23" />
- code-graph-readiness-check.md is comprehensive but dense; missing "readiness in plain English" summary for operators who don't need implementation details <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/references/code-graph-readiness-check.md" lines="18-23" />
- database-path-policy.md is clear but missing context on when/why operators would need to know about database path overrides <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/references/database-path-policy.md" lines="18-20" />

**Per-folder mcp_server READMEs content gaps:**
- All READMEs follow consistent structure but lack "why this matters" context for cold operators
- mcp_server/README.md is comprehensive but could benefit from a "when to read this vs SKILL.md" decision guide <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/README.md" lines="33-47" />
- handlers/README.md, lib/README.md, tools/README.md are technically accurate but don't explain the handler/lib/tool separation rationale for operators unfamiliar with MCP architecture <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/README.md" lines="36-48" />
- Missing cross-reference guidance: No clear path for operators to navigate from README.md to specific per-folder READMEs based on their task

### Q6: Per-folder mcp_server READMEs Currency Assessment

**All required per-folder READMEs are present and appear current from packet 035:**

- `mcp_server/README.md` - Present, well-structured, comprehensive MCP server overview <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/README.md" lines="1-262" />
- `mcp_server/handlers/README.md` - Present, well-structured, detailed handler coverage <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/handlers/README.md" lines="1-227" />
- `mcp_server/lib/README.md` - Present, well-structured, comprehensive library documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/README.md" lines="1-289" />
- `mcp_server/tools/README.md` - Present, well-structured, focused dispatch documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tools/README.md" lines="1-135" />
- `mcp_server/core/README.md` - Present, well-structured, minimal but accurate config documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/core/README.md" lines="1-88" />
- `mcp_server/database/README.md` - Present, well-structured, clear runtime artifact documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/database/README.md" lines="1-124" />
- `mcp_server/tests/README.md` - Present, well-structured, comprehensive test coverage map <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/README.md" lines="1-138" />
- `mcp_server/plugin_bridges/README.md` - Present, well-structured, clear CLI bridge documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md" lines="1-144" />
- `mcp_server/stress_test/code-graph/README.md` - Present, well-structured, detailed stress test documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md" lines="1-156" />
- `mcp_server/lib/utils/README.md` - Present, well-structured, focused utility documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/utils/README.md" lines="1-117" />
- `mcp_server/tests/handlers/README.md` - Present, well-structured, code README template following sk-doc conventions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/handlers/README.md" lines="1-133" />

**Assessment:** All per-folder READMEs require validation-only passes (HVR, structural checks, sk-doc validation). No fresh authoring is needed. The packet 035 shipment appears to have successfully delivered all required documentation.

## Questions Answered

**Q5 (question-5-q5-what-useful-content-gaps-exist-in-skill-md-references-per-folder-mcp-server-r):** Substantively answered. SKILL.md lacks "why structural matters" primer, glossary, and situational triggers. Reference docs are technically dense but lack operator-friendly plain-English summaries. Per-folder READMEs are well-structured but missing "why this matters" context and cross-reference navigation guidance.

**Q6 (question-6-q6-which-per-folder-mcp-server-readmes-handlers-lib-tools-tests-core-plugin-brid):** Substantively answered. All required per-folder mcp_server READMEs (handlers, lib, tools, tests, core, plugin_bridges, database, plus stress_test/code-graph, lib/utils, tests/handlers) are present and well-structured from packet 035. All require validation-only passes; no fresh authoring needed.

## Questions Remaining

- Q1: What specific bugs, drift, or weak prose exist in each authored doc beyond the 3 known INSTALL_GUIDE drifts?
- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`?
- Q9: What's the optimal child-001 task ordering?
- Q10: What are the 3 worst-case HVR pitfalls in root README + system-spec-kit README to avoid?

## Next Focus

Per progressive focus guide, iter 2-3 targeted Q5+Q6 which are now substantively answered. Next priority should be Q4 (README structural arc to mimic from Public root + system-spec-kit) to inform child-002 README marketing rewrite, followed by Q10 (worst-case HVR pitfalls to avoid). This will provide the structural guidance needed before addressing Q2 (sk-doc type validation) and Q3 (HVR violations) in detail.
