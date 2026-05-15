Framework: BUILD

# Iter 015 — Track 4 (007-code-graph deep-read) — map nested children + natural grouping

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Map every nested child under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/` and identify the natural thematic grouping. 007 is the code-graph extraction arc.

**Steps:**

1. List every direct subdirectory of `007-code-graph/`.
2. For each NNN-name subdir, read `description.json`; capture name + description + status + last-modified.
3. Group by theme.
4. Identify cross-packet arcs.

**Acceptance criteria per step:**

- Every direct subdirectory enumerated
- Every NNN-name has 4 fields
- Thematic groups defined
- Arcs named

**Stop condition:** Emit iteration-015.md then exit.

**Verification:** Catalog complete. JSONL row appended.

## Research Question (scoped)

For `026/007-code-graph/`:

1. What nested children exist?
2. Natural thematic grouping?
3. Cross-packet arcs?
4. Main arc that defines 007's purpose?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md`

Same heading structure as iter 007 / 011.

**Append one row to:** `research/deep-research-state.jsonl` with track=4, iter_id="015".

## Context

Track 4 of 999. Sets up iter 016-018 for 007 deep-read.
