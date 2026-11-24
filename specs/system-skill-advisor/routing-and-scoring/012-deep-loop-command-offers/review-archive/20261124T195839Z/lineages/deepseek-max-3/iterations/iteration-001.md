# Review Iteration 001 — correctness (with the operator traceability focus)

## Dispatcher

- Mode: `review`; target agent: `@deep-review` (LEAF, single iteration).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Lineage: sessionId `fanout-deepseek-max-3-1795546920757-7pyjry`, generation 1, lineageMode `new`, executor cli-pi (deepseek-v4.1-flash-1017).
- Setup bindings:

```
BINDING: target=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers
BINDING: maxIterations=7
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers
```

- Review focus for this iteration: the operator's traceability focus — finish `spec_code` for the sixth fix round (REQ-023 to REQ-034) and check each claim against the code that implements it. This iteration reads the gate, its Python fallback, the shared fixture and the closure records, then reports how the focus was addressed under `## Traceability Checks`.
- Sources include `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-3/review-scope-files.txt` (54 paths) and no `steer.md` (absent at this iteration).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1132` (`asksForLoopRun`), `:1475` (`commandOnlyMentioned`), `:1537` (`attachCommand`), `:1628` (`deferredLoopCommand`), `:1648` (`routedLoopMode`), `:1667` (`loopAskCues`), `:462` (`SMALL_EDIT_WORDING`), `:850` (`SMALL_EDIT_REQUEST`), `:1276` (`COMMAND_DECLINE_LEADS`), `:1340` (`COMMAND_ASK_LEADS`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442` (`attachTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`), `:4639` (`_RUN_ASK_REFUSAL_LEAD_LIST`), `:5181` (`_LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:457` (research loop lane), `:464` (review loop lane)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129` (`refusal-verb-skip`), `:138` (`run-refused-stuck-dont-run`), `:148` (`no-edit-stuck`), `:262` (`plural-deep-loops`), `:310` (`no-edit-review-dont-change-anything`), `:318` (`plural-deep-loops-served`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` (`VOCABULARY_PAIRS`), `:497` (mode vocabulary)
- `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js` (built gate, used for the fixture-parity probe)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:228` (P1 heading), `:255` (REQ-031), `:257` (REQ-033)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97` (AC-040)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:166` (T084), `:215` (all-tasks criterion), `:275` (CHK-020)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:331` (Verification Summary P0 row)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:508` (ADR-006)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review-archive/20261124T190150Z/review-report.md:71`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **REQ-033's coverage rerun is a required P1 that is neither met nor deferred** -- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:257 -- `spec.md:228` heads the P1 table `P1 - Required (complete OR user-approved deferral)`. REQ-033 requires a deep-review rerun that finishes `spec_code` and `checklist_evidence` with the terminal evidence, scope and coverage gates passing. The tree records it open on every surface that closes it: AC-040 reads `Unmet` (`acceptance-criteria.md:97`), T084 is `[ ]` (`tasks.md:166`), the "All tasks marked `[x]`" criterion is `[ ]` (`tasks.md:215`), CHK-020 `[P0]` is `[ ]` (`tasks.md:275`), and the Verification Summary reads `P0 Items 12 | 11/12` (`implementation-summary.md:331`). No record defers it: `rg -n 'REQ-033' decision-record.md` prints no line, so no ADR carries the user approval the P1 rule requires. The implementation is not lying about this — the boxes are honest — but the packet's own priority contract is violated while the row stays required.
   Finding class: `closure-record`
   Scope proof: read `spec.md:228` and `spec.md:257` in the same file; the P1 table spans `spec.md:228-273`, and REQ-033 sits in it.
   Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md`, `acceptance-criteria.md` AC-040, `tasks.md` T084/CHK-020, `decision-record.md`
   Case: an operator reads the packet as ready to close; a required P1 requirement has no evidence, no waiver and no recorded approval.

```json
{"type":"traceability","claim":"REQ-033 is a required P1 whose obligation is unmet and unwaived","evidenceRefs":["spec.md:228","spec.md:257","acceptance-criteria.md:97","tasks.md:166","tasks.md:275","implementation-summary.md:331"],"counterevidenceSought":"Searched decision-record.md for a REQ-033/AC-040/T084 waiver (rg -n 'REQ-033' decision-record.md: no hit); considered that this running lineage is exactly the rerun REQ-033 asks for","alternativeExplanation":"The open boxes are an honest work-in-progress signal and the rerun in flight is meant to close them, so the defect is bookkeeping rather than a false claim","finalSeverity":"P1","confidence":"high","downgradeTrigger":"AC-040 reads Met with a rerun report whose terminal gates read evidence/scope/coverage pass, or an ADR waives REQ-033 with the operator's approval"}
```

### P2 Findings

1. **AC-040's evidence cell cites a review report the packet's restart archived** -- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97 -- The cell's Evidence tail is ``Evidence: `review/review-report.md:71` (`Per-lineage verdicts`)``, and its prose says "The live `review/review-report.md` (generation 6) still reads FAIL on its coverage gate". The live review tree holds no `review-report.md` at all (`review/` carries `deep-review-config.json`, `fanout-*`, `lineages/`, `observability-events.jsonl`, `orchestration-status.log`); the generation 6 report sits at `review-archive/20261124T190150Z/review-report.md`, whose line 71 reads `- **Per-lineage verdicts:** FAIL in all three, on coverage only.` Both the path and the word "live" are stale after the 19:01:50 restart. A sweep of all 49 `Evidence:` citations in `acceptance-criteria.md` resolved every other one against the tree; this was the only miss.
   Finding class: `closure-record`
   Scope proof: `acceptance-criteria.md:97` is the AC-040 row; the citation sweep parsed every `Evidence: \`path:line\` (\`token\`)` cell in the file (49 cells) and checked each path, line bound and token against the tree.
   Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md`, `review-archive/20261124T190150Z/review-report.md`
   Case: an operator follows AC-040's citation to `review/review-report.md:71` and finds no file, because the restart moved it.

2. **REQ-031's "every word list" promise is wider than the drift guard it names** -- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:255 -- `command-attach.ts` exports 23 `readonly string[]` word lists; `VOCABULARY_PAIRS` (`tests/deep-loop-offer-cases.vitest.ts:80`) holds 22 rows and omits `SMALL_EDIT_WORDING` (`command-attach.ts:462`), which builds `SMALL_EDIT_REQUEST` at `command-attach.ts:850`. `skill_advisor.py` carries no small-edit tuple at all. REQ-031 states "every pair is a row of `VOCABULARY_PAIRS` … and a one-sided edit of any list fails that test", and AC-038 repeats it as "Given every exported word list … it fails on a list whose Python copy differs". A one-sided edit of `SMALL_EDIT_WORDING` therefore fails no drift test. The two other unpaired exports (`COMMAND_DECLINE_LEADS` at `:1276`, `COMMAND_ASK_LEADS` at `:1340`) are derived from compared flat lists (`COMMAND_DECLINE_LEAD_WORDS` at `:1272`, `COMMAND_ASK_LEAD_WORDS` at `:1336`), so they are correctly out of scope; `SMALL_EDIT_WORDING` is not derived from anything compared.
   Finding class: `instance-only`
   Scope proof: listed every `export const <NAME>: readonly string[]` in `command-attach.ts` (23) and every `VOCABULARY_PAIRS` row in the test (22), then diffed the two names; `SMALL_EDIT_WORDING` is the single missing name that is not a derived aggregate.
   Affected surface hints: `spec.md` REQ-031, `acceptance-criteria.md` AC-038, `tests/deep-loop-offer-cases.vitest.ts`, `lib/command-attach.ts`, `scripts/skill_advisor.py`
   Case: adding a correction word such as `glitch` to `SMALL_EDIT_WORDING` alone changes the small-edit gate and leaves every guard green.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | REQ-023 to REQ-031 read against the gate and the built probe this iteration; REQ-032 to REQ-034 deferred to the traceability pass |

- REQ-023 (refusal verbs, both copies): `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts:688`) and `_RUN_ASK_REFUSAL_LEAD_LIST` (`skill_advisor.py:4639`) both carry the six verbs; both are rows of `VOCABULARY_PAIRS` (`tests/deep-loop-offer-cases.vitest.ts:80`). The built gate returns no command for the six refusal prompts and `/deep:review` for the three controls; the fixture rows are `refusal-verb-skip` to `refusal-verb-refused-to` (`tests/fixtures/deep-loop-offer-cases.json:129`). Confirmed.
- REQ-024 (run-refusing stuck complaint): the stuck branch of `attachCommand` (`command-attach.ts:1537`) withholds on `isRunRefused`; the fixture rows `run-refused-stuck-dont-run` / `run-refused-stuck-no-fix` carry `doctorWithheld: true` (`tests/fixtures/deep-loop-offer-cases.json:138`) and the control keeps the doctor. Confirmed by probe.
- REQ-025 (a typed command survives a second typed command): `typedCommandsIn` + `typedCommandForTop` (`command-attach.ts:274`, `:304`) keep `/deep:review` for "run /deep:review on the parser, then /create:changelog" on a review route and on the served head. Confirmed by probe.
- REQ-026/REQ-042 (deferred and routed mode cue): `loopAskCues` (`command-attach.ts:1667`) blanks a subject-read `NAMED_LOOP_MODE` match and `routedLoopMode` (`:1648`) runs the same read on the routed single-target branch. Probed: "run a deep loop to review the research loop config" returns `/deep:review` on both a research route and a deferred route. Confirmed.
- REQ-027 (stage-one subject reading): `explicit.ts:457` and `:464` gate both loop lanes on a pass ask; `tests/scorer/stage-one-loop-subject.vitest.ts:26` pins the two prompts AC-034 names. Confirmed by read.
- REQ-028/REQ-029 (degraded path and typed-on-stuck): `attachTypedCommand` (`handlers/advisor-recommend.ts:442`) overrides the doctor with the typed run; the fixture's `typed-stuck` row (`tests/fixtures/deep-loop-offer-cases.json:123`) carries both served columns. Confirmed by read; the served head itself was not executed.
- REQ-030 (bounded scans): `LEAD_WINDOW = 400` (`command-attach.ts:748`) with `endsBefore` (`:757`) and the Python `_LEAD_WINDOW = 400` (`skill_advisor.py:5181`) with `_advisor_prompt_head` (`:888`) cutting at 10,000 UTF-16 units. Confirmed by read; the 96,000-character timing itself was not re-run.
- REQ-031 (drift guard): 22 pairs read; one exported list unpaired — see P2 finding 2.
- REQ-033 (coverage rerun): open — see P1 finding 1.
- Fixture-to-built parity probe (supports REQ-006, REQ-029, REQ-031, REQ-035, REQ-040, REQ-047): all 347 rows evaluated against the built `dist/runtime/lib/command-attach.js`. Zero disagreements on `asksForLoopRun`, `stuckRun`, `writingAbout`, `doctorWithheld`, `servedRun`, `typedReviewKept`, `typedRunsKept` and `readOnlyRunKept`.

## Integration Evidence

- Fixture consumer 1: `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` reads the columns through `VOCABULARY_PAIRS` / `FIXTURE`.
- Fixture consumer 2: `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` `test_deep_loop_offer_gate_parity` reads the same file; the two suites are named in REQ-006 as the drift guard between the native gate and the fallback.
- Served-head bridge: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442` (`attachTypedCommand`) is the step AC-036 names between `attachCommand` and the served row.

## Edge Cases

- Iteration number: dispatch is iteration 1 and the JSONL-derived count was 0 before this pass, so they agree.
- The packet's closure records name `review/review-report.md`, a path this lineage's own synthesis will create. The citation is therefore stale-but-recoverable rather than fabricated; it is still reported because it does not resolve in the reviewed tree.
- `SMALL_EDIT_WORDING` has no Python counterpart, so the P2 finding cannot be closed by adding a `VOCABULARY_PAIRS` row alone; either the fallback gains the list or REQ-031 narrows to the deep-loop lists.
- Three of the twenty-three exported lists are unpaired, and two of them are derived aggregates. The finding names only the one that is an independent vocabulary.

## Confirmed-Clean Surfaces

- Fixture columns vs the built gate: 347/347 rows agree on the eight audited columns (probe run against `dist/runtime/lib/command-attach.js`).
- `acceptance-criteria.md` evidence sweep: 49 `Evidence:` citations, 48 resolve with their token on the named line; the single miss is P2 finding 1.
- Verification Summary arithmetic: 12 P0 rows (11 ticked, CHK-020 open), 13 P1 rows (all ticked), 1 P2 row (ticked) — exactly what `implementation-summary.md:331-333` claims, and CHK-001's 48 REQs match `spec.md`.
- ADR-006's claimed fixture row exists (`tests/fixtures/deep-loop-offer-cases.json:178`, `bare-loop-name`, `asksForLoopRun: false`) and the D2 bullet names it (`spec.md:43`).

## Ruled Out

- "The gate offers a run for the mode-free plural ask": `attachCommand` on a deferred route returns nothing for "run two deep loops on the cache layer" (probe), and the fixture row `plural-deep-loops-served` reads `servedRun: none` (`tests/fixtures/deep-loop-offer-cases.json:318`). ADR-008's amendment and the code agree.
- "The no-edit guard wrongly withholds the doctor command on a stuck run": the behaviour is intended and pinned (`tests/fixtures/deep-loop-offer-cases.json:148`, `no-edit-stuck`, `doctorWithheld: true`), and the fixture header states the no-edit withholds for the doctor row. Not a defect.
- "AC-030's refusal count drifts from REQ-023": the fixture holds twelve `refusal-verb-*` rows — six named refusals, `refusal-verb-refused-to`, three keep controls and two conjunction controls — and the AC-030 verification cell counts exactly those seven/three/two. The "six" in the Given clause is narrower than the seven the verification counts, but the row is `Met` on the wider set and no claim is false.

## Next Focus

- Dimension: security
- Focus area: the degraded brief and the Python subprocess path as a trust boundary, carrying the operator traceability focus into REQ-028 and REQ-038 (typed row rendering, the tracked-command table, and what the fallback may print).
- Reason: risk order puts security second, and the sixth-round REQ-028/REQ-038 pair is the only place where a string the caller supplies reaches a rendered brief.
- Rotation status: correctness complete (CONDITIONAL, P1 open); security, traceability and maintainability remain.
- Blocked / productive carry-forward: nothing blocked. The fixture-to-built probe method is productive and will be reused for the degraded-render path.
- Required evidence: `skill-advisor-cli.ts` (`trackedCommandForOwner`, `degradedRecommendations`), `subprocess.ts`, `render.ts`, the two typed-column tests, and the REQ/AC rows that claim them.

Review verdict: CONDITIONAL
