# Review Iteration 002 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`.
- Iteration: 2 of 8. Dimension: traceability. Focus: `spec.md` §3's document bullet and REQ-001 against the determiner requirement, plus the checklist evidence rows that claim coverage for the widened mention check.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks for a request that now reads as a mention and for a refusal or question shape still read as a request. This iteration followed those two questions into the packet's own claims: whether the document bullet the branch implements matches the code, and whether the checklist's coverage claim is true of the two new leads. It found the spec bullet is narrower than the code in one place (F005) and the checklist overstates the matrix in another (F006), with the request and refusal directions unchanged from iteration 1.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md:53-141` (problem, scope, requirements)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/plan.md:53-72` (key components and affected surfaces)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:37-46,128-147` (failing-first tasks and checklist rows)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:52-60` (AC-001 to AC-005)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415-465` (the two new rules, their comments and the occurrence scan)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172-232` (wrapper matrix and the new rows)

## Findings - New

### P0 Findings

None. No spec contradiction in this iteration blocks a release: the divergence in F005 is a narrower implementation with a recorded design reason, and F006 is checklist evidence accuracy.

### P1 Findings

None new. The two active P1s from iteration 1 remain open and are carried forward: F001 (document naming shadows a later request) and F002 (limiting negation after the name reads as a refusal).

### P2 Findings

1. **The spec's document bullet is wider than the code's determiner rule** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md:85` -- the scope bullet reads `Read a command named as a document, file, page or source as a mention`, while `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:458` accepts the document noun only when `the`, `this` or `that` sits immediately before the name. `read /create:readme documentation and tell me what it does` and `open /deep:review command file and summarize it` both read as requests and `attachCommand('sk-doc', SINGLE('sk-create-readme'), ...)` offers `/create:readme`. `tasks.md:46` records the narrowing as a deliberate step (the first rule caught three typed rows whose argument follows the name), so the stale text is the spec bullet, not the code.
   Finding class: spec-drift
   Scope proof: Ran the guard on the article-less forms and on the determiner forms; only the determiner forms read as mentions. REQ-001 at `spec.md:119` repeats the same wider phrasing, and AC-001 at `acceptance-criteria.md:56` pins only determiner forms, so the acceptance row passes while the scope and requirement text stay wider than the accepted behaviour.
   Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md`, `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
   Case: `read /create:readme documentation and tell me what it does`, typed by a reader who wants the docs read, on a hub route that offers the creation command instead.

2. **`CHK-FIX-002` claims matrix coverage for leads the matrix never wraps** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:131` -- the row states `Every wrapper and lead in the mention check is covered by the invariance matrix`, and the evidence sentence counts the twelve wrapper pairs and the retired name. The matrix at `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:179-189` runs `PLAIN_ROWS` only, and `PLAIN_ROWS` holds `REFUSE8`, `QUESTION2`, `REQUEST6`, `CONTROL5` and two or-list rows; the two new leads, `COMMAND_DECLINED_BY_PRONOUN` and `COMMAND_AS_DOCUMENT`, appear only in the unwrapped `it.each` blocks at lines 202-230. Probed the wrapped forms to see whether the gap hides a defect: `[/create:readme] is not what I want, do not run it` and `read the “/create:readme” document` both still read as mentions, so behaviour holds and the defect is the claim.
   Finding class: evidence-overstatement
   Scope proof: Read `PLAIN_ROWS` and both new `it.each` blocks; the new rows are outside the matrix's input set. Ran the wrapped document naming and the wrapped tail refusal through the guard; both classify correctly, which is why this is P2 rather than a behaviour finding.
   Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
   Case: a closer reading `CHK-FIX-002` as written and accepting the widened mention check as wrapper-invariant for all leads, when only the pre-existing leads were ever run under a wrapper.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `spec.md:85` and `REQ-001` at `spec.md:119` state the document shape without a determiner; the code needs one (F005). The other three shapes and the fold at `spec.md:86-87` match the code at `command-attach.ts:440-451`, and the probed doc path `/create:readme.md` is skipped. |
