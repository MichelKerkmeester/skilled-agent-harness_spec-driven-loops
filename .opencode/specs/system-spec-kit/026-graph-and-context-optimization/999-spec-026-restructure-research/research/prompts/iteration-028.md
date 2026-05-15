Framework: STAR

# Iter 028 — Track 7 (stale-context detection) — superseded packets

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Some 026 packets shipped work that was LATER replaced or upgraded by a different packet. The earlier packet is superseded — keeping it just adds search noise + historic-recall friction.

## Task

Identify every 026 child that has been superseded by a LATER packet (in 026 or elsewhere).

## Action — Pre-planning steps

1. Read iter 001-022 outputs.
2. For each completed packet, identify any LATER packet (same theme, later number) that replaced its work.
3. Confirm supersession by reading the later packet's spec.md / impl-summary for "replaces" / "supersedes" / "obsoletes" language.
4. Also check `graph-metadata.json` `manual.supersedes` arrays.

## Result — Acceptance criteria

- ≥ 2 citations per supersession claim (the obsoleting packet + the obsoleted packet)
- Supersession pairs listed with: superseder, superseded, what was replaced
- JSONL row appended

## Research Question (scoped)

For every completed 026 packet:

1. Is there a LATER packet that replaced its work?
2. What was replaced (functionality / data / architecture)?
3. Is the superseded packet's historic value still useful for recall (delete vs keep-as-history)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-028.md`

**Required heading structure:**

```
# Iter 028 — Track 7: superseded packets

## Question / Evidence / Findings
### Supersession pairs
| Superseder | Superseded | What replaced | Historic value? |
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=7, iter_id="028".

## Context

Track 7 of 999. Feeds iter 029-030.
