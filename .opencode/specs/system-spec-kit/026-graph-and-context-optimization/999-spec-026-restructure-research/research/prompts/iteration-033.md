Framework: BUILD

# Iter 033 — Track 8 (naming-quality audit) — propose better names for top-N mismatches

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** From iter 031 + 032 mismatch lists, select the top-N highest-priority renames and propose final names.

**Steps:**

1. Read iter 031 + 032.
2. Filter: severe-severity mismatches only (drop mild).
3. For each severe mismatch, propose a final name following the convention chosen in iter 034.
4. Rank by impact on historic recall (how often would the wrong-named packet be hit in a typical search).

**Acceptance criteria per step:**

- iter 031 + 032 read
- Severe mismatches isolated
- Final name per mismatch
- Impact ranking explicit

**Stop condition:** Emit iteration-033.md then exit.

**Verification:** Final names cited. JSONL row appended.

## Research Question (scoped)

From the severe-mismatch list:

1. Top-N highest-priority renames (ranked by recall impact)?
2. Final name per rename?
3. Conservation: does the new name preserve enough of the old for search continuity?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-033.md`

**Required heading structure:**

```
# Iter 033 — Track 8: top-N rename proposals

## Question / Evidence / Findings
### Top-N renames (ranked)
| Rank | Old name | New name | Recall impact | Conservation note |
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=8, iter_id="033".

## Context

Track 8 of 999. Feeds iter 034 + track 9.
