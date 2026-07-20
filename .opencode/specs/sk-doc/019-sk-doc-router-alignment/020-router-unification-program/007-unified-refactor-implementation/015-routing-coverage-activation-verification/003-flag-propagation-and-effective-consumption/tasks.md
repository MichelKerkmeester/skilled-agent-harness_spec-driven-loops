---
title: "Tasks: Compiled Routing Flag Propagation & Effective Consumption"
description: "Planned task breakdown mapping the flag-propagation and decision-consumption work to REQ-001 through REQ-008."
trigger_phrases:
  - "compiled routing flag propagation tasks"
  - "compiledRoute threading task list"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the Planned requirement-mapped task breakdown"
    next_safe_action: "Begin T001 once 002 lands green and the operator gives the go-ahead"
    blockers:
      - "002 must land green before Phase 2 tasks are meaningful"
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
      - "Full compiledRoute object or a top-level metadata.compiledRouteSummary?"
    answered_questions: []
---
# Tasks: Compiled Routing Flag Propagation & Effective Consumption

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
| M0 Ready | T001-T004 | REQ-007 (baseline), setup |
| M1 Flag reachable | T005-T006 | REQ-001 |
| M2 Decision consumable | T007-T010 | REQ-002, REQ-003, REQ-004 |
| M3 Kill-safe caches | T011 | REQ-005 |
| M4 Proven | T012-T017 | REQ-001 through REQ-008 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `002-runtime-promotion-and-status-foundation` is green (promoted closure, tri-state flag in both read sites, serving-status fingerprint available). (dependency gate; upstream phase)
- [ ] T002 Re-anchor the six runtime symbols against the live checkout and record confirmed line numbers: both `CHILD_ENV_ALLOWLIST` declarations, `buildNativeBrief`, `subprocess.ts` `AdvisorRecommendation`, the hook render path, and both cache sites. (REQ-001 through REQ-005; runtime inventory) {deps: T001}
- [ ] T003 Capture baseline SHA-256 values for the three frozen scorer files and make digest equality a gate for the implementation. (REQ-007; benchmark integrity)
- [ ] T004 Settle ADR-001 (full object vs `metadata.compiledRouteSummary`), ADR-002 (fingerprint source), and ADR-003 (render form) in `decision-record.md`. (REQ-002, REQ-004, REQ-005; design decisions) {deps: T002}

**Planned evidence**: 002-green confirmation, re-anchored symbol table, scorer digest record, and settled ADR entries.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Add `SPECKIT_COMPILED_ROUTING` to the native launcher `CHILD_ENV_ALLOWLIST` Set. (REQ-001; `mk-skill-advisor-launcher.cjs:99`) {deps: T001, T002}
- [ ] T006 [P] Add `SPECKIT_COMPILED_ROUTING` to the bridge `CHILD_ENV_ALLOWLIST` Set. (REQ-001; `mk-skill-advisor-bridge.mjs:58`) {deps: T001, T002}
- [ ] T007 Pass `compiledRoute` (or `metadata.compiledRouteSummary`) through the bridge `buildNativeBrief` rebuild as an additive field. (REQ-002; `mk-skill-advisor-bridge.mjs:539-551`) {deps: T004}
- [ ] T008 Add the optional `compiledRoute`/summary field to the CLI `subprocess.ts` `AdvisorRecommendation` interface and preserve it through the CLI brief path (second drop site). (REQ-003; `subprocess.ts`) {deps: T004}
- [ ] T009 Render the compiled 4-action outcome (route/clarify/defer/reject) in the hook render before system-context injection; keep the brief byte-identical to legacy when no decision is served. (REQ-004; `.opencode/plugins/mk-skill-advisor.js`) {deps: T007, T008}
- [ ] T010 Verify the native brief, CLI brief, and hook render all carry the decision so no third drop site remains. (REQ-002, REQ-003, REQ-004; brief surfaces) {deps: T007, T008, T009}
- [ ] T011 Fold a serving-state / manifest fingerprint into `cacheKeyForPrompt` and the `engineCache` invalidation input, coordinated with 002's promoted closure and reading no spec-tree path. (REQ-005; `mk-skill-advisor.js:271`, `compiled-route.cjs:33`) {deps: T009}

**Planned evidence**: two allowlist diffs, three brief-surface diffs, a cache-key diff, and a coordinated no-spec-read note.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Child-env probe: the flag is present in the daemon child on the native launcher AND the no-dist fallback path for unset/`0`/`1`. (REQ-001; integration) {deps: T005, T006}
- [ ] T013 Bridge+plugin e2e with a real compiled decision: `compiledRoute` survives to the injected brief on both spawn paths. (REQ-002, REQ-003, REQ-004; e2e) {deps: T010}
- [ ] T014 `=0` propagation kill test: the flag propagates as `0`, consumption is disabled end-to-end, and the brief is byte-identical to legacy. (REQ-006, REQ-008; kill test) {deps: T012, T013}
- [ ] T015 Cache invalidation: a manifest flip or `=0` produces a cache miss and a fresh brief in both caches. (REQ-005; cache fixture) {deps: T011}
- [ ] T016 Route-gold parity: legacy replay byte-identical before/after; only additive metadata differs; frozen digests match baseline; assert no touched path reads under `.opencode/specs`. (REQ-007; Lane C parity + boundary) {deps: T010, T011}
- [ ] T017 Prove the named rollback: remove the allowlist entries and brief/interface/render threading and confirm behavior returns to today's no-op; run strict packet validation. (REQ-008; rollback drill + validation) {deps: T012-T016}

**Planned evidence**: env-probe logs, e2e brief captures (both paths), `=0` kill log, cache-miss fixture, parity report, frozen-digest equality, no-spec-read assertion, and strict validation output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] REQ-001 through REQ-008 each have direct evidence and an owning task.
- [ ] 002 is green and the operator go-ahead is recorded before Phase 2 begins.
- [ ] The flag reaches the daemon child on both spawn paths; the compiled decision survives to the injected brief through all three surfaces.
- [ ] A manifest flip or `=0` invalidates a stale compiled brief; `=0` disables consumption end-to-end.
- [ ] The three frozen scorer files remain byte-identical to their baseline hashes.
- [ ] Compiled routing remains decision-identical to legacy across the gated corpus; no touched path reads under `.opencode/specs`.
- [ ] Strict packet validation reports zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Authoritative specification**: `spec.md`
- **Design decisions**: `decision-record.md`
- **Build sequence**: `plan.md`
- **Verification gate**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Upstream dependency**: `../002-runtime-promotion-and-status-foundation/`
- **Upstream evidence**: `../001-research/synthesis-v1.md` (CF-ACT-1, CF-ACT-2), `../001-research/verification-v1.md`
<!-- /ANCHOR:cross-refs -->
