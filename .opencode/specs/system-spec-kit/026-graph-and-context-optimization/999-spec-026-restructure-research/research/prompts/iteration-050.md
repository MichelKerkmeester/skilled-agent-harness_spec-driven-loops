# Iter 050 — Track 11 (gpt-5.5 medium) — post-restructure validation proof points

You are a senior architect. Your lens: validation — once the restructure executes, what proof points confirm the promised recall benefit actually materialized?

## Repository

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Read these inputs

- `iteration-040.md` (SWE-1.6's sample-query proof points)
- `iteration-035.md` (target-state proposal)
- `iteration-044.md` (gpt-5.5's first-principles re-evaluation when authored)

## Task

Design validation proof points for the post-restructure state:

### Query-based validation
For each of 5-8 representative search queries, define:
- The query (verbatim — what an operator would actually type)
- The expected first-pick result (which post-restructure phase / packet)
- The expected hop count (how many lookups before reaching the right packet)
- The current (pre-restructure) hop count
- The hop savings target

### Graph-based validation
Per the proposed graph-metadata.json layout (from iter 039):
- Does graph traversal from 026 root reach every retained phase in ≤ 2 hops?
- Does `derived.last_active_child_id` resume to the highest-priority active phase?
- Does the index expose the right `key_topics` / `trigger_phrases` per phase?

### Search index validation
- Does `memory_search` / cocoindex find each retained phase via the queries above?
- Are the trigger_phrases per phase distinctive enough that searches don't collide?

### Restructure-quality assertions
- The restructure DOES NOT lose any historic context that was load-bearing
- The restructure DOES reduce phase count from current 22 to target M
- The restructure DOES improve hop count on the chosen queries

### Test plan
- Pre-restructure: run all 5-8 queries, record hops + first-pick
- Post-restructure: run same queries, record hops + first-pick
- Diff: did hops go down? Did first-pick correctness improve?
- Negative case: pick 2-3 queries that SHOULD return the SAME first-pick pre + post (regression test)

## Output contract

Print to stdout. Required heading structure:

```
# Iter 050 — Track 11: post-restructure validation proof points

## Methodology

## Query-based validation
| # | Query | Expected first-pick (post) | Current hops | Post-restructure hops | Savings target |

## Graph-based validation
- Hop-from-root assertion
- Resume-pointer assertion
- Per-phase trigger_phrases assertion

## Search index validation
- memory_search proof query 1: <query> → expected hit
- memory_search proof query 2: <query> → expected hit
- cocoindex proof query 1: <query> → expected file
- cocoindex proof query 2: <query> → expected file

## Restructure-quality assertions
1. No load-bearing context lost: <how to verify>
2. Phase count reduced: <22 → M>; how to verify
3. Hop count improved: <how to measure>

## Test plan
### Pre-restructure baseline
- Run queries, record hops + first-pick
- Save baseline to: <suggested path>

### Post-restructure measurement
- Run same queries, record hops + first-pick
- Save measurement to: <suggested path>

### Diff verdict
- Pass if: all hop targets met + no regressions
- Fail conditions: any regression / any lost context / any query returning empty

### Regression queries (negative case)
- Query 1: <query> → expected SAME first-pick pre + post
- Query 2: <same>

## JSONL delta row
{"iter_id": "050", "timestamp_utc": "<ISO8601>", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "validation_queries": <int>, "assertions": <int>, "primary_evidence_files": ["iter-040/035/044"]}
```

## Stop conditions

Emit then exit.

## Context

Final track 11 iter. Closes the loop: SWE-1.6 surveyed; gpt-5.5 medium validated, integrated, cost-benefited, scaled, governed, blast-radius'd, ordered, and now defines the proof. The resource-map's "recall optimization" section ties to this iter's proof-point design.
