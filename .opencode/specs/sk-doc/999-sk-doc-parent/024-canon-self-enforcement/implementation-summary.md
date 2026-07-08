---
title: "Implementation Summary: Canon self-enforcement (plan)"
description: "Authored the twelve-work-unit canon self-enforcement plan: a DO-NOW foundational trio plus hardening batch, and a gate-adjacent tranche deferred behind the operator-owned advisor scorer lane. Planning only — no source touched; execution begins after the operator resolves three forks."
trigger_phrases:
  - "canon self-enforcement summary"
  - "999 sk-doc phase 024 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-07T20:38:30Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the 024 canon-self-enforcement plan (planning only)"
    next_safe_action: "Operator resolves D1-D3 then execute Phase 2 trio"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/999-sk-doc-parent/024-canon-self-enforcement/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Operator resolves D1 (/doc:quality fix-vs-ratchet), D2 (zombie nodes panel), D3 (sk-hub family)"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-canon-self-enforcement |
| **Completed** | 2026-07-07 (planning only; execution pending) |
| **Level** | 3 |
| **Deliverable** | `spec.md` + `plan.md` (twelve WUs, five phases) + `tasks.md` + `checklist.md` + `decision-record.md` (5 ADRs) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Level 3 planning packet that turns the AI Council opportunity map into a sequenced, phased, gated program. Every one of the twelve council opportunities maps to a work unit in `plan.md` §3 with a re-verified `file:line` anchor, a fix approach, and a verification gate.

### The twelve work units (council numbering preserved)

1. **WU1 (P1, DO-NOW)** — widen the canon CI gate to all four hubs via `skills/*/mode-registry.json` glob + per-hub checker loop; fix the `parent-skill-check.cjs` CWD bug (`:194`,`:599`,`:608`).
2. **WU2 (P1, DO-NOW)** — a cross-language vocabulary-agreement battery (one `vitest`) across ~12 dialects; subset-flag the two gated read-only sites (`skill_advisor.py:242`, `graph-causal.ts:28-34`).
3. **WU3 (P1, DO-NOW)** — defuse the `edge_type` `CHECK` (`skill-graph-db.ts:209`) by cloning the `family` self-heal migration (`:372-422`).
4. **WU4 (P1, DO-NOW, D1)** — command-binding existence gate; RED on `/doc:quality` (`sk-doc/mode-registry.json:145`).
5. **WU5 (P2, DO-NOW, D2)** — read-only doctor freshness panel (report-only).
6. **WU6 (P2, DO-NOW)** — checker fixture harness; delete dead `VALID_BACKEND_KINDS` (`parent-skill-check.cjs:58`).
7. **WU7 (P2, DO-NOW)** — discovery-pipeline parity fixtures.
8. **WU8 (GATE-ADJ)** — `derived.entities` shape break (`metadata-sanitizer.ts:60-68`): guard now, fix post-gate.
9. **WU9 (P2, DO-NOW)** — `description.json` guard (checker rule 8b).
10. **WU10 (GATE-ADJ)** — vocab-sync prefix bug (`parent-hub-vocab-sync.cjs:113-118`).
11. **WU11 (GATE-ADJ)** — dead-id retirement + corpus rewrite + 193-row re-baseline as one event.
12. **WU12 (P2, DO-NOW, D3)** — small cluster (template `sk-hub` line, toolSurface rule, `importance_tier`, family fork).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, this file | Add | The Level 3 packet |
| `description.json`, `graph-metadata.json` | Add | Generated metadata (`generate-description.js`, `backfill-graph-metadata.js`) |
| `../graph-metadata.json` (parent) | Modify | Enroll 024 (+ missing 022/023) as children; set `last_active_child_id` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built directly from the AI Council opportunity map, re-verifying every cited anchor against HEAD before writing (e.g. `routing-registry-drift.yml:11,18,51` watches only deep-loop among the hubs; `skill-graph-db.ts:191` shows `family` is now bare `TEXT NOT NULL` while `:209` still carries the `edge_type` CHECK; `parent_skill_graph_metadata_template.json:5` still omits `sk-hub`; `.opencode/commands/doc/` is absent). The plan leads Phase 2 with the foundational trio (the pair that would have prevented both prior incidents), groups the remaining DO-NOW units into Phase 3, and partitions the three scoring-adjacent units into a Phase 4 tranche gated behind the operator opening the advisor scorer lane and its 193-row parity re-baseline. Each gated unit gets a gate-free PREP step in Phase 1 so the post-gate batch is mechanical. Doc structure mirrors the Level 3 templates exactly (verified anchor + header contract via `template-structure.js`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Lead with the foundational trio (ADR-001) | WU1+WU2+WU3 together would have caught both the transport and `sk-hub` dialect drifts |
| Partition + gate the scorer-adjacent tranche (ADR-002) | WU8-fix/WU10/WU11 shift scoring; they must co-land with the 193-row re-baseline |
| `/doc:quality` fix over ratchet (ADR-003, D1) | Create the missing command so the binding resolves; reserve the allowlist for dead ids |
| Report-only doctor panel (ADR-004, D2) | The canonical reindex is operator-gated; never self-heal a stale graph |
| Keep the generic `sk-hub` family (ADR-005, D3) | Future-proofs non-code/design hubs; avoids enlarging the dialect surface |
| Make a TEST the single enforcer per dialect | Moving a dialect toward the registry once is not enough; a guard stops future drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Opportunity coverage | Pass | Council items 1–12 each mapped to a WU; no orphan |
| Anchor accuracy | Pass | Every cited `file:line` re-verified against HEAD before authoring |
| Gate partition | Pass | DO-NOW vs GATE-ADJ vs OPERATOR-DECISION explicit; the scorer-lane gate named in ADR-002 |
| Plan validity | Pass | `validate.sh --strict` exits 0 for this folder (planning gate) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning only** — no hub / checker / advisor / scorer source was touched. Execution begins once the operator resolves the three forks (D1–D3); the DO-NOW trio can then proceed on defaults.
2. **Three units are hard-gated** — WU8-fix, WU10, and WU11 touch the operator-owned advisor scorer track and its 193-row parity re-baseline; they stay PREP-only until the operator opens the lane, then co-land as one re-baseline event (with the 023 WU5 command-bridge unit that shares the same gate).
3. **Parent metadata drift noted, not fixed** — the `999-sk-doc-parent/graph-metadata.json` still carries the pre-rename `skilled-agent-orchestration/125-sk-doc-parent` packet_id and 001–021 children_ids, while 022/023/024 self-identify as `sk-doc/999-sk-doc-parent/...`; this packet enrolls 024 (and the missing 022/023) in the current convention but leaves the stale prefix for the operator-gated reindex.
<!-- /ANCHOR:limitations -->
