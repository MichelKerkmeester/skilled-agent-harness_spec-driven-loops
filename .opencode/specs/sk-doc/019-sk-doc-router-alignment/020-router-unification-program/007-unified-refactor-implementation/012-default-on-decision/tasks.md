---
title: "Tasks: Compiled Routing Default-On Safe Cutover"
description: "Planned task breakdown mapping the default-on ruling and P0-to-P4 migration to REQ-001 through REQ-007."
trigger_phrases:
  - "compiled routing default-on tasks"
  - "P0 P4 migration task list"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/012-default-on-decision"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Prepared the Planned requirement-mapped task breakdown"
    next_safe_action: "Record operator ratification before starting P0 tasks"
    blockers:
      - "Operator ratification is pending"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which environment profile hosts the canary?"
    answered_questions: []
---
# Tasks: Compiled Routing Default-On Safe Cutover

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
| M0 Ruling | T001-T003 | REQ-001, REQ-006 |
| M1 P0 safety surface | T004-T007 | REQ-003, REQ-004, REQ-005 |
| M2 P1-P2 enforcement | T008-T010 | REQ-003, REQ-005 |
| M3 P3 eligibility | T011-T012 | REQ-002, REQ-005 |
| M4 P4 cutover | T013-T014 | REQ-005 |
| M5 Alignment and verification | T015-T020 | REQ-001 through REQ-007 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-verify every load-bearing receipt named by the ruling and record confirmed versus inferred evidence. (REQ-001; `decision-record.md`)
- [ ] T002 Record the operator's ruling verbatim, preserving Proposed status until that answer exists. (REQ-006; `decision-record.md`) {deps: T001}
- [ ] T003 Capture baseline SHA-256 values for the three frozen scorer files and make digest equality a gate for each migration stage. (REQ-005; benchmark integrity)
- [ ] T004 Inventory every flag read, eligibility consumer, hub directive, activation manifest, and resolver path before modifying runtime behavior. (REQ-001, REQ-002, REQ-005; runtime and configuration)

**Planned evidence**: updated receipt table, operator-ratification entry, scorer digest record, and affected-surface inventory.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Document `SPECKIT_COMPILED_ROUTING` in `ENV-REFERENCE.md`, including default-off behavior, explicit enablement, and `=0` kill-switch semantics. (REQ-005; environment reference) {deps: T002, T004}
- [ ] T006 Add drift-to-legacy versus breakage classification to the verify harness. (REQ-004; verify harness) {deps: T004}
- [ ] T007 Add the per-hub `compiled-serving | legacy-fallback | drifted` serving-status readout and remediate or loudly guard the resolver's spec-tree coupling. (REQ-004, REQ-005; resolver and observability) {deps: T004}
- [ ] T008 [P] Add drift CI that recomputes live routing-input hashes and fails `re-mint required: <hub>` on a stale manifest. (REQ-003; CI) {deps: T006, T007}
- [ ] T009 [P] Select and configure one canary environment profile while leaving the repository default and other profiles off. (REQ-005; environment profiles) {deps: T005, T006}
- [ ] T010 Record canary route parity, fallback, serving-status, and scorer-integrity evidence. (REQ-004, REQ-005; canary report) {deps: T008, T009}
- [ ] T011 Implement the single manifest-freshness eligibility predicate defined by the authoritative decision. (REQ-002; eligibility resolver) {deps: T008, T010}
- [ ] T012 Make both current eligibility consumers derive from the predicate; retain their prior constants only as a temporary rollback path until parity is proven. (REQ-002, REQ-005; advisor and front door) {deps: T011}
- [ ] T013 Stage the global default change one hub at a time, changing the runtime predicates and matching hub directive in lockstep. (REQ-005; runtime defaults and seven hubs) {deps: T012}
- [ ] T014 After each hub, require routing equality, expected serving status, clean fallback behavior, and unchanged scorer hashes before advancing. (REQ-004, REQ-005; staged gate) {deps: T013}
- [ ] T015 Cross-link the create-skill and benchmark alignment packets to this packet's contracts without duplicating them. (REQ-007; sibling packet docs)

**Planned evidence**: environment reference entry, status probe output, drift-CI fixtures, canary matrix, derived-eligibility tests, and seven ordered cutover records.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Verify fresh, missing, stale, malformed, and resolver-error cases against the authoritative fallback and observability contracts. (REQ-002, REQ-004; unit and integration tests) {deps: T006-T012}
- [ ] T017 Verify every edited routing input without a re-mint fails CI with the required hub-specific message. (REQ-003; CI negative tests) {deps: T008}
- [ ] T018 Verify compiled and legacy routing decisions are equal across the route-gold corpus, while metadata-only differences remain non-routing. (REQ-005; Lane C parity) {deps: T010, T014}
- [ ] T019 Exercise `SPECKIT_COMPILED_ROUTING=0` fleet-wide and the retained prior-manifest rollback per hub. (REQ-005; rollback drill) {deps: T014}
- [ ] T020 Re-hash the frozen scorer files, run strict packet validation, and record remaining operator-only decisions without a runtime-success claim. (REQ-001 through REQ-007; final evidence) {deps: T015-T019}

**Planned evidence**: test logs, parity report, rollback receipts, frozen-digest equality, strict validation output, and an honest Planned-state handoff if implementation has not begun.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] REQ-001 through REQ-007 each have direct evidence and an owning task.
- [ ] Operator ratification is recorded before P0 implementation begins.
- [ ] P0 through P4 advance only through their named gates and rollback checks.
- [ ] The three frozen scorer files remain byte-identical to their baseline hashes.
- [ ] Compiled routing remains decision-identical to legacy across the gated corpus.
- [ ] The two sibling alignment packets reference, rather than redefine, the authoritative contracts.
- [ ] Strict packet validation reports zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Authoritative specification**: `spec.md`
- **Authoritative decisions and contracts**: `decision-record.md`
- **Build sequence**: `plan.md`
- **Verification gate**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Onboarding consumer**: `../013-create-skill-alignment/`
- **Benchmark consumer**: `../014-benchmark-alignment/`
<!-- /ANCHOR:cross-refs -->

