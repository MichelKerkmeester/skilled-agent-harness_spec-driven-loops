# Iteration 008 - Frontier node F-1-007: correctness

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-007 (remediation records), dimension correctness (registry frontier: next dimension correctness)
- Review focus addressed: checked that each behavior and count the phase 006 and 008 task rows state is what the code and the live trees do now, by rerunning the read-only commands they cite.
- Sources: steer.md absent; strategy; registry frontier.

## Files Reviewed

- `specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/tasks.md:36-78` (T001-T018 verify clauses)
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:62-71` (T008-T011)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:517-526` (createContext, the only overlayRoot containment test), `.skilled/commands/doctor/scripts/overlay-engine.cjs:3434-3446` (layoutMoves JSDoc), `.skilled/commands/doctor/scripts/overlay-engine.cjs:5600-5614` (strict-write remove-list remedy)
- Reruns: `overlay-engine.cjs status` in barter/ai-speckit/skilled -> `in-sync=488`, `checked=136 ok=136 miss=0`, `RESULT: PASSED`, exit 0; `overlay-engine.cjs pre-commit` -> `allow`, exit 0; `git show b5a630c6efa:.skilled/commands/doctor/scripts/overlay-engine.cjs | cmp - barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` -> identical; `git diff --quiet b5a630c6efa HEAD -- .skilled/commands/doctor/scripts/overlay-engine.cjs` -> unchanged

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 stays active.

### P2 Findings

None.

## Prior-Finding Verification

- R2-P2-001 layoutMoves JSDoc variant (JSDoc described the old dot-dropped layout): FIXED. `.skilled/commands/doctor/scripts/overlay-engine.cjs:3434-3440` names `framework/` for a destination under `.skilled/` and `root/` plus the dot-dropped destination for any other.
- R11-P2-001 (strict-write refusal told the operator to create a copy for a path the overlay removes): FIXED. A path under a skill-root entry's remove list, and not on its replace list, now gets the "removes on every apply; take ... off that entry's remove list, add ... to its replace list" remedy (`.skilled/commands/doctor/scripts/overlay-engine.cjs:5605-5614`).

## Traceability Checks

- checklist_evidence: pass for 006 T006 (`isWithin(absoluteRoot, overlayRoot)` only in createContext, `.skilled/commands/doctor/scripts/overlay-engine.cjs:524`), T008, T009 and 008 T008, T011, each rerun or read at HEAD.
- spec_code: pass for 008's claim that ai-speckit runs the engine from b5a630c6efa (byte-identical vendored copy).

## Integration Evidence

- barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs equals Skilled b5a630c6efa, and Skilled HEAD has not changed the engine since.

## Edge Cases

- 006's next_safe_action still reads "Verify the ai-speckit session closes its six findings", which phase 007 did. Same class as R4-P2-001 (stale continuity line); folded there rather than raised again.
- ai-speckit's working tree carries 87 uncommitted changes from other work; status still passes on it, so the committed record and the live tree agree on the numbers this iteration checked.

## Confirmed-Clean Surfaces

- 006 T004-T011 behaviors, 008 T008-T011 numbers.

## Ruled Out

- A record count that the live tree no longer reproduces: all four reruns match.

## Next Focus

- Dimension: maintainability
- Focus area: frontier node F-1-001 (engine) or the registry's next node, to close dimension coverage
- Reason: maintainability is the one dimension the run has not covered
- Rotation status: F-1-007 traceability and correctness done
- Required evidence: rollback and backup code clarity, test helper reuse, comment hygiene in the remediation diff

Review verdict: CONDITIONAL
