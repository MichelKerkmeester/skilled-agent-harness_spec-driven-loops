# Review Iteration 001 — correctness

- Run: `fanout-deepseek-max-3-1795511183570-92w0ez`, lineage `deepseek-max-3`, generation 3, mode `new`
- Iteration: 1 of 5 (stop policy `max-iterations`; convergence is telemetry only)
- Dimension: correctness
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Operator review focus (covered in addition to the dimension): traceability — finish `spec_code` and `checklist_evidence`; check every REQ against the code or decision that records it, and every ticked task and `Met` row against evidence that really exists, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).
- How this iteration addressed the focus: it read the sixth-round gate predicates at the exact lines the acceptance rows cite (`RUN_ASK_NEGATED_SOURCE`, `RUN_REFUSED`, `typedCommandsIn`, `DEFECT_CHECK`, `LEAD_WINDOW`, the Python refusal and long-prompt copies), and it checked one closure-doc claim against the code and the packet's own test. It records the first `spec_code` result; `checklist_evidence` starts in iteration 4.

## Dispatcher

Loaded and executed inline as the `@deep-review` LEAF agent for lineage `deepseek-max-3` of a detached fan-out. No nested dispatch was used.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240-330` (`typedCommandIn`, `typedCommandsIn`, `typedCommandForTop`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:520-620` (`isStuckRunComplaint`, negation leads, `LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:660-1010` (`isRunRefused`, `namesLoopSubject`, `hasLoopAsk`, `asksForLoopRun`, `commandOnlyMentioned` head)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1253-1400` (`attachCommand` stuck branch, typed gate, `deferredLoopCommand`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4839-4996` (`is_stuck_run_complaint`, `asks_for_loop_run`, `advisor_prompt_head`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5265-5360` (`_RUN_REFUSED_RE`, `_RUN_ASK_NEGATED_RE`, `_apply_deep_loop_offer_gate`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074-1092` (`withholdDeepLoopDoctorWithoutRun`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:447-480` (`passesAsked`, loop lanes)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428-449` (`attachTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1490-1565` (`degradedRecommendations` typed marker)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (203 cases; typed, doctor and refusal columns)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2919-3000` (fallback, doctor and typed serving tests)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:55-235` (vocabulary pairs, per-entry cases, fused doctor row)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:219-248` (limitations)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:56-99` (AC-030 to AC-042)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Implementation-summary limitation 8 states the opposite of the built Python fallback** — `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:247` — the limitation says "The Python fallback offers a deep-loop command only when the prompt types one. The fallback keeps the run row a typed prompt earned and drops the rest", and names "run a deep review on the parser" and "do 3 rounds of review on the scheduler" as serving `system-deep-loop` with no command through the fallback. The gate the fallback serves with keeps an untyped run ask: `_apply_deep_loop_offer_gate` drops a run row only when `(stuck and not typed_here) or (not typed_here and not run_asked)` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5348]`, and `run_asked = asks_for_loop_run(prompt_lower)` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5319]`. The packet's own passing Python test asserts the opposite of the limitation: it asks `analyze_request("run a deep review on the parser")` for a `command-spec-kit-deep-review` row and requires it to exist and be unmarked `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2988]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2994]`, and a sibling test requires a counted ask ("run 5 iterations of deep research on vector indexes") to keep its row `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2927]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2932]`. The shared fixture also pins "run a deep review on the parser" as `asksForLoopRun: true` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:117]`. A reader of the closure record is told the daemon-down fallback withholds commands for ordinary run asks when it in fact offers them.
   Finding class: incorrect-documentation (behaviour claim)
   Scope proof: the claim, the gate it describes and the test that pins the behaviour are all inside the reviewed scope files (`implementation-summary.md`, `scripts/skill_advisor.py`, `tests/python/test_skill_advisor.py`, `tests/fixtures/deep-loop-offer-cases.json`).
   Affected surface hints: `implementation-summary.md` closure record; any operator deciding whether the Python fallback is degraded enough to need a fix; REQ-034's "closure docs match the built behaviour" class.
   Case: an operator reads limitation 8 to decide whether a daemon-down fallback needs remediation for untyped run asks; the record says those asks get no command, while `_apply_deep_loop_offer_gate` keeps the row whenever `asks_for_loop_run` is true.
   ```json
   {"type":"claim_adjudication","claim":"implementation-summary limitation 8 states that the Python fallback offers a deep-loop command only when the prompt types one, including for 'run a deep review on the parser'","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:247",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5319",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5348",".skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2988",".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:117"],"counterevidenceSought":"searched for a second gate path that would drop the row after `_apply_deep_loop_offer_gate`, and for a narrower reading in which limitation 8 describes only the CLI `degradedRecommendations` path","alternativeExplanation":"the limitation may describe only the CLI degraded path (degradedRecommendations, which attaches only a typed command), but its stated clause 'offers a deep-loop command only when the prompt types one' and its named fallback heads describe the Python gate, which is the served fallback","finalSeverity":"P1","confidence":"high","downgradeTrigger":"if the packet owner narrows limitation 8 to the CLI degraded path and removes the Python-fallback examples, the claim becomes true and the finding drops to P2 wording"}
   ```

### P2 Findings

2. **The refusal-vocabulary parity guard does not cover `RUN_ASK_NEGATED_SOURCE`** — `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62` — REQ-031 requires that "the two copies of any list differ" fails a test, and the guard compares eleven pairs `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62]`. The refusal leads are two hand-kept pattern strings, `RUN_ASK_NEGATED_SOURCE` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581]` and `_RUN_ASK_NEGATED_RE` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4868]`, and no pair compares them, so a lead added to the TypeScript string alone passes every vocabulary test unless a fixture case happens to use the new word. The two copies are currently in step (skip guard, avoid, instead of, rather than, refuse, even-think are present on both sides), so this is a guard-coverage gap rather than present drift.
   Finding class: missing-test-coverage
   Scope proof: both pattern sources and the guard that omits them are reviewed scope files; the gap is provable by reading the pair list and the two patterns.
   Affected surface hints: the deep-loop refusal gate on both runtimes; future edits to refusal vocabulary.
   Case: a developer adds "no interest in" to `RUN_ASK_NEGATED_SOURCE` only; the vocabulary guard still passes, and the Python fallback starts offering a command the native gate withholds until a fixture row happens to expose it.
   ```json
   {"type":"claim_adjudication","claim":"no drift guard compares the refusal-lead vocabulary between command-attach.ts and skill_advisor.py","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:62",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4868"],"counterevidenceSought":"looked for a per-entry fixture requirement that would fail on an unadded refusal verb, and for a separate parity test","alternativeExplanation":"the refusal lead is a pattern rather than a word list, so a pair-based guard may be impossible without restructuring; REQ-031 names five named lists and does not name this one","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"if REQ-031 is read as covering only the five named lists, this is hardening rather than a requirement gap"}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence | Note |
|----------|-------|--------|----------|------|
| `spec_code` | core | partial | `command-attach.ts:581`, `command-attach.ts:738`, `command-attach.ts:1347`, `skill_advisor.py:4868`, `skill_advisor.py:5271` | REQ-023, REQ-024, REQ-025 and REQ-026 code predicates read at the cited lines and present on both copies. The REQ-027 to REQ-034 sweep continues in iteration 3, and `checklist_evidence` runs in iteration 4. |
| `checklist_evidence` | core | not run | - | Planned for iteration 4. |

A `partial` result is recorded rather than `pass` because the focus commits this run to the full REQ sweep; only REQ-023 to REQ-026 were checked here.

## Integration Evidence

- Deep-loop gate surface: `attachCommand` is the single attach point for `/deep:review` and `/deep:research` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1253]`; the served handler applies `attachTypedCommand` after it `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428]`.
- Fused row surface: `withholdDeepLoopDoctorWithoutRun` runs inside fusion `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1487]` and withholds on a refused run `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1084]`.
- Fallback surface: `_apply_deep_loop_offer_gate` is called on the served head `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:6166]`.

## Edge Cases

- **Ambiguous ownership of limitation 8's layer.** The claim could be read as the CLI degraded path rather than the Python gate. Resolved by keeping the P1 on the sentence as written (it names fallback heads for Python-only prompts) and naming the narrowing that would drop it to P2 in `downgradeTrigger`.
- **Unverifiable counts.** The suite counts in AC-028 and AC-042 (184 files, 3,029 passed; `pass=136`) cannot be re-run inside this lineage's write surface, so they are treated as recorded observations checked against their cited lines, not as re-verified facts.
- **Line-offset citations.** `typedCommandIn` is cited as `command-attach.ts:250` while the export begins at `:251`. Treated as a one-line offset with no evidentiary effect; not reported.

## Confirmed-Clean Surfaces

- `typedCommandsIn` returns every typed command in reading order with one key per start index, and `typedCommandIn` still returns the longest key `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:251]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:274]`.
- The deep gate reads the typed list, not `typedCommandIn`, so a second typed command no longer hides the first `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1319]`.
- `DEFECT_CHECK` reads the -ing forms and the deferred cue blanks a loop name that `namesLoopSubject` reads as the subject `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:480]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1347]`.
- The stuck branch honours a typed doctor, a refused run and a mention-only naming, then answers the diagnosis `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1262]`.
- The Python refusal vocabulary carries the same leads as the TypeScript source, including the "skip … to" exception `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4868]`.
- Fixture evidence columns match their stated counts: 203 cases, 26 `doctorWithheld` rows, 11 `refusal-verb-` ids, 5 `typedReviewKept`/`servedReviewKept` pairs and 4 `typedRunsKept` rows `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:117]`.
- The Python long-prompt head counts UTF-16 code units the way the native schema does, and caps at the same 10,000 units `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]`.

## Ruled Out

- **"A second typed command hides the first" (REQ-025 regression).** Ruled out: the deep gate reads `typedCommandsIn(prompt).includes(...)` and the served head walks the same ordered list `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1320]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:305]`.
- **"The refusal lead also swallows the idiom controls" ("don't forget/hesitate to run a deep review").** Ruled out: the lead allows at most two words before the loop name, and both idioms place four `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581]`; the fixture pins both as asks `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:136]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:137]`.
- **"A refusing stuck complaint still gets the fused doctor row."** Ruled out: `doctorRefused` reads `isRunRefused` before the row survives `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1084]`, and the fixture pins the withheld rows `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138]`.
- **"The stage-one lane still boosts a past-run pass count."** Ruled out: `passesAsked` requires `asksForLoopRun` or `isStuckRunComplaint` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454]`.

## Next Focus

- Dimension: security
- Focus area: trust boundary and input handling on the review gate: the 10,000-unit head, the 400-character lead window, regex backtracking on adversarial prompts, command-name injection through the prompt, and the subprocess/degraded path's handling of a prompt-supplied command string.
- Reason: iteration 1 closed the functional reading of the sixth-round predicates; the remaining risk on this surface is input-shaped (long prompts, crafted command names) rather than semantic.
- Rotation status: correctness reviewed (PASS with advisories); security, traceability and maintainability remain.
- Blocked/productive carry-forward: none blocked. Productive: reading the cited line before the claim it supports.
- Required evidence: a `file:line` for each security claim; the 10,000-unit and 400-character windows; the command-naming boundary regex; the degraded path's command carry.

Review verdict: CONDITIONAL
