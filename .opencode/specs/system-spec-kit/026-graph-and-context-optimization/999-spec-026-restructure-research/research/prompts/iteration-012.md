Framework: BUILD

# Iter 012 — Track 3 (013-doctor-update-orchestrator deep-read) — per-packet classification

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** For every nested child under `013-doctor-update-orchestrator/` cataloged in iter 011, classify load-bearing / merge-candidate / delete-candidate.

**Steps:**

1. Read iter 011 output.
2. For each nested packet, read `spec.md` + `implementation-summary.md` (when present).
3. Classify each on the three axes.

**Acceptance criteria per step:**

- Step 1: iter 011 read
- Step 2: ≥ 2 file:line citations per packet
- Step 3: every packet classified with rationale

**Stop condition:** Emit iteration-012.md then exit.

**Verification:** Every nested packet classified. JSONL row appended.

## Research Question (scoped)

For each nested packet under `026/013-doctor-update-orchestrator/`:

1. Problem solved?
2. Still load-bearing?
3. Merge candidate?
4. Delete candidate?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-012.md`

Same heading structure as iter 008 (Question / Evidence / Findings per-packet with all 5 fields / Gaps / JSONL).

**Append one row to:** `research/deep-research-state.jsonl` with track=3, iter_id="012".

## Context

Track 3 of 999. Feeds iter 013 (013 overlap detection) and iter 014 (013 consolidated phase-list).
