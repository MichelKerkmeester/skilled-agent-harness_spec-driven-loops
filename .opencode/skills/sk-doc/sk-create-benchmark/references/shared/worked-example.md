---
title: Benchmark Report Worked Example
description: The benchmark-report.md shape rendered in miniature - frontmatter, headline block, and sections 1 through 3 - plus the conventions the remaining sections follow. Use alongside the fillable report template.
trigger_phrases:
  - "benchmark report worked example"
  - "benchmark report section pattern"
  - "benchmark report headline block"
  - "benchmark report structure example"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Benchmark Report Worked Example

A miniature rendering of the `benchmark-report.md` shape, so you can see the structure before filling it in.

---

## 1. OVERVIEW

The fixed ten-section contract and the report style rules live in [`../SKILL.md`](../../SKILL.md) §5. The full fillable scaffold, with every section and placeholder, is [`../assets/shared/benchmark-report-template.md`](../../assets/shared/benchmark-report-template.md) — copy that to author a real report. This file shows sections 1 to 3 in pattern so the shape is legible at a glance.

---

## 2. SECTIONS 1 TO 3 IN PATTERN

```markdown
---
title: "<topic> bake-off: <date>"
description: "<summary of candidates and production verdict>. Closes packet <packet-id> at <score>/10."
trigger_phrases:
  - "<topic keywords>"
importance_tier: "important"
contextType: "reference"
---

# <topic> bake-off: <date>

> Headline: `<winner>` + <pipeline-config> is the production default for `<MCP-stack>`.
> <primary-metric> <numeric-result>, <secondary-metric> <numeric-result>. Closes packet <packet-id>.

---

## 1. HEADLINE / OVERVIEW

`<winner>` + <pipeline-config> wins by <primary-metric> and <secondary-metric>.

| Metric | Value |
|---|---|
| Winner | `<winner>` |
| Pipeline | <pipeline-config> |
| <primary-metric> | <numeric-result> |
| <secondary-metric> | <numeric-result> |
| Spec packet | `<packet-id>` |
| Decision | <ADR-id> |


---

## 2. AGGREGATE RESULTS

| Candidate | Dim | <primary-metric> | Median ms | p95 ms | Verdict |
|---|---:|---:|---:|---:|---|
| `<candidate-1>` | <dim> | <numeric-result> | <numeric-result> | <numeric-result> | WINNER |
| `<candidate-2>` | <dim> | <numeric-result> | <numeric-result> | <numeric-result> | RUNNER-UP |
| `<candidate-3>` | <dim> | <numeric-result> | <numeric-result> | <numeric-result> | BASELINE |
| `<candidate-4>` | <dim> | <numeric-result> | -- | -- | ROLLBACK |


---

## 3. METHODOLOGY

### Fixture

- Primary gate: <primary-fixture-description>, pinned at `<fixture-path>`.
- Cost-benefit sweep: <sample-size>-scenario stratified sample across <fixture-categories>.
- Regression check: <regression-sample-size>-scenario <regression-target> preservation proxy.

### Pipeline

Retrieval pipeline = <pipeline-description>. Toggle via `<config-flag>=true|false`.

### Environment

<runtime-environment-description>. Corpus size after orphan prune: <corpus-size> active memory rows.
```

---

## 3. SECTIONS 4 TO 10

Subsequent sections follow the same pattern: H2 numbered headers, ALL CAPS section names, tables for data, code blocks for verbatim commands. Each section gets its own slug; keep slugs stable across revisions so deep links keep working. See [`../assets/shared/benchmark-report-template.md`](../../assets/shared/benchmark-report-template.md) for all ten sections rendered with fill-in placeholders.
