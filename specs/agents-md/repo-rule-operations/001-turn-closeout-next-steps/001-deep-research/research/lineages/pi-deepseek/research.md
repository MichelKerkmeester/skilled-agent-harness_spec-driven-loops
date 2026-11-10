# Turn Close-Out Next Steps: Decision-Test Research Synthesis

Detached fan-out lineage `pi-deepseek`, session `fanout-pi-deepseek-1789124400614-oxa15x`.
Four iterations, `stopPolicy: max-iterations`, convergence never invoked as a stop.

**Question:** does a close-out obligation belong in this repository's repo-rules set, and if
so in what shape? The operator's request, verbatim: "Always end with next steps in msg if i
need to do something and / or use ask question tool". Half (A): a turn must end with the
actions that are now the operator's to take. Half (B): where a choice is needed, a structured
question tool is used instead of a prose question, named per runtime.

**Method:** the four decision tests in
`.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md`, run in order,
against the live corpus (`REPO RULES.md`, the nine `repo-rules/` files, `AGENTS.md`) plus this
repository's git history and spec records. Read-only, no rule drafted, nothing edited outside
the lineage directory.

---

## Q1. Always-Loaded Test

**Answer: yes for half (A), no for half (B).**

The test: "A rule file loads on a trigger. Content that must bind when no trigger has fired
cannot live in one." Ask: "on a turn where nothing fires, must this still hold?" Yes routes to
`AGENTS.md` as a compressed row, no continues to the scope test
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:30-41].

Half (A) must hold on a turn where nothing fires, because the load event is a write. Gate 5 is
the only mechanism that loads the router and its rule files, and its trigger is "the FIRST
write of the session ... Read-only turns never fire it" [SOURCE: AGENTS.md:121-122]. With
nothing fired, the router's own fallback says "`AGENTS.md` alone governs"
[SOURCE: REPO RULES.md:18]. The router audit measured the same thing: a read-only explanation
turn fires 0 rows and loads 0 tokens, while `AGENTS.md` loads every turn
[SOURCE: specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:73-74] and
[SOURCE: specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:90]. The read-only
turn is exactly where the operator most often needs a stated next action: an analysis arrives
and the decision is now theirs, which the parent packet names as the gap
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:66-67].

The counter-argument is that `REPO RULES.md` §2 carries a "close out a turn" row pointing at
`evidence-and-proof.md` [SOURCE: REPO RULES.md:42] and that rule lists "You are closing out a
turn" among its triggers [SOURCE: repo-rules/evidence-and-proof.md:38]. It fails on the Gate 5
mechanics above: on a read-only turn the table is never consulted, so the row cannot guarantee
the load at the moment it is needed. The set's own near-miss states the rule: a total move
needs a total trigger or the content goes quiet
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:48-51], and
the operator's recorded objection to the communication move was that "a triggered file does
not load on a turn with no trigger, which is most turns" [SOURCE: git commit 40462913174].
`AGENTS.md` already keeps close-out content always loaded in the §10 Communication row
[SOURCE: AGENTS.md:515] and keeps two clauses in §8 that "bind regardless of what loads"
[SOURCE: AGENTS.md:425].

Half (B) answers no: it fires only when a choice is needed, an action-conditioned moment. It
continues to the scope test, and the always-loaded document already conditions its own
question clause the same way [SOURCE: AGENTS.md:131-132].

**Consequence:** half (A) belongs in `AGENTS.md` as a compressed row, and the rule-file route
is refused by this test [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:38-41]
and [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:128-131].

---

## Q2. Four-Part Refusal Test and Existing Obligations

**Answer: a single row, partly carried by existing rules, anchored, and still refused. The
operator's request is partly satisfied on both halves.**

Condition 1 fails: the proposal is one obligation plus one conditional mechanic, and "One row
is a section in an existing rule", with the routing table sending the single-row shape to "a
section, not a file"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:87-91] and
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:124-125].
The precedent is `communication-format`, refused under Test 3.1 with "one row is not a cluster"
[SOURCE: specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/refusal-reproduction.md:15].

**What `evidence-and-proof.md` §10 already obliges:** four things, briefly, plus the negative
half. (1) What ran or was read and what it returned, with receipts. (2) What is inferred rather
than observed. (3) What only the operator can verify. (4) The state of the work, "edited /
committed / pushed / dirty, and which branch", plus plainly "what is not done"
[SOURCE: repo-rules/evidence-and-proof.md:164-175]. All of it is a report about work already
done. Item 3 is a verification list, not the action list the request asks for.

