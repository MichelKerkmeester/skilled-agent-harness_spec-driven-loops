---
title: "Voice Scope: What HVR Governs And What It Never Touches"
description: "The gate that runs before any voice edit. Decides which spans of a target are prose the Human Voice Rules govern, and which are quoted, generated, frozen or self-referential text a voice edit would damage."
trigger_phrases:
  - "does hvr apply here"
  - "voice scope gate"
  - "hvr exemption"
  - "quoted text voice rewrite"
  - "generated file voice edit"
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Voice Scope: What HVR Governs And What It Never Touches

Run this before the first edit. The Human Voice Rules are a standard for prose you are
writing. Applied to text you are only carrying, they corrupt it.

The standard itself does not draw this line, because it was written for the writing and
not for the tooling around it. Drawing it is this mode's job.

---

## 1. THE ONE QUESTION

**Did this document's author choose these words, and are they free to choose different
ones?**

Yes on both counts means the span is in scope. A no on either means it is not.

That single question settles almost every case below. The rest of this document is the
cases where getting it wrong is expensive enough to name.

---

## 2. NEVER IN SCOPE

### Text You Are Carrying, Not Writing

A voice edit rewrites meaning here, and the damage is silent.

| Span | Why it is out |
|---|---|
| The user's own words, quoted back | Changing them changes what they said |
| An error message, a log line, a stack trace | It has to match what the system actually emits |
| A cited source, a spec quotation, a commit message | The point of a quotation is that it is verbatim |
| A command, a flag, a path, an identifier | `--robust-mode` is a flag name, not a word choice |
| Code, output, JSON and YAML payloads | The sample stops working |
| A test fixture whose bytes are the assertion | The test fails, and the failure looks like a code bug |

The scanner masks fenced blocks, inline code spans and frontmatter for exactly this
reason. It cannot see a quotation in running prose, so you have to.

### Text Something Else Pins

| Span | Why it is out |
|---|---|
| A generated file | The generator overwrites your edit on the next run |
| A shipped spec document | Its bytes are the record of what was decided |
| A released changelog entry | It describes a release that already happened |
| A required heading, template placeholder or frontmatter key | A validator asserts the literal string |
| A file under a byte-drift check | The check fails on the next run and blames whoever is there |

### Text That Is About The Banned Words

`hvr-rules.md` lists every blocked term, so scoring it against itself reports dozens of
hard blockers in a document that is completely correct. So does any reference quoting the
list, any test fixture built to trip the scanner, and any changelog entry naming a term it
removed.

**Self-reference is the trap that makes an automated voice pass look broken.** Confirm the
target is not a document about the standard before you trust a score.

---

## 3. IN SCOPE, WITH A CAVEAT

Documentation prose is the mode's home ground: READMEs, install guides, skill contracts,
reference bodies, implementation summaries, decision rationale, replies to a user.

Two caveats hold across all of it.

**A term's sense decides, not its spelling.** The standard bans `harness` as a verb
meaning "use". This repository also uses `harness` as a noun for the AI runtime, which is
the literal sense and is fine. Same for `landscape` in photography, `ecosystem` in
biology, and `journey` when someone actually travelled. The scanner cannot tell these
apart and reports them all. You decide.

**Accuracy outranks the standard, always.** When removing a banned word changes what the
sentence claims, the sentence stays. Record it as an accepted exception with the reason.
A document that reads beautifully and says something false has failed at the only thing
that mattered.

---

## 4. THE LENGTH CAVEAT

The standard scores "a piece" starting at 100. That framing assumes an article, not a
900-line reference. Long documents accumulate soft deductions by length alone and fall
below zero while reading perfectly well.

For anything past roughly 400 lines, report the hard-blocker count and the deduction
density (deductions per hundred lines) instead of an absolute score, and say which you
used. An absolute score on a long document is a number nobody can act on.

---

## 5. WHAT TO DO WITH AN EXEMPT SPAN

Leave it exactly as it is and say so. An exemption you did not record reads as an
oversight, and the next pass re-flags it.

The report template carries a row for this. One line per exemption: the span, the class it
falls under, and why. That record is what stops the same finding being re-litigated every
time someone runs the scanner.

---

## 6. RELATED RESOURCES

- [`../SKILL.md`](../SKILL.md) - the workflow this gate opens.
- [`scoring-and-verification.md`](scoring-and-verification.md) - the arithmetic, and the re-check after a rewrite.
- [`../../shared/references/hvr-rules.md`](../../shared/references/hvr-rules.md) - the standard itself. This mode never restates it.
