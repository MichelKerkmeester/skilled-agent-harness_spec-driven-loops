---
title: "Research: Styles Tree Restructure (data/code separation + runtime alignment)"
description: "Forced 5-iter GPT-5.6-SOL research on separating the 1,290 style data folders from backend code and aligning the styles tree to the deep-loop/runtime architecture."
trigger_phrases:
  - "styles restructure research"
  - "styles data code separation"
  - "styles runtime architecture alignment"
importance_tier: "important"
contextType: "research"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/005-gap-remediation-research/001-restructure"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "gap-research"
    recent_action: "Launched forced 5-iter SOL research on the styles restructure gap."
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

# Research: Styles Tree Restructure (gap A1 + A5)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (research) |
| **Status** | In Progress |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None (first research child) |
| **Successor** | `002-naming-manifests` |
| **Phase** | 1 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM

The `styles/` directory mixes 1,290 downloaded style data folders with the backend code
(`_db`, `_engine`, `_harness`) and two manifests in one flat namespace (gap A1), and follows none of
the proven `deep-loop/runtime` separation (code in `lib/`, real `.sqlite` in `database/`) (gap A5).
See `../gap-analysis.md` §A1/§A5.
<!-- /ANCHOR:problem -->

---

## 3. RESEARCH QUESTION

How should the `styles/` tree be restructured to (a) separate the downloaded style **data** from the
**backend code**, and (b) align to the `deep-loop/runtime` architecture? Deliver a concrete target
folder layout, a migration path from the current flat mixed structure, and the `git-mv` rename plan —
grounded in the actual current tree and the runtime reference.

## 4. SCOPE

Research and recommend only. No file moves or renames are executed in this child. Output is
`research/research.md` (a forced 5-iteration SOL synthesis).

## RELATED DOCUMENTS

- `../gap-analysis.md` — evidence for gaps A1/A5.
- `research/research.md` — the synthesis (written by the deep-research loop).
