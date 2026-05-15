Framework: BUILD

# Iter 003 — Track 1 (packet inventory) — 026/007 + 026/008 classification (top-level only)

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Classify two direct children of `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` — `007-code-graph` (phase parent — top-level only) and `008-skill-advisor` — on three axes: still-load-bearing / merge-candidate / delete-candidate.

**Important:** `007-code-graph` is a PHASE PARENT with multiple nested children. This iter classifies the PARENT only (its `spec.md`, `description.json`, `graph-metadata.json`, `resource-map.md` if present). The nested children are classified in Track 4 (iter 015-018).

**Steps:**

1. Read 007's phase-parent files (spec.md + description.json + graph-metadata.json + any resource-map.md).
2. List nested children of 007 (e.g. `007/001-...`, `007/002-...`) by name only — do NOT recurse.
3. Read 008's spec.md + description.json + graph-metadata.json + implementation-summary.md.
4. Classify each parent on the three axes.

**Acceptance criteria per step:**

- Step 1: ≥ 3 file:line citations from 007 parent files
- Step 2: nested children listed by name + brief one-line description (from their own description.json or directory name)
- Step 3: ≥ 3 file:line citations from 008
- Step 4: classifications have rationale paragraph citing parent-level evidence only

**Stop condition:** Emit iteration-003.md then exit.

**Verification:** 007 + 008 each classified at parent level. Nested children of 007 listed by name. JSONL row appended.

## Research Question (scoped)

For `026/007-code-graph` (top-level) and `026/008-skill-advisor`:

1. What is the overall arc / theme of this phase parent (007) or packet (008)?
2. Is the phase-parent's grouping still coherent? (007 — does the code-graph extraction arc still hang together?)
3. For 007: list the nested children so a later iter can deep-read them
4. Are there obvious merge candidates with other 026 children? (e.g. should 008-skill-advisor merge with anything?)
5. Is the parent / packet a delete candidate or a load-bearing reference?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-003.md`

Same heading structure as iter 001-002. For 007, add a `### Nested children list` subsection enumerating the nested directories.

**Append one row to:** `research/deep-research-state.jsonl` with track=1, iter_id="003".

## Context

Track 1 of the 999 deep-research run. Phase parents are classified at the top level here; nested children are deep-read in tracks 2-5.
