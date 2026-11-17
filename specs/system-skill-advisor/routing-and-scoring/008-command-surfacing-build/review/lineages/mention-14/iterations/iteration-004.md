# Iteration 004 - maintainability

## Dimension

Maintainability: can a later reader see, from the comment and the tests alone, where each new boundary sits, and does the branch structure stay safe to change? Granularity changed from file level to line level per the iteration-3 recovery strategy.

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

Operator review focus: pass fourteen, area `mention`. The maintainability pass read the two scope files only and kept the holdout rule.

Recovery note: the iteration-3 stop decision was `STUCK_RECOVERY` (`stuckRecovery`, `stuckThresholdReached`, stuckCount 2) because iterations 2 and 3 added no finding. This pass changes granularity to the line level and audits the branch structure instead of the file contract. Its convergence event records decision `recover` with no blockers; the raw stop decision is in `iter-003.convergence.json`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:409-482` (line-level branch audit)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:200-229` (new fixtures)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172-198` (wrapper matrix)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-14.txt:1-10`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

Not re-run in this iteration; iteration 3 recorded `spec_code` and `checklist_evidence` as `partial`, and the reducer keeps those results until new evidence changes them.

## Integration Evidence

- The branch order inside `commandOnlyMentioned` is now: declined pronoun (463), asked pronoun (464), document naming (465-466), led decline/ask (467-472), bare ask (473-481). Each is an early return or a terminal boolean; no branch writes state.
- The two changed branches are the only ones that read `clause`; the document branch also reads `tail` and `before`, and the pronoun branches read `clause` alone.

## Edge Cases

- Branch-level audit found no unreachable branch and no branch that shadows a lead: a decline or ask lead before the name is still read after the two pronoun checks, and a bare lead still requires a question mark or a sentence-opening lead.
- The `then` test is the only place the document branch consults clause content beyond the immediate noun; it spans the whole clause rather than the sentence, which is the scope mismatch behind `R1-P1-002`.
- The new request rows (tests 210-218) are not in `PLAIN_ROWS`, so the wrapper-invariance matrix does not cover the exact shapes pass fourteen changed. The fold runs before every branch, so the risk is small; recorded here rather than as a finding so it does not duplicate `R1-P2-001`.
- The comment at 412-414 states the intended rule ("the refusal has to end its clause") that the code does not implement; that is the same defect as `R1-P1-001`, and fixing the rule fixes the comment. No separate finding.

## Confirmed-Clean Surfaces

- The five added request rows each assert `false` and pass when replayed; none of them depends on the document branch.
- The wrapper matrix still covers every fixture in `PLAIN_ROWS`, and the retired-name loop still maps `/create:skill` to `/create:sk-skill`.
- The function keeps its no-throw contract: every new test is a `RegExp.test` or a `String` operation, and no array index can be undefined (`occurrence.index ?? 0`).
- The generated tables above the function are untouched by the diff and still own the command rows.

## Ruled Out

- A complexity finding for the fourth early return: the branch is two conditions long and its order is documented at 420-422; no nesting was added.
- A duplication finding for the shared `clause` computation: it is one `split` used by three checks, which is cheaper to read than three copies.
- A comment finding on its own: both comment mismatches are the two active P1s; a separate row would repeat the same fix.

## Next Focus

- Dimension: correctness (replay)
- Focus area: re-run the two P1 reproductions line by line and confirm the guard still returns the wrong reading, so the finding stays active rather than becoming stale prose.
- Reason: maintainability produced no new finding; the recovery path asks for a protocol replay and an adversarial P0/P1 replay, and the two open P1s are the only gates that matter.
- Rotation status: all four dimensions covered; correctness replay next.
- Blocked/productive carry-forward: the traceability gate remains closed by two `partial` core results; do not expect a legal STOP before the cap.
- Required evidence: the exact prompt, the guard return, the consumer offer, and the cited line for each P1.

## Verdict

No new finding; the two iteration-1 P1s remain active.

Review verdict: CONDITIONAL
