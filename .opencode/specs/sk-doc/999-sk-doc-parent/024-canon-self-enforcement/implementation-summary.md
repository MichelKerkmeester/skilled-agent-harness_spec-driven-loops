---
title: "Implementation Summary: Canon self-enforcement (parent-hub hardening)"
description: "Executed the canon self-enforcement program: the DO-NOW foundational trio + hardening batch shipped and verified (parent-skill-check exit 0 / 0 warnings on all four hubs, validate --strict 0/0). The gate-adjacent scoring tranche (WU8/10/11/12c) stays deferred behind the operator-owned advisor scorer lane per ADR-002, to co-land with the 193-row re-baseline as one event."
trigger_phrases:
  - "canon self-enforcement summary"
  - "999 sk-doc phase 024 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-08T15:52:50Z"
    last_updated_by: "claude-opus"
    recent_action: "DO-NOW batch shipped+verified (4/4 hubs, validate 0/0); packet closed"
    next_safe_action: "Gate-adjacent tranche awaits operator-opened scorer lane + 193-row re-baseline"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "D1 /doc:quality: create the missing command (ADR-003); D2 doctor panel report-only (ADR-004); D3 keep sk-hub family (ADR-005)"
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
| **Completed** | 2026-07-08 (DO-NOW batch shipped + verified; gate-adjacent tranche deferred per ADR-002) |
| **Level** | 3 |
| **Deliverable** | The Level 3 packet + the shipped DO-NOW batch: WU1-7, WU9, WU12a/b/d (CI hub-glob gate, vocab-agreement battery, `edge_type` CHECK self-heal, command-binding gate, read-only doctor freshness panel, checker fixture harness, discovery-parity, `description.json` rule 8b, template `sk-hub` family, `command⊆toolSurface` rule) |
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
| DO-NOW execution | Pass | WU1-7, WU9, WU12a/b/d shipped; `parent-skill-check` exit 0 / 0 warnings on all four hubs (2026-07-08 re-verify, post-rename tree); new vitests green + WU8 guard red-proven |
| Packet close-out | Pass | `validate.sh --strict` 0/0 on the closed packet (2026-07-08); gate-adjacent tranche documented as a deferred separate scoring event per ADR-002 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Gate-adjacent tranche deferred (WU8/10/11/12c) — a separate scoring event, not incomplete 024 work.** These four units change advisor scoring, so per ADR-002 they co-land with the operator-owned scorer lane and one 193-row parity re-baseline (plus the 023 WU5 command-bridge unit sharing the gate). As of close-out the gate has NOT fired: the scorer lane was mutated 2026-07-08 by the system-deep-loop rename closeout (`381729834a`, which recomputed `scorer-eval-baseline.json`), and the branch is diverged from origin. A Fable-5 verdict (2026-07-08) confirmed DEFER and that all four bugs are still live and were NOT absorbed by the rename — WU8 (`metadata-sanitizer.ts:60-68` still drops object entities, red-proven by its guard test), WU10 (`parent-hub-vocab-sync.cjs:113-118` first-match-wins prefix bug), WU11 (5 corpus rows still carry the dead `/deep:start-*-loop` ids), WU12c (`projection.ts:587` `docTierWeight(importance_tier)`).
2. **PREP artifact staleness at execution time.** `references/wu11-dead-id-sequencing.md` still names the pre-rename `deep-loop-workflows/mode-registry.json` as the emit source (renamed to `system-deep-loop` on 2026-07-08, compat symlinks removed) and estimates "≈8 rows" where 5 now survive. The WU8 guard is self-refreshing (it is a test); the sequencing doc must be re-derived when the tranche executes. **Restated gate**: quiet operator-opened scorer lane + branch reconciled with origin + co-land with 023 WU5 + baseline recomputed once from the post-rename `corpusSha256`.
3. **Parent metadata drift noted, not fixed** — the `999-sk-doc-parent/graph-metadata.json` still carries the pre-rename `skilled-agent-orchestration/125-sk-doc-parent` packet_id and 001–021 children_ids, while 022/023/024 self-identify as `sk-doc/999-sk-doc-parent/...`; left for the operator-gated reindex.
<!-- /ANCHOR:limitations -->
