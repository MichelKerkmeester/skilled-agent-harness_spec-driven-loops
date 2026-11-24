# Review Iteration 001

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-2-1795511183570-92w0ez`, generation 1, lineageMode `new`
- Iteration 1 of 5. Dimension: correctness. Operator review focus: traceability (`spec_code` + `checklist_evidence`).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.

## Dimension

Correctness: does the deep-loop offer gate do what `spec.md` REQ-001 to REQ-003, REQ-015 to REQ-030 and ADR-005/ADR-006 say it does, and does the reducer change of REQ-032 behave as its decision record states?

The operator focus was addressed by opening the `spec_code` protocol here: every gate-behaviour claim was read in the code and then exercised through the real module, so the REQ rows this iteration touches carry evidence rather than restated prose. `checklist_evidence` was not started, and is not recorded.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:248-330` (`typedCommandIn`, `typedCommandsIn`, `typedCommandForTop`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326-450` (`LOOP_WORDING`, `ITERATIVE_VERBS`, `MULTI_PASS`, `COUNT_WORDS`, `LOOP_COUNT`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:476-618` (`DEFECT_CHECK`, `LOOP_RUN_SUBJECT`, `isStuckRunComplaint`, `RUN_ASK_NEGATED_SOURCE`, `LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:646-745` (`isPastRunRead`, `isWritingAboutTopic`, `isNoEditRequest`, `isRunRefused`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:809-900` (`namesLoopSubject`, `hasLoopAsk`, `asksForLoopRun`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:909-1000` (`LOOP_QUESTION`, `isLoopQuestion`, command decline/ask leads)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1130-1386` (`commandOnlyMentioned`, `attachCommand`, `deferredLoopCommand`, `routeNeedsMode`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5306-5348` (`_apply_deep_loop_offer_gate`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:955-995` (`normalizeFindingPath`, `sameFindingPath`, `refinesSameLocation`)
- Live module probe: `node --import <tsx> -e "require('.../lib/command-attach.ts')"` over 42 prompts taken from REQ-001 to REQ-030, ADR-005 and ADR-006, run against a review route, a research route and a deferred route.
- Live Python probe: `_apply_deep_loop_offer_gate` over nine prompts with the real `_DEEP_LOOP_RUN_ROWS` ids.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `command-attach.ts:1249-1354`, live probe output | REQ-001 to REQ-003, REQ-015 to REQ-019, REQ-023 to REQ-030 read in code and exercised; REQ-004 to REQ-014 evidence collected for iteration 3 |
| `checklist_evidence` | not run | - | deferred to the traceability iterations |

What the probe established, prompt by prompt (module `command-attach.ts`, `attachCommand('system-deep-loop', route, prompt)`):

- Refusals withhold: `don't do deep research, just answer quickly`, `never run deep research on this`, `no need to run a deep review here`, `I am not asking for a deep review, just explain the bug`, `no deep review, please; explain the bug`, `a deep review is not needed, just check the diff`, `avoid deep research; answer from memory`, `there is no need for a deep review`, `instead of a deep review, just explain the bug`, `I refuse a deep review here`, `do not even think about running a deep review`, `skip the deep review and just answer` all return no command (REQ-015, REQ-023).
- Refusal controls keep the command: `do a deep review of the parser`, `skip straight to the deep review of the parser`, `don't hesitate to run a deep review`, `don't forget to run a deep review on the parser` return `/deep:review` (REQ-015, REQ-023).
- Questions about the loop carry nothing: `how many iterations does deep research run by default?`, `how does the deep loop decide to stop?`, `what does /deep:review do?` return no command (REQ-016).
- Spelling variants keep it: `run a deep-review of the auth module` returns `/deep:review`; the curly-apostrophe research prompt returns `/deep:research` (REQ-017).
- A negated symptom is not a stuck run: `the deep research run is not stuck, run 5 more iterations` returns `/deep:research`, never `/doctor:deep-loop` (REQ-018).
- A loop name about the loop's own code, and a count that describes a subject, carry nothing: `refactor the deep research scorer`, `we need a review loop for every PR`, `several passes of the linter failed, review the config` (REQ-019, REQ-027).
- The deferred mode cue reads only asks: `run a deep loop to review the research loop config` and `run a deep loop checking the parser for bugs` both return `/deep:review` on a deferred route, where the subject skip is the `namesLoopSubject` branch at `command-attach.ts:1347` (REQ-026).
- ADR-006 holds: `deep loop: audit the payments flow` returns no command on a deferred route.
- A typed command survives a second typed command: `run /deep:review on the parser, then /create:changelog` and `/deep:review the parser and then /doctor:deep-loop` both return `/deep:review` (REQ-025).
- The gate layer reads a typed stuck complaint as the diagnosis: `my deep review run is stuck, /deep:review again` returns `/doctor:deep-loop` from `attachCommand`, which is what AC-027 says the gate layer does; ADR-005's exception lives one layer up (REQ-020, REQ-029).
- Depth words alone score nothing: `do a thorough review of the auth module`, `find out everything you can about the payments retry logic` return no command, and the council words `ask the council about …` and `convene several models to decide …` return none either (REQ-002, REQ-011).
- The Python copy agrees at the gate layer: the three typed non-stuck prompts drop the run row, `run /deep:review on the parser` keeps it with `typed: true`, the typed stuck complaint keeps the typed run row, the plain stuck complaint keeps only the doctor row, and the run-refusing stuck complaint drops the doctor row (REQ-020, REQ-024, REQ-029).
- A 400-repetition `do not run /deep:review. ` prompt (about 11,000 characters) stays withheld (REQ-030).

Reducer path (REQ-032): `refinesSameLocation` folds a refinement only when the normalized paths match and the declared dimensions do not differ, and `normalizeFindingPath` strips a `:line` suffix and resolves an absolute path against the repository root, so a bare filename cannot stand in for a same-named file elsewhere. The stated behaviour ("a refinement at the same file still folds into its target") follows from the two early `return false` branches.

## Integration Evidence

- Command documents: `.skilled/commands/deep/review.md:81` and `.skilled/commands/deep/research.md:86` each carry the step-0 pointer to the offer section (REQ-005, AC-007).
- Presentation assets: `.skilled/commands/deep/assets/deep-research-presentation.txt:13` holds `### Offer From an Advisor Brief` (REQ-005, AC-006).
- Changelog: `.skilled/changelog/skilled/v4.2.0.0.md:482` states the stuck-run/refusal rule as built (REQ-022, REQ-034).

## Edge Cases

- A prompt that both opens the gate and names the command being attached: `run /deep:review on the parser` reads `asksForLoopRun: false` because the typed name is the ask, and `attachCommand` still returns the command through the `typedCommandsIn` branch at `command-attach.ts:1351`. Both observations are expected, not a contradiction: `asksForLoopRun` answers "does the wording ask for a loop", the attach path additionally accepts a typed command.
- A deferred route with no mode cue, and one with both cues, return no command (`deferredLoopCommand` returns `undefined` unless exactly one mode is cued). Recorded as a deliberate no-command edge, matching spec.md Edge Cases.
- The included `deep-review.md` doc path (`see (/deep:review.md) for the flags`) names the command without typing it; both copies drop it, which is REQ-020's doc-path case.

## Confirmed-Clean Surfaces

- `asksForLoopRun` and its six exception predicates (`command-attach.ts:893-900`), exercised over 42 prompts.
- `attachCommand`'s deep-loop branch, its stuck-run branch, and `deferredLoopCommand` (`command-attach.ts:1252-1383`).
- `commandOnlyMentioned`'s bounded-window lead reads and its command-policy branch (`command-attach.ts:1189-1235`).
- The Python gate `_apply_deep_loop_offer_gate` (`skill_advisor.py:5306-5346`), exercised over nine prompts with the real row ids.
- `refinesSameLocation` and `normalizeFindingPath` (`reduce-state.cjs:966-1001`).

## Ruled Out

- A gate bug in the depth-word negative path: ruled out. `R7` and the no-gain prompts return no command, and no depth or council word opens the gate (`command-attach.ts:326-450`, live probe).
- A TypeScript/Python divergence in the ask gate for REQ-020's four prompts: ruled out at the gate layer by the live Python probe; the disagreeing layer is the served head, which ADR-005 records.
- A quadratic scan left in the lead reads: ruled out for the tested prompt (400 repetitions returned withheld) and by reading `endsBefore`, which slices a 400-character window rather than the whole prefix (`command-attach.ts:592-612`).
- A regression in REQ-003's keep group: ruled out for the sampled prompts (`run a deep-review …`, curly-apostrophe research loop, `my deep research run is stuck` keeps the doctor row).

## Next Focus

- Dimension: security
- Focus area: the untrusted-prompt boundary of the gate (a prompt is data; the gate must not execute or trust it), the `run` policy never starting a deep command, and the no-secret claim behind CHK-030/CHK-031.
- Reason: canonical risk order after correctness; `spec.md` NFR-S01 and NFR-S02 and `tasks.md` CHK-030 to CHK-032 are the claims to check.
- Rotation status: first rotation; correctness now covered.
- Blocked/productive carry-forward: productive category is "read the producer, then exercise it live"; both core protocols still due.
- Required evidence: `command-attach.ts` command policy source, the fixture's policy column, and a grep over the packet's changed files for secret material.

## Verdict

No active P0, no active P1 and no active P2. Dimension correctness is clean on the surfaces read and exercised. The run continues under `stopPolicy: max-iterations` with three dimensions and both core protocols still open.

Review verdict: PASS
