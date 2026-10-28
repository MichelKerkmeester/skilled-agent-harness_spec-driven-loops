## Focused File Review: src/parse.ts

**Review scope**: src/parse.ts, input handling
**Overall assessment**: REQUESTED_CHANGES
**Files reviewed**: 1 file, 60 lines changed
**Baseline used**: sk-code (sk-code-review)
**Surface evidence used**: UNKNOWN
**Quality gate evidence**: absent
Rule sources: none

| File | Correctness | Security | Patterns | Maintainability | Performance |
| --- | --- | --- | --- | --- | --- |
| src/parse.ts | 18/30 | 25/25 | 18/20 | 13/15 | 10/10 |

## Findings

### P1 - High
1. src/parse.ts:10 Null dereference on an empty body
   - Case: a POST with an empty body throws before validation runs
   - Risk: the handler returns 500 instead of 400

### Pattern Compliance

| Pattern | Followed |
| --- | --- |
| Guard clauses at the boundary | No |

Recommendation: APPROVED

Not checked: behavior under concurrent writes; no test database was available

Review status: REQUESTED_CHANGES
