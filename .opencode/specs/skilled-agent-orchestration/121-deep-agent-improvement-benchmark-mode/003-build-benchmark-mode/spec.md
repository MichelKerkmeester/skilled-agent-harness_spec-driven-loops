---
title: "Feature Specification: Build the deep-agent-improvement model-benchmark mode"
description: "Phase 3 of 121: implement the model-benchmark mode in deep-agent-improvement from the verified 002 research build-delta — new loop-host.cjs + dispatch-model.cjs, a decoupled scorer port, mode-aware records, and a TST-1 byte-identity backward-compat gate."
trigger_phrases:
  - "build benchmark mode"
  - "deep-agent-improvement model-benchmark build"
  - "loop-host.cjs dispatch-model.cjs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode"
    last_updated_at: "2026-05-28T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored build charter; 002 research verified accurate"
    next_safe_action: "Implement the additive new dispatcher + loop-host files first"
    blockers: []
    key_files:
      - "../002-implementation-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-20260528"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build the deep-agent-improvement model-benchmark mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-implementation-deep-research |
| **Successor** | None |
| **Handoff Criteria** | Mode wired; TST-1 byte-identity gate passes; deep-agent-improvement test suite green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of packet 121 (add a model-benchmark mode to deep-agent-improvement). It executes the build-delta produced by phase 002's MiniMax M2.7 deep research (canonical source: `../002-implementation-deep-research/research/research.md`, §10 Build-delta). Phase 001 holds the architecture ADRs; this phase implements them.

**Scope Boundary**: Implement the mode inside `.opencode/skills/deep-agent-improvement/scripts/` (+ a ported, decoupled scorer). Do NOT change the 120/003 rig (port source) or add new benchmark fixtures beyond what wiring needs.

**Dependencies**:
- 002 research.md (verified build-delta) + 001 ADRs
- 120/003 `eval-rig/` + `eval-loop/scripts/dispatch-minimax.cjs`, `score-variant.cjs`, grader `harness.cjs` (port source)

**Deliverables**:
- `loop-host.cjs` (mode-switching entry point), `dispatch-model.cjs` (generic dispatcher), a decoupled scorer behind the scorer seam, mode-aware records + promotion, and the TST-1 identity test.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
deep-agent-improvement can improve agent definitions but cannot benchmark models/prompts; the 120/003 benchmark rig is packet-local and one-off. The 001 design + 002 research define how to add a `model-benchmark` mode, but the code does not exist yet.

### Purpose
Ship a working `model-benchmark` mode alongside `agent-improvement`, sharing the three seams, with the existing agent-improvement path provably unchanged (byte-for-byte) when mode is unset.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `loop-host.cjs` mode-switching entry point (default = agent-improvement)
- New `dispatch-model.cjs` (generalized from `dispatch-minimax.cjs`; executor-routing map)
- Ported, decoupled scorer behind the scorer seam (+ `buildGraderFn(mode)` factory)
- `mode` field on all state records; mode-aware `promote-candidate.cjs`; `reduce-state.cjs` metadata pass-through
- Backward-compat tests (TST-1 identity gate + TST-2..6) and the EC-1..10 edge cases

### Out of Scope
- Changing the 120/003 rig (port source only) - it stays as the reference
- New benchmark fixtures/profiles beyond wiring needs - separate concern
- Re-deciding architecture (001 ADRs stand) - this is execution

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs` | Create | Mode-switching entry point |
| `.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs` | Create | Generic model dispatcher |
| `.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs` | Modify | Add `mode` field to all records (incl. infra_failure) |
| `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs` | Modify | Add `mode` field to all records |
| `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs` | Modify | Mode-aware status/convergence (extends existing scored/benchmark-complete branches) |
| `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs` | Modify | `mode` metadata pass-through + dashboard display (no structural change) |
| `.opencode/skills/deep-agent-improvement/scripts/tests/**` | Create | TST-1 identity gate + regression tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Backward-compat: agent-improvement path unchanged | TST-1: `loop-host.cjs --mode=agent-improvement` vs no flag → byte-identical state JSONL (`diff` empty); deep-agent-improvement vitest suite stays green |
| REQ-002 | Mode switch works end-to-end | `loop-host.cjs --mode=model-benchmark` materializes fixtures → runs benchmark → writes a `benchmark_run` record → `promote-candidate.cjs --mode=model-benchmark` returns a decision |
| REQ-003 | Generic dispatcher | `dispatch-model.cjs` dispatches via executor-routing map; forwards `--variant` only for model-benchmark; never loaded in agent-improvement mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Scorer decoupled from fixture JSON | Scorer reads primitive criteria arrays (not raw fixture files); det-checks accept explicit `--cwd`; `buildGraderFn(mode)` factory in place |
| REQ-005 | Edge cases handled | EC-1..10 from research §9 covered (unknown-mode default+warn, mode in infra_failure records, per-mode cache key, concurrent state-log safety, materialize-failure propagation) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: TST-1 identity gate passes and is wired as a pre-merge check — the agent-improvement path is provably unaffected.
- **SC-002**: A real `--mode=model-benchmark` run produces a scored `benchmark_run` record and a promotion decision, with every record carrying the correct `mode`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Modifying live deep-agent-improvement scripts regresses agent-improvement | High | TST-1 byte-identity gate + run the existing vitest suite before/after every change |
| Risk | Scorer fixture-coupling decoupling is the hardest part (3 coupling points + det-check scripts) | Med | Land the additive new files first; decouple incrementally with the scorer's own tests |
| Dependency | 120/003 port source (`eval-rig/`, `dispatch-minimax.cjs`, grader) | Med | Verified present; copy/port rather than reference cross-packet at runtime |
| Risk | promote-candidate already branches on benchmark-complete (partial mode-awareness) | Low | Extend the existing branch rather than bolt on `--mode` from scratch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the ported scorer + `eval-rig/` be copied into deep-agent-improvement, or referenced from 120/003? (Lean: copy/port, to avoid cross-packet runtime coupling.)
- Does `promote-candidate.cjs` route by an explicit `--mode` flag or by inspecting the score file's `status`? (Verify before extending — it already checks both `scored` and `benchmark-complete`.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
