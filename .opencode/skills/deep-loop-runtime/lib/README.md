---
title: "deep-loop-runtime Library"
description: "Domain logic library consumed by scripts and tests across three subdomains: council, coverage-graph, deep-loop."
---

# deep-loop-runtime Library

---

## 1. OVERVIEW

Shared domain logic for the three deep-* sibling skills: deep-review, deep-research, and deep-ai-council. Each subdomain isolates its own concerns. This is the domain layer; CLI-specific infrastructure lives in `scripts/lib/` instead.

## 2. LIBRARY DOMAINS

| Domain | Purpose | Primary Consumers |
|--------|---------|-------------------|
| `council/` | Multi-seat dispatch, adjudicator-verdict scoring, cost guards | deep-ai-council orchestrators |
| `coverage-graph/` | Schema, queries, Bayesian convergence signals | deep-review, deep-research |
| `deep-loop/` | Atomic state, loop locking, JSONL repair, executor config | all three deep-* skills |

## 3. RELATED RESOURCES

- Parent SKILL.md: `.opencode/skills/deep-loop-runtime/SKILL.md`
- Per-domain READMEs: `lib/council/README.md`, `lib/coverage-graph/README.md`, `lib/deep-loop/README.md`
- Tests: `.opencode/skills/deep-loop-runtime/tests/`
