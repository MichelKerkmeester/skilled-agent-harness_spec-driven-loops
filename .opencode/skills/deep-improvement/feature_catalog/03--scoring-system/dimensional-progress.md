---
title: "Dimensional progress"
description: "Reduces run records into per-dimension trends, best-known state, and operator-facing stop guidance."
trigger_phrases:
  - "dimensional progress"
  - "reduce-state.cjs"
  - "track dimension trends"
  - "per-dimension trajectory"
  - "improvement dashboard"
---

# Dimensional progress

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reduces run records into per-dimension trends, best-known state, and operator-facing stop guidance.

This feature covers the reducer and supporting runtime artifacts that turn scored runs into a readable dashboard and registry.

---

## 2. HOW IT WORKS

`reduce-state.cjs` reads `agent-improvement-state.jsonl`, groups records by profile, tracks accepted and rejected candidates, stores score histories per dimension, computes latest versus best values and arrow trends, and writes both `experiment-registry.json` and `agent-improvement-dashboard.md`. The dashboard also includes sample quality, journal summary, candidate lineage, mutation coverage, guardrails, stop status, and a plain-language recommendation.

The reducer accepts more than one "good enough" label. It counts both `candidate-acceptable` and `candidate-better` as accepted candidates when building profile buckets. Supporting runtime helpers feed extra context into that view: `mutation-coverage.cjs` stores trajectory data, `improvement-journal.cjs` exposes stop reason and session outcome, and `candidate-lineage.cjs` tracks the active leaf and lineage depth.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs` | Reducer | Rebuilds the registry, dashboard, stop status, and dimensional trend summary from the ledger. |
| `.opencode/skills/deep-improvement/scripts/shared/mutation-coverage.cjs` | Coverage tracker | Records mutation attempts and per-dimension trajectory points consumed by reducer-side summaries. |
| `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs` | Journal helper | Stores typed lifecycle events, stop reasons, and session outcomes for replay consumers. |
| `.opencode/skills/deep-improvement/scripts/agent-improvement/candidate-lineage.cjs` | Lineage helper | Tracks parent-child candidate relationships and the active lineage leaf. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-improvement/scripts/shared/tests/mutation-coverage.vitest.ts` | Automated test | Verifies trajectory recording and convergence eligibility rules. |
| `.opencode/skills/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts` | Automated test | Verifies event validation, stop-reason enums, and journal replay helpers. |
| `.opencode/skills/deep-improvement/scripts/agent-improvement/tests/candidate-lineage.vitest.ts` | Automated test | Verifies lineage recording, ancestry lookup, and wave filtering. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--scoring-system/dimensional-progress.md`
Related references:
- [deterministic-scoring.md](deterministic-scoring.md) — Deterministic scoring
