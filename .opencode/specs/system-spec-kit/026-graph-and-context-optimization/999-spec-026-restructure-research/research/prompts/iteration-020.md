Framework: BUILD

# Iter 020 — Track 5 (009-hook-parity deep-read) — per-packet classification

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** For every nested child under `009-hook-parity/` cataloged in iter 019, classify load-bearing / merge-candidate / delete-candidate.

**Steps:**

1. Read iter 019.
2. Read each packet's spec.md + impl-summary.
3. Classify with rationale.

**Acceptance criteria per step:** as iter 008 / 012 / 016.

**Stop condition:** Emit iteration-020.md then exit.

**Verification:** Every packet classified. JSONL row appended.

## Research Question (scoped)

For each nested packet under `026/009-hook-parity/`: problem? load-bearing? merge? delete?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md`

Same structure as iter 008 / 012 / 016.

**Append one row to:** `research/deep-research-state.jsonl` with track=5, iter_id="020".

## Context

Track 5 of 999. Feeds iter 021 (009 overlap detection) and iter 022 (009 phase-list).
