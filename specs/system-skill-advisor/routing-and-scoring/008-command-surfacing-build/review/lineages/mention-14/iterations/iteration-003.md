# Iteration 003 - traceability

## Dimension

Traceability: do the recorded claims for these two rules match what the code now does, and does the packet's checklist agree with the review's actual state?

## Dispatcher

```text
BINDING: target=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
BINDING: maxIterations=8
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
```

Resolved route: mode=review target_agent=deep-review; execution=single_review_iteration; state_source=externalized_files.

Operator review focus: pass fourteen, area `mention`. The traceability pass read the phase-040 records that own these rules and kept the holdout rule: no corpus or holdout file was opened and no session text was read.

Sources: `review-brief-14.txt:1-10`, `review-scope-14.txt:1-5`, `040-final-alignment-loop/spec.md:52-58`, `040-final-alignment-loop/implementation-summary.md:78-90`, `040-final-alignment-loop/acceptance-criteria.md:56-60`, `040-final-alignment-loop/tasks.md:43-47`, `040-final-alignment-loop/tasks.md:130-131`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:409-482`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:200-229`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md:52-58`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/implementation-summary.md:78-90`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:56-60`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:43-47`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:130-131`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|----------|-------|--------|----------|---------|
| `spec_code` | core | partial | `040-final-alignment-loop/spec.md:57`, `040-final-alignment-loop/implementation-summary.md:83`, `command-attach.ts:415`, `command-attach.ts:465` | The spec's problem statement names a command written as a document as a shape that must not be offered, with the example `read the /create:readme document and tell me what it does`; the `then` variant of the same shape is offered (R1-P1-002). The decision row says a refusal of `it` must end its clause; the implementation requires `it` itself to end the clause, so a refusal that ends its clause with `again` or `because ...` is offered (R1-P1-001). |
| `checklist_evidence` | core | partial | `040-final-alignment-loop/acceptance-criteria.md:60`, `040-final-alignment-loop/tasks.md:131` | AC-005 (0 P0 and 0 P1, or each remainder carries the operator's decision) is `Unmet` for this pass: two P1s remain open. CHK-FIX-002 is checked, but its matrix covers wrappers and leads, not the two boundary shapes pass fourteen changed. |

Both core protocols carry `gateClass: hard`, so the legal-stop traceability gate stays closed while these results are `partial`. The mismatches are carried by `R1-P1-001` and `R1-P1-002`; no duplicate finding is raised for a doc row that states the same defect.

Overlay protocols were not run: the diff contains no skill, agent, feature-catalog or playbook artifact.

## Integration Evidence

- `commandOnlyMentioned` is the only implementation surface the 040 decision row and the AC-001 verb list name; the consumer `attachCommand` is where the offer becomes visible (`command-attach.ts:533`).
- The phase-040 checklist does not name a test row for either boundary, which is consistent with the fixture gap recorded as `R1-P2-001`.

## Edge Cases

- The 040 phase is still `in progress`, so an `Unmet` AC-005 is the expected state during a review pass, not a process failure. It is recorded as `partial`, not `fail`, for that reason.
- The decision row's wording ("A refusal of 'it' must end its clause") is ambiguous between "the refusal ends the clause" and "`it` ends the clause". The code takes the second reading; the spec text supports the first. Recorded as the spec/code split behind `R1-P1-001`, not as a separate documentation finding.
- The spec example uses `and tell me`, which the code reads correctly; the failing case adds `then`. The spec does not exclude `then`, so the shape remains covered by the problem statement.

## Confirmed-Clean Surfaces

- AC-001's five named prompts all read as mentions on the current tree, and the `REQUEST6`/`CONTROL5` rows stay requests; the pass-thirteen work it claims is present.
- CHK-FIX-001's class naming is accurate for the two rules: the mention reader is the producer surface and both changes are in it.
- The retired-name mapping and the wrapper invariance are unchanged by pass fourteen.

## Ruled Out

- A separate traceability finding for the phase-040 summary row: it states the intended behavior, and the code gap is already an active P1; a second row would duplicate the same fix.
- A checklist failure for AC-002/AC-003: both are `Met` and unrelated to this diff.

## Next Focus

- Dimension: maintainability
- Focus area: comment accuracy and fixture durability for the two rules, read at function level rather than file level.
- Reason: the two P1s are behavior defects; this pass asks whether a future reader can see the boundary from the comment and the tests without replaying prompts, and changes granularity per the recovery strategy if the stop decision reports repeated no-progress.
- Rotation status: correctness, security and traceability complete; maintainability next.
- Blocked/productive carry-forward: the traceability gate is closed by two `partial` core results, so the next pass must not expect a legal STOP.
- Required evidence: the comment blocks at `command-attach.ts:409-423`, the fixture tables at `tests:200-229`, and the P2's two missing rows.

## Verdict

No new finding; two core traceability protocols are `partial` against the active P1s.

Review verdict: CONDITIONAL
