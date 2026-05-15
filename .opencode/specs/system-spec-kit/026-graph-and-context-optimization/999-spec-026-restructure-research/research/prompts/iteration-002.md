Framework: BUILD

# Iter 002 — Track 1 (packet inventory) — 026/004-006 classification

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Classify three direct children of `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` — `004-runtime-executor-hardening`, `005-memory-indexer-invariants`, `006-graph-impact-and-affordance-uplift` — on three axes: still-load-bearing / merge-candidate / delete-candidate.

**Steps:**

1. For each of the 3 packets, read `spec.md`, `description.json`, `graph-metadata.json`, and `implementation-summary.md` (when present).
2. Note any phase-parent structure (children directories with their own spec.md).
3. Capture size (LOC of spec.md), status, last-modified date.
4. Classify on the three axes with rationale tied to file:line evidence.

**Acceptance criteria per step:**

- Step 1: ≥ 3 file:line citations per packet
- Step 2: phase-parent structure documented if present
- Step 3: size + status + last-modified from actual files
- Step 4: classifications have rationale paragraph citing spec.md / impl-summary sections

**Stop condition:** Emit iteration-002.md then exit.

**Verification:** Each of 3 packets gets classification + ≥ 3 citations. JSONL delta row appended.

## Research Question (scoped)

For each of `026/004-runtime-executor-hardening`, `026/005-memory-indexer-invariants`, `026/006-graph-impact-and-affordance-uplift`:

1. What problem did the packet solve?
2. Is the solution still load-bearing (referenced by current code or active packets)?
3. Are there obvious merge candidates among 026's other 19 children?
4. Is this a delete candidate (completed, unreferenced, no historic-recall value)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-002.md`

Same heading structure as iteration-001.md: Question / Evidence / Findings (one ### per packet, with Size+Status / Classification / Rationale / Merge-target-or-delete-reason) / Gaps / JSONL delta row.

**Append one row to:** `research/deep-research-state.jsonl` with track=1, iter_id="002".

## Context

Track 1 of the 999 deep-research run. See `research/strategy.md` and `research/iter-plan.md` for the full 40-iter plan. Read-only on every 026 child.
