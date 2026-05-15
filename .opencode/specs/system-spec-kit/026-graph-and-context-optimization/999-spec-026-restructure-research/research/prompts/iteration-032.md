Framework: STAR

# Iter 032 — Track 8 (naming-quality audit) — nested-child mismatches

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Same naming-audit lens as iter 031 but applied to NESTED children inside the 4 phase parents (014, 013, 007, 009).

## Task

Identify nested children whose names don't match the actual work.

## Action — Pre-planning steps

1. Read iter 008 / 012 / 016 / 020 outputs (the 4 phase-parent per-packet classifications).
2. For each nested child, compare folder name vs delivered work.
3. Score severity. Propose better name for severe + mild.
4. Group findings by phase parent.

## Result — Acceptance criteria

- ≥ 2 citations per mismatch
- Severity + proposed name per mismatch
- Grouped by phase parent
- JSONL row appended

## Research Question (scoped)

For each nested child under 014 / 013 / 007 / 009:

1. Name vs delivered work match?
2. Severity?
3. Proposed better name?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-032.md`

Same heading structure as iter 031. Group findings by parent: `### Under 014`, `### Under 013`, etc.

**Append one row to:** `research/deep-research-state.jsonl` with track=8, iter_id="032".

## Context

Track 8 of 999. Feeds iter 033-034.
