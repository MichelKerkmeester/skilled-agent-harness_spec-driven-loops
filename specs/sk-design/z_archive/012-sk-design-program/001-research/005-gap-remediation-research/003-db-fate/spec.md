---
title: "Research: Styles SQLite Database Fate (wire-in vs shelve)"
description: "Forced 5-iter GPT-5.6-SOL research deciding whether to wire the dormant styles SQLite DB into the default path or formally shelve it in favor of the flat-file engine."
trigger_phrases:
  - "styles database fate research"
  - "styles sqlite wire in or shelve"
  - "styles db utilization decision"
importance_tier: "important"
contextType: "research"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/005-gap-remediation-research/003-db-fate"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "gap-research"
    recent_action: "Launched forced 5-iter SOL research on the dormant-database fate gap."
    next_safe_action: "Read research/research.md when the loop completes."
    blockers: []
    key_files:
      - "../gap-analysis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gap-research-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research: Styles SQLite Database Fate (gap A4)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (research) |
| **Status** | In Progress |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `002-naming-manifests` |
| **Successor** | `004-commands` |
| **Phase** | 3 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM

The styles SQLite DB (`_db`, ~37 files: schema/indexer/retrieval/vectors/oracle/telemetry) is built
but dormant: **no `.sqlite` file exists** and the default mode is `legacy` (flat-file engine
authoritative). ~50 files of DB/engine code with zero default-path use. See `../gap-analysis.md` §A4.
<!-- /ANCHOR:problem -->

---

## 3. RESEARCH QUESTION

Should the DB be (a) fully wired into the default retrieval path and actually built/populated, or
(b) formally shelved with the flat-file engine as the single source? Deliver a decision framework with
each option's cost/benefit, the wiring plan if kept, and the deprecation plan if shelved — grounded in
how the design-mode corpus modules consume the library today.

## 4. SCOPE

Research and recommend only. No code wired or removed. Output is `research/research.md` (forced 5-iter SOL).

## RELATED DOCUMENTS

- `../gap-analysis.md` — evidence for gap A4.
- `../../015-styles-database-evolution/001-foundation/` — the DB foundation under review.
- `research/research.md` — the synthesis.
