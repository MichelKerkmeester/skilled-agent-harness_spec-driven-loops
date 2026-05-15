Framework: STAR

# Iter 013 — Track 3 (013-doctor-update-orchestrator deep-read) — duplicate / overlap detection

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

013-doctor-update-orchestrator is the doctor consolidation arc. Iter 011 cataloged its children; iter 012 classified each. Now identify duplicate / overlapping packets that should merge.

## Task

For every pair or group of 013 children that overlap, document the overlap and propose a merge target.

## Action — Pre-planning steps

1. Read iter 011 (catalog) + 012 (classifications).
2. Compare problem statements + delivered artifacts across packet pairs.
3. Group overlaps (pairs vs 3+).
4. Propose merge target per overlap.

## Result — Acceptance criteria

- ≥ 2 file:line citations per overlap
- Every pair / group has merge proposal
- Load-bearing siblings explicitly noted
- JSONL row appended

## Research Question (scoped)

For `026/013-doctor-update-orchestrator/`:

1. Which packet pairs overlap?
2. Which 3+ packet groups overlap?
3. Proposed merge target per overlap?
4. Load-bearing siblings (look overlapping, actually distinct)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-013.md`

Same heading structure as iter 009 (Overlap pairs / Overlap groups / Load-bearing siblings).

**Append one row to:** `research/deep-research-state.jsonl` with track=3, iter_id="013".

## Context

Track 3 of 999. Feeds iter 014 (consolidated phase-list for 013).