**What `communication.md` §§7-9 already oblige:** §7, verdict first and earned, and if the
verdict cannot be stated yet, say that [SOURCE: repo-rules/communication.md:154-166]. §8, one
recommendation with its trade-off, required separated from optional, the failure a best
practice prevents named, assumptions stated
[SOURCE: repo-rules/communication.md:169-186]. §9, ASK→DO framing, and "ask only the one or
two clarifying questions that would change the approach", consolidated into a single prompt
per `AGENTS.md` §2 [SOURCE: repo-rules/communication.md:189-201]. These govern question
selection and reply order. None names a structured question tool, and none requires an
operator action list at turn end.

**Status: partly satisfied, both halves.** Half (A): an honest close-out is obliged, but the
action list is not [SOURCE: repo-rules/evidence-and-proof.md:169]. Half (B): consolidation and
decision-changing questions are obliged, and escalation already asks "with 2-3 options"
[SOURCE: AGENTS.md:417], but no binding document mentions a question tool, and the parent
packet records the same zero-hit result
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:68-69].

Condition 2 also fails: `evidence-and-proof.md` §10 owns the close-out surface and
`communication.md` §9 owns the ask surface, so a net-new file would duplicate owned ground
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:90]. The
anchor condition passes: `AGENTS.md` §10 carries the close-out row
[SOURCE: AGENTS.md:515], §2 the consolidation clause [SOURCE: AGENTS.md:131-132], §7 the
decision-point ask [SOURCE: AGENTS.md:417], §8 the reply-quality pointer
[SOURCE: AGENTS.md:423-425]. The proposal fails on tests 1 and 2, not on anchor availability,
which distinguishes it from `collaboration`, refused for having "No anchor row"
[SOURCE: specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/refusal-reproduction.md:22].

**REQ-007 reproduction check:** the ten prior refusals still reproduce for their recorded
reasons: gate-discipline (Test 1), git/PR (Test 2 plus 3.2), communication-format (Test 3.1),
testing (Test 3.2), security (Test 3.4), memory, spec-folder, skill-routing and
delegation-mechanics (Test 2), collaboration (Test 3.1 plus 3.4)
[SOURCE: specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/refusal-reproduction.md:13-22].
Nothing in this proposal changes a test condition, and the proposal fails the same battery.

---

## Q3. Restraint Test

**Answer: no failure caused by the absence of this rule can be evidenced. That is the
finding.**

The bar: "what fails today without this rule?" Nothing concrete means refuse, with "might need
it", "best practice" and "for completeness" named as the guarded vocabulary. A named failure
makes the proposal admissible
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:110-114].

The search covered this repository's own artifacts, git history and spec records:

- Git history greps for "next step", "close-out", "AskUserQuestion" and "operator asked,
  wanted, needed or requested" produced no commit recording a turn that lost the operator's
  next action or a prose question a structured one would have prevented.
- Spec-record greps for "what do I do next", "didn't tell me", "no clear next", "awaiting the
  operator", "over to you" and "had to ask" produced no matching incident.
- The two adjacent clauses have provenance checks: the always-loaded close-out row arrived in a
  broad release restructure, not an incident [SOURCE: git commit cec61520b65], and the
  consolidated question clause arrived in a large spec-kit restructure
  [SOURCE: git commit 292ce5163b9].

What is evidenced instead is a normative gap statement, "a reader who finishes an honest
status still has to work out what is now theirs to do", authored as part of this request
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:66-69]. A request and a gap claim
are not an incident record.

Two counter-facts bound the finding. First, the pattern already exists at handoff boundaries:
sub-agent contracts require "orchestrator-side next actions"
[SOURCE: .opencode/agents/context.md:43] and "next actions" in handoff records
[SOURCE: .opencode/agents/debug.md:63], and session end routes to a continuation prompt
[SOURCE: AGENTS.md:485]. The request extends a known pattern to every turn, which is a
consistency argument rather than a failure repair. Second, the nearest failure-shaped record,
the operator's objection that a triggered file "does not load on a turn with no trigger"
[SOURCE: git commit 40462913174], is a load-mechanics objection already resolved by the
total-trigger mitigation, and it decided Q1, not this test.

**Consequence:** the restraint test returns "nothing concrete" for any net-new rule artifact
and routes to a recorded refusal
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:112-114] and
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:134]. No new
rule file, and no net-new rule section, is warranted on its own merits. The set's own
direction of travel agrees: its recovered history favors subtraction, and "A review of a rule
set that only adds has not reviewed it"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:107-111].

---

## Q4. Scope Boundary Test

**Answer: half (B) sits Out, and admitting it would be the fourth widening, of the
selection-shaped kind the router already pre-refuses.**

`REPO RULES.md` §4 In, verbatim:

