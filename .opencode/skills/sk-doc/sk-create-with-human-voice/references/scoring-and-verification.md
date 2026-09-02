---
title: "Voice Scoring And Verification"
description: "How a Human Voice Rules score is computed without double-counting, why the mechanical pass runs before the judgment pass, and why a rewrite is not finished until the scan is re-run against the new text."
trigger_phrases:
  - "hvr scoring arithmetic"
  - "rule precedence first match wins"
  - "voice pass order"
  - "re-scan after rewrite"
  - "mechanical versus judgment findings"
importance_tier: important
contextType: implementation
version: 1.1.0.2
---

# Voice Scoring And Verification

The standard defines the penalties. This document defines the order they are applied in,
the arithmetic that stops one word being charged twice, and the check that proves a
rewrite actually landed.

---

## 1. OVERVIEW

### Purpose

The standard sets the penalties. This document sets the order they are applied in, the
arithmetic that stops one word being charged twice, and the check that proves a rewrite
landed rather than only claiming it.

### When to Use

Load it once the scope gate has settled what may be touched, and before any number is
computed or quoted.

### Core Principle

A single after-score proves nothing. The pass reports both numbers, or it reports that it
did not measure.

---

## 2. TWO PASSES, IN THIS ORDER

### Pass One: Mechanical

Run `scripts/hvr_scan.py` against the target. It parses the term lists out of the standard
at run time and reports punctuation bans, blocker words, blocker phrases and soft
deductions, with a line and column for each.

This pass runs first because it is cheap, complete over its own subset, and unarguable. A
reader who starts with judgment spends attention on rhythm while a hard blocker sits
unfixed on line 8.

The scanner produces **candidates, not verdicts**. Every finding still needs the sense
check from `scope-and-exemptions.md` section 4.

### Pass Two: Judgment

Nothing in this list can be settled by a pattern, so a reader settles all of it:

- Structural patterns: three-item enumerations, exactly three H3s under every H2, setup language, false ranges, fragmented headers.
- Sentence-level habits: copula avoidance, synonym cycling, unnecessary modifiers, hedging where the facts support certainty.
- Content habits: banned metaphors used as metaphors, vague generalisations, significance inflation, generic positive conclusions.
- Voice: active voice, direct address, sentence rhythm, opinions the writer actually holds.

The scanner prints this list on every run so the reader cannot mistake a clean mechanical
result for a clean document.

---

## 3. THE ARITHMETIC

A document starts at 100. Findings subtract. The standard's precedence rule (its section
5) settles what happens when one span matches several rules.

**One occurrence, one penalty, first match wins.** The order is: hard phrase blocker,
then hard word blocker, then context-dependent when metaphorical, then a soft two-point
deduction, then a soft one-point deduction, then an advisory flag worth nothing.

Two consequences worth stating outright.

A term listed as both an extended blocker and context-dependent is charged once, as the
hard blocker. `landscape` and `ecosystem` are both. The scanner already collapses these.

A longer phrase beats a shorter term inside it. The blocked phrase
`in today's digital landscape` costs five points once, not five for the phrase plus five
for `landscape`. The scanner claims the span and refuses to charge it twice.

Both blocked terms above sit inside code spans, on one line each, so this document does not
score itself. A code span broken across two lines is not masked, and the scanner reports
the word inside it. That is worth knowing before you quote a banned term in prose.

**Transitions are counted, not charged.** `however`, `furthermore`, `moreover`,
`additionally` and `consequently` cost a point only from the third use of the same word
onward. The scanner implements this. A hand count usually gets it wrong.

### Bands

| Score | Meaning |
|---|---|
| 85 and above | Publish |
| 70 to 84 | Revise before publishing |
| Below 70 | Rewrite |

For a document past roughly 400 lines, report the hard-blocker count and the deduction
density instead. `scope-and-exemptions.md` section 5 says why.

---

## 4. THE REWRITE IS NOT THE END

Rewriting to remove tells introduces new ones. A sentence rewritten to drop `leverage`
reaches for `utilise`. A paragraph rewritten to drop a three-item list becomes a
four-item list where the fourth item says nothing.

So the pass has a closing step that is not optional: **run the scanner again on the
rewritten text and compare.** Report both numbers.

A run that reports only the score after the edit has proved nothing. The before-number is
what makes the after-number mean something, and it is the only evidence that the pass
changed anything at all.

---

## 5. WORKED EXAMPLE

`sk-create-repo-rule/README.md` was written to this standard and reviewed before it
shipped. Scanning it finds:

```text
x2  hard   word-blocker           harness
x7  soft1  soft-deduction         do
x3  soft1  soft-deduction         take
x9  review oxford-comma-candidate , and
```

Two hard blockers on a document that passed review. Both are the noun `harness`, meaning
the AI runtime, which is the literal sense the standard permits. The right outcome is two
recorded exemptions and no edit.

This is the shape of a normal result. The scanner over-reports on purpose, because a
missed hard blocker costs more than a candidate the reader dismisses in a second.

---

## 6. VERIFYING THE SCANNER ITSELF

The scanner reads its term lists from the standard, so a change to the standard's section
headings can leave it parsing nothing. It fails closed on that: a parse thinner than the
floors in `MINIMUM_TERMS` stops the run with exit 2 rather than reporting a clean scan.

Two controls prove it, and both belong in any change that touches the parser:

```bash
PACKET=.opencode/skills/sk-doc/sk-create-with-human-voice

# The dirty fixture must report 6 hard blockers and exit 1.
python3 "$PACKET/scripts/hvr_scan.py" "$PACKET/scripts/tests/fixtures/voice-dirty.md"

# The clean fixture must report nothing and exit 0.
python3 "$PACKET/scripts/hvr_scan.py" "$PACKET/scripts/tests/fixtures/voice-clean.md"
```

The dirty fixture also carries its violations a second time inside a fenced block and an
inline code span. Those must not appear in the output. If they do, the masking broke and
every scan since is suspect.

---

## 7. RELATED RESOURCES

- [`../SKILL.md`](../SKILL.md) - the workflow that runs these passes.
- [`scope-and-exemptions.md`](scope-and-exemptions.md) - what the passes are allowed to touch.
- [`../assets/voice-report-template.md`](../assets/voice-report-template.md) - the shape of the result.
- [`hvr-rules.md`](hvr-rules.md) - the penalties, the term lists and the pre-publish checklist.
