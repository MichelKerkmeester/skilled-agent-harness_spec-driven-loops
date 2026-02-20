---
description: "Quality gates, priority levels, and completion checklist for OpenCode code standards"
---
# Success Criteria

Defines quality gates, priority levels, and the completion checklist used to verify standards compliance.

## Quality Gates

| Gate               | Criteria                                 | Priority |
| ------------------ | ---------------------------------------- | -------- |
| File Header        | Matches language-specific format         | P0       |
| Naming Convention  | Consistent throughout file               | P0       |
| No Commented Code  | Zero commented-out code blocks           | P0       |
| Error Handling     | All error paths handled                  | P1       |
| WHY Comments       | Comments explain reasoning               | P1       |
| Documentation      | Public functions have doc comments       | P1       |
| Reference Comments | Task/bug/req references where applicable | P2       |

## Priority Levels

| Level | Handling                  | Examples                          |
| ----- | ------------------------- | --------------------------------- |
| P0    | HARD BLOCKER - must fix   | File header, no commented code    |
| P1    | Required OR approved skip | Consistent naming, error handling |
| P2    | Can defer                 | Reference comments, import order  |

## Completion Checklist

```
P0 Items (MUST pass):
[] File header present and correct format
[] No commented-out code
[] Consistent naming convention

P1 Items (Required):
[] WHY comments, not WHAT
[] Error handling implemented
[] Public functions documented

P2 Items (Can defer):
[] Reference comments (T###, BUG-###)
[] Import order optimized
```

## Cross References
- [[rules]] - The ALWAYS/NEVER rules that these gates enforce
- [[quick-reference]] - Templates for file headers and naming