> **In:** how to think and act, restraint, scope, evidence, risk, diagnosis, honesty,
> the posture to hold when work is handed to another runtime, how the resulting reply
> reads, and what you may claim about wiring you have changed. Delivery joined the list
> when `AGENTS.md` §8 moved down; it is the one rule here whose trigger is every
> substantive reply rather than a specific action, and §8 keeps the two clauses that
> must bind even when nothing loads.

`REPO RULES.md` §4 Out, verbatim:

> **Out:** skill routing, workflow selection, spec-folder mechanics, and the *mechanics*
> of agent and CLI dispatch: which agent, which command, which model, which flags.
> Those belong to `AGENTS.md` §2 and the skills it routes to, and are deliberately
> absent here so each has exactly one place to change. The line is between plumbing and
> posture: how to dispatch is theirs, how to think while dispatching is ours.

[SOURCE: REPO RULES.md:73-78] and [SOURCE: REPO RULES.md:80-84]. "Out is not advisory"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:55-57].

Half (A) sits In under "evidence" and "how the resulting reply reads", but the always-loaded
test decides it earlier, so scope never reaches it.

Half (B) sits Out because the operator's own constraint places it there. A structured question
tool is an ask-surface interface, and the operator decided the naming must be per runtime
rather than runtime-agnostic [SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:87].
Naming a tool per runtime is selecting which interface to use, the "which command" family
[SOURCE: REPO RULES.md:80-84]. The posture half of the idea, ask only decision-changing
questions and prefer a structured choice, is already carried
[SOURCE: repo-rules/communication.md:196-200] and [SOURCE: AGENTS.md:131-132]. What remains
for the rules set is tool names, which is mechanics.

The widening ledger: the router has widened "exactly three times and every time deliberately,
to admit delegation posture, then delivery, then a narrow routing carve-out"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:72-76], and
the integration record names the same three while requiring the scope check before any trigger
row is written
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:45-60].
Half (B) would be the fourth widening, and the router's own third-widening paragraph refuses
exactly this shape: "A fourth widening that admits selection itself would dissolve the
boundary; this one does not" [SOURCE: REPO RULES.md:86-91]. The third carve-out is not a
precedent because it admits verification of wiring while still refusing selection, and its rule
"carries no route-selection guidance" [SOURCE: REPO RULES.md:88-90] and
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:78-79].

Only the operator can widen §4, and the integration record says so explicitly: "if the scope
statement excludes a proposal, that is a refusal, not a paperwork problem. The mode does not
widen §4 unilaterally; that is an operator decision, and each of the three was one"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:57-60].
The parent packet already leaves the widening open as phase 002's operator question, not a
standing decision
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:143-145].

A Test 2 refusal routes to `AGENTS.md` §2 and the skills it routes to, not to `repo-rules/`
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:65-68].

---

## VERDICT

**Verdict: `AGENTS.md-row`. Deciding test: the always-loaded test (Q1).**

The close-out obligation does not belong in the repo-rules set. Half (A) is always-loaded
content: it must bind on read-only turns where no trigger fires and no rule file loads
[SOURCE: AGENTS.md:121-122], so the rule-file route is refused and the content belongs in
`AGENTS.md` as a compressed row
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:38-41]. The
natural site is the existing close-out row in §10, "Close substantive turns with honest
status: what ran/read and result, what's inferred, what only user can verify; committed vs
pushed or dirty" [SOURCE: AGENTS.md:515], extended with the operator's next actions. Because
`AGENTS.md` changes beyond a pointer escalate to the operator, that edit is the operator's
call, not this phase's
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:120-127].

The rest of the battery, recorded so the outcome is complete:

| Half | Outcome | Test that decided it |
|------|---------|----------------------|
| (A) turn ends with the operator's next actions | `AGENTS.md` compressed row, not a rule file | Always-loaded test [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:38-41] |
| (B) structured question tool named per runtime | Refused from the rules set | Scope boundary test, Out and fourth-widening pre-refusal [SOURCE: REPO RULES.md:86-91] |
| Any net-new rule file or net-new rule section | Not warranted | Restraint test, no evidenced failure [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:112-114] |

Two caveats for phase 002. First, the counter-reading of Q1 is that `evidence-and-proof.md` §10
could host half (A) because closing out is itself a trigger row
[SOURCE: REPO RULES.md:42]. It lost on the Gate 5 read-only exclusion and the audit
measurement [SOURCE: specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:90].
Second, half (B)'s per-runtime naming is not thereby forbidden everywhere: it is merely Out of
this rule set. If wanted, it belongs to `AGENTS.md` §2 or the runtime surface skill, and only
an explicit operator decision could widen §4 to admit it
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:57-60].
The restraint finding stands as its own result: no incident justifies the addition, so the row
is preference-driven, and the packet's own success criterion treats a refusal as acceptable
[SOURCE: specs/agents/009-turn-closeout-next-steps/001-deep-research/spec.md:124-126].
