Framework: BUILD

# Iter 004 — Track 1 (packet inventory) — 026/009 + 026/010 + 026/011 classification (top-level only for phase parents)

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Classify three direct children: `009-hook-parity` (phase parent — top-level only), `010-template-levels` (phase parent — top-level only), `011-cocoindex-daemon-resilience` (single packet).

**Important:** `009` and `010` are PHASE PARENTS with nested children. This iter does the top-level only. 009 nested children are deep-read in track 5 (iter 019-022). 010 nested children are NOT deep-read in a dedicated track — note this; iter 035-038 (target-state) may need to inspect them.

**Steps:**

1. Read 009's phase-parent files; list nested children by name.
2. Read 010's phase-parent files; list nested children by name.
3. Read 011's spec.md + description.json + graph-metadata.json + implementation-summary.md.
4. Classify each on the three axes.

**Acceptance criteria per step:**

- Step 1-2: phase-parent file:line citations + nested children enumerated
- Step 3: ≥ 3 file:line citations for 011
- Step 4: rationale paragraphs cite parent-level (for 009 / 010) or full-packet (for 011) evidence

**Stop condition:** Emit iteration-004.md then exit.

**Verification:** 3 packets classified. Nested children of 009 + 010 listed. JSONL row appended.

## Research Question (scoped)

For `026/009-hook-parity` (top-level), `026/010-template-levels` (top-level), `026/011-cocoindex-daemon-resilience`:

1. What is the arc / theme of each phase parent or packet?
2. Is the phase-parent's grouping still coherent?
3. List nested children for 009 + 010 (name + one-line description)
4. Merge candidates among 026's other children?
5. Delete candidates? Or load-bearing reference?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-004.md`

Same heading structure. For 009 and 010, include a `### Nested children list` subsection.

**Append one row to:** `research/deep-research-state.jsonl` with track=1, iter_id="004".

## Context

Track 1 of the 999 deep-research run. Phase parents classified top-level only.
