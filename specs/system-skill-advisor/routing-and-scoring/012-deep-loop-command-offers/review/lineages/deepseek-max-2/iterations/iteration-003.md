# Review Iteration 003

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-2-1795511183570-92w0ez`, generation 1, lineageMode `new`
- Iteration 3 of 5. Dimension: traceability. Operator review focus: traceability (`spec_code` + `checklist_evidence`).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.

## Dimension

Traceability. This is the core iteration for the operator focus: finish `spec_code` over REQ-001 to REQ-022, run `checklist_evidence` over the ticked tasks and the `Met` acceptance rows, and check that each cited anchor resolves to the thing it claims.

The operator focus was addressed directly: `spec_code` now rests on the recorded probe pair plus a 38-prompt live matrix rather than on the packet's prose, and `checklist_evidence` was opened against the actual line each `Met` row and each ticked task cites.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:223` (REQ-011), `:151-186` (REQ-001 to REQ-004), `:186-300` (REQ-005 to REQ-022)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58-78`, `:97`, `:127`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36`, `:69`, `:163-166`, `:291-293`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:153-160`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` and `results-spec-baseline.json` (69 rows each, compared row by row)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/corpus-before.json`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13-59`, `:223-248`, `:477-478`
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13-54`
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`
- `.skilled/commands/deep/assets/deep-research.yaml:663`, `:2268-2269`; `.skilled/commands/deep/assets/deep-review.yaml:58`
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `ROUTER.md:63`
- `.skilled/skills/system-deep-loop/SKILL.md:20`, `deep-research/SKILL.md`, `deep-review/SKILL.md`
- `.skilled/changelog/skilled/v4.2.0.0.md:475-487`, `:759`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (near-miss and holdout ids)
- Live matrix: 38 REQ prompts through `attachCommand` (`command-attach.ts`) on review, research and deferred routes.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **REQ-011 still requires the `autonomous research` alias that the build dropped** -- `spec.md:223` -- REQ-011 says the three research aliases `iterative research`, `multi-round research` and `autonomous research` reach `hub-router.json` and `ROUTER.md`. Only two are there: `hub-router.json:34` and `ROUTER.md:63` carry `iterative research` and `multi-round research`, and neither carries `autonomous research`. `tasks.md:69` (T022, ticked) records the drop after its out-of-domain replay and points at operator decision D8, and the implementation summary's decision table repeats it, but the requirement text was never amended and no acceptance row tests the third alias: AC-017 covers K2 and the out-of-domain replay, AC-018 covers the removed depth triggers, and neither asserts the alias list. A reader checking REQ-011 against the tree therefore finds an unimplemented clause with no decision named in the requirement itself.
Finding class: class-of-bug (a requirement not amended when a recorded operator decision changed the build, the same class the sixth round fixed for REQ-020 and SC-005)
Scope proof: `spec.md:223` is in `reviewScopeFiles`; the missing alias is evidenced at `hub-router.json:34` and `ROUTER.md:63`, both read directly.
Affected surface hints: `spec.md`, `acceptance-criteria.md`, `tasks.md`, `hub-router.json`, `ROUTER.md`, `decision-record.md` D8
Case: a closure auditor greps `spec.md` for REQ-011, greps `hub-router.json` for the three named aliases, and finds two; the packet still reads closeable because no acceptance row owns the clause.

2. **Eleven `Met` acceptance rows cite an `implementation-summary.md` line that does not hold their evidence** -- `acceptance-criteria.md:58` -- AC-001, AC-002, AC-003, AC-004, AC-005 (lines 58-62), AC-013 (line 70), AC-016 (line 73) and AC-021 (line 78) name their evidence as `implementation-summary.md:155`, which is the `Closure pass: corpus` row. The probe evidence they describe is the `Closure pass: spec-baseline probe` row at `implementation-summary.md:153`. AC-010 (line 67) and AC-011 (line 68) cite `:156`, the alias-replay row, where the suite and mirror evidence is at `:154` and `:157`; AC-012 (line 69) cites `:157`, the final-rerun row, where the corpus evidence is at `:155`. Every citation lands one to four lines away from the row the matching check needs, and the rows themselves are correct: `:153` states the gain, no-gain, keep and negative groups, `:154` states the mirror and command-reference results, `:155` states the corpus counts.
Finding class: instance-only (a stale pointer, not a wrong measurement)
Scope proof: each cited line printed directly and compared with the content the row's Verification cell names; `acceptance-criteria.md` and `implementation-summary.md` are both in `reviewScopeFiles`.
Affected surface hints: `acceptance-criteria.md` AC-001 to AC-013, AC-016, AC-021; `implementation-summary.md` Verification table
Case: a reader follows AC-003's `Evidence: implementation-summary.md:155` to confirm the thirteen no-gain prompts and lands on the corpus paragraph, which says nothing about them; the status table's own rule ("the Verification cell names evidence that was actually observed") is therefore not met by the pointer even though the evidence exists.

