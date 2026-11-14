# The `code` return after the cut, field by field

The return is the third one in `dispatch-after.md`. The return template is `.skilled/agents/code.md` section 9, RETURN CONTRACT. The phase documents call it section 8, which was its number before phase 4 added a section above it.

| Field of the return template | In the return | Value |
|---|---|---|
| First line `RETURN: <status> | escalation=<class> | confidence=<band>` | present | `RETURN: BLOCKED | escalation=LOW_CONFIDENCE | confidence=MEDIUM` |
| Heading `## Code Implementation Result` | present | as written |
| `**Mode:**` (required) | present | `2: Surgical Fix` |
| `**Files:**` (required) | present | the one scratch file |
| `**Verification:**` (required) | present | `PASS`, with the note that the quality gate errored |
| `**Quality Gate:**` (required) | present | `ERROR | p0_blocking=unknown | unverified=none listed` |
| `**Command:**` (required) | present | `node sum-range.test.js` and the gate command |
| `**Exit Code:**` (required) | present | test 0, gate JSON `exit_code: 3` |
| `**First Failing Assertion:**` (conditional) | present | `N/A` for the test, with the gate's error state |
| `**Rubric Score:**` (required) | present | 78 with the five-part breakdown |
| `**Escalation:**` (required) | present | `LOW_CONFIDENCE` |
| `**Confidence:**` (required) | present | `MEDIUM` |
| `**Not checked:**` (required) | present | the gate's checks, the router and the test file |
| `### Summary` | present | root cause, verification, file check, routing |
| `### Adversarial Summary` (conditional) | present | fast path, one unresolved item |
| `### Out Of Scope` (conditional) | present | `None.` |
| `### Spec Drift` (conditional) | present | three lines, `update_recommended: false` |

All ten required fields and all four conditional fields are in the return, in the template's order.

## What differs from the return before the cut

- Before: `RETURN: PASS`, quality gate `NOT_RUN`, with the gate named under `Not checked`.
- After: the agent ran the quality gate on the scratch file, the gate returned `ERROR` because the file sits outside the repository, and the agent returned `BLOCKED` with `LOW_CONFIDENCE` instead of claiming completion.
- Both runs made the same one-line fix, ran `node sum-range.test.js` to exit 0 and stopped at five tool calls.
- The after-run is the stricter of the two. `code.md` section 10 says `Claim completion without fresh verification evidence (Iron Law)` under NEVER, and that line was not cut. One run each way is one sample, so this shows the rule still binds, not that the cut caused the stricter return.
