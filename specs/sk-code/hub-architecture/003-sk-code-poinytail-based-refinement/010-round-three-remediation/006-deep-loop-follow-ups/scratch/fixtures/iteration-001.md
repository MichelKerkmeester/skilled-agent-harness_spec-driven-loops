# Iteration 1: Correctness

## Findings - New

### P0 Findings
None.

### P1 Findings

1. **Guard compares paths lexically** -- `scripts/apply.cjs:12` -- Use a containment test
   - Finding class: `path-guard`
   - Scope proof: every caller passes a resolved path
   - Affected surface hints: [`scripts/apply.cjs`]
   - Case: a path with a trailing dot-dot segment passes the guard
   ```json
   {"type": "traceability", "finalSeverity": "P1"}
   ```

### P2 Findings

1. **Stale comment** -- scripts/apply.cjs:40 -- Update it
   - Case: reading the comment next to the call shows the old flag name

## Traceability Checks
