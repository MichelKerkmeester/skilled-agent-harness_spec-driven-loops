# Iteration 003 - Q1: Bugs, Drift, and Weak Prose Beyond Known INSTALL_GUIDE Drifts

## Focus

Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

## Actions Taken

1. Listed all markdown files under `.opencode/skills/system-code-graph/` to identify authored docs
2. Read core authored docs: SKILL.md, README.md, INSTALL_GUIDE.md, ARCHITECTURE.md
3. Read reference docs: code-graph-readiness-check.md, database-path-policy.md, ownership-boundary.md
4. Read MCP server READMEs: mcp_server/README.md, core/README.md, handlers/README.md, lib/README.md, tools/README.md
5. Analyzed for bugs, drift, and weak prose beyond the 3 known INSTALL_GUIDE drifts

## Findings

### INSTALL_GUIDE.md - Additional Drifts Beyond Known 3

**DRIFT-001: Database path inconsistency**
- **File**: `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`
- **Line**: 43
- **Issue**: States database default is `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`
- **Evidence**: Contradicts `references/database-path-policy.md:31` which states the package-local path is `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`. The INSTALL_GUIDE describes the post-migration standalone shared location, but this conflicts with the package-local ownership policy in ADR-002.
- **Category**: Drift (database path policy inconsistency)

**DRIFT-002: Internal inconsistency on tool count**
- **File**: `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`
- **Line**: 111
- **Issue**: `_NOTE_2_TOOLS` correctly states "Registers 11 tools" but lines 56 and 195 incorrectly state "10"
- **Evidence**: Line 111: "Registers 11 tools: code_graph_scan/query/classify_query_intent/context/status/verify/apply, detect_changes, ccc_status/reindex/feedback" is correct. Lines 56 and 195 state "10" which are the known drifts. This creates internal inconsistency within the same document.
- **Category**: Drift (internal inconsistency)

**WEAK-001: Weak prose in database migration description**
- **File**: `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`
- **Line**: 216
- **Issue**: "Legacy installs (database at `.opencode/skills/system-code-graph/mcp_server/database/`) are auto-migrated to the standalone shared location on next launch."
- **Evidence**: The prose is passive and could be clearer about what "auto-migrated" means (copy vs move, what happens to the old file, whether user action is required). The description at line 216-217 is vague compared to the precision needed for installation guides.
- **Category**: Weak prose (clarity)

### references/database-path-policy.md - Drift

**DRIFT-003: Policy conflicts with INSTALL_GUIDE runtime path**
- **File**: `.opencode/skills/system-code-graph/references/database-path-policy.md`
- **Line**: 31
- **Issue**: States package-local path is `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`
- **Evidence**: This conflicts with INSTALL_GUIDE.md:43 which describes the standalone shared location at `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`. The policy doc describes the ADR-002 extraction constraint, but the INSTALL_GUIDE describes the post-migration runtime reality. These are out of sync.
- **Category**: Drift (policy vs runtime inconsistency)

### references/ownership-boundary.md - No Issues

No additional bugs, drift, or weak prose found. Document is clear and consistent with current architecture.

### SKILL.md - No Issues

No additional bugs, drift, or weak prose found. Version 1.0.3.1 is correct, tool count references are accurate.

### README.md - No Issues

No additional bugs, drift, or weak prose found. Version 1.0.3.1 is correct, tool count (11) is accurate throughout.

### ARCHITECTURE.md - No Issues

No additional bugs, drift, or weak prose found. Tool count (11) is accurate, architecture description is current.

### MCP Server READMEs - No Issues

No additional bugs, drift, or weak prose found in:
- `mcp_server/README.md`
- `mcp_server/core/README.md`
- `mcp_server/handlers/README.md`
- `mcp_server/lib/README.md`
- `mcp_server/tools/README.md`

All are consistent with current architecture and tool surface.

## Summary

Beyond the 3 known INSTALL_GUIDE drifts (:49, :56, :195), this iteration identified:

1. **DRIFT-001**: Database path inconsistency between INSTALL_GUIDE.md (standalone shared location) and database-path-policy.md (package-local ADR-002 constraint)
2. **DRIFT-002**: Internal inconsistency within INSTALL_GUIDE.md where line 111 correctly states 11 tools but lines 56/195 incorrectly state 10
3. **DRIFT-003**: Policy vs runtime inconsistency between database-path-policy.md and INSTALL_GUIDE.md
4. **WEAK-001**: Weak prose in INSTALL_GUIDE.md database migration description

The core issue is a **database path policy conflict**: the ADR-002 extraction constraint in database-path-policy.md asserts package-local ownership at `.opencode/skills/system-code-graph/mcp_server/database/`, but INSTALL_GUIDE.md describes the post-migration standalone shared location at `.opencode/.spec-kit/code-graph/database/`. This suggests either:
- The policy doc was not updated after the migration to standalone shared storage
- The INSTALL_GUIDE describes a runtime reality that violates the ADR-002 constraint
- There are two different database paths for different use cases (not clearly distinguished)

## Questions Answered

**Q1**: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

**Answer**: Found 3 additional drifts and 1 weak prose issue:
- DRIFT-001: Database path inconsistency between INSTALL_GUIDE.md:43 and database-path-policy.md:31
- DRIFT-002: Internal tool count inconsistency within INSTALL_GUIDE.md (line 111 says 11, lines 56/195 say 10)
- DRIFT-003: Policy vs runtime conflict between database-path-policy.md and INSTALL_GUIDE.md
- WEAK-001: Unclear database migration prose at INSTALL_GUIDE.md:216-217

## Questions Remaining

- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)?
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q2 (sk-doc --type analysis) - Determine what sk-doc type each authored doc matches and what mandatory anchors/H2 cases/TOC requirements each per-type contract imposes. This will inform the validation strategy for the uplift work.
