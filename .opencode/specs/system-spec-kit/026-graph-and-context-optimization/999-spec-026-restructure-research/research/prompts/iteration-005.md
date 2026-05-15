Framework: BUILD

# Iter 005 — Track 1 (packet inventory) — 026/012 + 026/013 classification (top-level only for 013)

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Classify two direct children: `012-causal-graph-channel-routing` (single packet) and `013-doctor-update-orchestrator` (phase parent — top-level only).

**Important:** `013` is a PHASE PARENT with nested children (the doctor consolidation arc). This iter does the top level only. 013 nested children are deep-read in track 3 (iter 011-014).

**Steps:**

1. Read 012's spec.md + description.json + graph-metadata.json + implementation-summary.md.
2. Read 013's phase-parent files; list nested children by name.
3. Classify each on the three axes.

**Acceptance criteria per step:**

- Step 1: ≥ 3 file:line citations for 012
- Step 2: 013 phase-parent file:line citations + nested children enumerated
- Step 3: rationale paragraphs cite evidence

**Stop condition:** Emit iteration-005.md then exit.

**Verification:** 2 packets classified. JSONL row appended.

## Research Question (scoped)

For `026/012-causal-graph-channel-routing` and `026/013-doctor-update-orchestrator` (top-level):

1. What did 012 ship? Is the causal-graph routing change still load-bearing?
2. What is 013's overall arc? Is the doctor-orchestrator grouping coherent?
3. List 013's nested children
4. Merge candidates?
5. Delete or load-bearing?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-005.md`

Same heading structure. Include `### Nested children list` for 013.

**Append one row to:** `research/deep-research-state.jsonl` with track=1, iter_id="005".

## Context

Track 1 of the 999 deep-research run.
