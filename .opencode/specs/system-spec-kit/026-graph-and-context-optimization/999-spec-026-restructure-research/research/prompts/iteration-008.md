Framework: BUILD

# Iter 008 — Track 2 (014-local-llama-cpp deep-read) — per-packet classification

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** For every nested child under `014-local-llama-cpp/` cataloged in iter 007, classify load-bearing / merge-candidate / delete-candidate.

**Steps:**

1. Read iter 007's output at `research/iterations/iteration-007.md` to confirm the nested-children catalog.
2. For each nested packet, read its `spec.md` and `implementation-summary.md` (when present); capture problem solved + load-bearing reference.
3. Classify each on the three axes with rationale tied to file:line evidence.

**Acceptance criteria per step:**

- Step 1: iter 007 read; catalog confirmed (or gaps noted)
- Step 2: ≥ 2 file:line citations per packet
- Step 3: every packet classified with rationale paragraph

**Stop condition:** Emit iteration-008.md then exit.

**Verification:** Every nested packet classified. JSONL row appended.

## Research Question (scoped)

For each nested packet under `026/014-local-llama-cpp/`:

1. What problem did the packet solve?
2. Is it still load-bearing? (cite where its output is referenced)
3. Is it a merge candidate? (which sibling packet)
4. Is it a delete candidate? (why)

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-008.md`

**Required heading structure:**

```
# Iter 008 — Track 2: 014 per-packet classification

## Question
<framing>

## Evidence
- file:line citations grouped by packet

## Findings
### NNN-packet-name
- Problem solved: <one-paragraph>
- Load-bearing reference: <where, file:line> or "none found"
- Classification: load-bearing | merge | delete
- Rationale: <paragraph>
- Merge target (if merge): <packet>
- Delete reason (if delete): <reason>

(repeat per packet)

## Gaps for next iter

## JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=2, iter_id="008".

## Context

Track 2 continues. Feeds iter 009 (duplicate detection within 014) and iter 010 (consolidated phase-list proposal).
