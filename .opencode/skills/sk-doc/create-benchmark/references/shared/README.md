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

Overflow depth for the `create-benchmark` packet. The authoritative workflow, report contract, date convention, and rules live in [`../SKILL.md`](../../SKILL.md). This set holds only the material that does not belong in the contract: real adoptions that teach the format, a report rendered in miniature, and the mistakes that break a benchmark folder.

---

## 1. OVERVIEW

Skill-local benchmark folders are curated entry points. The full audit trail (ADRs, fixture surgery, rollback history) stays in the spec packet under `.opencode/specs/`. The skill-local folder gives a future engineer a fast answer plus a pointer back to the packet.

**Core principle**: the skill-local folder is the look-here-first surface, not the archive. When an engineer asks "which embedder won? what fixture? when?" they find the answer there without hunting through `specs/`.

The convention applies to every `<skill>/mcp-server/benchmarks/` folder in this repo. Each skill maintains its own `README.md` index and `benchmark-<YYYY-MM-DD>/` dated subfolders, and numeric data is never cross-comparable across skills because the stacks and fixtures differ.

---

## 2. REFERENCE MAP

Load the file that matches the current task:

| Concern | Reference | Load When |
| --- | --- | --- |
| **Case studies** — two real adoptions (one promoted, one deliberately archived) and what each teaches | [case-studies.md](case-studies.md) | Modeling a new adoption on a proven one, or deciding whether a provisional run is ready to promote |
| **Common pitfalls** — the recurring mistakes that make a skill-local report drift or break the convention | [pitfalls.md](pitfalls.md) | Reviewing a drafted benchmark folder, or a promoted report no longer matches its spec packet |
| **Worked example** — the `benchmark-report.md` shape rendered in miniature (sections 1 to 3) plus the conventions the remaining sections follow | [worked-example.md](worked-example.md) | Authoring `benchmark-report.md` and you want to see the section pattern before filling the template |
| **Behavior benchmark guide** — end-to-end authoring path for a `behavior-benchmark` package: what it measures, how it differs from MCP promotion, package layout, scenario-matrix design, naming, and validation | [behavior-benchmark-guide.md](../behavior-benchmark/behavior-benchmark-guide.md) | Authoring or extending a deep-loop mode's behavior-benchmark package (index, scenario contracts, baseline) |
| **Skill-benchmark storage guide** — where a Lane C skill-benchmark run's artifacts live, how the run-label folders are named, the frozen `baseline/` anchor, and why the report `.md` is renderer-owned | [skill-benchmark-storage-guide.md](../skill-benchmark/skill-benchmark-storage-guide.md) | Authoring or updating a hub `benchmark/` tree or its `benchmark/README.md` index (skill-benchmark) |
| **Model-benchmark fixture guide** — the Lane B fixture families (code-task oracle, pattern/capability, reviewer-prompt), the run-profile shape, and what stays lane-local in deep-improvement | [model-benchmark-fixture-guide.md](../model-benchmark/model-benchmark-fixture-guide.md) | Authoring a Lane B input fixture or run profile (model-benchmark) |
| **Conformance benchmark authoring guide** — end-to-end authoring path for a `conformance-benchmark` input package: family index, contract, lane config, fixture manifest, the adapter-owned boundary, and the packet-066 worked mapping | [conformance-benchmark-authoring-guide.md](../conformance-benchmark/conformance-benchmark-authoring-guide.md) | Authoring or extending a deterministic peer-adapter conformance package (conformance benchmark) |
| **Agent-improvement authoring guide** — the Lane A guide-only family: the five agent-quality dimensions and what stays code-owned in deep-improvement | [agent-improvement-authoring-guide.md](../agent-improvement/agent-improvement-authoring-guide.md) | Authoring or updating a Lane A agent-improvement guide (agent-improvement) |
| **Command benchmark composition** — how a command benchmark composes the behavior and conformance axes over the command surface via a lane-owned matrix manifest and launcher, with the matrix-manifest field shape | [command-benchmark-composition.md](command-benchmark-composition.md) | Authoring a command benchmark (behavior + conformance) for the OpenCode command surface |

