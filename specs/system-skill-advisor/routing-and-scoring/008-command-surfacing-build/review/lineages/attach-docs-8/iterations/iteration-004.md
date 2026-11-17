# Review Iteration 004

## Dispatcher

- Lineage: `attach-docs-8` (fan-out child, session `fanout-attach-docs-8-1794832880917-x4m8iz`)
- Area: `attach-docs` per `review/review-scope-8.txt`
- Dimension: maintainability
- Operator review focus: followed `review/review-brief-8.txt`. This iteration checks the reworded matcher comment against the suffix tests that are supposed to pin it, and the documentation quality of the changed `CONTRIBUTING.md` sentence. The scorer area stays with `scorer-8`; no recorded limit is re-reported.
- Steer channel: `steer.md` does not exist in this lineage.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (197-211 comment, 217-244 retired map and matcher) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (414-484) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442]
- `CONTRIBUTING.md:155` [SOURCE: CONTRIBUTING.md:155]
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-7/review-report.md` (pass-seven plan seed, context evidence) [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-7/review-report.md:121]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The rewritten comment defines a shared suffix rule that no suffix test pins, and the documented `:with-phases` modifier has no positive case** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442` -- The comment now says a `:with-*` modifier typed on a command that does not take it still names that command, and the constant reads `:with-phases`; the suffix suite types only modifiers each tested command advertises and never types `:with-phases`. Pass seven asked for that case in its plan seed, and the pass-seven fix commit (`3416b5e0526`) changed the comment without touching this test file.
   - Finding class: `matrix/evidence` -- the test matrix does not cover a documented branch of the rule the comment states
   - Scope proof: the suffix tests are the only guard for `MODE_SUFFIX`; a grep of `tests/` finds no `:with-phases` case and no `:with-*` case on a command that does not advertise it. The comment and the constant are in `command-attach.ts`; the plan seed is the prior remediation record.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211`, `.skilled/commands/speckit/plan.md:3`, `.skilled/commands/speckit/complete.md:3`
   - Case: a maintainer applies the other half of pass seven's own remediation choice and derives the suffix set per command from `argument-hint`. `phases` is dropped from the shared alternation, so `/speckit:plan:with-phases add a login page` -- a documented invocation at `plan.md:3` -- stops reading as `/speckit:plan`, while every suffix test stays green because `:with-phases` never appears in the file. The comment is the only record of the shared rule, so the regression has no failing check to catch it.

   [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442] [SOURCE: .skilled/commands/speckit/plan.md:3]

   Why it is P2: the current matcher returns `/speckit:plan` for that input, so no user sees a wrong result today. The defect is the missing evidence row and the silent-regression path it leaves, not an active misread.

   Fix recommendation: add one `it` case with `/speckit:plan:with-phases add a login page` (and optionally `/speckit:plan:with-research`, a modifier `plan.md` does not advertise) so the shared-rule sentence and the `phases` alternative both fail a suite when removed.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | AC-003 pins `:unattended`, `:with-research`, `:with-context` and `:auto:with-research`, and the suite pins each of those plus the two refusal cases. The comment's shared-rule sentence and the `:with-phases` alternative are outside AC-003, which is why they are recorded as a matrix gap in the finding above rather than as an AC failure. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/acceptance-criteria.md:56] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:435] |
| `checklist_evidence` | notApplicable | The target is a phase-parent packet with no `checklist.md`; the pass-eight brief and scope file are the operative checklist. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Integration Evidence

- The comment's rule and the constant are consistent: `/speckit:plan:with-research` names `/speckit:plan` even though `plan.md` does not advertise that modifier, and `/create:readme:with-research` names `/create:readme` for the same reason. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:205]
- The pass-seven remediation record contains the exact test this pass still finds missing: "Add a `:with-phases` case to `command-attach-guards.vitest.ts` so the second advertised modifier is pinned." [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/attach-config-7/review-report.md:121]
- The changed `CONTRIBUTING.md` sentence is clear about the command's purpose and names the parent command for multi-mode skills; the wording adds no ambiguity. [SOURCE: CONTRIBUTING.md:155]

## Edge Cases

- A suffix followed by a file extension still reads as the command; the recorded limit stands and is not re-reported. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- The retired name typed in a question or refusal still attaches its successor; the packet records this as a phase 020 accepted limit (decision P045) and this iteration does not re-raise it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/spec.md:242]
- The comment's `:with-*` wildcard is narrower in code than the word suggests: only `context`, `phases` and `research` exist, and the hint sweep in iteration 2 found no fourth modifier. The shorthand does not mislead while the set matches the documents; the finding above is about the missing pin, not the shorthand.

## Confirmed-Clean Surfaces

- The reworded comment no longer claims a per-command documentation rule; it states the shared union and names the chain example, which matches `MODE_SUFFIX`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203]
- The suffix suite's positive and negative cases still pin every input AC-003 names, and the unknown-suffix cases keep `:automation`, `:draft`, `:with-everything` and `:auto:draft` refused. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:448]
- The `CONTRIBUTING.md` sentence uses the live command name and the live parent command name, with no stale alias and no broken inline formatting. [SOURCE: CONTRIBUTING.md:155]

## Ruled Out

- The comment being inaccurate after the pass-seven rewrite: each sentence was reproduced against the matcher, including the shared-union sentence and the chain example.
- A test that asserts the wrong command for a suffix input: each positive case names the command its hint advertises, and each negative case names an unknown suffix the matcher refuses.
- A broken `CONTRIBUTING.md` command reference: iteration 2 resolved all six names under `.skilled/commands`.

## Next Focus

- Dimension: maintainability (stability pass over all four dimensions)
- Focus area: re-read the finding's cited lines, confirm the dimension coverage record, and run one cross-reference pass before synthesis.
- Reason: iteration 4 is the last first-coverage pass; the loop needs one stability pass so `coverageAge` reaches 1 before the fifth-iteration cap.
- Rotation status: all four dimensions will be covered after this iteration; the stability pass follows.
- Blocked/productive carry-forward: the `:with-phases` matrix gap is the productive carry-forward; the deferred item is recorded in the report.
- Required evidence: the finding's file:line and the pass-seven plan seed; no new code finding is expected.

Review verdict: PASS
