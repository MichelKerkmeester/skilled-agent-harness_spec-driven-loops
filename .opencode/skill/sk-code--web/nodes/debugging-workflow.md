---
description: "Phase 2 systematic debugging framework with root cause tracing and error recovery"
---
# Debugging Workflow

Phase 2 of the development lifecycle. Systematic debugging using a structured framework to find and fix root causes.

## Systematic Debugging Framework

Uses a 4-phase framework:

1. **Root Cause Investigation** - Trace backward from symptom to source
2. **Pattern Analysis** - Identify recurring patterns in the failure
3. **Hypothesis Testing** - Test one change at a time
4. **Implementation** - Fix at source, not symptom

Key principle: Test one change at a time; if 3+ fixes fail, question your approach.

## Root Cause Tracing

Trace backward from symptom to immediate cause to source. Fix at source, not symptom.

```
Symptom (what you see)
  -> Immediate cause (what triggered it)
    -> Root cause (why it happened)
      -> Fix here
```

## Error Recovery

See `references/debugging/error_recovery.md` for CDN upload, minification, and version mismatch recovery procedures.

See `references/debugging/debugging_workflows.md` for complete workflows.

## Cross References
- [[how-it-works]] - Phase transitions and lifecycle context
- [[rules]] - ALWAYS/NEVER/ESCALATE rules for debugging
- [[verification-workflow]] - Phase 3 that follows successful debugging
- [[implementation-workflow]] - Phase 1 if missing code is discovered during debugging
