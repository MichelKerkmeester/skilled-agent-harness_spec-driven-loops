---
title: Source Comment Grammar (Target State)
description: The target MODULE banner and numbered box-drawing convention — 0 of 249 files carry one today, measured — distinguished from the pre-existing CJK cheat sheet in styles.css, plus the repository rule against spec/task/checklist ids in comments.
trigger_phrases:
  - "module banner comment obsidian plugin"
  - "box drawing section banner target state"
  - "zero of 249 files carry a banner"
  - "no spec ids in comments"
  - "chinese cjk cheat sheet styles.css"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Source Comment Grammar (Target State)

This packet documents a `MODULE:` banner and numbered box-drawing section convention for the
plugin's source, mirroring `sk-code-mobile-cli`'s own comment grammar. State plainly before
applying it: **this convention is target-state, not shipped.** The measured tree carries zero of
it today.

---

## 1. OVERVIEW

### Core Principle

A comment earns its place by carrying knowledge the code cannot state itself — the durable WHY,
not a restated name or narrated next line. The target grammar makes file structure scannable
(`MODULE:` banner, numbered ALL-CAPS box-drawing sections); it does not yet exist in this plugin's
source, and one repository rule already stands regardless of adoption status: never put a spec
path, requirement id, task id, or checklist id in a code comment.

### When to Use

- Before claiming any file in this plugin follows the `MODULE:` banner convention
- Distinguishing `styles.css`'s CJK cheat sheet from the target box-drawing grammar
- Writing any new comment in this tree, banner-adopted or not
- Auditing a folder's comment coverage before proposing banner adoption there

### Key Sources

- `002-repo-convention-audit/audit.json` → `comments` — the measured counts below
- `styles.css` (lines 1–60ish) — the CJK cheat-sheet preamble, a different, pre-existing
  convention
- `AGENTS.md` (plugin repository root) — the spec/task/checklist id rule, already in force

---

## 2. THE MEASURED STATE

Measured at `6b3d77e` across 249 source files:

| Metric | Count |
| --- | --- |
| Files with a `MODULE:` banner | **0** |
| Files with any box-drawing rule character (`─`) | 4 |
| Files with a leading block comment (any kind) | 32 |
| Total line comments | 1,423 |
| Commented-out code lines | 1 |

The verdict from the audit is direct: no `MODULE:` banner or numbered-section convention exists in
this tree. The 4 files with a box-drawing rule character are not the target grammar's own
convention — they carry it incidentally, for unrelated reasons (ASCII-art alignment inside a
comment, not a structural section marker).

---

## 3. THE PRE-EXISTING CJK PREAMBLE — A DIFFERENT CONVENTION

`styles.css` opens with a 312-line Chinese-language CSS-property cheat sheet plus 65 `===`-style
banner comments marking major sections. This is real, shipped, and load-bearing for the plugin's
original maintainer workflow — it is not the target box-drawing grammar, and a later phase
adopting the target grammar does not silently erase or "fix" it as a side effect. See
`stylesheet-ownership.md` §3 for the full description. Treat the two conventions as distinct: one
is what `styles.css` carries today, the other is what a future phase proposes for `.ts` sources
(and, per the same design plan, potentially for `styles.css` itself as a supplement, not a
replacement).

---

## 4. THE TARGET GRAMMAR (once adopted)

Mirroring `sk-code-mobile-cli`'s convention (`references/comment-grammar.md` in that packet):
every source file opens with a `MODULE:` banner naming its component, and numbered ALL-CAPS
section dividers drawn with box-drawing rules (`─`) mark the body's structure for a reader who
scans rather than reads top to bottom. A purpose comment sits immediately above a non-obvious
function, effect, or CSS rule — stating why it exists, not what its name already says. Sentence
case, no commented-out code, no multi-paragraph comment blocks.

---

## 5. THE STANDING RULE — ALREADY IN FORCE

Regardless of banner adoption status, one rule applies to every comment written in this tree
today: **never embed a spec path, requirement id, task id, ADR id, or checklist id in a code
comment.** `AGENTS.md` states this at the plugin repository root as a hard block, independent of
this packet. Record the durable reason a thing is the way it is instead — never a pointer to the
ephemeral document that decided it.

---

## 6. RELATED REFERENCES

- `stylesheet-ownership.md` §3 — the CJK preamble in full, and the split-file decision it informs.
- `folder-docs.md` — the analogous target convention at folder scope (`README.md`/`CODE.md`).
- `db-class-naming.md` — the class grammar a purpose comment often documents.
