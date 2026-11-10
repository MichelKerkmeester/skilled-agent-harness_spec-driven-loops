# Iteration 2: Q2 Four-Part Refusal Test and Existing Obligations

## Focus

Run the four-part refusal test against the proposal: is it a trigger-shaped cluster or a
single row, does an existing rule already carry it, does it have an `AGENTS.md` anchor that
would load it? Inventory exactly what `repo-rules/evidence-and-proof.md` §10 and
`repo-rules/communication.md` §§7-9 already oblige, and decide whether the operator's request
is already satisfied, partly satisfied or not satisfied.

## Findings

**F2.1 It is a single row, not a trigger-shaped cluster.** The proposal carries one
obligation (end a turn with the operator's next actions) plus one conditional mechanic (use a
structured question tool where a choice is needed). Condition 1 of the four-part test fails
when the proposal "is a single row, not a cluster", and the routing table sends that shape to
"a section, not a file"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:87-91] and
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:124-125].
The nearest precedent is `communication-format`, refused under Test 3.1 with "one row is not a
cluster"
[SOURCE: specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/refusal-reproduction.md:15].

**F2.2 What `evidence-and-proof.md` §10 already obliges.** Four things, briefly, plus the
negative half: (1) what ran or was read and what it returned, with receipts, (2) what is
inferred rather than observed, (3) what only the operator can verify, (4) the state of the
work, "edited / committed / pushed / dirty, and which branch", and plainly "what is not done"
[SOURCE: repo-rules/evidence-and-proof.md:164-175]. Every one of these is a report about work
already done. Item 3 is a verification list for the operator, not a list of the actions now
theirs to take.

**F2.3 What `communication.md` §§7-9 already oblige.** §7: state the verdict first, reach it
by analysis, and if the verdict cannot be stated yet, say that instead
[SOURCE: repo-rules/communication.md:154-166]. §8: recommend one approach and name its main
trade-off, separate required from optional, name the failure a best practice prevents, state
assumptions when evidence is missing
[SOURCE: repo-rules/communication.md:169-186]. §9: for a complex or ambiguous request, restate
the request, state the approach in three to seven bullets, then "ask only the one or two
clarifying questions that would change the approach", consolidated into a single prompt per
`AGENTS.md` §2, escalating rather than guessing per §7
[SOURCE: repo-rules/communication.md:189-201]. These govern question selection and reply
order. None names a structured question tool, and none requires an operator action list at
turn end.

**F2.4 Status against the operator's request: partly satisfied, both halves.** Half (A) is
partly satisfied: an honest close-out is obliged, and the operator-verification item exists,
but the action list the operator asked for is not required
[SOURCE: repo-rules/evidence-and-proof.md:169] and
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:66-67]. Half (B) is partly
satisfied in posture, since questions must be consolidated and must change the approach, and
escalation already asks "with 2-3 options" [SOURCE: AGENTS.md:417] and
[SOURCE: repo-rules/communication.md:196-200]. It is not satisfied on the stated constraint
that the question tool is named per runtime: no binding document mentions one, and the parent
packet records the same zero-hit result
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:68-69].

**F2.5 The existing-home condition also fails.** `evidence-and-proof.md` §10 owns the
close-out surface and `communication.md` §9 owns the ask surface. A net-new file would
duplicate owned ground, so condition 2 fails as well, and the routing for that failure is "a
new section inside the rule that already owns it"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:90] and
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:132].

**F2.6 The anchor condition passes, which matters for REQ-006.** `AGENTS.md` §10 carries the
always-loaded close-out row [SOURCE: AGENTS.md:515], §2 carries the question consolidation
clause [SOURCE: AGENTS.md:131-132], §7 carries the decision-point ask
[SOURCE: AGENTS.md:417], and §8 carries the reply-quality pointer
[SOURCE: AGENTS.md:423-425]. A rule section on either half would have an anchor that loads it.
The proposal fails on tests 1 and 2, not on anchor availability. This distinguishes it from
`collaboration`, which was refused for having "No anchor row"
[SOURCE: specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/refusal-reproduction.md:22].

**F2.7 The ten prior refusals still reproduce (REQ-007).** The reproduction record maps each
candidate to its refusing test: gate-discipline (Test 1), git/PR (Test 2 plus 3.2),
communication-format (Test 3.1), testing (Test 3.2), security (Test 3.4), memory, spec-folder,
skill-routing and delegation-mechanics (Test 2), collaboration (Test 3.1 plus 3.4)
[SOURCE: specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/refusal-reproduction.md:13-22].
Nothing in this proposal changes any test condition, so all ten remain refused for the same
reasons. The proposal fails the same battery: half (A) under Test 1 (iteration 1), half (B)
under Test 2 (iteration 4).

## Sources Consulted

- `repo-rules/evidence-and-proof.md` §10
- `repo-rules/communication.md` §§7, 8, 9
- `AGENTS.md` §2, §7, §8, §10
- `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md` §§3, 5
- `specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/refusal-reproduction.md`
- `specs/sk-doc/040-create-repo-rules/001-repo-rules-router/004-research-adoption/adoption-decisions.md`
- `specs/agents/009-turn-closeout-next-steps/spec.md`

## Assessment

`newInfoRatio`: 0.85. The four-part frame was new to this packet, and the line-level
inventory of what the two rules already oblige is net-new evidence. The refusal-reproduction
mapping was known in outline from the packet brief and is refined here.
Confidence: high. Every inventory row cites the rule text directly.

## Reflection

What worked: inventorying the existing obligations first, which made the "partly satisfied"
verdict concrete rather than impressionistic.
What failed: the hypothesis that an existing rule already carries the action list in full. It
does not. `evidence-and-proof.md` §10 item 3 is the closest, and it is a verification list,
not an action list.
Ruled out: claiming full satisfaction by pointing at the close-out status alone
[SOURCE: repo-rules/evidence-and-proof.md:164-175].

## Recommended Next Focus

Iteration 3: Q3, the restraint test. Search git history, spec records and repository
artifacts for a failure that the absence of this rule caused, or report that none is
evidenced.
