# Iter 047 — Track 11 (gpt-5.5 medium) — phase lifecycle governance

You are a senior architect. Your lens: governance — should the restructure include a "phase lifecycle" policy that prevents future drift?

## Repository

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Read these inputs

- `iteration-027.md`, `028.md`, `029.md`, `030.md` (stale-context detection: completed-unreferenced / superseded / orphan / consolidated delete list)
- `iteration-035.md` (target-state proposal — see how it handles in-progress / superseded packets)

## Task

The drift that justified this restructure happened because phases were created liberally but never retired. Define a lifecycle policy:

### Lifecycle stages
- **Active:** in progress; has commits in last N days
- **Stable:** complete, referenced by current code, frozen
- **Stale:** complete + no recent commits + no current code references
- **Superseded:** later work replaced its output; historic value may persist
- **Orphan:** created but never populated, or experimental never closed

### Transitions
- Active → Stable: when work ships, mark in graph-metadata + spec.md status
- Stable → Stale: time-based + reference-based check (e.g., 90 days no commits + 0 references)
- Stale → Delete: operator review, but default to delete
- Superseded → Archive vs Delete: case-by-case
- Orphan → Delete: 30 days no commits + empty spec.md

### Automation
- What checks can be automated? (graph-metadata `derived.status` updates / cron / pre-commit hooks)
- What requires operator review?
- How does the restructure execute this policy day-1?

## Output contract

Print to stdout. Required heading structure:

```
# Iter 047 — Track 11: phase lifecycle governance

## Why governance now
- Without policy, 026 will drift again — cite iter 027/028/029/030 patterns

## Lifecycle policy
### Stages
- <each stage with definition + signals + duration norms>

### Transitions
- <each transition with trigger + automation + operator role>

### Automation
- Automatable: <list>
- Requires operator: <list>
- Tooling needed: <list>

## Application to current 026 restructure
- Day-1 stage assignment for each current packet (active / stable / stale / superseded / orphan)
- Which packets transition where as part of the restructure

## Recommended additions to the restructure
- Add a `phase-lifecycle.md` ADR? (yes / no)
- Add a graph-metadata `derived.lifecycle_stage` field?
- Add a cron / sweep script under `.opencode/skills/system-spec-kit/scripts/` that surfaces lifecycle transitions?

## JSONL delta row
{"iter_id": "047", "timestamp_utc": "<ISO8601>", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "stages_defined": 5, "automatable_checks": <int>, "primary_evidence_files": ["iter-027/028/029/030/035"]}
```

## Stop conditions

Emit then exit.

## Context

This iter is forward-looking — the restructure ships a one-time cleanup, but governance prevents the next round of drift. Even if the policy isn't implemented in the restructure packet itself, this iter scopes the follow-on work.
