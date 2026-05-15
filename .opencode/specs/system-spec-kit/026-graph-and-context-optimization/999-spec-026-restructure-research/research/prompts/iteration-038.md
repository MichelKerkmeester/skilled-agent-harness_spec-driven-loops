Framework: STAR

# Iter 038 — Track 9 (target-state proposal) — highest-risk consolidations + mitigation

You are a SWE-1.6 deep-research iteration worker. Stay read-only. Cite evidence with file:line.

## Situation

Some proposed merges in iter 035-037 risk losing LOAD-BEARING context — a child packet may look mergeable on paper but its specific framing, decision records, or implementation notes are referenced elsewhere and would break if absorbed.

## Task

Identify the highest-risk consolidations and propose mitigation strategies.

## Action — Pre-planning steps

1. Read iter 035 + 036 + 037 + the weak-rationale flags from iter 037.
2. For each weak-rationale or large-merge case, identify what gets LOST if the merge proceeds naively.
3. Propose mitigation: preserve-in-decision-record / keep-original-spec-as-archive / split-into-two-merges / abort-this-merge.
4. Update the proposed phase list with any abort decisions.

## Result — Acceptance criteria

- High-risk consolidations enumerated
- For each: what gets lost + mitigation chosen + revised merge outcome
- Aborted merges (if any) explicit with reason
- JSONL row appended

## Research Question (scoped)

For the consolidated phase list:

1. Which merges are highest-risk?
2. What gets lost in each?
3. Mitigation per risk?
4. Any merges that should ABORT (not proceed)?

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-038.md`

**Required heading structure:**

```
# Iter 038 — Track 9: high-risk merges + mitigation

## Question / Evidence / Findings
### High-risk merges
| Merge | What's lost | Mitigation | Revised outcome |
### Aborted merges (if any)
| Merge | Reason to abort | Alternative |
### Revised phase list summary
- N high-risk merges proceed with mitigation; M aborted; net target phase count = X
## Gaps / JSONL delta row
```

**Append one row to:** `research/deep-research-state.jsonl` with track=9, iter_id="038".

## Context

Track 9 closes here. Feeds track 10 (resource-map structure).
