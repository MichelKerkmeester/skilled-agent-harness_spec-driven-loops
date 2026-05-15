Framework: BUILD

# Iter 035 — Track 9 (target-state proposal) — propose consolidated 026 phase list

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Propose the consolidated 026 phase list post-restructure. Target: significantly fewer than current 22 phases (rough goal: 8-12 phases).

**Steps:**

1. Read iter 001-034 outputs.
2. Per-phase-parent recommendations (014/013/007/009) from iter 010 / 014 / 018 / 022.
3. Merge groups from iter 026.
4. Delete-candidates from iter 030.
5. Renames from iter 033 + convention from iter 034.
6. Synthesize all into the target phase list: each proposed phase has name (per convention) + description + constituent current children + rationale.

**Acceptance criteria per step:**

- All prior iter outputs cited (the iter that backed each decision)
- Every current 026 child (top-level + nested) accounted for: kept / merged / deleted / moved
- Target count vs current count explicit
- JSONL row appended

**Stop condition:** Emit iteration-035.md then exit.

**Verification:** Target phase list + accounting per current child. JSONL row appended.

## Research Question (scoped)

For 026 post-restructure:

1. What is the proposed phase list?
2. Per proposed phase: name + description + constituent current children + rationale
3. How does each current child map to a proposed phase (or delete)?
4. Target count vs current 22?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md`

**Required heading structure:**

```
# Iter 035 — Track 9: consolidated 026 phase list

## Question / Evidence / Findings
### Proposed phase list
| # | Name | Description | Constituent children | Rationale |
### Current-child accounting
| Current child | Proposed phase (or DELETE) | Source iter |
### Numeric summary
- Current: 22 top-level + N nested
- Proposed: M phases
- Reduction: %
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=9, iter_id="035".

## Context

Track 9 of 999. The keystone iter — synthesizes 001-034. Feeds iter 036-038.