| `checklist_evidence` | partial | AC-001's five enumerated prompts all read as mentions on the current tree, and `REQUEST6`/`CONTROL5` stay requests under every wrapper, so AC-001's acceptance row is met. `CHK-FIX-002` at `tasks.md:131` overstates the matrix (F006). AC-005 is `Unmet` because this pass is its verification, and AC-004 is waived by ADR-001 in the `data` area. |
| `skill_agent` | pass | No agent definition is in the two scope files or the packet diff. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | partial | `plan.md:70` names the guards test and the wrapper matrix as the verification for the widened check; F001, F002 and F006 are the shapes that verification cannot see. |
| `playbook_capability` | notApplicable | The playbook scenario for this pass is the `data` area's; the mention area has no playbook row of its own. |

## Integration Evidence

None this iteration: the traceability pass read packet docs and the two scope files, and no integration surface was re-read. Iteration 1's integration evidence for `attachCommand`, `withholdMentionedCommands` and `typedCommandForTop` still stands.

## Edge Cases

- Ambiguity: whether F005 is a spec defect or a code defect. `tasks.md:46` records the determiner narrowing as a deliberate adjustment with a reason, and AC-001 accepts only determiner forms, so the code is doing what the task asked and the scope and requirement text is the stale part. Recorded as a documentation finding against the spec, not against the implementation.
- Contradiction: `spec.md:57` and `spec.md:85` describe the document shape more broadly than `REQ-001`'s acceptance row. Both sides are cited; the ruling above resolves it toward the acceptance row.
- Partial success: `checklist_evidence` cannot be `pass` while `CHK-FIX-002` overstates coverage; it stays `partial` and is carried to synthesis.
- Missing dependency: AC-002's suite-wide claim (2381 passed) cannot be re-run in this lineage, which writes no test output and runs no suite. It is recorded as unverified rather than assumed.

## Confirmed-Clean Surfaces

- AC-001's five enumerated prompts all read as mentions on the current tree, including `do not run [/create:readme], just explain` at `spec.md:72`, which is the pre-fix defect the branch closes.
- The doc-path requirement at `spec.md:87` holds: `do not run /create:readme, read /create:readme.md` reads as a mention, and `typedCommandIn('open /create:readme/notes.txt')` stays `undefined`.
- `plan.md:71`'s typed start-boundary claim holds: the four new wrapper rows at `command-attach-guards.vitest.ts:518-525` pass on the current tree.
- The packet's recorded limits were not restated: the `:auto.md` suffix, `node -e` arrow, `isolation-check.sh`, underscore emphasis, the `038` P2 list and the pass-ten to pass-twelve open P2s are unchanged by this iteration's findings.

## Ruled Out

- A second spec-vs-code divergence in the fold: the twelve marks named at `spec.md:86` are exactly the characters dropped at `command-attach.ts:441`, plus the four code tags at line 440.
- An unmet AC-001: all five enumerated prompts read as mentions and every `REQUEST6`/`CONTROL5` row stays a request under all twelve wrappers.
- A behaviour defect behind F006: the two new leads still work under a wrapper, so the matrix omission is an evidence defect only.
- AC-004 as a mention-area regression: the waiver belongs to `ADR-001` and the `data` area, and this lineage reviews neither.

## Next Focus

- Dimension: security.
- Focus area: the trust boundary of the prompt text, the two new regexes, and the absence of a prompt-controlled pattern or secret surface in the module.
- Reason: correctness and traceability are covered; security is the remaining dimension whose clean result needs recorded evidence rather than assumption.
- Rotation status: correctness and traceability complete, security next, maintainability last.
- Blocked/productive carry-forward: productive `wrapped-form probes`; they answered both traceability questions without a suite run.
- Required evidence: a probe of the two new patterns at size, the module's import and environment surface, and the escape path for the command name.
- Recovery note: none.

Review verdict: CONDITIONAL
