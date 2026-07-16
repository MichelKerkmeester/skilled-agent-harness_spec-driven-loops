---
title: "Implementation Summary: command asset-layer improvement research"
description: "The two-lineage command asset-layer deep-research run completed 10 forced iterations under non-convergence and produced the cross-model backlog at research/research.md; the packet stays in progress feeding the 013 remediation phases."
status: in_progress
trigger_phrases:
  - "command asset layer research run"
  - "asset layer cross-model backlog"
  - "command yaml presentation research synthesis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/014-command-asset-layer-research"
    last_updated_at: "2026-07-16T08:31:41Z"
    last_updated_by: "claude"
    recent_action: "Completed 2-lineage asset-layer deep-research run; synthesized cross-model backlog"
    next_safe_action: "Author 013 remediation phases from research.md asset-layer deltas"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/orchestration-summary.json"
      - "research/lineages/gpt56-sol-xhigh-fast/research.md"
      - "research/lineages/glm52-max/research.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    completion_pct: 90
    open_questions:
      - "Is the mode_matrix.default_policy enum exhaustive or do speckit/deep add a fifth policy"
      - "Does the doctor manifest subtype need a blocking core beyond OWNED ASSETS + PRESENTATION BOUNDARY"
    answered_questions:
      - "AL4 false-cycle defect is proven against the real parser, not hypothesized."
      - "The triad structure is right; the missing piece is the typed contract that describes it."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-command-asset-layer-research |
| **Status** | In Progress |
| **Completed** | Research run + cross-model synthesis complete (10/10 iterations); 013 remediation authoring pending downstream |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet ran the two-lineage asset-layer deep-research fan-out and produced the cross-model synthesis at `research/research.md`. Two independent model perspectives — GPT-5.6-Sol at `xhigh` reasoning / `fast` tier via `cli-codex`, and GLM-5.2 at `max` reasoning via `cli-opencode` — each drilled the command asset layer through five forced iterations under `stopPolicy: max-iterations`, and their syntheses were reconciled into one document.

`research/research.md` carries the deliverable: a cross-model agreement matrix (B1–B11 findings both models reached independently), model-unique findings flagged for a verify pass, and a reconciled asset-layer backlog in three tiers — A-K keystone, A-W wholesale canon + checks, A-G generation + ergonomics. Each backlog delta names a target path, an acceptance criterion, and a mapping from a 012 tier and AL defect to a 013 remediation phase. All six 012 asset-layer defects (AL1–AL6) are covered, and the central result is that the AL4 route-cycle defect is proven against the real parser rather than hypothesized.

No shipped runtime was changed. The backlog is a set of candidate proposals that refine the 013 remediation phases; the phases themselves are authored in that packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Produced (run) | Cross-model synthesis: agreement matrix, model-unique findings, and the A-K/A-W/A-G asset-layer backlog |
| `research/lineages/gpt56-sol-xhigh-fast/` | Produced (run) | GPT-5.6-Sol lineage: state log, 5 iteration records, per-lineage synthesis and deltas |
| `research/lineages/glm52-max/` | Produced (run) | GLM-5.2 lineage: state log, 5 iteration records, per-lineage synthesis and deltas |
| `research/orchestration-summary.json` | Produced (run) | Run provenance: 2 lineages, both succeeded, timing and failure-class gauges |
| `research/observability-events.jsonl` | Produced (run) | Per-event telemetry for the fan-out run |
| `spec.md`, `plan.md`, `tasks.md` | Created | Level-1 conformance docs restructured to the exemplar template |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The skill-owned `fanout-run.cjs` driver (`--loop-type research`) spawned the two lineages, each writing only inside its `research/lineages/<label>/` boundary. Every iteration explored one research question across a distinct angle, with convergence telemetry recorded but never allowed to stop the loop — the run was configured for forced non-convergence to guarantee both models explored to depth. After both lineages reached their iteration cap, the synthesis pass reconciled the two `lineages/*/research.md` files into the packet-level `research/research.md`, keeping the run provenance (`orchestration-summary.json`, `observability-events.jsonl`) beside it.

The single load-bearing result is concrete. `validate-command-references.cjs` extracts route edges with a raw-text regex and no comment stripping, so shipped comment lines in `doctor/_routes.yaml` and the `create_readme` YAMLs register as edges — firing a false `CMD-S3-ROUTE-CYCLE` P0 on the `create/readme.md ↔ create_readme_auto.yaml` pair. Both lineages reached this independently, and GPT added that reciprocal-only detection also misses real cycles longer than two nodes. This means some of 066's P0 cycle findings are false and some real cycles could be missed, which is why the backlog sequences the parser fix (A-K1) first and independently.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Force non-convergence at a hard iteration cap | Guarantees both models explore the asset layer to depth instead of stopping early on agreement |
| Run two heterogeneous lineages (GPT xhigh + GLM max) | Independent corroboration separates high-confidence agreements from single-lineage claims |
| Deliver candidate deltas, not runtime edits | Keeps the packet research-only; the 013 remediation phases own implementation |
| Sequence A-K1 (parser fix) first and independently | The proven false-cycle defect invalidates trusting 066's P0 cycle findings until the parser is fixed |
| Capture the triad shape as one typed contract | Every AL defect is a symptom of duplicated prose over a stable runtime shape; the fix is one typed source |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both lineages completed | PASS: `orchestration-summary.json` reports `total: 2`, `succeeded: 2`, `failed: 0` |
| Forced iteration cap reached | PASS: both lineages 5/5 iterations (10 total), `stopReason` maxIterationsReached — not convergence |
| Non-convergence evidence | PASS: GPT new-info ratios flat 0.90 ×5 (composite STOP 0.35 < 0.60); GLM ratios 1.0→0.78→0.80→0.82→0.60 (avg 0.80), no early stop |
| Route + mode provenance | PASS: `mode: research`, `loopType: research`, correct executor on all iteration records |
| Artifact boundary | PASS: all writes under each `research/lineages/<label>/` dir; no shipped runtime touched |
| AL defect coverage | PASS: AL1→A-W1 · AL2→A-K2/A-W4 · AL3→A-K2/A-W3 · AL4→A-K1 · AL5→A-W2 · AL6→A-G3 — all six mapped to a delta with target + acceptance |
| AL4 proven, not hypothesized | PASS: `validate-command-references.cjs:185-193` raw-text regex (`:55`) with no comment stripping; offending lines cited |
| Strict packet validation | PASS: `validate.sh --strict` Errors: 0 Warnings: 0 after regenerating description and graph metadata |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Candidate proposals, not implemented changes.** Every backlog delta is a proposal; none touch shipped runtime. The 013 remediation phases (001–005) are authored from the backlog and own all implementation, so this packet stays in progress until that hand-off is consumed.
2. **Single-lineage findings need a verify pass.** The model-unique findings in `research/research.md` §3 (e.g. GLM's 20-vs-15 OWNED ASSETS split, GPT's full contract schema) were reached by only one lineage and are flagged for confirmation before they are codified in phase 001.
3. **GLM lineage timestamp anomalies.** `orchestration-summary.json` flags 8 after-window timestamps on the `glm52-max` state log; the run still succeeded (`failed: 0`) and the iteration content is intact, but the wall-clock timeline for that lineage is unreliable and only iteration counts and stop reasons should be trusted from it.
<!-- /ANCHOR:limitations -->
