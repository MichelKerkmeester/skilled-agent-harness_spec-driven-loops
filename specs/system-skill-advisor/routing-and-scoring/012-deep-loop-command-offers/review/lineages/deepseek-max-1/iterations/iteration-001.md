# Review Iteration 001

## Dispatcher

LEAF deep-review iteration 1 of 5, lineage `deepseek-max-1`, session `fanout-deepseek-max-1-1795514074741-gl47kr`, generation 4, lineageMode `new`.
Mode review; dimension `traceability`; core protocols `spec_code` and `checklist_evidence`.
Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
Operator review focus: finish the `spec_code` and `checklist_evidence` protocols; check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

This iteration covered the first half of that focus: REQ-001 to REQ-012 against the gate, the command documents and the decision record, plus every acceptance row mapped to those requirements (AC-001 to AC-019).

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:208-234` (REQ-001 to REQ-012)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58-76` (AC-001 to AC-019)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33-140` (ADR-001 to ADR-003)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:196-314,326-369,469-481,536-770,1291-1424`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:420-500`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074-1114`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5274-5410,5459-5470`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:57-203`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:515-545`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120-166`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (row-type census)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13-33`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13-33`
- `.skilled/commands/deep/review.md:81`, `.skilled/commands/deep/research.md:86`
- `.skilled/skills/system-deep-loop/SKILL.md:20`
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (all 69 rows, read programmatically)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:1-28`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/behaviour/F6-sample-1.md:23`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **REQ-006 names a test file that does not hold the cases it describes** -- `spec.md:213` -- REQ-006 says `command-attach.vitest.ts` holds a passing case for each loop-ask clause and a passing `undefined` case for each depth word. That file holds three describe blocks (`command attach for a single routed mode`, `typed command on the leading recommendation`, `a route that waits for a mode`) and no loop-ask or depth-word case. The cases live in `command-attach-guards.vitest.ts:530-540` (depth words) and its loop-ask groups. AC-009 (`acceptance-criteria.md:66`) states the relocation in its own evidence cell -- "the loop-ask and depth-word cases live in `tests/command-attach-guards.vitest.ts`, beside the file named" -- and still reads `Met`, so the requirement's file anchor and the row that closes it disagree with the tree.
   Finding class: instance-only (wrong file anchor in one requirement clause).
   Scope proof: the claim is about where the tests live; `tests/command-attach.vitest.ts:57-203` holds no `asksForLoopRun`, `depth word` or loop-ask describe block, and `tests/command-attach-guards.vitest.ts:530-540` holds the seven depth-word cases.
   Affected surface hints: `spec.md:213`, `acceptance-criteria.md:66`, `tests/command-attach-guards.vitest.ts`, `tests/command-attach.vitest.ts`.
   Case: a reader opening `command-attach.vitest.ts` to confirm REQ-006 finds no depth-word case, and the requirement reads as unmet on its own wording even though the coverage exists one file over.

2. **Three Met rows quote a Python fixture count the tree no longer produces** -- `acceptance-criteria.md:87` -- AC-030, AC-037 and AC-042 each record that the Python suite prints `cases=203`. The suite prints `len(cases)` over `tests/fixtures/deep-loop-offer-cases.json`, and that file now holds 248 cases: 203 before commit `7b0660c9b6e` and 248 after it, with the seventh round adding 45 rows. The recorded observation therefore cannot reproduce on the tree these rows describe as final.
   Finding class: matrix/evidence (stale count in closure evidence).
   Scope proof: `node -e` over the fixture prints `cases 248` and 248 distinct ids; `git show 7b0660c9b6e^:...deep-loop-offer-cases.json` prints 203 and `git show 7b0660c9b6e:...` prints 248; the parity test prints `cases={len(cases)}` at `tests/python/test_skill_advisor.py:2912`.
   Affected surface hints: `acceptance-criteria.md:87`, `acceptance-criteria.md:94`, `acceptance-criteria.md:99`, `tests/fixtures/deep-loop-offer-cases.json`, `tasks.md:174`.
   Case: an operator reruns the Python suite after the seventh round and reads `cases=248` where three Met rows say `cases=203`, so the closure record no longer matches the tree it certifies.

