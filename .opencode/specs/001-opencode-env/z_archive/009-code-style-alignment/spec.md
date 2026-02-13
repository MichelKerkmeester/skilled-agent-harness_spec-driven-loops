# Code Style Alignment - system-spec-kit Scripts

## Problem Statement
70 JavaScript and shell script files in the system-spec-kit skill folders do not comply with the project's code style guide. This creates inconsistency and reduces maintainability.

## Scope
**In Scope:**
- All .js files in system-spec-kit/scripts/, scripts/lib/, shared/, shared/embeddings/, mcp_server/lib/
- All .sh files in system-spec-kit/scripts/, scripts/rules/, scripts/lib/

**Out of Scope:**
- JSON/JSONC configuration files
- IIFE wrappers for Node.js modules (not browser code)

## Success Criteria
- [ ] All files have 3-line box-drawing file headers
- [ ] All JavaScript functions use snake_case naming
- [ ] All JavaScript variables use snake_case naming
- [ ] All section headers use numbered multi-line format
- [ ] No metadata (VERSION, CREATED, dates) in file headers
- [ ] Trailing commas in multi-line structures

## Reference
Style Guide: `.opencode/skill/workflows-code/references/standards/code_style_guide.md`

## Statistics
- Total files: 70
- JavaScript files: ~55
- Shell script files: ~15
- Estimated issues: 427+
