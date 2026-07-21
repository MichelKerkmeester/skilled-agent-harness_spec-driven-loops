---
title: "Checklist: Roadmap Phase 0 — Evidence & Contract"
description: "Verification checklist for Phase 0 (Roadmap Evidence & Contract): 15 items covering manifest atomicity, telemetry residency-honesty (incl. genuine non-zero unattributed), full-matrix oracle byte-parity, and scope lock; 14/15 verified with evidence, only the CHK-014 generated-metadata parent-save refresh remains."
trigger_phrases:
  - "phase 0 foundation verification checklist"
  - "generation manifest telemetry oracle checklist"
  - "styles database phase 0 checklist evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/001-foundation"
    last_updated_at: "2026-07-20T18:45:00Z"
    last_updated_by: "verify-stage"
    recent_action: "Verified two P1 fixes: 69/69 tests pass; full-matrix oracle; 14/15 items evidenced"
    next_safe_action: "Parent save: generate-context.js to refresh graph metadata and close CHK-014"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/generation-manifest.mjs"
      - ".opencode/skills/sk-design/styles/_db/stage-telemetry.mjs"
      - ".opencode/skills/sk-design/styles/_db/oracle/differential-oracle.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 93
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Roadmap Phase 0 — Evidence & Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-006 present with acceptance criteria [EVIDENCE: spec.md:119 REQ-001..006 requirement tables each carry an Acceptance Criteria column]
- [x] CHK-002 [P0] Technical approach defined in plan.md — Phase A-D sequencing with entry/exit gates documented [EVIDENCE: plan.md:108 Phase A-D sequencing with Entry Gate and Exit Gate at plan.md:126]
- [x] CHK-003 [P0] Phase 0 hard-blocker status stated in spec.md metadata and plan.md exit gate — Phases 1-3 cannot begin until REQ-001..005 are versioned [EVIDENCE: spec.md:44 Phase 1 of 4 HARD BLOCKER; plan.md:130 states Phase 0 BLOCKS Phases 1-3]

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Generation manifest design specifies atomic publish + rollback (no torn/partial generation observable) [EVIDENCE: generation-manifest.mjs:249 writeManifestPointer does temp-write fsync rename dir-fsync; manifest.test.mjs 9/9 pass incl interrupted-publish leaves prior manifest readable and atomic pointer-flip leaves no temp file]
- [x] CHK-005 [P1] Stage telemetry design is residency-honest (native FTS5/SQLite vs JS-resident compute attributed separately) and the summary reports a genuine non-zero unattributed bucket for work outside every span [EVIDENCE: stage-telemetry.mjs:26 assertResidency rejects any non native/js-resident bucket; stage-telemetry.mjs:104 summary() measures elapsed via an explicit overall timer (or first→last span window) and reports unattributedMs = max(0, elapsed − attributed); telemetry.test.mjs 9/9 pass incl overall-timer unattributed=120, inter-span-gap unattributed=30, query lane native SQL vs js-resident split (fingerprint/verify/facets.assemble = js-resident; begin/commit/generation.read/eligibility.load = native), vector lane native fetch vs js-resident cosine, indexer stage residency map, and telemetry-off/on leaving the retrieval DTO byte-identical to the oracle golden (side-channel); confirmed live: a real query recorded 17 stages with unattributedMs 0.77 of 1.49 elapsed reconciling to native+js+unattributed]

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] Pinned differential oracle (JS/ESM golden bytes) reproduces current retrieval/index output byte-for-byte over the full query matrix (incl. vector + cursor lanes), and a deliberate ordering/tie-break/field perturbation fails the oracle [EVIDENCE: differential-oracle.mjs:138 replayOracle byte-compares against committed golden; differential-oracle.mjs:74 snapshotScenario replays the paged scenario's cursor follow-up into the golden bytes; oracle.test.mjs 8/8 pass incl replay-reproduces-committed-golden, byte-perturbation-fails, ordering/tie-break negative tests, full-matrix replay with drained vectors at every replay scale, and scaled vector+hybrid lanes genuinely exercised]
- [x] CHK-007 [P1] Replay fixture design covers 1x/10x/100x deterministic scales with honest diversity, and the scaled oracle pins the full lane matrix [EVIDENCE: replay-fixtures.mjs:24 REPLAY_SCALES 1x=13/10x=130/100x=1300 with distinct per-scale corpus hashes in golden/scales.json; fixtures.test.mjs 5/5 pass regenerate-and-hash determinism, per-scale corpus+oracle reproduction, and the scaled full matrix pins every lane (vector-only, hybrid, paged, exact-reuse) not a reduced probe set; fixtures are genuinely varied documents (unique id/slug/title per style from per-class vocabulary pools) rather than duplicated templates — measured at 100x: 1300 unique titles/slugs/ids over a bounded, cycling semantic vocabulary (12 distinct texts/vectors) that still yields a real cosine spread, confirmed by oracle.test.mjs scaled vector/hybrid lanes returning ranked cards with rankingMode=hybrid]
- [x] CHK-008 [P1] Labeled relevance judgment set is scoped and versioned [EVIDENCE: relevance-judgments.seed.json:2 seedVersion 1 humanLabelingRequired true, 8 rows authored-similar+silver-heuristic; judgments.test.mjs 7/7 pass]

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-009 [P2] Fix-completeness inventory — every REQ-001..005 deliverable and its test landed under `_db/`; no half-built artifact remains [EVIDENCE: every spec.md:89 Files-to-Change artifact exists on disk (canonical.mjs, generation-manifest.mjs, stage-telemetry.mjs, oracle/*, seed.json, 5 test suites); full suite tests 63 passed 0 failed]

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P0] No Rust ships in Phase 0 (REQ-006 scope boundary honored) [EVIDENCE: recursive scan of styles/_db finds 0/0 .rs and Cargo.toml files; oracle ships pinned .json golden bytes with no TypeScript toolchain]
- [x] CHK-011 [P1] Any future Rust work is scoped to follow sk-code/018 (`#![forbid(unsafe_code)]`) [EVIDENCE: spec.md:175 NFR-S01 requires any future Rust outside this phase to follow sk-code/018 forbid unsafe_code]

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-012 [P0] All 5 Level 2 docs present (spec/plan/tasks/checklist/implementation-summary) [EVIDENCE: spec.md plan.md tasks.md checklist.md implementation-summary.md all present; validate.sh FILE_EXISTS gate passes for Level 2]
- [x] CHK-013 [P1] Every REQ-NNN is represented across plan.md, tasks.md, and checklist.md [EVIDENCE: tasks.md:56 T001-T016 tag REQ-001..006; plan.md:108 Phase A-D and checklist CHK-001..015 each map to a REQ]
- [ ] CHK-014 [P0] Metadata/validation — `validate.sh --strict` passes and description.json / graph-metadata.json are refreshed after the build — OPEN: all 40 content/code/test gates pass, but `validate.sh --strict` reports Errors:1 — GENERATED_METADATA_INTEGRITY (SOURCE_FINGERPRINT_MISMATCH) — because marking this checklist and updating implementation-summary.md staled the stored generated fingerprint; a parent-save `generate-context.js` refresh recomputes it and closes this item (not run in this no-commit worktree-only verify stage)

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-015 [P0] Scope lock honored — writes limited to `.opencode/skills/sk-design/styles/_db/` and this packet's own docs; parent docs, sibling children, and other packets untouched [EVIDENCE: git status porcelain lists only styles/_db/ files and 001-foundation/ docs; out-of-scope path count 0/0]

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 8/9 |
| P1 Items | 5 | 5/5 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-20 — build + two P1 fixes verified (69/69 tests pass; every content/code/test gate green). `validate.sh --strict` reported Errors:0 Warnings:0 (RESULT: PASSED) on the pre-edit tree; capturing this evidence into the docs re-stales the CHK-014 SOURCE_FINGERPRINT_MISMATCH that a parent-save `generate-context.js` refresh clears.

<!-- /ANCHOR:summary -->

---
