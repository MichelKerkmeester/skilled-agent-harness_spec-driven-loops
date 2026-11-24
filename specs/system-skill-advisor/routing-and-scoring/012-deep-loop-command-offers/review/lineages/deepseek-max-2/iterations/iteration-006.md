# Review Iteration 006

## Dispatcher

- Lineage `deepseek-max-2`, iteration 6 of 7, mode `review`, `AUTONOMOUS`.
- Dimension: **traceability**, second half (`spec_code`). Operator focus carried directly: REQ-032 to REQ-046 and the two sixth-round decisions, ADR-005 and ADR-006, read as decisions and checked against the code that implements them.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (`spec-folder`).

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` to `:470` - ADR-005 in full.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:508` to `:570` - ADR-006 in full.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235` to `:258` - REQ-023 to REQ-046 re-read as the mapping side.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:430` to `:500` - the pattern pairs and the mode-vocabulary block.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330` to `:350` and `:450` to `:462` - `LOOP_WORDING` and `LOOP_NAMES`, read for the verb-led rule ADR-006 states.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4613` and `:4806` to `:4821` - `_LOOP_NAME_LIST`, `_LOOP_NAME` and the alternations that read it.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` and `command-prompts.jsonl` - the recaptured corpus and the 31 near-miss rows.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:140` and `:147` to `:149` - the corpus counts the packet records.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-023 to REQ-046 are all mapped now, so the requirement-to-code side of the protocol is complete for the run: REQ-012 and REQ-031 do not hold (iterations 2 and 1), the other forty-four do. The protocol stays `partial` only because two requirements fail their mapping; every REQ has an implementation, a probe or a decision behind it. |
| `checklist_evidence` | partial | The requirement-to-acceptance map is complete: 46 REQs, 54 AC rows, no REQ without a row and no row naming a missing REQ. The failing cells are the fourteen recorded in iterations 1 and 3; the rest hold. |

Observed measurements behind the rows (read-only probes under the lineage, no repository tooling run):

- **ADR-005 holds as a decision and as code.** The decision says a typed `/deep:*` command stays on the served head on a stuck-run complaint, that `attachCommand` keeps answering `/doctor:deep-loop` at the gate layer, and that the Python fallback keeps a typed run row. All three were observed: `attachCommand('my deep review run is stuck, /deep:review again')` answers `/doctor:deep-loop`, `attachTypedCommand` replaces the top row with `/deep:review` and `typed: true` (`advisor-recommend.ts:442`), and the Python gate keeps `command-spec-kit-deep-review` marked `typed` on that prompt. The fixture's two typed columns exist and are read by the suites the decision names: five rows carry `servedReviewKept`, and the TypeScript assertion at `deep-loop-offer-cases.vitest.ts:226` runs `attachTypedCommand` while the Python parity test reads the same column.
- **ADR-006 holds as a decision and as code.** The decision says bare "deep research" and "deep review" count on their own while "deep loop", "research loop" and "review loop" count only behind a use, continue or want verb. `LOOP_WORDING` carries the deep research and deep review spellings and none of the three loop names (`command-attach.ts:330`), while `LOOP_NAMES` (`:450`) is read only inside the verb-led alternations of `LOOP_REQUEST` (`:949`). The fixture row `bare-loop-name` pins "deep loop: audit the payments flow" as `asksForLoopRun: false`, and the Python copy builds `_LOOP_NAME` from `_LOOP_NAME_LIST` (`skill_advisor.py:4806`) and reads it through the same three alternations (`:4818` to `:4821`).
- **REQ-045 holds.** The mode-vocabulary block (`deep-loop-offer-cases.vitest.ts:485` to `:500`) asserts that `MODE_CUES`, `MODE_CUE_WORDS` and `hub-router.json`'s `routerSignals` key the same modes, that each mode is its own cue word, and that each mode's vocabulary class resolves in the router. The pattern block (`:435` to `:441`) compares each shared pattern's source with the Python literal, `NAMED_LOOP_MODE` among them.
- **REQ-039 holds on the recorded counts.** `command-routing-baseline.json` is present, `command-prompts.jsonl` holds 247 rows, `implementation-summary.md:140` records the recapture as "`false_offer` 2 of 41, the two new near-miss rows, and the 35 earlier rows stay at 0", and `:147` to `:149` record `false_offer 0 of 45` after D10 and in the two following rounds. The new near-miss rows each carry their own `expected_command` and `source`, which is the "recorded on its own" clause.
- **REQ-042 and REQ-043 to REQ-044 hold on the gate.** Measured in iteration 1's probe and through the fixture columns: a routed research route serves `/deep:review` when the ask names review, a pronoun rerun is a run ask, and a past-run summary gets no doctor row.
- **REQ-033 is this run.** Its clause is that a `/deep:review` rerun with traceability as its focus finishes `spec_code` and `checklist_evidence` and that its terminal gates read evidence, scope and coverage pass. This lineage is that rerun; its terminal gates are computed at synthesis, and the acceptance row that records the result (AC-040) is a packet document this lineage may not edit. Recorded as an edge case rather than a finding, because nothing in the tree contradicts the requirement — the previous generation simply had not yet produced a passing rerun.

