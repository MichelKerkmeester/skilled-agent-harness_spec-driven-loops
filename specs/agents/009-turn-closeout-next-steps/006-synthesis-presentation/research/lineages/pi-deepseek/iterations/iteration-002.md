# Iteration 2: Q3 Four-Part Refusal Test and Q4 Restraint Test

## Focus

Q3: is the proposal a trigger-shaped cluster or a single row, does an existing rule already carry
it, exactly what do `communication.md` sections 7 and 8 and `handoff-and-questions.md` oblige, and
which `AGENTS.md` sections would anchor it? Q4: verify rather than accept the candidate failure,
that a four-iteration 2026-09-11 run wrote a 265-line synthesis while the mode's success template
offered no field for what it found.

## Findings

**F2.1 Part 1: single row, not a cluster.** The operator's sentence is one obligation, present the
synthesis in chat plainly. The doctrine doc draws exactly this line: condition 1 fails when "It is a
single row, not a cluster. One row is a section in an existing rule"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:87-91]. A new file
is warranted only by a trigger-shaped cluster. The per-mode differences found in iteration 3 are not
additional rule rows. They are the mode contracts' own content.

**F2.2 Part 2: the delivery half already has a home.** `communication.md` section 7 obliges the
verdict first, reached by analysis, and says a named uncertainty is itself a verdict about the
evidence [SOURCE: repo-rules/communication.md:154-165]. Section 8 obliges exactly what presenting a
recommendation means: recommend one approach and name its main trade-off, mention an alternative
only when it could change the decision, separate required from optional work, name the failure a
best practice prevents, and state assumptions when evidence is missing
[SOURCE: repo-rules/communication.md:169-186]. Sections 2, 5 and 6 carry the concise half: one idea
per sentence, length matched to the question, every sentence carrying information
[SOURCE: repo-rules/communication.md:71-85,124-133,137-150]. The trigger row fires on "present a
recommendation, a fork, or a trade-off" and on any substantive reply
[SOURCE: REPO RULES.md:47]. So "in simple and concise terms" and "recommendations presented as
recommendations" are already obliged for every reply.

**F2.3 Part 2 continued: what is not carried, and why the other candidate is the wrong owner.**
`handoff-and-questions.md` obliges the turn end to "name what is now the operator's to do, in the
form that lets them do it" [SOURCE: repo-rules/handoff-and-questions.md:41-46]. Its operator-action
table explicitly excludes "A summary of what you just did" from the list
[SOURCE: repo-rules/handoff-and-questions.md:72-77]. The handback is a report about what happens
next, a different document from the status [SOURCE: repo-rules/handoff-and-questions.md:50-58]. No
rule obliges a mode's completion message to carry the synthesis itself, and `handoff-and-questions.md`
would be the wrong owner for that content. The request is therefore **partly satisfied**: the
delivery doctrine exists, the content obligation does not.

**F2.4 Part 3: not design-excluded.** Q2 placed the proposal In, so the design-exclusion condition
passes [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:87-92].

**F2.5 Part 4: the anchors exist, so the anchor condition is not what refuses.** `AGENTS.md` section
8 names both reply rules: "How a reply reads is governed by `repo-rules/communication.md`, and it
fires on every substantive reply" and "How a reply ends is governed by
`repo-rules/handoff-and-questions.md`" [SOURCE: AGENTS.md:424,426]. The section 10 Communication
rows carry "At a fork, lead with your recommendation" and the close-out obligation
[SOURCE: AGENTS.md:515-518]. A communication-layer artifact would be anchorable at section 8 or
section 10.

**F2.6 The length ceiling removes the in-place option.** `communication.md` is 244 lines, band "at
the limit", and anything over 250 must "Split it, or cut it"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:105,92]. A new
section cannot fit. The doc also records that the three at-the-limit rules "each absorbed content
moved down from `AGENTS.md`", so their length is explained rather than accidental
[SOURCE: rule-anatomy.md:111-113]. `handoff-and-questions.md` (159 lines) is the wrong owner under
F2.3. So the existing-home condition fails against a new section, which is the second refusal on the
rules-set route.

