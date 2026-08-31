---
title: "Creation Standards: Is This Rule Worth Loading?"
description: "The bar above the structural floor. A rule can pass every structural check and still be worth nobody's context; these five tests decide whether it earns the load, and each is met by all nine shipped rules."
trigger_phrases:
  - "creation standards"
  - "is this rule worth loading"
  - "quality bar"
  - "well formed but thin"
  - "does this section earn its place"
  - "reviewing a draft rule"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Creation Standards: Is This Rule Worth Loading?

`rule-anatomy.md` decides whether a file is *shaped* like a rule. That is checkable and it
is not enough — a rule can satisfy every structural assertion and say nothing a reader
would change their behaviour over.

These five tests are read out of what the nine shipped rules already do. Every one passes
on all nine. Each is a question a reviewer answers by reading; none can be automated, and
that limit is the reason they live here rather than in the structural floor.

---

## 1. THE SECTION TEST

**A numbered section earns its place by making clear what goes wrong without it.**

This is the test the corpus meets least obviously and most consistently. Two rules state
it outright with a `The failure this prevents:` line. The other six carry it in the
section's substance instead:

- `evidence-and-proof.md` §3 is titled **THE FOUR WAYS A GREEN RUN LIES** and then
  enumerates them. The section *is* the failure.
- `uncertainty-and-honesty.md` §3 says "agreeing for conversational flow is a failure
  mode, not politeness" and "praise that is not earned makes the earned kind worthless".
- `blast-radius.md` §2 prices every tier by **cost when wrong**.

**So the standard is the identifiability, not the sentence.** An explicit
`The failure this prevents:` line is a good habit and not a requirement; a section whose
substance is the failure has already met the test.

**The check:** read the section and say aloud what breaks without it. If you cannot,
the section is a topic rather than a rule, and it goes.

> A grep cannot run this test. An early attempt to measure it by pattern reported two of
> eight rules as compliant — the two most recently written, because they happened to share
> a phrasing. The corpus was fine; the measurement was wrong.

---

## 2. THE TRIGGER-PHRASE TEST

**Phrases are what someone types when they have the problem, not what the section is called.**

Section titles are already greppable from the body. A phrase earns its place by catching a
reader who has the problem and does not know the rule exists.

| Good | Useless |
|------|---------|
| "it's a flake" | "root cause methodology" |
| "while I was in there" | "scope management" |
| "might need it later" | "the restraint ladder" |

**Two hard constraints:**

- **No phrase may appear in two rules.** The set carries 161 phrases with zero collisions;
  a duplicate makes both rules unfindable by it.
- **Aim for 15-20.** The observed range is 16-20. Fewer leaves the rule hard to reach;
  many more usually means section titles crept back in.

---

## 3. THE BINDING-SENTENCE TEST

**One sentence, one obligation.**

If the binding sentence needs a conjunction to hold two demands, it is either two rules or
one vaguer rule than you actually have. Check by removing everything after the "and" — if
what remains is still the rule, the second half belonged in a section.

A binding sentence that could be printed on its own and still direct behaviour has passed.
One that only makes sense after reading the body has not.

---

## 4. THE SELF-CHECK TEST

**One item per obligation the body creates — never one per section.**

A self-check that mirrors the section titles is a table of contents with checkboxes. It
tells a reader what the rule contains, which they can see, instead of what they must have
done, which is the point.

Observed range is 5-11 items, and it does not track section count: `overengineering.md`
has 6 sections and 5 items; `delegation-and-orchestration.md` has 9 sections and 11. The
number follows the obligations, not the structure.

**The check:** for each item, name the sentence in the body that created that obligation.
An item with no such sentence is decoration; a body obligation with no item is a gap.

---

## 5. THE MISREADING GUARD

**A rule that could be read as licence to do less needs a section saying it is not.**

Three of eight carry a `WHAT THIS RULE IS NOT` section, and the pattern is instructive —
all three are rules whose surface reading permits *less* work:

| Rule | The misreading it refuses |
|------|---------------------------|
| `overengineering.md` | "build less" becoming licence to under-deliver frozen scope |
| `delegation-and-orchestration.md` | "orchestrate it" becoming licence to delegate everything |
| `communication.md` | "match length to the question" becoming licence to omit what the reader needs |

The five rules without one are rules that only ever demand *more* rigour — nobody misreads
"fix the producer, not the symptom" as permission to do less.

**The check:** could a tired reader use this rule as an excuse? If yes, refuse that reading
explicitly. If no, the section would be ceremony.

---

## 6. DON'TS

Each is an observed failure, not a preference.

- **Don't cite a best practice without naming what it prevents.** `AGENTS.md` forbids this
  everywhere else; a rule that does it is holding others to a bar it fails.
- **Don't restate another rule.** Link instead — and expect not to need to. The corpus
  carries four sideways links across eight files.
- **Don't write a rule that fires on a topic.** Triggers are actions you are about to take.
  A rule that fires on "thinking about testing" fires never.
- **Don't add a section because the rule looks short.** Length is not the target; three of
  eight sit comfortably under 160 lines.
- **Don't write the self-check last and fastest.** It is the part a reader actually uses
  under time pressure, and it is where a rule most often stops being actionable.

---

## 7. WHAT THIS DOCUMENT IS NOT

- **Not a scoring rubric.** There is no number. Every test needs a reader, and a checkable
  proxy would measure the proxy.
- **Not a gate on whether the rule may exist** — that is `decision-tests.md`, and it runs
  first. These standards assume the rule has already earned the right to be written.
- **Not licence to hold a draft to a bar the corpus does not meet.** Every test here passes
  on all nine shipped rules. A proposed sixth standard that they fail is a wrong standard.

---

## 8. SELF-CHECK

- [ ] For every section, I can say what breaks without it.
- [ ] No trigger phrase of mine appears in another rule.
- [ ] The binding sentence holds one obligation and stands alone.
- [ ] Every self-check item traces to a sentence in the body that created it.
- [ ] If the rule could be read as licence to do less, it says it is not.
- [ ] No best practice is cited without the failure it prevents.
