# Review Iteration 001

## Dispatcher

- Mode: review
- Dimension: traceability (operator focus: spec_code and checklist_evidence, sixth fix round included)
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Iteration: 1 of 7
- Focus this pass: `spec_code` for REQ-001 to REQ-022, with a first read of the sixth-round requirements (REQ-023 to REQ-034)
- Executor: this lineage process (cli-pi, deepseek-v4.1-flash-1017); no nested dispatch

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:230-280`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:84-95`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:140-184`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412-610`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:450-1135`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:450-460`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1070-1095`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888-6561`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-20`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:55-120`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112-121`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94-226`

## Findings

New findings this iteration. The operator focus is addressed by walking every REQ in `spec.md` to a producer, a test or an ADR, and by reading each sixth-round acceptance row against the tree.

### P0 Findings

None. No requirement in REQ-001 to REQ-034 is unimplemented in a way that blocks a release decision, and no security or correctness blocker surfaced in this pass.

### P1 Findings

1. **REQ-031 states a guard scope the tree does not hold, and AC-038's Met row repeats it** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:243` -- REQ-031 promises "All fifteen compared lists", "Ten lists also carry a per-entry case" and "eleven of the eighteen" refusal leads. The built guard compares twenty-two vocabulary pairs (`VOCABULARY_PAIRS` at `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80`), exercises twelve per-entry lists including `LOOP_EFFORT_CHANGE_VERBS` and `RERUN_PRONOUNS` (`:346`, `:365`), and `RUN_ASK_REFUSAL_LEADS` holds sixteen entries (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688`). AC-038 cites `tests/deep-loop-offer-cases.vitest.ts:68` for the pairs and `:83` for "the last of them the refusal-lead list"; line 68 is blank and line 83 holds the `LOOP_ARTIFACT_NOUNS` pair, so the cell does not open on the evidence it claims. The code is broader than the requirement, not narrower, yet a closure row reads `Met` on a count the tree contradicts and REQ-034's "closure docs match the built behaviour" is false for this row.
   - Finding class: `spec-drift`
   - Scope proof: both files are in the review target (`spec.md`, `acceptance-criteria.md`) and the guard is in the declared scope file list.
   - Affected surface hints: `spec.md` REQ-031, `acceptance-criteria.md` AC-038, `tests/deep-loop-offer-cases.vitest.ts`, `lib/command-attach.ts`, `scripts/skill_advisor.py`
   - Case: A reader opens REQ-031, counts fifteen pairs and ten per-entry lists, then runs the guard they describe; the guard compares twenty-two pairs and fails on lists the requirement never names.
   - Claim adjudication:
     ```json
     {"type":"traceability","claim":"REQ-031 and AC-038 describe fifteen compared pairs, ten per-entry lists and eighteen refusal leads; the tree holds twenty-two pairs, twelve per-entry lists and sixteen refusal leads.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:243","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95",".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688"],"counterevidenceSought":"Checked whether the pair count excludes non-list keys or whether a later row narrows it; no sentence in spec.md or AC-038 narrows it, and the guard asserts every entry of VOCABULARY_PAIRS.","alternativeExplanation":"The counts described an earlier revision and the ninth round widened the guard without returning to REQ-031.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If REQ-031 and AC-038 carry a qualifier that scopes the count to the lists pinning typed behavior only, this drops to P2."}
     ```

