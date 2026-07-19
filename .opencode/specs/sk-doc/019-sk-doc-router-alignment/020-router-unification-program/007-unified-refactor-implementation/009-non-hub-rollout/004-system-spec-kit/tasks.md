---
title: "Tasks: system-spec-kit Non-Hub Router Rollout"
description: "Completed execution list for deterministic compilation, projection, real scorer parity, closed algebra, and fenced rollback."
trigger_phrases:
  - "system spec kit rollout tasks"
  - "system spec kit compiled router checklist"
  - "non hub scorer parity tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/004-system-spec-kit"
    last_updated_at: "2026-07-19T10:39:28Z"
    last_updated_by: "codex"
    recent_action: "Completed every rollout implementation and verification task"
    next_safe_action: "Preserve the shadow-only boundary"
    blockers: []
    key_files:
      - "harness/run-rollout.cjs"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-spec-kit-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: system-spec-kit Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read the complete frozen compiler template, target router, leaf inventory, scorer interfaces, and design authority.
  - Evidence: `001-compiler-n1-shadow`, the target `SKILL.md`, 48/48 leaf files, and the frozen scorer entrypoints were read before writes.
- [x] T002 Capture initial SHA-256 for the three protected scorer files.
  - Evidence: 3/3 initial digests are recorded in `implementation-summary.md` and asserted by `harness/run-rollout.cjs`.
- [x] T003 Confirm the exact child is absent and the requested phase parent already has its lean trio.
  - Evidence: Pre-write `find` inspection found 0 child files and all 3 required parent metadata files.
- [x] T004 Scaffold the Level-2 documentation from manifest templates.
  - Evidence: `validate.sh --strict --verbose` recognizes all 5 canonical documents as Level 2 template outputs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Import the frozen compiler, canonical contract, schema validator, activation fence, and parity runner.
  - Evidence: `harness/support.cjs`, `activation/fenced-manifest.cjs`, and `parity/shadow-parity.cjs` resolve the frozen modules.
- [x] T006 Adapt the real scorer's multiline router parse into the frozen normalized source builder while retaining actual source hashes.
  - Evidence: `harness/support.cjs` parses 17 intent maps and preserves SHA-256 provenance for 3 authored sources.
- [x] T007 Preserve the explicit default as `bounded-default` and as an always-loaded resource on positive routes.
  - Evidence: `compiled/system-spec-kit/fixtures/authored-default.json` and exact-route fixtures include the authored quick-reference semantics.
- [x] T008 Compile one local standalone destination with 17 selectors, 48 leaves, and empty composition, authority, handoff, and overlay collections.
  - Evidence: `compiled/system-spec-kit/policy.json` validates with 1 destination, 17 selectors, and 48 resources.
- [x] T009 Generate policy, advisor projection, typed route gold, policy card, five fixtures, and activation manifests.
  - Evidence: `node harness/run-rollout.cjs --write` reports 13 deterministic generated artifacts.
- [x] T010 Add a target-local protected scorer subprocess and a read-only validation driver.
  - Evidence: `harness/protected-replay.cjs` and `harness/run-rollout.cjs` pass 5/5 scorer rows without source writes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Prove two complete builds, three policy compiles, and two isolated fingerprints are byte-identical.
  - Evidence: `node harness/run-rollout.cjs` reports `byte_identical=true` across 2 builds, 3 compiles, and 2 fingerprints.
- [x] T012 Validate policy, advisor, route decisions, typed gold, and policy-card frontmatter against frozen schemas and hashes.
  - Evidence: `node harness/run-rollout.cjs` validates all 5 route decisions and all 5 typed-gold rows.
- [x] T013 Verify closed-algebra default, clarification, rejection, zero-rank, target-free non-route, and zero-effect invariants.
  - Evidence: `node harness/run-rollout.cjs` reports `default=bounded-default`, `ambiguous=clarify-once`, and `rank_calls=0`.
- [x] T014 Pass five explicit rows through the real scorer and reject two falsifiers.
  - Evidence: The protected replay reports 5/5 expected rows and 2/2 rejected falsifiers.
- [x] T015 Match three real legacy-router rows at zero mismatches and effects with legacy authority intact.
  - Evidence: Shadow parity reports 3/3 matches, 0 mismatches, and 0 effects.
- [x] T016 Activate generation 1 in the fenced state machine and restore byte-exact generation-0 manifest bytes at fence 2.
  - Evidence: Rollback reports active generation 1, fence 2, and `byte_exact=true`.
- [x] T017 Run `node --check` for every target-local CommonJS file.
  - Evidence: `node --check` passes for 6/6 child-local CommonJS files.
- [x] T018 Re-hash the three protected scorer files and run strict packet validation.
  - Evidence: 3/3 protected hashes remain exact and `validate.sh --strict --verbose` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 and P1 requirements have concrete evidence.
- [x] No blocked task remains.
- [x] The target-local validator exits 0 with `result=GREEN`.
- [x] Protected scorer hashes are unchanged.
- [x] No commit, push, install, network access, or live activation occurred.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Evidence**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
