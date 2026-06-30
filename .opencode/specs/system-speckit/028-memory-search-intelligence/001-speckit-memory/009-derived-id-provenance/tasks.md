---
title: "Tasks: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "Task breakdown for C4-B: the shipped content-id-module dependency is pre-checked with its 030 commit, and the C4-B implementation tasks (derived-id helper, additive TEXT UNIQUE migration + anchor-safe backfill, write-path wiring, identity + migration tests) are pending behind the schema-migration gate."
trigger_phrases:
  - "C4-B tasks"
  - "derived_id task breakdown"
  - "content-addressed causal edge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-derived-id-provenance"
    last_updated_at: "2026-06-19T15:50:18Z"
    last_updated_by: "codex"
    recent_action: "Implemented C4-B derived-id provenance with v40 migration and focused tests"
    next_safe_action: "Benchmark cost if needed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed (with commit evidence) or a satisfied pre-existing dependency |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Action (primary seam) [status/evidence]`

**Candidate status**: C4-B is **DONE** behind the default-off `SPECKIT_DERIVED_ID_PROVENANCE` gate. Its only shared-infra dependency, the two-primitive content-id module, was already shipped and is reused by the implementation.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M0 | T001 | Shipped dependency (content-id module) |
| M1 | T002-T003 | Setup + recipe decisions |
| M2 | T004-T007 | Helper + migration + write-path |
| M3 | T008-T012 | Verification + strict validation |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Two-primitive content-id module exists and exposes `hashCanonicalJson` (`lib/content-id.ts`) [Done, shipped in 030 commit `18c8582e33`, `hashContentBody` + `hashCanonicalJson` confirmed present at `lib/content-id.ts:14,19`].
- [x] T002 Read the legacy anchor-inclusive UNIQUE + migration transaction shape (`vector-index-schema.ts`) and confirm the derived vs manual write split in `causal-edges.ts`. Evidence: v40 extends the existing idempotent helper/migration pattern, manual rows keep `derived_id = NULL`.
- [x] T003 Decide the canonical-field order, derived-artifact kind-tag, `source` definition and the legacy `rule_version` sentinel. Evidence: `decision-record.md` ADR-002 / ADR-003 accepted, helper freezes `kind, source_id, target_id, relation, source_anchor, target_anchor, source, rule_version`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the derived-artifact id helper to `lib/content-id.ts`, compose the **anchor-inclusive** canonical triple + `source` + `rule_version` + kind-tag and call `hashCanonicalJson` (NO new sha256 primitive). Evidence: `deriveCausalEdgeDerivedId()`.
- [x] T005 Add the additive `derived_id TEXT` column + `CREATE UNIQUE INDEX` to `causal_edges` in `vector-index-schema.ts`. Evidence: `ensureDerivedIdProvenanceSchema()` creates `idx_causal_edges_derived_id`.
- [x] T006 Add the migration step + `SCHEMA_VERSION` bump + anchor-safe backfill / dedup pre-pass so existing derived rows backfill with zero legacy-UNIQUE rejections. Evidence: `SCHEMA_VERSION = 40`, `backfillDerivedCausalEdgeIds()` and duplicate-safe partial unique index tests.
- [x] T007 Wire `insertEdge`/`insertEdgesBatch` to compute + persist `derived_id` for derived (generated) rows only, leaving the manual-edge path byte-identical (`causal-edges.ts`). Evidence: gated by `SPECKIT_DERIVED_ID_PROVENANCE`, manual rows tested as `NULL`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P] Unit test: identical canonical-triple + source + rule_version (anchors included) → identical `derived_id`. Evidence: `derived-id-provenance.vitest.ts` stable-id test.
- [x] T009 [P] Unit test: a `rule_version` change → a distinct `derived_id`, and an anchor change → a distinct `derived_id`. Evidence: `derived-id-provenance.vitest.ts` anchor/rule-version tests.
- [x] T010 Migration test on a real DB copy: additive column + index, anchor-safe backfill, zero legacy-UNIQUE rejections, restore preserves the id, manual edges untouched. Evidence: migration, duplicate-safe, replay, tombstone-metadata and manual-null tests in `derived-id-provenance.vitest.ts`.
- [x] T011 Run Memory MCP `npm run typecheck` + `npm run build`, run the focused causal/derived-id Vitest suite, then classify any broad-suite failures against the baseline. Evidence: `npm run typecheck` exit 0, `npm run build` exit 0, focused Vitest 5 files / 41 tests passed. Broad ranking slice intentionally not run because concurrent `rrf-fusion` work owns its failure.
- [x] T012 Run `validate.sh --strict` on this packet and fix structure issues. Evidence: `validate.sh --strict` exit 0 after doc updates.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `derived_id` is content-addressed, anchor-inclusive and reproducible from the canonical input.
- [x] The migration is additive, bumps `SCHEMA_VERSION` once to 40 and backfills with zero legacy-UNIQUE rejections for anchor-distinct rows.
- [x] Derived-edge writes persist `derived_id` behind `SPECKIT_DERIVED_ID_PROVENANCE`, and the manual-edge path keeps `derived_id = NULL`.
- [x] Typecheck, build, focused suite and strict validation pass, with evidence recorded in `implementation-summary.md` at completion.

### Benchmark-Only Residuals

- [ ] Derived-edge insert cost benchmark remains **PENDING**. Reason: C4-B shipped for correctness, no measured benefit/cost claim is made and the requested verification scope was typecheck + targeted tests + strict packet validation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md` (esp. §3 Scope, §4 Requirements).
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Decision record**: `decision-record.md`.
- **Shipped dependency**: 030 commit `18c8582e33` (two-primitive content-id module).
- **Source research**: `../research/research.md`, `../../research/synthesis/01-go-candidates.md`, `../../research/synthesis/04-sibling-and-cross-cutting.md`.
<!-- /ANCHOR:cross-refs -->
