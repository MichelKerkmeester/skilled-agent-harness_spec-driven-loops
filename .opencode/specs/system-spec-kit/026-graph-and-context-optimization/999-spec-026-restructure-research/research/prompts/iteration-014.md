Framework: BUILD

# Iter 014 — Track 3 (013-doctor-update-orchestrator deep-read) — consolidated phase-list proposal

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Propose the consolidated 013 phase-list post-restructure based on iter 011 + 012 + 013.

**Steps:**

1. Read iter 011 + 012 + 013 outputs.
2. Synthesize keep / merge / delete decisions.
3. Propose the target phase-list with all 5 fields per phase.
4. Count current → proposed reduction.

**Acceptance criteria per step:**

- Every current child accounted for
- Each proposed phase has name / description / children / rationale / retained-target
- Numeric reduction explicit

**Stop condition:** Emit iteration-014.md then exit.

**Verification:** Mapping + count cited. JSONL row appended.

## Research Question (scoped)

For `026/013-doctor-update-orchestrator/` post-restructure:

1. Proposed phase list?
2. Each phase: name / description / constituent / rationale / retained-target
3. Deletes?
4. Numeric reduction?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-014.md`

Same heading structure as iter 010 (Proposed phase list table / Deletes / Numeric reduction).

**Append one row to:** `research/deep-research-state.jsonl` with track=3, iter_id="014".

## Context

Track 3 closes here. Feeds track 9 (target-state proposal across all of 026).
