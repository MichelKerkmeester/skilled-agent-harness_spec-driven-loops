---
title: "deep-loop-runtime Scripts"
description: "CLI entry points for deep-loop runtime operations: convergence detection, graph upsert, query, status."
---

# deep-loop-runtime Scripts

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCRIPTS](#2--scripts)
- [3. INTERNAL LIBRARY](#3--internal-library)
- [4. USAGE](#4--usage)
- [5. RELATED RESOURCES](#5--related-resources)

---

## 1. OVERVIEW

CLI invocation surface for deep-loop runtime operations. Consumed by `/spec_kit:deep-*` workflows. Each script is a thin CommonJS wrapper around the domain library at `../lib/`.

## 2. SCRIPTS

| File | Purpose |
|------|---------|
| `convergence.cjs` | Computes typed graph convergence decisions for review and research loops |
| `query.cjs` | Queries coverage gaps, unverified claims, contradictions, and related graph state |
| `status.cjs` | Reports session-scoped graph health and stored row counts |
| `upsert.cjs` | Stores graph nodes, edges, and iteration events |

## 3. INTERNAL LIBRARY

`scripts/lib/cli-guards.cjs` - CLI-specific guards for input validation, error formatting, signal handling, and writer-lock coordination. Kept separate from top-level `lib/` because it serves CLI infrastructure, not domain logic.

## 4. USAGE

```bash
node .opencode/skills/deep-loop-runtime/scripts/<script-name>.cjs <args>
```

## 5. RELATED RESOURCES

- Parent SKILL.md: `.opencode/skills/deep-loop-runtime/SKILL.md`
- Domain library: `.opencode/skills/deep-loop-runtime/lib/`
- Tests: `.opencode/skills/deep-loop-runtime/tests/`