**F2.7 Q4: the incident is real, verified independently.** The 2026-09-11 run in
`specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek` records
`"maxIterations": 4` and `"stopPolicy": "max-iterations"`
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/deep-research-config.json],
four `iterations/iteration-00N.md` files, and a closing state row
`"event":"synthesis_complete","totalIterations":4,...,"stopReason":"maxIterationsReached"`
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/deep-research-state.jsonl:5].
`research.md` measures 265 lines (`wc -l` of
`specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/research.md`,
verified in this session). The success template that presents that run carries iterations, stop
reason, artifact paths, a ready-for command and a status token, and no field for a finding
[SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:270-277]. The mode's own
success criteria likewise list the artifact, not its content: "research/research.md produced with
findings from all iterations" [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:404-409].
The confirmed claim is about the deep-research contract, and it holds.

**F2.8 Q4 continued: all six templates checked, and the one candidate field is not a findings
field.** Review reports severity counts plus a verdict token and no named finding
[SOURCE: .opencode/commands/deep/assets/deep-review-presentation.txt:355-364], which the packet's
own spec records as the closest any mode gets [SOURCE: specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/spec.md:66].
Council's success display reports topics, rounds, stop reason, the convergence threshold and
artifact paths, and no verdict content
[SOURCE: .opencode/commands/deep/assets/deep-ai-council-presentation.txt:290-299]. Agent improvement
reports dimensional scores, a weighted score, stop reason and artifacts
[SOURCE: .opencode/commands/deep/assets/deep-agent-improvement-presentation.txt:336-371]. Model
benchmark is the only contract that names a recommendation field, "Recommendation: continue, promote
(if eligible), or stop", and its example output shows scores only
[SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:310-315,331-357]. Skill
benchmark prints a verdict and an aggregate against report paths
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:77-85]. The failure is
therefore real, and no template already has somewhere the synthesized content could go: the closest
fields hold counts, scores, tokens or paths, none holds findings.

**F2.9 What the failure costs.** The operator must open a 265-line artifact to learn the conclusion
the run existed to produce. In the 001 case that conclusion was a verdict with a deciding test
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/research.md].
The chat and session record carry no conclusion, so the decision does not travel with the run. For a
detached fan-out lineage the terminal message is composed outside the rule-loading path (F1.4), so
the loss repeats per lineage. The cost is delivery, not data loss: the artifact is canonical and the
message already names it.

## Question Answers

- **KQ-3: single row, partly satisfied, anchored.** `communication.md` sections 7 and 8 already
  oblige how a recommendation reads and what presenting one must separate; sections 2, 5 and 6 carry
  the concision half. `handoff-and-questions.md` obliges the operator action list and expressly not a
  summary of the work. The un-carried half is the mode-level obligation to surface synthesis content.
  Anchors would be `AGENTS.md` section 8 and section 10, and both already exist. A new section inside
  `communication.md` is blocked by its 244-line length against the 250 ceiling.
- **KQ-4: confirmed failure, restraint test does not refuse.** The four-iteration, 265-line synthesis
  and the findingsless success template are both verified. The cost is a conclusion that never
  reaches chat. The restraint test's question, what fails today without this, has a concrete answer,
  so the proposal is admissible; placement is decided by KQ-3.

## Ruled-Out Directions

- **Reading `handoff-and-questions.md` section 2 as a findings-delivery obligation.** Its table
  excludes a summary of what was done; the rule is about what happens next, not what was found.
- **Calling the failure absent because the artifact exists.** The artifact exists and the message
  names it. The failure is that the message carries no content, which is what the template's missing
  field produces.

## New Information Ratio

0.85. Net-new: the line-level inventory of sections 7 and 8 against the request, the independent
verification of the 2026-09-11 incident from the 001 lineage's own state, the six-template sweep of
what each Results Display field actually holds, and the cost statement. The section 4 placement and
Gate 5 framing were iteration 1's; nothing here restates them as new.
