# Worked Examples

Practical examples of using system-spec-kit for common scenarios.

## Example 1: Simple Bug Fix (Level 1)

**Scenario:** Fix a CSS alignment issue (~50 LOC)

**Command:** `/spec_kit:complete`

**Interaction:**
```
User: /spec_kit:complete
AI: Spec folder? A) Existing B) New C) Update related D) Skip
User: B
AI: Feature name?
User: fix-button-alignment
AI: Documentation level? (Recommended: 1 based on scope)
User: 1
AI: Creating specs/008-fix-button-alignment/ with Level 1 templates...
```

**Result:**
```
specs/008-fix-button-alignment/
├── spec.md      # Problem description, acceptance criteria
├── plan.md      # CSS changes needed
├── tasks.md     # [ ] Update button.css, [ ] Test in browsers
├── memory/      # (empty until context save)
└── scratch/     # (empty)
```

## Example 2: New Feature (Level 2)

**Scenario:** Add user notification system (~300 LOC)

**Command:** `/spec_kit:plan` then `/spec_kit:implement`

**Phase 1 - Planning:**
```
User: /spec_kit:plan
AI: Spec folder? 
User: B (New)
AI: Feature name?
User: notification-system
AI: Documentation level? (Recommended: 2 based on ~300 LOC estimate)
User: 2
```

**Phase 2 - Implementation:**
```
User: /spec_kit:implement specs/009-notification-system/
AI: Loading planning artifacts...
AI: Found: spec.md, plan.md, checklist.md
AI: Ready to implement. Starting with Phase 1 tasks...
```

## Example 3: Architecture Change (Level 3)

**Scenario:** Migrate from REST to GraphQL (~800 LOC, high risk)

**Key Difference:** Level 3 requires decision-record.md

**Decision Record Example:**
```markdown
# ADR-001: GraphQL Migration

## Status
Approved

## Context
Current REST API has N+1 query problems...

## Decision
Migrate to GraphQL with Apollo Server...

## Consequences
### Positive
- Reduced over-fetching
- Better developer experience

### Negative
- Learning curve for team
- Migration period complexity
```

## Example 4: Resuming Work

**Scenario:** Continue work from previous session

**Command:** `/spec_kit:resume specs/009-notification-system/`

**Output:**
```
AI: Loading context for specs/009-notification-system/
    Found: quick-continue.md (from 2 hours ago)
    
    CONTINUATION - Attempt 2
    Last: Completed notification component
    Next: Add notification API endpoint
    Blockers: None
    
    Progress: 60% (6/10 checklist items)
    
    Ready to continue. Starting with: Add notification API endpoint
```
