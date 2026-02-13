# Plan: AGENTS.universal.md Creation

## Approach
Used Sequential Thinking MCP for deep analysis (9 thoughts) to systematically identify universal vs project-specific content.

## Phases

### Phase 1: Analysis (Completed)
- Read full AGENTS.md (603 lines)
- Categorize each section as UNIVERSAL or PROJECT-SPECIFIC
- Identify allowed skills whitelist

### Phase 2: Transformation (Completed)
- Create AGENTS.universal.md with modifications
- Preserve all core logic
- Remove/generalize project-specific content

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Merge Frontend/Backend confidence columns | Generic weight column is more universal |
| Remove "Browser Test" pattern | Not all projects are browser-based; generalized to "Output Verification" |
| Add Section 8 placeholder | Allows project-specific customization without modifying core |
| Keep all gate logic | Gates are process-agnostic, fully universal |

## Changes Summary

### Removed
- Chrome DevTools / browser debugging references
- Webflow patterns
- Figma, ClickUp explicit mentions
- workflows-code skill reference
- workflows-chrome-devtools skill reference
- Animation workflow references

### Generalized
- "code quality standards" -> "project conventions"
- "Browser verify" -> "Verify output appropriately"
- External MCP tools list -> "as configured in .utcp_config.json"

### Added
- Header note indicating universal template
- Core Skills table (5 allowed skills)
- Section 8: Project-Specific Extensions (empty placeholder)

## Files Created
- `/AGENTS.universal.md` - The universal template
