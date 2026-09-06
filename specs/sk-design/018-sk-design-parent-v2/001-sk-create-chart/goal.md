---
title: "Goal: relocate the chart spec packet under this parent"
description: "Move a closed, green, pushed packet of 299 directories without breaking its metadata, and record that it is relocated work rather than authored work."
importance_tier: important
contextType: reference
version: 1.0.0.0
---

# Goal

Move `specs/sk-doc/051-sk-create-chart` here, intact, so the chart corpus history reads as phase one
of this packet.

**Inherits the parent `goal.md`. Where this file and that one disagree, that one wins.**

## What makes this different from the other phases

Nothing here is authored. This is a relocation of finished work: 299 directories, already nesting
three packet levels deep, which become five under this parent. That depth is a known and accepted
cost, ruled on by the operator after both the orchestrator and an independent planner advised
against it. It is recorded, not re-argued.

## Order

This runs **fourth**, after the skill it describes has actually moved. A spec packet must not
describe a skill at a path that does not exist yet.

## Mechanics that are easy to get wrong

1. `git mv` the tree, and verify `R` status before committing.
2. Repair the derived frontmatter pointers and fingerprints for the moved packet.
3. Backfill the fields the repair tool refuses: the spec-folder pointer, the parent chain, the
   packet id and the children ids.
4. Sweep **both** track roots for references to the old path. 219 files carry it.
5. Regenerate the trigger index; it is lexical over spec docs and goes stale silently.

## Done

`validate.sh --strict` prints `RESULT: PASSED` for the moved packet, taking the first `RESULT:` line.
No file anywhere still points at `specs/sk-doc/051-sk-create-chart`. The chart corpus checker still
prints `RESULT: PASSED`, because the skill and its spec must agree after both have moved.
