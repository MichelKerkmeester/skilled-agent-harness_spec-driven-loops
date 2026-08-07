# Iteration 004 — Track 2: MCP server names, version numbers

## Executive Summary
Found **3 naming inconsistencies** and **1 version documentation discrepancy** across MCP server references in README.md. No critical drift in server identities, but mixed hyphen/underscore conventions for `mk_code_index` and `code_mode` create confusion. Documentation version "4.11" does not correspond to any changelog entry.

## Detailed Findings

### 1. mk-spec-memory (Memory Server)
- **README.md naming**: Consistently uses `mk-spec-memory` (hyphen) across 8 mentions
- **opencode.json registration**: `mk-spec-memory` (hyphen) ✓
- **Changelog version**: v3.4.1.0 (latest in `.opencode/skills/system-spec-kit/changelog/`)
- **Status**: ✓ Consistent naming, version exists in changelog

### 2. mk_skill_advisor (Skill Advisor Server)
- **README.md naming**: Consistently uses `mk_skill_advisor` (underscore) across 11 mentions
- **opencode.json registration**: `mk_skill_advisor` (underscore) ✓
- **Changelog version**: v0.1.0 (only version in `.opencode/skills/system-skill-advisor/changelog/`)
- **Status**: ✓ Consistent naming, version exists in changelog

### 3. mk_code_index (Code Graph Server) — NAMING INCONSISTENCY
- **README.md naming**: Mixed convention
  - Primary: `mk_code_index` (underscore) - 13 mentions
  - Secondary: `mk-code-index` (hyphen) - 2 mentions (lines 59, 110)
- **opencode.json registration**: `mk_code_index` (underscore) ✓
- **Changelog version**: v1.0.0.0 (only version in `.opencode/skills/system-code-graph/changelog/`)
- **Status**: ⚠️ INCONSISTENT - README.md uses both `mk_code_index` and `mk-code-index`; opencode.json uses `mk_code_index`
- **Impact**: Medium - Creates confusion about canonical server identity
- **Locations**: 
  - Line 59: "standalone MCP server identity `mk-code-index`"
  - Line 110: "established `mk-code-index` as the standalone server identity"

### 4. cocoindex_code (CocoIndex Server)
- **README.md naming**: Consistently uses `cocoindex_code` (underscore) across 7 mentions
- **opencode.json registration**: `cocoindex_code` (underscore) ✓
- **Changelog version**: N/A (no changelog directory for mcp-coco-index)
- **Status**: ✓ Consistent naming (no changelog to verify)

### 5. code_mode (Code Mode Server) — NAMING INCONSISTENCY
- **README.md naming**: Mixed convention
  - Primary: `code_mode` (underscore) - 5 mentions
  - Secondary: `code-mode` (hyphen) - 4 mentions (lines 27, 864, 1249, 1273, 1296)
- **opencode.json registration**: `code_mode` (underscore) ✓
- **Changelog version**: N/A (no changelog directory for mcp-code-mode)
- **Status**: ⚠️ INCONSISTENT - README.md uses both `code_mode` and `code-mode`; opencode.json uses `code_mode`
- **Impact**: Low-Medium - Section headers and skill references use hyphen, but config uses underscore
- **Locations**:
  - Line 27: TOC entry `CODE MODE MCP` (section header)
  - Line 864: "**mcp-code-mode**" (skill name reference)
  - Line 1249: "For more on the `mcp-code-mode` skill"
  - Line 1273: "`mcp-code-mode`" (skill library entry)
  - Line 1296: "Used by `mcp-code-mode` skill"

### 6. sequential_thinking (Sequential Thinking Server)
- **README.md naming**: Consistently uses `sequential_thinking` (underscore) across 3 mentions
- **opencode.json registration**: `sequential_thinking` (underscore) ✓
- **Changelog version**: N/A (external MCP server, not part of this repo)
- **Status**: ✓ Consistent naming (external dependency)

### 7. Documentation Version — VERSION DISCREPANCY
- **README.md claim**: "Documentation version: 4.11" (line 1497)
- **Changelog verification**: No v4.11.0.md exists in any changelog directory
  - system-spec-kit latest: v3.4.1.0
  - system-skill-advisor: v0.1.0
  - system-code-graph: v1.0.0.0
- **Status**: ⚠️ VERSION DISCREPANCY - "Documentation version: 4.11" does not correspond to any changelog entry
- **Impact**: Low - Appears to be a separate documentation versioning scheme, but unclear what it tracks

## Naming Convention Analysis

### Canonical MCP Server Names (from opencode.json)
1. `sequential_thinking` (underscore)
2. `mk-spec-memory` (hyphen)
3. `mk_skill_advisor` (underscore)
4. `mk_code_index` (underscore)
5. `cocoindex_code` (underscore)
6. `code_mode` (underscore)

### Pattern
- **mk-* prefix servers**: Mixed convention
  - `mk-spec-memory`: hyphen (consistent)
  - `mk_skill_advisor`: underscore (consistent)
  - `mk_code_index**: underscore (canonical), but README sometimes uses hyphen
- **Other servers**: All underscore (consistent)

## Recommendations

### High Priority
1. **Standardize mk_code_index references**: Replace all `mk-code-index` with `mk_code_index` in README.md to match opencode.json registration
2. **Clarify Documentation version**: Either create v4.11.0 changelog entry or explain what "Documentation version: 4.11" represents

### Medium Priority
3. **Standardize code_mode references**: Consider whether skill names (mcp-code-mode) should remain hyphenated while server registration (code_mode) stays underscored, or standardize to one convention

## Summary Table

| Server | README Naming | opencode.json | Changelog | Status |
|--------|---------------|---------------|-----------|---------|
| mk-spec-memory | mk-spec-memory (hyphen) ✓ | mk-spec-memory (hyphen) ✓ | v3.4.1.0 ✓ | Consistent |
| mk_skill_advisor | mk_skill_advisor (underscore) ✓ | mk_skill_advisor (underscore) ✓ | v0.1.0 ✓ | Consistent |
| mk_code_index | Mixed (13 underscore, 2 hyphen) ⚠️ | mk_code_index (underscore) ✓ | v1.0.0.0 ✓ | Inconsistent |
| cocoindex_code | cocoindex_code (underscore) ✓ | cocoindex_code (underscore) ✓ | N/A | Consistent |
| code_mode | Mixed (5 underscore, 4 hyphen) ⚠️ | code_mode (underscore) ✓ | N/A | Inconsistent |
| sequential_thinking | sequential_thinking (underscore) ✓ | sequential_thinking (underscore) ✓ | N/A | Consistent |

ITER_004_COMPLETE: 4 findings, newInfoRatio=0.67
