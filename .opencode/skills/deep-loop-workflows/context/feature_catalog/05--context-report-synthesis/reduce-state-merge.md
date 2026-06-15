---
title: "Reduce-State Merge"
description: "Runs reduce-state.cjs to produce the agreement-weighted findings registry and human-readable dashboard from the host-written state log and per-seat findings."
trigger_phrases:
  - "reduce-state"
  - "reduce-state.cjs"
  - "findings registry"
  - "agreement weighted registry"
  - "deep context dashboard"
  - "registry bucket"
---

# Reduce-State Merge

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Runs `reduce-state.cjs` to produce the agreement-weighted findings registry and human-readable dashboard from the host-written state log and per-seat findings.

The reducer is the host-owned consolidation step that keeps `findings-registry.json` and `deep-context-dashboard.md` synchronized with the latest iteration trail. It applies the same relevance gate and agreement logic as `step_merge_findings`, so the registry is consistent whether the host is running inline or delegating to a standalone reducer pass.

---

## 2. HOW IT WORKS

### Input Sources

`reduce-state.cjs` reads:
- `{artifact_dir}/deep-context-state.jsonl` — the append-only event and iteration log
- `{artifact_dir}/seats/iter-{NNN}/*.json` — per-seat structured findings written by the host after each sweep
- `{artifact_dir}/findings-registry.json` — the prior registry to merge into

### Registry Buckets

Findings are routed to five buckets by their `kind` field:

| Finding Kind | Registry Bucket |
|---|---|
| `reuse_candidate` | `reuseCandidates` |
| `integration_point` | `integrationPoints` |
| `convention` | `conventions` |
| `dependency` | `dependencies` |
| `gap` | `gaps` |

### Agreement-Weighted Logic

The reducer computes `unit_id = sha256(path:symbol:kind)` for each finding, deduplicates across seats, unions `producedBy`, applies `DEFAULT_RELEVANCE_GATE = 0.55` (dropping low-relevance units or tagging them marginal), checks `DEFAULT_AGREEMENT_MIN = 2` for agreement-eligibility, and recomputes all five coverage metrics in the registry's `metrics` block.

### Dashboard Output

After updating the registry, the reducer regenerates `deep-context-dashboard.md` from the JSONL log + registry data. The dashboard is auto-generated and must never be hand-edited.

### Host vs. Standalone

During the loop, `step_update_registry` performs an equivalent in-loop merge after each iteration without invoking the script directly. `reduce-state.cjs` is primarily used as a standalone tool for recovery (reconstructing the registry from JSONL after a partial run) or post-run analysis.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` | Script | Full reducer: reads JSONL + seat files, computes agreement-weighted registry, writes dashboard |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_update_registry` — in-loop equivalent of reduce-state.cjs per iteration |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Script | Attribution shape reused by the reducer for cross-executor union consistency |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/05--context-report-synthesis/reduce-state-merge.md` | Manual playbook | Verifies reduce-state.cjs syntax, runs it with node --check, and verifies registry bucket structure after a simulated sweep |

---

## 4. SOURCE METADATA

- Group: Context Report Synthesis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--context-report-synthesis/reduce-state-merge.md`

Related references:
- [reuse-catalog-generation.md](reuse-catalog-generation.md) — Reads reuseCandidates bucket produced by the reducer
- [cross-executor-agreement.md](../03--agreement-merge/cross-executor-agreement.md) — The agreement logic the reducer mirrors
