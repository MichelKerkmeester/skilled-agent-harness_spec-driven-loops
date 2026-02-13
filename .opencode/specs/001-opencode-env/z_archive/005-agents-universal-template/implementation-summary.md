# Implementation Summary: AGENTS.universal.md

## What Was Built
A universal template version of AGENTS.md suitable for use across any project type.

## File Created
- **Path:** `/AGENTS.universal.md`
- **Lines:** ~580
- **Based on:** `/AGENTS.md` (603 lines)

## Analysis Method
Used Sequential Thinking MCP with 9 thought iterations:
1. Initial task analysis
2. Section 1-2 categorization
3. Section 3-5 categorization  
4. Section 6-7 categorization
5. Skill whitelist verification
6. Line-by-line skill/tool reference audit
7. Comprehensive change list compilation
8. Structure review
9. Final verification checklist

## Sections Preserved (Universal Logic)

| Section | Content | Status |
|---------|---------|--------|
| 1 | Critical Rules | 100% preserved |
| 2 | Mandatory Gates | ~95% preserved (removed browser/webflow refs) |
| 3 | Documentation | 100% preserved |
| 4 | Confidence Framework | Generalized (merged columns) |
| 5 | Request Analysis | 99% preserved (removed workflows-code ref) |
| 6 | Tool System | ~90% preserved (removed project-specific tools) |
| 7 | Skills System | 100% preserved + added Core Skills table |
| 8 | Extensions | NEW - empty placeholder |

## Allowed Skills (Explicit)

1. `mcp-leann` - Semantic code search
2. `mcp-code-mode` - MCP orchestration
3. `mcp-narsil` - Structural queries + security
4. `system-spec-kit` - Spec folder management
5. `workflows-documentation` - Document quality

## Key Transformations

### Confidence Scoring Table
**Before:** Two columns (Frontend 25%/15%/15%/10%/10%/10%/15% | Backend 25%/20%/15%/15%/10%/10%/5%)
**After:** Single column with balanced weights (25%/20%/15%/15%/10%/10%/5%)

### Failure Pattern #12
**Before:** "No Browser Test" | "Browser verify first"
**After:** "Skip Output Verification" | "Verify output appropriately for project type"

### External Tools
**Before:** "Webflow, Figma, Github, ClickUp, Chrome DevTools, etc."
**After:** "External services as configured in your `.utcp_config.json`"

## Usage Instructions
1. Copy `AGENTS.universal.md` to new project
2. Rename to `AGENTS.md`
3. Fill in Section 8 with project-specific extensions
4. Add project-specific skills to skill table if needed