## Integration Evidence

None recorded. The corpus, the fixture and the drift guard were read as the implements of REQ-039 and REQ-045, not as integration surfaces.

## Edge Cases

- **Requirement-to-acceptance map is complete.** 46 REQs and 54 AC rows: every REQ is named by at least one row, and no row names a REQ the spec does not hold. 50 rows are `Met`, 2 `Waived` (AC-008 with ADR-003, AC-017 with ADR-002), 1 `Superseded` (AC-019 with ADR-001) and 1 `Unmet` (AC-040). The one gap the map exposes is finding 1 of iteration 2: REQ-012's only row is the superseded one.
- **REQ-033 cannot be closed from inside the run.** The requirement names a rerun and its gate results; this lineage produces them, but the acceptance row that records them lives outside this lineage's write authority. The synthesis records the run's own gate outcome so the operator can close AC-040 on the strength of it.
- **Asymmetry recorded, not reported.** ADR-006's context says bare "deep review" counts on its own, and no fixture row pins "deep review: audit the payments flow" specifically; the rule is pinned by other rows (`named-deep-review`, `bare-loop-name`'s control shape). The decision does not claim a row for it, so no finding.
- **Not reproducible here.** The corpus recapture command was not run; the recorded baseline and the packet's own counts were read instead.

## Confirmed-Clean Surfaces

- ADR-005's three claims: gate-layer doctor answer, served-head typed override, Python typed run row — all observed.
- ADR-006's rule: `LOOP_WORDING` carries no loop name, `LOOP_NAMES` is only read behind a verb, and the fixture pins the bare-name case in both copies.
- The mode-vocabulary drift guard: four surfaces key the same two modes, and the shared patterns match the Python literals source for source.
- The corpus: 247 rows, 31 near-miss rows, a recaptured baseline file, and recorded counts that match the cells that cite them.
- The requirement-to-acceptance map: complete in both directions, with one row per failed requirement.

## Ruled Out

- **A decision record that the code does not implement.** ADR-005 and ADR-006 each describe precisely what the gate, the handler and the Python copy do.
- **A requirement with no acceptance row.** The map is complete in both directions.
- **A mode surface the drift guard misses.** The command table, the cue words, the router signals and the shared patterns are all compared.
- **A corpus count the packet invents.** The baseline file exists and the recorded counts agree with the cells that cite them.

## Next Focus

- Dimension: traceability (`spec_code` and `checklist_evidence`), final pass.
- Focus area: close both core protocols with an explicit result per protocol, re-read the fourteen failing cells so the final report lists them by id, and confirm this run's own gate inputs (evidence, scope, coverage).
- Reason: the last iteration under the cap owes the run its complete core-protocol results, and the synthesis reads them from that iteration.
- Rotation status: every configured dimension is covered; traceability needs its third pass.
- Blocked/productive carry-forward: productive - a mechanical map of requirements to rows settles coverage in one call; blocked - none.
- Required evidence: one result entry per core protocol with `status` and `evidenceRefs`, and the final report's finding list matching the registry counts.
- Recovery note: none.

Review verdict: PASS
