# Review Iteration 003

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-3-1795514074741-gl47kr`, generation 4, lineageMode `new`
- Iteration 3 of 5. Dimension: traceability, first pass (`spec_code`). Operator review focus bound: the same protocol pair.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.
- No `steer.md` exists in this lineage at iteration 3, so this iteration carries no lead ruling.

## Dimension

Traceability, first pass: `spec_code` over all 34 REQ rows. Each row is checked against the code that implements it, the decision that records it, or the measurement the packet stores — not against prose that restates it.

The operator focus was addressed directly: this iteration is the `spec_code` protocol, and it finishes the row sweep that iteration 1 opened, so the protocol can be reported at a final status.

## Files Reviewed

- `spec.md:204-274` (REQ-001 to REQ-034), `spec.md:316-327` (Edge Cases)
- `acceptance-criteria.md:49-101` (AC-001 to AC-043), `decision-record.md:33-127` (ADR-001), `decision-record.md:128-222` (ADR-002), `decision-record.md:223-307` (ADR-003)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64-121` (`COMMAND_ROWS`), `:756` (`isNoEditRequest`), `:1061` (`COMMAND_ASK_NAMED_WORDS`), `:1291` (`attachCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` (stage-one rule)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5343` (Python gate)
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`, `.skilled/skills/system-deep-loop/SKILL.md:20`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md:319`, `.skilled/skills/system-deep-loop/deep-research/SKILL.md:303`
- `.skilled/commands/deep/review.md:81`, `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/assets/deep-review-presentation.txt:30`, `:45-62`, `:237`, `:256`, `:271`, `:583`, `deep-research-presentation.txt:30`, `:223`, `:240`, `:246`, `:478`
- `.skilled/commands/deep/assets/deep-review.yaml:68-69`, `.skilled/commands/deep/assets/deep-research.yaml:68-69`
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1-30` (source digests)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (row types, ids, holdouts)
- `scratch/probes/results-after.json` and `results-spec-baseline.json` (the 69-row probe pair)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995-1005` (`refinesSameLocation`)
- `.skilled/changelog/skilled/v4.2.0.0.md:32`, `:212`, `:470-492`, `:759`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:65-83`, `:241-298`; `command-attach.vitest.ts` (203 lines, whole file scanned by grep); `command-attach-guards.vitest.ts:473`, `:531-543`, `:558`, `:612-625`, `:700`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`AC-029` quotes a suite count the changelog no longer carries** -- `acceptance-criteria.md:86` -- the row reads `Met` and states that the changelog "quotes 2,696 passed", which was true when the fifth round wrote it. `.skilled/changelog/skilled/v4.2.0.0.md:759` now reads `184 files, 3,126 passed, 4 skipped, none failed`, the seventh round's own count, which `implementation-summary.md:172` records. The requirement behind the row is satisfied better than the cell claims; what is stale is the observation a closure reader is told to check.
Finding class: instance-only
Scope proof: both files are in `reviewScopeFiles`; the changelog line was printed and the number compared with the cell, and `implementation-summary.md:172` was read as the row's counterpart.
Affected surface hints: `acceptance-criteria.md` AC-029, `.skilled/changelog/skilled/v4.2.0.0.md`
Case: a closure reader checks AC-029 by searching the changelog for `2,696`, finds `3,126`, and cannot tell whether the row or the changelog is the stale one.

2. **`REQ-031` promises a fixture case for every list entry, and four of the twelve compared lists have none** -- `spec.md:243` -- the requirement's second sentence reads "A test fails when the two copies of any list differ, and every list entry has a fixture case that uses it". The guard compares twelve pairs (`tests/deep-loop-offer-cases.vitest.ts:66-77`), and per-entry coverage exists for the five lists the requirement enumerates plus `LOOP_WORDING`, `LOOP_NAMES` and `LOOP_WANT_LEADS` (`:241-283`). `RUN_ASK_REFUSAL_LEADS` (7 of 18 entries without a case), `MODE_SUFFIXES` (6 of 7), `COMMAND_DECLINE_LEAD_WORDS` (11 of 23) and `COMMAND_ASK_LEAD_WORDS` (20 of 28) are parity-tested only, so a word added to both copies of those lists would pass every test without a single prompt exercising it.
Finding class: instance-only (the requirement's wording runs wider than the test surface it names)
Scope proof: the fixture's 248 prompts were read and matched entry by entry against the four lists using the test's own word-boundary rule; the four lists and the twelve pair declarations are both in `reviewScopeFiles`.
Affected surface hints: `spec.md` REQ-031, `acceptance-criteria.md` AC-038, `tests/deep-loop-offer-cases.vitest.ts`, `tests/fixtures/deep-loop-offer-cases.json`
Case: a lane adds `doesn't matter` to the refusal leads in both copies and breaks the alternation it sits in; the parity test passes because the tuples match, and no fixture prompt contains the phrase, so nothing exercises the branch.
- Counterevidence: `AC-038` reads the requirement narrowly — it names the five enumerated lists and says the seventh round "extended" per-entry coverage to the artifact nouns and past-run verbs — so the packet may intend "every list entry" to mean every entry of those lists. Under that reading the tree satisfies the requirement and only the requirement's wording is loose.
- Downgrade trigger: a decision-record entry or an amendment of REQ-031 that scopes the per-entry clause to the enumerated lists.

3. **`REQ-006` and the Edge Cases name a test file that holds none of the cases they describe** -- `spec.md:213` -- the requirement states that `command-attach.vitest.ts` "holds a passing case for each loop-ask clause and a passing `undefined` case for each depth word", and `spec.md:321` says the loop-ask-plus-depth-word case and the two-cue case are "unit cases in `command-attach.vitest.ts`". `command-attach.vitest.ts` is 203 lines and holds none of them: the depth-word table is at `command-attach-guards.vitest.ts:531-543`, the loop-ask-plus-depth case at `:473`, and the two-cue case at `:618`. `tasks.md:244` (CHK-022) already names the guards file, so the packet's own checklist disagrees with its requirement.
Finding class: instance-only
Scope proof: `command-attach.vitest.ts` was read whole and grepped for the depth words and both cue shapes; the guards file was read at the three cited ranges; both files are in `reviewScopeFiles`.
Affected surface hints: `spec.md` REQ-006 and Edge Cases, `tasks.md` CHK-022, `tests/command-attach.vitest.ts`, `tests/command-attach-guards.vitest.ts`
Case: a reader who wants to see the depth-word guarantee opens `command-attach.vitest.ts`, finds no depth word, and cannot tell whether the guard is untested or merely filed elsewhere.

## Traceability Checks

- **`spec_code` (core, hard): pass.** All 34 REQ rows were checked. Each row resolved to a producer, an accepted decision or a recorded measurement; the three rows whose claim needs a documentation correction are carried as the P2 findings above rather than as unresolved claims. Evidence: `spec.md:213`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1291`, `.skilled/skills/system-deep-loop/hub-router.json:34`.
- **`checklist_evidence` (core, hard)**: not run in this iteration; iteration 4 runs it over the 87 task rows and 43 acceptance rows.

Row-by-row result:

| REQ | Resolved against | Result |
|---|---|---|
| REQ-001 | `results-after.json` V6, H1a, E3 carry `/deep:review ask` and H1b, E1 `/deep:research ask`, all five `system-deep-loop` | met |
| REQ-002 | R7 carries no command; none of V3, V8, V5, R2b, R3, R3b, R6, A1, A4, A8, H6, H8, H9 carries a `/deep:*` row; V5 tops `sk-code` | met |
| REQ-003 | the 17 keep rows match the baseline on top skill and command, every `/deep:*` row at `pol=ask` | met |
| REQ-004 | the 17 negatives match the baseline on top skill and command | met |
| REQ-005 | `### Offer From an Advisor Brief` in both presentation files; option A/B/C text at `deep-review-presentation.txt:60-62`; fan-out only on two or more executors or models at `:54`; step 0 in both command docs | met |
| REQ-006 | depth-word and both-cue cases exist, but in `command-attach-guards.vitest.ts`; 69 of 69 probe rows read `live` | met with the P2 above |
| REQ-007 | every `sourceDigests` entry in `deep-review.contract.markdown` matches the current file hash, so the compiled contract is current | met |
| REQ-008 | stage-one rows recorded: R2 `system-spec-kit`, V2, V4, H10 `/deep:review`, H7 `/deep:research`; no REQ-004 id moved | met |
| REQ-009 | `--extend=N` appears 8 times in each presentation and 6 in each YAML; `/doctor:deep-loop --scope=<mode>` rows at `deep-research-presentation.txt:478` and `deep-review-presentation.txt:583` | met |
| REQ-010 | both presentation step 6 rows name the question tool at `:237` / `:223`; `ASK with SINGLE prompt` absent; `A) Native (Recommended, default)` at `deep-research-presentation.txt:246` | met |
| REQ-011 | `DEPTH_WORDING` gone from `lib`; `ask the council`, `convene`, `several models` absent from `command-attach.ts` and `explicit.ts`; both aliases at `hub-router.json:34` and `ROUTER.md:63`; `autonomous research` absent; `comprehensive research` and `deep investigation` out of the research packet; `audit spec folder` and `pre-release review` out of the review packet; Gate 2 advisor line in both mode packets; hub names the doctor | met (AC-017 waived by ADR-002 for the out-of-domain replay) |
| REQ-012 | five of six prompts are `near-miss` rows; D1 is `cmd-doctor-deep-loop-plain-tune-02`, which ADR-001:56 states as the replacement | met through ADR-001, row `Superseded` |
| REQ-013 | the three deep-family `-01` holdout rows are gone and `-04` rows stand in their place; the builders read no holdout row for tuning | met |
| REQ-014 | N9 withholds at the gate | met |
| REQ-015 to REQ-020 | exercised in iterations 1 and 2, both copies agreeing on every probed row | met |
| REQ-021 | T081's recorded rerun and AC-042 carry the numbers; the 69-row pair keeps every gain, keep and stage-one command and the negatives | met |
| REQ-022 | changelog states the refusal rule (`:32`, `:482`), names the brief options and the typed `(ask)` (`:212`, `:483`), quotes 3,126 (`:759`); AC-008 `Waived` with ADR-003 | met, with the stale AC-029 cell above |
| REQ-023 to REQ-030 | exercised in iterations 1 and 2 | met |
| REQ-031 | twelve pairs compared; per-entry coverage on eight lists | met on AC-038's narrow reading, P2 above |
| REQ-032 | `refinesSameLocation` keeps a cross-file or cross-dimension refinement as its own entry and folds a same-file one (`reduce-state.cjs:995-1005`) | met |
| REQ-033 | this run is the rerun; AC-040 reads `Unmet` and T084 is open, which is the honest state until this review ends | in progress by construction |
| REQ-034 | fixture header names each typed column's layer; limitations at `implementation-summary.md:250-252`; changelog refusal and typed-on-stuck lines; packet 013 degraded-path evidence at its `:123` | met |

## Integration Evidence

- `.skilled/skills/system-deep-loop/hub-router.json` and `ROUTER.md`: both carry the two research aliases and neither carries `autonomous research`, which is the clause ADR-007 records.
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`: each of its fifteen source digests matches the current file, so the generator ran after the last edit of every source.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl`: 31 `near-miss` rows and 92 `holdout` rows; the deep-family holdouts are `-04` rows.

## Edge Cases

- **ADR-001 supersedes a clause rather than the row,** so REQ-012's D1 sentence is still in `spec.md` and contradicts the corpus. The ADR names the replacement row explicitly, so this is a recorded decision rather than drift; noted for a future REQ amendment, not raised.
- **REQ-033 cannot be met before this run ends.** Its acceptance row says so in the tree (`acceptance-criteria.md:97`), which is the honest form: the rerun is not part of the build.
- **REQ-002's "today" wording.** The requirement describes the pre-change behaviour ("where it prints `cmd=/deep:research` today"), which reads as a promise to a future reader. The baseline file carries that state, and the phrasing is a requirement-time snapshot rather than a claim about the tree now.
- **A short-form citation base.** Tasks and decisions cite `command-attach.ts:569` and `skill_advisor.py:4905` without the `lib/` or `scripts/` prefix, because the documents declare `$ADV` as their base. All 116 `path:line` citations in the packet resolve to a non-blank line once the declared base is applied; read from the packet directory instead, 42 of them would appear missing. No citation defect is raised.

## Confirmed-Clean Surfaces

- Every one of the 34 REQ rows has a producer, a decision or a measurement behind it; no row is orphaned.
- The probe pair agrees with REQ-001 to REQ-004 and REQ-008 row for row, including every keep and negative.
- The compiled command contract is current against all fifteen of its sources.
- The corpus carries the near-miss and holdout rows the requirements name, with the one ADR-001 supersession.

## Ruled Out

- **A REQ row with no implementation behind it:** ruled out; each of the 34 resolved to a file, an ADR or a stored measurement.
- **A stale compiled contract:** ruled out; all fifteen digests match.
- **A regression in the keep or negative groups:** ruled out; 34 rows match the baseline exactly.
- **A missing near-miss or holdout row:** ruled out; 31 near-miss rows and the three `-04` deep-family holdouts are present.
- **A REQ-011 clause still unmet after ADR-007:** ruled out; the two aliases are in both files, the dropped alias is absent from both, and the four removed regression phrases are gone from the two mode packets.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence` over the 87 task rows and 43 acceptance rows, checking each ticked task's stated command and count against the tree and each `Met` row's evidence cell against the line it cites.
- Reason: the second core protocol has not run, and the coverage gate needs it.
- Rotation status: 3 of 4 dimensions covered; `spec_code` closed at pass.
- Blocked/productive carry-forward: productive category "resolve the citation against its declared base, then read the line" carried this pass; the checklist pass needs the same move plus a rerun of each row's own stated command where the tree can answer it without writing.
- Required evidence: for each `Met` row and ticked task, the cited line read and the stated count recomputed.

## Verdict

Three active P2 findings and no active P0 or P1, so the iteration passes on its own findings. `spec_code` is now pass; `checklist_evidence` remains.

Review verdict: PASS
