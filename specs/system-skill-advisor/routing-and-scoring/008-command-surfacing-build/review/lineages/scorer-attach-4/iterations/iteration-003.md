# Review Iteration 003

## Dispatcher

- Run: `fanout-scorer-attach-4-1794669272137-9v23rz` (lineage `scorer-attach-4`, pass four, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: traceability
- Review focus addressed: the operator focus asks for docs that disagree with code and for holdout hygiene. This iteration compares every shared-doc claim that describes the changed attach/handler/scorer code with the code and the changed tests, checks the phase 020 checklist evidence against the changed requirements, and records the two severity corrections that the packet's own accepted limits require. Budget profile: `verify` (11-13 calls), used 12.
- Prior state: iteration 1 three P1s, iteration 2 one P2; two of the three P1s are corrected here to P2 after reading the packet's accepted limits.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23-47,60-69` (command attach and recommendation contract)
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:1-70` (meaning anchor and test inventory)
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:25-35` (weak cue and handoff)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:44-56` (weak-cue constant)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1147-1180,1588-1618` (weak-cue line and call order)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:472-484` (head command rule)
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts:155-193` (head/partner test)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:128-482` (case count)
- Packet docs: `020-command-offer-fit-guards/spec.md:67,122,181,184`, `acceptance-criteria.md:56-64`, `tasks.md:74-98` (accepted limits and checklist evidence)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new this iteration. `SA4-P1-002` from iteration 1 remains active; `SA4-P1-001` and `SA4-P1-003` are downgraded below after the packet's accepted limits were read.

### P2 Findings

1. **The recommend feature doc still says a hub suppresses a command its own command row already offers** -- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:39` -- The sentence says "A hub also leaves `command` off when the same command already ranks in the result through its own command row ... so one command never takes two slots." The changed handler keeps the command on the head row whichever request shape the caller asked for (`handlers/advisor-recommend.ts:477-478`, `|| index === 0`), and the changed test asserts the head carries the command while the `create:agent` row remains in the list (`tests/handlers/advisor-recommend-compiled-route-option.vitest.ts:186-192`). [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:39]
   Finding class: doc_code_drift
   Scope proof: the doc is the shared feature-catalog page for the changed handler, and the changed test is in the declared scope.
   Affected surface hints: head/partner command rendering, compiled-route enrichment, operator docs.
   Case: the tune corpus row `cmd-create-agent-plain-tune-01` puts `sk-doc` first and `create:agent` later; the changed test expects `everyRow[0].command === '/create:agent'` and still finds the `create:agent` row, so the same command now occupies two slots.
2. **The meaning-anchor feature doc still reports the old test count** -- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:65` -- The table says the file holds "17 cases: cosine bar, margin, stand-in refusal, eligibility and ranking rule." The file now has 28 `it(` declarations, the two new uncertainty cases and the six new withhold cases among them. [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:65]
   Finding class: doc_code_drift
   Scope proof: the doc is the shared feature-catalog page for the changed scorer and names the changed test file.
   Affected surface hints: test inventory, operator docs, traceability evidence.
   Case: `grep -c 'it(' tests/command-meaning-anchor.vitest.ts` prints 28; the doc says 17. The count was 18 at the pass-three base, so the change added 10 cases without updating the sentence.
3. **The phase 020 requirement still states a weak-cue bar of 10 while the accepted implementation uses 9** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:54` -- `REQ-007` and the mechanism table say "a weak cue needs the score 10" and "hands off only at ranker score 10 or more" (`020-command-offer-fit-guards/spec.md:122,184`). The accepted task `T025` chose 9 so the committed tune row `doctor-b-helper-handoff-01` at 9.51 keeps its command; `AC-007` records the bar of 9. The code follows the task (`DOCTOR_HELPER_WEAK_CUE_MIN_SCORE = 9`, applied at `fusion.ts:1173`), so the spec text is the stale side. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:54]
   Finding class: spec_code_drift
   Scope proof: the constant is in the declared scorer scope; the spec and acceptance criteria are the packet docs that describe it.
   Affected surface hints: doctor handoff threshold, acceptance evidence, operator-facing requirement text.
   Case: a prompt with a weak cue whose ranker score is 9.51 hands off a doctor command under the code; the requirement's literal "below 10" says it must not. The packet's own `AC-007` notes the bar of 9, so the requirement and the acceptance criterion disagree.

## Finding Status Changes

- `SA4-P1-001` (retired-alias refusal) -- **P1 -> P2**. Phase 020 `tasks.md:89` (T017 evidence) records this exact behavior as an accepted limit: "a refusal of the retired alias `/create:skill` is not read as one, because the typed name resolves to `/create:sk-skill` first. It predates this phase." The code still has the gap and the probe still reproduces it, so it stays as a P2 advisory, not an active must-fix.
- `SA4-P1-003` (generic creation word in a correction) -- **P1 -> P2**. `AC-004` scopes the gate to the two exact README prompts and the three document commands; `T024` and `T026` record the gate's breadth tradeoff and the one realistic miss they fixed. The `make sure`/`add a`/`new` variants are realistic but are a breadth tradeoff rather than a failed acceptance criterion, so they stay as a P2 advisory.
- `SA4-P1-002` (coordinated refusal) -- **P1, unchanged**. No packet task records this form as an accepted limit; the refusals table in T003/T017 covers single commands and a request with a later clause, not `do not run A or B`.

## Traceability Checks

- `spec_code` -- partial. `REQ-003` and `REQ-004` name their exact prompts and those pass; `REQ-007` is stale against the accepted T025 decision; the coordinated refusal is an uncovered class, which is `SA4-P1-002`.
- `checklist_evidence` -- partial. `AC-002`, `AC-003`, `AC-004`, `AC-006` and `AC-007` are marked Met with evidence. `AC-004`'s evidence correctly limits the gate to the three commands; `AC-007` records the bar of 9 while `REQ-007` says 10. `CHK-FIX-004` claims a "two commands" adversarial case, but the table's two-command case is a request (`use /speckit:plan, not /speckit:complete`), not a coordinated refusal.
- `feature_catalog_code` -- partial. `advisor-recommend.md:39` is false after the head-row change; `command-meaning-matching.md:65` is stale; `doctor-command-routing.md`'s handoff description remains true at the level it states.
- `skill_agent` -- notApplicable; no agent definition changed in this area.
- `agent_cross_runtime` -- partial. No runtime branch in the changed modules; live per-runtime proof belongs to the phase 007 arm.
- `playbook_capability` -- notApplicable.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:477-478` is the changed head-row condition; the changed test at `advisor-recommend-compiled-route-option.vitest.ts:186-192` is its proof. `advisor-recommend.md:39` is the doc sentence that the change invalidated.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1173` applies `DOCTOR_HELPER_WEAK_CUE_MIN_SCORE`; `doctor-helper-handoff.ts:54` declares it. The phase 020 `spec.md:122,184` and `acceptance-criteria.md:62` are the two packet documents that disagree on 9 versus 10.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:155-190,382-482` are the added uncertainty and withhold cases; the doc's 17-case sentence is the stale inventory.
- The compiler/deriver check `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `status: fresh` and `changed: []`, so the generated projection and command tables are consistent with their sources. No generated artifact is hand-edited in this range.

## Edge Cases

- **A doc sentence can be true for one request shape and false for another.** `advisor-recommend.md:39` remains true for a non-head hub beside a command row; it is false for the head row that the change deliberately kept. The finding scopes the sentence to the head case.
- **The weak-cue spec text conflicts with the acceptance criterion, not only with the code.** `AC-007` records the bar of 9 and is marked Met; `REQ-007` says 10. The task `T025` chose 9 with a measured tune row. The finding names the spec as stale and does not ask the code to move.
- **The test-count doc may count a subset.** The sentence says "17 cases: cosine bar, margin, stand-in refusal, eligibility and ranking rule", which cannot cover the new withhold cases; the whole file is 28 declarations. Either way the sentence is not an accurate inventory.
- **The retired-alias limit is pre-existing.** The task evidence says it predates phase 020; the code changed the alias map in this range, so the review records the current behavior but does not re-raise it as a must-fix.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:31` -- the handoff description (passing bridge, ranking, read-only question, no-edit) still matches the changed code at the level it states; the only numeric drift is the weak-cue bar reported above.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` -- the generated bridge table is fresh under the deriver's `--check`; the removed doctor keywords are consistent with the source.
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50` -- the `CommandRow` field list names `mutating`, so the pass-two doc finding remains fixed.
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33,35,37` -- the compiled-route, includeCompiledRoute and compiledRouteTopOnly paragraphs still match the handler.

## Ruled Out

- **The `advisor-recommend.md:39` sentence is still true because the head and the row are different recommendations.** Ruled out: the changed test expects the head's `command` to equal the row's command and still finds the row, so the same command takes two slots.
- **The weak-cue code is wrong and should be 10.** Ruled out by the accepted `T025` evidence: the tune row at 9.51 loses its command at 10, and `AC-007` records the bar of 9. The finding is the stale spec text, not the constant.
- **The generated projection was hand-edited.** Ruled out by the deriver's `--check`: `status: fresh`, `changed: []`.
- **The mention reader's 17-case inventory is an intentional subset.** Ruled out by the sentence's own list (cosine, margin, stand-in refusal, eligibility, ranking), which cannot include the six new withhold cases.

## Next Focus

- Dimension: maintainability
- Focus area: the changed test tables as the regression fence for the three residual behaviors -- the coordinated refusal, the retired-alias refusal and the generic creation word -- plus the case-count and doc-sync cost of the same change.
- Reason: iteration 3 established which findings are active and which are advisories; iteration 4 checks whether the tests can fail for the residual reasons and whether the changed test surface stays maintainable.
- Rotation status: correctness, security and traceability complete (CONDITIONAL, one active P1); maintainability last.
- Blocked/productive carry-forward: traceability was productive (three P2s, two severity corrections); no blocked approach.
- Required evidence: add each residual prompt to the existing table mentally and show which assertion would fail today; confirm the test file's table size and the doc count.

Review verdict: CONDITIONAL
