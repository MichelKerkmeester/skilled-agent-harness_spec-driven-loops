Framework: BUILD

# Iter 010 — Track 2 (014-local-llama-cpp deep-read) — consolidated phase-list proposal

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Propose the consolidated 014 phase-list (post-restructure) based on the catalog (iter 007), classifications (iter 008), and overlap detection (iter 009).

**Steps:**

1. Read iter 007 + 008 + 009 outputs.
2. Synthesize: which current 014 children should remain (load-bearing, no merge), which merge into which target, which get deleted.
3. Propose the target phase-list with each phase's: name, description, constituent current children, rationale, retained child of the merge target (which packet's structure survives).
4. Count: current 014 children → proposed phase count.

**Acceptance criteria per step:**

- Step 1: prior iter outputs read
- Step 2: every current 014 child accounted for (kept / merged / deleted)
- Step 3: each proposed phase has all 5 fields (name / description / children / rationale / retained-target)
- Step 4: numeric reduction explicit

**Stop condition:** Emit iteration-010.md then exit.

**Verification:** Every current child mapped. Proposed phase count cited. JSONL row appended.

## Research Question (scoped)

For `026/014-local-llama-cpp/` post-restructure:

1. What is the proposed phase list?
2. For each proposed phase: name, description, constituent current children, rationale, retained-target
3. Which current children get deleted (no place in the new phase list)?
4. What is the numeric reduction (current N children → proposed M phases)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-010.md`

**Required heading structure:**

```
# Iter 010 — Track 2: 014 consolidated phase-list proposal

## Question
<framing>

## Evidence
- file:line citations from iter 007-009 outputs

## Findings
### Proposed 014 phase list
| Proposed phase | Description | Constituent current children | Rationale | Retained-target |
| ... |

### Deletes
- <current child> — reason

### Numeric reduction
- Current: N children
- Proposed: M phases
- Reduction: %

## Gaps for next iter

## JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=2, iter_id="010".

## Context

Track 2 closes here. Closes the 014 deep-read. Findings feed track 9 (target-state proposal across all of 026).
