---
title: "{{SKILL_NAME}} {{BENCHMARK_TOPIC}} -- {{LONG_DATE}}"
description: "Curated benchmark report for the {{CANDIDATE_COUNT}}-candidate {{SKILL_NAME}} {{BENCHMARK_TOPIC}} run on {{LONG_DATE}}. Winner: {{WINNER_NAME}} at {{WINNER_HEADLINE_METRIC}}."
trigger_phrases:
  - "{{SKILL_NAME}} benchmark"
  - "{{BENCHMARK_TOPIC}} bake-off"
  - "{{WINNER_SHORT_SLUG}} benchmark"
  - "{{SKILL_NAME}} {{BENCHMARK_TOPIC}} {{ISO_DATE}}"
  - "{{FIXTURE_SLUG}} benchmark"
importance_tier: "important"
contextType: "reference"
---

<!--
Copy-paste-ready scaffold for mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/benchmark_report.md.

Usage:
  cp .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md \
     .opencode/skills/<your-skill>/mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/benchmark_report.md

Then fill in every {{PLACEHOLDER}}. Keep the ANCHOR pairs and numbered H2 ALL CAPS structure intact.
Validate after authoring:
  python3 .opencode/skills/sk-doc/scripts/validate_document.py \
    .opencode/skills/<your-skill>/mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/benchmark_report.md \
    --type readme

Canonical reference: .opencode/skills/sk-doc/references/benchmark_creation.md
-->

# {{SKILL_NAME}} {{BENCHMARK_TOPIC}} -- {{LONG_DATE}}

