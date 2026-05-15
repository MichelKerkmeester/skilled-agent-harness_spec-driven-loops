Framework: STAR

# Iter 029 — Track 7 (stale-context detection) — orphan packets

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Some 026 children are orphans — created but never populated, or in scratch / experiment status, or abandoned mid-work without a clear shipping outcome.

## Task

Identify every orphan packet across 026.

## Action — Pre-planning steps

1. Read iter 001-022 outputs.
2. For each packet, check signals: spec.md missing or near-empty (< 50 LOC), no `implementation-summary.md`, no graph-metadata.json or status=draft / abandoned, no commits referencing the packet in last 30 days.
3. Classify: orphan / abandoned / experiment.
4. For each, propose: delete OR move to scratch / archive (note: per memory rules, prefer DELETE over archive).

## Result — Acceptance criteria

- Per orphan: signals captured (which signals matched)
- ≥ 1 citation per orphan (the empty spec.md, or git log absence)
- Disposition proposal per orphan
- JSONL row appended

## Research Question (scoped)

Across 026:

1. Which packets show orphan signals (empty / abandoned / experiment)?
2. What signals triggered the classification?
3. Disposition (delete recommended)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-029.md`

**Required heading structure:**

```
# Iter 029 — Track 7: orphan packets

## Question / Evidence / Findings
### Orphan list
| Packet | Type (orphan/abandoned/experiment) | Triggering signals | Disposition |
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=7, iter_id="029".

## Context

Track 7 of 999. Feeds iter 030 (consolidated delete list).
