Framework: BUILD

# Iter 001 — Track 1 (packet inventory) — 026/000-003 classification

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Classify the first four direct children of `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` — namely `000-release-cleanup`, `001-research-and-baseline`, `002-resource-map-template`, `003-continuity-memory-runtime` — on three axes: still-load-bearing / merge-candidate / delete-candidate.

**Steps:**

1. For each of the 4 packets, read its `spec.md`, `description.json`, `graph-metadata.json`, and `implementation-summary.md` (when present).
2. For phase-parent children (like `000-release-cleanup` which has nested children), list the nested children but do NOT recurse into them — that's a separate iter.
3. Note size (LOC of spec.md), status (from graph-metadata.json `derived.status`), and last-modified date.
4. Classify each on the three axes with rationale tied to file:line evidence.

**Acceptance criteria per step:**

- Step 1: each packet has ≥ 3 file:line citations supporting the classification
- Step 2: nested children listed by name (no deep dive)
- Step 3: size + status + last-modified captured from actual files (not inferred)
- Step 4: every classification has a one-paragraph rationale citing specific spec.md or impl-summary sections

**Stop condition:** Emit the iteration-001.md output then exit. Do not request further input.

**Verification:** Each of 4 packets gets a classification + ≥ 3 citations. JSONL delta row appended.

## Research Question (scoped)

For each of `026/000-release-cleanup`, `026/001-research-and-baseline`, `026/002-resource-map-template`, `026/003-continuity-memory-runtime`:

1. What problem did the packet solve?
2. Is the solution still load-bearing (referenced by current code or active packets)?
3. Are there obvious merge candidates among 026's other 18 children?
4. Is this a delete candidate (completed, unreferenced, no historic-recall value)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-001.md`

**Required heading structure:**

```
# Iter 001 — Track 1: 026/000-003 classification

## Question
<one-paragraph framing>

## Evidence
- file:line citations grouped by packet

## Findings
### 000-release-cleanup
- Size / status / last-modified
- Classification: load-bearing | merge | delete
- Rationale (1 paragraph)
- Merge target (if classified merge): which other packet
- Delete reason (if classified delete)

### 001-research-and-baseline
<same structure>

### 002-resource-map-template
<same structure>

### 003-continuity-memory-runtime
<same structure>

## Gaps for next iter
- <questions this iter could not answer>

## JSONL delta row
<paste the exact line appended to deep-research-state.jsonl>
```

**Also append one row to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/deep-research-state.jsonl`

**Required JSONL fields:**

```json
{"iter_id": "001", "timestamp_utc": "<ISO8601>", "executor": "cli-devin", "model": "swe-1.6", "track": 1, "status": "complete", "findings_count": <int>, "gaps_count": <int>, "primary_evidence_files": [<paths>]}
```

## Context

This iter is part of a 40-iter sweep to produce a verified restructure proposal for 026. See `research/strategy.md` and `research/iter-plan.md` for the full plan. Strategy excerpt: tracks 1-5 build the packet inventory, tracks 6-8 do cross-cutting analysis, tracks 9-10 propose the target state.

Read-only on every 026 child. Output lives only under `999-spec-026-restructure-research/research/`.
