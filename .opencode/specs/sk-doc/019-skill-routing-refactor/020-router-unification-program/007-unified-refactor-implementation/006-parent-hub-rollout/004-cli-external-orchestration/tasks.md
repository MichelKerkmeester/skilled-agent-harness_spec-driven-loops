---
title: "Tasks: cli-external-orchestration Per-Hub Rollout"
description: "Completed implementation and verification tasks for the external-executor compiled-router canary."
trigger_phrases:
  - "cli external orchestration rollout tasks"
  - "external executor canary tasks"
  - "cli router implementation tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/004-cli-external-orchestration"
    last_updated_at: "2026-07-19T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed all rollout implementation tasks"
    next_safe_action: "Retain the verified shadow candidate"
    blockers: []
    key_files: ["tasks.md", "harness/validate-canary.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-07-19-cli-external-rollout-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: cli-external-orchestration Per-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` means implemented and backed by the cited harness or artifact. `[P0]` marks completion-critical work. All paths are relative to this child.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the completed archetypes and Level-2 shape. [evidence: `spec.md` records the selected external-executor model]
- [x] T002 [P0] Read the shared canonical, compiler, projector, decision, execution, and activation contracts. [evidence: `harness/validate-canary.cjs` imports the shared implementations]
- [x] T003 [P0] Read and hash the hub router, registry, hub skill, and executor skills. [evidence: `activation/acceptance.json` contains six source hashes]
- [x] T004 [P0] Capture frozen scorer SHA-256 baselines. [evidence: `harness/validate-canary.cjs` pins three protected digests]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Validate authored source alignment and compile three actor destinations. [evidence: `lib/registry-compiler.cjs` and `compiled/policy.json`]
- [x] T006 [P0] Encode four explicit bundle rules in authored order. [evidence: `compiled/policy.json` contains four composition rules]
- [x] T007 [P0] Implement typed single, ordered-bundle, clarify, defer, and reject routing. [evidence: `lib/router.cjs`]
- [x] T008 [P0] Add eight route cases and four advisor cases. [evidence: `fixtures/canary-cases.v1.json`]
- [x] T009 [P0] Generate six compiled and five activation artifacts. [evidence: `node harness/build-artifacts.cjs` reports 6 and 5]
- [x] T010 [P0] Generate and replay the document-only policy card. [evidence: `compiled/PolicyCardV1.md`]
- [x] T011 [P0] Fence actor execution and aggregate activation blockers. [evidence: `lib/execution-fence.cjs` and `lib/activation-gate.cjs`]
- [x] T012 [P0] Implement the real-green validation harness. [evidence: `harness/validate-canary.cjs`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P0] Pass eight projected rows through the real scorer. [evidence: `node harness/validate-canary.cjs` reports realScorerRows 8]
- [x] T014 [P0] Prove closed-algebra negatives and ambiguity handling. [evidence: `node harness/validate-canary.cjs` reports three negative branches]
- [x] T015 [P0] Prove PREPARE→VERIFY→COMMIT and commit-before-ready refusal. [evidence: `node harness/validate-canary.cjs` reports the protocol path]
- [x] T016 [P0] Prove wrong-preimage refusal and byte-exact rollback. [evidence: `node harness/validate-canary.cjs` reports byteExact true]
- [x] T017 [P0] Pass syntax and deterministic artifact checks. [evidence: `node --check` and consecutive build hash comparison]
- [x] T018 [P0] Re-read protected scorer hashes and confirm no change. [evidence: `implementation-summary.md` records all three digests]
- [x] T019 [P0] Complete Level-2 docs and metadata. [evidence: `bash validate.sh 004-cli-external-orchestration --strict`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] [P0] The requested file families are present. [evidence: `rg --files 004-cli-external-orchestration`]
- [x] [P0] The canary exits zero with `status: GREEN`. [evidence: `node harness/validate-canary.cjs`]
- [x] [P0] Legacy remains authoritative and no real external effect occurs. [evidence: validator reports servingAuthority legacy and realCliEffects 0]
- [x] [P0] No delivered diff exists outside this child. [evidence: packet-scoped `git status --short` inspection]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and acceptance: `spec.md`.
- Architecture and test strategy: `plan.md`.
- Evidence matrix: `checklist.md`.
- Final state and limitations: `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
