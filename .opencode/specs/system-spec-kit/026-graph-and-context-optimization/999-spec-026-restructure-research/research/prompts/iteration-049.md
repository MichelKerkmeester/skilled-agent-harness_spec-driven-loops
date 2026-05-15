# Iter 049 — Track 11 (gpt-5.5 medium) — restructure ordering to minimize partial-state risk

You are a senior architect. Your lens: ordering — what's the optimal sequence of restructure operations so that if execution halts midway, the tree is in a recoverable state?

## Repository

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Read these inputs

- `iteration-035.md` (target-state proposal)
- `iteration-036.md` (per-phase scope statements)
- `iteration-045.md` (cost-benefit verdicts per merge — when authored by gpt-5.5)
- `iteration-048.md` (blast-radius verdicts per delete — when authored by gpt-5.5)

## Task

Define the optimal execution order for the restructure:

### Operation categories
- **Renames** (cheapest; just folder rename)
- **Merges** (combine 2+ packets into one; content union + reference cleanup)
- **Deletes** (remove packet; reference cleanup)
- **Parent-doc rewrites** (update phase parent spec.md / resource-map.md / graph-metadata.json to reflect new structure)
- **Index refreshes** (cocoindex re-scan, memory re-index)

### Ordering principles
1. **Renames first** (low risk; cheap to revert; doesn't lose info)
2. **Merges second** (after renames, all packets are at final names)
3. **Deletes third** (after merges; doesn't accidentally delete a merge-target's content)
4. **Parent-doc rewrites fourth** (reflects the new structure)
5. **Index refreshes last** (after all structural changes settle)

### Partial-state safety
For each operation, define what "in-progress" looks like:
- If operation N succeeds but operation N+1 fails, what state is the tree in?
- Can N+1 retry from where N+1 failed without redoing N?
- Are there operations that MUST be atomic across multiple commits?

## Output contract

Print to stdout. Required heading structure:

```
# Iter 049 — Track 11: restructure ordering for partial-state safety

## Operation inventory
- Renames: <count>
- Merges: <count>
- Deletes: <count>
- Parent-doc rewrites: <count>
- Index refreshes: <count>

## Proposed execution order
### Wave 1: Renames (lowest risk)
- Op 1.1: <rename>
- Op 1.2: <rename>
...

### Wave 2: Merges
- Op 2.1: <merge>
...

### Wave 3: Deletes
- Op 3.1: <delete>
...

### Wave 4: Parent-doc rewrites
- Op 4.1: update 026/spec.md
- Op 4.2: update 026/resource-map.md
- Op 4.3: update 026/graph-metadata.json

### Wave 5: Index refreshes
- Op 5.1: cocoindex re-scan
- Op 5.2: memory_index_scan
- Op 5.3: strict-validate sweep

## Per-wave partial-state safety
- Wave 1 partial: <safe? recovery procedure>
- Wave 2 partial: <same>
- ...

## Atomic groups (operations that MUST commit together)
- Group A: <operations> — why atomic
- Group B: <same>

## Recovery baseline procedure
- Before each wave: capture HEAD SHA
- On wave failure: `git reset --hard <wave-start-sha>` and re-attempt from start of that wave

## Recommended batch size per wave
- Wave 1 (renames): <ops per batch>
- Wave 2 (merges): <ops per batch>
...

## JSONL delta row
{"iter_id": "049", "timestamp_utc": "<ISO8601>", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "waves": 5, "atomic_groups": <int>, "primary_evidence_files": ["iter-035/036/045/048"]}
```

## Stop conditions

Emit then exit.

## Context

Execution ordering directly affects rollback safety. A bad ordering means a half-executed restructure leaves the tree in a state that's hard to recover. This iter feeds the resource-map's "migration plan" section.
