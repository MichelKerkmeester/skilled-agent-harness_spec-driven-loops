# Iteration 1: Q1 Always-Loaded Test and Q2 Scope Boundary Test

## Focus

Two placement questions, both decided by documents already in the corpus. Q1: on a turn where no
trigger fires, must "present the synthesized recommendations in chat" still hold, or is presenting a
synthesis a specific action that makes the obligation trigger-shaped? Q2: which side of
`REPO RULES.md` section 4 does the proposal sit on, and does it need a fifth widening now that
section 4 carries four.

## Findings

**F1.1 The load event is a write, not a message.** Gate 5 is the only mechanism that loads the
router and its rule files, and its trigger is "the FIRST write of the session ... Read-only turns
never fire it"
[SOURCE: AGENTS.md:121-122]. The router's own fallback agrees: with nothing fired, "`AGENTS.md`
alone governs" and the reader is told not to hunt for a rule to apply
[SOURCE: REPO RULES.md:18]. The always-loaded test states the consequence: content that must bind
when no trigger has fired "cannot live in" a rule file, and a yes routes it to `AGENTS.md` as a
compressed row [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:30-41].

**F1.2 Presenting a synthesis is action-conditioned, and the action already has a trigger row.**
A synthesis can only be presented once something has produced one. The producing turn is a write
turn, because the deep loop writes its artifacts before it presents
[SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:271-275]. The trigger table
already carries the matching row: "present a recommendation, a fork, or a trade-off" routes to
`communication.md` [SOURCE: REPO RULES.md:47], and "close out a turn" routes to
`handoff-and-questions.md` [SOURCE: REPO RULES.md:48]. This differs from the close-out obligation,
which had to bind unconditionally because every turn ends, including turns that write nothing. A
synthesis presentation does not occur on every turn. Q1 therefore passes: the behaviour is
trigger-shaped, and the always-loaded test does not force it into `AGENTS.md`.

**F1.3 The unconditional residue is already placed.** One case does escape the trigger: a later
read-only turn where the operator asks what a finished run concluded. No write occurs there, so no
rule file loads, and the same is true for `communication.md` and `handoff-and-questions.md`. The
framework already accounts for this boundary: `AGENTS.md` section 8 keeps the two clauses "that bind
regardless of what loads" [SOURCE: AGENTS.md:428], and its section 10 close-out row binds the turn
end with no rule file at all [SOURCE: AGENTS.md:518]. The near-miss recorded by the doctrine doc
states the general rule: "A total move needs a total trigger, or the content goes quiet"
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:48-51]. The
communication rule survives its move down because its trigger is every substantive reply and two
clauses stayed behind [SOURCE: AGENTS.md:424,428; REPO RULES.md:78-81]. A presentation rule has no
such total trigger, and does not need one.

**F1.4 The mode contracts are the load path for the action moment.** A deep-loop mode's presentation
contract is owned by the command surface and is loaded as part of running the mode, not through
Gate 5: deep research's contract declares itself "Presentation source of truth for `/deep:research`"
and owns "final result displays" [SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:3];
the router loads the mode's YAML after setup [SOURCE: .opencode/commands/deep/assets/deep-research-presentation.txt:19].
That path reaches the moment the trigger table cannot guarantee, including non-interactive and
fan-out completion messages, which is where this lineage's own terminal message is composed.

**F1.5 Q2, quoted verbatim. In:** "how to think and act, restraint, scope, evidence, risk, diagnosis,
honesty, the posture to hold when work is handed to another runtime, how the resulting reply reads,
what you may claim about wiring you have changed, and how a turn hands control back to the operator.
Delivery joined the list when `AGENTS.md` §8 moved down; it is the one rule here whose trigger is
every substantive reply rather than a specific action, and §8 keeps the two clauses that must bind
even when nothing loads." [SOURCE: REPO RULES.md:75-81] **Out:** "skill routing, workflow selection,
spec-folder mechanics, and the *mechanics* of agent and CLI dispatch: which agent, which command,
which model, which flags. Those belong to `AGENTS.md` §2 and the skills it routes to, and are
deliberately absent here so each has exactly one place to change. The line is between plumbing and
posture: how to dispatch is theirs, how to think while dispatching is ours."
[SOURCE: REPO RULES.md:83-87]

**F1.6 It sits In, and no fifth widening is needed.** "How the resulting reply reads" is already an
explicit In clause [SOURCE: REPO RULES.md:77], and the trigger table routes reply delivery on it
[SOURCE: REPO RULES.md:47]. The fourth widening is the ask-surface carve-out: it admits "naming the
surface that asks the operator a question, in the runtime you are already running in", expressly
because nothing is being selected, and it pre-refuses a fifth that "let a rule pick between
runtimes" [SOURCE: REPO RULES.md:96-107]. Presenting a synthesis selects no runtime, agent, command,
model or flag, so it needs no widening at all. Selection remains Out, and anything that started
choosing which mode presents would leave this side of the line
[SOURCE: REPO RULES.md:83-84].

**F1.7 A doctrine-document drift, recorded not fixed.** The live router carries four widenings, but
`decision-tests.md` section 2 still says the router "has been widened exactly three times" and
pre-refuses a fourth widening that admits selection
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:72-76], while the
live section 4 shows the fourth was added as an ask-surface carve-out that admits no selection
[SOURCE: REPO RULES.md:96-107]. The test's verdict for this proposal is unaffected, because reply
delivery was never a widening question, but a reader running Q2 from the doctrine doc alone would
misnumber the widening. This is a stale-citation hazard in a reference owned by another mode, not
this packet's write surface.

## Question Answers

- **KQ-1: trigger-shaped, not always-loaded.** Presenting a synthesis is conditioned on having
  produced one, and the producing turn is a write turn whose action already matches a trigger row.
  The close-out obligation differed because every turn ends. No `AGENTS.md` row is forced by test 1;
  the mode contracts are the load path that reaches the presentation moment, and `AGENTS.md` section
  10 already carries the unconditional turn-end minimum.
- **KQ-2: In, and no fifth widening.** The proposal is "how the resulting reply reads", which is
  already in the In list. It selects nothing, so the fourth widening's pre-refusal of selection does
  not apply to it and no fifth widening is required.

## Ruled-Out Directions

- **An `AGENTS.md` row as the forced outcome of test 1.** Test 1's yes-branch fires only for content
  that must hold when nothing fires. A mode-completion presentation does not occur on such a turn,
  and its load path is the mode contract, so the yes-branch is not reached for the presentation
  content.
- **A fifth widening.** Nothing needs widening: reply delivery is already In, and no selection is
  proposed.

## New Information Ratio

0.9. First pass: the Gate 5 framing, the action-conditioned distinction from the close-out
obligation, the mode-contract load path, and the verbatim section 4 placement are all net-new to
this lineage. The doctrine-drift finding is net-new evidence.
