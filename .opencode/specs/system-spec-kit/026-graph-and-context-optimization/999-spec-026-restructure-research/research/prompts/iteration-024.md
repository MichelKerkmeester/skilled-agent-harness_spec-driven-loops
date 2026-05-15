Framework: STAR

# Iter 024 — Track 6 (cross-026 dup detection) — cross-phase-parent overlaps

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Iter 023 surfaced top-level packet overlaps. Now go deeper: find overlaps that span ACROSS phase parents — e.g., a nested child of 007-code-graph that overlaps with a nested child of 008-skill-advisor, or a packet under 009-hook-parity that overlaps with one under 013-doctor-update-orchestrator.

## Task

Identify cross-phase-parent overlaps among nested children. For each, propose a merge target.

## Action — Pre-planning steps

1. Read iter 007 / 011 / 015 / 019 (the four phase-parent catalogs).
2. Read iter 008 / 012 / 016 / 020 (the four phase-parent classifications).
3. Cross-reference: for each pair of phase parents, identify any nested children that solve overlapping problems.
4. Propose merge targets. Note: a cross-parent merge may require moving a packet from one parent to another, or creating a NEW parent that contains both.

## Result — Acceptance criteria

- ≥ 2 citations per cross-parent overlap
- Every overlap has a merge proposal (target parent + retained packet)
- JSONL row appended

## Research Question (scoped)

For nested children across 014 / 013 / 007 / 009:

1. Which cross-parent pairs overlap?
2. Which cross-parent groups (3+) overlap?
3. Proposed merge target per overlap (target parent + retained packet)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-024.md`

**Required heading structure:**

```
# Iter 024 — Track 6: cross-phase-parent overlaps

## Question / Evidence / Findings (cross-parent pairs + groups) / Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=6, iter_id="024".

## Context

Track 6 of 999. Feeds iter 025-026.
