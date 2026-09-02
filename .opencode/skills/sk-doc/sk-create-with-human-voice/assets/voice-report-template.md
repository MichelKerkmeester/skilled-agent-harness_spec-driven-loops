---
title: "Voice Report Template"
description: "The fixed shape of a human-voice pass result: scope decisions, both scan numbers, judgment findings, recorded exemptions and what was left alone."
trigger_phrases:
  - "voice report template"
  - "hvr pass result"
  - "voice pass output shape"
importance_tier: normal
contextType: implementation
version: 1.1.0.4
---

# Voice Report Template

The fixed shape of a voice-pass result, filled in once per run.

## 1. OVERVIEW

### Purpose

A voice pass is only as good as its record. This blank forces the pass to state what it
was allowed to touch, what it measured before and after, what it declined, and what a
reader still owns.

### Usage

Copy the block in section 2 and fill every row. A row with nothing to report says `None`,
which is a finding in itself. A row you delete reads as a step you skipped. Drop the two
after-columns on a `score` run, where nothing was edited.

---

## 2. TEMPLATE

```markdown
**Target**
- Path or span: `<file, or a description of the passage>`
- Operation: `<apply|score>`
- Length basis: `<absolute score|hard blockers + density>`

**Scope**
- In scope: `<what the pass was allowed to touch>`
- Exempt: `<span>` — `<class from scope-and-exemptions.md section 3>` — `<why>`
- Exempt: `<span>` — `<class>` — `<why>`

**Mechanical scan**
| | Before | After |
|---|---|---|
| Hard blockers | `<n>` | `<n>` |
| Deductions | `-<n>` | `-<n>` |
| Ceiling | `<n>/100` | `<n>/100` |
- Source: `scripts/hvr_scan.py` against `references/hvr-rules.md`

**Judgment findings**
- `<structural, sentence-level, content or voice finding>` — `<fixed|left, with reason>`

**Accepted exceptions**
- `<term or construction kept>` — `<what would have changed if it were removed>`

**Verdict**
- Band: `<publish|revise|rewrite>`
- Remaining: `<what a reader still has to decide, or None>`
```

---

## 3. WHY EACH ROW IS THERE

**Length basis** stops an absolute score being quoted for a document too long to carry
one. Say which measure you used before you quote a number from it.

**Exempt** rows are the record that a finding was seen and declined. Without them the next
pass re-flags the same span, and the pass after that re-flags it again.

**Before and after** columns are the proof the edit landed. One number alone proves
nothing, and a rewrite that scores worse than the draft is a result worth reporting rather
than hiding.

**Accepted exceptions** is where accuracy beating the standard gets written down. A kept
banned word with a stated reason is a decision. The same word with no note is a miss.

**Remaining** is honest handoff. Nothing in the judgment pass is machine-settled, so
handing back a list of what a reader still owns costs a line and saves a re-read.

---

## 4. RELATED RESOURCES

- [`../SKILL.md`](../SKILL.md) - the workflow that produces this report.
- [`../references/scope-and-exemptions.md`](../references/scope-and-exemptions.md) - the classes the exempt rows cite.
- [`../references/scoring-and-verification.md`](../references/scoring-and-verification.md) - where the numbers come from.
