# Iteration 008 - traceability (last under the cap)

## Dimension

Traceability, last iteration under `maxIterations`: re-record both core protocols with their file:line evidence, and verify the lineage's artifacts agree before the cap ends the loop.

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

Operator review focus: pass fourteen, area `mention`. The final pass re-read the phase-040 records and the two scope files only, and honored the holdout rule.

Recovery note: the iteration-7 stop decision was `STUCK_RECOVERY` (stuckCount 6). This is the last iteration under the cap; `reviewUnfinishedCoreProtocols` still names `spec_code` and `checklist_evidence`, and neither can be raised to `pass` while `R1-P1-001` and `R1-P1-002` are open.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:409-482`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:200-229`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md:52-58`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/implementation-summary.md:78-90`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:56-60`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:130-131`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-14.txt:1-10`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` and `R1-P1-002` remain active and reproduce on the current tree.

### P2 Findings

None new. `R1-P2-001` remains active.

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|----------|-------|--------|----------|---------|
| `spec_code` | core | partial | `040-final-alignment-loop/spec.md:57`, `040-final-alignment-loop/implementation-summary.md:83`, `command-attach.ts:415`, `command-attach.ts:465` | Unchanged from iteration 3: the document-naming shape with a `then` follow-up is offered, and the refusal rule requires the pronoun rather than the refusal to end the clause. Both remain `R1-P1-001`/`R1-P1-002`. |
| `checklist_evidence` | core | partial | `040-final-alignment-loop/acceptance-criteria.md:60`, `040-final-alignment-loop/tasks.md:131` | AC-005 is `Unmet` for pass 14 (two P1 open); CHK-FIX-002 does not cover the two new boundary shapes. |

Both results carry `gateClass: hard`, so `traceabilityCovered` stays false and the legal-stop `dimensionCoverageGate` cannot pass before the cap. The cap stop is terminal and does not depend on this gate.

## Integration Evidence

- The two P1 prompts were replayed a final time: `commandOnlyMentioned('/create:readme keeps failing, never run it again', '/create:readme')` is `false` and `commandOnlyMentioned('read the /deep:review docs, then tell me what it does', '/deep:review')` is `false`; both consumers offer the command.
- The seven prior iteration files and their deltas exist in this lineage, and each state record was accepted by the append gateway before its reducer run.

## Edge Cases

- The last-under-cap traceability rule cannot make a `partial` result pass without new evidence; the only evidence that would change it is a code fix, which this review does not perform. The cap is the legal terminal path.
- The convergence event carries `decision: "recover"` for the seven stuck decisions; the closed-shape ledger payload has no `stopReason` slot, so the reason lives in `iter-NNN.convergence.json` and in the iteration narratives. This is a schema limit, not a missing record.
- No dimension was left uncovered: correctness, security, traceability and maintainability each have at least one iteration, and both scope files were read under all four.

## Confirmed-Clean Surfaces

- All eight iteration narratives parse to the same focus and counts as their state records.
- The findings registry holds exactly three open findings (`R1-P1-001`, `R1-P1-002`, `R1-P2-001`) with file:line evidence; no duplicate was created by the replay passes.
- The graph holds one node per covered dimension, one per reviewed file, one per finding, and one evidence node per finding, with the required edges.

## Ruled Out

- Raising the core protocols to `pass` to allow a legal STOP: the spec and checklist are not satisfied while the two P1s are open, so a pass would be false.
- Adding a new finding in this pass: the last iteration re-confirms the same three; no new input was found.

## Next Focus

- Dimension: none; the loop reaches `maxIterations`.
- Focus area: synthesis compiled the eight iterations into `review-report.md`; the verdict is `FAIL` because the required terminal `coverage` gate is still failing, with two active P1s and one P2.
- Reason: the cap is reached with two open P1s and a closed traceability gate; the workflow's verdict rule makes the failed required gate a FAIL.
- Rotation status: all dimensions complete.
- Blocked/productive carry-forward: `spec_code` and `checklist_evidence` remain partial; the operator owns the fix decision.
- Required evidence: the registry counts, the terminal gates output, and the eight iteration files.

## Verdict

No new finding; both P1s and the P2 remain active.

Review verdict: CONDITIONAL
