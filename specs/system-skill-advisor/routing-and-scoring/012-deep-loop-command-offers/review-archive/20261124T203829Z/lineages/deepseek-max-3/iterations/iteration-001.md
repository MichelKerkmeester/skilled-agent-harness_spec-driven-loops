# Review Iteration 001

## Dispatcher

- Mode: review; dimension `correctness` (iteration 1 of 7).
- Loop type: review. Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
- Operator review focus: traceability, specifically finishing `spec_code` and `checklist_evidence` over the sixth fix round (REQ-023..REQ-034, AC-030..AC-042, ADR-005, ADR-006).
- How this iteration addressed the focus: it ran the inventory pass over the offer surface and checked the focus's `spec_code` slice for REQ-023..REQ-028 against the code that implements each one, and the `checklist_evidence` slice for AC-030..AC-039, AC-041 and AC-042 by resolving every `file:line` their evidence cells cite. Where a cited cell carries a count, the count was re-read from the tree rather than trusted.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (refusal vocabulary, `typedCommandIn`, `typedCommandsIn`, `attachCommand` stuck branch, tracked-command table)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (`withholdDeepLoopDoctorWithoutRun`, doctor naming leads)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (`attachTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts`, `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (degraded surfaces)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` (`VOCABULARY_PAIRS`, `PATTERN_PAIRS`, `PATTERNS_NOT_COMPARED`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (359 cases, column set)
- `acceptance-criteria.md` AC-030..AC-049 evidence cells; `spec.md` REQ-023..REQ-034.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-038's evidence freezes a vocabulary-pair count and a last-pair name the tree has moved past** -- `acceptance-criteria.md:95` (AC-038) against `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121`-`145` -- AC-038 is a `Met` row for REQ-031 whose evidence says "`VOCABULARY_PAIRS` compares 22 vocabulary pairs ..., the last of them `RUN_ASK_REFUSAL_LEADS`". The array opens at `deep-loop-offer-cases.vitest.ts:121` and closes after `145`, holding 24 entries; the last row is `['RUN_ASK_REFUSAL_VERBS', '_RUN_ASK_REFUSAL_VERB_LIST', RUN_ASK_REFUSAL_VERBS]` at `:145`, with `RUN_ASK_REFUSAL_CANCEL_LEADS` at `:144` and `RUN_ASK_REFUSAL_LEADS` at `:143`. The two rows the later fix rounds (REQ-050, REQ-023) added are exactly the two pairs the cell does not count. The behaviour the row checks is intact, and REQ-031 itself is count-free by design ("The requirement names no list count, so adding a list changes the guard, not this text"), so this is the evidence cell drifting from the tree rather than a failed requirement.
   Finding class: matrix/evidence
   Scope proof: `sed -n '121,146p'` of the test file prints the 24 pair rows end to end; the three `RUN_ASK_REFUSAL_*` rows sit at `143`-`145`, so the cell's "22" and its "last of them" cannot both be read off the current array. Only AC-038 carries the count: `rg -n '22 vocabulary pairs'` over `acceptance-criteria.md` returns that one row.
   Affected surface hints: ["acceptance-criteria.md AC-038 evidence cell", "deep-loop-offer-cases.vitest.ts VOCABULARY_PAIRS", "spec.md REQ-031"]
   Case: a closure reviewer reads AC-038's evidence to confirm the drift guard compares the whole refusal vocabulary and counts 22 pairs; the tree holds 24, so the cell understates the guard by the two lists the sixth and ninth rounds added.

2. **REQ-025's "every other caller" premise names a caller `typedCommandIn` no longer has** -- `spec.md:250` (REQ-025) against `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:251` -- REQ-025 ends "`typedCommandIn` keeps its longest-key result for every other caller". `typedCommandIn` is defined and exported at `command-attach.ts:251` and its longest-key rule is still in place (`if (found === undefined || key.length > found.length)`, `:258`), but nothing in the advisor source calls it: `grep -rn typedCommandIn .skilled/skills/system-skill-advisor --include=*.ts`, excluding `typedCommandsIn` and `/tests/`, returns the definition line alone. The prompt path moved to `typedCommandsIn` (`:274`) and `typedCommandForTop` (`:304`), which the handler and both degraded surfaces read. The stated contract is satisfied in itself; the clause that justifies keeping it as an exported entry point describes callers that are gone.
   Finding class: instance-only
   Scope proof: the grep above covers the advisor package, its handlers, its CLI and its scripts; the only other hits are four test files, which pin the function's own semantics rather than call it from a production path. `typedCommandForTop` call sites are `advisor-recommend.ts:448`, `subprocess.ts:237`, `subprocess.ts:240` and `capture-command-routing-baseline.mjs:489`.
   Affected surface hints: ["command-attach.ts typedCommandIn", "spec.md REQ-025", "advisor package public surface"]
   Case: a maintainer reads REQ-025's last clause, searches for the callers it promises, finds none, and cannot tell from the requirement whether the export is a supported API or a leftover the prompt path abandoned.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | `partial` | REQ-023..REQ-028 read against their implementations: refusal leads, cancel leads and verbs at `command-attach.ts:688`-`771` (REQ-023, REQ-050); `withholdDeepLoopDoctorWithoutRun` at `fusion.ts:1074` reading `isRunRefused` at `:1084` (REQ-024); `typedCommandForTop` at `command-attach.ts:304` and `attachTypedCommand` at `advisor-recommend.ts:442` (REQ-025); `_loop_ask_cues` at `skill_advisor.py:5381` and `namesLoopSubject` at `command-attach.ts:1147` (REQ-026); `_is_loop_workflow_request` at `skill_advisor.py:5886` and the stage-one lane cases (REQ-027); `degradedRecommendations` at `skill-advisor-cli.ts:1503` and `parseRecommendations` at `subprocess.ts:187` (REQ-028). REQ-001..REQ-022 and REQ-035..REQ-052 not yet read this iteration. |
