---
title: "Decision Tests: May This Rule Exist?"
description: "Four tests recovered from the phases that established them, deciding whether a proposed repo rule may exist at all and where its content belongs if it may not. Reproduces the ten refusals the rule set already made."
trigger_phrases:
  - "may this rule exist"
  - "always-loaded versus triggered"
  - "router scope boundary"
  - "rule refusal test"
  - "where does this content belong"
importance_tier: important
contextType: reference
version: 1.1.0.2
---

# Decision Tests: May This Rule Exist?

Run these before writing anything. They decide **whether** a rule may exist, which is a
different question from how it should read — `rule-anatomy.md` answers that one, and only
matters once these four pass.

Each test is recovered from the phase record that established it, not restated from
memory.

---

## 1. THE ALWAYS-LOADED TEST

> **A rule file loads on a trigger. Content that must bind when no trigger has fired
> cannot live in one.**

This is the test that decides most refusals, and it is the least intuitive, because a
rule can be correct, well-written, and still belong somewhere else entirely.

**Ask:** on a turn where nothing fires, must this still hold?

- **Yes** → it belongs in `AGENTS.md`. Refuse the rule.
- **No** → continue to test 2.

**Recovered from:** the research phase found 18 row-groups in `AGENTS.md` that could not
move down, and they "reduce to one property: always-loaded force." The adoption phase
applied it to refuse relocating Violation Recovery, whose trigger fires exactly when the
trigger-loaded path may already be broken.

**The instructive near-miss:** the communication rule moved almost entirely out of
`AGENTS.md` §8 anyway, on an operator decision. It survives only because its trigger was
widened to *every substantive reply* — and §8 still keeps the two clauses that must bind
unconditionally. A total move needs a total trigger, or the content goes quiet.

---

## 2. THE SCOPE BOUNDARY TEST

> **The router states what the rule set is In and Out for. Out is not advisory.**

**In:** how to think and act — restraint, scope, evidence, risk, diagnosis, honesty, the
posture when work is handed to another runtime, and how the resulting reply reads.

**Out:** skill routing, workflow selection, spec-folder mechanics, and the *mechanics* of
agent and CLI dispatch — which agent, which command, which model, which flags.

**Ask:** is the proposal routing, or is it posture?

- **Routing** → refuse. `AGENTS.md` §2 and the skills it routes to own it.
- **Posture** → continue to test 3.

**The line:** *how to dispatch is theirs; how to think while dispatching is ours.*

**Recovered from:** the router's own section 4, which has been widened exactly three
times and every time deliberately — to admit delegation posture, then delivery, then a
narrow routing carve-out. The third is the instructive one: it admits *verifying wiring
you changed* as an evidence obligation, and still refuses *selecting* a route. A fourth
widening that admitted selection would dissolve the boundary the set exists to hold.

**So the test did not get weaker.** Ask which side of the carve-out the proposal sits on.
A rule about which skill, command, model or flags to pick is still refused here.

---

## 3. THE FOUR-PART REFUSAL TEST

A proposal must pass **all four** to become a rule file.

| # | Condition | Fails when |
|---|-----------|-----------|
| 1 | It is a **trigger-shaped cluster** | It is a single row, not a cluster. One row is a section in an existing rule |
| 2 | It has **no existing home** | Another rule already carries it, and the proposal is duplication |
| 3 | It is **not design-excluded** | Test 2 already refused it |
| 4 | It has an **`AGENTS.md` anchor** | Nothing in the always-loaded document points at it, so nothing would ever load it |

**Recovered from:** the adoption phase used exactly this to refuse ten candidates —
gate-discipline, git/PR, communication-format, testing, security, memory, spec-folder,
skill-routing, delegation-mechanics, and collaboration.

**Reproduction check.** These four must still refuse all ten, for the same reasons. If a
candidate now passes, either the test has drifted or the set has changed and the change
must be deliberate.

---

## 4. THE RESTRAINT TEST

> **The rule set is subject to its own `overengineering.md`.**

A set that grows because more rules feel thorough has failed the rule it ships.

**Ask:** what fails today without this rule?

- **Nothing concrete** → refuse. "Might need it", "best practice", and "for completeness"
  are the vocabulary that rule guards against.
- **A named failure** → the proposal is admissible; write it.

**Recovered from:** the research phase returned zero new rule files across five
iterations, and its single most valuable output was a **subtraction** — a duplicated
restraint ladder whose rung numbering contradicted the authoritative one.

**A review of a rule set that only adds has not reviewed it.**

---

## 5. WHERE IT GOES IF IT IS NOT A RULE

Refusing is not the end of the decision. Every refusal routes somewhere:

| Refused by | Belongs in |
|------------|-----------|
| Test 1, always-loaded | `AGENTS.md`, as a compressed row |
| Test 2, routing | `AGENTS.md` §2, or the skill its router resolves |
| Test 3 part 2, has a home | A new section inside the rule that already owns it |
| Test 3 part 1, single row | A section, not a file |
| Test 4, restraint | Nowhere. Record the refusal with its reason so it is not re-proposed |

**Record every refusal with the test it failed.** A declined proposal with a written
reason is what stops the same suggestion arriving next quarter with nobody remembering
why it was refused.

---

## 6. SELF-CHECK

- [ ] The proposal was tested against all four gates, in order, before any drafting.
- [ ] Test 1 was answered by asking what happens on a turn where nothing fires.
- [ ] The scope boundary was quoted, not paraphrased, when it decided a refusal.
- [ ] The four-part test still refuses the ten candidates the set already declined.
- [ ] The restraint test was answered with a failure that happens today.
- [ ] A refusal names the test it failed and where the content goes instead.