2. **Closure records promise a fixture of 285 cases while the shared fixture holds 347** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:84` -- AC-028 states "Observed 2026-11-24 on the final tree ... Python `pass=136, fail=0` with `cases=285`". The fixture now holds 347 `cases` entries, and the Python suite reads that array and prints its length (`tests/python/test_skill_advisor.py:2857`, `:2942`). AC-030 (`acceptance-criteria.md:87`), AC-037 (`:94`) and AC-042 all repeat 285; `implementation-summary.md:177` and `:179` say "285 cases"; `tasks.md:140` (T068) and `tasks.md:184` (T092) restate it. The suite numbers beside it moved too: the ninth round itself records 186 files and 3,415 passed (`tasks.md:199`), not the 184 files and 3,188 passed these rows cite as the final tree.
   - Finding class: `stale-evidence`
   - Scope proof: all cited rows are packet closure docs; the fixture and suite are named in `spec.md` Files to Change.
   - Affected surface hints: `acceptance-criteria.md` AC-028/AC-030/AC-037/AC-042, `implementation-summary.md`, `tasks.md` T068/T092, `tests/fixtures/deep-loop-offer-cases.json`, `tests/python/test_skill_advisor.py`
   - Case: A closure reviewer runs the recorded `PY` command and reads `cases=347`, then cannot tell which of the four recorded counts is the one that was actually observed.
   - Claim adjudication:
     ```json
     {"type":"traceability","claim":"Four acceptance rows, two task rows and two implementation-summary rows record the shared fixture as 285 cases and the final suite as 184 files/3,188 passed; the fixture holds 347 cases and the ninth round records 186 files/3,415 passed.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:84","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:184",".skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2857"],"counterevidenceSought":"Counted the fixture's cases array directly and re-read the loader the Python test uses; both resolve to every case object, 347, not a filtered subset.","alternativeExplanation":"The 285 figure was true at the eighth round and the ninth round's fixture rows were added after the rows were last refreshed.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"If a recorded run on this tree prints cases=285, this is P2."}
     ```

3. **Several Met evidence cells cite a line that holds unrelated code, so the cell cannot prove its claim** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:93` -- AC-036 points at `scripts/skill_advisor.py:5482` for the `typed` marker, but that line is a `_command_lead(...)` call; the marker is set at `:5745`. AC-034 (`:90`) points at `skill_advisor.py:5566` for `_is_loop_workflow_request`, which begins at `:5820`. AC-037 (`:94`) points at `command-attach.ts:641` for `LEAD_WINDOW`, declared at `:748`, and at `skill_advisor.py:5009` for `_LEAD_WINDOW`, declared at `:5181`. AC-033 (`:89`) points at `command-attach.ts:1483` for the mode-cue subject skip, which is `namesLoopSubject` at `:1102` and its call at `:1682`. AC-036 also points at `tests/typed-on-stuck-serving.vitest.ts:107` for the served-head assertion, which is at `:112`. The same offsets recur in `tasks.md:154` (T076/T087: `command-attach.ts:581` for `RUN_ASK_REFUSAL_LEADS`, actually `:688`). T092/T101 claim "every `path:line` cell opens on the line that holds its evidence"; these six do not.
   - Finding class: `stale-evidence`
   - Scope proof: every cited path is in the review target or the declared scope file list.
   - Affected surface hints: `acceptance-criteria.md` AC-033 to AC-037, `tasks.md` T076/T087/T092/T101, `lib/command-attach.ts`, `scripts/skill_advisor.py`, `tests/typed-on-stuck-serving.vitest.ts`
   - Case: A reviewer follows AC-036's Python path to confirm the typed marker before closing the packet and lands on an unrelated command-lead call, so the row proves nothing at the line it names.
   - Claim adjudication:
     ```json
     {"type":"traceability","claim":"Six or more acceptance and task evidence cells name a path:line whose content is not the claimed symbol, because later rounds inserted lines above them.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:93","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:94","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:154",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5745"],"counterevidenceSought":"Opened each cited line and searched for the claimed symbol's real declaration; for every one the claimed symbol exists elsewhere, so the behavior is present and only the citation is wrong.","alternativeExplanation":"Citations were written against 3db3085bcf0 and the later edits shifted them; the ninth round scoped its refresh to implementation-summary citations only.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"If the packet's convention allows a block-level citation whose line is a nearby anchor, this is P2 for the three cells that land inside the right block."}
     ```

### P2 Findings

1. **AC-031's recorded doctorWithheld row count no longer matches the fixture** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:88` -- The row says "26 fixture rows carry `doctorWithheld`"; the fixture holds 47 cases with that field. The behavioural claim (both refusing prompts and the plain control agree) is true in the shared fixture, so only the supporting count is stale.
   - Finding class: `stale-evidence`
   - Scope proof: packet doc and fixture are inside the target scope.
   - Affected surface hints: `acceptance-criteria.md` AC-031, `tests/fixtures/deep-loop-offer-cases.json`
   - Case: A reader counts the `doctorWithheld` rows to size the refusal coverage and gets 47, not the 26 the Met row states.

