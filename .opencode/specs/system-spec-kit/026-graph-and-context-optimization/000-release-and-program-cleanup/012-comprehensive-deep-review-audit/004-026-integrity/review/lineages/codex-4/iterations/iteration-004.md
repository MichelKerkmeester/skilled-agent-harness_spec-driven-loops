# Iteration 004 - Maintainability

## Dispatcher

- Focus dimension: maintainability
- Files reviewed: changelog README and recent changelog samples.

## Findings - New

### P2

- **F004**: Changelog voice rules are not enforced in recent entries - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:44` - The README says voice rules are non-negotiable, including no em dashes and no semicolons in narrative. Recent entries violate that: `changelog-010-003-scouted-bugfix-batch-3.md:25` contains em dashes and semicolons in the Summary narrative, line 40 contains semicolons in Changed text, and `changelog-002-001-advisor-hook-brief-improvements.md:26` uses Oxford-comma style prose despite the same rule.

## Confirmed-Clean Surfaces

- Changelog files generally retain the expected headings: Summary, Added, Changed, Fixed, Verification, Files Changed, Follow-Ups.
- The voice drift is widespread enough to need a lint or template decision, but it does not affect factual release status by itself.

## Next Focus

Stabilization pass over all active findings and stop gates.

Review verdict: PASS
