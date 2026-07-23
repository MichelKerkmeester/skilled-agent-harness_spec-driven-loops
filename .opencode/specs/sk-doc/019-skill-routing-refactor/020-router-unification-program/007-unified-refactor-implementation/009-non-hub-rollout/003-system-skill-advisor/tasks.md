---
title: "Tasks: system-skill-advisor Non-Hub Rollout"
description: "Completed implementation and verification tasks for the standalone advisor compiled-policy rollout."
trigger_phrases:
  - "system skill advisor rollout tasks"
  - "advisor compiled policy tasks"
  - "advisor parity rollback tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/003-system-skill-advisor"
    last_updated_at: "2026-07-19T10:55:36Z"
    last_updated_by: "codex"
    recent_action: "Conformed the rollout task ledger to the Level-2 contract"
    next_safe_action: "Regenerate canonical metadata and run strict validation"
    blockers: []
    key_files:
      - "harness/run-phase.cjs"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-skill-advisor-rollout-20260719"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: system-skill-advisor Non-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the complete base compiler, evaluator, projections, parity, activation, harness, artifacts, and packet documentation. [Evidence: `harness/support.cjs` imports the existing compiler, schema, parity, and activation modules.]
  - **Evidence**: The target adapter imports the existing compiler, schema, parity, and fenced-manifest modules rather than copying them.
- [x] T002 Read the authored advisor router, routed reference and feature leaves, manifest, aliases, and design authority. [Evidence: `harness/run-phase.cjs` closes all 20 routed leaves against manifest, aliases, and disk.]
  - **Evidence**: The harness closes 20 intent keys against 20 resource-map keys, the manifest, aliases, and disk.
- [x] T003 Capture the three protected scorer hashes before implementation. [Evidence: `harness/run-phase.cjs` prints the three protected SHA-256 receipts.]
  - **Evidence**: The final harness receipt reports the replay, scorer, and loader hashes matching their protected baseline values.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create a target-local source adapter that uses the frozen real-router parser (`harness/support.cjs`).
  - **Evidence**: The adapter calls the protected parser and validates the authored dictionaries before building compiler input.
- [x] T005 Validate one standalone mode, 20 intent/resource-map entries, 20 exact typed leaves, two fallback-only defaults, and the authored replacement exclusion. [Evidence: `harness/run-phase.cjs` reports one candidate, 20 intents, 20 leaves, defer, and forbidden reject.]
  - **Evidence**: The harness reports one candidate, 20 intents, 20 leaves, zero-signal defer, and forbidden reject.
- [x] T006 Import the frozen compiler, schema, projection, parity, and fenced-manifest modules without modifying them. [Evidence: `harness/support.cjs` and the target adapters resolve the frozen modules.]
  - **Evidence**: The child contains adapters and target-local orchestration; protected and shared hashes remain unchanged.
- [x] T007 Add deterministic generation for nine compiled artifacts and four activation JSON files.
  - **Evidence**: Two full artifact builds byte-match all nine compiled artifacts, and the activation directory contains prior, current, candidate, and fence-state JSON.
- [x] T008 Add five typed fixture families: exact route, zero-signal defer, one-turn clarify, forbidden reject, and singular zero-rank route. [Evidence: `compiled/system-skill-advisor/route-gold.typed.json` contains the five projected rows.]
  - **Evidence**: The harness validates five decisions and projects five rows through the real scorer.
- [x] T009 Add Level-2 packet documentation and metadata.
  - **Evidence**: The child contains all five required authored documents plus `description.json` and `graph-metadata.json`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove three compile runs, two process runs, and two artifact runs are byte-identical.
  - **Evidence**: The harness reports `compile_runs=3 process_runs=2 artifact_runs=2` and body SHA-256 `a2a7ac1899a2a6553cb207e9a531604a890bad58aba9e636693560a6f93ce15e`.
- [x] T011 Validate every emitted policy, projection, and decision against the frozen schemas and hashes.
  - **Evidence**: The harness reports seven projections on effective policy `3b2dfe70b132e6c0b8a7c1fdc3d7c13c2991b4266da6a0f8c258b7841c039e0d`.
- [x] T012 Pass five typed projection rows through the real scorer and reject an extra-resource falsifier.
  - **Evidence**: The protected subprocess reports `rows=5 falsifier_rejected=true subprocess=true`.
- [x] T013 Pass all 20 authored positive routes through shadow parity with zero mismatches and effects.
  - **Evidence**: The harness reports `routes=20 matches=20 mismatches=0 effects=0 legacy_authoritative=true`.
- [x] T014 Prove the closed algebra and N=1 shape. [Evidence: `harness/run-phase.cjs` reports defer, clarify-once, reject, zero rank calls, and empty composition collections.]
  - **Evidence**: The harness reports zero-signal defer, one clarification, forbidden reject, withheld authority, one candidate, empty composition collections, null overlay, static provenance, and zero rank calls.
- [x] T015 Prove fenced activation, stale-epoch rejection, pin isolation, and byte-exact rollback.
  - **Evidence**: The harness reports active generation 1, fence 2, stale rejection, and identical pre/restored SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`.
- [x] T016 Rehash all protected scorer files and run `node --check` on every CommonJS file.
  - **Evidence**: All three protected hashes match; five CommonJS files parse and comment hygiene passes.
- [x] T017 Run the target-local validator read-only.
  - **Evidence**: `node harness/run-phase.cjs` exits zero and ends with `SUMMARY result=GREEN authority=legacy shadow_only=true read_only=true`.
- [ ] T018 Regenerate canonical metadata and run strict packet validation.
  - **Evidence pending**: Complete after the canonical generator and final `validate.sh --strict` receipt.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All executable rollout gates pass with legacy authority and zero effects.
  - **Evidence**: The target-local harness exits zero and prints the real-green summary.
- [x] Protected scorer files retain their captured SHA-256 values.
  - **Evidence**: The harness reports each protected file as PASS with its expected digest.
- [x] No blocked implementation task remains.
  - **Evidence**: T001 through T017 are complete and no task carries `[B]`.
- [ ] Strict packet validation passes and canonical metadata is current.
  - **Evidence pending**: Complete after T018.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification Checklist**: See `checklist.md`.
- **Evidence Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
