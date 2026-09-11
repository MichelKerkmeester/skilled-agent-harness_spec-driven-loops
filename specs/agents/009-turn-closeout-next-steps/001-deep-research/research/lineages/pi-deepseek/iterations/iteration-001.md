# Iteration 1: Q1 Always-Loaded Test

## Focus

Does the close-out next-steps obligation (half A) have to bind on a turn where no trigger
fires, and does the structured question-tool half (half B) carry the same requirement?
The decision test is explicit: content that must bind when no trigger has fired cannot live
in a rule file, and a "yes" routes it to `AGENTS.md` as a compressed row
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:30-41].

## Findings

**F1.1 The load event is a write, not a message.** Gate 5 is the only mechanism that loads
the router and its rule files, and its trigger is "the FIRST write of the session ... Read-only
turns never fire it"
[SOURCE: AGENTS.md:121-122]. A turn that only reads, explains or reports composes its final
message with the trigger table never consulted, so no rule file can be relied on to be
present at that moment. The router's own fallback agrees: with nothing fired, "`AGENTS.md`
alone governs" and the reader is told not to hunt for a rule to apply
[SOURCE: REPO RULES.md:18].

**F1.2 The audit measured the same gap.** The Gate 5 payload audit scores a read-only
explanation turn at 0 rows fired and 0 tokens loaded, against `AGENTS.md` at 10,622 tokens
loading "Every turn" [SOURCE: specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:73-74]
and [SOURCE: specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:90]. The
close-out message after a read-only turn is therefore governed by `AGENTS.md` alone, whatever
the trigger table promises in principle.

**F1.3 The trigger table itself contains the counter-argument, and it does not survive the
mechanics.** `REPO RULES.md` §2 carries the row "close out a turn" pointing at
`evidence-and-proof.md` [SOURCE: REPO RULES.md:42], and that rule's own `Fires when` list
includes "You are closing out a turn" [SOURCE: repo-rules/evidence-and-proof.md:38]. Read
alone, this suggests the content could ride a rule file, because the close-out action is a
trigger. It cannot, because the load moment is the first write of the session, so a read-only
turn never reaches the table [SOURCE: AGENTS.md:121-122]. The 043 measurement is the observed
proof, not an inference [SOURCE: specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:90].

**F1.4 Half (A) must hold on read-only turns.** The operator asked for the behaviour "Always
... if i need to do something", and the situation where the operator most needs a stated next
action is exactly the read-only turn: an analysis or finding arrives and the decision is now
theirs. The parent packet names this shape of gap: the honest status `evidence-and-proof.md`
requires "is a report about the past. It does not require an action list for the reader"
[SOURCE: specs/agents/009-turn-closeout-next-steps/spec.md:66-67]. Status: the requirement is
confirmed by the request, and the read-only case is the one that decides the test. (Confidence:
high on the mechanics, inferred on how often the operator has an action after a read-only
turn.)

**F1.5 The set already keeps close-out content always loaded.** `AGENTS.md` §10 carries the
always-loaded row "Close substantive turns with honest status: what ran/read and result,
what's inferred, what only user can verify; committed vs pushed or dirty"
[SOURCE: AGENTS.md:515], and §8 keeps two clauses that "bind regardless of what loads"
[SOURCE: AGENTS.md:425]. The pattern of keeping close-out obligations in the always-loaded
document is established, not novel.

**F1.6 The set's own near-miss explains the risk of a rule-file home.** When the
communication rule moved down, the operator's objection was that "a triggered file does not
load on a turn with no trigger, which is most turns", and the mitigation was a total trigger
plus surviving clauses in `AGENTS.md` [SOURCE: git commit 40462913174]. The decision record
states the rule: "A total move needs a total trigger, or the content goes quiet"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:48-51].
Close-out next steps has no total trigger it can claim, because its natural firing moment is
the message, not a write.

**F1.7 Half (B) answers the opposite way.** The question-tool behaviour fires only when a
choice is needed, which is an action-conditioned moment, not every turn. The test's "no"
branch continues to the scope test
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:38-41].
The always-loaded document already conditions its own question clause the same way:
consolidation applies "When multiple inputs are needed"
[SOURCE: AGENTS.md:131-132].

**F1.8 Consequence for shape.** Half (A) belongs in `AGENTS.md` as a compressed row, and the
rule-file route is refused by the always-loaded test itself
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:38-41],
with the routing table confirming "Test 1, always-loaded" maps to "`AGENTS.md`, as a
compressed row" [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:128-131].

## Sources Consulted

- `AGENTS.md` §2 (Gate 5, Consolidated Question Protocol), §8, §10
- `REPO RULES.md` §1, §2
- `repo-rules/evidence-and-proof.md`
- `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md`
- `specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md`
- `specs/agents/009-turn-closeout-next-steps/spec.md`
- git commit `40462913174` message

## Assessment

`newInfoRatio`: 1.0. First pass, all findings are new to this packet.
Confidence: high on the Gate 5 mechanics and the audit measurement, both observed directly.
The operator-need claim in F1.4 is inferential and marked as such.

## Reflection

What worked: reading the load mechanics before the content question. The answer turned on
Gate 5's read-only exclusion, not on the shape of the request.
What failed: the first hypothesis was that the existing "close out a turn" trigger row made a
rule-file home viable. It does not survive the Gate 5 mechanics.
Ruled out: treating the trigger table's close-out row as a load guarantee
[SOURCE: REPO RULES.md:42].

## Recommended Next Focus

Iteration 2: Q2, run the four-part refusal test and inventory what
`repo-rules/evidence-and-proof.md` §10 and `repo-rules/communication.md` §§7-9 already oblige.
