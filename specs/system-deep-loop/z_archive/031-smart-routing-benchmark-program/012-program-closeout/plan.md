---
title: "Implementation Plan: 054 Program Close-out — Parent Rollup + CI Gate + Memory Reindex"
description: "Reconstructed Level 2 implementation plan for the program close-out phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "054 program closeout plan"
  - "smart-routing benchmark CI gate plan"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: 054 Program Close-out — Parent Rollup + CI Gate + Memory Reindex

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | 054 program rollup, GitHub Actions CI, canonical memory reindex |
| **Storage** | Parent `graph-metadata.json`; `.github/workflows/smart-routing-benchmark.yml`; memory index |
| **Testing** | `validate.sh --strict` on the parent; CI job on a clean tree; a perturbed child router turning the drift guard and target Mode-A red; reindex `STATUS=OK` |

### Overview
Converge the 054 program: reconcile stale child statuses and refresh the parent rollup (`children_ids` + `last_active_child_id`), wire a Mode-A plus drift-guard CI job (the named only-remaining follow-up), and run a daemon-health-gated canonical memory reindex of the renamed trees — strictly last, after the migration lands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three workstreams with an explicit order: (a) rollup and (b) CI are parallelizable; (c) reindex is strictly last because it is gated on the `deep-loop-workflows` to `system-deep-loop` migration landing plus a healthy daemon.

### Key Components
- Child status frontmatter reconciliation plus `backfill-graph-metadata.js` and an explicit `last_active_child_id`
- `.github/workflows/smart-routing-benchmark.yml` modeled on `routing-registry-drift.yml`
- Daemon-health-gated memory reindex

### Data Flow
Child `status:` frontmatter is reconciled, then `backfill-graph-metadata.js` auto-derives `children_ids` for 006 onward from disk; the parent status flips complete last. The CI job runs `npx vitest run` (all drift guards) and loops the 10 Mode-A targets. The reindex probes `memory_health --warm-only` (exit 75 means retry), backfills `--all --active-only`, then runs `memory_index_scan --force` and polls to completion with `failed=0`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Rollup
- [ ] Reconcile each child's `status:` frontmatter
- [ ] Run `backfill-graph-metadata.js` and set `last_active_child_id`
- [ ] Flip the parent `status` complete last, keeping the full Level-3 doc set

### Phase 2: CI gate
- [ ] Add the workflow with the vitest job
- [ ] Add the Mode-A loop job

### Phase 3: Memory reindex (strictly last)
- [ ] Probe daemon health, backfill, then force-scan and poll to completion

### Phase 4: Verification
- [ ] Parent `validate.sh --strict` PASSES; `children_ids` equals the on-disk count; `last_active_child_id` non-null
- [ ] CI job green on a clean tree; a perturbed child router turns the drift guard and that target's Mode-A red
- [ ] Reindex confirms the renamed files resolve in memory search
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Parent rollup validation and child count reconciliation | `validate.sh --strict` |
| CI | Drift guards and the 10 Mode-A targets, deterministic (no model, network or daemon) | `npx vitest run`; Mode-A loop |
| Negative | A perturbed child router turns the drift guard and that target's Mode-A red | CI job rerun |
| Operational | Reindex confirms the renamed 054 and system-deep-loop files resolve in memory search | `memory_health --warm-only`; `memory_index_scan --force` |

The sk-code hub asserts its baseline `aggregateScore`, not `verdict === "PASS"`. Mode-B is excluded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| All sibling phases (001 to 011) | Internal | Not recorded | The parent rollup reports unfinished work |
| The `deep-loop-workflows` to `system-deep-loop` migration | Internal | Not recorded | The reindex is gated on it (why (c) is last) |
| A healthy memory daemon | Operational | Not recorded | The reindex probe retries on exit 75 |
| `routing-registry-drift.yml` as the CI model | Internal | Available | No CI workflow shape to follow |

The parent is authored on 028 and the migration carries it. The successor `055-doc-design-hub-benchmark-extension` is explicitly deferred.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded. The spec's risk notes scope the guardrails: a warm-only probe with exit-75 backoff and a single-writer guard for the reindex, and the parent status flip happening last.
<!-- /ANCHOR:rollback -->
