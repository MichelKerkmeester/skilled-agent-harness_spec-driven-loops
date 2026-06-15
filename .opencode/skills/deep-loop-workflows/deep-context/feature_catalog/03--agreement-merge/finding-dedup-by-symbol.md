---
title: "Finding Dedup by Symbol"
description: "Deduplicates all findings from all surviving seats by unit_id (sha256 of path:symbol:kind), unions per-executor attribution, and derives the agreement count for each unit."
trigger_phrases:
  - "finding dedup"
  - "dedup by symbol"
  - "unit_id deduplication"
  - "per-executor attribution"
  - "agreement count"
  - "sha256 path symbol kind"
---

# Finding Dedup by Symbol

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Deduplicates all findings from all surviving seats by `unit_id` (sha256 of path:symbol:kind), unions per-executor attribution, and derives the agreement count for each unit.

This is step one of the host-owned merge process. The raw finding sets from all seats are aggregated into a single deduplicated registry where each unique code unit appears exactly once, attributed to all the executors that independently found it. Agreement count is derived from this attribution set.

---

## 2. HOW IT WORKS

### Unit ID Computation

`unit_id = sha256(path:symbol:kind)` for each finding. This deterministic hash ties the coverage-graph node ID to the finding so graph nodes and registry entries stay consistent. Findings from different seats that reference the same `path:symbol:kind` produce the same `unit_id` and are merged into a single registry entry.

### Attribution Union

After grouping by `unit_id`, all seat labels that contributed a finding for that unit are unioned into `producedBy`. This is a set of distinct seat labels. The `agreement` count is `count(distinct executors in producedBy)`, which also becomes the `metadata.confirmations` value on the corresponding coverage-graph node and the weight on `CONFIRMS` edges.

### Agreement Eligibility

A unit is `agreement-eligible` when `agreement >= config.agreementMin` (default 2). Agreement-eligible findings drive `new_agreement_eligible_count` — the key metric in the per-iteration saturation check. `reduce-state.cjs` applies the same eligibility logic when running as a standalone reducer.

### fanout-merge.cjs Integration

`fanout-merge.cjs` provides the canonical per-executor attribution shape. `step_merge_findings` reuses this shape (or mirrors it exactly) so the findings registry stays consistent with the runtime contract whether the host merges inline or delegates to the fanout-merge script.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_merge_findings` — full dedup algorithm, attribution union, agreement computation |
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Script | Standalone reducer: same dedup + attribution + agreement logic over JSONL + seat files |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Script | Canonical attribution shape; referenced by step_merge_findings for registry consistency |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/03--agreement-merge/finding-dedup-by-symbol.md` | Manual playbook | Verifies unit_id computation, attribution union, and agreement count across two seats finding the same symbol |

---

## 4. SOURCE METADATA

- Group: Agreement Merge
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--agreement-merge/finding-dedup-by-symbol.md`

Related references:
- [cross-executor-agreement.md](cross-executor-agreement.md) — Relevance gate and agreement-eligibility logic that follows dedup
- [contradiction-surfacing.md](contradiction-surfacing.md) — Contradiction detection within the same merge pass
