# Iteration 4: Q4 Scope Boundary Test

## Focus

Quote `REPO RULES.md` §4 In and Out verbatim, decide whether the question-tool half sits In
or Out, and state whether admitting it would be a fourth widening.

## Findings

**F4.1 The scope statement, verbatim.** `REPO RULES.md` §4 In, quoted exactly:

> **In:** how to think and act, restraint, scope, evidence, risk, diagnosis, honesty,
> the posture to hold when work is handed to another runtime, how the resulting reply
> reads, and what you may claim about wiring you have changed. Delivery joined the list
> when `AGENTS.md` §8 moved down; it is the one rule here whose trigger is every
> substantive reply rather than a specific action, and §8 keeps the two clauses that
> must bind even when nothing loads.

`REPO RULES.md` §4 Out, quoted exactly:

> **Out:** skill routing, workflow selection, spec-folder mechanics, and the *mechanics*
> of agent and CLI dispatch: which agent, which command, which model, which flags.
> Those belong to `AGENTS.md` §2 and the skills it routes to, and are deliberately
> absent here so each has exactly one place to change. The line is between plumbing and
> posture: how to dispatch is theirs, how to think while dispatching is ours.

Also quoted, because it names the current boundary condition:

> **The routing carve-out, added deliberately as the third widening.** *Selecting* a
> route stays Out. *Verifying wiring you changed, and what you may claim about it*, is
> In; it is an evidence obligation whose subject happens to be routing. `skill-hub-routing.md`
> is the one rule on this side of that line, and it carries no route-selection guidance:
> the mechanics stay in the skills, and the rule points at them. A fourth widening that
> admits selection itself would dissolve the boundary; this one does not.

[SOURCE: REPO RULES.md:73-78] and [SOURCE: REPO RULES.md:80-84] and
[SOURCE: REPO RULES.md:86-91].

**F4.2 Half (A) sits In, but scope never reaches it.** The In list admits "evidence" and
"how the resulting reply reads", and a turn-ending action list is a close-out obligation
[SOURCE: REPO RULES.md:73-78]. It is nevertheless refused earlier by the always-loaded test
(iteration 1), so the scope boundary does not decide its shape.

**F4.3 Half (B) sits Out, and the operator's own constraint is what puts it there.** The Out
list excludes "the *mechanics* of agent and CLI dispatch: which agent, which command, which
model, which flags" [SOURCE: REPO RULES.md:80-84]. A structured question tool is an ask-surface
interface, and the operator decided the set must name it per runtime rather than
runtime-agnostic [SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:87]. Naming a tool
per runtime is selecting which interface to use, which is the same family as "which command".
The posture half of the idea, "ask only questions that change the work, and prefer a
structured choice when a decision is needed", is already carried by `communication.md` §9 and
`AGENTS.md` §2 [SOURCE: repo-rules/communication.md:196-200] and
[SOURCE: AGENTS.md:131-132]. The remaining content, the runtime tool names, is mechanics.
Out is not advisory: "The router states what the rule set is In and Out for. Out is not
advisory."
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:55-57].

**F4.4 This would be the fourth widening, and the set pre-refuses that kind.** The router has
widened "exactly three times and every time deliberately, to admit delegation posture, then
delivery, then a narrow routing carve-out"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:72-76]. The
integration record names the same three and adds the rule that the scope statement was checked
first both times a rule was added
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:45-60].
Admitting per-runtime tool names would be a fourth widening, and it is the selection-shaped
kind the third-widening paragraph already refuses: "A fourth widening that admits selection
itself would dissolve the boundary; this one does not" [SOURCE: REPO RULES.md:86-91].
Moreover, "if the scope statement excludes a proposal, that is a refusal, not a paperwork
problem. The mode does not widen §4 unilaterally; that is an operator decision, and each of
the three was one"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:57-60].
The parent packet already records the widening as an unresolved operator question, not a
standing decision
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:143-145].

**F4.5 The third-widening carve-out is not a precedent for this.** That widening admitted an
evidence obligation whose *subject* happened to be routing, while still refusing selection,
and its rule "carries no route-selection guidance"
[SOURCE: REPO RULES.md:88-90] and
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:78-79]. A
per-runtime tool name is selection of the ask surface, not verification of anything.

**F4.6 Routing for a Test 2 refusal.** "Routing → refuse. `AGENTS.md` §2 and the skills it
routes to own it"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:65-68]. The
existing homes are `AGENTS.md` §2's consolidation clause and §7's decision-point ask
[SOURCE: AGENTS.md:131-132] and [SOURCE: AGENTS.md:417]. If a per-runtime list is wanted, it
belongs on the runtime surfaces, not in `repo-rules/`.

## Sources Consulted

- `REPO RULES.md` §4 (In, Out, routing carve-out)
- `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md` §2
- `.opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md` §2, §6
- `repo-rules/communication.md` §9
- `AGENTS.md` §2, §7
- `specs/agents/009-turn-closeout-next-steps/spec.md`

## Assessment

`newInfoRatio`: 0.85. The fourth-widening determination is net-new for this packet, and the
quote-verbatim requirement turns a paraphrase question into a textual one. Confidence: high.
The In and Out text is quoted from the live router.

## Reflection

What worked: reading the third-widening paragraph as a pre-commitment, which made the fourth
widening answer determinate rather than a judgment call.
What failed: the hypothesis that the third carve-out could admit per-runtime tool naming as an
"evidence obligation". It cannot, because a tool name is selection, not verification.
Ruled out: treating the operator's per-runtime naming decision as itself a §4 widening. The
decision records a content requirement, and the scope question is explicitly left open for
phase 002 [SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:143-145].

## Recommended Next Focus

Synthesis: assemble the four answers plus the verdict, naming exactly one shape and the test
that decided it. All four questions are answered; no further evidence-gathering focus remains
inside the iteration cap.
