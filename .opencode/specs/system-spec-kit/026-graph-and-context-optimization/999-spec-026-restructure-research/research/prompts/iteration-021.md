Framework: STAR

# Iter 021 — Track 5 (009-hook-parity deep-read) — duplicate / overlap detection

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

009-hook-parity is the hook-parity arc. Iter 019 cataloged, iter 020 classified. Now identify overlaps.

## Task

For every overlap (pair or 3+ group) within 009 children, propose a merge target.

## Action — Pre-planning steps

1. Read iter 019 + 020.
2. Compare problem statements + delivered artifacts.
3. Group overlaps.
4. Propose merge target per overlap.

## Result — Acceptance criteria

- ≥ 2 citations per overlap
- Every pair / group has merge proposal
- Load-bearing siblings noted
- JSONL row appended

## Research Question (scoped)

For `026/009-hook-parity/`: overlapping pairs? groups? merge targets? load-bearing siblings?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md`

Same structure as iter 009 / 013 / 017.

**Append one row to:** `research/deep-research-state.jsonl` with track=5, iter_id="021".

## Context

Track 5 of 999. Feeds iter 022 (009 phase-list).
