---
title: "Reuse Catalog Generation"
description: "Compiles the REUSE catalog — the highest-value section of the Context Report — from agreement-eligible reuse candidates with verified file:symbol citations, signatures, and agreement counts."
trigger_phrases:
  - "reuse catalog"
  - "REUSE catalog generation"
  - "reuse candidates"
  - "file:symbol verification"
  - "context report reuse section"
  - "code reuse catalog"
---

# Reuse Catalog Generation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Compiles the REUSE catalog — the highest-value section of the Context Report — from agreement-eligible reuse candidates with verified `file:symbol` citations, signatures, reuse verbs, confidence, and agreement counts.

The REUSE catalog is the primary deliverable for downstream consumers (`/speckit:plan`, `/speckit:implement`). It tells the planner exactly which existing functions, utilities, and patterns to extend rather than re-implement. Every entry is code-graph-verified and carries per-executor attribution so consumers understand the confidence behind each recommendation.

---

## 2. HOW IT WORKS

### Citation Verification Gate

`step_verify_citations` runs before compilation and inspects every reuse candidate in `findings-registry.json.reuseCandidates`. Each entry's `file:symbol` is checked against the code graph via `code_graph_query`. Entries that verify successfully are labeled `freshness: verified`. Entries that cannot be confirmed are labeled `freshness: unverified`. A stale reference is worse than omission; the catalog must never present an unverified ref as confirmed.

### Catalog Entry Schema

Each entry in the REUSE catalog carries:
- `id` — stable catalog identifier
- `symbol (file:line)` — the verified code-graph reference
- `signature` — function/type/constant signature
- `reuse verb` — `extend | compose | wrap | import`
- `confidence` — derived from relevance and agreement
- `agreement (k/N executors)` — how many distinct executors confirmed this unit
- `freshness` — `verified | unverified`
- `notes` — how-to-extend guidance and any limitations

### Pointers Not Bodies

The catalog ships `file:symbol` + signature references, never pasted source bodies. Downstream consumers pull bodies just-in-time when needed. This keeps the Context Report portable and avoids context rot from stale copy-pasted source.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Workflow | `step_verify_citations` and `step_compile_report` — verification gate and REUSE catalog assembly |
| `.opencode/skills/deep-context/assets/context_report_template.md` | Asset | Context Report template with REUSE Catalog as section 1 |
| `.opencode/skills/deep-context/scripts/reduce-state.cjs` | Script | Maintains `findings-registry.json.reuseCandidates` bucket from which the catalog is compiled |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-context/manual_testing_playbook/05--context-report-synthesis/reuse-catalog-generation.md` | Manual playbook | Verifies REUSE catalog leads the report, all entries have verified freshness labels, and agreement counts match JSONL records |

---

## 4. SOURCE METADATA

- Group: Context Report Synthesis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--context-report-synthesis/reuse-catalog-generation.md`

Related references:
- [context-report-assembly.md](context-report-assembly.md) — Full seven-section report that wraps the REUSE catalog
- [reduce-state-merge.md](reduce-state-merge.md) — Registry refresh that keeps reuseCandidates current before compilation
