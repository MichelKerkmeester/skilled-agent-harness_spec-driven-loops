---
title: "Style Database & /interface Commands - Manual Testing Playbook"
description: "Lean manual scenarios for verifying the packet-012 style database (adapter modes, indexer, operator surface) and the /interface:* creation commands."
trigger_phrases:
  - "style database manual test"
  - "interface commands manual test"
  - "packet 012 playbook"
version: 1.0.0.0
---

# styles: Manual Testing Playbook

> **EXECUTION POLICY**: Run scenarios against the on-disk `styles/lib/database/`, `styles/lib/engine/`, and `commands/interface/` artifacts. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a concrete blocker. The persistent path is off by default; a scenario requiring a built generation is SKIP with "persistent path not enabled" unless a `<GENERATION>` is supplied.

## 1. OVERVIEW

| ID | Scenario | Intent | File |
|----|----------|--------|------|
| DB-01 | Adapter defaults to `legacy` | Flat files stay authoritative unless opted in | `styles/lib/engine/persistent-adapter.mjs` |
| DB-02 | `node --test styles/tests/database/*.test.mjs` green | Schema/indexer/retrieval/adapter/operator behavior holds | `styles/tests/database/` |
| DB-03 | Legacy engine unregressed (`styles/tests/engine/*`) | The DB work did not change the default path | `styles/tests/engine/` |
| DB-04 | Indexer lifecycle publishes an immutable generation | DISCOVER→…→PUBLISH; content-hash freshness; atomic pointer | `styles/lib/database/indexer.mjs` |
| DB-05 | Retrieval is eligibility-first weighted-RRF, generation-bound | Hard filters before ranking; fusion over ranks; fail-closed | `styles/lib/database/retrieval.mjs` |
| DB-06 | Vector drain reclaims a stale `running` job | Crash recovery via the running-lease | `styles/lib/database/vectors.mjs` |
| DB-07 | Operator surface: status/build/cutover/rollback/repair | The persistent path is operable, not library-only | `styles/lib/database/operator.mjs` |
| DB-08 | Generation retention keeps current + rollback, prunes older | No unbounded generation growth; live/rollback preserved | `styles/lib/database/operator.mjs` |
| CMD-01 | Each `/interface:*` routes to its stable mode | design→interface, foundations, motion, audit, design-reference→md-generator | `commands/interface/*.md` |
| CMD-02 | Commands expose the shared creation-contract blocks | Route Proof → … → Handoff visible blocks present | `skills/sk-design/shared/creation-contract.md` |
| CMD-03 | `/design:*` namespace is retired (no alias resolution) | `/interface:*` is the sole surface; `commands/design/` absent | `commands/design/` (absent) |

## 2. GLOBAL PRECONDITIONS

1. Run from the repo root with Node ≥ 22 (`node:sqlite` available).
2. `SK_DESIGN_STYLE_DB_MODE` is unset (proves the `legacy` default) unless a scenario sets it explicitly.
3. Each persistent-path scenario names a `<GENERATION>` slot; supply a built generation or record SKIP.

## 2a. SKIP RULE

A scenario is SKIP only when no concrete artifact can be supplied (e.g. the persistent path is not enabled and no `<GENERATION>` exists). Record SKIP with that concrete blocker rather than inventing measured evidence. Do not SKIP DB-01/02/03 or the CMD scenarios — they run against on-disk artifacts with no external prerequisite.

## 3. EVIDENCE REQUIREMENTS

- Automated scenarios (DB-02, DB-03) record the exact `# tests / # pass / # fail` line.
- Behavior scenarios cite the governing `file:line` (the adapter default, the lease query, the retention invariant) plus the observed verdict.
- The full-corpus persistent-vs-legacy SLO measurement is NOT part of this playbook — it is a persistent-enable go/no-go item.

## 4. RELEASE READINESS

Release-of-this-surface is ready when DB-01, DB-02, DB-03, and CMD-01..03 PASS, the operator and retention scenarios (DB-07/08) PASS or SKIP under the SKIP RULE, and no scenario invents rendered, measured, or generation evidence it could not supply. Enabling the persistent path by default remains a separate operator go/no-go that includes the deferred full-corpus SLO measurement.
