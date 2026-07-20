---
title: "Tasks: Runtime Promotion & Status Foundation (P0)"
description: "Planned task breakdown mapping the P0 foundation to REQ-001 through REQ-009: closure promotion, eligibility/engine split, status probe, ENV entry, tri-state flag, breadcrumbs, and the durable no-spec-import rule."
trigger_phrases:
  - "runtime promotion status foundation tasks"
  - "compiled routing P0 task list"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the Planned requirement-mapped task breakdown"
    next_safe_action: "Begin Phase 1 tasks on operator go-ahead"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which stable runtime directory hosts the promoted closure?"
    answered_questions: []
---
# Tasks: Runtime Promotion & Status Foundation (P0)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Verified after implementation evidence exists |
| `[P]` | Parallelizable after dependencies are green |
| `[B]` | Blocked by an explicit dependency |

**Task Format**: `T### [P?] Description (requirement; target surface) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Requirement Coverage |
|-----------|-------|----------------------|
| M0 Ready to build | T001-T004 | REQ-001, REQ-008 |
| M1 Runtime stabilized | T005-T007 | REQ-001 |
| M2 Separated + observable | T008-T011 | REQ-002, REQ-003, REQ-009 |
| M3 Governed | T012-T015 | REQ-004, REQ-005, REQ-006 |
| M4 Guarded + verified | T016-T021 | REQ-007, REQ-008 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-verify every load-bearing receipt named in `spec.md` against source, recording confirmed versus inferred and re-anchoring on symbols (treat `file:line` as +/-10). (REQ-001; evidence audit)
- [ ] T002 Capture baseline SHA-256 values for `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs`; make digest equality a gate for every later step. (REQ-008; frozen-scorer integrity)
- [ ] T003 Inventory every `SPECKIT_COMPILED_ROUTING` read, every eligibility consumer, every engine-entrypoint call site, the seven activation manifests, and the seven per-hub bundles. (REQ-001, REQ-002; runtime inventory) {deps: T001}
- [ ] T004 Choose the stable runtime directory for the promoted closure and record the decision. (REQ-001; architecture) {deps: T003}

**Planned evidence**: re-anchored receipt table, scorer digest record, runtime inventory, runtime-directory decision.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Promote the closure (resolver + engine loader + seven manifests + seven bundles) to the stable runtime path; point the shim's require at it; keep the spec-tree copy as the authored source with a build/copy step. (REQ-001; `.opencode/bin/compiled-route.cjs`, runtime dir) {deps: T004}
- [ ] T006 Make promotion binding: delete the residual-coupling branch and correct `../../012-default-on-decision/implementation-summary.md:170` to match the Accepted ADR-003. (REQ-001; parent implementation-summary) {deps: T005}
- [ ] T007 Add a spec-tree-move simulation asserting no runtime path reads under `.opencode/specs`. (REQ-001; simulation test) {deps: T005}
- [ ] T008 [P] Split manifest-derived eligibility from `HUB_CHILD`; standardize one stable per-hub engine entrypoint; keep the map decoupled from eligibility. (REQ-002; `011-runtime-engine/lib/compiled-route.cjs`) {deps: T005}
- [ ] T009 [P] Add the cross-check test asserting `sort(COMPILED_ROUTING_HUBS)===sort(keys(HUB_CHILD))`, failing with the diverging hub named. (REQ-002; cross-check test) {deps: T008}
- [ ] T010 [P] Ship `.opencode/bin/compiled-route-status.cjs --hub | --all` emitting `{hubId, servingAuthority, shadowOnly, selectedPolicy.generation, effectivePolicyHash, fenceEpoch, manifestFingerprint, causeCode}`. (REQ-003; new status CLI) {deps: T005}
- [ ] T011 Wire the readout into `spec_kit_skill_advisor_status` (both copies) and `session_bootstrap`, prompt-safe, size-capped, no blocking spawn. (REQ-003, REQ-009; advisor-status + session-bootstrap) {deps: T010}
- [ ] T012 Add the `SPECKIT_COMPILED_ROUTING` entry to `ENV-REFERENCE.md` (default-off, tri-state, `=0` kill-switch, eligibility gating). (REQ-006; environment reference) {deps: T003}
- [ ] T013 Tri-state the flag in `resolve.cjs` (near `:22-23`) with an empty per-hub default-on cohort; unset resolves to legacy for all hubs. (REQ-004; resolver flag site) {deps: T005}
- [ ] T014 Tri-state the flag in `advisor-recommend.ts` (near `:362`) with identical semantics; keep the additive attach byte-identical. (REQ-004; advisor flag site) {deps: T013}
- [ ] T015 Add stderr breadcrumbs to the three catches (`bin/compiled-route.cjs` near `:36-38`, `resolve.cjs` near `:45-47`, `advisor-recommend.ts` near `:352`) without changing the fallback outcome; stop discarding the child stderr the advisor breadcrumb needs. (REQ-005; three catches) {deps: T005, T014}
- [ ] T016 Add the durable no-spec-import lint/CI rule scanning runtime dirs for `require`/import under `.opencode/specs`, exiting non-zero with the offending file named. (REQ-007; new lint/CI check) {deps: T005}
- [ ] T017 Add positive (seeded spec-import) and negative (clean runtime) fixtures for the durable rule and wire the check into CI. (REQ-007; fixtures + CI) {deps: T016}

**Planned evidence**: promoted closure + move simulation, cross-check test, status CLI + wired surfaces, ENV entry, tri-state truth-table, breadcrumbs, durable rule + fixtures.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify the flag truth-table (unset/`0`/`1`/`false`/`off`/invalid) and the empty-cohort unset-to-legacy behavior. (REQ-004; flag unit tests) {deps: T013, T014}
- [ ] T019 Verify the status `causeCode` matrix over fresh/stale/missing-manifest/broken-resolver fixtures separates drift from breakage. (REQ-003; status tests) {deps: T011}
- [ ] T020 Verify compiled and legacy routing decisions are byte-identical across the route-gold corpus, with the frozen scorer consumed read-only and its digests unchanged. (REQ-008; Lane C parity) {deps: T005, T014}
- [ ] T021 Run `validate.sh --strict` on this folder to Errors 0, confirm the durable rule fails a seeded spec-import, and record an honest Planned-state handoff. (REQ-007, REQ-008; final evidence) {deps: T005-T020}

**Planned evidence**: truth-table log, `causeCode` matrix, parity report, frozen-digest equality, durable-rule fixture result, strict validation output, Planned-state handoff.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] REQ-001 through REQ-009 each have direct evidence and an owning task.
- [ ] The operator go-ahead to begin is recorded before Phase 2 starts.
- [ ] No runtime path reads under `.opencode/specs` (move simulation green).
- [ ] The three frozen scorer files remain byte-identical to their baseline hashes.
- [ ] Compiled routing remains decision-identical to legacy across the gated corpus; no hub is lit.
- [ ] The durable no-spec-import rule is wired into CI with passing fixtures.
- [ ] Strict packet validation reports zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Authoritative specification**: `spec.md`
- **Local decisions and contracts**: `decision-record.md`
- **Build sequence**: `plan.md`
- **Verification gate**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md`, `../001-research/verification-v1.md`, `../001-research/review-v1.md`
- **Parent decisions**: `../../012-default-on-decision/decision-record.md`
- **Downstream consumers**: `../003-flag-propagation-and-effective-consumption/`, `../004-benchmark-compiled-lane-c/`, `../011-activation-cutover-p4/`
<!-- /ANCHOR:cross-refs -->