2. **AC-030's refusal-row count is one short of the fixture** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87` -- The row says `rg -c 'refusal-verb-' tests/fixtures/deep-loop-offer-cases.json` prints 11; it prints 12 on this tree.
   - Finding class: `stale-evidence`
   - Scope proof: packet doc and fixture are inside the target scope.
   - Affected surface hints: `acceptance-criteria.md` AC-030, `tests/fixtures/deep-loop-offer-cases.json`
   - Case: A closure reviewer reruns the recorded count and reads 12 where the row promises 11, so the row's own verification command fails as written.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:243`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688`, `tests/deep-loop-offer-cases.vitest.ts:80` | REQ-001 to REQ-030 each resolve to a producer, a fixture row or an ADR. REQ-031 contradicts the built guard; REQ-033 is open by design (AC-040 `Unmet`). |
| `checklist_evidence` | partial | `tasks.md:184`, `acceptance-criteria.md:84`, `acceptance-criteria.md:93` | Ticked tasks and Met rows exist for every sixth-round fix, but the counts and several line cells do not hold on this tree. |
| `skill_agent` | notApplicable | - | This pass reviewed packet docs and gate code, not a SKILL.md-to-agent contract. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror was in this pass's evidence set. |

## Integration Evidence

- Command gate producer: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1616` and `:1634` read `asksForLoopRun` before attaching any deep command.
- Stage-one lane: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` gates the passes wording on `asksForLoopRun` or `isStuckRunComplaint`.
- Fused doctor row: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074` withholds the doctor row on a refused run or fix.
- Python fallback copies: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5165`, `:5646`, `:5820`.

## Edge Cases

- REQ-033 / AC-040 is deliberately `Unmet`: the traceability rerun is this run, so the packet cannot close until this review terminates with its terminal gates passing. Recorded, not filed as a finding.
- AC-008, AC-017 and AC-019 are `Waived`/`Superseded` with ADR-003, ADR-002 and ADR-001, all of which exist (`decision-record.md:223`, `:128`, `:33`). Waivers are traced, not re-litigated.
- REQ-013's holdout rows are cited by row id only in AC-020; `command-prompts.jsonl:94` holds `cmd-deep-research-plain-holdout-04`, so the row id citation resolves.

## Confirmed-Clean Surfaces

- `command-attach.ts` and `skill_advisor.py` carry every sixth-round vocabulary list named by REQ-023, REQ-024, REQ-030 and REQ-036 to REQ-044 as an exported or named tuple (`:688`, `:897`, `:748`; `:5165`, `:5646`, `:5181`).
- `withholdDeepLoopDoctorWithoutRun` reads `isRunRefused` and the typed doctor naming, so REQ-024's refusal branch exists at the fused row (`fusion.ts:1086-1089`).
- The presentation files and both command documents carry the offer section exactly once each (`deep-research-presentation.txt:13`, `deep-review-presentation.txt:13`, `research.md:86`, `review.md:81`).
- The hub router and its control document carry `iterative research` and `multi-round research`, and carry no `autonomous research` (`hub-router.json:34`, `ROUTER.md:63`).
- REQ-009's completed-packet message names both flags (`deep-research.yaml:663`).

## Ruled Out

- "The sixth-round refusal logic is missing": ruled out. `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts:688`) builds the negation pattern (`:736`) and the fixture carries twelve refusal-verb rows, all reading `asksForLoopRun: false` where they should.
- "The typed-on-stuck exception is unrecorded": ruled out. ADR-005 (`decision-record.md:412`) records it, the fixture row carries `typedReviewKept: false` with `servedReviewKept: true` (`deep-loop-offer-cases.json:123`), and `typed-on-stuck-serving.vitest.ts:112` pins the served head.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence` for the sixth fix round -- every ticked task in `tasks.md` T065 to T101 and every `Met` row in AC-030 to AC-042, starting with the counts and cells this pass did not yet open
- Reason: the first pass mapped requirements to producers and found the closure-record drift; the task-by-task evidence trail is the other half of the operator focus
- Rotation status: traceability continues; correctness, security and maintainability remain
- Blocked/productive carry-forward: productive -- direct `path:line` reads of the cited evidence exposed every drift above
- Required evidence: the cited line of each task's verify command, and the number a recorded run actually prints

Review verdict: CONDITIONAL
