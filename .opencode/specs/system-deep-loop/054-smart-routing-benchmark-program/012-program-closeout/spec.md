---
title: "Spec: 054 Program Close-out — Parent Rollup + CI Gate + Memory Reindex"
description: "Converge the 054 program: reconcile stale child statuses and refresh the parent rollup (children_ids + last_active_child_id), wire a Mode-A + drift-guard CI job (the named only-remaining follow-up), and run a daemon-health-gated canonical memory reindex of the renamed trees — strictly last, after the migration lands."
trigger_phrases:
  - "054 program closeout"
  - "smart-routing benchmark CI"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/012-program-closeout"
    last_updated_at: "2026-07-09T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded from fresh-Opus analysis"
    next_safe_action: "Reconcile child statuses + backfill parent; author CI job on 028"
    blockers:
      - "Reindex gated on the deep-loop-workflows→system-deep-loop migration landing + a healthy daemon"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Spec: 054 Program Close-out — Parent Rollup + CI Gate + Memory Reindex

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 012-program-closeout |
| **Level** | 2 |
| **Status** | Planned |
| **Sequencing** | LAST — after all sibling phases + the migration land |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The 054 parent `graph-metadata.json` lists only children 001-005 with **stale statuses** (001-004 say
`in_progress` but shipped), `derived.status` = `in_progress`, `last_active_child_id` = null (the
backfill preserves but does not derive it). The program's only named remaining follow-up is CI wiring.
The renamed/moved trees need a canonical memory reindex to be discoverable. Branch reality: 054 is
native on `origin/system-speckit/028` (all 46 files); `origin/skilled/v4` has only 004+005; the
`deep-loop-workflows → system-deep-loop` migration is carrying 028→v4.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- **(a) Rollup:** reconcile each child's `status:` frontmatter → run `backfill-graph-metadata.js`
  (children_ids auto-derive 006+ from disk) → set `last_active_child_id` explicitly → flip parent
  `status` → complete LAST. Keep the full Level-3 doc set (do not strip to lean trio while
  `SPECKIT_LEVEL: 3` is pinned). Author on 028; let the migration carry it.
- **(b) CI:** new `.github/workflows/smart-routing-benchmark.yml` (model `routing-registry-drift.yml`):
  Job 1 = `npx vitest run` (globs all drift guards); Job 2 = loop the 10 Mode-A targets asserting
  `verdict==="PASS"` (sk-code hub asserts baseline `aggregateScore`, not PASS). Mode-B excluded.
- **(c) Reindex:** daemon-health probe (`memory_health --warm-only`; exit 75 = retry; single-writer
  guard) → backfill `--all --active-only` → `memory_index_scan --force` → poll to completion
  (failed=0). Only after the migration lands on the canonical branch.

**Out of scope:** the sk-doc/sk-design hub benchmark extension (deferred successor `055-*`).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** `validate.sh --strict` on the parent (auto-recursive) PASSES; children_ids == on-disk count;
  `last_active_child_id` non-null.
- **R2:** CI job green on a clean tree; a perturbed child router turns the drift guard + that target's
  Mode-A red.
- **R3:** Reindex confirms the renamed 054 + system-deep-loop files resolve in memory search.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. Parent rollup validated; statuses reconciled; parent flipped complete.
2. CI workflow gates Mode-A + drift guards deterministically (no model/network/daemon).
3. Reindex `STATUS=OK`, failed=0; 054 trigger phrase resolves to the renamed tree.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Reindexing a half-migrated tree* → gate on migration-complete (why (c) is last).
- *Daemon contention* → warm-only probe + exit-75 backoff + single-writer guard.
- *sk-code hub false-fail* (baseline, not PASS) → assert `aggregateScore`, not `verdict`, for it.
- Depends on ALL sibling phases + the migration; (a) and (b) parallelizable, (c) strictly last.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None. The successor `055-doc-design-hub-benchmark-extension` (sk-doc + sk-design parents) is named but
explicitly deferred, not planned here.
<!-- /ANCHOR:questions -->
