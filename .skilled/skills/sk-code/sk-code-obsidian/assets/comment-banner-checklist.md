---
title: MODULE Banner and Section-Comment Checklist
description: Gate the MODULE banner and numbered upper-case box-drawing section convention in the Note Database plugin — target-state today, distinguished from styles.css's pre-existing CJK cheat sheet, no id leakage.
trigger_phrases:
  - "module banner checklist"
  - "numbered box drawing sections obsidian plugin"
  - "comment banner convention"
  - "styles.css cjk cheat sheet"
  - "spec id in code comment"
  - "section grammar target state"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# MODULE Banner and Section-Comment Checklist

Use this whenever a source file in the Note Database plugin gains a `MODULE:` banner or a numbered
box-drawing section rule. Zero of 249 source files carry either today — this is a target
convention this checklist applies going forward, not a description of the shipped tree.

---

## 1. OVERVIEW

### Purpose

A banner or section rule only earns its keep if it is applied consistently and never used to smuggle
ephemeral tracking information into permanent source. This checklist keeps the convention
mechanical (one shape, applied honestly) and separate from `styles.css`'s existing, unrelated
comment convention, which predates this work and is not being replaced by it in the same motion.

### Usage

Work through the sections in order — the banner shape, numbered sections, the `styles.css`
distinction, and the id-leakage rule — before claiming a file's comment convention is adopted, then
confirm against THE GATE.

---

## 2. THE MODULE BANNER SHAPE

- [ ] Every file gaining the convention opens with a box-drawing `MODULE:` banner naming the file's
  role in one line — mirrored from `sk-code-mobile-cli`'s own banner shape, not invented fresh for
  this plugin
- [ ] The banner states **what the module is**, not **why it was changed** — no packet name, phase
  number, or task id belongs in it (see §5)
- [ ] Applied once per file, at the top, before imports — not repeated per-section or per-export

---

## 3. NUMBERED UPPER-CASE BOX-DRAWING SECTIONS

- [ ] Sections inside the file are marked with a numbered, upper-case box-drawing rule
  (`## 1. IMPORTS`, `## 2. TYPES`, `## 3. RENDER`, and so on) — the same numbering-and-case
  convention this packet's own checklists and references use, applied to source comments instead
  of markdown headers
- [ ] Numbers are sequential within the file and stay stable as sections are added — a later
  insertion renumbers the sections after it rather than reusing or skipping a number
- [ ] A section exists only where it earns its keep — a one-function file does not need five
  numbered sections to look thorough

---

## 4. THE STYLES.CSS DISTINCTION

`styles.css` already opens with its own, unrelated comment convention: a Chinese-language CSS
property cheat sheet (312 CJK comment lines measured) and 65 `===` banners scattered through the
file. That convention predates this packet and is not what §2-3 describes.

- [ ] Did not confuse the CJK cheat-sheet preamble or the `===` banners with the target `MODULE:`/
  box-drawing convention — they are a different, pre-existing grammar
- [ ] Whether `styles.css` gains numbered box-drawing sections over its 18,931 lines, and whether
  that replaces or supplements the CJK preamble, is an explicit operator decision for a later phase
  — not something this checklist or an individual comment-authoring change decides unilaterally
- [ ] If asked to apply the `MODULE:`/section convention to `styles.css` specifically, confirmed
  the operator decision on replace-vs-supplement was actually made, rather than assuming "add the
  new convention" implies "remove the old one"

---

## 5. NEVER LEAK ARTIFACT IDS INTO COMMENTS

- [ ] No banner or section comment names a spec path, packet/phase number, requirement id, task id,
  ADR id, or checklist item id — `AGENTS.md` at the plugin repository root states this as a hard
  rule, and it applies to every comment this convention adds, not only to pre-existing ones
- [ ] Where a comment needs to explain **why** something is the way it is, it records the durable
  reason (a constraint, a workaround, a non-obvious invariant) — never a pointer back to the
  ephemeral document that requested the change
- [ ] Reviewed any comment copied or adapted from a spec document for an accidentally-included id
  before committing it

---

## 6. SCANNER AWARENESS

- [ ] `tools/naming/scan-comments.mjs` does not exist yet at this packet's measured commit — it is
  target-state, built in a later phase of this same packet. Until it lands, banner/section adoption
  is checked by hand, not by a green scanner run
- [ ] Once the scanner exists, treat a file claiming the convention without a matching scanner pass
  as not actually adopted

---

## 7. THE GATE

A file's comment convention is "done" only when: it opens with exactly one `MODULE:` banner stating
role, not history; internal sections use sequential, upper-case, numbered box-drawing rules; no
banner or section comment names a spec/packet/phase/requirement/task/checklist id; and — if the
change touches `styles.css` specifically — the replace-vs-supplement question against the existing
CJK/`===` preamble was an explicit, confirmed operator decision rather than an assumption.