The case studies, pitfalls, and worked example cover the **MCP promotion** family (`../SKILL.md` sections 3 through 8); the behavior benchmark guide covers the **behavior benchmark** family (section 9); the skill-benchmark storage guide covers **skill-benchmark** (Lane C, section 10); the model-benchmark fixture guide covers **model-benchmark** (Lane B, section 11); the conformance benchmark authoring guide covers **conformance benchmark** (section 12); and the agent-improvement authoring guide covers **agent-improvement** (Lane A, section 14). The command benchmark composition guide spans the behavior and conformance families for the command surface. `../SKILL.md` holds the authoritative contracts.

---

## 3. RELATED RESOURCES

### Templates

| File | Purpose |
| --- | --- |
| [`benchmark-report-template.md`](../../assets/shared/benchmark-report-template.md) | Fillable ten-section scaffold for `benchmark-report.md` files (MCP promotion) |
| [`source-template.md`](../../assets/shared/source-template.md) | Fillable `source.md` scaffold (MCP promotion) |
| [`behavior-benchmark-index-template.md`](../../assets/behavior-benchmark/behavior-benchmark-index-template.md) | Fillable scaffold for a `behavior-benchmark.md` package index (behavior benchmark) |
| [`behavior-benchmark-scenario-template.md`](../../assets/behavior-benchmark/behavior-benchmark-scenario-template.md) | Fillable scaffold for one `<PREFIX>-NNN-<slug>.md` scenario contract (behavior benchmark) |
| [`behavior-benchmark-baseline-template.md`](../../assets/behavior-benchmark/behavior-benchmark-baseline-template.md) | Fillable scaffold for `baselines/claude-baseline.md` (behavior benchmark) |
| [`skill-benchmark-readme-template.md`](../../assets/skill-benchmark/skill-benchmark-readme-template.md) | Fillable scaffold for a hub `benchmark/README.md` run-label index (skill-benchmark) |
| [`model-benchmark-code-task-fixture-template.md`](../../assets/model-benchmark/model-benchmark-code-task-fixture-template.md) | Fillable scaffold for one code-task oracle fixture (model-benchmark) |
| [`model-benchmark-pattern-fixture-template.md`](../../assets/model-benchmark/model-benchmark-pattern-fixture-template.md) | Fillable scaffold for a pattern/capability or reviewer-prompt fixture (model-benchmark) |
| [`model-benchmark-profile-template.md`](../../assets/model-benchmark/model-benchmark-profile-template.md) | Fillable scaffold for a Lane B run profile (model-benchmark) |
| [`conformance-benchmark-readme-template.md`](../../assets/conformance-benchmark/conformance-benchmark-readme-template.md) | Fillable scaffold for a `conformance-benchmark` family README/index (conformance benchmark) |
| [`conformance-benchmark-contract-template.md`](../../assets/conformance-benchmark/conformance-benchmark-contract-template.md) | Fillable scaffold for the per-benchmark conformance contract (conformance benchmark) |
| [`conformance-benchmark-lane-config-template.md`](../../assets/conformance-benchmark/conformance-benchmark-lane-config-template.md) | Fillable scaffold for the deep-alignment lane config (conformance benchmark) |
| [`conformance-benchmark-fixture-manifest-template.md`](../../assets/conformance-benchmark/conformance-benchmark-fixture-manifest-template.md) | Fillable scaffold for the fixture manifest (conformance benchmark) |

### Validation

- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type readme`: run against any `benchmark-report.md` or `benchmarks/README.md` before promoting.

### Benchmark examples

| Path | What | Status |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-17/` | mk-spec-memory text-embedder bake-off ([case-studies.md](case-studies.md) Case study 1) | Live, promoted |
| `.opencode/specs/z-future/code-graph-and-cocoindex/backup/mcp-coco-index/mcp-server/benchmarks/benchmark-2026-05-18/` | experimental coco-index code-embedder bake-off ([case-studies.md](case-studies.md) Case study 2) | Archived, never promoted |

### Related sk-doc references

- [`create-readme references`](../../../create-readme/references/README.md): README authoring conventions used by `benchmarks/README.md`
- [`global/core-standards.md`](../../../shared/references/core-standards.md): cross-document standards including ANCHOR conventions
- [`global/evergreen-packet-id-rule.md`](../../../shared/references/evergreen-packet-id-rule.md): evergreen rule for runtime docs; benchmark reports follow it via `source.md` cross-link rather than inline packet IDs

---

*End of create-benchmark reference map — the authoritative workflow and report contract live in [`../SKILL.md`](../../SKILL.md).*
