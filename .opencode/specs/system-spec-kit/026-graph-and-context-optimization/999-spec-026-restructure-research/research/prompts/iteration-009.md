Framework: STAR

# Iter 009 — Track 2 (014-local-llama-cpp deep-read) — duplicate / overlap detection

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

014-local-llama-cpp is the most active phase parent in 026. Iter 007 cataloged its children; iter 008 classified each. Now identify duplicate / overlapping packets — pairs or groups that solve the same underlying problem from different angles and should merge.

## Task

For every pair or group of 014 children that overlap, document the overlap and propose a merge target.

## Action — Pre-planning steps

1. Read iter 007 (catalog) and iter 008 (classifications) outputs.
2. For each packet pair, compare problem statements + delivered artifacts. Look for: same target file modified by both / same problem stated differently / one packet completing what another started.
3. Group overlaps. Two packets that overlap → pair. Three+ packets overlapping → group.
4. For each pair/group, propose merge target: which packet absorbs the others (typically the most-recent + most-complete) and what survives from the absorbed packets.

## Result — Acceptance criteria

- ≥ 2 file:line citations per identified overlap
- Every pair / group has a merge proposal with named target
- Pairs / groups that have NO merge candidate are explicitly noted (load-bearing siblings, not duplicates)
- JSONL row appended

## Research Question (scoped)

For `026/014-local-llama-cpp/`:

1. Which packet pairs overlap? (problem space, file targets, scope)
2. Which 3+ packet groups overlap?
3. What is the proposed merge target per overlap?
4. Are there pairs that LOOK overlapping but are actually load-bearing siblings (e.g., two different angles on the same surface)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-009.md`

**Required heading structure:**

```
# Iter 009 — Track 2: 014 duplicate / overlap detection

## Question
<framing>

## Evidence
- file:line citations grouped by overlap pair/group

## Findings
### Overlap pairs
- Pair 1: <packet A> + <packet B> — overlap area — merge target — what survives
(repeat)

### Overlap groups (3+)
- Group 1: <packets> — overlap area — merge target — what survives
(repeat)

### Load-bearing siblings (look overlapping, actually distinct)
- Pair / group: <packets> — why they look overlapping — why they're actually distinct

## Gaps for next iter
- <RQ for iter 010>

## JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=2, iter_id="009".

## Context

Track 2 of 999. Feeds iter 010 (consolidated phase-list for 014 post-restructure).
