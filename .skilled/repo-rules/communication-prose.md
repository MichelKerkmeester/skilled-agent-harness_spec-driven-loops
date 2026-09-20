---
title: "Rule: Communication prose"
description: "How a sentence reads: sentence and paragraph shape, plain words, punctuation."
trigger_phrases:
  - "one idea per sentence"
  - "atomic paragraphs"
  - "vary the rhythm"
  - "plain words"
  - "em dash"
  - "remove the dashes"
  - "punctuation"
  - "state the relation"
  - "relation between sentences"
  - "moving parts"
  - "mechanism visibility"
  - "concise is not compressed"
  - "connective tissue"
importance_tier: important
contextType: reference
version: 1.1.1.0
---

# Rule: Communication prose

> Routed from [`REPO RULES.md`](../../REPO%20RULES.md). Load before writing any substantive reply.
> Expands `AGENTS.md`, never overrides it. Where they appear to disagree, `AGENTS.md` wins and this file is wrong. Say so.

## Fires when

- Drafting or editing a sentence a reader will read.
- Choosing between a plain and an exact word.
- Placing a dash, colon or semicolon.
- Splitting or joining sentences.
- Writing a paragraph.

## The rule

**A sentence carries one idea, a paragraph stands alone, the words are plain and the
punctuation never trips the reader.**

---

## 1. SENTENCES AND PARAGRAPHS

**One idea per sentence.** Short, declarative, subject-verb-object where that reads
naturally. When a sentence stacks clauses, split it, nested qualification is where a
reader loses the thread, and it is also where an author hides an unexamined claim. Short
is the shape, not the achievement, what a cut costs, §4 answers that.

**Atomic paragraphs.** Each chunk stands alone. A reader who lands mid-reply should be
able to act on the paragraph in front of them without reconstructing the four above it.

**Vary the rhythm.** Uniform sentence length reads mechanical, and uniform structure
hides emphasis, if every point is a bullet, no point is more important than any other.
Prefer prose when a list would fragment a single argument; the list format implies the
items are independent, and readers believe it.

The failure this prevents: a technically correct reply the reader has to parse twice.

**State the relation between sentences.** Each sentence opens by saying how it attaches
to the one before: because, but, therefore, for example. Side by side is not a
connection, it is only an order.

The failure this prevents: juxtaposition fakes a logical link the writer never stated,
and the reader supplies their own, and supplies a different one.

**Name the mechanism.** When a sentence explains how something works, it names the
moving parts: what acts, what it acts on, what changes. A sentence that reports only
the outcome asks the reader to take the conclusion on faith.

The failure this prevents: a model whose moving parts are never named, so the reader
can remember it and cannot check it.

---

## 2. WORDS

Plain words by default. Reserve exact names for the things that have them, languages,
frameworks, APIs, dependencies, commands, where precision is the point and a synonym
would be wrong.

Introduce unavoidable jargon one term at a time, in a sentence that defines it by use.
Three new terms in one paragraph is a paragraph nobody finishes.

The failure this prevents: the reader stops reading and starts decoding, and stops
noticing whether they agree.

---

## 3. PUNCTUATION THE READER TRIPS ON

**Never use an em dash.** Replace it with a comma, a full stop or a colon, whichever the
sentence actually wanted. A dash is usually hiding a decision you have not made: an aside
that belongs in commas, a second sentence, or a list that belongs after a colon.

Two more from the same family:

- **No semicolon.** Two sentences, or a conjunction.
- **No serial comma.** Drop it before the `and` or `or` that closes a list.

**The failure this prevents:** dashes read as authored voice to a human and as a tell to a
reader who has seen a lot of generated text. Either way they cost trust the content earned.

This rule carries the ban because it fires on every substantive reply. The full standard,
including the vocabulary and structural tells this one does not repeat, is
the Human Voice Rules, which `sk-doc` routes to.
Load all of it when writing a document.

**In a reply, take its voice half and leave its document half.** The voice directives, the
vocabulary lists and the tell lists apply to anything a reader reads, and a reply is read.
The document-structure sections do not, because a reply has no headings, no front matter and
no publish step. A message that presents the result of a long run is the case that decides
this: it is a reply by delivery and a document by content, and it takes the voice half like
any other reply.

---

## 4. CONCISE IS NOT COMPRESSED

**Concise is not compressed.** Concise cuts what the reader does not need and stops.
Compressed cuts further and takes the connective tissue with it: the because, the second
half of a contrast, the noun that a later "this" points back to. After a cut, check the
joints. If a sentence now opens on a "this" that the previous sentence no longer feeds,
the connection was the thing that got cut.

The failure this prevents: brevity that deletes the connective tissue and turns the
reply telegraphic, the reader rebuilds the argument the reply no longer states.

---

## 5. WHAT THIS RULE IS NOT

- **Not a whole-reply rule.** Length, filler, tables and recovery live in
  [`communication.md`](communication.md), this rule stops where the reply as a whole begins.

---

## 6. SELF-CHECK

- [ ] Every sentence carries one idea, and no sentence stacks clauses a reader has to unpick.
- [ ] Every paragraph stands on its own, and the rhythm varies rather than marching.
- [ ] Each sentence says how it attaches to the one before, rather than sitting beside it.
- [ ] Where a sentence explains how something works, it names the moving part.
- [ ] Plain words, with exact names kept only for the things that have them.
- [ ] No em dash, no semicolon, no serial comma.
- [ ] Nothing was compressed past the point where the reader has to re-expand it.
