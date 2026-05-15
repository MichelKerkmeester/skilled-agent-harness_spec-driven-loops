Framework: BUILD

# Iter 034 — Track 8 (naming-quality audit) — lock in conventions

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Pre-planning

**Goal:** Audit current 026 naming conventions and lock in the conventions the restructure should enforce.

**Steps:**

1. Read iter 001-033 outputs.
2. Tabulate current naming patterns: verb-first (e.g., "hook-parity") vs noun-first (e.g., "code-graph") vs problem-statement (e.g., "global-security-sweep-and-supply-chain-audit").
3. Score each pattern on: brevity / recall / consistency-with-rest-of-026 / stability-over-time.
4. Recommend the convention to enforce post-restructure.

**Acceptance criteria per step:**

- All current patterns enumerated with examples
- Scoring per pattern
- Recommended convention with rationale
- JSONL row appended

**Stop condition:** Emit iteration-034.md then exit.

**Verification:** Convention recommendation. JSONL row appended.

## Research Question (scoped)

For 026 post-restructure:

1. Which naming patterns currently exist?
2. Which pattern best serves recall + consistency + stability?
3. What is the lock-in convention?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-034.md`

**Required heading structure:**

```
# Iter 034 — Track 8: naming conventions lock-in

## Question / Evidence / Findings
### Current patterns (with examples)
### Scoring
| Pattern | Brevity | Recall | Consistency | Stability | Score |
### Recommended convention
- Rule: <one-line rule>
- Rationale: <paragraph>
- Examples (3-5): old name → new name
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=8, iter_id="034".

## Context

Track 8 closes here. Feeds track 9 (target-state proposal).
