Framework: BUILD

# Iter 016 — Track 4 (007-code-graph deep-read) — per-packet classification

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** For every nested child under `007-code-graph/` cataloged in iter 015, classify load-bearing / merge-candidate / delete-candidate.

**Steps:**

1. Read iter 015 output.
2. For each nested packet, read `spec.md` + `implementation-summary.md`.
3. Classify with rationale.

**Acceptance criteria per step:**

- Iter 015 read
- ≥ 2 file:line citations per packet
- Every packet classified

**Stop condition:** Emit iteration-016.md then exit.

**Verification:** Every packet classified. JSONL row appended.

## Research Question (scoped)

For each nested packet under `026/007-code-graph/`: problem solved? load-bearing? merge candidate? delete candidate?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md`

Same structure as iter 008 / 012.

**Append one row to:** `research/deep-research-state.jsonl` with track=4, iter_id="016".

## Context

Track 4 of 999. Feeds iter 017 (007 overlap detection) and iter 018 (007 consolidated phase-list).
