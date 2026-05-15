# Iter 046 — Track 11 (gpt-5.5 medium) — strategic naming convention for scale

You are a senior architect. Your lens: scale — the chosen naming convention must serve 026 well not just at 8-12 phases (the proposed target) but at 30-50 phases if 026 keeps growing.

## Repository

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Read these inputs

- `iteration-034.md` (SWE-1.6's naming convention recommendation)
- `iteration-031.md` + `032.md` (mismatch lists)
- `iteration-033.md` (top-N renames)

All under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/`.

## Task

Pressure-test SWE-1.6's chosen naming convention under growth scenarios:

### Scenario A: 026 doubles in size (22 → 44 phases)
- Does the convention scale? (Would 44 names following this rule be searchable?)
- Are there collisions or naming ambiguities at scale?
- Does the convention's verb / noun / problem axis still work when phases multiply?

### Scenario B: 026 absorbs adjacent themes from sibling parents
- If 027 / 028 etc. merge into 026, does the convention extend?
- Are name-prefix collisions likely?

### Scenario C: A phase splits into 3+ children later
- Does the convention provide a stable name for the parent when its children diverge?
- Does the convention's "noun-first" or "verb-first" choice survive a split?

### Scenario D: Cross-parent comparison
- Compare the proposed 026 naming convention to other 0NN parents (027 / 028 / etc.). Is there consistency? Should there be?

## Output contract

Print to stdout. Required heading structure:

```
# Iter 046 — Track 11: strategic naming convention for scale

## SWE-1.6 convention recap
- Rule (from iter 034): <one-line>
- Examples (from iter 033): old → new

## Pressure-test results

### Scenario A: 026 doubles in size
- Convention holds? <yes | no | with-caveats>
- Failure modes: <list>
- Adjustment needed: <none | refinement>

### Scenario B: cross-parent absorption
<same>

### Scenario C: phase split
<same>

### Scenario D: cross-parent consistency
<same>

## Adjusted convention (if needed)
- Refined rule: <one-line>
- What changed from SWE-1.6's recommendation: <delta>
- Why: <rationale>

## Top-N renames re-evaluation
- For the top-N renames in iter 033, do they all still hold under the adjusted convention?
- Renames to revise: <list>

## JSONL delta row
{"iter_id": "046", "timestamp_utc": "<ISO8601>", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "scenarios_tested": 4, "adjustments_proposed": <int>, "primary_evidence_files": ["iter-031/032/033/034"]}
```

## Stop conditions

Emit then exit.

## Context

Naming convention chosen at restructure time IS the convention 026 keeps. Failure at scale = expensive renames later. gpt-5.5 medium's job here is to look 2-3 years ahead.
