---
title: "Tasks: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "Task breakdown for C4-B: the shipped content-id-module dependency is pre-checked with its 030 commit; the C4-B implementation tasks (derived-id helper, additive TEXT UNIQUE migration + anchor-safe backfill, write-path wiring, identity + migration tests) are pending behind the schema-migration gate."
trigger_phrases:
  - "C4-B tasks"
  - "derived_id task breakdown"
  - "content-addressed causal edge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-009-derived-id-provenance"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored C4-B task breakdown (dependency pre-checked, impl pending)"
    next_safe_action: "Fix the canonical-field recipe (T003) before the migration tasks"
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
    completion_pct: 0
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

**Candidate status**: C4-B is **PENDING** behind the **schema-migration** gate. Its only shared-infra dependency — the two-primitive content-id module — is **already shipped** (030 commit `18c8582e33`) and is therefore pre-checked below.
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

- [x] T001 Two-primitive content-id module exists and exposes `hashCanonicalJson` (`lib/content-id.ts`) [Done — shipped in 030 commit `18c8582e33`; `hashContentBody` + `hashCanonicalJson` confirmed present at `lib/content-id.ts:14,19`].
- [ ] T002 Read the legacy anchor-inclusive UNIQUE + migration transaction shape (`vector-index-schema.ts:1104-1136`, `:838-926`) and confirm the derived vs manual write split in `causal-edges.ts:282-473`.
- [ ] T003 Decide the canonical-field order, derived-artifact kind-tag, `source` definition, and the legacy `rule_version` sentinel (records into `decision-record.md` ADR-002 / ADR-003).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the derived-artifact id helper to `lib/content-id.ts` — compose the **anchor-inclusive** canonical triple + `source` + `rule_version` + kind-tag and call `hashCanonicalJson` (NO new sha256 primitive). [REQ-001/004]
- [ ] T005 Add the additive `derived_id TEXT UNIQUE` column (rowid alias, NOT `AUTOINCREMENT`) + `CREATE UNIQUE INDEX` to `causal_edges` in `vector-index-schema.ts`. [REQ-003]
- [ ] T006 Add the migration step + `SCHEMA_VERSION` bump + anchor-safe backfill / dedup pre-pass so existing derived rows backfill with zero legacy-UNIQUE rejections. [REQ-002/003]
- [ ] T007 Wire `insertEdge`/`insertEdgesBatch` to compute + persist `derived_id` for derived (generated) rows only; leave the manual-edge path byte-identical (`causal-edges.ts`). [REQ-006]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 [P] Unit test: identical canonical-triple + source + rule_version (anchors included) → identical `derived_id` across processes. [SC-001, REQ-001]
- [ ] T009 [P] Unit test: a `rule_version` change → a distinct `derived_id`; an anchor change → a distinct `derived_id`. [SC-003, REQ-002/005]
- [ ] T010 Migration test on a real DB copy: additive column + index, anchor-safe backfill, zero legacy-UNIQUE rejections, restore preserves the id, manual edges untouched. [SC-002, REQ-006]
- [ ] T011 Run Memory MCP `npm run typecheck` + `npm run build`; run the focused causal/derived-id Vitest suite; classify any broad-suite failures against the baseline. [SC-004]
- [ ] T012 Run `validate.sh --strict` on this packet and fix structure issues. [SC-004]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] `derived_id` is content-addressed, anchor-inclusive, and cross-process reproducible.
- [ ] The migration is additive, bumps `SCHEMA_VERSION` once, and backfills with zero legacy-UNIQUE rejections.
- [ ] Derived-edge writes persist `derived_id`; the manual-edge path is byte-identical.
- [ ] Typecheck, build, focused suite, and strict validation pass; evidence recorded in `implementation-summary.md` at completion.
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
