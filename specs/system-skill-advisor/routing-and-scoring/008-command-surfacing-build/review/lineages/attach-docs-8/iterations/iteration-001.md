# Review Iteration 001

## Dispatcher

- Lineage: `attach-docs-8` (fan-out child, session `fanout-attach-docs-8-1794832880917-x4m8iz`)
- Area: `attach-docs` per `review/review-scope-8.txt`
- Dimension: correctness
- Operator review focus: followed `review/review-brief-8.txt`. This iteration reads the attach-docs diff `1c3d62def5a..3416b5e0526` for `command-attach.ts` (the matcher comment reword), then the whole matcher function it touches and the suffix tests in `command-attach-guards.vitest.ts`. The `CONTRIBUTING.md` rename is read in iteration 2 so its command-existence check is not split. The scorer area stays with `scorer-8`. No recorded limit is re-reported.
- Steer channel: `steer.md` does not exist in this lineage.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (comment 197-211, `typedCommandIn` 221-245, `attachCommand` 465-519) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (414-484) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:435]
- `.skilled/commands/speckit/complete.md`, `.skilled/commands/speckit/plan.md`, `.skilled/commands/speckit/implement.md`, `.skilled/commands/deep/review.md` (argument hints, context evidence for the comment's claim) [SOURCE: .skilled/commands/speckit/complete.md:3] [SOURCE: .skilled/commands/speckit/plan.md:3] [SOURCE: .skilled/commands/speckit/implement.md:3]
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/spec.md` (REQ-003), `acceptance-criteria.md` (AC-003), `tasks.md` (T004, CHK-042) [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/acceptance-criteria.md:56]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-003 asks the matcher to read `:unattended`, `:with-research`, `:with-context` and a chain such as `:auto:with-research`, and to refuse an unknown suffix. `MODE_SUFFIX` reads exactly the documented union plus `:with-phases`, and the tests pin each REQ-003 input and both refusal cases. The comment now states the shared-union behavior the pass-seven rewrite asked for. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/spec.md:134] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:435] |
| `checklist_evidence` | notApplicable | The target is a phase-parent packet with no `checklist.md`; the operative checklist is the pass-eight brief and scope file. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Integration Evidence

- The matcher's suffix set is the same union the transcript scorer's `MODE_SUFFIX` strips after the pass-seven fix; the two surfaces agree on every advertised modifier and on the unknown-suffix refusal. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613]
- `typedCommandForTop` maps the retired `/create:skill` through `RETIRED_COMMANDS` before the owner check, so the pass-eight rename test still resolves `/create:sk-skill`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:243]

## Edge Cases

- The positive suffix tests pin `:with-research` and `:with-context` but never `:with-phases`, so deleting `phases` from the alternation would leave the suite green. Pass seven recorded the same gap as a deferred coverage item with no current wrong input; this iteration keeps that classification and re-probes the documented input `/speckit:plan:with-phases`, which returns `/speckit:plan` today. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442] [SOURCE: .skilled/commands/speckit/plan.md:3]
- A suffix followed by a file extension (`/create:sk-skill:auto.md`) still reads as the command. This is the recorded limit in the brief, no new input breaks it, and it is not re-reported. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- The scope diff for the test file is empty at `1c3d62def5a..3416b5e0526`; the suffix tests were authored in phase 038 and are reviewed here as the standing guard for the reworded comment, not as a changed hunk.

## Confirmed-Clean Surfaces

- `typedCommandIn('/deep:review:auto review the diff')` returns `/deep:review`; `attachCommand('system-deep-loop', SINGLE('review'), '/deep:review:auto review the diff')` returns `/deep:review`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:231]
- `typedCommandIn('/create:readme:auto.md')` matches the recorded extension limit, while `typedCommandIn('see /create:sk-skill.md for details')` stays `undefined`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:415]
- `:with-everything`, `:auto:draft`, `:automation` and `:draft` all return `undefined`, so the negative lookahead and the chain's inability to back down to zero repetitions still hold. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:448]
- The comment's new claim is true as written: `/speckit:plan:with-research` names `/speckit:plan` even though `plan.md:3` advertises only `:with-context` and `:with-phases`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:205] [SOURCE: .skilled/commands/speckit/plan.md:3]
- A chained invocation `/create:sk-skill:auto:with-research:with-phases:confirm` returns `/create:sk-skill`; the chain is read in any order and consumes each advertised word once. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

## Ruled Out

- Catastrophic backtracking in `MODE_SUFFIX`: every repetition consumes one `:`-prefixed literal, the alternatives are prefix-disambiguated, and the trailing lookahead fails once, so scanning stays linear in prompt length. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- A false `:auto` match inside `:automation` or `:autopilot2`: the negative lookahead rejects a following letter or digit, and the chain cannot settle on a shorter prefix. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- A longest-key regression from the suffix branch: `/create:skill-parent:auto` keeps `/create:skill-parent`, because the shorter retired key is rejected by the `-parent` continuation before the suffix rule applies. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:224]
- Re-reporting the retired-name refusal limit: this iteration reproduced it and read the packet's accepted-limit row, so it stays out of the active findings. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:212]

## Next Focus

- Dimension: traceability
- Focus area: `CONTRIBUTING.md:155` net change against `origin/main`, plus the full documented-suffix union against `.skilled/commands/*` argument hints.
- Reason: correctness is clean; the renamed command names and the comment's vocabulary claim are traceability questions.
- Rotation status: correctness complete; security, traceability and maintainability remaining.
- Blocked/productive carry-forward: none blocked; direct diff read plus source-reproduced matcher probes were productive.
- Required evidence: each command `CONTRIBUTING.md` names must resolve to a file under `.skilled/commands`, and the accepted suffix set must equal the documented union.
- Recovery note: not in recovery.

Review verdict: PASS
