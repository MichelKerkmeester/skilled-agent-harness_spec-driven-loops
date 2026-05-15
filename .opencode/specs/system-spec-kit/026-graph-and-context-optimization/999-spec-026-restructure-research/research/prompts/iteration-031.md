Framework: STAR

# Iter 031 — Track 8 (naming-quality audit) — top-level mismatches

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Some top-level 026 children have names that NO LONGER match the actual work that landed. A future operator searching for "graph indexing performance" lands on the wrong packet because the right one is named for the original problem statement that drifted during implementation.

## Task

Identify top-level 026 children whose current name doesn't match the actual work delivered.

## Action — Pre-planning steps

1. Read iter 001-006 (top-level classifications) outputs.
2. For each top-level child, compare: original name (folder name) vs delivered work (spec.md problem statement + implementation-summary final state).
3. Score the mismatch: severe (name describes completely different problem) / mild (name covers part of the work but misses the rest) / fine (name accurately describes the work).
4. Propose a better name for severe + mild mismatches.

## Result — Acceptance criteria

- ≥ 2 citations per mismatch (folder name reference + impl-summary excerpt)
- Per-packet severity score
- Proposed name for severe + mild
- JSONL row appended

## Research Question (scoped)

For each top-level 026 child:

1. Does the current name match the actual delivered work?
2. Severity of mismatch?
3. Proposed better name?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-031.md`

**Required heading structure:**

```
# Iter 031 — Track 8: top-level naming audit

## Question / Evidence / Findings
### Mismatches
| Packet | Current name | Delivered work | Severity | Proposed name |
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=8, iter_id="031".

## Context

Track 8 of 999. Feeds iter 032-034.
