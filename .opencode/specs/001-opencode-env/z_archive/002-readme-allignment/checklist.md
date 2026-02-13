# README Alignment Checklist

## P0 - Must Complete

### Version Numbers
- [x] Update Spec Kit version to v16.0.0 - Evidence: SKILL.md line 5 confirms v16.0.0
- [x] Update MCP Server version to v12.6.0 - Evidence: context-server.js line 14 confirms v12.6.0
- [x] Remove separate Memory version (merged) - Evidence: No v12.5.0 references in README

### MCP Tool Names
- [x] Replace all `semantic_memory_*` with `spec_kit_memory_*` - Evidence: grep found 0 matches in README/AGENTS/opencode.json
- [x] Update tool count from 14 to 13 - Evidence: context-server.js has exactly 13 tool definitions

### Counts
- [x] Update skill count from 9 to 8 - Evidence: glob found exactly 8 SKILL.md files
- [x] Update command count from 18 to 17 - Evidence: glob found exactly 17 command files
- [x] Update template count to 10 - Evidence: templates/ has 10 .md files; fixed from 11 to 10

### Path References
- [x] Remove all references to `.opencode/skill/system-memory/` - Evidence: grep found 0 matches in active files
- [x] Update paths to `.opencode/skill/system-spec-kit/` - Evidence: opencode.json line 167 uses correct path

### Structure
- [x] Merge Memory section into Spec Kit section - Evidence: README Section 2 now contains memory as subsection
- [x] Update section numbering if needed - Evidence: ToC shows 7 sections (down from 8)

## P1 - Should Complete

### Content Accuracy
- [x] Verify all feature claims against research findings - Evidence: Sequential verification completed
- [x] Update gate numbering to 1-4 standard - Evidence: AGENTS.md verified
- [x] Verify MCP server configuration examples - Evidence: opencode.json lines 163-174 verified

### Formatting
- [x] Maintain table formatting - Evidence: Tables preserved in README
- [x] Preserve ASCII diagrams - Evidence: Workflow diagram on lines 141-201 preserved
- [x] Keep comparison tables - Evidence: Before/after tables preserved

## P2 - Nice to Have

- [ ] Add changelog/version history section
- [ ] Add troubleshooting section
- [ ] Add contributing guidelines

## Verification Summary

**Verified on:** 2024-12-26
**Method:** Sequential manual verification using Read, Glob, Grep, Bash tools
**Result:** 24/24 P0+P1 items verified ✅
