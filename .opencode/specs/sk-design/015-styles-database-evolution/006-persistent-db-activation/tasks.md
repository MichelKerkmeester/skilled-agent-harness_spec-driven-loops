---
title: "Tasks: activate the persistent styles database (build, shadow, prove, flip)"
description: "Freeze-first, then build and publish the first full-corpus generation, wire authoritative reconciliation, assemble a human-labeled request corpus, prove shadow parity plus the §9 perf gate, and flip the default behind a legacy kill switch only after all eight reactivation gates pass."
trigger_phrases:
  - "persistent styles db activation tasks"
  - "generation build shadow parity flip tasks"
  - "install-time prewarm kill switch tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/006-persistent-db-activation"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for the persistent DB activation build."
    next_safe_action: "Execute T001 facade freeze before any generation build."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs"
      - ".opencode/skills/sk-design/styles/_db/oracle/differential-oracle.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-dbbuild-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: activate the persistent styles database (build, shadow, prove, flip)

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence. IDs `T001+`. `[P]` marks parallelizable work. The executable contract is the differential oracle + the DB test aggregator (incl. the 69/69 Phase-0 set) + the measured perf trace green, with the default kept `legacy` until all eight gates pass. Comment hygiene: no spec/packet/phase/REQ ids in build scripts, adapters, or test comments.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 (REQ-002) Freeze the facade: pin `runQuery`/`runHydrate` + the flat files as the storage-neutral content authority; confirm all four corpus modules call the facade and none imports the DB.
- [ ] T002 (REQ-001) Confirm the install-time / prewarm distribution decision is recorded — no committed binary, DB only under the git-ignored `database/`, clean checkout defaults `legacy` until an owned bootstrap prewarms, no lazy query-time build path; confirm the `001-foundation` plane is present (69/69, Errors:0) and `005-library-restructure` has landed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 (REQ-003) Build + publish the first full-corpus generation of all 1,290 styles into the git-ignored `database/`, capturing size/build-time/RSS + publication status + rollback evidence through the manifest/telemetry plane; advance the pointer only on a complete, verified generation.
- [ ] T004 [P] (REQ-007) Wire corpus extraction to an authoritative rebuild/reconciliation workflow — watchers trigger only; reconciliation owns correctness and corrects any missed or incorrect event.
- [ ] T005 [P] (REQ-008) Assemble a representative request corpus across all four design modes + author human relevance judgments; do not treat the Phase-0 seed as human gold.
- [ ] T006 (REQ-001/REQ-006) Build out the install-time prewarm bootstrap + the legacy kill switch on `SK_DESIGN_STYLE_DB_MODE` (default `legacy`); wire `legacy`/`shadow`/`persistent` resolution in `persistent-adapter.mjs`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 (REQ-004/REQ-008) Run SHADOW mode; prove 100% facade DTO/refusal/generation parity via a green differential oracle + relevance acceptance (no material regression vs the human labels); run the DB test aggregator (incl. the 69/69 Phase-0 set) green.
- [ ] T008 (REQ-005) Measure the §9 perf gate on a real representative trace — persistent ≥30% and ≥25 ms absolute p95 improvement over legacy, or an approved-SLO breach; confirm both proposed thresholds on real shadow data.
- [ ] T009 (REQ-009) Exercise clean-checkout / stale-corpus / interrupted-build / pointer-mismatch / missing-artifact / repair / rollback scenarios; each passes.
- [ ] T010 (REQ-006/REQ-010) Flip the default to `persistent` only after all eight gates pass, behind the retained kill switch + a bounded observation window; monitor latency, publication failures, pointer/generation mismatch, vector-queue health, and fallback use; run `validate.sh --strict` = 0 errors. On any gate failure, revert via the kill switch + manifest-pointer rollback.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks `[x]` with evidence; the facade frozen; the first full-corpus generation published into the git-ignored `database/` with captured telemetry + rollback evidence; the differential oracle green in shadow (100% facade parity); the §9 perf gate confirmed on a real representative trace; all seven scenarios exercised; the default kept `legacy` until all eight gates pass; the flip behind a kill switch + observation window + monitoring; `validate.sh --strict` = 0 errors and the DB aggregator (incl. the 69/69 Phase-0 set) green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Build roadmap: `../007-gap-remediation-research/003-db-fate/research/lineages/sol-high-fast/research.md` §10 (wiring plan) — the ordered build steps.
- Cutover gates: same research §9 (reactivation gates) — the eight conjunctive acceptance criteria + the perf materiality bar.
- Decision source: operator WIRE override; parent `../spec.md` PHASE DOCUMENTATION MAP; this phase's `spec.md` FROZEN decision.
- Measurement plane (consumed): `../001-foundation/` — manifest, stage telemetry, differential oracle, fixtures, relevance seed.
- Predecessor: `../005-library-restructure/` — the restructured corpus this generation builds on.
<!-- /ANCHOR:cross-refs -->