3. **A ticked task's stated verification no longer holds** -- `tasks.md:36` -- T001 is marked `[x]` with `Verify: rg -c '^\| D[0-9]' $PKT/scratch/decisions.md prints 9`. The file now holds 11 decision rows, so the stated check prints 11. The two extra rows are the operator decisions later added by this packet (Q034 and Q035), which is why the count moved, but the ticked row still asserts 9 and carries no observed note correcting it, unlike T022, which records its own divergence from its stated expectation.
Finding class: instance-only
Scope proof: `tasks.md:36` in scope; the count was run against `scratch/decisions.md` and printed 11.
Affected surface hints: `tasks.md` T001, the Verification Summary's claim that the boxes agree with their evidence
Case: a checklist_evidence pass reruns T001's own command and gets 11, so the ticked box rests on a check that now contradicts the file it cites.

4. **The changelog quotes a suite count the tree has since exceeded** -- `.skilled/changelog/skilled/v4.2.0.0.md:759` -- the release table row reads `Advisor runtime suite with the loop offers | 2,696 passed, 4 skipped, none failed`. The sixth round's recorded final advisor run is 184 files and 3,029 passed: `implementation-summary.md:164` and AC-042 both state it for the final staged tree, and T081 records the same run. REQ-022 asked the changelog to quote the final suite count and AC-029 confirms it quotes 2,696, so the row satisfied its own round; the number is stale only against the later round, and REQ-034 named the changelog for the typed-on-stuck exception and the refusal verbs without asking for a recount.
Finding class: instance-only
Scope proof: `v4.2.0.0.md:759` is in `reviewScopeFiles`; the 3,029 figure is at `implementation-summary.md:164` and in AC-042's observed cell.
Affected surface hints: `.skilled/changelog/skilled/v4.2.0.0.md` release table; `implementation-summary.md` Verification; `tasks.md` T081
Case: a release reader takes 2,696 as the shipped advisor count for this feature and reads a tree that reports 3,029 for the same suite.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:151-300`, `results-after.json` vs `results-spec-baseline.json`, 38-prompt live matrix | REQ-001 to REQ-022 resolved; REQ-023 to REQ-034 resolved in iterations 1-2 and 3 with their anchors; the REQ-011 clause is the one mismatch, reported as P2-1 |
| `checklist_evidence` | partial | `acceptance-criteria.md:58-78`, `tasks.md:36-166`, `implementation-summary.md:153-172` | AC-030 to AC-042 anchors resolve; eleven earlier rows mis-point (P2-2); one ticked task mis-states its check (P2-3) |

Spec-code results, requirement by requirement:

- **REQ-001 to REQ-004** are settled by the recorded probe pair. Comparing `results-after.json` with `results-spec-baseline.json`, both 69 rows: the 17 negative ids have identical top skill and `cmd=`, the 17 keep ids have identical top skill and command, R7 is the single intended change (`cmd` removed), the 13 no-gain ids carry no `/deep:*` command, and V6, H1a, H1b, E1 and E3 carry their commands with `policy: ask`.
- **REQ-005, REQ-009, REQ-010** are in the assets: the offer section with A (recommended, `:auto` plus `--spec-folder=<the Gate 3 answer>`), B (`:confirm`) and C (no loop) at `.skilled/commands/deep/assets/deep-research-presentation.txt:37-59` and the review twin, the step-6 question-tool sentence at `:223`, `Autonomous (Recommended)` at `:236` and `Native (Recommended, default)` at `:246`, the `--extend=N` and `/doctor:deep-loop --scope=research` rows at `:477-478`, the completed-packet message at `deep-research.yaml:663`, and the `--extend=N` next step at `deep-research.yaml:2268-2269`. `ASK with SINGLE prompt` returns nothing from either presentation file or the compiled contracts.
- **REQ-006, REQ-007** rest on the test files and the build record. The depth-word and loop-ask cases live in `command-attach-guards.vitest.ts:518-545`; the compiled contracts carry no `ASK with SINGLE prompt`; the `dist/` clause is recorded as an environmental dependency below.
- **REQ-008** rests on the stage-one lane and its test (`stage-one-loop-subject.vitest.ts:20`, `:26`), read in iteration 1.
- **REQ-011** is the mismatch reported as P2-1: two of its three aliases are present, the council words are gone from both gate copies, the depth triggers are gone from both mode packets, the hub `SKILL.md:20` names `/doctor:deep-loop`, and no spaced flag form remains.
- **REQ-012** is satisfied by the corpus: 31 near-miss rows, including `nm-system-deep-loop-01` and `nm-system-deep-loop-03` for N7 and N9.
- **REQ-013** is satisfied by id: `cmd-deep-research-plain-holdout-04`, `cmd-deep-review-plain-holdout-04` and `cmd-doctor-deep-loop-plain-holdout-04` are the three `-04` deep-family rows.
- **REQ-014** is settled by the probe: N9 carries no deep command (`results-after.json`), and the live matrix reproduces `ask=false`.
- **REQ-015 to REQ-020** are settled by the live matrix: all 38 prompts return exactly the command the requirement states, including the three controls that keep `/deep:review`.
- **REQ-021 to REQ-022** are settled by the recorded suite, probe and corpus rows plus the changelog text; the stale count is reported as P2-4.

Checklist-evidence results:

- Every `acceptance-criteria.md` anchor cited by AC-030 to AC-042 resolves in the tree and says what the row claims: `command-attach-guards.vitest.ts:808`, `:963`, `:998`; `deep-loop-offer-cases.vitest.ts:61`, `:170`, `:227`; the fixture rows at `:123`, `:125`, `:129`, `:138`, `:2`; `typed-on-stuck-serving.vitest.ts:107`; `advisor-recommend-typed-command.vitest.ts:91`; `command-brief-golden.vitest.ts:353`; `subprocess-typed-fields.vitest.ts:88`; `cli-degraded-command-contract.vitest.ts:81`; `doctor-handoff-command.vitest.ts:196`, `:239`; `stage-one-loop-subject.vitest.ts:26`; `reduce-state.cjs:995`; `skill_advisor.py:4886`, `:5349`, `:5424`; `test_skill_advisor.py:2902`, `:2969`, `:3017`; `command-prompts.jsonl:94`; packet 013 `implementation-summary.md:123`.
- The eleven earlier rows that cite a shifted `implementation-summary.md` line are reported as P2-2, and T001's stale count as P2-3.
- AC-040 remains `Unmet` and says so, with the reason that this rerun is the follow-up review run; nothing in this iteration changes that, and the closure statement at `acceptance-criteria.md:127` stays accurate.

## Integration Evidence

- `deep-research-presentation.txt:37-59` and `deep-review-presentation.txt:37-59`: the three offer options.
- `research.md:86` and `review.md:81`: the step-0 pointers.
- `deep-research.yaml:663`, `:2268-2269`: completed-packet message and the `--extend=N` next step.
- `hub-router.json:34` and `ROUTER.md:63`: the two aliases that exist.
- `SKILL.md:20`: `/doctor:deep-loop` in the hub's routing paragraph.
- `v4.2.0.0.md:475-487`: the refusal verbs, the typed-on-stuck head and the depth-word rule as built.

## Edge Cases

- `dist/` is gitignored and absent in this worktree, so REQ-006's "the probe run prints `live`" clause cannot be reproduced here without a build, and a build writes outside this lineage. The source, the test files and the recorded run are verified; the clause is recorded as an environmental dependency, not as a failed requirement.
- AC-020's "three deep-family holdout rows" counts the doctor deep-loop row as deep-family; by id, the three `-04` rows are the research, review and doctor deep-loop prompts. Recorded, not raised: the count is defensible either way and the row is `Met`.
- AC-009's citation of `command-attach-guards.vitest.ts:536` lands inside the depth-wording case table it describes, not on a `describe` line. Accepted as a valid pointer.
- REQ-011's dropped alias is the exact class the sixth round fixed for REQ-020: a requirement left unamended after an operator decision. It is reported, not silently absorbed.

## Confirmed-Clean Surfaces

- The recorded probe pair as a REQ-001 to REQ-004 witness: identical on 34 group rows, one intended change.
- The offer documentation set: presentation assets, command documents, YAML messages and next steps all carry the strings REQ-005, REQ-009 and REQ-010 name.
- The drift rows of REQ-011 other than the third alias: council words, depth triggers, hub doctor sentence and spaced flags are all in their stated end state.
- The corpus and holdout rows of REQ-012 and REQ-013.

## Ruled Out

- A live gate failure against any REQ-015 to REQ-027 prompt: ruled out by the 38-prompt matrix, zero mismatches.
- A missing acceptance-row anchor for the sixth round: ruled out; AC-030 to AC-042 all resolve.
- A `spec_code` mismatch on REQ-001 to REQ-004: ruled out by the row-by-row probe comparison.
- A hidden compiled-contract string: ruled out; no `ASK with SINGLE prompt` anywhere under `assets/compiled/`.

## Next Focus

- Dimension: maintainability
- Focus area: the closure documentation as a change surface (REQ-034, AC-041), the fixture header's statement of which layer each typed column pins, and the decision record's ADR-001 to ADR-006 completeness.
- Reason: canonical order's last uncovered dimension, and the findings above are documentation-surface defects that a maintainability pass can size.
- Rotation status: third rotation; correctness, security and traceability covered.
- Blocked/productive carry-forward: productive category "citation resolution sweep" should be finished across every task row; the eleven-row pointer defect suggests more of the same class.
- Required evidence: `tasks.md` and `acceptance-criteria.md` citation sweep against the tree, `decision-record.md` ADR coverage, fixture header.

## Verdict

No active P0 or P1; four P2 advisories are active. The packet's coverage claims hold except for the REQ-011 clause and the stale pointers, so this iteration passes with advisories.

Review verdict: PASS
