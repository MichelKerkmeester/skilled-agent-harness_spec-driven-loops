Framework: BUILD

# Iter 007 — Track 2 (014-local-llama-cpp deep-read) — map nested children + natural grouping

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Map every nested child under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/` and identify the natural thematic grouping. 014 is the most active phase parent — likely contains the 056-059 arc plus others.

**Steps:**

1. List every direct subdirectory of `014-local-llama-cpp/` (`ls -1`).
2. For each subdirectory matching `[0-9]{3}-name/`, read its `description.json` and capture: name, one-line description, status, last-modified.
3. Group nested children by theme: research-only / implementation / SKILL realignment / deep-loop alignment / other.
4. Identify which subgroups span multiple packets (e.g., 056 + 057 + 058 + 059 all loosely "deep-loop foundation arc").

**Acceptance criteria per step:**

- Step 1: every direct subdirectory enumerated
- Step 2: every NNN-name subdirectory has name + description + status + last-modified
- Step 3: thematic groups have one-line definitions
- Step 4: at least one cross-packet group identified, with member packets listed

**Stop condition:** Emit iteration-007.md then exit.

**Verification:** Every nested child cataloged. At least one theme group named. JSONL row appended.

## Research Question (scoped)

For `026/014-local-llama-cpp/`:

1. What nested children exist? (Full enumeration)
2. What is the natural thematic grouping?
3. Which sub-groups span multiple packets?
4. Is there a "main" arc that defines 014's purpose, or is it a grab-bag?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-007.md`

**Required heading structure:**

```
# Iter 007 — Track 2: 014-local-llama-cpp deep-read (nested children + grouping)

## Question
<framing>

## Evidence
- file:line citations from each nested description.json

## Findings
### Nested children catalog
- Table: NNN-name | description | status | last-modified | size

### Thematic grouping
- Group A: <name> — packets X, Y, Z — definition
- Group B: <name> — packets W, V — definition
- ...

### Identified arcs (multi-packet)
- Arc 1: <name> — packets — what holds them together

## Gaps for next iter
- <questions for iter 008>

## JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=2, iter_id="007".

## Context

Track 2 of the 999 deep-research run. This iter sets up tracks 008-010 which do the per-packet classification, merge proposals, and consolidated phase-list for 014.
