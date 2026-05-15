Framework: BUILD

# Iter 039 — Track 10 (resource-map structure) — propose parent doc layout

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Propose how the phase-parent's spec.md + resource-map.md + graph-metadata.json should be organized so that resume + search + graph traversal land on the right phase first.

**Steps:**

1. Read iter 035-038 (target-state proposal).
2. Read the current 026/spec.md + 026/resource-map.md.
3. Identify gaps: where does the current 026/spec.md fail to surface the most-likely-searched phase first?
4. Propose a new structure for 026/spec.md + 026/resource-map.md: section ordering, what each section emphasizes, how the phase list is presented (table vs prose vs tree).
5. Propose graph-metadata.json `derived` fields that drive resume / search prioritization.

**Acceptance criteria per step:**

- Current parent docs read (≥ 2 citations)
- Gaps in current organization explicit
- Proposed new structure with section list + one-line description per section
- graph-metadata.json proposed fields with rationale

**Stop condition:** Emit iteration-039.md then exit.

**Verification:** Proposed parent-doc structure. JSONL row appended.

## Research Question (scoped)

For the 026 phase-parent control docs:

1. What organization optimizes resume / search / graph?
2. Proposed 026/spec.md structure?
3. Proposed 026/resource-map.md structure?
4. Proposed graph-metadata.json derived fields?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md`

**Required heading structure:**

```
# Iter 039 — Track 10: parent doc layout

## Question / Evidence / Findings
### Current organization gaps
- <gap> — cited from current spec.md / resource-map.md
### Proposed 026/spec.md structure
- Section 1: <name> — one-line purpose
- Section 2: <name> — one-line purpose
...
### Proposed 026/resource-map.md structure
- Section 1: <name> — one-line purpose
...
### Proposed graph-metadata.json derived fields
- <field>: <value> — rationale
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=10, iter_id="039".

## Context

Track 10 of 999. Feeds iter 040 (sample-query proof points).
