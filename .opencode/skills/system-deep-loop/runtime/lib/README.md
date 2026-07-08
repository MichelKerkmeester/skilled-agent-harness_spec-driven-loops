---
title: "runtime/ Library"
description: "Domain logic library consumed by scripts and tests across three subdomains: council, coverage-graph, deep-loop."
---

# runtime/ Library

---

## 1. OVERVIEW

Shared domain logic for the `system-deep-loop` hub, which routes research, review, ai-council, and four improvement lanes. Active graph-backed workflow modes use `runtimeLoopType` values `research`, `review`, or `council`; legacy `context` handling remains only for historical artifacts. Improvement lanes keep `runtimeLoopType: null`. Each subdomain isolates its own concerns. This is the domain layer; CLI-specific infrastructure lives in `scripts/lib/` instead.

## 2. LIBRARY DOMAINS

| Domain | Purpose | Primary Consumers |
|--------|---------|-------------------|
| `council/` | Multi-seat dispatch, adjudicator-verdict scoring, cost guards | ai-council workflow packets |
| `coverage-graph/` | Schema, queries, Bayesian convergence signals | research, review, council projections, and legacy context artifacts |
| `deep-loop/` | Atomic state, loop locking, JSONL repair, executor config | `system-deep-loop` modes via the shared runtime backend |

## 3. RELATED RESOURCES

- Parent SKILL.md: `.opencode/skills/system-deep-loop/runtime/SKILL.md`
- Per-domain READMEs: `lib/council/README.md`, `lib/coverage-graph/README.md`, `lib/deep-loop/README.md`
- Tests: `.opencode/skills/system-deep-loop/runtime/tests/`