| `checklist_evidence` | `partial` | 20 cited `file:line` anchors from AC-030..AC-039, AC-041 and AC-042 resolved by reading the cited line: the fixture rows `refusal-verb-skip` (`:129`), `run-refused-stuck-dont-run` (`:145`), `typed-two-commands-changelog` (`:125`), `typed-stuck` (`:123`), `plural-deep-reviews-use-verb` (`:269`), `how-do-run-deep-review` (`:286`), `effort-loop-too-slow` (`:293`), `no-edit-review-dont-change-anything` (`:317`); the test anchors `command-attach-guards.vitest.ts:1125` and `:919`, `command-brief-golden.vitest.ts:353`, `test_skill_advisor.py:3054`, `deep-loop-offer-cases.vitest.ts:121`, `cli-degraded-command-contract.vitest.ts:152`, `stage-one-loop-subject.vitest.ts:26`, `reduce-state.cjs:1011`, `tasks.md:163`. Every one resolves. AC-038's count clause does not, which is finding 1. `tasks.md` boxes and the remaining AC rows still to read. |

## Integration Evidence

- `attachCommand` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1583` reads the stuck branch before the mode branches, so a stuck complaint reaches `/doctor:deep-loop` and a refused or no-edit prompt gets nothing; the doctor row is `mutating: 'add-only'` at `:79`, so `withholdWritingCommandsOnNoEdit` (`fusion.ts:1096`) strips it on the same prompts the attach layer withholds it from. The two layers agree.
- `attachTypedCommand` at `advisor-recommend.ts:442` runs after the attach layer and rewrites only the top row, which is the ADR-005 ordering REQ-029 and AC-036 claim; `output.recommendations.slice(1)` at `:460` leaves every other row untouched.

## Edge Cases

- **Test execution is out of scope for this lineage.** The dispatch forbids running the repository's tooling, so every "both suites pass" clause in the AC evidence cells is read as a claim about a recorded run, verified only by resolving the cited anchor, never by re-running. This is recorded so the synthesis does not read `checklist_evidence: pass` as an execution result here.
- **`AC-040` (REQ-033) is `Unmet` in the tree** and the packet's closure statement says so (`acceptance-criteria.md:145`). REQ-033 is a requirement on a review run over this packet with traceability as its focus; this lineage is such a run, so the row cannot be adjudicated from inside the run it names. It stays `Unmet` until a review run records evidence, scope and coverage pass.
- `hub-router.json` carries both research aliases on one `keywords` line (`:34`) rather than one per line; AC-043's claim resolves, its line anchor is coarse because the vocabulary is stored as a single array per class.

## Confirmed-Clean Surfaces

- Refusal vocabulary is data, exported and compared against the Python tuples: `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts:688`), `RUN_ASK_REFUSAL_CANCEL_LEADS` (`:715`), `RUN_ASK_REFUSAL_VERBS` (`:729`), each paired in `VOCABULARY_PAIRS` and read by the grammar rows.
- The long-prompt bound is real on both sides: `LEAD_WINDOW = 400` (`command-attach.ts:783`) with `windowedPattern` at `:793`, and the Python copy reads the same lead window plus a 10,000-unit head, matching REQ-030.
- The drift guard lists the patterns it cannot compare with a reason: `PATTERNS_NOT_COMPARED` (`deep-loop-offer-cases.vitest.ts:571`) holds 13 rows, each asserted to carry a reason at `:675`, which is REQ-051's second clause.
- The shared fixture is the single source for both suites: 359 cases, and the columns `asksForLoopRun`, `stuckRun`, `writingAbout`, `typedReviewKept`, `servedReviewKept`, `typedRunsKept`, `doctorWithheld`, `servedRun`, `readOnlyRunKept` all appear, matching the `$comment` that says which layer each one pins (REQ-034's first clause).

## Ruled Out

- *Doctor withheld on a stuck run that also carries no-edit wording.* The attach layer returns `undefined` for `isNoEditRequest(prompt)` (`command-attach.ts:1599`) and the fused layer strips a non-read-only row (`fusion.ts:1106`); the doctor row is `add-only`, so both layers withhold it. No divergence.
- *A typed `/doctor:deep-loop` surviving a refusal it should not.* `DOCTOR_NAMING_LED` (`fusion.ts:1062`) reads a refusal or question lead directly before the name, and `doctorAsked` requires `!onlyMentioned` (`:1083`), so a refused naming is not served; a bare typed doctor on a stuck run is served, which is REQ-044's clause.
- *A refused run ask inside the refusal machinery matching across a conjunction.* `RUN_ASK_REFUSAL_GAP` excludes `and|then|but|or` (`command-attach.ts:761`), which is the fixture's `refusal-verb-conjunction-*` reading.

## Next Focus

- Dimension: `security`
- Focus area: trust boundaries of the advisor's degraded transports and the Python subprocess path — prompt length, command surfacing from untrusted strings, and the `trackedCommandForOwner` gate (REQ-038, REQ-028); plus the `spec_code` slice for REQ-029..REQ-034.
- Reason: iteration 2 of 7; the correctness inventory is in hand, and the degraded path is where an untrusted command string reaches a rendered row.
- Rotation status: `correctness` reviewed once; `security`, `traceability`, `maintainability` remain.
- Blocked/productive carry-forward: productive — resolving cited anchors is cheap and yields real drift (finding 1).
- Required evidence: `skill-advisor-cli.ts` degraded render path, `subprocess.ts` `withRecommendations`, and the Python gate's head bound.

Review verdict: PASS
