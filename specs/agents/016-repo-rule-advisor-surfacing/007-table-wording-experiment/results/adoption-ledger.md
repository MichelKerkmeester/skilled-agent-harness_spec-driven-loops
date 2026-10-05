---
title: "Adoption ledger: Table wording experiment"
description: "The short no-table wording as committed to communication.md, with the sentences it replaced."
trigger_phrases:
  - "table wording adoption ledger"
importance_tier: "normal"
contextType: "implementation"
---
# Adoption ledger: Table wording experiment

## 1. CHANGE

`communication.md` §2 carries the short arm's wording from `experiment/arms.json`, unchanged. Version 1.4.1.2 to 1.4.1.3. The same commit adds the 010 phrase "reply too long" to its frontmatter.

- **Before** (current arm): "**No tables in a reply.** One or two facts go in a sentence. Parallel items go in a bulleted list. A table earns its place in a file someone returns to, never in a reply they read once. The one exception is the in-flight block in [`communication-handoff.md`](communication-handoff.md) §6: work still running is a reply the operator returns to while it runs."
- **After** (short arm): "**No tables in a reply,** except the in-flight block in [`communication-handoff.md`](communication-handoff.md) §6. Use a sentence for one or two facts and bullets for parallel items."

The file went from 9,500 to 9,346 bytes, -154 bytes net of the added phrase.

## 2. DROPPED SENTENCES

- "A table earns its place in a file someone returns to, never in a reply they read once." (rationale)
- ": work still running is a reply the operator returns to while it runs." (rationale for the exception, which `communication-handoff.md` §6 carries)

## 3. TIMING

The parent goal's D2 required the 006 window to be measured first. The operator ended further test rounds on 2026-10-05, and the wording landed the same day with Gate 6 and the 010 phrases, so no window isolates it.
