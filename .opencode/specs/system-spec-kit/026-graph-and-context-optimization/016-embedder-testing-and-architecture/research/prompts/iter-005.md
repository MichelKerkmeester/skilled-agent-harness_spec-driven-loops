You are iteration 5 of a 10-iter deep-research dispatch on the 016 umbrella under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/`. Iter-1 audited arc 008 (already on disk). This iter's focus is **arc 004 code-index-stack**.

## Pre-bindings

- Working directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
- Target for this iter: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack`
- Spec folder (pre-approved, skip Gate 3): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/..`
- Read-only against source. Writes ONLY to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/iterations/iteration-005.md` and the JSONL state.

## Research framing (4 categories, each finding classifies into one)

1. **UNSHIPPED**: spec docs/commits CLAIM work was done but code doesn't actually do it.
2. **DEAD**: code/env vars/config/doc references that are unreachable, unused, or superseded.
3. **BUGGED**: looks correct but has logic error or contract drift (template: env-default-mismatch fixed in da33c866d).
4. **MISSED**: open questions never answered, risks without mitigations, "fix in follow-on" promises with no follow-on.

## Avoid duplicating prior iters

Iter-1 already covered arc 008. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/iterations/iteration-001.md` for context if needed but do NOT re-report its findings. Focus only on this iter's target.

## Output

Write `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/iterations/iteration-005.md` with the canonical structure:

```markdown
## Focus

[1-2 sentences naming the iter's target]

## Actions Taken

[Numbered list of reads, greps, comparisons]

## Findings

| Finding ID | Category | File:line + grep evidence | Recommended action |
|---|---|---|---|
| f-iter005-001 | <CAT> | <evidence> | <action> |
...
```

Append one JSONL line to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/research/deep-research-state.jsonl` with:

```json
{"type":"iteration","iteration":5,"focus":"arc 004 code-index-stack","status":"complete","findingCount":<N>,"completedAt":"<ISO>"}
```

## Process

1. Skim `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack`'s spec.md / plan.md / tasks.md / implementation-summary.md / graph-metadata.json.
2. Spot-check 2-3 source files referenced by those docs.
3. Run 2-3 grep probes for terms the docs mention (env vars, function names, file paths).
4. Compare commits in the arc's history (git log on the path) against the docs' claims.
5. Classify findings into the 4 categories with concrete file:line evidence.

Target 3-8 findings per iter. Quality > quantity. SUSPECTED is acceptable when uncommitted state diverges from docs.
