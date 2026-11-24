# Review Iteration 005

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-2-1795511183570-92w0ez`, generation 1, lineageMode `new`
- Iteration 5 of 5, the last under the cap. Dimension: traceability (second pass). Operator review focus: traceability (`spec_code` + `checklist_evidence`).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.

## Dimension

Traceability, second pass: close both core protocols at their final status, re-read every active finding against the current tree, and state what this rerun supplies for `acceptance-criteria.md` AC-040 and `tasks.md` T084 without editing either file.

The operator focus was addressed by finishing both protocols: `spec_code` has now been run over all 34 REQ rows and `checklist_evidence` over all 85 task rows and all 42 acceptance rows, each against a file, a decision or a recorded measurement. Six findings remain active, and one of them is raised to P1 after comparison with the prior review of this packet.

## Files Reviewed

- Re-read of all seven active-finding anchors: `spec.md:223`, `acceptance-criteria.md:58`, `acceptance-criteria.md:89`, `tasks.md:36`, `implementation-summary.md:13`, `acceptance-criteria.md:11`, `.skilled/changelog/skilled/v4.2.0.0.md:759`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97` (AC-040), `:127` (closure statement)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:166` (T084)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:1-28` (AC-022 to AC-026, AC-036 evidence)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:603` (the operator-decision table and Q034/Q035)
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1708-1727` (`reviewTraceabilityCovered`)
- `.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs` run against the lineage's config, state log and registry.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **REQ-011 is an unamended requirement contradicted by the tree, and no acceptance row owns it** -- `spec.md:223` -- this refines `R3-P2-001` and raises it. REQ-011 states that `iterative research`, `multi-round research` and `autonomous research` reach `hub-router.json` and `ROUTER.md`; the tree carries the first two (`hub-router.json:34`, `ROUTER.md:63`) and not the third. The drop is real and authorized — operator decision D8, recorded again in `tasks.md:69` (T022, ticked) and in the implementation summary's decision table — but the requirement text was never amended, and no acceptance row tests the third alias: AC-017 covers K2 and the out-of-domain replay, AC-018 covers the removed depth triggers. The reason for the raise is precedent inside this packet: the previous deep review of this packet returned FAIL over exactly this class of defect (REQ-020, SC-005 and AC-027 stated a parity result the built head did not have) and the operator commissioned the sixth round to amend those records. A requirement a reader checks against the tree and finds false is the same closure-record gap, one round later. It is P1, not P0, because the behaviour is the operator's chosen behaviour and nothing a user reaches is broken; what is broken is the record that says what the build does.
Finding class: class-of-bug (a requirement left unamended after a recorded operator decision changed the build)
Scope proof: `spec.md:223` is in `reviewScopeFiles`; `hub-router.json:34` and `ROUTER.md:63` were read and contain two of the three aliases; `decision-record.md` holds D8 and ADR-004/ADR-006, none of which amends REQ-011.
Affected surface hints: `spec.md` REQ-011, `acceptance-criteria.md` AC-017/AC-018, `tasks.md` T022, `decision-record.md` operator decisions, `hub-router.json`, `ROUTER.md`
Case: an operator reads REQ-011 to learn what the research aliases are, adds `autonomous research` to a test, and the alias does not exist; the packet still reads closeable because no acceptance row owns the clause.
Claim adjudication:
```json
{"type":"claim","claim":"REQ-011 requires three research aliases while the tree implements two, and no acceptance row or ADR amends the requirement","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:223",".skilled/skills/system-deep-loop/hub-router.json:34",".skilled/skills/system-deep-loop/ROUTER.md:63","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:69"],"counterevidenceSought":"searched decision-record.md for an amendment and acceptance-criteria.md for a row that names the third alias; found D8 and T022 recording the drop, and no AC row or ADR that amends REQ-011","alternativeExplanation":"the requirement may be read as describing the family of aliases the packet considered rather than the set that shipped","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"an acceptance row or ADR that states REQ-011 is satisfied with two aliases, or an amendment of REQ-011 to two"}
```

### P2 Findings

2. **Eleven `Met` acceptance rows cite an `implementation-summary.md` line that does not hold their evidence** -- `acceptance-criteria.md:58` -- unchanged from iteration 3 and still active: AC-001 to AC-005 (lines 58-62), AC-013 (70), AC-016 (73) and AC-021 (78) point at `implementation-summary.md:155`, the corpus row, for probe evidence that is at `:153`; AC-010 (67) and AC-011 (68) point at `:156` for suite and mirror evidence that is at `:154` and `:157`; AC-012 (69) points at `:157` for the corpus evidence that is at `:155`.
Finding class: instance-only
Scope proof: each cited line printed and compared with the row's own Verification text; both files in scope.
Affected surface hints: `acceptance-criteria.md`, `implementation-summary.md`
Case: a reader follows AC-003's anchor and lands on a paragraph that says nothing about the no-gain prompts.

3. **A ticked task's stated verification no longer holds** -- `tasks.md:36` -- unchanged from iteration 3 and still active: T001's stated check `rg -c '^\| D[0-9]' scratch/decisions.md` prints 11, and the row claims 9. The count moved when Q034 and Q035 were appended.
Finding class: instance-only
Scope proof: the command was rerun against `scratch/decisions.md`.
Affected surface hints: `tasks.md`, `scratch/decisions.md`
Case: a checklist_evidence pass reruns T001's own command and gets 11.

