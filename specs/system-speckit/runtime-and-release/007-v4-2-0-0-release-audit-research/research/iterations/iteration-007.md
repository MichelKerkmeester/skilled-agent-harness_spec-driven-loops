# Iteration 7: Q4 session handover and runtime follow-up

## Focus

Continue Q4 by auditing the remaining changed session-handover and system-spec-kit runtime paths, then review Git hook gate behavior beyond the uninstall instructions. This pass sampled relaunch-record transitions, nested sub-track discovery and validation, and the pre-commit trust and blocking-gate paths. It did not exhaustively inspect every changed adapter or hook.

## Actions Taken

- Read the research config, state log, strategy, findings registry, and iteration 6 before selecting the focus.
- Compared the changed-path inventory in `v4.1.0.0..HEAD` and inspected the relevant source and test excerpts.
- Performed static review only. No tests or builds were run.

## Findings

1. **P3 — Lowercase sentence starts can bypass the compact-field narrative check.** The sentence-boundary regex counts punctuation only when it is followed by uppercase text or the end of the value. A short value such as `Ready. fine.` therefore counts only its final period. The remaining discourse check only looks for a fixed list of phrases, so this value can pass the length and token limits and be accepted as a two-sentence `recent_action` or `next_safe_action`, despite the validator's compact, non-narrative requirement. The added rejection test uses an uppercase second sentence, so it does not cover this boundary. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:169] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:347] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:350] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:355] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:744] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/thin-continuity-record.vitest.ts:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/thin-continuity-record.vitest.ts:134]

## Questions Answered

- None at the full-question level.

## Questions Remaining

- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

## Ruled Out

- No additional defect was confirmed in the sampled handover prepare/arm/relaunch/claim transitions. This is limited to those paths, not a full review of every runtime adapter. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1594] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1648] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1909] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1998]
- No additional defect was confirmed in the sampled pre-commit trust and comment-hygiene gate paths. This is not a conclusion about every Git hook or gate. [SOURCE: .skilled/scripts/git-hooks/pre-commit:36] [SOURCE: .skilled/scripts/git-hooks/pre-commit:63] [SOURCE: .skilled/scripts/git-hooks/pre-commit:199] [SOURCE: .skilled/scripts/git-hooks/pre-commit:209]
- The two-level working-tree sub-track reader and validator use matching depth bounds in the inspected functions. No mismatch was confirmed in those excerpts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:241] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:248]

## Dead Ends

- None.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none. The focused review completed; Q4 remains open because its remaining surfaces are assigned to later iterations.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:169,334-356,744-746`
- `.skilled/skills/system-spec-kit/runtime/tests/thin-continuity-record.vitest.ts:106-145`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1594,1648,1909,1998`
- `.skilled/hooks/session-handover/runtime-behavior.md:25-32,139-168`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:122-165`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:241-255`
- `.skilled/scripts/git-hooks/pre-commit:36-75,199-210`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/iterations/iteration-006.md:5-18`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md:61`

## Assessment

- New information ratio: 1.0
- Questions addressed: Q4, specifically the thin-continuity sentence-boundary validator.
- Questions answered: none at the full-question level.
- Questions remaining: Q4 and Q5.
- Edge cases: none. Q4 remains open by scope, not because a research action failed.

## Reflection

- What worked and why: reading the validator predicate alongside its rejection test exposed a lower-case sentence boundary that neither condition catches.
- What did not work and why: Q4 spans more runtime adapters and Git hook gates than this pass sampled.
- What I would do differently: inspect the remaining session-handover adapters and the other changed Git hook gates before closing Q4.

## Recommended Next Focus

Continue Q4 with the remaining session-handover runtime adapters and the changed commit-msg, pre-push, and supporting hook gates, then decide whether the full question is answerable.
