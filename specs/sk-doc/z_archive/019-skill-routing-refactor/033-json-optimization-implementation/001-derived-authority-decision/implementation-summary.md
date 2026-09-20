---
title: "Implementation Outcome: Derived Schema Authority Decision"
description: "Planned record of the decision-only phase that will name the single canonical authority for graph-metadata.json's derived block, reconciling the TS Zod SkillDerivedV2 schema against the live Python-compiler shape."
trigger_phrases:
  - "derived schema authority outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/001-derived-authority-decision"
    last_updated_at: "2026-07-29T10:44:35Z"
    last_updated_by: "claude-code"
    recent_action: "Accepted ADR-001/ADR-002; verified vs source; phase complete"
    next_safe_action: "Phase 003 builds against the accepted merged shape"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-derived-authority-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical derived shape = Python core + additive TS lifecycle fields (ADR-001 Accepted)"
      - "On-disk derived uniformly Python across 11/11 roots; 0 carry any TS-only field (re-verified)"
      - "syncDerivedMetadata repurposed as the phase-003 regenerator entry point (ADR-002)"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Derived Schema Authority Decision

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Scope** | Decision-only — no code, schema, or generated JSON changes |
| **Unblocks** | Phases 003, 007, 009 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase produced the single decision that unblocks the program's build phases: which of the two currently-incompatible `graph-metadata.json.derived` schema definitions is canonical. `decision-record.md` records it as two Accepted ADRs — ADR-001 names the canonical shape (the Python-compiler shape as core, the seven TS-only lifecycle fields folded in additively, `keywords` retired in favor of `key_topics`+`entities`), and ADR-002 classifies every field as machine-derivable vs authored-preserved (`causal_summary`/`lifecycle_status`/`redirect_*` preserved; `trigger_phrases`/`key_topics`/`entities`/`key_files`/`source_docs` regenerated) and repurposes the production-orphaned `syncDerivedMetadata` writer as the phase-003 regenerator entry point. No regenerator, freshness gate, or CI wiring is built here — those are phases 003/007/009, which now have one unambiguous target shape to build against.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct re-reads of the six production files that write, read, or validate the `derived` block (`schemas/skill-derived-v2.ts`, `lib/derived/sync.ts`, `lib/lifecycle/schema-migration.ts`, `handlers/skill-graph/validate.ts`, `lib/scorer/projection.ts`, `scripts/skill_graph_compiler.py`), plus a direct inspection of a live root's on-disk `derived` block, ground the field-reconciliation table in `plan.md` §3. The recommendation in `decision-record.md` follows from that table rather than from the 029 research summary alone — every claim is re-verified against source in this phase, per the finding-is-a-hypothesis discipline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The accepted decision (see `decision-record.md` ADR-001, Status: Accepted) took the lowest-blast-radius option: keep the Python-compiler shape as the authored/derived core, since it is what all 11 live roots already carry and what the only CI-adjacent validator (`skill_graph_compiler.py`) already enforces, and fold the TS-only lifecycle fields in as additive/optional fields with defaults rather than forcing an immediate fleet-wide migration. `syncDerivedMetadata`'s atomic-write and idempotent-diff design is repurposed as the future regenerator's entry point once it targets the merged shape, rather than deleted, since its production-orphan status today is a wiring gap, not a design flaw. Accepted autonomously under the 030 implementation goal after every load-bearing claim was re-verified against the current tree; the real schema/code/data changes remain phase 003's guarded, reversible work.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All load-bearing claims were re-run against the current tree (recorded in `decision-record.md` Verification): 11/11 roots carry the Python shape and 0 carry any TS-only field; `syncDerivedMetadata`/`backfillDerivedV2` have zero production invocations (the one non-test reference in `extract.ts:219` is a comment); `projection.ts` reads `key_topics`/`entities`/`key_files`/`source_docs`, never `derived.keywords`; the TS schema is imported by four live modules. The recommended shape is lossless against every field on disk today. `validate.sh --strict` passes clean on this folder; all 16 `checklist.md` items are marked `[x]` with evidence.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase is decision-only; it does not verify that the recommended shape actually works as a regenerator target beyond a lossless-mapping check against current data — that verification is phase 003's job once code exists to test. The recommendation is a single-session re-verification of the 029 research's theme #1 finding, not an independent re-run of the three-lineage research process; if operator review surfaces a production consumer of the TS-only lifecycle fields that this phase's grep missed, the recommendation must be revised before sign-off.
<!-- /ANCHOR:limitations -->
