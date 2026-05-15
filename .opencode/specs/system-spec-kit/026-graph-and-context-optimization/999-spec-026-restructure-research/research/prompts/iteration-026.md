Framework: BUILD

# Iter 026 — Track 6 (cross-026 dup detection) — consolidate merge GROUPS (3+ packets)

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Consolidate all overlap findings (iter 023-025) into the final list of merge GROUPS — clusters of 3+ packets that should collapse into one. These are the highest-value merges for the restructure.

**Steps:**

1. Read iter 023 + 024 + 025 outputs.
2. Identify clusters of 3+ packets that share overlapping problem statements.
3. For each cluster, propose: merge target (retained packet) + what survives from each absorbed packet + post-merge name.
4. Estimate the per-cluster size reduction.

**Acceptance criteria per step:**

- All overlap iter (023-025) read
- Every cluster has 3+ members with citations
- Each cluster has a proposed target + retained name
- Size reduction quantified

**Stop condition:** Emit iteration-026.md then exit.

**Verification:** Clusters consolidated. JSONL row appended.

## Research Question (scoped)

Across all of 026:

1. What are the highest-value merge groups (3+ packets)?
2. For each: members, retained target, post-merge name, what survives, size reduction
3. Total size reduction from all merge groups combined

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-026.md`

**Required heading structure:**

```
# Iter 026 — Track 6: merge GROUPS consolidation

## Question / Evidence / Findings
### Merge groups (table: members / retained target / post-merge name / what survives / size reduction)
### Total reduction across all groups
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=6, iter_id="026".

## Context

Track 6 closes here. Feeds track 9 (target-state proposal).
