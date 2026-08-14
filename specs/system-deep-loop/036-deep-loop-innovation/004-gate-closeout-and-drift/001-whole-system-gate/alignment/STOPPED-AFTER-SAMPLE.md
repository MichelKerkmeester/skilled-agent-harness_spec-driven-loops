# Alignment half — stopped after one iteration, deliberately

This run was configured for 22 forced-depth iterations (batch 60, full corpus
coverage) and was stopped after iteration 1 by operator decision. Iteration 1 is
retained as a representative sample. Nothing here is a coverage claim.

## Why it stopped

Iteration 1 audited 60 artifacts of the `sk-code`/`code` lane and produced 47
valid, rule-cited findings. Their distribution is the reason:

| Count | Rule family |
|---|---|
| 30 | exported interfaces, functions, and classes missing TSDoc |
| 8 | file missing the three-line module header block — reported as P0 |
| 6 | code organization and style |
| 3 | code-relevant: unjustified non-null assertions, untyped catch variable |

The findings are honest and each cites a real standard clause against a real
path. But the lane's conformance surface is dominated by documentation and style
rules, so the run answers *"does this code match the house style guide?"* — not
*"is it safe to move authority?"*, which is what the gate exists to decide.

Extrapolated to 22 iterations that is roughly 1,030 findings, around 176 of them
labelled P0 for missing comment dividers. Merging that into the gate's triage
would bury four code-verified cutover blockers under an order of magnitude of
style noise, and the review half had already answered the cutover question with
166 substantive findings.

## Two independent reasons its numbers could not be trusted anyway

1. **Coverage is self-attested.** Corpus membership is enforced, but audit
   execution and dispatched-slice membership are not proven, so a leaf claiming
   canonical paths receives credit without demonstrating work. Every coverage,
   completeness, and convergence figure from this mode is UNVERIFIED; the config
   carries an explicit evidence qualifier saying so.
2. **Severity reflects rule modality, not consequence.** The leaf was told P0
   means a mandatory rule, and a style guide's "MUST" is mandatory — so a missing
   comment divider scored P0 correctly per instruction. The instruction was wrong,
   not the leaf. Any future run needs a severity bar keyed to consequence.

## What this does and does not establish

Establishes: the runner architecture works end to end (init, discover, partition,
dispatch, reduce), leaves produce genuine rule-cited conformance findings, and the
newly landed coverage guards accept a valid corpus while reporting 0 of 1,261
covered on zero work rather than a false 100%.

Does not establish: any statement about how much of the skill conforms to its
authorities. One 60-artifact sample of 1,261 supports no such claim.

## If this is picked up later

Give it its own scope rather than a cutover gate's budget: a severity bar keyed to
consequence, prioritisation of correctness- and security-relevant nonconformance
over documentation style, and coverage claims bound to evidence of work — restrict
credit to the dispatched slice and require a per-artifact finding, content digest,
or adapter receipt before an identity counts as audited.

A separate documentation and style conformance census over the whole skill is a
reasonable standalone work item. It is not this gate.
