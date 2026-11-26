# Iteration 8: Q4 adapter and hook-gate audit

## Focus

Continue Q4 with the remaining session-handover runtime adapters and the changed commit-msg, pre-push, and supporting hook gates, then decide whether the full question is answerable. The review sampled the remaining adapter entrypoint and storage reader, then traced the commit-msg guidance and pre-push track-root gate into their implementation and documentation.

## Actions Taken

- Read the existing iteration/state context and used the strategy's Q4 focus; the previously exhausted handover transition paths were not retried.
- Compared the changed `commit-msg` hook's install instructions with its resolver and the hook README.
- Traced the pre-push track-root sweep's exit handling to the sweep command's error behavior and the README's gate description.
- Sampled the OpenCode session-handover entrypoint and shared session reader. No separate adapter defect was confirmed in those sampled paths.
- This was a static source review; no tests, builds, or live runtime database checks were run. One malformed search expression and one incorrect candidate source path were corrected by switching to direct reads of the actual files.

## Findings

1. **P3 — Stale commit-msg install/uninstall comment.** The changed hook's header still directs operators to `.opencode/scripts/install-git-hooks.sh`, while the hook's resolver and the README's documented commands point to `.skilled/scripts/install-git-hooks.sh`. This leaves stale operator guidance in the hook source. [SOURCE: .skilled/scripts/git-hooks/commit-msg:19] [SOURCE: .skilled/scripts/git-hooks/commit-msg:53] [SOURCE: .skilled/scripts/git-hooks/README.md:163]

2. **P2 — Track-root sweep errors fail open in pre-push.** The pre-push gate blocks sweep exit 1 for detected drift, but warns and continues for other nonzero results. The sweep command returns exit 2 when it cannot read the pushed commit's track data, so that operational failure bypasses the consistency verdict and the hook can continue to exit successfully. The README describes the track-root check as a blocking gate but does not describe this error path. The implementation labels this handling as fail-open; whether that is intended policy or a defect is a gate-policy decision, but the resulting bypass is confirmed. [SOURCE: .skilled/scripts/git-hooks/pre-push:695] [SOURCE: .skilled/scripts/git-hooks/pre-push:709] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:86] [SOURCE: .skilled/scripts/git-hooks/README.md:119]

## Ruled Out

- No separate issue was confirmed in the sampled OpenCode plugin entrypoint or shared session reader. This is a bounded sample, not a clean bill of health for every session-handover adapter.
- The previously reviewed handover transition sequence was marked exhausted in the prior iteration and was not repeated.

## Dead Ends

- The sampled adapter entrypoint/storage path exposed no new discrepancy requiring another pass in this iteration.

## Edge Cases

- Ambiguous input: none; the focus was read as a targeted audit of remaining adapters plus the named hook gates.
- Contradictory evidence: none. The pre-push implementation's fail-open comment makes the observed behavior clear, while its policy alignment with the README remains a documentation/policy question.
- Missing dependencies: no source dependency was missing. Live OpenCode state and runtime behavior were outside this static review.
- Partial success: the targeted source paths were reviewed; the overall modified surface was not exhaustively audited.

## Sources Consulted

- `.skilled/scripts/git-hooks/commit-msg:19-20,53-60`
- `.skilled/scripts/git-hooks/README.md:119,163-165`
- `.skilled/scripts/git-hooks/pre-push:695-717`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:86-92`
- `.opencode/plugins/session-handover.js:11,648`
- `.skilled/hooks/shared/session-readers/opencode.mjs:32-36,173-194`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/iterations/iteration-007.md`

## Questions Answered

- **Q4:** Yes, the changed runtime and hook surface contains at least one additional doc-drift issue and one observable gate bypass. Combined with findings from earlier Q4 iterations, this existential question is answerable. This iteration is not an exhaustive inventory of every changed Q4 file.

## Questions Remaining

- **Q5:** Whether the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows, and v4.2.0.0 changelog agree with the code they describe.

## Assessment

- New information ratio: 1.0 (two newly verified findings out of two findings).
- Questions addressed: Q4.
- Questions answered: Q4, in the existential sense stated above.

## Reflection

- What worked and why: tracing the pre-push return-code branch into the sweep command exposed the concrete exit-2 path that the README summary omits.
- What did not work and why: an initial malformed search expression and an incorrect candidate file path produced no usable evidence; direct reads of the actual source files resolved both.
- What I would do differently: compare each advertised gate's documented failure policy against all of its nonzero exit paths, not only its normal drift result.

## Recommended Next Focus

Audit Q5 across the doctor commands, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows, and the v4.2.0.0 changelog; prioritize claims that cross multiple mirrored entrypoints.
