---
title: "Implementation Outcome: Derived Schema Authority Decision"
description: "Planned record of the decision-only phase that will name the single canonical authority for graph-metadata.json's derived block, reconciling the TS Zod SkillDerivedV2 schema against the live Python-compiler shape."
trigger_phrases:
  - "derived schema authority outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/001-derived-authority-decision"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-derived-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Operator sign-off on the ADR-001 recommendation before phase 003 begins build"
    answered_questions:
      - "Live on-disk derived shape confirmed uniform Python-compiler vocabulary across all 11 schema_version-2 roots"
      - "syncDerivedMetadata and backfillDerivedV2 confirmed to have zero production callers (test-only)"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Derived Schema Authority Decision

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Target** | TBD (pending operator scheduling) |
| **Track** | sk-doc |
| **Scope** | Decision-only — no code, schema, or generated JSON changes |
| **Blocks** | Phases 003, 007, 009 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase will produce a single decision: which of the two currently-incompatible `graph-metadata.json.derived` schema definitions is canonical, reconciled field-by-field so nothing on disk today is lost and nothing already designed in the TS lifecycle layer (`lifecycle_status`, `redirect_from`, `redirect_to`, `demotion`, `trust_lane`) is silently discarded without a stated rationale. The deliverable is `decision-record.md`: an ADR naming the canonical shape, a field-disposition table (machine-derivable vs authored-preserved), and an explicit call on the disposition of the production-orphaned `syncDerivedMetadata` writer and `backfillDerivedV2` helper. No regenerator, freshness gate, or CI wiring is built here — those are phases 003/007/009, gated on this decision landing first.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct re-reads of the six production files that write, read, or validate the `derived` block (`schemas/skill-derived-v2.ts`, `lib/derived/sync.ts`, `lib/lifecycle/schema-migration.ts`, `handlers/skill-graph/validate.ts`, `lib/scorer/projection.ts`, `scripts/skill_graph_compiler.py`), plus a direct inspection of a live root's on-disk `derived` block, ground the field-reconciliation table in `plan.md` §3. The recommendation in `decision-record.md` follows from that table rather than from the 029 research summary alone — every claim is re-verified against source in this phase, per the finding-is-a-hypothesis discipline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The recommendation under review (see `decision-record.md` ADR-001, Status: Proposed) favors the lowest-blast-radius option: keep the Python-compiler shape as the authored/derived core, since it is what all 11 live roots already carry and what the only CI-adjacent validator (`skill_graph_compiler.py`) already enforces, and fold the TS-only lifecycle fields in as additive/optional fields with defaults rather than forcing an immediate fleet-wide migration. `syncDerivedMetadata`'s atomic-write and idempotent-diff design is recommended for repurposing as the future regenerator's entry point once it targets the merged shape, rather than deletion, since its production-orphan status today is a wiring gap, not a design flaw. This is a recommendation pending operator sign-off, not a final decision — the packet Status stays Planned until that sign-off lands.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run. When this phase executes, verification will consist of: (1) the field-reconciliation table checked against all 11 live `derived` blocks for zero data loss, (2) `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` passing clean, (3) `checklist.md` items marked `[x]` with evidence, and (4) explicit operator acceptance of ADR-001/ADR-002 recorded before phase 003 is allowed to start build.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase is decision-only; it does not verify that the recommended shape actually works as a regenerator target beyond a lossless-mapping check against current data — that verification is phase 003's job once code exists to test. The recommendation is a single-session re-verification of the 029 research's theme #1 finding, not an independent re-run of the three-lineage research process; if operator review surfaces a production consumer of the TS-only lifecycle fields that this phase's grep missed, the recommendation must be revised before sign-off.
<!-- /ANCHOR:limitations -->
