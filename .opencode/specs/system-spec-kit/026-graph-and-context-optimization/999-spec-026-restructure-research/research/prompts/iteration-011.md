Framework: BUILD

# Iter 011 — Track 3 (013-doctor-update-orchestrator deep-read) — map nested children + natural grouping

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Map every nested child under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/` and identify the natural thematic grouping. 013 is the doctor-consolidation arc.

**Steps:**

1. List every direct subdirectory of `013-doctor-update-orchestrator/`.
2. For each subdirectory matching `[0-9]{3}-name/`, read its `description.json` and capture name + description + status + last-modified.
3. Group nested children by theme.
4. Identify cross-packet arcs.

**Acceptance criteria per step:**

- Step 1: every direct subdirectory enumerated
- Step 2: every NNN-name subdirectory has all 4 fields
- Step 3: thematic groups have definitions
- Step 4: arcs named with member packets

**Stop condition:** Emit iteration-011.md then exit.

**Verification:** Every nested child cataloged. JSONL row appended.

## Research Question (scoped)

For `026/013-doctor-update-orchestrator/`:

1. What nested children exist?
2. What is the natural thematic grouping?
3. Which sub-groups span multiple packets?
4. Is there a "main" arc that defines 013's purpose?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-011.md`

Same heading structure as iter 007 (Question / Evidence / Findings with nested children catalog + thematic grouping + identified arcs / Gaps / JSONL).

**Append one row to:** `research/deep-research-state.jsonl` with track=3, iter_id="011".

## Context

Track 3 of 999. Sets up iter 012-014 for the per-packet classification, overlap detection, and consolidated phase-list for 013.
