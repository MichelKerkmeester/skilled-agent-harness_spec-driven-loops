Framework: STAR

# Iter 017 — Track 4 (007-code-graph deep-read) — duplicate / overlap detection

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

007-code-graph is the code-graph extraction arc. Iter 015 cataloged, iter 016 classified. Now identify overlaps that should merge.

## Task

For every overlap (pair or 3+ group) within 007 children, propose a merge target.

## Action — Pre-planning steps

1. Read iter 015 + 016.
2. Compare problem statements + delivered artifacts.
3. Group overlaps.
4. Propose merge target per overlap.

## Result — Acceptance criteria

- ≥ 2 citations per overlap
- Every pair / group has merge proposal
- Load-bearing siblings noted
- JSONL row appended

## Research Question (scoped)

For `026/007-code-graph/`: overlapping pairs? overlapping groups? merge targets? load-bearing siblings?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md`

Same structure as iter 009 / 013.

**Append one row to:** `research/deep-research-state.jsonl` with track=4, iter_id="017".

## Context

Track 4 of 999. Feeds iter 018 (007 consolidated phase-list).
