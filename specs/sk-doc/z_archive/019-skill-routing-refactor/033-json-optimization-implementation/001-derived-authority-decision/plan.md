---
title: "Implementation Plan: Derived Schema Authority Decision"
description: "Decision-only plan: reconcile the TS Zod SkillDerivedV2 schema against the Python-compiler derived shape, classify fields, decide syncDerivedMetadata's fate, and record an ADR. No code ships in this phase."
trigger_phrases:
  - "derived schema authority plan"
  - "skill derived v2 field mapping"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/001-derived-authority-decision"
    last_updated_at: "2026-07-29T10:44:35Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-derived-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Operator sign-off on the recommended canonical shape before phase 003 starts build"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Derived Schema Authority Decision

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Reconcile two incompatible definitions of `graph-metadata.json`'s `derived` block — the TS Zod `SkillDerivedV2Schema` (lifecycle-aware, zero production adoption) and the Python compiler's `validate_derived_metadata()` shape (what is actually on disk on all 11 `schema_version: 2` roots and what CI-adjacent validation already enforces) — into one named canonical authority. Classify every field as machine-derivable or authored-preserved, decide the fate of the production-orphaned `syncDerivedMetadata`/`backfillDerivedV2` helpers, and record the decision as ADR(s) in `decision-record.md`. This phase is analysis and documentation only; no schema, code, or generated JSON is modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Evidence | Every schema/field claim cites `file:line`, not an unsourced assertion |
| Zero data loss | The recommended shape maps every field present on any live `derived` block today (checked against all 11 `schema_version: 2` roots) |
| Field disposition completeness | Every field in the TS schema's union with the Python validator's fields has a stated derivable-vs-authored-preserved classification |
| Actionability | The ADR names the exact target shape phases 003/007/009 build against — no open schema question left for them to re-litigate |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No production components change in this phase. The deliverable is a decision artifact (`decision-record.md`) built from a field-reconciliation matrix:

| Field | TS `SkillDerivedV2Schema` | Python `validate_derived_metadata` | On-disk (11/11 roots) |
|-------|---------------------------|-------------------------------------|------------------------|
| `trigger_phrases` | yes | yes (required, non-empty) | present |
| `keywords` / `key_topics` | `keywords` | `key_topics` (required, non-empty) — different name, different vocabulary | `key_topics` present; `keywords` absent |
| `entities` | absent | required, non-empty | present |
| `key_files` | yes | yes (required, non-empty) | present |
| `source_docs` | yes | yes (required, non-empty) | present |
| `causal_summary` | absent | required, non-empty string | present |
| `created_at` | absent | required, ISO timestamp | present |
| `last_updated_at` | absent | required, ISO timestamp | present |
| `generated_at` | yes | absent | absent |
| `provenance_fingerprint` | yes (`sha256:` regex) | absent | absent |
| `demotion` | yes (0-1, default 1) | absent | absent |
| `trust_lane` | yes (enum, default `derived_generated`) | absent | absent |
| `sanitizer_version` | yes (literal) | absent | absent |
| `lifecycle_status` | yes (enum, default `active`) | absent | absent |
| `redirect_from` / `redirect_to` | yes (optional) | absent | absent |

Producers/consumers examined: `lib/derived/sync.ts` (`syncDerivedMetadata`, the only TS-shape writer — test-only callers), `lib/lifecycle/schema-migration.ts` (`backfillDerivedV2` — test-only callers), `handlers/skill-graph/validate.ts` (live MCP handler, `DERIVED-FRESHNESS` warnings, reads timestamp fields from both schemas defensively), `lib/scorer/projection.ts` (production scorer read path, reads the Python-style vocabulary), `scripts/skill_graph_compiler.py` (the validator that actually gates the fleet's 11 roots today).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Inventory every production writer, reader, and validator of the `derived` block across both languages; snapshot the live on-disk shape across all 11 `schema_version: 2` roots; confirm the production-caller count for `syncDerivedMetadata` and `backfillDerivedV2` by repo-wide grep rather than assumption.

### Phase 2: Implementation

Build the field-by-field reconciliation table (above); classify every field as machine-derivable vs authored-preserved; draft ADR-001 (canonical schema authority) with alternatives scored; draft ADR-002 (field disposition + `syncDerivedMetadata`/`backfillDerivedV2` repurpose-vs-delete call).

### Phase 3: Verification

Cross-check the recommended shape against all 11 live `derived` blocks for zero data loss; confirm the decision gives phases 003/007/009 an unambiguous target; run `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No runtime code changes, so no code test suite applies to this phase. The verification is documentary: every field claim in the reconciliation table is re-checked against the cited `file:line`; the recommended shape is checked for lossless coverage of all 11 live `derived` blocks' actual field sets (a manual diff, not an automated test, since no schema is written yet); the ADR's Five Checks Evaluation is completed honestly rather than rubber-stamped. Phase 003 is where an automated regenerator/schema test suite gets built against the shape this phase names.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The 029 research packet's synthesis (`research/research.md` §2-3, theme #1) as the evidence trigger; direct re-reads of `schemas/skill-derived-v2.ts`, `scripts/skill_graph_compiler.py`, `lib/derived/sync.ts`, `lib/lifecycle/schema-migration.ts`, `handlers/skill-graph/validate.ts`, `lib/scorer/projection.ts`; the `system-spec-kit` decision-record template.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase writes documentation only — no schema, code, generated JSON, or on-disk `graph-metadata.json` file is touched. If the recommendation in `decision-record.md` is rejected at operator sign-off, rollback is trivial: revise or discard the ADR and re-run this phase's analysis with the corrected direction; nothing downstream has been built against it yet since phases 003/007/009 are explicitly gated on this decision landing first. Because the blast radius of the *decision itself* is high (it determines the target shape for a fleet-wide regenerator, a freshness gate, and a CI validator), the ADR is deliberately written as a recommendation pending explicit operator acceptance rather than a self-declared final answer — see `decision-record.md` ADR-001 Status: Proposed.
<!-- /ANCHOR:rollback -->