4. **The changelog quotes a suite count the tree has since exceeded** -- `.skilled/changelog/skilled/v4.2.0.0.md:759` -- unchanged from iteration 3 and still active: the row reads 2,696 passed; the sixth round's recorded run is 184 files and 3,029 passed (`implementation-summary.md:164`, AC-042, T081).
Finding class: instance-only
Scope proof: both figures printed; the changelog is in scope.
Affected surface hints: `.skilled/changelog/skilled/v4.2.0.0.md`, `implementation-summary.md`
Case: a release reader takes 2,696 as the shipped advisor count.

5. **AC-032 and T069 cite a blank line for `typedCommandIn`** -- `acceptance-criteria.md:89` -- unchanged from iteration 4 and still active: `command-attach.ts:250` is blank and the declaration is at `:251`.
Finding class: instance-only
Scope proof: lines 249-252 printed.
Affected surface hints: `acceptance-criteria.md`, `tasks.md`, `command-attach.ts`
Case: a reader follows AC-032's anchor and finds an empty line.

6. **Both closure docs carry continuity metadata that predates the sixth round** -- `implementation-summary.md:13` -- unchanged from iteration 4 and still active: `recent_action` and `next_safe_action` still describe planning the sixth round, and `acceptance-criteria.md:11-21` still carries the scaffold block with `completion_pct: 0`.
Finding class: class-of-bug
Scope proof: both blocks printed against `spec.md:23` and `tasks.md:166`.
Affected surface hints: `implementation-summary.md`, `acceptance-criteria.md`
Case: a resume reads `next_safe_action` and re-plans a round that is already built.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:223`, `results-after.json`, 38-prompt matrix, assets and hub | all 34 REQ rows checked; REQ-001 to REQ-010 and REQ-012 to REQ-034 resolve to code, decision or measurement; REQ-011 does not (finding 1) |
| `checklist_evidence` | partial | `acceptance-criteria.md:58`, `:89`, `tasks.md:36`, `:291`, `implementation-summary.md:13` | all 85 task rows and 42 AC rows checked; the checklist counts and the waiver map resolve; findings 2 to 6 are the drift |

Closing statement for both protocols: they have run to completion over every row they cover. Their status stays `partial` because the drift they found is unresolved, and both are hard-gate protocols, so the terminal coverage gate reports the shortfall rather than reading a partial as a pass. Recording them as `pass`, or reclassifying them as advisory to clear the gate, is the exact falsification `reduce-state.cjs:1573-1580` was written to prevent.

Terminal gate result for this lineage at its stop (`terminal-gates.cjs` over the lineage config, state log and registry): `evidence` pass (`all-findings-cited`), `scope` pass (`all-findings-in-scope`), `coverage` fail (`traceability-incomplete`). The coverage row fails on the two hard protocol results above, not on dimension coverage, which is complete for all four dimensions.

What this supplies for AC-040 and T084: the rerun has run; its own report is this lineage's synthesis; and its coverage gate fails on the six findings it raised. AC-040's text ("`spec_code` and `checklist_evidence` read complete and the terminal gates read evidence, scope and coverage pass") is therefore **not** satisfied by this rerun. The packet's docs are read-only to this lineage, so AC-040 and T084 are left exactly as they are, and the synthesis report carries the reason and the remediation list.

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1708-1727`: the coverage input that turns a hard partial into a failed gate.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1574-1580`: the fixed hard class for both core protocols.
- `scratch/probes/fresh-review-hook.txt:1-28`: the recorded hook lines AC-022 to AC-026 and AC-036 cite, all present and matching their rows.
- `decision-record.md` operator decisions D8, Q034 and Q035: the recorded intent behind the dropped alias and the autonomous sixth round.

## Edge Cases

- Two honest readings of "finish the protocols" are possible: finish executing them, or finish with a passing status. This run did the first and cannot do the second without falsifying the status, and the difference is stated rather than smoothed over.
- A P1 raised on the last iteration under the cap: the finding is new to this iteration only in severity, not in substance. `R3-P2-001` recorded the same evidence in iteration 3; this iteration re-read it, compared it with the prior review's treatment of the same class, and raised it. The refinement keeps the original id visible in the registry.
- The changelog count (finding 4) rests on reading 2,696 as a shipped figure rather than a round snapshot; confidence is 0.6, and the downgrade trigger is that the changelog is updated at release cut.

## Confirmed-Clean Surfaces

- REQ-001 to REQ-010, REQ-012 to REQ-034 against their code, decision or recorded measurement.
- The recorded hook evidence AC-022 to AC-026 and AC-036 cite.
- Dimension coverage: all four canonical dimensions have a full iteration.
- The three terminal-gate inputs other than protocol coverage.

## Ruled Out

- A behavioural failure of any REQ in the tree: ruled out across iterations 1 to 3 by live probes of the REQ prompt sets (42 prompts on correctness, 38 on the REQ-015 to REQ-027 matrix, 9 through the Python gate), the recorded probe pair and the adversarial timing shapes.
- A clean status for either core protocol: ruled out by the six active findings, each re-read this iteration.
- Fixing any finding here: out of contract. The packet's docs are outside this lineage's write surface, and remediation is a separate step.

## Next Focus

- None. This is the last iteration under `maxIterations: 5`, and the run proceeds to synthesis with stop reason `maxIterationsReached`.
- Rotation status: fourth rotation complete; no dimension is uncovered.
- Blocked/productive carry-forward: the productive category "producer read, then live exercise" carried the run; the exhausted category "citation resolution" is closed.
- Required evidence for synthesis: the seven active findings, the two protocol statuses, the terminal gate rows, and the four-dimension coverage record.

## Verdict

An active P1 (finding 1) with no active P0. The verdict is CONDITIONAL, and remediation is a documentation step: amend REQ-011 or record an ADR and an acceptance row for the dropped alias, then correct the five P2 pointers and blocks.

Review verdict: CONDITIONAL
