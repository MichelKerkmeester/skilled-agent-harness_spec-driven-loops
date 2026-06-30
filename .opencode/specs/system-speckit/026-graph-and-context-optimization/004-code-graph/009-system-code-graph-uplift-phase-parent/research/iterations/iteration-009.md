# Iteration 009

## Focus

Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?

## Actions Taken

1. Read spec.md to understand child-001 scope and phase structure (spec.md:83, 118)
2. Read SKILL.md to analyze its reference structure and dependencies (SKILL.md:1-167)
3. Read sample references doc (code-graph-readiness-check.md) to understand independence from SKILL.md (code-graph-readiness-check.md:1-115)
4. Read mcp_server READMEs (mcp_server/README.md, core/README.md) to understand package-level doc structure (mcp_server/README.md:1-262, core/README.md:1-88)
5. Read resource-map.md to understand the full set of files in child-001 scope (resource-map.md:60-88)
6. Read INSTALL_GUIDE.md to understand drift fix dependencies (INSTALL_GUIDE.md:1-60)

## Findings

### Dependency Analysis

**SKILL.md as entry point with downstream references:**
- SKILL.md references feature_catalog and manual_testing_playbook in routing table (SKILL.md:52-63)
- SKILL.md references mcp_server/tool-schemas.ts and mcp_server/tools/code-graph-tools.ts (SKILL.md:113-114)
- SKILL.md sets terminology and framing (e.g., "structural code indexing", "mk-code-index" vs "system-code-graph") that other docs should align with
- SKILL.md version field (1.0.3.1 at SKILL.md:5) is the source of truth for INSTALL_GUIDE version drift fix

**References docs are standalone implementation references:**
- code-graph-readiness-check.md is a pure implementation reference with file:line citations to source code (code-graph-readiness-check.md:20-22)
- It does not import or depend on SKILL.md content
- It has its own frontmatter and structure independent of SKILL.md
- No cross-references to SKILL.md terminology that would require alignment first

**mcp_server per-folder READMEs are package-level documentation:**
- mcp_server/README.md is a package README with architecture, topology, and validation sections (mcp_server/README.md:33-249)
- core/README.md is a minimal module README (core/README.md:29-40)
- Both have their own frontmatter and structure
- They reference parent READMEs in RELATED sections (mcp_server/README.md:256-260, core/README.md:84-86) but don't depend on SKILL.md content
- No hard dependency on SKILL.md for their content structure

**INSTALL_GUIDE drift fixes have dependencies:**
- Version drift at line 49 (1.0.0.0) must match SKILL.md version (1.0.3.1) - requires SKILL.md to be correct first
- Tool count drift at lines 56, 195 (10 tools) must match actual tool count (11 tools) - independent of SKILL.md
- Database path drift at lines 55, 110, 132, 210, 216 is cross-doc with README.md, ARCHITECTURE.md, database-path-policy.md, and config.ts - independent of SKILL.md

### Current Ordering from spec.md

The spec.md defines child-001 scope as: "SKILL.md + references + per-folder mcp_server READMEs + INSTALL_GUIDE drift fixes" (spec.md:83). The spec.md phase handoff criteria from 001 to 002 requires: "All SKILL.md/references/mcp_server READMEs pass validate_document.py --type <type>; INSTALL_GUIDE drift cleared" (spec.md:135). This implies a sequential dependency but doesn't prescribe an internal ordering.

### Optimal Ordering Recommendation

**Recommended ordering: SKILL.md hook first, then batch by file-type**

**Rationale:**

1. **SKILL.md hook first (dependency root):**
   - SKILL.md is the entry point that establishes terminology, framing, and version truth
   - INSTALL_GUIDE version drift fix (line 49) depends on SKILL.md version being correct first
   - SKILL.md sets the "why structural matters" framing that mcp_server READMEs could benefit from in their usefulness audit
   - Doing SKILL.md first establishes the canonical voice before other docs are audited for alignment

2. **Batch remaining work by file-type (parallelizable):**
   - References HVR pass (3 docs: code-graph-readiness-check.md, database-path-policy.md, ownership-boundary.md) can be done in parallel with mcp_server READMEs
   - mcp_server per-folder README usefulness audit (4 docs per resource-map.md:66-68: mcp_server/README.md, handlers/README.md, lib/README.md, plus core/README.md, database/README.md, tools/README.md, tests/README.md, plugin_bridges/README.md, stress_test/code-graph/README.md) is independent of references
   - INSTALL_GUIDE drift fixes (except version line) are independent of both references and mcp_server READMEs
   - Batching by file-type allows focused context-switching (all reference docs in one pass, all package READMEs in another pass) rather than context-switching between file types

3. **INSTALL_GUIDE version fix as final step:**
   - After SKILL.md hook is complete, fix INSTALL_GUIDE line 49 to match the now-correct SKILL.md version
   - Other INSTALL_GUIDE drifts (tool count lines 56/195, database path lines 55/110/132/210/216) can be fixed in the same pass as other doc fixes or in a separate focused pass

**Alternative ordering (sequential by spec.md list) is suboptimal because:**
- References and mcp_server READMEs have no hard dependency on each other
- Forcing sequential order (references → mcp_server READMEs → INSTALL_GUIDE) adds unnecessary serialization
- Context-switching between file types (reference doc → package README → install guide) is less efficient than batching similar docs together

**Batch-by-file-type ordering:**
```
1. SKILL.md hook framing (dependency root)
2. Batch A: References HVR pass (3 docs)
3. Batch B: mcp_server per-folder README usefulness audit (8-10 docs)
4. Batch C: INSTALL_GUIDE drift fixes (all 6 issues: version + tool count + database path)
```

This ordering respects the one hard dependency (SKILL.md → INSTALL_GUIDE version) while maximizing parallelism for the remaining independent work.

## Questions Answered

**Q9**: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?

Answer: SKILL.md hook first (dependency root for INSTALL_GUIDE version fix), then batch by file-type for remaining work. References HVR pass and mcp_server README usefulness audit are independent and can be done in parallel. INSTALL_GUIDE drift fixes (except version line) are also independent and can be done in a third batch or merged with the reference/README batches. Batching by file-type is more efficient than the sequential SKILL.md → references → mcp_server READMEs → INSTALL_GUIDE ordering because it minimizes context-switching between different doc types.

## Questions Remaining

- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from?
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from? This will inform the usefulness audit portion of child-001 and help identify what new content (e.g., "why structural matters" primer, glossary, situational triggers) should be added during the polish phase.
