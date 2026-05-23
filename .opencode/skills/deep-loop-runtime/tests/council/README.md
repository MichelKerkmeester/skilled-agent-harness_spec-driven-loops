---
title: "Council Tests"
description: "Unit tests for the lib/council durability primitives consumed by deep-ai-council."
---

# Council Tests

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CONTENTS](#2--contents)
- [3. RELATED RESOURCES](#3--related-resources)

---

## 1. OVERVIEW

Per-module coverage for the 5 council durability primitives under `lib/council/`, added per packet 131/001/008 ADR-001 (Runtime Boundary Decision). These mirror the deep-loop durability contract in a council-scoped CommonJS surface and are consumed by `deep-ai-council` orchestration scripts.

## 2. CONTENTS

| File | Module under test |
|------|-------------------|
| `multi-seat-dispatch.vitest.ts` | `lib/council/multi-seat-dispatch.cjs` |
| `round-state-jsonl.vitest.ts` | `lib/council/round-state-jsonl.cjs` |
| `adjudicator-verdict-scoring.vitest.ts` | `lib/council/adjudicator-verdict-scoring.cjs` |
| `cost-guards.vitest.ts` | `lib/council/cost-guards.cjs` |
| `session-state-hierarchy.vitest.ts` | `lib/council/session-state-hierarchy.cjs` |

## 3. RELATED RESOURCES

- Parent tests README: `.opencode/skills/deep-loop-runtime/tests/README.md`
- Council feature catalog: `.opencode/skills/deep-loop-runtime/feature_catalog/08--council/`
