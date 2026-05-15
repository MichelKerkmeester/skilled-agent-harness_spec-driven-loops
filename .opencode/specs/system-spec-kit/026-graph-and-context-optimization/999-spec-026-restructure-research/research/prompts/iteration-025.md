Framework: STAR

# Iter 025 — Track 6 (cross-026 dup detection) — hidden duplicates (similar work, different names)

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Iter 023-024 surfaced obvious overlaps (similar names, adjacent topics). Now find HIDDEN duplicates — packets whose names and locations suggest different work but which actually solve the same problem.

## Task

Identify hidden duplicates across all of 026 (top-level + nested). For each, document why it was hidden and propose the merge.

## Action — Pre-planning steps

1. Read iter 001-022 outputs (all classifications and per-phase-parent analyses).
2. For each packet, abstract the underlying problem (one sentence, technology-agnostic): "what does this packet fix or build at the conceptual level".
3. Cluster packets by underlying problem.
4. Any cluster with 2+ members where the packets have unrelated names = hidden duplicate.

## Result — Acceptance criteria

- ≥ 2 citations per hidden duplicate
- Every duplicate has the abstracted problem + name-mismatch explanation
- Merge proposal per duplicate
- JSONL row appended

## Research Question (scoped)

Across all 026 children (top-level + nested):

1. Which packets share an underlying problem despite unrelated names?
2. Why was the duplicate hidden? (e.g., one named after the surface, other named after the implementation)
3. Proposed merge target per hidden duplicate?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-025.md`

**Required heading structure:**

```
# Iter 025 — Track 6: hidden duplicates

## Question / Evidence / Findings (hidden duplicates with abstracted problem) / Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=6, iter_id="025".

## Context

Track 6 of 999. Feeds iter 026 (merge GROUPS consolidation).
