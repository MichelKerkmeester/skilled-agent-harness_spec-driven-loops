---
title: "012 Causal Graph Channel Routing Utilization (Phase Parent)"
description: "Phase parent for the graph-channel routing override and its post-delivery remediation. 001 ships the initial routing override (delivered 2026-05-08); 002 resolves the 0 P0 / 3 P1 / 39 P2 findings from the 2026-05-11 deep review (10-iter, cli-opencode + deepseek/deepseek-v4-pro)."
trigger_phrases:
  - "009-causal-graph-channel-routing"
  - "graph channel routing phases"
  - "012 phase parent"
  - "012 deep-review remediation"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 012 Causal Graph Channel Routing Utilization

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

Activate the graph and degree channels for intent-driven and entity-rich short queries. The complex-tier threshold (`>8 terms`) was excluding essentially all natural queries from the graph channel, so 1,328 live causal edges sat unused. This phase parent owns both the initial routing override (001) and the post-deep-review remediation (002).

---

## 2. PHASE CHILDREN

| ID | Slug | Status | Verdict | Summary |
|----|------|--------|---------|---------|
| 001 | initial-delivery | complete | CONDITIONAL (deep-review 2026-05-11) | `shouldPreserveGraph` + entity-density override + routing-telemetry. Delivered 2026-05-08. Spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, handover.md, resource-map.md, changelog.md, review/ (10-iter deep-review packet), scratch/ |
| 002 | deep-review-remediation | planned | — | Level 3 plan to fix 3 P1 (entity-density cache wiring + resource-map drift) and 39 P2 (docs, code polish, env-flag parsing, metadata). Implementation via cli-codex gpt-5.5 reasoning=high service_tier=fast |

---

## 3. SUB-PHASE CONTROL FILE

- **Active child:** `002-deep-review-remediation` (planning phase as of 2026-05-11T10:30Z)
- **Last completed child:** `001-initial-delivery`
- Resume / planning entry: `/spec_kit:resume` honors `graph-metadata.json.derived.last_active_child_id` first; falls back to listing children with statuses.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. The deep-review report at `001-initial-delivery/review/review-report.md` is the source of truth for what 002 must close.

**Tier-1 (release-blocking) work owned by 002:**
- P1-C-001 — wire `invalidateEntityDensityCache()` into `memory_save` and `memory_bulk_delete` post-commit hooks.
- P1-002 — fix `001-initial-delivery/resource-map.md:55` playbook path (210 → 272).
- P1-003 — verify/resolve `001-initial-delivery/resource-map.md:73` changelog reference.

**Tier-2 / Tier-3 (polish) work owned by 002:**
- 39 P2 findings clustered across docs (12), maintainability (8), reliability (5), defensive (5), tests (5), env-flag/security (3), perf (1, downgraded), metadata (1).

See `002-deep-review-remediation/spec.md` for the full breakdown and `002-.../plan.md` for the implementation sequencing.