3. **AC-012 is linked to REQ-007 while its criterion tests the corpus recapture** -- `acceptance-criteria.md:69` -- The row's Given/When/Then is "Given the corpus with the new rows, When the baseline is recaptured, Then `false_offer` and `false_offer_attached` ... equal the counts captured before the code change". That is the recapture gate, not REQ-007's clause about mirror sync, command references and compiled contracts. AC-011 already closes REQ-007's three clauses. As written, REQ-007 is the only requirement with two acceptance rows, one of which tests a different requirement's subject, and no row that names the corpus recapture carries REQ-021 or REQ-012.
   Finding class: instance-only (wrong requirement link on one acceptance row).
   Scope proof: `acceptance-criteria.md:68` (AC-011) names mirror sync, command references and compiled contracts; `acceptance-criteria.md:69` (AC-012) names the corpus recapture; `git log -S "Given the corpus with the new rows"` shows the row has carried the REQ-007 link since the packet was written.
   Affected surface hints: `acceptance-criteria.md:69`, `acceptance-criteria.md:68`, `spec.md:214`, `spec.md:234`.
   Case: a coverage check that groups rows by requirement counts REQ-007 twice and the recapture criterion zero times, so the traceability matrix reports coverage for the wrong requirement.

## Traceability Checks

### spec_code

- REQ-001 to REQ-004: the gain rows (V6, H1a, E3 -> `/deep:review`; H1b, E1 -> `/deep:research`), the keep rows (17 ids, all `/deep:*` with `pol=ask`) and the negative rows (R7, V3, V8, V5, R2b, R3, R3b, R6, A1, A4, A8, H6, H8, H9 with no command) all match `scratch/probes/results-after.json`, which holds 69 rows, every one `freshness: live` and `exit 0`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1]
- REQ-005: both presentation files carry `### Offer From an Advisor Brief` at line 13 with one three-option question, the `:auto` recommended option, the `:confirm` option and a no-loop option; `research.md:86` and `review.md:81` each carry a step 0 that points at it. [SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:13]
- REQ-006: the cases exist and the suite is recorded as passing; the file anchor in the requirement is wrong (finding 1). `dist/runtime/lib/command-attach.js` is newer than `lib/command-attach.ts` (10:37:44 vs 10:30:51), and all 69 probe rows read `live`.
- REQ-007: `rg -n 'ASK with SINGLE prompt' .skilled/commands/deep/assets/compiled/` prints nothing (exit 1) on the current tree, which is the compiled-contract clause; the mirror and reference checks are recorded evidence, not rerun here (see Non-Goals in the strategy).
- REQ-008: the stage-one lane reads `passesAsked = (MULTI_PASS || LOOP_COUNT || ITERATIVE_ASK) && (asksForLoopRun || isStuckRunComplaint)` at `explicit.ts:452-453`, so a pass report that already happened gives the hub no lane; probe rows V2, V4, H7 and H10 top `system-deep-loop` on `explicit_author`, and R2 tops `system-spec-kit`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452]
- REQ-009: `deep-research.yaml:663` names `--extend=N` and `--restart`; both presentation Next Steps tables carry the `--extend=N` row and the `/doctor:deep-loop --scope=<mode>` row (`deep-research-presentation.txt:477-478`, `deep-review-presentation.txt:582-583`); both YAML `next_steps` lists carry the `--extend=N` line (`deep-research.yaml:2268`, `deep-review.yaml:2534`).
- REQ-010: step 6 of both presentation files names the question tool in `.skilled/repo-rules/communication-handoff.md` §5 (`deep-research-presentation.txt:223`, `deep-review-presentation.txt:237`), Q2 marks `Autonomous (Recommended)` and Q-Exec marks `Native (Recommended, default)`.
- REQ-011: the two hub aliases are at `hub-router.json:34` and `ROUTER.md:63`, `autonomous research` is absent, ADR-007 records the drop, AC-043 owns the row, H3b now tops nothing in the probe file, and `rg -n "'convene'|'several models'|'ask the council'"` over the gate and the stage-one lane prints nothing (exit 1). The `DEPTH_WORDING` symbol the clause names was removed with its list; `tasks.md` CHK-FIX-002 records that neither `DEPTH_REQUEST` nor `DEPTH_WORDING` is left. [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:603]
- REQ-012: AC-019 is `Superseded` by ADR-001, which records that D10 reversed D6, that the corpus now holds 31 near-miss rows and that D1 became a positive doctor row. The row census confirms 31 `near-miss` rows and no row whose id carries `N7`/`N9`/`D1`/`V7`/`H6`/`A3`, which is why the ID framing is superseded rather than met.

