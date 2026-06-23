---
title: "Context Report Assembly"
description: "Assembles all seven sections of the Context Report from merged findings and writes context-report.md and context-report.json at the packet root."
trigger_phrases:
  - "context report assembly"
  - "context-report.md"
  - "context report synthesis"
  - "seven section report"
  - "context report JSON"
  - "compile context report"
version: 1.2.0.3
---

# Context Report Assembly

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Assembles all seven sections of the Context Report from merged findings and writes `context-report.md` and `context-report.json` at the packet root.

The Context Report is the final deliverable of the `deep-context` loop. It is a reuse-first planning artifact: the REUSE catalog leads, followed by integration points, touch list, conventions, dependency subgraph, prior art, and gaps. It ships pointers, not source bodies, so it remains portable across downstream consumers.

---

## 2. HOW IT WORKS

### Seven-Section Structure

`step_compile_report` uses `context_report_template.md` to assemble:

1. **REUSE Catalog** — verified `file:symbol` entries with signatures, reuse verbs, confidence, agreement, and freshness
2. **Integration Points** — `[HARD]` (contract-breaking if missed) and `[soft]` (optional) entry/exit symbols with `file:line`
3. **Touch List** — files to change in implementation order
4. **Conventions** — codebase idioms (naming, error handling, logging, test layout) with `file:line` exemplars
5. **Pruned Dependency Subgraph** — only edges within the touch radius, not the full dependency graph
6. **Prior Art / Decisions** — related specs, ADRs, and memory hits with date stamps
7. **Gaps & Unknowns** — items not found or unverified, plus marginal-relevance near-misses

The report header carries scope, executor pool summary, iteration count, and stop reason.

### Machine-Readable Companion

`step_emit_report_json` writes `context-report.json` with the same merged findings as structured JSON, plus per-finding attribution `{producedBy[], agreement, relevance, freshness}` and the final convergence signals. This file is the primary input for automated downstream consumption by `/speckit:plan` and `/speckit:implement`.

### Convergence Appendix

`step_convergence_report` appends a convergence summary to the markdown report: stop reason, total iterations, executor pool, final signal values, relevance gate, agreement min, and convergence threshold. A `synthesis_complete` event is appended to the JSONL log. `config.status` is set to `"complete"` via `step_update_config_status`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_verify_citations`, `step_compile_report`, `step_emit_report_json`, `step_convergence_report`, `step_update_config_status` |
| `.opencode/skills/deep-loop-workflows/deep-context/assets/context_report_template.md` | Asset | Seven-section report template used by step_compile_report |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_stage_artifact_dir` — git add of the full context packet after synthesis |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/05--context-report-synthesis/context-report-assembly.md` | Manual playbook | Verifies all seven sections present in context-report.md, context-report.json parseable, synthesis_complete event in JSONL |

---

## 4. SOURCE METADATA

- Group: Context Report Synthesis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--context-report-synthesis/context-report-assembly.md`

Related references:
- [reuse-catalog-generation.md](reuse-catalog-generation.md) — REUSE catalog (section 1) compilation detail
- [reduce-state-merge.md](reduce-state-merge.md) — Registry that feeds the assembly step