> **Winner:** `{{WINNER_NAME}}`, {{WINNER_PRIMARY_METRIC}}, median {{WINNER_MEDIAN_MS}} ms, p95 {{WINNER_P95_MS}} ms. {{WINNER_VERDICT_LINE}}

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. HEADLINE / OVERVIEW](#1--headline--overview)
- [2. AGGREGATE RESULTS](#2--aggregate-results)
- [3. METHODOLOGY](#3--methodology)
- [4. PER-CANDIDATE PROFILES](#4--per-candidate-profiles)
- [5. PROCESS NOTES](#5--process-notes)
- [6. FINDINGS](#6--findings)
- [7. CAVEATS](#7--caveats)
- [8. RECOMMENDATIONS](#8--recommendations)
- [9. REPRODUCIBILITY](#9--reproducibility)
- [10. RELATED RESOURCES](#10--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:headline-overview -->
## 1. HEADLINE / OVERVIEW

<!-- One-line winner + key metric, prominently at top, then orientation paragraphs. Cite the spec packet via SOURCE.md. -->

This is the skill-local curated record of the {{CANDIDATE_COUNT}}-candidate {{BENCHMARK_TOPIC}} run for `{{SKILL_NAME}}` on {{LONG_DATE}}. The authoritative audit trail lives in the spec packet (see [`SOURCE.md`](./SOURCE.md) and Section 10).

### What Shipped

> **{{WINNER_NAME}} ({{WINNER_BACKEND}}, {{WINNER_DIM}}-dim) {{WINNER_PIPELINE_NOTE}}** is the {{WINNER_ROLE}} for `{{SKILL_NAME}}` as of {{LONG_DATE}}.

Key numbers on the {{FIXTURE_NAME}} fixture:

| Metric | Value |
|---|---|
| {{PRIMARY_METRIC_LABEL}} | **{{WINNER_PRIMARY_METRIC}}** |
| Median end-to-end latency | **{{WINNER_MEDIAN_MS}} ms** |
| p95 end-to-end latency | **{{WINNER_P95_MS}} ms** |
| Corpus size at measurement | {{CORPUS_SIZE}} |
| Decision record | {{ADR_REFERENCE}} |
| PASS gate | {{PASS_GATE_DEFINITION}} |

### The Load-Bearing Insight

<!-- One paragraph capturing the most important non-obvious finding. What surprised you? What would a future operator need to know first? -->

{{LOAD_BEARING_INSIGHT_PARAGRAPH}}

### How To Use This Document

- Section 2 is the headline aggregate table.
- Sections 3 and 4 anchor methodology and per-candidate facts.
- Sections 5 and 6 explain how we got here and what the data really says.
- Sections 7 through 9 cover honest limits, what to apply now, and how to replay.
- Section 10 links the spec packet and any sibling benchmarks.

<!-- /ANCHOR:headline-overview -->

---

<!-- ANCHOR:aggregate-results -->
## 2. AGGREGATE RESULTS

<!-- One row per candidate. Cite results.csv. Use bold for the winner row. Verdict column is required. -->

| Candidate | Backend | Dim | {{PRIMARY_METRIC_LABEL}} | Median ms | p95 ms | Verdict |
|---|---|---|---|---|---|---|
| **{{WINNER_NAME}}** | {{WINNER_BACKEND}} | {{WINNER_DIM}} | **{{WINNER_PRIMARY_METRIC}}** | **{{WINNER_MEDIAN_MS}}** | **{{WINNER_P95_MS}}** | **{{WINNER_VERDICT}}** |
| {{CANDIDATE_2_NAME}} | {{CANDIDATE_2_BACKEND}} | {{CANDIDATE_2_DIM}} | {{CANDIDATE_2_METRIC}} | {{CANDIDATE_2_MEDIAN}} | {{CANDIDATE_2_P95}} | {{CANDIDATE_2_VERDICT}} |
| {{CANDIDATE_3_NAME}} | {{CANDIDATE_3_BACKEND}} | {{CANDIDATE_3_DIM}} | {{CANDIDATE_3_METRIC}} | {{CANDIDATE_3_MEDIAN}} | {{CANDIDATE_3_P95}} | {{CANDIDATE_3_VERDICT}} |
| {{CANDIDATE_N_NAME}} | {{CANDIDATE_N_BACKEND}} | {{CANDIDATE_N_DIM}} | {{CANDIDATE_N_METRIC}} | {{CANDIDATE_N_MEDIAN}} | {{CANDIDATE_N_P95}} | {{CANDIDATE_N_VERDICT}} |

Raw aggregate data lives in [`results.csv`](./results.csv). Per-probe rows live in [`per-probe.jsonl`](./per-probe.jsonl).

<!-- /ANCHOR:aggregate-results -->

---

<!-- ANCHOR:methodology -->
## 3. METHODOLOGY

<!-- Fixture, sample size, pipeline (rescue / rerank / hybrid?), environment. Be specific enough that a reader can reproduce. -->

### Fixture

{{FIXTURE_PARAGRAPH}}

- **PASS gate:** {{PASS_GATE_DEFINITION}}.
- **Companion scenarios:** {{COMPANION_SCENARIOS_OR_NONE}}.

### Search pipeline

Each measurement window ran:

1. {{PIPELINE_STEP_1}}
2. {{PIPELINE_STEP_2}}
3. {{PIPELINE_STEP_3}}
4. {{PIPELINE_STEP_4}}

{{PIPELINE_NARRATIVE_NOTE}}

### Sample size

{{SAMPLE_SIZE_PARAGRAPH}}

### Environment

- Hardware: {{HARDWARE}}.
- Backend(s): {{BACKEND_LIST}}.
- Versions: {{VERSION_LIST}}.
- Stack distinction: {{STACK_DISTINCTION_NOTE_OR_NONE}}.

<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:per-candidate-profiles -->
## 4. PER-CANDIDATE PROFILES

<!-- One block per candidate. Cover dim, params, quantization, RAM, disk, context, release date, category, strengths, weaknesses. -->

### 4.1 {{WINNER_NAME}} -- production winner

| Property | Value |
|---|---|
| {{PROVIDER_LABEL}} | {{WINNER_PROVIDER_TAG}} |
| Dim | {{WINNER_DIM}} |
| Params | {{WINNER_PARAMS}} |
| Quantization | {{WINNER_QUANTIZATION}} |
| RAM loaded | {{WINNER_RAM}} |
| Disk | {{WINNER_DISK}} |
| Context | {{WINNER_CONTEXT}} |
| Released | {{WINNER_RELEASE_DATE}} |
| Category | {{WINNER_CATEGORY}} |
| Strengths observed | {{WINNER_STRENGTHS}} |
| Weaknesses observed | {{WINNER_WEAKNESSES}} |

### 4.2 {{CANDIDATE_2_NAME}}

| Property | Value |
|---|---|
| {{PROVIDER_LABEL}} | {{CANDIDATE_2_PROVIDER_TAG}} |
| Dim | {{CANDIDATE_2_DIM}} |
| Params | {{CANDIDATE_2_PARAMS}} |
| Quantization | {{CANDIDATE_2_QUANTIZATION}} |
| RAM loaded | {{CANDIDATE_2_RAM}} |
| Disk | {{CANDIDATE_2_DISK}} |
| Context | {{CANDIDATE_2_CONTEXT}} |
| Released | {{CANDIDATE_2_RELEASE_DATE}} |
| Category | {{CANDIDATE_2_CATEGORY}} |
| Result | {{CANDIDATE_2_RESULT}} |
| Strengths observed | {{CANDIDATE_2_STRENGTHS}} |
| Weaknesses observed | {{CANDIDATE_2_WEAKNESSES}} |

### 4.3 {{CANDIDATE_3_NAME}}

<!-- Repeat the per-candidate property block for every additional candidate. Keep table column structure stable. -->

{{CANDIDATE_3_PROPERTY_TABLE}}

### 4.N {{CANDIDATE_N_NAME}} -- rolled back ({{CANDIDATE_N_ADR}})

| Property | Value |
|---|---|
| {{PROVIDER_LABEL}} | {{CANDIDATE_N_PROVIDER_TAG}} |
| Dim | {{CANDIDATE_N_DIM}} |
| Result | {{CANDIDATE_N_RESULT}} |
| Rollback rationale | {{CANDIDATE_N_ROLLBACK_RATIONALE}} |
| Re-entry condition | {{CANDIDATE_N_REENTRY_CONDITION}} |

Live runtime measurements (RAM, residency, raw inference latency) for the final candidates are in [`runtime-measurements.md`](./runtime-measurements.md).

<!-- /ANCHOR:per-candidate-profiles -->

---

<!-- ANCHOR:process-notes -->
## 5. PROCESS NOTES

<!-- The elimination narrative. What you tried, what failed, what worked. Cite ADRs in order. -->

The elimination journey {{PROCESS_NARRATIVE_OPENING}}.

### What we tried, in order

1. **{{STEP_1_TITLE}} ({{STEP_1_ADR}}).** {{STEP_1_NARRATIVE}}
2. **{{STEP_2_TITLE}} ({{STEP_2_ADR}}).** {{STEP_2_NARRATIVE}}
3. **{{STEP_3_TITLE}} ({{STEP_3_ADR}}).** {{STEP_3_NARRATIVE}}
4. **{{STEP_N_TITLE}} ({{STEP_N_ADR}}).** {{STEP_N_NARRATIVE}}

### What failed and why

| Attempt | Failure mode | Lesson carried forward |
|---|---|---|
| {{FAILURE_1_ATTEMPT}} | {{FAILURE_1_MODE}} | {{FAILURE_1_LESSON}} |
| {{FAILURE_2_ATTEMPT}} | {{FAILURE_2_MODE}} | {{FAILURE_2_LESSON}} |
| {{FAILURE_N_ATTEMPT}} | {{FAILURE_N_MODE}} | {{FAILURE_N_LESSON}} |

### What worked

- **{{WORKED_ITEM_1}}** -- {{WORKED_ITEM_1_DETAIL}}.
- **{{WORKED_ITEM_2}}** -- {{WORKED_ITEM_2_DETAIL}}.
- **{{WORKED_ITEM_N}}** -- {{WORKED_ITEM_N_DETAIL}}.

<!-- /ANCHOR:process-notes -->

---

<!-- ANCHOR:findings -->
## 6. FINDINGS

<!-- Unique wins, universal floor and ceiling, mismatch analysis, load-bearing insight. Number each finding. -->

### Finding 1 -- {{FINDING_1_TITLE}}

{{FINDING_1_NARRATIVE}}

| {{FINDING_1_TABLE_COL_1}} | {{FINDING_1_TABLE_COL_2}} | {{FINDING_1_TABLE_COL_3}} |
|---|---|---|
| {{FINDING_1_ROW_1}} | {{FINDING_1_ROW_1_B}} | {{FINDING_1_ROW_1_C}} |
| {{FINDING_1_ROW_2}} | {{FINDING_1_ROW_2_B}} | {{FINDING_1_ROW_2_C}} |

### Finding 2 -- {{FINDING_2_TITLE}}

{{FINDING_2_NARRATIVE}}

### Finding 3 -- {{FINDING_3_TITLE}}

{{FINDING_3_NARRATIVE}}

### Finding N -- {{FINDING_N_TITLE}}

{{FINDING_N_NARRATIVE}}

<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:caveats -->
## 7. CAVEATS

<!-- Single-run signal, fixture limits, stack-level confounds, schema migration cost. Be honest. -->

- **{{CAVEAT_1_TITLE}}.** {{CAVEAT_1_DETAIL}}
- **{{CAVEAT_2_TITLE}}.** {{CAVEAT_2_DETAIL}}
- **{{CAVEAT_3_TITLE}}.** {{CAVEAT_3_DETAIL}}
- **Stack distinction.** {{STACK_DISTINCTION_CAVEAT}}. **Do not cross-reference performance numbers** between this report and benchmarks from a different stack.
- **{{CAVEAT_N_TITLE}}.** {{CAVEAT_N_DETAIL}}

<!-- /ANCHOR:caveats -->

---

<!-- ANCHOR:recommendations -->
## 8. RECOMMENDATIONS

<!-- Tier 1: apply now. Tier 2: validate first. Tier 3: future. Each tier is actionable. -->

### Tier 1 -- apply now

- **{{TIER1_REC_1}}** -- {{TIER1_REC_1_DETAIL}}.
- **{{TIER1_REC_2}}** -- {{TIER1_REC_2_DETAIL}}.
- **{{TIER1_REC_N}}** -- {{TIER1_REC_N_DETAIL}}.

### Tier 2 -- validate first

- **{{TIER2_REC_1}}** -- {{TIER2_REC_1_DETAIL}}.
- **{{TIER2_REC_2}}** -- {{TIER2_REC_2_DETAIL}}.

### Tier 3 -- future

- **{{TIER3_REC_1}}** -- {{TIER3_REC_1_DETAIL}}.
- **{{TIER3_REC_2}}** -- {{TIER3_REC_2_DETAIL}}.

<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:reproducibility -->
## 9. REPRODUCIBILITY

<!-- Exact replay commands + expected wall-clock. Make this copy-paste-runnable. -->

The artifacts in this folder support exact replay of the headline numbers.

### Replay the winner's measurement

```bash
# 1. {{REPLAY_STEP_1_COMMENT}}
{{REPLAY_STEP_1_COMMAND}}

# 2. {{REPLAY_STEP_2_COMMENT}}
{{REPLAY_STEP_2_COMMAND}}

# 3. {{REPLAY_STEP_3_COMMENT}}
{{REPLAY_STEP_3_COMMAND}}
```

Expected outcome: {{EXPECTED_OUTCOME_LINE}}.

### Probe raw runtime characteristics

```bash
{{RUNTIME_PROBE_COMMANDS}}
```

### Expected wall-clock

| Step | Approximate time |
|---|---|
| {{WALLCLOCK_STEP_1}} | {{WALLCLOCK_STEP_1_TIME}} |
| {{WALLCLOCK_STEP_2}} | {{WALLCLOCK_STEP_2_TIME}} |
| {{WALLCLOCK_STEP_N}} | {{WALLCLOCK_STEP_N_TIME}} |

### Kill switch

```bash
{{KILL_SWITCH_COMMANDS_OR_NONE}}
```

<!-- /ANCHOR:reproducibility -->

---

<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

<!-- Skill-local files, authoritative spec packet, sibling and follow-on. -->

### Skill-local files

| File | Purpose |
|---|---|
| [`SOURCE.md`](./SOURCE.md) | Pointer to the authoritative spec packet. |
| [`results.csv`](./results.csv) | Raw aggregate scores, one row per candidate. |
| [`per-probe.jsonl`](./per-probe.jsonl) | Per-probe rows. |
| [`runtime-measurements.md`](./runtime-measurements.md) | RAM, residency, raw inference latency for the final candidates. |
| [`../README.md`](../README.md) | Index of all `{{SKILL_NAME}}` benchmarks. |
| [`benchmark_creation.md`](.opencode/skills/sk-doc/references/benchmark_creation.md) | Convention these files follow. |

### Authoritative spec packet

| Path | Why look there |
|---|---|
| `{{SPEC_PACKET_BENCHMARK_RESULTS_PATH}}` | Headline doc with deeper analysis. |
| `{{SPEC_PACKET_DECISION_RECORD_PATH}}` | ADRs in full. |
| `{{SPEC_PACKET_IMPLEMENTATION_SUMMARY_PATH}}` | What was built end-to-end. |
| `{{SPEC_PACKET_EVIDENCE_INDEX_PATH}}` | File-by-file evidence navigation. |

### Sibling and follow-on

| Path | Relationship |
|---|---|
| {{SIBLING_BENCHMARK_PATH_OR_NONE}} | {{SIBLING_BENCHMARK_RELATIONSHIP_OR_NONE}} |
| {{FOLLOWON_PACKET_PATH_OR_NONE}} | {{FOLLOWON_PACKET_RELATIONSHIP_OR_NONE}} |

<!-- /ANCHOR:related-resources -->
