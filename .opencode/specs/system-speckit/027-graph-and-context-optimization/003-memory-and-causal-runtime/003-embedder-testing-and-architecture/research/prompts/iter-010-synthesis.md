You are iteration 10 (synthesis) of the 016 deep-research dispatch. All 9 prior iters are on disk at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/iterations/iteration-NNN.md`. Read every iter file (001-009) and produce a single consolidated synthesis at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/research.md`.

Also write `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/iterations/iteration-010.md` as a brief audit-trail noting which iters were synthesized.

## Pre-bindings

- Working directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
- Spec folder (pre-approved): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/research/..`
- Read-only against source.

## research.md structure

```markdown
---
title: "016 Deep-Research Synthesis"
description: "Coverage + hygiene audit across all 8 arcs of the 016 umbrella, 4 categories (UNSHIPPED / DEAD / BUGGED / MISSED), iters 1-9."
---

# 016 Deep-Research Synthesis

## 1. Overview
[Summary of methodology + iter count + total findings]

## 2. Findings by Category

### UNSHIPPED (N findings)
| ID | File:line | What | Recommended action |
| ... |

### DEAD (N findings)
...

### BUGGED (N findings)
...

### MISSED (N findings)
...

## 3. Cross-Arc Patterns
[Anything that recurs across multiple arcs]

## 4. Recommended Priority
[Top 5-10 findings ranked by impact × effort]

## 5. Out of Scope
[Things the research deliberately did not cover]

## 6. Convergence Notes
[Whether iters 8-9 produced fewer new findings than 2-7 — basic convergence signal]
```

Read iter-1 through iter-9 markdown files in order; merge their findings into the categories. Preserve original finding IDs. Then rank by impact × effort in §4.
