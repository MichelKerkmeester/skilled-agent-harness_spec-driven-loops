# Review Iteration 008 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`.
- Iteration: 8 of 8, the cap. Dimension: cross-reference final pass. Focus: artifact self-consistency before the cap stop.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks for a request that now reads as a mention and for a refusal still read as a request. This pass closes both questions by stating what each artifact says about them and checking that nothing disagrees: two P1s in the request direction, four P2s in the refusal and documentation directions.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-13/deep-review-state.jsonl` (row counts)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-13/deep-review-findings-registry.json` (counts and coverage)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-13/deltas/` (file set)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-13/iterations/` (file set)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:437-476` (final re-read of the reviewed function)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 and F002 remain active. Both are request-direction defects: a document naming shadows a later request, and a limiting negation after the name reads as a refusal.

### P2 Findings

None new. F003, F004, F005, F006 and F007 remain active as advisories: a markdown link merge, a one-shape post-name reader, a spec bullet wider than the code, a checklist claim wider than the matrix, and the fold comment's reflowed lines.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | F005 is the one drift: `spec.md:85` and `REQ-001` state the document shape without the determiner at `command-attach.ts:458`. Everything else in the branch matches the packet's scope bullets. |
| `checklist_evidence` | partial | F006 is the one defect: `tasks.md:131` claims matrix coverage for the two new leads. `AC-001` is met on its five enumerated prompts and on `REQUEST6`/`CONTROL5`. `CHK-FIX-001` holds. |
| `skill_agent` | notApplicable | No agent definition is in the diff. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | partial | `plan.md:70` names the guards test and the matrix as the verification; F001, F002 and F006 are what it cannot see. |
| `playbook_capability` | notApplicable | The playbook row belongs to the data area. |

## Integration Evidence

The three consumers named in iteration 1 are still the complete set: `attachCommand` at line 527, `withholdMentionedCommands` at `fusion.ts:1213`, and `typedCommandForTop` at line 259. No other caller of `commandOnlyMentioned` or `typedCommandIn` exists in the module or in the scorer.

## Edge Cases

- Stop path: the iteration count reaches `maxIterations` 8 at this pass, so the legal terminal stop is `maxIterationsReached`, not `converged`. The coverage gate could not pass because two core traceability protocols stay `partial`, and both are partial because of findings this lineage cannot fix: the spec text (F005) and the checklist sentence (F006).
- Ambiguity: whether the cap stop weakens the verdict. It does not: the verdict is computed from the registry (2 active P1, 5 active P2), and the cap stop only records that the loop used its full budget.
- Contradiction carried and resolved: iteration 4 over-attributed two comment lines to this branch; iteration 6 narrowed F007 to the two lines `git show b8ebee37d75` proves are new.
- Partial success: the review is complete for what a read-only pass can do. The two P1 fixes and the five P2 fixes belong to a follow-up implementation pass.
- State integrity: the state log holds 8 iteration rows across 7 runs, because run 3 was re-recorded with `findingsCount: 6`; the delta for run 3 carries the corrected record as its first line. Every other delta's first line matches its run's log row.

## Confirmed-Clean Surfaces

- The registry reports 7 open findings (2 P1, 5 P2), 0 resolved, and all four dimensions covered, which matches the seven iteration files and the six finding objects raised (F001 to F007 with F007 narrowed, not duplicated).
- Every finding carries a `file:line` citation, the two P1s carry typed claim-adjudication packets, and the P2s carry a case line.
- All four dimensions were reviewed against both scope files, and the packet docs were cited only for traceability.
- Write surface: every file this lineage created lives under `review/lineages/mention-13`. The only path outside it with a fresh mtime is `review/observability-events.jsonl`, whose rows carry `producer: fanout-run` and this lineage's label, so it is the parent runner's heartbeat, not a write from this process.

## Ruled Out

- An unconverted severity or a fourth tier: every finding is P0, P1 or P2.
- A missing claim-adjudication packet: both P1s carry one, and the `claimAdjudicationGate` passed on every convergence run after iteration 1.
- A hidden second branch in the diff: the diff for both scope files is the fold characters, the two tail rules, the occurrence lookahead and the typed start boundary, and nothing else.
- A stale citation: every cited line was re-read at the final tree in this pass.

## Next Focus

- Dimension: none. The cap is reached and synthesis is the next phase.
- Focus area: none.
- Reason: 8 of 8 iterations used; the stop decision is `maxIterationsReached`.
- Rotation status: exhausted.
- Blocked/productive carry-forward: productive `probe the exported guards with the concrete prompts a finding names`; blocked `close this pass as converged` until F005 and F006 are fixed by the packet owner.
- Required evidence: the recorded stop decision and the synthesis report.
- Recovery note: none.

Review verdict: CONDITIONAL
