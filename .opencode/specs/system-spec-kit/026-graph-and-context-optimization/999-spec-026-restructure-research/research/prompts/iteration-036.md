Framework: BUILD

# Iter 036 — Track 9 (target-state proposal) — per-phase scope statements

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** For each proposed phase in iter 035, write a tight scope statement (what's in / what's out) and enumerate its constituent current children with citation.

**Steps:**

1. Read iter 035 output.
2. For each proposed phase, author: scope statement (2-4 sentences, in-scope / out-of-scope) + constituent child list with one-line description each + cumulative size of constituent children.
3. Note which constituent children get RENAMED post-merge (per iter 033).

**Acceptance criteria per step:**

- iter 035 read
- Every proposed phase has scope statement
- Constituent list cites source iter (where the merge / classify decision came from)
- Renames flagged

**Stop condition:** Emit iteration-036.md then exit.

**Verification:** Per-phase scope statements + constituent lists. JSONL row appended.

## Research Question (scoped)

For each proposed phase:

1. Tight scope statement (in / out)?
2. Constituent current children with one-line description?
3. Cumulative LOC / file count?
4. Renames within the merge?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-036.md`

**Required heading structure:**

```
# Iter 036 — Track 9: per-phase scope statements

## Question / Evidence / Findings
### Phase 1: <name>
- Scope: in / out
- Constituent children (table: child / one-line / source iter / rename if any)
- Cumulative size

### Phase 2: <name>
<same>
...

## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=9, iter_id="036".

## Context

Track 9 of 999.
