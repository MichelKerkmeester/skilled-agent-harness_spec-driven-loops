---
title: Benchmark Creation Reference Map
description: Route-map for create-benchmark overflow depth - case studies, the report worked example, and common pitfalls. SKILL.md holds the authoritative workflow and report contract.
trigger_phrases:
  - "benchmark creation reference"
  - "benchmark case studies"
  - "benchmark report worked example"
  - "benchmark folder pitfalls"
  - "benchmark adoption examples"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Benchmark Creation Reference Map

Overflow depth for the `create-benchmark` packet. The authoritative workflow, report contract, date convention, and rules live in [`../SKILL.md`](../SKILL.md). This set holds only the material that does not belong in the contract: real adoptions that teach the format, a report rendered in miniature, and the mistakes that break a benchmark folder.

---

## 1. OVERVIEW

Skill-local benchmark folders are curated entry points. The full audit trail (ADRs, fixture surgery, rollback history) stays in the spec packet under `.opencode/specs/`. The skill-local folder gives a future engineer a fast answer plus a pointer back to the packet.

**Core principle**: the skill-local folder is the look-here-first surface, not the archive. When an engineer asks "which embedder won? what fixture? when?" they find the answer there without hunting through `specs/`.

The convention applies to every `<skill>/mcp_server/benchmarks/` folder in this repo. Each skill maintains its own `README.md` index and `benchmark-<YYYY-MM-DD>/` dated subfolders, and numeric data is never cross-comparable across skills because the stacks and fixtures differ.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **Case studies** — two real adoptions (one promoted, one deliberately archived) and what each teaches | [case_studies.md](case_studies.md) | Modeling a new adoption on a proven one, or deciding whether a provisional run is ready to promote |
| **Common pitfalls** — the recurring mistakes that make a skill-local report drift or break the convention | [pitfalls.md](pitfalls.md) | Reviewing a drafted benchmark folder, or a promoted report no longer matches its spec packet |
| **Worked example** — the `benchmark_report.md` shape rendered in miniature (sections 1 to 3) plus the conventions the remaining sections follow | [worked_example.md](worked_example.md) | Authoring `benchmark_report.md` and you want to see the section pattern before filling the template |

---

## 3. RELATED RESOURCES

### Templates

| File | Purpose |
| --- | --- |
| [`benchmark_report_template.md`](../assets/benchmark/benchmark_report_template.md) | Fillable ten-section scaffold for `benchmark_report.md` files |
| [`source_template.md`](../assets/benchmark/source_template.md) | Fillable `SOURCE.md` scaffold |

### Validation

- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type readme`: run against any `benchmark_report.md` or `benchmarks/README.md` before promoting.

### Benchmark examples

| Path | What | Status |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/` | mk-spec-memory text-embedder bake-off ([case_studies.md](case_studies.md) Case study 1) | Live, promoted |
| `.opencode/specs/z_future/code-graph-and-cocoindex/backup/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/` | experimental coco-index code-embedder bake-off ([case_studies.md](case_studies.md) Case study 2) | Archived, never promoted |

### Related sk-doc references

- [`create-readme references`](../../create-readme/references/README.md): README authoring conventions used by `benchmarks/README.md`
- [`global/core_standards.md`](../../shared/references/core_standards.md): cross-document standards including ANCHOR conventions
- [`global/evergreen_packet_id_rule.md`](../../shared/references/evergreen_packet_id_rule.md): evergreen rule for runtime docs; benchmark reports follow it via `SOURCE.md` cross-link rather than inline packet IDs

---

*End of create-benchmark reference map — the authoritative workflow and report contract live in [`../SKILL.md`](../SKILL.md).*
