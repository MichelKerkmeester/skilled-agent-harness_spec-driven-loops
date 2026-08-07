---
title: "Research: Kebab Naming Conformance + Manifest Consolidation"
description: "Forced 5-iter GPT-5.6-SOL research on renaming the underscore styles backend to kebab-case and reconciling the two overlapping manifests into one source of truth."
trigger_phrases:
  - "styles naming conformance research"
  - "styles manifest consolidation"
  - "kebab rename styles backend"
importance_tier: "important"
contextType: "research"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/005-gap-remediation-research/002-naming-manifests"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "gap-research"
    recent_action: "Launched forced 5-iter SOL research on the naming + manifests gap."
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

# Research: Kebab Naming Conformance + Manifest Consolidation (gap A2 + A3)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (research) |
| **Status** | In Progress |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-restructure` |
| **Successor** | `003-db-fate` |
| **Phase** | 2 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM

`_db`, `_engine`, `_harness`, `_manifest.json`, `_retrieval-manifest.json` violate the kebab-case
canon (`filesystem-naming-convention.md`) — not Python, not historical, so not exempt (gap A2). And
two manifests (crawl `_manifest.json` + DB `_retrieval-manifest.json`, both listing 1,290 styles) are
overlapping sources of truth (gap A3). See `../gap-analysis.md` §A2/§A3.
<!-- /ANCHOR:problem -->

---

## 3. RESEARCH QUESTION

What is the exact kebab rename map for the styles backend (with a safe import/reference-update plan so
nothing breaks), and how should the two overlapping manifests be consolidated into a single source of
truth? Ground in the naming canon and the two manifest schemas.

## 4. SCOPE

Research and recommend only. No renames executed. Output is `research/research.md` (forced 5-iter SOL).

## RELATED DOCUMENTS

- `../gap-analysis.md` — evidence for gaps A2/A3.
- `research/research.md` — the synthesis.
