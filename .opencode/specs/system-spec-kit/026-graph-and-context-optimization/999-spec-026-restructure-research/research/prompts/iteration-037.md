Framework: BUILD

# Iter 037 — Track 9 (target-state proposal) — per-phase rationale

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** For each proposed phase, justify the grouping. Show why this is the right cut vs alternative cuts.

**Steps:**

1. Read iter 035 + 036.
2. For each proposed phase, articulate: rationale (why this grouping) + 1-2 alternative cuts + why the chosen cut wins (recall benefit, consistency benefit, restoration of historic intent).
3. Note phases where the rationale is WEAK and may need a second look.

**Acceptance criteria per step:**

- iter 035 + 036 read
- Every proposed phase has rationale + 1-2 alternatives
- Weak-rationale phases flagged
- JSONL row appended

**Stop condition:** Emit iteration-037.md then exit.

**Verification:** Per-phase rationale with alternatives. JSONL row appended.

## Research Question (scoped)

For each proposed phase:

1. Why this grouping?
2. What are the alternative cuts considered?
3. Why does the chosen cut win?
4. Where is the rationale weakest?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-037.md`

**Required heading structure:**

```
# Iter 037 — Track 9: per-phase rationale

## Question / Evidence / Findings
### Phase 1: <name>
- Rationale: <paragraph>
- Alternatives considered: A — <one-line>, B — <one-line>
- Why chosen wins: <paragraph>
- Weak-rationale flag: yes/no + why

(repeat per phase)

## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=9, iter_id="037".

## Context

Track 9 of 999.
