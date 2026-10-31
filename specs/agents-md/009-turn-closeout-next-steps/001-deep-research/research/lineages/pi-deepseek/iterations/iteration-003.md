# Iteration 3: Q3 Restraint Test and the Failure-Evidence Search

## Focus

Name a failure that happens today, grounded in this repository's own artifacts, git history
or spec records, that the absence of this rule caused. If no such failure can be evidenced,
report that as the finding.

## Findings

**F3.1 The bar.** The restraint test asks "what fails today without this rule?", and answers:
"Nothing concrete" means refuse, with "might need it", "best practice" and "for completeness"
named as the vocabulary the set guards against, while "A named failure" makes the proposal
admissible
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:110-114].
The test was recovered from a research phase that returned zero new rule files and whose most
valuable output was a subtraction
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:107-109].

**F3.2 Search coverage and result.** No incident-level failure is evidenced in the surfaces
searched:

- Git history greps for "next step", "close-out", "AskUserQuestion" and "operator asked,
  wanted, needed or requested" returned no commit message describing a turn that lost the
  operator's next action, or a prose question that a structured one would have prevented.
- Spec-record greps for "what do I do next", "didn't tell me", "no clear next", "awaiting the
  operator", "over to you" and "had to ask" returned no matching incident.
- Commit provenance was checked for the two adjacent clauses. The always-loaded close-out row
  arrived inside a broad release restructure, not in response to an incident
  [SOURCE: git commit cec61520b65], and the consolidated question clause likewise arrived in a
  large spec-kit restructure [SOURCE: git commit 292ce5163b9]. Neither carries a failure
  narrative.

Status: the finding is that **no failure caused by the absence of this rule can be evidenced**
in this repository's artifacts, git history or spec records.

**F3.3 What is evidenced instead, and it is not a failure.** The parent packet records the
gap as a normative absence: the closest existing content "is a report about the past. It does
not require an action list for the reader", and no binding document tells a runtime when a
structured choice beats a prose question
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:66-69]. That is a design
observation, and the request is the demand signal. A gap claim authored by the same operator
request is not an independent incident record.

**F3.4 Counter-facts: the pattern already exists at handoff boundaries.** Sub-agent contracts
already require next actions, for example "verified partial findings plus explicit gaps and
orchestrator-side next actions"
[SOURCE: .opencode/agents/context.md:43] and "next actions" in the debug handoff record
[SOURCE: .opencode/agents/debug.md:63] (mirrored across runtimes). Session end already routes
to a continuation prompt [SOURCE: AGENTS.md:485]. The operator's request therefore extends an
existing pattern from handoffs to every turn. That is a consistency argument, not a failure
record.

**F3.5 The nearest failure-shaped record does not qualify.** The commit that moved
communication down records the operator's objection that "a triggered file does not load on a
turn with no trigger, which is most turns" [SOURCE: git commit 40462913174]. That is an
objection about load mechanics for delivery content, and its resolution was the total-trigger
mitigation. It evidences the concern that decided iteration 1, not a close-out omission.

**F3.6 Restraint outcome.** With no named failure, the restraint test returns "nothing
concrete" and the routing is "Nowhere. Record the refusal with its reason so it is not
re-proposed"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:112-114] and
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:134]. This
refuses any net-new rule artifact. Half (A) is not a net-new rule artifact under iteration 1's
finding: it is an always-loaded row, and adding it to `AGENTS.md` is an operator decision on
the always-loaded document, not rule-set growth
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:120-127].

**F3.7 Direction of travel.** The set's own precedent is subtraction over addition: the
restraint test was recovered from a run whose best output was a removal, and the corpus carries
the line "A review of a rule set that only adds has not reviewed it"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:107-111].
A finding of "no evidenced failure" is therefore a first-class result for this test, not a
research shortfall.

## Sources Consulted

- git history: `git log -i --grep` across "next step", "close-out", "AskUserQuestion",
  "operator asked/wanted/needed/requested", plus `git log -S` for the two adjacent clauses
- `specs/**` greps for operator-direction phrases
- `.opencode/agents/context.md`, `.opencode/agents/debug.md` (mirrored in `.pi`, `.claude`, `.codex`)
- `AGENTS.md` §10 quick reference
- `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md` §4, §5
- `.opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md` §6
- `specs/agents/009-turn-closeout-next-steps/spec.md`

## Assessment

`newInfoRatio`: 0.8. The negative result was expected in outline from the brief's ruled-out
note, but the incident-level search, the commit-provenance checks and the counter-facts are
net-new evidence. Confidence: high within the searched surfaces, and the search is bounded and
named so a later reader can extend it.

## Reflection

What worked: checking provenance of the two adjacent clauses, which turned "the rule is
missing" into "the rule was never demanded by an incident".
What failed: three distinct search angles produced no incident record.
Ruled out: treating the parent packet's gap statement, or the communication-move objection, as
failure evidence for this rule.

## Recommended Next Focus

Iteration 4: Q4, the scope boundary test. Quote `REPO RULES.md` §4 verbatim, place the
question-tool half In or Out, and decide whether naming the tool per runtime is a fourth
widening.
