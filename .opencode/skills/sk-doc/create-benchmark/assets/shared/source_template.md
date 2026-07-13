---
title: "SOURCE: [BENCHMARK_TOPIC] ([PROMOTION_DATE_LONG])"
description: "Wayfinding pointer from the skill-local benchmark folder to the authoritative spec packet for the [PROMOTION_DATE_LONG] [BENCHMARK_TOPIC]. Maps each spec-packet file to the questions it answers."
trigger_phrases:
  - "[SKILL_NAME] benchmark source"
  - "[BENCHMARK_TOPIC] spec packet pointer"
  - "[BENCHMARK_TOPIC] bake-off source"
importance_tier: "important"
contextType: "general"
version: 1.8.0.3
---

<!--
SOURCE.md scaffold for mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/SOURCE.md.

Usage:
  cp .opencode/skills/sk-doc/create-benchmark/assets/shared/source_template.md \
     .opencode/skills/<your-skill>/mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/SOURCE.md

Replace every [PLACEHOLDER]. Do not leave unfilled brackets in the shipped file.

Creation reference: .opencode/skills/sk-doc/create-benchmark/SKILL.md
-->

# SOURCE: [BENCHMARK_TOPIC] ([PROMOTION_DATE_LONG])

> Pointer to the authoritative spec packet that owns the [PROMOTION_DATE_LONG] `[SKILL_NAME]` [BENCHMARK_TOPIC]. The skill-local folder you are reading is curated. The spec packet is the audit trail.

---

## 1. OVERVIEW

### What this file is

A wayfinding doc. It does not duplicate the spec packet content. It tells you which file in the spec packet to open for which question, so you do not have to scan all evidence files when you only need one.

### What lives in the spec packet, not here

- The full ADR trail covering [ADR_SUMMARY_ONE_LINE].
- Methodology details and fixture notes.
- Per-candidate rollback rationale.
- [ANY_OTHER_SPEC_PACKET_CONTENT].

### What lives in this folder, curated

- `benchmark_report.md`: the headline summary with the ten-section structure.
- `results.csv`: one row per candidate, headline metrics, verdict.
- `per-probe.jsonl`: per-query rows (when applicable).
- `runtime-measurements.md`: runtime profile for finalists (when applicable).
- `SOURCE.md`: this file.

---

## 2. SPEC PACKET LOCATION

```text
[ORIGINATING_SPEC_PACKET_PATH]
```

[OPTIONAL_RENAME_NOTE: e.g., "Renamed from [OLD_SLUG] to [NEW_SLUG] on [DATE_ISO]."]

---

## 3. WHEN TO READ WHAT

Match the question you have to the file that answers it.

| Question | Open this first | Backup |
|---|---|---|
| Which candidate won? | [DECISION_RECORD_FILE] [ADR_ID] | [EVIDENCE_FILE_1] |
| Is the production default safe to ship? | `implementation-summary.md` | [DECISION_RECORD_FILE] |
| What fixture was used and why? | [DECISION_RECORD_FILE] [ADR_ID] | [FIXTURE_EVIDENCE_FILE] |
| How was the sample picked? | [SAMPLE_EVIDENCE_FILE] | [DECISION_RECORD_FILE] |
| [ADDITIONAL_QUESTION] | [ADDITIONAL_ANSWER_FILE] | [ADDITIONAL_BACKUP_FILE] |

---

## 4. EVIDENCE FILE MAP

| File | What |
|---|---|
| [EVIDENCE_FILE_1] | [EVIDENCE_FILE_1_DESCRIPTION] |
| [EVIDENCE_FILE_2] | [EVIDENCE_FILE_2_DESCRIPTION] |
| [EVIDENCE_FILE_3] | [EVIDENCE_FILE_3_DESCRIPTION] |
| [EVIDENCE_FILE_N] | [EVIDENCE_FILE_N_DESCRIPTION] |

---

## 5. FOLLOW-ON PACKETS

[DESCRIBE_EACH_FOLLOW_ON_PACKET_OR_WRITE: "No follow-on packets at time of promotion."]

---

## 6. WHEN TO UPDATE THIS FILE

- The spec packet gets renamed or moved: update §2 and any path references in §4 and §5.
- New ADRs land: update the ADR range in §1 and add rows to §3.
- A follow-on packet ships: update its row in §5 with a one-line completion marker.
- An evidence file is added or fundamentally revised: mirror the change in §4.

### Last updated

[PROMOTION_DATE_ISO], initial SOURCE.md for the [BENCHMARK_TOPIC] promotion.
