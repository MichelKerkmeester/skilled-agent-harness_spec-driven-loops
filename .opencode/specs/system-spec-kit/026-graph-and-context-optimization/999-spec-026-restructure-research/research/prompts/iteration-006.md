Framework: BUILD

# Iter 006 — Track 1 (packet inventory) — 026/014 + 026/015 classification (top-level only for 014)

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Classify two direct children: `014-local-llama-cpp` (phase parent — top-level only) and `015-global-security-sweep-and-supply-chain-audit` (single packet).

**Important:** `014-local-llama-cpp` is the MOST ACTIVE phase parent — hosts the 056-059 arc (root README refresh, SKILL.md realignment, cli-devin deep-loop alignment). This iter does the top level only. 014 nested children are deep-read in track 2 (iter 007-010).

**Steps:**

1. Read 014's phase-parent files; list nested children by name (expect 050-059 range plus possibly others).
2. Read 015's spec.md + description.json + graph-metadata.json + implementation-summary.md (if present — 015 may be in-progress).
3. Classify each on the three axes.

**Acceptance criteria per step:**

- Step 1: 014 phase-parent file:line citations + nested children enumerated
- Step 2: ≥ 3 file:line citations for 015
- Step 3: rationale paragraphs cite evidence

**Stop condition:** Emit iteration-006.md then exit.

**Verification:** 2 packets classified. JSONL row appended.

## Research Question (scoped)

For `026/014-local-llama-cpp` (top-level) and `026/015-global-security-sweep-and-supply-chain-audit`:

1. What is 014's overall arc? Is the local-llama-cpp grouping coherent given the 056-059 deep-loop work that landed under it?
2. List 014's nested children
3. What is 015's scope? Is it in-progress or completed?
4. Merge candidates?
5. Delete or load-bearing?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-006.md`

Same heading structure. Include `### Nested children list` for 014.

**Append one row to:** `research/deep-research-state.jsonl` with track=1, iter_id="006".

## Context

Track 1 of the 999 deep-research run. Closes the packet inventory track.
