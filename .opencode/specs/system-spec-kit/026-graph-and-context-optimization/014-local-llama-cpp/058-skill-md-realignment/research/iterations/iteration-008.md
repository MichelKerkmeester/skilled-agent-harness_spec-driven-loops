---
title: "Iter 008 — Track 4: system-spec-kit/mcp_server/README.md sanity"
iteration: 8
track: 4
focus: "system-spec-kit/mcp_server/README.md sanity"
status: complete
newInfoRatio: 0.15
findings: 13
timestamp: 2026-05-15T17:24:11Z
---

## Iter 008 Findings

### Findings

**1. Line 129-130: Package topology lists non-existent directories**
- Issue: `code_graph/` and `skill_advisor/` are listed as subdirectories but have been moved to separate packages per ADR-002
- Evidence: Actual directory structure shows no `code_graph/` or `skill_advisor/` in mcp_server/. They exist as separate skills at `.opencode/skills/system-code-graph/` and `.opencode/skills/system-skill-advisor/`
- Fix: Remove lines 129-130 from package topology diagram

**2. Line 141: Reference to non-existent code_graph README**
- Issue: References [`code_graph/README.md`](code_graph/README.md#8-scan-scope) which no longer exists in this package
- Evidence: code_graph/ is not a subdirectory of mcp_server/
- Fix: Update reference to point to system-code-graph skill documentation or remove this reference

**3. Line 147: Allowed dependency direction references moved packages**
- Issue: References `handlers/ → lib/ / code_graph/ / skill_advisor/ / formatters/`
- Evidence: code_graph/ and skill_advisor/ are no longer in this package
- Fix: Update to `handlers/ → lib/ / formatters/ / database adapters`

**4. Line 149: Hooks dependency references moved packages**
- Issue: References `hooks/ → lib/ / code_graph/ / skill_advisor/ read surfaces`
- Evidence: code_graph/ and skill_advisor/ are no longer in this package
- Fix: Update to `hooks/ → lib/ read surfaces`

**5. Line 167-193: Directory tree lists non-existent directories**
- Issue: Lines 172 and 184 list `code_graph/` and `skill_advisor/` which don't exist
- Evidence: Actual structure shows these are missing; additional directories exist that aren't listed (.github/, .opencode/, data/, matrix_runners/, tmp-test-fixtures/)
- Fix: Remove lines 172 and 184; consider adding missing directories if they are relevant to documentation

**6. Line 210: Key files table references non-existent code_graph/**
- Issue: Lists `code_graph/` as owning structural scan, query, context, status, and diff attribution tools
- Evidence: code_graph/ is not in this package
- Fix: Remove this row or update to reference external system-code-graph package

**7. Line 211: Key files table references non-existent skill_advisor/**
- Issue: Lists `skill_advisor/` as owning native skill recommendation scoring, freshness, and MCP handlers
- Evidence: skill_advisor/ is not in this package
- Fix: Remove this row or update to reference external system-skill-advisor package

**8. Line 227: Boundaries table references moved packages**
- Issue: Handler logic rule mentions `code_graph/` and `skill_advisor/`
- Evidence: These directories no longer exist in this package
- Fix: Update to "Handler modules may call lib/, formatters/, and database adapters"

**9. Line 228: Domain logic rule references non-existent code_graph/**
- Issue: States `lib/ and code_graph/ should not import top-level handlers`
- Evidence: code_graph/ is not in this package
- Fix: Update to "lib/ should not import top-level handlers"

**10. Line 257: Main tool flow diagram references moved packages**
- Issue: Shows `lib, code_graph, skill_advisor, database` as the domain layer
- Evidence: code_graph and skill_advisor are not in this package
- Fix: Update to `lib, database`

**11. Line 279: Entrypoints table references non-existent code_graph/handlers/**
- Issue: Lists `code_graph/handlers/*` as executing structural graph tools
- Evidence: code_graph/ is not in this package
- Fix: Remove this row

**12. Line 280: Entrypoints table references non-existent skill_advisor/handlers/**
- Issue: Lists `skill_advisor/handlers/*` as executing advisor tools
- Evidence: skill_advisor/ is not in this package
- Fix: Remove this row

**13. Tool count accuracy**
- Issue: README does not explicitly state tool count, but tool-schemas.ts defines 39 tools across L1-L9 layers
- Evidence: TOOL_DEFINITIONS array contains 39 tool definitions (3 L1, 3 L2, 4 L3, 5 L4, 4 L5, 7 L6, 5 L7, 4 L9 coverage, 4 L9 council)
- Fix: Consider adding tool count to overview section for clarity

### Coverage

- **Package topology**: 2 discrepancies (moved packages listed)
- **Directory tree**: 2 missing directories, 6 unlisted directories present
- **Key files table**: 2 references to moved packages
- **Boundaries and flow**: 4 references to moved packages
- **Entrypoints**: 2 references to moved packages
- **Tool count**: Not explicitly stated but verified as 39 tools

### newInfoRatio

Estimated newInfoRatio: 0.15 (approximately 15% of the README content needs updating to reflect the ADR-002 migration of code_graph and skill_advisor to separate packages)

ITER_008_COMPLETE: 13 findings, newInfoRatio=0.15
