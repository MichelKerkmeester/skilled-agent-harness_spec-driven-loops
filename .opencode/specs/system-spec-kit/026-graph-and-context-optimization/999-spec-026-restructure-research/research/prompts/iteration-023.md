Framework: STAR

# Iter 023 — Track 6 (cross-026 dup detection) — top-level packet overlaps

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Tracks 1-5 classified every 026 child and proposed phase-lists for the 4 phase parents (014, 013, 007, 009) plus the single-packet children. Now cross-cut the entire 026 to find overlaps at the TOP LEVEL — pairs / groups of 026 direct children that solve the same underlying problem and should merge.

## Task

For every pair or group of top-level 026 children (000 through 015) that overlap, document the overlap and propose a merge target. This is cross-packet-parent analysis — overlaps between single packets (like 008-skill-advisor) and phase parents (like 007-code-graph), or between two single packets.

## Action — Pre-planning steps

1. Read iter 001-006 (top-level classifications) outputs.
2. For each top-level pair, compare problem statements + delivered artifacts.
3. Specifically look for: same target file modified by both, same problem stated differently, one packet completing what another started, similar canonical patterns.
4. Group overlaps.
5. Propose merge target per overlap (note: merging a single-packet INTO a phase parent means it becomes a nested child).

## Result — Acceptance criteria

- ≥ 2 citations per overlap
- Every pair / group has merge proposal
- Cross-packet-type overlaps explicit (single → phase parent merges)
- JSONL row appended

## Research Question (scoped)

For top-level `026/NNN-name/` children (000-015):

1. Which top-level packet pairs overlap?
2. Cross-packet-type overlaps (single ↔ phase parent)?
3. Proposed merge target per overlap?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-023.md`

**Required heading structure:**

```
# Iter 023 — Track 6: top-level packet overlaps

## Question
<framing>

## Evidence
- file:line citations grouped by overlap

## Findings
### Same-type overlaps (single ↔ single OR phase-parent ↔ phase-parent)
- Pair / group: <packets> — overlap area — merge target — what survives

### Cross-type overlaps (single → phase-parent merge)
- Pair / group: <packets> — overlap area — merge target — what survives

## Gaps for next iter
- <RQs for iter 024>

## JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=6, iter_id="023".

## Context

Track 6 of 999. Begins cross-cutting analysis. Feeds iter 024-026 (continued dup detection + groupings).