### checklist_evidence

- All 43 acceptance rows parse; 39 `Met`, 2 `Waived`, 1 `Superseded`, 1 `Unmet`. Every `path:line` citation across `spec.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `decision-record.md` and `plan.md` resolves: 116 references, 0 missing files and 0 past-end-of-file lines.
- Every cited line for AC-001 to AC-019 was read and holds the evidence it is cited for, with three exceptions recorded above: the two AC rows that cite a superseded count, and AC-012's requirement link.

## Integration Evidence

- The prompt hook path named by the packet's probes is `scratch/probes/fresh-review-hook.txt`; lines 1, 8, 10, 12, 13 and 28 hold the refusal, question, spelling, negated-stuck, subject and typed-stuck results AC-022 to AC-027 cite.
- The served head for the typed-on-stuck prompt is `/deep:review (ask)` at `fresh-review-hook.txt:28`, which is ADR-005's exception and is checked as REQ-029 in a later iteration.

## Edge Cases

- `results-after.json` holds rows whose `top` is `null` (abstentions: R3b, R6, A1, A4, A8, H3b, N12, H4). A `null` top is a clean no-command result, not a missing row; the reader must not treat it as evidence of an error.
- `deprecated`/`Superseded` acceptance rows are counted as closed but not as `Met`; AC-019's supersession is an ADR-backed closure, not a gap.
- The `dist/` tree is gitignored and was rebuilt at 10:37; a later worktree without a build cannot reproduce REQ-006's `live` probe clause, so that clause rests on the recorded probe file.

## Confirmed-Clean Surfaces

- `command-attach.ts` gate entry points `attachCommand` (stuck-run, deferred-route, no-edit and mention guards) and `typedCommandForTop` hold the clauses REQ-015 to REQ-020 describe.
- `fusion.ts:1074-1092` `withholdDeepLoopDoctorWithoutRun` withholds the fused doctor row on refused wording and keeps it on a bare naming, matching REQ-024's TypeScript half.
- `skill_advisor.py:5343-5388` `_apply_deep_loop_offer_gate` drops run rows on a stuck complaint unless typed, and keeps the typed row, matching REQ-020's gate-layer parity.
- `explicit.ts` stage-one rule and `fusion.ts` read-only lifts are confined to their named skills; no other skill consults the loop vocabulary.

## Ruled Out

- A false command on any gain or keep probe: ruled out by the 69-row probe file, every row `live` with `exit 0`.
- A remaining `autonomous research` alias or a council-word boost in the gate: ruled out by two `rg` sweeps that print nothing.
- A broken citation path anywhere in the packet's six docs: ruled out by the 116-reference sweep (0 unresolved).
- A `DEPTH_WORDING` contradiction in REQ-011: ruled out as a finding because the packet records the symbol's removal in CHK-FIX-002 and AC-016/AC-018 test the behavioural clause directly.

## Next Focus

- Dimension: traceability
- Focus area: REQ-013 to REQ-022 against the fixture, the two gate copies and the recorded corpus; close `checklist_evidence` for AC-020 to AC-029.
- Reason: the first band is settled; the second band is where the typed-command, past-run and question clauses live.
- Rotation status: traceability 1 of 2 planned passes complete.
- Blocked/productive carry-forward: productive category "probe file read programmatically, then requirement row" carried this pass; the citation sweep is productive and should be rerun after the checklist pass.
- Required evidence: fixture row ids and fields for REQ-013 to REQ-022, Python gate lines for the typed clauses, and the recorded corpus counts.

Review verdict: PASS
